import { s as supabase } from '../../../../chunks/supabase_Bf3LIET_.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async ({ params }) => {
  try {
    const id = params.id;
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
    const { data: articleData, error: selectError } = await supabase.from("articles").select("views_count, id").eq("id", articleId).single();
    if (selectError) {
      if (selectError.code === "42703" || selectError.message?.includes("views_count")) {
        console.warn("views_count column does not exist yet. Please run migration.");
        return new Response(JSON.stringify({
          success: false,
          message: "views_count column does not exist. Please run ADD_VIEWS_COUNT_COLUMN.sql migration.",
          views_count: 0
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        error: selectError.message,
        code: selectError.code
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!articleData) {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const currentViews = articleData.views_count || 0;
    const newViewsCount = currentViews + 1;
    const { data: updateData, error: updateError } = await supabase.from("articles").update({ views_count: newViewsCount }).eq("id", articleId).select("views_count").single();
    if (updateError) {
      console.error("Error updating views_count:", updateError);
      return new Response(JSON.stringify({
        error: updateError.message,
        code: updateError.code,
        details: updateError.details
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      views_count: updateData?.views_count || newViewsCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Unexpected error in view endpoint:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
        stack: error instanceof Error ? error.stack : void 0
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
