# Cara Cek Status Aplikasi di VPS

## 1. Cek Apakah Aplikasi Node.js Berjalan

```bash
# Cek apakah ada process Node.js yang berjalan di port 4321
sudo netstat -tlnp | grep 4321
# atau
sudo ss -tlnp | grep 4321

# Cek semua process Node.js
ps aux | grep node
```

## 2. Jika Menggunakan PM2

```bash
# Cek status PM2
pm2 status

# Cek logs
pm2 logs sansstocks

# Jika tidak ada, start aplikasi
cd /var/www/sansstocks/sansstocks
pm2 start ecosystem.config.cjs
# atau
pm2 start dist/server/entry.mjs --name "sansstocks"

# Simpan konfigurasi
pm2 save
```

## 3. Jika TIDAK Menggunakan PM2 (Manual)

Jika Anda menjalankan aplikasi secara manual, pastikan aplikasi berjalan:

```bash
# Jalankan aplikasi (akan berjalan di foreground)
cd /var/www/sansstocks/sansstocks
node dist/server/entry.mjs

# Atau dengan nohup (background)
nohup node dist/server/entry.mjs > app.log 2>&1 &
```

**Tapi ini TIDAK RECOMMENDED untuk production** karena:

-  Aplikasi akan mati jika terminal ditutup
-  Tidak ada auto-restart jika crash
-  Sulit untuk monitoring

## 4. Alternatif: Systemd Service (Tanpa PM2)

Jika tidak ingin pakai PM2, bisa pakai systemd:

```bash
# Buat service file
sudo nano /etc/systemd/system/sansstocks.service
```

Isi dengan:

```ini
[Unit]
Description=SansStocks Node.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/sansstocks/sansstocks
Environment=NODE_ENV=production
Environment=PORT=4321
ExecStart=/usr/bin/node dist/server/entry.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Kemudian:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start sansstocks

# Enable auto-start on boot
sudo systemctl enable sansstocks

# Cek status
sudo systemctl status sansstocks

# Restart aplikasi
sudo systemctl restart sansstocks
```

## 5. Workflow Lengkap Setelah Update Code

```bash
# 1. Update code
cd /var/www/sansstocks/sansstocks
git pull origin main

# 2. Install dependencies (jika ada yang baru)
npm install

# 3. Build aplikasi
npm run build

# 4. Restart aplikasi (pilih salah satu):

# Jika pakai PM2:
pm2 restart sansstocks

# Jika pakai systemd:
sudo systemctl restart sansstocks

# Jika manual:
# Stop process lama, lalu start lagi

# 5. Reload nginx (jika ada perubahan config nginx)
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Troubleshooting

### Aplikasi tidak bisa diakses

```bash
# 1. Cek apakah aplikasi berjalan
pm2 status
# atau
sudo systemctl status sansstocks

# 2. Cek apakah port 4321 terbuka
sudo netstat -tlnp | grep 4321

# 3. Test aplikasi langsung (bypass nginx)
curl http://localhost:4321

# 4. Cek nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 5. Cek aplikasi logs
pm2 logs sansstocks
# atau
sudo journalctl -u sansstocks -f
```

### Aplikasi crash terus

```bash
# Cek logs untuk error
pm2 logs sansstocks --lines 100

# Cek environment variables
pm2 env 0  # 0 adalah ID aplikasi

# Test build lokal dulu
npm run build
npm run preview
```
