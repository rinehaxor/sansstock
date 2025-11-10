/* empty css                                  */
import { c as createComponent, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../chunks/Layout_DE1DG0QU.mjs';
import { s as supabase } from '../chunks/supabase_Bf3LIET_.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { C as Card } from '../chunks/Card_CppDnIQN.mjs';
export { renderers } from '../renderers.mjs';

function formatPercentage(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
function getPeriodLabel(periodDays) {
  if (periodDays === 1) return "Hari 1";
  if (periodDays === 7) return "Minggu 1";
  if (periodDays === 30) return "Bulan 1";
  if (periodDays === 90) return "Bulan 3";
  if (periodDays === 180) return "Bulan 6";
  if (periodDays === 365) return "Tahun 1";
  return `${periodDays} hari`;
}
function UnderwriterPerformance({ underwriters: underwritersJson }) {
  const [underwriters, setUnderwriters] = React.useState([]);
  const [selectedUnderwriter, setSelectedUnderwriter] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("name");
  const [periodFilter, setPeriodFilter] = React.useState(null);
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(underwritersJson);
      setUnderwriters(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error parsing underwriters:", error);
      setUnderwriters([]);
    }
  }, [underwritersJson]);
  const sortedUnderwriters = React.useMemo(() => {
    const sorted = [...underwriters];
    switch (sortBy) {
      case "total_ipos":
        return sorted.sort((a, b) => b.total_ipos - a.total_ipos);
      case "avg_performance":
        const period = periodFilter || 30;
        return sorted.sort((a, b) => {
          const aAvg = a.performance_by_period[period]?.avg || 0;
          const bAvg = b.performance_by_period[period]?.avg || 0;
          return bAvg - aAvg;
        });
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [underwriters, sortBy, periodFilter]);
  const availablePeriods = React.useMemo(() => {
    const periods = /* @__PURE__ */ new Set();
    underwriters.forEach((u) => {
      Object.keys(u.performance_by_period).forEach((p) => periods.add(parseInt(p)));
    });
    return Array.from(periods).sort((a, b) => a - b);
  }, [underwriters]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Urutkan berdasarkan" }),
        /* @__PURE__ */ jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [
          /* @__PURE__ */ jsx("option", { value: "name", children: "Nama" }),
          /* @__PURE__ */ jsx("option", { value: "total_ipos", children: "Total IPO" }),
          /* @__PURE__ */ jsx("option", { value: "avg_performance", children: "Rata-rata Performa" })
        ] })
      ] }),
      sortBy === "avg_performance" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Periode" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: periodFilter || "",
            onChange: (e) => setPeriodFilter(e.target.value ? parseInt(e.target.value) : null),
            className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Semua Periode" }),
              availablePeriods.map((period) => /* @__PURE__ */ jsx("option", { value: period, children: getPeriodLabel(period) }, period))
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: sortedUnderwriters.map((underwriter) => /* @__PURE__ */ jsx(Card, { className: "p-4 cursor-pointer hover:shadow-lg transition-shadow", onClick: () => setSelectedUnderwriter(underwriter), children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: underwriter.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Total IPO: ",
          underwriter.total_ipos
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: availablePeriods.slice(0, 3).map((period) => {
        const perf = underwriter.performance_by_period[period];
        if (!perf) return null;
        return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
            getPeriodLabel(period),
            ":"
          ] }),
          /* @__PURE__ */ jsx("span", { className: `font-medium ${perf.avg >= 0 ? "text-green-600" : "text-red-600"}`, children: formatPercentage(perf.avg) })
        ] }, period);
      }) }),
      /* @__PURE__ */ jsx("button", { className: "w-full mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium", children: "Lihat Detail →" })
    ] }) }, underwriter.id)) }),
    selectedUnderwriter && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: selectedUnderwriter.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
            "Total IPO: ",
            selectedUnderwriter.total_ipos
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSelectedUnderwriter(null), className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Rata-rata Performa" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Periode" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Rata-rata" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Min" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Max" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Jumlah" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: availablePeriods.map((period) => {
            const perf = selectedUnderwriter.performance_by_period[period];
            if (!perf) return null;
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: getPeriodLabel(period) }),
              /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-sm font-medium ${perf.avg >= 0 ? "text-green-600" : "text-red-600"}`, children: formatPercentage(perf.avg) }),
              /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-sm ${perf.min >= 0 ? "text-green-600" : "text-red-600"}`, children: formatPercentage(perf.min) }),
              /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-sm ${perf.max >= 0 ? "text-green-600" : "text-red-600"}`, children: formatPercentage(perf.max) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: perf.count })
            ] }, period);
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Daftar IPO" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: selectedUnderwriter.ipo_listings.map((ipo) => /* @__PURE__ */ jsx("div", { className: "p-3 border border-gray-200 rounded-lg hover:bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-medium text-gray-900", children: [
              ipo.ticker_symbol,
              " - ",
              ipo.company_name
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: new Date(ipo.ipo_date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: ipo.ipo_performance_metrics && ipo.ipo_performance_metrics.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-1", children: ipo.ipo_performance_metrics.slice(0, 3).map((metric, idx) => /* @__PURE__ */ jsxs("div", { className: `text-xs ${metric.metric_value >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            getPeriodLabel(metric.period_days),
            ": ",
            formatPercentage(metric.metric_value)
          ] }, idx)) }) })
        ] }) }, ipo.id)) })
      ] })
    ] }) }) })
  ] });
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: underwriters, error } = await supabase.from("underwriters").select(`
    id,
    name,
    ipo_underwriters:ipo_underwriters (
      ipo_listing:ipo_listings (
        id,
        ticker_symbol,
        company_name,
        ipo_date,
        ipo_price,
        ipo_performance_metrics:ipo_performance_metrics (
          metric_name,
          metric_value,
          period_days
        )
      )
    )
  `).order("name", { ascending: true });
  let underwritersWithStats = [];
  if (underwriters) {
    underwritersWithStats = underwriters.map((underwriter) => {
      const ipoListings = underwriter.ipo_underwriters || [];
      const allMetrics = [];
      ipoListings.forEach((item) => {
        const metrics = item.ipo_listing?.ipo_performance_metrics || [];
        allMetrics.push(...metrics);
      });
      const metricsByPeriod = {};
      allMetrics.forEach((metric) => {
        if (metric.period_days && metric.metric_value !== null) {
          if (!metricsByPeriod[metric.period_days]) {
            metricsByPeriod[metric.period_days] = [];
          }
          metricsByPeriod[metric.period_days].push(metric.metric_value);
        }
      });
      const performanceByPeriod = {};
      Object.keys(metricsByPeriod).forEach((period) => {
        const values = metricsByPeriod[parseInt(period)];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        performanceByPeriod[parseInt(period)] = {
          avg: parseFloat(avg.toFixed(2)),
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      });
      return {
        ...underwriter,
        total_ipos: ipoListings.length,
        performance_by_period: performanceByPeriod,
        ipo_listings: ipoListings.map((item) => item.ipo_listing).filter((item) => item !== null)
      };
    }).filter((u) => u.total_ipos > 0);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "History Performa Underwriter IPO" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900">History Performa Underwriter IPO</h1> <p class="mt-2 text-sm text-gray-600">
Analisis performa IPO yang ditangani oleh berbagai underwriter
</p> </div> <!-- Underwriter Performance --> ${renderComponent($$result2, "UnderwriterPerformance", UnderwriterPerformance, { "client:load": true, "underwriters": JSON.stringify(underwritersWithStats || []), "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/UnderwriterPerformance", "client:component-export": "default" })} </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/underwriters/index.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/underwriters/index.astro";
const $$url = "/underwriters";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
