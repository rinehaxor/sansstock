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
 *
 * This is an admin-only system, so all authenticated users are admins.
 * However, we verify that the user is authenticated and session is valid.
 *
 * To add additional security in the future, you can:
 * Option 1: Check user metadata role
 *    const role = user.user_metadata?.role;
 *    return role === 'admin';
 *
 * Option 2: Check from database users table
 *    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
 *    return data?.role === 'admin';
 *
 * Option 3: Whitelist admin emails (set ALLOWED_ADMIN_EMAILS in env)
 *    const allowedEmails = (import.meta.env.ALLOWED_ADMIN_EMAILS || '').split(',').map(e => e.trim());
 *    return allowedEmails.includes(user.email);
 */
export async function isAdmin(context: APIContext): Promise<boolean> {
   const user = await getAuthenticatedUser(context);
   if (!user) {
      return false;
   }

   // Verify user has valid email (basic validation)
   if (!user.email || !user.email.includes('@')) {
      return false;
   }

   // Optional: Check whitelist of admin emails from environment variable
   // Uncomment if you want to restrict to specific emails
   // const allowedAdminEmails = (import.meta.env.ALLOWED_ADMIN_EMAILS || '')
   //    .split(',')
   //    .map((email: string) => email.trim().toLowerCase())
   //    .filter((email: string) => email.length > 0);
   //
   // if (allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(user.email.toLowerCase())) {
   //    return false;
   // }

   // Optional: Check user metadata for role
   // Uncomment if you set role in Supabase user metadata
   // const role = user.user_metadata?.role;
   // if (role && role !== 'admin') {
   //    return false;
   // }

   // All authenticated users with valid email are admins (admin-only system)
   return true;
}
