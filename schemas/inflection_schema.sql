-- LingDocs-inspired minimal schema for lemma data and rule-driven inflection
-- Storage-only layer. Rule engine composes forms; overrides fill true exceptions.

-- 1) Lemmas: canonical entries (one per dictionary headword/phrase)
CREATE TABLE IF NOT EXISTS lemmas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pashto text NOT NULL,
  romanized text,
  pos_family text NOT NULL,                 -- verb | noun | adjective | other
  helper text,                              -- NULL | 'کول' | 'وهل' | 'کېدل' | 'شول'
  compound_type text,                       -- NULL | 'dynamic' | 'stative'
  flags jsonb DEFAULT '{}'::jsonb,          -- arbitrary tags (e.g., { "transport": true })
  created_at timestamptz DEFAULT now(),
  UNIQUE (pashto, pos_family)
);

-- 2) Stems: normalized stems used by the rule engine
CREATE TABLE IF NOT EXISTS stems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lemma_id uuid NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  stem_type text NOT NULL,                  -- 'present' | 'subjunctive' | 'perfective' | 'past_participle'
  value text NOT NULL,
  confidence real DEFAULT 0.8,              -- heuristic confidence 0-1
  source text NOT NULL DEFAULT 'import',    -- 'rule' | 'override' | 'import'
  UNIQUE (lemma_id, stem_type)
);

-- 3) Irregular overrides: explicit forms where rules do not apply
CREATE TABLE IF NOT EXISTS irregular_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lemma_id uuid NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  form_signature text NOT NULL,             -- serialized features (e.g., 'verb:present:1sg:masc:short')
  form text NOT NULL,
  note text,
  UNIQUE (lemma_id, form_signature)
);

-- 4) Examples: usage references for QA and UI
CREATE TABLE IF NOT EXISTS lemma_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lemma_id uuid NOT NULL REFERENCES lemmas(id) ON DELETE CASCADE,
  verse_ref text,
  text_pashto text
);

-- 5) Frequency: lightweight per-lemma counts to inform prioritization
CREATE TABLE IF NOT EXISTS lemma_frequency (
  lemma_id uuid PRIMARY KEY REFERENCES lemmas(id) ON DELETE CASCADE,
  total_count integer DEFAULT 0,
  source jsonb DEFAULT '{}'::jsonb
);

-- Views for convenient access
CREATE OR REPLACE VIEW lemma_with_stems AS
SELECT l.*, 
  jsonb_object_agg(s.stem_type, s.value) FILTER (WHERE s.id IS NOT NULL) AS stems_json
FROM lemmas l
LEFT JOIN stems s ON s.lemma_id = l.id
GROUP BY l.id;


