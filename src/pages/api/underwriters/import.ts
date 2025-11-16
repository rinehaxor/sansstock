export const prerender = false;

import type { APIRoute } from 'astro';
import { getAuthenticatedSupabase, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { apiRateLimit } from '../../../lib/ratelimit';
import { createErrorResponse } from '../../../lib/error-handler';

// POST /api/underwriters/import - Admin only
// Accepts JSON array of underwriter names:
// Option 1: Array of strings
// ["PT BCA Sekuritas", "PT Mandiri Sekuritas", ...]
// Option 2: Array of objects
// [{ "name": "PT BCA Sekuritas" }, { "name": "PT Mandiri Sekuritas" }, ...]

export const POST: APIRoute = async (context) => {
   // Rate limiting
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   // CSRF Protection
   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return createErrorResponse('UNAUTHORIZED', 401, 'POST /api/underwriters/import');
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return createErrorResponse('FORBIDDEN', 403, 'POST /api/underwriters/import');
   }

   try {
      const body = await context.request.json();
      const { data: underwriterDataArray } = body;

      if (!Array.isArray(underwriterDataArray) || underwriterDataArray.length === 0) {
         return new Response(JSON.stringify({ error: 'Invalid data: Expected an array of underwriter names or objects' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const results = {
         success: 0,
         failed: 0,
         errors: [] as string[],
         imported: [] as any[],
         skipped: [] as string[],
      };

      // Normalize underwriter names from array
      const underwriterNames: string[] = [];
      for (const item of underwriterDataArray) {
         if (typeof item === 'string') {
            // Direct string
            const name = item.trim();
            if (name.length > 0) {
               underwriterNames.push(name);
            }
         } else if (item && typeof item === 'object' && 'name' in item) {
            // Object with name property
            const name = String(item.name).trim();
            if (name.length > 0) {
               underwriterNames.push(name);
            }
         }
      }

      // Remove duplicates
      const uniqueNames = Array.from(new Set(underwriterNames));

      // Process each underwriter one by one to properly track skipped vs new
      if (uniqueNames.length > 0) {
         for (const name of uniqueNames) {
            try {
               // Check if already exists
               const { data: existing } = await authenticatedClient
                  .from('underwriters')
                  .select('id, name')
                  .eq('name', name)
                  .maybeSingle();

               if (existing) {
                  // Already exists, skip
                  results.skipped.push(name);
               } else {
                  // Create new
                  const { data: newUnderwriter, error: insertError } = await authenticatedClient
                     .from('underwriters')
                     .insert({ name })
                     .select()
                     .single();

                  if (insertError) {
                     results.failed++;
                     results.errors.push(`Error inserting "${name}": ${insertError.message}`);
                  } else if (newUnderwriter) {
                     results.success++;
                     results.imported.push({ id: newUnderwriter.id, name: newUnderwriter.name });
                  }
               }
            } catch (error) {
               results.failed++;
               results.errors.push(`Error processing "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
         }
      }

      return new Response(
         JSON.stringify({
            message: `Import completed: ${results.success} successful, ${results.skipped.length} skipped (already exists), ${results.failed} failed`,
            results,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return createErrorResponse(error, 500, 'POST /api/underwriters/import');
   }
};

