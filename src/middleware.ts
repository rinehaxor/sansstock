import type { MiddlewareHandler } from 'astro';

/**
 * Middleware untuk set cache headers pada image endpoints
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
   const response = await next();

   // Set long cache headers untuk _image endpoint (Astro image optimization)
   if (context.url.pathname.startsWith('/_image')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
      response.headers.set('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
   }

   // Set cache headers untuk image proxy endpoint
   if (context.url.pathname.startsWith('/api/image-proxy/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
      response.headers.set('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
   }

   return response;
};

