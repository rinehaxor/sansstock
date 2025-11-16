/**
 * Content Sanitization Utility
 * 
 * Provides HTML sanitization to prevent XSS attacks
 * Uses DOMPurify for robust sanitization
 * Used for sanitizing user-generated content (articles, comments, etc.)
 * 
 * IMPORTANT: DOMPurify is lazy-loaded to avoid jsdom issues in SSR
 */
// Lazy import DOMPurify to avoid jsdom loading in SSR
let DOMPurify: any = null;
let DOMPurifyPromise: Promise<any> | null = null;

async function getDOMPurify() {
   // Only load DOMPurify when needed (lazy loading)
   if (DOMPurify) {
      return DOMPurify;
   }
   
   if (!DOMPurifyPromise) {
      // Only import in Node.js/server environment, skip in browser during SSR
      if (typeof window === 'undefined') {
         DOMPurifyPromise = import('isomorphic-dompurify').then((mod) => {
            DOMPurify = mod.default || mod;
            return DOMPurify;
         }).catch((error) => {
            console.error('[DOMPurify Import Error]', error);
            // Return null if import fails
            return null;
         });
      } else {
         // In browser, return null (don't sanitize in browser, only in API)
         return null;
      }
   }
   
   return DOMPurifyPromise;
}

/**
 * Basic HTML entity encoding for XSS prevention
 * Use this for plain text fields that should be displayed as-is
 */
export function escapeHtml(text: string): string {
   if (!text || typeof text !== 'string') {
      return '';
   }

   const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
   };

   return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Allowed tags for rich text content (safe HTML)
 * Used with DOMPurify configuration
 */
const ALLOWED_TAGS = [
   'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
   'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
   'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
   'a', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
   'div', 'span', 'hr', 'del', 'ins', 'sub', 'sup',
];

/**
 * Allowed attributes per tag
 */
const ALLOWED_ATTR = [
   // Common attributes
   'class', 'id', 'title',
   // Links
   'href', 'target', 'rel', 'name',
   // Images
   'src', 'alt', 'width', 'height',
   // Tables
   'colspan', 'rowspan',
   // Code/pre
   'lang',
];

/**
 * DOMPurify configuration for article content
 * Secure configuration that allows safe HTML while preventing XSS
 */
const DOMPURIFY_CONFIG = {
   ALLOWED_TAGS,
   ALLOWED_ATTR,
   ALLOW_DATA_ATTR: false, // Disable data attributes for security
   ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$)|^data:image\/(png|jpeg|gif|webp);base64,)/i,
   KEEP_CONTENT: true, // Keep content even if tag is removed
   RETURN_DOM: false, // Return string, not DOM
   RETURN_DOM_FRAGMENT: false,
   RETURN_TRUSTED_TYPE: false,
   FORCE_BODY: false,
   SANITIZE_DOM: true,
   ADD_ATTR: ['target'], // Allow target attribute for links
   // Additional security settings
   FORBID_TAGS: ['script', 'style', 'iframe', 'embed', 'object', 'form', 'input', 'button'],
   FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
} as const;

/**
 * HTML sanitization using DOMPurify (server-side only)
 * Removes potentially dangerous HTML/scripts while preserving safe formatting
 * 
 * Uses DOMPurify for robust XSS prevention
 * DOMPurify is lazy-loaded to avoid jsdom issues in SSR
 */
export async function sanitizeHtml(html: string): Promise<string> {
   if (!html || typeof html !== 'string') {
      return '';
   }

   try {
      // Lazy load DOMPurify only when needed
      const DOMPurifyInstance = await getDOMPurify();
      
      // If DOMPurify is not available (browser or import failed), use fallback
      if (!DOMPurifyInstance) {
         return escapeHtml(html);
      }
      
      // Use DOMPurify for sanitization
      return DOMPurifyInstance.sanitize(html, DOMPURIFY_CONFIG);
   } catch (error) {
      // Fallback to basic sanitization if DOMPurify fails
      console.error('[Sanitization Error]', error);
      // Return empty string or basic escaped version as fallback
      return escapeHtml(html);
   }
}

/**
 * Synchronous version - uses escapeHtml as fallback (for backwards compatibility)
 * For proper sanitization, use the async version sanitizeHtml()
 */
export function sanitizeHtmlSync(html: string): string {
   if (!html || typeof html !== 'string') {
      return '';
   }
   
   // Use basic sanitization as fallback (no DOMPurify)
   // This avoids jsdom issues but provides less robust sanitization
   return escapeHtml(html);
}

/**
 * Sanitize URL to prevent XSS in links
 */
export function sanitizeUrl(url: string): string {
   if (!url || typeof url !== 'string') {
      return '';
   }

   // Remove dangerous protocols
   const trimmed = url.trim();
   
   if (trimmed.startsWith('javascript:') || 
       trimmed.startsWith('data:') ||
       trimmed.startsWith('vbscript:')) {
      return '';
   }

   // Allow http, https, mailto, tel, relative URLs
   if (trimmed.match(/^(https?:\/\/|mailto:|tel:|#|\/)/i)) {
      return trimmed;
   }

   // If no protocol, assume relative URL
   if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
      return trimmed;
   }

   // If starts with domain-like, add https://
   if (trimmed.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/)) {
      return `https://${trimmed}`;
   }

   return '';
}

/**
 * Sanitize article content before saving to database
 * This should be called before storing user-generated HTML content
 * 
 * Uses DOMPurify for robust XSS prevention (async)
 */
export async function sanitizeArticleContent(content: string): Promise<string> {
   if (!content || typeof content !== 'string') {
      return '';
   }

   // Use DOMPurify for robust sanitization (async)
   // This removes dangerous scripts, event handlers, and unsafe HTML
   // while preserving safe formatting for rich text content
   return sanitizeHtml(content);
}

/**
 * Synchronous version - uses basic sanitization (for backwards compatibility)
 */
export function sanitizeArticleContentSync(content: string): string {
   if (!content || typeof content !== 'string') {
      return '';
   }
   
   // Use basic sanitization as fallback (no DOMPurify)
   return sanitizeHtmlSync(content);
}

/**
 * Sanitize plain text fields
 */
export function sanitizeText(text: string): string {
   if (!text || typeof text !== 'string') {
      return '';
   }

   // Remove null bytes and control characters
   return text
      .replace(/[\x00-\x1F\x7F]/g, '')
      .trim();
}

/**
 * Sanitize slug for URL
 */
export function sanitizeSlug(text: string): string {
   if (!text || typeof text !== 'string') {
      return '';
   }

   return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
}

