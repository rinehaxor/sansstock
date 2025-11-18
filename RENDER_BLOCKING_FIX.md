# Fix Render Blocking & Network Dependency Chain

## 🔍 Masalah yang Ditemukan

### 1. **Render Blocking CSS: 87.8 KiB, 370ms** ❌
- CSS file blocking initial render
- Delay LCP (Largest Contentful Paint)

### 2. **Network Dependency Chain: 4,121ms** ❌
- CategoryTabs API call blocking (4,121ms)
- Chaining critical requests

### 3. **No Preconnect Origins** ⚠️
- Preconnect tidak terdeteksi oleh Lighthouse
- Perlu format yang benar

## ✅ Optimasi yang Sudah Diterapkan

### 1. **Defer Non-Critical CSS** ✅
- **Before**: CSS blocking render (370ms)
- **After**: CSS di-defer dengan media="print" trick
- **Benefit**: Mengurangi render blocking time ~140ms

**Implementation:**
```javascript
// Defer CSS loading untuk non-critical CSS
// Critical CSS akan tetap inline oleh Astro
links.forEach(link => {
  link.setAttribute('media', 'print');
  link.setAttribute('onload', "this.media='all'");
});
```

### 2. **Prefetch API untuk CategoryTabs** ✅
- **Before**: API call blocking saat component mount (4,121ms)
- **After**: Prefetch API saat page load
- **Benefit**: Mengurangi network dependency chain

**Implementation:**
```html
<link rel="prefetch" href="/api/articles?category_id=2&status=published&limit=4" 
      as="fetch" crossorigin="anonymous" />
```

### 3. **Fix Preconnect Format** ✅
- Tambahkan `crossorigin` attribute
- Pastikan format benar untuk Lighthouse detection

**Before:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```

**After:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
```

### 4. **Optimize CategoryTabs Component** ✅
- AbortController untuk cancel request jika unmount
- Use cached response dari prefetch
- Initial category ID passed as prop

## 📊 Expected Improvements

### Before:
- **Render Blocking CSS**: 370ms
- **Network Dependency Chain**: 4,121ms
- **Preconnect**: Not detected

### After (Expected):
- **Render Blocking CSS**: ~230ms (40% improvement)
- **Network Dependency Chain**: ~2,000ms (50% improvement)
- **Preconnect**: Detected and working

## 🚀 Deployment

### 1. Rebuild Aplikasi

```bash
cd /var/www/sansstocks/sansstocks
npm run build
```

### 2. Restart Aplikasi

```bash
pm2 restart sansstocks
```

### 3. Test Performance

```bash
# Test dengan Lighthouse
# Buka Chrome DevTools > Lighthouse > Analyze
```

## ⚠️ Catatan Penting

### CSS Defer Strategy

**Media="print" Trick:**
- CSS di-load dengan `media="print"` (tidak blocking)
- Saat load, ubah ke `media="all"` dengan onload handler
- Fallback dengan `<noscript>` untuk browsers tanpa JS

**Why This Works:**
- Browser tidak block render untuk print media
- CSS tetap di-load, tapi tidak blocking
- Saat ready, switch ke all media

### Prefetch API

**Benefits:**
- Browser preload API response
- Saat component fetch, response sudah cached
- Mengurangi network latency

**Limitations:**
- Hanya prefetch first category
- Other categories masih perlu fetch saat click
- Bisa ditambahkan prefetch untuk popular categories

## 🎯 Target Score

Setelah optimasi:
- **Performance**: 74 → 80-85 (expected)
- **Render Blocking**: 370ms → 230ms
- **Network Chain**: 4,121ms → 2,000ms

## 📝 Summary

**Optimasi yang Sudah Diterapkan:**
- ✅ Defer non-critical CSS dengan media="print" trick
- ✅ Prefetch API untuk CategoryTabs
- ✅ Fix preconnect format dengan crossorigin
- ✅ Optimize CategoryTabs dengan AbortController

**Expected Results:**
- Render blocking time: -140ms
- Network dependency chain: -2,000ms
- Better preconnect detection

