# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔧 Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (Optional)
# Jika tidak diisi, website akan otomatis detect dari request URL
# Format: https://yourdomain.com (tanpa trailing slash)
# SITE_URL=https://sansstocks.com
```

### Catatan tentang Site URL:

- **Development**: Jika `SITE_URL` tidak diisi, website akan otomatis menggunakan URL dari request (misal: `http://localhost:4321`)
- **Production**: Setelah deploy, Anda bisa:
  1. Set environment variable `SITE_URL` di hosting provider Anda, ATAU
  2. Biarkan kosong dan website akan otomatis detect dari domain yang digunakan

**Prioritas Site URL:**
1. Environment variable `SITE_URL` (jika ada)
2. Astro config `site` (jika ada)
3. Request URL (otomatis detect)

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
