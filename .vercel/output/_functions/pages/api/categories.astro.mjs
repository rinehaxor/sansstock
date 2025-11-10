import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin } from '../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    const { data: categories, error } = await supabase.from("categories").select("id, name, slug, description, created_at, updated_at").order("name", { ascending: true });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data: categories }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async (context) => {
  const authenticatedClient = await getAuthenticatedSupabase(context);
  if (!authenticatedClient) {
    return new Response(JSON.stringify({ error: "Unauthorized - Please login" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const admin = await isAdmin(context);
  if (!admin) {
    return new Response(JSON.stringify({ error: "Forbidden - Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await context.request.json();
    const { name, slug, description } = body;
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: "Name and slug are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: existingCategory } = await authenticatedClient.from("categories").select("id").eq("slug", slug).single();
    if (existingCategory) {
      return new Response(JSON.stringify({ error: "Category with this slug already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: category, error: categoryError } = await authenticatedClient.from("categories").insert({
      name,
      slug,
      description: description || null
    }).select().single();
    if (categoryError) {
      return new Response(JSON.stringify({ error: categoryError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data: category }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   GET,
   POST,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
