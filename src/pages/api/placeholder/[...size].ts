export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  // params.size will be "32/32" for /api/placeholder/32/32
  const sizeParts = params.size?.split('/') || ['32', '32'];
  
  const width = parseInt(sizeParts[0]) || 32;
  const height = parseInt(sizeParts[1] || sizeParts[0]) || 32;

  // Validate dimensions
  const validWidth = Math.max(1, Math.min(1000, width));
  const validHeight = Math.max(1, Math.min(1000, height));

  // Create SVG placeholder
  const fontSize = Math.min(validWidth, validHeight) / 3;
  const svg = `
    <svg width="${validWidth}" height="${validHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${validWidth}×${validHeight}</text>
    </svg>
  `.trim();

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

