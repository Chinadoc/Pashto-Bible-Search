-- Supabase Migrations for Pashto Bible Search Performance
-- Run these in your Supabase SQL editor or via psql

-- Enable pg_trgm extension for fast fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Performance indexes for verses table
CREATE INDEX IF NOT EXISTS verses_text_trgm_idx ON public.verses USING GIN (text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS verses_testament_idx ON public.verses (testament);
CREATE INDEX IF NOT EXISTS verses_ref_idx ON public.verses (book, chapter, verse);
CREATE INDEX IF NOT EXISTS verses_book_idx ON public.verses (book);

-- Performance indexes for form_to_root_map table (if exists)
CREATE INDEX IF NOT EXISTS form_to_root_map_form_idx ON public.form_to_root_map (form);
CREATE INDEX IF NOT EXISTS form_to_root_map_root_idx ON public.form_to_root_map (root);
CREATE INDEX IF NOT EXISTS form_to_root_map_form_trgm_idx ON public.form_to_root_map USING GIN (form gin_trgm_ops);
CREATE INDEX IF NOT EXISTS form_to_root_map_root_trgm_idx ON public.form_to_root_map USING GIN (root gin_trgm_ops);

-- Performance indexes for inflections table (if exists)
CREATE INDEX IF NOT EXISTS inflections_root_idx ON public.inflections (root);
CREATE INDEX IF NOT EXISTS inflections_form_idx ON public.inflections (form);
CREATE INDEX IF NOT EXISTS inflections_root_form_idx ON public.inflections (root, form);

-- Performance index for word_frequencies (used for related forms counts)
CREATE INDEX IF NOT EXISTS word_frequencies_word_idx ON public.word_frequencies (pashto_word);

-- Optional: basic indexes on lexicon lookup field used for POS grouping
CREATE INDEX IF NOT EXISTS verbs_lexicon_p_norm_idx ON public.verbs_lexicon (p_norm);
CREATE INDEX IF NOT EXISTS nouns_lexicon_p_norm_idx ON public.nouns_lexicon (p_norm);

-- Optional: Create a materialized view for faster form counts (if you want to track occurrence counts)
-- CREATE MATERIALIZED VIEW IF NOT EXISTS form_occurrences AS
-- SELECT form, COUNT(*) as occurrence_count
-- FROM verses,
-- LATERAL unnest(string_to_array(regexp_replace(text, '[^\u0600-\u06FF\s]', '', 'g'), ' ')) as form
-- WHERE form != ''
-- GROUP BY form
-- ORDER BY occurrence_count DESC;
--
-- CREATE INDEX IF NOT EXISTS form_occurrences_form_idx ON public.form_occurrences (form);
-- CREATE INDEX IF NOT EXISTS form_occurrences_count_idx ON public.form_occurrences (occurrence_count DESC);

-- Storage policies for 'audio' bucket to allow signed URL generation and object listing via anon key
-- Note: Ensure the 'audio' bucket exists and is private.
-- select storage.create_bucket('audio', false); -- run once if not created (false = private)

-- Enable RLS on storage.objects (enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anon role to select metadata for audio bucket (required for list + signed URLs)
DROP POLICY IF EXISTS "Allow anon read audio objects" ON storage.objects;
CREATE POLICY "Allow anon read audio objects"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'audio');

-- Optional: Narrow to mp3 files only
-- AND (storage.foldername(name) IS NULL OR right(name, 4) = '.mp3')
