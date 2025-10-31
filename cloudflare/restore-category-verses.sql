-- =========================================
-- RESTORE category_verse_mappings FROM word_verse_mapping
-- Uses word_category_mappings to determine which verses belong to which categories
-- =========================================

-- Restore category_verse_mappings from word_verse_mapping and word_category_mappings
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
SELECT DISTINCT
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
ORDER BY wcm.category_key, wvm.pashto_word, wvm.verse_ref;

-- Show summary
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC
LIMIT 30;
