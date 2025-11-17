# Deployment Checklist

Daftar lengkap untuk deployment production SansStocks.

## ✅ Yang Sudah Ada

### 1. **Core Features**

-  ✅ Artikel dengan pagination
-  ✅ Kategori & Tags dengan detail pages
-  ✅ Search functionality
-  ✅ SEO lengkap (meta tags, structured data, sitemap, RSS)
-  ✅ IPO Underwriters dengan detail modal
-  ✅ View tracking untuk artikel
-  ✅ Responsive design

### 2. **Security**

-  ✅ Cookie security (sameSite: strict, httpOnly, secure)
-  ✅ CSRF protection
-  ✅ Input sanitization (DOMPurify)
-  ✅ Rate limiting di API
-  ✅ Error handling yang aman (tidak expose detail error di production)
-  ✅ Environment variables validation

### 3. **SEO**

-  ✅ Meta tags lengkap (Open Graph, Twitter Card)
-  ✅ Structured Data (JSON-LD) - Organization, WebSite, NewsArticle, CollectionPage, BreadcrumbList
-  ✅ Sitemap.xml
-  ✅ RSS Feed
-  ✅ Canonical URLs
-  ✅ Robots.txt

### 4. **Performance**

-  ✅ Image optimization (Astro Image component)
-  ✅ Lazy loading images
-  ✅ Preconnect/DNS-prefetch untuk external domains
-  ✅ Client-side pagination dengan smooth transitions

### 5. **Error Handling**

-  ✅ Error handling utilities
-  ✅ 404 page
-  ✅ 500 page
-  ✅ Health check endpoint (`/api/health`)

## ⚠️ Yang Perlu Dicek Sebelum Deploy

### 1. **Environment Variables**

Pastikan semua environment variables di-set di production:

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Optional (Recommended)
SITE_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PUBLIC_SITE_URL=https://yourdomain.com
```

**Cara cek:**

```bash
# Test di production
curl https://yourdomain.com/api/health
```

### 2. **Database Configuration**

-  ✅ Supabase RLS (Row Level Security) policies sudah dikonfigurasi
-  ✅ Database indexes sudah dibuat untuk performa
-  ✅ Foreign keys sudah di-set dengan benar

### 3. **Build & Production**

```bash
# Test build lokal dulu
npm run build

# Test preview
npm run preview

# Pastikan tidak ada error
npm run build 2>&1 | grep -i error
```

### 4. **Server Configuration**

Jika deploy di VPS/server:

-  ✅ Node.js version (minimal Node 18+)
-  ✅ PM2 atau process manager untuk keep-alive
-  ✅ Nginx/reverse proxy configuration
-  ✅ SSL certificate (Let's Encrypt)
-  ✅ Firewall rules (port 80, 443, SSH)

### 5. **Monitoring & Logging**

-  ⚠️ Setup monitoring (opsional tapi recommended):
   -  Application logs
   -  Error tracking (Sentry, dll)
   -  Uptime monitoring
   -  Performance monitoring

### 6. **Backup**

-  ⚠️ Setup database backup:
   -  Supabase: Automatic backups (check your plan)
   -  Manual backup: Export database secara berkala

### 7. **Domain & DNS**

-  ✅ Domain sudah dikonfigurasi
-  ✅ DNS records sudah di-set (A record atau CNAME)
-  ✅ SSL certificate sudah diinstall

### 8. **CDN & Assets** (Opsional)

-  ⚠️ Setup CDN untuk static assets (jika perlu)
-  ⚠️ Image CDN (Cloudflare Images, dll)

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

-  [ ] Environment variables sudah di-set di production
-  [ ] Build sukses tanpa error (`npm run build`)
-  [ ] Preview berjalan dengan baik (`npm run preview`)
-  [ ] Health check endpoint berfungsi (`/api/health`)
-  [ ] 404 page ter-render dengan benar
-  [ ] 500 page ter-render dengan benar
-  [ ] Sitemap.xml bisa diakses (`/sitemap.xml`)
-  [ ] RSS feed bisa diakses (`/rss.xml`)
-  [ ] Robots.txt bisa diakses (`/robots.txt`)
-  [ ] Database connection berfungsi
-  [ ] API endpoints berfungsi
-  [ ] Authentication berfungsi (jika ada)
-  [ ] SSL certificate sudah aktif (HTTPS)
-  [ ] Domain sudah mengarah ke server

## 🚀 Deployment Steps

### 1. **Build Application**

```bash
npm install
npm run build
```

### 2. **Deploy ke Server**

**VPS/Server:**

```bash
# Upload files ke server
scp -r dist/ user@server:/var/www/sansstocks/

# Atau dengan git
git pull origin main
npm install
npm run build
pm2 restart sansstocks
```

**Platform (Vercel, Railway, dll):**

```bash
# Push ke git, auto-deploy
git push origin main
```

### 3. **Start Application**

```bash
# Dengan PM2
pm2 start ecosystem.config.cjs

# Atau manual
node dist/server/entry.mjs
```

### 4. **Verify Deployment**

```bash
# Health check
curl https://yourdomain.com/api/health

# Cek homepage
curl https://yourdomain.com

# Cek sitemap
curl https://yourdomain.com/sitemap.xml
```

## 🔍 Post-Deployment Checks

Setelah deploy, cek:

1. **Functionality**

   -  [ ] Homepage loading dengan benar
   -  [ ] Artikel bisa dibaca
   -  [ ] Search berfungsi
   -  [ ] Pagination berfungsi
   -  [ ] Category/Tag pages berfungsi
   -  [ ] IPO modal berfungsi

2. **Performance**

   -  [ ] Page load time < 3 detik
   -  [ ] Images loading dengan benar
   -  [ ] No console errors (check browser console)

3. **SEO**

   -  [ ] Meta tags ter-render dengan benar (view page source)
   -  [ ] Structured data valid (test dengan Google Rich Results Test)
   -  [ ] Sitemap.xml bisa diakses
   -  [ ] RSS feed bisa diakses

4. **Security**

   -  [ ] HTTPS aktif
   -  [ ] No mixed content warnings
   -  [ ] Cookies secure di production

5. **Monitoring**
   -  [ ] Health check endpoint berfungsi
   -  [ ] Error logs tidak ada error fatal
   -  [ ] Application running stable

## 🛠️ Troubleshooting

### Application tidak start

```bash
# Cek logs
pm2 logs sansstocks

# Cek environment variables
env | grep SUPABASE

# Cek port
sudo netstat -tlnp | grep 4321
```

### Database connection error

```bash
# Test connection
curl https://yourdomain.com/api/health

# Cek Supabase URL & Key
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Build error

```bash
# Clear cache
rm -rf node_modules .astro dist
npm install
npm run build
```

## 📝 Notes

-  **Environment Variables**: Jangan commit `.env` ke git
-  **SSL**: Gunakan HTTPS di production
-  **CORS**: Jika perlu, configure CORS di `astro.config.mjs`
-  **Rate Limiting**: Sudah ada, tapi bisa ditambah jika perlu
-  **Monitoring**: Recommended untuk production setup

## 🎯 Quick Test

```bash
# 1. Health check
curl https://yourdomain.com/api/health

# 2. Homepage
curl -I https://yourdomain.com

# 3. Sitemap
curl https://yourdomain.com/sitemap.xml

# 4. RSS
curl https://yourdomain.com/rss.xml

# 5. Test article
curl https://yourdomain.com/artikel/[slug]

# 6. Test category
curl https://yourdomain.com/categories/[slug]
```

Jika semua return status 200, berarti deployment berhasil! 🎉
