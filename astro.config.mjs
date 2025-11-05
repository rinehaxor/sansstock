import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
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
