
-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'وګڼی' AND pashto_word NOT IN ('وګڼی.','وګڼی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګڼی', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼی،';

-- Merge 3 variants of 'ولری': ولری., ولری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولری.»';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'ولری' AND pashto_word NOT IN ('ولری.','ولری،','ولری.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولری', 32);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولری.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولری،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولری.»';

-- Merge 1 variants of 'اېل': اېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اېل،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'اېل' AND pashto_word NOT IN ('اېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اېل', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اېل،';

-- Merge 2 variants of 'راتلل': راتلل., راتلل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلل،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'راتلل' AND pashto_word NOT IN ('راتلل.','راتلل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتلل', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتلل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راتلل،';

-- Merge 2 variants of 'کتل': کتل،, کتل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کتل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کتل.';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'کتل' AND pashto_word NOT IN ('کتل،','کتل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کتل', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کتل،';
DELETE FROM word_frequencies WHERE pashto_word = 'کتل.';

-- Merge 1 variants of 'دي.›': دي.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'دي.›»';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'دي.›' AND pashto_word NOT IN ('دي.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دي.›', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دي.›»';

-- Merge 1 variants of 'قوم': قوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قوم،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'قوم' AND pashto_word NOT IN ('قوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قوم', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قوم،';

-- Merge 2 variants of 'ښاغلیه': «ښاغلیه،, ښاغلیه،

DELETE FROM word_verse_mapping WHERE pashto_word = '«ښاغلیه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښاغلیه،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'ښاغلیه' AND pashto_word NOT IN ('«ښاغلیه،','ښاغلیه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښاغلیه', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '«ښاغلیه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښاغلیه،';

-- Merge 4 variants of 'لرم': لرم., لرم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرم!';

-- Sum frequencies from all variants: 40 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 40
WHERE pashto_word = 'لرم' AND pashto_word NOT IN ('لرم.','لرم،','لرم.»','لرم!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرم', 40);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرم.';
DELETE FROM word_frequencies WHERE pashto_word = 'لرم،';
DELETE FROM word_frequencies WHERE pashto_word = 'لرم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'لرم!';

-- Merge 2 variants of 'کېدله': کېدله،, کېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدله.';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'کېدله' AND pashto_word NOT IN ('کېدله،','کېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدله', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدله،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدله.';

-- Merge 2 variants of 'لرل': لرل., لرل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرل،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'لرل' AND pashto_word NOT IN ('لرل.','لرل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرل', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرل.';
DELETE FROM word_frequencies WHERE pashto_word = 'لرل،';

-- Merge 2 variants of 'اوسېږم': اوسېږم., اوسېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږم،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'اوسېږم' AND pashto_word NOT IN ('اوسېږم.','اوسېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږم', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږم،';

-- Merge 2 variants of 'ودرېده': ودرېده., ودرېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېده،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ودرېده' AND pashto_word NOT IN ('ودرېده.','ودرېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېده', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېده،';

-- Merge 2 variants of 'غویان': غویان،, غویان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غویان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غویان.';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'غویان' AND pashto_word NOT IN ('غویان،','غویان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غویان', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غویان،';
DELETE FROM word_frequencies WHERE pashto_word = 'غویان.';

-- Merge 2 variants of 'خوړل': خوړل., خوړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړل،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'خوړل' AND pashto_word NOT IN ('خوړل.','خوړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوړل', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوړل،';

-- Merge 2 variants of 'خورم': خورم،, خورم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خورم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خورم.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'خورم' AND pashto_word NOT IN ('خورم،','خورم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خورم', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خورم،';
DELETE FROM word_frequencies WHERE pashto_word = 'خورم.';

-- Merge 2 variants of 'کړله': کړله., کړله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړله،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'کړله' AND pashto_word NOT IN ('کړله.','کړله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړله', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړله.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړله،';

-- Merge 1 variants of 'ولګوى': ولګوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوى.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ولګوى' AND pashto_word NOT IN ('ولګوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوى', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوى.';

-- Merge 1 variants of 'وساتى': وساتى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتى،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وساتى' AND pashto_word NOT IN ('وساتى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتى', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتى،';

-- Merge 1 variants of 'بادشاهانو': بادشاهانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادشاهانو،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'بادشاهانو' AND pashto_word NOT IN ('بادشاهانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادشاهانو', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاهانو،';

-- Merge 2 variants of 'ږدم': ږدم., ږدم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدم،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ږدم' AND pashto_word NOT IN ('ږدم.','ږدم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږدم', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږدم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ږدم،';

-- Merge 1 variants of 'وشرميږى': وشرميږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشرميږى،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وشرميږى' AND pashto_word NOT IN ('وشرميږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشرميږى', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشرميږى،';

-- Merge 2 variants of 'ودريږى': ودريږى., ودريږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودريږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودريږى،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'ودريږى' AND pashto_word NOT IN ('ودريږى.','ودريږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودريږى', 31);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودريږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودريږى،';

-- Merge 2 variants of 'ولګى': ولګى., ولګى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګى،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'ولګى' AND pashto_word NOT IN ('ولګى.','ولګى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګى', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګى،';

-- Merge 2 variants of 'مومى': مومى., مومى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مومى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مومى،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'مومى' AND pashto_word NOT IN ('مومى.','مومى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مومى', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مومى.';
DELETE FROM word_frequencies WHERE pashto_word = 'مومى،';

-- Merge 1 variants of 'يمه': يمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يمه،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'يمه' AND pashto_word NOT IN ('يمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يمه', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يمه،';

-- Merge 2 variants of 'خوشحاليږى': خوشحاليږى., خوشحاليږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحاليږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحاليږى،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'خوشحاليږى' AND pashto_word NOT IN ('خوشحاليږى.','خوشحاليږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحاليږى', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحاليږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحاليږى،';

-- Merge 1 variants of 'يرېدل': يرېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېدل.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'يرېدل' AND pashto_word NOT IN ('يرېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېدل', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېدل.';

-- Merge 1 variants of 'اِمام': اِمام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِمام،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'اِمام' AND pashto_word NOT IN ('اِمام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِمام', 16);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِمام،';

-- Merge 2 variants of 'وروړی': وروړی،, وروړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړی.';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وروړی' AND pashto_word NOT IN ('وروړی،','وروړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروړی', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وروړی.';

-- Merge 2 variants of 'وڅښی': وڅښی،, وڅښی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښی.';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'وڅښی' AND pashto_word NOT IN ('وڅښی،','وڅښی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښی', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښی.';

-- Merge 2 variants of 'ومومی': ومومی،, ومومی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومی.';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'ومومی' AND pashto_word NOT IN ('ومومی،','ومومی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومی', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومومی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ومومی.';

-- Merge 2 variants of 'واغوندی': واغوندی., واغوندی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واغوندی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واغوندی،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'واغوندی' AND pashto_word NOT IN ('واغوندی.','واغوندی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واغوندی', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واغوندی.';
DELETE FROM word_frequencies WHERE pashto_word = 'واغوندی،';

-- Merge 2 variants of 'وښایى': وښایى., وښایى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایى،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وښایى' AND pashto_word NOT IN ('وښایى.','وښایى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښایى', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښایى.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښایى،';

-- Merge 2 variants of 'ګڼلی': ګڼلی., ګڼلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼلی،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'ګڼلی' AND pashto_word NOT IN ('ګڼلی.','ګڼلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼلی', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼلی،';

-- Merge 3 variants of 'ولېږه': ولېږه., ولېږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږه.»';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'ولېږه' AND pashto_word NOT IN ('ولېږه.','ولېږه،','ولېږه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږه', 25);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږه.»';

-- Merge 4 variants of 'وېرېږه': وېرېږه،, وېرېږه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږه!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېږه.»';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'وېرېږه' AND pashto_word NOT IN ('وېرېږه،','وېرېږه.','وېرېږه!','وېرېږه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېرېږه', 25);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږه!';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېږه.»';

-- Merge 2 variants of 'وتل': وتل., وتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتل،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'وتل' AND pashto_word NOT IN ('وتل.','وتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتل', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتل،';

-- Merge 1 variants of 'ملګرو': ملګرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ملګرو،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ملګرو' AND pashto_word NOT IN ('ملګرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ملګرو', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ملګرو،';

-- Merge 1 variants of 'پطروس': پطروس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پطروس،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'پطروس' AND pashto_word NOT IN ('پطروس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پطروس', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پطروس،';

-- Merge 2 variants of 'راوستله': راوستله., راوستله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستله،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'راوستله' AND pashto_word NOT IN ('راوستله.','راوستله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستله', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستله.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستله،';

-- Merge 2 variants of 'وباسم': وباسم،, وباسم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسم.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'وباسم' AND pashto_word NOT IN ('وباسم،','وباسم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسم', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وباسم.';

-- Merge 1 variants of 'ګرځي': ګرځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځي،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ګرځي' AND pashto_word NOT IN ('ګرځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځي', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځي،';

-- Merge 1 variants of 'کاهنانو': کاهنانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاهنانو،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'کاهنانو' AND pashto_word NOT IN ('کاهنانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاهنانو', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاهنانو،';

-- Merge 1 variants of 'غنم': غنم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غنم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'غنم' AND pashto_word NOT IN ('غنم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غنم', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غنم،';

-- Merge 2 variants of 'ووژنم': ووژنم., ووژنم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنم،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'ووژنم' AND pashto_word NOT IN ('ووژنم.','ووژنم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنم', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنم،';

-- Merge 1 variants of 'رسيږى': رسيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسيږى.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'رسيږى' AND pashto_word NOT IN ('رسيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسيږى', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسيږى.';

-- Merge 2 variants of 'ونيسه': ونيسه., ونيسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيسه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيسه،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'ونيسه' AND pashto_word NOT IN ('ونيسه.','ونيسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيسه', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونيسه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونيسه،';

-- Merge 2 variants of 'واچوله': واچوله., واچوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوله،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'واچوله' AND pashto_word NOT IN ('واچوله.','واچوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوله', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوله،';

-- Merge 1 variants of 'ښار': ښار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښار،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ښار' AND pashto_word NOT IN ('ښار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښار', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښار،';

-- Merge 2 variants of 'راوويستل': راوويستل., راوويستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستل،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'راوويستل' AND pashto_word NOT IN ('راوويستل.','راوويستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستل', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستل،';

-- Merge 2 variants of 'بوځه': بوځه., بوځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځه،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'بوځه' AND pashto_word NOT IN ('بوځه.','بوځه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځه', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځه.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځه،';

-- Merge 2 variants of 'ورولېږلو': ورولېږلو., ورولېږلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږلو،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'ورولېږلو' AND pashto_word NOT IN ('ورولېږلو.','ورولېږلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولېږلو', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږلو،';

-- Merge 1 variants of 'وګورى': وګورى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورى،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وګورى' AND pashto_word NOT IN ('وګورى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورى', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګورى،';

-- Merge 1 variants of 'راپاڅه': راپاڅه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅه،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راپاڅه' AND pashto_word NOT IN ('راپاڅه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅه', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅه،';

-- Merge 2 variants of 'څملاستو': څملاستو., څملاستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملاستو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څملاستو،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'څملاستو' AND pashto_word NOT IN ('څملاستو.','څملاستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملاستو', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملاستو.';
DELETE FROM word_frequencies WHERE pashto_word = 'څملاستو،';

-- Merge 1 variants of 'يشوَع': يشوَع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يشوَع،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'يشوَع' AND pashto_word NOT IN ('يشوَع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يشوَع', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يشوَع،';

-- Merge 1 variants of 'ښارونه': ښارونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښارونه،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ښارونه' AND pashto_word NOT IN ('ښارونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښارونه', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښارونه،';

-- Merge 1 variants of 'اموریانو': اموریانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اموریانو،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'اموریانو' AND pashto_word NOT IN ('اموریانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اموریانو', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اموریانو،';

-- Merge 2 variants of 'شړی': شړی., شړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شړی،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'شړی' AND pashto_word NOT IN ('شړی.','شړی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړی', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'شړی،';

-- Merge 1 variants of 'وژنی': وژنی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژنی،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وژنی' AND pashto_word NOT IN ('وژنی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژنی', 15);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژنی،';

-- Merge 2 variants of 'ولټوی': ولټوی،, ولټوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولټوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولټوی.';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'ولټوی' AND pashto_word NOT IN ('ولټوی،','ولټوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولټوی', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولټوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولټوی.';

-- Merge 2 variants of 'وینی': وینی،, وینی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وینی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وینی.';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'وینی' AND pashto_word NOT IN ('وینی،','وینی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وینی', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وینی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وینی.';

-- Merge 2 variants of 'لرو': لرو،, لرو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرو.';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'لرو' AND pashto_word NOT IN ('لرو،','لرو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرو', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرو،';
DELETE FROM word_frequencies WHERE pashto_word = 'لرو.';

-- Merge 1 variants of 'وڅښل': وڅښل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښل.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وڅښل' AND pashto_word NOT IN ('وڅښل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښل', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښل.';

-- Merge 2 variants of 'ورغلل': ورغلل., ورغلل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغلل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغلل،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'ورغلل' AND pashto_word NOT IN ('ورغلل.','ورغلل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغلل', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغلل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورغلل،';

-- Merge 2 variants of 'کېږه': کېږه،, کېږه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږه.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'کېږه' AND pashto_word NOT IN ('کېږه،','کېږه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږه', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږه.';

-- Merge 2 variants of 'تعالی': تعالی،, تعالی!

DELETE FROM word_verse_mapping WHERE pashto_word = 'تعالی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تعالی!';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'تعالی' AND pashto_word NOT IN ('تعالی،','تعالی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تعالی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تعالی،';
DELETE FROM word_frequencies WHERE pashto_word = 'تعالی!';

-- Merge 2 variants of 'وسوځوي': وسوځوي., وسوځوي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځوي.»';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'وسوځوي' AND pashto_word NOT IN ('وسوځوي.','وسوځوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځوي', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځوي.»';

-- Merge 2 variants of 'هغه': هغه،, هغه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'هغه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هغه!';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'هغه' AND pashto_word NOT IN ('هغه،','هغه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هغه', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هغه،';
DELETE FROM word_frequencies WHERE pashto_word = 'هغه!';

-- Merge 2 variants of 'راووتله': راووتله., راووتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتله،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'راووتله' AND pashto_word NOT IN ('راووتله.','راووتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتله', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتله.';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتله،';

-- Merge 2 variants of 'یادیږي': یادیږي., یادیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یادیږي،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'یادیږي' AND pashto_word NOT IN ('یادیږي.','یادیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادیږي', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'یادیږي،';

-- Merge 3 variants of 'راکړې': راکړې،, راکړې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړې.»';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'راکړې' AND pashto_word NOT IN ('راکړې،','راکړې.','راکړې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړې', 23);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړې.»';

-- Merge 2 variants of 'ونیول': ونیول., ونیول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیول،';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'ونیول' AND pashto_word NOT IN ('ونیول.','ونیول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیول', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیول.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیول،';

-- Merge 2 variants of 'ونیوله': ونیوله., ونیوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیوله،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ونیوله' AND pashto_word NOT IN ('ونیوله.','ونیوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیوله', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونیوله،';

-- Merge 2 variants of 'ونيوله': ونيوله., ونيوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيوله،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'ونيوله' AND pashto_word NOT IN ('ونيوله.','ونيوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيوله', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونيوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ونيوله،';

-- Merge 2 variants of 'بوځم': بوځم،, بوځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځم.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'بوځم' AND pashto_word NOT IN ('بوځم،','بوځم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځم', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځم،';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځم.';

-- Merge 2 variants of 'اسراییلو': اسراییلو،, اسراییلو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسراییلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اسراییلو!';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'اسراییلو' AND pashto_word NOT IN ('اسراییلو،','اسراییلو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسراییلو', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسراییلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'اسراییلو!';

-- Merge 2 variants of 'واچوم': واچوم،, واچوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوم.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'واچوم' AND pashto_word NOT IN ('واچوم،','واچوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوم', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوم،';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوم.';

-- Merge 2 variants of 'ووهه': ووهه،, ووهه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهه.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ووهه' AND pashto_word NOT IN ('ووهه،','ووهه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهه', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهه.';

-- Merge 1 variants of 'وړى': وړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړى،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وړى' AND pashto_word NOT IN ('وړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړى', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړى،';

-- Merge 1 variants of 'شوى': شوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوى،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'شوى' AND pashto_word NOT IN ('شوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوى', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوى،';

-- Merge 2 variants of 'ووهى': ووهى،, ووهى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهى.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'ووهى' AND pashto_word NOT IN ('ووهى،','ووهى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهى', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهى.';

-- Merge 2 variants of 'راوغورزيږى': راوغورزيږى., راوغورزيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزيږى،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'راوغورزيږى' AND pashto_word NOT IN ('راوغورزيږى.','راوغورزيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزيږى', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزيږى،';

-- Merge 2 variants of 'يروشلمه': يروشلمه،, يروشلمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يروشلمه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يروشلمه.';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'يروشلمه' AND pashto_word NOT IN ('يروشلمه،','يروشلمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يروشلمه', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يروشلمه،';
DELETE FROM word_frequencies WHERE pashto_word = 'يروشلمه.';

-- Merge 2 variants of 'ياديږى': ياديږى., ياديږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ياديږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ياديږى،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'ياديږى' AND pashto_word NOT IN ('ياديږى.','ياديږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ياديږى', 26);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ياديږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ياديږى،';

-- Merge 2 variants of 'به': به،, به.

DELETE FROM word_verse_mapping WHERE pashto_word = 'به،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'به.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'به' AND pashto_word NOT IN ('به،','به.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('به', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'به،';
DELETE FROM word_frequencies WHERE pashto_word = 'به.';

-- Merge 2 variants of 'راوستو': راوستو., راوستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستو،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'راوستو' AND pashto_word NOT IN ('راوستو.','راوستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستو', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستو،';

-- Merge 2 variants of 'ولګولو': ولګولو., ولګولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګولو،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ولګولو' AND pashto_word NOT IN ('ولګولو.','ولګولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګولو', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګولو،';

-- Merge 2 variants of 'لټوى': لټوى،, لټوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوى.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'لټوى' AND pashto_word NOT IN ('لټوى،','لټوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټوى', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټوى،';
DELETE FROM word_frequencies WHERE pashto_word = 'لټوى.';
