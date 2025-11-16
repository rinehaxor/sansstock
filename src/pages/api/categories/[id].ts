// With `output: 'static'` configured:
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';

// GET /api/categories/[id] - Public read
export const GET: APIRoute = async (context) => {
   try {
      const id = context.params.id;
      if (!id) {
         return new Response(JSON.stringify({ error: 'Category ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const { data: category, error } = await supabase
         .from('categories')
         .select('id, name, slug, description, created_at, updated_at')
         .eq('id', id)
         .single();

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      if (!category) {
         return new Response(JSON.stringify({ error: 'Category not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: category }), {
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

// PUT /api/categories/[id] - Admin only (RLS enforced)
export const PUT: APIRoute = async (context) => {
   // CSRF Protection
   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

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
         return new Response(JSON.stringify({ error: 'Category ID is required' }), {
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
         // Check if slug already exists (excluding current category) using authenticated client
         const { data: existingCategory } = await authenticatedClient
            .from('categories')
            .select('id')
            .eq('slug', slug)
            .neq('id', id)
            .single();

         if (existingCategory) {
            return new Response(JSON.stringify({ error: 'Category with this slug already exists' }), {
               status: 400,
               headers: { 'Content-Type': 'application/json' },
            });
         }

         updateData.slug = slug;
      }
      if (description !== undefined) updateData.description = description;

      // Update category using authenticated client (RLS will enforce policies)
      const { data: category, error: categoryError } = await authenticatedClient
         .from('categories')
         .update(updateData)
         .eq('id', id)
         .select()
         .single();

      if (categoryError) {
         return new Response(JSON.stringify({ error: categoryError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: category }), {
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

// DELETE /api/categories/[id] - Admin only (RLS enforced)
export const DELETE: APIRoute = async (context) => {
   // CSRF Protection
   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

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
         return new Response(JSON.stringify({ error: 'Category ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Check if category is used in articles
      const { data: articles, error: articlesError } = await authenticatedClient
         .from('articles')
         .select('id')
         .eq('category_id', id)
         .limit(1);

      if (articlesError) {
         return new Response(JSON.stringify({ error: articlesError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      if (articles && articles.length > 0) {
         return new Response(JSON.stringify({ error: 'Cannot delete category that is being used by articles' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Delete category using authenticated client (RLS will enforce policies)
      const { error: deleteError } = await authenticatedClient.from('categories').delete().eq('id', id);

      if (deleteError) {
         return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ success: true }), {
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

