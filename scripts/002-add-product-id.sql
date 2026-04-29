-- Add product_id column to song_requests table (run if table already exists)
ALTER TABLE song_requests
  ADD COLUMN IF NOT EXISTS product_id VARCHAR(100);
