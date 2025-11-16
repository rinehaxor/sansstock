export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../../db/supabase';

// POST /api/articles/[id]/view - Public endpoint to increment view count
export const POST: APIRoute = async ({ params }) => {
	try {
		const id = params.id;

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

		// Try to get current views_count first
		const { data: articleData, error: selectError } = await supabase
			.from('articles')
			.select('views_count, id')
			.eq('id', articleId)
			.single();

		if (selectError) {
			// If column doesn't exist, return success but don't increment
			if (selectError.code === '42703' || selectError.message?.includes('views_count')) {
				console.warn('views_count column does not exist yet. Please run migration.');
				return new Response(JSON.stringify({ 
					success: false, 
					message: 'views_count column does not exist. Please run ADD_VIEWS_COUNT_COLUMN.sql migration.',
					views_count: 0 
				}), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			return new Response(JSON.stringify({ 
				error: selectError.message,
				code: selectError.code 
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!articleData) {
			return new Response(JSON.stringify({ error: 'Article not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Use admin client to bypass RLS for view tracking (server-side only, secure)
		const clientToUse = supabaseAdmin || supabase;
		
		// Try RPC function first (atomic increment)
		let updateData: any = null;
		let updateError: any = null;
		
		try {
			const rpcResult = await clientToUse.rpc('increment_article_views', {
				article_id: articleId
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
			
			const { data, error } = await clientToUse
				.from('articles')
				.update({ views_count: newViewsCount })
				.eq('id', articleId)
				.select('views_count')
				.single();
			
			updateData = data;
			updateError = error;
		}

		if (updateError) {
			console.error('Error updating views_count:', updateError);
			return new Response(JSON.stringify({ 
				error: updateError.message,
				code: updateError.code,
				details: updateError.details,
				hint: updateError.hint || 'Failed to update views_count. Check RLS policies or use service role key.'
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Get final views count
		const finalViewsCount = updateData?.views_count || articleData.views_count + 1;

		return new Response(JSON.stringify({ 
			success: true, 
			views_count: finalViewsCount 
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Unexpected error in view endpoint:', error);
		return new Response(
			JSON.stringify({ 
				error: error instanceof Error ? error.message : 'Internal server error',
				stack: error instanceof Error ? error.stack : undefined
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};

