import { cache, CACHE_KEYS } from './cache';

interface MarketData {
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePercent: number;
  changeType: 'positive' | 'negative';
}

// Fetch data dari Yahoo Finance (alternatif yang lebih reliable)
async function fetchYahooFinanceData(symbol: string): Promise<MarketData | null> {
  try {
    // Yahoo Finance API endpoint
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

    // Create timeout controller untuk kompatibilitas Node.js versi lama
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout (lebih pendek untuk VPS)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    // Silently fail dan return null untuk fallback
    return null;
  }
}

/**
 * Fetch market data untuk symbols yang diberikan
 * Optimasi: langsung fetch tanpa HTTP request internal
 * Dengan caching untuk mengurangi external API calls
 */
export async function getMarketData(symbols?: string[]): Promise<MarketData[]> {
  // Cache key berdasarkan symbols
  const cacheKey = symbols && symbols.length > 0 
    ? `${CACHE_KEYS.MARKET_DATA}:${symbols.join(',')}`
    : CACHE_KEYS.MARKET_DATA;

  // Check cache first (cache 1 menit untuk market data)
  const cached = cache.get<MarketData[]>(cacheKey);
  if (cached) {
    return cached;
  }
  // Default symbols untuk market overview
  const defaultSymbols = [
    { symbol: '^JKSE', name: 'IHSG' },
    { symbol: 'IDR=X', name: 'USD/IDR' },
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'GC=F', name: 'Emas' },
  ];

  const symbolsToFetch = symbols && symbols.length > 0
    ? symbols.map((s) => ({ symbol: s, name: s }))
    : defaultSymbols;

  // Default data sebagai fallback
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

  // Fetch data untuk semua symbols secara parallel
  // Dengan timeout yang lebih pendek untuk VPS yang lambat (1.5 detik per symbol)
  const marketDataPromises = symbolsToFetch.map(async ({ symbol, name }) => {
    try {
      // Coba fetch dari Yahoo Finance dengan shorter timeout untuk VPS yang lambat
      // Timeout lebih pendek (1 detik) untuk faster page load
      const data = await Promise.race([
        fetchYahooFinanceData(symbol),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000)), // 1 second timeout (lebih agresif)
      ]);

      if (data) {
        return data;
      }
    } catch (error) {
      // Silently fail
    }

    // Fallback ke default data (instant)
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
  });

  const marketData = await Promise.all(marketDataPromises);
  
  // Cache hasil (1 menit untuk market data yang real-time)
  cache.set(cacheKey, marketData, 60 * 1000);
  
  return marketData;
}

