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
import { safeValidateAndSanitize, underwriterSchema } from '../../../lib/validation';

function parseUnderwriterId(id: string | undefined): number | null {
   if (!id) {
      return null;
   }

   const parsed = Number.parseInt(id, 10);
   return Number.isNaN(parsed) ? null : parsed;
}

async function requireAdminClient(context: Parameters<APIRoute>[0]) {
   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return { error: createErrorResponse(ErrorMessages.UNAUTHORIZED, 401, context.request.url) };
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return { error: createErrorResponse(ErrorMessages.FORBIDDEN, 403, context.request.url) };
   }

   return { client: authenticatedClient };
}

export const GET: APIRoute = async (context) => {
   const underwriterId = parseUnderwriterId(context.params.id);
   if (underwriterId === null) {
      return createErrorResponse(ErrorMessages.INVALID_INPUT, 400, 'GET /api/underwriters/[id]');
   }

   // Check if include_ipos query param is present (public access for comparison feature)
   const includeIpos = context.url.searchParams.get('include_ipos') === 'true';
   
   // Use public client if only fetching IPO data, otherwise require admin
   let client;
   if (includeIpos) {
      const { supabase } = await import('../../../db/supabase');
      client = supabase;
   } else {
      const adminResult = await requireAdminClient(context);
      if (!adminResult.client) {
         return adminResult.error!;
      }
      client = adminResult.client;
   }

   let query = client
      .from('underwriters')
      .select(
         includeIpos
            ? `
            id,
            name,
            created_at,
            updated_at,
            ipo_underwriters:ipo_underwriters (
               ipo_listing:ipo_listings (
                  id,
                  ticker_symbol,
                  company_name,
                  ipo_date,
                  ipo_price,
                  ipo_performance_metrics:ipo_performance_metrics (
                     metric_name,
                     metric_value,
                     period_days
                  )
               )
            )
         `
            : 'id, name, created_at, updated_at'
      )
      .eq('id', underwriterId)
      .maybeSingle();

   const { data, error: fetchError } = await query;

   if (fetchError) {
      return createErrorResponse(fetchError, 500, 'GET /api/underwriters/[id]');
   }

   if (!data) {
      return createErrorResponse(ErrorMessages.NOT_FOUND, 404, 'GET /api/underwriters/[id]');
   }

   return createSuccessResponse(data);
};

export const PUT: APIRoute = async (context) => {
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const underwriterId = parseUnderwriterId(context.params.id);
   if (underwriterId === null) {
      return createErrorResponse(ErrorMessages.INVALID_INPUT, 400, 'PUT /api/underwriters/[id]');
   }

   const { client, error } = await requireAdminClient(context);
   if (!client) {
      return error!;
   }

   try {
      const body = await context.request.json();
      const validationResult = safeValidateAndSanitize(underwriterSchema, body);

      if (!validationResult.success) {
         return createValidationErrorResponse(validationResult.error.errors);
      }

      const { name } = validationResult.data;

      const { data, error: updateError } = await client
         .from('underwriters')
         .update({ name })
         .eq('id', underwriterId)
         .select()
         .maybeSingle();

      if (updateError) {
         return createErrorResponse(updateError, 500, 'PUT /api/underwriters/[id]');
      }

      if (!data) {
         return createErrorResponse(ErrorMessages.NOT_FOUND, 404, 'PUT /api/underwriters/[id]');
      }

      return createSuccessResponse(data);
   } catch (err) {
      return createErrorResponse(err, 500, 'PUT /api/underwriters/[id]');
   }
};

export const DELETE: APIRoute = async (context) => {
   const rateLimitError = apiRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   const csrfError = csrfProtection(context);
   if (csrfError) {
      return csrfError;
   }

   const underwriterId = parseUnderwriterId(context.params.id);
   if (underwriterId === null) {
      return createErrorResponse(ErrorMessages.INVALID_INPUT, 400, 'DELETE /api/underwriters/[id]');
   }

   const { client, error } = await requireAdminClient(context);
   if (!client) {
      return error!;
   }

   const { data: usage, error: usageError } = await client
      .from('ipo_underwriters')
      .select('id')
      .eq('underwriter_id', underwriterId)
      .limit(1);

   if (usageError) {
      return createErrorResponse(usageError, 500, 'DELETE /api/underwriters/[id] - usage check');
   }

   if (usage && usage.length > 0) {
      return createErrorResponse(ErrorMessages.IN_USE, 400, 'DELETE /api/underwriters/[id] - in use');
   }

   const { error: deleteError } = await client.from('underwriters').delete().eq('id', underwriterId);

   if (deleteError) {
      return createErrorResponse(deleteError, 500, 'DELETE /api/underwriters/[id]');
   }

   return createSuccessResponse({ success: true });
};
