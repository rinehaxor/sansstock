export const prerender = false;

import type { APIRoute } from 'astro';
import { getAuthenticatedSupabase, isAdmin } from '../../../lib/auth';

// PUT /api/media/[id] - Update media metadata (alt text, description)
export const PUT: APIRoute = async (context) => {
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
      const id = context.params.id;
      if (!id) {
         return new Response(JSON.stringify({ error: 'Media ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const body = await context.request.json();
      const { alt_text, description, file_path } = body;

      // Get user ID for updated_by
      const { data: userData } = await authenticatedClient.auth.getUser();
      const userId = userData?.user?.id;

      // ID can be either:
      // 1. Integer (from media_metadata.id in database)
      // 2. UUID string (from storage file id)
      // 3. file_path string
      // We'll prioritize file_path if provided, otherwise try parsing as int, then use ID directly
      
      let updateQuery = authenticatedClient
         .from('media_metadata')
         .update({
            alt_text: alt_text || null,
            description: description || null,
            updated_by: userId,
            updated_at: new Date().toISOString(),
         });

      // Check if ID is a number (from database)
      const numericId = parseInt(id);
      if (!isNaN(numericId) && numericId.toString() === id) {
         // ID is a valid integer, use it
         updateQuery = updateQuery.eq('id', numericId);
      } else if (file_path) {
         // Use file_path if provided (most reliable)
         updateQuery = updateQuery.eq('file_path', file_path);
      } else {
         // Try to use ID as file_path (fallback)
         updateQuery = updateQuery.eq('file_path', id);
      }

      const { data, error } = await updateQuery.select().maybeSingle();

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // If no data found, the record might not exist yet - create it
      if (!data) {
         // Try to get file info from storage to create metadata
         // For now, we'll create a basic record if file_path is provided
         if (file_path) {
            const { data: newData, error: insertError } = await authenticatedClient
               .from('media_metadata')
               .insert({
                  file_path: file_path,
                  file_name: file_path.split('/').pop() || 'unknown',
                  file_url: '', // Will be updated if needed
                  alt_text: alt_text || null,
                  description: description || null,
                  updated_by: userId,
                  created_by: userId,
               })
               .select()
               .single();

            if (insertError) {
               return new Response(JSON.stringify({ error: insertError.message }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
               });
            }

            return new Response(
               JSON.stringify({
                  success: true,
                  data: newData,
               }),
               {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         }

         return new Response(JSON.stringify({ error: 'Media metadata not found and cannot be created without file_path' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(
         JSON.stringify({
            success: true,
            data,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return new Response(
         JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }
};

// DELETE /api/media/[id] - Delete media file and metadata
export const DELETE: APIRoute = async (context) => {
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
      const id = context.params.id;
      if (!id) {
         return new Response(JSON.stringify({ error: 'Media ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // First, try to get metadata to find file_path
      let filePath: string | null = null;

      // Check if ID is a number (from database)
      const numericId = parseInt(id);
      if (!isNaN(numericId) && numericId.toString() === id) {
         // ID is a valid integer, try to get metadata from database
         const { data: metadata } = await authenticatedClient
            .from('media_metadata')
            .select('file_path')
            .eq('id', numericId)
            .maybeSingle();

         if (metadata) {
            filePath = metadata.file_path;
         }
      } else {
         // Try using ID as file_path directly
         filePath = id;
      }

      // If we still don't have file_path, try to query by file_path
      if (!filePath) {
         const { data: metadata } = await authenticatedClient
            .from('media_metadata')
            .select('file_path')
            .eq('file_path', id)
            .maybeSingle();

         if (metadata) {
            filePath = metadata.file_path;
         }
      }

      // Delete file from storage if we have file_path
      if (filePath) {
         const { error: storageError } = await authenticatedClient.storage
            .from('article-thumbnails')
            .remove([filePath]);

         if (storageError) {
            console.error('Error deleting file from storage:', storageError);
            // Continue with metadata deletion even if storage deletion fails
         }
      }

      // Delete metadata from database (order: .delete().eq(...))
      let deleteBuilder = authenticatedClient.from('media_metadata').delete();

      if (!isNaN(numericId) && numericId.toString() === id) {
         deleteBuilder = deleteBuilder.eq('id', numericId);
      } else if (filePath) {
         deleteBuilder = deleteBuilder.eq('file_path', filePath);
      } else {
         deleteBuilder = deleteBuilder.eq('file_path', id);
      }

      const { error: deleteError } = await deleteBuilder;

      if (deleteError) {
         return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(
         JSON.stringify({
            success: true,
            message: 'Media deleted successfully',
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return new Response(
         JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }
};

