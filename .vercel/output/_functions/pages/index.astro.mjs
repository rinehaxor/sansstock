/* empty css                                  */
import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderComponent, F as Fragment, d as renderTemplate, e as defineScriptVars, u as unescapeHTML } from '../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../chunks/Layout_DE1DG0QU.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_D8cCpO2h.mjs';
import { s as supabase } from '../chunks/supabase_Bf3LIET_.mjs';
import { C as Card, a as CardHeader, d as CardContent } from '../chunks/Card_CppDnIQN.mjs';
import { $ as $$PopularNews } from '../chunks/PopularNews_BVe-mpkZ.mjs';
import { $ as $$AdsWidget } from '../chunks/AdsWidget_BviAvjVc.mjs';
import { jsxs, Fragment as Fragment$1, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const $$Astro$5 = createAstro();
const $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ArticleCard;
  const {
    title,
    excerpt,
    category,
    categoryColor,
    timeAgo,
    author = "Tim Editorial",
    authorInitials = "TE",
    link,
    isLarge = false,
    thumbnailUrl,
    thumbnailAlt,
    eagerLoad = false
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`rounded-lg border bg-white text-card-foreground shadow-md ${isLarge ? "lg:col-span-2" : ""} group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col`, "class")}>  <div${addAttribute(`w-full ${isLarge ? "aspect-[21/9]" : "aspect-[16/6.5]"} bg-gradient-to-br ${categoryColor} relative overflow-hidden flex-shrink-0`, "class")}> ${thumbnailUrl ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Image", $$Image, { "src": thumbnailUrl, "alt": thumbnailAlt || title, "width": isLarge ? 800 : 400, "height": isLarge ? 343 : 225, "class": "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300", "loading": isLarge || eagerLoad ? "eager" : "lazy", "format": "webp" })} <div class="absolute inset-0 bg-black/20"></div> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <div class="absolute inset-0 bg-black/20"></div> <div class="absolute inset-0 flex items-center justify-center"> <svg${addAttribute(isLarge ? "80" : "50", "width")}${addAttribute(isLarge ? "80" : "50", "height")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"${addAttribute(`text-white/80 ${isLarge ? "w-20 h-20 sm:w-24 sm:h-24" : "w-10 h-10"}`, "class")}> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect> <circle cx="8.5" cy="8.5" r="1.5"></circle> <polyline points="21,15 16,10 5,21"></polyline> </svg> </div> ` })}`} <div class="absolute top-2 left-2 z-10"> <span class="px-1.5 py-0.5 bg-white text-gray-800 hover:bg-white text-xs font-medium rounded-md">${category}</span> </div> <div class="absolute bottom-2 left-2 text-white z-10"> <p class="text-xs opacity-90">${timeAgo}</p> </div> </div>  <div${addAttribute(`flex flex-col flex-1 ${isLarge ? "p-4 sm:p-5" : "p-3"}`, "class")}> <h3${addAttribute(`${isLarge ? "text-lg sm:text-xl md:text-2xl mb-2" : "text-sm mb-1.5"} font-semibold tracking-tight leading-tight group-hover:text-blue-600 transition-colors line-clamp-2`, "class")}>${title}</h3> <p${addAttribute(`${isLarge ? "text-sm sm:text-base mb-3" : "text-xs mb-2"} text-muted-foreground leading-relaxed line-clamp-2`, "class")}>${excerpt}</p> <div class="mt-auto flex items-center justify-between pt-2 border-t border-gray-100"> <div class="flex items-center space-x-1.5"> <div${addAttribute(`${isLarge ? "h-7 w-7" : "h-5 w-5"} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`, "class")}> <span${addAttribute(`${isLarge ? "text-xs" : "text-[10px]"} font-medium text-gray-600`, "class")}>${authorInitials || "A"}</span> </div> <div> <p${addAttribute(`${isLarge ? "text-xs" : "text-[10px]"} font-medium leading-tight`, "class")}>${author || "Tim Editorial"}</p> <p${addAttribute(`${isLarge ? "text-xs" : "text-[10px]"} text-gray-500 leading-tight`, "class")}>SansStocks</p> </div> </div> <a${addAttribute(link, "href")}${addAttribute(`text-blue-600 hover:text-blue-700 font-medium ${isLarge ? "flex items-center group text-sm" : "text-xs"}`, "class")}> ${isLarge ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <span>Baca</span> <svg class="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> ` })}` : "Baca \u2192"} </a> </div> </div> </article>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/ArticleCard.astro", void 0);

const $$FeaturedNews = createComponent(async ($$result, $$props, $$slots) => {
  const { data: featuredArticles } = await supabase.from("articles").select(`
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
  `).eq("status", "published").eq("featured", true).order("published_at", { ascending: false }).limit(3);
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
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    if (diffInSeconds < 2592e3) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;
    return `${Math.floor(diffInSeconds / 2592e3)} bulan yang lalu`;
  }
  function getCategoryColor(categoryName) {
    const colors = {
      "Ekonomi": "from-blue-500 to-blue-600",
      "Saham": "from-green-500 to-green-600",
      "Kripto": "from-purple-500 to-purple-600",
      "Market": "from-orange-500 to-orange-600",
      "Energi": "from-yellow-500 to-yellow-600",
      "Sektor Riil": "from-red-500 to-red-600",
      "Gaya Hidup": "from-pink-500 to-pink-600"
    };
    return colors[categoryName] || "from-gray-500 to-gray-600";
  }
  return renderTemplate`${maybeRenderHead()}<section class="mb-16"> <div class="grid lg:grid-cols-3 gap-6"> ${articlesWithAltText && articlesWithAltText.length > 0 ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "title": articlesWithAltText[0].title, "excerpt": articlesWithAltText[0].summary || "Tidak ada ringkasan tersedia...", "category": articlesWithAltText[0].categories?.name || "Berita", "categoryColor": getCategoryColor(articlesWithAltText[0].categories?.name || ""), "timeAgo": getTimeAgo(articlesWithAltText[0].published_at), "author": "Tim Editorial", "authorInitials": "TE", "link": `/artikel/${articlesWithAltText[0].slug}`, "isLarge": true, "thumbnailUrl": articlesWithAltText[0].thumbnail_url, "thumbnailAlt": articlesWithAltText[0].thumbnail_alt })} <div class="lg:col-span-1 flex flex-col gap-4"> ${articlesWithAltText.slice(1, 3).map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "title": article.title, "excerpt": article.summary || "Tidak ada ringkasan tersedia...", "category": article.categories?.name || "Berita", "categoryColor": getCategoryColor(article.categories?.name || ""), "timeAgo": getTimeAgo(article.published_at), "author": "Tim Editorial", "authorInitials": "TE", "link": `/artikel/${article.slug}`, "thumbnailUrl": article.thumbnail_url, "thumbnailAlt": article.thumbnail_alt, "eagerLoad": true })}`)} </div> ` })}` : renderTemplate`<div class="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-12 text-center"> <p class="text-gray-500 text-lg">Belum ada artikel featured yang diterbitkan.</p> <p class="text-gray-400 text-sm mt-2">Silakan tandai artikel sebagai featured dari dashboard admin.</p> </div>`} </div> </section>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/FeaturedNews.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$4 = createAstro();
const $$MarketCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MarketCard;
  const { name, value, change, changeType, iconColor, iconBgColor, symbol } = Astro2.props;
  const changeColor = changeType === "positive" ? "text-white bg-green-600" : "text-white bg-red-600";
  return renderTemplate`${renderComponent($$result, "Card", Card, { "class": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CardHeader", CardHeader, { "class": "pb-4" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="flex justify-between items-start"> <div${addAttribute(`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`, "class")}> <svg${addAttribute(`w-6 h-6 ${iconColor}`, "class")} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"> ${changeType === "positive" ? renderTemplate`<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>` : renderTemplate`<path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>`} </svg> </div> <span${addAttribute(`px-3 py-1.5 ${changeColor} text-xs font-bold rounded-full flex items-center gap-1 whitespace-nowrap`, "class")}> ${change} </span> </div> ` })} ${renderComponent($$result2, "CardContent", CardContent, { "class": "pt-0" }, { "default": async ($$result3) => renderTemplate` <div class="space-y-2"${addAttribute(symbol || "", "data-market-card")}> <h3 class="text-sm font-medium text-gray-700 uppercase tracking-wide">${name}</h3> <div class="text-3xl font-bold text-gray-900" data-value>${value}</div> <div class="text-sm text-gray-600" data-change>${change}</div> </div> ` })} ` })} ${symbol && renderTemplate(_a$1 || (_a$1 = __template$1(["<script>(function(){", "\n		// Real-time update untuk market data\n		const card = document.querySelector(`[data-market-card=\"${symbolValue}\"]`);\n		if (!card) return;\n\n		const valueEl = card.querySelector('[data-value]');\n		const changeEl = card.querySelector('[data-change]');\n		\n		if (!valueEl || !changeEl) return;\n\n		async function updateMarketData() {\n			try {\n				const response = await fetch(`/api/market?symbols=${symbolValue}`);\n				if (!response.ok) return;\n				\n				const result = await response.json();\n				const marketData = result.data?.find((item: any) => item.symbol === symbolValue);\n				\n				if (marketData) {\n					// Update value dengan animasi\n					if (valueEl.textContent !== marketData.value) {\n						(valueEl as HTMLElement).style.transition = 'all 0.3s ease';\n						(valueEl as HTMLElement).style.transform = 'scale(1.05)';\n						setTimeout(() => {\n							if (valueEl) {\n								valueEl.textContent = marketData.value;\n								(valueEl as HTMLElement).style.transform = 'scale(1)';\n							}\n						}, 150);\n					}\n					\n					// Update change\n					if (changeEl.textContent !== marketData.change) {\n						(changeEl as HTMLElement).style.transition = 'all 0.3s ease';\n						(changeEl as HTMLElement).style.opacity = '0.5';\n						setTimeout(() => {\n							if (changeEl) {\n								changeEl.textContent = marketData.change;\n								(changeEl as HTMLElement).style.opacity = '1';\n							}\n						}, 150);\n					}\n				}\n			} catch (error) {\n				console.error('Error updating market data:', error);\n			}\n		}\n\n		// Update setiap 30 detik (bisa disesuaikan)\n		const intervalId = setInterval(updateMarketData, 30000);\n		\n		// Cleanup saat component di-unmount\n		if (typeof window !== 'undefined') {\n			window.addEventListener('beforeunload', () => {\n				clearInterval(intervalId);\n			});\n		}\n	})();<\/script>"], ["<script>(function(){", "\n		// Real-time update untuk market data\n		const card = document.querySelector(\\`[data-market-card=\"\\${symbolValue}\"]\\`);\n		if (!card) return;\n\n		const valueEl = card.querySelector('[data-value]');\n		const changeEl = card.querySelector('[data-change]');\n		\n		if (!valueEl || !changeEl) return;\n\n		async function updateMarketData() {\n			try {\n				const response = await fetch(\\`/api/market?symbols=\\${symbolValue}\\`);\n				if (!response.ok) return;\n				\n				const result = await response.json();\n				const marketData = result.data?.find((item: any) => item.symbol === symbolValue);\n				\n				if (marketData) {\n					// Update value dengan animasi\n					if (valueEl.textContent !== marketData.value) {\n						(valueEl as HTMLElement).style.transition = 'all 0.3s ease';\n						(valueEl as HTMLElement).style.transform = 'scale(1.05)';\n						setTimeout(() => {\n							if (valueEl) {\n								valueEl.textContent = marketData.value;\n								(valueEl as HTMLElement).style.transform = 'scale(1)';\n							}\n						}, 150);\n					}\n					\n					// Update change\n					if (changeEl.textContent !== marketData.change) {\n						(changeEl as HTMLElement).style.transition = 'all 0.3s ease';\n						(changeEl as HTMLElement).style.opacity = '0.5';\n						setTimeout(() => {\n							if (changeEl) {\n								changeEl.textContent = marketData.change;\n								(changeEl as HTMLElement).style.opacity = '1';\n							}\n						}, 150);\n					}\n				}\n			} catch (error) {\n				console.error('Error updating market data:', error);\n			}\n		}\n\n		// Update setiap 30 detik (bisa disesuaikan)\n		const intervalId = setInterval(updateMarketData, 30000);\n		\n		// Cleanup saat component di-unmount\n		if (typeof window !== 'undefined') {\n			window.addEventListener('beforeunload', () => {\n				clearInterval(intervalId);\n			});\n		}\n	})();<\/script>"])), defineScriptVars({ symbolValue: symbol }))}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/MarketCard.astro", void 0);

const $$Astro$3 = createAstro();
const $$MarketOverview = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$MarketOverview;
  let marketData = [];
  try {
    const response = await fetch(`${Astro2.url.origin}/api/market`, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (response.ok) {
      const result = await response.json();
      marketData = result.data || [];
    }
  } catch (error) {
    console.error("Error fetching market data:", error);
  }
  const defaultMarketData = [
    {
      name: "IHSG",
      symbol: "^JKSE",
      value: "7,234.56",
      change: "+1.2%",
      changePercent: 1.2,
      changeType: "positive"
    },
    {
      name: "USD/IDR",
      symbol: "IDR=X",
      value: "15,420",
      change: "-0.3%",
      changePercent: -0.3,
      changeType: "negative"
    },
    {
      name: "Bitcoin",
      symbol: "BTC-USD",
      value: "$65,234",
      change: "+2.1%",
      changePercent: 2.1,
      changeType: "positive"
    },
    {
      name: "Emas",
      symbol: "GC=F",
      value: "$2,045",
      change: "+0.8%",
      changePercent: 0.8,
      changeType: "positive"
    }
  ];
  const displayData = marketData.length > 0 ? marketData : defaultMarketData;
  function getIconConfig(symbol, changeType) {
    const configs = {
      "^JKSE": { iconColor: "text-white", iconBgColor: "bg-green-600" },
      "IDR=X": { iconColor: "text-white", iconBgColor: changeType === "positive" ? "bg-green-600" : "bg-red-600" },
      "BTC-USD": { iconColor: "text-white", iconBgColor: "bg-orange-600" },
      "GC=F": { iconColor: "text-white", iconBgColor: "bg-yellow-500" }
    };
    return configs[symbol] || {
      iconColor: changeType === "positive" ? "text-white" : "text-white",
      iconBgColor: changeType === "positive" ? "bg-green-600" : "bg-red-600"
    };
  }
  return renderTemplate`${maybeRenderHead()}<section class="mb-16"> <div class="flex items-center justify-between mb-8"> <h2 class="text-3xl font-bold text-gray-900">Ringkasan Pasar</h2> <a href="/pasar" class="text-blue-600 hover:text-blue-700 font-medium flex items-center group">
Lihat Detail
<svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${displayData.map((item) => {
    const iconConfig = getIconConfig(item.symbol, item.changeType);
    return renderTemplate`${renderComponent($$result, "MarketCard", $$MarketCard, { "name": item.name, "value": item.value, "change": item.change, "changeType": item.changeType, "iconColor": iconConfig.iconColor, "iconBgColor": iconConfig.iconBgColor, "symbol": item.symbol })}`;
  })} </div> </section>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/MarketOverview.astro", void 0);

function NewsListClient({ initialPage = 1, initialArticles = [], initialTotalPages = 1, initialTotalArticles = 0 }) {
  const [articles, setArticles] = useState(initialArticles);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalArticles, setTotalArticles] = useState(initialTotalArticles);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles?page=${page}&limit=${limit}&status=published`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setArticles(data);
        setTotalPages(result.totalPages || Math.ceil((result.total || 0) / limit));
        setTotalArticles(result.total || 0);
        setCurrentPage(page);
        const url = new URL(window.location.href);
        if (page === 1) {
          url.searchParams.delete("page");
        } else {
          url.searchParams.set("page", page.toString());
        }
        window.history.pushState({ page }, "", url.toString());
        const newsSection = document.getElementById("news-list-section");
        if (newsSection) {
          const articlesHTML = data.map((article) => {
            const category = article.categories?.name || "Umum";
            const timeAgo = getTimeAgo(article.published_at || article.created_at);
            const articleUrl = `/artikel/${article.slug}`;
            return `
                     <article class="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <a href="${articleUrl}" class="flex gap-6">
                           <div class="flex-shrink-0">
                              ${article.thumbnail_url ? `<img src="${article.thumbnail_url}" alt="${article.thumbnail_alt || article.title || "Article thumbnail"}" class="w-48 h-28 rounded-lg object-cover" loading="lazy" />` : `<div class="w-48 h-28 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                    <svg class="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                    </svg>
                                 </div>`}
                           </div>
                           <div class="flex-1 min-w-0">
                              <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 leading-tight">${article.title}</h3>
                              <p class="text-sm text-gray-600 mb-3 line-clamp-2">${article.summary || "Tidak ada ringkasan tersedia..."}</p>
                              <p class="text-sm text-blue-600 font-medium">
                                 ${category} | ${timeAgo}
                              </p>
                           </div>
                        </a>
                     </article>
                  `;
          }).join("");
          newsSection.innerHTML = articlesHTML;
          newsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchArticles(page);
    }
  };
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    if (diffInSeconds < 2592e3) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;
    return `${Math.floor(diffInSeconds / 2592e3)} bulan yang lalu`;
  };
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    loading && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-12 text-center mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg mt-4", children: "Memuat artikel..." })
    ] }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mt-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage - 1),
          disabled: currentPage <= 1 || loading,
          className: `px-4 py-2 rounded-lg border transition-colors ${currentPage > 1 && !loading ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"}`,
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "px-4 py-2 text-sm text-gray-700", children: [
        "Halaman ",
        currentPage,
        " dari ",
        totalPages
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage + 1),
          disabled: currentPage >= totalPages || loading,
          className: `px-4 py-2 rounded-lg border transition-colors ${currentPage < totalPages && !loading ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"}`,
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
        }
      )
    ] })
  ] });
}

const $$Astro$2 = createAstro();
const $$NewsCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$NewsCard;
  const {
    title,
    slug,
    summary,
    thumbnail_url,
    thumbnail_alt,
    published_at,
    created_at,
    categories
  } = Astro2.props;
  function getTimeAgo(dateString) {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    if (diffInSeconds < 2592e3) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;
    return `${Math.floor(diffInSeconds / 2592e3)} bulan yang lalu`;
  }
  const category = categories?.name || "Umum";
  const timeAgo = getTimeAgo(published_at || created_at);
  const articleUrl = `/artikel/${slug}`;
  return renderTemplate`${maybeRenderHead()}<article class="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"> <a${addAttribute(articleUrl, "href")} class="flex gap-6"> <div class="flex-shrink-0"> ${thumbnail_url ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": thumbnail_url, "alt": thumbnail_alt || title || "Article thumbnail", "width": 192, "height": 112, "class": "w-48 h-28 rounded-lg object-cover", "loading": "lazy", "format": "webp" })}` : renderTemplate`<div class="w-48 h-28 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center"> <svg class="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path> </svg> </div>`} </div> <div class="flex-1 min-w-0"> <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 leading-tight">${title}</h3> <p class="text-sm text-gray-600 mb-3 line-clamp-2">${summary || "Tidak ada ringkasan tersedia..."}</p> <p class="text-sm text-blue-600 font-medium"> ${category} | ${timeAgo} </p> </div> </a> </article>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/NewsCard.astro", void 0);

const $$Astro$1 = createAstro();
const $$NewsList = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$NewsList;
  const page = parseInt(Astro2.url.searchParams.get("page") || "1");
  const limit = 10;
  const offset = (page - 1) * limit;
  const { data: articles, error, count } = await supabase.from("articles").select(`
    id,
    title,
    slug,
    summary,
    thumbnail_url,
    published_at,
    created_at,
    views_count,
    categories:category_id (
      id,
      name,
      slug
    )
  `, { count: "exact" }).eq("status", "published").order("published_at", { ascending: false }).range(offset, offset + limit - 1);
  const totalArticles = count || 0;
  const totalPages = Math.ceil(totalArticles / limit);
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
    (articles || []).map(async (article) => {
      const altText = await getAltText(article.thumbnail_url);
      return {
        ...article,
        thumbnail_alt: altText
      };
    })
  );
  return renderTemplate`${maybeRenderHead()}<section class="mb-16"> <div class="flex items-center justify-between mb-8"> <h2 class="text-3xl font-bold text-gray-900">Terkini</h2> <a href="/artikel" class="text-blue-600 hover:text-blue-700 font-medium flex items-center group">
Lihat Semua
<svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> <div class="grid lg:grid-cols-3 gap-8"> <!-- Main News Content --> <div class="lg:col-span-2"> <!-- Initial Articles (Server-side rendered with Astro Image) --> <div id="news-list-section" class="space-y-6"> ${articlesWithAltText && articlesWithAltText.length > 0 ? articlesWithAltText.map((article) => renderTemplate`${renderComponent($$result, "NewsCard", $$NewsCard, { "id": article.id, "title": article.title, "slug": article.slug, "summary": article.summary, "thumbnail_url": article.thumbnail_url, "thumbnail_alt": article.thumbnail_alt, "published_at": article.published_at, "created_at": article.created_at, "categories": article.categories })}`) : renderTemplate`<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"> <p class="text-gray-500 text-lg">Belum ada artikel yang diterbitkan.</p> <p class="text-gray-400 text-sm mt-2">Silakan publikasikan artikel dari dashboard admin.</p> </div>`} </div> <!-- Pagination and Client-side Loading --> ${renderComponent($$result, "NewsListClient", NewsListClient, { "client:load": true, "initialPage": page, "initialArticles": articlesWithAltText, "initialTotalPages": totalPages, "initialTotalArticles": totalArticles, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/NewsListClient.tsx", "client:component-export": "default" })} </div> <!-- Popular News Sidebar --> <div class="lg:col-span-1"> ${renderComponent($$result, "PopularNews", $$PopularNews, {})} ${renderComponent($$result, "AdsWidget", $$AdsWidget, {})} <!-- Market Ticker Widget --> <div class="mt-6"> <iframe title="Market Ticker"${addAttribute(`https://pintu.co.id/widget/market-ticker?source=${Astro2.url.origin}`, "src")} width="100%" height="50" style="border:none; border-radius:8px; overflow:hidden;" loading="lazy"></iframe> </div> </div> </div> </section>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/NewsList.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const pageTitle = "SansStocks - Berita Ekonomi & Analisis Pasar Terpercaya";
  const pageDescription = "Portal berita ekonomi, saham, dan analisis pasar terpercaya. Dapatkan insight terbaru tentang pasar modal Indonesia, analisis saham, dan berita ekonomi terkini.";
  const pageImage = `${siteUrl}/logo.png`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": "berita ekonomi, saham, pasar modal, analisis finansial, investasi, IHSG, rupiah, ekonomi Indonesia" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ${renderComponent($$result2, "FeaturedNews", $$FeaturedNews, {})} ${renderComponent($$result2, "MarketOverview", $$MarketOverview, {})} ${renderComponent($$result2, "NewsList", $$NewsList, {})} </div> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="website"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <link rel="canonical"', '> <meta name="author" content="SansStocks"> <meta name="publisher" content="SansStocks"> <script type="application/ld+json">', '</script> <script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(siteUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(siteUrl, "href"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SansStocks",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`,
      "width": 200,
      "height": 200
    },
    "sameAs": [
      // Tambahkan social media links jika ada
      // "https://twitter.com/sansstocks",
      // "https://facebook.com/sansstocks"
    ]
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SansStocks",
    "url": siteUrl,
    "description": pageDescription,
    "publisher": {
      "@type": "Organization",
      "name": "SansStocks"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/artikel?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": siteUrl
    }]
  }))) })}` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/index.astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
