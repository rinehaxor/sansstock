/**
 * Environment Variables Validation
 * 
 * Validates all required environment variables at startup
 * Throws error if required variables are missing
 */

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = {
   SUPABASE_URL: 'Supabase project URL',
   SUPABASE_ANON_KEY: 'Supabase anonymous key',
} as const;

/**
 * Optional environment variables
 */
const OPTIONAL_ENV_VARS = {
   SUPABASE_SERVICE_ROLE_KEY: 'Supabase service role key (optional)',
   SITE_URL: 'Site URL (optional)',
   PUBLIC_SITE_URL: 'Public site URL (optional)',
   ENABLE_ERROR_LOGGING: 'Enable error logging (optional)',
} as const;

/**
 * Validate environment variables
 * Throws error if required variables are missing
 */
export function validateEnvironmentVariables(): void {
   const missing: string[] = [];

   // Check required variables
   for (const [key, description] of Object.entries(REQUIRED_ENV_VARS)) {
      const value = import.meta.env[key];
      if (!value || value.trim() === '') {
         missing.push(`${key} (${description})`);
      }
   }

   // Check for common misconfigurations
   const supabaseUrl = import.meta.env.SUPABASE_URL;
   if (supabaseUrl && !supabaseUrl.startsWith('http')) {
      throw new Error(
         `SUPABASE_URL must be a valid URL starting with http:// or https://. Got: ${supabaseUrl}`
      );
   }

   const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
   if (supabaseAnonKey && supabaseAnonKey.length < 100) {
      console.warn(
         'WARNING: SUPABASE_ANON_KEY seems too short. Make sure you are using the correct key.'
      );
   }

   // Throw error if required variables are missing
   if (missing.length > 0) {
      const errorMessage = `Missing required environment variables:\n${missing.map((m) => `  - ${m}`).join('\n')}\n\nPlease check your .env file or environment configuration.`;
      throw new Error(errorMessage);
   }

   // Log optional variables status
   if (import.meta.env.DEV) {
      for (const [key, description] of Object.entries(OPTIONAL_ENV_VARS)) {
         const value = import.meta.env[key];
         if (!value || value.trim() === '') {
            console.log(`[ENV] Optional variable not set: ${key} (${description})`);
         }
      }
   }
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(key: keyof typeof REQUIRED_ENV_VARS | keyof typeof OPTIONAL_ENV_VARS): string {
   const value = import.meta.env[key];
   
   if (key in REQUIRED_ENV_VARS && (!value || value.trim() === '')) {
      throw new Error(`Required environment variable ${key} is not set`);
   }
   
   return value || '';
}

/**
 * Get environment variable with default value
 */
export function getEnvVarOrDefault(
   key: keyof typeof OPTIONAL_ENV_VARS,
   defaultValue: string
): string {
   const value = import.meta.env[key];
   return value && value.trim() !== '' ? value : defaultValue;
}

