export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../db/supabase';

export const GET: APIRoute = async ({ site, url }) => {
   const siteUrl = site?.href || `${url.protocol}//${url.host}`;
   const currentDate = new Date().toISOString();

   // Function to escape XML special characters
   const escapeXml = (unsafe: string): string => {
      if (!unsafe) return '';
      return unsafe
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&apos;');
   };

   try {
      // Fetch latest 20 published articles
      const { data: articles, error } = await supabase
         .from('articles')
         .select(`
            title,
            slug,
            summary,
            thumbnail_url,
            published_at,
            created_at,
            updated_at
         `)
         .eq('status', 'published')
         .order('published_at', { ascending: false })
         .limit(20);

      if (error) {
         console.error('Error fetching articles:', error);
         return new Response('Error generating RSS feed', { status: 500 });
      }

      const items = (articles || []).map((article: any) => {
         const articleUrl = `${siteUrl}/artikel/${article.slug}`;
         const pubDate = new Date(article.published_at || article.created_at).toUTCString();
         const description = article.summary || article.title || '';
         const imageTag = article.thumbnail_url 
            ? `<enclosure url="${escapeXml(article.thumbnail_url)}" type="image/jpeg" />`
            : '';

         return `  <item>
    <title><![CDATA[${article.title || ''}]]></title>
    <link>${escapeXml(articleUrl)}</link>
    <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
    <description><![CDATA[${description}]]></description>
    <pubDate>${pubDate}</pubDate>
    ${imageTag}
  </item>`;
      }).join('\n');

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>EmitenHub - Berita Ekonomi &amp; Analisis Pasar</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Portal berita ekonomi, saham, dan analisis pasar terpercaya. Dapatkan insight terbaru tentang pasar modal Indonesia, analisis saham, dan berita ekonomi terkini.</description>
    <language>id-ID</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(siteUrl)}/logo.png</url>
      <title>EmitenHub</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>
${items}
  </channel>
</rss>`;

      return new Response(rss, {
         headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
         },
      });
   } catch (error) {
      console.error('Error generating RSS feed:', error);
      return new Response('Error generating RSS feed', { status: 500 });
   }
};

