export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';
import { apiRateLimit } from '../../../lib/ratelimit';

const normalizeIpoListing = (record: any) => {
   if (!record) {
      return record;
   }

   const toNumber = (value: unknown) => (value === null || value === undefined ? null : Number(value));

   const normalizeUnderwriterLink = (entry: any) => {
      if (!entry) {
         return entry;
      }

      return {
         ...entry,
         id: toNumber(entry.id),
         ipo_listing_id: toNumber(entry.ipo_listing_id),
         underwriter_id: toNumber(entry.underwriter_id),
         underwriter: entry.underwriter
            ? {
                 ...entry.underwriter,
                 id: toNumber(entry.underwriter.id),
              }
            : null,
      };
   };

   const normalizePerformanceMetric = (entry: any) => {
      if (!entry) {
         return entry;
      }

      return {
         ...entry,
         id: toNumber(entry.id),
         ipo_listing_id: toNumber(entry.ipo_listing_id),
         metric_value: toNumber(entry.metric_value),
         period_days: toNumber(entry.period_days),
      };
   };

   return {
      ...record,
      shares_offered: toNumber(record.shares_offered),
      total_value: toNumber(record.total_value),
      ipo_price: toNumber(record.ipo_price),
      assets_growth_1y: toNumber(record.assets_growth_1y),
      liabilities_growth_1y: toNumber(record.liabilities_growth_1y),
      revenue_growth_1y: toNumber(record.revenue_growth_1y),
      net_income_growth_1y: toNumber(record.net_income_growth_1y),
      ipo_underwriters: (record.ipo_underwriters || []).map(normalizeUnderwriterLink),
      ipo_performance_metrics: (record.ipo_performance_metrics || []).map(normalizePerformanceMetric),
   };
};

// GET /api/ipo-listings - Public (semua bisa akses)
export const GET: APIRoute = async ({ request, url }) => {
   try {
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const underwriterId = searchParams.get('underwriter_id');
      const tickerSymbol = searchParams.get('ticker_symbol');
      const search = searchParams.get('search');
      const ids = searchParams.get('ids'); // Comma-separated list of IPO IDs

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
            assets_growth_1y,
            liabilities_growth_1y,
            revenue_growth_1y,
            net_income_growth_1y,
            lead_underwriter,
            accounting_firm,
            legal_consultant,
            created_at,
            updated_at,
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
         `,
            { count: 'exact' }
         );

      // Filter by IDs if provided (for comparison feature)
      if (ids) {
         const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
         if (idArray.length > 0) {
            query = query.in('id', idArray);
         }
      } else {
         query = query.order('ipo_date', { ascending: false }).range((page - 1) * limit, page * limit - 1);
      }

      // Filter by underwriter - we'll need to use a join instead
      // This is handled after the query with post-processing for now

      // Filter by ticker symbol
      if (tickerSymbol) {
         query = query.eq('ticker_symbol', tickerSymbol);
      }

      // Search
      if (search) {
         query = query.or(`ticker_symbol.ilike.%${search}%,company_name.ilike.%${search}%,general_sector.ilike.%${search}%,specific_sector.ilike.%${search}%`);
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
            data: (data || []).map(normalizeIpoListing),
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
   // Rate limiting - prevent DDoS
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
         assets_growth_1y,
         liabilities_growth_1y,
         revenue_growth_1y,
         net_income_growth_1y,
         lead_underwriter,
         accounting_firm,
            legal_consultant,
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
            shares_offered: shares_offered != null ? Number(shares_offered) : null,
            total_value: total_value != null ? Number(total_value) : null,
            ipo_price: ipo_price != null ? Number(ipo_price) : null,
            assets_growth_1y: assets_growth_1y ?? null,
            liabilities_growth_1y: liabilities_growth_1y ?? null,
            revenue_growth_1y: revenue_growth_1y ?? null,
            net_income_growth_1y: net_income_growth_1y ?? null,
            lead_underwriter: lead_underwriter || null,
            accounting_firm: accounting_firm || null,
            legal_consultant: legal_consultant || null,
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

         const { error: underwriterError } = await authenticatedClient.from('ipo_underwriters').insert(ipoUnderwriters);

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

         const { error: metricsError } = await authenticatedClient.from('ipo_performance_metrics').insert(metrics);

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

      return new Response(JSON.stringify({ data: normalizeIpoListing(completeListing) }), {
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
