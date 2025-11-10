import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin, a as getAuthenticatedUser } from '../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("category_id");
    const status = searchParams.get("status") || "published";
    const search = searchParams.get("search");
    let query = supabase.from("articles").select(
      `
				id,
				title,
				slug,
				summary,
				thumbnail_url,
				status,
				published_at,
				created_at,
				featured,
				views_count,
				categories:category_id (
					id,
					name,
					slug
				),
				sources:source_id (
					id,
					name
				)
			`
    ).eq("status", status).order("published_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,content.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { count: totalCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", status);
    return new Response(
      JSON.stringify({
        data: data || [],
        total: totalCount || 0,
        page,
        limit,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
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
  const user = await getAuthenticatedUser(context);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await context.request.json();
    const { title, slug, summary, meta_title, meta_description, meta_keywords, content, thumbnail_url, thumbnail_alt, category_id, source_id, status = "draft", tag_ids = [], url_original, featured = false } = body;
    if (!title || !slug || !content || !category_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: article, error: articleError } = await authenticatedClient.from("articles").insert({
      title,
      slug,
      summary,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      meta_keywords: meta_keywords || null,
      content,
      thumbnail_url,
      thumbnail_alt: thumbnail_alt || null,
      category_id,
      source_id,
      status,
      url_original,
      featured,
      created_by: user.id,
      updated_by: user.id,
      published_at: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
    }).select().single();
    if (articleError) {
      return new Response(JSON.stringify({ error: articleError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (tag_ids.length > 0) {
      const articleTags = tag_ids.map((tagId) => ({
        article_id: article.id,
        tag_id: tagId
      }));
      await authenticatedClient.from("article_tags").insert(articleTags);
    }
    if (thumbnail_url && thumbnail_alt) {
      try {
        await authenticatedClient.from("media_metadata").update({ alt_text: thumbnail_alt }).eq("file_url", thumbnail_url);
      } catch (metadataError) {
        console.error("Failed to update media metadata:", metadataError);
      }
    }
    return new Response(JSON.stringify({ data: article }), {
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
