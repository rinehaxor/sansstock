export const prerender = false;

import type { APIRoute } from 'astro';
import { csrfProtection, clearCsrfToken } from '../../../lib/csrf';
import { deleteSecureCookie } from '../../../lib/cookies';
import { createSuccessResponse, createErrorResponse } from '../../../lib/error-handler';
import { apiRateLimit } from '../../../lib/ratelimit';

function clearSessionCookies(context: Parameters<APIRoute>[0]) {
   deleteSecureCookie(context, 'sb-access-token');
   deleteSecureCookie(context, 'sb-refresh-token');
   clearCsrfToken(context);
}

export const POST: APIRoute = async (context) => {
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   try {
      clearSessionCookies(context);
      return createSuccessResponse({ redirect: '/portal/access' });
   } catch (error) {
      return createErrorResponse(error, 500, 'POST /api/auth/signout');
   }
};

export const GET: APIRoute = async () => {
   return createErrorResponse('INVALID_OPERATION', 405, 'GET /api/auth/signout');
};
