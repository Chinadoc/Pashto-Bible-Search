-- First, let's see what the current audio_by_verse view looks like
SELECT * FROM audio_by_verse LIMIT 1;

-- If it has the wrong structure, drop and recreate it
DROP VIEW IF EXISTS audio_by_verse;

-- Create the correct view structure
CREATE VIEW audio_by_verse AS
SELECT
  v.book || ' ' || v.chapter::text || ':' || v.verse::text as verse_ref,
  NULL as url -- Placeholder for audio URLs, can be populated later
FROM verses v
WHERE v.book IS NOT NULL AND v.chapter IS NOT NULL AND v.verse IS NOT NULL;

-- Verify the new structure
SELECT * FROM audio_by_verse LIMIT 1;
