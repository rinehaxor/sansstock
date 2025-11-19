# Debug Underwriters Tidak Muncul di Production

## 🔍 Masalah

Data underwriter muncul di localhost tapi tidak muncul di production (VPS).

## 🛠️ Langkah Debug

### 1. Cek Server Logs

```bash
# Cek error logs
pm2 logs astro --err

# Cek semua logs dengan filter
pm2 logs astro | grep -i "underwriter"

# Monitor real-time
pm2 logs astro --lines 100
```

**Expected logs setelah perbaikan:**
- `Fetched X underwriters from database`
- `After filtering, X underwriters have IPOs`
- `Final underwritersWithStats: {...}`

### 2. Cek Browser Console

Buka website di production dan cek console browser (F12):
- Akan ada log: `UnderwriterPerformance: Loaded X underwriters`
- Jika error: `UnderwriterPerformance: Error parsing underwriters JSON`

### 3. Test Database Query Langsung

```bash
# Test query di VPS (jika punya akses database)
# Atau cek di Supabase dashboard
```

### 4. Cek Data di Database

Pastikan:
- Ada data di table `underwriters`
- Ada data di table `ipo_underwriters` yang menghubungkan underwriter dengan IPO
- Ada data di table `ipo_listings` yang terkait

**Query untuk test:**
```sql
-- Cek total underwriters
SELECT COUNT(*) FROM underwriters;

-- Cek underwriters dengan IPO
SELECT u.id, u.name, COUNT(iu.ipo_listing_id) as total_ipos
FROM underwriters u
LEFT JOIN ipo_underwriters iu ON u.id = iu.underwriter_id
GROUP BY u.id, u.name
HAVING COUNT(iu.ipo_listing_id) > 0
ORDER BY total_ipos DESC;
```

### 5. Cek Supabase Connection

Pastikan environment variables di production sudah benar:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

```bash
# Cek env vars
pm2 env astro | grep SUPABASE
```

## ✅ Perbaikan yang Sudah Diterapkan

1. **Enhanced Error Handling**: 
   - Log error jika query gagal
   - Log jumlah data yang di-fetch
   - Log data setelah filtering

2. **Better Component Error Handling**:
   - Parse error handling di React component
   - Error message ditampilkan di UI
   - Console logging untuk debugging

3. **Data Validation**:
   - Validasi data sebelum parsing
   - Check jika data adalah array
   - Handle null/undefined data

## 🚀 Deploy Perbaikan

```bash
cd ~/sansstock
git pull
npm run build
pm2 restart astro
```

## 📋 Checklist Troubleshooting

- [ ] Cek server logs untuk error
- [ ] Cek browser console untuk error
- [ ] Pastikan ada data di database
- [ ] Pastikan Supabase connection berfungsi
- [ ] Pastikan environment variables benar
- [ ] Cek apakah filter `.filter((u: any) => u.total_ipos > 0)` menghapus semua data

## 🐛 Common Issues

### Issue 1: Query Error
**Symptom:** Server logs menunjukkan error dari Supabase

**Fix:** 
- Cek Supabase connection
- Cek RLS (Row Level Security) policies
- Cek apakah query syntax benar

### Issue 2: Data Kosong
**Symptom:** Query berhasil tapi data kosong

**Fix:**
- Cek apakah ada data di database
- Cek apakah filter terlalu ketat (`.filter((u: any) => u.total_ipos > 0)`)
- Cek apakah join query benar

### Issue 3: JSON Parse Error
**Symptom:** Browser console menunjukkan parse error

**Fix:**
- Cek apakah data yang dikirim ke component valid JSON
- Cek apakah data terlalu besar (JSON string limit)
- Cek apakah ada circular reference

### Issue 4: Component Tidak Render
**Symptom:** Component tidak muncul sama sekali

**Fix:**
- Cek apakah `client:load` directive benar
- Cek apakah React component ter-bundle dengan benar
- Cek browser console untuk JavaScript errors

## 📝 Expected Behavior

Setelah fix:
- Server logs akan menampilkan jumlah underwriters yang di-fetch
- Browser console akan menampilkan jumlah underwriters yang di-load
- Jika ada error, akan ditampilkan di UI dan console
- Data akan muncul jika ada underwriters dengan IPO

