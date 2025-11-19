export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedUser, getAuthenticatedSupabase } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { articleSchema, safeValidateAndSanitize } from '../../../lib/validation';
import { apiRateLimit } from '../../../lib/ratelimit';
import { createErrorResponse, createSuccessResponse, createValidationErrorResponse, ErrorMessages, handleRouteError } from '../../../lib/error-handler';
import { sanitizeArticleContent } from '../../../lib/sanitize';

// GET /api/articles - Public (semua bisa akses)
export const GET: APIRoute = async ({ request, url }) => {
   try {
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const categoryId = searchParams.get('category_id');
      const tagId = searchParams.get('tag_id');
      const status = searchParams.get('status') || 'published'; // Default hanya published untuk public
      const search = searchParams.get('search');

      // If filtering by tag, we need to get article_ids first from article_tags
      let articleIds: number[] | null = null;
      if (tagId) {
         const { data: articleTags } = await supabase
            .from('article_tags')
            .select('article_id')
            .eq('tag_id', parseInt(tagId));
         
         articleIds = articleTags?.map((at: any) => at.article_id) || [];
         
         // If no articles found with this tag, return empty result
         if (articleIds.length === 0) {
            return new Response(
               JSON.stringify({
                  data: [],
                  total: 0,
                  page,
                  limit,
                  totalPages: 0,
               }),
               {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         }
      }

      let query = supabase
         .from('articles')
         .select(
            `
				id,
				title,
				slug,
				summary,
				thumbnail_url,
				status,
				published_at,
				created_at,
				featured,
				views_count,
				categories:category_id (
					id,
					name,
					slug
				),
				sources:source_id (
					id,
					name
				)
			`
         )
         .eq('status', status)
         .order('published_at', { ascending: false })
         .range((page - 1) * limit, page * limit - 1);

      // Filter by category
      if (categoryId) {
         const categoryIdNum = parseInt(categoryId);
         if (isNaN(categoryIdNum)) {
            console.error('GET /api/articles - Invalid category_id:', categoryId);
            return new Response(
               JSON.stringify({
                  data: [],
                  total: 0,
                  page,
                  limit,
                  totalPages: 0,
                  error: 'Invalid category_id',
               }),
               {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         }
         query = query.eq('category_id', categoryIdNum);
      }

      // Filter by tag (using article_ids from article_tags)
      if (tagId && articleIds && articleIds.length > 0) {
         query = query.in('id', articleIds);
      }

      // Search - sanitize input to prevent SQL injection
      if (search) {
         // Sanitize search string - remove special characters that could be used for SQL injection
         const sanitizedSearch = search.replace(/[%_\\]/g, '').trim();
         if (sanitizedSearch.length > 0) {
            // Escape special characters for LIKE query
            const escapedSearch = sanitizedSearch.replace(/[%_\\]/g, '\\$&');
            query = query.or(`title.ilike.%${escapedSearch}%,summary.ilike.%${escapedSearch}%,content.ilike.%${escapedSearch}%`);
         }
      }

      const { data, error, count } = await query;

      if (error) {
         console.error('GET /api/articles - Query error:', error);
         return createErrorResponse(error, 500, 'GET /api/articles');
      }
      
      // Debug logging untuk production
      if (categoryId) {
         console.log(`GET /api/articles - Category ${categoryId}: Found ${data?.length || 0} articles`);
      }

      // Get total count for pagination - build count query with same filters
      let countQuery = supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', status);
      
      if (categoryId) {
         const categoryIdNum = parseInt(categoryId);
         if (!isNaN(categoryIdNum)) {
            countQuery = countQuery.eq('category_id', categoryIdNum);
         }
      }
      
      if (tagId && articleIds && articleIds.length > 0) {
         countQuery = countQuery.in('id', articleIds);
      }
      
      if (search) {
         const sanitizedSearch = search.replace(/[%_\\]/g, '').trim();
         if (sanitizedSearch.length > 0) {
            const escapedSearch = sanitizedSearch.replace(/[%_\\]/g, '\\$&');
            countQuery = countQuery.or(`title.ilike.%${escapedSearch}%,summary.ilike.%${escapedSearch}%,content.ilike.%${escapedSearch}%`);
         }
      }
      
      const { count: totalCount } = await countQuery;

      return new Response(
         JSON.stringify({
            data: data || [],
            total: totalCount || 0,
            page,
            limit,
            totalPages: Math.ceil((totalCount || 0) / limit),
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return createErrorResponse(error, 500, 'GET /api/articles');
   }
};

// POST /api/articles - Admin only (RLS enforced)
export const POST: APIRoute = async (context) => {
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
      return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'POST /api/articles');
   }

   // Check if user is admin
   const admin = await isAdmin(context);
   if (!admin) {
      return createErrorResponse(ErrorMessages.FORBIDDEN, 403, 'POST /api/articles');
   }

   const user = await getAuthenticatedUser(context);
   if (!user) {
      return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'POST /api/articles');
   }

   try {
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
         status = 'draft',
         tag_ids = [],
         url_original,
         featured = false,
      } = validationResult.data;

      // Sanitize article content to prevent XSS
      const sanitizedContent = sanitizeArticleContent(content);

      // Create article using authenticated client (RLS will enforce policies)
      const { data: article, error: articleError } = await authenticatedClient
         .from('articles')
         .insert({
            title,
            slug,
            summary,
            meta_title: meta_title || null,
            meta_description: meta_description || null,
            meta_keywords: meta_keywords || null,
            content: sanitizedContent, // Use sanitized content
            thumbnail_url,
            thumbnail_alt: thumbnail_alt || null,
            category_id,
            source_id,
            status,
            url_original,
            featured,
            created_by: user.id,
            updated_by: user.id,
            published_at: status === 'published' ? new Date().toISOString() : null,
         })
         .select()
         .single();

      if (articleError) {
         return createErrorResponse(articleError, 500, 'POST /api/articles - insert');
      }

      // Add tags if provided (also using authenticated client)
      if (tag_ids.length > 0) {
         const articleTags = tag_ids.map((tagId: number) => ({
            article_id: article.id,
            tag_id: tagId,
         }));

         await authenticatedClient.from('article_tags').insert(articleTags);
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

      return createSuccessResponse(article, 201);
   } catch (error) {
      return createErrorResponse(error, 500, 'POST /api/articles');
   }
};
