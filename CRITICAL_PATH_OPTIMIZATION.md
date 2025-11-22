# Critical Path & Document Latency Optimization

## 🔍 Masalah yang Diperbaiki

### 1. **Document Request Latency** ⚠️
- **Masalah**: Server responded slowly (1226 ms), no compression applied
- **Penyebab**: 
  - Dev mode (localhost:4321) tidak memiliki compression
  - Initial HTML response time tinggi
- **Solusi**:
  - ✅ Production server (Nginx) sudah dikonfigurasi dengan compression
  - ✅ Preconnect ke same-origin untuk mengurangi latency
  - ⚠️ **Note**: Dev mode tidak support compression - ini normal dan tidak masalah

### 2. **Critical Request Chain** ⚠️
- **Masalah**: Maximum critical path latency: 3,167 ms
- **Chain yang panjang**:
  - Initial Navigation (1,926 ms)
  - tailwind/base.css (1,961 ms)
  - audit/index.js (2,548 ms)
  - rules/index.js (2,857 ms)
  - rules/a11y.js (3,033 ms)
  - deps/astro___aria-query.js (3,076 ms)
  - deps/chunk-V4OQ3NZ2.js (3,167 ms)
- **Solusi**:
  - ✅ Defer non-critical scripts (audit, a11y, aria-query)
  - ✅ Defer vendor CSS (non-critical)
  - ✅ Optimize Vite config untuk chunk splitting
  - ✅ Preload critical resources

## ✅ Perbaikan yang Diterapkan

### 1. **Astro Config Optimization** (`astro.config.mjs`)

```javascript
vite: {
   optimizeDeps: {
      include: ['react', 'react-dom', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
      exclude: ['@astrojs/audit'], // Exclude dev-only audit tools
   },
   build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
   },
}
```

### 2. **Defer Non-Critical Scripts** (`Layout.astro`)

Scripts yang di-defer:
- `audit/index.js` - Dev-only audit tools
- `rules/a11y.js` - Accessibility rules (non-critical)
- `deps/astro___aria-query.js` - ARIA query (non-critical)
- `deps/astro___axobject-query.js` - AXObject query (non-critical)

**Implementation**:
```javascript
// Automatically defer scripts containing 'audit', 'a11y', 'aria-query', 'axobject-query'
function deferScript(script) {
   if (src.includes('audit') || src.includes('a11y') || src.includes('aria-query')) {
      script.setAttribute('defer', '');
   }
}
```

### 3. **Defer Non-Critical CSS** (`Layout.astro`)

CSS yang di-defer:
- Vendor CSS (`vendor` atau `chunk` files)
- Non-critical stylesheets

**Implementation**:
```javascript
// Defer CSS using media="print" trick
link.setAttribute('media', 'print');
link.setAttribute('onload', "this.media='all'");
```

### 4. **Resource Hints** (`Layout.astro`)

```html
<!-- Preconnect to same-origin untuk mengurangi latency -->
<link rel="preconnect" href={Astro.url.origin} crossorigin>
<link rel="dns-prefetch" href={Astro.url.origin} />
```

## 📊 Expected Results

### Dev Mode (localhost:4321)
- ⚠️ Document latency masih tinggi (normal untuk dev mode)
- ⚠️ No compression (normal untuk dev mode)
- ✅ Critical request chain lebih pendek (scripts di-defer)
- ✅ Non-critical CSS tidak blocking render

### Production Mode
- ✅ Document latency rendah (Nginx compression enabled)
- ✅ Compression enabled (gzip/brotli)
- ✅ Critical request chain optimal
- ✅ All resources cached dengan baik

## 🚀 Production Optimization

### Nginx Configuration (`nginx-performance.conf`)

```nginx
# Compression
gzip on;
gzip_types
    text/plain
    text/css
    application/javascript
    font/woff2
    ...;

# Cache headers
location ~* \.(woff2|woff|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Middleware (`src/middleware.ts`)

```typescript
// Set cache headers untuk font files
if (context.url.pathname.startsWith('/fonts/')) {
   response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
}
```

## 📝 Testing

### Dev Mode
```bash
npm run dev
# Test di http://localhost:4321
# Expected: Scripts di-defer, CSS non-critical di-defer
```

### Production Mode
```bash
npm run build
npm run preview
# Test di production build
# Expected: Compression enabled, semua optimasi aktif
```

## ⚠️ Important Notes

1. **Dev Mode Limitations**:
   - No compression (normal)
   - Higher latency (normal)
   - Audit tools loaded (dev-only)

2. **Production Mode**:
   - Compression enabled via Nginx
   - Lower latency
   - No audit tools (excluded from build)

3. **Critical Path**:
   - Initial HTML: Critical (tidak bisa di-defer)
   - Tailwind CSS: Critical (tidak bisa di-defer)
   - React/Vendor JS: Deferred jika non-critical
   - Audit/A11y: Deferred (dev-only)

## 🔄 Next Steps

1. ✅ Defer non-critical scripts
2. ✅ Defer non-critical CSS
3. ✅ Optimize Vite config
4. ✅ Add resource hints
5. ⏳ Test di production build
6. ⏳ Monitor Lighthouse scores

