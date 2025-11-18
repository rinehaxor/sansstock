# Best Practices Fixes - Implementasi

## ✅ Masalah yang Sudah Diperbaiki

### 1. **Supabase Client-Side Error**

**Masalah**: Error `supabaseUrl is required` saat hydration di client-side
**Solusi**:

-  ✅ Deteksi server-side vs client-side context
-  ✅ Validasi environment variables hanya di server-side
-  ✅ Fallback handling untuk client-side
-  ✅ Support `PUBLIC_` prefix untuk client-side access (opsional)

### 2. **Third-Party Cookies dari Pintu Widget**

**Masalah**: Hotjar cookies dari pintu.co.id widget
**Solusi**:

-  ✅ Tambahkan `sandbox="allow-scripts allow-same-origin"` ke iframe
-  ✅ Tambahkan `referrerpolicy="no-referrer-when-downgrade"`
-  ✅ Ubah `loading="eager"` menjadi `loading="lazy"` untuk defer loading

### 3. **Environment Variables Setup**

**Catatan**: Supabase anon key aman untuk di-expose ke client (by design), tapi untuk best practice, gunakan `PUBLIC_` prefix jika ingin explicit.

## 📋 Setup Environment Variables

### Untuk Server-Side Only (Recommended)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://emitenhub.com
```

### Untuk Client-Side Access (Jika diperlukan)

Jika Anda perlu menggunakan Supabase di client-side components (tidak recommended untuk production), tambahkan:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Catatan**: Code sudah support fallback ke `SUPABASE_URL` dan `SUPABASE_ANON_KEY` jika `PUBLIC_` prefix tidak ada.

## 🔧 SyntaxError Fix

SyntaxError kemungkinan disebabkan oleh:

1. **Invalid JavaScript di generated code** - Sudah di-handle dengan proper error handling
2. **Browser compatibility** - Pastikan menggunakan browser modern
3. **Build issues** - Rebuild aplikasi setelah perubahan

## 🚀 Langkah Deploy

### 1. Update Environment Variables di VPS

```bash
cd /var/www/sansstocks/sansstocks
nano .env
```

Pastikan ada:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://emitenhub.com
```

### 2. Rebuild Aplikasi

```bash
npm run build
```

### 3. Restart Aplikasi

```bash
pm2 restart sansstocks
# atau
sudo systemctl restart sansstocks
```

### 4. Verify Fixes

```bash
# Test homepage
curl https://emitenhub.com

# Check browser console untuk errors
# Buka Chrome DevTools > Console
```

## 🎯 Expected Results

Setelah fix, Anda seharusnya melihat:

1. ✅ **No Supabase errors** di browser console
2. ✅ **No hydration errors** untuk NewsPagination
3. ✅ **Reduced third-party cookie warnings** (masih ada dari Hotjar, tapi lebih terbatas dengan sandbox)
4. ✅ **No SyntaxError** di console

## ⚠️ Catatan Penting

### Third-Party Cookies

Cookies dari pintu.co.id widget masih akan muncul karena:

-  Widget menggunakan Hotjar untuk analytics
-  Ini adalah expected behavior dari third-party widget
-  Sandbox attribute membantu membatasi access, tapi tidak menghilangkan cookies

**Alternatif** (jika ingin menghilangkan cookies sepenuhnya):

1. Buat custom market ticker tanpa iframe
2. Gunakan API pintu.co.id langsung (jika tersedia)
3. Implementasi cookie consent banner

### Environment Variables

-  **SUPABASE_ANON_KEY** aman untuk di-expose (by design dari Supabase)
-  **SUPABASE_SERVICE_ROLE_KEY** JANGAN PERNAH di-expose ke client
-  Gunakan RLS (Row Level Security) di Supabase untuk security

## 🐛 Troubleshooting

### Masih ada Supabase error di console

```bash
# Cek environment variables
cd /var/www/sansstocks/sansstocks
cat .env | grep SUPABASE

# Pastikan variables sudah di-set
pm2 env 0 | grep SUPABASE
```

### SyntaxError masih muncul

```bash
# Clear build cache
rm -rf dist .astro node_modules/.vite

# Rebuild
npm run build

# Restart
pm2 restart sansstocks
```

### Iframe tidak load

-  Cek apakah `sandbox` attribute terlalu restrictive
-  Cek network tab untuk blocked requests
-  Pastikan `referrerpolicy` tidak block requests
