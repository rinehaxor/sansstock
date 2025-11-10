/* empty css                                  */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_DJYPjeXe.mjs';
import { s as supabase } from '../chunks/supabase_Bf3LIET_.mjs';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_ASOqeeWw.mjs';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const accessToken = Astro2.cookies.get("sb-access-token");
  const refreshToken = Astro2.cookies.get("sb-refresh-token");
  if (!accessToken || !refreshToken) {
    return Astro2.redirect("/portal/access");
  }
  let session;
  try {
    session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value
    });
    if (session.error) {
      Astro2.cookies.delete("sb-access-token", {
        path: "/"
      });
      Astro2.cookies.delete("sb-refresh-token", {
        path: "/"
      });
      return Astro2.redirect("/portal/access");
    }
  } catch (error) {
    Astro2.cookies.delete("sb-access-token", {
      path: "/"
    });
    Astro2.cookies.delete("sb-refresh-token", {
      path: "/"
    });
    return Astro2.redirect("/portal/access");
  }
  const email = session.data.user?.email;
  const { count: totalArticles } = await supabase.from("articles").select("*", { count: "exact", head: true });
  const { count: publishedCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published");
  const { count: draftCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft");
  const { count: archivedCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "archived");
  let totalViews = 0;
  try {
    const { data: viewsData } = await supabase.from("articles").select("views_count");
    if (viewsData) {
      totalViews = viewsData.reduce((sum, article) => {
        return sum + (article.views_count || 0);
      }, 0);
    }
  } catch (e) {
    totalViews = 0;
  }
  const { data: recentArticles } = await supabase.from("articles").select(`
    id,
    title,
    slug,
    status,
    created_at,
    updated_at,
    published_at,
    categories:category_id (
      id,
      name
    )
  `).order("updated_at", { ascending: false }).limit(5);
  const { data: categoryStats } = await supabase.from("articles").select("category_id, categories:category_id (id, name)");
  const categoryCounts = {};
  if (categoryStats) {
    categoryStats.forEach((article) => {
      if (article.category_id && article.categories) {
        const catId = article.category_id;
        const catName = article.categories.name;
        if (!categoryCounts[catId]) {
          categoryCounts[catId] = { name: catName, count: 0 };
        }
        categoryCounts[catId].count++;
      }
    });
  }
  function getTimeAgo(dateString) {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + " menit yang lalu";
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + " jam yang lalu";
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + " hari yang lalu";
    return date.toLocaleDateString("id-ID");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Stats Cards --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <!-- Total Articles --> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-500">Total Artikel</p> <p class="text-2xl font-semibold text-gray-900">${totalArticles || 0}</p> </div> </div> </div> <!-- Published --> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-500">Published</p> <p class="text-2xl font-semibold text-gray-900">${publishedCount || 0}</p> </div> </div> </div> <!-- Draft --> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-500">Draft</p> <p class="text-2xl font-semibold text-gray-900">${draftCount || 0}</p> </div> </div> </div> <!-- Total Views --> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> </div> </div> <div class="ml-4"> <p class="text-sm font-medium text-gray-500">Total Views</p> <p class="text-2xl font-semibold text-gray-900">${totalViews.toLocaleString("id-ID")}</p> </div> </div> </div> </div> <!-- Main Content Grid --> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> <!-- Recent Articles --> <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200"> <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"> <h3 class="text-lg font-medium text-gray-900">Artikel Terbaru</h3> <a href="/dashboard/articles" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
Lihat Semua →
</a> </div> <div class="p-6"> ${recentArticles && recentArticles.length > 0 ? renderTemplate`<div class="space-y-4"> ${recentArticles.map((article) => {
    const statusColors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800"
    };
    const statusColor = statusColors[article.status] || "bg-gray-100 text-gray-800";
    const lastUpdated = article.updated_at || article.created_at;
    const editUrl = "/dashboard/articles/" + article.id + "/edit";
    const spanClass = "ml-3 px-2 py-1 text-xs font-medium rounded-full " + statusColor;
    return renderTemplate`<a${addAttribute(editUrl, "href")} class="block group hover:bg-gray-50 p-3 rounded-lg transition-colors"> <div class="flex items-start justify-between"> <div class="flex-1 min-w-0"> <h4 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate"> ${article.title} </h4> <div class="mt-1 flex items-center gap-2"> ${article.categories && renderTemplate`<span class="text-xs text-gray-500">${article.categories.name}</span>`} <span class="text-xs text-gray-400">•</span> <span class="text-xs text-gray-500">${getTimeAgo(lastUpdated)}</span> </div> </div> <span${addAttribute(spanClass, "class")}> ${article.status} </span> </div> </a>`;
  })} </div>` : renderTemplate`<p class="text-sm text-gray-500 text-center py-4">Belum ada artikel</p>`} </div> </div> <!-- Category Statistics --> <div class="bg-white rounded-lg shadow-sm border border-gray-200"> <div class="px-6 py-4 border-b border-gray-200"> <h3 class="text-lg font-medium text-gray-900">Statistik Kategori</h3> </div> <div class="p-6"> ${Object.keys(categoryCounts).length > 0 ? renderTemplate`<div class="space-y-4"> ${Object.entries(categoryCounts).sort(([, a], [, b]) => b.count - a.count).slice(0, 5).map(([catId, data]) => renderTemplate`<div class="flex items-center justify-between"> <span class="text-sm font-medium text-gray-900">${data.name}</span> <span class="text-sm text-gray-500">${data.count} artikel</span> </div>`)} </div>` : renderTemplate`<p class="text-sm text-gray-500 text-center py-4">Belum ada kategori</p>`} </div> </div> </div> </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Dashboard,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
