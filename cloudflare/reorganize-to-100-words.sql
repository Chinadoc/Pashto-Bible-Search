-- =========================================
-- REORGANIZE TOPICS TO 100 UNIQUE WORDS PER CATEGORY
-- This script ensures each category has up to 100 unique words
-- with 1-2 verses per word (maximum diversity)
-- =========================================

-- Create temporary table with ranked entries
CREATE TEMP TABLE IF NOT EXISTS ranked_entries AS
SELECT 
  cvm.*,
  ROW_NUMBER() OVER (
    PARTITION BY cvm.category_key, cvm.pashto_word 
    ORDER BY cvm.verse_ref
  ) as word_rank
FROM category_verse_mappings cvm;

-- Create temporary table with word rankings per category
CREATE TEMP TABLE IF NOT EXISTS category_word_ranks AS
SELECT 
  category_key,
  pashto_word,
  MIN(word_rank) as min_rank,
  COUNT(*) as verse_count,
  DENSE_RANK() OVER (
    PARTITION BY category_key 
    ORDER BY MIN(word_rank)
  ) as word_rank_in_category
FROM ranked_entries
WHERE word_rank <= 2  -- Max 2 verses per word
GROUP BY category_key, pashto_word;

-- Clear existing mappings
DELETE FROM category_verse_mappings;

-- Reinsert top 100 unique words per category (1-2 verses each)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
SELECT 
  re.category_key,
  re.pashto_word,
  re.verse_id,
  re.verse_ref,
  re.translation_key,
  re.testament,
  re.book,
  re.chapter,
  re.verse
FROM ranked_entries re
INNER JOIN category_word_ranks cwr ON 
  re.category_key = cwr.category_key AND 
  re.pashto_word = cwr.pashto_word AND
  re.word_rank = cwr.min_rank
WHERE cwr.word_rank_in_category <= 100  -- Top 100 unique words per category
  AND re.word_rank <= 2  -- Max 2 verses per word
ORDER BY re.category_key, cwr.word_rank_in_category, re.word_rank;

-- Clean up temporary tables
DROP TABLE IF EXISTS ranked_entries;
DROP TABLE IF EXISTS category_word_ranks;

-- Show summary
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC;
