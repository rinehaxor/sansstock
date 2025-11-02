export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { isAdmin, getAuthenticatedUser, getAuthenticatedSupabase } from '../../../lib/auth';

// GET /api/tags - Public (semua bisa akses)
export const GET: APIRoute = async ({ url }) => {
   try {
      const searchParams = url.searchParams;
      const search = searchParams.get('search');

      let query = supabase.from('tags').select('id, name, slug, description, created_at').order('name', { ascending: true });

      // Search
      if (search) {
         query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(
         JSON.stringify({
            data: data || [],
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

// POST /api/tags - Admin only (RLS enforced)
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

   try {
      const body = await context.request.json();
      const { name, slug, description } = body;

      // Validation
      if (!name || !slug) {
         return new Response(JSON.stringify({ error: 'Name and slug are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Check if slug already exists using authenticated client
      const { data: existingTag } = await authenticatedClient.from('tags').select('id').eq('slug', slug).single();

      if (existingTag) {
         return new Response(JSON.stringify({ error: 'Tag with this slug already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Create tag using authenticated client (RLS will enforce policies)
      const { data: tag, error: tagError } = await authenticatedClient
         .from('tags')
         .insert({
            name,
            slug,
            description: description || null,
         })
         .select()
         .single();

      if (tagError) {
         return new Response(JSON.stringify({ error: tagError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: tag }), {
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
