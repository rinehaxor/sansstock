export { renderers } from '../../renderers.mjs';

const prerender = false;
async function fetchTradingViewData(symbol, exchange = "IDX") {
  try {
    const tvSymbol = `${exchange}:${symbol}`;
    const url = `https://symbol-search.tradingview.com/symbol_search/?text=${symbol}&exchange=${exchange}&lang=en&search_type=undefined&domain=production&sort_by_country=US`;
    return null;
  } catch (error) {
    console.error(`Error fetching TradingView data for ${symbol}:`, error);
    return null;
  }
}
async function fetchYahooFinanceData(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) {
      return null;
    }
    const meta = result.meta;
    const regularMarketPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose;
    const change = regularMarketPrice - previousClose;
    const changePercent = change / previousClose * 100;
    return {
      name: meta.shortName || symbol,
      symbol,
      value: regularMarketPrice.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      change: `${change >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
      changePercent,
      changeType: change >= 0 ? "positive" : "negative"
    };
  } catch (error) {
    console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
    return null;
  }
}
const GET = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const symbols = searchParams.get("symbols")?.split(",") || [];
    const defaultSymbols = [
      { symbol: "^JKSE", name: "IHSG", exchange: "IDX" },
      // IHSG
      { symbol: "IDR=X", name: "USD/IDR", exchange: "CURRENCY" },
      // USD/IDR
      { symbol: "BTC-USD", name: "Bitcoin", exchange: "CRYPTO" },
      // Bitcoin
      { symbol: "GC=F", name: "Emas", exchange: "COMMODITY" }
      // Gold
    ];
    const symbolsToFetch = symbols.length > 0 ? symbols.map((s) => ({ symbol: s, name: s, exchange: "IDX" })) : defaultSymbols;
    const marketDataPromises = symbolsToFetch.map(async ({ symbol, name, exchange }) => {
      let data = await fetchYahooFinanceData(symbol);
      if (!data) {
        data = await fetchTradingViewData(symbol, exchange);
      }
      if (!data) {
        const defaults = {
          "^JKSE": {
            name: "IHSG",
            symbol: "^JKSE",
            value: "7,234.56",
            change: "+1.2%",
            changePercent: 1.2,
            changeType: "positive"
          },
          "IDR=X": {
            name: "USD/IDR",
            symbol: "IDR=X",
            value: "15,420",
            change: "-0.3%",
            changePercent: -0.3,
            changeType: "negative"
          },
          "BTC-USD": {
            name: "Bitcoin",
            symbol: "BTC-USD",
            value: "$65,234",
            change: "+2.1%",
            changePercent: 2.1,
            changeType: "positive"
          },
          "GC=F": {
            name: "Emas",
            symbol: "GC=F",
            value: "$2,045",
            change: "+0.8%",
            changePercent: 0.8,
            changeType: "positive"
          }
        };
        return defaults[symbol] || {
          name,
          symbol,
          value: "0",
          change: "0%",
          changePercent: 0,
          changeType: "positive"
        };
      }
      return data;
    });
    const marketData = await Promise.all(marketDataPromises);
    return new Response(
      JSON.stringify({
        data: marketData,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching market data:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch market data",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   GET,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
