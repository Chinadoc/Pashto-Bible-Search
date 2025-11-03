
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کينه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کينه،';

-- Merge 1 variants of 'مګدلينى': مګدلينى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مګدلينى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مګدلينى' AND pashto_word NOT IN ('مګدلينى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مګدلينى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مګدلينى،';

-- Merge 1 variants of 'بې‌ايمانه': بې‌ايمانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بې‌ايمانه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بې‌ايمانه' AND pashto_word NOT IN ('بې‌ايمانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بې‌ايمانه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بې‌ايمانه،';

-- Merge 1 variants of 'مستۍ': مستۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مستۍ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مستۍ' AND pashto_word NOT IN ('مستۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مستۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مستۍ،';

-- Merge 1 variants of 'زوروې': زوروې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زوروې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'زوروې' AND pashto_word NOT IN ('زوروې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زوروې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زوروې.';

-- Merge 1 variants of 'پرستۍ': پرستۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرستۍ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پرستۍ' AND pashto_word NOT IN ('پرستۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرستۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرستۍ،';

-- Merge 1 variants of 'آزاد': آزاد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آزاد،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'آزاد' AND pashto_word NOT IN ('آزاد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آزاد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آزاد،';

-- Merge 1 variants of 'ليکم': ليکم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليکم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ليکم' AND pashto_word NOT IN ('ليکم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليکم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليکم،';

-- Merge 1 variants of 'مالِکانو': مالِکانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مالِکانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مالِکانو' AND pashto_word NOT IN ('مالِکانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِکانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکانو،';

-- Merge 1 variants of 'راواخلی': راواخلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخلی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راواخلی' AND pashto_word NOT IN ('راواخلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخلی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخلی،';

-- Merge 2 variants of 'شرمېږی': شرمېږی،, شرمېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمېږی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شرمېږی' AND pashto_word NOT IN ('شرمېږی،','شرمېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرمېږی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرمېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'شرمېږی.';

-- Merge 1 variants of 'باسی': باسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باسی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'باسی' AND pashto_word NOT IN ('باسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باسی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باسی،';

-- Merge 1 variants of 'پاڅېږی': پاڅېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېږی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پاڅېږی' AND pashto_word NOT IN ('پاڅېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېږی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېږی،';

-- Merge 2 variants of 'وګرځی': وګرځی،, وګرځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګرځی' AND pashto_word NOT IN ('وګرځی،','وګرځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځی.';

-- Merge 2 variants of 'اوسېدلی': اوسېدلی., اوسېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدلی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اوسېدلی' AND pashto_word NOT IN ('اوسېدلی.','اوسېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدلی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدلی،';

-- Merge 2 variants of 'وسوځوی': وسوځوی., وسوځوی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوی.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وسوځوی' AND pashto_word NOT IN ('وسوځوی.','وسوځوی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځوی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوی.»';

-- Merge 1 variants of 'وټاکی': وټاکی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وټاکی' AND pashto_word NOT IN ('وټاکی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وټاکی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکی.';

-- Merge 2 variants of 'راوتلی': راوتلی،, راوتلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوتلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوتلی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راوتلی' AND pashto_word NOT IN ('راوتلی،','راوتلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوتلی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوتلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوتلی.';

-- Merge 1 variants of 'ووېشی': ووېشی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووېشی' AND pashto_word NOT IN ('ووېشی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېشی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشی،';

-- Merge 1 variants of 'غلی': غلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غلی' AND pashto_word NOT IN ('غلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلی،';

-- Merge 1 variants of 'لاړی': لاړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لاړی' AND pashto_word NOT IN ('لاړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړی.';

-- Merge 1 variants of 'کولاولی': کولاولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولاولی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کولاولی' AND pashto_word NOT IN ('کولاولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولاولی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولاولی.';

-- Merge 2 variants of 'درکولی': درکولی،, درکولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکولی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکولی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'درکولی' AND pashto_word NOT IN ('درکولی،','درکولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکولی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکولی،';
DELETE FROM word_frequencies WHERE pashto_word = 'درکولی.';

-- Merge 1 variants of 'وښايی': وښايی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښايی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وښايی' AND pashto_word NOT IN ('وښايی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښايی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښايی.';

-- Merge 1 variants of 'يرولی': يرولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرولی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يرولی' AND pashto_word NOT IN ('يرولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرولی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرولی.';

-- Merge 1 variants of 'يادوی': يادوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يادوی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'يادوی' AND pashto_word NOT IN ('يادوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يادوی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يادوی،';

-- Merge 1 variants of 'واوروی': واوروی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوروی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واوروی' AND pashto_word NOT IN ('واوروی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوروی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوروی.';

-- Merge 2 variants of 'ښویيږى': ښویيږى., ښویيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښویيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښویيږى،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ښویيږى' AND pashto_word NOT IN ('ښویيږى.','ښویيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښویيږى', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښویيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښویيږى،';

-- Merge 1 variants of 'ودرېدی': ودرېدی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ودرېدی' AND pashto_word NOT IN ('ودرېدی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدی.';

-- Merge 2 variants of 'حلالوی': حلالوی., حلالوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حلالوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'حلالوی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حلالوی' AND pashto_word NOT IN ('حلالوی.','حلالوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حلالوی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حلالوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'حلالوی،';

-- Merge 2 variants of 'وشمېری': وشمېری،, وشمېری.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشمېری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشمېری.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وشمېری' AND pashto_word NOT IN ('وشمېری،','وشمېری.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشمېری', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشمېری،';
DELETE FROM word_frequencies WHERE pashto_word = 'وشمېری.';

-- Merge 1 variants of 'وآزمایيم': وآزمایيم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وآزمایيم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وآزمایيم' AND pashto_word NOT IN ('وآزمایيم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وآزمایيم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وآزمایيم.';

-- Merge 1 variants of 'پایى': پایى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پایى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پایى' AND pashto_word NOT IN ('پایى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پایى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پایى.';

-- Merge 1 variants of 'راغونډېږی': راغونډېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغونډېږی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راغونډېږی' AND pashto_word NOT IN ('راغونډېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغونډېږی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغونډېږی.';

-- Merge 1 variants of 'راوستلی': راوستلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوستلی' AND pashto_word NOT IN ('راوستلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستلی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلی،';

-- Merge 1 variants of 'پاڅی': پاڅی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پاڅی' AND pashto_word NOT IN ('پاڅی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅی،';

-- Merge 1 variants of 'وآزمایى': وآزمایى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وآزمایى،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وآزمایى' AND pashto_word NOT IN ('وآزمایى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وآزمایى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وآزمایى،';

-- Merge 1 variants of 'اوسېدی': اوسېدی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوسېدی' AND pashto_word NOT IN ('اوسېدی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدی.';

-- Merge 1 variants of 'سړی': سړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سړی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سړی' AND pashto_word NOT IN ('سړی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سړی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سړی،';

-- Merge 1 variants of 'اِسرایيل': اِسرایيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اِسرایيل' AND pashto_word NOT IN ('اِسرایيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسرایيل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيل،';

-- Merge 1 variants of 'سمویيل': سمویيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سمویيل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سمویيل' AND pashto_word NOT IN ('سمویيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سمویيل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سمویيل،';

-- Merge 1 variants of 'اِسرایيليان': اِسرایيليان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيليان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اِسرایيليان' AND pashto_word NOT IN ('اِسرایيليان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسرایيليان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيليان،';

-- Merge 1 variants of 'آزمایى': آزمایى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'آزمایى.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'آزمایى' AND pashto_word NOT IN ('آزمایى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آزمایى', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آزمایى.';

-- Merge 1 variants of 'بایيلو': بایيلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بایيلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بایيلو' AND pashto_word NOT IN ('بایيلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بایيلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بایيلو.';

-- Merge 1 variants of 'راپرېږدی': راپرېږدی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپرېږدی،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راپرېږدی' AND pashto_word NOT IN ('راپرېږدی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپرېږدی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپرېږدی،';

-- Merge 2 variants of 'ږدی': ږدی., ږدی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ږدی' AND pashto_word NOT IN ('ږدی.','ږدی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږدی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږدی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ږدی،';

-- Merge 1 variants of 'اب': اب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اب،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اب' AND pashto_word NOT IN ('اب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اب', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اب،';

-- Merge 1 variants of 'صِدق': صِدق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صِدق،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'صِدق' AND pashto_word NOT IN ('صِدق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صِدق', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صِدق،';

-- Merge 1 variants of 'هاجِرې': هاجِرې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هاجِرې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'هاجِرې' AND pashto_word NOT IN ('هاجِرې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هاجِرې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هاجِرې،';

-- Merge 1 variants of 'اِبراهيمه': اِبراهيمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِبراهيمه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اِبراهيمه' AND pashto_word NOT IN ('اِبراهيمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِبراهيمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِبراهيمه،';

-- Merge 1 variants of 'وڅښه': وڅښه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅښه' AND pashto_word NOT IN ('وڅښه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښه،';

-- Merge 1 variants of 'زخم': زخم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زخم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زخم' AND pashto_word NOT IN ('زخم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زخم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زخم،';

-- Merge 1 variants of 'وپېژني': وپېژني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژني،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وپېژني' AND pashto_word NOT IN ('وپېژني،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژني', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژني،';

-- Merge 2 variants of 'کېدای': کېدای،, کېدای.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدای،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدای.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کېدای' AND pashto_word NOT IN ('کېدای،','کېدای.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدای', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدای،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدای.';

-- Merge 1 variants of 'پولوس': پولوس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پولوس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پولوس' AND pashto_word NOT IN ('پولوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پولوس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پولوس،';

-- Merge 1 variants of 'ووایو': ووایو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووایو' AND pashto_word NOT IN ('ووایو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایو.';

-- Merge 1 variants of 'سوداګرو': سوداګرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوداګرو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سوداګرو' AND pashto_word NOT IN ('سوداګرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوداګرو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوداګرو،';

-- Merge 1 variants of 'پطروسه': پطروسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پطروسه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پطروسه' AND pashto_word NOT IN ('پطروسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پطروسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پطروسه،';

-- Merge 1 variants of 'ولوېدل': ولوېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوېدل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولوېدل' AND pashto_word NOT IN ('ولوېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولوېدل.';

-- Merge 1 variants of 'وزغمو': وزغمو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغمو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزغمو' AND pashto_word NOT IN ('وزغمو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزغمو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزغمو.';

-- Merge 1 variants of 'راګرځي': راګرځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راګرځي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راګرځي' AND pashto_word NOT IN ('راګرځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راګرځي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راګرځي،';

-- Merge 2 variants of 'ولوست': ولوست،, ولوست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوست،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوست.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ولوست' AND pashto_word NOT IN ('ولوست،','ولوست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوست', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولوست،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولوست.';

-- Merge 2 variants of 'زیاتېده': زیاتېده., زیاتېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زیاتېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زیاتېده،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زیاتېده' AND pashto_word NOT IN ('زیاتېده.','زیاتېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زیاتېده', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زیاتېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'زیاتېده،';

-- Merge 1 variants of 'ګټلې': ګټلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګټلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګټلې' AND pashto_word NOT IN ('ګټلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګټلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګټلې.';

-- Merge 1 variants of 'وتړلې': وتړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وتړلې' AND pashto_word NOT IN ('وتړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتړلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتړلې.';

-- Merge 1 variants of 'ولړزول': ولړزول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولړزول.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولړزول' AND pashto_word NOT IN ('ولړزول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولړزول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولړزول.';

-- Merge 2 variants of 'پوهېده': پوهېده., پوهېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېده،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پوهېده' AND pashto_word NOT IN ('پوهېده.','پوهېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېده', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېده،';

-- Merge 1 variants of 'ارتیمیسه': ارتیمیسه!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ارتیمیسه!»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ارتیمیسه' AND pashto_word NOT IN ('ارتیمیسه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ارتیمیسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ارتیمیسه!»';

-- Merge 2 variants of 'پرېنږدي': پرېنږدي., پرېنږدي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېنږدي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېنږدي.»';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پرېنږدي' AND pashto_word NOT IN ('پرېنږدي.','پرېنږدي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېنږدي', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېنږدي.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېنږدي.»';

-- Merge 2 variants of 'وخرایي': وخرایي., وخرایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخرایي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخرایي،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وخرایي' AND pashto_word NOT IN ('وخرایي.','وخرایي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخرایي', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخرایي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخرایي،';

-- Merge 2 variants of 'پلرونو': پلرونو!, پلرونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پلرونو!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پلرونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پلرونو' AND pashto_word NOT IN ('پلرونو!','پلرونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پلرونو', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پلرونو!';
DELETE FROM word_frequencies WHERE pashto_word = 'پلرونو،';

-- Merge 1 variants of 'ځورول': ځورول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځورول.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځورول' AND pashto_word NOT IN ('ځورول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځورول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځورول.';

-- Merge 2 variants of 'شاووله': شاووله!, شاووله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شاووله!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شاووله،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شاووله' AND pashto_word NOT IN ('شاووله!','شاووله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شاووله', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شاووله!';
DELETE FROM word_frequencies WHERE pashto_word = 'شاووله،';

-- Merge 1 variants of '‹څښتنه': ‹څښتنه،

DELETE FROM word_verse_mapping WHERE pashto_word = '‹څښتنه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = '‹څښتنه' AND pashto_word NOT IN ('‹څښتنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('‹څښتنه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '‹څښتنه،';

-- Merge 2 variants of 'ودراوه': ودراوه., ودراوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودراوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودراوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ودراوه' AND pashto_word NOT IN ('ودراوه.','ودراوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودراوه', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودراوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودراوه،';

-- Merge 1 variants of 'نیسه': نیسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیسه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نیسه' AND pashto_word NOT IN ('نیسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیسه،';

-- Merge 1 variants of 'ولرم': ولرم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولرم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولرم' AND pashto_word NOT IN ('ولرم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولرم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولرم.';

-- Merge 1 variants of 'تښتم': تښتم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تښتم' AND pashto_word NOT IN ('تښتم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتم.';

-- Merge 1 variants of 'ووژنو': ووژنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووژنو' AND pashto_word NOT IN ('ووژنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنو،';

-- Merge 1 variants of 'اورېدل': اورېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اورېدل' AND pashto_word NOT IN ('اورېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدل،';

-- Merge 1 variants of 'راتللو': راتللو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتللو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راتللو' AND pashto_word NOT IN ('راتللو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتللو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتللو،';

-- Merge 1 variants of 'اسحاق': اسحاق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسحاق،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اسحاق' AND pashto_word NOT IN ('اسحاق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسحاق', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسحاق،';

-- Merge 1 variants of 'هو، په': «هو، په

DELETE FROM word_verse_mapping WHERE pashto_word = '«هو، په';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'هو، په' AND pashto_word NOT IN ('«هو، په');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هو، په', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '«هو، په';

-- Merge 1 variants of 'راټولېدل': راټولېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولېدل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راټولېدل' AND pashto_word NOT IN ('راټولېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راټولېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راټولېدل.';

-- Merge 2 variants of 'وانخیست': وانخیست،, وانخیست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وانخیست،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وانخیست.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وانخیست' AND pashto_word NOT IN ('وانخیست،','وانخیست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وانخیست', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وانخیست،';
DELETE FROM word_frequencies WHERE pashto_word = 'وانخیست.';

-- Merge 1 variants of 'خاوندان': خاوندان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاوندان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خاوندان' AND pashto_word NOT IN ('خاوندان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاوندان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاوندان،';

-- Merge 1 variants of 'وبخښل': وبخښل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وبخښل' AND pashto_word NOT IN ('وبخښل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبخښل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښل.';

-- Merge 1 variants of 'ناسنته': ناسنته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناسنته،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ناسنته' AND pashto_word NOT IN ('ناسنته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناسنته', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناسنته،';

-- Merge 1 variants of 'مېړونو': مېړونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مېړونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مېړونو' AND pashto_word NOT IN ('مېړونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مېړونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مېړونو،';

-- Merge 1 variants of 'بادارانو': بادارانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادارانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بادارانو' AND pashto_word NOT IN ('بادارانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادارانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادارانو،';

-- Merge 2 variants of 'ورسوه': ورسوه.», ورسوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ورسوه' AND pashto_word NOT IN ('ورسوه.»','ورسوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوه', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوه.';

-- Merge 1 variants of 'نرمۍ': نرمۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نرمۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نرمۍ' AND pashto_word NOT IN ('نرمۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نرمۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نرمۍ،';

-- Merge 1 variants of 'ازاد': ازاد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ازاد.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ازاد' AND pashto_word NOT IN ('ازاد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ازاد', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ازاد.';

-- Merge 1 variants of 'کېږدو': کېږدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کېږدو' AND pashto_word NOT IN ('کېږدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدو،';

-- Merge 1 variants of 'میاشتې': میاشتې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'میاشتې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'میاشتې' AND pashto_word NOT IN ('میاشتې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('میاشتې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'میاشتې،';

-- Merge 1 variants of 'بخیلي': بخیلي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بخیلي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بخیلي' AND pashto_word NOT IN ('بخیلي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بخیلي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بخیلي،';

-- Merge 1 variants of 'نشه': نشه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نشه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نشه' AND pashto_word NOT IN ('نشه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نشه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نشه،';

-- Merge 1 variants of 'مینه': مینه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مینه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مینه' AND pashto_word NOT IN ('مینه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مینه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مینه،';

-- Merge 1 variants of 'وزېږوي': وزېږوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزېږوي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزېږوي' AND pashto_word NOT IN ('وزېږوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزېږوي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزېږوي،';

-- Merge 1 variants of 'راوغورځېدل': راوغورځېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورځېدل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغورځېدل' AND pashto_word NOT IN ('راوغورځېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورځېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورځېدل.';

-- Merge 1 variants of 'یفتاح': یفتاح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یفتاح،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یفتاح' AND pashto_word NOT IN ('یفتاح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یفتاح', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یفتاح،';

-- Merge 1 variants of 'پرون': پرون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرون،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پرون' AND pashto_word NOT IN ('پرون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرون', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرون،';

-- Merge 1 variants of 'نښو': نښو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نښو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نښو' AND pashto_word NOT IN ('نښو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نښو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نښو،';

-- Merge 1 variants of 'وزغمل': وزغمل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغمل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزغمل' AND pashto_word NOT IN ('وزغمل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزغمل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزغمل،';

-- Merge 1 variants of 'بې‌پلاره': بې‌پلاره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بې‌پلاره،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بې‌پلاره' AND pashto_word NOT IN ('بې‌پلاره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بې‌پلاره', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بې‌پلاره،';

-- Merge 1 variants of 'بې‌عیبه': بې‌عیبه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بې‌عیبه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بې‌عیبه' AND pashto_word NOT IN ('بې‌عیبه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بې‌عیبه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بې‌عیبه،';

-- Merge 1 variants of 'یادېدله': یادېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادېدله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یادېدله' AND pashto_word NOT IN ('یادېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادېدله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادېدله.';

-- Merge 1 variants of 'دروښایم': دروښایم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'دروښایم.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'دروښایم' AND pashto_word NOT IN ('دروښایم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دروښایم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دروښایم.»';

-- Merge 1 variants of 'مرغان': مرغان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرغان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مرغان' AND pashto_word NOT IN ('مرغان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرغان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرغان،';

-- Merge 1 variants of 'غم': غم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غم' AND pashto_word NOT IN ('غم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غم.';

-- Merge 1 variants of 'وچوي': وچوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وچوي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وچوي' AND pashto_word NOT IN ('وچوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وچوي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وچوي.';

-- Merge 1 variants of 'ژاړي': ژاړي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژاړي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ژاړي' AND pashto_word NOT IN ('ژاړي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژاړي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژاړي،';

-- Merge 1 variants of 'ووینو': ووینو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینو.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووینو' AND pashto_word NOT IN ('ووینو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینو.»';

-- Merge 1 variants of 'وړ': وړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وړ' AND pashto_word NOT IN ('وړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړ،';

-- Merge 1 variants of 'راپاڅېده': راپاڅېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅېده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راپاڅېده' AND pashto_word NOT IN ('راپاڅېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅېده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅېده،';
