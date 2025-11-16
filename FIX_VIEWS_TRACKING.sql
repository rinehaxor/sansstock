-- Fix Views Tracking - Ensure RLS policy allows public update of views_count
-- Run this migration if view tracking is not working

-- 1. Ensure views_count column exists
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_articles_views_count ON articles(views_count DESC);

-- 3. Enable RLS if not already enabled
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policy if exists
DROP POLICY IF EXISTS "Public can update views_count" ON articles;

-- 5. Create policy to allow public update of views_count for published articles
-- This allows the view tracking endpoint to work without authentication
CREATE POLICY "Public can update views_count"
ON articles FOR UPDATE
TO public
USING (status = 'published')
WITH CHECK (status = 'published' AND views_count IS NOT NULL AND views_count >= 0);

-- 6. Also ensure service_role can update (for admin operations)
DROP POLICY IF EXISTS "Service role can update views_count" ON articles;
CREATE POLICY "Service role can update views_count"
ON articles FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Optional: Create a function to increment views_count atomically
CREATE OR REPLACE FUNCTION increment_article_views(article_id INT)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE id = article_id AND status = 'published'
  RETURNING views_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION increment_article_views(INT) TO public;
GRANT EXECUTE ON FUNCTION increment_article_views(INT) TO anon;
GRANT EXECUTE ON FUNCTION increment_article_views(INT) TO authenticated;

-- Comment
COMMENT ON FUNCTION increment_article_views(INT) IS 'Increment view count for a published article atomically';

