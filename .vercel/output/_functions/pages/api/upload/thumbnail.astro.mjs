import { g as getAuthenticatedSupabase, i as isAdmin } from '../../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
    const formData = await context.request.formData();
    const file = formData.get("file");
    const altTextFromForm = formData.get("alt_text") || "";
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type. Only images are allowed." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File size exceeds 5MB limit" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `thumbnails/${timestamp}-${randomString}.${fileExtension}`;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const { data, error } = await authenticatedClient.storage.from("article-thumbnails").upload(fileName, bytes, {
      contentType: file.type,
      upsert: false
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: urlData } = authenticatedClient.storage.from("article-thumbnails").getPublicUrl(fileName);
    if (!urlData?.publicUrl) {
      return new Response(JSON.stringify({ error: "Failed to get public URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: userData } = await authenticatedClient.auth.getUser();
    const userId = userData?.user?.id;
    try {
      await authenticatedClient.from("media_metadata").insert({
        file_path: fileName,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        alt_text: altTextFromForm || null,
        created_by: userId,
        updated_by: userId
      });
    } catch (metadataError) {
      console.error("Failed to save media metadata:", metadataError);
    }
    return new Response(
      JSON.stringify({
        success: true,
        url: urlData.publicUrl,
        path: fileName,
        alt_text: altTextFromForm || null
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   POST,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
