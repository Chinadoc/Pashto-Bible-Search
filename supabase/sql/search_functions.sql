-- Enable trigram extension if missing
create extension if not exists pg_trgm with schema public;

-- Fuzzy search using pg_trgm similarity
-- Usage (REST): /rest/v1/rpc/search_verses_similar
-- body: { q: "query text", scope: "all"|"ot"|"nt", max_results: 100 }
create or replace function public.search_verses_similar(
  q text,
  scope text default 'all',
  max_results integer default 100
)
returns table (
  book text,
  chapter int,
  verse int,
  text text,
  testament text,
  score real
)
language sql
stable
as $$
  select v.book, v.chapter, v.verse, v.text, v.testament,
         similarity(v.text, q) as score
  from public.verses v
  where (scope = 'all' or v.testament = upper(scope))
    and v.text % q
  order by score desc
  limit max_results;
$$;

-- Allow public read (REST RPC) — adjust as needed
grant execute on function public.search_verses_similar(text, text, integer) to anon;
