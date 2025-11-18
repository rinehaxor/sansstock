import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../db/supabase';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

/**
 * Batch fetch alt text untuk multiple thumbnail URLs
 * Mengoptimasi N+1 query problem dengan single batch query
 */
export async function batchGetAltText(thumbnailUrls: (string | null)[]): Promise<Map<string, string | null>> {
  // Filter out null/empty URLs
  const validUrls = thumbnailUrls.filter((url): url is string => url !== null && url !== '');
  
  if (validUrls.length === 0) {
    return new Map();
  }

  try {
    // Batch query untuk semua URLs sekaligus
    const { data: mediaMetadata } = await supabase
      .from('media_metadata')
      .select('file_url, alt_text')
      .in('file_url', validUrls);
    
    // Create a map for quick lookup
    const altTextMap = new Map<string, string | null>();
    
    if (mediaMetadata) {
      mediaMetadata.forEach((meta: any) => {
        altTextMap.set(meta.file_url, meta.alt_text || null);
      });
    }
    
    // Add null entries for URLs that don't have metadata
    validUrls.forEach((url) => {
      if (!altTextMap.has(url)) {
        altTextMap.set(url, null);
      }
    });
    
    return altTextMap;
  } catch (error) {
    console.error('Error batch fetching alt text:', error);
    // Return empty map on error
    return new Map();
  }
}

/**
 * Helper function untuk mendapatkan site URL
 * Prioritas:
 * 1. Environment variable SITE_URL (jika ada)
 * 2. Astro.site?.href (dari config)
 * 3. Fallback ke request URL (untuk development)
 */
export function getSiteUrl(site?: URL | string, requestUrl?: URL | string): string {
   // 1. Cek environment variable
   if (import.meta.env.SITE_URL) {
      return import.meta.env.SITE_URL;
   }
   
   // 2. Cek dari Astro site config
   if (site) {
      const siteUrl = typeof site === 'string' ? site : site.href;
      if (siteUrl) return siteUrl;
   }
   
   // 3. Fallback ke request URL (untuk development)
   if (requestUrl) {
      const requestUrlString = typeof requestUrl === 'string' ? requestUrl : requestUrl.href;
      return requestUrlString;
   }
   
   // 4. Fallback terakhir (untuk development)
   return 'http://localhost:4321';
}
