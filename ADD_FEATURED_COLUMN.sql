-- Add featured column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create index for faster queries on featured articles
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = TRUE;

-- Add comment
COMMENT ON COLUMN articles.featured IS 'Marks article as featured/pinned article';

