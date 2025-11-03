-- Create media_metadata table to store alt text and other metadata for uploaded files
CREATE TABLE IF NOT EXISTS media_metadata (
    id BIGSERIAL PRIMARY KEY,
    file_path TEXT NOT NULL UNIQUE, -- Path to file in storage (e.g., "thumbnails/1234567890-abc.jpg")
    file_name TEXT NOT NULL, -- Just the filename
    file_url TEXT NOT NULL, -- Public URL
    file_size BIGINT DEFAULT 0, -- Size in bytes
    alt_text TEXT, -- Alt text for accessibility
    description TEXT, -- Optional description
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_metadata_file_path ON media_metadata(file_path);
CREATE INDEX IF NOT EXISTS idx_media_metadata_created_at ON media_metadata(created_at DESC);

-- Enable RLS
ALTER TABLE media_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow authenticated users to read all media
CREATE POLICY "Authenticated users can view media"
    ON media_metadata FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert media
CREATE POLICY "Authenticated users can insert media"
    ON media_metadata FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update media
CREATE POLICY "Authenticated users can update media"
    ON media_metadata FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media"
    ON media_metadata FOR DELETE
    TO authenticated
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_media_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_media_metadata_updated_at
    BEFORE UPDATE ON media_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_media_metadata_updated_at();

-- Comment for documentation
COMMENT ON TABLE media_metadata IS 'Stores metadata (alt text, description) for uploaded media files in Supabase Storage';

