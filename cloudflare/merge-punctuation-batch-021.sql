
-- Merge 2 variants of 'بعنه': بعنه., بعنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بعنه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بعنه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بعنه' AND pashto_word NOT IN ('بعنه.','بعنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بعنه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بعنه.';
DELETE FROM word_frequencies WHERE pashto_word = 'بعنه،';

-- Merge 1 variants of 'باغونو': باغونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باغونو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'باغونو' AND pashto_word NOT IN ('باغونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باغونو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باغونو،';

-- Merge 1 variants of 'جوړول': جوړول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړول.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جوړول' AND pashto_word NOT IN ('جوړول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړول.';

-- Merge 1 variants of 'وغواړم': وغواړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغواړم' AND pashto_word NOT IN ('وغواړم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړم،';

-- Merge 1 variants of 'تورو': تورو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تورو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تورو' AND pashto_word NOT IN ('تورو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تورو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تورو،';

-- Merge 1 variants of 'ورانوي': ورانوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورانوي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورانوي' AND pashto_word NOT IN ('ورانوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورانوي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورانوي.';

-- Merge 1 variants of 'تندر': تندر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تندر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تندر' AND pashto_word NOT IN ('تندر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تندر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تندر،';

-- Merge 1 variants of 'سندرې': سندرې!

DELETE FROM word_verse_mapping WHERE pashto_word = 'سندرې!';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سندرې' AND pashto_word NOT IN ('سندرې!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سندرې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سندرې!';

-- Merge 1 variants of 'ظلم': ظلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ظلم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ظلم' AND pashto_word NOT IN ('ظلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ظلم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ظلم،';

-- Merge 1 variants of 'منو': منو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'منو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'منو' AND pashto_word NOT IN ('منو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منو.';

-- Merge 1 variants of 'ورېبل': ورېبل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورېبل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورېبل' AND pashto_word NOT IN ('ورېبل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورېبل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورېبل،';

-- Merge 1 variants of 'لېږى': لېږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لېږى' AND pashto_word NOT IN ('لېږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لېږى،';

-- Merge 2 variants of 'راواوړى': راواوړى،, راواوړى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواوړى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راواوړى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راواوړى' AND pashto_word NOT IN ('راواوړى،','راواوړى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواوړى', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواوړى،';
DELETE FROM word_frequencies WHERE pashto_word = 'راواوړى.';

-- Merge 1 variants of 'اوسيږو': اوسيږو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسيږو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوسيږو' AND pashto_word NOT IN ('اوسيږو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسيږو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسيږو،';

-- Merge 1 variants of 'ښخوى': ښخوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښخوى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ښخوى' AND pashto_word NOT IN ('ښخوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښخوى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښخوى،';

-- Merge 1 variants of 'غصې': غصې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غصې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غصې' AND pashto_word NOT IN ('غصې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غصې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غصې،';

-- Merge 1 variants of 'وبا': وبا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وبا' AND pashto_word NOT IN ('وبا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبا،';

-- Merge 1 variants of 'خاندانه': خاندانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاندانه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خاندانه' AND pashto_word NOT IN ('خاندانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاندانه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاندانه،';

-- Merge 1 variants of 'يوسياه': يوسياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوسياه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يوسياه' AND pashto_word NOT IN ('يوسياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوسياه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوسياه،';

-- Merge 2 variants of 'زِمرى': زِمرى،, زِمرى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زِمرى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زِمرى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زِمرى' AND pashto_word NOT IN ('زِمرى،','زِمرى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زِمرى', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زِمرى،';
DELETE FROM word_frequencies WHERE pashto_word = 'زِمرى.';

-- Merge 1 variants of 'کوونکو': کوونکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوونکو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کوونکو' AND pashto_word NOT IN ('کوونکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوونکو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوونکو،';

-- Merge 1 variants of 'هېروى': هېروى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هېروى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'هېروى' AND pashto_word NOT IN ('هېروى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هېروى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هېروى،';

-- Merge 1 variants of 'ګوډيان': ګوډيان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوډيان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګوډيان' AND pashto_word NOT IN ('ګوډيان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوډيان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوډيان،';

-- Merge 1 variants of 'غورزول': غورزول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورزول،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غورزول' AND pashto_word NOT IN ('غورزول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورزول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورزول،';

-- Merge 1 variants of 'کلو': کلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کلو' AND pashto_word NOT IN ('کلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کلو،';

-- Merge 1 variants of 'لېږه': لېږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لېږه' AND pashto_word NOT IN ('لېږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لېږه،';

-- Merge 1 variants of 'نبوزردان': نبوزردان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نبوزردان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'نبوزردان' AND pashto_word NOT IN ('نبوزردان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نبوزردان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نبوزردان،';

-- Merge 1 variants of 'ولېږلم': ولېږلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږلم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ولېږلم' AND pashto_word NOT IN ('ولېږلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږلم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلم،';

-- Merge 1 variants of 'ولټوه': ولټوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولټوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ولټوه' AND pashto_word NOT IN ('ولټوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولټوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولټوه.';

-- Merge 1 variants of 'شرمېدل': شرمېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمېدل.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شرمېدل' AND pashto_word NOT IN ('شرمېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرمېدل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرمېدل.';

-- Merge 1 variants of 'مفعت': مفعت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مفعت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مفعت' AND pashto_word NOT IN ('مفعت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مفعت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مفعت،';

-- Merge 1 variants of 'نبو': نبو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نبو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'نبو' AND pashto_word NOT IN ('نبو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نبو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نبو،';

-- Merge 2 variants of 'راووتو': راووتو،, راووتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راووتو' AND pashto_word NOT IN ('راووتو،','راووتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتو.';

-- Merge 1 variants of 'دشتو': دشتو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دشتو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دشتو' AND pashto_word NOT IN ('دشتو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دشتو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دشتو،';

-- Merge 2 variants of 'وګرځېدو': وګرځېدو., وګرځېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځېدو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وګرځېدو' AND pashto_word NOT IN ('وګرځېدو.','وګرځېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځېدو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځېدو،';

-- Merge 1 variants of 'راوچتوى': راوچتوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوچتوى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوچتوى' AND pashto_word NOT IN ('راوچتوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوچتوى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوچتوى،';

-- Merge 1 variants of 'وغورزوه': وغورزوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغورزوه' AND pashto_word NOT IN ('وغورزوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوه.';

-- Merge 1 variants of 'رسېدو': رسېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رسېدو' AND pashto_word NOT IN ('رسېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېدو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدو،';

-- Merge 2 variants of 'راواخستلو': راواخستلو., راواخستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راواخستلو' AND pashto_word NOT IN ('راواخستلو.','راواخستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخستلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستلو،';

-- Merge 1 variants of 'پېژندلى': پېژندلى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندلى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پېژندلى' AND pashto_word NOT IN ('پېژندلى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژندلى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندلى.';

-- Merge 1 variants of 'معلوموې': معلوموې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'معلوموې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'معلوموې' AND pashto_word NOT IN ('معلوموې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معلوموې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معلوموې.';

-- Merge 2 variants of 'وشلوله': وشلوله،, وشلوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلوله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلوله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وشلوله' AND pashto_word NOT IN ('وشلوله،','وشلوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشلوله', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشلوله،';
DELETE FROM word_frequencies WHERE pashto_word = 'وشلوله.';

-- Merge 1 variants of 'څروى': څروى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څروى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'څروى' AND pashto_word NOT IN ('څروى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څروى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څروى.';

-- Merge 1 variants of 'تلم': تلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تلم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تلم' AND pashto_word NOT IN ('تلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تلم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تلم،';

-- Merge 1 variants of 'غوريږى': غوريږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوريږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غوريږى' AND pashto_word NOT IN ('غوريږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوريږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوريږى،';

-- Merge 1 variants of 'اليفز': اليفز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اليفز،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اليفز' AND pashto_word NOT IN ('اليفز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اليفز', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اليفز،';

-- Merge 1 variants of 'وغړمبيږى': وغړمبيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغړمبيږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغړمبيږى' AND pashto_word NOT IN ('وغړمبيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغړمبيږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغړمبيږى،';

-- Merge 1 variants of 'عراد': عراد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عراد،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عراد' AND pashto_word NOT IN ('عراد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عراد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عراد،';

-- Merge 1 variants of 'لبنه': لبنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لبنه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لبنه' AND pashto_word NOT IN ('لبنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لبنه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لبنه،';

-- Merge 1 variants of 'قادش': قادش،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قادش،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'قادش' AND pashto_word NOT IN ('قادش،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قادش', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قادش،';

-- Merge 1 variants of 'راقم': راقم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راقم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راقم' AND pashto_word NOT IN ('راقم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راقم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راقم،';

-- Merge 1 variants of 'رامه': رامه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رامه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رامه' AND pashto_word NOT IN ('رامه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رامه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رامه،';

-- Merge 1 variants of 'رمون': رمون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رمون،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رمون' AND pashto_word NOT IN ('رمون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رمون', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رمون،';

-- Merge 1 variants of 'یووړله': یووړله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یووړله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'یووړله' AND pashto_word NOT IN ('یووړله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یووړله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یووړله.';

-- Merge 1 variants of 'مدیانیان': مدیانیان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مدیانیان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مدیانیان' AND pashto_word NOT IN ('مدیانیان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مدیانیان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مدیانیان،';

-- Merge 1 variants of 'څټي': څټي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څټي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'څټي' AND pashto_word NOT IN ('څټي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څټي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څټي.';

-- Merge 2 variants of 'وټاکي': وټاکي., وټاکي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکي،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وټاکي' AND pashto_word NOT IN ('وټاکي.','وټاکي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وټاکي', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکي،';

-- Merge 1 variants of 'راوغورزولو': راوغورزولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزولو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوغورزولو' AND pashto_word NOT IN ('راوغورزولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزولو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزولو.';

-- Merge 2 variants of 'يادېدو': يادېدو،, يادېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يادېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يادېدو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'يادېدو' AND pashto_word NOT IN ('يادېدو،','يادېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يادېدو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يادېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'يادېدو.';

-- Merge 1 variants of 'وبهيږى': وبهيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبهيږى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وبهيږى' AND pashto_word NOT IN ('وبهيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبهيږى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبهيږى،';

-- Merge 1 variants of 'پرېښودم': پرېښودم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پرېښودم' AND pashto_word NOT IN ('پرېښودم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودم.';

-- Merge 1 variants of 'وګرځولم': وګرځولم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځولم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وګرځولم' AND pashto_word NOT IN ('وګرځولم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځولم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځولم.';

-- Merge 1 variants of 'ډوبېږم': ډوبېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډوبېږم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ډوبېږم' AND pashto_word NOT IN ('ډوبېږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډوبېږم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډوبېږم.';

-- Merge 1 variants of 'راونيسه': راونيسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راونيسه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راونيسه' AND pashto_word NOT IN ('راونيسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راونيسه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راونيسه،';

-- Merge 1 variants of 'اوښ': اوښ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوښ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوښ' AND pashto_word NOT IN ('اوښ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوښ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوښ،';

-- Merge 1 variants of 'ړوند': ړوند،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ړوند،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ړوند' AND pashto_word NOT IN ('ړوند،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ړوند', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ړوند،';

-- Merge 1 variants of 'خوشحالېږې': خوشحالېږې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالېږې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خوشحالېږې' AND pashto_word NOT IN ('خوشحالېږې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالېږې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالېږې.';

-- Merge 1 variants of 'عربو': عربو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عربو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عربو' AND pashto_word NOT IN ('عربو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عربو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عربو،';

-- Merge 1 variants of 'خپلوانو': خپلوانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خپلوانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خپلوانو' AND pashto_word NOT IN ('خپلوانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خپلوانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خپلوانو،';

-- Merge 1 variants of 'کړي': کړي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړي!»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کړي' AND pashto_word NOT IN ('کړي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړي!»';

-- Merge 1 variants of 'غوښې': غوښې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوښې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غوښې' AND pashto_word NOT IN ('غوښې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوښې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوښې،';

-- Merge 2 variants of 'ورواغونده': ورواغونده., ورواغونده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورواغونده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورواغونده،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ورواغونده' AND pashto_word NOT IN ('ورواغونده.','ورواغونده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورواغونده', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورواغونده.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورواغونده،';

-- Merge 1 variants of 'عوج': عوج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عوج،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عوج' AND pashto_word NOT IN ('عوج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عوج', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عوج،';

-- Merge 1 variants of 'خوسیان': خوسیان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوسیان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خوسیان' AND pashto_word NOT IN ('خوسیان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوسیان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوسیان،';

-- Merge 1 variants of 'غرور': غرور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غرور،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غرور' AND pashto_word NOT IN ('غرور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غرور', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غرور،';

-- Merge 1 variants of 'دا': دا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دا' AND pashto_word NOT IN ('دا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دا،';

-- Merge 1 variants of 'شومه': شومه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شومه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شومه' AND pashto_word NOT IN ('شومه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شومه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شومه،';

-- Merge 2 variants of 'واړوه': واړوه،, واړوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واړوه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واړوه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واړوه' AND pashto_word NOT IN ('واړوه،','واړوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واړوه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واړوه،';
DELETE FROM word_frequencies WHERE pashto_word = 'واړوه.';

-- Merge 1 variants of 'وشلوى': وشلوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلوى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وشلوى' AND pashto_word NOT IN ('وشلوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشلوى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشلوى.';

-- Merge 1 variants of 'رټى': رټى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رټى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رټى' AND pashto_word NOT IN ('رټى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رټى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رټى،';

-- Merge 1 variants of 'ډيرى': ډيرى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډيرى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ډيرى' AND pashto_word NOT IN ('ډيرى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډيرى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډيرى،';

-- Merge 1 variants of 'کنعانه': کنعانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنعانه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کنعانه' AND pashto_word NOT IN ('کنعانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنعانه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنعانه،';

-- Merge 1 variants of 'وزغلوى': وزغلوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغلوى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وزغلوى' AND pashto_word NOT IN ('وزغلوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزغلوى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزغلوى.';

-- Merge 2 variants of 'ګرځم': ګرځم،, ګرځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځم.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګرځم' AND pashto_word NOT IN ('ګرځم،','ګرځم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځم', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځم.';

-- Merge 1 variants of 'ليدو': ليدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليدو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ليدو' AND pashto_word NOT IN ('ليدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليدو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليدو،';

-- Merge 1 variants of 'وخېژوه': وخېژوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وخېژوه' AND pashto_word NOT IN ('وخېژوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژوه.';

-- Merge 1 variants of 'مارغانو': مارغانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مارغانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مارغانو' AND pashto_word NOT IN ('مارغانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مارغانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مارغانو،';

-- Merge 1 variants of 'ماجوج': ماجوج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماجوج،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ماجوج' AND pashto_word NOT IN ('ماجوج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماجوج', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماجوج،';

-- Merge 1 variants of 'عُوض': عُوض،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُوض،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عُوض' AND pashto_word NOT IN ('عُوض،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُوض', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُوض،';

-- Merge 1 variants of 'يوباب': يوباب.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوباب.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يوباب' AND pashto_word NOT IN ('يوباب.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوباب', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوباب.';

-- Merge 1 variants of 'لوط': لوط،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوط،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لوط' AND pashto_word NOT IN ('لوط،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوط', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوط،';

-- Merge 2 variants of 'اوړېدو': اوړېدو،, اوړېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړېدو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اوړېدو' AND pashto_word NOT IN ('اوړېدو،','اوړېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړېدو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوړېدو.';

-- Merge 1 variants of 'خرۀ': خرۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرۀ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خرۀ' AND pashto_word NOT IN ('خرۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرۀ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرۀ،';

-- Merge 1 variants of 'څملاسته': څملاسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملاسته.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'څملاسته' AND pashto_word NOT IN ('څملاسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملاسته', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملاسته.';

-- Merge 1 variants of 'پکار': پکار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پکار،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پکار' AND pashto_word NOT IN ('پکار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پکار', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پکار،';

-- Merge 1 variants of 'تله': تله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تله،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تله' AND pashto_word NOT IN ('تله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تله،';

-- Merge 1 variants of 'رَمې': رَمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رَمې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رَمې' AND pashto_word NOT IN ('رَمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رَمې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رَمې،';

-- Merge 1 variants of 'ميديان': ميديان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميديان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ميديان' AND pashto_word NOT IN ('ميديان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميديان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميديان،';

-- Merge 2 variants of 'راواخستلې': راواخستلې،, راواخستلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستلې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راواخستلې' AND pashto_word NOT IN ('راواخستلې،','راواخستلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخستلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستلې.';

-- Merge 1 variants of 'ورواغوستلې': ورواغوستلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورواغوستلې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورواغوستلې' AND pashto_word NOT IN ('ورواغوستلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورواغوستلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورواغوستلې.';

-- Merge 1 variants of 'والا': والا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'والا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'والا' AND pashto_word NOT IN ('والا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('والا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'والا،';

-- Merge 1 variants of 'ښودلو': ښودلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ښودلو' AND pashto_word NOT IN ('ښودلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودلو.';

-- Merge 1 variants of 'تمبل': تمبل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تمبل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تمبل' AND pashto_word NOT IN ('تمبل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تمبل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تمبل،';

-- Merge 1 variants of 'بوځُو': بوځُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځُو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بوځُو' AND pashto_word NOT IN ('بوځُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځُو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځُو،';

-- Merge 1 variants of 'وموندلې': وموندلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندلې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وموندلې' AND pashto_word NOT IN ('وموندلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموندلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموندلې.';

-- Merge 1 variants of 'واغوستلې': واغوستلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واغوستلې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واغوستلې' AND pashto_word NOT IN ('واغوستلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واغوستلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واغوستلې.';

-- Merge 1 variants of 'موندله': موندله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'موندله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'موندله' AND pashto_word NOT IN ('موندله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موندله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موندله.';

-- Merge 2 variants of 'لاړُو': لاړُو،, لاړُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړُو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړُو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'لاړُو' AND pashto_word NOT IN ('لاړُو،','لاړُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړُو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړُو،';
DELETE FROM word_frequencies WHERE pashto_word = 'لاړُو.';

-- Merge 2 variants of 'راولېږلم': راولېږلم., راولېږلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږلم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راولېږلم' AND pashto_word NOT IN ('راولېږلم.','راولېږلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږلم', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږلم،';

-- Merge 1 variants of 'يکين': يکين،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يکين،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يکين' AND pashto_word NOT IN ('يکين،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يکين', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يکين،';

-- Merge 1 variants of 'تولع': تولع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تولع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تولع' AND pashto_word NOT IN ('تولع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تولع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تولع،';

-- Merge 1 variants of 'سِمرون': سِمرون.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سِمرون.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سِمرون' AND pashto_word NOT IN ('سِمرون.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سِمرون', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سِمرون.';

-- Merge 1 variants of 'حجى': حجى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حجى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حجى' AND pashto_word NOT IN ('حجى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حجى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حجى،';

-- Merge 1 variants of 'نعمان': نعمان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نعمان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'نعمان' AND pashto_word NOT IN ('نعمان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نعمان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نعمان،';

-- Merge 1 variants of 'خاندان': خاندان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاندان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خاندان' AND pashto_word NOT IN ('خاندان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاندان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاندان،';

-- Merge 1 variants of 'ځانونو': ځانونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځانونو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ځانونو' AND pashto_word NOT IN ('ځانونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځانونو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځانونو،';

-- Merge 1 variants of 'يوسه': يوسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوسه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يوسه' AND pashto_word NOT IN ('يوسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوسه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوسه،';
