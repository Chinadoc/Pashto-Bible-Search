# SQL: Add Inflection Tracking Columns

Run this in Supabase SQL Editor:

```sql
-- Add columns to track inflections
ALTER TABLE word_occurrence_index
ADD COLUMN IF NOT EXISTS is_inflected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS base_word TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_word_occurrence_is_inflected ON word_occurrence_index(is_inflected);

-- Verify
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'word_occurrence_index' 
ORDER BY ordinal_position;
```

Then run the expansion script again:

```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search
set -a && source .env.local && set +a
node scripts/expand_word_index_with_inflections.js
```
