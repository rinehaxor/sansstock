# Fix Render Blocking & Cache Issues

## Masalah yang Diperbaiki

### 1. Render Blocking CSS (Est savings: 330ms)
- **Masalah**: CSS vendor file `/_astro/vendor.DnERqSke.css` blocking render
- **Solusi**: 
  - Defer non-critical CSS (vendor/chunk files) menggunakan `media="print"` trick
  - CSS akan di-load async tanpa blocking render
  - Fallback dengan `<noscript>` untuk browser tanpa JavaScript

### 2. Cache Lifetimes (Est savings: 361 KiB)
- **Masalah**: Beberapa resources memiliki cache TTL pendek
- **Solusi**:
  - Nginx config sudah di-update untuk cache CSS/JS selama 1 tahun
  - External resources (Facebook, Google Analytics, dll) akan di-cache oleh browser sesuai header mereka

## Implementasi

### 1. Update Layout.astro
✅ Sudah ditambahkan:
- DNS prefetch untuk external domains (Facebook, Google Analytics, Hotjar, Cloudflare)
- Script untuk defer vendor CSS files
- MutationObserver untuk catch CSS yang di-inject oleh Astro

### 2. Update Nginx Config
✅ Sudah ditambahkan:
- Cache 1 tahun untuk CSS/JS files dengan `immutable` flag
- Preload header untuk CSS files

### 3. Deploy Steps

```bash
# 1. Rebuild aplikasi
npm run build

# 2. Restart PM2
pm2 restart astro

# 3. Update Nginx config (jika belum)
sudo nano /etc/nginx/sites-available/emitenhub
# Copy config dari NGINX_SETUP.md

# 4. Test Nginx config
sudo nginx -t

# 5. Reload Nginx
sudo systemctl reload nginx
```

## Expected Results

### Before:
- Render blocking CSS: 330ms delay
- Cache issues: 361 KiB not cached properly

### After:
- CSS loaded async (non-blocking)
- All static assets cached for 1 year
- Better LCP and FCP scores

## Testing

1. Test di PageSpeed Insights:
   - Render blocking requests should be reduced
   - Cache lifetimes should show better TTL

2. Test di browser DevTools:
   - Network tab: CSS files should load async
   - Check cache headers: `Cache-Control: public, max-age=31536000, immutable`

3. Verify:
   - Website masih berfungsi normal
   - Styling tidak broken
   - No console errors

