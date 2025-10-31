-- =========================================
-- FIX INCORRECT CATEGORIZATIONS AND REORGANIZE TO 100 UNIQUE WORDS
-- After combining related topics, fix incorrect mappings and ensure 100 unique words per category
-- =========================================

-- First, let's fix some obvious incorrect categorizations
-- "شروع" (start/beginning) should be in time, not spatial_down
UPDATE category_verse_mappings
SET category_key = 'time'
WHERE pashto_word = 'شروع' AND category_key = 'spatial_down';

-- Remove words that don't fit their categories (we'll rely on the curation script for this)
-- But let's fix some obvious ones:

-- "خپل" (one's own, relative) shouldn't be in farming - it's a grammar/pronoun word
UPDATE category_verse_mappings
SET category_key = 'grammar'
WHERE pashto_word = 'خپل' AND category_key = 'farming';

-- Now reorganize to ensure 100 unique words per category (1-2 verses max per word)
-- First, remove duplicates that might have been created during category merging
DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  GROUP BY category_key, pashto_word, verse_id
);

-- Create temporary table with ranked entries
CREATE TEMP TABLE IF NOT EXISTS ranked_entries_combined AS
SELECT 
  cvm.*,
  ROW_NUMBER() OVER (
    PARTITION BY cvm.category_key, cvm.pashto_word 
    ORDER BY cvm.verse_ref
  ) as word_rank
FROM category_verse_mappings cvm;

-- Create temporary table with word rankings per category
CREATE TEMP TABLE IF NOT EXISTS category_word_ranks_combined AS
SELECT 
  category_key,
  pashto_word,
  MIN(word_rank) as min_rank,
  COUNT(*) as verse_count,
  DENSE_RANK() OVER (
    PARTITION BY category_key 
    ORDER BY MIN(word_rank)
  ) as word_rank_in_category
FROM ranked_entries_combined
WHERE word_rank <= 2  -- Max 2 verses per word
GROUP BY category_key, pashto_word;

-- Clear existing mappings and rebuild from scratch to avoid duplicates
DELETE FROM category_verse_mappings;

-- Reinsert top 100 unique words per category (1-2 verses each)
-- Use DISTINCT to ensure no duplicates
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
SELECT DISTINCT
  re.category_key,
  re.pashto_word,
  re.verse_id,
  re.verse_ref,
  re.translation_key,
  re.testament,
  re.book,
  re.chapter,
  re.verse
FROM ranked_entries_combined re
INNER JOIN category_word_ranks_combined cwr ON 
  re.category_key = cwr.category_key AND 
  re.pashto_word = cwr.pashto_word AND
  re.word_rank = cwr.min_rank
WHERE cwr.word_rank_in_category <= 100  -- Top 100 unique words per category
  AND re.word_rank <= 2  -- Max 2 verses per word
ORDER BY re.category_key, cwr.word_rank_in_category, re.word_rank;

-- Clean up temporary tables
DROP TABLE IF EXISTS ranked_entries_combined;
DROP TABLE IF EXISTS category_word_ranks_combined;

-- Show final summary
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC;
