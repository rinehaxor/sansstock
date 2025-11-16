export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { publicRateLimit, apiRateLimit } from '../../../lib/ratelimit';
import { createErrorResponse, createValidationErrorResponse } from '../../../lib/error-handler';
import { safeValidateAndSanitize, underwriterSchema } from '../../../lib/validation';

// GET /api/underwriters - Public
export const GET: APIRoute = async (context) => {
   const rateLimitError = publicRateLimit(context);
   if (rateLimitError) {
      return rateLimitError;
   }

   try {
      const searchParams = context.url.searchParams;
      const search = searchParams.get('search');
      const includeStats = searchParams.get('include_stats') === 'true';

      let query = supabase
         .from('underwriters')
         .select(
            includeStats
               ? `
            *,
            ipo_underwriters:ipo_underwriters (
               ipo_listing:ipo_listings (
                  id,
                  ticker_symbol,
                  company_name,
                  ipo_date,
                  ipo_performance_metrics:ipo_performance_metrics (
                     metric_name,
                     metric_value,
                     period_days
                  )
               )
            )
         `
               : '*',
            { count: 'exact' }
         )
         .order('name', { ascending: true });

      // Search
      if (search) {
         query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
         return createErrorResponse(error, 500, 'GET /api/underwriters');
      }

      // If includeStats is true, calculate performance stats
      let dataWithStats = data;
      if (includeStats && data) {
         dataWithStats = data.map((underwriter: any) => {
            const ipoUnderwriters = underwriter.ipo_underwriters || [];
            const ipoListings = ipoUnderwriters.map((item: any) => item.ipo_listing).filter((item: any) => item !== null);
            const allMetrics: any[] = [];

            ipoUnderwriters.forEach((item: any) => {
               const metrics = item.ipo_listing?.ipo_performance_metrics || [];
               allMetrics.push(...metrics);
            });

            // Group metrics by period_days
            const metricsByPeriod: Record<number, number[]> = {};
            allMetrics.forEach((metric: any) => {
               if (metric.period_days && metric.metric_value !== null) {
                  if (!metricsByPeriod[metric.period_days]) {
                     metricsByPeriod[metric.period_days] = [];
                  }
                  metricsByPeriod[metric.period_days].push(metric.metric_value);
               }
            });

            // Calculate averages for each period
            const avgPerformance: Record<number, number> = {};
            Object.keys(metricsByPeriod).forEach((period) => {
               const values = metricsByPeriod[parseInt(period)];
               const avg = values.reduce((a, b) => a + b, 0) / values.length;
               avgPerformance[parseInt(period)] = parseFloat(avg.toFixed(2));
            });

            return {
               ...underwriter,
               total_ipos: ipoListings.length,
               avg_performance: avgPerformance,
               ipo_listings: ipoListings,
            };
         });
      }

      return new Response(
         JSON.stringify({
            data: dataWithStats || [],
            total: count || 0,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      return createErrorResponse(error, 500, 'GET /api/underwriters');
   }
};

// POST /api/underwriters - Admin only
export const POST: APIRoute = async (context) => {
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
      return createErrorResponse('UNAUTHORIZED', 401, 'POST /api/underwriters');
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return createErrorResponse('FORBIDDEN', 403, 'POST /api/underwriters');
   }

   try {
      const body = await context.request.json();
      const validationResult = safeValidateAndSanitize(underwriterSchema, body);

      if (!validationResult.success) {
         return createValidationErrorResponse(validationResult.error.errors);
      }

      const { name } = validationResult.data;

      // Create or get underwriter (upsert)
      const { data: underwriter, error: underwriterError } = await authenticatedClient
         .from('underwriters')
         .upsert({ name }, { onConflict: 'name' })
         .select()
         .single();

      if (underwriterError) {
         return createErrorResponse(underwriterError, 500, 'POST /api/underwriters');
      }

      return new Response(JSON.stringify({ data: underwriter }), {
         status: 201,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return createErrorResponse(error, 500, 'POST /api/underwriters');
   }
};
