-- RLS Setup untuk Categories Table

-- 1. Enable RLS untuk categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Policy untuk public read (semua orang bisa read categories)
CREATE POLICY "Categories are viewable by everyone."
ON categories FOR SELECT
TO public
USING (true);

-- 3. Policy untuk authenticated users (admin) - bisa INSERT/UPDATE/DELETE
-- Untuk admin-only system (tanpa role check)
CREATE POLICY "Authenticated users can manage categories."
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ATAU jika ingin lebih aman dengan role check (future-proof):
-- CREATE POLICY "Admins can manage categories."
-- ON categories FOR ALL
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

