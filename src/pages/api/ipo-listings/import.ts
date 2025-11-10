export const prerender = false;

import type { APIRoute } from 'astro';
import { getAuthenticatedSupabase, getAuthenticatedUser, isAdmin } from '../../../lib/auth';

// POST /api/ipo-listings/import - Admin only
// Accepts JSON array of IPO listings with the following structure:
// [
//   {
//     ticker_symbol: "FAPA",
//     company_name: "PT FAP Agri Tbk",
//     ipo_date: "2021-01-04",
//     general_sector: "Consumer Non-Cyclicals",
//     specific_sector: "Agricultural Products",
//     shares_offered: 1001718,
//     total_value: 3629411800,
//     ipo_price: 1840,
//     underwriters: "PT BCA Sekuritas",
//     performance_metrics: [
//       { metric_name: "return", metric_value: 25, period_days: 1 },
//       { metric_name: "return", metric_value: 42, period_days: 7 },
//       ...
//     ]
//   }
// ]
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
      const { data: ipoDataArray } = body;

      if (!Array.isArray(ipoDataArray) || ipoDataArray.length === 0) {
         return new Response(JSON.stringify({ error: 'Invalid data: Expected an array of IPO listings' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const results = {
         success: 0,
         failed: 0,
         errors: [] as string[],
         imported: [] as any[],
      };

      // Process each IPO listing
      for (const ipoData of ipoDataArray) {
         try {
            const {
               ticker_symbol,
               company_name,
               ipo_date,
               general_sector,
               specific_sector,
               shares_offered,
               total_value,
               ipo_price,
               underwriters,
               performance_metrics = [],
            } = ipoData;

            // Validation
            if (!ticker_symbol || !company_name || !ipo_date) {
               results.failed++;
               results.errors.push(`Missing required fields for ${ticker_symbol || 'unknown'}: ticker_symbol, company_name, ipo_date`);
               continue;
            }

            // Parse underwriters (can be string or array)
            let underwriterNames: string[] = [];
            if (typeof underwriters === 'string') {
               // Split by semicolon or comma
               underwriterNames = underwriters
                  .split(/[;,]/)
                  .map((name) => name.trim())
                  .filter((name) => name.length > 0);
            } else if (Array.isArray(underwriters)) {
               underwriterNames = underwriters.map((name) => String(name).trim()).filter((name) => name.length > 0);
            }

            // Get or create underwriters
            const underwriterIds: number[] = [];
            for (const underwriterName of underwriterNames) {
               const { data: existingUnderwriter } = await authenticatedClient
                  .from('underwriters')
                  .select('id')
                  .eq('name', underwriterName)
                  .single();

               if (existingUnderwriter) {
                  underwriterIds.push(existingUnderwriter.id);
               } else {
                  // Create new underwriter
                  const { data: newUnderwriter, error: underwriterError } = await authenticatedClient
                     .from('underwriters')
                     .insert({ name: underwriterName })
                     .select()
                     .single();

                  if (newUnderwriter && !underwriterError) {
                     underwriterIds.push(newUnderwriter.id);
                  }
               }
            }

            // Upsert IPO listing (update if exists, insert if not)
            const { data: existingListing } = await authenticatedClient
               .from('ipo_listings')
               .select('id')
               .eq('ticker_symbol', ticker_symbol)
               .single();

            let ipoListingId: number;

            if (existingListing) {
               // Update existing listing
               const { data: updatedListing, error: updateError } = await authenticatedClient
                  .from('ipo_listings')
                  .update({
                     company_name,
                     ipo_date,
                     general_sector: general_sector || null,
                     specific_sector: specific_sector || null,
                     shares_offered: shares_offered ? BigInt(shares_offered) : null,
                     total_value: total_value || null,
                     ipo_price: ipo_price || null,
                  })
                  .eq('ticker_symbol', ticker_symbol)
                  .select()
                  .single();

               if (updateError) {
                  results.failed++;
                  results.errors.push(`Error updating ${ticker_symbol}: ${updateError.message}`);
                  continue;
               }

               ipoListingId = updatedListing.id;
            } else {
               // Insert new listing
               const { data: newListing, error: insertError } = await authenticatedClient
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

               if (insertError) {
                  results.failed++;
                  results.errors.push(`Error inserting ${ticker_symbol}: ${insertError.message}`);
                  continue;
               }

               ipoListingId = newListing.id;
            }

            // Update underwriters for this IPO
            // Delete existing underwriters
            await authenticatedClient.from('ipo_underwriters').delete().eq('ipo_listing_id', ipoListingId);

            // Add new underwriters
            if (underwriterIds.length > 0) {
               const ipoUnderwriters = underwriterIds.map((underwriterId) => ({
                  ipo_listing_id: ipoListingId,
                  underwriter_id: underwriterId,
               }));

               await authenticatedClient.from('ipo_underwriters').insert(ipoUnderwriters);
            }

            // Update performance metrics
            // Delete existing metrics
            await authenticatedClient.from('ipo_performance_metrics').delete().eq('ipo_listing_id', ipoListingId);

            // Add new metrics
            if (performance_metrics.length > 0) {
               const metrics = performance_metrics
                  .filter((metric: any) => metric.metric_value !== null && metric.metric_value !== undefined)
                  .map((metric: any) => ({
                     ipo_listing_id: ipoListingId,
                     metric_name: metric.metric_name || 'return',
                     metric_value: metric.metric_value,
                     period_days: metric.period_days || null,
                  }));

               if (metrics.length > 0) {
                  await authenticatedClient.from('ipo_performance_metrics').insert(metrics);
               }
            }

            results.success++;
            results.imported.push({
               ticker_symbol,
               id: ipoListingId,
            });
         } catch (error) {
            results.failed++;
            results.errors.push(`Error processing ${ipoData.ticker_symbol || 'unknown'}: ${error instanceof Error ? error.message : 'Unknown error'}`);
         }
      }

      return new Response(
         JSON.stringify({
            message: `Import completed: ${results.success} successful, ${results.failed} failed`,
            results,
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

