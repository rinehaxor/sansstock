# Fix CategoryTabs Tidak Menampilkan Artikel di Production

## 🔍 Masalah

CategoryTabs menampilkan artikel di localhost tapi tidak di production (VPS).

## 🛠️ Langkah Debug

### 1. Cek Browser Console

Buka website di production dan cek console browser (F12):
- Akan ada log: `CategoryTabs: Fetching articles from: /api/articles?category_id=X&status=published&limit=4`
- Akan ada log: `CategoryTabs: Response status: 200 OK` (atau error)
- Akan ada log: `CategoryTabs: API response: {...}`

### 2. Test API Endpoint Langsung

```bash
# Test API endpoint di production
curl "https://emitenhub.com/api/articles?category_id=1&status=published&limit=4"

# Expected response:
# {"data": [...], "total": X, "page": 1, "limit": 4, "totalPages": X}
```

### 3. Cek Server Logs

```bash
# Cek error logs
pm2 logs astro --err

# Cek semua logs
pm2 logs astro | grep -i "api/articles"

# Monitor real-time
pm2 logs astro --lines 100
```

### 4. Cek Nginx Config

Pastikan API routes tidak di-cache (sudah ditambahkan di NGINX_SETUP.md):

```bash
# Cek apakah location /api/ ada
sudo grep -A 10 "location /api" /etc/nginx/sites-available/emitenhub
```

## ✅ Perbaikan yang Sudah Diterapkan

1. **Enhanced Error Handling**: Component sekarang menampilkan error message jika API gagal
2. **Better Logging**: Console logs untuk debugging
3. **Response Format Handling**: Support multiple response formats
4. **API Validation**: Validasi category_id di API endpoint

## 🚀 Deploy Perbaikan

```bash
cd ~/sansstock
git pull
npm run build
pm2 restart astro
```

## 📋 Checklist Troubleshooting

- [ ] Cek browser console untuk error
- [ ] Test API endpoint dengan curl
- [ ] Cek server logs untuk error
- [ ] Pastikan nginx config sudah benar (location /api/)
- [ ] Pastikan ada published articles dengan category_id
- [ ] Cek apakah categories ter-fetch dengan benar

## 🐛 Common Issues

### Issue 1: API 404
**Symptom:** Console error "Failed to fetch articles: 404"

**Fix:** Pastikan nginx config memiliki `location /api/` block

### Issue 2: API 500
**Symptom:** Console error "Failed to fetch articles: 500"

**Fix:** Cek server logs untuk database error atau Supabase connection issue

### Issue 3: Empty Data
**Symptom:** API return 200 tapi `data: []`

**Fix:** 
- Pastikan ada published articles dengan category_id yang sesuai
- Cek database untuk memastikan data ada

### Issue 4: CORS Error
**Symptom:** Console error tentang CORS

**Fix:** Pastikan nginx proxy pass benar ke localhost:4321

