-- Normalize mis-labeled books (e.g., Gospel of John rows stored as "1 John")
-- PREVIEW: count suspicious rows where 1 John has chapter > 5 (1 John has only 5 chapters)
select book, chapter, count(*) as rows
from public.verses
where lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) in ('1john','1-john','1john')
  and chapter > 5
group by book, chapter
order by chapter;

-- FIX: convert those rows to Gospel of John
update public.verses
set book = 'John'
where lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) in ('1john','1-john','1john')
  and chapter > 5;

-- OPTIONAL: preview rows that might have the opposite problem (Gospel of John mislabeled that should be 1 John).
-- This is risky to auto-fix; review before updating.
-- select book, chapter, count(*)
-- from public.verses
-- where lower(regexp_replace(book, '[^a-z0-9]', '', 'g')) = 'john'
--   and chapter <= 5
-- group by book, chapter
-- order by chapter;

