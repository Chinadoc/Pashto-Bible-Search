#!/usr/bin/env python3
"""
Generate SQL to split multi-word entries directly from a sample query

This generates SQL that splits:
- Postpositions (... ته) → [word] + ته
- Standalone prepositions (د ...) → د + [word]
- Particle phrases (... به) → [word] + به

But keeps:
- Circumpositions (په ... کې) as single entries
"""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'split-multiword-entries.sql'

# Common patterns to split
split_patterns = [
    # Postpositions (... ته)
    ("% ته", "split_postposition"),
    ("% کې", "split_postposition"),
    ("% دپاره", "split_postposition"),
    ("% باندې", "split_postposition"),
    ("% سره", "split_postposition"),
    
    # Particle phrases (... به)
    ("% به", "split_particle"),
    ("به %", "split_particle"),
    
    # Standalone prepositions (د ...)
    ("د %", "split_preposition"),
    ("په %", "split_preposition"),
    ("پر %", "split_preposition"),
    ("له %", "split_preposition"),
]

sql_statements = []
sql_statements.append('-- Split multi-word entries into individual words')
sql_statements.append('-- Keeps circumpositions (په ... کې) as single entries')
sql_statements.append('-- Splits postpositions (... ته), prepositions (د ...), and particles (... به)')
sql_statements.append('')
sql_statements.append('-- This SQL will:')
sql_statements.append('-- 1. Find entries to split')
sql_statements.append('-- 2. Create INSERT statements for each word')
sql_statements.append('-- 3. Mark original as split')
sql_statements.append('')
sql_statements.append('-- Note: This is a template. Actual splitting requires:')
sql_statements.append('-- - Processing each entry individually')
sql_statements.append('-- - Checking if split words already exist')
sql_statements.append('-- - Updating word_verse_mapping')
sql_statements.append('-- - Distributing frequency counts')
sql_statements.append('')
sql_statements.append('-- Sample entries to split (run separately for each):')
sql_statements.append('')
sql_statements.append('-- Example: Split "هغه به" into "هغه" + "به"')
sql_statements.append("""
-- Step 1: Ensure "هغه" exists
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'هغه', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'هغه');

-- Step 2: Ensure "به" exists  
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'به', 0, 0, 0, 0, 'particle'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'به');

-- Step 3: Mark original as split
UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'هغه به';
""")

sql_statements.append('')
sql_statements.append('-- Example: Split "ما ته" into "ما" + "ته"')
sql_statements.append("""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'ما', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'ما');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'ته', 0, 0, 0, 0, 'postposition'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'ته');

UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'ما ته';
""")

sql_statements.append('')
sql_statements.append('-- Example: Split "د یوسف" into "د" + "یوسف"')
sql_statements.append("""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'د', 0, 0, 0, 0, 'preposition'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'د');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT 'یوسف', 0, 0, 0, 0, 'proper_noun'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = 'یوسف');

UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE pashto_word = 'د یوسف';
""")

sql_statements.append('')
sql_statements.append('-- To generate SQL for all entries, use this query to find candidates:')
sql_statements.append("""
SELECT 
  id,
  pashto_word,
  frequency_total,
  CASE 
    WHEN pashto_word LIKE '% ته' THEN 'postposition'
    WHEN pashto_word LIKE '% به' OR pashto_word LIKE 'به %' THEN 'particle'
    WHEN pashto_word LIKE 'د %' OR pashto_word LIKE 'په %' OR pashto_word LIKE 'پر %' OR pashto_word LIKE 'له %' THEN 'preposition'
    ELSE 'other'
  END as split_type
FROM word_frequencies
WHERE pashto_word LIKE '% %'
  AND (pos = 'phrase' OR pos IS NULL OR pos = '')
  AND pashto_word NOT LIKE 'په%کې'
  AND pashto_word NOT LIKE 'د%دپاره'
  AND pashto_word NOT LIKE 'پر%باندې'
  AND pashto_word NOT LIKE 'د%په اړه'
  AND pashto_word NOT LIKE 'د%په بارې کې'
  AND pashto_word NOT LIKE 'پر%سربېره'
  AND pashto_word NOT LIKE 'له%سره'
  AND LENGTH(pashto_word) - LENGTH(REPLACE(pashto_word, ' ', '')) = 1
ORDER BY frequency_total DESC
LIMIT 100;
""")

OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
print(f"✅ Generated {OUTPUT_SQL}")
print("\n📋 This file contains:")
print("   - Example SQL for splitting sample entries")
print("   - Query to find all entries that need splitting")
print("\n💡 Next steps:")
print("   1. Review the examples in the SQL file")
print("   2. Run the query to see all candidates")
print("   3. Create a Python script to generate SQL for each entry programmatically")

