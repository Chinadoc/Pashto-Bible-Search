-- Fix compound biblical names
-- These are names that appear as single words in Pashto but are compound
-- Example: اخى‌اب = Ahab (not اخى + اب as separate words)

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Update compound biblical names

-- Create index if missing
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);