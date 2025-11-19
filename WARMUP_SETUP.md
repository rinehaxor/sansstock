# Setup Warmup untuk Mencegah Cold Start

## 🎯 Tujuan

Mencegah cold start dengan keep server dan database connection warm.

## 📋 Langkah Setup

### 1. Rebuild Aplikasi

```bash
cd /var/www/sansstocks/sansstocks
npm run build
pm2 restart astro
```

### 2. Test Warmup Endpoint

```bash
# Test endpoint
curl https://emitenhub.com/api/warmup

# Expected response:
# {"status":"ok","message":"Server warmed up","timestamp":"2024-..."}
```

### 3. Setup Cron Job untuk Auto Warmup

```bash
# Edit crontab
crontab -e

# Add warmup job (setiap 5 menit)
*/5 * * * * curl -s https://emitenhub.com/api/warmup > /dev/null 2>&1

# Save dan exit
```

### 4. Verify Cron Job

```bash
# Check crontab
crontab -l

# Check cron logs (jika ada)
tail -f /var/log/cron
```

## 🔧 Alternative: PM2 Cron

Jika cron tidak tersedia, bisa gunakan PM2 cron:

```bash
# Install PM2 cron module
pm2 install pm2-cron

# Setup warmup job
pm2 set pm2-cron:warmup "*/5 * * * * curl -s https://emitenhub.com/api/warmup"
```

## 📊 Expected Results

### Before:

-  **Cold Start**: 2-3 detik saat pertama kali akses
-  **TTFB**: 2-3 detik

### After:

-  **Cold Start**: Minimal (server selalu warm)
-  **TTFB**: < 500ms

## ⚠️ Catatan

1. **Warmup interval**: 5 menit sudah cukup untuk keep server warm
2. **Resource usage**: Minimal, hanya simple query
3. **Database**: Connection pool akan tetap active

## 🐛 Troubleshooting

### Cron tidak jalan

```bash
# Check cron service
sudo systemctl status cron

# Start cron jika tidak running
sudo systemctl start cron
```

### Warmup endpoint error

```bash
# Check logs
pm2 logs astro

# Test endpoint manually
curl -v https://emitenhub.com/api/warmup
```

## 📝 Summary

**Setup:**

1. ✅ Warmup endpoint sudah dibuat (`/api/warmup`)
2. ⚠️ Setup cron job untuk auto warmup setiap 5 menit
3. ⚠️ Monitor TTFB setelah setup

**Benefits:**

-  Server selalu warm
-  Database connection pool active
-  Faster TTFB untuk users
-  Better user experience
