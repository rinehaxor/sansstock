# Cara Test Performa Website

## 🚀 Quick Test (Command Line)

### 1. Test dengan curl (Terminal/SSH)

```bash
# Test response time
curl -w "\nTime to First Byte: %{time_starttransfer}s\nTotal Time: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

# Test dengan detail lebih lengkap
curl -w "\n\n=== Performance Metrics ===\nTime to First Byte (TTFB): %{time_starttransfer}s\nTotal Time: %{time_total}s\nDNS Lookup: %{time_namelookup}s\nConnect Time: %{time_connect}s\nStart Transfer: %{time_starttransfer}s\nSize: %{size_download} bytes\nSpeed: %{speed_download} bytes/s\n" -o /dev/null -s https://emitenhub.com

# Test multiple requests (simulasi cache)
echo "=== Request 1 (Cold Start) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

echo "=== Request 2 (Should be faster with cache) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

echo "=== Request 3 (Should be even faster) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com
```

### 2. Test dari VPS (Localhost)

```bash
# Test langsung ke Node.js app (bypass nginx)
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s http://localhost:4321

# Test melalui nginx
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s http://localhost
```

### 3. Test Multiple Endpoints

```bash
# Test home page
echo "=== Home Page ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

# Test category page
echo "=== Category Page ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com/categories/ekonomi

# Test article page
echo "=== Article Page ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com/artikel
```

## 🌐 Browser-Based Testing

### 1. Chrome DevTools (Recommended)

**Langkah-langkah:**

1. **Buka Website**:
   - Buka Chrome
   - Tekan `F12` atau `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - Buka tab **Network**

2. **Test Cold Start**:
   - Klik **Clear** (icon clear di Network tab)
   - Refresh halaman dengan `Ctrl+Shift+R` (hard refresh)
   - Lihat **Load time** di bawah
   - Cek **Time** column untuk setiap request

3. **Test dengan Cache**:
   - Refresh lagi dengan `F5` (normal refresh)
   - Bandingkan waktu loading

4. **Test Navigation**:
   - Klik link ke kategori
   - Lihat waktu loading
   - Klik kembali ke home
   - Lihat waktu loading (seharusnya lebih cepat karena cache)

**Metrics yang penting:**
- **DOMContentLoaded**: Waktu HTML selesai di-parse
- **Load**: Waktu semua resources selesai load
- **Time to First Byte (TTFB)**: Waktu server mulai response

### 2. Lighthouse (Chrome DevTools)

**Langkah-langkah:**

1. Buka Chrome DevTools (`F12`)
2. Buka tab **Lighthouse**
3. Pilih:
   - ✅ Performance
   - ✅ Best Practices
   - ✅ SEO
4. Pilih device: **Desktop** atau **Mobile**
5. Klik **Analyze page load**

**Metrics yang diukur:**
- **Performance Score**: 0-100
- **First Contentful Paint (FCP)**: Waktu konten pertama muncul
- **Largest Contentful Paint (LCP)**: Waktu elemen terbesar muncul
- **Time to Interactive (TTI)**: Waktu halaman bisa di-interact
- **Total Blocking Time (TBT)**: Waktu JavaScript blocking
- **Cumulative Layout Shift (CLS)**: Stabilitas layout

### 3. PageSpeed Insights (Online)

**Langkah-langkah:**

1. Buka: https://pagespeed.web.dev/
2. Masukkan URL: `https://emitenhub.com`
3. Klik **Analyze**
4. Tunggu hasil (sekitar 30 detik)

**Keuntungan:**
- Test dari Google servers
- Simulasi real user conditions
- Mobile & Desktop scores
- Detailed recommendations

## 📊 Advanced Testing Tools

### 1. WebPageTest (Online)

**Langkah-langkah:**

1. Buka: https://www.webpagetest.org/
2. Masukkan URL: `https://emitenhub.com`
3. Pilih test location (misal: Jakarta, Indonesia)
4. Pilih browser (Chrome, Firefox, etc)
5. Klik **Start Test**

**Fitur:**
- Waterfall chart (visualisasi loading)
- Filmstrip (screenshot setiap detik)
- Multiple runs untuk consistency
- Video recording

### 2. GTmetrix (Online)

**Langkah-langkah:**

1. Buka: https://gtmetrix.com/
2. Masukkan URL: `https://emitenhub.com`
3. Klik **Test your site**

**Fitur:**
- Performance scores
- PageSpeed & YSlow scores
- Detailed recommendations
- Historical tracking (dengan account)

### 3. Apache Bench (ab) - Command Line

```bash
# Install (jika belum ada)
sudo apt install apache2-utils  # Ubuntu/Debian
# atau
brew install httpd  # macOS

# Test dengan 10 requests, 2 concurrent
ab -n 10 -c 2 https://emitenhub.com/

# Test dengan lebih banyak requests
ab -n 100 -c 10 https://emitenhub.com/
```

**Output yang penting:**
- **Requests per second**: Berapa request per detik
- **Time per request**: Rata-rata waktu per request
- **Failed requests**: Jumlah request yang gagal

## 🔍 Test Specific Scenarios

### 1. Test Cold Start

```bash
# Di VPS, restart aplikasi dulu
pm2 restart sansstocks

# Tunggu 30 detik, lalu test
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com
```

### 2. Test Cache Effectiveness

```bash
# Request pertama (cold)
echo "=== Request 1 (Cold) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

# Request kedua (should use cache)
echo "=== Request 2 (Cached) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

# Request ketiga (should be even faster)
echo "=== Request 3 (Cached) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com
```

### 3. Test Navigation (Home → Category → Home)

**Di Browser:**

1. Buka Chrome DevTools → Network tab
2. Clear cache dan hard refresh home page
3. Catat waktu loading
4. Klik link ke kategori
5. Catat waktu loading
6. Klik kembali ke home
7. Catat waktu loading (seharusnya lebih cepat)

**Atau dengan curl:**

```bash
# Simulasi user journey
echo "=== 1. Home Page ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com

echo "=== 2. Category Page ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com/categories/ekonomi

echo "=== 3. Back to Home (Should be faster) ==="
curl -w "\nTTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://emitenhub.com
```

## 📈 Monitoring Real-Time

### 1. PM2 Monitoring

```bash
# Monitor resources real-time
pm2 monit

# Lihat logs
pm2 logs sansstocks --lines 50

# Lihat metrics
pm2 describe sansstocks
```

### 2. Nginx Access Logs

```bash
# Monitor requests real-time
sudo tail -f /var/log/nginx/access.log

# Monitor dengan format yang lebih readable
sudo tail -f /var/log/nginx/access.log | awk '{print $1, $4, $7, $9, $10}'
```

### 3. Server Resources

```bash
# Monitor CPU & Memory
htop
# atau
top

# Monitor network
iftop
# atau
nethogs
```

## 🎯 Target Performance

### Good Performance:
- **TTFB**: < 200ms
- **FCP**: < 1.8s
- **LCP**: < 2.5s
- **TTI**: < 3.8s
- **Lighthouse Score**: > 90

### Acceptable Performance:
- **TTFB**: < 500ms
- **FCP**: < 3s
- **LCP**: < 4s
- **TTI**: < 5s
- **Lighthouse Score**: > 70

## 🐛 Troubleshooting Slow Performance

### Jika TTFB tinggi (> 1s):

1. **Cek Database Connection**:
   ```bash
   # Test database response time
   # (perlu akses ke Supabase dashboard)
   ```

2. **Cek Server Resources**:
   ```bash
   # Cek CPU usage
   top

   # Cek Memory
   free -h

   # Cek Disk I/O
   iostat -x 1
   ```

3. **Cek Network Latency**:
   ```bash
   # Test ping ke database
   ping your-supabase-url.supabase.co
   ```

### Jika Load Time tinggi:

1. **Cek External APIs**:
   - Market data dari Yahoo Finance
   - Widget dari pintu.co.id

2. **Cek Image Sizes**:
   - Buka Network tab di DevTools
   - Filter by "Img"
   - Lihat size dan load time

3. **Cek JavaScript Bundle**:
   - Buka Network tab
   - Filter by "JS"
   - Lihat total size dan load time

## 📝 Test Script (Bash)

Buat file `test-performance.sh`:

```bash
#!/bin/bash

URL="https://emitenhub.com"

echo "=== Performance Test for $URL ==="
echo ""

echo "1. Cold Start Test:"
curl -w "\n   TTFB: %{time_starttransfer}s\n   Total: %{time_total}s\n" -o /dev/null -s "$URL"

sleep 2

echo ""
echo "2. Cached Request Test:"
curl -w "\n   TTFB: %{time_starttransfer}s\n   Total: %{time_total}s\n" -o /dev/null -s "$URL"

sleep 2

echo ""
echo "3. Category Page Test:"
curl -w "\n   TTFB: %{time_starttransfer}s\n   Total: %{time_total}s\n" -o /dev/null -s "$URL/categories/ekonomi"

echo ""
echo "=== Test Complete ==="
```

**Jalankan:**
```bash
chmod +x test-performance.sh
./test-performance.sh
```

## 💡 Tips

1. **Test dari berbagai lokasi**: Gunakan VPN atau test dari VPS
2. **Test di waktu berbeda**: Peak hours vs off-peak
3. **Test dengan cache disabled**: Untuk melihat worst case
4. **Test dengan cache enabled**: Untuk melihat best case
5. **Monitor secara berkala**: Set up monitoring untuk track trends

