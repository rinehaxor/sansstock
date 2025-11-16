export const prerender = false;

import type { APIRoute } from 'astro';
import { getOrCreateCsrfToken } from '../../../lib/csrf';

/**
 * GET /api/auth/csrf-token
 * Get or create CSRF token for current session
 * This endpoint should be called by frontend to get CSRF token
 */
export const GET: APIRoute = async (context) => {
   const csrfToken = getOrCreateCsrfToken(context);

   return new Response(JSON.stringify({ csrfToken }), {
      status: 200,
      headers: {
         'Content-Type': 'application/json',
      },
   });
};


