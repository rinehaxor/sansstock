export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../db/supabase';

/**
 * Health check endpoint
 * Returns status of critical services
 */
export const GET: APIRoute = async () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
    },
  };

  try {
    // Check database connection
    const { error } = await supabase.from('categories').select('id').limit(1);
    
    if (error) {
      health.status = 'degraded';
      health.services.database = 'unhealthy';
    } else {
      health.services.database = 'healthy';
    }
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 503 : 500;

  return new Response(JSON.stringify(health, null, 2), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};

