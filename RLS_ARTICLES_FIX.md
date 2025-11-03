# Fix RLS Error untuk Tabel Articles

Error: `new row violates row-level security policy for table "articles"`

Error ini terjadi karena tabel `articles` belum memiliki RLS policies yang memungkinkan authenticated users untuk INSERT artikel baru.

## Solusi

Jalankan SQL berikut di **Supabase Dashboard > SQL Editor**:

### Langkah-langkah:

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka menu **SQL Editor** di sidebar kiri
4. Copy-paste seluruh isi file `ARTICLES_RLS_SETUP.sql` ke SQL Editor
5. Klik **Run** untuk menjalankan query

Atau jalankan SQL berikut:

```sql
-- Enable Row Level Security on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to view published articles
CREATE POLICY "Published articles are viewable by everyone."
ON articles
FOR SELECT
TO public
USING (status = 'published');

-- Policy: Allow authenticated users to view all articles (including draft)
CREATE POLICY "Authenticated users can view all articles."
ON articles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert articles
CREATE POLICY "Authenticated users can insert articles."
ON articles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update articles
CREATE POLICY "Authenticated users can update articles."
ON articles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete articles
CREATE POLICY "Authenticated users can delete articles."
ON articles
FOR DELETE
TO authenticated
USING (true);

-- Enable Row Level Security on article_tags table
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to view article_tags for published articles
CREATE POLICY "Article tags for published articles are viewable by everyone."
ON article_tags
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM articles
    WHERE articles.id = article_tags.article_id
    AND articles.status = 'published'
  )
);

-- Policy: Allow authenticated users to view all article_tags
CREATE POLICY "Authenticated users can view all article_tags."
ON article_tags
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert article_tags
CREATE POLICY "Authenticated users can insert article_tags."
ON article_tags
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update article_tags
CREATE POLICY "Authenticated users can update article_tags."
ON article_tags
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete article_tags
CREATE POLICY "Authenticated users can delete article_tags."
ON article_tags
FOR DELETE
TO authenticated
USING (true);
```

## Penjelasan Policies

### Untuk Tabel `articles`:

1. **Public SELECT**: Hanya artikel dengan status `published` yang bisa dilihat oleh public
2. **Authenticated SELECT**: User yang sudah login bisa melihat semua artikel (termasuk draft)
3. **Authenticated INSERT**: User yang sudah login bisa membuat artikel baru
4. **Authenticated UPDATE**: User yang sudah login bisa mengupdate artikel
5. **Authenticated DELETE**: User yang sudah login bisa menghapus artikel

### Untuk Tabel `article_tags`:

1. **Public SELECT**: Hanya tag dari artikel published yang bisa dilihat public
2. **Authenticated SELECT/INSERT/UPDATE/DELETE**: User yang sudah login bisa manage semua tags

## Verifikasi

Setelah menjalankan SQL, coba lagi:
1. Buat artikel baru di dashboard
2. Jika masih error, cek di Supabase Dashboard > Authentication > Policies untuk memastikan policies sudah dibuat

## Catatan

Jika sebelumnya sudah ada policies yang conflict, hapus dulu dengan:

```sql
-- Drop existing policies (jika ada)
DROP POLICY IF EXISTS "Published articles are viewable by everyone." ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles." ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles." ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles." ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles." ON articles;

-- Kemudian jalankan kembali CREATE POLICY statements
```

## Troubleshooting

### Error: "policy already exists"
- Policy sudah ada sebelumnya
- Jalankan `DROP POLICY` terlebih dahulu, atau ubah nama policy

### Error: "permission denied"
- Pastikan Anda menggunakan user yang punya akses admin di Supabase
- Gunakan **Service Role Key** jika perlu (tidak direkomendasikan untuk production)

### Masih error setelah setup
- Pastikan user sudah login (authenticated)
- Cek cookies `sb-access-token` dan `sb-refresh-token` ada di browser
- Refresh halaman dan coba lagi

