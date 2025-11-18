# Setup Hybrid Rendering - Implementasi

## ✅ Perubahan yang Sudah Diterapkan

### 1. **Astro Config** ✅

-  `output: 'server'` → `output: 'hybrid'`
-  File: `astro.config.mjs`

### 2. **Homepage** ✅

-  `export const prerender = false` → `export const prerender = true`
-  File: `src/pages/index.astro`

## 🚀 Langkah Deploy

### 1. Rebuild Aplikasi

```bash
cd /var/www/sansstocks/sansstocks
npm run build
```

**Penting:** Build akan lebih lama karena homepage di-prerender dengan data real dari database.

### 2. Restart Aplikasi

```bash
pm2 restart sansstocks
```

### 3. Test

```bash
# Test homepage (seharusnya instant, no loading)
curl -w "\nTTFB: %{time_starttransfer}s\n" -o /dev/null -s https://emitenhub.com

# Test article page (masih SSR, ada loading)
curl -w "\nTTFB: %{time_starttransfer}s\n" -o /dev/null -s https://emitenhub.com/artikel/[slug]
```

## 📊 Expected Results

### Before (SSR Mode):

-  **Homepage TTFB**: 2-3 detik
-  **User Experience**: Loading screen

### After (Hybrid Mode):

-  **Homepage TTFB**: < 200ms (instant!)
-  **User Experience**: Halaman langsung muncul, no loading
-  **Article Pages**: Tetap SSR (dynamic)

## ⚠️ Catatan Penting

### 1. **Homepage Data akan Static**

Homepage akan di-prerender dengan data saat build time:

-  ✅ **Categories** - Static (perlu rebuild jika ada perubahan)
-  ✅ **Featured Articles** - Static (perlu rebuild jika ada perubahan)
-  ✅ **News List** - Static (perlu rebuild jika ada perubahan)
-  ✅ **Market Data** - Static (perlu rebuild jika ada perubahan)

**Solusi untuk Dynamic Data:**

-  Market data bisa di-refresh dengan client-side fetch
-  News list bisa di-refresh dengan client-side fetch
-  Atau setup rebuild otomatis setiap X menit

### 2. **Kapan Perlu Rebuild?**

Rebuild diperlukan jika:

-  ✅ Ada artikel baru yang ingin muncul di homepage
-  ✅ Ada perubahan kategori
-  ✅ Ada perubahan struktur homepage

**Tidak perlu rebuild untuk:**

-  ❌ Update artikel existing (kecuali ingin update di homepage)
-  ❌ Update artikel di halaman detail (masih SSR)

### 3. **Auto Rebuild (Optional)**

Bisa setup auto rebuild dengan cron job:

```bash
# Rebuild setiap 15 menit
*/15 * * * * cd /var/www/sansstocks/sansstocks && npm run build && pm2 restart sansstocks
```

**Tapi ini tidak recommended** karena:

-  Build process lama
-  Server akan down saat rebuild
-  Lebih baik manual rebuild saat perlu

### 4. **Alternative: Client-Side Refresh**

Untuk data yang perlu update real-time (seperti market data), bisa:

-  Prerender dengan data default
-  Refresh dengan client-side fetch setelah page load
-  Sudah di-implement di `MarketOverview.astro`

## 🎯 Benefits

### ✅ Homepage

-  **Instant load** - No loading screen
-  **Better UX** - User langsung lihat content
-  **Better SEO** - Static HTML, crawler friendly
-  **Better Performance** - No server processing

### ✅ Dynamic Pages

-  **Tetap SSR** - Real-time data
-  **No rebuild needed** - Update langsung muncul
-  **SEO friendly** - Server-rendered HTML

## 📝 Summary

**Yang Sudah Diubah:**

1. ✅ `astro.config.mjs` → `output: 'hybrid'`
2. ✅ `src/pages/index.astro` → `prerender = true`

**Next Steps:**

1. ⚠️ Rebuild aplikasi
2. ⚠️ Restart PM2
3. ⚠️ Test homepage (seharusnya instant)

**Expected:**

-  Homepage: Instant load (no loading)
-  Article pages: Tetap SSR (dynamic)
-  Best of both worlds! 🎉
