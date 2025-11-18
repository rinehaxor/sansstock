import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Check if we're in server-side context
const isServer = typeof window === 'undefined';

// Validate environment variables only on server-side (synchronous check)
if (isServer) {
   try {
      // Dynamic import untuk avoid bundling env validation ke client
      import('../lib/env').then(({ validateEnvironmentVariables }) => {
         validateEnvironmentVariables();
      }).catch((error) => {
         // In production, log and continue (might be using different env setup)
         // In development, throw to catch configuration issues early
         if (import.meta.env.DEV) {
            console.error('[ENV VALIDATION ERROR]', error instanceof Error ? error.message : error);
         } else {
            console.error('[ENV VALIDATION WARNING]', error instanceof Error ? error.message : error);
         }
      });
   } catch (error) {
      // Silently fail if import fails (might be client-side)
   }
}

// Get environment variables - use PUBLIC_ prefix for client-side access
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY; // Optional: untuk admin operations, server-only

// Validate that we have required values before creating client
if (!supabaseUrl || !supabaseAnonKey) {
   if (isServer) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required. Please check your environment variables.');
   } else {
      // In client-side, create a dummy client to prevent hydration errors
      // This should not be used for actual queries
      console.warn('[SUPABASE] Environment variables not available in client-side context');
   }
}

// Public client (untuk GET requests yang tidak butuh auth)
// Only create if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey
   ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
           flowType: 'pkce',
        },
     })
   : (null as any); // Type assertion untuk prevent TypeScript errors, tapi ini tidak akan digunakan di client

// Admin client dengan service role key (bypass RLS) - hanya untuk server-side
export const supabaseAdmin = (isServer && supabaseServiceKey && supabaseUrl)
   ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
           autoRefreshToken: false,
           persistSession: false,
        },
     })
   : null;

/**
 * Create authenticated Supabase client dari cookies (untuk RLS enforcement)
 * Ini akan menggunakan session user untuk RLS policies
 * Server-side only function
 */
export async function createAuthenticatedClient(accessToken: string, refreshToken: string): Promise<SupabaseClient> {
   if (!isServer) {
      throw new Error('createAuthenticatedClient can only be used on the server-side');
   }

   if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
   }

   const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
         flowType: 'pkce',
      },
   });

   // Set session untuk enable RLS (async operation)
   const { error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
   });

   if (error) {
      throw error;
   }

   return client;
}
