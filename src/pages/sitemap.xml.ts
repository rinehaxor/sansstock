export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../db/supabase';

export const GET: APIRoute = async ({ site, url }) => {
   // Use site URL from Astro config, fallback to current origin
   const siteUrl = site?.href || `${url.protocol}//${url.host}`;
   const currentDate = new Date().toISOString();

   // Function to escape XML special characters in URLs
   const escapeXml = (unsafe: string): string => {
      if (!unsafe) return '';
      return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
   };

   try {
      // Fetch all published articles
      const { data: articles, error: articlesError } = await supabase.from('articles').select('slug, updated_at, published_at').eq('status', 'published').order('published_at', { ascending: false });

      if (articlesError) {
         console.error('Error fetching articles:', articlesError);
      }

      // Fetch all categories
      const { data: categories, error: categoriesError } = await supabase.from('categories').select('slug, updated_at').order('name');

      if (categoriesError) {
         console.error('Error fetching categories:', categoriesError);
      }

      // Fetch all tags
      const { data: tags, error: tagsError } = await supabase.from('tags').select('slug, updated_at').order('name');

      if (tagsError) {
         console.error('Error fetching tags:', tagsError);
      }

      // Build sitemap XML
      const urls: string[] = [];

      // Homepage
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

      // Articles index
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/artikel</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

      // FAQ page
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/faq</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

      // About page
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/tentang-kami</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);

      // Disclaimer page
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/disclaimer</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);

      // Privacy Policy page
      urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/kebijakan-privasi</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);

      // Published articles
      if (articles && articles.length > 0) {
         articles.forEach((article: any) => {
            const lastmod = article.updated_at || article.published_at || currentDate;
            urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/artikel/${escapeXml(article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
         });
      }

      // Categories
      if (categories && categories.length > 0) {
         categories.forEach((category: any) => {
            const lastmod = category.updated_at || currentDate;
            urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/categories/${escapeXml(category.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
         });
      }

      // Tags
      if (tags && tags.length > 0) {
         tags.forEach((tag: any) => {
            const lastmod = tag.updated_at || currentDate;
            urls.push(`  <url>
    <loc>${escapeXml(siteUrl)}/tags/${escapeXml(tag.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
         });
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

      return new Response(sitemap, {
         headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
         },
      });
   } catch (error) {
      console.error('Error generating sitemap:', error);
      return new Response('Error generating sitemap', { status: 500 });
   }
};
