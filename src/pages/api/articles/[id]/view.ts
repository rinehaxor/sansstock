export const prerender = false;

import type { APIRoute, APIContext } from 'astro';
import { supabase, supabaseAdmin } from '../../../../db/supabase';
import { viewRateLimit } from '../../../../lib/ratelimit';

/**
 * Check if user has already viewed this article (cookie-based)
 * Returns true if already viewed, false otherwise
 */
const VIEW_COOKIE_NAME = 'viewed_articles';
const VIEW_WINDOW_HOURS = 24;
const MAX_VIEWED_ARTICLES = 20;

type StoredView = [number, number];

function getStoredViews(context: APIContext): StoredView[] {
   const cookie = context.cookies.get(VIEW_COOKIE_NAME);
   if (!cookie?.value) return [];

   try {
      const parsed = JSON.parse(cookie.value);
      if (!Array.isArray(parsed)) {
         return [];
      }

      return parsed
         .map((entry: unknown): StoredView | null => {
            if (Array.isArray(entry) && entry.length === 2 && Number.isFinite(Number(entry[0])) && Number.isFinite(Number(entry[1]))) {
               return [Number(entry[0]), Number(entry[1])];
            }
            return null;
         })
         .filter((entry): entry is StoredView => entry !== null);
   } catch (error) {
      console.warn('Failed to parse viewed_articles cookie', error);
      return [];
   }
}

function persistStoredViews(context: APIContext, views: StoredView[]): void {
   const now = Date.now();
   const freshViews = views.filter(([_, timestamp]) => {
      const hoursSinceView = (now - timestamp) / (1000 * 60 * 60);
      return hoursSinceView < VIEW_WINDOW_HOURS;
   });

   const trimmedViews = freshViews.length > MAX_VIEWED_ARTICLES ? freshViews.slice(freshViews.length - MAX_VIEWED_ARTICLES) : freshViews;

   const isSecure = context.url.protocol === 'https:' || import.meta.env.PROD;

   context.cookies.set(VIEW_COOKIE_NAME, JSON.stringify(trimmedViews), {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: VIEW_WINDOW_HOURS * 60 * 60,
      path: '/',
   });
}

function hasViewedArticle(context: APIContext, articleId: number): boolean {
   const storedViews = getStoredViews(context);
   const now = Date.now();
   return storedViews.some(([storedId, timestamp]) => {
      if (storedId !== articleId) return false;
      const hoursSinceView = (now - timestamp) / (1000 * 60 * 60);
      return hoursSinceView < VIEW_WINDOW_HOURS;
   });
}

/**
 * Set cookie to mark article as viewed
 */
function markArticleAsViewed(context: APIContext, articleId: number): void {
   const now = Date.now();
   const storedViews = getStoredViews(context).filter(([storedId]) => storedId !== articleId);
   storedViews.push([articleId, now]);
   persistStoredViews(context, storedViews);

   cleanupLegacyViewCookies(context);
}

function cleanupLegacyViewCookies(context: APIContext): void {
   const cookieHeader = context.request.headers.get('cookie');
   if (!cookieHeader) {
      return;
   }

   const legacyNames = Array.from(
      new Set(
         cookieHeader
            .split(';')
            .map((part) => part.trim().split('=')[0])
            .filter((name) => name && name.startsWith('viewed_') && name !== VIEW_COOKIE_NAME)
      )
   );

   if (legacyNames.length === 0) {
      return;
   }

   for (const name of legacyNames) {
      context.cookies.set(name, '', {
         httpOnly: true,
         sameSite: 'lax',
         maxAge: 0,
         path: '/',
      });
   }
}

/**
 * Validate referer header to ensure request comes from article page
 */
function isValidReferer(context: APIContext, articleId: number): boolean {
   const referer = context.request.headers.get('referer');

   if (!referer) {
      // Allow requests without referer (e.g., from API clients or direct access)
      // But log it for monitoring
      return true; // Change to false if you want strict validation
   }

   try {
      const refererUrl = new URL(referer);
      const siteUrl = new URL(context.url.origin);

      // Must be from same origin
      if (refererUrl.origin !== siteUrl.origin) {
         return false;
      }

      return true;
   } catch (e) {
      // Invalid referer URL
      return false;
   }
}

// POST /api/articles/[id]/view - Public endpoint to increment view count
export const POST: APIRoute = async (context: APIContext) => {
   try {
      // 1. Rate limiting - prevent rapid spam
      const rateLimitResponse = viewRateLimit(context);
      if (rateLimitResponse) {
         return rateLimitResponse;
      }

      const id = context.params.id;

      if (!id) {
         return new Response(JSON.stringify({ error: 'Article ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const articleId = parseInt(id);
      if (isNaN(articleId)) {
         return new Response(JSON.stringify({ error: 'Invalid article ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // Try to get current views_count and status in one query
      const { data: articleData, error: selectError } = await supabase.from('articles').select('views_count, id, status').eq('id', articleId).single();

      if (selectError) {
         // If column doesn't exist, return success but don't increment
         if (selectError.code === '42703' || selectError.message?.includes('views_count')) {
            console.warn('views_count column does not exist yet. Please run migration.');
            return new Response(
               JSON.stringify({
                  success: false,
                  message: 'views_count column does not exist. Please run ADD_VIEWS_COUNT_COLUMN.sql migration.',
                  views_count: 0,
               }),
               {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         }

         return new Response(
            JSON.stringify({
               error: selectError.message,
               code: selectError.code,
            }),
            {
               status: 500,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }

      if (!articleData) {
         return new Response(JSON.stringify({ error: 'Article not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      // 2. Check if article is published (only track views for published articles)
      if (articleData.status !== 'published') {
         return new Response(
            JSON.stringify({
               success: false,
               message: 'Can only track views for published articles',
               views_count: articleData.views_count || 0,
            }),
            {
               status: 403,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }

      // 3. Validate referer (prevent direct API spam)
      if (!isValidReferer(context, articleId)) {
         return new Response(
            JSON.stringify({
               success: false,
               message: 'Invalid referer',
               views_count: articleData.views_count,
            }),
            {
               status: 403,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }

      // 4. Cookie-based duplicate view prevention (1 view per article per 24 hours per user)
      if (hasViewedArticle(context, articleId)) {
         // Return success but don't increment (already viewed)
         return new Response(
            JSON.stringify({
               success: true,
               message: 'View already tracked (cookie)',
               views_count: articleData.views_count,
               already_viewed: true,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }

      // Use admin client to bypass RLS for view tracking (server-side only, secure)
      const clientToUse = supabaseAdmin || supabase;

      // Try RPC function first (atomic increment)
      let updateData: any = null;
      let updateError: any = null;

      try {
         const rpcResult = await clientToUse.rpc('increment_article_views', {
            article_id: articleId,
         });

         if (rpcResult.data !== null && rpcResult.data !== undefined) {
            // RPC returned a number directly
            updateData = { views_count: rpcResult.data };
         } else if (rpcResult.error) {
            throw rpcResult.error;
         }
      } catch (rpcError) {
         // RPC doesn't exist or failed, use direct update
         const currentViews = articleData.views_count || 0;
         const newViewsCount = currentViews + 1;

         const { data, error } = await clientToUse.from('articles').update({ views_count: newViewsCount }).eq('id', articleId).select('views_count').single();

         updateData = data;
         updateError = error;
      }

      if (updateError) {
         console.error('Error updating views_count:', updateError);
         return new Response(
            JSON.stringify({
               error: updateError.message,
               code: updateError.code,
               details: updateError.details,
               hint: updateError.hint || 'Failed to update views_count. Check RLS policies or use service role key.',
            }),
            {
               status: 500,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }

      // Get final views count
      const finalViewsCount = updateData?.views_count || articleData.views_count + 1;

      // 5. Mark article as viewed (set cookie)
      markArticleAsViewed(context, articleId);

      return new Response(
         JSON.stringify({
            success: true,
            views_count: finalViewsCount,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   } catch (error) {
      console.error('Unexpected error in view endpoint:', error);
      return new Response(
         JSON.stringify({
            error: error instanceof Error ? error.message : 'Internal server error',
            stack: error instanceof Error ? error.stack : undefined,
         }),
         {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }
};
