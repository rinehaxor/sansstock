/**
 * Error Handling Utilities
 * 
 * Provides secure error handling that doesn't leak system information.
 * Detailed errors are logged server-side but only generic messages are sent to clients.
 */

const isProduction = import.meta.env.PROD;

/**
 * Generic error messages for client responses
 * These messages don't expose internal system details
 */
export const ErrorMessages = {
   // Authentication & Authorization
   UNAUTHORIZED: 'Authentication required. Please login.',
   FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
   INVALID_CREDENTIALS: 'Invalid email or password.',
   
   // Validation
   VALIDATION_FAILED: 'Invalid input. Please check your data and try again.',
   MISSING_FIELDS: 'Required fields are missing.',
   INVALID_FORMAT: 'Invalid data format.',
   
   // Not Found
   NOT_FOUND: 'The requested resource was not found.',
   ARTICLE_NOT_FOUND: 'Article not found.',
   CATEGORY_NOT_FOUND: 'Category not found.',
   TAG_NOT_FOUND: 'Tag not found.',
   
   // Conflict
   ALREADY_EXISTS: 'A resource with this identifier already exists.',
   DUPLICATE_SLUG: 'A resource with this slug already exists.',
   
   // Server Errors
   INTERNAL_ERROR: 'An error occurred. Please try again later.',
   DATABASE_ERROR: 'Database operation failed. Please try again later.',
   UPLOAD_ERROR: 'File upload failed. Please try again.',
   OPERATION_FAILED: 'Operation could not be completed. Please try again.',
   
   // Rate Limiting
   RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
   
   // CSRF
   CSRF_INVALID: 'Invalid request. Please refresh the page and try again.',
   
   // File Upload
   FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
   INVALID_FILE_TYPE: 'File type is not allowed.',
} as const;

/**
 * Log detailed error to server-side console/logging service
 * This should be used instead of exposing errors to clients
 */
export function logError(context: string, error: unknown, additionalData?: Record<string, unknown>): void {
   const errorDetails = {
      context,
      error: error instanceof Error ? {
         name: error.name,
         message: error.message,
         stack: error.stack,
      } : error,
      timestamp: new Date().toISOString(),
      ...additionalData,
   };

   // In production, send to logging service (e.g., Sentry, Logtail)
   // In development, log to console
   if (isProduction) {
      // TODO: Send to logging service
      // Example: sentry.captureException(error, { extra: errorDetails });
      console.error('[ERROR]', JSON.stringify(errorDetails, null, 2));
   } else {
      console.error('[ERROR]', errorDetails);
   }
}

/**
 * Create a safe error response for clients
 * Detailed errors are logged but only generic messages are sent
 */
export function createErrorResponse(
   context: APIContext | string,
   error: unknown,
   clientMessage: string = ErrorMessages.INTERNAL_ERROR,
   statusCode: number = 500,
   logContext?: string
): Response {
   // Determine context name
   const contextName = typeof context === 'string' ? context : context.url.pathname;
   
   // Log detailed error server-side
   if (error) {
      logError(logContext || contextName, error, {
         clientMessage,
         statusCode,
      });
   }

   // Return generic error to client
   return new Response(
      JSON.stringify({
         error: isProduction ? clientMessage : (error instanceof Error ? error.message : String(error)),
      }),
      {
         status: statusCode,
         headers: { 'Content-Type': 'application/json' },
      }
   );
}

/**
 * Handle validation errors
 * Returns user-friendly error message without exposing schema details
 */
export function handleValidationError(error: unknown): Response {
   if (error instanceof Error && error.name === 'ZodError') {
      // Log detailed validation error
      logError('Validation Error', error);
      
      // Return generic validation error
      return new Response(
         JSON.stringify({
            error: ErrorMessages.VALIDATION_FAILED,
         }),
         {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         }
      );
   }

   return createErrorResponse('Validation', error, ErrorMessages.VALIDATION_FAILED, 400);
}

/**
 * Handle database errors
 * Returns generic error without exposing database structure
 */
export function handleDatabaseError(error: unknown, context?: string): Response {
   // Check for common database errors
   if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code?: string; message?: string };
      
      // Log detailed database error
      logError('Database Error', error, { dbCode: dbError.code });
      
      // Map specific errors to user-friendly messages
      switch (dbError.code) {
         case '23505': // Unique violation
            return new Response(
               JSON.stringify({ error: ErrorMessages.ALREADY_EXISTS }),
               {
                  status: 409,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         case '23503': // Foreign key violation
            return new Response(
               JSON.stringify({ error: 'Cannot perform this operation. Related resources exist.' }),
               {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         case '23502': // Not null violation
            return new Response(
               JSON.stringify({ error: ErrorMessages.MISSING_FIELDS }),
               {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         case 'PGRST116': // Not found (Supabase/PostgREST)
            return new Response(
               JSON.stringify({ error: ErrorMessages.NOT_FOUND }),
               {
                  status: 404,
                  headers: { 'Content-Type': 'application/json' },
               }
            );
         default:
            return createErrorResponse(context || 'Database', error, ErrorMessages.DATABASE_ERROR, 500, 'Database Operation');
      }
   }

   return createErrorResponse(context || 'Database', error, ErrorMessages.DATABASE_ERROR, 500, 'Database Operation');
}

/**
 * Handle Supabase errors specifically
 */
export function handleSupabaseError(error: unknown, context?: string): Response {
   if (error && typeof error === 'object' && 'message' in error && 'code' in error) {
      const supabaseError = error as { code?: string; message?: string; details?: string };
      
      // Log detailed error
      logError('Supabase Error', error, {
         code: supabaseError.code,
         details: supabaseError.details,
      });
      
      // Map Supabase error codes to generic messages
      if (supabaseError.code === 'PGRST116') {
         return new Response(
            JSON.stringify({ error: ErrorMessages.NOT_FOUND }),
            {
               status: 404,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }
      
      if (supabaseError.code === '23505') {
         return new Response(
            JSON.stringify({ error: ErrorMessages.DUPLICATE_SLUG }),
            {
               status: 409,
               headers: { 'Content-Type': 'application/json' },
            }
         );
      }
      
      // Generic database error
      return createErrorResponse(context || 'Supabase', error, ErrorMessages.DATABASE_ERROR, 500, 'Database Operation');
   }

   return createErrorResponse(context || 'Supabase', error, ErrorMessages.DATABASE_ERROR, 500, 'Database Operation');
}

/**
 * Safe error handler wrapper for async functions
 * Catches errors and returns safe responses
 */
export function safeHandler<T extends (context: APIContext) => Promise<Response>>(
   handler: T,
   context?: string
): T {
   return (async (ctx: APIContext) => {
      try {
         return await handler(ctx);
      } catch (error) {
         return createErrorResponse(ctx, error, ErrorMessages.INTERNAL_ERROR, 500, context);
      }
   }) as T;
}

