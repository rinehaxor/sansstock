-- Add views_count column to articles table for Content Analytics
-- This migration adds the views_count column with default value 0

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;

-- Create index for better performance when querying popular articles
CREATE INDEX IF NOT EXISTS idx_articles_views_count ON articles(views_count DESC);

-- Add comment to column
COMMENT ON COLUMN articles.views_count IS 'Total number of views for this article';

-- RLS Policy: Allow public (anonymous) users to update views_count for published articles
-- This allows the view tracking endpoint to work without authentication
-- Note: This policy assumes RLS is enabled on articles table
-- If RLS is not enabled, this policy will be created but won't be enforced

-- Check if RLS is enabled, if not, enable it first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'articles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can update views_count" ON articles;

-- Create policy to allow public update of views_count for published articles
CREATE POLICY "Public can update views_count"
ON articles FOR UPDATE
TO public
USING (status = 'published')
WITH CHECK (status = 'published' AND views_count IS NOT NULL AND views_count >= 0);

