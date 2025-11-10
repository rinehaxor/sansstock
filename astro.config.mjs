import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
   // Site URL akan diambil dari environment variable SITE_URL
   // Jika tidak ada, akan menggunakan fallback atau detect otomatis saat runtime
   site: import.meta.env.SITE_URL || undefined, // undefined = Astro akan detect otomatis
   output: 'server',
   adapter: vercel(),
   integrations: [tailwind(), react()],
   image: {
      domains: ['localhost', 'supabase.co', '*.supabase.co'],
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**.supabase.co',
         },
      ],
   },
   vite: {
      ssr: {
         noExternal: ['@radix-ui/react-slot'],
      },
   },
});
