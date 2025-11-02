export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedUser, getAuthenticatedSupabase } from '../../../lib/auth';

// GET /api/articles - Public (semua bisa akses)
export const GET: APIRoute = async ({ request, url }) => {
   try {
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const categoryId = searchParams.get('category_id');
      const status = searchParams.get('status') || 'published'; // Default hanya published untuk public
      const search = searchParams.get('search');

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
         query = query.eq('category_id', categoryId);
      }

      // Search
      if (search) {
         query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Get total count for pagination
      const { count: totalCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', status);

      return new Response(
         JSON.stringify({
            data: data || [],
            pagination: {
               page,
               limit,
               total: totalCount || 0,
               totalPages: Math.ceil((totalCount || 0) / limit),
            },
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// POST /api/articles - Admin only (RLS enforced)
export const POST: APIRoute = async (context) => {
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
      const body = await context.request.json();
      const { title, slug, summary, content, thumbnail_url, category_id, source_id, status = 'draft', tag_ids = [], url_original } = body;

      // Validation
      if (!title || !slug || !content || !category_id) {
         return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Create article using authenticated client (RLS will enforce policies)
      const { data: article, error: articleError } = await authenticatedClient
         .from('articles')
         .insert({
            title,
            slug,
            summary,
            content,
            thumbnail_url,
            category_id,
            source_id,
            status,
            url_original,
            created_by: user.id,
            updated_by: user.id,
            published_at: status === 'published' ? new Date().toISOString() : null,
         })
         .select()
         .single();

      if (articleError) {
         return new Response(JSON.stringify({ error: articleError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Add tags if provided (also using authenticated client)
      if (tag_ids.length > 0) {
         const articleTags = tag_ids.map((tagId: number) => ({
            article_id: article.id,
            tag_id: tagId,
         }));

         await authenticatedClient.from('article_tags').insert(articleTags);
      }

      return new Response(JSON.stringify({ data: article }), {
         status: 201,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};
