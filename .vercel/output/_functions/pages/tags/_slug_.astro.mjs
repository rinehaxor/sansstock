/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, F as Fragment$1, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DE1DG0QU.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { $ as $$PopularNews } from '../../chunks/PopularNews_BVe-mpkZ.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import 'react';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../chunks/Card_CppDnIQN.mjs';
import { B as Badge } from '../../chunks/Badge_iQRQmODX.mjs';
export { renderers } from '../../renderers.mjs';

function ArticleCardShadcn({ title, excerpt, category, categoryColor, timeAgo, author, authorInitials, link, isLarge = false, thumbnailUrl }) {
  return /* @__PURE__ */ jsxs(Card, { className: `${isLarge ? "lg:col-span-2" : ""} group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`, children: [
    /* @__PURE__ */ jsxs("div", { className: `w-full ${isLarge ? "aspect-[16/9]" : "aspect-[4/3]"} bg-gradient-to-br ${categoryColor} relative overflow-hidden`, children: [
      thumbnailUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: thumbnailUrl,
            alt: title,
            width: isLarge ? 800 : 600,
            height: isLarge ? 450 : 450,
            className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300",
            loading: isLarge ? "eager" : "lazy",
            decoding: "async",
            fetchPriority: isLarge ? "high" : "low"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            width: isLarge ? "80" : "60",
            height: isLarge ? "80" : "60",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            className: `text-white/80 ${isLarge ? "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" : "w-12 h-12"}`,
            children: [
              /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
              /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
              /* @__PURE__ */ jsx("polyline", { points: "21,15 16,10 5,21" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-10", children: /* @__PURE__ */ jsx(Badge, { className: "bg-white text-gray-800 hover:bg-white", children: category }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 text-white z-10", children: /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: timeAgo }) })
    ] }),
    /* @__PURE__ */ jsxs(CardHeader, { className: `${isLarge ? "p-4 sm:p-5 md:p-6 lg:p-6" : "p-4"}`, children: [
      /* @__PURE__ */ jsx(CardTitle, { className: `${isLarge ? "text-xl sm:text-2xl md:text-3xl lg:text-3xl mb-3 sm:mb-4" : "mb-2 text-lg"} leading-tight group-hover:text-blue-600 transition-colors`, children: title }),
      /* @__PURE__ */ jsx(CardDescription, { className: `${isLarge ? "text-sm sm:text-base md:text-lg lg:text-lg" : "text-sm"} leading-relaxed ${isLarge ? "mb-4 sm:mb-5" : "mb-3"}`, children: excerpt })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: `${isLarge ? "p-4 sm:p-5 md:p-6 lg:p-6 pt-0" : "p-4 pt-0"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: `${isLarge ? "h-8 w-8" : "h-6 w-6"} rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600`, children: authorInitials || "A" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: `${isLarge ? "text-sm" : "text-xs"} font-medium`, children: author || "Tim Editorial" }),
          /* @__PURE__ */ jsx("p", { className: `${isLarge ? "text-xs" : "text-xs"} text-muted-foreground`, children: "SansStocks" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: link, className: `text-blue-600 hover:text-blue-700 font-medium ${isLarge ? "flex items-center group text-sm sm:text-base" : "text-sm"}`, children: isLarge ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Baca Selengkapnya" }),
        /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Baca" }),
        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
      ] }) : "Baca →" })
    ] }) })
  ] });
}

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
  const { data: tag, error: tagError } = await supabase.from("tags").select("id, name, slug, description").eq("slug", slug).single();
  if (tagError || !tag) {
    return new Response("Tag not found", { status: 404 });
  }
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const tagUrl = `${siteUrl}/tags/${tag.slug}`;
  const pageTitle = `Tag: ${tag.name} - SansStocks`;
  const pageDescription = tag.description || `Semua artikel dengan tag ${tag.name} di SansStocks. Temukan berita dan analisis terkait ${tag.name}.`;
  const pageImage = `${siteUrl}/logo.png`;
  const { data: articleTags } = await supabase.from("article_tags").select("article_id").eq("tag_id", tag.id);
  const articleIds = articleTags?.map((at) => at.article_id) || [];
  let articles = [];
  if (articleIds.length > 0) {
    const { data: articlesData } = await supabase.from("articles").select(`
         id,
         title,
         slug,
         summary,
         thumbnail_url,
         published_at,
         created_at,
         category_id,
         categories(name, slug)
      `).eq("status", "published").in("id", articleIds).order("published_at", { ascending: false }).limit(20);
    articles = articlesData || [];
  }
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": `${tag.name}, berita ekonomi, saham, analisis pasar, SansStocks` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Tag Header --> <div class="mb-8"> <h1 class="text-4xl font-bold text-gray-900 mb-4">${tag.name}</h1> ${tag.description && renderTemplate`<p class="text-lg text-gray-600">${tag.description}</p>`} </div> <div class="grid lg:grid-cols-3 gap-8"> <!-- Main Articles List --> <div class="lg:col-span-2"> ${articles && articles.length > 0 ? renderTemplate`<div class="grid lg:grid-cols-3 gap-6"> ${articles.map((article, index) => renderTemplate`${renderComponent($$result2, "ArticleCardShadcn", ArticleCardShadcn, { "title": article.title, "excerpt": article.summary || "", "category": article.categories?.name || "Artikel", "categoryColor": "from-blue-500 to-blue-600", "timeAgo": getTimeAgo(article.published_at || article.created_at), "author": "Tim Editorial", "authorInitials": "TE", "link": `/artikel/${article.slug}`, "isLarge": index === 0, "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/ArticleCardShadcn", "client:component-export": "default" })}`)} </div>` : renderTemplate`<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"> <p class="text-gray-500 text-lg">Belum ada artikel dengan tag ini.</p> </div>`} </div> <!-- Sidebar --> <div class="lg:col-span-1"> <!-- Popular News Widget --> ${renderComponent($$result2, "PopularNews", $$PopularNews, {})} <!-- Tag Info --> <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 mt-6"> <h4 class="text-lg font-bold text-gray-900 mb-2">Tentang Tag</h4> <p class="text-sm text-gray-700 mb-4"> ${tag.description || `Semua artikel dengan tag ${tag.name}.`} </p> <div class="text-xs text-gray-600"> <p class="font-medium">${articles?.length || 0} artikel</p> </div> </div> </div> </div> </div> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="website"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <link rel="canonical"', '> <script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(tagUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(tagUrl, "href"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Tag: ${tag.name}`,
    "description": pageDescription,
    "url": tagUrl,
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
        "name": "Tags",
        "item": `${siteUrl}/tags`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tag.name,
        "item": tagUrl
      }
    ]
  }))) })}` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/tags/[slug].astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/tags/[slug].astro";
const $$url = "/tags/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$slug,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
