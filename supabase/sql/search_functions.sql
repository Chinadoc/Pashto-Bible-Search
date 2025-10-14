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

-- Comprehensive verb conjugation indexing
-- Populate irregular_verbs table with LingDocs-style conjugations
insert into irregular_verbs (verb_root, roots, stems, past_participle, notes)
values
(
  'وهل',
  '{
    "imperfective": "وهل",
    "perfective": "ووهل"
  }',
  '{
    "imperfective": "وهـ",
    "perfective": "ووهـ"
  }',
  'وهلی',
  'Transitive verb: to hit, strike. Comprehensive conjugation including all tenses, aspects, and moods.'
)
on conflict (verb_root) do nothing;

-- Function to generate comprehensive verb conjugations for indexing
create or replace function public.generate_comprehensive_conjugations(
  verb_root text,
  include_related boolean default true
)
returns table (
  form text,
  category text,
  person text,
  tense text,
  aspect text,
  mood text
)
language plpgsql
stable
as $$
declare
  irreg_verb record;
  imperfective_stem text;
  perfective_stem text;
  past_participle text;
  present_endings text[] := array['م', 'و', 'ې', 'ې', 'ي', 'ي'];
  past_endings text[] := array['لم', 'لو', 'لې', 'لې', 'ل', 'له'];
  imperative_endings text[] := array['ه', 'ئ'];
  equative_endings record;
begin
  -- Get irregular verb data if exists
  select * into irreg_verb from irregular_verbs where verb_root = generate_comprehensive_conjugations.verb_root;

  if found then
    imperfective_stem := irreg_verb.stems->>'imperfective';
    perfective_stem := irreg_verb.stems->>'perfective';
    past_participle := irreg_verb.past_participle;
  else
    -- Regular patterns
    imperfective_stem := verb_root || 'ـ';
    perfective_stem := 'و' || verb_root || 'ـ';
    past_participle := verb_root || 'ی';
  end if;

  -- Present tense (imperfective stem + present endings)
  for i in 1..6 loop
    return query select
      imperfective_stem || present_endings[i],
      'present',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'present',
      'imperfective',
      'indicative';
  end loop;

  -- Subjunctive (perfective stem + present endings)
  for i in 1..6 loop
    return query select
      perfective_stem || present_endings[i],
      'subjunctive',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'subjunctive',
      'perfective',
      'indicative';
  end loop;

  -- Future (ba + present/subjunctive)
  for i in 1..6 loop
    return query select
      'به ' || imperfective_stem || present_endings[i],
      'future',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'future',
      'imperfective',
      'indicative';

    return query select
      'به ' || perfective_stem || present_endings[i],
      'future',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'future',
      'perfective',
      'indicative';
  end loop;

  -- Past tenses (root + past endings)
  for i in 1..6 loop
    return query select
      verb_root || past_endings[i],
      'past',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'past',
      'imperfective',
      'indicative';
  end loop;

  -- Perfect tenses (past participle + equative endings)
  equative_endings := json_build_object(
    'present', array['یم', 'یو', 'یې', 'یې', 'دی', 'ده'],
    'habitual', array['یم', 'یو', 'یې', 'یې', 'وي', 'وي'],
    'subjunctive', array['وم', 'وو', 'وې', 'وې', 'وي', 'وي'],
    'past', array['وم', 'وو', 'وې', 'وې', 'و', 'وه'],
    'future', array['یم', 'یو', 'یې', 'یې', 'وي', 'وي']
  );

  for tense_type, endings in select * from json_each_text(equative_endings) loop
    for i in 1..6 loop
      return query select
        past_participle || ' ' || endings[i],
        'perfect',
        case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
        tense_type,
        'perfect',
        'indicative';
    end loop;
  end loop;

  -- Imperative forms
  for i in 1..2 loop
    return query select
      imperfective_stem || imperative_endings[i],
      'imperative',
      case i when 1 then '2nd' when 2 then '2nd' end,
      'imperative',
      'imperfective',
      'imperative';

    return query select
      perfective_stem || imperative_endings[i],
      'imperative',
      case i when 1 then '2nd' when 2 then '2nd' end,
      'imperative',
      'perfective',
      'imperative';
  end loop;

  -- Ability forms
  for i in 1..6 loop
    return query select
      past_participle || ' شـ' || present_endings[i],
      'ability',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'present',
      'perfect',
      'ability';
  end loop;

  -- Habitual forms (ba + past)
  for i in 1..6 loop
    return query select
      'به ' || verb_root || past_endings[i],
      'habitual',
      case i when 1 then '1st' when 2 then '1st' when 3 then '2nd' when 4 then '2nd' when 5 then '3rd' when 6 then '3rd' end,
      'past',
      'imperfective',
      'habitual';
  end loop;
end;
$$;

-- Grant permissions
grant execute on function public.generate_comprehensive_conjugations(text, boolean) to anon;
