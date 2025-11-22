import { type Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // Exclude node_modules to speed up build and reduce unused CSS
    '!./src/**/node_modules/**',
  ],
  // Safelist untuk dynamic classes yang mungkin tidak terdeteksi oleh content scanner
  // Ini membantu Tailwind tetap include classes yang digunakan secara dinamis
  safelist: [
    // Common dynamic classes yang digunakan di codebase
    /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)$/,
    /^font-(normal|medium|semibold|bold)$/,
    // Color utilities yang digunakan secara dinamis
    /^bg-(gray|blue|green|red|yellow|purple|pink|orange)-\d+$/,
    /^text-(gray|blue|green|red|yellow|purple|pink|orange)-\d+$/,
    /^border-(gray|blue|green|red|yellow|purple|pink|orange)-\d+$/,
    /^hover:bg-(gray|blue|green|red|yellow|purple|pink|orange)-\d+$/,
    /^hover:text-(gray|blue|green|red|yellow|purple|pink|orange)-\d+$/,
    // Aspect ratios (used in ArticleCard, etc)
    /^aspect-\[.+\]$/,
    // Line clamp utilities
    /^line-clamp-\d+$/,
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;