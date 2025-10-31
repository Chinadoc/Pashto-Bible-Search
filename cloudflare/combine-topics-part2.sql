-- =========================================
-- COMBINE RELATED TOPICS - PART 2: Numbers, Nature, Actions, Emotions
-- =========================================

-- Numbers
UPDATE category_verse_mappings SET category_key = 'numbers' WHERE category_key IN ('numbers_cardinal', 'numbers_ordinal', 'numbers_quantities');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'numbers' GROUP BY category_key, pashto_word, verse_id);

-- Nature
UPDATE category_verse_mappings SET category_key = 'nature' WHERE category_key IN ('nature_animals', 'nature_land', 'nature_water', 'nature_plants');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'nature' GROUP BY category_key, pashto_word, verse_id);

-- Actions
UPDATE category_verse_mappings SET category_key = 'actions' WHERE category_key IN ('actions_build', 'actions_hand', 'actions_move');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'actions' GROUP BY category_key, pashto_word, verse_id);

-- Emotions
UPDATE category_verse_mappings SET category_key = 'emotions' WHERE category_key IN ('emotions_positive', 'emotions_negative', 'emotions_extreme');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'emotions' GROUP BY category_key, pashto_word, verse_id);
