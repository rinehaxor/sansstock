# Setup Self-Hosted Inter Font

Font Inter sekarang di-host secara lokal untuk mengurangi CLS dan dependency ke Google Fonts CDN.

## Cara Download Font Files

### Opsi 1: Menggunakan Google Web Fonts Helper (Recommended)

1. Buka: https://gwfh.mranftl.com/fonts/inter
2. Pilih weights: 300, 400, 500, 600, 700
3. Pilih subset: Latin (atau Latin Extended jika perlu)
4. Download semua file .woff2
5. Simpan ke folder `public/fonts/` dengan nama:
   -  `Inter-Light.woff2` (weight 300)
   -  `Inter-Regular.woff2` (weight 400)
   -  `Inter-Medium.woff2` (weight 500)
   -  `Inter-SemiBold.woff2` (weight 600)
   -  `Inter-Bold.woff2` (weight 700)

### Opsi 2: Download dari Google Fonts Directly

1. Buka: https://fonts.google.com/specimen/Inter
2. Klik "Download family"
3. Extract ZIP file
4. Copy file .woff2 dari folder `static/` ke `public/fonts/`
5. Rename sesuai dengan nama di atas

### Opsi 3: Menggunakan npm/google-fonts-helper

```bash
npx google-webfonts-helper-cli inter --weights 300,400,500,600,700 --output public/fonts
```

## File Structure Setelah Download

```
public/
  fonts/
    Inter-Light.woff2
    Inter-Regular.woff2
    Inter-Medium.woff2
    Inter-SemiBold.woff2
    Inter-Bold.woff2
    inter.css (sudah dibuat)
```

## Keuntungan Self-Hosting

1. ✅ Mengurangi CLS - font load lebih cepat dari same origin
2. ✅ Kontrol penuh - bisa preload font files
3. ✅ Mengurangi dependency ke external CDN
4. ✅ Bisa menggunakan `ascent-override` dan `descent-override` untuk match metrics dengan system fonts
5. ✅ `font-display: optional` mencegah layout shift

## Testing

Setelah download font files, test di browser:

1. Check Network tab - font files harus load dari `/fonts/Inter-*.woff2`
2. Check Console - tidak ada error 404 untuk font files
3. Test CLS di Lighthouse - harus lebih rendah dari sebelumnya
