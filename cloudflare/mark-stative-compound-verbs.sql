-- Mark stative compound verbs (v. stat. comp. trans./intrans.)
-- Pattern: Complement (adjective/noun) + Helper Verb = Stative Compound Verb
-- Intransitive: complement + کېدل (to become)
-- Transitive: complement + کول (to make)
-- Example: پاک (clean) + کول (to make) = پاکول (to clean) - squished form
-- Reference: https://grammar.lingdocs.com/compound-verbs/stative-compounds/

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- آبادول = آباد + کول (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'آبادول';

-- ادا کول = ادا ک + کول (transitive stative compound)
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'ادا کول';

-- استعمالول = استعمال + کول (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'استعمالول';

-- استعمالېدل = استعمال + کېدل (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. intrans.', has_issues = 0 WHERE pashto_word = 'استعمالېدل';

-- اعلانول = اعلان + کول (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'اعلانول';

-- بچ کول = بچ ک + کول (transitive stative compound)
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'بچ کول';

-- بدلېدل = بدل + کېدل (intransitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. intrans.', has_issues = 0 WHERE pashto_word = 'بدلېدل';

-- بندول = بند + کول (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. trans.', has_issues = 0 WHERE pashto_word = 'بندول';

-- بندېدل = بند + کېدل (transitive stative compound (squished))
-- Mark as compound_stative
UPDATE word_frequencies SET word_type = 'compound_stative', pos = 'v. stat. comp. intrans.', has_issues = 0 WHERE pashto_word = 'بندېدل';


-- Create index
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);