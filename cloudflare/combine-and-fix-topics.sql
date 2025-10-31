-- =========================================
-- COMBINE RELATED TOPICS/CATEGORIES
-- Merges related categories into parent categories for better organization
-- =========================================

-- Define category combinations to merge
-- Format: parent_category -> array of child categories to merge

-- 1. Body Parts: Combine all body part categories
UPDATE category_verse_mappings
SET category_key = 'body_parts'
WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');

-- 2. Family: Combine family categories
UPDATE category_verse_mappings
SET category_key = 'family'
WHERE category_key IN ('family_male', 'family_female', 'family_general');

-- 3. Time: Combine time categories
UPDATE category_verse_mappings
SET category_key = 'time'
WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');

-- 4. Numbers: Combine number categories
UPDATE category_verse_mappings
SET category_key = 'numbers'
WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');

-- 5. Nature: Combine nature categories
UPDATE category_verse_mappings
SET category_key = 'nature'
WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');

-- 6. Actions: Combine action categories (but keep some specific ones separate)
-- We'll combine general actions but keep specific ones like actions_eat, actions_see separate
UPDATE category_verse_mappings
SET category_key = 'actions'
WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');

-- 7. Emotions: Combine emotion categories
UPDATE category_verse_mappings
SET category_key = 'emotions'
WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');

-- 8. States: Combine state categories
UPDATE category_verse_mappings
SET category_key = 'states'
WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');

-- 9. Grammar: Combine grammar categories
UPDATE category_verse_mappings
SET category_key = 'grammar'
WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');

-- 10. Religious: Combine religious categories
UPDATE category_verse_mappings
SET category_key = 'religious'
WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');

-- 11. Measurement: Combine measurement categories
UPDATE category_verse_mappings
SET category_key = 'measurement'
WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');

-- 12. Materials: Combine material categories
UPDATE category_verse_mappings
SET category_key = 'materials'
WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');

-- 13. Spatial/Direction: Combine spatial categories
UPDATE category_verse_mappings
SET category_key = 'spatial'
WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');

-- 14. Activities: Combine activity categories
UPDATE category_verse_mappings
SET category_key = 'activities'
WHERE category_key IN ('activities_daily', 'activities_social');

-- 15. Relationships: Combine relationship categories
UPDATE category_verse_mappings
SET category_key = 'relationships'
WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');

-- 16. Descriptions: Combine description categories
UPDATE category_verse_mappings
SET category_key = 'descriptions'
WHERE category_key IN ('descriptions_appearance', 'descriptions_character');

-- 17. Quantities: Combine quantity categories
UPDATE category_verse_mappings
SET category_key = 'quantities'
WHERE category_key IN ('quantities_large', 'quantities_small');

-- Update word_categories table to reflect merged categories
-- First, add parent categories if they don't exist
INSERT OR IGNORE INTO word_categories (category_key, category_name, description, parent_category)
VALUES
  ('body_parts', 'Body Parts', 'Words related to body parts', NULL),
  ('family', 'Family', 'Words related to family', NULL),
  ('time', 'Time', 'Words related to time', NULL),
  ('numbers', 'Numbers', 'Words related to numbers', NULL),
  ('nature', 'Nature', 'Words related to nature', NULL),
  ('actions', 'Actions', 'Words related to actions', NULL),
  ('emotions', 'Emotions', 'Words related to emotions', NULL),
  ('states', 'States', 'Words related to states and conditions', NULL),
  ('grammar', 'Grammar', 'Words related to grammar', NULL),
  ('religious', 'Religious', 'Words related to religious concepts', NULL),
  ('measurement', 'Measurement', 'Words related to measurement', NULL),
  ('materials', 'Materials', 'Words related to materials', NULL),
  ('spatial', 'Spatial', 'Words related to spatial concepts and directions', NULL),
  ('activities', 'Activities', 'Words related to activities', NULL),
  ('relationships', 'Relationships', 'Words related to relationships', NULL),
  ('descriptions', 'Descriptions', 'Words related to descriptions', NULL),
  ('quantities', 'Quantities', 'Words related to quantities', NULL);

-- Update word_category_mappings to reflect merged categories
UPDATE word_category_mappings
SET category_key = 'body_parts'
WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');

UPDATE word_category_mappings
SET category_key = 'family'
WHERE category_key IN ('family_male', 'family_female', 'family_general');

UPDATE word_category_mappings
SET category_key = 'time'
WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');

UPDATE word_category_mappings
SET category_key = 'numbers'
WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');

UPDATE word_category_mappings
SET category_key = 'nature'
WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');

UPDATE word_category_mappings
SET category_key = 'actions'
WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');

UPDATE word_category_mappings
SET category_key = 'emotions'
WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');

UPDATE word_category_mappings
SET category_key = 'states'
WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');

UPDATE word_category_mappings
SET category_key = 'grammar'
WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');

UPDATE word_category_mappings
SET category_key = 'religious'
WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');

UPDATE word_category_mappings
SET category_key = 'measurement'
WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');

UPDATE word_category_mappings
SET category_key = 'materials'
WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');

UPDATE word_category_mappings
SET category_key = 'spatial'
WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');

UPDATE word_category_mappings
SET category_key = 'activities'
WHERE category_key IN ('activities_daily', 'activities_social');

UPDATE word_category_mappings
SET category_key = 'relationships'
WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');

UPDATE word_category_mappings
SET category_key = 'descriptions'
WHERE category_key IN ('descriptions_appearance', 'descriptions_character');

UPDATE word_category_mappings
SET category_key = 'quantities'
WHERE category_key IN ('quantities_large', 'quantities_small');

-- Show summary of merged categories
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC;
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
