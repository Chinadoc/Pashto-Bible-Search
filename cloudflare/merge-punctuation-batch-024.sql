
-- Merge 1 variants of 'ووینځه': ووینځه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینځه.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووینځه' AND pashto_word NOT IN ('ووینځه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینځه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینځه.»';

-- Merge 1 variants of 'ووینځلې': ووینځلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینځلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووینځلې' AND pashto_word NOT IN ('ووینځلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینځلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینځلې،';

-- Merge 1 variants of 'ولره': ولره.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولره.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولره' AND pashto_word NOT IN ('ولره.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولره', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولره.»';

-- Merge 1 variants of 'ونیسم': ونیسم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسم.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونیسم' AND pashto_word NOT IN ('ونیسم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسم.»';

-- Merge 1 variants of 'ختلی': ختلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ختلی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ختلی' AND pashto_word NOT IN ('ختلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ختلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ختلی،';

-- Merge 1 variants of 'ویستلی': ویستلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویستلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ویستلی' AND pashto_word NOT IN ('ویستلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویستلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویستلی.';

-- Merge 1 variants of 'ورښایي': ورښایي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورښایي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورښایي' AND pashto_word NOT IN ('ورښایي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورښایي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورښایي.';

-- Merge 2 variants of 'موندلی': موندلی،, موندلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'موندلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'موندلی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'موندلی' AND pashto_word NOT IN ('موندلی،','موندلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موندلی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موندلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'موندلی.';

-- Merge 1 variants of 'راواخیستلې': راواخیستلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخیستلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راواخیستلې' AND pashto_word NOT IN ('راواخیستلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخیستلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخیستلې،';

-- Merge 1 variants of 'ورتلل': ورتلل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورتلل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورتلل' AND pashto_word NOT IN ('ورتلل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورتلل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورتلل.';

-- Merge 1 variants of 'پټه': پټه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پټه' AND pashto_word NOT IN ('پټه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټه.';

-- Merge 1 variants of 'راتللی': راتللی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتللی.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راتللی' AND pashto_word NOT IN ('راتللی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتللی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتللی.»';

-- Merge 1 variants of 'رسېدلی': رسېدلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدلی.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رسېدلی' AND pashto_word NOT IN ('رسېدلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېدلی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدلی.';

-- Merge 2 variants of 'ولوله': ولوله،, ولوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ولوله' AND pashto_word NOT IN ('ولوله،','ولوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوله', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولوله،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولوله.';

-- Merge 1 variants of 'پریښی': پریښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پریښی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پریښی' AND pashto_word NOT IN ('پریښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پریښی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پریښی،';

-- Merge 1 variants of 'لویي': لویي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لویي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لویي' AND pashto_word NOT IN ('لویي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لویي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لویي،';

-- Merge 2 variants of 'ووېشي': ووېشي.», ووېشي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشي،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ووېشي' AND pashto_word NOT IN ('ووېشي.»','ووېشي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېشي', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشي،';

-- Merge 1 variants of 'ګودامونه': ګودامونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګودامونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګودامونه' AND pashto_word NOT IN ('ګودامونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګودامونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګودامونه،';

-- Merge 1 variants of 'راځي.›': راځي.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راځي.›»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راځي.›' AND pashto_word NOT IN ('راځي.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځي.›', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راځي.›»';

-- Merge 1 variants of 'شلان': شلان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شلان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شلان' AND pashto_word NOT IN ('شلان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شلان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شلان،';

-- Merge 1 variants of 'راپاڅیږي': راپاڅیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅیږي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راپاڅیږي' AND pashto_word NOT IN ('راپاڅیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅیږي،';

-- Merge 1 variants of 'لیدلې': لیدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لیدلې' AND pashto_word NOT IN ('لیدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیدلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیدلې،';

-- Merge 2 variants of 'واهه': واهه., واهه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واهه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واهه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'واهه' AND pashto_word NOT IN ('واهه.','واهه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واهه', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واهه.';
DELETE FROM word_frequencies WHERE pashto_word = 'واهه،';

-- Merge 1 variants of 'راونیوه': راونیوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راونیوه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راونیوه' AND pashto_word NOT IN ('راونیوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راونیوه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راونیوه.';

-- Merge 1 variants of 'مجدلیه': مجدلیه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مجدلیه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مجدلیه' AND pashto_word NOT IN ('مجدلیه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مجدلیه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مجدلیه،';

-- Merge 1 variants of 'وپېژانده': وپېژانده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژانده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وپېژانده' AND pashto_word NOT IN ('وپېژانده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژانده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژانده،';

-- Merge 2 variants of 'وتله': وتله،, وتله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وتله' AND pashto_word NOT IN ('وتله،','وتله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتله', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتله،';
DELETE FROM word_frequencies WHERE pashto_word = 'وتله.';

-- Merge 1 variants of 'لګیږي': لګیږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګیږي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لګیږي' AND pashto_word NOT IN ('لګیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګیږي.»';

-- Merge 1 variants of 'څښي': څښي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'څښي' AND pashto_word NOT IN ('څښي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښي.»';

-- Merge 1 variants of 'یهودیې': یهودیې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یهودیې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یهودیې' AND pashto_word NOT IN ('یهودیې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یهودیې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یهودیې،';

-- Merge 1 variants of 'ځوانه': ځوانه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوانه!';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځوانه' AND pashto_word NOT IN ('ځوانه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوانه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوانه!';

-- Merge 1 variants of 'ناروغیو': ناروغیو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناروغیو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ناروغیو' AND pashto_word NOT IN ('ناروغیو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناروغیو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناروغیو،';

-- Merge 1 variants of 'خېټور': خېټور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خېټور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خېټور' AND pashto_word NOT IN ('خېټور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خېټور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خېټور،';

-- Merge 1 variants of 'سکې': سکې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سکې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سکې' AND pashto_word NOT IN ('سکې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سکې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سکې.';

-- Merge 1 variants of 'اندېښنې': اندېښنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اندېښنې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اندېښنې' AND pashto_word NOT IN ('اندېښنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اندېښنې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اندېښنې،';

-- Merge 1 variants of 'ډوبیږو': ډوبیږو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډوبیږو.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ډوبیږو' AND pashto_word NOT IN ('ډوبیږو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډوبیږو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډوبیږو.»';

-- Merge 1 variants of 'عذابوه': عذابوه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'عذابوه.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عذابوه' AND pashto_word NOT IN ('عذابوه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عذابوه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عذابوه.»';

-- Merge 1 variants of 'راپاڅېدله': راپاڅېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅېدله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راپاڅېدله' AND pashto_word NOT IN ('راپاڅېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅېدله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅېدله.';

-- Merge 1 variants of 'خورجین': خورجین،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خورجین،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خورجین' AND pashto_word NOT IN ('خورجین،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورجین', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خورجین،';

-- Merge 1 variants of 'ځالې': ځالې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځالې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځالې' AND pashto_word NOT IN ('ځالې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځالې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځالې،';

-- Merge 1 variants of 'وسپارم': وسپارم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپارم.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وسپارم' AND pashto_word NOT IN ('وسپارم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسپارم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسپارم.»';

-- Merge 1 variants of 'خویندې': خویندې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خویندې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خویندې' AND pashto_word NOT IN ('خویندې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خویندې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خویندې،';

-- Merge 1 variants of 'کښېنې': کښېنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کښېنې' AND pashto_word NOT IN ('کښېنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنې،';

-- Merge 1 variants of 'راولېږي': راولېږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راولېږي' AND pashto_word NOT IN ('راولېږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږي.»';

-- Merge 2 variants of 'بخښي': بخښي.]», بخښي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بخښي.]»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بخښي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بخښي' AND pashto_word NOT IN ('بخښي.]»','بخښي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بخښي', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بخښي.]»';
DELETE FROM word_frequencies WHERE pashto_word = 'بخښي.';

-- Merge 1 variants of 'تېراوه': تېراوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېراوه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تېراوه' AND pashto_word NOT IN ('تېراوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېراوه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېراوه،';

-- Merge 1 variants of 'یادوي': یادوي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادوي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یادوي' AND pashto_word NOT IN ('یادوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادوي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادوي.»';

-- Merge 1 variants of 'خوځول': خوځول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوځول،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خوځول' AND pashto_word NOT IN ('خوځول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوځول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوځول،';

-- Merge 1 variants of 'راواخیست': راواخیست،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخیست،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راواخیست' AND pashto_word NOT IN ('راواخیست،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخیست', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخیست،';

-- Merge 1 variants of 'ورغلې': ورغلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورغلې' AND pashto_word NOT IN ('ورغلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغلې.';

-- Merge 1 variants of 'راوبولم': راوبولم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوبولم.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوبولم' AND pashto_word NOT IN ('راوبولم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوبولم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوبولم.»';

-- Merge 1 variants of 'جلیل': جلیل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جلیل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جلیل' AND pashto_word NOT IN ('جلیل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جلیل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جلیل،';

-- Merge 1 variants of 'چنده': چنده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چنده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چنده' AND pashto_word NOT IN ('چنده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چنده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چنده،';

-- Merge 1 variants of 'لویږي': لویږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لویږي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لویږي' AND pashto_word NOT IN ('لویږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لویږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لویږي،';

-- Merge 1 variants of 'نیولې': نیولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیولې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نیولې' AND pashto_word NOT IN ('نیولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیولې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیولې،';

-- Merge 1 variants of 'وروړم': وروړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وروړم' AND pashto_word NOT IN ('وروړم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروړم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروړم،';

-- Merge 1 variants of 'وطن': وطن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وطن،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وطن' AND pashto_word NOT IN ('وطن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وطن', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وطن،';

-- Merge 1 variants of 'ماهیان': ماهیان.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماهیان.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ماهیان' AND pashto_word NOT IN ('ماهیان.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماهیان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماهیان.»';

-- Merge 1 variants of 'وینځلې': وینځلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وینځلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وینځلې' AND pashto_word NOT IN ('وینځلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وینځلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وینځلې.';

-- Merge 2 variants of 'موندلې': موندلې،, موندلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'موندلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'موندلې.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'موندلې' AND pashto_word NOT IN ('موندلې،','موندلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موندلې', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موندلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'موندلې.';

-- Merge 1 variants of 'خیالونه': خیالونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خیالونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خیالونه' AND pashto_word NOT IN ('خیالونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خیالونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خیالونه،';

-- Merge 1 variants of 'ووېشلې': ووېشلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووېشلې' AND pashto_word NOT IN ('ووېشلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېشلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشلې،';

-- Merge 1 variants of 'وشرمیږي': وشرمیږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشرمیږي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وشرمیږي' AND pashto_word NOT IN ('وشرمیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشرمیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشرمیږي.»';

-- Merge 1 variants of 'وګڼې': وګڼې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وګڼې' AND pashto_word NOT IN ('وګڼې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګڼې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼې،';

-- Merge 1 variants of 'راوړله': راوړله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوړله' AND pashto_word NOT IN ('راوړله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړله.';

-- Merge 1 variants of 'وڅښم': وڅښم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅښم' AND pashto_word NOT IN ('وڅښم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښم،';

-- Merge 1 variants of 'مرقوس': مرقوس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرقوس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مرقوس' AND pashto_word NOT IN ('مرقوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرقوس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرقوس،';

-- Merge 1 variants of 'عزتمن': عزتمن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزتمن،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عزتمن' AND pashto_word NOT IN ('عزتمن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزتمن', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزتمن،';

-- Merge 1 variants of 'قومونه': قومونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قومونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قومونه' AND pashto_word NOT IN ('قومونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قومونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قومونه،';

-- Merge 1 variants of 'ټوټې': ټوټې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ټوټې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ټوټې' AND pashto_word NOT IN ('ټوټې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ټوټې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ټوټې،';

-- Merge 1 variants of 'لرګیو': لرګیو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرګیو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لرګیو' AND pashto_word NOT IN ('لرګیو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرګیو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرګیو،';

-- Merge 1 variants of 'خوشبویي': خوشبویي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشبویي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خوشبویي' AND pashto_word NOT IN ('خوشبویي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشبویي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشبویي،';

-- Merge 1 variants of 'لاسه': لاسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاسه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لاسه' AND pashto_word NOT IN ('لاسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاسه،';

-- Merge 1 variants of 'مسافران': مسافران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسافران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مسافران' AND pashto_word NOT IN ('مسافران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسافران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسافران،';

-- Merge 1 variants of 'اسمانه': اسمانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسمانه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اسمانه' AND pashto_word NOT IN ('اسمانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسمانه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسمانه،';

-- Merge 1 variants of 'غږوونکو': غږوونکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غږوونکو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غږوونکو' AND pashto_word NOT IN ('غږوونکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غږوونکو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غږوونکو،';

-- Merge 1 variants of 'پاچاهانو': پاچاهانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاچاهانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پاچاهانو' AND pashto_word NOT IN ('پاچاهانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاچاهانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاچاهانو،';

-- Merge 1 variants of 'اوږدوالی': اوږدوالی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوږدوالی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوږدوالی' AND pashto_word NOT IN ('اوږدوالی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوږدوالی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوږدوالی،';

-- Merge 1 variants of 'ځلېدلې': ځلېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلېدلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځلېدلې' AND pashto_word NOT IN ('ځلېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځلېدلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځلېدلې.';

-- Merge 1 variants of 'ځوریږي': ځوریږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوریږي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځوریږي' AND pashto_word NOT IN ('ځوریږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوریږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوریږي،';

-- Merge 1 variants of 'برېښنا': برېښنا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برېښنا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'برېښنا' AND pashto_word NOT IN ('برېښنا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برېښنا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برېښنا،';

-- Merge 1 variants of 'زور': زور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زور' AND pashto_word NOT IN ('زور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زور،';

-- Merge 1 variants of 'وخوځېدله': وخوځېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوځېدله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وخوځېدله' AND pashto_word NOT IN ('وخوځېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوځېدله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوځېدله.';

-- Merge 1 variants of 'واښو': واښو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واښو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'واښو' AND pashto_word NOT IN ('واښو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واښو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واښو،';

-- Merge 1 variants of 'سرې': سرې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سرې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سرې' AND pashto_word NOT IN ('سرې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سرې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سرې،';

-- Merge 1 variants of 'جادوګرۍ': جادوګرۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جادوګرۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جادوګرۍ' AND pashto_word NOT IN ('جادوګرۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جادوګرۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جادوګرۍ،';

-- Merge 1 variants of 'راوپاروم': راوپاروم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوپاروم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوپاروم' AND pashto_word NOT IN ('راوپاروم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوپاروم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوپاروم.';

-- Merge 1 variants of 'بدیو': بدیو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بدیو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بدیو' AND pashto_word NOT IN ('بدیو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بدیو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بدیو،';

-- Merge 1 variants of 'بحثونو': بحثونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بحثونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بحثونو' AND pashto_word NOT IN ('بحثونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بحثونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بحثونو،';

-- Merge 1 variants of 'تقوع': تقوع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تقوع،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تقوع' AND pashto_word NOT IN ('تقوع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تقوع', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تقوع،';

-- Merge 1 variants of 'وساتلې': وساتلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وساتلې' AND pashto_word NOT IN ('وساتلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتلې.';

-- Merge 1 variants of 'یووړلې': یووړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یووړلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یووړلې' AND pashto_word NOT IN ('یووړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یووړلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یووړلې.';

-- Merge 1 variants of 'بلا': بلا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بلا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بلا' AND pashto_word NOT IN ('بلا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بلا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بلا،';

-- Merge 1 variants of 'جګړه': جګړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جګړه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جګړه' AND pashto_word NOT IN ('جګړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جګړه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جګړه،';

-- Merge 1 variants of 'وجنګېدل': وجنګېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وجنګېدل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وجنګېدل' AND pashto_word NOT IN ('وجنګېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وجنګېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وجنګېدل،';

-- Merge 2 variants of 'تښتېدلی': تښتېدلی., تښتېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتېدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتېدلی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تښتېدلی' AND pashto_word NOT IN ('تښتېدلی.','تښتېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتېدلی', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتېدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'تښتېدلی،';

-- Merge 1 variants of 'ولګېدلې': ولګېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګېدلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولګېدلې' AND pashto_word NOT IN ('ولګېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګېدلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګېدلې.';

-- Merge 1 variants of 'اسماعیل': اسماعیل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسماعیل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اسماعیل' AND pashto_word NOT IN ('اسماعیل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسماعیل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسماعیل،';

-- Merge 1 variants of 'خیانت': خیانت!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'خیانت!»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خیانت' AND pashto_word NOT IN ('خیانت!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خیانت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خیانت!»';

-- Merge 1 variants of 'ولیکلې': ولیکلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولیکلې' AND pashto_word NOT IN ('ولیکلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیکلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکلې.';

-- Merge 1 variants of 'ځوان': ځوان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځوان' AND pashto_word NOT IN ('ځوان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوان،';

-- Merge 1 variants of 'پنجې': پنجې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پنجې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پنجې' AND pashto_word NOT IN ('پنجې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پنجې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پنجې.';

-- Merge 1 variants of 'عسکرو': عسکرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عسکرو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عسکرو' AND pashto_word NOT IN ('عسکرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عسکرو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عسکرو،';

-- Merge 2 variants of 'بس': بس., «بس!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'بس.';
DELETE FROM word_verse_mapping WHERE pashto_word = '«بس!»';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بس' AND pashto_word NOT IN ('بس.','«بس!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بس', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بس.';
DELETE FROM word_frequencies WHERE pashto_word = '«بس!»';

-- Merge 1 variants of 'بادار': بادار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادار،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بادار' AND pashto_word NOT IN ('بادار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادار', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادار،';

-- Merge 2 variants of 'ووېروي': ووېروي،, ووېروي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېروي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېروي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ووېروي' AND pashto_word NOT IN ('ووېروي،','ووېروي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېروي', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېروي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېروي.';

-- Merge 1 variants of 'تښتې': تښتې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تښتې' AND pashto_word NOT IN ('تښتې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتې،';

-- Merge 1 variants of 'نیکو': نیکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیکو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نیکو' AND pashto_word NOT IN ('نیکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیکو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیکو،';

-- Merge 1 variants of 'نبوکدنصر': نبوکدنصر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نبوکدنصر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نبوکدنصر' AND pashto_word NOT IN ('نبوکدنصر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نبوکدنصر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نبوکدنصر،';

-- Merge 1 variants of 'قوماندان': قوماندان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قوماندان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قوماندان' AND pashto_word NOT IN ('قوماندان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قوماندان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قوماندان،';

-- Merge 1 variants of 'سرایا': سرایا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سرایا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سرایا' AND pashto_word NOT IN ('سرایا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سرایا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سرایا،';

-- Merge 1 variants of 'راکوله': راکوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راکوله' AND pashto_word NOT IN ('راکوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوله،';

-- Merge 1 variants of 'راوغوښتله': راوغوښتله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغوښتله' AND pashto_word NOT IN ('راوغوښتله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښتله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتله.';

-- Merge 1 variants of 'درکړې': درکړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'درکړې' AND pashto_word NOT IN ('درکړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړې،';

-- Merge 1 variants of 'بسترې': بسترې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بسترې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بسترې' AND pashto_word NOT IN ('بسترې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بسترې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بسترې،';

-- Merge 1 variants of 'مستې': مستې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مستې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مستې' AND pashto_word NOT IN ('مستې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مستې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مستې،';

-- Merge 1 variants of 'حیتي': حیتي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حیتي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حیتي' AND pashto_word NOT IN ('حیتي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حیتي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حیتي.';

-- Merge 1 variants of 'چنګونه': چنګونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چنګونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چنګونه' AND pashto_word NOT IN ('چنګونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چنګونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چنګونه،';

-- Merge 1 variants of 'وټاکلې': وټاکلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وټاکلې' AND pashto_word NOT IN ('وټاکلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وټاکلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکلې.';

-- Merge 1 variants of 'موآبیانو': موآبیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موآبیانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'موآبیانو' AND pashto_word NOT IN ('موآبیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موآبیانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موآبیانو،';
