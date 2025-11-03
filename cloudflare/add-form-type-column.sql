-- Add form_type column to track verb form types
-- This allows filtering by present, past, perfect, etc.

ALTER TABLE word_frequencies ADD COLUMN form_type TEXT;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_word_frequencies_form_type ON word_frequencies (form_type);

