# Cookie Security, Environment Validation & Content Sanitization Implementation

Implementasi untuk meningkatkan keamanan cookie, validasi environment variables, dan sanitasi konten artikel.

## Yang Sudah Diimplementasikan

### 1. Cookie Security ✅

#### SameSite: 'strict' untuk semua cookies
Semua cookies sekarang menggunakan `sameSite: 'strict'` untuk perlindungan CSRF yang lebih baik:

- ✅ `/api/auth/signin` - POST
  - `sb-access-token`: sameSite: 'strict'
  - `sb-refresh-token`: sameSite: 'strict'
  - `csrf-token`: sameSite: 'strict'

#### Cookie Security Features

| Cookie | HttpOnly | Secure | SameSite | MaxAge |
|--------|----------|--------|----------|--------|
| `sb-access-token` | ✅ | ✅ (PROD) | ✅ strict | 7 days |
| `sb-refresh-token` | ✅ | ✅ (PROD) | ✅ strict | 30 days |
| `csrf-token` | ✅ | ✅ (PROD) | ✅ strict | 7 days |

**Benefits**:
- ✅ **SameSite: strict** - Mencegah CSRF attacks dengan lebih baik
- ✅ **HttpOnly** - Mencegah JavaScript access ke cookies (XSS protection)
- ✅ **Secure** - Cookies hanya dikirim via HTTPS di production

### 2. Environment Variables Validation ✅

#### Environment Validation Utility (`src/lib/env.ts`)

Validasi environment variables saat startup:

**Required Variables**:
- ✅ `SUPABASE_URL` - Validated (must be valid URL)
- ✅ `SUPABASE_ANON_KEY` - Validated (warn if too short)

**Optional Variables**:
- `SUPABASE_SERVICE_ROLE_KEY` - Optional
- `SITE_URL` - Optional
- `PUBLIC_SITE_URL` - Optional
- `ENABLE_ERROR_LOGGING` - Optional

#### Validation Features

- ✅ **Startup Validation**: Validates saat module load
- ✅ **Error Handling**: Throws error di development jika required vars missing
- ✅ **URL Validation**: Validates SUPABASE_URL format
- ✅ **Key Length Warning**: Warns jika SUPABASE_ANON_KEY terlalu pendek
- ✅ **Helpful Messages**: Clear error messages jika validation fails

#### Contoh Error Message

```
Missing required environment variables:
  - SUPABASE_URL (Supabase project URL)
  - SUPABASE_ANON_KEY (Supabase anonymous key)

Please check your .env file or environment configuration.
```

#### Validation di Supabase Client

Environment validation dipanggil saat `supabase.ts` module load:

```typescript
// Validates saat module load
try {
   validateEnvironmentVariables();
} catch (error) {
   // Development: throw error
   // Production: log warning
}
```

### 3. Content Sanitization ✅

#### Sanitization Utility (`src/lib/sanitize.ts`)

Sanitasi konten untuk mencegah XSS attacks:

**Functions**:
- ✅ `escapeHtml()` - HTML entity encoding untuk plain text
- ✅ `sanitizeHtml()` - Sanitize HTML content (removes dangerous tags/scripts)
- ✅ `sanitizeUrl()` - Sanitize URLs untuk links
- ✅ `sanitizeArticleContent()` - Sanitize artikel content sebelum save
- ✅ `sanitizeText()` - Sanitize plain text fields
- ✅ `sanitizeSlug()` - Sanitize slug untuk URL

#### Sanitization Features

**XSS Prevention**:
- ✅ Remove `<script>` tags
- ✅ Remove event handlers (`onclick`, `onerror`, etc.)
- ✅ Remove `javascript:` URLs
- ✅ Remove dangerous `data:` URLs
- ✅ Remove `<iframe>`, `<embed>`, `<object>` tags

**Safe HTML Preserved**:
- ✅ Text formatting (`<p>`, `<strong>`, `<em>`, etc.)
- ✅ Lists (`<ul>`, `<ol>`, `<li>`)
- ✅ Links (`<a>`) dengan safe URLs
- ✅ Images (`<img>`) dengan safe sources
- ✅ Tables (`<table>`, `<tr>`, `<td>`, etc.)

#### Applied to Article Content

Sanitization diterapkan di:
- ✅ `/api/articles` - POST (create article)
- ✅ `/api/articles/[id]` - PUT (update article)

**Example**:
```typescript
// Before save to database
const sanitizedContent = sanitizeArticleContent(content);
await authenticatedClient.from('articles').insert({
   ...otherFields,
   content: sanitizedContent, // Sanitized content
});
```

## Implementation Details

### 1. Cookie Security

#### Signin Endpoint
```typescript
context.cookies.set('sb-access-token', access_token, {
   path: '/',
   httpOnly: true,
   secure: import.meta.env.PROD,
   sameSite: 'strict', // CSRF protection
   maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

#### CSRF Token Cookie
```typescript
context.cookies.set('csrf-token', token, {
   path: '/',
   httpOnly: true,
   secure: import.meta.env.PROD,
   sameSite: 'strict', // CSRF protection
   maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

### 2. Environment Variables Validation

#### Validation Function
```typescript
validateEnvironmentVariables()
```

**Checks**:
1. Required variables exist and not empty
2. SUPABASE_URL is valid URL (starts with http:// or https://)
3. SUPABASE_ANON_KEY length warning (if too short)

**Error Handling**:
- Development: Throws error (fail fast)
- Production: Logs warning (continues)

### 3. Content Sanitization

#### Sanitization Function
```typescript
sanitizeArticleContent(content: string): string
```

**Removes**:
- `<script>` tags
- Event handlers (`onclick`, `onerror`, etc.)
- `javascript:` URLs
- Dangerous `data:` URLs
- `<iframe>`, `<embed>`, `<object>` tags

**Preserves**:
- Safe HTML tags (p, strong, em, ul, ol, li, etc.)
- Links dengan safe URLs
- Images dengan safe sources
- Tables

## Security Benefits

### Cookie Security
✅ **SameSite: strict** - Mencegah CSRF attacks  
✅ **HttpOnly** - Mencegah XSS cookie theft  
✅ **Secure** - Hanya dikirim via HTTPS  

### Environment Validation
✅ **Early Detection** - Detect missing vars saat startup  
✅ **Better Errors** - Clear error messages  
✅ **URL Validation** - Prevent invalid Supabase URL  
✅ **Key Validation** - Warn jika key terlalu pendek  

### Content Sanitization
✅ **XSS Prevention** - Remove dangerous scripts/tags  
✅ **Safe HTML** - Preserve safe formatting  
✅ **URL Safety** - Validate dan sanitize URLs  
✅ **Script Removal** - Remove semua `<script>` tags  

## Production Recommendations

### 1. Cookie Security
✅ **Sudah OK** - Semua cookies menggunakan `sameSite: 'strict'`

### 2. Environment Variables
✅ **Sudah OK** - Validation saat startup
- Pastikan semua required vars ada di production
- Gunakan environment variables di hosting (Vercel, Railway, etc.)

### 3. Content Sanitization

✅ **Sudah diimplementasikan dengan DOMPurify**:

Menggunakan `isomorphic-dompurify` untuk robust sanitization:

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeArticleContent(content: string): string {
   return DOMPurify.sanitize(content, DOMPURIFY_CONFIG);
}
```

**DOMPurify Configuration**:
- ✅ Whitelist tags untuk rich text content
- ✅ Whitelist attributes per tag
- ✅ Disable data attributes untuk security
- ✅ URL validation untuk links dan images
- ✅ Remove dangerous tags (script, iframe, embed, etc.)
- ✅ Remove event handlers (onclick, onerror, etc.)

**Package sudah terinstall**: `isomorphic-dompurify@^2.32.0`

## Testing

### Cookie Security Test
1. ✅ Check cookie headers dengan browser DevTools
2. ✅ Verify `SameSite=Strict` di cookie headers
3. ✅ Verify `HttpOnly` di cookie headers
4. ✅ Verify `Secure` di production

### Environment Validation Test
1. ✅ Remove required env var → Should throw error in dev
2. ✅ Invalid SUPABASE_URL → Should throw error
3. ✅ Missing optional vars → Should log warning

### Content Sanitization Test
1. ✅ Input dengan `<script>alert('XSS')</script>` → Should be removed
2. ✅ Input dengan `javascript:alert('XSS')` → Should be removed
3. ✅ Input dengan safe HTML → Should be preserved
4. ✅ Input dengan dangerous iframe → Should be removed

## Kesimpulan

Semua implementasi sudah selesai:
- ✅ **Cookie Security**: Semua cookies menggunakan `sameSite: 'strict'`
- ✅ **Environment Validation**: Validasi saat startup dengan error handling
- ✅ **Content Sanitization**: Sanitasi artikel content untuk XSS prevention

Untuk production, pertimbangkan menggunakan DOMPurify untuk sanitization yang lebih robust.

