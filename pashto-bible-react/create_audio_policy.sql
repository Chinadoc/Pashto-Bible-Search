-- Quick policy setup for audio bucket uploads
-- Run this in Supabase SQL Editor if you prefer SQL over the UI

-- Allow anonymous users to upload to audio bucket
CREATE POLICY "Allow anon upload to audio bucket"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'audio');

-- Allow anonymous users to update/overwrite audio files
CREATE POLICY "Allow anon update audio bucket"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'audio')
WITH CHECK (bucket_id = 'audio');

-- Allow anonymous users to read/list audio files
CREATE POLICY "Allow anon read audio bucket"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'audio');

-- Optional: Allow anonymous users to delete audio files
CREATE POLICY "Allow anon delete audio bucket"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'audio');
