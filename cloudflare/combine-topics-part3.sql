-- =========================================
-- COMBINE RELATED TOPICS - PART 3: States, Grammar, Religious
-- =========================================

-- States
UPDATE category_verse_mappings SET category_key = 'states' WHERE category_key IN ('states_life', 'states_health', 'states_size', 'states_quality');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'states' GROUP BY category_key, pashto_word, verse_id);

-- Grammar
UPDATE category_verse_mappings SET category_key = 'grammar' WHERE category_key IN ('grammar_pronouns', 'grammar_prepositions', 'grammar_conjunctions', 'grammar_adverbs', 'grammar_adjectives');
UPDATE category_verse_mappings SET category_key = 'grammar' WHERE pashto_word = 'خپل' AND category_key = 'farming';
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'grammar' GROUP BY category_key, pashto_word, verse_id);

-- Religious
UPDATE category_verse_mappings SET category_key = 'religious' WHERE category_key IN ('religious_concepts', 'religious_actions', 'religious_places', 'religious_objects', 'religion_events');
DELETE FROM category_verse_mappings WHERE id NOT IN (SELECT MIN(id) FROM category_verse_mappings WHERE category_key = 'religious' GROUP BY category_key, pashto_word, verse_id);
