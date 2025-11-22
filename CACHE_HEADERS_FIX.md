# Cache Headers Fix untuk Supabase Images

## Masalah
Gambar-gambar dari Supabase storage hanya punya cache TTL 1 jam, menyebabkan Lighthouse warning "Use efficient cache lifetimes" dengan estimated savings 1,420 KiB.

## Solusi

### 1. Middleware untuk Set Cache Headers
File: `src/middleware.ts`

Middleware ini akan otomatis set cache headers yang panjang (1 tahun) untuk:
- `/_image` endpoint (Astro image optimization)
- `/api/image-proxy/` endpoint (jika digunakan)

### 2. Nginx Configuration
File: `nginx-performance.conf`

Update nginx config untuk set cache headers:
```nginx
# Cache untuk images dari Astro _image endpoint (optimized images)
location ~* /_image {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
```

### 3. Pastikan Semua Gambar Menggunakan Astro Image Component
Astro Image component sudah otomatis:
- Optimize images melalui `/_image` endpoint
- Convert ke WebP format
- Generate responsive sizes
- Set proper cache headers (melalui middleware)

**Components yang sudah menggunakan Astro Image:**
- ✅ `ArticleCard.astro` - untuk thumbnail artikel
- ✅ `FeaturedNews.astro` - untuk featured images
- ✅ `Header.astro` - untuk logo
- ✅ `[slug].astro` - untuk article hero image

## Expected Results

### Before:
- Cache TTL: 1 hour
- Transfer Size: 1,774 KiB per page load
- Lighthouse Warning: "Use efficient cache lifetimes"

### After:
- Cache TTL: 1 year (31536000 seconds)
- Transfer Size: 0 KiB pada repeat visits (cached)
- Lighthouse: No warning

## Deployment Steps

1. **Deploy code changes:**
   - Middleware sudah otomatis aktif
   - Tidak perlu konfigurasi tambahan

2. **Update Nginx (jika menggunakan VPS):**
   ```bash
   # Copy config ke nginx
   sudo cp nginx-performance.conf /etc/nginx/snippets/emitenhub-performance.conf
   
   # Edit nginx site config
   sudo nano /etc/nginx/sites-available/emitenhub
   
   # Tambahkan di dalam server block:
   include /etc/nginx/snippets/emitenhub-performance.conf;
   
   # Test dan reload nginx
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Verify:**
   - Check response headers untuk `/_image` endpoint
   - Should see: `Cache-Control: public, max-age=31536000, immutable`
   - Run Lighthouse audit - warning should disappear

## Notes

- Gambar yang langsung dari Supabase storage (bukan melalui `/_image`) masih punya cache TTL 1 jam dari Supabase server
- Pastikan semua gambar menggunakan Astro Image component untuk mendapatkan cache headers yang panjang
- Middleware akan otomatis set cache headers untuk semua `/_image` requests

