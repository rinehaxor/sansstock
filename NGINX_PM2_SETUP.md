# Setup Nginx dengan PM2 untuk EmitenHub

## Overview

PM2 menjalankan Astro app di port 4321, dan Nginx berfungsi sebagai reverse proxy di port 80/443.

```
Internet → Nginx (Port 80/443) → PM2 (Port 4321) → Astro App
```

## Step-by-Step Setup

### 1. Pastikan PM2 Sudah Running

```bash
# Cek status PM2
pm2 status

# Jika belum running, start dengan:
cd /path/to/sansstocks
pm2 start ecosystem.config.cjs

# Atau jika sudah ada:
pm2 restart sansstocks

# Cek apakah app listening di port 4321
netstat -tulpn | grep 4321
# atau
ss -tulpn | grep 4321
```

### 2. Copy Nginx Config

```bash
# Copy config ke sites-available
sudo cp nginx-emitenhub.conf /etc/nginx/sites-available/emitenhub

# Atau jika sudah ada, edit langsung:
sudo nano /etc/nginx/sites-available/emitenhub
```

### 3. Enable Site

```bash
# Buat symlink ke sites-enabled
sudo ln -s /etc/nginx/sites-available/emitenhub /etc/nginx/sites-enabled/

# Atau jika sudah ada, skip step ini
```

### 4. Test Nginx Config

```bash
# Test konfigurasi nginx
sudo nginx -t

# Jika ada error, fix dulu sebelum reload
```

### 5. Reload Nginx

```bash
# Reload nginx (graceful restart)
sudo systemctl reload nginx

# Atau restart jika perlu:
sudo systemctl restart nginx
```

### 6. Verify Setup

```bash
# Cek nginx status
sudo systemctl status nginx

# Cek apakah nginx listening di port 80
sudo netstat -tulpn | grep :80

# Test dari browser atau curl
curl -I http://localhost
curl -I http://emitenhub.com
```

## Verifikasi Cache Headers

Setelah setup, verify cache headers untuk `/_image` endpoint:

```bash
# Test cache headers
curl -I http://emitenhub.com/_image?href=https://...

# Should see:
# Cache-Control: public, max-age=31536000, immutable
# Expires: (1 year from now)
```

## PM2 Commands Reference

```bash
# Start app
pm2 start ecosystem.config.cjs

# Stop app
pm2 stop sansstocks

# Restart app
pm2 restart sansstocks

# Reload app (zero downtime)
pm2 reload sansstocks

# View logs
pm2 logs sansstocks

# Monitor
pm2 monit

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

## Troubleshooting

### PM2 App Tidak Running

```bash
# Cek logs
pm2 logs sansstocks --lines 50

# Cek apakah port 4321 sudah digunakan
sudo lsof -i :4321

# Restart PM2
pm2 restart sansstocks
```

### Nginx 502 Bad Gateway

Ini berarti nginx tidak bisa connect ke PM2 app:

```bash
# 1. Pastikan PM2 running
pm2 status

# 2. Pastikan app listening di port 4321
netstat -tulpn | grep 4321

# 3. Test connection dari nginx server
curl http://localhost:4321

# 4. Cek firewall
sudo ufw status
# Pastikan port 4321 tidak di-block (tidak perlu expose ke public, hanya localhost)
```

### Cache Headers Tidak Muncul

```bash
# 1. Pastikan middleware.ts sudah di-deploy
# 2. Cek nginx config sudah include cache headers
# 3. Test langsung ke PM2 (bypass nginx)
curl -I http://localhost:4321/_image?href=...

# 4. Test melalui nginx
curl -I http://emitenhub.com/_image?href=...
```

## Update Nginx Config Setelah Deploy

Jika update nginx config:

```bash
# 1. Edit config
sudo nano /etc/nginx/sites-available/emitenhub

# 2. Test config
sudo nginx -t

# 3. Reload (tidak perlu restart PM2)
sudo systemctl reload nginx
```

## Production Checklist

-  [ ] PM2 app running di port 4321
-  [ ] Nginx config sudah di-copy ke `/etc/nginx/sites-available/emitenhub`
-  [ ] Site sudah di-enable di `/etc/nginx/sites-enabled/`
-  [ ] Nginx config test passed (`sudo nginx -t`)
-  [ ] Nginx reloaded (`sudo systemctl reload nginx`)
-  [ ] PM2 setup untuk auto-start on boot (`pm2 startup && pm2 save`)
-  [ ] Cache headers verified untuk `/_image` endpoint
-  [ ] SSL certificate setup (jika menggunakan HTTPS)

## Quick Reference

```bash
# Full setup command (run dari project root)
sudo cp nginx-emitenhub.conf /etc/nginx/sites-available/emitenhub
sudo ln -sf /etc/nginx/sites-available/emitenhub /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Verify
curl -I http://localhost/_image?href=test
```
