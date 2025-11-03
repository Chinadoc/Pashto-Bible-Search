
-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوتل،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوتل.';

-- Merge 1 variants of 'ګڼه': ګڼه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګڼه' AND pashto_word NOT IN ('ګڼه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼه.';

-- Merge 2 variants of 'واخلو': واخلو., واخلو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلو.»';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'واخلو' AND pashto_word NOT IN ('واخلو.','واخلو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخلو.»';

-- Merge 2 variants of 'ولرو': ولرو., ولرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولرو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولرو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ولرو' AND pashto_word NOT IN ('ولرو.','ولرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولرو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولرو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولرو،';

-- Merge 2 variants of 'ګڼل': ګڼل., ګڼل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ګڼل' AND pashto_word NOT IN ('ګڼل.','ګڼل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼل،';

-- Merge 1 variants of 'وتښتېد': وتښتېد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېد.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وتښتېد' AND pashto_word NOT IN ('وتښتېد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتېد', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېد.';

-- Merge 1 variants of 'زرعه': زرعه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زرعه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زرعه' AND pashto_word NOT IN ('زرعه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زرعه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زرعه،';

-- Merge 1 variants of 'اخیست': اخیست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخیست.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اخیست' AND pashto_word NOT IN ('اخیست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخیست', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخیست.';

-- Merge 1 variants of 'اشیر': اشیر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اشیر،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اشیر' AND pashto_word NOT IN ('اشیر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اشیر', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اشیر،';

-- Merge 1 variants of 'عدن': عدن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عدن،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عدن' AND pashto_word NOT IN ('عدن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عدن', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عدن،';

-- Merge 1 variants of 'ښودله': ښودله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ښودله' AND pashto_word NOT IN ('ښودله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودله', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودله.';

-- Merge 2 variants of 'انار': انار., انار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'انار.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'انار،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'انار' AND pashto_word NOT IN ('انار.','انار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انار', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انار.';
DELETE FROM word_frequencies WHERE pashto_word = 'انار،';

-- Merge 1 variants of 'لګېدلې': لګېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګېدلې.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'لګېدلې' AND pashto_word NOT IN ('لګېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګېدلې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګېدلې.';

-- Merge 2 variants of 'جوړولو': جوړولو،, جوړولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړولو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړولو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جوړولو' AND pashto_word NOT IN ('جوړولو،','جوړولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړولو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړولو،';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړولو.';

-- Merge 1 variants of 'بتان': بتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بتان،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بتان' AND pashto_word NOT IN ('بتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بتان', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بتان،';

-- Merge 1 variants of 'باغونه': باغونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باغونه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'باغونه' AND pashto_word NOT IN ('باغونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باغونه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باغونه،';

-- Merge 1 variants of 'جوزان': جوزان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوزان،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'جوزان' AND pashto_word NOT IN ('جوزان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوزان', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوزان،';

-- Merge 1 variants of 'ارفاد': ارفاد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ارفاد،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ارفاد' AND pashto_word NOT IN ('ارفاد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ارفاد', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ارفاد،';

-- Merge 1 variants of 'ماته': ماته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماته،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ماته' AND pashto_word NOT IN ('ماته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماته', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماته،';

-- Merge 2 variants of 'راځې': راځې., راځې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راځې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راځې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راځې' AND pashto_word NOT IN ('راځې.','راځې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راځې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راځې،';

-- Merge 2 variants of 'وخورې': وخورې., وخورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخورې' AND pashto_word NOT IN ('وخورې.','وخورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخورې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخورې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخورې،';

-- Merge 2 variants of 'ولېږلې': ولېږلې،, ولېږلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږلې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ولېږلې' AND pashto_word NOT IN ('ولېږلې،','ولېږلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږلې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلې.';

-- Merge 3 variants of 'ورشو': ورشو،, ورشو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشو.»';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورشو' AND pashto_word NOT IN ('ورشو،','ورشو.','ورشو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورشو', 9);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورشو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورشو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورشو.»';

-- Merge 1 variants of 'خېمې': خېمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خېمې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خېمې' AND pashto_word NOT IN ('خېمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خېمې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خېمې،';

-- Merge 1 variants of 'څملاست': څملاست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملاست.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څملاست' AND pashto_word NOT IN ('څملاست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملاست', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملاست.';

-- Merge 2 variants of 'وخورم': وخورم،, وخورم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورم.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخورم' AND pashto_word NOT IN ('وخورم،','وخورم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخورم', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخورم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخورم.';

-- Merge 1 variants of 'راوغورځوي': راوغورځوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورځوي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راوغورځوي' AND pashto_word NOT IN ('راوغورځوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورځوي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورځوي.';

-- Merge 2 variants of 'وړې': وړې., وړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وړې' AND pashto_word NOT IN ('وړې.','وړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وړې،';

-- Merge 2 variants of 'وسوځوم': وسوځوم., وسوځوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوم،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وسوځوم' AND pashto_word NOT IN ('وسوځوم.','وسوځوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځوم', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوم،';

-- Merge 2 variants of 'وخوړلې': وخوړلې., وخوړلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړلې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وخوړلې' AND pashto_word NOT IN ('وخوړلې.','وخوړلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړلې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړلې،';

-- Merge 2 variants of 'پرېنږدم': پرېنږدم., پرېنږدم!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېنږدم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېنږدم!»';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پرېنږدم' AND pashto_word NOT IN ('پرېنږدم.','پرېنږدم!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېنږدم', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېنږدم.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېنږدم!»';

-- Merge 2 variants of 'ورتلو': ورتلو., ورتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورتلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ورتلو' AND pashto_word NOT IN ('ورتلو.','ورتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورتلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورتلو،';

-- Merge 1 variants of 'عبدنجو': عبدنجو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عبدنجو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عبدنجو' AND pashto_word NOT IN ('عبدنجو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عبدنجو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عبدنجو،';

-- Merge 2 variants of 'ولګېدو': ولګېدو،, ولګېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګېدو.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ولګېدو' AND pashto_word NOT IN ('ولګېدو،','ولګېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګېدو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګېدو.';

-- Merge 1 variants of 'جادوګرو': جادوګرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جادوګرو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'جادوګرو' AND pashto_word NOT IN ('جادوګرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جادوګرو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جادوګرو،';

-- Merge 1 variants of 'فالګرو': فالګرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فالګرو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'فالګرو' AND pashto_word NOT IN ('فالګرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فالګرو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فالګرو،';

-- Merge 2 variants of 'اختر': اختر،, اختر.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اختر،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اختر.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اختر' AND pashto_word NOT IN ('اختر،','اختر.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اختر', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اختر،';
DELETE FROM word_frequencies WHERE pashto_word = 'اختر.';

-- Merge 2 variants of 'غواړو': غواړو., غواړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'غواړو' AND pashto_word NOT IN ('غواړو.','غواړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'غواړو،';

-- Merge 1 variants of 'سیمې': سیمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سیمې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'سیمې' AND pashto_word NOT IN ('سیمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سیمې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سیمې،';

-- Merge 1 variants of 'زبولون': زبولون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زبولون،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زبولون' AND pashto_word NOT IN ('زبولون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زبولون', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زبولون،';

-- Merge 1 variants of 'ګرځېدلو': ګرځېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدلو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګرځېدلو' AND pashto_word NOT IN ('ګرځېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځېدلو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدلو.';

-- Merge 2 variants of 'رسېدل': رسېدل., رسېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'رسېدل' AND pashto_word NOT IN ('رسېدل.','رسېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېدل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدل،';

-- Merge 1 variants of 'والیانو': والیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'والیانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'والیانو' AND pashto_word NOT IN ('والیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('والیانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'والیانو،';

-- Merge 1 variants of 'وڅښي': وڅښي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وڅښي' AND pashto_word NOT IN ('وڅښي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښي.';

-- Merge 2 variants of 'اوسېدم': اوسېدم., اوسېدم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدم،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اوسېدم' AND pashto_word NOT IN ('اوسېدم.','اوسېدم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدم', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدم.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدم،';

-- Merge 2 variants of 'واړاوه': واړاوه., واړاوه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'واړاوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واړاوه.»';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'واړاوه' AND pashto_word NOT IN ('واړاوه.','واړاوه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واړاوه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واړاوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'واړاوه.»';

-- Merge 1 variants of 'فارس': فارس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فارس،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'فارس' AND pashto_word NOT IN ('فارس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فارس', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فارس،';

-- Merge 1 variants of 'مخلوقه': مخلوقه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخلوقه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مخلوقه' AND pashto_word NOT IN ('مخلوقه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخلوقه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخلوقه،';

-- Merge 2 variants of 'اوسم': اوسم., اوسم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسم.»';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اوسم' AND pashto_word NOT IN ('اوسم.','اوسم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسم', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسم.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسم.»';

-- Merge 1 variants of 'خلاصېدله': خلاصېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلاصېدله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خلاصېدله' AND pashto_word NOT IN ('خلاصېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلاصېدله', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلاصېدله.';

-- Merge 1 variants of 'څښې': څښې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښې.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څښې' AND pashto_word NOT IN ('څښې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښې.';

-- Merge 1 variants of 'مړیږي': مړیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مړیږي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مړیږي' AND pashto_word NOT IN ('مړیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مړیږي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مړیږي.';

-- Merge 1 variants of 'متنیا': متنیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'متنیا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'متنیا' AND pashto_word NOT IN ('متنیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('متنیا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'متنیا،';

-- Merge 1 variants of 'زروبابل': زروبابل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زروبابل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زروبابل' AND pashto_word NOT IN ('زروبابل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زروبابل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زروبابل،';

-- Merge 1 variants of 'ساتونکو': ساتونکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتونکو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ساتونکو' AND pashto_word NOT IN ('ساتونکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتونکو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتونکو،';

-- Merge 1 variants of 'راولېږل': راولېږل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږل.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راولېږل' AND pashto_word NOT IN ('راولېږل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږل.';

-- Merge 1 variants of 'زمونږ': زمونږ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زمونږ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زمونږ' AND pashto_word NOT IN ('زمونږ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زمونږ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زمونږ،';

-- Merge 1 variants of 'مرګه': مرګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرګه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مرګه' AND pashto_word NOT IN ('مرګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرګه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرګه،';

-- Merge 1 variants of 'شور': شور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شور،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شور' AND pashto_word NOT IN ('شور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شور', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شور،';

-- Merge 1 variants of 'څوک': څوک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څوک،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څوک' AND pashto_word NOT IN ('څوک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څوک', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څوک،';

-- Merge 1 variants of 'صهیونه': صهیونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صهیونه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'صهیونه' AND pashto_word NOT IN ('صهیونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صهیونه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صهیونه،';

-- Merge 1 variants of 'نړۍ': نړۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نړۍ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نړۍ' AND pashto_word NOT IN ('نړۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نړۍ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نړۍ،';

-- Merge 1 variants of 'ووهم': ووهم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهم،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ووهم' AND pashto_word NOT IN ('ووهم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهم،';

-- Merge 2 variants of 'بد': بد،, بد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بد،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بد.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'بد' AND pashto_word NOT IN ('بد،','بد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بد', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بد،';
DELETE FROM word_frequencies WHERE pashto_word = 'بد.';

-- Merge 1 variants of 'ماتوي': ماتوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماتوي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ماتوي' AND pashto_word NOT IN ('ماتوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماتوي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماتوي.';

-- Merge 1 variants of 'قچرو': قچرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قچرو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'قچرو' AND pashto_word NOT IN ('قچرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قچرو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قچرو،';

-- Merge 1 variants of '”آمين': ”آمين،

DELETE FROM word_verse_mapping WHERE pashto_word = '”آمين،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = '”آمين' AND pashto_word NOT IN ('”آمين،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”آمين', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”آمين،';

-- Merge 1 variants of 'نسل': نسل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نسل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نسل' AND pashto_word NOT IN ('نسل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نسل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نسل،';

-- Merge 2 variants of 'وخوړلو': وخوړلو،, وخوړلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړلو.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخوړلو' AND pashto_word NOT IN ('وخوړلو،','وخوړلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړلو.';

-- Merge 1 variants of 'برکت': برکت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برکت،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'برکت' AND pashto_word NOT IN ('برکت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برکت', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برکت،';

-- Merge 1 variants of '”زۀ': ”زۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = '”زۀ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = '”زۀ' AND pashto_word NOT IN ('”زۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”زۀ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”زۀ،';

-- Merge 2 variants of 'وطنه': وطنه،, وطنه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وطنه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وطنه.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وطنه' AND pashto_word NOT IN ('وطنه،','وطنه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وطنه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وطنه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وطنه.';

-- Merge 1 variants of 'اسقلون': اسقلون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسقلون،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اسقلون' AND pashto_word NOT IN ('اسقلون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسقلون', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسقلون،';

-- Merge 1 variants of 'پېغمبرانو': پېغمبرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغمبرانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پېغمبرانو' AND pashto_word NOT IN ('پېغمبرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغمبرانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغمبرانو،';

-- Merge 1 variants of 'ډيګۍ': ډيګۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډيګۍ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ډيګۍ' AND pashto_word NOT IN ('ډيګۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډيګۍ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډيګۍ،';

-- Merge 1 variants of 'مقرروم': مقرروم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مقرروم.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مقرروم' AND pashto_word NOT IN ('مقرروم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مقرروم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مقرروم.';

-- Merge 1 variants of 'ړاندۀ': ړاندۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ړاندۀ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ړاندۀ' AND pashto_word NOT IN ('ړاندۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ړاندۀ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ړاندۀ،';

-- Merge 1 variants of 'آواز': آواز.

DELETE FROM word_verse_mapping WHERE pashto_word = 'آواز.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'آواز' AND pashto_word NOT IN ('آواز.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آواز', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آواز.';

-- Merge 1 variants of 'وويستل': وويستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وويستل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وويستل' AND pashto_word NOT IN ('وويستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وويستل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وويستل،';

-- Merge 1 variants of 'علاقو': علاقو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'علاقو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'علاقو' AND pashto_word NOT IN ('علاقو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('علاقو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'علاقو،';

-- Merge 1 variants of 'باغ': باغ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باغ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'باغ' AND pashto_word NOT IN ('باغ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باغ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باغ،';

-- Merge 2 variants of 'درولېږل': درولېږل., درولېږل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درولېږل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درولېږل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'درولېږل' AND pashto_word NOT IN ('درولېږل.','درولېږل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درولېږل', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درولېږل.';
DELETE FROM word_frequencies WHERE pashto_word = 'درولېږل،';

-- Merge 1 variants of 'وسوزېدو': وسوزېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزېدو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وسوزېدو' AND pashto_word NOT IN ('وسوزېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزېدو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزېدو.';

-- Merge 1 variants of 'مشاور': مشاور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشاور،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مشاور' AND pashto_word NOT IN ('مشاور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشاور', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشاور،';

-- Merge 1 variants of 'مېوه': مېوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مېوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مېوه' AND pashto_word NOT IN ('مېوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مېوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مېوه،';

-- Merge 1 variants of 'لېږې': لېږې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږې.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'لېږې' AND pashto_word NOT IN ('لېږې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لېږې.';

-- Merge 2 variants of 'کيږُو': کيږُو،, کيږُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کيږُو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کيږُو.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کيږُو' AND pashto_word NOT IN ('کيږُو،','کيږُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کيږُو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کيږُو،';
DELETE FROM word_frequencies WHERE pashto_word = 'کيږُو.';

-- Merge 1 variants of 'مجدال': مجدال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مجدال،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مجدال' AND pashto_word NOT IN ('مجدال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مجدال', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مجدال،';

-- Merge 2 variants of 'ګناهونه': ګناهونه،, ګناهونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګناهونه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګناهونه.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ګناهونه' AND pashto_word NOT IN ('ګناهونه،','ګناهونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګناهونه', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګناهونه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګناهونه.';

-- Merge 1 variants of 'وحشت': وحشت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وحشت،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وحشت' AND pashto_word NOT IN ('وحشت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وحشت', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وحشت،';

-- Merge 1 variants of 'ايتهوپيا': ايتهوپيا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايتهوپيا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ايتهوپيا' AND pashto_word NOT IN ('ايتهوپيا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايتهوپيا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايتهوپيا،';

-- Merge 1 variants of 'ليبيا': ليبيا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليبيا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ليبيا' AND pashto_word NOT IN ('ليبيا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليبيا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليبيا،';

-- Merge 1 variants of 'وشرمېدو': وشرمېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشرمېدو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وشرمېدو' AND pashto_word NOT IN ('وشرمېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشرمېدو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشرمېدو،';

-- Merge 1 variants of 'حولون': حولون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حولون،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'حولون' AND pashto_word NOT IN ('حولون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حولون', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حولون،';

-- Merge 1 variants of 'خپلوان': خپلوان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خپلوان،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خپلوان' AND pashto_word NOT IN ('خپلوان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خپلوان', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خپلوان،';

-- Merge 1 variants of 'اِنصاف': اِنصاف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِنصاف،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اِنصاف' AND pashto_word NOT IN ('اِنصاف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِنصاف', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِنصاف،';

-- Merge 1 variants of 'ګډورو': ګډورو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډورو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګډورو' AND pashto_word NOT IN ('ګډورو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډورو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډورو،';

-- Merge 1 variants of 'وويستلې': وويستلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وويستلې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وويستلې' AND pashto_word NOT IN ('وويستلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وويستلې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وويستلې،';

-- Merge 1 variants of 'شراياه': شراياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شراياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شراياه' AND pashto_word NOT IN ('شراياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شراياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شراياه،';

-- Merge 1 variants of 'ګوګوشتکې': ګوګوشتکې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوګوشتکې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګوګوشتکې' AND pashto_word NOT IN ('ګوګوشتکې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوګوشتکې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوګوشتکې،';

-- Merge 2 variants of 'ونيسم': ونيسم،, ونيسم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيسم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيسم.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ونيسم' AND pashto_word NOT IN ('ونيسم،','ونيسم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيسم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونيسم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ونيسم.';

-- Merge 1 variants of 'ولړزيږى': ولړزيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولړزيږى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ولړزيږى' AND pashto_word NOT IN ('ولړزيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولړزيږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولړزيږى،';

-- Merge 1 variants of 'ړل': ړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ړل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ړل' AND pashto_word NOT IN ('ړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ړل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ړل،';

-- Merge 1 variants of 'زياتېدو': زياتېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زياتېدو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زياتېدو' AND pashto_word NOT IN ('زياتېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زياتېدو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زياتېدو.';

-- Merge 2 variants of 'کښېنم': کښېنم،, کښېنم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنم.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کښېنم' AND pashto_word NOT IN ('کښېنم،','کښېنم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنم', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنم،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنم.';

-- Merge 1 variants of 'پوهيږو': پوهيږو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهيږو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پوهيږو' AND pashto_word NOT IN ('پوهيږو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهيږو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهيږو.';

-- Merge 1 variants of 'ډکوى': ډکوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډکوى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ډکوى' AND pashto_word NOT IN ('ډکوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډکوى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډکوى،';

-- Merge 2 variants of 'راګېروى': راګېروى،, راګېروى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راګېروى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راګېروى.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راګېروى' AND pashto_word NOT IN ('راګېروى،','راګېروى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راګېروى', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راګېروى،';
DELETE FROM word_frequencies WHERE pashto_word = 'راګېروى.';

-- Merge 1 variants of 'تاويږى': تاويږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تاويږى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تاويږى' AND pashto_word NOT IN ('تاويږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تاويږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تاويږى،';

-- Merge 2 variants of 'تېروم': تېروم., تېروم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروم،';
