/* empty css                                  */
import { c as createComponent, d as renderTemplate, u as unescapeHTML, m as maybeRenderHead, a as createAstro, r as renderComponent, F as Fragment, b as addAttribute } from '../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../chunks/Layout_DE1DG0QU.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$FAQ = createComponent(($$result, $$props, $$slots) => {
  const faqData = [
    {
      question: "Apa itu investasi saham?",
      answer: "Investasi saham adalah kegiatan membeli sebagian kepemilikan (saham) dari suatu perusahaan yang terdaftar di bursa efek. Dengan membeli saham, Anda menjadi pemegang saham dan berhak atas dividen serta potensi capital gain jika harga saham naik."
    },
    {
      question: "Bagaimana cara mulai investasi saham di Indonesia?",
      answer: "Untuk mulai investasi saham di Indonesia, Anda perlu membuka rekening efek di perusahaan sekuritas yang terdaftar di OJK. Setelah itu, deposit dana ke rekening efek, lalu Anda bisa mulai membeli saham melalui aplikasi trading atau platform online yang disediakan sekuritas."
    },
    {
      question: "Apa perbedaan antara saham dan reksa dana?",
      answer: "Saham adalah kepemilikan langsung di perusahaan tertentu, sedangkan reksa dana adalah wadah yang mengumpulkan dana dari investor untuk dikelola oleh manajer investasi ke berbagai instrumen seperti saham, obligasi, atau pasar uang. Reksa dana lebih cocok untuk investor pemula karena dikelola profesional."
    },
    {
      question: "Apa itu IHSG (Indeks Harga Saham Gabungan)?",
      answer: "IHSG adalah indeks yang mengukur performa keseluruhan pasar saham Indonesia. IHSG dihitung berdasarkan harga saham-saham yang terdaftar di Bursa Efek Indonesia (BEI). Kenaikan IHSG menunjukkan kondisi pasar saham yang positif secara umum."
    },
    {
      question: "Bagaimana cara membaca laporan keuangan perusahaan?",
      answer: "Laporan keuangan terdiri dari Neraca (posisi keuangan), Laporan Laba Rugi (kinerja operasional), dan Laporan Arus Kas. Fokus pada rasio-rasio penting seperti ROE (Return on Equity), Debt to Equity Ratio, dan pertumbuhan pendapatan untuk menilai kesehatan finansial perusahaan."
    },
    {
      question: "Apa risiko investasi saham?",
      answer: "Risiko utama investasi saham adalah capital loss (kerugian modal) jika harga saham turun, risiko likuiditas (sulit menjual saham), dan risiko perusahaan (kebangkrutan atau penurunan kinerja). Diversifikasi portofolio dan investasi jangka panjang dapat membantu mengurangi risiko."
    },
    {
      question: "Kapan waktu terbaik untuk membeli saham?",
      answer: "Tidak ada waktu 'terbaik' yang pasti. Prinsip investasi value adalah membeli saat harga di bawah nilai intrinsik. Namun, untuk investor jangka panjang, strategi dollar-cost averaging (investasi rutin) lebih efektif daripada timing the market."
    },
    {
      question: "Apa itu dividen?",
      answer: "Dividen adalah pembagian keuntungan perusahaan kepada pemegang saham. Dividen biasanya dibayarkan secara berkala (tahunan atau triwulanan) dari laba bersih perusahaan. Tidak semua perusahaan membagikan dividen, beberapa memilih untuk menginvestasikan kembali laba untuk pertumbuhan."
    }
  ];
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="space-y-6"> ', ' </div> <script type="application/ld+json">', "<\/script>"])), maybeRenderHead(), faqData.map((faq) => renderTemplate`<div class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"> <h3 class="text-lg font-semibold text-gray-900 mb-3">${faq.question}</h3> <p class="text-gray-700 leading-relaxed">${faq.answer}</p> </div>`), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  })));
}, "D:/ProjekGabut/sansstocks/sansstocks/src/components/FAQ.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Faq;
  const siteUrl = Astro2.site?.href || (Astro2.url ? `${Astro2.url.protocol}//${Astro2.url.host}` : "http://localhost:4321");
  const pageUrl = `${siteUrl}/faq`;
  const pageTitle = "Pertanyaan yang Sering Diajukan - SansStocks";
  const pageDescription = "Temukan jawaban untuk pertanyaan umum seputar investasi saham, pasar modal, dan ekonomi di SansStocks.";
  const pageImage = `${siteUrl}/logo.png`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": "FAQ investasi, pertanyaan saham, panduan investasi, tanya jawab pasar modal" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="min-h-screen bg-gray-50"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">  <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
Pertanyaan yang Sering Diajukan
</h1> <p class="text-xl text-gray-600 max-w-2xl mx-auto">
Temukan jawaban untuk pertanyaan umum seputar investasi saham, pasar modal, dan ekonomi
</p> </div>  <div class="bg-white rounded-xl p-8 shadow-sm"> ${renderComponent($$result2, "FAQ", $$FAQ, {})} </div> </div> </main> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate(_a || (_a = __template(['<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"> <meta name="googlebot" content="index, follow"> <meta property="og:type" content="website"> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:url"', '> <meta property="og:site_name" content="SansStocks"> <meta property="og:locale" content="id_ID"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <link rel="canonical"', '> <script type="application/ld+json">', '</script> <script type="application/ld+json">', "</script> "])), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(pageUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(pageUrl, "href"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        // FAQ items akan di-generate dari komponen FAQ jika diperlukan
      ]
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
        "name": "FAQ",
        "item": pageUrl
      }
    ]
  }))) })}` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/faq.astro", void 0);
const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
