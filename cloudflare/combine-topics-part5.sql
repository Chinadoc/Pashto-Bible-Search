-- =========================================
-- COMBINE RELATED TOPICS - PART 5: Update word_categories and word_category_mappings
-- =========================================

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

-- Update word_category_mappings - create new mappings first, then delete old ones
-- First, insert new merged mappings (handling duplicates)
INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'body_parts', 1.0 FROM word_category_mappings WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'family', 1.0 FROM word_category_mappings WHERE category_key IN ('family_male', 'family_female', 'family_general');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'time', 1.0 FROM word_category_mappings WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'numbers', 1.0 FROM word_category_mappings WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'nature', 1.0 FROM word_category_mappings WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'actions', 1.0 FROM word_category_mappings WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'emotions', 1.0 FROM word_category_mappings WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'states', 1.0 FROM word_category_mappings WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'grammar', 1.0 FROM word_category_mappings WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'religious', 1.0 FROM word_category_mappings WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'measurement', 1.0 FROM word_category_mappings WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'materials', 1.0 FROM word_category_mappings WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'spatial', 1.0 FROM word_category_mappings WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'activities', 1.0 FROM word_category_mappings WHERE category_key IN ('activities_daily', 'activities_social');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'relationships', 1.0 FROM word_category_mappings WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'descriptions', 1.0 FROM word_category_mappings WHERE category_key IN ('descriptions_appearance', 'descriptions_character');

INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key, confidence)
SELECT DISTINCT pashto_word, 'quantities', 1.0 FROM word_category_mappings WHERE category_key IN ('quantities_large', 'quantities_small');

-- Now delete old category mappings
DELETE FROM word_category_mappings WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal', 'family_male', 'family_female', 'family_general', 'time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific', 'numbers_cardinal', 'numbers_ordinal', 'numbers_quantities', 'nature_animals', 'nature_land', 'nature_water', 'nature_plants', 'actions_build', 'actions_hand', 'actions_move', 'emotions_positive', 'emotions_negative', 'emotions_extreme', 'states_life', 'states_health', 'states_size', 'states_quality', 'grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives', 'religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events', 'measurement', 'measurement_length', 'measurement_time', 'measurement_weight', 'materials', 'materials_metal', 'materials_organic', 'materials_stone', 'direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside', 'activities_daily', 'activities_social', 'relationships', 'relationships_close', 'relationships_conflict', 'descriptions_appearance', 'descriptions_character', 'quantities_large', 'quantities_small');
