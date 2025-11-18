# Optimasi Performa - Implementasi

## ✅ Optimasi yang Sudah Diterapkan

### 1. **Preconnect & Resource Hints**
- ✅ Preconnect ke `fonts.googleapis.com` dan `fonts.gstatic.com`
- ✅ Preconnect ke `pintu.co.id` (untuk market ticker widget)
- ✅ Preconnect ke `aitfpijkletoyuxujmnc.supabase.co` (untuk images)
- ✅ DNS prefetch untuk `supabase.co`

### 2. **Font Loading Optimization**
- ✅ Font CSS di-preload dengan `rel="preload"` dan `as="style"`
- ✅ Font loading di-defer dengan `onload` handler
- ✅ Fallback untuk browser tanpa JavaScript

### 3. **LCP Image Optimization**
- ✅ Featured article pertama menggunakan `fetchpriority="high"`
- ✅ Responsive image sizes dengan proper `sizes` attribute
- ✅ WebP format untuk semua images

### 4. **Image Optimization**
- ✅ Lazy loading untuk images yang tidak critical
- ✅ Proper `sizes` attribute untuk responsive images
- ✅ `fetchpriority="low"` untuk non-critical images

### 5. **Database Query Optimization**
- ✅ Batch queries untuk alt text (menghilangkan N+1 queries)
- ✅ Optimasi query categories dengan published articles
- ✅ Single query dengan join untuk trending tags

## 📋 Langkah Implementasi di VPS

### 1. Update Nginx Configuration

Edit file nginx config:
```bash
sudo nano /etc/nginx/sites-available/sansstocks
```

Tambahkan konfigurasi dari `nginx-performance.conf` ke dalam `server` block:

```nginx
server {
    listen 80;
    server_name emitenhub.com www.emitenhub.com;

    # ... existing config ...

    # Cache headers untuk static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Cache untuk images dari Astro
    location ~* /_image {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject
        image/svg+xml;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy pass ke Node.js app
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Test & Reload Nginx

```bash
# Test konfigurasi
sudo nginx -t

# Jika sukses, reload nginx
sudo systemctl reload nginx
```

### 3. Rebuild & Restart Aplikasi

```bash
cd /var/www/sansstocks/sansstocks

# Pull latest changes
git pull origin main

# Install dependencies (jika ada yang baru)
npm install

# Build aplikasi
npm run build

# Restart aplikasi
pm2 restart sansstocks
# atau
sudo systemctl restart sansstocks
```

### 4. Verify Optimizations

```bash
# Test dengan curl untuk melihat headers
curl -I https://emitenhub.com

# Cek cache headers untuk static assets
curl -I https://emitenhub.com/_astro/client.js

# Cek gzip compression
curl -H "Accept-Encoding: gzip" -I https://emitenhub.com
```

## 🎯 Expected Improvements

Setelah implementasi, Anda seharusnya melihat:

1. **LCP Improvement**: 
   - Resource load delay berkurang dari 3,620ms
   - LCP image loading lebih cepat dengan `fetchpriority="high"`

2. **Render Blocking Reduction**:
   - Font loading tidak blocking render
   - CSS loading lebih optimal

3. **Cache Performance**:
   - Static assets cached 1 tahun
   - Images cached 7 hari dengan stale-while-revalidate

4. **Network Optimization**:
   - Preconnect mengurangi connection time
   - Gzip compression mengurangi transfer size

5. **Image Optimization**:
   - Responsive images mengurangi download size
   - WebP format lebih kecil dari PNG/JPG

## 📊 Monitoring

Setelah deploy, monitor dengan:

1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **Lighthouse**: Chrome DevTools
3. **WebPageTest**: https://www.webpagetest.org/

## 🔧 Additional Optimizations (Optional)

### 1. CDN untuk Images
Pertimbangkan menggunakan CDN untuk images dari Supabase:
- Cloudflare Images
- ImageKit
- Cloudinary

### 2. Image Optimization Pipeline
Implementasi automatic image optimization saat upload:
- Resize images ke multiple sizes
- Convert ke WebP/AVIF
- Generate responsive srcset

### 3. Service Worker untuk Caching
Implementasi service worker untuk offline support dan better caching.

### 4. Critical CSS Inlining
Inline critical CSS untuk above-the-fold content.

## ⚠️ Catatan Penting

1. **Cache Invalidation**: Setelah update code, pastikan clear cache browser atau gunakan cache busting (Astro sudah handle ini dengan hash di filename)

2. **Image Sizes**: Pastikan images yang di-upload sudah di-optimize sebelum upload ke Supabase. Gunakan tools seperti:
   - ImageOptim
   - Squoosh
   - TinyPNG

3. **Monitoring**: Monitor performa secara berkala, terutama setelah update besar.

## 🐛 Troubleshooting

### Cache tidak bekerja
```bash
# Cek nginx config
sudo nginx -t

# Cek apakah location block benar
sudo grep -A 5 "location ~" /etc/nginx/sites-available/sansstocks
```

### Gzip tidak aktif
```bash
# Cek apakah gzip module enabled
nginx -V 2>&1 | grep -o with-http_gzip_static_module

# Test gzip
curl -H "Accept-Encoding: gzip" -I https://emitenhub.com | grep -i content-encoding
```

### Images masih besar
- Pastikan images sudah di-compress sebelum upload
- Pertimbangkan menggunakan image optimization service
- Check apakah WebP format sudah digunakan (Astro Image component sudah handle ini)

