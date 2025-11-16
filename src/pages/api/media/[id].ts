export const prerender = false;

import type { APIRoute } from 'astro';
import { getAuthenticatedSupabase, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { apiRateLimit } from '../../../lib/ratelimit';
import {
   createErrorResponse,
   createSuccessResponse,
   createValidationErrorResponse,
   ErrorMessages,
} from '../../../lib/error-handler';
import { mediaMetadataSchema, safeValidateAndSanitize } from '../../../lib/validation';

function parseNumericId(id: string | undefined): number | null {
   if (!id) {
      return null;
   }

   const parsed = parseInt(id, 10);
   return !isNaN(parsed) && parsed.toString() === id ? parsed : null;
}

// PUT /api/media/[id] - Update media metadata (alt text, description)
export const PUT: APIRoute = async (context) => {
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'PUT /api/media/[id]');
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return createErrorResponse(ErrorMessages.FORBIDDEN, 403, 'PUT /api/media/[id]');
   }

   try {
      const id = context.params.id;
      if (!id) {
         return createErrorResponse(ErrorMessages.MISSING_REQUIRED_FIELDS, 400, 'PUT /api/media/[id]');
      }

      const body = await context.request.json();
      const validationResult = safeValidateAndSanitize(mediaMetadataSchema, body);

      if (!validationResult.success) {
         return createValidationErrorResponse(validationResult.error.errors);
      }

      const { alt_text, description, file_path } = validationResult.data;
      const numericId = parseNumericId(id);

      const {
         data: userData,
         error: userError,
      } = await authenticatedClient.auth.getUser();

      if (userError) {
         return createErrorResponse(userError, 500, 'PUT /api/media/[id] - auth');
      }

      const userId = userData?.user?.id;

      let updateQuery = authenticatedClient
         .from('media_metadata')
         .update({
            alt_text: alt_text ?? null,
            description: description ?? null,
            updated_by: userId,
            updated_at: new Date().toISOString(),
         });

      if (numericId !== null) {
         updateQuery = updateQuery.eq('id', numericId);
      } else if (file_path) {
         updateQuery = updateQuery.eq('file_path', file_path);
      } else {
         updateQuery = updateQuery.eq('file_path', id);
      }

      const { data, error } = await updateQuery.select().maybeSingle();

      if (error) {
         return createErrorResponse(error, 500, 'PUT /api/media/[id] - update');
      }

      if (!data) {
         if (!file_path) {
            return createErrorResponse(ErrorMessages.NOT_FOUND, 404, 'PUT /api/media/[id] - missing file path');
         }

         const { data: newData, error: insertError } = await authenticatedClient
            .from('media_metadata')
            .insert({
               file_path,
               file_name: file_path.split('/').pop() || 'unknown',
               file_url: '',
               alt_text: alt_text ?? null,
               description: description ?? null,
               updated_by: userId,
               created_by: userId,
            })
            .select()
            .single();

         if (insertError) {
            return createErrorResponse(insertError, 500, 'PUT /api/media/[id] - insert');
         }

         return createSuccessResponse(newData);
      }

      return createSuccessResponse(data);
   } catch (error) {
      return createErrorResponse(error, 500, 'PUT /api/media/[id]');
   }
};

// DELETE /api/media/[id] - Delete media file and metadata
export const DELETE: APIRoute = async (context) => {
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, 'DELETE /api/media/[id]');
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return createErrorResponse(ErrorMessages.FORBIDDEN, 403, 'DELETE /api/media/[id]');
   }

   try {
     const id = context.params.id;
     if (!id) {
        return createErrorResponse(ErrorMessages.MISSING_REQUIRED_FIELDS, 400, 'DELETE /api/media/[id]');
     }

     const numericId = parseNumericId(id);
     let filePath: string | null = null;

     if (numericId !== null) {
        const { data: metadata } = await authenticatedClient
           .from('media_metadata')
           .select('file_path')
           .eq('id', numericId)
           .maybeSingle();

        if (metadata) {
           filePath = metadata.file_path;
        }
     } else {
        filePath = id;
     }

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

     if (filePath) {
        const { error: storageError } = await authenticatedClient.storage
           .from('article-thumbnails')
           .remove([filePath]);

        if (storageError) {
           console.error('Error deleting file from storage:', storageError);
        }
     }

     let deleteBuilder = authenticatedClient.from('media_metadata').delete();

     if (numericId !== null) {
        deleteBuilder = deleteBuilder.eq('id', numericId);
     } else if (filePath) {
        deleteBuilder = deleteBuilder.eq('file_path', filePath);
     } else {
        deleteBuilder = deleteBuilder.eq('file_path', id);
     }

     const { error: deleteError } = await deleteBuilder;

     if (deleteError) {
        return createErrorResponse(deleteError, 500, 'DELETE /api/media/[id]');
     }

     return createSuccessResponse({ message: 'Media deleted successfully' });
   } catch (error) {
     return createErrorResponse(error, 500, 'DELETE /api/media/[id]');
   }
};
