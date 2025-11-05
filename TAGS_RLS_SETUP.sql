-- RLS Setup untuk Tags Table
-- Jalankan SQL ini di Supabase SQL Editor untuk mengaktifkan Row Level Security

-- 1. Enable RLS untuk tags table
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 2. Policy untuk public read (semua orang bisa read tags)
CREATE POLICY "Tags are viewable by everyone."
ON tags FOR SELECT
TO public
USING (true);

-- 3. Policy untuk authenticated users - bisa INSERT/UPDATE/DELETE
-- Untuk authenticated users (semua user yang sudah login bisa manage tags)
CREATE POLICY "Authenticated users can manage tags."
ON tags FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Catatan:
-- Policy ini memungkinkan semua user yang sudah login (authenticated) untuk:
-- - INSERT: Menambahkan tag baru
-- - UPDATE: Mengedit tag yang sudah ada
-- - DELETE: Menghapus tag
-- - SELECT: Membaca semua tag

-- Jika ingin lebih aman dengan role check (future-proof):
-- Uncomment bagian di bawah ini dan comment policy di atas
-- 
-- CREATE POLICY "Admins can manage tags."
-- ON tags FOR ALL
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM auth.users
--     WHERE auth.users.id = auth.uid()
--     AND auth.users.raw_user_meta_data->>'role' = 'admin'
--   )
-- )
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM auth.users
--     WHERE auth.users.id = auth.uid()
--     AND auth.users.raw_user_meta_data->>'role' = 'admin'
--   )
-- );

