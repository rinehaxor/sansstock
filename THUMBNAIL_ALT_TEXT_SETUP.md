# Setup Alt Text untuk Thumbnail Artikel

Dokumen ini menjelaskan bagaimana menambahkan kolom `thumbnail_alt` ke database untuk menyimpan deskripsi gambar thumbnail artikel.

## Langkah 1: Tambah Kolom di Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tambahkan kolom thumbnail_alt ke tabel articles
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS thumbnail_alt TEXT;

-- Tambahkan comment untuk dokumentasi
COMMENT ON COLUMN articles.thumbnail_alt IS 'Deskripsi gambar thumbnail untuk aksesibilitas dan SEO';
```

## Langkah 2: Verifikasi

Setelah menambahkan kolom, pastikan:
1. Form artikel menampilkan input untuk alt text thumbnail
2. API dapat menyimpan dan mengambil `thumbnail_alt`
3. Preview thumbnail menggunakan alt text yang diinput

## Manfaat

- **Aksesibilitas**: Screen reader dapat membaca deskripsi gambar
- **SEO**: Search engine dapat memahami isi gambar
- **User Experience**: Gambar yang gagal load masih memberikan informasi via alt text

## Catatan

- Alt text tidak wajib (nullable)
- Sebaiknya deskriptif dan ringkas (100-125 karakter)
- Hindari kata "gambar" atau "image" di awal karena screen reader sudah menyebutkan

