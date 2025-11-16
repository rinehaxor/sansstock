# Rate Limiting Implementation

Rate limiting telah diimplementasikan untuk mencegah brute force attacks dan DDoS.

## Yang Sudah Diimplementasikan

### 1. Rate Limiting Utility (`src/lib/ratelimit.ts`)

Rate limiting menggunakan **sliding window algorithm** dengan konfigurasi berbeda per endpoint type:

- ✅ **Login Rate Limit**: 5 attempts per 15 menit (brute force prevention)
- ✅ **API Rate Limit**: 100 requests per menit (DDoS prevention)
- ✅ **Upload Rate Limit**: 10 uploads per menit (abuse prevention)
- ✅ **Public Rate Limit**: 200 requests per menit (general protection)

### 2. Endpoint yang Dilindungi

#### Login Endpoint (Brute Force Prevention)
- ✅ `/api/auth/signin` - POST
  - **Limit**: 5 attempts per 15 menit per IP
  - **Tujuan**: Mencegah brute force attack pada login

#### API Endpoints (DDoS Prevention)
- ✅ `/api/articles` - POST
- ✅ `/api/articles/[id]` - PUT, DELETE
- ✅ `/api/categories` - POST
- ✅ `/api/tags` - POST
- ✅ `/api/ipo-listings` - POST
- ✅ `/api/ipo-listings/[id]` - PUT, DELETE
- ✅ `/api/underwriters` - POST
- ✅ `/api/ipo-listings/import` - POST
  - **Limit**: 100 requests per menit per IP
  - **Tujuan**: Mencegah DDoS attack pada API

#### Upload Endpoint (Abuse Prevention)
- ✅ `/api/upload/thumbnail` - POST
  - **Limit**: 10 uploads per menit per IP
  - **Tujuan**: Mencegah abuse upload endpoint

## Konfigurasi Rate Limit

Rate limit dapat dikonfigurasi di `src/lib/ratelimit.ts`:

```typescript
const rateLimitConfigs = {
   login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,            // 5 attempts
   },
   api: {
      windowMs: 60 * 1000,       // 1 minute
      maxRequests: 100,          // 100 requests
   },
   upload: {
      windowMs: 60 * 1000,       // 1 minute
      maxRequests: 10,           // 10 uploads
   },
   public: {
      windowMs: 60 * 1000,       // 1 minute
      maxRequests: 200,          // 200 requests
   },
};
```

## Cara Kerja

### Sliding Window Algorithm

1. **Tracking**: Setiap request ditrack berdasarkan endpoint type dan IP address
2. **Window**: Request dicatat dalam time window (misalnya 1 menit)
3. **Limit Check**: Jika jumlah request dalam window melebihi limit, request ditolak
4. **Auto Cleanup**: Entri yang expired di-cleanup otomatis setiap 5 menit

### IP Identification

Rate limiting menggunakan IP address untuk identifikasi:
- Mengambil IP dari header `X-Forwarded-For` (jika ada proxy)
- Fallback ke `X-Real-IP` (jika ada)
- Fallback ke `clientAddress` dari Astro context

## Response Format

Ketika rate limit terlampaui, server akan mengembalikan:

```json
{
   "error": "Too many requests. Please try again later.",
   "retryAfter": 450
}
```

**HTTP Status**: `429 Too Many Requests`

**Headers**:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: ISO timestamp when limit resets
- `Retry-After`: Seconds until retry allowed

## Contoh Response Headers

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-01-01T12:15:00.000Z
Retry-After: 450
```

## Penggunaan di Frontend

Frontend harus handle rate limit error dengan baik:

```typescript
const response = await fetch('/api/auth/signin', {
   method: 'POST',
   body: formData,
   credentials: 'include',
});

if (response.status === 429) {
   const error = await response.json();
   const retryAfter = response.headers.get('Retry-After');
   
   // Show user-friendly error message
   toast.error(`Too many attempts. Please try again in ${retryAfter} seconds.`);
   
   // Optionally disable form for retryAfter seconds
   return;
}
```

## Fitur Keamanan

✅ **Brute Force Prevention**: Login endpoint protected dengan rate limit ketat  
✅ **DDoS Prevention**: API endpoints protected dengan rate limit moderat  
✅ **Abuse Prevention**: Upload endpoint protected dengan rate limit ketat  
✅ **IP-based Tracking**: Setiap IP ditrack terpisah  
✅ **Sliding Window**: Lebih fair dibanding fixed window  
✅ **Auto Cleanup**: Memory efficient dengan cleanup otomatis  

## Catatan Penting

### In-Memory Rate Limiting

Rate limiting saat ini menggunakan **in-memory storage** (Map):
- ✅ **Keuntungan**: Simple, tidak perlu dependencies tambahan
- ⚠️ **Keterbatasan**: 
  - Reset saat server restart
  - Tidak shared antar server instances (jika multiple instances)
  - Memory usage meningkat dengan banyak IP

### Production Recommendations

Untuk production dengan multiple server instances atau high traffic, pertimbangkan:

1. **Redis-based Rate Limiting**:
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";
   
   const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
   });
   ```

2. **Upstash Ratelimit** (Recommended):
   - Free tier available
   - Distributed rate limiting
   - Built-in analytics

3. **Cloudflare Rate Limiting**:
   - Rate limiting di edge
   - Tidak perlu code changes
   - Protection di level CDN

## Testing

Test rate limiting dengan:

1. **Login Endpoint**:
   ```bash
   # Coba login 6 kali berturut-turut
   for i in {1..6}; do
      curl -X POST http://localhost:4321/api/auth/signin \
         -F "email=test@example.com" \
         -F "password=wrong"
   done
   # Request ke-6 harusnya return 429
   ```

2. **API Endpoint**:
   ```bash
   # Coba 101 requests dalam 1 menit
   for i in {1..101}; do
      curl -X POST http://localhost:4321/api/articles \
         -H "Cookie: sb-access-token=..." \
         -H "X-CSRF-Token: ..." \
         -H "Content-Type: application/json" \
         -d '{"title":"Test"}'
   done
   # Request ke-101 harusnya return 429
   ```

## Monitoring

Untuk monitoring rate limit:
1. Check response headers `X-RateLimit-Remaining`
2. Monitor 429 responses di server logs
3. Alert jika banyak IP yang ter-rate-limit (mungkin ada attack)

## Kesimpulan

Rate limiting telah diimplementasikan untuk:
- ✅ **Login**: Mencegah brute force (5 attempts / 15 min)
- ✅ **API**: Mencegah DDoS (100 requests / min)
- ✅ **Upload**: Mencegah abuse (10 uploads / min)

Untuk production dengan multiple instances, pertimbangkan menggunakan Redis/Upstash untuk distributed rate limiting.

