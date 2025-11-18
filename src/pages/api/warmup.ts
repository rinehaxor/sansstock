// Warmup endpoint untuk pre-warm server dan database connection
// Hit endpoint ini secara berkala (setiap 5 menit) untuk keep server warm

import { supabase } from '../../db/supabase';

export const prerender = false;

export async function GET() {
  try {
    // Pre-warm database connection dengan simple query
    await supabase
      .from('articles')
      .select('id')
      .limit(1)
      .single();

    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'Server warmed up',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    // Even if error, return OK to keep server warm
    console.error('Warmup error:', error);
    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'Warmup attempted',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

