import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
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
