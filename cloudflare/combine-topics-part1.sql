-- =========================================
-- COMBINE RELATED TOPICS - PART 1: Body Parts, Family, Time
-- =========================================

-- Body Parts
UPDATE category_verse_mappings SET category_key = 'body_parts' WHERE category_key IN ('body_parts_head', 'body_parts_torso', 'body_parts_legs', 'body_parts_internal');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'body_parts' GROUP BY category_key, pashto_word, verse_id);

-- Family
UPDATE category_verse_mappings SET category_key = 'family' WHERE category_key IN ('family_male', 'family_female', 'family_general');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'family' GROUP BY category_key, pashto_word, verse_id);

-- Time
UPDATE category_verse_mappings SET category_key = 'time' WHERE category_key IN ('time_periods', 'time_days', 'time_months', 'time_concepts', 'time_specific');
UPDATE category_verse_mappings SET category_key = 'time' WHERE pashto_word = 'شروع' AND category_key IN ('spatial', 'spatial_down', 'direction');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'time' GROUP BY category_key, pashto_word, verse_id);
