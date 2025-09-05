-- Quick fix: Disable RLS temporarily for audio bucket
-- WARNING: This makes the bucket public! Use only for testing.

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or create a simple policy that allows everything for anon:
-- DROP POLICY IF EXISTS "Allow all anon operations on audio" ON storage.objects;
-- CREATE POLICY "Allow all anon operations on audio"
--   ON storage.objects
--   FOR ALL
--   TO anon
--   USING (bucket_id = 'audio')
--   WITH CHECK (bucket_id = 'audio');
