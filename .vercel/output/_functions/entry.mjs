import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C2ML-C1E.mjs';
import { manifest } from './manifest_DOJxlon_.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/articles/_id_/view.astro.mjs');
const _page2 = () => import('./pages/api/articles/_id_.astro.mjs');
const _page3 = () => import('./pages/api/articles.astro.mjs');
const _page4 = () => import('./pages/api/auth/signin.astro.mjs');
const _page5 = () => import('./pages/api/auth/signout.astro.mjs');
const _page6 = () => import('./pages/api/categories/_id_.astro.mjs');
const _page7 = () => import('./pages/api/categories.astro.mjs');
const _page8 = () => import('./pages/api/ipo-listings/import.astro.mjs');
const _page9 = () => import('./pages/api/ipo-listings/_id_.astro.mjs');
const _page10 = () => import('./pages/api/ipo-listings.astro.mjs');
const _page11 = () => import('./pages/api/market.astro.mjs');
const _page12 = () => import('./pages/api/media/_id_.astro.mjs');
const _page13 = () => import('./pages/api/media.astro.mjs');
const _page14 = () => import('./pages/api/placeholder/_---size_.astro.mjs');
const _page15 = () => import('./pages/api/tags/_id_.astro.mjs');
const _page16 = () => import('./pages/api/tags.astro.mjs');
const _page17 = () => import('./pages/api/underwriters.astro.mjs');
const _page18 = () => import('./pages/api/upload/thumbnail.astro.mjs');
const _page19 = () => import('./pages/artikel/_slug_.astro.mjs');
const _page20 = () => import('./pages/artikel.astro.mjs');
const _page21 = () => import('./pages/categories/_slug_.astro.mjs');
const _page22 = () => import('./pages/dashboard/articles/new.astro.mjs');
const _page23 = () => import('./pages/dashboard/articles/_id_/edit.astro.mjs');
const _page24 = () => import('./pages/dashboard/articles.astro.mjs');
const _page25 = () => import('./pages/dashboard/categories/new.astro.mjs');
const _page26 = () => import('./pages/dashboard/categories/_id_/edit.astro.mjs');
const _page27 = () => import('./pages/dashboard/categories.astro.mjs');
const _page28 = () => import('./pages/dashboard/ipo-listings/import.astro.mjs');
const _page29 = () => import('./pages/dashboard/ipo-listings.astro.mjs');
const _page30 = () => import('./pages/dashboard/media.astro.mjs');
const _page31 = () => import('./pages/dashboard/tags/new.astro.mjs');
const _page32 = () => import('./pages/dashboard/tags/_id_/edit.astro.mjs');
const _page33 = () => import('./pages/dashboard/tags.astro.mjs');
const _page34 = () => import('./pages/dashboard.astro.mjs');
const _page35 = () => import('./pages/faq.astro.mjs');
const _page36 = () => import('./pages/portal/access.astro.mjs');
const _page37 = () => import('./pages/sitemap.xml.astro.mjs');
const _page38 = () => import('./pages/tags/_slug_.astro.mjs');
const _page39 = () => import('./pages/underwriters.astro.mjs');
const _page40 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/articles/[id]/view.ts", _page1],
    ["src/pages/api/articles/[id].ts", _page2],
    ["src/pages/api/articles/index.ts", _page3],
    ["src/pages/api/auth/signin.ts", _page4],
    ["src/pages/api/auth/signout.ts", _page5],
    ["src/pages/api/categories/[id].ts", _page6],
    ["src/pages/api/categories/index.ts", _page7],
    ["src/pages/api/ipo-listings/import.ts", _page8],
    ["src/pages/api/ipo-listings/[id].ts", _page9],
    ["src/pages/api/ipo-listings/index.ts", _page10],
    ["src/pages/api/market/index.ts", _page11],
    ["src/pages/api/media/[id].ts", _page12],
    ["src/pages/api/media/index.ts", _page13],
    ["src/pages/api/placeholder/[...size].ts", _page14],
    ["src/pages/api/tags/[id].ts", _page15],
    ["src/pages/api/tags/index.ts", _page16],
    ["src/pages/api/underwriters/index.ts", _page17],
    ["src/pages/api/upload/thumbnail.ts", _page18],
    ["src/pages/artikel/[slug].astro", _page19],
    ["src/pages/artikel/index.astro", _page20],
    ["src/pages/categories/[slug].astro", _page21],
    ["src/pages/dashboard/articles/new.astro", _page22],
    ["src/pages/dashboard/articles/[id]/edit.astro", _page23],
    ["src/pages/dashboard/articles/index.astro", _page24],
    ["src/pages/dashboard/categories/new.astro", _page25],
    ["src/pages/dashboard/categories/[id]/edit.astro", _page26],
    ["src/pages/dashboard/categories/index.astro", _page27],
    ["src/pages/dashboard/ipo-listings/import.astro", _page28],
    ["src/pages/dashboard/ipo-listings/index.astro", _page29],
    ["src/pages/dashboard/media/index.astro", _page30],
    ["src/pages/dashboard/tags/new.astro", _page31],
    ["src/pages/dashboard/tags/[id]/edit.astro", _page32],
    ["src/pages/dashboard/tags/index.astro", _page33],
    ["src/pages/dashboard.astro", _page34],
    ["src/pages/faq.astro", _page35],
    ["src/pages/portal/access.astro", _page36],
    ["src/pages/sitemap.xml.ts", _page37],
    ["src/pages/tags/[slug].astro", _page38],
    ["src/pages/underwriters/index.astro", _page39],
    ["src/pages/index.astro", _page40]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "67044102-671e-4b10-a894-9402d048f00b",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
