/* empty css                                     */
import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderComponent, d as renderTemplate, F as Fragment, e as defineScriptVars, u as unescapeHTML } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_D8cCpO2h.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DE1DG0QU.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { $ as $$PopularNews } from '../../chunks/PopularNews_BVe-mpkZ.mjs';
import { $ as $$AdsWidget } from '../../chunks/AdsWidget_BviAvjVc.mjs';
import { useEffect } from 'react';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$FeaturedArticles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FeaturedArticles;
  const currentArticleId = Astro2.props.currentArticleId || null;
  let query = supabase.from("articles").select(`
      id,
      title,
      slug,
      summary,
      thumbnail_url,
      published_at,
      categories:category_id (
         id,
         name,
         slug
      )
   `).eq("status", "published").order("published_at", { ascending: false }).limit(5);
  if (currentArticleId) {
    query = query.neq("id", currentArticleId);
  }
  const { data: featuredArticles } = await query;
  async function getAltText(thumbnailUrl) {
    if (!thumbnailUrl) return null;
    try {
      const { data: mediaMetadata } = await supabase.from("media_metadata").select("alt_text").eq("file_url", thumbnailUrl).single();
      return mediaMetadata?.alt_text || null;
    } catch (e) {
      return null;
    }
  }
  const articlesWithAltText = await Promise.all(
    (featuredArticles || []).map(async (article) => {
      const altText = await getAltText(article.thumbnail_url);
      return {
        ...article,
        thumbnail_alt: altText
      };
    })
  );
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
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"> <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"> <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>
Berita Utama
</h3> ${articlesWithAltText && articlesWithAltText.length > 0 ? renderTemplate`<div class="space-y-3"> ${articlesWithAltText.map((article, index) => renderTemplate`<a${addAttribute(`/artikel/${article.slug}`, "href")} class="block group"> ${index === 0 && article.thumbnail_url ? renderTemplate`<!-- Featured Article - Large Card -->
                  <div class="mb-3"> <div class="relative rounded-lg overflow-hidden mb-2"> ${renderComponent($$result, "Image", $$Image, { "src": article.thumbnail_url, "alt": article.thumbnail_alt || article.title, "width": 400, "height": 120, "class": "w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300", "loading": "lazy", "format": "webp" })} ${article.categories && renderTemplate`<div class="absolute top-2 left-2"> <span class="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded"> ${article.categories.name} </span> </div>`} </div> <h4 class="text-base font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight mb-1"> ${article.title} </h4> ${article.summary && renderTemplate`<p class="text-xs text-gray-600 line-clamp-2 mb-1"> ${article.summary} </p>`} ${article.published_at && renderTemplate`<p class="text-xs text-gray-500"> ${getTimeAgo(article.published_at)} </p>`} </div>` : renderTemplate`<!-- Regular Articles - Small Card -->
                  <div class="flex gap-2 pb-3 border-b border-gray-100 last:border-0 last:pb-0"> ${article.thumbnail_url ? renderTemplate`<div class="flex-shrink-0"> ${renderComponent($$result, "Image", $$Image, { "src": article.thumbnail_url, "alt": article.thumbnail_alt || article.title, "width": 64, "height": 64, "class": "w-16 h-16 rounded-lg object-cover", "loading": "lazy", "format": "webp" })} </div>` : renderTemplate`<div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path> </svg> </div>`} <div class="flex-1 min-w-0"> <h4 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug mb-1"> ${article.title} </h4> ${article.published_at && renderTemplate`<p class="text-xs text-gray-500"> ${getTimeAgo(article.published_at)} </p>`} </div> </div>`} </a>`)} </div>` : renderTemplate`<p class="text-sm text-gray-500">Belum ada Berita utama.</p>`} </div>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/FeaturedArticles.astro", void 0);

const $$Astro$1 = createAstro();
const $$RelatedArticles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RelatedArticles;
  const currentArticleId = Astro2.props.currentArticleId || null;
  const currentCategoryId = Astro2.props.currentCategoryId || null;
  const currentTagIds = Astro2.props.currentTagIds || [];
  if (!currentArticleId) {
    return null;
  }
  let relatedArticles = [];
  const usedArticleIds = /* @__PURE__ */ new Set([currentArticleId]);
  async function getAltText(thumbnailUrl) {
    if (!thumbnailUrl) return null;
    try {
      const { data: mediaMetadata } = await supabase.from("media_metadata").select("alt_text").eq("file_url", thumbnailUrl).single();
      return mediaMetadata?.alt_text || null;
    } catch (e) {
      return null;
    }
  }
  if (currentCategoryId) {
    const { data: categoryArticles } = await supabase.from("articles").select(`
      id,
      title,
      slug,
      summary,
      thumbnail_url,
      published_at,
      categories:category_id (
        id,
        name,
        slug
      )
    `).eq("status", "published").eq("category_id", currentCategoryId).neq("id", currentArticleId).order("published_at", { ascending: false }).limit(3);
    if (categoryArticles) {
      categoryArticles.forEach((article) => {
        if (!usedArticleIds.has(article.id)) {
          relatedArticles.push(article);
          usedArticleIds.add(article.id);
        }
      });
    }
  }
  if (currentTagIds.length > 0 && relatedArticles.length < 3) {
    const { data: articleTags } = await supabase.from("article_tags").select("article_id").in("tag_id", currentTagIds).neq("article_id", currentArticleId);
    const relatedArticleIds = [...new Set(articleTags?.map((at) => at.article_id) || [])];
    const newArticleIds = relatedArticleIds.filter((id) => !usedArticleIds.has(id));
    if (newArticleIds.length > 0) {
      const { data: tagArticles } = await supabase.from("articles").select(`
        id,
        title,
        slug,
        summary,
        thumbnail_url,
        published_at,
        categories:category_id (
          id,
          name,
          slug
        )
      `).eq("status", "published").in("id", newArticleIds.slice(0, 3 - relatedArticles.length)).order("published_at", { ascending: false }).limit(3 - relatedArticles.length);
      if (tagArticles) {
        tagArticles.forEach((article) => {
          if (!usedArticleIds.has(article.id) && relatedArticles.length < 3) {
            relatedArticles.push(article);
            usedArticleIds.add(article.id);
          }
        });
      }
    }
  }
  if (relatedArticles.length < 3) {
    Array.from(usedArticleIds);
    let latestQuery = supabase.from("articles").select(`
      id,
      title,
      slug,
      summary,
      thumbnail_url,
      published_at,
      categories:category_id (
        id,
        name,
        slug
      )
    `).eq("status", "published").order("published_at", { ascending: false }).limit(6);
    const { data: latestArticles } = await latestQuery;
    if (latestArticles) {
      latestArticles.forEach((article) => {
        if (!usedArticleIds.has(article.id) && relatedArticles.length < 3) {
          relatedArticles.push(article);
          usedArticleIds.add(article.id);
        }
      });
    }
  }
  const uniqueRelatedArticles = relatedArticles.slice(0, 3);
  const articlesWithAltText = await Promise.all(
    uniqueRelatedArticles.map(async (article) => {
      const altText = await getAltText(article.thumbnail_url);
      return {
        ...article,
        thumbnail_alt: altText
      };
    })
  );
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
  return renderTemplate`${articlesWithAltText && articlesWithAltText.length > 0 && renderTemplate`${maybeRenderHead()}<div class="mt-12 pt-8 border-t border-gray-200"><div class="mb-6"><h2 class="text-2xl font-bold text-gray-900 mb-2">Artikel Terkait</h2></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl items-stretch">${articlesWithAltText.map((article) => renderTemplate`<a${addAttribute(`/artikel/${article.slug}`, "href")} class="group block h-full"><div class="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">${article.thumbnail_url ? renderTemplate`<div class="w-full aspect-[4/3] overflow-hidden flex-shrink-0">${renderComponent($$result, "Image", $$Image, { "src": article.thumbnail_url, "alt": article.thumbnail_alt || article.title, "width": 400, "height": 300, "class": "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300", "loading": "lazy", "format": "webp" })}</div>` : renderTemplate`<div class="w-full aspect-[4/3] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0"><svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg></div>`}<div class="p-4 flex-1 flex flex-col justify-between"><h3 class="text-base font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight mb-3 transition-colors">${article.title}</h3><div class="flex items-center gap-2 text-sm">${article.categories && renderTemplate`<span class="text-blue-600 font-medium">${article.categories.name}</span>`}${article.published_at && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`<span class="text-gray-400">|</span><span class="text-gray-500">${getTimeAgo(article.published_at)}</span>` })}`}</div></div></div></a>`)}</div></div>`}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/RelatedArticles.astro", void 0);

function ImageDescription() {
  useEffect(() => {
    const addImageDescriptions = () => {
      const prose = document.querySelector(".prose");
      if (!prose) return;
      const images = prose.querySelectorAll("img[data-description]");
      images.forEach((img) => {
        const imgElement = img;
        const description = imgElement.getAttribute("data-description");
        if (!description) return;
        const existingDesc = imgElement.nextElementSibling;
        if (existingDesc && existingDesc.classList.contains("image-description")) {
          existingDesc.textContent = description;
          return;
        }
        const descElement = document.createElement("div");
        descElement.className = "image-description";
        descElement.textContent = description;
        descElement.style.marginTop = "-0.5em";
        descElement.style.paddingTop = "0";
        descElement.style.paddingBottom = "0.5em";
        descElement.style.borderBottom = "1px solid #e5e7eb";
        descElement.style.fontSize = "12px";
        descElement.style.lineHeight = "1.2";
        descElement.style.color = "#6b7280";
        const parent = imgElement.parentElement;
        if (parent && parent.tagName === "P") {
          parent.style.marginBottom = "0";
        }
        const nextSibling = imgElement.nextSibling;
        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent?.trim() === "") {
          imgElement.parentNode?.removeChild(nextSibling);
        }
        imgElement.parentNode?.insertBefore(descElement, imgElement.nextSibling);
      });
    };
    addImageDescriptions();
    const timeoutId = setTimeout(addImageDescriptions, 100);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return null;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/artikel");
  }
  const { data: article, error: articleError } = await supabase.from("articles").select(`
    *,
    categories:category_id (
      id,
      name,
      slug,
      description
    ),
    sources:source_id (
      id,
      name,
      slug
    ),
    article_tags (
      tags:tag_id (
        id,
        name,
        slug
      )
    )
  `).eq("slug", slug).eq("status", "published").single();
  if (articleError || !article) {
    return Astro2.redirect("/artikel");
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  function calculateReadingTime(content) {
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent.trim().split(/\s+/).length;
    const readingTime2 = Math.ceil(words / 200);
    return readingTime2;
  }
  function calculateWordCount(content) {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.trim().split(/\s+/).filter((word) => word.length > 0).length;
  }
  const readingTime = calculateReadingTime(article.content || "");
  const wordCount = calculateWordCount(article.content || "");
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const articleUrl = `${siteUrl}/artikel/${article.slug}`;
  const articleImage = article.thumbnail_url || `${siteUrl}/og-default.jpg`;
  const metaTitle = article.meta_title || article.title;
  const metaDescription = article.meta_description || article.summary || "";
  async function getRelatedArticlesForBacaJuga(currentArticleId, categoryId, tagIds2) {
    let relatedArticles2 = [];
    const usedArticleIds = /* @__PURE__ */ new Set([currentArticleId]);
    if (categoryId) {
      const { data: categoryArticles } = await supabase.from("articles").select("id, title, slug").eq("status", "published").eq("category_id", categoryId).neq("id", currentArticleId).order("published_at", { ascending: false }).limit(3);
      if (categoryArticles) {
        categoryArticles.forEach((article2) => {
          if (!usedArticleIds.has(article2.id)) {
            relatedArticles2.push(article2);
            usedArticleIds.add(article2.id);
          }
        });
      }
    }
    if (tagIds2.length > 0 && relatedArticles2.length < 3) {
      const { data: articleTags } = await supabase.from("article_tags").select("article_id").in("tag_id", tagIds2).neq("article_id", currentArticleId);
      const relatedArticleIds = [...new Set(articleTags?.map((at) => at.article_id) || [])];
      const newArticleIds = relatedArticleIds.filter((id) => !usedArticleIds.has(id));
      if (newArticleIds.length > 0) {
        const { data: tagArticles } = await supabase.from("articles").select("id, title, slug").eq("status", "published").in("id", newArticleIds.slice(0, 3 - relatedArticles2.length)).order("published_at", { ascending: false }).limit(3 - relatedArticles2.length);
        if (tagArticles) {
          tagArticles.forEach((article2) => {
            if (!usedArticleIds.has(article2.id) && relatedArticles2.length < 3) {
              relatedArticles2.push(article2);
              usedArticleIds.add(article2.id);
            }
          });
        }
      }
    }
    if (relatedArticles2.length < 3) {
      const { data: latestArticles } = await supabase.from("articles").select("id, title, slug").eq("status", "published").order("published_at", { ascending: false }).limit(6);
      if (latestArticles) {
        latestArticles.forEach((article2) => {
          if (!usedArticleIds.has(article2.id) && relatedArticles2.length < 3) {
            relatedArticles2.push(article2);
            usedArticleIds.add(article2.id);
          }
        });
      }
    }
    return relatedArticles2.slice(0, 3);
  }
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
  function generateBacaJugaHTML(articles) {
    if (!articles || articles.length === 0) return "";
    const articlesHTML = articles.map((article2, index) => {
      const isLast = index === articles.length - 1;
      const divider = !isLast ? '<div class="w-px bg-gray-300 my-1"></div>' : "";
      return `
      <div class="flex-1 px-3 min-w-0">
        <a href="/artikel/${escapeHtml(article2.slug)}" class="block text-sm text-gray-900 hover:text-blue-600 transition-colors leading-relaxed underline">
          ${escapeHtml(article2.title)}
        </a>
      </div>
      ${divider}`;
    }).join("");
    return `<div class="baca-juga-widget my-8 px-4 pt-2 pb-3 border border-gray-900 rounded-lg bg-white">
    <h3 class="text-base font-bold text-gray-900 mb-2">Baca Juga</h3>
    <div class="flex gap-0">
      ${articlesHTML}
    </div>
  </div>`;
  }
  function injectBacaJugaWidget(content, widgetHtml, afterParagraph = 3) {
    if (!content || !widgetHtml) return content || "";
    const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
    const matches = [...content.matchAll(paragraphRegex)];
    if (matches.length < afterParagraph) {
      return content;
    }
    const targetIndex = afterParagraph - 1;
    if (targetIndex < matches.length - 1) {
      const match = matches[targetIndex];
      const insertPosition = match.index + match[0].length;
      return content.slice(0, insertPosition) + widgetHtml + content.slice(insertPosition);
    }
    return content;
  }
  const tagIds = article.article_tags?.map((at) => at.tags?.id).filter(Boolean) || [];
  const relatedArticles = await getRelatedArticlesForBacaJuga(article.id, article.category_id, tagIds);
  const bacaJugaHTML = generateBacaJugaHTML(relatedArticles);
  const contentWithWidget = injectBacaJugaWidget(article.content || "", bacaJugaHTML, 3);
  let thumbnailAltText = null;
  if (article.thumbnail_url) {
    if (article.thumbnail_alt) {
      thumbnailAltText = article.thumbnail_alt;
    } else {
      try {
        const { data: mediaMetadata } = await supabase.from("media_metadata").select("alt_text").eq("file_url", article.thumbnail_url).single();
        if (mediaMetadata?.alt_text) {
          thumbnailAltText = mediaMetadata.alt_text;
        }
      } catch (e) {
      }
    }
  }
  const tagsFromTags = article.article_tags?.map((at) => at.tags?.name).filter(Boolean) || [];
  const metaKeywordsArray = article.meta_keywords ? article.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean) : [];
  const allKeywords = [.../* @__PURE__ */ new Set([...tagsFromTags, ...metaKeywordsArray])];
  const tags = allKeywords.join(", ") || "";
  return renderTemplate(_b || (_b = __template(["", "  <script>(function(){", "\n  // Track article view on page load\n  (async () => {\n    try {\n      const response = await fetch(`/api/articles/${articleId}/view`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n      });\n\n      if (response.ok) {\n        const data = await response.json();\n        // Update view count display if element exists\n        const viewsElement = document.getElementById('article-views');\n        if (viewsElement && data.views_count !== undefined) {\n          viewsElement.textContent = data.views_count + ' dilihat';\n        }\n      }\n    } catch (error) {\n      // Silently fail - view tracking is not critical\n      console.error('Failed to track article view:', error);\n    }\n  })();\n})();</script>"], ["", "  <script>(function(){", "\n  // Track article view on page load\n  (async () => {\n    try {\n      const response = await fetch(\\`/api/articles/\\${articleId}/view\\`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n      });\n\n      if (response.ok) {\n        const data = await response.json();\n        // Update view count display if element exists\n        const viewsElement = document.getElementById('article-views');\n        if (viewsElement && data.views_count !== undefined) {\n          viewsElement.textContent = data.views_count + ' dilihat';\n        }\n      }\n    } catch (error) {\n      // Silently fail - view tracking is not critical\n      console.error('Failed to track article view:', error);\n    }\n  })();\n})();</script>"])), renderComponent($$result, "Layout", $$Layout, { "title": `${metaTitle} - SansStocks`, "description": metaDescription, "keywords": tags, "data-astro-cid-xrkb2nfi": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="min-h-screen bg-gray-50" data-astro-cid-xrkb2nfi> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-xrkb2nfi> <div class="grid lg:grid-cols-12 gap-8" data-astro-cid-xrkb2nfi> <!-- Main Article Content --> <article class="lg:col-span-8" data-astro-cid-xrkb2nfi>  <nav class="mb-6 text-sm text-gray-600" data-astro-cid-xrkb2nfi> <a href="/" class="hover:text-gray-900" data-astro-cid-xrkb2nfi>Beranda</a> <span class="mx-2" data-astro-cid-xrkb2nfi>/</span> <a href="/artikel" class="hover:text-gray-900" data-astro-cid-xrkb2nfi>Artikel</a> ${article.categories && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xrkb2nfi": true }, { "default": async ($$result3) => renderTemplate` <span class="mx-2" data-astro-cid-xrkb2nfi>/</span> <a${addAttribute(`/categories/${article.categories.slug}`, "href")} class="hover:text-gray-900" data-astro-cid-xrkb2nfi>${article.categories.name}</a> ` })}`} <span class="mx-2" data-astro-cid-xrkb2nfi>/</span> <span class="text-gray-900" data-astro-cid-xrkb2nfi>${article.title}</span> </nav>  <header class="mb-8" data-astro-cid-xrkb2nfi> ${article.categories && renderTemplate`<a${addAttribute(`/categories/${article.categories.slug}`, "href")} class="inline-block mb-4" data-astro-cid-xrkb2nfi> <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors" data-astro-cid-xrkb2nfi> ${article.categories.name} </span> </a>`} <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-astro-cid-xrkb2nfi> ${article.title} </h1> ${article.summary && renderTemplate`<p class="text-xl text-gray-600 mb-6 leading-relaxed" data-astro-cid-xrkb2nfi> ${article.summary} </p>`}  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6" data-astro-cid-xrkb2nfi> <time${addAttribute(article.published_at || article.created_at, "datetime")} data-astro-cid-xrkb2nfi> ${formatDate(article.published_at || article.created_at)} </time> ${readingTime > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xrkb2nfi": true }, { "default": async ($$result3) => renderTemplate` <span data-astro-cid-xrkb2nfi>•</span> <span data-astro-cid-xrkb2nfi>${readingTime} menit membaca</span> ` })}`} ${article.sources && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xrkb2nfi": true }, { "default": async ($$result3) => renderTemplate` <span data-astro-cid-xrkb2nfi>•</span> <span data-astro-cid-xrkb2nfi>Sumber: ${article.sources.name}</span> ` })}`} </div>  ${article.article_tags && article.article_tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6" data-astro-cid-xrkb2nfi> ${article.article_tags.map((at) => at.tags && renderTemplate`<a${addAttribute(`/tags/${at.tags.slug}`, "href")} class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors" data-astro-cid-xrkb2nfi>
#${at.tags.name} </a>`)} </div>`}  ${article.thumbnail_url && renderTemplate`<div class="mb-8 rounded-xl overflow-hidden" data-astro-cid-xrkb2nfi> ${renderComponent($$result2, "Image", $$Image, { "src": article.thumbnail_url, "alt": thumbnailAltText || article.title, "width": 1200, "height": 675, "class": "w-full h-auto object-cover", "loading": "eager", "format": "webp", "data-astro-cid-xrkb2nfi": true })} </div>`} </header>  <div class="prose prose-lg max-w-none bg-white rounded-xl p-8 shadow-sm mb-8" data-astro-cid-xrkb2nfi> <div data-astro-cid-xrkb2nfi>${unescapeHTML(contentWithWidget)}</div> ${renderComponent($$result2, "ImageDescription", ImageDescription, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/ImageDescription.tsx", "client:component-export": "default", "data-astro-cid-xrkb2nfi": true })} </div>  <footer class="pt-8 border-t border-gray-200" data-astro-cid-xrkb2nfi> ${article.url_original && renderTemplate`<div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200" data-astro-cid-xrkb2nfi> <p class="text-sm text-gray-700 mb-2" data-astro-cid-xrkb2nfi> <strong data-astro-cid-xrkb2nfi>Artikel Asli:</strong> </p> <a${addAttribute(article.url_original, "href")} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline text-sm" data-astro-cid-xrkb2nfi> ${article.url_original} </a> </div>`}  <div class="flex items-center gap-4" data-astro-cid-xrkb2nfi> <span class="text-sm font-medium text-gray-700" data-astro-cid-xrkb2nfi>Bagikan:</span> <div class="flex gap-2" data-astro-cid-xrkb2nfi> <a${addAttribute(`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`, "href")} target="_blank" rel="noopener noreferrer" class="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" aria-label="Share on Twitter" data-astro-cid-xrkb2nfi> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-xrkb2nfi> <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" data-astro-cid-xrkb2nfi></path> </svg> </a> <a${addAttribute(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, "href")} target="_blank" rel="noopener noreferrer" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" aria-label="Share on Facebook" data-astro-cid-xrkb2nfi> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-xrkb2nfi> <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" data-astro-cid-xrkb2nfi></path> </svg> </a> <a${addAttribute(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, "href")} target="_blank" rel="noopener noreferrer" class="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" aria-label="Share on LinkedIn" data-astro-cid-xrkb2nfi> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-xrkb2nfi> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" data-astro-cid-xrkb2nfi></path> </svg> </a> <button${addAttribute(`navigator.share({title: '${article.title}', text: '${metaDescription}', url: '${articleUrl}'})`, "onclick")} class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Share via native share" data-astro-cid-xrkb2nfi> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-xrkb2nfi> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" data-astro-cid-xrkb2nfi></path> </svg> </button> </div> </div> </footer>  ${renderComponent($$result2, "RelatedArticles", $$RelatedArticles, { "currentArticleId": article.id, "currentCategoryId": article.category_id, "currentTagIds": article.article_tags?.map((at) => at.tags?.id).filter(Boolean) || [], "data-astro-cid-xrkb2nfi": true })} </article> <!-- Sidebar --> <aside class="lg:col-span-4" data-astro-cid-xrkb2nfi> <div class="sticky top-8 space-y-4" data-astro-cid-xrkb2nfi> ${renderComponent($$result2, "FeaturedArticles", $$FeaturedArticles, { "currentArticleId": article.id, "data-astro-cid-xrkb2nfi": true })} ${renderComponent($$result2, "AdsWidget", $$AdsWidget, { "data-astro-cid-xrkb2nfi": true })} ${renderComponent($$result2, "PopularNews", $$PopularNews, { "currentArticleId": article.id, "data-astro-cid-xrkb2nfi": true })} </div> </aside> </div> </div></main> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="article"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="675"> ', '<meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> ', "", "", '<meta property="article:author" content="SansStocks"> ', '<meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', "> ", '<link rel="canonical"', "> ", "", '<script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(metaTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(articleImage, "content"), thumbnailAltText && renderTemplate`<meta property="og:image:alt"${addAttribute(thumbnailAltText, "content")}>`, addAttribute(articleUrl, "content"), article.published_at && renderTemplate`<meta property="article:published_time"${addAttribute(article.published_at, "content")}>`, article.updated_at && renderTemplate`<meta property="article:modified_time"${addAttribute(article.updated_at, "content")}>`, article.categories && renderTemplate`<meta property="article:section"${addAttribute(article.categories.name, "content")}>`, article.article_tags && article.article_tags.length > 0 && article.article_tags.map((at) => at.tags && renderTemplate`<meta property="article:tag"${addAttribute(at.tags.name, "content")}>`), addAttribute(metaTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(articleImage, "content"), thumbnailAltText && renderTemplate`<meta name="twitter:image:alt"${addAttribute(thumbnailAltText, "content")}>`, addAttribute(articleUrl, "href"), article.published_at && renderTemplate`<meta name="article:published_time"${addAttribute(article.published_at, "content")}>`, article.updated_at && renderTemplate`<meta name="article:modified_time"${addAttribute(article.updated_at, "content")}>`, unescapeHTML(JSON.stringify((() => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": metaDescription,
      "image": {
        "@type": "ImageObject",
        "url": articleImage,
        "width": 1200,
        "height": 675
      },
      "datePublished": article.published_at || article.created_at,
      "dateModified": article.updated_at || article.created_at,
      "author": {
        "@type": "Organization",
        "name": "SansStocks",
        "url": siteUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "SansStocks",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "width": 200,
          "height": 200
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      }
    };
    if (thumbnailAltText) {
      articleSchema.image.caption = thumbnailAltText;
    }
    if (article.categories) {
      articleSchema.articleSection = article.categories.name;
    }
    if (wordCount > 0) {
      articleSchema.wordCount = wordCount;
    }
    if (readingTime > 0) {
      articleSchema.timeRequired = `PT${readingTime}M`;
    }
    if (allKeywords.length > 0) {
      articleSchema.keywords = allKeywords.join(", ");
    }
    return articleSchema;
  })())), unescapeHTML(JSON.stringify((() => {
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Artikel",
        "item": `${siteUrl}/artikel`
      }
    ];
    if (article.categories) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": article.categories.name,
        "item": `${siteUrl}/categories/${article.categories.slug}`
      });
    }
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": article.categories ? 4 : 3,
      "name": article.title,
      "item": articleUrl
    });
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
  })()))) })}` }), defineScriptVars({ articleId: article.id }));
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/artikel/[slug].astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/artikel/[slug].astro";
const $$url = "/artikel/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
