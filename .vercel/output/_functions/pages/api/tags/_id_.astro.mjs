import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin } from '../../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tag ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("tags").select("*").eq("id", id).single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.code === "PGRST116" ? 404 : 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data }), {
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
const PUT = async (context) => {
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
    const id = context.params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tag ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await context.request.json();
    const { name, slug, description } = body;
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) {
      const { data: existingTag } = await authenticatedClient.from("tags").select("id").eq("slug", slug).neq("id", id).single();
      if (existingTag) {
        return new Response(JSON.stringify({ error: "Tag with this slug already exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      updateData.slug = slug;
    }
    if (description !== void 0) updateData.description = description;
    const { data: tag, error: tagError } = await authenticatedClient.from("tags").update(updateData).eq("id", id).select().single();
    if (tagError) {
      return new Response(JSON.stringify({ error: tagError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data: tag }), {
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
const DELETE = async (context) => {
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
    const id = context.params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tag ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: articleTags } = await authenticatedClient.from("article_tags").select("article_id").eq("tag_id", id).limit(1);
    if (articleTags && articleTags.length > 0) {
      return new Response(JSON.stringify({ error: "Cannot delete tag because it is used in one or more articles" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error } = await authenticatedClient.from("tags").delete().eq("id", id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Tag deleted successfully" }), {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   DELETE,
   GET,
   PUT,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
