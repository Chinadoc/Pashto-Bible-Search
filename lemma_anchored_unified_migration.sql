-- 🎯 LEMMA-ANCHORED UNIFIED PASHTO BIBLE SEARCH MIGRATION
-- This migration transforms your existing schema into a truly unified system
-- anchored on lemmas with comprehensive POS tracking and morphological analysis

-- ============================================================================
-- 1. ADD LEMMAS + POS PROVENANCE (stable keys + confidence tracking)
-- ============================================================================

-- Canonical headwords (one row per lemma)
CREATE TABLE IF NOT EXISTS public.lemmas (
  id BIGSERIAL PRIMARY KEY,
  headword_pashto TEXT NOT NULL,
  headword_roman TEXT,
  pos TEXT,                        -- if known from dictionary
  meta JSONB DEFAULT '{}'          -- {transitivity, valency, dictionary_ids: [...]}
);
CREATE UNIQUE INDEX IF NOT EXISTS lemmas_headword_idx
  ON lemmas (headword_pashto);

-- Link your master forms to lemmas (replace the TEXT lemma_id)
ALTER TABLE public.word_forms_master
  ADD COLUMN IF NOT EXISTS lemma_id BIGINT REFERENCES lemmas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pos_final TEXT,                 -- the POS we expose
  ADD COLUMN IF NOT EXISTS pos_source TEXT,                -- 'dictionary' | 'morph_guess' | 'manual'
  ADD COLUMN IF NOT EXISTS pos_confidence REAL DEFAULT 0;  -- 0..1
-- keep morphology JSONB you already have
CREATE INDEX IF NOT EXISTS word_forms_master_lemma_idx ON word_forms_master (lemma_id);

-- ============================================================================
-- 2. NORMALIZE & FUZZY INDEXES (fast joins and resilient search)
-- ============================================================================

-- Normalized surface for robust matching
ALTER TABLE public.word_forms_master
  ADD COLUMN IF NOT EXISTS surface_norm TEXT GENERATED ALWAYS AS (
    unaccent(upper(regexp_replace(form_pashto, '\s+', ' ', 'g')))
  ) STORED;

CREATE INDEX IF NOT EXISTS wfm_trgm ON public.word_forms_master USING GIN (form_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS wfm_norm_trgm ON public.word_forms_master USING GIN (surface_norm gin_trgm_ops);

-- Phrases too
ALTER TABLE public.phrase_forms
  ADD COLUMN IF NOT EXISTS phrase_norm TEXT GENERATED ALWAYS AS (
    unaccent(upper(regexp_replace(phrase_pashto, '\s+', ' ', 'g')))
  ) STORED;
CREATE INDEX IF NOT EXISTS pf_trgm ON public.phrase_forms USING GIN (phrase_norm gin_trgm_ops);

-- ============================================================================
-- 3. BRIDGE TO DICTIONARY (first source of truth)
-- ============================================================================

-- Optional: explicit bridge so we can store multiple dictionary IDs per lemma
CREATE TABLE IF NOT EXISTS public.lemma_dictionary_links (
  lemma_id BIGINT REFERENCES lemmas(id) ON DELETE CASCADE,
  dictionary_id BIGINT,
  PRIMARY KEY (lemma_id, dictionary_id)
);

-- ============================================================================
-- 4. MORPHOLOGICAL GUESS FUNCTION (when dictionary is missing)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.guess_pos_and_features(p_text TEXT)
RETURNS JSONB LANGUAGE sql IMMUTABLE AS $$
  WITH t AS (
    SELECT p_text AS f,
           right(p_text, 2) AS last2,
           right(p_text, 1) AS last1
  )
  SELECT
    CASE
      -- very common Pashto verb endings (present/past/imperative snapshots)
      WHEN t.f ~ '(وم|وو|وې|وئ|وي|شه|ږه| کړه| کړم| کړي| وکړم| وکړي| ووهه| وهه)$' THEN
        jsonb_build_object('pos','verb','pos_conf',0.75,
                           'inflection', 'finite_or_imp',
                           'hints', jsonb_build_array('ending','aux','kr-','wah-'))
      -- participles & PP-like
      WHEN t.f ~ '(شوی|کړی|وهلی|کړلې| شوې)$' THEN
        jsonb_build_object('pos','verb','pos_conf',0.85,'inflection','participle')
      -- plurals & adjective endings (very rough, ok for fallback)
      WHEN t.f ~ '(ونه|ان|ګان|گان|ې|ه|ي)$' THEN
        jsonb_build_object('pos','noun_or_adj','pos_conf',0.6)
      ELSE
        jsonb_build_object('pos','unknown','pos_conf',0.3)
    END
  FROM t;
$$;

-- ============================================================================
-- 5. ONE UNIFIED, QUERY-READY MATERIALIZED VIEW
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS public.unified_search_mv AS
WITH wf AS (
  SELECT
    w.id               AS item_id,
    false              AS is_phrase,
    w.form_pashto      AS surface,
    w.form_romanized   AS roman,
    w.surface_norm     AS surface_norm,
    w.lemma_id,
    w.pos_final        AS pos,
    w.pos_source,
    w.pos_confidence,
    w.morphology,
    w.total_frequency,
    w.ot_frequency,
    w.nt_frequency,
    COUNT(DISTINCT vo.id)         AS occurrence_count,
    COUNT(DISTINCT CASE WHEN vo.testament='OT' THEN vo.id END) AS occurrence_ot,
    COUNT(DISTINCT CASE WHEN vo.testament='NT' THEN vo.id END) AS occurrence_nt,
    array_agg(DISTINCT (vo.book || ':' || vo.chapter || ':' || vo.verse)) FILTER (WHERE vo.id IS NOT NULL)
      AS verses
  FROM word_forms_master w
  LEFT JOIN verse_occurrences vo ON vo.word_form_id = w.id
  GROUP BY w.id
),
pf AS (
  SELECT
    p.id               AS item_id,
    true               AS is_phrase,
    p.phrase_pashto    AS surface,
    p.phrase_romanized AS roman,
    p.phrase_norm      AS surface_norm,
    NULL::BIGINT       AS lemma_id,
    'phrase'           AS pos,
    'derived'          AS pos_source,
    1.0                AS pos_confidence,
    p.morphology       AS morphology,
    p.total_occurrences     AS total_frequency,
    p.ot_occurrences        AS ot_frequency,
    p.nt_occurrences        AS nt_frequency,
    COUNT(DISTINCT po.id)   AS occurrence_count,
    COUNT(DISTINCT CASE WHEN po.testament='OT' THEN po.id END) AS occurrence_ot,
    COUNT(DISTINCT CASE WHEN po.testament='NT' THEN po.id END) AS occurrence_nt,
    array_agg(DISTINCT (po.book || ':' || po.chapter || ':' || po.verse)) FILTER (WHERE po.id IS NOT NULL)
      AS verses
  FROM phrase_forms p
  LEFT JOIN phrase_occurrences po ON po.phrase_form_id = p.id
  GROUP BY p.id
)
SELECT * FROM wf
UNION ALL
SELECT * FROM pf;

CREATE INDEX IF NOT EXISTS unified_mv_trgm ON public.unified_search_mv USING GIN (surface gin_trgm_ops);
CREATE INDEX IF NOT EXISTS unified_mv_norm_trgm ON public.unified_search_mv USING GIN (surface_norm gin_trgm_ops);
CREATE INDEX IF NOT EXISTS unified_mv_freq ON public.unified_search_mv (total_frequency DESC);

-- ============================================================================
-- 6. SINGLE SEARCH ENTRY POINT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_unified(q TEXT, k INT DEFAULT 25)
RETURNS TABLE (
  surface TEXT,
  roman TEXT,
  is_phrase BOOLEAN,
  pos TEXT,
  pos_source TEXT,
  pos_confidence REAL,
  morphology JSONB,
  total_frequency INT,
  occurrence_count INT,
  verses TEXT[]
) LANGUAGE sql STABLE AS $$
  SELECT
    surface, roman, is_phrase, pos, pos_source, pos_confidence,
    morphology, total_frequency, occurrence_count, verses
  FROM public.unified_search_mv
  WHERE surface % q OR surface_norm % unaccent(upper(q))
  ORDER BY similarity(surface, q) DESC, total_frequency DESC
  LIMIT k;
$$;

-- ============================================================================
-- 7. REFRESH HELPERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_unified_search_mv()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.unified_search_mv;
END; $$;

-- ============================================================================
-- 8. BACKFILL PIPELINE: dictionary → lemmas → forms → POS guess
-- ============================================================================

-- 1) Seed lemmas from dictionary (no duplicates)
INSERT INTO lemmas (headword_pashto, headword_roman, pos, meta)
SELECT DISTINCT d.headword, NULL, d.pos, jsonb_build_object('dictionary_ids', jsonb_build_array(d.id))
FROM dictionary d
ON CONFLICT (headword_pashto) DO NOTHING;

-- 2) Link forms to lemmas by exact headword match first
UPDATE word_forms_master w
SET lemma_id = l.id,
    pos_final = COALESCE(l.pos, w.pos_final),
    pos_source = CASE WHEN l.pos IS NOT NULL THEN 'dictionary' ELSE w.pos_source END,
    pos_confidence = CASE WHEN l.pos IS NOT NULL THEN 1.0 ELSE w.pos_confidence END
FROM lemmas l
WHERE w.lemma_id IS NULL
  AND w.form_pashto = l.headword_pashto;

-- 3) Fuzzy link if still missing (normalized)
UPDATE word_forms_master w
SET lemma_id = l.id
FROM lemmas l
WHERE w.lemma_id IS NULL
  AND l.headword_pashto % w.form_pashto  -- trigram
  AND similarity(l.headword_pashto, w.form_pashto) > 0.55;

-- 4) Apply the guess where we still have no POS
UPDATE word_forms_master w
SET pos_final = (g->>'pos'),
    pos_source = COALESCE(w.pos_source, 'morph_guess'),
    pos_confidence = COALESCE(NULLIF((g->>'pos_conf')::real, NULL), 0.5),
    morphology = COALESCE(w.morphology,'{}'::jsonb) || jsonb_build_object('guess', g)
FROM LATERAL guess_pos_and_features(w.form_pashto) AS g
WHERE w.pos_final IS NULL;

-- 5) Populate the unified view
REFRESH MATERIALIZED VIEW public.unified_search_mv;

-- ============================================================================
-- 9. GRANTS
-- ============================================================================

GRANT SELECT ON lemmas TO anon;
GRANT SELECT ON lemma_dictionary_links TO anon;
GRANT SELECT ON unified_search_mv TO anon;
GRANT EXECUTE ON FUNCTION guess_pos_and_features(text) TO anon;
GRANT EXECUTE ON FUNCTION search_unified(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION refresh_unified_search_mv() TO anon;

-- ============================================================================
-- 10. COMMENTS
-- ============================================================================

COMMENT ON TABLE lemmas IS 'Canonical headwords that forms and phrases link to';
COMMENT ON TABLE lemma_dictionary_links IS 'Explicit bridge to dictionary entries';
COMMENT ON MATERIALIZED VIEW unified_search_mv IS 'Single unified view: forms + phrases + frequencies + verses';
COMMENT ON FUNCTION search_unified IS 'Primary search function - returns everything in one call';
COMMENT ON FUNCTION guess_pos_and_features IS 'Lightweight morphological guesser for unknown words';
