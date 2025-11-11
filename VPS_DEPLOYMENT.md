# Panduan Deployment ke VPS

## 1. Persiapan VPS

### Install Node.js dan npm
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Nginx (Reverse Proxy)
```bash
sudo apt install -y nginx
```

## 2. Setup Project di VPS

### Clone Repository
```bash
# Buat direktori untuk aplikasi
sudo mkdir -p /var/www/sansstocks
sudo chown $USER:$USER /var/www/sansstocks

# Clone repository
cd /var/www/sansstocks
git clone <repository-url> .

# Atau jika sudah ada, pull terbaru
git pull origin main
```

### Install Dependencies
```bash
cd /var/www/sansstocks/sansstocks
npm install
```

### Setup Environment Variables
```bash
# Buat file .env
nano .env
```

Isi dengan:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SITE_URL=https://yourdomain.com
```

## 3. Build dan Start Aplikasi

### Build Production
```bash
npm run build
```

### Start dengan PM2
```bash
# Start aplikasi
pm2 start npm --name "sansstocks" -- start

# Atau langsung start dengan entry point
pm2 start dist/server/entry.mjs --name "sansstocks"

# Simpan konfigurasi PM2
pm2 save

# Setup PM2 untuk auto-start saat reboot
pm2 startup
# Jalankan command yang dihasilkan
```

### Cek Status
```bash
pm2 status
pm2 logs sansstocks
```

## 4. Setup Nginx (Reverse Proxy)

### Buat Konfigurasi Nginx
```bash
sudo nano /etc/nginx/sites-available/sansstocks
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (setelah setup SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site
```bash
# Buat symlink
sudo ln -s /etc/nginx/sites-available/sansstocks /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 5. Setup SSL dengan Let's Encrypt (Opsional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal sudah di-setup otomatis
```

## 6. Update Port di Astro (Jika Perlu)

Default Astro menggunakan port 4321. Jika ingin menggunakan port lain, edit `package.json`:

```json
{
  "scripts": {
    "start": "node dist/server/entry.mjs --port 3000"
  }
}
```

Atau set environment variable:
```bash
export PORT=3000
```

## 7. Firewall Setup

```bash
# Allow HTTP dan HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## 8. Monitoring dan Maintenance

### PM2 Commands
```bash
# Restart aplikasi
pm2 restart sansstocks

# Stop aplikasi
pm2 stop sansstocks

# View logs
pm2 logs sansstocks

# Monitor resources
pm2 monit
```

### Update Deployment
```bash
cd /var/www/sansstocks/sansstocks
git pull origin main
npm install
npm run build
pm2 restart sansstocks
```

## 9. Troubleshooting

### Cek Logs
```bash
# PM2 logs
pm2 logs sansstocks

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -f
```

### Cek Port
```bash
# Cek apakah aplikasi berjalan di port 4321
sudo netstat -tlnp | grep 4321

# Atau
sudo ss -tlnp | grep 4321
```

### Restart Services
```bash
# Restart PM2
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

## Catatan Penting

1. **Port**: Pastikan port yang digunakan (default 4321) tidak conflict dengan aplikasi lain
2. **Environment Variables**: Pastikan semua environment variables sudah di-set dengan benar
3. **Domain**: Update `SITE_URL` di `.env` dengan domain yang benar
4. **Firewall**: Pastikan firewall sudah dikonfigurasi dengan benar
5. **SSL**: Setup SSL untuk production (Let's Encrypt gratis)

