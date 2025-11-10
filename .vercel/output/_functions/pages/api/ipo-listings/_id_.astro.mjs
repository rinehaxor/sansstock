import { s as supabase } from '../../../chunks/supabase_Bf3LIET_.mjs';
import { g as getAuthenticatedSupabase, i as isAdmin } from '../../../chunks/auth_DIjpPrR7.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("ipo_listings").select(
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
    ).eq("id", id).single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data) {
      return new Response(JSON.stringify({ error: "IPO listing not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async (context) => {
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
    const id = context.params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
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
      performance_metrics
    } = body;
    const updateData = {};
    if (ticker_symbol) updateData.ticker_symbol = ticker_symbol;
    if (company_name) updateData.company_name = company_name;
    if (ipo_date) updateData.ipo_date = ipo_date;
    if (general_sector !== void 0) updateData.general_sector = general_sector;
    if (specific_sector !== void 0) updateData.specific_sector = specific_sector;
    if (shares_offered !== void 0) updateData.shares_offered = shares_offered ? BigInt(shares_offered) : null;
    if (total_value !== void 0) updateData.total_value = total_value;
    if (ipo_price !== void 0) updateData.ipo_price = ipo_price;
    const { data: ipoListing, error: ipoError } = await authenticatedClient.from("ipo_listings").update(updateData).eq("id", id).select().single();
    if (ipoError) {
      return new Response(JSON.stringify({ error: ipoError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (underwriter_ids !== void 0) {
      await authenticatedClient.from("ipo_underwriters").delete().eq("ipo_listing_id", id);
      if (underwriter_ids.length > 0) {
        const ipoUnderwriters = underwriter_ids.map((underwriterId) => ({
          ipo_listing_id: parseInt(id),
          underwriter_id: underwriterId
        }));
        await authenticatedClient.from("ipo_underwriters").insert(ipoUnderwriters);
      }
    }
    if (performance_metrics !== void 0) {
      await authenticatedClient.from("ipo_performance_metrics").delete().eq("ipo_listing_id", id);
      if (performance_metrics.length > 0) {
        const metrics = performance_metrics.map((metric) => ({
          ipo_listing_id: parseInt(id),
          metric_name: metric.metric_name || "return",
          metric_value: metric.metric_value || null,
          period_days: metric.period_days || null
        }));
        await authenticatedClient.from("ipo_performance_metrics").insert(metrics);
      }
    }
    const { data: completeListing } = await authenticatedClient.from("ipo_listings").select(
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
    ).eq("id", id).single();
    return new Response(JSON.stringify({ data: completeListing }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async (context) => {
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
    const id = context.params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error } = await authenticatedClient.from("ipo_listings").delete().eq("id", id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "IPO listing deleted successfully" }), {
      status: 200,
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
   DELETE,
   GET,
   PUT,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
