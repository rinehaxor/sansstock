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

