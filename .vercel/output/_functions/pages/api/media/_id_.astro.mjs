import { g as getAuthenticatedSupabase, i as isAdmin } from '../../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
      return new Response(JSON.stringify({ error: "Media ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await context.request.json();
    const { alt_text, description, file_path } = body;
    const { data: userData } = await authenticatedClient.auth.getUser();
    const userId = userData?.user?.id;
    let updateQuery = authenticatedClient.from("media_metadata").update({
      alt_text: alt_text || null,
      description: description || null,
      updated_by: userId,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const numericId = parseInt(id);
    if (!isNaN(numericId) && numericId.toString() === id) {
      updateQuery = updateQuery.eq("id", numericId);
    } else if (file_path) {
      updateQuery = updateQuery.eq("file_path", file_path);
    } else {
      updateQuery = updateQuery.eq("file_path", id);
    }
    const { data, error } = await updateQuery.select().maybeSingle();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data) {
      if (file_path) {
        const { data: newData, error: insertError } = await authenticatedClient.from("media_metadata").insert({
          file_path,
          file_name: file_path.split("/").pop() || "unknown",
          file_url: "",
          // Will be updated if needed
          alt_text: alt_text || null,
          description: description || null,
          updated_by: userId,
          created_by: userId
        }).select().single();
        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(
          JSON.stringify({
            success: true,
            data: newData
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      return new Response(JSON.stringify({ error: "Media metadata not found and cannot be created without file_path" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
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
      return new Response(JSON.stringify({ error: "Media ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let filePath = null;
    const numericId = parseInt(id);
    if (!isNaN(numericId) && numericId.toString() === id) {
      const { data: metadata } = await authenticatedClient.from("media_metadata").select("file_path").eq("id", numericId).maybeSingle();
      if (metadata) {
        filePath = metadata.file_path;
      }
    } else {
      filePath = id;
    }
    if (!filePath) {
      const { data: metadata } = await authenticatedClient.from("media_metadata").select("file_path").eq("file_path", id).maybeSingle();
      if (metadata) {
        filePath = metadata.file_path;
      }
    }
    if (filePath) {
      const { error: storageError } = await authenticatedClient.storage.from("article-thumbnails").remove([filePath]);
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
    }
    let deleteBuilder = authenticatedClient.from("media_metadata").delete();
    if (!isNaN(numericId) && numericId.toString() === id) {
      deleteBuilder = deleteBuilder.eq("id", numericId);
    } else if (filePath) {
      deleteBuilder = deleteBuilder.eq("file_path", filePath);
    } else {
      deleteBuilder = deleteBuilder.eq("file_path", id);
    }
    const { error: deleteError } = await deleteBuilder;
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Media deleted successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
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
   PUT,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
