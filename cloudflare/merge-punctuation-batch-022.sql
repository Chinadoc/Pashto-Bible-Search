
-- Merge 2 variants of 'مِلاوېدل': مِلاوېدل., مِلاوېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِلاوېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مِلاوېدل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مِلاوېدل' AND pashto_word NOT IN ('مِلاوېدل.','مِلاوېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِلاوېدل', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِلاوېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'مِلاوېدل،';

-- Merge 1 variants of 'محل': محل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'محل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'محل' AND pashto_word NOT IN ('محل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('محل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'محل،';

-- Merge 1 variants of 'سر': سر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سر' AND pashto_word NOT IN ('سر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سر،';

-- Merge 2 variants of 'مخامخ': مخامخ،, مخامخ.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخامخ،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مخامخ.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مخامخ' AND pashto_word NOT IN ('مخامخ،','مخامخ.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخامخ', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخامخ،';
DELETE FROM word_frequencies WHERE pashto_word = 'مخامخ.';

-- Merge 1 variants of 'مِصريانو': مِصريانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِصريانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مِصريانو' AND pashto_word NOT IN ('مِصريانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِصريانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِصريانو،';

-- Merge 1 variants of 'پنځوسو': پنځوسو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پنځوسو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پنځوسو' AND pashto_word NOT IN ('پنځوسو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پنځوسو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پنځوسو،';

-- Merge 1 variants of 'حِويان': حِويان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِويان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حِويان' AND pashto_word NOT IN ('حِويان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِويان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِويان،';

-- Merge 1 variants of 'ګلونه': ګلونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګلونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګلونه' AND pashto_word NOT IN ('ګلونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګلونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګلونه،';

-- Merge 1 variants of 'وګنډه': وګنډه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګنډه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وګنډه' AND pashto_word NOT IN ('وګنډه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګنډه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګنډه.';

-- Merge 1 variants of 'ونښلوه': ونښلوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونښلوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ونښلوه' AND pashto_word NOT IN ('ونښلوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونښلوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونښلوه.';

-- Merge 1 variants of 'لم': لم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لم' AND pashto_word NOT IN ('لم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لم،';

-- Merge 2 variants of 'وينځى': وينځى،, وينځى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وينځى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وينځى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وينځى' AND pashto_word NOT IN ('وينځى،','وينځى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينځى', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وينځى،';
DELETE FROM word_frequencies WHERE pashto_word = 'وينځى.';

-- Merge 1 variants of 'ګډېدل': ګډېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډېدل.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګډېدل' AND pashto_word NOT IN ('ګډېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډېدل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډېدل.';

-- Merge 1 variants of 'پټيږى': پټيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټيږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پټيږى' AND pashto_word NOT IN ('پټيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټيږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټيږى،';

-- Merge 1 variants of 'پړدې': پړدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پړدې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پړدې' AND pashto_word NOT IN ('پړدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پړدې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پړدې،';

-- Merge 1 variants of 'رسۍ': رسۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسۍ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رسۍ' AND pashto_word NOT IN ('رسۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسۍ،';

-- Merge 1 variants of 'آسمانى': آسمانى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسمانى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'آسمانى' AND pashto_word NOT IN ('آسمانى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسمانى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسمانى،';

-- Merge 1 variants of 'اوړو': اوړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوړو' AND pashto_word NOT IN ('اوړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړو،';

-- Merge 1 variants of 'حلاليږى': حلاليږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حلاليږى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حلاليږى' AND pashto_word NOT IN ('حلاليږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حلاليږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حلاليږى.';

-- Merge 2 variants of 'ذريعه': ذريعه،, ذريعه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ذريعه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ذريعه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ذريعه' AND pashto_word NOT IN ('ذريعه،','ذريعه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ذريعه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ذريعه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ذريعه.';

-- Merge 1 variants of 'ګوډ': ګوډ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوډ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګوډ' AND pashto_word NOT IN ('ګوډ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوډ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوډ،';

-- Merge 1 variants of 'وروړى': وروړى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وروړى' AND pashto_word NOT IN ('وروړى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروړى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروړى.';

-- Merge 1 variants of 'دُرشلو': دُرشلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دُرشلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دُرشلو' AND pashto_word NOT IN ('دُرشلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دُرشلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دُرشلو،';

-- Merge 1 variants of 'داسې': داسې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'داسې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'داسې' AND pashto_word NOT IN ('داسې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('داسې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'داسې،';

-- Merge 1 variants of 'اينځر': اينځر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اينځر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اينځر' AND pashto_word NOT IN ('اينځر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اينځر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اينځر،';

-- Merge 1 variants of 'ړو': ړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ړو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ړو' AND pashto_word NOT IN ('ړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ړو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ړو،';

-- Merge 1 variants of 'پېغام': پېغام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغام،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پېغام' AND pashto_word NOT IN ('پېغام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغام', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغام،';

-- Merge 1 variants of 'لِبنى': لِبنى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لِبنى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لِبنى' AND pashto_word NOT IN ('لِبنى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لِبنى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لِبنى،';

-- Merge 1 variants of 'حِفر': حِفر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِفر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حِفر' AND pashto_word NOT IN ('حِفر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِفر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِفر،';

-- Merge 1 variants of 'رِقم': رِقم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رِقم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رِقم' AND pashto_word NOT IN ('رِقم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رِقم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رِقم،';

-- Merge 1 variants of 'بوتلې': بوتلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بوتلې' AND pashto_word NOT IN ('بوتلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلې،';

-- Merge 1 variants of 'ايساريږى': ايساريږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايساريږى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ايساريږى' AND pashto_word NOT IN ('ايساريږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايساريږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايساريږى.';

-- Merge 1 variants of 'لګولې': لګولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګولې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لګولې' AND pashto_word NOT IN ('لګولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګولې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګولې.';

-- Merge 1 variants of 'ومنو': ومنو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ومنو' AND pashto_word NOT IN ('ومنو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومنو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومنو.';

-- Merge 1 variants of 'راکوزيږى': راکوزيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوزيږى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راکوزيږى' AND pashto_word NOT IN ('راکوزيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوزيږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوزيږى.';

-- Merge 1 variants of 'لکيس': لکيس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لکيس،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لکيس' AND pashto_word NOT IN ('لکيس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لکيس', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لکيس،';

-- Merge 1 variants of 'جزر': جزر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جزر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جزر' AND pashto_word NOT IN ('جزر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جزر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جزر،';

-- Merge 1 variants of 'لِبناه': لِبناه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لِبناه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لِبناه' AND pashto_word NOT IN ('لِبناه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لِبناه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لِبناه،';

-- Merge 1 variants of 'بيرسبع': بيرسبع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيرسبع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بيرسبع' AND pashto_word NOT IN ('بيرسبع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيرسبع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيرسبع،';

-- Merge 1 variants of 'صِقلاج': صِقلاج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صِقلاج،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'صِقلاج' AND pashto_word NOT IN ('صِقلاج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صِقلاج', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صِقلاج،';

-- Merge 1 variants of 'راما': راما،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راما،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راما' AND pashto_word NOT IN ('راما،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راما', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راما،';

-- Merge 1 variants of 'رامات': رامات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رامات،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رامات' AND pashto_word NOT IN ('رامات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رامات', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رامات،';

-- Merge 1 variants of 'بصر': بصر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بصر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بصر' AND pashto_word NOT IN ('بصر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بصر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بصر،';

-- Merge 1 variants of 'تارح': تارح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تارح،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تارح' AND pashto_word NOT IN ('تارح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تارح', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تارح،';

-- Merge 1 variants of 'صيدا': صيدا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صيدا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'صيدا' AND pashto_word NOT IN ('صيدا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صيدا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صيدا،';

-- Merge 1 variants of 'ووتلو': ووتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووتلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووتلو' AND pashto_word NOT IN ('ووتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووتلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووتلو،';

-- Merge 1 variants of 'شام': شام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شام،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شام' AND pashto_word NOT IN ('شام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شام', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شام،';

-- Merge 1 variants of 'فلستيانو': فلستيانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فلستيانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'فلستيانو' AND pashto_word NOT IN ('فلستيانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فلستيانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فلستيانو،';

-- Merge 1 variants of 'وهلو': وهلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وهلو' AND pashto_word NOT IN ('وهلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهلو.';

-- Merge 1 variants of 'وموندو': وموندو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وموندو' AND pashto_word NOT IN ('وموندو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموندو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموندو.';

-- Merge 2 variants of 'راوګرځېدل': راوګرځېدل., راوګرځېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځېدل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوګرځېدل' AND pashto_word NOT IN ('راوګرځېدل.','راوګرځېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځېدل', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځېدل،';

-- Merge 1 variants of 'روت': روت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'روت' AND pashto_word NOT IN ('روت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روت،';

-- Merge 1 variants of 'مقرروى': مقرروى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مقرروى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مقرروى' AND pashto_word NOT IN ('مقرروى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مقرروى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مقرروى.';

-- Merge 1 variants of 'وغږولې': وغږولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغږولې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغږولې' AND pashto_word NOT IN ('وغږولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغږولې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغږولې.';

-- Merge 1 variants of 'يَسى': يَسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يَسى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يَسى' AND pashto_word NOT IN ('يَسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يَسى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يَسى،';

-- Merge 2 variants of 'رسولو': رسولو., رسولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسولو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'رسولو' AND pashto_word NOT IN ('رسولو.','رسولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسولو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسولو،';

-- Merge 1 variants of 'ويرېدو': ويرېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويرېدو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ويرېدو' AND pashto_word NOT IN ('ويرېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويرېدو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويرېدو.';

-- Merge 1 variants of 'خوښوى': خوښوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوښوى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خوښوى' AND pashto_word NOT IN ('خوښوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوښوى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوښوى،';

-- Merge 1 variants of '”بې‌شکه': ”بې‌شکه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”بې‌شکه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = '”بې‌شکه' AND pashto_word NOT IN ('”بې‌شکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”بې‌شکه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”بې‌شکه،';

-- Merge 2 variants of 'راوغوښتو': راوغوښتو،, راوغوښتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوغوښتو' AND pashto_word NOT IN ('راوغوښتو،','راوغوښتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښتو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتو.';

-- Merge 1 variants of 'وساتلم': وساتلم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتلم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وساتلم' AND pashto_word NOT IN ('وساتلم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتلم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتلم.';

-- Merge 1 variants of 'خوشحالوه': خوشحالوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خوشحالوه' AND pashto_word NOT IN ('خوشحالوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالوه.';

-- Merge 1 variants of 'سموع': سموع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سموع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سموع' AND pashto_word NOT IN ('سموع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سموع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سموع،';

-- Merge 1 variants of 'سوباب': سوباب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوباب،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سوباب' AND pashto_word NOT IN ('سوباب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوباب', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوباب،';

-- Merge 1 variants of 'يفيع': يفيع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يفيع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يفيع' AND pashto_word NOT IN ('يفيع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يفيع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يفيع،';

-- Merge 1 variants of 'ګډانو': ګډانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګډانو' AND pashto_word NOT IN ('ګډانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډانو،';

-- Merge 2 variants of 'ږدې': ږدې., ږدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ږدې' AND pashto_word NOT IN ('ږدې.','ږدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږدې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږدې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ږدې،';

-- Merge 1 variants of 'لګېدل': لګېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګېدل.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لګېدل' AND pashto_word NOT IN ('لګېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګېدل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګېدل.';

-- Merge 1 variants of 'غاښونه': غاښونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غاښونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غاښونه' AND pashto_word NOT IN ('غاښونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غاښونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غاښونه،';

-- Merge 1 variants of 'چُوغې': چُوغې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چُوغې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'چُوغې' AND pashto_word NOT IN ('چُوغې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چُوغې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چُوغې،';

-- Merge 1 variants of 'وسلې': وسلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسلې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وسلې' AND pashto_word NOT IN ('وسلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسلې،';

-- Merge 1 variants of 'واوړى': واوړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واوړى' AND pashto_word NOT IN ('واوړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوړى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوړى،';

-- Merge 1 variants of 'واورېدې': واورېدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واورېدې' AND pashto_word NOT IN ('واورېدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېدې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدې،';

-- Merge 1 variants of 'جنګونه': جنګونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جنګونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جنګونه' AND pashto_word NOT IN ('جنګونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جنګونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جنګونه،';

-- Merge 2 variants of 'خِدمتګاره': خِدمتګاره،, خِدمتګاره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خِدمتګاره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خِدمتګاره.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'خِدمتګاره' AND pashto_word NOT IN ('خِدمتګاره،','خِدمتګاره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خِدمتګاره', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خِدمتګاره،';
DELETE FROM word_frequencies WHERE pashto_word = 'خِدمتګاره.';

-- Merge 1 variants of 'موندلو': موندلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'موندلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'موندلو' AND pashto_word NOT IN ('موندلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موندلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موندلو.';

-- Merge 1 variants of 'پېغمبران': پېغمبران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغمبران،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پېغمبران' AND pashto_word NOT IN ('پېغمبران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغمبران', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغمبران،';

-- Merge 1 variants of 'بيګلو': بيګلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيګلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بيګلو' AND pashto_word NOT IN ('بيګلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيګلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيګلو،';

-- Merge 1 variants of 'بُتان': بُتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بُتان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بُتان' AND pashto_word NOT IN ('بُتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بُتان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بُتان،';

-- Merge 1 variants of 'خفګان': خفګان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خفګان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خفګان' AND pashto_word NOT IN ('خفګان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خفګان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خفګان،';

-- Merge 1 variants of 'اخيقام': اخيقام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخيقام،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اخيقام' AND pashto_word NOT IN ('اخيقام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخيقام', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخيقام،';

-- Merge 1 variants of 'اِلياب': اِلياب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِلياب،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اِلياب' AND pashto_word NOT IN ('اِلياب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِلياب', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِلياب،';

-- Merge 1 variants of 'اِلعاسه': اِلعاسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِلعاسه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اِلعاسه' AND pashto_word NOT IN ('اِلعاسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِلعاسه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِلعاسه،';

-- Merge 1 variants of 'فداياه': فداياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فداياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'فداياه' AND pashto_word NOT IN ('فداياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فداياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فداياه،';

-- Merge 1 variants of 'برکياه': برکياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برکياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'برکياه' AND pashto_word NOT IN ('برکياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برکياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برکياه،';

-- Merge 1 variants of 'يعى‌ايل': يعى‌ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يعى‌ايل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يعى‌ايل' AND pashto_word NOT IN ('يعى‌ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يعى‌ايل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يعى‌ايل،';

-- Merge 1 variants of 'حسبياه': حسبياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حسبياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حسبياه' AND pashto_word NOT IN ('حسبياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حسبياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حسبياه،';

-- Merge 1 variants of 'عبدياه': عبدياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عبدياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عبدياه' AND pashto_word NOT IN ('عبدياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عبدياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عبدياه،';

-- Merge 1 variants of 'خاطره': خاطره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاطره،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خاطره' AND pashto_word NOT IN ('خاطره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاطره', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاطره،';

-- Merge 1 variants of 'يشعياه': يشعياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يشعياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يشعياه' AND pashto_word NOT IN ('يشعياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يشعياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يشعياه،';

-- Merge 2 variants of 'بيانولو': بيانولو،, بيانولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيانولو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بيانولو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بيانولو' AND pashto_word NOT IN ('بيانولو،','بيانولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيانولو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيانولو،';
DELETE FROM word_frequencies WHERE pashto_word = 'بيانولو.';

-- Merge 1 variants of 'بوډاګان': بوډاګان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوډاګان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بوډاګان' AND pashto_word NOT IN ('بوډاګان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوډاګان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوډاګان،';

-- Merge 1 variants of 'آسمانونه': آسمانونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسمانونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'آسمانونه' AND pashto_word NOT IN ('آسمانونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسمانونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسمانونه،';

-- Merge 1 variants of 'څيزونه': څيزونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څيزونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'څيزونه' AND pashto_word NOT IN ('څيزونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څيزونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څيزونه،';

-- Merge 1 variants of 'وکَرى': وکَرى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکَرى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وکَرى' AND pashto_word NOT IN ('وکَرى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکَرى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکَرى.';

-- Merge 1 variants of 'سلامونه': سلامونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سلامونه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سلامونه' AND pashto_word NOT IN ('سلامونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلامونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سلامونه.';

-- Merge 1 variants of 'وړُو': وړُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړُو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وړُو' AND pashto_word NOT IN ('وړُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړُو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړُو.';

-- Merge 1 variants of 'دشمنان': دشمنان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دشمنان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دشمنان' AND pashto_word NOT IN ('دشمنان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دشمنان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دشمنان،';

-- Merge 1 variants of 'مدام': مدام.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مدام.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مدام' AND pashto_word NOT IN ('مدام.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مدام', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مدام.';

-- Merge 1 variants of 'نګهبان': نګهبان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نګهبان.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'نګهبان' AND pashto_word NOT IN ('نګهبان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نګهبان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نګهبان.';

-- Merge 1 variants of 'آوازونه': آوازونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آوازونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'آوازونه' AND pashto_word NOT IN ('آوازونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آوازونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آوازونه،';

-- Merge 1 variants of 'مينې': مينې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مينې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مينې' AND pashto_word NOT IN ('مينې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مينې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مينې،';

-- Merge 2 variants of 'جوړوه': جوړوه., جوړوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جوړوه' AND pashto_word NOT IN ('جوړوه.','جوړوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړوه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوه،';

-- Merge 1 variants of 'مالِک': مالِک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مالِک،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مالِک' AND pashto_word NOT IN ('مالِک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِک', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مالِک،';

-- Merge 1 variants of 'لګوم': لګوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګوم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لګوم' AND pashto_word NOT IN ('لګوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګوم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګوم،';

-- Merge 1 variants of 'اخستونکى': اخستونکى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستونکى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اخستونکى' AND pashto_word NOT IN ('اخستونکى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخستونکى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخستونکى،';

-- Merge 1 variants of 'ګټى': ګټى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګټى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګټى' AND pashto_word NOT IN ('ګټى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګټى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګټى،';

-- Merge 1 variants of 'ژوندون': ژوندون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژوندون،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ژوندون' AND pashto_word NOT IN ('ژوندون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژوندون', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژوندون،';

-- Merge 1 variants of 'چليږى': چليږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چليږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'چليږى' AND pashto_word NOT IN ('چليږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چليږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چليږى،';

-- Merge 2 variants of 'فوجيان': فوجيان،, فوجيان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'فوجيان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'فوجيان.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'فوجيان' AND pashto_word NOT IN ('فوجيان،','فوجيان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فوجيان', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فوجيان،';
DELETE FROM word_frequencies WHERE pashto_word = 'فوجيان.';

-- Merge 1 variants of 'رسى': رسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رسى' AND pashto_word NOT IN ('رسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسى،';

-- Merge 1 variants of 'ريږدى': ريږدى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ريږدى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ريږدى' AND pashto_word NOT IN ('ريږدى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ريږدى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ريږدى.';

-- Merge 1 variants of 'حسابيږى': حسابيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حسابيږى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حسابيږى' AND pashto_word NOT IN ('حسابيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حسابيږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حسابيږى.';

-- Merge 1 variants of 'کارو': کارو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کارو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کارو' AND pashto_word NOT IN ('کارو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کارو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کارو،';

-- Merge 1 variants of 'پيړۍ': پيړۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پيړۍ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پيړۍ' AND pashto_word NOT IN ('پيړۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پيړۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پيړۍ،';

-- Merge 1 variants of 'ګليل': ګليل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګليل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګليل' AND pashto_word NOT IN ('ګليل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګليل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګليل،';

-- Merge 1 variants of 'شرابى': شرابى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرابى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شرابى' AND pashto_word NOT IN ('شرابى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرابى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرابى،';

-- Merge 2 variants of 'وروړو': وروړو،, وروړو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وروړو' AND pashto_word NOT IN ('وروړو،','وروړو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروړو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروړو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وروړو.';

-- Merge 1 variants of 'کينه': کينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کينه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کينه' AND pashto_word NOT IN ('کينه،');
