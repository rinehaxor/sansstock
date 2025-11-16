# Secure Error Handling Implementation

Error handling yang aman telah diimplementasikan untuk mencegah kebocoran informasi sistem.

## Yang Sudah Diimplementasikan

### 1. Error Handler Utility (`src/lib/error-handler.ts`)

Error handling utility yang:
- ✅ **Generic Error Messages**: Mengembalikan pesan error yang aman untuk client
- ✅ **Server-side Logging**: Log error detail hanya di server-side
- ✅ **Production Mode**: Pesan error berbeda antara development dan production
- ✅ **Error Classification**: Mengklasifikasikan error berdasarkan tipe untuk pesan yang sesuai

### 2. Error Messages

Pesan error yang aman dan generic:

| Error Type | Message |
|------------|---------|
| Authentication | "Unauthorized - Please login" |
| Authorization | "Forbidden - Access denied" |
| Invalid Credentials | "Invalid email or password" |
| Validation | "Validation failed. Please check your input." |
| Not Found | "Resource not found" |
| Rate Limiting | "Too many requests. Please try again later." |
| CSRF | "Invalid CSRF token. Please refresh the page and try again." |
| Internal Error | "An error occurred. Please try again later." |
| Database Error | "Database operation failed. Please try again." |

### 3. Endpoint yang Sudah Diupdate

- ✅ `/api/auth/signin` - POST
- ✅ `/api/articles` - GET, POST
- ✅ `/api/articles/[id]` - GET, PUT, DELETE

## Perbedaan Development vs Production

### Development Mode
```json
{
   "error": "Duplicate key violation: articles_slug_unique",
   "details": "Error: duplicate key value violates unique constraint \"articles_slug_unique\"\n    at QueryRunner.query..."
}
```

### Production Mode
```json
{
   "error": "A resource with this information already exists"
}
```

## Cara Kerja

### 1. Error Detection

Error handler mendeteksi berbagai jenis error:
- Database errors (PostgREST, unique constraint, foreign key)
- Network errors (timeout, connection refused)
- Authentication errors
- Validation errors
- Generic errors

### 2. Error Classification

Error diklasifikasikan berdasarkan:
- Error message patterns (contains "duplicate", "foreign key", etc.)
- Status code (400, 401, 403, 404, 500)
- Error type (database, network, auth, validation)

### 3. Generic Message Mapping

Error messages di-mapping ke pesan yang aman:
- Database constraint errors → "A resource with this information already exists"
- Foreign key errors → "This resource cannot be deleted as it is currently in use"
- PostgREST errors → "Database operation failed. Please try again."
- Auth errors → "Invalid email or password" (tidak expose apakah email atau password yang salah)

### 4. Server-side Logging

Detail error di-log hanya di server-side:
```typescript
// Development: Log full error dengan stack trace
console.error('[ERROR]', '[POST /api/articles]', errorMessage);
console.error('[STACK]', errorStack);

// Production: Log minimal atau kirim ke error tracking service
// (Sentry, LogRocket, etc.)
```

## Fungsi-fungsi Utama

### `createErrorResponse()`

Membuat error response yang aman:

```typescript
createErrorResponse(error, statusCode, context)
```

- `error`: Error object atau string
- `statusCode`: HTTP status code
- `context`: Context string untuk logging (optional)

### `createValidationErrorResponse()`

Membuat validation error response:

```typescript
createValidationErrorResponse(errors, details)
```

- `errors`: Array of Zod errors
- `details`: Detail string (hanya di development)

### `createSuccessResponse()`

Membuat success response:

```typescript
createSuccessResponse(data, statusCode, headers)
```

## Contoh Penggunaan

### Sebelum (Tidak Aman)
```typescript
if (error) {
   return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
   });
}
// Exposes: "duplicate key value violates unique constraint..."
```

### Sesudah (Aman)
```typescript
if (error) {
   return createErrorResponse(error, 500, 'POST /api/articles');
}
// Returns: "A resource with this information already exists"
// Logs full error di server-side
```

## Security Benefits

✅ **Tidak Expose Database Structure**: 
- Error messages tidak menunjukkan nama tabel, kolom, constraint

✅ **Tidak Expose System Info**: 
- Tidak expose stack traces, file paths, internal errors

✅ **Tidak Expose User Enumeration**: 
- Login errors tidak menunjukkan apakah email ada atau tidak

✅ **Tidak Expose Technology Stack**: 
- Error messages tidak menunjukkan teknologi yang digunakan (PostgREST, Supabase, etc.)

✅ **Development Friendly**: 
- Masih bisa debug dengan detail di development mode

## Best Practices

1. ✅ **Gunakan Error Handler**: Selalu gunakan `createErrorResponse()` untuk semua errors
2. ✅ **Log Context**: Sertakan context string untuk debugging
3. ✅ **Generic Messages**: Gunakan pesan yang tidak reveal informasi internal
4. ✅ **Status Codes**: Gunakan status code yang sesuai (400, 401, 403, 404, 500)
5. ✅ **Production Check**: Pastikan production mode tidak expose details

## Integration dengan Error Tracking

Untuk production, bisa integrate dengan error tracking service:

```typescript
// Di error-handler.ts
if (isProduction()) {
   // Sentry
   Sentry.captureException(error, { tags: { context } });
   
   // Atau LogRocket
   LogRocket.captureException(error);
}
```

## Testing

Test error handling dengan:

1. **Database Error**:
   - Coba create article dengan slug yang sudah ada
   - Harusnya return generic "A resource with this information already exists"

2. **Not Found Error**:
   - Coba GET article dengan ID yang tidak ada
   - Harusnya return generic "Resource not found"

3. **Validation Error**:
   - Coba POST dengan data invalid
   - Harusnya return generic "Validation failed" (production)

4. **Internal Error**:
   - Coba trigger internal error
   - Harusnya return generic "An error occurred. Please try again later."

## Kesimpulan

Error handling yang aman telah diimplementasikan dengan:
- ✅ Generic error messages untuk client
- ✅ Detailed logging untuk server-side debugging
- ✅ Production-safe error responses
- ✅ Error classification dan mapping

Semua endpoint penting sudah diupdate untuk menggunakan error handler yang aman.

