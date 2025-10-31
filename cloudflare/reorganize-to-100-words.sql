-- =========================================
-- REORGANIZE TO 100 UNIQUE WORDS PER CATEGORY (FIXED)
-- Ensures each category has exactly 100 unique words (or fewer if less available)
-- with 1-2 verses max per word
-- =========================================

-- Delete and rebuild with proper ranking
DELETE FROM category_verse_mappings;

-- Reinsert with ranking: select top 100 unique words per category, max 2 verses per word
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
WITH source_data AS (
  SELECT 
    wcm.category_key,
    wvm.pashto_word,
    wvm.verse_id,
    wvm.verse_ref,
    wvm.translation_key,
    wvm.testament,
    wvm.book,
    wvm.chapter,
    wvm.verse
  FROM word_verse_mapping wvm
  INNER JOIN word_category_mappings wcm ON wvm.pashto_word = wcm.pashto_word
),
ranked_entries AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY category_key, pashto_word 
      ORDER BY verse_ref
    ) as word_rank
  FROM source_data
),
category_word_ranks AS (
  SELECT 
    category_key,
    pashto_word,
    MIN(word_rank) as min_rank,
    ROW_NUMBER() OVER (
      PARTITION BY category_key 
      ORDER BY MIN(word_rank)
    ) as word_rank_in_category
  FROM ranked_entries
  WHERE word_rank <= 2
  GROUP BY category_key, pashto_word
),
top_100_words AS (
  SELECT category_key, pashto_word, min_rank
  FROM category_word_ranks
  WHERE word_rank_in_category <= 100
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
FROM ranked_entries re
INNER JOIN top_100_words t100 ON 
  re.category_key = t100.category_key AND 
  re.pashto_word = t100.pashto_word AND
  re.word_rank = t100.min_rank
WHERE re.word_rank <= 2
ORDER BY re.category_key, re.word_rank;

-- Show summary
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC;