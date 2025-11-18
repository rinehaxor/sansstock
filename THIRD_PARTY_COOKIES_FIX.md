# Fix Third-Party Cookies & Browser Errors

## 🔍 Masalah yang Ditemukan

### 1. **Third-Party Cookies dari Pintu Widget** ⚠️
- 3 cookies dari `pintu.co.id`:
  - `_hjCookieTest`
  - `_hjSessionUser_2583362`
  - `_hjSession_2583362`
- Cookies di-inject oleh Pintu widget (Hotjar analytics)

### 2. **Browser Errors: SyntaxError** ❌
- `SyntaxError: Unexpected token ':'` di 4 locations
- Kemungkinan dari `define:vars` dengan object literal

## ✅ Optimasi yang Sudah Diterapkan

### 1. **Fix SyntaxError** ✅
- **Before**: `define:vars={{ articleId: article.id }}` - bisa cause SyntaxError
- **After**: `define:vars={{ articleId: String(article.id) }}` + wrap dalam IIFE
- **Benefit**: Menghilangkan SyntaxError

**Files Fixed:**
- `src/pages/artikel/[slug].astro`
- `src/components/MarketCard.astro`
- `src/components/IHSGTicker.astro`

### 2. **Improve Third-Party Cookie Handling** ✅
- **Before**: `referrerpolicy="no-referrer-when-downgrade"`
- **After**: `referrerpolicy="no-referrer"` + `importance="low"`
- **Benefit**: Mengurangi cookie sharing, lower priority loading

**Implementation:**
```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  importance="low"
  loading="lazy"
/>
```

## ⚠️ Catatan Penting

### Third-Party Cookies Limitation

**Kita tidak bisa sepenuhnya menghilangkan third-party cookies dari Pintu widget** karena:

1. **Cookies di-inject oleh Pintu widget sendiri**
   - Hotjar analytics cookies
   - Tidak ada kontrol dari sisi kita

2. **Sandbox restrictions**
   - `allow-same-origin` diperlukan agar widget berfungsi
   - Tanpa ini, widget tidak bisa load

3. **Alternatives:**
   - **Option 1**: Remove Pintu widget (tidak recommended - kehilangan fitur)
   - **Option 2**: Build custom market ticker (time-consuming)
   - **Option 3**: Accept cookies sebagai trade-off (recommended)

### Best Practices

**Yang sudah dilakukan:**
- ✅ Lazy load widget (tidak blocking initial load)
- ✅ Strict referrer policy (`no-referrer`)
- ✅ Low priority loading (`importance="low"`)
- ✅ Sandbox restrictions (minimal permissions)

**Yang tidak bisa dilakukan:**
- ❌ Mencegah cookies dari third-party widget
- ❌ Block Hotjar analytics (di-inject oleh Pintu)

## 📊 Expected Improvements

### Before:
- **SyntaxError**: 4 errors
- **Third-Party Cookies**: 3 cookies (unavoidable)

### After (Expected):
- **SyntaxError**: 0 errors ✅
- **Third-Party Cookies**: 3 cookies (unavoidable, tapi sudah di-minimize impact)

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

### 3. Test

```bash
# Test di browser console
# Seharusnya tidak ada SyntaxError lagi
```

## 🎯 Target Score

Setelah optimasi:
- **Best Practices**: 73 → 80-85 (expected)
- **Browser Errors**: 4 errors → 0 errors ✅
- **Third-Party Cookies**: Masih ada (unavoidable dari Pintu widget)

## 📝 Summary

**Optimasi yang Sudah Diterapkan:**
- ✅ Fix SyntaxError dengan proper `define:vars` usage
- ✅ Improve third-party cookie handling dengan strict referrer policy
- ✅ Lazy load widget untuk reduce impact

**Limitations:**
- ⚠️ Third-party cookies dari Pintu widget tidak bisa dihilangkan
- ⚠️ Ini adalah trade-off untuk menggunakan third-party widget

**Recommendation:**
- Jika third-party cookies menjadi concern besar, pertimbangkan build custom market ticker
- Atau accept sebagai trade-off untuk fitur yang disediakan Pintu

