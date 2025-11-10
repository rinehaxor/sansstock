/* empty css                                     */
import { c as createComponent, a as createAstro, r as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DJYPjeXe.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DE1DG0QU.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { $ as $$Image } from '../../chunks/_astro_assets_D8cCpO2h.mjs';
import { l as logo } from '../../chunks/Toaster_C1sffp9X.mjs';
export { renderers } from '../../renderers.mjs';

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});
function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      const result = await response.json();
      if (result.success && result.redirect) {
        window.location.replace(result.redirect);
      } else {
        window.location.replace("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "email",
          type: "email",
          autoComplete: "email",
          ...register("email"),
          className: `w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-300" : "border-gray-300"}`,
          placeholder: "Enter your email"
        }
      ),
      errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "password",
          type: "password",
          autoComplete: "current-password",
          ...register("password"),
          className: `w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-300" : "border-gray-300"}`,
          placeholder: "Enter your password"
        }
      ),
      errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm", children: error }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200", children: isSubmitting ? "Signing in..." : "Sign in" }) })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Access = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Access;
  const { cookies, redirect } = Astro2;
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  if (accessToken && refreshToken) {
    return redirect("/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8"> <div class="max-w-md w-full space-y-8"> <!-- Header --> <div class="text-center"> <div class="mx-auto flex items-center justify-center mb-4"> ${renderComponent($$result2, "Image", $$Image, { "src": logo, "alt": "SansStocks Logo", "width": 160, "height": 150, "format": "webp", "class": "object-contain" })} </div> </div> <!-- Login Form --> <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8"> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProjekGabut/sansstocks/sansstocks/src/components/LoginForm", "client:component-export": "default" })} </div> <!-- Footer --> <div class="text-center"> <p class="text-sm text-gray-600">
Admin Portal - SansStocks Dashboard
</p> </div> </div> </div> ` })}`;
}, "D:/ProjekGabut/sansstocks/sansstocks/src/pages/portal/access.astro", void 0);

const $$file = "D:/ProjekGabut/sansstocks/sansstocks/src/pages/portal/access.astro";
const $$url = "/portal/access";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Access,
   file: $$file,
   prerender,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
