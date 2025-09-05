-- Fix RLS policies to allow uploads to audio bucket
-- Run these commands in your Supabase SQL editor

-- Allow anon role to upload to audio bucket
DROP POLICY IF EXISTS "Allow anon upload audio objects" ON storage.objects;
CREATE POLICY "Allow anon upload audio objects"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'audio');

-- Allow anon role to update (overwrite) audio objects
DROP POLICY IF EXISTS "Allow anon update audio objects" ON storage.objects;
CREATE POLICY "Allow anon update audio objects"
  ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'audio')
  WITH CHECK (bucket_id = 'audio');

-- Allow anon role to select metadata for audio bucket
DROP POLICY IF EXISTS "Allow anon read audio objects" ON storage.objects;
CREATE POLICY "Allow anon read audio objects"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'audio');
