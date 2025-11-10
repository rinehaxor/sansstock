import { s as supabase } from '../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin } from '../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const search = searchParams.get("search");
    const includeStats = searchParams.get("include_stats") === "true";
    let query = supabase.from("underwriters").select(
      includeStats ? `
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
         ` : "*",
      { count: "exact" }
    ).order("name", { ascending: true });
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    let dataWithStats = data;
    if (includeStats && data) {
      dataWithStats = data.map((underwriter) => {
        const ipoUnderwriters = underwriter.ipo_underwriters || [];
        const ipoListings = ipoUnderwriters.map((item) => item.ipo_listing).filter((item) => item !== null);
        const allMetrics = [];
        ipoUnderwriters.forEach((item) => {
          const metrics = item.ipo_listing?.ipo_performance_metrics || [];
          allMetrics.push(...metrics);
        });
        const metricsByPeriod = {};
        allMetrics.forEach((metric) => {
          if (metric.period_days && metric.metric_value !== null) {
            if (!metricsByPeriod[metric.period_days]) {
              metricsByPeriod[metric.period_days] = [];
            }
            metricsByPeriod[metric.period_days].push(metric.metric_value);
          }
        });
        const avgPerformance = {};
        Object.keys(metricsByPeriod).forEach((period) => {
          const values = metricsByPeriod[parseInt(period)];
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          avgPerformance[parseInt(period)] = parseFloat(avg.toFixed(2));
        });
        return {
          ...underwriter,
          total_ipos: ipoListings.length,
          avg_performance: avgPerformance,
          ipo_listings: ipoListings
        };
      });
    }
    return new Response(
      JSON.stringify({
        data: dataWithStats || [],
        total: count || 0
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async (context) => {
  const authenticatedClient = await getAuthenticatedSupabase(context);
  if (!authenticatedClient) {
    return new Response(JSON.stringify({ error: "Unauthorized - Please login" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const admin = await isAdmin(context);
  if (!admin) {
    return new Response(JSON.stringify({ error: "Forbidden - Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await context.request.json();
    const { name } = body;
    if (!name) {
      return new Response(JSON.stringify({ error: "Missing required field: name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: underwriter, error: underwriterError } = await authenticatedClient.from("underwriters").upsert({ name }, { onConflict: "name" }).select().single();
    if (underwriterError) {
      return new Response(JSON.stringify({ error: underwriterError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data: underwriter }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   GET,
   POST,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
