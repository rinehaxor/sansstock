import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY; // Optional: untuk admin operations

// Public client (untuk GET requests yang tidak butuh auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   auth: {
      flowType: 'pkce',
   },
});

// Admin client dengan service role key (bypass RLS) - hanya untuk server-side
export const supabaseAdmin = supabaseServiceKey
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
 */
export async function createAuthenticatedClient(
   accessToken: string,
   refreshToken: string
): Promise<SupabaseClient> {
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
