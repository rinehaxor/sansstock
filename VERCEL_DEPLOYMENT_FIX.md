# Vercel Deployment Fix Guide

## Masalah
Error: `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/dist/server/entry.mjs'`

## Solusi

### 1. Pastikan Project Settings di Vercel Dashboard

Buka **Vercel Dashboard** → **Project Settings** → **General** → **Build & Development Settings**:

**PENTING - Set pengaturan berikut:**
- **Framework Preset**: `Astro` (atau biarkan auto-detect)
- **Build Command**: `npm run build`
- **Output Directory**: **KOSONG** (biarkan kosong, jangan isi apapun!)
- **Install Command**: `npm install`
- **Root Directory**: kosong (atau `./` jika project di subfolder)

**JANGAN set Output Directory ke `dist` atau `.vercel/output`!**
Adapter Vercel menangani ini secara otomatis.

### 2. Clear Build Cache

1. Di **Project Settings** → **General**, scroll ke bawah
2. Klik **"Clear Build Cache"**
3. Klik **"Save"**

### 3. Redeploy dengan Force Rebuild

1. Buka tab **Deployments**
2. Klik **"..."** pada deployment yang error
3. Pilih **"Redeploy"**
4. **JANGAN** centang "Use existing Build Cache"
5. Klik **"Redeploy"**

### 4. Jika Masih Error - Reconnect Project

1. **Hapus project** dari Vercel:
   - Settings → General → Scroll ke bawah → **Delete Project**

2. **Import ulang** dari repository:
   - Klik **"Add New..."** → **"Project"**
   - Pilih repository Anda
   - Saat import, pastikan:
     - Framework Preset: **Astro** (atau biarkan auto-detect)
     - Build Command: `npm run build`
     - Output Directory: **KOSONG** (jangan isi apapun!)
     - Install Command: `npm install`

3. **Set Environment Variables**:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SITE_URL (opsional)

4. Klik **"Deploy"**

## Konfigurasi yang Sudah Benar

✅ `astro.config.mjs` sudah benar dengan adapter `@astrojs/vercel`
✅ `package.json` sudah benar
✅ Build lokal berhasil dan menghasilkan `.vercel/output`

## Catatan Penting

- **JANGAN** set Output Directory di Vercel dashboard
- Adapter Vercel menangani output secara otomatis
- Folder `.vercel` dihasilkan saat build dan tidak perlu di-commit
- Pastikan semua perubahan sudah di-commit dan push ke repository

