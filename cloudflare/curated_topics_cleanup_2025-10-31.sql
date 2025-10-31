-- =========================================
-- CURATED TOPICS ENTRIES CLEANUP SQL
-- Generated for highly curated Bible concordance
-- =========================================

-- Clear existing mappings for curated categories
DELETE FROM category_verse_mappings WHERE category_key IN ('abstract_concepts', 'abstract_good', 'actions_communication', 'actions_eat', 'actions_fight', 'actions_see', 'body_parts_head', 'body_parts_legs', 'body_parts_torso', 'buildings', 'clothing', 'colors', 'commerce', 'emotions_positive', 'family_female', 'family_general', 'family_male', 'food', 'grammar_adjectives', 'grammar_adverbs', 'grammar_conjunctions', 'grammar_prepositions', 'grammar_pronouns', 'leadership', 'nature_animals', 'nature_land', 'nature_water', 'numbers_cardinal', 'numbers_ordinal', 'numbers_quantities', 'places', 'relationships', 'religious_actions', 'religious_concepts', 'states_life', 'states_quality', 'states_size', 'time_concepts', 'time_days', 'time_months', 'time_periods', 'weather', 'work');

-- Insert curated entries
-- abstract_concepts (5 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('abstract_concepts', 'خلاصون', 1446, 'Genesis 49:18', 'yousafzai2019', 'OT', 'Genesis', 49, 18),
('abstract_concepts', 'رحم', 1129, 'Genesis 39:21', 'yousafzai2019', 'OT', 'Genesis', 39, 21),
('abstract_concepts', 'رحم', 2418, 'Exodus 33:19', 'yousafzai2019', 'OT', 'Exodus', 33, 19),
('abstract_concepts', 'عدالت', 2082, 'Exodus 23:6', 'yousafzai2019', 'OT', 'Exodus', 23, 6),
('abstract_concepts', 'عدالت', 1598, 'Exodus 5:21', 'yousafzai2019', 'OT', 'Exodus', 5, 21);

-- abstract_good (6 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('abstract_good', 'رحم', 2418, 'Exodus 33:19', 'yousafzai2019', 'OT', 'Exodus', 33, 19),
('abstract_good', 'رحم', 2428, 'Exodus 34:6', 'yousafzai2019', 'OT', 'Exodus', 34, 6),
('abstract_good', 'عدالت', 2752, 'Leviticus 5:1', 'yousafzai2019', 'OT', 'Leviticus', 5, 1),
('abstract_good', 'عدالت', 2082, 'Exodus 23:6', 'yousafzai2019', 'OT', 'Exodus', 23, 6),
('abstract_good', 'ښه', 435, 'Genesis 18:16', 'yousafzai2019', 'OT', 'Genesis', 18, 16),
('abstract_good', 'ښه', 1517, 'Exodus 2:14', 'yousafzai2019', 'OT', 'Exodus', 2, 14);

-- actions_communication (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('actions_communication', 'پوښتنه', 1237, 'Genesis 42:28', 'yousafzai2019', 'OT', 'Genesis', 42, 28),
('actions_communication', 'پوښتنه', 1274, 'Genesis 43:27', 'yousafzai2019', 'OT', 'Genesis', 43, 27);

-- actions_eat (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('actions_eat', 'تنده', 597, 'Genesis 24:19', 'yousafzai2019', 'OT', 'Genesis', 24, 19);

-- actions_fight (7 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('actions_fight', 'جنګ', 2103, 'Exodus 23:27', 'yousafzai2019', 'OT', 'Exodus', 23, 27),
('actions_fight', 'جنګ', 1580, 'Exodus 5:3', 'yousafzai2019', 'OT', 'Exodus', 5, 3),
('actions_fight', 'جګړه', 2034, 'Exodus 21:22', 'yousafzai2019', 'OT', 'Exodus', 21, 22),
('actions_fight', 'جګړه', 699, 'Genesis 26:20', 'yousafzai2019', 'OT', 'Genesis', 26, 20),
('actions_fight', 'شکست', 348, 'Genesis 14:15', 'yousafzai2019', 'OT', 'Genesis', 14, 15),
('actions_fight', 'شکست', 338, 'Genesis 14:5', 'yousafzai2019', 'OT', 'Genesis', 14, 5),
('actions_fight', 'ماته', 597, 'Genesis 24:19', 'yousafzai2019', 'OT', 'Genesis', 24, 19);

-- actions_see (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('actions_see', 'کولاو', 1208, 'Genesis 41:56', 'yousafzai2019', 'OT', 'Genesis', 41, 56),
('actions_see', 'کولاو', 1236, 'Genesis 42:27', 'yousafzai2019', 'OT', 'Genesis', 42, 27);

-- body_parts_head (9 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('body_parts_head', 'سترګه', 2038, 'Exodus 21:26', 'yousafzai2019', 'OT', 'Exodus', 21, 26),
('body_parts_head', 'سترګه', 1115, 'Genesis 39:7', 'yousafzai2019', 'OT', 'Genesis', 39, 7),
('body_parts_head', 'غاښ', 2036, 'Exodus 21:24', 'yousafzai2019', 'OT', 'Exodus', 21, 24),
('body_parts_head', 'غاښ', 2039, 'Exodus 21:27', 'yousafzai2019', 'OT', 'Exodus', 21, 27),
('body_parts_head', 'غوږ', 2007, 'Exodus 20:19', 'yousafzai2019', 'OT', 'Exodus', 20, 19),
('body_parts_head', 'غوږ', 1549, 'Exodus 4:1', 'yousafzai2019', 'OT', 'Exodus', 4, 1),
('body_parts_head', 'مرۍ', 1436, 'Genesis 49:8', 'yousafzai2019', 'OT', 'Genesis', 49, 8),
('body_parts_head', 'پوزه', 600, 'Genesis 24:22', 'yousafzai2019', 'OT', 'Genesis', 24, 22),
('body_parts_head', 'پوزه', 608, 'Genesis 24:30', 'yousafzai2019', 'OT', 'Genesis', 24, 30);

-- body_parts_legs (5 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('body_parts_legs', 'ادوم', 339, 'Genesis 14:6', 'yousafzai2019', 'OT', 'Genesis', 14, 6),
('body_parts_legs', 'ادوم', 916, 'Genesis 32:3', 'yousafzai2019', 'OT', 'Genesis', 32, 3),
('body_parts_legs', 'پونده', 71, 'Genesis 3:15', 'yousafzai2019', 'OT', 'Genesis', 3, 15),
('body_parts_legs', 'پونده', 671, 'Genesis 25:26', 'yousafzai2019', 'OT', 'Genesis', 25, 26),
('body_parts_legs', 'پښه', 1198, 'Genesis 41:44', 'yousafzai2019', 'OT', 'Genesis', 41, 44);

-- body_parts_torso (12 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('body_parts_torso', 'اوږه', 623, 'Genesis 24:45', 'yousafzai2019', 'OT', 'Genesis', 24, 45),
('body_parts_torso', 'خېټه', 667, 'Genesis 25:22', 'yousafzai2019', 'OT', 'Genesis', 25, 22),
('body_parts_torso', 'خېټه', 668, 'Genesis 25:23', 'yousafzai2019', 'OT', 'Genesis', 25, 23),
('body_parts_torso', 'شا', 2192, 'Exodus 26:27', 'yousafzai2019', 'OT', 'Exodus', 26, 27),
('body_parts_torso', 'شا', 2198, 'Exodus 26:33', 'yousafzai2019', 'OT', 'Exodus', 26, 33),
('body_parts_torso', 'لاس', 1730, 'Exodus 10:12', 'yousafzai2019', 'OT', 'Exodus', 10, 12),
('body_parts_torso', 'لاس', 1739, 'Exodus 10:21', 'yousafzai2019', 'OT', 'Exodus', 10, 21),
('body_parts_torso', 'پوښتۍ', 2290, 'Exodus 29:28', 'yousafzai2019', 'OT', 'Exodus', 29, 28),
('body_parts_torso', 'پوښتۍ', 52, 'Genesis 2:21', 'yousafzai2019', 'OT', 'Genesis', 2, 21),
('body_parts_torso', 'څنګ', 2247, 'Exodus 28:26', 'yousafzai2019', 'OT', 'Exodus', 28, 26),
('body_parts_torso', 'ګوته', 1196, 'Genesis 41:42', 'yousafzai2019', 'OT', 'Genesis', 41, 42),
('body_parts_torso', 'ګوته', 2733, 'Leviticus 4:17', 'yousafzai2019', 'OT', 'Leviticus', 4, 17);

-- buildings (13 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('buildings', 'تخت', 1752, 'Exodus 11:5', 'yousafzai2019', 'OT', 'Exodus', 11, 5),
('buildings', 'تخت', 2145, 'Exodus 25:20', 'yousafzai2019', 'OT', 'Exodus', 25, 20),
('buildings', 'خېمه', 2134, 'Exodus 25:9', 'yousafzai2019', 'OT', 'Exodus', 25, 9),
('buildings', 'خېمه', 2178, 'Exodus 26:13', 'yousafzai2019', 'OT', 'Exodus', 26, 13),
('buildings', 'دروازه', 2273, 'Exodus 29:11', 'yousafzai2019', 'OT', 'Exodus', 29, 11),
('buildings', 'دروازه', 2294, 'Exodus 29:32', 'yousafzai2019', 'OT', 'Exodus', 29, 32),
('buildings', 'دېوال', 1450, 'Genesis 49:22', 'yousafzai2019', 'OT', 'Genesis', 49, 22),
('buildings', 'ښار', 267, 'Genesis 11:4', 'yousafzai2019', 'OT', 'Genesis', 11, 4),
('buildings', 'ښار', 268, 'Genesis 11:5', 'yousafzai2019', 'OT', 'Genesis', 11, 5),
('buildings', 'کور', 296, 'Genesis 12:1', 'yousafzai2019', 'OT', 'Genesis', 12, 1),
('buildings', 'کور', 415, 'Genesis 17:23', 'yousafzai2019', 'OT', 'Genesis', 17, 23),
('buildings', 'کړکۍ', 186, 'Genesis 8:6', 'yousafzai2019', 'OT', 'Genesis', 8, 6),
('buildings', 'کړکۍ', 687, 'Genesis 26:8', 'yousafzai2019', 'OT', 'Genesis', 26, 8);

-- clothing (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('clothing', 'څپلۍ', 356, 'Genesis 14:23', 'yousafzai2019', 'OT', 'Genesis', 14, 23);

-- colors (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('colors', 'تور', 1733, 'Exodus 10:15', 'yousafzai2019', 'OT', 'Exodus', 10, 15);

-- commerce (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('commerce', 'شته', 433, 'Genesis 18:14', 'yousafzai2019', 'OT', 'Genesis', 18, 14),
('commerce', 'شته', 619, 'Genesis 24:41', 'yousafzai2019', 'OT', 'Genesis', 24, 41);

-- emotions_positive (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('emotions_positive', 'رحم', 1129, 'Genesis 39:21', 'yousafzai2019', 'OT', 'Genesis', 39, 21),
('emotions_positive', 'رحم', 2418, 'Exodus 33:19', 'yousafzai2019', 'OT', 'Exodus', 33, 19);

-- family_female (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('family_female', 'لور', 2021, 'Exodus 21:7', 'yousafzai2019', 'OT', 'Exodus', 21, 7),
('family_female', 'لور', 2023, 'Exodus 21:9', 'yousafzai2019', 'OT', 'Exodus', 21, 9),
('family_female', 'نمسۍ', 1032, 'Genesis 36:14', 'yousafzai2019', 'OT', 'Genesis', 36, 14),
('family_female', 'نمسۍ', 1348, 'Genesis 46:7', 'yousafzai2019', 'OT', 'Genesis', 46, 7);

-- family_general (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('family_general', 'بچی', 1760, 'Exodus 12:3', 'yousafzai2019', 'OT', 'Exodus', 12, 3),
('family_general', 'بچی', 1503, 'Exodus 1:22', 'yousafzai2019', 'OT', 'Exodus', 1, 22),
('family_general', 'خپلوان', 1566, 'Exodus 4:18', 'yousafzai2019', 'OT', 'Exodus', 4, 18),
('family_general', 'خپلوان', 296, 'Genesis 12:1', 'yousafzai2019', 'OT', 'Genesis', 12, 1);

-- family_male (6 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('family_male', 'زوی', 1752, 'Exodus 11:5', 'yousafzai2019', 'OT', 'Exodus', 11, 5),
('family_male', 'زوی', 1784, 'Exodus 12:29', 'yousafzai2019', 'OT', 'Exodus', 12, 29),
('family_male', 'ورور', 2223, 'Exodus 28:2', 'yousafzai2019', 'OT', 'Exodus', 28, 2),
('family_male', 'ورور', 1516, 'Exodus 2:13', 'yousafzai2019', 'OT', 'Exodus', 2, 13),
('family_male', 'پلار', 1724, 'Exodus 10:6', 'yousafzai2019', 'OT', 'Exodus', 10, 6),
('family_male', 'پلار', 2029, 'Exodus 21:15', 'yousafzai2019', 'OT', 'Exodus', 21, 15);

-- food (6 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('food', 'خوراک', 1773, 'Exodus 12:16', 'yousafzai2019', 'OT', 'Exodus', 12, 16),
('food', 'خوراک', 1794, 'Exodus 12:39', 'yousafzai2019', 'OT', 'Exodus', 12, 39),
('food', 'غوښه', 2076, 'Exodus 22:31', 'yousafzai2019', 'OT', 'Exodus', 22, 31),
('food', 'غوښه', 2288, 'Exodus 29:26', 'yousafzai2019', 'OT', 'Exodus', 29, 26),
('food', 'مېوه', 11, 'Genesis 1:11', 'yousafzai2019', 'OT', 'Genesis', 1, 11),
('food', 'مېوه', 47, 'Genesis 2:16', 'yousafzai2019', 'OT', 'Genesis', 2, 16);

-- grammar_adjectives (11 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('grammar_adjectives', 'اوږد', 1730, 'Exodus 10:12', 'yousafzai2019', 'OT', 'Exodus', 10, 12),
('grammar_adjectives', 'اوږد', 2135, 'Exodus 25:10', 'yousafzai2019', 'OT', 'Exodus', 25, 10),
('grammar_adjectives', 'بد', 2066, 'Exodus 22:21', 'yousafzai2019', 'OT', 'Exodus', 22, 21),
('grammar_adjectives', 'بد', 2078, 'Exodus 23:2', 'yousafzai2019', 'OT', 'Exodus', 23, 2),
('grammar_adjectives', 'جنوب', 2211, 'Exodus 27:9', 'yousafzai2019', 'OT', 'Exodus', 27, 9),
('grammar_adjectives', 'جنوب', 2183, 'Exodus 26:18', 'yousafzai2019', 'OT', 'Exodus', 26, 18),
('grammar_adjectives', 'زوړ', 513, 'Genesis 21:7', 'yousafzai2019', 'OT', 'Genesis', 21, 7),
('grammar_adjectives', 'زوړ', 409, 'Genesis 17:17', 'yousafzai2019', 'OT', 'Genesis', 17, 17),
('grammar_adjectives', 'نوی', 1493, 'Exodus 1:8', 'yousafzai2019', 'OT', 'Exodus', 1, 8),
('grammar_adjectives', 'ښه', 1517, 'Exodus 2:14', 'yousafzai2019', 'OT', 'Exodus', 2, 14),
('grammar_adjectives', 'ښه', 435, 'Genesis 18:16', 'yousafzai2019', 'OT', 'Genesis', 18, 16);

-- grammar_adverbs (6 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('grammar_adverbs', 'اوس', 1735, 'Exodus 10:17', 'yousafzai2019', 'OT', 'Exodus', 10, 17),
('grammar_adverbs', 'اوس', 2412, 'Exodus 33:13', 'yousafzai2019', 'OT', 'Exodus', 33, 13),
('grammar_adverbs', 'دلته', 1742, 'Exodus 10:24', 'yousafzai2019', 'OT', 'Exodus', 10, 24),
('grammar_adverbs', 'دلته', 2123, 'Exodus 24:14', 'yousafzai2019', 'OT', 'Exodus', 24, 14),
('grammar_adverbs', 'هلته', 1741, 'Exodus 10:23', 'yousafzai2019', 'OT', 'Exodus', 10, 23),
('grammar_adverbs', 'هلته', 2027, 'Exodus 21:13', 'yousafzai2019', 'OT', 'Exodus', 21, 13);

-- grammar_conjunctions (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('grammar_conjunctions', 'اګر', 1118, 'Genesis 39:10', 'yousafzai2019', 'OT', 'Genesis', 39, 10),
('grammar_conjunctions', 'اګر', 1217, 'Genesis 42:8', 'yousafzai2019', 'OT', 'Genesis', 42, 8),
('grammar_conjunctions', 'نو', 1731, 'Exodus 10:13', 'yousafzai2019', 'OT', 'Exodus', 10, 13),
('grammar_conjunctions', 'نو', 1735, 'Exodus 10:17', 'yousafzai2019', 'OT', 'Exodus', 10, 17);

-- grammar_prepositions (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('grammar_prepositions', 'ته', 1735, 'Exodus 10:17', 'yousafzai2019', 'OT', 'Exodus', 10, 17),
('grammar_prepositions', 'ته', 1736, 'Exodus 10:18', 'yousafzai2019', 'OT', 'Exodus', 10, 18),
('grammar_prepositions', 'له', 1725, 'Exodus 10:7', 'yousafzai2019', 'OT', 'Exodus', 10, 7),
('grammar_prepositions', 'له', 1495, 'Exodus 1:10', 'yousafzai2019', 'OT', 'Exodus', 1, 10);

-- grammar_pronouns (8 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('grammar_pronouns', 'زما', 1746, 'Exodus 10:28', 'yousafzai2019', 'OT', 'Exodus', 10, 28),
('grammar_pronouns', 'زما', 1721, 'Exodus 10:3', 'yousafzai2019', 'OT', 'Exodus', 10, 3),
('grammar_pronouns', 'زمونږ', 1495, 'Exodus 1:10', 'yousafzai2019', 'OT', 'Exodus', 1, 10),
('grammar_pronouns', 'زمونږ', 1494, 'Exodus 1:9', 'yousafzai2019', 'OT', 'Exodus', 1, 9),
('grammar_pronouns', 'ستا', 1722, 'Exodus 10:4', 'yousafzai2019', 'OT', 'Exodus', 10, 4),
('grammar_pronouns', 'ستا', 1756, 'Exodus 11:9', 'yousafzai2019', 'OT', 'Exodus', 11, 9),
('grammar_pronouns', 'مونږ', 1743, 'Exodus 10:25', 'yousafzai2019', 'OT', 'Exodus', 10, 25),
('grammar_pronouns', 'مونږ', 1744, 'Exodus 10:26', 'yousafzai2019', 'OT', 'Exodus', 10, 26);

-- leadership (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('leadership', 'شهزادګۍ', 1512, 'Exodus 2:9', 'yousafzai2019', 'OT', 'Exodus', 2, 9);

-- nature_animals (7 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('nature_animals', 'آس', 1445, 'Genesis 49:17', 'yousafzai2019', 'OT', 'Genesis', 49, 17),
('nature_animals', 'اوښ', 642, 'Genesis 24:64', 'yousafzai2019', 'OT', 'Genesis', 24, 64),
('nature_animals', 'سپی', 1754, 'Exodus 11:7', 'yousafzai2019', 'OT', 'Exodus', 11, 7),
('nature_animals', 'غوا', 2049, 'Exodus 22:1', 'yousafzai2019', 'OT', 'Exodus', 22, 1),
('nature_animals', 'غوا', 2080, 'Exodus 23:4', 'yousafzai2019', 'OT', 'Exodus', 23, 4),
('nature_animals', 'مار', 57, 'Genesis 3:1', 'yousafzai2019', 'OT', 'Genesis', 3, 1),
('nature_animals', 'مار', 69, 'Genesis 3:13', 'yousafzai2019', 'OT', 'Genesis', 3, 13);

-- nature_land (10 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('nature_land', 'بوټی', 1730, 'Exodus 10:12', 'yousafzai2019', 'OT', 'Exodus', 10, 12),
('nature_land', 'بوټی', 36, 'Genesis 2:5', 'yousafzai2019', 'OT', 'Genesis', 2, 5),
('nature_land', 'زمکه', 2105, 'Exodus 23:29', 'yousafzai2019', 'OT', 'Exodus', 23, 29),
('nature_land', 'زمکه', 2106, 'Exodus 23:30', 'yousafzai2019', 'OT', 'Exodus', 23, 30),
('nature_land', 'صحرا', 1578, 'Exodus 5:1', 'yousafzai2019', 'OT', 'Exodus', 5, 1),
('nature_land', 'صحرا', 1580, 'Exodus 5:3', 'yousafzai2019', 'OT', 'Exodus', 5, 3),
('nature_land', 'غر', 2124, 'Exodus 24:15', 'yousafzai2019', 'OT', 'Exodus', 24, 15),
('nature_land', 'غر', 1538, 'Exodus 3:12', 'yousafzai2019', 'OT', 'Exodus', 3, 12),
('nature_land', 'مېوه', 11, 'Genesis 1:11', 'yousafzai2019', 'OT', 'Genesis', 1, 11),
('nature_land', 'مېوه', 12, 'Genesis 1:12', 'yousafzai2019', 'OT', 'Genesis', 1, 12);

-- nature_water (3 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('nature_water', 'سمندر', 2107, 'Exodus 23:31', 'yousafzai2019', 'OT', 'Exodus', 23, 31),
('nature_water', 'سمندر', 2, 'Genesis 1:2', 'yousafzai2019', 'OT', 'Genesis', 1, 2),
('nature_water', 'واوره', 1554, 'Exodus 4:6', 'yousafzai2019', 'OT', 'Exodus', 4, 6);

-- numbers_cardinal (21 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('numbers_cardinal', 'درې', 2150, 'Exodus 25:25', 'yousafzai2019', 'OT', 'Exodus', 25, 25),
('numbers_cardinal', 'درې', 2158, 'Exodus 25:33', 'yousafzai2019', 'OT', 'Exodus', 25, 33),
('numbers_cardinal', 'دوه', 2146, 'Exodus 25:21', 'yousafzai2019', 'OT', 'Exodus', 25, 21),
('numbers_cardinal', 'دوه', 2179, 'Exodus 26:14', 'yousafzai2019', 'OT', 'Exodus', 26, 14),
('numbers_cardinal', 'دېرش', 1796, 'Exodus 12:41', 'yousafzai2019', 'OT', 'Exodus', 12, 41),
('numbers_cardinal', 'دېرش', 2044, 'Exodus 21:32', 'yousafzai2019', 'OT', 'Exodus', 21, 32),
('numbers_cardinal', 'شپاړس', 2190, 'Exodus 26:25', 'yousafzai2019', 'OT', 'Exodus', 26, 25),
('numbers_cardinal', 'شپاړس', 2522, 'Exodus 36:30', 'yousafzai2019', 'OT', 'Exodus', 36, 30),
('numbers_cardinal', 'شپږ', 1792, 'Exodus 12:37', 'yousafzai2019', 'OT', 'Exodus', 12, 37),
('numbers_cardinal', 'شپږ', 2088, 'Exodus 23:12', 'yousafzai2019', 'OT', 'Exodus', 23, 12),
('numbers_cardinal', 'لس', 2216, 'Exodus 27:16', 'yousafzai2019', 'OT', 'Exodus', 27, 16),
('numbers_cardinal', 'لس', 2575, 'Exodus 38:18', 'yousafzai2019', 'OT', 'Exodus', 38, 18),
('numbers_cardinal', 'نولس', 288, 'Genesis 11:25', 'yousafzai2019', 'OT', 'Genesis', 11, 25),
('numbers_cardinal', 'پنځوس', 2175, 'Exodus 26:10', 'yousafzai2019', 'OT', 'Exodus', 26, 10),
('numbers_cardinal', 'پنځوس', 2171, 'Exodus 26:6', 'yousafzai2019', 'OT', 'Exodus', 26, 6),
('numbers_cardinal', 'څلور', 1796, 'Exodus 12:41', 'yousafzai2019', 'OT', 'Exodus', 12, 41),
('numbers_cardinal', 'څلور', 2137, 'Exodus 25:12', 'yousafzai2019', 'OT', 'Exodus', 25, 12),
('numbers_cardinal', 'څلوېښت', 2125, 'Exodus 24:18', 'yousafzai2019', 'OT', 'Exodus', 24, 18),
('numbers_cardinal', 'څلوېښت', 2142, 'Exodus 25:17', 'yousafzai2019', 'OT', 'Exodus', 25, 17),
('numbers_cardinal', 'څوارلس', 2167, 'Exodus 26:2', 'yousafzai2019', 'OT', 'Exodus', 26, 2),
('numbers_cardinal', 'څوارلس', 2501, 'Exodus 36:9', 'yousafzai2019', 'OT', 'Exodus', 36, 9);

-- numbers_ordinal (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('numbers_ordinal', 'څلورم', 2241, 'Exodus 28:20', 'yousafzai2019', 'OT', 'Exodus', 28, 20),
('numbers_ordinal', 'څلورم', 45, 'Genesis 2:14', 'yousafzai2019', 'OT', 'Genesis', 2, 14);

-- numbers_quantities (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('numbers_quantities', 'لږ', 1513, 'Exodus 2:10', 'yousafzai2019', 'OT', 'Exodus', 2, 10),
('numbers_quantities', 'لږ', 427, 'Genesis 18:8', 'yousafzai2019', 'OT', 'Genesis', 18, 8),
('numbers_quantities', 'کم', 395, 'Genesis 17:1', 'yousafzai2019', 'OT', 'Genesis', 17, 1),
('numbers_quantities', 'کم', 409, 'Genesis 17:17', 'yousafzai2019', 'OT', 'Genesis', 17, 17);

-- places (7 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('places', 'جنوب', 2211, 'Exodus 27:9', 'yousafzai2019', 'OT', 'Exodus', 27, 9),
('places', 'جنوب', 2568, 'Exodus 38:9', 'yousafzai2019', 'OT', 'Exodus', 38, 9),
('places', 'سړک', 1445, 'Genesis 49:17', 'yousafzai2019', 'OT', 'Genesis', 49, 17),
('places', 'لار', 619, 'Genesis 24:41', 'yousafzai2019', 'OT', 'Genesis', 24, 41),
('places', 'لار', 1012, 'Genesis 35:19', 'yousafzai2019', 'OT', 'Genesis', 35, 19),
('places', 'لاره', 1337, 'Genesis 45:24', 'yousafzai2019', 'OT', 'Genesis', 45, 24),
('places', 'لاره', 2402, 'Exodus 33:3', 'yousafzai2019', 'OT', 'Exodus', 33, 3);

-- relationships (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('relationships', 'ملګری', 1098, 'Genesis 38:20', 'yousafzai2019', 'OT', 'Genesis', 38, 20);

-- religious_actions (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('religious_actions', 'برکت', 1787, 'Exodus 12:32', 'yousafzai2019', 'OT', 'Exodus', 12, 32),
('religious_actions', 'برکت', 2012, 'Exodus 20:24', 'yousafzai2019', 'OT', 'Exodus', 20, 24),
('religious_actions', 'قربان', 2012, 'Exodus 20:24', 'yousafzai2019', 'OT', 'Exodus', 20, 24),
('religious_actions', 'قربان', 2013, 'Exodus 20:25', 'yousafzai2019', 'OT', 'Exodus', 20, 25);

-- religious_concepts (8 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('religious_concepts', 'فرښته', 1778, 'Exodus 12:23', 'yousafzai2019', 'OT', 'Exodus', 12, 23),
('religious_concepts', 'فرښته', 1528, 'Exodus 3:2', 'yousafzai2019', 'OT', 'Exodus', 3, 2),
('religious_concepts', 'مقدس', 2076, 'Exodus 22:31', 'yousafzai2019', 'OT', 'Exodus', 22, 31),
('religious_concepts', 'مقدس', 2132, 'Exodus 25:7', 'yousafzai2019', 'OT', 'Exodus', 25, 7),
('religious_concepts', 'مَلِک', 353, 'Genesis 14:20', 'yousafzai2019', 'OT', 'Genesis', 14, 20),
('religious_concepts', 'مَلِک', 494, 'Genesis 20:4', 'yousafzai2019', 'OT', 'Genesis', 20, 4),
('religious_concepts', 'روح', 2488, 'Exodus 35:31', 'yousafzai2019', 'OT', 'Exodus', 35, 31),
('religious_concepts', 'روح', 2, 'Genesis 1:2', 'yousafzai2019', 'OT', 'Genesis', 1, 2);

-- states_life (9 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('states_life', 'زوړ', 409, 'Genesis 17:17', 'yousafzai2019', 'OT', 'Genesis', 17, 17),
('states_life', 'زوړ', 513, 'Genesis 21:7', 'yousafzai2019', 'OT', 'Genesis', 21, 7),
('states_life', 'مرګ', 1735, 'Exodus 10:17', 'yousafzai2019', 'OT', 'Exodus', 10, 17),
('states_life', 'مرګ', 2291, 'Exodus 29:29', 'yousafzai2019', 'OT', 'Exodus', 29, 29),
('states_life', 'مړ', 1491, 'Exodus 1:6', 'yousafzai2019', 'OT', 'Exodus', 1, 6),
('states_life', 'مړ', 2026, 'Exodus 21:12', 'yousafzai2019', 'OT', 'Exodus', 21, 12),
('states_life', 'نوی', 1493, 'Exodus 1:8', 'yousafzai2019', 'OT', 'Exodus', 1, 8),
('states_life', 'ژوند', 2035, 'Exodus 21:23', 'yousafzai2019', 'OT', 'Exodus', 21, 23),
('states_life', 'ژوند', 471, 'Genesis 19:19', 'yousafzai2019', 'OT', 'Genesis', 19, 19);

-- states_quality (8 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('states_quality', 'بد', 2078, 'Exodus 23:2', 'yousafzai2019', 'OT', 'Exodus', 23, 2),
('states_quality', 'بد', 2083, 'Exodus 23:7', 'yousafzai2019', 'OT', 'Exodus', 23, 7),
('states_quality', 'مقدس', 2132, 'Exodus 25:7', 'yousafzai2019', 'OT', 'Exodus', 25, 7),
('states_quality', 'مقدس', 2198, 'Exodus 26:33', 'yousafzai2019', 'OT', 'Exodus', 26, 33),
('states_quality', 'پاک', 1734, 'Exodus 10:16', 'yousafzai2019', 'OT', 'Exodus', 10, 16),
('states_quality', 'پاک', 1735, 'Exodus 10:17', 'yousafzai2019', 'OT', 'Exodus', 10, 17),
('states_quality', 'ښه', 1517, 'Exodus 2:14', 'yousafzai2019', 'OT', 'Exodus', 2, 14),
('states_quality', 'ښه', 435, 'Genesis 18:16', 'yousafzai2019', 'OT', 'Genesis', 18, 16);

-- states_size (10 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('states_size', 'اوږد', 1739, 'Exodus 10:21', 'yousafzai2019', 'OT', 'Exodus', 10, 21),
('states_size', 'اوږد', 2135, 'Exodus 25:10', 'yousafzai2019', 'OT', 'Exodus', 25, 10),
('states_size', 'لوړ', 2148, 'Exodus 25:23', 'yousafzai2019', 'OT', 'Exodus', 25, 23),
('states_size', 'لوړ', 2218, 'Exodus 27:18', 'yousafzai2019', 'OT', 'Exodus', 27, 18),
('states_size', 'لوی', 1514, 'Exodus 2:11', 'yousafzai2019', 'OT', 'Exodus', 2, 11),
('states_size', 'لوی', 1702, 'Exodus 9:17', 'yousafzai2019', 'OT', 'Exodus', 9, 17),
('states_size', 'لږ', 1513, 'Exodus 2:10', 'yousafzai2019', 'OT', 'Exodus', 2, 10),
('states_size', 'لږ', 427, 'Genesis 18:8', 'yousafzai2019', 'OT', 'Genesis', 18, 8),
('states_size', 'وړوکی', 1092, 'Genesis 38:14', 'yousafzai2019', 'OT', 'Genesis', 38, 14),
('states_size', 'وړوکی', 472, 'Genesis 19:20', 'yousafzai2019', 'OT', 'Genesis', 19, 20);

-- time_concepts (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('time_concepts', 'اوس', 1544, 'Exodus 3:18', 'yousafzai2019', 'OT', 'Exodus', 3, 18),
('time_concepts', 'اوس', 1534, 'Exodus 3:8', 'yousafzai2019', 'OT', 'Exodus', 3, 8);

-- time_days (1 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('time_days', 'هفته', 2088, 'Exodus 23:12', 'yousafzai2019', 'OT', 'Exodus', 23, 12);

-- time_months (4 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('time_months', 'اوړی', 202, 'Genesis 8:22', 'yousafzai2019', 'OT', 'Genesis', 8, 22),
('time_months', 'ژمی', 202, 'Genesis 8:22', 'yousafzai2019', 'OT', 'Genesis', 8, 22),
('time_months', 'کال', 1780, 'Exodus 12:25', 'yousafzai2019', 'OT', 'Exodus', 12, 25),
('time_months', 'کال', 2016, 'Exodus 21:2', 'yousafzai2019', 'OT', 'Exodus', 21, 2);

-- time_periods (10 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('time_periods', 'شپه', 1731, 'Exodus 10:13', 'yousafzai2019', 'OT', 'Exodus', 10, 13),
('time_periods', 'شپه', 1769, 'Exodus 12:12', 'yousafzai2019', 'OT', 'Exodus', 12, 12),
('time_periods', 'ماښام', 453, 'Genesis 19:1', 'yousafzai2019', 'OT', 'Genesis', 19, 1),
('time_periods', 'ماښام', 641, 'Genesis 24:63', 'yousafzai2019', 'OT', 'Genesis', 24, 63),
('time_periods', 'موده', 83, 'Genesis 4:3', 'yousafzai2019', 'OT', 'Genesis', 4, 3),
('time_periods', 'موده', 1524, 'Exodus 2:23', 'yousafzai2019', 'OT', 'Exodus', 2, 23),
('time_periods', 'وخت', 1797, 'Exodus 12:42', 'yousafzai2019', 'OT', 'Exodus', 12, 42),
('time_periods', 'وخت', 1499, 'Exodus 1:16', 'yousafzai2019', 'OT', 'Exodus', 1, 16),
('time_periods', 'ورځ', 1731, 'Exodus 10:13', 'yousafzai2019', 'OT', 'Exodus', 10, 13),
('time_periods', 'ورځ', 1746, 'Exodus 10:28', 'yousafzai2019', 'OT', 'Exodus', 10, 28);

-- weather (10 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('weather', 'آسمان', 267, 'Genesis 11:4', 'yousafzai2019', 'OT', 'Genesis', 11, 4),
('weather', 'آسمان', 352, 'Genesis 14:19', 'yousafzai2019', 'OT', 'Genesis', 14, 19),
('weather', 'باران', 1716, 'Exodus 9:33', 'yousafzai2019', 'OT', 'Exodus', 9, 33),
('weather', 'باران', 476, 'Genesis 19:24', 'yousafzai2019', 'OT', 'Genesis', 19, 24),
('weather', 'سپوږمۍ', 1051, 'Genesis 37:9', 'yousafzai2019', 'OT', 'Genesis', 37, 9),
('weather', 'سپوږمۍ', 16, 'Genesis 1:16', 'yousafzai2019', 'OT', 'Genesis', 1, 16),
('weather', 'طوفان', 1717, 'Exodus 9:34', 'yousafzai2019', 'OT', 'Exodus', 9, 34),
('weather', 'نمر', 16, 'Genesis 1:16', 'yousafzai2019', 'OT', 'Genesis', 1, 16),
('weather', 'نمر', 1051, 'Genesis 37:9', 'yousafzai2019', 'OT', 'Genesis', 37, 9),
('weather', 'واوره', 1554, 'Exodus 4:6', 'yousafzai2019', 'OT', 'Exodus', 4, 6);

-- work (2 entries)
INSERT INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
) VALUES
('work', 'نوکر', 590, 'Genesis 24:12', 'yousafzai2019', 'OT', 'Genesis', 24, 12),
('work', 'نوکر', 580, 'Genesis 24:2', 'yousafzai2019', 'OT', 'Genesis', 24, 2);

