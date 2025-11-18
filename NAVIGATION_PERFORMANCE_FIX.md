# Fix Navigation & Cold Start Performance

## ✅ Masalah yang Sudah Diperbaiki

### 1. **Cold Start Lambat**

**Masalah**: Saat pertama kali akses, loading lama karena:

-  Database connection pertama kali
-  Semua query sequential
-  Market data fetch dengan timeout

**Solusi**:

-  ✅ Implementasi in-memory cache untuk categories (5 menit)
-  ✅ Cache market data (1 menit)
-  ✅ Query sudah di-optimasi dengan batch queries

### 2. **Navigasi dari Kategori ke Home Lambat**

**Masalah**: Saat kembali ke home, semua query dijalankan lagi karena full page reload

**Solusi**:

-  ✅ Categories di-cache (tidak perlu query lagi)
-  ✅ Market data di-cache (tidak perlu fetch external API lagi)
-  ✅ Prefetch links saat hover untuk faster navigation

## 📋 Optimasi yang Diterapkan

### 1. **In-Memory Cache System**

File: `src/lib/cache.ts`

-  Simple in-memory cache untuk data yang tidak sering berubah
-  TTL (Time To Live) configurable
-  Auto-expire setelah TTL
-  Cache akan reset saat server restart

**Cache Keys**:

-  `categories:with-articles` - Cache 5 menit
-  `market:data` - Cache 1 menit

### 2. **Categories Caching**

File: `src/pages/index.astro`

-  Categories di-cache selama 5 menit
-  Categories tidak sering berubah, jadi cache aman
-  Mengurangi 2 database queries setiap request

### 3. **Market Data Caching**

File: `src/lib/market.ts`

-  Market data di-cache selama 1 menit
-  Mengurangi external API calls ke Yahoo Finance
-  Fallback ke default data jika API lambat/timeout

### 4. **Link Prefetching**

File: `src/components/Header.astro`

-  Prefetch links saat user hover
-  Browser akan preload halaman sebelum user klik
-  Membuat navigasi terasa lebih cepat

## 🚀 Expected Improvements

Setelah optimasi ini:

1. **Cold Start**:

   -  Pertama kali: Masih ada delay untuk establish connection
   -  Request berikutnya: Jauh lebih cepat karena cache

2. **Navigasi Home**:

   -  Categories: Instant (dari cache)
   -  Market data: Instant (dari cache jika < 1 menit)
   -  Articles: Masih perlu fetch (data dinamis)

3. **Navigasi Umum**:
   -  Prefetch membuat navigasi terasa lebih cepat
   -  Browser sudah preload halaman sebelum user klik

## 📊 Performance Metrics

### Before:

-  Cold start: ~3-5 detik
-  Navigasi ke home: ~2-3 detik
-  Categories query: ~200-500ms setiap request

### After (Expected):

-  Cold start: ~3-5 detik (pertama kali, tidak bisa dihindari)
-  Navigasi ke home: ~500ms-1s (dari cache)
-  Categories query: ~0ms (dari cache)

## 🔧 Deployment

### 1. Rebuild Aplikasi

```bash
cd /var/www/sansstocks/sansstocks
npm run build
```

### 2. Restart Aplikasi

```bash
pm2 restart sansstocks
# atau
sudo systemctl restart sansstocks
```

### 3. Verify

```bash
# Test cold start
curl -w "\nTime: %{time_total}s\n" https://emitenhub.com

# Test kedua kali (harus lebih cepat karena cache)
curl -w "\nTime: %{time_total}s\n" https://emitenhub.com
```

## ⚠️ Catatan Penting

### Cache Behavior

1. **In-Memory Cache**:

   -  Cache akan hilang saat server restart
   -  Cache tidak shared antar instance (jika multiple PM2 instances)
   -  Cache hanya untuk single server instance

2. **Cache Invalidation**:

   -  Categories: Auto-expire setelah 5 menit
   -  Market data: Auto-expire setelah 1 menit
   -  Untuk invalidate manual, restart aplikasi

3. **Multiple Instances**:
   -  Jika menggunakan PM2 dengan multiple instances, setiap instance punya cache sendiri
   -  Pertimbangkan menggunakan Redis untuk shared cache jika perlu

### Future Improvements

1. **Redis Cache** (Optional):

   -  Shared cache untuk multiple instances
   -  Persistent cache (tidak hilang saat restart)
   -  Better untuk production scale

2. **Service Worker** (Optional):

   -  Client-side caching
   -  Offline support
   -  Better perceived performance

3. **CDN Caching**:
   -  Cache static assets
   -  Cache HTML dengan proper headers
   -  Reduce server load

## 🐛 Troubleshooting

### Cache tidak bekerja

```bash
# Cek apakah cache di-import dengan benar
grep -r "from.*cache" src/

# Cek logs untuk cache hits
pm2 logs sansstocks | grep -i cache
```

### Masih lambat setelah cache

1. **Database Connection**:

   -  Pastikan connection pooling aktif
   -  Cek database response time

2. **External APIs**:

   -  Market data masih perlu fetch external API
   -  Timeout sudah di-set 3 detik

3. **Network Latency**:
   -  VPS location vs database location
   -  Internet connection speed

### Cache terlalu lama

Jika data tidak update:

-  Restart aplikasi untuk clear cache
-  Atau kurangi TTL di code

## 📈 Monitoring

Monitor cache performance:

```bash
# Cek memory usage (cache menggunakan memory)
pm2 monit

# Cek response times
curl -w "\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://emitenhub.com
```
