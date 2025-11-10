/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { D as DataTable } from '../../chunks/DataTable_DPETR4Ub.mjs';
import { B as Badge } from '../../chunks/Badge_iQRQmODX.mjs';
import toast from 'react-hot-toast';
export { renderers } from '../../renderers.mjs';

async function deleteIPOListing(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus IPO listing ini?")) {
    return;
  }
  try {
    const response = await fetch(`/api/ipo-listings/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (response.ok) {
      toast.success("IPO listing berhasil dihapus");
      window.location.reload();
    } else {
      const error = await response.json();
      toast.error("Error: " + (error.error || "Gagal menghapus IPO listing"));
    }
  } catch (error) {
    toast.error("Error: Gagal menghapus IPO listing");
  }
}
function formatCurrency(num) {
  if (num === null || num === void 0) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}
function IPOListingsTable({
  ipoListings: ipoListingsJson,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  paginationBaseUrl = "/dashboard/ipo-listings"
}) {
  const [ipoListings, setIpoListings] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(ipoListingsJson);
      setIpoListings(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error parsing IPO listings:", error);
      setIpoListings([]);
    }
  }, [ipoListingsJson]);
  const columns = [
    {
      id: "ticker_symbol",
      header: "Ticker",
      accessorKey: "ticker_symbol",
      cell: ({ row }) => /* @__PURE__ */ jsx("div", { className: "font-medium text-blue-600", children: row.original.ticker_symbol })
    },
    {
      id: "company_name",
      header: "Nama Perusahaan",
      accessorKey: "company_name",
      cell: ({ row }) => /* @__PURE__ */ jsx("div", { className: "max-w-xs truncate", children: row.original.company_name })
    },
    {
      id: "ipo_date",
      header: "Tanggal IPO",
      accessorKey: "ipo_date",
      cell: ({ row }) => {
        const date = new Date(row.original.ipo_date);
        return /* @__PURE__ */ jsx("div", { children: date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" }) });
      }
    },
    {
      id: "general_sector",
      header: "Sektor",
      accessorKey: "general_sector",
      cell: ({ row }) => /* @__PURE__ */ jsxs("div", { className: "max-w-xs", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: row.original.general_sector || "-" }),
        row.original.specific_sector && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: row.original.specific_sector })
      ] })
    },
    {
      id: "ipo_price",
      header: "Harga IPO",
      accessorKey: "ipo_price",
      cell: ({ row }) => /* @__PURE__ */ jsx("div", { children: formatCurrency(row.original.ipo_price) })
    },
    {
      id: "underwriters",
      header: "Underwriter",
      accessorKey: "ipo_underwriters",
      cell: ({ row }) => {
        const underwriters = row.original.ipo_underwriters || [];
        if (underwriters.length === 0) return /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: "-" });
        return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 max-w-xs", children: [
          underwriters.slice(0, 2).map((item, idx) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: item.underwriter.name }, idx)),
          underwriters.length > 2 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
            "+",
            underwriters.length - 2
          ] })
        ] });
      }
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `/dashboard/ipo-listings/${row.original.id}/edit`,
            className: "text-blue-600 hover:text-blue-800 text-sm font-medium",
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => deleteIPOListing(row.original.id),
            className: "text-red-600 hover:text-red-800 text-sm font-medium",
            children: "Hapus"
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsx(
    DataTable,
    {
      columns,
      data: ipoListings,
      selectedRows,
      onSelectedRowsChange: setSelectedRows,
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      paginationBaseUrl
    }
  ) });
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
  let query = supabase.from("ipo_listings").select(`
    id,
    ticker_symbol,
    company_name,
    ipo_date,
    general_sector,
    specific_sector,
    shares_offered,
    total_value,
    ipo_price,
    created_at,
    updated_at,
    ipo_underwriters:ipo_underwriters (
      underwriter:underwriters (
        id,
        name
      )
    )
  `, { count: "exact" }).order("ipo_date", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (search) {
    query = query.or(`ticker_symbol.ilike.%${search}%,company_name.ilike.%${search}%`);
  }
  const { data: ipoListings, error, count } = await query;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "IPO Listings", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Kelola IPO Listings</h1> <p class="mt-2 text-sm text-gray-600">Kelola data IPO dan performa underwriter</p> </div> <div class="flex gap-2"> <a href="/dashboard/ipo-listings/import" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path> </svg>
Import Excel
</a> <a href="/dashboard/ipo-listings/new" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Tambah IPO
</a> </div> </div> </div> <!-- Search --> <div class="mb-4"> <form method="get" action="/dashboard/ipo-listings" class="flex gap-2"> <input type="text" name="search"${addAttribute(search, "value")} placeholder="Cari berdasarkan ticker atau nama perusahaan..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"> <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
Cari
</button> </form> </div> <!-- IPO Listings Table --> ${renderComponent($$result2, "IPOListingsTable", IPOListingsTable, { "client:load": true, "ipoListings": JSON.stringify(ipoListings || []), "currentPage": page, "totalPages": totalPages, "totalItems": count || 0, "itemsPerPage": limit, "paginationBaseUrl": "/dashboard/ipo-listings", "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/IPOListingsTable", "client:component-export": "default" })} </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/ipo-listings/index.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/ipo-listings/index.astro";
const $$url = "/dashboard/ipo-listings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
