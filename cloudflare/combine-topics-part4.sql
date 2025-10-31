-- =========================================
-- COMBINE RELATED TOPICS - PART 4: Measurement, Materials, Spatial, Activities, Relationships, Descriptions, Quantities
-- =========================================

-- Measurement
UPDATE category_verse_mappings SET category_key = 'measurement' WHERE category_key IN ('measurement', 'measurement_length', 'measurement_time', 'measurement_weight');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'measurement' GROUP BY category_key, pashto_word, verse_id);

-- Materials
UPDATE category_verse_mappings SET category_key = 'materials' WHERE category_key IN ('materials', 'materials_metal', 'materials_organic', 'materials_stone');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'materials' GROUP BY category_key, pashto_word, verse_id);

-- Spatial
UPDATE category_verse_mappings SET category_key = 'spatial' WHERE category_key IN ('direction', 'position', 'spatial_up', 'spatial_down', 'spatial_inside', 'spatial_outside');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'spatial' GROUP BY category_key, pashto_word, verse_id);

-- Activities
UPDATE category_verse_mappings SET category_key = 'activities' WHERE category_key IN ('activities_daily', 'activities_social');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'activities' GROUP BY category_key, pashto_word, verse_id);

-- Relationships
UPDATE category_verse_mappings SET category_key = 'relationships' WHERE category_key IN ('relationships', 'relationships_close', 'relationships_conflict');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'relationships' GROUP BY category_key, pashto_word, verse_id);

-- Descriptions
UPDATE category_verse_mappings SET category_key = 'descriptions' WHERE category_key IN ('descriptions_appearance', 'descriptions_character');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'descriptions' GROUP BY category_key, pashto_word, verse_id);

-- Quantities
UPDATE category_verse_mappings SET category_key = 'quantities' WHERE category_key IN ('quantities_large', 'quantities_small');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'quantities' GROUP BY category_key, pashto_word, verse_id);
