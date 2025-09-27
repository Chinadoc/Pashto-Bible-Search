-- ========================================
-- ADVANCED UNIFIED PASHTO BIBLE SEARCH SCHEMA
-- ========================================
-- Enhanced schema addressing compound verbs, multi-token forms, and Pashto morphology
-- Based on expert review incorporating lemma separation and morphological features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ========================================
-- 1. LEMMAS (Separated from forms)
-- ========================================

CREATE TABLE IF NOT EXISTS public.lemmas (
  id BIGSERIAL PRIMARY KEY,
  headword_pashto TEXT NOT NULL,
  headword_roman TEXT,
  pos TEXT NOT NULL,              -- verb, noun, adj, aux, particle
  meta JSONB DEFAULT '{}',        -- transitivity, valency, notes, dictionary ids
  UNIQUE(headword_pashto, pos)
);

-- ========================================
-- 2. WORD FORMS (Single tokens with features)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_forms (
  id BIGSERIAL PRIMARY KEY,
  form_pashto TEXT NOT NULL,
  form_romanized TEXT,
  surface_norm TEXT GENERATED ALWAYS AS (
    regexp_replace(regexp_replace(form_pashto, E'\u0640', '', 'g'), '\s+', ' ', 'g')
  ) STORED,                       -- Normalized surface form
  lemma_id BIGINT REFERENCES lemmas(id) ON DELETE CASCADE,
  features JSONB DEFAULT '{}',    -- {"tam":"prs","mood":"ind","person":1,"number":"sg"}
  frequency_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  UNIQUE(form_pashto, lemma_id)
);

-- ========================================
-- 3. PHRASE FORMS (Multi-token morphology)
-- ========================================

CREATE TABLE IF NOT EXISTS public.phrase_forms (
  id BIGSERIAL PRIMARY KEY,
  phrase_pashto TEXT NOT NULL,
  lemma_id BIGINT REFERENCES lemmas(id) ON DELETE CASCADE,
  token_count SMALLINT NOT NULL,   -- 2, 3, etc.
  features JSONB DEFAULT '{}',     -- {tense:"perf", polarity:"neg", series:"perfect"}
  UNIQUE(phrase_pashto, lemma_id)
);

-- ========================================
-- 4. MORPHOLOGICAL RELATIONSHIPS (Between lemmas)
-- ========================================

CREATE TABLE IF NOT EXISTS public.lemma_relations (
  id BIGSERIAL PRIMARY KEY,
  src_lemma_id BIGINT NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  dst_lemma_id BIGINT NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  rel TEXT NOT NULL,              -- "compound-of", "aux-of", "derivation-of", "alias-of"
  weight REAL DEFAULT 1.0,
  UNIQUE(src_lemma_id, dst_lemma_id, rel)
);

-- ========================================
-- 5. VERSES (Enhanced with testament info)
-- ========================================

CREATE TABLE IF NOT EXISTS public.verses (
  id BIGSERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  UNIQUE(book, chapter, verse)
);

-- ========================================
-- 6. OCCURRENCES (Single and multi-token)
-- ========================================

CREATE TABLE IF NOT EXISTS public.word_occurrences (
  id BIGSERIAL PRIMARY KEY,
  word_form_id BIGINT REFERENCES word_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  position_in_verse INTEGER,
  UNIQUE(word_form_id, verse_id, position_in_verse)
);

CREATE TABLE IF NOT EXISTS public.phrase_occurrences (
  id BIGSERIAL PRIMARY KEY,
  phrase_id BIGINT REFERENCES phrase_forms(id) ON DELETE CASCADE,
  verse_id BIGINT REFERENCES verses(id) ON DELETE CASCADE,
  start_pos INTEGER NOT NULL,     -- Token index where phrase starts
  UNIQUE(phrase_id, verse_id, start_pos)
);

-- ========================================
-- 7. MATERIALIZED STATS (For consistent counts)
-- ========================================

CREATE MATERIALIZED VIEW IF NOT EXISTS word_form_stats AS
SELECT
  wf.id,
  COUNT(*)::INTEGER AS frequency_count,
  COUNT(DISTINCT wo.verse_id)::INTEGER AS verse_count
FROM word_forms wf
LEFT JOIN word_occurrences wo ON wo.word_form_id = wf.id
GROUP BY wf.id;

CREATE MATERIALIZED VIEW IF NOT EXISTS phrase_form_stats AS
SELECT
  pf.id,
  COUNT(*)::INTEGER AS frequency_count,
  COUNT(DISTINCT po.verse_id)::INTEGER AS verse_count
FROM phrase_forms pf
LEFT JOIN phrase_occurrences po ON po.phrase_id = pf.id
GROUP BY pf.id;

-- ========================================
-- 8. PERFORMANCE INDEXES
-- ========================================

-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_word_forms_search ON word_forms USING GIN (surface_norm gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_lemma ON word_forms (lemma_id);
CREATE INDEX IF NOT EXISTS idx_word_forms_features ON word_forms USING GIN (features jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_word_forms_stats ON word_form_stats (frequency_count DESC);

-- Phrase indexes
CREATE INDEX IF NOT EXISTS idx_phrase_forms_search ON phrase_forms USING GIN (phrase_pashto gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_phrase_forms_features ON phrase_forms USING GIN (features jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_phrase_occurrences_verse ON phrase_occurrences (verse_id);

-- Lemma indexes
CREATE INDEX IF NOT EXISTS idx_lemmas_pos ON lemmas (pos);
CREATE INDEX IF NOT EXISTS idx_lemmas_headword ON lemmas (headword_pashto);

-- Relationship indexes
CREATE INDEX IF NOT EXISTS idx_lemma_rel_src ON lemma_relations (src_lemma_id);
CREATE INDEX IF NOT EXISTS idx_lemma_rel_dst ON lemma_relations (dst_lemma_id);

-- Verse indexes
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses (book, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_testament ON verses (testament);

-- ========================================
-- 9. AUTOMATIC UPDATES
-- ========================================

CREATE OR REPLACE FUNCTION update_word_form_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    COALESCE(NEW.form_pashto, '') || ' ' ||
    COALESCE(NEW.form_romanized, '') || ' ' ||
    COALESCE(NEW.surface_norm, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_word_form_search_vector
  BEFORE INSERT OR UPDATE ON word_forms
  FOR EACH ROW EXECUTE FUNCTION update_word_form_search_vector();

-- ========================================
-- 10. CORE SEARCH FUNCTIONS
-- ========================================

-- 10.1 Enhanced search with lemma resolution and phrase support
CREATE OR REPLACE FUNCTION search_word_with_forms(q TEXT)
RETURNS TABLE (
  lemma_id BIGINT,
  headword TEXT,
  form TEXT,
  is_phrase BOOLEAN,
  features JSONB,
  frequency_count INTEGER,
  verse_count INTEGER
) AS $$
WITH cand_lemmas AS (
  -- Find lemmas by exact match, normalized match, or fuzzy match
  SELECT DISTINCT l.id as lemma_id
  FROM lemmas l
  WHERE l.headword_pashto = q
     OR l.headword_pashto % q
     OR EXISTS (
       SELECT 1 FROM word_forms wf
       WHERE wf.lemma_id = l.id
         AND (wf.form_pashto = q OR wf.surface_norm = q OR wf.form_pashto % q)
     )
)
SELECT
  cl.lemma_id,
  l.headword_pashto,
  wf.form_pashto as form,
  false as is_phrase,
  wf.features,
  COALESCE(wfs.frequency_count, 0) as frequency_count,
  COALESCE(wfs.verse_count, 0) as verse_count
FROM cand_lemmas cl
JOIN lemmas l ON l.id = cl.lemma_id
JOIN word_forms wf ON wf.lemma_id = cl.lemma_id
LEFT JOIN word_form_stats wfs ON wfs.id = wf.id
UNION ALL
SELECT
  cl.lemma_id,
  l.headword_pashto,
  pf.phrase_pashto,
  true as is_phrase,
  pf.features,
  COALESCE(pfs.frequency_count, 0) as frequency_count,
  COALESCE(pfs.verse_count, 0) as verse_count
FROM cand_lemmas cl
JOIN lemmas l ON l.id = cl.lemma_id
JOIN phrase_forms pf ON pf.lemma_id = cl.lemma_id
LEFT JOIN phrase_form_stats pfs ON pfs.id = pf.id;
$$ LANGUAGE sql;

-- 10.2 Optimized fuzzy search using % operator
CREATE OR REPLACE FUNCTION fuzzy_search_words(search_term TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (
  form_pashto TEXT,
  is_phrase BOOLEAN,
  similarity_score REAL,
  frequency_count INTEGER,
  lemma_id BIGINT
) AS $$
SELECT
  form_pashto,
  is_phrase,
  similarity_score,
  frequency_count,
  lemma_id
FROM (
  -- Search word forms
  SELECT
    wf.form_pashto,
    false as is_phrase,
    similarity(wf.surface_norm, search_term) as similarity_score,
    COALESCE(wfs.frequency_count, 0) as frequency_count,
    wf.lemma_id
  FROM word_forms wf
  LEFT JOIN word_form_stats wfs ON wfs.id = wf.id
  WHERE wf.surface_norm % search_term
  UNION ALL
  -- Search phrase forms
  SELECT
    pf.phrase_pashto,
    true as is_phrase,
    similarity(pf.phrase_pashto, search_term) as similarity_score,
    COALESCE(pfs.frequency_count, 0) as frequency_count,
    pf.lemma_id
  FROM phrase_forms pf
  LEFT JOIN phrase_form_stats pfs ON pfs.id = pf.id
  WHERE pf.phrase_pashto % search_term
) combined_results
ORDER BY similarity_score DESC, frequency_count DESC
LIMIT max_results;
$$ LANGUAGE sql;

-- 10.3 Enhanced morphological search with JSONB features
CREATE OR REPLACE FUNCTION morphological_search(
  search_term TEXT,
  pos_filter TEXT DEFAULT NULL,
  min_frequency INTEGER DEFAULT 1,
  feature_filters JSONB DEFAULT NULL
)
RETURNS TABLE (
  lemma_id BIGINT,
  headword TEXT,
  form TEXT,
  is_phrase BOOLEAN,
  features JSONB,
  frequency_count INTEGER,
  morphological_score REAL
) AS $$
SELECT
  l.id,
  l.headword_pashto,
  COALESCE(wf.form_pashto, pf.phrase_pashto) as form,
  (pf.id IS NOT NULL) as is_phrase,
  COALESCE(wf.features, pf.features) as features,
  COALESCE(wfs.frequency_count, pfs.frequency_count, 0) as frequency_count,
  (
    -- Base score from frequency
    LEAST(COALESCE(wfs.frequency_count, pfs.frequency_count, 0)::REAL / 1000.0, 1.0) * 0.4 +
    -- Boost for exact matches
    CASE WHEN COALESCE(wf.form_pashto, pf.phrase_pashto) = search_term THEN 1.0 ELSE 0.0 END * 0.6 +
    -- Boost for related forms
    CASE WHEN EXISTS(
      SELECT 1 FROM lemma_relations lr
      WHERE lr.src_lemma_id = l.id OR lr.dst_lemma_id = l.id
    ) THEN 0.8 ELSE 0.0 END
  ) as morphological_score
FROM lemmas l
LEFT JOIN word_forms wf ON wf.lemma_id = l.id
LEFT JOIN phrase_forms pf ON pf.lemma_id = l.id
LEFT JOIN word_form_stats wfs ON wfs.id = wf.id
LEFT JOIN phrase_form_stats pfs ON pfs.id = pf.id
WHERE (
  l.headword_pashto ILIKE '%' || search_term || '%' OR
  wf.form_pashto ILIKE '%' || search_term || '%' OR
  pf.phrase_pashto ILIKE '%' || search_term || '%'
)
AND (pos_filter IS NULL OR l.pos = pos_filter)
AND (feature_filters IS NULL OR COALESCE(wf.features, pf.features) @> feature_filters)
AND COALESCE(wfs.frequency_count, pfs.frequency_count, 0) >= min_frequency
ORDER BY morphological_score DESC, COALESCE(wfs.frequency_count, pfs.frequency_count, 0) DESC;
$$ LANGUAGE sql;

-- 10.4 Get forms for a specific root (with features)
CREATE OR REPLACE FUNCTION get_forms_for_root(root_word TEXT)
RETURNS TABLE (
  lemma_id BIGINT,
  headword TEXT,
  form TEXT,
  is_phrase BOOLEAN,
  features JSONB,
  frequency_count INTEGER
) AS $$
SELECT
  l.id,
  l.headword_pashto,
  COALESCE(wf.form_pashto, pf.phrase_pashto) as form,
  (pf.id IS NOT NULL) as is_phrase,
  COALESCE(wf.features, pf.features) as features,
  COALESCE(wfs.frequency_count, pfs.frequency_count, 0) as frequency_count
FROM lemmas l
LEFT JOIN word_forms wf ON wf.lemma_id = l.id
LEFT JOIN phrase_forms pf ON pf.lemma_id = l.id
LEFT JOIN word_form_stats wfs ON wfs.id = wf.id
LEFT JOIN phrase_form_stats pfs ON pfs.id = pf.id
WHERE l.headword_pashto = root_word
ORDER BY
  CASE WHEN pf.id IS NOT NULL THEN pf.token_count ELSE 1 END,
  COALESCE(wfs.frequency_count, pfs.frequency_count, 0) DESC;
$$ LANGUAGE sql;

-- 10.5 Enhanced autocomplete with romanized support
CREATE OR REPLACE FUNCTION get_frequent_words(limit_count INTEGER DEFAULT 100, include_roman BOOLEAN DEFAULT TRUE)
RETURNS TABLE (
  form_pashto TEXT,
  form_romanized TEXT,
  frequency_count INTEGER,
  is_phrase BOOLEAN
) AS $$
SELECT
  form_pashto,
  form_romanized,
  frequency_count,
  is_phrase
FROM (
  -- Single token forms
  SELECT
    wf.form_pashto,
    wf.form_romanized,
    wfs.frequency_count,
    false as is_phrase
  FROM word_forms wf
  JOIN word_form_stats wfs ON wfs.id = wf.id
  WHERE wfs.frequency_count > 0
  UNION ALL
  -- Include romanized matches if requested
  SELECT
    wf.form_pashto,
    wf.form_romanized,
    wfs.frequency_count,
    false as is_phrase
  FROM word_forms wf
  JOIN word_form_stats wfs ON wfs.id = wf.id
  WHERE include_roman = true
    AND wf.form_romanized IS NOT NULL
    AND wfs.frequency_count > 0
) combined_results
ORDER BY frequency_count DESC
LIMIT limit_count;
$$ LANGUAGE sql;

-- ========================================
-- 11. VIEWS FOR COMPLEX QUERIES
-- ========================================

-- Comprehensive search view
CREATE OR REPLACE VIEW comprehensive_search AS
SELECT
  l.id as lemma_id,
  l.headword_pashto,
  l.pos,
  l.meta,
  -- Single token forms
  array_agg(
    DISTINCT jsonb_build_object(
      'form', wf.form_pashto,
      'romanized', wf.form_romanized,
      'features', wf.features,
      'frequency', wfs.frequency_count,
      'verse_count', wfs.verse_count
    ) ORDER BY wfs.frequency_count DESC
  ) FILTER (WHERE wf.id IS NOT NULL) as single_token_forms,
  -- Phrase forms
  array_agg(
    DISTINCT jsonb_build_object(
      'phrase', pf.phrase_pashto,
      'features', pf.features,
      'frequency', pfs.frequency_count,
      'verse_count', pfs.verse_count,
      'token_count', pf.token_count
    ) ORDER BY pfs.frequency_count DESC
  ) FILTER (WHERE pf.id IS NOT NULL) as phrase_forms,
  -- Related lemmas
  array_agg(
    DISTINCT jsonb_build_object(
      'lemma', rl.headword_pashto,
      'relationship', lr.rel,
      'weight', lr.weight
    )
  ) FILTER (WHERE rl.id IS NOT NULL) as related_lemmas
FROM lemmas l
LEFT JOIN word_forms wf ON wf.lemma_id = l.id
LEFT JOIN phrase_forms pf ON pf.lemma_id = l.id
LEFT JOIN word_form_stats wfs ON wfs.id = wf.id
LEFT JOIN phrase_form_stats pfs ON pfs.id = pf.id
LEFT JOIN lemma_relations lr ON lr.src_lemma_id = l.id OR lr.dst_lemma_id = l.id
LEFT JOIN lemmas rl ON (rl.id = lr.src_lemma_id AND rl.id != l.id) OR (rl.id = lr.dst_lemma_id AND rl.id != l.id)
GROUP BY l.id, l.headword_pashto, l.pos, l.meta;

-- ========================================
-- 12. SAMPLE DATA FOR TESTING
-- ========================================

-- Insert test lemmas
INSERT INTO lemmas (headword_pashto, headword_roman, pos, meta) VALUES
('وهل', 'wahul', 'verb', '{"transitivity":"transitive","valency":"monotransitive"}'),
('کول', 'kawul', 'verb', '{"transitivity":"transitive","valency":"ditransitive"}'),
('ګرمول', 'garmawul', 'verb', '{"compound":"stative","base":"ګرم"}')
ON CONFLICT (headword_pashto, pos) DO NOTHING;

-- Insert test word forms with features
INSERT INTO word_forms (form_pashto, form_romanized, lemma_id, features) VALUES
-- وهل forms
('وهل', 'wahul', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), '{"tam":"inf","mood":"inf"}'),
('وهم', 'wahum', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), '{"tam":"prs","mood":"ind","person":1,"number":"sg"}'),
('وهو', 'wahoo', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), '{"tam":"prs","mood":"ind","person":1,"number":"pl"}'),
('وهې', 'wahe', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), '{"tam":"prs","mood":"ind","person":2,"number":"sg"}'),
('وهي', 'wahee', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), '{"tam":"prs","mood":"ind","person":3,"number":"sg"}'),
-- کول forms
('کول', 'kawul', (SELECT id FROM lemmas WHERE headword_pashto = 'کول'), '{"tam":"inf","mood":"inf"}'),
('کوم', 'koom', (SELECT id FROM lemmas WHERE headword_pashto = 'کول'), '{"tam":"prs","mood":"ind","person":1,"number":"sg"}')
ON CONFLICT (form_pashto, lemma_id) DO NOTHING;

-- Insert test phrase forms (multi-token)
INSERT INTO phrase_forms (phrase_pashto, lemma_id, token_count, features) VALUES
-- Perfect series for وهل
('وهلی یم', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), 2, '{"tam":"prs","mood":"ind","person":1,"number":"sg","series":"perfect"}'),
('وهلی دی', (SELECT id FROM lemmas WHERE headword_pashto = 'وهل'), 2, '{"tam":"prs","mood":"ind","person":3,"number":"sg","series":"perfect"}'),
-- Negative series for کول
('نه کوم', (SELECT id FROM lemmas WHERE headword_pashto = 'کول'), 2, '{"polarity":"neg","tam":"prs","mood":"ind","person":1,"number":"sg"}')
ON CONFLICT (phrase_pashto, lemma_id) DO NOTHING;

-- Insert lemma relationships (compound relationships)
INSERT INTO lemma_relations (src_lemma_id, dst_lemma_id, rel, weight) VALUES
((SELECT id FROM lemmas WHERE headword_pashto = 'ګرمول'),
 (SELECT id FROM lemmas WHERE headword_pashto = 'ګرم'),
 'compound-of', 1.0)
ON CONFLICT (src_lemma_id, dst_lemma_id, rel) DO NOTHING;

-- ========================================
-- 13. PERMISSIONS
-- ========================================

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- ========================================
-- 14. COMMENTS
-- ========================================

COMMENT ON TABLE lemmas IS 'Canonical lemma entries with metadata';
COMMENT ON TABLE word_forms IS 'Single-token word forms with morphological features';
COMMENT ON TABLE phrase_forms IS 'Multi-token phrase forms (perfect series, negatives, etc.)';
COMMENT ON TABLE lemma_relations IS 'Relationships between lemmas (compounds, auxiliaries, etc.)';
COMMENT ON TABLE verses IS 'Bible verses with testament classification';
COMMENT ON TABLE word_occurrences IS 'Single-token word occurrences in verses';
COMMENT ON TABLE phrase_occurrences IS 'Multi-token phrase occurrences in verses';

COMMENT ON FUNCTION search_word_with_forms IS 'Comprehensive search returning both single-token and phrase forms with features';
COMMENT ON FUNCTION fuzzy_search_words IS 'Optimized fuzzy search using GIN trigram indexes';
COMMENT ON FUNCTION morphological_search IS 'Advanced search with morphological feature filtering';
COMMENT ON FUNCTION get_forms_for_root IS 'Returns all forms (single and phrase) for a lemma with features';
COMMENT ON FUNCTION get_frequent_words IS 'Most frequent forms including romanized variants';
