-- Add legal_consultant column to ipo_listings table
-- Run this in Supabase SQL Editor

ALTER TABLE ipo_listings 
ADD COLUMN IF NOT EXISTS legal_consultant TEXT;

COMMENT ON COLUMN ipo_listings.legal_consultant IS 'Nama Konsultan Hukum yang membantu proses IPO';

