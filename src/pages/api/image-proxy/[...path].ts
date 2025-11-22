export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Proxy endpoint untuk gambar Supabase dengan cache headers yang panjang
 * Usage: /api/image-proxy/https://aitfpijkletoyuxujmnc.supabase.co/storage/v1/object/public/...
 */
export const GET: APIRoute = async ({ params, request }) => {
   try {
      const path = params.path;
      if (!path) {
         return new Response('Image path required', { status: 400 });
      }

      // Reconstruct full URL
      const imageUrl = decodeURIComponent(path);
      
      // Validate URL is from Supabase storage
      if (!imageUrl.includes('supabase.co') && !imageUrl.includes('supabase.storage')) {
         return new Response('Invalid image source', { status: 403 });
      }

      // Fetch image from Supabase
      const response = await fetch(imageUrl, {
         headers: {
            'User-Agent': 'Mozilla/5.0',
         },
      });

      if (!response.ok) {
         return new Response('Image not found', { status: 404 });
      }

      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Return image with long cache headers
      return new Response(imageBuffer, {
         status: 200,
         headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
            'Expires': new Date(Date.now() + 31536000 * 1000).toUTCString(),
            'X-Content-Type-Options': 'nosniff',
         },
      });
   } catch (error) {
      console.error('Image proxy error:', error);
      return new Response('Internal server error', { status: 500 });
   }
};

