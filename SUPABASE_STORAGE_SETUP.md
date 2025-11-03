# Setup Supabase Storage untuk Thumbnail Artikel

Panduan ini menjelaskan cara setup Supabase Storage bucket untuk menyimpan thumbnail artikel.

## Langkah-langkah Setup

### 1. Buat Storage Bucket di Supabase Dashboard

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka menu **Storage** di sidebar kiri
4. Klik **Create a new bucket**
5. Isi detail bucket:

   -  **Name**: `article-thumbnails`
   -  **Public bucket**: ✅ **Centang** (agar gambar bisa diakses public)
   -  **File size limit**: `5242880` (5MB dalam bytes)
   -  **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp,image/gif`

6. Klik **Create bucket**

### 2. Setup Storage Policies (Row Level Security)

Setelah bucket dibuat, kita perlu setup policies agar:

-  Admin bisa upload file
-  Public bisa membaca file (karena bucket public)

Buka **SQL Editor** di Supabase Dashboard dan jalankan query berikut:

```sql
-- Policy untuk allow authenticated users (admin) upload file
CREATE POLICY "Allow authenticated users to upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-thumbnails' AND
  (storage.foldername(name))[1] = 'thumbnails'
);

-- Policy untuk allow authenticated users (admin) update their own files
CREATE POLICY "Allow authenticated users to update thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-thumbnails' AND
  (storage.foldername(name))[1] = 'thumbnails'
);

-- Policy untuk allow authenticated users (admin) delete their own files
CREATE POLICY "Allow authenticated users to delete thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-thumbnails' AND
  (storage.foldername(name))[1] = 'thumbnails'
);

-- Policy untuk allow public read access (karena bucket public)
-- Ini sebenarnya tidak perlu jika bucket sudah public, tapi kita set untuk konsistensi
CREATE POLICY "Allow public read access to thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'article-thumbnails');
```

### 3. Verifikasi Setup

Untuk memverifikasi setup sudah benar:

1. Buka menu **Storage** > **article-thumbnails**
2. Pastikan bucket terlihat dan status **Public** ✅
3. Coba upload file via form artikel di dashboard

## Struktur File di Storage

File akan diorganisir seperti ini:

```
article-thumbnails/
  └── thumbnails/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── ...
```

Format nama file: `{timestamp}-{randomString}.{extension}`

## Catatan Penting

1. **Public Bucket**: Bucket harus public agar gambar thumbnail bisa diakses oleh pengunjung website
2. **File Size Limit**: Maksimal 5MB per file
3. **Allowed Types**: Hanya format gambar yang diizinkan (JPEG, PNG, WebP, GIF)
4. **Storage Quota**: Pastikan Anda tidak melebihi quota storage yang disediakan Supabase

## Troubleshooting

### Error: "Bucket not found"

-  Pastikan bucket `article-thumbnails` sudah dibuat
-  Pastikan nama bucket sama persis dengan yang di code (`article-thumbnails`)

### Error: "Access denied" atau "Unauthorized"

-  Pastikan policies sudah dibuat dengan benar
-  Pastikan user sudah login sebagai admin
-  Cek apakah bucket sudah di-set sebagai public

### Error: "File size exceeds limit"

-  File yang diupload lebih dari 5MB
-  Kurangi ukuran file atau compress gambar terlebih dahulu

### Error: "Invalid file type"

-  File yang diupload bukan gambar
-  Pastikan format file adalah JPG, PNG, WebP, atau GIF

## Cara Menghapus File Lama

Jika ingin menghapus thumbnail yang tidak terpakai:

1. Buka **Storage** > **article-thumbnails**
2. Cari file yang ingin dihapus
3. Klik pada file dan pilih **Delete**

Atau via SQL:

```sql
-- Hapus file berdasarkan path
DELETE FROM storage.objects
WHERE bucket_id = 'article-thumbnails'
AND name = 'thumbnails/nama-file.jpg';
```
