import { c as createComponent, a as createAstro, b as addAttribute, x as renderHead, r as renderComponent, w as renderSlot, d as renderTemplate } from './astro/server_DJYPjeXe.mjs';
import { $ as $$Image } from './_astro_assets_D8cCpO2h.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { T as Toaster, l as logo } from './Toaster_C1sffp9X.mjs';
/* empty css                             */

function UserMenu({ email = "" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      const target = e.target;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: containerRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "w-full mb-3 p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 text-left",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white ring-opacity-30", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: email ? email.charAt(0).toUpperCase() : "A" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white truncate", children: email || "Admin" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-200 truncate font-medium", children: "User" })
          ] }),
          /* @__PURE__ */ jsx("svg", { className: "ml-2 w-5 h-5 text-blue-100", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z", clipRule: "evenodd" }) })
        ] })
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-0 -top-2 translate-y-[-100%] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold truncate", children: email || "Admin" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: email || "admin@example.com" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t", children: [
        /* @__PURE__ */ jsxs("a", { href: "/dashboard/users", className: "flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" }) }),
          "User"
        ] }),
        /* @__PURE__ */ jsx("form", { action: "/api/auth/signout", method: "post", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm text-red-600", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }),
          "Log out"
        ] }) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Dashboard", email = "" } = Astro2.props;
  return renderTemplate`<html lang="id" data-astro-cid-2kanml4j> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description" content="SansStocks Admin Dashboard"><title>${title} - SansStocks Admin</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-gray-50 text-gray-900 font-sans antialiased" data-astro-cid-2kanml4j> <div class="min-h-screen flex" data-astro-cid-2kanml4j> <!-- Sidebar --> <aside id="sidebar" class="hidden lg:flex lg:flex-shrink-0 sidebar-container" data-astro-cid-2kanml4j> <div class="flex flex-col w-64 text-white sidebar-gradient shadow-2xl relative overflow-hidden" data-astro-cid-2kanml4j> <!-- Background Pattern --> <div class="absolute inset-0 opacity-10" data-astro-cid-2kanml4j> <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;" data-astro-cid-2kanml4j></div> </div> <!-- Logo --> <!-- <div class="relative flex items-center h-20 px-6 border-b border-white border-opacity-10 backdrop-blur-sm">
						<a href="/dashboard" class="flex items-center gap-3 group/logo">
							
							<span class="text-xl font-bold tracking-tight"></span>
						</a>
					</div> --> <!-- Navigation --> <nav class="relative flex-1 px-3 py-6 space-y-1 overflow-y-auto" data-astro-cid-2kanml4j> <a href="/dashboard" class="nav-item active" data-astro-cid-2kanml4j> <div class="flex items-center" data-astro-cid-2kanml4j> <div class="nav-icon-wrapper" data-astro-cid-2kanml4j> <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-2kanml4j> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-2kanml4j></path> </svg> </div> <span class="nav-text" data-astro-cid-2kanml4j>Dashboard</span> </div> <div class="nav-indicator" data-astro-cid-2kanml4j></div> </a> <a href="/dashboard/articles" class="nav-item" data-path="/dashboard/articles" data-astro-cid-2kanml4j> <div class="flex items-center" data-astro-cid-2kanml4j> <div class="nav-icon-wrapper" data-astro-cid-2kanml4j> <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-2kanml4j> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-2kanml4j></path> </svg> </div> <span class="nav-text" data-astro-cid-2kanml4j>Artikel</span> </div> </a> <!-- Group: Taxonomy (Categories + Tags) --> <div class="relative" data-astro-cid-2kanml4j> <details class="group" data-astro-cid-2kanml4j> <summary class="nav-item cursor-pointer list-none" data-astro-cid-2kanml4j> <div class="flex items-center justify-between w-full" data-astro-cid-2kanml4j> <div class="flex items-center" data-astro-cid-2kanml4j> <div class="nav-icon-wrapper" data-astro-cid-2kanml4j> <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-2kanml4j> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" data-astro-cid-2kanml4j></path> </svg> </div> <span class="nav-text" data-astro-cid-2kanml4j>Taksonomi</span> </div> <svg class="w-4 h-4 text-white/80 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-2kanml4j><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" data-astro-cid-2kanml4j></path></svg> </div> </summary> <div class="ml-10 mt-1 space-y-1" data-astro-cid-2kanml4j> <a href="/dashboard/categories" class="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg text-sm" data-astro-cid-2kanml4j>Categories</a> <a href="/dashboard/tags" class="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg text-sm" data-astro-cid-2kanml4j>Tags</a> </div> </details> </div> <a href="/dashboard/media" class="nav-item" data-astro-cid-2kanml4j> <div class="flex items-center" data-astro-cid-2kanml4j> <div class="nav-icon-wrapper" data-astro-cid-2kanml4j> <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-2kanml4j> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-2kanml4j></path> </svg> </div> <span class="nav-text" data-astro-cid-2kanml4j>Media</span> </div> </a> </nav> <!-- User Section & Sign Out (React island) --> <div class="relative px-4 py-5 border-t border-white border-opacity-10 backdrop-blur-sm bg-white bg-opacity-5" data-astro-cid-2kanml4j> ${renderComponent($$result, "UserMenu", UserMenu, { "email": email, "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/UserMenu", "client:component-export": "default", "data-astro-cid-2kanml4j": true })} </div> </div> </aside> <!-- Main Content Area --> <div class="flex-1 flex flex-col overflow-hidden" data-astro-cid-2kanml4j> <!-- Top Header --> <header class="bg-white shadow-sm border-b border-gray-200" data-astro-cid-2kanml4j> <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" data-astro-cid-2kanml4j> <!-- Mobile menu button --> <button type="button" class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" onclick="document.getElementById('sidebar').classList.toggle('hidden')" aria-label="Toggle sidebar" data-astro-cid-2kanml4j> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-2kanml4j> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-2kanml4j></path> </svg> </button> <div class="flex-1 lg:hidden" data-astro-cid-2kanml4j> <a href="/dashboard" class="flex items-center gap-2 ml-2" data-astro-cid-2kanml4j> ${renderComponent($$result, "Image", $$Image, { "src": logo, "alt": "SansStocks Logo", "width": 28, "height": 28, "format": "webp", "class": "object-contain", "data-astro-cid-2kanml4j": true })} <span class="text-lg font-bold text-gray-900" data-astro-cid-2kanml4j>SansStocks</span> </a> </div> </div> </header> <!-- Page Content --> <main class="flex-1 overflow-y-auto bg-gray-50" data-astro-cid-2kanml4j> ${renderSlot($$result, $$slots["default"])} </main> </div> ${renderComponent($$result, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/Toaster.tsx", "client:component-export": "default", "data-astro-cid-2kanml4j": true })} </div></body></html>`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
