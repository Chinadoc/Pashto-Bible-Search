-- =========================================
-- COMBINE RELATED TOPICS/CATEGORIES (Simplified Approach)
-- Merges related categories into parent categories
-- Handles duplicates by keeping only one entry per category+word+verse
-- =========================================

-- Step 1: Update categories one by one, handling duplicates immediately
-- Body Parts
UPDATE category_verse_mappings
SET category_key = 'body_parts'
WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');

-- Remove duplicates for body_parts
DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'body_parts'
  GROUP BY category_key, pashto_word, verse_id
);

-- Family
UPDATE category_verse_mappings
SET category_key = 'family'
WHERE category_key IN ('family_male', 'family_female', 'family_general');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'family'
  GROUP BY category_key, pashto_word, verse_id
);

-- Time
UPDATE category_verse_mappings
SET category_key = 'time'
WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'time'
  GROUP BY category_key, pashto_word, verse_id
);

-- Fix: "شروع" (start/beginning) should be in time, not spatial
UPDATE category_verse_mappings
SET category_key = 'time'
WHERE pashto_word = 'شروع' AND category_key IN ('spatial', 'spatial_down', 'direction');

-- Numbers
UPDATE category_verse_mappings
SET category_key = 'numbers'
WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'numbers'
  GROUP BY category_key, pashto_word, verse_id
);

-- Nature
UPDATE category_verse_mappings
SET category_key = 'nature'
WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'nature'
  GROUP BY category_key, pashto_word, verse_id
);

-- Actions
UPDATE category_verse_mappings
SET category_key = 'actions'
WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'actions'
  GROUP BY category_key, pashto_word, verse_id
);

-- Emotions
UPDATE category_verse_mappings
SET category_key = 'emotions'
WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'emotions'
  GROUP BY category_key, pashto_word, verse_id
);

-- States
UPDATE category_verse_mappings
SET category_key = 'states'
WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'states'
  GROUP BY category_key, pashto_word, verse_id
);

-- Grammar
UPDATE category_verse_mappings
SET category_key = 'grammar'
WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'grammar'
  GROUP BY category_key, pashto_word, verse_id
);

-- Fix: "خپل" (one's own, relative) should be in grammar, not farming
UPDATE category_verse_mappings
SET category_key = 'grammar'
WHERE pashto_word = 'خپل' AND category_key = 'farming';

-- Religious
UPDATE category_verse_mappings
SET category_key = 'religious'
WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'religious'
  GROUP BY category_key, pashto_word, verse_id
);

-- Measurement
UPDATE category_verse_mappings
SET category_key = 'measurement'
WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'measurement'
  GROUP BY category_key, pashto_word, verse_id
);

-- Materials
UPDATE category_verse_mappings
SET category_key = 'materials'
WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'materials'
  GROUP BY category_key, pashto_word, verse_id
);

-- Spatial
UPDATE category_verse_mappings
SET category_key = 'spatial'
WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'spatial'
  GROUP BY category_key, pashto_word, verse_id
);

-- Activities
UPDATE category_verse_mappings
SET category_key = 'activities'
WHERE category_key IN ('activities_daily', 'activities_social');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'activities'
  GROUP BY category_key, pashto_word, verse_id
);

-- Relationships
UPDATE category_verse_mappings
SET category_key = 'relationships'
WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'relationships'
  GROUP BY category_key, pashto_word, verse_id
);

-- Descriptions
UPDATE category_verse_mappings
SET category_key = 'descriptions'
WHERE category_key IN ('descriptions_appearance', 'descriptions_character');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'descriptions'
  GROUP BY category_key, pashto_word, verse_id
);

-- Quantities
UPDATE category_verse_mappings
SET category_key = 'quantities'
WHERE category_key IN ('quantities_large', 'quantities_small');

DELETE FROM category_verse_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM category_verse_mappings
  WHERE category_key = 'quantities'
  GROUP BY category_key, pashto_word, verse_id
);

-- Update word_categories table
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

-- Update word_category_mappings (similar updates)
UPDATE word_category_mappings SET category_key = 'body_parts' WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');
UPDATE word_category_mappings SET category_key = 'family' WHERE category_key IN ('family_male', 'family_female', 'family_general');
UPDATE word_category_mappings SET category_key = 'time' WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');
UPDATE word_category_mappings SET category_key = 'numbers' WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');
UPDATE word_category_mappings SET category_key = 'nature' WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');
UPDATE word_category_mappings SET category_key = 'actions' WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');
UPDATE word_category_mappings SET category_key = 'emotions' WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');
UPDATE word_category_mappings SET category_key = 'states' WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');
UPDATE word_category_mappings SET category_key = 'grammar' WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');
UPDATE word_category_mappings SET category_key = 'religious' WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');
UPDATE word_category_mappings SET category_key = 'measurement' WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');
UPDATE word_category_mappings SET category_key = 'materials' WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');
UPDATE word_category_mappings SET category_key = 'spatial' WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');
UPDATE word_category_mappings SET category_key = 'activities' WHERE category_key IN ('activities_daily', 'activities_social');
UPDATE word_category_mappings SET category_key = 'relationships' WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');
UPDATE word_category_mappings SET category_key = 'descriptions' WHERE category_key IN ('descriptions_appearance', 'descriptions_character');
UPDATE word_category_mappings SET category_key = 'quantities' WHERE category_key IN ('quantities_large', 'quantities_small');

-- Remove duplicates from word_category_mappings
DELETE FROM word_category_mappings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM word_category_mappings
  GROUP BY category_key, pashto_word
);

-- Show summary
SELECT 
  category_key,
  COUNT(DISTINCT pashto_word) as unique_words,
  COUNT(*) as total_entries
FROM category_verse_mappings
GROUP BY category_key
ORDER BY unique_words DESC;