# Optimasi JavaScript Execution Time

## 🔍 Masalah yang Ditemukan (Score 74)

### 1. **JavaScript Execution Time: 1.6s** ❌

-  **Pintu Widget**: 708ms (terbesar!)
-  **Google Tag Manager**: 560ms
-  **TikTok**: 279ms
-  **EmitenHub**: 216ms

### 2. **Unused JavaScript: 1,188 KiB** ❌

-  **Pintu Widget**: 825 KiB (terbesar!)
-  **TikTok**: 322 KiB
-  **Google Tag Manager**: 548 KiB
-  **EmitenHub**: 178 KiB

### 3. **Images Terlalu Besar: 1.3MB** ❌

-  Satu image: 1,340 KiB
-  Perlu resize & compress

## ✅ Optimasi yang Sudah Diterapkan

### 1. **Lazy Load Pintu Widget** ✅

-  **Before**: Load langsung saat page load (708ms execution time)
-  **After**: Load saat visible di viewport dengan Intersection Observer
-  **Benefit**: Mengurangi ~700ms JavaScript execution time di initial load

### 2. **Optimize Client Components** ✅

-  **Toaster**: `client:load` → `client:idle` (load setelah page idle)
-  **CategoryTabs**: `client:load` → `client:visible` (load saat visible)
-  **NewsPagination**: `client:load` → `client:visible` (load saat visible)

### 3. **Code Splitting** ✅

-  Manual chunk splitting untuk vendor libraries
-  React & React-DOM di chunk terpisah
-  Radix UI di chunk terpisah

### 4. **Remove Preconnect ke Pintu** ✅

-  Tidak preconnect ke pintu.co.id
-  Widget akan di-load lazy

## 📊 Expected Improvements

### Before:

-  **JS Execution Time**: 1.6s
-  **Unused JS**: 1,188 KiB
-  **Pintu Widget**: 708ms (blocking)

### After (Expected):

-  **JS Execution Time**: ~0.8-1s (50% improvement)
-  **Unused JS**: ~600 KiB (50% improvement)
-  **Pintu Widget**: 0ms di initial load (lazy loaded)

## 🚀 Deployment

### 1. Rebuild Aplikasi

```bash
cd /var/www/sansstocks/sansstocks
npm run build
```

### 2. Restart Aplikasi

```bash
pm2 restart sansstocks
```

### 3. Test Performance

```bash
# Test dengan Lighthouse
# Buka Chrome DevTools > Lighthouse > Analyze
```

## ⚠️ Catatan Penting

### Third-Party Scripts

Scripts dari Pintu widget (Google Tag Manager, TikTok, Facebook, Hotjar) **tidak bisa di-optimize** karena:

-  Mereka di-inject oleh Pintu widget
-  Tidak ada kontrol atas scripts mereka
-  Lazy loading widget membantu, tapi scripts tetap akan load saat widget load

### Images Optimization

**Masalah**: Images terlalu besar (1.3MB untuk satu image)

**Solusi yang perlu dilakukan**:

1. **Resize images sebelum upload**:

   -  Thumbnail: max 400x300px
   -  Featured: max 800x450px
   -  Full size: max 1200x675px

2. **Compress images**:

   -  Gunakan tools: ImageOptim, Squoosh, TinyPNG
   -  Target: < 100KB per image

3. **Use WebP format**:
   -  Astro Image component sudah handle ini
   -  Pastikan source images sudah di-compress

### Future Improvements

1. **Remove Unused CSS**:

   -  PurgeCSS sudah aktif di Tailwind
   -  Review CSS yang tidak digunakan

2. **Service Worker**:

   -  Cache static assets
   -  Offline support

3. **CDN untuk Images**:
   -  Cloudflare Images
   -  ImageKit
   -  Cloudinary

## 🎯 Target Score

Setelah optimasi:

-  **Performance**: 74 → 85-90 (expected)
-  **JS Execution**: 1.6s → 0.8-1s
-  **Unused JS**: 1,188 KiB → 600 KiB

## 📝 Summary

**Optimasi yang Sudah Diterapkan:**

-  ✅ Lazy load Pintu widget dengan Intersection Observer
-  ✅ Optimize client component loading (idle/visible)
-  ✅ Code splitting untuk vendor libraries
-  ✅ Remove preconnect ke Pintu

**Masih Perlu:**

-  ⚠️ Optimize images (resize & compress)
-  ⚠️ Review unused CSS
-  ⚠️ Consider CDN untuk images
