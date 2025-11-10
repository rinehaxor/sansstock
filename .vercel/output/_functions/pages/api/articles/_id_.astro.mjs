import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin, a as getAuthenticatedUser } from '../../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Article ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("articles").select(`
				*,
				categories:category_id (
					id,
					name,
					slug,
					description
				),
				sources:source_id (
					id,
					name,
					slug
				),
				article_tags (
					tags:tag_id (
						id,
						name,
						slug
					)
				)
			`).eq("id", id).single();
    if (data && data.status === "published") {
      fetch(`/api/articles/${id}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }).catch(() => {
      });
    }
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.code === "PGRST116" ? 404 : 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (data.status !== "published") {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
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
  const user = await getAuthenticatedUser(context);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const id = context.params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Article ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await context.request.json();
    const {
      title,
      slug,
      summary,
      meta_title,
      meta_description,
      meta_keywords,
      content,
      thumbnail_url,
      thumbnail_alt,
      category_id,
      source_id,
      status,
      tag_ids,
      url_original,
      featured
    } = body;
    const updateData = {
      updated_by: user.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (summary !== void 0) updateData.summary = summary;
    if (meta_title !== void 0) updateData.meta_title = meta_title;
    if (meta_description !== void 0) updateData.meta_description = meta_description;
    if (meta_keywords !== void 0) updateData.meta_keywords = meta_keywords;
    if (content) updateData.content = content;
    if (thumbnail_url !== void 0) updateData.thumbnail_url = thumbnail_url;
    if (thumbnail_alt !== void 0) updateData.thumbnail_alt = thumbnail_alt || null;
    if (category_id) updateData.category_id = category_id;
    if (source_id !== void 0) updateData.source_id = source_id;
    if (status) {
      updateData.status = status;
      if (status === "published" && !updateData.published_at) {
        updateData.published_at = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    if (url_original !== void 0) updateData.url_original = url_original;
    if (featured !== void 0) updateData.featured = featured;
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return new Response(JSON.stringify({ error: "Invalid article ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: article, error: articleError } = await authenticatedClient.from("articles").update(updateData).eq("id", articleId).select().single();
    if (articleError) {
      return new Response(JSON.stringify({ error: articleError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (tag_ids !== void 0 && Array.isArray(tag_ids)) {
      await authenticatedClient.from("article_tags").delete().eq("article_id", articleId);
      if (tag_ids.length > 0) {
        const articleTags = tag_ids.map((tagId) => ({
          article_id: articleId,
          tag_id: parseInt(tagId.toString())
        }));
        const { error: tagsError } = await authenticatedClient.from("article_tags").insert(articleTags);
        if (tagsError) {
          return new Response(JSON.stringify({ error: `Failed to update tags: ${tagsError.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    if (thumbnail_url && thumbnail_alt) {
      try {
        await authenticatedClient.from("media_metadata").update({ alt_text: thumbnail_alt }).eq("file_url", thumbnail_url);
      } catch (metadataError) {
        console.error("Failed to update media metadata:", metadataError);
      }
    }
    return new Response(JSON.stringify({ data: article }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
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
      return new Response(JSON.stringify({ error: "Article ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return new Response(JSON.stringify({ error: "Invalid article ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await authenticatedClient.from("article_tags").delete().eq("article_id", articleId);
    const { error } = await authenticatedClient.from("articles").delete().eq("id", articleId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Article deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
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
