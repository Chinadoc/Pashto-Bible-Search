
-- Merge 2 variants of 'وسوزول': وسوزول., وسوزول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزول،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'وسوزول' AND pashto_word NOT IN ('وسوزول.','وسوزول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزول', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزول.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزول،';

-- Merge 2 variants of 'جوړيږى': جوړيږى., جوړيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړيږى،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'جوړيږى' AND pashto_word NOT IN ('جوړيږى.','جوړيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړيږى', 26);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړيږى،';

-- Merge 2 variants of 'عزرياه': عزرياه،, عزرياه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزرياه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عزرياه.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'عزرياه' AND pashto_word NOT IN ('عزرياه،','عزرياه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزرياه', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزرياه،';
DELETE FROM word_frequencies WHERE pashto_word = 'عزرياه.';

-- Merge 2 variants of 'خوړلی': خوړلی., خوړلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوړلی،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'خوړلی' AND pashto_word NOT IN ('خوړلی.','خوړلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوړلی', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوړلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوړلی،';

-- Merge 1 variants of 'لوښی': لوښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوښی،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'لوښی' AND pashto_word NOT IN ('لوښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوښی', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوښی،';

-- Merge 1 variants of 'تېریږی': تېریږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېریږی،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'تېریږی' AND pashto_word NOT IN ('تېریږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېریږی', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېریږی،';

-- Merge 1 variants of 'لرګی': لرګی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرګی،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'لرګی' AND pashto_word NOT IN ('لرګی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرګی', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرګی،';

-- Merge 3 variants of 'رسوی': رسوی،, رسوی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوی.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوی.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'رسوی' AND pashto_word NOT IN ('رسوی،','رسوی.»','رسوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوی', 20);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'رسوی.»';
DELETE FROM word_frequencies WHERE pashto_word = 'رسوی.';

-- Merge 1 variants of 'خوښوی': خوښوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوښوی.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'خوښوی' AND pashto_word NOT IN ('خوښوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوښوی', 14);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوښوی.';

-- Merge 2 variants of 'راوګرځی': راوګرځی،, راوګرځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځی.';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'راوګرځی' AND pashto_word NOT IN ('راوګرځی،','راوګرځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځی', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځی.';

-- Merge 2 variants of 'وباسی': وباسی., وباسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسی،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'وباسی' AND pashto_word NOT IN ('وباسی.','وباسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسی', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وباسی،';

-- Merge 2 variants of 'ګڼی': ګڼی., ګڼی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼی،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'ګڼی' AND pashto_word NOT IN ('ګڼی.','ګڼی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼی،';

-- Merge 2 variants of 'بایيلى': بایيلى،, بایيلى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بایيلى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بایيلى.';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'بایيلى' AND pashto_word NOT IN ('بایيلى،','بایيلى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بایيلى', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بایيلى،';
DELETE FROM word_frequencies WHERE pashto_word = 'بایيلى.';

-- Merge 2 variants of 'وویيلو': وویيلو., وویيلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویيلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وویيلو،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وویيلو' AND pashto_word NOT IN ('وویيلو.','وویيلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویيلو', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویيلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وویيلو،';

-- Merge 1 variants of 'عزر': عزر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزر،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'عزر' AND pashto_word NOT IN ('عزر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزر', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزر،';

-- Merge 2 variants of 'وګرځي': وګرځي., وګرځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځي،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'وګرځي' AND pashto_word NOT IN ('وګرځي.','وګرځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځي', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځي،';

-- Merge 3 variants of 'امین': امین., امین!

DELETE FROM word_verse_mapping WHERE pashto_word = 'امین.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'امین!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'امین.]';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'امین' AND pashto_word NOT IN ('امین.','امین!','امین.]');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امین', 24);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امین.';
DELETE FROM word_frequencies WHERE pashto_word = 'امین!';
DELETE FROM word_frequencies WHERE pashto_word = 'امین.]';

-- Merge 2 variants of 'وروره': وروره،, وروره!

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وروره!';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'وروره' AND pashto_word NOT IN ('وروره،','وروره!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروره', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروره،';
DELETE FROM word_frequencies WHERE pashto_word = 'وروره!';

-- Merge 3 variants of 'نیوه': نیوه., نیوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نیوه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نیوه.»';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'نیوه' AND pashto_word NOT IN ('نیوه.','نیوه،','نیوه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیوه', 18);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'نیوه،';
DELETE FROM word_frequencies WHERE pashto_word = 'نیوه.»';

-- Merge 1 variants of 'وتښتي': وتښتي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتي.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وتښتي' AND pashto_word NOT IN ('وتښتي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتي', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتي.';

-- Merge 1 variants of 'ابراهیم': ابراهیم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابراهیم،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ابراهیم' AND pashto_word NOT IN ('ابراهیم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابراهیم', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابراهیم،';

-- Merge 2 variants of 'ووېرېدل': ووېرېدل., ووېرېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېرېدل،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ووېرېدل' AND pashto_word NOT IN ('ووېرېدل.','ووېرېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېرېدل', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووېرېدل،';

-- Merge 3 variants of 'ودریږي': ودریږي., ودریږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودریږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودریږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودریږي.»';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ودریږي' AND pashto_word NOT IN ('ودریږي.','ودریږي،','ودریږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودریږي', 21);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودریږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودریږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ودریږي.»';

-- Merge 2 variants of 'پرېږدي': پرېږدي،, پرېږدي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدي.»';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'پرېږدي' AND pashto_word NOT IN ('پرېږدي،','پرېږدي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدي', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدي،';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدي.»';

-- Merge 2 variants of 'وباسه': وباسه،, وباسه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسه.';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'وباسه' AND pashto_word NOT IN ('وباسه،','وباسه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسه', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وباسه.';

-- Merge 2 variants of 'ورولېږل': ورولېږل., ورولېږل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږل،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'ورولېږل' AND pashto_word NOT IN ('ورولېږل.','ورولېږل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولېږل', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږل،';

-- Merge 2 variants of 'لاړم': لاړم., لاړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړم،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'لاړم' AND pashto_word NOT IN ('لاړم.','لاړم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړم', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړم.';
DELETE FROM word_frequencies WHERE pashto_word = 'لاړم،';

-- Merge 1 variants of 'اولاد': اولاد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اولاد،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'اولاد' AND pashto_word NOT IN ('اولاد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اولاد', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اولاد،';

-- Merge 2 variants of 'درلودله': درلودله., درلودله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودله،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'درلودله' AND pashto_word NOT IN ('درلودله.','درلودله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلودله', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلودله.';
DELETE FROM word_frequencies WHERE pashto_word = 'درلودله،';

-- Merge 4 variants of 'راوله': راوله،, راوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوله.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوله!';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'راوله' AND pashto_word NOT IN ('راوله،','راوله.','راوله.»','راوله!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوله', 30);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوله،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوله.»';
DELETE FROM word_frequencies WHERE pashto_word = 'راوله!';

-- Merge 1 variants of 'ښځه': ښځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښځه،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ښځه' AND pashto_word NOT IN ('ښځه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښځه', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښځه،';

-- Merge 2 variants of 'ولګول': ولګول., ولګول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګول،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'ولګول' AND pashto_word NOT IN ('ولګول.','ولګول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګول', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګول.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګول،';

-- Merge 1 variants of 'وساتله': وساتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتله،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وساتله' AND pashto_word NOT IN ('وساتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتله', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتله،';

-- Merge 2 variants of 'درلودلې': درلودلې., درلودلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودلې،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'درلودلې' AND pashto_word NOT IN ('درلودلې.','درلودلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلودلې', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلودلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'درلودلې،';

-- Merge 1 variants of 'عمون': عمون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عمون،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'عمون' AND pashto_word NOT IN ('عمون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عمون', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عمون،';

-- Merge 2 variants of 'درلودل': درلودل., درلودل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درلودل،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'درلودل' AND pashto_word NOT IN ('درلودل.','درلودل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلودل', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلودل.';
DELETE FROM word_frequencies WHERE pashto_word = 'درلودل،';

-- Merge 1 variants of 'بينجو': بينجو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بينجو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'بينجو' AND pashto_word NOT IN ('بينجو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بينجو', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بينجو،';

-- Merge 1 variants of 'يروشلم': يروشلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يروشلم،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'يروشلم' AND pashto_word NOT IN ('يروشلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يروشلم', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يروشلم،';

-- Merge 1 variants of 'موسی': موسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موسی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'موسی' AND pashto_word NOT IN ('موسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موسی', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موسی،';

-- Merge 2 variants of 'ګرځېدل': ګرځېدل., ګرځېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدل،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ګرځېدل' AND pashto_word NOT IN ('ګرځېدل.','ګرځېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځېدل', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدل،';

-- Merge 2 variants of 'وموندله': وموندله., وموندله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندله،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وموندله' AND pashto_word NOT IN ('وموندله.','وموندله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموندله', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموندله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وموندله،';

-- Merge 1 variants of 'دُنيا': دُنيا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دُنيا،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'دُنيا' AND pashto_word NOT IN ('دُنيا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دُنيا', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دُنيا،';

-- Merge 2 variants of 'يرمياه': يرمياه،, يرمياه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرمياه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يرمياه.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'يرمياه' AND pashto_word NOT IN ('يرمياه،','يرمياه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرمياه', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرمياه،';
DELETE FROM word_frequencies WHERE pashto_word = 'يرمياه.';

-- Merge 1 variants of 'الافواج': الافواج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الافواج،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'الافواج' AND pashto_word NOT IN ('الافواج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الافواج', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الافواج،';

-- Merge 2 variants of 'ورسيږى': ورسيږى., ورسيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسيږى،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'ورسيږى' AND pashto_word NOT IN ('ورسيږى.','ورسيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسيږى', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسيږى،';

-- Merge 1 variants of 'وسوزولو': وسوزولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزولو.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وسوزولو' AND pashto_word NOT IN ('وسوزولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزولو', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزولو.';

-- Merge 2 variants of 'وخوړو': وخوړو., وخوړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړو،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'وخوړو' AND pashto_word NOT IN ('وخوړو.','وخوړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړو', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړو،';

-- Merge 1 variants of 'مخکښې': مخکښې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخکښې،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'مخکښې' AND pashto_word NOT IN ('مخکښې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخکښې', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخکښې،';

-- Merge 2 variants of 'تښتى': تښتى., تښتى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتى،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'تښتى' AND pashto_word NOT IN ('تښتى.','تښتى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتى', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتى.';
DELETE FROM word_frequencies WHERE pashto_word = 'تښتى،';

-- Merge 2 variants of 'وغورزولو': وغورزولو., وغورزولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزولو،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وغورزولو' AND pashto_word NOT IN ('وغورزولو.','وغورزولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزولو', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزولو،';

-- Merge 2 variants of 'يوړل': يوړل., يوړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړل،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'يوړل' AND pashto_word NOT IN ('يوړل.','يوړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوړل', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'يوړل،';

-- Merge 2 variants of 'وښايه': وښايه., وښايه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښايه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښايه،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وښايه' AND pashto_word NOT IN ('وښايه.','وښايه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښايه', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښايه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښايه،';

-- Merge 2 variants of 'څملى': څملى،, څملى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څملى.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'څملى' AND pashto_word NOT IN ('څملى،','څملى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملى', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملى،';
DELETE FROM word_frequencies WHERE pashto_word = 'څملى.';

-- Merge 2 variants of 'اچوى': اچوى،, اچوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوى.';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'اچوى' AND pashto_word NOT IN ('اچوى،','اچوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچوى', 25);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچوى،';
DELETE FROM word_frequencies WHERE pashto_word = 'اچوى.';

-- Merge 1 variants of 'اِلى‌عزر': اِلى‌عزر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِلى‌عزر،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'اِلى‌عزر' AND pashto_word NOT IN ('اِلى‌عزر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِلى‌عزر', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِلى‌عزر،';

-- Merge 2 variants of 'پرېوتو': پرېوتو،, پرېوتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتو.';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'پرېوتو' AND pashto_word NOT IN ('پرېوتو،','پرېوتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوتو', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتو،';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتو.';

-- Merge 2 variants of 'ودرېدو': ودرېدو., ودرېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدو،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ودرېدو' AND pashto_word NOT IN ('ودرېدو.','ودرېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدو', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدو،';

-- Merge 1 variants of 'ولیکم': ولیکم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکم.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ولیکم' AND pashto_word NOT IN ('ولیکم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیکم', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکم.';

-- Merge 1 variants of 'فرزیانو': فرزیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرزیانو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'فرزیانو' AND pashto_word NOT IN ('فرزیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرزیانو', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرزیانو،';

-- Merge 1 variants of 'قبیلې': قبیلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قبیلې،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'قبیلې' AND pashto_word NOT IN ('قبیلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قبیلې', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قبیلې،';

-- Merge 1 variants of 'کنعانیان': کنعانیان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنعانیان،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'کنعانیان' AND pashto_word NOT IN ('کنعانیان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنعانیان', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنعانیان،';

-- Merge 1 variants of 'محلی': محلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'محلی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'محلی' AND pashto_word NOT IN ('محلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('محلی', 13);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'محلی،';

-- Merge 2 variants of 'راوباسی': راوباسی., راوباسی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوباسی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوباسی.»';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راوباسی' AND pashto_word NOT IN ('راوباسی.','راوباسی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوباسی', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسی.»';

-- Merge 2 variants of 'ژاړی': ژاړی., ژاړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژاړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ژاړی،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ژاړی' AND pashto_word NOT IN ('ژاړی.','ژاړی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژاړی', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژاړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ژاړی،';

-- Merge 2 variants of 'رېبی': رېبی., رېبی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رېبی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رېبی،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'رېبی' AND pashto_word NOT IN ('رېبی.','رېبی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رېبی', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رېبی.';
DELETE FROM word_frequencies WHERE pashto_word = 'رېبی،';

-- Merge 2 variants of 'ودروی': ودروی،, ودروی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودروی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودروی.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ودروی' AND pashto_word NOT IN ('ودروی،','ودروی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودروی', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودروی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ودروی.';

-- Merge 2 variants of 'منی': منی., منی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منی،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'منی' AND pashto_word NOT IN ('منی.','منی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منی.';
DELETE FROM word_frequencies WHERE pashto_word = 'منی،';

-- Merge 2 variants of 'تېروی': تېروی., تېروی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروی،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'تېروی' AND pashto_word NOT IN ('تېروی.','تېروی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروی', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروی.';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروی،';

-- Merge 2 variants of 'نیسی': نیسی،, نیسی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیسی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نیسی.';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'نیسی' AND pashto_word NOT IN ('نیسی،','نیسی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیسی', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیسی،';
DELETE FROM word_frequencies WHERE pashto_word = 'نیسی.';

-- Merge 2 variants of 'کېږدی': کېږدی., کېږدی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدی،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'کېږدی' AND pashto_word NOT IN ('کېږدی.','کېږدی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدی', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدی.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدی،';

-- Merge 2 variants of 'جوړَوی': جوړَوی،, جوړَوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړَوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړَوی.';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'جوړَوی' AND pashto_word NOT IN ('جوړَوی،','جوړَوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړَوی', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړَوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړَوی.';

-- Merge 2 variants of 'ګڼي': ګڼي،, ګڼي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼي.';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'ګڼي' AND pashto_word NOT IN ('ګڼي،','ګڼي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼي', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼي.';

-- Merge 2 variants of 'بوځي': بوځي., بوځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځي،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'بوځي' AND pashto_word NOT IN ('بوځي.','بوځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځي', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځي،';

-- Merge 2 variants of 'منله': منله., منله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منله،';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'منله' AND pashto_word NOT IN ('منله.','منله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منله', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منله.';
DELETE FROM word_frequencies WHERE pashto_word = 'منله،';

-- Merge 2 variants of 'ورسېدلو': ورسېدلو., ورسېدلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدلو،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ورسېدلو' AND pashto_word NOT IN ('ورسېدلو.','ورسېدلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدلو', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدلو،';

-- Merge 3 variants of 'ووهي': ووهي،, ووهي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهي.»';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'ووهي' AND pashto_word NOT IN ('ووهي،','ووهي.','ووهي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهي', 24);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهي.»';

-- Merge 2 variants of 'لرله': لرله،, لرله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرله.';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'لرله' AND pashto_word NOT IN ('لرله،','لرله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرله', 21);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرله،';
DELETE FROM word_frequencies WHERE pashto_word = 'لرله.';

-- Merge 2 variants of 'اوسېدونکو': اوسېدونکو،, اوسېدونکو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدونکو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدونکو!';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'اوسېدونکو' AND pashto_word NOT IN ('اوسېدونکو،','اوسېدونکو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدونکو', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدونکو،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدونکو!';

-- Merge 1 variants of 'ورکوي': ورکوي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوي.»';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ورکوي' AND pashto_word NOT IN ('ورکوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوي', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوي.»';

-- Merge 2 variants of 'راوست': راوست., راوست،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوست.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوست،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'راوست' AND pashto_word NOT IN ('راوست.','راوست،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوست', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوست.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوست،';

-- Merge 3 variants of 'کښېني': کښېني., کښېني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېني.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېني،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېني.»';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'کښېني' AND pashto_word NOT IN ('کښېني.','کښېني،','کښېني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېني', 20);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېني.';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېني،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېني.»';

-- Merge 1 variants of 'ودروله': ودروله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودروله.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ودروله' AND pashto_word NOT IN ('ودروله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودروله', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودروله.';

-- Merge 3 variants of 'درکړي': درکړي،, درکړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړي.]';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'درکړي' AND pashto_word NOT IN ('درکړي،','درکړي.»','درکړي.]');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړي', 24);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړي،';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړي.]';

-- Merge 2 variants of 'غوښتل': غوښتل., غوښتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوښتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غوښتل،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'غوښتل' AND pashto_word NOT IN ('غوښتل.','غوښتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوښتل', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوښتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'غوښتل،';

-- Merge 2 variants of 'ورننوځي': ورننوځي., ورننوځي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځي.»';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ورننوځي' AND pashto_word NOT IN ('ورننوځي.','ورننوځي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوځي', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځي.»';

-- Merge 3 variants of 'واچوي': واچوي., واچوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوي.»';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'واچوي' AND pashto_word NOT IN ('واچوي.','واچوي،','واچوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوي', 19);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوي،';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوي.»';

-- Merge 2 variants of 'ورغی': ورغی., ورغی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغی،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'ورغی' AND pashto_word NOT IN ('ورغی.','ورغی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغی', 22);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورغی،';

-- Merge 1 variants of 'فریسیانو': فریسیانو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'فریسیانو!';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'فریسیانو' AND pashto_word NOT IN ('فریسیانو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فریسیانو', 12);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فریسیانو!';

-- Merge 2 variants of 'پرېښودله': پرېښودله., پرېښودله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودله،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'پرېښودله' AND pashto_word NOT IN ('پرېښودله.','پرېښودله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودله', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودله.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودله،';
