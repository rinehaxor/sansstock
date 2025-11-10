/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DE1DG0QU.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { $ as $$PopularNews } from '../../chunks/PopularNews_BVe-mpkZ.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: category, error: categoryError } = await supabase.from("categories").select("id, name, slug, description").eq("slug", slug).single();
  if (categoryError || !category) {
    return new Response("Category not found", { status: 404 });
  }
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const categoryUrl = `${siteUrl}/categories/${category.slug}`;
  const pageTitle = `${category.name} - SansStocks`;
  const pageDescription = category.description || `Semua artikel tentang ${category.name} di SansStocks. Dapatkan insight terbaru dan analisis mendalam tentang ${category.name}.`;
  const pageImage = `${siteUrl}/logo.png`;
  const { data: articles, error: articlesError } = await supabase.from("articles").select(`
      id,
      title,
      slug,
      summary,
      thumbnail_url,
      published_at,
      created_at,
      category_id,
      categories(name, slug)
   `).eq("status", "published").eq("category_id", category.id).order("published_at", { ascending: false }).limit(20);
  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 2592e3) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    return date.toLocaleDateString("id-ID");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": `${category.name}, berita ekonomi, saham, analisis pasar, SansStocks` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Category Header --> <div class="mb-8"> <h1 class="text-4xl font-bold text-gray-900 mb-4">${category.name}</h1> ${category.description && renderTemplate`<p class="text-lg text-gray-600">${category.description}</p>`} </div> <div class="grid lg:grid-cols-3 gap-8"> <!-- Main Articles List --> <div class="lg:col-span-2"> ${articles && articles.length > 0 ? renderTemplate`<div class="space-y-6"> ${articles.map((article) => renderTemplate`<article class="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"> <a${addAttribute(`/artikel/${article.slug}`, "href")} class="flex gap-6"> ${article.thumbnail_url && renderTemplate`<div class="flex-shrink-0"> <img${addAttribute(article.thumbnail_url, "src")}${addAttribute(article.title, "alt")} class="w-48 h-28 rounded-lg object-cover" loading="lazy"> </div>`} <div class="flex-1 min-w-0"> <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 leading-tight"> ${article.title} </h3> ${article.summary && renderTemplate`<p class="text-sm text-gray-600 mb-3 line-clamp-2"> ${article.summary} </p>`} <p class="text-sm text-blue-600 font-medium"> ${article.categories?.name || category.name} | ${getTimeAgo(article.published_at || article.created_at)} </p> </div> </a> </article>`)} </div>` : renderTemplate`<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"> <p class="text-gray-500 text-lg">Belum ada artikel di kategori ini.</p> </div>`} </div> <!-- Sidebar --> <div class="lg:col-span-1"> <!-- Popular News Widget --> ${renderComponent($$result2, "PopularNews", $$PopularNews, {})} <!-- Category Info --> <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6"> <h4 class="text-lg font-bold text-gray-900 mb-2">Tentang Kategori</h4> <p class="text-sm text-gray-700 mb-4"> ${category.description || `Semua artikel tentang ${category.name}.`} </p> <div class="text-xs text-gray-600"> <p class="font-medium">${articles?.length || 0} artikel</p> </div> </div> </div> </div> </div> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="website"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <link rel="canonical"', '> <script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(categoryUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(categoryUrl, "href"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": pageDescription,
    "url": categoryUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": articles?.length || 0
    }
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Kategori",
        "item": `${siteUrl}/categories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": categoryUrl
      }
    ]
  }))) })}` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/categories/[slug].astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/categories/[slug].astro";
const $$url = "/categories/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$slug,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
