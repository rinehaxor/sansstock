export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedUser, getAuthenticatedSupabase } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { articleSchema, safeValidateAndSanitize } from '../../../lib/validation';
import { apiRateLimit } from '../../../lib/ratelimit';
import { createErrorResponse, createSuccessResponse, createValidationErrorResponse, ErrorMessages } from '../../../lib/error-handler';
import { sanitizeArticleContent } from '../../../lib/sanitize';

// GET /api/articles/[id] - Public
export const GET: APIRoute = async ({ params }) => {
	try {
		const id = params.id;

		if (!id) {
			return new Response(JSON.stringify({ error: 'Article ID is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const { data, error } = await supabase
			.from('articles')
			.select(`
				*,
				categories:category_id (
					id,
					name,
					slug,
					description
				),
				sources:source_id (
					id,
					name,
					slug
				),
				article_tags (
					tags:tag_id (
						id,
						name,
						slug
					)
				)
			`)
			.eq('id', id)
			.single();

		// Increment view count for published articles (non-blocking)
		if (data && data.status === 'published') {
			// Don't await - fire and forget for better performance
			fetch(`/api/articles/${id}/view`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			}).catch(() => {
				// Silently fail - view tracking is not critical
			});
		}

		if (error) {
			const statusCode = error.code === 'PGRST116' ? 404 : 500;
			return createErrorResponse(error, statusCode, 'GET /api/articles/[id]');
		}

		// For public, only show published articles
		if (data.status !== 'published') {
			return createErrorResponse(ErrorMessages.ARTICLE_NOT_FOUND, 404, 'GET /api/articles/[id]');
		}

		return createSuccessResponse(data);
	} catch (error) {
		return createErrorResponse(error, 500, 'GET /api/articles/[id]');
	}
};

// PUT /api/articles/[id] - Admin only (RLS enforced)
export const PUT: APIRoute = async (context) => {
	// Rate limiting - prevent DDoS
	const rateLimitError = apiRateLimit(context);
	if (rateLimitError) {
		return rateLimitError;
	}

	// CSRF Protection
	const csrfError = csrfProtection(context);
	if (csrfError) {
		return csrfError;
	}

	// Get authenticated Supabase client (will enforce RLS)
	const authenticatedClient = await getAuthenticatedSupabase(context);
	if (!authenticatedClient) {
		return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'PUT /api/articles/[id]');
	}

	// Check if user is admin
	const admin = await isAdmin(context);
	if (!admin) {
		return createErrorResponse(ErrorMessages.FORBIDDEN, 403, 'PUT /api/articles/[id]');
	}

	const user = await getAuthenticatedUser(context);
	if (!user) {
		return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'PUT /api/articles/[id]');
	}

	try {
		const id = context.params.id;
		if (!id) {
			return new Response(JSON.stringify({ error: 'Article ID is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const body = await context.request.json();

		// Validate and sanitize input using Zod schema
		const validationResult = safeValidateAndSanitize(articleSchema, body);

		if (!validationResult.success) {
			return createValidationErrorResponse(
				validationResult.error.errors,
				validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
			);
		}

		const {
			title,
			slug,
			summary,
			meta_title,
			meta_description,
			meta_keywords,
			content,
			thumbnail_url,
			thumbnail_alt,
			category_id,
			source_id,
			status,
			tag_ids,
			url_original,
			featured,
		} = validationResult.data;

		// Sanitize article content to prevent XSS
		const sanitizedContent = content ? sanitizeArticleContent(content) : undefined;

		// Build update object
		const updateData: any = {
			updated_by: user.id,
			updated_at: new Date().toISOString(),
		};

		if (title) updateData.title = title;
		if (slug) updateData.slug = slug;
		if (summary !== undefined) updateData.summary = summary;
		if (meta_title !== undefined) updateData.meta_title = meta_title;
		if (meta_description !== undefined) updateData.meta_description = meta_description;
		if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;
		if (sanitizedContent) updateData.content = sanitizedContent; // Use sanitized content
		if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
		if (thumbnail_alt !== undefined) updateData.thumbnail_alt = thumbnail_alt || null;
		if (category_id) updateData.category_id = category_id;
		if (source_id !== undefined) updateData.source_id = source_id;
		if (status) {
			updateData.status = status;
			if (status === 'published' && !updateData.published_at) {
				updateData.published_at = new Date().toISOString();
			}
		}
		if (url_original !== undefined) updateData.url_original = url_original;
		if (featured !== undefined) updateData.featured = featured;

		// Parse id to integer
		const articleId = parseInt(id);
		if (isNaN(articleId)) {
			return new Response(JSON.stringify({ error: 'Invalid article ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Update article using authenticated client (RLS will enforce policies)
		const { data: article, error: articleError } = await authenticatedClient
			.from('articles')
			.update(updateData)
			.eq('id', articleId)
			.select()
			.single();

		if (articleError) {
			return createErrorResponse(articleError, 500, 'PUT /api/articles/[id] - update');
		}

		// Update tags if provided (also using authenticated client)
		if (tag_ids !== undefined && Array.isArray(tag_ids)) {
			// Delete existing tags
			await authenticatedClient.from('article_tags').delete().eq('article_id', articleId);

			// Insert new tags
			if (tag_ids.length > 0) {
				const articleTags = tag_ids.map((tagId: number) => ({
					article_id: articleId,
					tag_id: parseInt(tagId.toString()),
				}));

				const { error: tagsError } = await authenticatedClient.from('article_tags').insert(articleTags);
				
				if (tagsError) {
					return new Response(JSON.stringify({ error: `Failed to update tags: ${tagsError.message}` }), {
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					});
				}
			}
		}

		// Update media_metadata with thumbnail_alt if thumbnail_url and thumbnail_alt are provided
		if (thumbnail_url && thumbnail_alt) {
			try {
				await authenticatedClient
					.from('media_metadata')
					.update({ alt_text: thumbnail_alt })
					.eq('file_url', thumbnail_url);
			} catch (metadataError) {
				// Non-critical error, just log it
				console.error('Failed to update media metadata:', metadataError);
			}
		}

		return createSuccessResponse(article);
	} catch (error) {
		return createErrorResponse(error, 500, 'PUT /api/articles/[id]');
	}
};

// DELETE /api/articles/[id] - Admin only (RLS enforced)
export const DELETE: APIRoute = async (context) => {
	// Rate limiting - prevent DDoS
	const rateLimitError = apiRateLimit(context);
	if (rateLimitError) {
		return rateLimitError;
	}

	// CSRF Protection
	const csrfError = csrfProtection(context);
	if (csrfError) {
		return csrfError;
	}

	// Get authenticated Supabase client (will enforce RLS)
	const authenticatedClient = await getAuthenticatedSupabase(context);
	if (!authenticatedClient) {
		return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'DELETE /api/articles/[id]');
	}

	// Check if user is admin
	const admin = await isAdmin(context);
	if (!admin) {
		return createErrorResponse(ErrorMessages.FORBIDDEN, 403, 'DELETE /api/articles/[id]');
	}

	try {
		const id = context.params.id;
		if (!id) {
			return new Response(JSON.stringify({ error: 'Article ID is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Parse id to integer
		const articleId = parseInt(id);
		if (isNaN(articleId)) {
			return new Response(JSON.stringify({ error: 'Invalid article ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Delete article_tags first (foreign key constraint) - using authenticated client
		await authenticatedClient.from('article_tags').delete().eq('article_id', articleId);

		// Delete article using authenticated client (RLS will enforce policies)
		const { error } = await authenticatedClient.from('articles').delete().eq('id', articleId);

		if (error) {
			return createErrorResponse(error, 500, 'DELETE /api/articles/[id]');
		}

		return createSuccessResponse({ message: 'Article deleted successfully' });
	} catch (error) {
		return createErrorResponse(error, 500, 'DELETE /api/articles/[id]');
	}
};


