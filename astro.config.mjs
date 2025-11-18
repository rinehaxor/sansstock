import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
   // Site URL akan diambil dari environment variable SITE_URL
   // Jika tidak ada, akan menggunakan fallback atau detect otomatis saat runtime
   site: import.meta.env.SITE_URL || undefined, // undefined = Astro akan detect otomatis
   output: 'hybrid', // Hybrid mode: homepage static, dynamic pages SSR
   adapter: node({
      mode: 'standalone',
   }),
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
      build: {
         // Optimize chunk splitting untuk mengurangi unused JS
         rollupOptions: {
            output: {
               manualChunks: (id) => {
                  // Split vendor chunks
                  if (id.includes('node_modules')) {
                     if (id.includes('react') || id.includes('react-dom')) {
                        return 'react-vendor';
                     }
                     if (id.includes('@radix-ui')) {
                        return 'radix-vendor';
                     }
                     return 'vendor';
                  }
               },
            },
         },
      },
   },
});
