/* empty css                                        */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
import { A as ArticleForm } from '../../../chunks/ArticleForm_CPxlAroL.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
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
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");
  const { data: sources } = await supabase.from("sources").select("id, name").eq("is_active", true).order("name");
  const { data: tags } = await supabase.from("tags").select("id, name").order("name");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Artikel Baru", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1> <p class="mt-2 text-sm text-gray-600">Isi form di bawah untuk membuat artikel baru</p> </div> <a href="/dashboard/articles" class="text-sm text-gray-600 hover:text-gray-900">
← Kembali ke Daftar Artikel
</a> </div> </div> <!-- Form --> ${renderComponent($$result2, "ArticleForm", ArticleForm, { "client:load": true, "mode": "create", "categories": categories || [], "sources": sources || [], "tags": tags || [], "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/ArticleForm.tsx", "client:component-export": "default" })} </div>` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/articles/new.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/articles/new.astro";
const $$url = "/dashboard/articles/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$New,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
