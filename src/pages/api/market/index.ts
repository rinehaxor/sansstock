export const prerender = false;

import type { APIRoute } from 'astro';

interface MarketData {
   name: string;
   symbol: string;
   value: string;
   change: string;
   changePercent: number;
   changeType: 'positive' | 'negative';
}

// TradingView API endpoint untuk mendapatkan data market
// Note: TradingView tidak menyediakan API publik langsung, jadi kita perlu menggunakan alternatif
// atau mengambil dari widget jika memungkinkan

async function fetchTradingViewData(symbol: string, exchange: string = 'IDX'): Promise<MarketData | null> {
   try {
      // TradingView menggunakan format: EXCHANGE:SYMBOL
      const tvSymbol = `${exchange}:${symbol}`;

      // TradingView widget API endpoint (ini adalah endpoint internal yang digunakan widget)
      // Catatan: Ini mungkin tidak selalu bekerja karena CORS dan rate limiting
      const url = `https://symbol-search.tradingview.com/symbol_search/?text=${symbol}&exchange=${exchange}&lang=en&search_type=undefined&domain=production&sort_by_country=US`;

      // Alternatif: Gunakan API publik seperti Yahoo Finance atau Alpha Vantage
      // Untuk sekarang kita akan menggunakan mock data yang bisa diganti dengan API real

      return null; // Return null untuk fallback ke data default
   } catch (error) {
      console.error(`Error fetching TradingView data for ${symbol}:`, error);
      return null;
   }
}

// Fetch data dari Yahoo Finance (alternatif yang lebih reliable)
async function fetchYahooFinanceData(symbol: string): Promise<MarketData | null> {
   try {
      // Yahoo Finance API endpoint
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

      const response = await fetch(url, {
         headers: {
            'User-Agent': 'Mozilla/5.0',
         },
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
      const changePercent = (change / previousClose) * 100;

      return {
         name: meta.shortName || symbol,
         symbol: symbol,
         value: regularMarketPrice.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         }),
         change: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
         changePercent: changePercent,
         changeType: change >= 0 ? 'positive' : 'negative',
      };
   } catch (error) {
      console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
      return null;
   }
}

// GET /api/market - Fetch market data
export const GET: APIRoute = async ({ url }) => {
   try {
      const searchParams = url.searchParams;
      const symbols = searchParams.get('symbols')?.split(',') || [];

      // Default symbols untuk market overview
      const defaultSymbols = [
         { symbol: '^JKSE', name: 'IHSG', exchange: 'IDX' }, // IHSG
         { symbol: 'IDR=X', name: 'USD/IDR', exchange: 'CURRENCY' }, // USD/IDR
         { symbol: 'BTC-USD', name: 'Bitcoin', exchange: 'CRYPTO' }, // Bitcoin
         { symbol: 'GC=F', name: 'Emas', exchange: 'COMMODITY' }, // Gold
      ];

      const symbolsToFetch = symbols.length > 0 ? symbols.map((s) => ({ symbol: s, name: s, exchange: 'IDX' })) : defaultSymbols;

      // Fetch data untuk semua symbols
      const marketDataPromises = symbolsToFetch.map(async ({ symbol, name, exchange }) => {
         // Coba fetch dari Yahoo Finance dulu
         let data = await fetchYahooFinanceData(symbol);

         // Jika tidak berhasil, coba TradingView
         if (!data) {
            data = await fetchTradingViewData(symbol, exchange);
         }

         // Fallback ke default data jika semua gagal
         if (!data) {
            // Return default data berdasarkan symbol
            const defaults: Record<string, MarketData> = {
               '^JKSE': {
                  name: 'IHSG',
                  symbol: '^JKSE',
                  value: '7,234.56',
                  change: '+1.2%',
                  changePercent: 1.2,
                  changeType: 'positive',
               },
               'IDR=X': {
                  name: 'USD/IDR',
                  symbol: 'IDR=X',
                  value: '15,420',
                  change: '-0.3%',
                  changePercent: -0.3,
                  changeType: 'negative',
               },
               'BTC-USD': {
                  name: 'Bitcoin',
                  symbol: 'BTC-USD',
                  value: '$65,234',
                  change: '+2.1%',
                  changePercent: 2.1,
                  changeType: 'positive',
               },
               'GC=F': {
                  name: 'Emas',
                  symbol: 'GC=F',
                  value: '$2,045',
                  change: '+0.8%',
                  changePercent: 0.8,
                  changeType: 'positive',
               },
            };

            return (
               defaults[symbol] || {
                  name: name,
                  symbol: symbol,
                  value: '0',
                  change: '0%',
                  changePercent: 0,
                  changeType: 'positive',
               }
            );
         }

         return data;
      });

      const marketData = await Promise.all(marketDataPromises);

      return new Response(
         JSON.stringify({
            data: marketData,
            timestamp: new Date().toISOString(),
         }),
         {
            status: 200,
            headers: {
               'Content-Type': 'application/json',
               'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
         }
      );
   } catch (error) {
      console.error('Error fetching market data:', error);
      return new Response(
         JSON.stringify({
            error: 'Failed to fetch market data',
            message: error instanceof Error ? error.message : 'Unknown error',
         }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }
};
