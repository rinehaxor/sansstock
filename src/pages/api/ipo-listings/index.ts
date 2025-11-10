export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';

// GET /api/ipo-listings - Public (semua bisa akses)
export const GET: APIRoute = async ({ request, url }) => {
   try {
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const underwriterId = searchParams.get('underwriter_id');
      const tickerSymbol = searchParams.get('ticker_symbol');
      const search = searchParams.get('search');

      let query = supabase
         .from('ipo_listings')
         .select(
            `
            id,
            ticker_symbol,
            company_name,
            ipo_date,
            general_sector,
            specific_sector,
            shares_offered,
            total_value,
            ipo_price,
            created_at,
            updated_at,
            ipo_underwriters:ipo_underwriters (
               underwriter:underwriters (
                  id,
                  name
               )
            )
         `,
            { count: 'exact' }
         )
         .order('ipo_date', { ascending: false })
         .range((page - 1) * limit, page * limit - 1);

      // Filter by underwriter - we'll need to use a join instead
      // This is handled after the query with post-processing for now

      // Filter by ticker symbol
      if (tickerSymbol) {
         query = query.eq('ticker_symbol', tickerSymbol);
      }

      // Search
      if (search) {
         query = query.or(
            `ticker_symbol.ilike.%${search}%,company_name.ilike.%${search}%,general_sector.ilike.%${search}%,specific_sector.ilike.%${search}%`
         );
      }

      const { data, error, count } = await query;

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(
         JSON.stringify({
            data: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
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

// POST /api/ipo-listings - Admin only
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

   const user = await getAuthenticatedUser(context);
   if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   try {
      const body = await context.request.json();
      const {
         ticker_symbol,
         company_name,
         ipo_date,
         general_sector,
         specific_sector,
         shares_offered,
         total_value,
         ipo_price,
         underwriter_ids = [],
         performance_metrics = [],
      } = body;

      // Validation
      if (!ticker_symbol || !company_name || !ipo_date) {
         return new Response(JSON.stringify({ error: 'Missing required fields: ticker_symbol, company_name, ipo_date' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Create IPO listing
      const { data: ipoListing, error: ipoError } = await authenticatedClient
         .from('ipo_listings')
         .insert({
            ticker_symbol,
            company_name,
            ipo_date,
            general_sector: general_sector || null,
            specific_sector: specific_sector || null,
            shares_offered: shares_offered ? BigInt(shares_offered) : null,
            total_value: total_value || null,
            ipo_price: ipo_price || null,
         })
         .select()
         .single();

      if (ipoError) {
         return new Response(JSON.stringify({ error: ipoError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Add underwriters if provided
      if (underwriter_ids.length > 0) {
         const ipoUnderwriters = underwriter_ids.map((underwriterId: number) => ({
            ipo_listing_id: ipoListing.id,
            underwriter_id: underwriterId,
         }));

         const { error: underwriterError } = await authenticatedClient
            .from('ipo_underwriters')
            .insert(ipoUnderwriters);

         if (underwriterError) {
            console.error('Error adding underwriters:', underwriterError);
         }
      }

      // Add performance metrics if provided
      if (performance_metrics.length > 0) {
         const metrics = performance_metrics.map((metric: any) => ({
            ipo_listing_id: ipoListing.id,
            metric_name: metric.metric_name || 'return',
            metric_value: metric.metric_value || null,
            period_days: metric.period_days || null,
         }));

         const { error: metricsError } = await authenticatedClient
            .from('ipo_performance_metrics')
            .insert(metrics);

         if (metricsError) {
            console.error('Error adding performance metrics:', metricsError);
         }
      }

      // Fetch the complete IPO listing with relationships
      const { data: completeListing } = await authenticatedClient
         .from('ipo_listings')
         .select(
            `
            *,
            ipo_underwriters:ipo_underwriters (
               underwriter:underwriters (
                  id,
                  name
               )
            ),
            ipo_performance_metrics:ipo_performance_metrics (
               id,
               metric_name,
               metric_value,
               period_days
            )
         `
         )
         .eq('id', ipoListing.id)
         .single();

      return new Response(JSON.stringify({ data: completeListing }), {
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

