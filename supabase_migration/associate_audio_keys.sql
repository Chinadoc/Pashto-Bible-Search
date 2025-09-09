-- Associate Supabase Storage audio filenames with each verse row (NT only)
-- and create a friendly view name for Studio/REST.

-- Safety: ensure the column exists
ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS audio_filename text;

-- Optional helper: a computed flag to indicate if a verse has audio
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'verses' AND column_name = 'has_audio'
  ) THEN
    ALTER TABLE public.verses
      ADD COLUMN has_audio boolean GENERATED ALWAYS AS ((testament = 'NT'::text) AND (audio_filename IS NOT NULL)) STORED;
  END IF;
END $$;

-- 1) Prefer authoritative storage objects (bucket 'audio'); update only NT
WITH v AS (
  SELECT id,
         lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) AS slug,
         chapter,
         verse
  FROM public.verses
  WHERE testament = 'NT'
), cand AS (
  SELECT id,
         (slug || chapter || '_verse_' || verse || '.mp3') AS f1,
         (regexp_replace(slug, '^(\\d)([a-z].*)', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') AS f2,
         (regexp_replace(slug, '^([a-z]+?)(\\d)$', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') AS f3
  FROM v
), stor AS (
  SELECT name FROM storage.objects WHERE bucket_id = 'audio'
)
UPDATE public.verses t
SET audio_filename = s.name
FROM cand c
JOIN stor s ON s.name IN (c.f1, c.f2, c.f3)
WHERE t.id = c.id
  AND coalesce(t.audio_filename, '') <> s.name;

-- 2) Fallback from audio_mappings (if any legacy rows exist)
WITH v AS (
  SELECT id,
         lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) AS slug,
         chapter,
         verse
  FROM public.verses
  WHERE testament = 'NT'
), cand AS (
  SELECT id,
         (slug || chapter || '_verse_' || verse || '.mp3') AS f1,
         (regexp_replace(slug, '^(\\d)([a-z].*)', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') AS f2,
         (regexp_replace(slug, '^([a-z]+?)(\\d)$', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') AS f3
  FROM v
)
UPDATE public.verses t
SET audio_filename = am.verse_reference
FROM cand c
JOIN public.audio_mappings am ON am.verse_reference IN (c.f1, c.f2, c.f3)
WHERE t.id = c.id
  AND coalesce(t.audio_filename, '') = '';

-- 3) Create a friendlier view name for Studio/REST (read-only)
--    We keep the canonical table name 'verses' for app compatibility.
CREATE OR REPLACE VIEW public.afghan_2023_bible_nt_ot AS
SELECT
  v.*,
  (v.testament = 'NT'::text AND v.audio_filename IS NOT NULL) AS has_audio
FROM public.verses v;

COMMENT ON VIEW public.afghan_2023_bible_nt_ot IS 'Afghan 2023 Bible (NT + OT). NT has audio when has_audio=true.';

-- 4) Optional quick checks
-- SELECT count(*) FROM public.afghan_2023_bible_nt_ot WHERE testament='NT' AND audio_filename IS NOT NULL;
-- SELECT book, chapter, verse FROM public.afghan_2023_bible_nt_ot WHERE testament='NT' AND audio_filename IS NULL LIMIT 50;

