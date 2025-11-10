/* empty css                                  */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../chunks/Layout_DE1DG0QU.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../chunks/Card_CppDnIQN.mjs';
import { B as Badge } from '../chunks/Badge_iQRQmODX.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const pageUrl = `${siteUrl}/artikel`;
  const pageTitle = "Artikel Terbaru - SansStocks";
  const pageDescription = "Temukan analisis mendalam, berita terkini, dan insight terbaru dari dunia ekonomi dan pasar saham Indonesia.";
  const pageImage = `${siteUrl}/logo.png`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": "artikel ekonomi, berita saham, analisis pasar, investasi Indonesia, pasar modal" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="min-h-screen bg-gray-50"> <!-- Header Section --> <section class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16"> <div class="max-w-7xl mx-auto px-4"> <div class="text-center"> <h1 class="text-4xl md:text-5xl font-bold mb-4">Artikel Terbaru</h1> <p class="text-xl text-blue-100 max-w-2xl mx-auto">
Temukan analisis mendalam, berita terkini, dan insight terbaru dari dunia ekonomi dan pasar saham
</p> </div> </div> </section> <!-- Filter & Search Section --> <section class="py-8 bg-white border-b"> <div class="max-w-7xl mx-auto px-4"> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"> <!-- Search --> <div class="relative flex-1 max-w-md"> <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <circle cx="11" cy="11" r="8"></circle> <path d="m21 21-4.35-4.35"></path> </svg> <input type="text" placeholder="Cari artikel..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"> </div> <!-- Filter Buttons --> <div class="flex flex-wrap gap-2"> ${renderComponent($$result2, "Badge", Badge, { "variant": "default", "className": "cursor-pointer hover:bg-blue-700" }, { "default": ($$result3) => renderTemplate`Semua` })} ${renderComponent($$result2, "Badge", Badge, { "variant": "outline", "className": "cursor-pointer hover:bg-gray-100" }, { "default": ($$result3) => renderTemplate`Ekonomi` })} ${renderComponent($$result2, "Badge", Badge, { "variant": "outline", "className": "cursor-pointer hover:bg-gray-100" }, { "default": ($$result3) => renderTemplate`Saham` })} ${renderComponent($$result2, "Badge", Badge, { "variant": "outline", "className": "cursor-pointer hover:bg-gray-100" }, { "default": ($$result3) => renderTemplate`Kripto` })} ${renderComponent($$result2, "Badge", Badge, { "variant": "outline", "className": "cursor-pointer hover:bg-gray-100" }, { "default": ($$result3) => renderTemplate`Analisis` })} </div> </div> </div> </section> <!-- Articles Grid --> <section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Article 1 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-blue-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Ekonomi` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">2 jam yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-blue-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
Bank Indonesia Pertahankan Suku Bunga Acuan di 6%
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
BI memutuskan untuk mempertahankan BI 7-Day Reverse Repo Rate di level 6% untuk periode November 2024...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
TE
</div> <div> <p class="text-sm font-medium">Tim Editorial</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/bank-indonesia-suku-bunga" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} <!-- Article 2 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-green-500 to-green-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-green-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Saham` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">4 jam yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-green-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
IHSG Menguat 0.8% di Sesi Pagi
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Indeks Harga Saham Gabungan (IHSG) menguat 0.8% pada sesi pagi didukung oleh sentimen positif...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
AP
</div> <div> <p class="text-sm font-medium">Analis Pasar</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/ihsg-menguat" class="text-green-600 hover:text-green-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} <!-- Article 3 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-purple-500 to-purple-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-purple-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Kripto` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">6 jam yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-purple-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
Bitcoin Stabil di Level $65,000
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Harga Bitcoin tetap stabil di kisaran $65,000 dengan volume perdagangan yang meningkat signifikan...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
KE
</div> <div> <p class="text-sm font-medium">Kripto Expert</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/bitcoin-stabil" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} <!-- Article 4 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-orange-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Analisis` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">1 hari yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-orange-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
Analisis Fundamental Saham Bank BCA
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Tinjauan mendalam terhadap kinerja fundamental PT Bank Central Asia Tbk (BBCA) dengan fokus pada...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
AF
</div> <div> <p class="text-sm font-medium">Analis Fundamental</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/analisis-bca" class="text-orange-600 hover:text-orange-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} <!-- Article 5 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-red-500 to-red-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-red-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Ekonomi` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">2 hari yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-red-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
Inflasi Indonesia Turun ke 2.86% di Oktober
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Badan Pusat Statistik (BPS) melaporkan inflasi Indonesia turun menjadi 2.86% year-on-year di Oktober 2024...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
ES
</div> <div> <p class="text-sm font-medium">Ekonom Senior</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/inflasi-oktober" class="text-red-600 hover:text-red-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} <!-- Article 6 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" }, { "default": ($$result3) => renderTemplate` <div class="aspect-video bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-t-lg relative overflow-hidden"> <div class="absolute inset-0 bg-black/20"></div> <div class="absolute top-4 left-4"> ${renderComponent($$result3, "Badge", Badge, { "className": "bg-white text-indigo-600 hover:bg-white" }, { "default": ($$result4) => renderTemplate`Pasar` })} </div> <div class="absolute bottom-4 left-4 text-white"> <p class="text-sm opacity-90">3 hari yang lalu</p> </div> </div> ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "group-hover:text-indigo-600 transition-colors" }, { "default": ($$result5) => renderTemplate`
Rupiah Menguat Terhadap Dolar AS
` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Nilai tukar rupiah menguat 0.3% terhadap dolar AS di perdagangan pagi ini, didukung oleh aliran modal masuk...
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
FA
</div> <div> <p class="text-sm font-medium">Forex Analyst</p> <p class="text-xs text-gray-500">SansStocks</p> </div> </div> <a href="/artikel/rupiah-menguat" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
Baca →
</a> </div> ` })} ` })} </div> <!-- Load More Button --> <div class="text-center mt-12"> <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
Muat Lebih Banyak
</button> </div> </div> </section> </main> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="website"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <link rel="canonical"', '> <script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(pageUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(pageUrl, "href"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Artikel Terbaru",
    "description": pageDescription,
    "url": pageUrl
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
        "name": "Artikel",
        "item": pageUrl
      }
    ]
  }))) })}` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/artikel/index.astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/artikel/index.astro";
const $$url = "/artikel";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
