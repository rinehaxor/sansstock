# CSRF Protection Implementation

CSRF protection telah diimplementasikan menggunakan double-submit cookie pattern.

## Cara Kerja

1. **Token Generation**: Setelah login berhasil, server akan generate CSRF token dan menyimpannya di cookie `csrf-token` (HTTP-only)
2. **Token Retrieval**: Frontend bisa mendapatkan CSRF token dari response login atau endpoint `/api/auth/csrf-token`
3. **Token Validation**: Setiap POST/PUT/DELETE request harus menyertakan CSRF token di header `X-CSRF-Token`
4. **Server Validation**: Server membandingkan token dari cookie dengan token dari header

## Update Frontend

Frontend perlu diupdate untuk:

### 1. Ambil CSRF Token Setelah Login

```typescript
// Di LoginForm.tsx atau setelah login berhasil
const response = await fetch('/api/auth/signin', {
   method: 'POST',
   body: formData,
   credentials: 'include',
});

if (response.ok) {
   const result = await response.json();
   // CSRF token dikembalikan dari response login
   const csrfToken = result.csrfToken;
   // Simpan token (bisa di localStorage, state, atau context)
   localStorage.setItem('csrfToken', csrfToken);
}
```

### 2. Atau Ambil dari Endpoint Khusus

```typescript
// Get CSRF token saat aplikasi load atau saat dibutuhkan
const response = await fetch('/api/auth/csrf-token', {
   method: 'GET',
   credentials: 'include',
});

if (response.ok) {
   const { csrfToken } = await response.json();
   localStorage.setItem('csrfToken', csrfToken);
}
```

### 3. Sertakan Token di Setiap POST/PUT/DELETE Request

```typescript
// Contoh: Update ArticleForm.tsx
const csrfToken = localStorage.getItem('csrfToken');

const response = await fetch('/api/articles', {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '', // Tambahkan header ini
   },
   body: JSON.stringify(data),
   credentials: 'include', // Penting: sertakan cookies
});
```

### 4. Refresh Token Jika Expired

Jika request gagal dengan error "Invalid CSRF token", ambil token baru:

```typescript
async function fetchWithCsrf(url: string, options: RequestInit = {}) {
   let csrfToken = localStorage.getItem('csrfToken');

   // Jika tidak ada token, ambil dulu
   if (!csrfToken) {
      const tokenResponse = await fetch('/api/auth/csrf-token', {
         credentials: 'include',
      });
      const { csrfToken: newToken } = await tokenResponse.json();
      csrfToken = newToken;
      localStorage.setItem('csrfToken', newToken);
   }

   // Tambahkan CSRF header ke semua request yang butuh
   const method = options.method?.toUpperCase() || 'GET';
   if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      options.headers = {
         ...options.headers,
         'X-CSRF-Token': csrfToken,
      };
   }

   options.credentials = 'include';

   const response = await fetch(url, options);

   // Jika CSRF token invalid, refresh dan retry sekali
   if (response.status === 403) {
      const error = await response.json();
      if (error.error?.includes('CSRF')) {
         const tokenResponse = await fetch('/api/auth/csrf-token', {
            credentials: 'include',
         });
         const { csrfToken: newToken } = await tokenResponse.json();
         localStorage.setItem('csrfToken', newToken);

         options.headers = {
            ...options.headers,
            'X-CSRF-Token': newToken,
         };

         return fetch(url, options);
      }
   }

   return response;
}
```

## Endpoint yang Dilindungi

Semua endpoint berikut sudah dilindungi CSRF:

-  ✅ `POST /api/articles`
-  ✅ `PUT /api/articles/[id]`
-  ✅ `DELETE /api/articles/[id]`
-  ✅ `POST /api/categories`
-  ✅ `PUT /api/categories/[id]`
-  ✅ `DELETE /api/categories/[id]`
-  ✅ `POST /api/tags`
-  ✅ `PUT /api/tags/[id]`
-  ✅ `DELETE /api/tags/[id]`
-  ✅ `POST /api/upload/thumbnail`
-  ✅ `POST /api/ipo-listings`
-  ✅ `PUT /api/ipo-listings/[id]`
-  ✅ `DELETE /api/ipo-listings/[id]`
-  ✅ `POST /api/ipo-listings/import`
-  ✅ `POST /api/underwriters`

Endpoint GET tidak perlu CSRF token (safe methods).

## Catatan Penting

1. **Cookies**: Pastikan semua request menggunakan `credentials: 'include'` untuk mengirim cookies
2. **Token Refresh**: Token CSRF bisa expire, pastikan refresh token jika diperlukan
3. **Development**: Di development mode, origin validation lebih longgar untuk testing
4. **Production**: Di production, origin validation lebih ketat untuk keamanan

## Testing

Untuk test CSRF protection:

1. Login dan ambil CSRF token
2. Coba request tanpa CSRF header → harusnya return 403
3. Coba request dengan CSRF token salah → harusnya return 403
4. Coba request dengan CSRF token benar → harusnya berhasil

## Security Features

✅ **HTTP-only Cookies**: CSRF token di cookie tidak bisa diakses dari JavaScript  
✅ **Double Submit Cookie Pattern**: Token harus match antara cookie dan header  
✅ **SameSite: Strict**: Cookies hanya dikirim untuk same-site requests  
✅ **Origin Validation**: Request harus berasal dari domain yang sama  
✅ **Constant-time Comparison**: Mencegah timing attacks pada token comparison
