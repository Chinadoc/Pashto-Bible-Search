
-- Merge 2 variants of 'وخوړله': وخوړله., وخوړله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړله،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وخوړله' AND pashto_word NOT IN ('وخوړله.','وخوړله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړله', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړله،';

-- Merge 2 variants of 'وخوړه': وخوړه., وخوړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړه،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'وخوړه' AND pashto_word NOT IN ('وخوړه.','وخوړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړه', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړه،';

-- Merge 3 variants of 'ودرېږه': ودرېږه،, ودرېږه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږه.»';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'ودرېږه' AND pashto_word NOT IN ('ودرېږه،','ودرېږه.','ودرېږه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېږه', 25);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږه.»';

-- Merge 1 variants of 'منى': منى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منى،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'منى' AND pashto_word NOT IN ('منى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منى', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منى،';

-- Merge 1 variants of 'ماشومان': ماشومان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماشومان،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ماشومان' AND pashto_word NOT IN ('ماشومان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماشومان', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماشومان،';

-- Merge 1 variants of 'آمین': آمین!

DELETE FROM word_verse_mapping WHERE pashto_word = 'آمین!';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'آمین' AND pashto_word NOT IN ('آمین!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آمین', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آمین!';

-- Merge 2 variants of 'ورسوى': ورسوى., ورسوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوى،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ورسوى' AND pashto_word NOT IN ('ورسوى.','ورسوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوى', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوى،';

-- Merge 2 variants of 'استعمالوى': استعمالوى., استعمالوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالوى،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'استعمالوى' AND pashto_word NOT IN ('استعمالوى.','استعمالوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعمالوى', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالوى،';

-- Merge 2 variants of 'وشړم': وشړم،, وشړم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړم.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'وشړم' AND pashto_word NOT IN ('وشړم،','وشړم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړم', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وشړم.';

-- Merge 1 variants of 'زمکه': زمکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زمکه،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'زمکه' AND pashto_word NOT IN ('زمکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زمکه', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زمکه،';

-- Merge 2 variants of 'راوړې': راوړې., راوړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړې،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'راوړې' AND pashto_word NOT IN ('راوړې.','راوړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړې', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړې،';

-- Merge 2 variants of 'وونه': وونه،, وونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وونه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وونه.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وونه' AND pashto_word NOT IN ('وونه،','وونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وونه', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وونه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وونه.';

-- Merge 1 variants of 'مرى': مرى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرى.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'مرى' AND pashto_word NOT IN ('مرى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرى', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرى.';

-- Merge 1 variants of 'وځى': وځى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځى.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وځى' AND pashto_word NOT IN ('وځى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځى', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځى.';

-- Merge 2 variants of 'راورسېدو': راورسېدو،, راورسېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېدو.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'راورسېدو' AND pashto_word NOT IN ('راورسېدو،','راورسېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسېدو', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېدو.';

-- Merge 1 variants of 'کنعانیانو': کنعانیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنعانیانو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'کنعانیانو' AND pashto_word NOT IN ('کنعانیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنعانیانو', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنعانیانو،';

-- Merge 3 variants of 'وایې': وایې،, وایې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وایې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایې.»';

-- Sum frequencies from all variants: 33 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 33
WHERE pashto_word = 'وایې' AND pashto_word NOT IN ('وایې،','وایې.','وایې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایې', 33);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وایې،';
DELETE FROM word_frequencies WHERE pashto_word = 'وایې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وایې.»';

-- Merge 1 variants of 'می': می،

DELETE FROM word_verse_mapping WHERE pashto_word = 'می،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'می' AND pashto_word NOT IN ('می،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('می', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'می،';

-- Merge 1 variants of 'ووځی': ووځی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووځی،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ووځی' AND pashto_word NOT IN ('ووځی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووځی', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووځی،';

-- Merge 2 variants of 'ورځی': ورځی،, ورځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځی.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ورځی' AND pashto_word NOT IN ('ورځی،','ورځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځی', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورځی.';

-- Merge 2 variants of 'ورشی': ورشی،, ورشی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشی.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ورشی' AND pashto_word NOT IN ('ورشی،','ورشی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورشی', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورشی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورشی.';

-- Merge 2 variants of 'اوری': اوری،, اوری.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوری.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'اوری' AND pashto_word NOT IN ('اوری،','اوری.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوری', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوری،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوری.';

-- Merge 2 variants of 'نيسی': نيسی،, نيسی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيسی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نيسی.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'نيسی' AND pashto_word NOT IN ('نيسی،','نيسی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيسی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيسی،';
DELETE FROM word_frequencies WHERE pashto_word = 'نيسی.';

-- Merge 2 variants of 'وویيله': وویيله., وویيله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویيله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وویيله،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'وویيله' AND pashto_word NOT IN ('وویيله.','وویيله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویيله', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویيله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وویيله،';

-- Merge 2 variants of 'مني': مني،, مني.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'مني،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مني.»';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'مني' AND pashto_word NOT IN ('مني،','مني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مني', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مني،';
DELETE FROM word_frequencies WHERE pashto_word = 'مني.»';

-- Merge 1 variants of 'قدرت': قدرت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قدرت،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'قدرت' AND pashto_word NOT IN ('قدرت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قدرت', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قدرت،';

-- Merge 3 variants of 'پېژنم': پېژنم،, پېژنم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنم.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'پېژنم' AND pashto_word NOT IN ('پېژنم،','پېژنم.»','پېژنم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژنم', 24);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنم،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنم.';

-- Merge 1 variants of 'ځناور': ځناور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځناور،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ځناور' AND pashto_word NOT IN ('ځناور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځناور', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځناور،';

-- Merge 2 variants of 'تېرېده': تېرېده،, تېرېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېده.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'تېرېده' AND pashto_word NOT IN ('تېرېده،','تېرېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرېده', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېده.';

-- Merge 2 variants of 'خوړله': خوړله., خوړله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړله،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'خوړله' AND pashto_word NOT IN ('خوړله.','خوړله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوړله', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوړله.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوړله،';

-- Merge 1 variants of 'بوته': بوته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوته.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'بوته' AND pashto_word NOT IN ('بوته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوته', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوته.';

-- Merge 2 variants of 'وغواړي': وغواړي،, وغواړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړي.»';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وغواړي' AND pashto_word NOT IN ('وغواړي،','وغواړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړي', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړي.»';

-- Merge 1 variants of 'اوري': اوري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوري،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'اوري' AND pashto_word NOT IN ('اوري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوري', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوري،';

-- Merge 2 variants of 'ننوځي': ننوځي،, ننوځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوځي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوځي.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ننوځي' AND pashto_word NOT IN ('ننوځي،','ننوځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوځي', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوځي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ننوځي.';

-- Merge 2 variants of 'ورور': ورور،, ورور.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورور،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورور.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ورور' AND pashto_word NOT IN ('ورور،','ورور.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورور', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورور،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورور.';

-- Merge 2 variants of 'واوري': واوري،, واوري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوري،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوري.»';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'واوري' AND pashto_word NOT IN ('واوري،','واوري.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوري', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوري،';
DELETE FROM word_frequencies WHERE pashto_word = 'واوري.»';

-- Merge 1 variants of 'ځې': ځې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ځې' AND pashto_word NOT IN ('ځې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځې', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځې،';

-- Merge 3 variants of 'خورې': خورې،, خورې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خورې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خورې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خورې.»';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'خورې' AND pashto_word NOT IN ('خورې،','خورې.','خورې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورې', 25);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خورې،';
DELETE FROM word_frequencies WHERE pashto_word = 'خورې.';
DELETE FROM word_frequencies WHERE pashto_word = 'خورې.»';

-- Merge 2 variants of 'ورولېږه': ورولېږه., ورولېږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږه،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ورولېږه' AND pashto_word NOT IN ('ورولېږه.','ورولېږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولېږه', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږه،';

-- Merge 2 variants of 'ووهله': ووهله،, ووهله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهله.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ووهله' AND pashto_word NOT IN ('ووهله،','ووهله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهله', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهله،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهله.';

-- Merge 1 variants of 'پسونه': پسونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پسونه،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'پسونه' AND pashto_word NOT IN ('پسونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پسونه', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پسونه،';

-- Merge 1 variants of 'اوربشې': اوربشې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوربشې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'اوربشې' AND pashto_word NOT IN ('اوربشې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوربشې', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوربشې،';

-- Merge 1 variants of 'ادوم': ادوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ادوم،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ادوم' AND pashto_word NOT IN ('ادوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ادوم', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ادوم،';

-- Merge 2 variants of 'وښودله': وښودله., وښودله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودله،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'وښودله' AND pashto_word NOT IN ('وښودله.','وښودله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښودله', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښودله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښودله،';

-- Merge 2 variants of 'حننياه': حننياه،, حننياه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حننياه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'حننياه.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'حننياه' AND pashto_word NOT IN ('حننياه،','حننياه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حننياه', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حننياه،';
DELETE FROM word_frequencies WHERE pashto_word = 'حننياه.';

-- Merge 1 variants of 'اوسپنه': اوسپنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسپنه،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'اوسپنه' AND pashto_word NOT IN ('اوسپنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسپنه', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسپنه،';

-- Merge 2 variants of 'ژړل': ژړل., ژړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ژړل،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ژړل' AND pashto_word NOT IN ('ژړل.','ژړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژړل', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ژړل،';

-- Merge 2 variants of 'وګرځوم': وګرځوم., وګرځوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځوم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وګرځوم' AND pashto_word NOT IN ('وګرځوم.','وګرځوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځوم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځوم،';

-- Merge 2 variants of 'واخلې': واخلې., واخلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلې،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'واخلې' AND pashto_word NOT IN ('واخلې.','واخلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلې', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخلې،';

-- Merge 1 variants of 'علاقې': علاقې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'علاقې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'علاقې' AND pashto_word NOT IN ('علاقې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('علاقې', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'علاقې،';

-- Merge 1 variants of 'واورى': واورى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'واورى' AND pashto_word NOT IN ('واورى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورى', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورى،';

-- Merge 1 variants of 'اولاده': اولاده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اولاده،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'اولاده' AND pashto_word NOT IN ('اولاده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اولاده', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اولاده،';

-- Merge 2 variants of 'وليکه': وليکه., وليکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليکه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وليکه،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'وليکه' AND pashto_word NOT IN ('وليکه.','وليکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليکه', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليکه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وليکه،';

-- Merge 1 variants of 'راوغورزوى': راوغورزوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزوى.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'راوغورزوى' AND pashto_word NOT IN ('راوغورزوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزوى', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزوى.';

-- Merge 2 variants of 'وشړى': وشړى., وشړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړى،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وشړى' AND pashto_word NOT IN ('وشړى.','وشړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړى', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړى.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشړى،';

-- Merge 2 variants of 'ولګوله': ولګوله., ولګوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوله،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ولګوله' AND pashto_word NOT IN ('ولګوله.','ولګوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوله', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوله،';

-- Merge 1 variants of 'ووژنى': ووژنى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ووژنى' AND pashto_word NOT IN ('ووژنى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنى', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنى،';

-- Merge 1 variants of 'ماتوى': ماتوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماتوى.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ماتوى' AND pashto_word NOT IN ('ماتوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماتوى', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماتوى.';

-- Merge 2 variants of 'ويرېدل': ويرېدل., ويرېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويرېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ويرېدل،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ويرېدل' AND pashto_word NOT IN ('ويرېدل.','ويرېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويرېدل', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويرېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ويرېدل،';

-- Merge 2 variants of 'واخستل': واخستل., واخستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستل،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'واخستل' AND pashto_word NOT IN ('واخستل.','واخستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخستل', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخستل.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخستل،';

-- Merge 1 variants of 'معسياه': معسياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معسياه،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'معسياه' AND pashto_word NOT IN ('معسياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معسياه', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معسياه،';

-- Merge 3 variants of 'لیدلی': لیدلی., لیدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدلی.»';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'لیدلی' AND pashto_word NOT IN ('لیدلی.','لیدلی،','لیدلی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیدلی', 22);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'لیدلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'لیدلی.»';

-- Merge 1 variants of 'یوحنا': یوحنا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوحنا،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'یوحنا' AND pashto_word NOT IN ('یوحنا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوحنا', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوحنا،';

-- Merge 1 variants of 'لیکم': لیکم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیکم.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'لیکم' AND pashto_word NOT IN ('لیکم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیکم', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیکم.';

-- Merge 2 variants of 'ولیدلې': ولیدلې., ولیدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدلې،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ولیدلې' AND pashto_word NOT IN ('ولیدلې.','ولیدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیدلې', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدلې،';

-- Merge 1 variants of 'کوونکی': کوونکی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوونکی،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'کوونکی' AND pashto_word NOT IN ('کوونکی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوونکی', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوونکی،';

-- Merge 2 variants of 'وشیندله': وشیندله., وشیندله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشیندله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشیندله،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وشیندله' AND pashto_word NOT IN ('وشیندله.','وشیندله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشیندله', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشیندله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشیندله،';

-- Merge 2 variants of 'راورسیږی': راورسیږی،, راورسیږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسیږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسیږی.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'راورسیږی' AND pashto_word NOT IN ('راورسیږی،','راورسیږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسیږی', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راورسیږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راورسیږی.';

-- Merge 1 variants of 'غوَیی': غوَیی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوَیی،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'غوَیی' AND pashto_word NOT IN ('غوَیی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوَیی', 11);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوَیی،';

-- Merge 3 variants of 'ودرېږی': ودرېږی،, ودرېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېږی!';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ودرېږی' AND pashto_word NOT IN ('ودرېږی،','ودرېږی.','ودرېږی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېږی', 21);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېږی!';

-- Merge 2 variants of 'ښایى': ښایى،, ښایى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښایى.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ښایى' AND pashto_word NOT IN ('ښایى،','ښایى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښایى', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښایى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښایى.';

-- Merge 2 variants of 'راوويستلی': راوويستلی., راوويستلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستلی،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'راوويستلی' AND pashto_word NOT IN ('راوويستلی.','راوويستلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستلی', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستلی،';

-- Merge 1 variants of 'یزهار': یزهار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یزهار،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'یزهار' AND pashto_word NOT IN ('یزهار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یزهار', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یزهار،';

-- Merge 1 variants of 'اخیطوب': اخیطوب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخیطوب،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اخیطوب' AND pashto_word NOT IN ('اخیطوب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخیطوب', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخیطوب،';

-- Merge 3 variants of 'راکوي': راکوي،, راکوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوي.»';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'راکوي' AND pashto_word NOT IN ('راکوي،','راکوي.','راکوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوي', 19);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوي،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکوي.»';

-- Merge 2 variants of 'لرې': لرې،, لرې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرې.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'لرې' AND pashto_word NOT IN ('لرې،','لرې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرې', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرې،';
DELETE FROM word_frequencies WHERE pashto_word = 'لرې.';

-- Merge 2 variants of 'راوړه': راوړه., راوړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړه،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'راوړه' AND pashto_word NOT IN ('راوړه.','راوړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړه', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړه،';

-- Merge 1 variants of 'وسوځول': وسوځول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځول.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وسوځول' AND pashto_word NOT IN ('وسوځول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځول', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځول.';

-- Merge 1 variants of 'یعقوب': یعقوب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یعقوب،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'یعقوب' AND pashto_word NOT IN ('یعقوب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یعقوب', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یعقوب،';

-- Merge 2 variants of 'واخیست': واخیست., واخیست،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیست.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخیست،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'واخیست' AND pashto_word NOT IN ('واخیست.','واخیست،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخیست', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخیست.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخیست،';

-- Merge 2 variants of 'ورکولې': ورکولې., ورکولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولې،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ورکولې' AND pashto_word NOT IN ('ورکولې.','ورکولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکولې', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولې،';

-- Merge 2 variants of 'راورسېد': راورسېد،, راورسېد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېد،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېد.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راورسېد' AND pashto_word NOT IN ('راورسېد،','راورسېد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسېد', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېد،';
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېد.';

-- Merge 2 variants of 'خدای': خدای،, خدای.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خدای،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خدای.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'خدای' AND pashto_word NOT IN ('خدای،','خدای.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدای', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خدای،';
DELETE FROM word_frequencies WHERE pashto_word = 'خدای.';

-- Merge 3 variants of 'پېژني': پېژني., پېژني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژني.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژني،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژني.»';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'پېژني' AND pashto_word NOT IN ('پېژني.','پېژني،','پېژني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژني', 17);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژني.';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژني،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژني.»';

-- Merge 1 variants of 'راوړي': راوړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړي.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راوړي' AND pashto_word NOT IN ('راوړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړي', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړي.»';

-- Merge 1 variants of 'شمعونه': شمعونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمعونه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'شمعونه' AND pashto_word NOT IN ('شمعونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمعونه', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمعونه،';

-- Merge 1 variants of 'خوري': خوري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوري.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'خوري' AND pashto_word NOT IN ('خوري.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوري', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوري.»';

-- Merge 2 variants of 'راوځي': راوځي., راوځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوځي،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'راوځي' AND pashto_word NOT IN ('راوځي.','راوځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوځي', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوځي،';

-- Merge 2 variants of 'ودرېدله': ودرېدله., ودرېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدله،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ودرېدله' AND pashto_word NOT IN ('ودرېدله.','ودرېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدله', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدله،';

-- Merge 2 variants of 'پرېوتل': پرېوتل., پرېوتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتل،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'پرېوتل' AND pashto_word NOT IN ('پرېوتل.','پرېوتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوتل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتل،';

-- Merge 2 variants of 'وساتم': وساتم،, وساتم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتم.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'وساتم' AND pashto_word NOT IN ('وساتم،','وساتم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتم', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتم.';

-- Merge 3 variants of 'راشم': راشم،, راشم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راشم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راشم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راشم.»';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راشم' AND pashto_word NOT IN ('راشم،','راشم.','راشم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشم', 15);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راشم،';
DELETE FROM word_frequencies WHERE pashto_word = 'راشم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راشم.»';

-- Merge 1 variants of 'پردې': پردې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پردې،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'پردې' AND pashto_word NOT IN ('پردې،');
