
-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموند.';
DELETE FROM word_frequencies WHERE pashto_word = 'وموند،';

-- Merge 2 variants of 'کېږو': کېږو., کېږو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'کېږو' AND pashto_word NOT IN ('کېږو.','کېږو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږو،';

-- Merge 1 variants of 'وموندل': وموندل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندل.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وموندل' AND pashto_word NOT IN ('وموندل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموندل', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموندل.';

-- Merge 1 variants of 'راټولوي': راټولوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولوي،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راټولوي' AND pashto_word NOT IN ('راټولوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راټولوي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راټولوي،';

-- Merge 1 variants of 'لمر': لمر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لمر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'لمر' AND pashto_word NOT IN ('لمر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لمر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لمر،';

-- Merge 1 variants of 'غلا': غلا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلا،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'غلا' AND pashto_word NOT IN ('غلا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلا', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلا،';

-- Merge 1 variants of 'اورې': اورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اورې' AND pashto_word NOT IN ('اورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورې،';

-- Merge 2 variants of 'راووت': راووت., راووت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووت.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووت،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'راووت' AND pashto_word NOT IN ('راووت.','راووت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووت', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووت.';
DELETE FROM word_frequencies WHERE pashto_word = 'راووت،';

-- Merge 2 variants of 'ورننوت': ورننوت., ورننوت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوت.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوت،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ورننوت' AND pashto_word NOT IN ('ورننوت.','ورننوت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوت', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوت.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوت،';

-- Merge 2 variants of 'رسوم': رسوم., رسوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوم،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'رسوم' AND pashto_word NOT IN ('رسوم.','رسوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوم', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسوم،';

-- Merge 1 variants of 'پېژندل': پېژندل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندل.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پېژندل' AND pashto_word NOT IN ('پېژندل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژندل', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندل.';

-- Merge 1 variants of 'لري': لري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'لري.»';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'لري' AND pashto_word NOT IN ('لري.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لري', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لري.»';

-- Merge 1 variants of 'وشړي': وشړي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړي.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وشړي' AND pashto_word NOT IN ('وشړي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړي.';

-- Merge 2 variants of 'کښېنه': کښېنه،, کښېنه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنه.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'کښېنه' AND pashto_word NOT IN ('کښېنه،','کښېنه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنه', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنه،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنه.';

-- Merge 1 variants of 'جوړولې': جوړولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړولې.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'جوړولې' AND pashto_word NOT IN ('جوړولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړولې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړولې.';

-- Merge 2 variants of 'وویست': وویست،, وویست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویست،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وویست.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وویست' AND pashto_word NOT IN ('وویست،','وویست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویست', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویست،';
DELETE FROM word_frequencies WHERE pashto_word = 'وویست.';

-- Merge 1 variants of 'ډوډۍ': ډوډۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډوډۍ،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ډوډۍ' AND pashto_word NOT IN ('ډوډۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډوډۍ', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډوډۍ،';

-- Merge 1 variants of 'ګوري': ګوري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوري،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ګوري' AND pashto_word NOT IN ('ګوري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوري', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوري،';

-- Merge 1 variants of 'واخلي': واخلي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلي.»';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'واخلي' AND pashto_word NOT IN ('واخلي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخلي.»';

-- Merge 1 variants of 'قتل': قتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قتل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'قتل' AND pashto_word NOT IN ('قتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قتل', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قتل،';

-- Merge 1 variants of 'وسوځاوه': وسوځاوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځاوه.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وسوځاوه' AND pashto_word NOT IN ('وسوځاوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځاوه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځاوه.';

-- Merge 2 variants of 'واخیستل': واخیستل., واخیستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیستل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیستل،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'واخیستل' AND pashto_word NOT IN ('واخیستل.','واخیستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخیستل', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخیستل.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخیستل،';

-- Merge 1 variants of 'نوم': نوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نوم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'نوم' AND pashto_word NOT IN ('نوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نوم', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نوم،';

-- Merge 1 variants of 'بابل': بابل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بابل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'بابل' AND pashto_word NOT IN ('بابل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بابل', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بابل،';

-- Merge 2 variants of 'تېروي': تېروي،, تېروي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروي.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'تېروي' AND pashto_word NOT IN ('تېروي،','تېروي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروي', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروي،';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروي.';

-- Merge 1 variants of 'کتان': کتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کتان،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'کتان' AND pashto_word NOT IN ('کتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کتان', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کتان،';

-- Merge 1 variants of 'شراب': شراب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شراب،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'شراب' AND pashto_word NOT IN ('شراب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شراب', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شراب،';

-- Merge 1 variants of 'عزت': عزت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزت،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'عزت' AND pashto_word NOT IN ('عزت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزت', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزت،';

-- Merge 2 variants of 'ومومې': ومومې., ومومې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومې،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ومومې' AND pashto_word NOT IN ('ومومې.','ومومې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومې', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومومې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ومومې،';

-- Merge 2 variants of 'کېږې': کېږې., کېږې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'کېږې' AND pashto_word NOT IN ('کېږې.','کېږې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږې،';

-- Merge 3 variants of 'ونیسه': ونیسه., ونیسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسه!';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ونیسه' AND pashto_word NOT IN ('ونیسه.','ونیسه،','ونیسه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسه', 11);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسه!';

-- Merge 1 variants of 'دانو': دانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دانو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'دانو' AND pashto_word NOT IN ('دانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دانو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دانو،';

-- Merge 1 variants of 'جاد': جاد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جاد،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'جاد' AND pashto_word NOT IN ('جاد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جاد', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جاد،';

-- Merge 2 variants of 'کېږدم': کېږدم., کېږدم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدم.»';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کېږدم' AND pashto_word NOT IN ('کېږدم.','کېږدم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدم', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدم.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدم.»';

-- Merge 1 variants of 'الیاقیم': الیاقیم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیاقیم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'الیاقیم' AND pashto_word NOT IN ('الیاقیم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیاقیم', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیاقیم،';

-- Merge 2 variants of 'کېښوده': کېښوده،, کېښوده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښوده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښوده.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'کېښوده' AND pashto_word NOT IN ('کېښوده،','کېښوده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښوده', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښوده،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښوده.';

-- Merge 1 variants of 'څملي': څملي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملي.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'څملي' AND pashto_word NOT IN ('څملي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملي.';

-- Merge 2 variants of 'قبلوم': قبلوم., قبلوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قبلوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'قبلوم،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'قبلوم' AND pashto_word NOT IN ('قبلوم.','قبلوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قبلوم', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قبلوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'قبلوم،';

-- Merge 2 variants of 'پليتوى': پليتوى., پليتوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پليتوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پليتوى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'پليتوى' AND pashto_word NOT IN ('پليتوى.','پليتوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پليتوى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پليتوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'پليتوى،';

-- Merge 1 variants of 'بدلوى': بدلوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بدلوى،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'بدلوى' AND pashto_word NOT IN ('بدلوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بدلوى', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بدلوى،';

-- Merge 1 variants of 'حکمرانان': حکمرانان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکمرانان،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'حکمرانان' AND pashto_word NOT IN ('حکمرانان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکمرانان', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکمرانان،';

-- Merge 2 variants of 'ګرځېدو': ګرځېدو،, ګرځېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدو.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ګرځېدو' AND pashto_word NOT IN ('ګرځېدو،','ګرځېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځېدو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدو.';

-- Merge 1 variants of 'بيانوم': بيانوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيانوم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'بيانوم' AND pashto_word NOT IN ('بيانوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيانوم', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيانوم،';

-- Merge 1 variants of 'هغۀ': هغۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هغۀ،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'هغۀ' AND pashto_word NOT IN ('هغۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هغۀ', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هغۀ،';

-- Merge 2 variants of 'ورغلو': ورغلو., ورغلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغلو،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ورغلو' AND pashto_word NOT IN ('ورغلو.','ورغلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغلو', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورغلو،';

-- Merge 1 variants of 'ناپاک': ناپاک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناپاک،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ناپاک' AND pashto_word NOT IN ('ناپاک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناپاک', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناپاک،';

-- Merge 1 variants of 'اوښانو': اوښانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوښانو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اوښانو' AND pashto_word NOT IN ('اوښانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوښانو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوښانو،';

-- Merge 2 variants of 'درکړه': درکړه., درکړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'درکړه' AND pashto_word NOT IN ('درکړه.','درکړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړه،';

-- Merge 1 variants of 'انګور': انګور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'انګور،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'انګور' AND pashto_word NOT IN ('انګور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انګور', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انګور،';

-- Merge 1 variants of 'غونډیو': غونډیو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غونډیو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'غونډیو' AND pashto_word NOT IN ('غونډیو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غونډیو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غونډیو،';

-- Merge 1 variants of 'حیتیانو': حیتیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حیتیانو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'حیتیانو' AND pashto_word NOT IN ('حیتیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حیتیانو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حیتیانو،';

-- Merge 1 variants of 'ميو': ميو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ميو' AND pashto_word NOT IN ('ميو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميو،';

-- Merge 1 variants of 'ستنو': ستنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ستنو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ستنو' AND pashto_word NOT IN ('ستنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ستنو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ستنو،';

-- Merge 1 variants of 'غوښه': غوښه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوښه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'غوښه' AND pashto_word NOT IN ('غوښه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوښه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوښه،';

-- Merge 2 variants of 'غورزيږى': غورزيږى., غورزيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورزيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غورزيږى،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'غورزيږى' AND pashto_word NOT IN ('غورزيږى.','غورزيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورزيږى', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورزيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'غورزيږى،';

-- Merge 2 variants of 'الافواجه': الافواجه،, الافواجه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'الافواجه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'الافواجه.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'الافواجه' AND pashto_word NOT IN ('الافواجه،','الافواجه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الافواجه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الافواجه،';
DELETE FROM word_frequencies WHERE pashto_word = 'الافواجه.';

-- Merge 2 variants of 'وغورزوى': وغورزوى., وغورزوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوى،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وغورزوى' AND pashto_word NOT IN ('وغورزوى.','وغورزوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزوى', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوى،';

-- Merge 1 variants of 'پېغمبر': پېغمبر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغمبر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پېغمبر' AND pashto_word NOT IN ('پېغمبر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغمبر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغمبر،';

-- Merge 2 variants of 'راوګرځه': راوګرځه،, راوګرځه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځه.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راوګرځه' AND pashto_word NOT IN ('راوګرځه،','راوګرځه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځه.';

-- Merge 1 variants of 'پوهېږې': پوهېږې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږې.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پوهېږې' AND pashto_word NOT IN ('پوهېږې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېږې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږې.';

-- Merge 1 variants of 'لوڼه': لوڼه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوڼه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'لوڼه' AND pashto_word NOT IN ('لوڼه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوڼه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوڼه،';

-- Merge 2 variants of 'يروى': يروى., يروى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يروى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يروى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'يروى' AND pashto_word NOT IN ('يروى.','يروى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يروى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يروى.';
DELETE FROM word_frequencies WHERE pashto_word = 'يروى،';

-- Merge 2 variants of 'ښاريې': ښاريې،, ښاريې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښاريې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښاريې.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ښاريې' AND pashto_word NOT IN ('ښاريې،','ښاريې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښاريې', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښاريې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښاريې.';

-- Merge 1 variants of 'عموره': عموره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عموره،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'عموره' AND pashto_word NOT IN ('عموره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عموره', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عموره،';

-- Merge 2 variants of 'راپرېوځى': راپرېوځى., راپرېوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپرېوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راپرېوځى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'راپرېوځى' AND pashto_word NOT IN ('راپرېوځى.','راپرېوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپرېوځى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپرېوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راپرېوځى،';

-- Merge 1 variants of 'وخت': وخت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخت،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخت' AND pashto_word NOT IN ('وخت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخت', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخت،';

-- Merge 1 variants of 'مِصر': مِصر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِصر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'مِصر' AND pashto_word NOT IN ('مِصر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِصر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِصر،';

-- Merge 1 variants of 'وښايم': وښايم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښايم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وښايم' AND pashto_word NOT IN ('وښايم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښايم', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښايم،';

-- Merge 2 variants of 'ختموى': ختموى., ختموى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ختموى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ختموى،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ختموى' AND pashto_word NOT IN ('ختموى.','ختموى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ختموى', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ختموى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ختموى،';

-- Merge 2 variants of 'خوريږى': خوريږى،, خوريږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوريږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوريږى.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'خوريږى' AND pashto_word NOT IN ('خوريږى،','خوريږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوريږى', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوريږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'خوريږى.';

-- Merge 1 variants of 'خوځوى': خوځوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوځوى،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'خوځوى' AND pashto_word NOT IN ('خوځوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوځوى', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوځوى،';

-- Merge 1 variants of 'خېژى': خېژى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خېژى،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'خېژى' AND pashto_word NOT IN ('خېژى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خېژى', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خېژى،';

-- Merge 1 variants of 'تعنک': تعنک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تعنک،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'تعنک' AND pashto_word NOT IN ('تعنک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تعنک', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تعنک،';

-- Merge 2 variants of 'غلو': غلو., غلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غلو،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'غلو' AND pashto_word NOT IN ('غلو.','غلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلو', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'غلو،';

-- Merge 3 variants of 'تیاریږي': تیاریږي., تیاریږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تیاریږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تیاریږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تیاریږي.»';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'تیاریږي' AND pashto_word NOT IN ('تیاریږي.','تیاریږي،','تیاریږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تیاریږي', 12);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تیاریږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'تیاریږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'تیاریږي.»';

-- Merge 2 variants of 'نذرانه': نذرانه،, نذرانه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نذرانه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نذرانه.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'نذرانه' AND pashto_word NOT IN ('نذرانه،','نذرانه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نذرانه', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نذرانه،';
DELETE FROM word_frequencies WHERE pashto_word = 'نذرانه.';

-- Merge 2 variants of 'ځانه': ځانه!, ځانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځانه!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځانه،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ځانه' AND pashto_word NOT IN ('ځانه!','ځانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځانه', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځانه!';
DELETE FROM word_frequencies WHERE pashto_word = 'ځانه،';

-- Merge 1 variants of 'ونې': ونې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ونې' AND pashto_word NOT IN ('ونې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونې،';

-- Merge 1 variants of 'آسونه': آسونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسونه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'آسونه' AND pashto_word NOT IN ('آسونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسونه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسونه،';

-- Merge 1 variants of 'شيم': شيم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شيم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'شيم' AND pashto_word NOT IN ('شيم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شيم', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شيم،';

-- Merge 1 variants of 'ګنې': ګنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګنې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ګنې' AND pashto_word NOT IN ('ګنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګنې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګنې،';

-- Merge 1 variants of 'ګډو': ګډو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ګډو' AND pashto_word NOT IN ('ګډو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډو،';

-- Merge 1 variants of 'حِتيان': حِتيان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِتيان،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'حِتيان' AND pashto_word NOT IN ('حِتيان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِتيان', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِتيان،';

-- Merge 1 variants of 'ابيهُو': ابيهُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابيهُو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ابيهُو' AND pashto_word NOT IN ('ابيهُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابيهُو', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابيهُو،';

-- Merge 2 variants of 'ښودل': ښودل., ښودل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودل،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ښودل' AND pashto_word NOT IN ('ښودل.','ښودل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودل', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښودل،';

-- Merge 1 variants of 'خوراک': خوراک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوراک،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'خوراک' AND pashto_word NOT IN ('خوراک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوراک', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوراک،';

-- Merge 2 variants of 'حِصه': حِصه،, حِصه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِصه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'حِصه.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'حِصه' AND pashto_word NOT IN ('حِصه،','حِصه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِصه', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِصه،';
DELETE FROM word_frequencies WHERE pashto_word = 'حِصه.';

-- Merge 1 variants of '”افسوس': ”افسوس،

DELETE FROM word_verse_mapping WHERE pashto_word = '”افسوس،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = '”افسوس' AND pashto_word NOT IN ('”افسوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”افسوس', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”افسوس،';

-- Merge 1 variants of 'پښې': پښې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پښې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پښې' AND pashto_word NOT IN ('پښې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پښې', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پښې،';

-- Merge 2 variants of 'وسوزوله': وسوزوله., وسوزوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوله،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وسوزوله' AND pashto_word NOT IN ('وسوزوله.','وسوزوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوله', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوله،';

-- Merge 2 variants of 'وسوزولې': وسوزولې., وسوزولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزولې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'وسوزولې' AND pashto_word NOT IN ('وسوزولې.','وسوزولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزولې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزولې،';

-- Merge 1 variants of 'قادِس': قادِس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قادِس،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'قادِس' AND pashto_word NOT IN ('قادِس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قادِس', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قادِس،';

-- Merge 1 variants of 'رِمون': رِمون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رِمون،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'رِمون' AND pashto_word NOT IN ('رِمون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رِمون', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رِمون،';

-- Merge 1 variants of '”پاڅه': ”پاڅه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”پاڅه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = '”پاڅه' AND pashto_word NOT IN ('”پاڅه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”پاڅه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”پاڅه،';

-- Merge 1 variants of 'يونتن': يونتن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يونتن،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'يونتن' AND pashto_word NOT IN ('يونتن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يونتن', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يونتن،';

-- Merge 1 variants of 'زويه': زويه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زويه.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'زويه' AND pashto_word NOT IN ('زويه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زويه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زويه.';

-- Merge 1 variants of 'امرياه': امرياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امرياه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'امرياه' AND pashto_word NOT IN ('امرياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امرياه', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امرياه،';

-- Merge 1 variants of 'عيسىٰ': عيسىٰ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عيسىٰ،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'عيسىٰ' AND pashto_word NOT IN ('عيسىٰ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عيسىٰ', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عيسىٰ،';

-- Merge 2 variants of 'منلی': منلی،, منلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'منلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منلی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'منلی' AND pashto_word NOT IN ('منلی،','منلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منلی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'منلی.';

-- Merge 1 variants of 'ویستله': ویستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویستله.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ویستله' AND pashto_word NOT IN ('ویستله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویستله', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویستله.';

-- Merge 2 variants of 'بنایاه': بنایاه،, بنایاه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بنایاه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بنایاه.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'بنایاه' AND pashto_word NOT IN ('بنایاه،','بنایاه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بنایاه', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بنایاه،';
DELETE FROM word_frequencies WHERE pashto_word = 'بنایاه.';

-- Merge 1 variants of 'دبیر': دبیر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دبیر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'دبیر' AND pashto_word NOT IN ('دبیر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دبیر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دبیر،';

-- Merge 1 variants of 'دیبون': دیبون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دیبون،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'دیبون' AND pashto_word NOT IN ('دیبون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دیبون', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دیبون،';

-- Merge 2 variants of 'ووایې': ووایې،, ووایې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایې.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ووایې' AND pashto_word NOT IN ('ووایې،','ووایې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایې', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایې.';

-- Merge 2 variants of 'وځلیږی': وځلیږی،, وځلیږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځلیږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وځلیږی.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وځلیږی' AND pashto_word NOT IN ('وځلیږی،','وځلیږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځلیږی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځلیږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وځلیږی.';
