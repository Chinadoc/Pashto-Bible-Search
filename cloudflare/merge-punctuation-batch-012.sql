
-- Merge 1 variants of 'مری': مری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مری،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'مری' AND pashto_word NOT IN ('مری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مری', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مری،';

-- Merge 1 variants of 'متی': متی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'متی،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'متی' AND pashto_word NOT IN ('متی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('متی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'متی،';

-- Merge 1 variants of 'راواړوی': راواړوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواړوی.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راواړوی' AND pashto_word NOT IN ('راواړوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواړوی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواړوی.';

-- Merge 2 variants of 'وئیلی': وئیلی., وئیلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وئیلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وئیلی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وئیلی' AND pashto_word NOT IN ('وئیلی.','وئیلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وئیلی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وئیلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وئیلی،';

-- Merge 1 variants of 'بانی': بانی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بانی،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'بانی' AND pashto_word NOT IN ('بانی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بانی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بانی،';

-- Merge 1 variants of 'وخېژی': وخېژی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژی،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخېژی' AND pashto_word NOT IN ('وخېژی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژی،';

-- Merge 3 variants of 'ورسوی': ورسوی،, ورسوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوی.»';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ورسوی' AND pashto_word NOT IN ('ورسوی،','ورسوی.','ورسوی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوی', 17);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوی.»';

-- Merge 2 variants of 'ودرېدلی': ودرېدلی., ودرېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ودرېدلی' AND pashto_word NOT IN ('ودرېدلی.','ودرېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدلی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلی،';

-- Merge 1 variants of 'راوځی': راوځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوځی.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راوځی' AND pashto_word NOT IN ('راوځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوځی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوځی.';

-- Merge 1 variants of 'وسوزوی': وسوزوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوی.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وسوزوی' AND pashto_word NOT IN ('وسوزوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوی.';

-- Merge 1 variants of 'سخی': سخی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سخی،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'سخی' AND pashto_word NOT IN ('سخی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سخی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سخی،';

-- Merge 2 variants of 'واوړی': واوړی،, واوړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړی.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'واوړی' AND pashto_word NOT IN ('واوړی،','واوړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوړی', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'واوړی.';

-- Merge 1 variants of 'ولیکی': ولیکی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکی.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ولیکی' AND pashto_word NOT IN ('ولیکی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیکی', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکی.';

-- Merge 1 variants of 'شکه': شکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شکه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شکه' AND pashto_word NOT IN ('شکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شکه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شکه،';

-- Merge 1 variants of 'میکاییل': میکاییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'میکاییل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'میکاییل' AND pashto_word NOT IN ('میکاییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('میکاییل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'میکاییل،';

-- Merge 1 variants of 'ایتان': ایتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ایتان،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ایتان' AND pashto_word NOT IN ('ایتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ایتان', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ایتان،';

-- Merge 2 variants of 'وساتي': وساتي،, وساتي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتي.»';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وساتي' AND pashto_word NOT IN ('وساتي،','وساتي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتي', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتي.»';

-- Merge 1 variants of 'فضل': فضل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فضل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'فضل' AND pashto_word NOT IN ('فضل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فضل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فضل،';

-- Merge 1 variants of 'وساتې': وساتې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وساتې' AND pashto_word NOT IN ('وساتې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتې.';

-- Merge 1 variants of 'ودرېږو': ودرېږو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ودرېږو' AND pashto_word NOT IN ('ودرېږو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېږو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږو.';

-- Merge 3 variants of 'پېژنې': پېژنې., پېژنې.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنې.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنې،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'پېژنې' AND pashto_word NOT IN ('پېژنې.','پېژنې.»','پېژنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژنې', 14);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنې.';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنې.»';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنې،';

-- Merge 2 variants of 'نومېده': نومېده،, نومېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نومېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نومېده.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'نومېده' AND pashto_word NOT IN ('نومېده،','نومېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نومېده', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نومېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'نومېده.';

-- Merge 1 variants of 'ووراوه': ووراوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووراوه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ووراوه' AND pashto_word NOT IN ('ووراوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووراوه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووراوه،';

-- Merge 2 variants of 'راشي': راشي.», راشي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راشي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راشي!»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راشي' AND pashto_word NOT IN ('راشي.»','راشي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشي', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راشي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'راشي!»';

-- Merge 2 variants of 'راووتلې': راووتلې., راووتلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راووتلې' AND pashto_word NOT IN ('راووتلې.','راووتلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتلې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلې،';

-- Merge 1 variants of 'خورو': خورو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خورو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خورو' AND pashto_word NOT IN ('خورو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خورو.';

-- Merge 2 variants of 'پرېښود': پرېښود., پرېښود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښود.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښود،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پرېښود' AND pashto_word NOT IN ('پرېښود.','پرېښود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښود', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښود.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښود،';

-- Merge 3 variants of 'ځو': ځو،, ځو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځو.»';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ځو' AND pashto_word NOT IN ('ځو،','ځو.','ځو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځو', 13);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ځو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځو.»';

-- Merge 2 variants of 'وسپارل': وسپارل., وسپارل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپارل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپارل،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وسپارل' AND pashto_word NOT IN ('وسپارل.','وسپارل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسپارل', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسپارل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسپارل،';

-- Merge 2 variants of 'کېدلو': کېدلو., کېدلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'کېدلو' AND pashto_word NOT IN ('کېدلو.','کېدلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدلو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلو،';

-- Merge 2 variants of 'ویله': ویله., ویله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ویله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ویله' AND pashto_word NOT IN ('ویله.','ویله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ویله،';

-- Merge 1 variants of 'وساتل': وساتل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتل.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وساتل' AND pashto_word NOT IN ('وساتل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتل.';

-- Merge 2 variants of 'وښودلې': وښودلې., وښودلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودلې،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وښودلې' AND pashto_word NOT IN ('وښودلې.','وښودلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښودلې', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښودلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښودلې،';

-- Merge 1 variants of 'ولویږي': ولویږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولویږي.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ولویږي' AND pashto_word NOT IN ('ولویږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولویږي', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولویږي.';

-- Merge 1 variants of 'ځلېده': ځلېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلېده.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ځلېده' AND pashto_word NOT IN ('ځلېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځلېده', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځلېده.';

-- Merge 2 variants of 'ښکاري': ښکاري،, ښکاري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکاري،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکاري.»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ښکاري' AND pashto_word NOT IN ('ښکاري،','ښکاري.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکاري', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکاري،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښکاري.»';

-- Merge 2 variants of 'راکړي': راکړي،, راکړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړي.»';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'راکړي' AND pashto_word NOT IN ('راکړي،','راکړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړي', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړي،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړي.»';

-- Merge 2 variants of 'راولېږه': راولېږه،, راولېږه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږه.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راولېږه' AND pashto_word NOT IN ('راولېږه،','راولېږه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږه.';

-- Merge 1 variants of 'بچیانو': بچیانو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'بچیانو!';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'بچیانو' AND pashto_word NOT IN ('بچیانو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بچیانو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بچیانو!';

-- Merge 1 variants of 'قربانۍ': قربانۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قربانۍ،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'قربانۍ' AND pashto_word NOT IN ('قربانۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قربانۍ', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قربانۍ،';

-- Merge 2 variants of 'اخلم': اخلم., اخلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلم،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اخلم' AND pashto_word NOT IN ('اخلم.','اخلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلم', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'اخلم،';

-- Merge 1 variants of 'لټوي': لټوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوي،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'لټوي' AND pashto_word NOT IN ('لټوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټوي', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټوي،';

-- Merge 1 variants of 'ویني': ویني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویني،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ویني' AND pashto_word NOT IN ('ویني،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویني', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویني،';

-- Merge 1 variants of 'راځم': راځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راځم.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راځم' AND pashto_word NOT IN ('راځم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راځم.';

-- Merge 2 variants of 'پېښیږي': پېښیږي،, پېښیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېښیږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېښیږي.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'پېښیږي' AND pashto_word NOT IN ('پېښیږي،','پېښیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېښیږي', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېښیږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېښیږي.';

-- Merge 1 variants of 'راټولیږي': راټولیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولیږي،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راټولیږي' AND pashto_word NOT IN ('راټولیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راټولیږي', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راټولیږي،';

-- Merge 2 variants of 'اخلې': اخلې., اخلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلې،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'اخلې' AND pashto_word NOT IN ('اخلې.','اخلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلې', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'اخلې،';

-- Merge 2 variants of 'راکړل': راکړل،, راکړل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړل.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'راکړل' AND pashto_word NOT IN ('راکړل،','راکړل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړل', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړل،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړل.';

-- Merge 2 variants of 'اوسېږې': اوسېږې،, اوسېږې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږې.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'اوسېږې' AND pashto_word NOT IN ('اوسېږې،','اوسېږې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږې', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږې،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږې.';

-- Merge 1 variants of 'وسپاره': وسپاره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپاره.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وسپاره' AND pashto_word NOT IN ('وسپاره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسپاره', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسپاره.';

-- Merge 1 variants of 'شړم': شړم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شړم.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شړم' AND pashto_word NOT IN ('شړم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شړم.';

-- Merge 1 variants of 'رحم': رحم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رحم،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'رحم' AND pashto_word NOT IN ('رحم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رحم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رحم،';

-- Merge 1 variants of 'جلال': جلال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جلال،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جلال' AND pashto_word NOT IN ('جلال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جلال', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جلال،';

-- Merge 1 variants of 'راوګرځي': راوګرځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځي.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راوګرځي' AND pashto_word NOT IN ('راوګرځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځي', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځي.';

-- Merge 3 variants of 'خوره': خوره،, خوره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوره.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوره.»';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'خوره' AND pashto_word NOT IN ('خوره،','خوره.','خوره.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوره', 11);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'خوره.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوره.»';

-- Merge 2 variants of 'راواخله': راواخله،, راواخله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخله.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راواخله' AND pashto_word NOT IN ('راواخله،','راواخله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخله،';
DELETE FROM word_frequencies WHERE pashto_word = 'راواخله.';

-- Merge 1 variants of 'وګوري': وګوري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوري،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وګوري' AND pashto_word NOT IN ('وګوري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګوري', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګوري،';

-- Merge 2 variants of 'کېږدې': کېږدې., کېږدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدې،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کېږدې' AND pashto_word NOT IN ('کېږدې.','کېږدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدې', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدې،';

-- Merge 1 variants of 'وازمایي': وازمایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وازمایي،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وازمایي' AND pashto_word NOT IN ('وازمایي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وازمایي', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وازمایي،';

-- Merge 2 variants of 'ووېشل': ووېشل., ووېشل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشل،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ووېشل' AND pashto_word NOT IN ('ووېشل.','ووېشل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېشل', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشل،';

-- Merge 1 variants of 'وخوړ': وخوړ.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړ.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وخوړ' AND pashto_word NOT IN ('وخوړ.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړ', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړ.';

-- Merge 1 variants of 'روغول': روغول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'روغول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'روغول' AND pashto_word NOT IN ('روغول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روغول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روغول.';

-- Merge 1 variants of 'راکوه': راکوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوه.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راکوه' AND pashto_word NOT IN ('راکوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوه.';

-- Merge 1 variants of 'کښېنول': کښېنول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کښېنول' AND pashto_word NOT IN ('کښېنول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنول.';

-- Merge 1 variants of 'وتښتېده': وتښتېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېده.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وتښتېده' AND pashto_word NOT IN ('وتښتېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتېده', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېده.';

-- Merge 1 variants of 'ورېدل': ورېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورېدل.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ورېدل' AND pashto_word NOT IN ('ورېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورېدل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورېدل.';

-- Merge 1 variants of 'وغورځول': وغورځول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورځول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وغورځول' AND pashto_word NOT IN ('وغورځول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورځول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورځول.';

-- Merge 2 variants of 'ځه': ځه., ځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځه،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ځه' AND pashto_word NOT IN ('ځه.','ځه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځه', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځه،';

-- Merge 1 variants of 'وګټلې': وګټلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګټلې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وګټلې' AND pashto_word NOT IN ('وګټلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګټلې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګټلې.';

-- Merge 1 variants of 'اخله': اخله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخله.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اخله' AND pashto_word NOT IN ('اخله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخله', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخله.';

-- Merge 2 variants of 'راشې': راشې., راشې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راشې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راشې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'راشې' AND pashto_word NOT IN ('راشې.','راشې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راشې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راشې،';

-- Merge 1 variants of 'وشمېره': وشمېره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشمېره.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وشمېره' AND pashto_word NOT IN ('وشمېره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشمېره', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشمېره.';

-- Merge 1 variants of 'خلاصون': خلاصون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلاصون،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خلاصون' AND pashto_word NOT IN ('خلاصون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلاصون', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلاصون،';

-- Merge 2 variants of 'کښېناستم': کښېناستم., کښېناستم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستم،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کښېناستم' AND pashto_word NOT IN ('کښېناستم.','کښېناستم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناستم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستم.';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستم،';

-- Merge 2 variants of 'اور': اور،, اور.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اور،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اور.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'اور' AND pashto_word NOT IN ('اور،','اور.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اور', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اور،';
DELETE FROM word_frequencies WHERE pashto_word = 'اور.';

-- Merge 1 variants of 'لمنې': لمنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لمنې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'لمنې' AND pashto_word NOT IN ('لمنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لمنې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لمنې،';

-- Merge 1 variants of 'عدولام': عدولام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عدولام،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عدولام' AND pashto_word NOT IN ('عدولام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عدولام', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عدولام،';

-- Merge 2 variants of 'راوپاروله': راوپاروله., راوپاروله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوپاروله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوپاروله،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'راوپاروله' AND pashto_word NOT IN ('راوپاروله.','راوپاروله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوپاروله', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوپاروله.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوپاروله،';

-- Merge 1 variants of 'ووژله': ووژله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژله.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ووژله' AND pashto_word NOT IN ('ووژله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژله', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژله.';

-- Merge 1 variants of 'تېلو': تېلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'تېلو' AND pashto_word NOT IN ('تېلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېلو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېلو،';

-- Merge 1 variants of 'غږول': غږول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غږول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'غږول' AND pashto_word NOT IN ('غږول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غږول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غږول.';

-- Merge 2 variants of 'وشکول': وشکول،, وشکول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشکول،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشکول.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وشکول' AND pashto_word NOT IN ('وشکول،','وشکول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشکول', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشکول،';
DELETE FROM word_frequencies WHERE pashto_word = 'وشکول.';

-- Merge 3 variants of 'وژغوره': وژغوره،, وژغوره.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوره.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوره.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وژغوره' AND pashto_word NOT IN ('وژغوره،','وژغوره.»','وژغوره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژغوره', 14);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوره.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوره.';

-- Merge 2 variants of 'ستنې': ستنې،, ستنې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ستنې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ستنې.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ستنې' AND pashto_word NOT IN ('ستنې،','ستنې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ستنې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ستنې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ستنې.';

-- Merge 2 variants of 'اعلیحضرته': اعلیحضرته،, اعلیحضرته!

DELETE FROM word_verse_mapping WHERE pashto_word = 'اعلیحضرته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اعلیحضرته!';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اعلیحضرته' AND pashto_word NOT IN ('اعلیحضرته،','اعلیحضرته!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اعلیحضرته', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اعلیحضرته،';
DELETE FROM word_frequencies WHERE pashto_word = 'اعلیحضرته!';

-- Merge 2 variants of 'څمله': څمله., څمله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څمله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څمله،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'څمله' AND pashto_word NOT IN ('څمله.','څمله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څمله', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څمله.';
DELETE FROM word_frequencies WHERE pashto_word = 'څمله،';

-- Merge 1 variants of 'ننوځى': ننوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوځى،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ننوځى' AND pashto_word NOT IN ('ننوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوځى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوځى،';

-- Merge 1 variants of 'ميشک': ميشک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميشک،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ميشک' AND pashto_word NOT IN ('ميشک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميشک', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميشک،';

-- Merge 1 variants of 'مشر': مشر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشر،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'مشر' AND pashto_word NOT IN ('مشر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشر', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشر،';

-- Merge 1 variants of 'څرګندوى': څرګندوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څرګندوى،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'څرګندوى' AND pashto_word NOT IN ('څرګندوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څرګندوى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څرګندوى،';

-- Merge 1 variants of 'اوسپنې': اوسپنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسپنې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اوسپنې' AND pashto_word NOT IN ('اوسپنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسپنې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسپنې،';

-- Merge 1 variants of 'زېړ': زېړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زېړ،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'زېړ' AND pashto_word NOT IN ('زېړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زېړ', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زېړ،';

-- Merge 1 variants of 'وروغورزول': وروغورزول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروغورزول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وروغورزول' AND pashto_word NOT IN ('وروغورزول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروغورزول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروغورزول.';

-- Merge 1 variants of 'وغورزول': وغورزول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزول.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وغورزول' AND pashto_word NOT IN ('وغورزول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزول.';

-- Merge 1 variants of 'ويرولم': ويرولم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويرولم.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ويرولم' AND pashto_word NOT IN ('ويرولم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويرولم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويرولم.';

-- Merge 1 variants of 'عقل': عقل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عقل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عقل' AND pashto_word NOT IN ('عقل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عقل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عقل،';

-- Merge 1 variants of 'ختلې': ختلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ختلې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ختلې' AND pashto_word NOT IN ('ختلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ختلې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ختلې.';

-- Merge 1 variants of 'ودرېدلې': ودرېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ودرېدلې' AND pashto_word NOT IN ('ودرېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدلې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلې.';

-- Merge 2 variants of 'درکړل': درکړل., درکړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړل،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'درکړل' AND pashto_word NOT IN ('درکړل.','درکړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړل', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړل،';

-- Merge 1 variants of 'غواګانو': غواګانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواګانو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'غواګانو' AND pashto_word NOT IN ('غواګانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواګانو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواګانو،';

-- Merge 1 variants of 'شمعون': شمعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمعون،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شمعون' AND pashto_word NOT IN ('شمعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمعون', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمعون،';

-- Merge 2 variants of 'ووهل': ووهل،, ووهل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهل.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ووهل' AND pashto_word NOT IN ('ووهل،','ووهل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهل', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهل.';

-- Merge 1 variants of 'نوح': نوح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نوح،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'نوح' AND pashto_word NOT IN ('نوح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نوح', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نوح،';
