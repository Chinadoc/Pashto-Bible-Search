
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جات', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جات،';

-- Merge 1 variants of 'راوغواړى': راوغواړى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړى.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغواړى' AND pashto_word NOT IN ('راوغواړى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغواړى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړى.';

-- Merge 1 variants of 'بغېر': بغېر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بغېر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بغېر' AND pashto_word NOT IN ('بغېر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بغېر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بغېر،';

-- Merge 1 variants of 'عساهيل': عساهيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عساهيل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عساهيل' AND pashto_word NOT IN ('عساهيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عساهيل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عساهيل،';

-- Merge 1 variants of 'ادونياه': ادونياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ادونياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ادونياه' AND pashto_word NOT IN ('ادونياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ادونياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ادونياه،';

-- Merge 2 variants of 'راپاروی': راپاروی،, راپاروی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاروی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاروی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راپاروی' AND pashto_word NOT IN ('راپاروی،','راپاروی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاروی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاروی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راپاروی.';

-- Merge 1 variants of 'سنتوی': سنتوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سنتوی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سنتوی' AND pashto_word NOT IN ('سنتوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سنتوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سنتوی.';

-- Merge 2 variants of 'مومی': مومی،, مومی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مومی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مومی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مومی' AND pashto_word NOT IN ('مومی،','مومی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مومی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مومی،';
DELETE FROM word_frequencies WHERE pashto_word = 'مومی.';

-- Merge 1 variants of 'لوېږی': لوېږی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوېږی.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لوېږی' AND pashto_word NOT IN ('لوېږی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوېږی.»';

-- Merge 1 variants of 'خاندی': خاندی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاندی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خاندی' AND pashto_word NOT IN ('خاندی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاندی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاندی،';

-- Merge 1 variants of 'ملامتوی': ملامتوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ملامتوی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ملامتوی' AND pashto_word NOT IN ('ملامتوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ملامتوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ملامتوی،';

-- Merge 1 variants of 'وانخلی': وانخلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وانخلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وانخلی' AND pashto_word NOT IN ('وانخلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وانخلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وانخلی،';

-- Merge 1 variants of 'وڅنډی': وڅنډی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅنډی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅنډی' AND pashto_word NOT IN ('وڅنډی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅنډی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅنډی.';

-- Merge 1 variants of 'ښکاری': ښکاری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکاری،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښکاری' AND pashto_word NOT IN ('ښکاری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکاری', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکاری،';

-- Merge 2 variants of 'ماتوی': ماتوی،, ماتوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماتوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ماتوی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ماتوی' AND pashto_word NOT IN ('ماتوی،','ماتوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماتوی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماتوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ماتوی.';

-- Merge 1 variants of 'وجنګېږی': وجنګېږی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وجنګېږی.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وجنګېږی' AND pashto_word NOT IN ('وجنګېږی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وجنګېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وجنګېږی.»';

-- Merge 1 variants of 'راکوی': راکوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راکوی' AND pashto_word NOT IN ('راکوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوی.';

-- Merge 1 variants of 'ميشایيل': ميشایيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميشایيل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ميشایيل' AND pashto_word NOT IN ('ميشایيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميشایيل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميشایيل،';

-- Merge 2 variants of 'راکولی': راکولی., راکولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکولی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکولی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راکولی' AND pashto_word NOT IN ('راکولی.','راکولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکولی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکولی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکولی،';

-- Merge 1 variants of 'لويوالی': لويوالی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لويوالی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لويوالی' AND pashto_word NOT IN ('لويوالی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لويوالی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لويوالی،';

-- Merge 1 variants of 'پټوی': پټوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټوی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پټوی' AND pashto_word NOT IN ('پټوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټوی،';

-- Merge 1 variants of 'شی.›': شی.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'شی.›»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شی.›' AND pashto_word NOT IN ('شی.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شی.›', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شی.›»';

-- Merge 1 variants of 'ګوری، په': «ګوری، په

DELETE FROM word_verse_mapping WHERE pashto_word = '«ګوری، په';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګوری، په' AND pashto_word NOT IN ('«ګوری، په');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوری، په', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '«ګوری، په';

-- Merge 1 variants of 'راوغوښتلی': راوغوښتلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغوښتلی' AND pashto_word NOT IN ('راوغوښتلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښتلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتلی،';

-- Merge 1 variants of 'څملی': څملی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'څملی' AND pashto_word NOT IN ('څملی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملی،';

-- Merge 1 variants of 'وشلوی': وشلوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلوی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وشلوی' AND pashto_word NOT IN ('وشلوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشلوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشلوی،';

-- Merge 1 variants of 'راوغورزېږی': راوغورزېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزېږی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغورزېږی' AND pashto_word NOT IN ('راوغورزېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزېږی.';

-- Merge 1 variants of 'اوچتوی': اوچتوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوچتوی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوچتوی' AND pashto_word NOT IN ('اوچتوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوچتوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوچتوی.';

-- Merge 1 variants of 'تویيوی': تویيوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تویيوی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تویيوی' AND pashto_word NOT IN ('تویيوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تویيوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تویيوی.';

-- Merge 1 variants of 'رالېږلی': رالېږلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رالېږلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رالېږلی' AND pashto_word NOT IN ('رالېږلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رالېږلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رالېږلی،';

-- Merge 1 variants of 'های': های،

DELETE FROM word_verse_mapping WHERE pashto_word = 'های،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'های' AND pashto_word NOT IN ('های،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('های', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'های،';

-- Merge 1 variants of 'ډېری': ډېری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډېری،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ډېری' AND pashto_word NOT IN ('ډېری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډېری', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډېری،';

-- Merge 1 variants of 'اوچتولی': اوچتولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوچتولی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوچتولی' AND pashto_word NOT IN ('اوچتولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوچتولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوچتولی،';

-- Merge 1 variants of 'بدلېدلی': بدلېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بدلېدلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بدلېدلی' AND pashto_word NOT IN ('بدلېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بدلېدلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بدلېدلی،';

-- Merge 1 variants of 'اېښی': اېښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اېښی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اېښی' AND pashto_word NOT IN ('اېښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اېښی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اېښی،';

-- Merge 1 variants of 'وتلی': وتلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وتلی' AND pashto_word NOT IN ('وتلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتلی،';

-- Merge 1 variants of 'لګولی': لګولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګولی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لګولی' AND pashto_word NOT IN ('لګولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګولی،';

-- Merge 1 variants of 'لټولی': لټولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټولی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لټولی' AND pashto_word NOT IN ('لټولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټولی،';

-- Merge 1 variants of 'اورولی': اورولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورولی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اورولی' AND pashto_word NOT IN ('اورولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورولی.';

-- Merge 1 variants of 'وژغورلی': وژغورلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وژغورلی' AND pashto_word NOT IN ('وژغورلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژغورلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورلی.';

-- Merge 1 variants of 'بې‌فایدې': بې‌فایدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بې‌فایدې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بې‌فایدې' AND pashto_word NOT IN ('بې‌فایدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بې‌فایدې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بې‌فایدې،';

-- Merge 1 variants of 'وشماری': وشماری.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشماری.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وشماری' AND pashto_word NOT IN ('وشماری.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشماری', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشماری.»';

-- Merge 1 variants of 'اړوی': اړوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اړوی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اړوی' AND pashto_word NOT IN ('اړوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اړوی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اړوی.';

-- Merge 1 variants of 'وګوریينه': وګوریينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوریينه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وګوریينه' AND pashto_word NOT IN ('وګوریينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګوریينه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګوریينه،';

-- Merge 1 variants of 'ښایسته': ښایسته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایسته،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښایسته' AND pashto_word NOT IN ('ښایسته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښایسته', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښایسته،';

-- Merge 1 variants of 'موږی': موږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موږی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'موږی' AND pashto_word NOT IN ('موږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موږی،';

-- Merge 1 variants of 'ګټی': ګټی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګټی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګټی' AND pashto_word NOT IN ('ګټی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګټی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګټی.';

-- Merge 1 variants of 'شمېرلی': شمېرلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمېرلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شمېرلی' AND pashto_word NOT IN ('شمېرلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمېرلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمېرلی.';

-- Merge 1 variants of 'ايساروی': ايساروی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايساروی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ايساروی' AND pashto_word NOT IN ('ايساروی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايساروی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايساروی.';

-- Merge 1 variants of 'ښودلی': ښودلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښودلی' AND pashto_word NOT IN ('ښودلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودلی.';

-- Merge 1 variants of 'حاضرېدلی': حاضرېدلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاضرېدلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حاضرېدلی' AND pashto_word NOT IN ('حاضرېدلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاضرېدلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاضرېدلی.';

-- Merge 1 variants of 'کموی': کموی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کموی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کموی' AND pashto_word NOT IN ('کموی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کموی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کموی.';

-- Merge 1 variants of 'تړی': تړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تړی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تړی' AND pashto_word NOT IN ('تړی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تړی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تړی،';

-- Merge 1 variants of 'غورېږی': غورېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورېږی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غورېږی' AND pashto_word NOT IN ('غورېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورېږی،';

-- Merge 1 variants of 'ورولی': ورولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورولی' AND pashto_word NOT IN ('ورولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولی.';

-- Merge 2 variants of 'راوغورزوی': راوغورزوی., راوغورزوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزوی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راوغورزوی' AND pashto_word NOT IN ('راوغورزوی.','راوغورزوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزوی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزوی،';

-- Merge 1 variants of 'سوزولی': سوزولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزولی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سوزولی' AND pashto_word NOT IN ('سوزولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوزولی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوزولی.';

-- Merge 1 variants of 'چېلی': چېلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چېلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چېلی' AND pashto_word NOT IN ('چېلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چېلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چېلی،';

-- Merge 1 variants of 'ګډُوری': ګډُوری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډُوری،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګډُوری' AND pashto_word NOT IN ('ګډُوری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډُوری', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډُوری،';

-- Merge 1 variants of 'لرلی': لرلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لرلی' AND pashto_word NOT IN ('لرلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرلی.';

-- Merge 1 variants of 'اوړی': اوړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوړی' AND pashto_word NOT IN ('اوړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړی.';

-- Merge 1 variants of 'وآزمایيلو': وآزمایيلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وآزمایيلو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وآزمایيلو' AND pashto_word NOT IN ('وآزمایيلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وآزمایيلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وآزمایيلو.';

-- Merge 1 variants of 'راوړلی': راوړلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوړلی' AND pashto_word NOT IN ('راوړلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړلی.';

-- Merge 1 variants of 'تېرېږی': تېرېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېږی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تېرېږی' AND pashto_word NOT IN ('تېرېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېږی،';

-- Merge 1 variants of 'ايسارېږی': ايسارېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايسارېږی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ايسارېږی' AND pashto_word NOT IN ('ايسارېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايسارېږی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايسارېږی.';

-- Merge 1 variants of 'اِسرایيليانو': اِسرایيليانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيليانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اِسرایيليانو' AND pashto_word NOT IN ('اِسرایيليانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسرایيليانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيليانو،';

