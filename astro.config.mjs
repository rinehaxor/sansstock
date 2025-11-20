import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL || 'https://emitenhub.com';

// https://astro.build/config
export default defineConfig({
   // Site URL diperlukan untuk sitemap dan SEO metadata
   site: siteUrl,
   output: 'server', // Server mode (hybrid tidak support dengan node adapter)
   adapter: node({
      mode: 'standalone',
   }),
   security: {
      checkOrigin: false,
   },
   integrations: [tailwind(), react(), sitemap()],
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
         noExternal: ['@radix-ui/react-slot', '@radix-ui/react-tabs'],
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
