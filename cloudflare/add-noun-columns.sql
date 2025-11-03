-- Add noun-specific columns to word_frequencies
ALTER TABLE word_frequencies ADD COLUMN gender TEXT;
ALTER TABLE word_frequencies ADD COLUMN number TEXT;
ALTER TABLE word_frequencies ADD COLUMN plural_forms TEXT;
ALTER TABLE word_frequencies ADD COLUMN inflection_pattern INTEGER;
