-- Clean punctuation from form_occurrences table
-- Removes leading/trailing commas, periods, colons, and other punctuation

-- Remove leading punctuation (SQLite: remove one char at a time until no match)
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, ',') WHERE pashto_form LIKE ',%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '.') WHERE pashto_form LIKE '.%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, ':') WHERE pashto_form LIKE ':%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, ';') WHERE pashto_form LIKE ';%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '!') WHERE pashto_form LIKE '!%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '?') WHERE pashto_form LIKE '?%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '(') WHERE pashto_form LIKE '(%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '[') WHERE pashto_form LIKE '[%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '{') WHERE pashto_form LIKE '{%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '،') WHERE pashto_form LIKE '،%';
UPDATE form_occurrences SET pashto_form = LTRIM(pashto_form, '۔') WHERE pashto_form LIKE '۔%';

-- Remove trailing punctuation
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, ',') WHERE pashto_form LIKE '%,';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '.') WHERE pashto_form LIKE '%.';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, ':') WHERE pashto_form LIKE '%:';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, ';') WHERE pashto_form LIKE '%;';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '!') WHERE pashto_form LIKE '%!';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '?') WHERE pashto_form LIKE '%?';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, ')') WHERE pashto_form LIKE '%)';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, ']') WHERE pashto_form LIKE '%]';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '}') WHERE pashto_form LIKE '%}';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '،') WHERE pashto_form LIKE '%،';
UPDATE form_occurrences SET pashto_form = RTRIM(pashto_form, '۔') WHERE pashto_form LIKE '%۔';

-- Remove all punctuation (comprehensive cleanup)
UPDATE form_occurrences
SET pashto_form = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  pashto_form, ',', ''), '.', ''), ':', ''), ';', ''), '!', ''), '?', ''), 
  '(', ''), ')', ''), '[', ''), ']', ''), '{', ''), '}', '')
WHERE pashto_form LIKE '%,%' 
   OR pashto_form LIKE '%.%'
   OR pashto_form LIKE '%:%'
   OR pashto_form LIKE '%;%'
   OR pashto_form LIKE '%!%'
   OR pashto_form LIKE '%?%'
   OR pashto_form LIKE '%(%'
   OR pashto_form LIKE '%)%'
   OR pashto_form LIKE '%[%'
   OR pashto_form LIKE '%]%'
   OR pashto_form LIKE '%{%'
   OR pashto_form LIKE '%}%';

-- Trim whitespace after punctuation removal
UPDATE form_occurrences
SET pashto_form = TRIM(pashto_form)
WHERE pashto_form != TRIM(pashto_form);

