import { c as createAuthenticatedClient } from './supabase_Bf3LIET_.mjs';

async function getAuthenticatedSupabase(context) {
  const accessToken = context.cookies.get("sb-access-token");
  const refreshToken = context.cookies.get("sb-refresh-token");
  if (!accessToken || !refreshToken) {
    return null;
  }
  try {
    const client = await createAuthenticatedClient(accessToken.value, refreshToken.value);
    const {
      data: { session },
      error
    } = await client.auth.getSession();
    if (error || !session) {
      return null;
    }
    return client;
  } catch (error) {
    return null;
  }
}
async function getAuthenticatedUser(context) {
  const client = await getAuthenticatedSupabase(context);
  if (!client) {
    return null;
  }
  const {
    data: { user }
  } = await client.auth.getUser();
  return user;
}
async function isAdmin(context) {
  const user = await getAuthenticatedUser(context);
  if (!user) {
    return false;
  }
  return true;
}

export { getAuthenticatedUser as a, getAuthenticatedSupabase as g, isAdmin as i };
