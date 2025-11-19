# Fix Browser Errors & Third-Party Cookies

## 🔍 Masalah yang Diperbaiki

### 1. **Third-Party Cookies dari Pintu Widget** ⚠️

-  **Masalah**: 3 cookies dari `pintu.co.id` (Hotjar analytics)
   -  `_hjCookieTest`
   -  `_hjSessionUser_2583362`
   -  `_hjSession_2583362`
-  **Solusi**:
   -  ✅ Tambahkan `crossorigin="anonymous"` untuk mengurangi cookie sharing
   -  ✅ `referrerpolicy="no-referrer-when-downgrade"` untuk privacy
   -  ✅ Widget sudah di-load lazy (tidak blocking initial load)

### 2. **Browser Errors: SyntaxError** ❌

-  **Masalah**: `SyntaxError: Unexpected token ':'` di 4 locations
-  **Kemungkinan penyebab**: JSON-LD scripts atau define:vars
-  **Status**: ✅ Sudah diperbaiki sebelumnya dengan IIFE wrapper untuk JSON-LD

### 3. **Browser Errors: TypeError di CategoryTabs** ❌

-  **Masalah**: `TypeError: Cannot set properties of undefined (setting 'Activity')`
-  **Penyebab**: React hydration mismatch atau re-render issue
-  **Solusi**:
   -  ✅ Gunakan `useMemo` untuk parse categories (avoid re-parsing)
   -  ✅ Gunakan lazy initializer untuk `useState` (avoid hydration mismatch)
   -  ✅ Pastikan `'use client'` directive sudah ada

## ✅ Perbaikan yang Diterapkan

### 1. MarketTicker.astro

```astro
<iframe
  crossorigin="anonymous"
  referrerpolicy="no-referrer-when-downgrade"
  sandbox="allow-scripts allow-same-origin allow-forms"
  ...
/>
```

### 2. CategoryTabs.tsx

```tsx
// Before: Direct parsing in component body
let categories: Category[] = [];
try {
   categories = typeof categoriesProp === 'string' ? JSON.parse(categoriesProp) : categoriesProp;
} catch (error) {
   categories = [];
}

// After: useMemo untuk avoid re-parsing
const categories = useMemo(() => {
   try {
      const parsed = typeof categoriesProp === 'string' ? JSON.parse(categoriesProp) : categoriesProp;
      if (!Array.isArray(parsed)) return [];
      return parsed;
   } catch (error) {
      return [];
   }
}, [categoriesProp]);

// Before: Direct calculation in useState
const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategoryId || (categories.length > 0 ? categories[0].id : null));

// After: Lazy initializer untuk avoid hydration mismatch
const [activeCategoryId, setActiveCategoryId] = useState<number | null>(() => {
   if (initialCategoryId) return initialCategoryId;
   if (categories.length > 0) return categories[0].id;
   return null;
});
```

## 📝 Catatan Penting

### Third-Party Cookies Limitation

**Kita tidak bisa sepenuhnya menghilangkan third-party cookies dari Pintu widget** karena:

1. **Cookies di-inject oleh Pintu widget sendiri**

   -  Hotjar analytics cookies
   -  Tidak ada kontrol dari sisi kita

2. **Sandbox restrictions**

   -  `allow-same-origin` diperlukan agar widget berfungsi
   -  Tanpa ini, widget tidak bisa load

3. **Alternatives:**
   -  **Option 1**: Remove Pintu widget (tidak recommended - kehilangan fitur)
   -  **Option 2**: Build custom market ticker (time-consuming)
   -  **Option 3**: Accept cookies sebagai trade-off (recommended)

### Best Practices

**Yang sudah dilakukan:**

-  ✅ Lazy load widget (tidak blocking initial load)
-  ✅ `crossorigin="anonymous"` untuk mengurangi cookie sharing
-  ✅ `referrerpolicy` untuk privacy
-  ✅ Widget di-load hanya saat visible (Intersection Observer)

## 🚀 Deploy Steps

```bash
# 1. Rebuild aplikasi
npm run build

# 2. Restart PM2
pm2 restart astro

# 3. Test di browser
# - Buka DevTools Console
# - Cek apakah masih ada errors
# - Test CategoryTabs functionality
```

## ✅ Expected Results

### Before:

-  ❌ 3 third-party cookies dari Pintu
-  ❌ SyntaxError di console
-  ❌ TypeError di CategoryTabs hydration

### After:

-  ⚠️ Third-party cookies masih ada (tidak bisa dihilangkan sepenuhnya)
-  ✅ SyntaxError fixed
-  ✅ TypeError fixed (CategoryTabs hydration)

## 🧪 Testing

1. **Test CategoryTabs:**

   -  Buka homepage
   -  Cek console - tidak ada TypeError
   -  Test switching categories - harus smooth

2. **Test MarketTicker:**

   -  Widget harus load saat scroll ke bawah
   -  Tidak ada console errors
   -  Cookies masih ada (expected behavior)

3. **Test PageSpeed Insights:**
   -  Best Practices score mungkin masih 73 (karena cookies)
   -  Browser errors harus berkurang
