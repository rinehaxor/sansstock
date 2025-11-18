# Panduan Optimasi Images

## 🔍 Masalah Images (1.3MB per image!)

**Masalah**: Images terlalu besar

-  Satu thumbnail: **1,340 KiB** (1.3MB!)
-  Display size: hanya 192x112px
-  File size: 10x lebih besar dari yang diperlukan

## ✅ Solusi

### 1. **Resize Images Sebelum Upload**

**Recommended Sizes:**

-  **Thumbnail**: 400x300px (max)
-  **Featured**: 800x450px (max)
-  **Full Article**: 1200x675px (max)

**Tools untuk Resize:**

-  **Online**: https://squoosh.app/
-  **Desktop**: ImageOptim, GIMP, Photoshop
-  **CLI**: ImageMagick, Sharp

### 2. **Compress Images**

**Target File Size:**

-  Thumbnail: < 50KB
-  Featured: < 150KB
-  Full: < 300KB

**Tools untuk Compress:**

-  **Online**: https://tinypng.com/
-  **Online**: https://squoosh.app/
-  **Desktop**: ImageOptim

### 3. **Use WebP Format**

Astro Image component sudah otomatis convert ke WebP, tapi:

-  Pastikan source images sudah di-compress
-  WebP bisa 30-50% lebih kecil dari JPG/PNG

### 4. **Responsive Images**

Astro Image component sudah handle responsive images dengan:

-  `sizes` attribute
-  Multiple sizes generation
-  WebP format

## 📋 Langkah-Langkah

### Untuk Images Baru:

1. **Resize**:

   ```bash
   # Contoh dengan ImageMagick
   convert input.jpg -resize 400x300^ -gravity center -extent 400x300 thumbnail.jpg
   ```

2. **Compress**:

   -  Upload ke https://tinypng.com/
   -  Atau gunakan Squoosh.app

3. **Upload ke Supabase**:
   -  Upload file yang sudah di-resize & compress

### Untuk Images Existing:

**Option 1: Manual (Recommended)**

1. Download images dari Supabase
2. Resize & compress
3. Re-upload

**Option 2: Automated Script (Future)**

-  Buat script untuk batch resize & compress
-  Re-upload otomatis

## 🎯 Expected Results

### Before:

-  Thumbnail: 1,340 KiB (1.3MB)
-  Display: 192x112px
-  Waste: ~1.2MB per image

### After:

-  Thumbnail: ~30-50 KiB
-  Display: 192x112px
-  Savings: ~95% reduction

## 💡 Tips

1. **Always resize sebelum upload**
2. **Compress dengan quality 80-85%** (masih bagus, lebih kecil)
3. **Use WebP** (Astro sudah handle)
4. **Monitor file sizes** di Supabase dashboard

## 🔧 Quick Fix Script (Future)

Bisa dibuat script untuk:

1. Download semua images dari Supabase
2. Resize & compress
3. Re-upload dengan nama yang sama

Tapi untuk sekarang, **manual resize & compress** adalah cara terbaik.
