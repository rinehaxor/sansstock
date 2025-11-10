import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderComponent, d as renderTemplate, F as Fragment } from './astro/server_DJYPjeXe.mjs';
import { $ as $$Image } from './_astro_assets_D8cCpO2h.mjs';
import { s as supabase } from './supabase_Bf3LIET_.mjs';

const $$Astro = createAstro();
const $$PopularNews = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PopularNews;
  const currentArticleId = Astro2.props.currentArticleId || null;
  const sevenDaysAgo = /* @__PURE__ */ new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();
  let query = supabase.from("articles").select(`
      id,
      title,
      slug,
      thumbnail_url,
      published_at,
      views_count
   `).eq("status", "published").gte("published_at", sevenDaysAgoISO).order("views_count", { ascending: false, nullsFirst: false }).limit(5);
  if (currentArticleId) {
    query = query.neq("id", currentArticleId);
  }
  const { data: articles } = await query;
  const popularArticles = articles && articles.length > 0 ? articles : [];
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
    (popularArticles || []).map(async (article) => {
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
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"> <h3 class="text-lg font-bold text-gray-900 mb-4">Populer</h3> ${articlesWithAltText && articlesWithAltText.length > 0 ? renderTemplate`<div class="space-y-3"> ${articlesWithAltText.map((article) => renderTemplate`<a${addAttribute(`/artikel/${article.slug}`, "href")} class="block group"> <div class="flex gap-3"> ${article.thumbnail_url ? renderTemplate`<div class="flex-shrink-0"> ${renderComponent($$result, "Image", $$Image, { "src": article.thumbnail_url, "alt": article.thumbnail_alt || article.title, "width": 64, "height": 48, "class": "w-16 h-12 rounded-lg object-cover", "loading": "lazy", "format": "webp" })} </div>` : renderTemplate`<div class="flex-shrink-0 w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path> </svg> </div>`} <div class="flex-1 min-w-0"> <h4 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug"> ${article.title} </h4> <div class="flex items-center gap-2 mt-1"> ${article.published_at && renderTemplate`<p class="text-xs text-gray-500"> ${getTimeAgo(article.published_at)} </p>`} ${article.views_count !== void 0 && article.views_count !== null && article.views_count > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <span class="text-xs text-gray-400">•</span> <p class="text-xs text-gray-500"> ${article.views_count} dilihat
</p> ` })}`} </div> </div> </div> </a>`)} </div>` : renderTemplate`<p class="text-sm text-gray-500">Belum ada artikel populer.</p>`} </div>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/PopularNews.astro", void 0);

export { $$PopularNews as $ };
