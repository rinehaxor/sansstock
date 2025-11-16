import type { APIContext } from 'astro';
import { setSecureCookie, deleteSecureCookie } from './cookies';

/**
 * CSRF Protection Utilities
 * 
 * Implements CSRF protection using double-submit cookie pattern:
 * 1. Generate CSRF token and store in HTTP-only cookie
 * 2. Also send token in custom header (X-CSRF-Token)
 * 3. Validate that cookie token matches header token
 * 
 * This prevents CSRF attacks because:
 * - Attacker cannot read cookie (HTTP-only)
 * - Attacker cannot set custom headers from browser (SOP)
 */

const CSRF_TOKEN_COOKIE_NAME = 'csrf-token';
const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a secure random CSRF token
 * Uses Web Crypto API which is available in Node.js and browsers
 */
export function generateCsrfToken(): string {
   // Use Web Crypto API for generating random bytes
   const array = new Uint8Array(32);
   if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
   } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
         array[i] = Math.floor(Math.random() * 256);
      }
   }
   return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get CSRF token from cookie or generate new one
 */
export function getOrCreateCsrfToken(context: APIContext): string {
   const existingToken = context.cookies.get(CSRF_TOKEN_COOKIE_NAME);
   
   if (existingToken?.value) {
      return existingToken.value;
   }
   
   return rotateCsrfToken(context);
}

export function rotateCsrfToken(context: APIContext): string {
   const newToken = generateCsrfToken();
   setCsrfTokenCookie(context, newToken);
   return newToken;
}

export function clearCsrfToken(context: APIContext): void {
   deleteSecureCookie(context, CSRF_TOKEN_COOKIE_NAME);
}

/**
 * Set CSRF token in cookie
 */
export function setCsrfTokenCookie(context: APIContext, token: string): void {
   setSecureCookie(context, CSRF_TOKEN_COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24 * 7,
   });
}

/**
 * Validate CSRF token from request
 * Returns true if valid, false otherwise
 */
export function validateCsrfToken(context: APIContext, providedToken?: string): boolean {
   // Skip CSRF validation for GET, HEAD, OPTIONS (safe methods)
   const method = context.request.method.toUpperCase();
   if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
   }

   // Get token from cookie
   const cookieToken = context.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
   
   if (!cookieToken) {
      return false;
   }

   // Get token from header
   const headerToken = context.request.headers.get(CSRF_TOKEN_HEADER_NAME);
   
   const requestToken = providedToken || headerToken;

   if (!requestToken) {
      return false;
   }

   // Compare tokens (constant-time comparison to prevent timing attacks)
   return constantTimeEquals(cookieToken, requestToken);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
   if (a.length !== b.length) {
      return false;
   }
   
   let result = 0;
   for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
   }
   
   return result === 0;
}

/**
 * Validate origin/referer header for additional CSRF protection
 * This is a secondary check - primary protection is CSRF token
 */
export function validateOrigin(context: APIContext): boolean {
   const method = context.request.method.toUpperCase();
   if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
   }

   const origin = context.request.headers.get('origin');
   const referer = context.request.headers.get('referer');
   const host = context.request.headers.get('host');
   
   // Allow requests without origin/referer (e.g., Postman, curl) in development
   // In production, these should be present for browser requests
   if (!origin && !referer) {
      // In production, reject requests without origin/referer
      if (import.meta.env.PROD) {
         return false;
      }
      // In development, allow for testing
      return true;
   }

   // Get site URL from env or request
   const siteUrl = import.meta.env.SITE_URL || 
      (context.url ? `${context.url.protocol}//${context.url.host}` : null);
   
   if (!siteUrl) {
      // Can't validate without site URL
      return true;
   }

   const siteOrigin = new URL(siteUrl).origin;
   
   // Validate origin
   if (origin) {
      try {
         const requestOrigin = new URL(origin).origin;
         if (requestOrigin !== siteOrigin) {
            return false;
         }
      } catch {
         return false;
      }
   }
   
   // Validate referer
   if (referer) {
      try {
         const requestOrigin = new URL(referer).origin;
         if (requestOrigin !== siteOrigin) {
            return false;
         }
      } catch {
         return false;
      }
   }
   
   return true;
}

/**
 * Middleware to validate CSRF token
 * Returns error response if invalid, null if valid
 */
export function csrfProtection(context: APIContext, tokenFromBody?: string): Response | null {
   // Validate CSRF token
   if (!validateCsrfToken(context, tokenFromBody)) {
      return new Response(
         JSON.stringify({ error: 'Invalid CSRF token. Please refresh the page and try again.' }),
         {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }

   // Validate origin (additional protection)
   if (!validateOrigin(context)) {
      return new Response(
         JSON.stringify({ error: 'Invalid origin. Request rejected for security.' }),
         {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }

   return null;
}
