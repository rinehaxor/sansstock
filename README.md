# SansStocks

SansStocks adalah portal berita dan riset pasar modal Indonesia yang dibangun dengan Astro + React. Repositori ini memuat halaman publik, dashboard internal untuk redaksi, API routes (artikel, pasar, autentikasi), serta komponen UI re-useable.

## Menjalankan Proyek

Semua perintah dijalankan dari root repo:

| Perintah          | Penjelasan                                         |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Menginstal semua dependensi                        |
| `npm run dev`     | Server pengembangan di `http://localhost:4321`     |
| `npm run build`   | Build produksi ke folder `dist/`                   |
| `npm run preview` | Menjalankan preview hasil build                    |

## Konfigurasi Environment

Buat file `.env` dan isi minimal variabel berikut:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
# SITE_URL=https://sansstocks.com
```

Jika `SITE_URL` tidak diset, aplikasi otomatis mendeteksi host dari request yang masuk. Pastikan nilai produksi tidak memakai trailing slash.

## Ringkasan Keamanan Saat Ini

Audit internal mencatat sejumlah celah yang sedang dikerjakan. Ringkasan ini perlu dibaca sebelum melakukan deployment:

- Tidak ada CSRF protection – seluruh form/API berbasis cookies masih rentan terhadap cross-site request forgery.
- Validasi/sanitasi input belum konsisten – risiko XSS dan SQL injection masih tinggi jika data masuk langsung diteruskan ke DB/DOM.
- Tidak ada rate limiting di API penting – endpoint login, artikel, dan pasar bisa menjadi target brute force maupun DDoS.
- Pesan error masih terlalu detail – stack trace dan detail query dapat membocorkan arsitektur sistem saat terjadi kegagalan.
- Konfigurasi cookie perlu diperketat – terapkan `sameSite: 'strict'`, `secure`, dan `httpOnly` untuk sesi production.
- Tidak ada validasi environment variables saat startup – kesalahan konfigurasi baru diketahui ketika fitur tertentu dijalankan.

Detail rencana mitigasi ada di `SECURITY_AUDIT_REPORT.md`, `CSRF_IMPLEMENTATION.md`, `VALIDATION_IMPLEMENTATION.md`, `RATE_LIMITING_IMPLEMENTATION.md`, dan dokumen pendukung lainnya di root repo. Perbarui bagian ini setelah kontrol keamanan selesai diterapkan.
