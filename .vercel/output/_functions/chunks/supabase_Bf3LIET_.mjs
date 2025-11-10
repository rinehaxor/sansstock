import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://aitfpijkletoyuxujmnc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdGZwaWprbGV0b3l1eHVqbW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODQxNTMsImV4cCI6MjA3NDI2MDE1M30.xTHw8VbvlGBuwrPRXfXj2Q2Si9O9RNeICd_ty7WeuhA";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce"
  }
});
async function createAuthenticatedClient(accessToken, refreshToken) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce"
    }
  });
  const { error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (error) {
    throw error;
  }
  return client;
}

export { createAuthenticatedClient as c, supabase as s };
