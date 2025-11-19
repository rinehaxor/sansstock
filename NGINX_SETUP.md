# Setup Nginx Performance Configuration

## 📋 Langkah Setup

### 1. Backup Nginx Config (Penting!)

```bash
# Backup config yang ada
sudo cp /etc/nginx/sites-available/emitenhub /etc/nginx/sites-available/emitenhub.backup
# atau jika nama file berbeda, cek dulu:
# ls /etc/nginx/sites-available/
```

### 2. Edit Nginx Config

```bash
# Edit nginx config (sesuaikan nama file dengan yang ada di server)
sudo nano /etc/nginx/sites-available/emitenhub
# atau
sudo nano /etc/nginx/sites-available/sansstocks
```

### 3. Tambahkan Konfigurasi Performance

Tambahkan konfigurasi berikut ke dalam `server` block (setelah `server_name` dan sebelum `location /`):

```nginx
server {
    listen 80;
    server_name emitenhub.com www.emitenhub.com;

    # ... existing config ...

    # ============================================
    # PERFORMANCE OPTIMIZATION
    # ============================================

    # Cache headers untuk static assets (CSS, JS, fonts, images)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
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

    # ============================================
    # END PERFORMANCE OPTIMIZATION
    # ============================================

    # API routes - Jangan di-cache (penting untuk dynamic content)
    location /api/ {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        # Jangan cache API responses
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
        expires 0;
    }

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

### 4. Test Nginx Configuration

```bash
# Test config untuk memastikan tidak ada error
sudo nginx -t
```

**Expected output:**

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5. Reload Nginx

```bash
# Jika test berhasil, reload nginx
sudo systemctl reload nginx
```

### 6. Verify Configuration

```bash
# Test dengan curl untuk melihat headers
curl -I https://emitenhub.com

# Cek cache headers untuk static assets
curl -I https://emitenhub.com/_astro/client.js | grep -i cache

# Cek gzip compression
curl -H "Accept-Encoding: gzip" -I https://emitenhub.com | grep -i content-encoding
```

**Expected results:**

-  Cache-Control header untuk static assets
-  Content-Encoding: gzip untuk text files

## 🎯 Expected Improvements

Setelah setup ini:

-  ✅ Static assets cached 1 tahun (tidak perlu download ulang)
-  ✅ Images cached 7 hari
-  ✅ Gzip compression mengurangi transfer size ~70%
-  ✅ Faster page load untuk repeat visitors

## 🐛 Troubleshooting

### Nginx test gagal

```bash
# Cek error detail
sudo nginx -t

# Cek syntax error
sudo nginx -T | grep -A 5 -B 5 error
```

### Cache tidak bekerja

```bash
# Cek apakah location block benar (sesuaikan nama file)
sudo grep -A 5 "location ~" /etc/nginx/sites-available/emitenhub
# atau
sudo grep -A 5 "location ~" /etc/nginx/sites-available/sansstocks

# Cek nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Gzip tidak aktif

```bash
# Cek apakah gzip module enabled
nginx -V 2>&1 | grep -o with-http_gzip_static_module

# Test gzip
curl -H "Accept-Encoding: gzip" -I https://emitenhub.com | grep -i content-encoding
```

## 📝 Notes

1. **Cache Invalidation**: Static assets akan di-cache 1 tahun. Astro sudah handle cache busting dengan hash di filename, jadi tidak perlu khawatir.

2. **Images Cache**: Images di-cache 7 hari dengan stale-while-revalidate, artinya browser bisa serve cached version sambil fetch update di background.

3. **Gzip Compression**: Mengurangi transfer size untuk text files (HTML, CSS, JS) sekitar 70%, sangat membantu untuk VPS dengan bandwidth terbatas.
