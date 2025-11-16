/**
 * Secure Error Handling Utility
 * 
 * Provides safe error handling that:
 * - Returns generic error messages to clients (doesn't leak system info)
 * - Logs detailed errors server-side only
 * - Prevents exposing database errors, stack traces, etc.
 */

/**
 * Generic error messages for different error types
 * These are safe to expose to clients
 */
export const ErrorMessages = {
   // Authentication & Authorization
   UNAUTHORIZED: 'Unauthorized - Please login',
   FORBIDDEN: 'Forbidden - Access denied',
   INVALID_CREDENTIALS: 'Invalid email or password',

   // Validation
   VALIDATION_FAILED: 'Validation failed. Please check your input.',
   MISSING_REQUIRED_FIELDS: 'Missing required fields',
   INVALID_INPUT: 'Invalid input provided',

   // Not Found
   NOT_FOUND: 'Resource not found',
   ARTICLE_NOT_FOUND: 'Article not found',
   CATEGORY_NOT_FOUND: 'Category not found',
   TAG_NOT_FOUND: 'Tag not found',

   // Rate Limiting
   TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',

   // CSRF
   INVALID_CSRF: 'Invalid CSRF token. Please refresh the page and try again.',
   INVALID_ORIGIN: 'Invalid origin. Request rejected for security.',

   // Server Errors (generic)
   INTERNAL_ERROR: 'An error occurred. Please try again later.',
   DATABASE_ERROR: 'Database operation failed. Please try again.',
   UPLOAD_ERROR: 'File upload failed. Please try again.',

   // Business Logic
   DUPLICATE_ENTRY: 'A resource with this information already exists',
   IN_USE: 'This resource cannot be deleted as it is currently in use',
   INVALID_OPERATION: 'Invalid operation',

   // File Upload
   FILE_TOO_LARGE: 'File size exceeds maximum limit',
   INVALID_FILE_TYPE: 'Invalid file type',
   FILE_UPLOAD_FAILED: 'File upload failed',
} as const;

/**
 * Check if we're in production mode
 */
function isProduction(): boolean {
   return import.meta.env.PROD === true;
}

/**
 * Log error server-side with full details
 * Only logs in development or if explicitly enabled
 */
function generateCorrelationId(): string {
   if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      try {
         return crypto.randomUUID();
      } catch {
         // ignore and fallback
      }
   }
   return `${Date.now().toString(16)}-${Math.floor(Math.random() * 1e6).toString(16)}`;
}

function logError(error: unknown, context: string | undefined, correlationId: string): void {
   const errorMessage = error instanceof Error ? error.message : String(error);
   const errorStack = error instanceof Error ? error.stack : undefined;

   // Always log in development
   // In production, you might want to use a proper logging service
   if (!isProduction() || process.env.ENABLE_ERROR_LOGGING === 'true') {
      console.error('[ERROR]', context ? `[${context}]` : '', `[${correlationId}]`, errorMessage);
      if (errorStack && !isProduction()) {
         console.error('[STACK]', errorStack);
      }
      if (error instanceof Error && error.cause) {
         console.error('[CAUSE]', error.cause);
      }
   }

   // In production, you might want to send to error tracking service
   // Example: Sentry, LogRocket, etc.
   if (isProduction() && typeof window === 'undefined') {
      // Server-side only
      // TODO: Integrate with error tracking service
      // Example:
      // Sentry.captureException(error, { tags: { context } });
   }
}

/**
 * Create a safe error response for client
 * Returns generic message in production, detailed in development
 */
export function createErrorResponse(
   error: unknown,
   statusCode: number = 500,
   context?: string
): Response {
   const correlationId = generateCorrelationId();

   // Log error server-side
   logError(error, context, correlationId);

   // Determine error message
   let message: string;
   let details: string | undefined;

   if (error instanceof Error) {
      // In development, show more details for debugging
      if (!isProduction()) {
         message = error.message;
         details = error.stack;
      } else {
         // In production, use generic messages based on error type
         message = getGenericErrorMessage(error, statusCode);
      }
   } else if (typeof error === 'string') {
      // If error is a string, check if it's a known error message
      message = ErrorMessages[error as keyof typeof ErrorMessages] || error;
      if (!isProduction()) {
         details = error;
      }
   } else {
      message = ErrorMessages.INTERNAL_ERROR;
   }

   // Build response
   const responseBody: Record<string, unknown> = {
      error: message,
      correlationId,
   };

   // Only include details in development
   if (!isProduction() && details) {
      responseBody.details = details;
   }

   return new Response(JSON.stringify(responseBody), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
   });
}

/**
 * Get generic error message based on error type and status code
 */
function getGenericErrorMessage(error: Error, statusCode: number): string {
   // Database errors
   if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return ErrorMessages.DUPLICATE_ENTRY;
   }

   if (error.message.includes('foreign key') || error.message.includes('constraint')) {
      return ErrorMessages.IN_USE;
   }

   if (error.message.includes('PGRST') || error.message.includes('PostgREST')) {
      return ErrorMessages.DATABASE_ERROR;
   }

   // Network/Connection errors
   if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      return ErrorMessages.INTERNAL_ERROR;
   }

   // Auth errors
   if (error.message.includes('Invalid login') || error.message.includes('credentials')) {
      return ErrorMessages.INVALID_CREDENTIALS;
   }

   // Status code based messages
   switch (statusCode) {
      case 400:
         return ErrorMessages.INVALID_INPUT;
      case 401:
         return ErrorMessages.UNAUTHORIZED;
      case 403:
         return ErrorMessages.FORBIDDEN;
      case 404:
         return ErrorMessages.NOT_FOUND;
      case 429:
         return ErrorMessages.TOO_MANY_REQUESTS;
      case 500:
      default:
         return ErrorMessages.INTERNAL_ERROR;
   }
}

/**
 * Create success response
 */
export function createSuccessResponse(
   data: unknown,
   statusCode: number = 200,
   headers?: Record<string, string>
): Response {
   const responseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
   };

   return new Response(JSON.stringify({ data }), {
      status: statusCode,
      headers: responseHeaders,
   });
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(
   errors: Array<{ path: (string | number)[]; message: string }>,
   details?: string
): Response {
   const correlationId = generateCorrelationId();
   const errorMessage = isProduction()
      ? ErrorMessages.VALIDATION_FAILED
      : `Validation failed: ${errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`;

   const responseBody: Record<string, unknown> = {
      error: errorMessage,
      correlationId,
   };

   // Only include details in development
   if (!isProduction() && details) {
      responseBody.details = details;
   }

   return new Response(JSON.stringify(responseBody), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
   });
}

/**
 * Wrapper for async route handlers with error handling
 */
export async function handleRouteError(
   handler: () => Promise<Response>,
   context?: string
): Promise<Response> {
   try {
      return await handler();
   } catch (error) {
      return createErrorResponse(error, 500, context);
   }
}

