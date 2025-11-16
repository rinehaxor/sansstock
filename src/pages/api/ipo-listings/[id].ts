export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';
import { csrfProtection } from '../../../lib/csrf';

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

// GET /api/ipo-listings/[id] - Public
export const GET: APIRoute = async ({ params }) => {
   try {
      const id = params.id;

      if (!id) {
         return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const { data, error } = await supabase
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
               period_days,
               created_at,
               updated_at
            )
         `
         )
         .eq('id', id)
         .single();

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      if (!data) {
         return new Response(JSON.stringify({ error: 'IPO listing not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ data: normalizeIpoListing(data) }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// PUT /api/ipo-listings/[id] - Admin only
export const PUT: APIRoute = async (context) => {
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

   try {
      const id = context.params.id;

      if (!id) {
         return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

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
         underwriter_ids,
         performance_metrics,
         assets_growth_1y,
         liabilities_growth_1y,
         revenue_growth_1y,
         net_income_growth_1y,
         lead_underwriter,
         accounting_firm,
         legal_consultant,
      } = body;

      // Update IPO listing
      const updateData: any = {};
      if (ticker_symbol) updateData.ticker_symbol = ticker_symbol;
      if (company_name) updateData.company_name = company_name;
      if (ipo_date) updateData.ipo_date = ipo_date;
      if (general_sector !== undefined) updateData.general_sector = general_sector;
      if (specific_sector !== undefined) updateData.specific_sector = specific_sector;
      if (shares_offered !== undefined) updateData.shares_offered = shares_offered ? BigInt(shares_offered) : null;
      if (total_value !== undefined) updateData.total_value = total_value;
      if (ipo_price !== undefined) updateData.ipo_price = ipo_price;
      if (assets_growth_1y !== undefined) updateData.assets_growth_1y = assets_growth_1y;
      if (liabilities_growth_1y !== undefined) updateData.liabilities_growth_1y = liabilities_growth_1y;
      if (revenue_growth_1y !== undefined) updateData.revenue_growth_1y = revenue_growth_1y;
      if (net_income_growth_1y !== undefined) updateData.net_income_growth_1y = net_income_growth_1y;
      if (lead_underwriter !== undefined) updateData.lead_underwriter = lead_underwriter;
      if (accounting_firm !== undefined) updateData.accounting_firm = accounting_firm;
      if (legal_consultant !== undefined) updateData.legal_consultant = legal_consultant;

      const { data: ipoListing, error: ipoError } = await authenticatedClient
         .from('ipo_listings')
         .update(updateData)
         .eq('id', id)
         .select()
         .single();

      if (ipoError) {
         return new Response(JSON.stringify({ error: ipoError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Update underwriters if provided
      if (underwriter_ids !== undefined) {
         // Delete existing underwriters
         await authenticatedClient.from('ipo_underwriters').delete().eq('ipo_listing_id', id);

         // Add new underwriters
         if (underwriter_ids.length > 0) {
            const ipoUnderwriters = underwriter_ids.map((underwriterId: number) => ({
               ipo_listing_id: parseInt(id),
               underwriter_id: underwriterId,
            }));

            await authenticatedClient.from('ipo_underwriters').insert(ipoUnderwriters);
         }
      }

      // Update performance metrics if provided
      if (performance_metrics !== undefined) {
         // Delete existing metrics
         await authenticatedClient.from('ipo_performance_metrics').delete().eq('ipo_listing_id', id);

         // Add new metrics
         if (performance_metrics.length > 0) {
            const metrics = performance_metrics.map((metric: any) => ({
               ipo_listing_id: parseInt(id),
               metric_name: metric.metric_name || 'return',
               metric_value: metric.metric_value || null,
               period_days: metric.period_days || null,
            }));

            await authenticatedClient.from('ipo_performance_metrics').insert(metrics);
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
         .eq('id', id)
         .single();

      return new Response(JSON.stringify({ data: normalizeIpoListing(completeListing) }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

// DELETE /api/ipo-listings/[id] - Admin only
export const DELETE: APIRoute = async (context) => {
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

   try {
      const id = context.params.id;

      if (!id) {
         return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const { error } = await authenticatedClient.from('ipo_listings').delete().eq('id', id);

      if (error) {
         return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      return new Response(JSON.stringify({ message: 'IPO listing deleted successfully' }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};
