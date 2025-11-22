# Fix 403 Error pada `/_image` Endpoint

## Masalah
Error 403 Forbidden pada `/_image` endpoint saat mengakses gambar dari Supabase storage.

## Penyebab
Astro `/_image` endpoint memiliki security check yang memvalidasi:
1. Domain/Origin dari request
2. Domain dari image URL yang di-request
3. URL encoding pada parameter

## Solusi

### 1. Update Astro Config
File: `astro.config.mjs`

Pastikan domain Supabase sudah terdaftar:
```javascript
image: {
   domains: [
      'localhost',
      'supabase.co',
      '*.supabase.co',
      'aitfpijkletoyuxujmnc.supabase.co',
   ],
   remotePatterns: [
      {
         protocol: 'https',
         hostname: '**.supabase.co',
      },
      {
         protocol: 'https',
         hostname: 'aitfpijkletoyuxujmnc.supabase.co',
      },
   ],
}
```

### 2. URL Encoding Fix
File: `src/lib/utils.ts`

Pastikan URL di-encode dengan benar:
```typescript
params.set('href', encodeURI(imageUrl));
```

### 3. Verify Request Format
Format URL yang benar:
```
/_image?href=https%3A%2F%2Faitfpijkletoyuxujmnc.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2F...&w=192&h=112&q=75&f=webp
```

## Troubleshooting

### Jika masih 403:

1. **Cek apakah domain terdaftar:**
   ```bash
   # Test langsung di browser
   curl -I "http://localhost:4321/_image?href=https://aitfpijkletoyuxujmnc.supabase.co/storage/v1/object/public/article-thumbnails/test.jpg&w=192&f=webp"
   ```

2. **Cek security config:**
   - Pastikan `security.checkOrigin: false` di `astro.config.mjs`
   - Restart dev server setelah update config

3. **Alternative: Gunakan Image Proxy**
   Jika `/_image` masih bermasalah, gunakan `/api/image-proxy/` endpoint yang sudah dibuat.

## Alternative Solution

Jika `/_image` endpoint masih bermasalah, kita bisa:
1. Gunakan `/api/image-proxy/` endpoint (sudah dibuat)
2. Atau serve gambar langsung dari Supabase dengan cache headers di nginx

## Status
✅ Config sudah di-update
✅ URL encoding sudah diperbaiki
⏳ Perlu test setelah restart dev server

