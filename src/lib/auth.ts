import type { APIContext } from 'astro';
import { supabase, createAuthenticatedClient } from '../db/supabase';

/**
 * Get authenticated Supabase client from cookies
 * This client will enforce RLS policies based on user session
 */
export async function getAuthenticatedSupabase(context: APIContext) {
   const accessToken = context.cookies.get('sb-access-token');
   const refreshToken = context.cookies.get('sb-refresh-token');

   if (!accessToken || !refreshToken) {
      return null;
   }

   try {
      // Create authenticated client dengan session (async)
      const client = await createAuthenticatedClient(accessToken.value, refreshToken.value);

      // Verify session masih valid
      const {
         data: { session },
         error,
      } = await client.auth.getSession();

      if (error || !session) {
         return null;
      }

      return client;
   } catch (error) {
      return null;
   }
}

/**
 * Check if user is authenticated and get user info
 */
export async function getAuthenticatedUser(context: APIContext) {
   const client = await getAuthenticatedSupabase(context);
   if (!client) {
      return null;
   }

   const {
      data: { user },
   } = await client.auth.getUser();

   return user;
}

/**
 * Check if user is admin
 * Option 1: Check user metadata role
 * Option 2: Check di database users table
 * For now, we check if user exists (authenticated = admin)
 * You can modify this to check actual role from database or user metadata
 */
export async function isAdmin(context: APIContext): Promise<boolean> {
   const user = await getAuthenticatedUser(context);
   if (!user) {
      return false;
   }

   // TODO: Add actual role check here
   // Option 1: Check user metadata
   // const role = user.user_metadata?.role;
   // return role === 'admin';

   // Option 2: Check from database
   // const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
   // return data?.role === 'admin';

   // For now: all authenticated users are admins
   return true;
}

