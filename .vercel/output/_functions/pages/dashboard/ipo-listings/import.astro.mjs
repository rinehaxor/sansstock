/* empty css                                        */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import toast from 'react-hot-toast';
export { renderers } from '../../../renderers.mjs';

function IPOImportForm() {
  const [jsonData, setJsonData] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [importResult, setImportResult] = React.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setImportResult(null);
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        toast.error("Data harus berupa array");
        setIsLoading(false);
        return;
      }
      const response = await fetch("/api/ipo-listings/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Import berhasil");
        setImportResult(result.results);
        setJsonData("");
      } else {
        toast.error(result.error || "Import gagal");
        setImportResult(result);
      }
    } catch (error) {
      toast.error("Error parsing JSON: " + (error instanceof Error ? error.message : "Unknown error"));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setJsonData(text);
        toast.success("File berhasil dibaca");
      } catch (error) {
        toast.error("Error membaca file");
      }
    };
    reader.readAsText(file);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "json-data", className: "block text-sm font-medium text-gray-700 mb-2", children: "Data JSON" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "json-data",
            rows: 15,
            value: jsonData,
            onChange: (e) => setJsonData(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm",
            placeholder: "Paste JSON data di sini atau upload file...",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "file-upload", className: "block text-sm font-medium text-gray-700 mb-2", children: "Atau Upload File JSON" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "file-upload",
            type: "file",
            accept: ".json,.txt",
            onChange: handleFileUpload,
            className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isLoading || !jsonData.trim(),
            className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
            children: isLoading ? "Mengimport..." : "Import Data"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setJsonData(""),
            className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50",
            children: "Clear"
          }
        )
      ] })
    ] }),
    importResult && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Hasil Import" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-green-600", children: "Berhasil:" }),
          " ",
          importResult.success
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-red-600", children: "Gagal:" }),
          " ",
          importResult.failed
        ] }),
        importResult.errors && importResult.errors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-red-600 mb-2", children: "Errors:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-red-600", children: importResult.errors.map((error, idx) => /* @__PURE__ */ jsx("li", { className: "text-xs", children: error }, idx)) })
        ] }),
        importResult.imported && importResult.imported.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-green-600 mb-2", children: "Data yang diimport:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1 text-green-600", children: [
            importResult.imported.slice(0, 10).map((item, idx) => /* @__PURE__ */ jsx("li", { className: "text-xs", children: item.ticker_symbol }, idx)),
            importResult.imported.length > 10 && /* @__PURE__ */ jsxs("li", { className: "text-xs", children: [
              "... dan ",
              importResult.imported.length - 10,
              " lainnya"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Import = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Import;
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
  } catch (error) {
    Astro2.cookies.delete("sb-access-token", { path: "/" });
    Astro2.cookies.delete("sb-refresh-token", { path: "/" });
    return Astro2.redirect("/portal/access");
  }
  const email = session.data.user?.email;
  const exampleJson = `[
  {
    "ticker_symbol": "FAPA",
    "company_name": "PT FAP Agri Tbk",
    "ipo_date": "2021-01-04",
    "general_sector": "Consumer Non-Cyclicals",
    "specific_sector": "Agricultural Products",
    "shares_offered": 1001718,
    "total_value": 3629411800,
    "ipo_price": 1840,
    "underwriters": "PT BCA Sekuritas",
    "performance_metrics": [
      { "metric_name": "return", "metric_value": 25, "period_days": 1 },
      { "metric_name": "return", "metric_value": 42, "period_days": 7 }
    ]
  }
]`;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Import IPO Data", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Import Data IPO</h1> <p class="mt-2 text-sm text-gray-600">Import data IPO dari file Excel atau format JSON</p> </div> <a href="/dashboard/ipo-listings" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50">
Kembali
</a> </div> </div> <!-- Import Form --> <div class="bg-white shadow rounded-lg p-6"> ${renderComponent($$result2, "IPOImportForm", IPOImportForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/IPOImportForm", "client:component-export": "default" })} </div> <!-- Instructions --> <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6"> <h2 class="text-lg font-semibold text-blue-900 mb-4">Format Data yang Didukung</h2> <div class="space-y-3 text-sm text-blue-800"> <p><strong>Format JSON:</strong> Array of objects dengan struktur berikut:</p> <pre class="bg-blue-100 p-4 rounded overflow-x-auto mt-2"><code>${exampleJson}</code></pre> <p class="mt-4"><strong>Catatan:</strong></p> <ul class="list-disc list-inside space-y-1 ml-4"> <li>Underwriters dapat berupa string (pisahkan dengan semicolon atau comma) atau array</li> <li>Performance metrics adalah array dengan metric_name, metric_value (percentage), dan period_days</li> <li>Data yang sudah ada akan diupdate berdasarkan ticker_symbol</li> </ul> </div> </div> </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/ipo-listings/import.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/ipo-listings/import.astro";
const $$url = "/dashboard/ipo-listings/import";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Import,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
