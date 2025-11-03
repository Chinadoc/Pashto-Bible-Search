-- Handle multi-word entries: split or mark as sandwiches
-- Based on LingDocs sandwiches: https://grammar.lingdocs.com/sandwiches/sandwiches/

-- Mark known circumpositions
-- په ... کې
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'په ... کې' WHERE pashto_word LIKE 'په%کې' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- د ... دپاره
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'د ... دپاره' WHERE pashto_word LIKE 'د%دپاره' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- پر ... باندې
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'پر ... باندې' WHERE pashto_word LIKE 'پر%باندې' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- د ... په اړه
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'د ... په اړه' WHERE pashto_word LIKE 'د%په اړه' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- د ... په بارې کې
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'د ... په بارې کې' WHERE pashto_word LIKE 'د%په بارې کې' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- پر ... سربېره
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'پر ... سربېره' WHERE pashto_word LIKE 'پر%سربېره' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');
-- له ... سره
UPDATE word_frequencies SET pos = 'circumposition', romanization = 'له ... سره' WHERE pashto_word LIKE 'له%سره' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');

-- Mark postposition phrases
UPDATE word_frequencies SET pos = 'postposition_phrase' WHERE pashto_word LIKE '% ته' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');

-- Mark phrases with future particle به
UPDATE word_frequencies SET pos = 'particle_phrase' WHERE pashto_word LIKE '% به%' AND pashto_word LIKE '% %' AND (pos IS NULL OR pos = '' OR pos = 'phrase');

-- Note: To actually split entries, we need to:
-- 1. Create new word_frequencies entries for each word
-- 2. Update word_verse_mapping to point to new entries
-- 3. Delete or mark original multi-word entry
-- This is handled by split-multiword-entries.py script