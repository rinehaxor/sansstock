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

   // Set long cache headers untuk font files
   if (context.url.pathname.startsWith('/fonts/') && 
       (context.url.pathname.endsWith('.woff2') || context.url.pathname.endsWith('.woff') || context.url.pathname.endsWith('.css'))) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
      response.headers.set('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
      // Set proper content type untuk font files
      if (context.url.pathname.endsWith('.woff2')) {
         response.headers.set('Content-Type', 'font/woff2');
      } else if (context.url.pathname.endsWith('.woff')) {
         response.headers.set('Content-Type', 'font/woff');
      }
   }

   return response;
};

