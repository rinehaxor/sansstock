# Quick Start Guide - Commands yang Sering Digunakan

## 🔄 Restart Aplikasi

```bash
# Restart aplikasi (nama process: astro)
pm2 restart astro

# Atau jika menggunakan ecosystem config
pm2 restart ecosystem.config.cjs
```

## 📊 Monitor Aplikasi

```bash
# Lihat status aplikasi
pm2 list

# Lihat logs real-time
pm2 logs astro

# Lihat logs dengan limit baris
pm2 logs astro --lines 50

# Monitor resources (CPU, Memory)
pm2 monit
```

## 🏗️ Build & Deploy

```bash
# Masuk ke direktori project
cd /var/www/sansstocks/sansstocks
# atau
cd ~/sansstock

# Pull latest changes
git pull origin main

# Install dependencies (jika ada yang baru)
npm install

# Build aplikasi
npm run build

# Restart aplikasi
pm2 restart astro
```

## 🔍 Troubleshooting

```bash
# Cek error logs
pm2 logs astro --err

# Cek semua logs
pm2 logs astro

# Restart dengan clear logs
pm2 restart astro --update-env

# Stop aplikasi
pm2 stop astro

# Start aplikasi
pm2 start astro

# Delete aplikasi dari PM2
pm2 delete astro
```

## 🌐 Nginx Commands

```bash
# Test nginx config
sudo nginx -t

# Reload nginx (tanpa downtime)
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Cek status nginx
sudo systemctl status nginx

# Cek error logs nginx
sudo tail -f /var/log/nginx/error.log
```

## 🔥 Warmup Endpoint

```bash
# Test warmup endpoint
curl https://emitenhub.com/api/warmup

# Expected response:
# {"status":"ok","message":"Server warmed up","timestamp":"2024-..."}
```

## 📝 Notes

- **Nama PM2 Process**: `astro` (bukan `sansstocks`)
- **Port**: 4321 (default Astro)
- **Nginx Config**: `/etc/nginx/sites-available/emitenhub` atau `/etc/nginx/sites-available/sansstocks`

