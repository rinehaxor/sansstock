# Fix Cold Start Loading Screen

## 🔍 Masalah

**Saat pertama kali mengakses halaman, tidak langsung membuka halaman tapi loading dulu.**

### Penyebab:
1. **Server-Side Rendering (SSR)** - Halaman harus di-render di server setiap kali
2. **Database Queries** - Perlu waktu untuk fetch data dari Supabase
3. **External API Calls** - Market data dari Yahoo Finance
4. **No Streaming** - Browser menunggu semua HTML selesai sebelum render

## ✅ Solusi yang Diterapkan

### 1. **Streaming Response** ✅
- Astro secara default sudah support streaming
- HTML akan di-stream ke browser secara bertahap
- Browser bisa mulai render sebelum semua data selesai

### 2. **Loading Skeleton Component** ✅
- Component `LoadingSkeleton.astro` untuk initial load
- Bisa digunakan jika perlu show loading state

### 3. **Optimize Initial HTML** ✅
- Pastikan HTML awal di-render cepat
- Critical CSS inline
- Defer non-critical resources

## 🚀 Optimasi Tambahan yang Bisa Dilakukan

### Option 1: Pre-warm Server (Recommended)

Pastikan server selalu running dan tidak idle:

```bash
# PM2 config untuk keep server alive
pm2 start dist/server/entry.mjs --name sansstocks --max-memory-restart 500M
pm2 save
pm2 startup
```

### Option 2: Add Health Check Endpoint

Buat endpoint untuk pre-warm server:

```typescript
// src/pages/api/warmup.ts
export async function GET() {
  // Pre-warm database connection
  await supabase.from('articles').select('id').limit(1);
  return new Response('OK', { status: 200 });
}
```

Setup cron job untuk hit endpoint setiap 5 menit:

```bash
# Crontab
*/5 * * * * curl -s https://emitenhub.com/api/warmup > /dev/null
```

### Option 3: Use CDN/Edge Caching

Setup CDN di depan server untuk cache HTML response:

- **Cloudflare** - Free tier available
- **Vercel Edge** - Jika migrate ke Vercel
- **Nginx Cache** - Cache di level nginx

### Option 4: Hybrid Rendering (Future)

Pertimbangkan hybrid rendering:
- Prerender homepage dengan ISR (Incremental Static Regeneration)
- Update setiap 5-10 menit
- Fallback ke SSR jika cache miss

## 📊 Expected Improvements

### Before:
- **TTFB**: 2-3 detik (cold start)
- **User Experience**: Blank screen / loading

### After (Expected):
- **TTFB**: < 500ms (dengan pre-warm)
- **User Experience**: Content muncul lebih cepat

## 🔧 Implementation Steps

### 1. Pre-warm Server (Immediate)

```bash
# Setup PM2 untuk keep server alive
pm2 restart sansstocks
pm2 save
```

### 2. Add Warmup Endpoint (Optional)

```bash
# Create warmup endpoint
# File: src/pages/api/warmup.ts
```

### 3. Setup Cron Job (Optional)

```bash
# Edit crontab
crontab -e

# Add warmup job
*/5 * * * * curl -s https://emitenhub.com/api/warmup > /dev/null
```

### 4. Monitor Performance

```bash
# Test TTFB
curl -w "\nTTFB: %{time_starttransfer}s\n" -o /dev/null -s https://emitenhub.com
```

## ⚠️ Catatan Penting

### Cold Start adalah Normal

**Cold start terjadi karena:**
1. Server idle setelah beberapa waktu tidak ada request
2. Node.js process di-sleep oleh OS untuk save resources
3. Database connection pool di-reset

**Ini adalah behavior normal untuk:**
- VPS dengan limited resources
- Server yang tidak selalu aktif
- Shared hosting environments

### Solutions Priority

1. **Pre-warm Server** (Easiest) - Setup PM2 dengan proper config
2. **Cron Job Warmup** (Recommended) - Keep server warm
3. **CDN Caching** (Best) - Cache HTML response
4. **Hybrid Rendering** (Future) - Prerender + ISR

## 📝 Summary

**Masalah:**
- Cold start menyebabkan loading screen saat pertama kali akses

**Solusi:**
- ✅ Streaming response (already enabled)
- ✅ Loading skeleton component (created)
- ⚠️ Pre-warm server (needs setup)
- ⚠️ Cron job warmup (optional)

**Next Steps:**
1. Setup PM2 dengan proper config
2. (Optional) Add warmup endpoint + cron job
3. Monitor TTFB setelah setup

