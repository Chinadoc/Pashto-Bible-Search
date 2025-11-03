
-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وبخښی' AND pashto_word NOT IN ('وبخښی،','وبخښی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبخښی', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښی.';

-- Merge 1 variants of 'وګرځوی': وګرځوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځوی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګرځوی' AND pashto_word NOT IN ('وګرځوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځوی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځوی.';

-- Merge 3 variants of 'ووېرېږی': ووېرېږی., ووېرېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېږی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېږی!';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ووېرېږی' AND pashto_word NOT IN ('ووېرېږی.','ووېرېږی،','ووېرېږی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېرېږی', 10);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېږی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېږی!';

-- Merge 3 variants of 'وژاړی': وژاړی., وژاړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژاړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژاړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژاړی!';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وژاړی' AND pashto_word NOT IN ('وژاړی.','وژاړی،','وژاړی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژاړی', 12);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژاړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژاړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژاړی!';

-- Merge 2 variants of 'وړی': وړی،, وړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وړی' AND pashto_word NOT IN ('وړی،','وړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وړی.';

-- Merge 3 variants of 'لټوی': لټوی،, لټوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوی.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'لټوی' AND pashto_word NOT IN ('لټوی،','لټوی.','لټوی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټوی', 10);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'لټوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'لټوی.»';

-- Merge 1 variants of 'کری': کری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کری،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کری' AND pashto_word NOT IN ('کری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کری', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کری،';

-- Merge 2 variants of 'وغورزوی': وغورزوی., وغورزوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوی،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وغورزوی' AND pashto_word NOT IN ('وغورزوی.','وغورزوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزوی', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوی،';

-- Merge 1 variants of 'ولمانځی': ولمانځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولمانځی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ولمانځی' AND pashto_word NOT IN ('ولمانځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولمانځی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولمانځی.';

-- Merge 2 variants of 'واوسېږی': واوسېږی،, واوسېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسېږی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'واوسېږی' AND pashto_word NOT IN ('واوسېږی،','واوسېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوسېږی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوسېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'واوسېږی.';

-- Merge 1 variants of 'ساتلی': ساتلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتلی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ساتلی' AND pashto_word NOT IN ('ساتلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتلی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتلی،';

-- Merge 1 variants of 'جوړولی': جوړولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړولی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'جوړولی' AND pashto_word NOT IN ('جوړولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړولی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړولی،';

-- Merge 2 variants of 'ویيلې': ویيلې., ویيلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویيلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ویيلې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ویيلې' AND pashto_word NOT IN ('ویيلې.','ویيلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویيلې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویيلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ویيلې،';

-- Merge 2 variants of 'جوړېږی': جوړېږی،, جوړېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړېږی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'جوړېږی' AND pashto_word NOT IN ('جوړېږی،','جوړېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړېږی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړېږی.';

-- Merge 2 variants of 'راتلی': راتلی., راتلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلی،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راتلی' AND pashto_word NOT IN ('راتلی.','راتلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتلی', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راتلی،';

-- Merge 1 variants of 'تويَوی': تويَوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تويَوی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'تويَوی' AND pashto_word NOT IN ('تويَوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تويَوی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تويَوی.';

-- Merge 1 variants of 'شمس': شمس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمس،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شمس' AND pashto_word NOT IN ('شمس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمس', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمس،';

-- Merge 2 variants of 'راوبلل': راوبلل،, راوبلل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوبلل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوبلل.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راوبلل' AND pashto_word NOT IN ('راوبلل،','راوبلل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوبلل', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوبلل،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوبلل.';

-- Merge 1 variants of 'الیشمع': الیشمع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیشمع،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'الیشمع' AND pashto_word NOT IN ('الیشمع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیشمع', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیشمع،';

-- Merge 1 variants of 'القانه': القانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'القانه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'القانه' AND pashto_word NOT IN ('القانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('القانه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'القانه،';

-- Merge 2 variants of 'یوناتان': یوناتان،, یوناتان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوناتان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یوناتان.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'یوناتان' AND pashto_word NOT IN ('یوناتان،','یوناتان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوناتان', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوناتان،';
DELETE FROM word_frequencies WHERE pashto_word = 'یوناتان.';

-- Merge 1 variants of 'اساف': اساف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اساف،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اساف' AND pashto_word NOT IN ('اساف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اساف', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اساف،';

-- Merge 1 variants of 'مخلوقاتو': مخلوقاتو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخلوقاتو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مخلوقاتو' AND pashto_word NOT IN ('مخلوقاتو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخلوقاتو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخلوقاتو،';

-- Merge 1 variants of 'کسیزه': کسیزه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کسیزه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کسیزه' AND pashto_word NOT IN ('کسیزه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کسیزه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کسیزه،';

-- Merge 2 variants of 'درکړ': درکړ،, درکړ.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړ،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړ.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'درکړ' AND pashto_word NOT IN ('درکړ،','درکړ.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړ', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړ،';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړ.';

-- Merge 1 variants of 'راوبللو': راوبللو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوبللو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راوبللو' AND pashto_word NOT IN ('راوبللو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوبللو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوبللو.';

-- Merge 2 variants of 'تېروې': تېروې،, تېروې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'تېروې' AND pashto_word NOT IN ('تېروې،','تېروې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروې،';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروې.';

-- Merge 2 variants of 'راغلم': راغلم., راغلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلم،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راغلم' AND pashto_word NOT IN ('راغلم.','راغلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلم', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راغلم،';

-- Merge 2 variants of 'واورو': واورو.», واورو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورو.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'واورو' AND pashto_word NOT IN ('واورو.»','واورو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورو.»';
DELETE FROM word_frequencies WHERE pashto_word = 'واورو،';

-- Merge 2 variants of 'وواهه': وواهه،, وواهه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وواهه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وواهه.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وواهه' AND pashto_word NOT IN ('وواهه،','وواهه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وواهه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وواهه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وواهه.';

-- Merge 2 variants of 'پاڅېده': پاڅېده،, پاڅېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېده.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'پاڅېده' AND pashto_word NOT IN ('پاڅېده،','پاڅېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېده', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېده.';

-- Merge 2 variants of 'ورسېدلې': ورسېدلې،, ورسېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدلې.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ورسېدلې' AND pashto_word NOT IN ('ورسېدلې،','ورسېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدلې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدلې.';

-- Merge 2 variants of 'وکړلې': وکړلې., وکړلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړلې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وکړلې' AND pashto_word NOT IN ('وکړلې.','وکړلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړلې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړلې،';

-- Merge 2 variants of 'وخوت': وخوت،, وخوت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوت،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوت.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وخوت' AND pashto_word NOT IN ('وخوت،','وخوت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوت', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوت،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوت.';

-- Merge 2 variants of 'واورې': واورې., واورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'واورې' AND pashto_word NOT IN ('واورې.','واورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورې.';
DELETE FROM word_frequencies WHERE pashto_word = 'واورې،';

-- Merge 1 variants of 'ووېرېده': ووېرېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېده،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ووېرېده' AND pashto_word NOT IN ('ووېرېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېرېده', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېده،';

-- Merge 2 variants of 'څښو': څښو., څښو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'څښو' AND pashto_word NOT IN ('څښو.','څښو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښو.';
DELETE FROM word_frequencies WHERE pashto_word = 'څښو،';

-- Merge 2 variants of 'وساتو': وساتو., وساتو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وساتو' AND pashto_word NOT IN ('وساتو.','وساتو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتو،';

-- Merge 1 variants of 'وغورځاوه': وغورځاوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورځاوه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وغورځاوه' AND pashto_word NOT IN ('وغورځاوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورځاوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورځاوه.';

-- Merge 3 variants of 'واخیستله': واخیستله،, واخیستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیستله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیستله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیستله.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'واخیستله' AND pashto_word NOT IN ('واخیستله،','واخیستله.','واخیستله.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخیستله', 10);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخیستله،';
DELETE FROM word_frequencies WHERE pashto_word = 'واخیستله.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخیستله.»';

-- Merge 3 variants of 'ووایم': ووایم., ووایم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایم.»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ووایم' AND pashto_word NOT IN ('ووایم.','ووایم،','ووایم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایم', 8);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایم.»';

-- Merge 1 variants of 'حاکمان': حاکمان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاکمان،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'حاکمان' AND pashto_word NOT IN ('حاکمان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاکمان', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاکمان،';

-- Merge 1 variants of 'ځمکې': ځمکې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځمکې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ځمکې' AND pashto_word NOT IN ('ځمکې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځمکې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځمکې،';

-- Merge 1 variants of 'کښېناستله': کښېناستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کښېناستله' AND pashto_word NOT IN ('کښېناستله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناستله', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستله.';

-- Merge 1 variants of 'بد‌اخلاقي': بد‌اخلاقي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بد‌اخلاقي،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بد‌اخلاقي' AND pashto_word NOT IN ('بد‌اخلاقي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بد‌اخلاقي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بد‌اخلاقي،';

-- Merge 1 variants of 'غلامانو': غلامانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلامانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غلامانو' AND pashto_word NOT IN ('غلامانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلامانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلامانو،';

-- Merge 2 variants of 'راووځي': راووځي،, راووځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووځي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووځي.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راووځي' AND pashto_word NOT IN ('راووځي،','راووځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووځي', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووځي،';
DELETE FROM word_frequencies WHERE pashto_word = 'راووځي.';

-- Merge 1 variants of 'غضب': غضب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غضب،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غضب' AND pashto_word NOT IN ('غضب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غضب', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غضب،';

-- Merge 1 variants of 'خاوندانو': خاوندانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاوندانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خاوندانو' AND pashto_word NOT IN ('خاوندانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاوندانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاوندانو،';

-- Merge 1 variants of 'اولادونه': اولادونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اولادونه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اولادونه' AND pashto_word NOT IN ('اولادونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اولادونه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اولادونه،';

-- Merge 1 variants of 'وروښایي': وروښایي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروښایي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وروښایي' AND pashto_word NOT IN ('وروښایي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروښایي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروښایي.';

-- Merge 1 variants of 'صبر': صبر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صبر،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'صبر' AND pashto_word NOT IN ('صبر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صبر', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صبر،';

-- Merge 1 variants of 'ونیسو': ونیسو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ونیسو' AND pashto_word NOT IN ('ونیسو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسو.';

-- Merge 1 variants of 'پېژندلې': پېژندلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندلې.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پېژندلې' AND pashto_word NOT IN ('پېژندلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژندلې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندلې.';

-- Merge 2 variants of 'وړله': وړله،, وړله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړله.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وړله' AND pashto_word NOT IN ('وړله،','وړله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړله', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړله،';
DELETE FROM word_frequencies WHERE pashto_word = 'وړله.';

-- Merge 1 variants of 'سوځیږي': سوځیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوځیږي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'سوځیږي' AND pashto_word NOT IN ('سوځیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوځیږي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوځیږي.';

-- Merge 1 variants of 'مرتا': مرتا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرتا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مرتا' AND pashto_word NOT IN ('مرتا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرتا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرتا،';

-- Merge 1 variants of 'غواړي': غواړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړي.»';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غواړي' AND pashto_word NOT IN ('غواړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړي.»';

-- Merge 1 variants of 'ورځي': ورځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ورځي' AND pashto_word NOT IN ('ورځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځي.';

-- Merge 3 variants of 'لېږم': لېږم،, لېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږم.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'لېږم' AND pashto_word NOT IN ('لېږم،','لېږم.','لېږم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږم', 10);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'لېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'لېږم.»';

-- Merge 1 variants of 'استاذه، ته': «استاذه، ته

DELETE FROM word_verse_mapping WHERE pashto_word = '«استاذه، ته';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'استاذه، ته' AND pashto_word NOT IN ('«استاذه، ته');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استاذه، ته', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '«استاذه، ته';

-- Merge 2 variants of 'درلېږم': درلېږم،, درلېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درلېږم.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'درلېږم' AND pashto_word NOT IN ('درلېږم،','درلېږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلېږم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'درلېږم.';

-- Merge 1 variants of 'نیول': نیول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیول.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نیول' AND pashto_word NOT IN ('نیول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیول', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیول.';

-- Merge 1 variants of 'کومي': کومي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کومي،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کومي' AND pashto_word NOT IN ('کومي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کومي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کومي،';

-- Merge 2 variants of 'وغوښتله': وغوښتله., وغوښتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتله،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وغوښتله' AND pashto_word NOT IN ('وغوښتله.','وغوښتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغوښتله', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتله،';

-- Merge 1 variants of 'وسپاري': وسپاري.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپاري.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وسپاري' AND pashto_word NOT IN ('وسپاري.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسپاري', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسپاري.';

-- Merge 2 variants of 'راوغوښت': راوغوښت., راوغوښت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښت.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښت،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راوغوښت' AND pashto_word NOT IN ('راوغوښت.','راوغوښت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښت', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښت.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښت،';

-- Merge 1 variants of 'تللو': تللو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تللو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تللو' AND pashto_word NOT IN ('تللو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تللو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تللو،';

-- Merge 1 variants of 'ورونه': ورونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورونه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ورونه' AND pashto_word NOT IN ('ورونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورونه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورونه،';

-- Merge 2 variants of 'نوکره': نوکره!, نوکره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نوکره!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نوکره،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'نوکره' AND pashto_word NOT IN ('نوکره!','نوکره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نوکره', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نوکره!';
DELETE FROM word_frequencies WHERE pashto_word = 'نوکره،';

-- Merge 2 variants of 'راولویږي': راولویږي،, راولویږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولویږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولویږي.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راولویږي' AND pashto_word NOT IN ('راولویږي،','راولویږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولویږي', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولویږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولویږي.';

-- Merge 2 variants of 'ژغورل': ژغورل،, ژغورل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغورل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغورل.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ژغورل' AND pashto_word NOT IN ('ژغورل،','ژغورل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژغورل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژغورل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ژغورل.';

-- Merge 2 variants of 'راوستلې': راوستلې،, راوستلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلې.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راوستلې' AND pashto_word NOT IN ('راوستلې،','راوستلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستلې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلې.';

-- Merge 1 variants of 'امسا': امسا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امسا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'امسا' AND pashto_word NOT IN ('امسا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امسا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امسا،';

-- Merge 1 variants of 'تاته': تاته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تاته،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تاته' AND pashto_word NOT IN ('تاته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تاته', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تاته،';

-- Merge 2 variants of 'ورټل': ورټل., ورټل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورټل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورټل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ورټل' AND pashto_word NOT IN ('ورټل.','ورټل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورټل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورټل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورټل،';

-- Merge 3 variants of 'ښایي': ښایي., ښایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایي.»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ښایي' AND pashto_word NOT IN ('ښایي.','ښایي،','ښایي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښایي', 8);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښایي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښایي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښایي.»';

-- Merge 1 variants of 'روح': روح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روح،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'روح' AND pashto_word NOT IN ('روح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روح', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روح،';

-- Merge 2 variants of 'اچولې': اچولې., اچولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اچولې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اچولې' AND pashto_word NOT IN ('اچولې.','اچولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچولې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'اچولې،';

-- Merge 1 variants of 'ژغورلی': ژغورلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغورلی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ژغورلی' AND pashto_word NOT IN ('ژغورلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژغورلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژغورلی.';

-- Merge 1 variants of 'زیاتیږي': زیاتیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زیاتیږي،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زیاتیږي' AND pashto_word NOT IN ('زیاتیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زیاتیږي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زیاتیږي،';

-- Merge 2 variants of 'وجنګیږي': وجنګیږي،, وجنګیږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وجنګیږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وجنګیږي.»';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وجنګیږي' AND pashto_word NOT IN ('وجنګیږي،','وجنګیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وجنګیږي', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وجنګیږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وجنګیږي.»';

-- Merge 1 variants of 'وي.›': وي.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وي.›»';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وي.›' AND pashto_word NOT IN ('وي.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وي.›', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وي.›»';

-- Merge 1 variants of 'وغورځوه': وغورځوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورځوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وغورځوه' AND pashto_word NOT IN ('وغورځوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورځوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورځوه،';

-- Merge 2 variants of 'ولرې': ولرې., ولرې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولرې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولرې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ولرې' AND pashto_word NOT IN ('ولرې.','ولرې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولرې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولرې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولرې،';

-- Merge 1 variants of 'وروي': وروي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وروي' AND pashto_word NOT IN ('وروي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروي.';

-- Merge 1 variants of 'اچوه': اچوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اچوه' AND pashto_word NOT IN ('اچوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچوه،';

-- Merge 1 variants of 'ګڼې': ګڼې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګڼې' AND pashto_word NOT IN ('ګڼې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼې،';

-- Merge 2 variants of 'ولګېده': ولګېده،, ولګېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګېده.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ولګېده' AND pashto_word NOT IN ('ولګېده،','ولګېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګېده', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګېده.';

-- Merge 1 variants of 'راوغورځول': راوغورځول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورځول.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راوغورځول' AND pashto_word NOT IN ('راوغورځول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورځول', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورځول.';

-- Merge 1 variants of 'برنجو': برنجو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برنجو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'برنجو' AND pashto_word NOT IN ('برنجو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برنجو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برنجو،';

-- Merge 1 variants of 'اوړه': اوړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اوړه' AND pashto_word NOT IN ('اوړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړه،';

-- Merge 1 variants of 'اسونو': اسونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اسونو' AND pashto_word NOT IN ('اسونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسونو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسونو،';

-- Merge 1 variants of 'ښه': ښه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ښه' AND pashto_word NOT IN ('ښه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښه،';

-- Merge 1 variants of 'خواته': خواته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خواته،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خواته' AND pashto_word NOT IN ('خواته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خواته', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خواته،';

-- Merge 2 variants of 'درځم': درځم،, درځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درځم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درځم.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'درځم' AND pashto_word NOT IN ('درځم،','درځم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درځم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درځم،';
DELETE FROM word_frequencies WHERE pashto_word = 'درځم.';

-- Merge 1 variants of 'پټوه': پټوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پټوه' AND pashto_word NOT IN ('پټوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټوه،';

-- Merge 1 variants of 'خلاصولی': خلاصولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلاصولی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خلاصولی' AND pashto_word NOT IN ('خلاصولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلاصولی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلاصولی.';

-- Merge 2 variants of 'شولې': شولې., شولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شولې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شولې' AND pashto_word NOT IN ('شولې.','شولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شولې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'شولې،';

-- Merge 2 variants of 'راوتل': راوتل،, راوتل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوتل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوتل.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راوتل' AND pashto_word NOT IN ('راوتل،','راوتل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوتل', 8);
