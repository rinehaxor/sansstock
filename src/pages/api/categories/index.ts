// With `output: 'static'` configured:
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, isAdmin, getAuthenticatedUser } from '../../../lib/auth';

// GET /api/categories - Public read (untuk dropdown, dll)
export const GET: APIRoute = async () => {
   try {
      const { data: categories, error } = await supabase
         .from('categories')
         .select('id, name, slug, description, created_at, updated_at')
         .order('name', { ascending: true });

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: categories }), {
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

// POST /api/categories - Admin only (RLS enforced)
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
      const { data: existingCategory } = await authenticatedClient
         .from('categories')
         .select('id')
         .eq('slug', slug)
         .single();

      if (existingCategory) {
         return new Response(JSON.stringify({ error: 'Category with this slug already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Create category using authenticated client (RLS will enforce policies)
      const { data: category, error: categoryError } = await authenticatedClient
         .from('categories')
         .insert({
            name,
            slug,
            description: description || null,
         })
         .select()
         .single();

      if (categoryError) {
         return new Response(JSON.stringify({ error: categoryError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: category }), {
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

