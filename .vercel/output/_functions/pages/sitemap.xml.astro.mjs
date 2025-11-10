import { s as supabase } from '../chunks/supabase_Bf3LIET_.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const GET = async ({ site, url }) => {
  const siteUrl = site?.href || `${url.protocol}//${url.host}`;
  const currentDate = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const { data: articles, error: articlesError } = await supabase.from("articles").select("slug, updated_at, published_at").eq("status", "published").order("published_at", { ascending: false });
    if (articlesError) {
      console.error("Error fetching articles:", articlesError);
    }
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("slug, updated_at").order("name");
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
    }
    const { data: tags, error: tagsError } = await supabase.from("tags").select("slug, updated_at").order("name");
    if (tagsError) {
      console.error("Error fetching tags:", tagsError);
    }
    const urls = [];
    urls.push(`  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);
    urls.push(`  <url>
    <loc>${siteUrl}/artikel</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
    urls.push(`  <url>
    <loc>${siteUrl}/faq</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    if (articles && articles.length > 0) {
      articles.forEach((article) => {
        const lastmod = article.updated_at || article.published_at || currentDate;
        urls.push(`  <url>
    <loc>${siteUrl}/artikel/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
    }
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const lastmod = category.updated_at || currentDate;
        urls.push(`  <url>
    <loc>${siteUrl}/categories/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      });
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        const lastmod = tag.updated_at || currentDate;
        urls.push(`  <url>
    <loc>${siteUrl}/tags/${tag.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
      });
    }
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
