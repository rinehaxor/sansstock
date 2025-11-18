import type { APIContext } from 'astro';

/**
 * Rate Limiting Utilities
 * 
 * Implements in-memory rate limiting to prevent brute force attacks and DDoS.
 * Uses sliding window algorithm with configurable limits per endpoint.
 * 
 * Note: In-memory rate limiting resets on server restart.
 * For production, consider using Redis or Upstash Ratelimit for distributed rate limiting.
 */

interface RateLimitConfig {
   windowMs: number; // Time window in milliseconds
   maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
   requests: number[];
   resetTime: number;
}

// In-memory store: Map<key, RateLimitStore>
// Key format: `${endpoint}:${identifier}` where identifier is IP or user ID
const rateLimitStore = new Map<string, RateLimitStore>();

// Default rate limit configurations per endpoint type
const rateLimitConfigs: Record<string, RateLimitConfig> = {
   // Login endpoint - very strict to prevent brute force
   login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per 15 minutes
   },
   // API endpoints - moderate limit
   api: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
   },
   // Upload endpoint - stricter limit
   upload: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 uploads per minute
   },
   // Public endpoints - more lenient
   public: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 200, // 200 requests per minute
   },
   // View endpoint - very strict to prevent view spam
   view: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 view requests per minute per IP (prevents rapid spam)
   },
};

/**
 * Get client identifier (IP address)
 */
function getClientIdentifier(context: APIContext): string {
   // Try to get IP from various headers (for proxies/load balancers)
   const forwardedFor = context.request.headers.get('x-forwarded-for');
   if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
   }

   const realIp = context.request.headers.get('x-real-ip');
   if (realIp) {
      return realIp;
   }

   // Fallback to connection IP (may not work behind proxy)
   return context.clientAddress || 'unknown';
}

/**
 * Clean up expired entries (run periodically)
 */
function cleanupExpiredEntries(): void {
   const now = Date.now();
   for (const [key, store] of rateLimitStore.entries()) {
      if (store.resetTime < now) {
         rateLimitStore.delete(key);
      }
   }
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
   setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Check if request is allowed under rate limit
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
   context: APIContext,
   endpointType: keyof typeof rateLimitConfigs = 'api'
): { allowed: boolean; remaining: number; resetAt: number; retryAfter?: number } {
   const config = rateLimitConfigs[endpointType];
   const identifier = getClientIdentifier(context);
   const key = `${endpointType}:${identifier}`;

   const now = Date.now();
   let store = rateLimitStore.get(key);

   // Initialize or reset if window expired
   if (!store || store.resetTime < now) {
      store = {
         requests: [],
         resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, store);
   }

   // Remove requests outside current window (sliding window)
   store.requests = store.requests.filter((timestamp) => timestamp > now - config.windowMs);

   // Check if limit exceeded
   const requestCount = store.requests.length;
   const allowed = requestCount < config.maxRequests;

   if (allowed) {
      // Add current request
      store.requests.push(now);
   }

   // Calculate retry after (in seconds) if rate limited
   const retryAfter = allowed ? undefined : Math.ceil((store.resetTime - now) / 1000);

   return {
      allowed,
      remaining: Math.max(0, config.maxRequests - requestCount - (allowed ? 1 : 0)),
      resetAt: store.resetTime,
      retryAfter,
   };
}

/**
 * Middleware to apply rate limiting to API routes
 * Returns error response if rate limited, null if allowed
 */
export function rateLimitMiddleware(
   context: APIContext,
   endpointType: keyof typeof rateLimitConfigs = 'api'
): Response | null {
   const result = checkRateLimit(context, endpointType);

   if (!result.allowed) {
      return new Response(
         JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: result.retryAfter,
         }),
         {
            status: 429, // Too Many Requests
            headers: {
               'Content-Type': 'application/json',
               'X-RateLimit-Limit': rateLimitConfigs[endpointType].maxRequests.toString(),
               'X-RateLimit-Remaining': result.remaining.toString(),
               'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
               ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() }),
            },
         }
      );
   }

   return null;
}

/**
 * Rate limit for login endpoint (brute force prevention)
 */
export function loginRateLimit(context: APIContext): Response | null {
   return rateLimitMiddleware(context, 'login');
}

/**
 * Rate limit for API endpoints (DDoS prevention)
 */
export function apiRateLimit(context: APIContext): Response | null {
   return rateLimitMiddleware(context, 'api');
}

/**
 * Rate limit for upload endpoints
 */
export function uploadRateLimit(context: APIContext): Response | null {
   return rateLimitMiddleware(context, 'upload');
}

/**
 * Rate limit for public endpoints
 */
export function publicRateLimit(context: APIContext): Response | null {
   return rateLimitMiddleware(context, 'public');
}

/**
 * Rate limit for view endpoints (prevents view spam)
 */
export function viewRateLimit(context: APIContext): Response | null {
   return rateLimitMiddleware(context, 'view');
}

