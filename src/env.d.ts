interface ImportMetaEnv {
	readonly SUPABASE_URL: string;
	readonly SUPABASE_ANON_KEY: string;
	readonly SUPABASE_SERVICE_ROLE_KEY?: string; // Optional: untuk admin operations
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
