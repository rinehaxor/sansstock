export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedUser, getAuthenticatedSupabase } from '../../../lib/auth';

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

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: error.code === 'PGRST116' ? 404 : 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// For public, only show published articles
		if (data.status !== 'published') {
			return new Response(JSON.stringify({ error: 'Article not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};

// PUT /api/articles/[id] - Admin only (RLS enforced)
export const PUT: APIRoute = async (context) => {
	// Get authenticated Supabase client (will enforce RLS)
	const authenticatedClient = await getAuthenticatedSupabase(context);
	if (!authenticatedClient) {
		return new Response(JSON.stringify({ error: 'Unauthorized - Please login' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Check if user is admin
	const admin = await isAdmin(context);
	if (!admin) {
		return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const user = await getAuthenticatedUser(context);
	if (!user) {
		return new Response(JSON.stringify({ error: 'User not found' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
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
		const {
			title,
			slug,
			summary,
			content,
			thumbnail_url,
			category_id,
			source_id,
			status,
			tag_ids,
			url_original,
		} = body;

		// Build update object
		const updateData: any = {
			updated_by: user.id,
			updated_at: new Date().toISOString(),
		};

		if (title) updateData.title = title;
		if (slug) updateData.slug = slug;
		if (summary !== undefined) updateData.summary = summary;
		if (content) updateData.content = content;
		if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
		if (category_id) updateData.category_id = category_id;
		if (source_id !== undefined) updateData.source_id = source_id;
		if (status) {
			updateData.status = status;
			if (status === 'published' && !updateData.published_at) {
				updateData.published_at = new Date().toISOString();
			}
		}
		if (url_original !== undefined) updateData.url_original = url_original;

		// Update article using authenticated client (RLS will enforce policies)
		const { data: article, error: articleError } = await authenticatedClient
			.from('articles')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (articleError) {
			return new Response(JSON.stringify({ error: articleError.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Update tags if provided (also using authenticated client)
		if (tag_ids !== undefined && Array.isArray(tag_ids)) {
			// Delete existing tags
			await authenticatedClient.from('article_tags').delete().eq('article_id', id);

			// Insert new tags
			if (tag_ids.length > 0) {
				const articleTags = tag_ids.map((tagId: number) => ({
					article_id: parseInt(id),
					tag_id: tagId,
				}));

				await authenticatedClient.from('article_tags').insert(articleTags);
			}
		}

		return new Response(JSON.stringify({ data: article }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};

// DELETE /api/articles/[id] - Admin only (RLS enforced)
export const DELETE: APIRoute = async (context) => {
	// Get authenticated Supabase client (will enforce RLS)
	const authenticatedClient = await getAuthenticatedSupabase(context);
	if (!authenticatedClient) {
		return new Response(JSON.stringify({ error: 'Unauthorized - Please login' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Check if user is admin
	const admin = await isAdmin(context);
	if (!admin) {
		return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const id = context.params.id;
		if (!id) {
			return new Response(JSON.stringify({ error: 'Article ID is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Delete article_tags first (foreign key constraint) - using authenticated client
		await authenticatedClient.from('article_tags').delete().eq('article_id', id);

		// Delete article using authenticated client (RLS will enforce policies)
		const { error } = await authenticatedClient.from('articles').delete().eq('id', id);

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ message: 'Article deleted successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};


