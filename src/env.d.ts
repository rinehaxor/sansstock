interface ImportMetaEnv {
	readonly SUPABASE_URL: string;
	readonly SUPABASE_ANON_KEY: string;
	readonly SUPABASE_SERVICE_ROLE_KEY?: string; // Optional: untuk admin operations
	readonly SITE_URL?: string; // Optional: domain website (default: akan detect otomatis)
	readonly PUBLIC_SITE_URL?: string; // Optional: untuk client-side (default: akan detect otomatis)
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}
