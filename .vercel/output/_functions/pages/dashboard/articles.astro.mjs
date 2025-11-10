/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { D as DataTable } from '../../chunks/DataTable_DPETR4Ub.mjs';
import { B as Badge } from '../../chunks/Badge_iQRQmODX.mjs';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter, B as Button } from '../../chunks/dialog_DPQSnEoR.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from '../../chunks/select_BiE2BCUc.mjs';
import toast from 'react-hot-toast';
export { renderers } from '../../renderers.mjs';

function QuickEditModal({
  open,
  onOpenChange,
  article,
  categories,
  onSuccess
}) {
  const [status, setStatus] = React.useState(article.status);
  const [categoryId, setCategoryId] = React.useState(article.category_id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setStatus(article.status);
      setCategoryId(article.category_id);
    }
  }, [open, article]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateData = {};
      if (status !== article.status) {
        updateData.status = status;
        if (status === "published" && article.status !== "published") {
          updateData.published_at = (/* @__PURE__ */ new Date()).toISOString();
        }
      }
      if (categoryId !== article.category_id) {
        updateData.category_id = categoryId;
      }
      if (Object.keys(updateData).length === 0) {
        onOpenChange(false);
        return;
      }
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengupdate artikel");
      }
      const updatedArticle = await response.json();
      toast.success("Artikel berhasil diupdate");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengupdate artikel");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Quick Edit" }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Edit cepat untuk artikel: ",
        /* @__PURE__ */ jsx("strong", { children: article.title })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "status", className: "text-sm font-medium", children: "Status" }),
        /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: setStatus, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { id: "status", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: "Draft" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "published", children: "Published" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "archived", children: "Archived" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "category", className: "text-sm font-medium", children: "Kategori" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: categoryId?.toString() || "",
            onValueChange: (value) => setCategoryId(value ? parseInt(value) : void 0),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "category", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih kategori" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.id.toString(), children: cat.name }, cat.id)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: isSubmitting,
          children: "Batal"
        }
      ),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Menyimpan..." : "Simpan" })
    ] })
  ] }) }) });
}

async function deleteArticle(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
    return;
  }
  try {
    const response = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (response.ok) {
      alert("Artikel berhasil dihapus");
      window.location.reload();
    } else {
      const error = await response.json();
      alert("Error: " + (error.error || "Gagal menghapus artikel"));
    }
  } catch (error) {
    alert("Error: Gagal menghapus artikel");
  }
}
async function deleteArticles(ids) {
  if (!confirm(`Apakah Anda yakin ingin menghapus ${ids.length} artikel yang dipilih?`)) {
    return;
  }
  try {
    const deletePromises = ids.map(
      (id) => fetch(`/api/articles/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
    );
    const results = await Promise.all(deletePromises);
    const failed = results.filter((r) => !r.ok);
    if (failed.length === 0) {
      alert(`${ids.length} artikel berhasil dihapus`);
      window.location.reload();
    } else {
      alert(`${failed.length} dari ${ids.length} artikel gagal dihapus`);
    }
  } catch (error) {
    alert("Error: Gagal menghapus artikel");
  }
}
function ArticlesTable({
  articles: articlesJson,
  categories: categoriesJson,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  paginationBaseUrl,
  statusFilter = "all"
}) {
  const [articlesState, setArticlesState] = React.useState(() => {
    try {
      return JSON.parse(articlesJson || "[]");
    } catch {
      return [];
    }
  });
  const categories = React.useMemo(() => {
    try {
      return JSON.parse(categoriesJson || "[]");
    } catch {
      return [];
    }
  }, [categoriesJson]);
  const [quickEditArticle, setQuickEditArticle] = React.useState(null);
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(articlesJson || "[]");
      setArticlesState(parsed);
    } catch {
    }
  }, [articlesJson]);
  const columns = [
    {
      id: "title",
      header: "Judul",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: row.title }),
          row.featured && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800 text-xs", children: "⭐ Featured" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500 font-mono", children: row.slug }),
        row.summary && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mt-1 line-clamp-1", children: row.summary })
      ] })
    },
    {
      id: "category",
      header: "Kategori",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: row.categories?.name || "-" })
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx(
        Badge,
        {
          className: row.status === "published" ? "bg-green-100 text-green-800" : row.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800",
          children: row.status
        }
      )
    },
    {
      id: "views",
      header: "Views",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: row.views_count !== void 0 && row.views_count !== null ? row.views_count.toLocaleString("id-ID") : "0" })
    },
    {
      id: "date",
      header: "Tanggal",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: row.published_at ? new Date(row.published_at).toLocaleDateString("id-ID") : new Date(row.created_at).toLocaleDateString("id-ID") })
    }
  ];
  const actionMenuItems = (row) => {
    return [
      {
        label: "Quick Edit",
        onClick: () => {
          setQuickEditArticle(row);
        },
        icon: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
      },
      {
        label: "Edit Full",
        onClick: () => {
          window.location.href = `/dashboard/articles/${row.id}/edit`;
        },
        icon: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
      },
      {
        label: "Delete",
        onClick: () => {
          deleteArticle(row.id);
        },
        icon: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
      }
    ];
  };
  const handleMassDelete = async (selectedRows) => {
    const ids = selectedRows.map((row) => row.id);
    await deleteArticles(ids);
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
      if (statusFilter && statusFilter !== "all") {
        url.searchParams.set("status", statusFilter);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.toString();
    }
  };
  const buildUrl = (page, search) => {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== "all") {
      params.set("status", statusFilter);
    }
    if (search) {
      params.set("search", search);
    }
    params.set("page", page.toString());
    return `${paginationBaseUrl}?${params.toString()}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 border-b border-gray-200", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: paginationBaseUrl ? `${paginationBaseUrl}?status=all&page=1` : "?status=all&page=1",
          className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${statusFilter === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"}`,
          children: "Semua"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: paginationBaseUrl ? `${paginationBaseUrl}?status=published&page=1` : "?status=published&page=1",
          className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${statusFilter === "published" ? "border-green-600 text-green-600" : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"}`,
          children: "Published"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: paginationBaseUrl ? `${paginationBaseUrl}?status=draft&page=1` : "?status=draft&page=1",
          className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${statusFilter === "draft" ? "border-yellow-600 text-yellow-600" : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"}`,
          children: "Draft"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      DataTable,
      {
        data: articlesState,
        columns,
        enableSelection: true,
        actionMenuItems,
        onMassDelete: handleMassDelete,
        getRowId: (row) => row.id,
        onSearch: handleSearch,
        searchPlaceholder: "Filter artikel...",
        emptyMessage: "Belum ada artikel. Buat artikel pertama untuk memulai.",
        defaultSort: { key: "date", direction: "desc" },
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginationBaseUrl,
        buildPaginationUrl: buildUrl
      }
    ),
    quickEditArticle && /* @__PURE__ */ jsx(
      QuickEditModal,
      {
        open: !!quickEditArticle,
        onOpenChange: (open) => {
          if (!open) {
            setQuickEditArticle(null);
          }
        },
        article: quickEditArticle,
        categories,
        onSuccess: () => {
          if (quickEditArticle) {
            fetch(`/api/articles/${quickEditArticle.id}`, {
              credentials: "include"
            }).then((res) => res.json()).then((data) => {
              if (data.data) {
                setArticlesState(
                  (prev) => prev.map(
                    (article) => article.id === quickEditArticle.id ? { ...article, ...data.data } : article
                  )
                );
              }
            }).catch(console.error);
          }
          setQuickEditArticle(null);
        }
      }
    )
  ] });
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
  const statusFilter = Astro2.url.searchParams.get("status") || "all";
  const search = Astro2.url.searchParams.get("search") || "";
  let query = supabase.from("articles").select(`
    id,
    title,
    slug,
    summary,
    status,
    published_at,
    created_at,
    featured,
    views_count,
    categories:category_id (
      id,
      name
    )
  `, { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  const { data: articles, error, count } = await query;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Artikel", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Kelola Artikel</h1> <p class="mt-2 text-sm text-gray-600">Buat, edit, dan kelola artikel Anda</p> </div> <a href="/dashboard/articles/new" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Artikel Baru
</a> </div> </div> <!-- Articles Table --> ${renderComponent($$result2, "ArticlesTable", ArticlesTable, { "client:load": true, "articles": JSON.stringify(articles || []), "categories": JSON.stringify(categories || []), "currentPage": page, "totalPages": totalPages, "totalItems": count || 0, "itemsPerPage": limit, "paginationBaseUrl": "/dashboard/articles", "statusFilter": statusFilter, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/ArticlesTable", "client:component-export": "default" })} </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/articles/index.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/articles/index.astro";
const $$url = "/dashboard/articles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
