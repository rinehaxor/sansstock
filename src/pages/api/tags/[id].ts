export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedSupabase } from '../../../lib/auth';

// GET /api/tags/[id] - Public
export const GET: APIRoute = async ({ params }) => {
   try {
      const id = params.id;

      if (!id) {
         return new Response(JSON.stringify({ error: 'Tag ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const { data, error } = await supabase.from('tags').select('*').eq('id', id).single();

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: error.code === 'PGRST116' ? 404 : 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// PUT /api/tags/[id] - Admin only (RLS enforced)
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

   try {
      const id = context.params.id;
      if (!id) {
         return new Response(JSON.stringify({ error: 'Tag ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const body = await context.request.json();
      const { name, slug, description } = body;

      // Build update object
      const updateData: any = {};

      if (name) updateData.name = name;
      if (slug) {
         // Check if slug already exists (excluding current tag) using authenticated client
         const { data: existingTag } = await authenticatedClient.from('tags').select('id').eq('slug', slug).neq('id', id).single();

         if (existingTag) {
            return new Response(JSON.stringify({ error: 'Tag with this slug already exists' }), {
               status: 400,
               headers: { 'Content-Type': 'application/json' },
            });
         }

         updateData.slug = slug;
      }
      if (description !== undefined) updateData.description = description;

      // Update tag using authenticated client (RLS will enforce policies)
      const { data: tag, error: tagError } = await authenticatedClient.from('tags').update(updateData).eq('id', id).select().single();

      if (tagError) {
         return new Response(JSON.stringify({ error: tagError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: tag }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// DELETE /api/tags/[id] - Admin only (RLS enforced)
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
         return new Response(JSON.stringify({ error: 'Tag ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Check if tag is used in articles using authenticated client
      const { data: articleTags } = await authenticatedClient.from('article_tags').select('article_id').eq('tag_id', id).limit(1);

      if (articleTags && articleTags.length > 0) {
         return new Response(JSON.stringify({ error: 'Cannot delete tag because it is used in one or more articles' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Delete tag using authenticated client (RLS will enforce policies)
      const { error } = await authenticatedClient.from('tags').delete().eq('id', id);

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ message: 'Tag deleted successfully' }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};
