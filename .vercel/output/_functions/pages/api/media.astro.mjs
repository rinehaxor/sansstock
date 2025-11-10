import { g as getAuthenticatedSupabase, i as isAdmin } from '../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
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
    const searchParams = context.url.searchParams;
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const { data: files, error } = await authenticatedClient.storage.from("article-thumbnails").list("thumbnails", {
      limit: 1e3,
      // Get all files (Supabase default limit)
      offset: 0,
      sortBy: { column: "created_at", order: "desc" }
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allFiles = (files || []).filter((file) => !file.name.endsWith("/"));
    let filteredFiles = allFiles;
    if (search) {
      filteredFiles = allFiles.filter(
        (file) => file.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    const filePaths = filteredFiles.map((file) => `thumbnails/${file.name}`);
    const { data: metadataRecords } = await authenticatedClient.from("media_metadata").select("*").in("file_path", filePaths);
    const metadataMap = new Map(
      (metadataRecords || []).map((meta) => [meta.file_path, meta])
    );
    const mediaItems = await Promise.all(
      filteredFiles.map(async (file) => {
        const filePath = `thumbnails/${file.name}`;
        const { data: urlData } = authenticatedClient.storage.from("article-thumbnails").getPublicUrl(filePath);
        const metadata = metadataMap.get(filePath);
        return {
          id: metadata?.id || file.id || filePath,
          name: file.name,
          url: urlData.publicUrl,
          size: file.metadata?.size || metadata?.file_size || 0,
          alt_text: metadata?.alt_text || null,
          description: metadata?.description || null,
          created_at: metadata?.created_at || file.created_at || file.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: metadata?.updated_at || file.updated_at || file.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          file_path: filePath
        };
      })
    );
    mediaItems.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
    return new Response(
      JSON.stringify({
        data: mediaItems,
        total: filteredFiles.length,
        limit,
        offset
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
   GET,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
