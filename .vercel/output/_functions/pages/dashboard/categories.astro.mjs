/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { D as DataTable } from '../../chunks/DataTable_DPETR4Ub.mjs';
import { B as Badge } from '../../chunks/Badge_iQRQmODX.mjs';
export { renderers } from '../../renderers.mjs';

async function deleteCategory(id, usageCount) {
  if (usageCount > 0) {
    alert(`Kategori ini digunakan di ${usageCount} artikel. Hapus kategori dari artikel terlebih dahulu sebelum menghapus kategori.`);
    return;
  }
  if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    return;
  }
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (response.ok) {
      alert("Kategori berhasil dihapus");
      window.location.reload();
    } else {
      const error = await response.json();
      alert("Error: " + (error.error || "Gagal menghapus kategori"));
    }
  } catch (error) {
    alert("Error: Gagal menghapus kategori");
  }
}
async function deleteCategories(ids, categoryUsage) {
  const categoriesInUse = ids.filter((id) => (categoryUsage[id] || 0) > 0);
  if (categoriesInUse.length > 0) {
    const categoryNames = categoriesInUse.map((id) => `Kategori ID ${id}`).join(", ");
    alert(`Beberapa kategori masih digunakan di artikel: ${categoryNames}. Hapus kategori dari artikel terlebih dahulu sebelum menghapus.`);
    return;
  }
  try {
    const deletePromises = ids.map(
      (id) => fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
    );
    const results = await Promise.all(deletePromises);
    const failed = results.filter((r) => !r.ok);
    if (failed.length === 0) {
      alert(`${ids.length} kategori berhasil dihapus`);
      window.location.reload();
    } else {
      alert(`${failed.length} dari ${ids.length} kategori gagal dihapus`);
    }
  } catch (error) {
    alert("Error: Gagal menghapus kategori");
  }
}
function CategoriesTable({
  categories: categoriesJson,
  categoryUsage: categoryUsageJson,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  paginationBaseUrl,
  initialSearch = ""
}) {
  const categories = React.useMemo(() => {
    try {
      return JSON.parse(categoriesJson || "[]");
    } catch {
      return [];
    }
  }, [categoriesJson]);
  const categoryUsage = React.useMemo(() => {
    try {
      return JSON.parse(categoryUsageJson || "{}");
    } catch {
      return {};
    }
  }, [categoryUsageJson]);
  const columns = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: row.name })
    },
    {
      id: "slug",
      header: "Slug",
      accessorKey: "slug",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: row.slug })
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: (row) => /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 max-w-md truncate", children: row.description || "-" })
    },
    {
      id: "usage",
      header: "Usage",
      sortable: true,
      cell: (row) => {
        const count = categoryUsage[row.id] || 0;
        return /* @__PURE__ */ jsxs(Badge, { variant: count > 0 ? "default" : "secondary", className: count > 0 ? "bg-blue-100 text-blue-700" : "", children: [
          count,
          " artikel"
        ] });
      }
    },
    {
      id: "created_at",
      header: "Created",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: new Date(row.created_at).toLocaleDateString("id-ID") })
    }
  ];
  const actionMenuItems = (row) => {
    const usageCount = categoryUsage[row.id] || 0;
    return [
      {
        label: "Edit",
        onClick: () => {
          window.location.href = `/dashboard/categories/${row.id}/edit`;
        },
        icon: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
      },
      {
        label: "Delete",
        onClick: () => {
          deleteCategory(row.id, usageCount);
        },
        icon: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
      }
    ];
  };
  const handleMassDelete = async (selectedRows) => {
    const ids = selectedRows.map((row) => row.id);
    await deleteCategories(ids, categoryUsage);
  };
  const handleSearch = (value) => {
    if (paginationBaseUrl) {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set("search", value);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.set("page", "1");
      window.location.href = url.toString();
    }
  };
  return /* @__PURE__ */ jsx(
    DataTable,
    {
      data: categories,
      columns,
      enableSelection: true,
      actionMenuItems,
      onMassDelete: handleMassDelete,
      getRowId: (row) => row.id,
      onSearch: handleSearch,
      searchPlaceholder: "Filter kategori...",
      emptyMessage: "Belum ada kategori. Buat kategori pertama untuk memulai.",
      defaultSort: { key: "created_at", direction: "desc" },
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      paginationBaseUrl
    }
  );
}

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
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
      Astro2.cookies.delete("sb-access-token", { path: "/" });
      Astro2.cookies.delete("sb-refresh-token", { path: "/" });
      return Astro2.redirect("/portal/access");
    }
  } catch (error2) {
    Astro2.cookies.delete("sb-access-token", { path: "/" });
    Astro2.cookies.delete("sb-refresh-token", { path: "/" });
    return Astro2.redirect("/portal/access");
  }
  const email = session.data.user?.email;
  const page = parseInt(Astro2.url.searchParams.get("page") || "1");
  const limit = 10;
  const search = Astro2.url.searchParams.get("search") || "";
  let query = supabase.from("categories").select("id, name, slug, description, created_at, updated_at", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }
  const { data: categories, error, count } = await query;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const categoryIds = categories?.map((c) => c.id) || [];
  let categoryUsage = {};
  if (categoryIds.length > 0) {
    const { data: articles } = await supabase.from("articles").select("category_id");
    if (articles) {
      articles.forEach((article) => {
        if (article.category_id) {
          categoryUsage[article.category_id] = (categoryUsage[article.category_id] || 0) + 1;
        }
      });
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Categories", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Kelola Kategori</h1> <p class="mt-2 text-sm text-gray-600">Buat dan kelola kategori untuk artikel</p> </div> <a href="/dashboard/categories/new" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Kategori Baru
</a> </div> </div> <!-- Categories Table --> ${renderComponent($$result2, "CategoriesTable", CategoriesTable, { "client:load": true, "categories": JSON.stringify(categories || []), "categoryUsage": JSON.stringify(categoryUsage), "currentPage": page, "totalPages": totalPages, "totalItems": count || 0, "itemsPerPage": limit, "paginationBaseUrl": "/dashboard/categories", "initialSearch": search, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/CategoriesTable", "client:component-export": "default" })} </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/categories/index.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/categories/index.astro";
const $$url = "/dashboard/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
