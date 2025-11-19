# Debug CategoryTabs yang Hilang

## 🔍 Kemungkinan Penyebab

### 1. Categories Kosong
Jika `availableCategories.length === 0`, component akan return `null` dan tidak render apapun.

**Cek:**
```bash
# Cek logs untuk melihat apakah categories ter-fetch
pm2 logs astro | grep -i category

# Test API endpoint
curl https://emitenhub.com/api/warmup
```

### 2. JavaScript Error
Error di console browser bisa mencegah component render.

**Cek:**
1. Buka browser DevTools (F12)
2. Cek tab Console untuk error
3. Cek tab Network untuk failed requests

### 3. Nginx Caching Issue
Nginx mungkin cache HTML yang lama atau memblokir API request.

**Fix:**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/emitenhub

# Pastikan API routes tidak di-cache
location /api/ {
    proxy_pass http://localhost:4321;
    proxy_cache_bypass $http_upgrade;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Build Issue
Component mungkin tidak ter-bundle dengan benar.

**Fix:**
```bash
cd ~/sansstock
rm -rf dist .astro node_modules/.vite
npm run build
pm2 restart astro
```

## 🛠️ Langkah Debug

### Step 1: Cek Categories di Server

```bash
# Cek apakah categories ada di database
# Login ke Supabase dashboard atau query langsung

# Atau test via API
curl "https://emitenhub.com/api/articles?status=published&limit=1"
```

### Step 2: Cek Browser Console

1. Buka website di browser
2. Tekan F12 untuk DevTools
3. Cek Console tab untuk error
4. Cek Network tab untuk failed requests ke `/api/articles`

### Step 3: Cek Server Logs

```bash
# Cek error logs
pm2 logs astro --err

# Cek semua logs
pm2 logs astro

# Monitor real-time
pm2 logs astro --lines 100
```

### Step 4: Test API Endpoint

```bash
# Test API endpoint untuk articles
curl "https://emitenhub.com/api/articles?category_id=1&status=published&limit=4"

# Expected response:
# {"data": [...], "total": X, "page": 1, "limit": 4, "totalPages": X}
```

### Step 5: Cek Nginx Config

```bash
# Pastikan API routes tidak di-cache
sudo grep -A 10 "location /api" /etc/nginx/sites-available/emitenhub

# Jika tidak ada, tambahkan (lihat fix di atas)
```

## ✅ Quick Fix

### Fix 1: Pastikan API Routes Tidak Di-cache

Tambahkan ke nginx config:

```nginx
# Jangan cache API routes
location /api/ {
    proxy_pass http://localhost:4321;
    proxy_cache_bypass $http_upgrade;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Fix 2: Rebuild dengan Clean

```bash
cd ~/sansstock
rm -rf dist .astro
npm run build
pm2 restart astro
```

### Fix 3: Clear Browser Cache

1. Hard refresh: Ctrl+Shift+R (Windows/Linux) atau Cmd+Shift+R (Mac)
2. Atau clear cache di browser settings

## 📝 Expected Behavior

Setelah fix:
- CategoryTabs akan muncul jika ada categories
- Console akan log "CategoryTabs: Categories loaded X"
- Jika error, akan muncul error message di UI
- API requests akan berhasil (cek Network tab)

## 🐛 Common Issues

### Issue 1: Categories Kosong
**Symptom:** Component tidak render, console log "No categories available"

**Fix:** Pastikan ada published articles dengan category_id

### Issue 2: API 404
**Symptom:** Network tab menunjukkan 404 untuk `/api/articles`

**Fix:** Pastikan build sudah benar dan API routes ter-deploy

### Issue 3: CORS Error
**Symptom:** Console error tentang CORS

**Fix:** Pastikan nginx proxy pass benar ke localhost:4321

### Issue 4: JavaScript Error
**Symptom:** Console error saat component load

**Fix:** Cek error message dan fix sesuai error

