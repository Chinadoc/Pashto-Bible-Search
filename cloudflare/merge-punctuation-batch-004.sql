
-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړې،';
DELETE FROM word_frequencies WHERE pashto_word = 'غواړې.';

-- Merge 3 variants of 'وتښتی': وتښتی،, وتښتی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتی!';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'وتښتی' AND pashto_word NOT IN ('وتښتی،','وتښتی.','وتښتی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتی', 38);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتی!';

-- Merge 2 variants of 'ورکوې': ورکوې., ورکوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوې،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'ورکوې' AND pashto_word NOT IN ('ورکوې.','ورکوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوې', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوې،';

-- Merge 2 variants of 'کړلې': کړلې., کړلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړلې،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'کړلې' AND pashto_word NOT IN ('کړلې.','کړلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړلې', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړلې،';

-- Merge 2 variants of 'واورېد': واورېد،, واورېد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېد،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېد.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'واورېد' AND pashto_word NOT IN ('واورېد،','واورېد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېد', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېد،';
DELETE FROM word_frequencies WHERE pashto_word = 'واورېد.';

-- Merge 2 variants of 'وټاکه': وټاکه., وټاکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکه،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'وټاکه' AND pashto_word NOT IN ('وټاکه.','وټاکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وټاکه', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکه،';

-- Merge 2 variants of 'نیسي': نیسي،, نیسي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیسي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نیسي.»';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'نیسي' AND pashto_word NOT IN ('نیسي،','نیسي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیسي', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیسي،';
DELETE FROM word_frequencies WHERE pashto_word = 'نیسي.»';

-- Merge 2 variants of 'څښتن': څښتن،, څښتن!

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښتن،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښتن!';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'څښتن' AND pashto_word NOT IN ('څښتن،','څښتن!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښتن', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښتن،';
DELETE FROM word_frequencies WHERE pashto_word = 'څښتن!';

-- Merge 2 variants of 'پرېږده': پرېږده., پرېږده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږده،';

-- Sum frequencies from all variants: 39 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 39
WHERE pashto_word = 'پرېږده' AND pashto_word NOT IN ('پرېږده.','پرېږده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږده', 39);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږده.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږده،';

-- Merge 1 variants of 'غرونو': غرونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غرونو،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'غرونو' AND pashto_word NOT IN ('غرونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غرونو', 20);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غرونو،';

-- Merge 2 variants of 'ګڼى': ګڼى،, ګڼى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼى.';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'ګڼى' AND pashto_word NOT IN ('ګڼى،','ګڼى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼى', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼى.';

-- Merge 2 variants of 'تېروى': تېروى., تېروى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروى،';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'تېروى' AND pashto_word NOT IN ('تېروى.','تېروى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروى', 38);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروى.';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروى،';

-- Merge 1 variants of 'صاحِبه': صاحِبه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صاحِبه،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'صاحِبه' AND pashto_word NOT IN ('صاحِبه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صاحِبه', 20);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صاحِبه،';

-- Merge 2 variants of 'يوړو': يوړو., يوړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړو،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'يوړو' AND pashto_word NOT IN ('يوړو.','يوړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوړو', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'يوړو،';

-- Merge 2 variants of 'کېږدى': کېږدى., کېږدى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدى،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'کېږدى' AND pashto_word NOT IN ('کېږدى.','کېږدى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدى', 31);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدى.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدى،';

-- Merge 1 variants of 'اوره': اوره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوره.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'اوره' AND pashto_word NOT IN ('اوره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوره', 20);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوره.';

-- Merge 2 variants of 'لګوی': لګوی., لګوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لګوی،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'لګوی' AND pashto_word NOT IN ('لګوی.','لګوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګوی', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'لګوی،';

-- Merge 2 variants of 'هېروی': هېروی., هېروی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هېروی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هېروی،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'هېروی' AND pashto_word NOT IN ('هېروی.','هېروی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هېروی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هېروی.';
DELETE FROM word_frequencies WHERE pashto_word = 'هېروی،';

-- Merge 2 variants of 'ورننوځی': ورننوځی،, ورننوځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځی.';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'ورننوځی' AND pashto_word NOT IN ('ورننوځی،','ورننوځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوځی', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځی.';

-- Merge 2 variants of 'ومنی': ومنی،, ومنی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنی.';

-- Sum frequencies from all variants: 33 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 33
WHERE pashto_word = 'ومنی' AND pashto_word NOT IN ('ومنی،','ومنی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومنی', 33);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومنی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ومنی.';

-- Merge 2 variants of 'کېږی': کېږی،, کېږی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږی.»';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'کېږی' AND pashto_word NOT IN ('کېږی،','کېږی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږی', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږی.»';

-- Merge 1 variants of 'ايل': ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايل،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ايل' AND pashto_word NOT IN ('ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايل', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايل،';

-- Merge 1 variants of 'اوسي': اوسي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسي،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'اوسي' AND pashto_word NOT IN ('اوسي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسي', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسي،';

-- Merge 2 variants of 'ومومي': ومومي., ومومي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومي.»';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'ومومي' AND pashto_word NOT IN ('ومومي.','ومومي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومي', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومومي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ومومي.»';

-- Merge 2 variants of 'وواژه': وواژه., وواژه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وواژه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وواژه،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وواژه' AND pashto_word NOT IN ('وواژه.','وواژه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وواژه', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وواژه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وواژه،';

-- Merge 3 variants of 'ورسیږي': ورسیږي., ورسیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسیږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسیږي.»';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'ورسیږي' AND pashto_word NOT IN ('ورسیږي.','ورسیږي،','ورسیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسیږي', 36);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسیږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسیږي.»';

-- Merge 2 variants of 'واچول': واچول., واچول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچول،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'واچول' AND pashto_word NOT IN ('واچول.','واچول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچول', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچول.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچول،';

-- Merge 1 variants of 'یووړ': یووړ.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یووړ.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'یووړ' AND pashto_word NOT IN ('یووړ.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یووړ', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یووړ.';

-- Merge 2 variants of 'زامنو': زامنو،, زامنو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'زامنو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زامنو!';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'زامنو' AND pashto_word NOT IN ('زامنو،','زامنو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زامنو', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زامنو،';
DELETE FROM word_frequencies WHERE pashto_word = 'زامنو!';

-- Merge 2 variants of 'کښېناست': کښېناست., کښېناست،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناست.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناست،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'کښېناست' AND pashto_word NOT IN ('کښېناست.','کښېناست،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناست', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناست.';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناست،';

-- Merge 1 variants of 'مور': مور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مور،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'مور' AND pashto_word NOT IN ('مور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مور', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مور،';

-- Merge 1 variants of 'کور': کور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کور،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'کور' AND pashto_word NOT IN ('کور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کور', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کور،';

-- Merge 2 variants of 'واچولې': واچولې., واچولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچولې،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'واچولې' AND pashto_word NOT IN ('واچولې.','واچولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچولې', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچولې،';

-- Merge 3 variants of 'ځم': ځم،, ځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځم.»';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'ځم' AND pashto_word NOT IN ('ځم،','ځم.','ځم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځم', 31);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ځم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځم.»';

-- Merge 2 variants of 'سامان': سامان،, سامان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سامان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سامان.';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'سامان' AND pashto_word NOT IN ('سامان،','سامان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سامان', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سامان،';
DELETE FROM word_frequencies WHERE pashto_word = 'سامان.';

-- Merge 2 variants of 'ساتم': ساتم., ساتم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتم،';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'ساتم' AND pashto_word NOT IN ('ساتم.','ساتم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتم', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتم،';

-- Merge 1 variants of 'آفسرانو': آفسرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آفسرانو،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'آفسرانو' AND pashto_word NOT IN ('آفسرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آفسرانو', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آفسرانو،';

-- Merge 1 variants of 'نيسى': نيسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيسى،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'نيسى' AND pashto_word NOT IN ('نيسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيسى', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيسى،';

-- Merge 1 variants of 'اِمامان': اِمامان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِمامان،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'اِمامان' AND pashto_word NOT IN ('اِمامان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِمامان', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِمامان،';

-- Merge 2 variants of 'واچوى': واچوى., واچوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوى،';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'واچوى' AND pashto_word NOT IN ('واچوى.','واچوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوى', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوى،';

-- Merge 2 variants of 'پاڅه': پاڅه،, پاڅه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅه.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'پاڅه' AND pashto_word NOT IN ('پاڅه،','پاڅه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅه', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅه،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅه.';

-- Merge 2 variants of 'پېژنى': پېژنى., پېژنى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنى،';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'پېژنى' AND pashto_word NOT IN ('پېژنى.','پېژنى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژنى', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنى.';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنى،';

-- Merge 1 variants of 'موسىٰ': موسىٰ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موسىٰ،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'موسىٰ' AND pashto_word NOT IN ('موسىٰ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موسىٰ', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موسىٰ،';

-- Merge 1 variants of 'رنګ': رنګ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رنګ،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'رنګ' AND pashto_word NOT IN ('رنګ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رنګ', 19);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رنګ،';

-- Merge 2 variants of 'راغلی': راغلی., راغلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلی،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'راغلی' AND pashto_word NOT IN ('راغلی.','راغلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلی', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راغلی،';

-- Merge 4 variants of 'وېرېږی': وېرېږی،, وېرېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږی.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږی!';

-- Sum frequencies from all variants: 39 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 39
WHERE pashto_word = 'وېرېږی' AND pashto_word NOT IN ('وېرېږی،','وېرېږی.','وېرېږی.»','وېرېږی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېرېږی', 39);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږی.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږی!';

-- Merge 3 variants of 'ووهی': ووهی., ووهی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهی!';

-- Sum frequencies from all variants: 46 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 46
WHERE pashto_word = 'ووهی' AND pashto_word NOT IN ('ووهی.','ووهی،','ووهی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهی', 46);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهی!';

-- Merge 2 variants of 'اِسرایيله': اِسرایيله،, اِسرایيله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيله.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'اِسرایيله' AND pashto_word NOT IN ('اِسرایيله،','اِسرایيله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسرایيله', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيله،';
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيله.';

-- Merge 4 variants of 'پاچا': پاچا،, پاچا!

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاچا،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاچا!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاچا!»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاچا.»';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'پاچا' AND pashto_word NOT IN ('پاچا،','پاچا!','پاچا!»','پاچا.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاچا', 34);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاچا،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاچا!';
DELETE FROM word_frequencies WHERE pashto_word = 'پاچا!»';
DELETE FROM word_frequencies WHERE pashto_word = 'پاچا.»';

-- Merge 2 variants of 'ورساوه': ورساوه., ورساوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورساوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورساوه،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'ورساوه' AND pashto_word NOT IN ('ورساوه.','ورساوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورساوه', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورساوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورساوه،';

-- Merge 2 variants of 'ونیوه': ونیوه., ونیوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیوه،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'ونیوه' AND pashto_word NOT IN ('ونیوه.','ونیوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیوه', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیوه،';

-- Merge 2 variants of 'ووژني': ووژني،, ووژني.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژني،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژني.»';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'ووژني' AND pashto_word NOT IN ('ووژني،','ووژني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژني', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژني،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژني.»';

-- Merge 2 variants of 'رسوي': رسوي., رسوي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوي.»';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'رسوي' AND pashto_word NOT IN ('رسوي.','رسوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوي', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسوي.»';

-- Merge 1 variants of 'تا': تا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تا،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'تا' AND pashto_word NOT IN ('تا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تا', 18);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تا،';

-- Merge 2 variants of 'اورشلیمه': اورشلیمه،, اورشلیمه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورشلیمه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اورشلیمه!';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'اورشلیمه' AND pashto_word NOT IN ('اورشلیمه،','اورشلیمه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورشلیمه', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورشلیمه،';
DELETE FROM word_frequencies WHERE pashto_word = 'اورشلیمه!';

-- Merge 1 variants of 'تېل': تېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېل،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'تېل' AND pashto_word NOT IN ('تېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېل', 18);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېل،';

-- Merge 2 variants of 'لرلې': لرلې., لرلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرلې،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'لرلې' AND pashto_word NOT IN ('لرلې.','لرلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرلې', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'لرلې،';

-- Merge 1 variants of 'تاسو': تاسو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تاسو،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'تاسو' AND pashto_word NOT IN ('تاسو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تاسو', 18);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تاسو،';

-- Merge 2 variants of 'ونيولو': ونيولو،, ونيولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيولو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيولو.';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'ونيولو' AND pashto_word NOT IN ('ونيولو،','ونيولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيولو', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونيولو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ونيولو.';

-- Merge 2 variants of 'وليدلو': وليدلو., وليدلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليدلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وليدلو،';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'وليدلو' AND pashto_word NOT IN ('وليدلو.','وليدلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدلو', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليدلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وليدلو،';

-- Merge 3 variants of 'واخلم': واخلم., واخلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلم.»';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'واخلم' AND pashto_word NOT IN ('واخلم.','واخلم،','واخلم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلم', 36);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخلم،';
DELETE FROM word_frequencies WHERE pashto_word = 'واخلم.»';

-- Merge 2 variants of 'واچولو': واچولو., واچولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچولو،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'واچولو' AND pashto_word NOT IN ('واچولو.','واچولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچولو', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچولو،';

-- Merge 1 variants of 'ووايم': ووايم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووايم،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'ووايم' AND pashto_word NOT IN ('ووايم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووايم', 18);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووايم،';

-- Merge 2 variants of 'راکوى': راکوى., راکوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوى،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'راکوى' AND pashto_word NOT IN ('راکوى.','راکوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوى', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکوى،';

-- Merge 2 variants of 'کېدو': کېدو., کېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدو،';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'کېدو' AND pashto_word NOT IN ('کېدو.','کېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدو', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدو،';

-- Merge 1 variants of 'ځای': ځای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځای،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'ځای' AND pashto_word NOT IN ('ځای،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځای', 18);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځای،';

-- Merge 2 variants of 'کښېناستل': کښېناستل., کښېناستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستل،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'کښېناستل' AND pashto_word NOT IN ('کښېناستل.','کښېناستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناستل', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستل.';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستل،';

-- Merge 2 variants of 'وباسي': وباسي،, وباسي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسي.»';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'وباسي' AND pashto_word NOT IN ('وباسي،','وباسي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسي', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وباسي.»';

-- Merge 2 variants of 'کېدلې': کېدلې., کېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلې،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'کېدلې' AND pashto_word NOT IN ('کېدلې.','کېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدلې', 26);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلې،';

-- Merge 3 variants of 'یوسم': یوسم., یوسم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسم،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'یوسم' AND pashto_word NOT IN ('یوسم.','یوسم.»','یوسم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوسم', 29);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوسم.';
DELETE FROM word_frequencies WHERE pashto_word = 'یوسم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'یوسم،';

-- Merge 3 variants of 'ونیسي': ونیسي،, ونیسي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسي!»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسي.»';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'ونیسي' AND pashto_word NOT IN ('ونیسي،','ونیسي!»','ونیسي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسي', 28);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسي!»';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسي.»';

-- Merge 3 variants of 'کېږده': کېږده., کېږده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږده!';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'کېږده' AND pashto_word NOT IN ('کېږده.','کېږده،','کېږده!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږده', 36);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږده.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږده،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږده!';

-- Merge 2 variants of 'څښل': څښل،, څښل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښل.';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'څښل' AND pashto_word NOT IN ('څښل،','څښل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښل', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښل،';
DELETE FROM word_frequencies WHERE pashto_word = 'څښل.';

-- Merge 1 variants of 'ځليږى': ځليږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځليږى.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ځليږى' AND pashto_word NOT IN ('ځليږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځليږى', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځليږى.';

-- Merge 2 variants of 'ښکارېدو': ښکارېدو., ښکارېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارېدو،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'ښکارېدو' AND pashto_word NOT IN ('ښکارېدو.','ښکارېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارېدو', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارېدو،';

-- Merge 2 variants of 'پرېږدم': پرېږدم،, پرېږدم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدم.';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'پرېږدم' AND pashto_word NOT IN ('پرېږدم،','پرېږدم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدم', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدم،';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدم.';

-- Merge 1 variants of 'یم.›': یم.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'یم.›»';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'یم.›' AND pashto_word NOT IN ('یم.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یم.›', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یم.›»';

-- Merge 2 variants of 'بهيږى': بهيږى., بهيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بهيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بهيږى،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'بهيږى' AND pashto_word NOT IN ('بهيږى.','بهيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بهيږى', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بهيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'بهيږى،';

-- Merge 2 variants of 'کښېنى': کښېنى،, کښېنى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنى.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'کښېنى' AND pashto_word NOT IN ('کښېنى،','کښېنى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنى', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنى،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنى.';

-- Merge 2 variants of 'پرېښودو': پرېښودو., پرېښودو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودو،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'پرېښودو' AND pashto_word NOT IN ('پرېښودو.','پرېښودو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودو', 31);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودو.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودو،';

-- Merge 1 variants of 'راکړى': راکړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړى،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'راکړى' AND pashto_word NOT IN ('راکړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړى', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړى،';

-- Merge 2 variants of 'سوزوى': سوزوى., سوزوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزوى،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'سوزوى' AND pashto_word NOT IN ('سوزوى.','سوزوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوزوى', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوزوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'سوزوى،';

-- Merge 1 variants of 'وليکل': وليکل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليکل.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'وليکل' AND pashto_word NOT IN ('وليکل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليکل', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليکل.';

-- Merge 2 variants of 'ساتلو': ساتلو., ساتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتلو،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'ساتلو' AND pashto_word NOT IN ('ساتلو.','ساتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتلو', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتلو،';

-- Merge 1 variants of 'ومومى': ومومى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومى.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ومومى' AND pashto_word NOT IN ('ومومى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومى', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومومى.';

-- Merge 1 variants of 'وتښتى': وتښتى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتى.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'وتښتى' AND pashto_word NOT IN ('وتښتى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتى', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتى.';

-- Merge 2 variants of 'ساته': ساته،, ساته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساته.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'ساته' AND pashto_word NOT IN ('ساته،','ساته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساته', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساته،';
DELETE FROM word_frequencies WHERE pashto_word = 'ساته.';

-- Merge 1 variants of 'مُلک': مُلک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُلک،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'مُلک' AND pashto_word NOT IN ('مُلک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُلک', 17);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُلک،';

-- Merge 2 variants of 'وګڼی': وګڼی., وګڼی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼی،';
