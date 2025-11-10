# Panduan Deployment di Vercel

Panduan ini menjelaskan cara deploy aplikasi Astro ini ke Vercel dengan benar.

## Prerequisites

1. Akun Vercel (gratis)
2. Repository Git (GitHub, GitLab, atau Bitbucket)
3. Project Supabase yang sudah di-setup

## Langkah-langkah Deployment

### 1. Push Code ke Repository Git

Pastikan semua perubahan sudah di-commit dan di-push ke repository Git Anda.

### 2. Connect Repository ke Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New Project**
3. Pilih repository Anda
4. Klik **Import**

### 3. Configure Build Settings

Vercel akan otomatis detect Astro project, tapi pastikan:

-  **Framework Preset**: Astro
-  **Build Command**: `npm run build`
-  **Output Directory**: `dist` (akan otomatis di-set oleh Astro adapter)

### 4. Set Environment Variables

**PENTING**: Ini adalah langkah yang paling penting! Tanpa environment variables, aplikasi akan error 500.

Di halaman project settings, buka **Environment Variables** dan tambahkan:

#### Required Variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Optional Variables:

```
SITE_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Catatan tentang SITE_URL:**

-  **Jika menggunakan Vercel default domain** (misal: `project-name.vercel.app`): **TIDAK PERLU** set `SITE_URL`. Aplikasi akan otomatis detect dari request URL.
-  **Jika menggunakan custom domain**: Set `SITE_URL` dengan domain Anda (misal: `https://sansstocks.com`)

**Cara mendapatkan nilai-nilai ini:**

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **Settings** > **API**
4. Copy:
   -  **Project URL** → `SUPABASE_URL`
   -  **anon public** key → `SUPABASE_ANON_KEY`
   -  **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (optional, untuk admin operations)

### 5. Deploy

Setelah environment variables di-set, klik **Deploy**. Vercel akan:

1. Install dependencies
2. Build aplikasi
3. Deploy ke production

## Troubleshooting

### Error 500: INTERNAL_SERVER_ERROR / FUNCTION_INVOCATION_FAILED

**Penyebab**: Environment variables tidak di-set atau salah.

**Solusi**:

1. Buka **Project Settings** > **Environment Variables** di Vercel
2. Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sudah di-set
3. Pastikan nilai-nilainya benar (tidak ada spasi di awal/akhir)
4. Redeploy aplikasi setelah menambahkan/mengubah environment variables

### Error 404: Not Found

**Penyebab**: Routing tidak bekerja dengan benar.

**Solusi**:

1. Pastikan menggunakan `@astrojs/vercel` adapter (bukan `@astrojs/node`)
2. Pastikan `astro.config.mjs` sudah dikonfigurasi dengan benar
3. Pastikan `vercel.json` ada di root project (optional, tapi recommended)

### Build Fails

**Penyebab**: Dependencies tidak terinstall atau ada error di code.

**Solusi**:

1. Test build lokal dengan `npm run build`
2. Fix semua error yang muncul
3. Pastikan semua dependencies ada di `package.json`

## Environment Variables di Vercel

### Production, Preview, dan Development

Anda bisa set environment variables untuk:

-  **Production**: Hanya untuk production deployment
-  **Preview**: Untuk preview deployments (pull requests, branches)
-  **Development**: Untuk local development (jika menggunakan Vercel CLI)

**Rekomendasi**: Set semua environment variables untuk ketiga environment.

## Verifikasi Deployment

Setelah deploy berhasil:

1. Buka URL production yang diberikan Vercel
2. Pastikan halaman utama bisa diakses
3. Test beberapa fitur:
   -  Halaman artikel
   -  Dashboard (jika ada)
   -  API endpoints

## Catatan Penting

1. **Environment Variables**: Jangan pernah commit `.env` file ke Git. Gunakan Vercel Environment Variables.
2. **Build Time**: Build pertama mungkin lebih lama karena Vercel perlu install dependencies.
3. **Cold Start**: Serverless functions mungkin sedikit lambat pada cold start pertama kali.
4. **Logs**: Gunakan Vercel Dashboard > **Deployments** > **Functions** untuk melihat logs jika ada error.

## Support

Jika masih ada masalah:

1. Cek logs di Vercel Dashboard
2. Test build lokal dengan `npm run build`
3. Pastikan semua environment variables sudah di-set dengan benar
