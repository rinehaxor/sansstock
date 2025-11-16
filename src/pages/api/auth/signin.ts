// With `output: 'static'` configured:
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { csrfProtection, rotateCsrfToken } from '../../../lib/csrf';
import { loginRateLimit } from '../../../lib/ratelimit';
import { createErrorResponse, ErrorMessages } from '../../../lib/error-handler';
import { setSecureCookie } from '../../../lib/cookies';

export const POST: APIRoute = async (context) => {
   // Rate limiting - prevent brute force attacks
   const rateLimitError = loginRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const formData = await context.request.formData();
   const email = formData.get('email')?.toString();
   const password = formData.get('password')?.toString();

   if (!email || !password) {
      return createErrorResponse(ErrorMessages.MISSING_REQUIRED_FIELDS, 400, 'POST /api/auth/signin');
   }

   const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (error) {
      // Don't expose specific auth error details in production
      // Generic "Invalid credentials" message is safer
      const statusCode = error.message.includes('Invalid login') || error.message.includes('Invalid') ? 401 : 500;
      return createErrorResponse(error, statusCode, 'POST /api/auth/signin');
   }

   const { access_token, refresh_token } = data.session;
   setSecureCookie(context, 'sb-access-token', access_token, {
      maxAge: 60 * 60 * 24 * 7,
   });
   setSecureCookie(context, 'sb-refresh-token', refresh_token, {
      maxAge: 60 * 60 * 24 * 30,
   });

   // Generate and set CSRF token after successful login
   const csrfToken = rotateCsrfToken(context);

   return new Response(JSON.stringify({ success: true, redirect: '/dashboard', csrfToken }), {
      status: 200,
      headers: {
         'Content-Type': 'application/json',
      },
   });
};
