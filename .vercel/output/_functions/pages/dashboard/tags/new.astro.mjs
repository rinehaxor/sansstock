/* empty css                                        */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead, f as renderScript } from '../../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_ASOqeeWw.mjs';
import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
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
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Tag Baru", "email": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">Buat Tag Baru</h1> <p class="mt-2 text-sm text-gray-600">Isi form di bawah untuk membuat tag baru</p> </div> <a href="/dashboard/tags" class="text-sm text-gray-600 hover:text-gray-900">
← Kembali ke Daftar Tags
</a> </div> </div> <!-- Form --> <form id="tagForm" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6"> <!-- Name --> <div> <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
Nama Tag <span class="text-red-500">*</span> </label> <input type="text" id="name" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Ekonomi, Teknologi, Saham"> </div> <!-- Slug --> <div> <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
Slug (URL) <span class="text-red-500">*</span> </label> <input type="text" id="slug" name="slug" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ekonomi-teknologi-saham"> <p class="mt-1 text-xs text-gray-500">URL-friendly version (huruf kecil, dipisahkan dengan tanda hubung)</p> </div> <!-- Description --> <div> <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
Deskripsi
</label> <textarea id="description" name="description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Deskripsi singkat tentang tag ini (opsional)"></textarea> </div> <!-- Actions --> <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200"> <a href="/dashboard/tags" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
Batal
</a> <button type="submit" class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Simpan Tag
</button> </div> </form> </div> ${renderScript($$result2, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/tags/new.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/tags/new.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/dashboard/tags/new.astro";
const $$url = "/dashboard/tags/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$New,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
