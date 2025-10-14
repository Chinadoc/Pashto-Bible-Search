-- Backfill public.verses.audio_filename using Supabase Storage 'audio' bucket
-- and public.audio_mappings. Handles both 1john/john1 and 1corinthians/corinthians1 forms.

-- 1) From Storage objects (authoritative)
with v as (
  select id,
         lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) as slug,
         chapter,
         verse
  from public.verses
), cand as (
  select id,
         (slug || chapter || '_verse_' || verse || '.mp3') as f1,
         (regexp_replace(slug, '^(\\d)([a-z].*)', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') as f2,
         (regexp_replace(slug, '^([a-z]+?)(\\d)$', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') as f3
  from v
), stor as (
  select name from storage.objects where bucket_id = 'audio'
)
update public.verses t
set audio_filename = s.name
from cand c
join stor s on s.name in (c.f1, c.f2, c.f3)
where t.id = c.id
  and coalesce(t.audio_filename, '') <> s.name;

-- 2) From audio_mappings (fallback if some were inserted via mapping only)
with v as (
  select id,
         lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) as slug,
         chapter,
         verse
  from public.verses
), cand as (
  select id,
         (slug || chapter || '_verse_' || verse || '.mp3') as f1,
         (regexp_replace(slug, '^(\\d)([a-z].*)', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') as f2,
         (regexp_replace(slug, '^([a-z]+?)(\\d)$', '\\2\\1') || chapter || '_verse_' || verse || '.mp3') as f3
  from v
)
update public.verses t
set audio_filename = am.verse_reference
from cand c
join public.audio_mappings am on am.verse_reference in (c.f1, c.f2, c.f3)
where t.id = c.id
  and coalesce(t.audio_filename, '') = '';

-- 3) Optional: list verses still missing audio filenames
-- select book, chapter, verse
-- from public.verses
-- where coalesce(audio_filename, '') = ''
-- order by book, chapter, verse
-- limit 200;

