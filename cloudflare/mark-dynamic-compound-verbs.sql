-- Mark dynamic compound verbs (v. dyn. comp. trans.)
-- Pattern: Noun (object complement) + Auxiliary Verb = Dynamic Compound Verb
-- Example: قدم (step) + وهل (to hit/strike) = قدم وهل (to take a step/to walk)
-- Reference: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- بحث کول = بحث + کول (dynamic compound)
-- Mark as compound_dynamic
UPDATE word_frequencies SET word_type = 'compound_dynamic', has_issues = 0 WHERE pashto_word = 'بحث کول';


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);