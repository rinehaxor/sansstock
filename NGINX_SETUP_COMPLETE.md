# Setup Nginx Configuration Lengkap

## 🔍 Masalah

File `/etc/nginx/sites-available/emitenhub` kosong atau belum ada.

## ✅ Solusi

### 1. Cek File Nginx yang Ada

```bash
# Cek apakah ada file config lain
ls -la /etc/nginx/sites-available/

# Cek file yang sudah enabled
ls -la /etc/nginx/sites-enabled/

# Cek isi file default
sudo cat /etc/nginx/sites-available/default
```

### 2. Edit File Default

```bash
# Edit file default yang sudah ada
sudo nano /etc/nginx/sites-available/default
```

**Penting**: Backup dulu sebelum edit:

```bash
# Backup file default
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
```

Kemudian copy-paste konfigurasi lengkap dari file `nginx-emitenhub.conf` yang sudah saya buat, atau gunakan konfigurasi di bawah.

### 3. Sesuaikan Domain

Edit file dan sesuaikan `server_name` jika domain berbeda:

```nginx
server_name emitenhub.com www.emitenhub.com;
```

Jika domain berbeda, ganti dengan domain Anda.

### 4. Enable Site (jika belum enabled)

```bash
# Cek apakah default sudah enabled
ls -la /etc/nginx/sites-enabled/ | grep default

# Jika belum ada symlink, buat:
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Jika sudah ada, skip langkah ini
```

### 5. Test Konfigurasi

```bash
# Test nginx config
sudo nginx -t
```

**Expected output:**

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6. Reload Nginx

```bash
# Jika test berhasil, reload nginx
sudo systemctl reload nginx

# Atau restart jika perlu
sudo systemctl restart nginx
```

### 7. Cek Status

```bash
# Cek apakah nginx running
sudo systemctl status nginx

# Cek apakah site sudah enabled
ls -la /etc/nginx/sites-enabled/ | grep emitenhub
```

## 🔧 Troubleshooting

### Error: "nginx: [emerg] bind() to 0.0.0.0:80 failed"

**Penyebab**: Port 80 sudah digunakan oleh service lain.

**Solusi**:

```bash
# Cek apa yang menggunakan port 80
sudo lsof -i :80

# Atau
sudo netstat -tulpn | grep :80

# Jika ada service lain, stop atau ubah port
```

### Error: "nginx: [emerg] host not found in upstream"

**Penyebab**: Node.js app belum running di port 4321.

**Solusi**:

```bash
# Cek apakah PM2 app running
pm2 list

# Jika tidak running, start app
pm2 start npm --name astro -- start
# atau
pm2 restart astro
```

### Error: "nginx: [emerg] duplicate server name"

**Penyebab**: Ada konfigurasi lain dengan `server_name` yang sama.

**Solusi**:

```bash
# Cek semua config files
sudo grep -r "server_name" /etc/nginx/sites-available/

# Disable atau hapus duplicate config
sudo rm /etc/nginx/sites-enabled/duplicate-config

# Atau edit file default untuk menghapus duplicate server block
sudo nano /etc/nginx/sites-available/default
```

### Nginx tidak reload

```bash
# Cek error logs
sudo tail -f /var/log/nginx/error.log

# Cek apakah nginx process running
ps aux | grep nginx

# Restart nginx jika perlu
sudo systemctl restart nginx
```

## 📝 Catatan Penting

1. **Port 4321**: Pastikan Astro app running di port 4321 (default Astro)

   -  Jika berbeda, ubah `proxy_pass http://localhost:4321;` di config

2. **SSL/HTTPS**: Config ini untuk HTTP (port 80)

   -  Untuk HTTPS, perlu setup SSL dengan Let's Encrypt atau provider lain
   -  Setelah SSL setup, uncomment redirect HTTP ke HTTPS

3. **Domain**: Pastikan `server_name` sesuai dengan domain yang digunakan

4. **PM2**: Pastikan aplikasi Astro sudah running dengan PM2:
   ```bash
   pm2 list
   pm2 logs astro
   ```

## ✅ Verifikasi Setup

Setelah setup, test dengan:

```bash
# Test dari server
curl -I http://localhost

# Test dari browser
# Buka http://emitenhub.com (atau IP server)

# Cek cache headers
curl -I http://emitenhub.com/_astro/client.js | grep -i cache

# Cek gzip
curl -H "Accept-Encoding: gzip" -I http://emitenhub.com | grep -i content-encoding
```

## 🚀 Next Steps

Setelah Nginx setup berhasil:

1. ✅ Setup SSL dengan Let's Encrypt (jika belum)
2. ✅ Test performance di PageSpeed Insights
3. ✅ Monitor logs: `sudo tail -f /var/log/nginx/access.log`
