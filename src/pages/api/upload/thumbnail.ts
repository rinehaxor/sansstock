export const prerender = false;

import type { APIRoute } from 'astro';
import { getAuthenticatedSupabase, isAdmin } from '../../../lib/auth';

// POST /api/upload/thumbnail - Upload thumbnail image to Supabase Storage
export const POST: APIRoute = async (context) => {
   // Get authenticated Supabase client
   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Please login' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   // Check if user is admin
   const admin = await isAdmin(context);
   if (!admin) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
         status: 403,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   try {
      const formData = await context.request.formData();
      const file = formData.get('file') as File;
      const altTextFromForm = (formData.get('alt_text') as string) || '';

      if (!file) {
         return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
         return new Response(JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
         return new Response(JSON.stringify({ error: 'File size exceeds 5MB limit' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `thumbnails/${timestamp}-${randomString}.${fileExtension}`;

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Upload to Supabase Storage
      const { data, error } = await authenticatedClient.storage
         .from('article-thumbnails')
         .upload(fileName, bytes, {
            contentType: file.type,
            upsert: false,
         });

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Get public URL
      const { data: urlData } = authenticatedClient.storage
         .from('article-thumbnails')
         .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
         return new Response(JSON.stringify({ error: 'Failed to get public URL' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Get user ID for created_by
      const { data: userData } = await authenticatedClient.auth.getUser();
      const userId = userData?.user?.id;

      // Save metadata to database
      try {
         await authenticatedClient.from('media_metadata').insert({
            file_path: fileName,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            alt_text: altTextFromForm || null,
            created_by: userId,
            updated_by: userId,
         });
      } catch (metadataError) {
         // If metadata insert fails, still return the upload success
         // (metadata is optional, upload itself is more important)
         console.error('Failed to save media metadata:', metadataError);
      }

      return new Response(
         JSON.stringify({
            success: true,
            url: urlData.publicUrl,
            path: fileName,
            alt_text: altTextFromForm || null,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

