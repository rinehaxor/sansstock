export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';

// GET /api/underwriters - Public
export const GET: APIRoute = async ({ request, url }) => {
   try {
      const searchParams = url.searchParams;
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
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
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
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// POST /api/underwriters - Admin only
export const POST: APIRoute = async (context) => {
   const authenticatedClient = await getAuthenticatedSupabase(context);
   if (!authenticatedClient) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Please login' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   const admin = await isAdmin(context);
   if (!admin) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
         status: 403,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   try {
      const body = await context.request.json();
      const { name } = body;

      // Validation
      if (!name) {
         return new Response(JSON.stringify({ error: 'Missing required field: name' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Create or get underwriter (upsert)
      const { data: underwriter, error: underwriterError } = await authenticatedClient
         .from('underwriters')
         .upsert({ name }, { onConflict: 'name' })
         .select()
         .single();

      if (underwriterError) {
         return new Response(JSON.stringify({ error: underwriterError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: underwriter }), {
         status: 201,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

