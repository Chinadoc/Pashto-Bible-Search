
-- Merge 2 variants of 'حبرون': حبرون،, حبرون.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حبرون،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'حبرون.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'حبرون' AND pashto_word NOT IN ('حبرون،','حبرون.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حبرون', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حبرون،';
DELETE FROM word_frequencies WHERE pashto_word = 'حبرون.';

-- Merge 2 variants of 'پاڅېدل': پاڅېدل،, پاڅېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېدل.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'پاڅېدل' AND pashto_word NOT IN ('پاڅېدل،','پاڅېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېدل', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېدل.';

-- Merge 2 variants of 'قبلوى': قبلوى., قبلوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قبلوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'قبلوى،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'قبلوى' AND pashto_word NOT IN ('قبلوى.','قبلوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قبلوى', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قبلوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'قبلوى،';

-- Merge 1 variants of 'وسوزى': وسوزى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزى.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وسوزى' AND pashto_word NOT IN ('وسوزى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزى', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزى.';

-- Merge 2 variants of 'قورح': قورح،, قورح.

DELETE FROM word_verse_mapping WHERE pashto_word = 'قورح،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'قورح.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'قورح' AND pashto_word NOT IN ('قورح،','قورح.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قورح', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قورح،';
DELETE FROM word_frequencies WHERE pashto_word = 'قورح.';

-- Merge 1 variants of '”وګوره': ”وګوره،

DELETE FROM word_verse_mapping WHERE pashto_word = '”وګوره،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = '”وګوره' AND pashto_word NOT IN ('”وګوره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”وګوره', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”وګوره،';

-- Merge 2 variants of 'استعماليږى': استعماليږى., استعماليږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعماليږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'استعماليږى،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'استعماليږى' AND pashto_word NOT IN ('استعماليږى.','استعماليږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعماليږى', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعماليږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'استعماليږى،';

-- Merge 2 variants of 'واخستو': واخستو., واخستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستو،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'واخستو' AND pashto_word NOT IN ('واخستو.','واخستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخستو', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخستو.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخستو،';

-- Merge 2 variants of 'کېښودې': کېښودې., کېښودې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'کېښودې' AND pashto_word NOT IN ('کېښودې.','کېښودې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودې،';

-- Merge 1 variants of 'ندب': ندب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ندب،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ندب' AND pashto_word NOT IN ('ندب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ندب', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ندب،';

-- Merge 1 variants of 'روټۍ': روټۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روټۍ،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'روټۍ' AND pashto_word NOT IN ('روټۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روټۍ', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روټۍ،';

-- Merge 1 variants of 'اخستلو': اخستلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستلو.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'اخستلو' AND pashto_word NOT IN ('اخستلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخستلو', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخستلو.';

-- Merge 1 variants of 'خِلقياه': خِلقياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خِلقياه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'خِلقياه' AND pashto_word NOT IN ('خِلقياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خِلقياه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خِلقياه،';

-- Merge 1 variants of 'سمعياه': سمعياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سمعياه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'سمعياه' AND pashto_word NOT IN ('سمعياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سمعياه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سمعياه،';

-- Merge 2 variants of 'بدکاران': بدکاران،, بدکاران.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بدکاران،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بدکاران.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'بدکاران' AND pashto_word NOT IN ('بدکاران،','بدکاران.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بدکاران', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بدکاران،';
DELETE FROM word_frequencies WHERE pashto_word = 'بدکاران.';

-- Merge 1 variants of 'وینې': وینې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وینې،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وینې' AND pashto_word NOT IN ('وینې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وینې', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وینې،';

-- Merge 2 variants of 'ووینې': ووینې،, ووینې.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینې.»';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ووینې' AND pashto_word NOT IN ('ووینې،','ووینې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینې', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووینې.»';

-- Merge 1 variants of 'یرموت': یرموت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یرموت،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'یرموت' AND pashto_word NOT IN ('یرموت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یرموت', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یرموت،';

-- Merge 2 variants of 'یادوم': یادوم., یادوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یادوم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'یادوم' AND pashto_word NOT IN ('یادوم.','یادوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادوم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'یادوم،';

-- Merge 2 variants of 'وژلی': وژلی،, وژلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژلی.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وژلی' AND pashto_word NOT IN ('وژلی،','وژلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژلی', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژلی.';

-- Merge 2 variants of 'ولیکل': ولیکل،, ولیکل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکل.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ولیکل' AND pashto_word NOT IN ('ولیکل،','ولیکل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیکل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکل.';

-- Merge 1 variants of 'وځی': وځی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وځی' AND pashto_word NOT IN ('وځی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځی،';

-- Merge 1 variants of 'بچی': بچی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بچی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'بچی' AND pashto_word NOT IN ('بچی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بچی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بچی،';

-- Merge 1 variants of 'شرمیږی': شرمیږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمیږی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'شرمیږی' AND pashto_word NOT IN ('شرمیږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرمیږی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرمیږی،';

-- Merge 1 variants of 'خوځیږی': خوځیږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوځیږی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'خوځیږی' AND pashto_word NOT IN ('خوځیږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوځیږی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوځیږی.';

-- Merge 1 variants of 'کښېنوی': کښېنوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنوی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کښېنوی' AND pashto_word NOT IN ('کښېنوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنوی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنوی.';

-- Merge 1 variants of 'پوهېږی': پوهېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'پوهېږی' AND pashto_word NOT IN ('پوهېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېږی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږی،';

-- Merge 2 variants of 'پېژنی': پېژنی،, پېژنی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژنی.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'پېژنی' AND pashto_word NOT IN ('پېژنی،','پېژنی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژنی', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنی،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژنی.';

-- Merge 3 variants of 'بوځی': بوځی., بوځی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځی.»';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'بوځی' AND pashto_word NOT IN ('بوځی.','بوځی،','بوځی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځی', 14);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځی.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځی.»';

-- Merge 2 variants of 'وغواړی': وغواړی،, وغواړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړی.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وغواړی' AND pashto_word NOT IN ('وغواړی،','وغواړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړی.';

-- Merge 2 variants of 'راوویستلی': راوویستلی., راوویستلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویستلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویستلی،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'راوویستلی' AND pashto_word NOT IN ('راوویستلی.','راوویستلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوویستلی', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوویستلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوویستلی،';

-- Merge 1 variants of 'ميکایيل': ميکایيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميکایيل،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ميکایيل' AND pashto_word NOT IN ('ميکایيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميکایيل', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميکایيل،';

-- Merge 1 variants of 'وشړی': وشړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وشړی' AND pashto_word NOT IN ('وشړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړی.';

-- Merge 2 variants of 'راوغواړی': راوغواړی., راوغواړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'راوغواړی' AND pashto_word NOT IN ('راوغواړی.','راوغواړی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغواړی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړی،';

-- Merge 2 variants of 'اخستلی': اخستلی،, اخستلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستلی.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'اخستلی' AND pashto_word NOT IN ('اخستلی،','اخستلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخستلی', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخستلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'اخستلی.';

-- Merge 1 variants of 'وينی': وينی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وينی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وينی' AND pashto_word NOT IN ('وينی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينی', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وينی،';

-- Merge 1 variants of 'وکَری': وکَری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکَری،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وکَری' AND pashto_word NOT IN ('وکَری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکَری', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکَری،';

-- Merge 1 variants of 'یوحانان': یوحانان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوحانان،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یوحانان' AND pashto_word NOT IN ('یوحانان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوحانان', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوحانان،';

-- Merge 2 variants of 'راکړ': راکړ., راکړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړ.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړ،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'راکړ' AND pashto_word NOT IN ('راکړ.','راکړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړ', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړ.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړ،';

-- Merge 2 variants of 'وېرېدل': وېرېدل., وېرېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېدل،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وېرېدل' AND pashto_word NOT IN ('وېرېدل.','وېرېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېرېدل', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېدل،';

-- Merge 1 variants of 'حیوانات': حیوانات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حیوانات،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'حیوانات' AND pashto_word NOT IN ('حیوانات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حیوانات', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حیوانات،';

-- Merge 2 variants of 'ګڼم': ګڼم., ګڼم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼم،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ګڼم' AND pashto_word NOT IN ('ګڼم.','ګڼم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼم', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼم،';

-- Merge 4 variants of 'راځه': راځه.», راځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راځه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راځه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راځه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راځه!»';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'راځه' AND pashto_word NOT IN ('راځه.»','راځه،','راځه.','راځه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځه', 22);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راځه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'راځه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راځه.';
DELETE FROM word_frequencies WHERE pashto_word = 'راځه!»';

-- Merge 2 variants of 'وټاکل': وټاکل., وټاکل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وټاکل،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وټاکل' AND pashto_word NOT IN ('وټاکل.','وټاکل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وټاکل', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وټاکل،';

-- Merge 2 variants of 'وشي': وشي.», وشي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشي!»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وشي' AND pashto_word NOT IN ('وشي.»','وشي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشي', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وشي!»';

-- Merge 1 variants of 'خلاف': خلاف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلاف،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'خلاف' AND pashto_word NOT IN ('خلاف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلاف', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلاف،';

-- Merge 2 variants of 'کېږم': کېږم., کېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږم،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'کېږم' AND pashto_word NOT IN ('کېږم.','کېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږم', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږم،';

-- Merge 2 variants of 'ووتل': ووتل،, ووتل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووتل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووتل.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ووتل' AND pashto_word NOT IN ('ووتل،','ووتل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووتل', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووتل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووتل.';

-- Merge 2 variants of 'وتړله': وتړله., وتړله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وتړله' AND pashto_word NOT IN ('وتړله.','وتړله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتړله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتړله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتړله،';

-- Merge 2 variants of 'رسېده': رسېده., رسېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېده،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'رسېده' AND pashto_word NOT IN ('رسېده.','رسېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېده', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسېده،';

-- Merge 1 variants of 'وغوښت': وغوښت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښت.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وغوښت' AND pashto_word NOT IN ('وغوښت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغوښت', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښت.';

-- Merge 1 variants of 'کاهنان': کاهنان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاهنان،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کاهنان' AND pashto_word NOT IN ('کاهنان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاهنان', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاهنان،';

-- Merge 2 variants of 'وځي': وځي., وځي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وځي.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وځي' AND pashto_word NOT IN ('وځي.','وځي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځي', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وځي.»';

-- Merge 1 variants of 'اولادونو': اولادونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اولادونو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اولادونو' AND pashto_word NOT IN ('اولادونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اولادونو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اولادونو،';

-- Merge 1 variants of 'خوشحالیږي': خوشحالیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالیږي.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'خوشحالیږي' AND pashto_word NOT IN ('خوشحالیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالیږي', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالیږي.';

-- Merge 1 variants of 'اوږده': اوږده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوږده،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اوږده' AND pashto_word NOT IN ('اوږده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوږده', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوږده،';

-- Merge 1 variants of 'وشړه': وشړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وشړه' AND pashto_word NOT IN ('وشړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړه،';

-- Merge 2 variants of 'ووت': ووت., ووت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووت.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووت،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ووت' AND pashto_word NOT IN ('ووت.','ووت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووت', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووت.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووت،';

-- Merge 1 variants of 'وژني': وژني.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژني.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وژني' AND pashto_word NOT IN ('وژني.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژني', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژني.';

-- Merge 1 variants of 'مومي': مومي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مومي.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'مومي' AND pashto_word NOT IN ('مومي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مومي', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مومي.';

-- Merge 2 variants of 'اوسېدله': اوسېدله., اوسېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدله،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'اوسېدله' AND pashto_word NOT IN ('اوسېدله.','اوسېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدله', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدله.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدله،';

-- Merge 2 variants of 'راوویست': راوویست،, راوویست.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویست،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویست.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راوویست' AND pashto_word NOT IN ('راوویست،','راوویست.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوویست', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوویست،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوویست.';

-- Merge 2 variants of 'درولېږم': درولېږم., درولېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درولېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درولېږم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'درولېږم' AND pashto_word NOT IN ('درولېږم.','درولېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درولېږم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درولېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'درولېږم،';

-- Merge 2 variants of 'تللې': تللې،, تللې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تللې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تللې.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'تللې' AND pashto_word NOT IN ('تللې،','تللې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تللې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تللې،';
DELETE FROM word_frequencies WHERE pashto_word = 'تللې.';

-- Merge 1 variants of 'وړي': وړي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړي،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وړي' AND pashto_word NOT IN ('وړي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړي', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړي،';

-- Merge 2 variants of 'اورم': اورم., اورم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اورم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'اورم' AND pashto_word NOT IN ('اورم.','اورم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورم.';
DELETE FROM word_frequencies WHERE pashto_word = 'اورم،';

-- Merge 2 variants of 'پوهېږم': پوهېږم،, پوهېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږم.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'پوهېږم' AND pashto_word NOT IN ('پوهېږم،','پوهېږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېږم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږم.';

-- Merge 2 variants of 'ښاره': ښاره!, ښاره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښاره!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښاره،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ښاره' AND pashto_word NOT IN ('ښاره!','ښاره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښاره', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښاره!';
DELETE FROM word_frequencies WHERE pashto_word = 'ښاره،';

-- Merge 1 variants of 'شي.›': شي.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'شي.›»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'شي.›' AND pashto_word NOT IN ('شي.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شي.›', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شي.›»';

-- Merge 2 variants of 'باداره': باداره!, باداره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باداره!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'باداره،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'باداره' AND pashto_word NOT IN ('باداره!','باداره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باداره', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باداره!';
DELETE FROM word_frequencies WHERE pashto_word = 'باداره،';

-- Merge 1 variants of 'واچاوه': واچاوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچاوه.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'واچاوه' AND pashto_word NOT IN ('واچاوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچاوه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچاوه.';

-- Merge 2 variants of 'وشوه': وشوه., وشوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشوه،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وشوه' AND pashto_word NOT IN ('وشوه.','وشوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشوه', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشوه،';

-- Merge 2 variants of 'وختل': وختل., وختل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وختل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وختل،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وختل' AND pashto_word NOT IN ('وختل.','وختل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وختل', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وختل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وختل،';

-- Merge 1 variants of 'کورونه': کورونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کورونه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کورونه' AND pashto_word NOT IN ('کورونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کورونه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کورونه،';

-- Merge 2 variants of 'اچوي': اچوي., اچوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوي،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'اچوي' AND pashto_word NOT IN ('اچوي.','اچوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچوي', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'اچوي،';

-- Merge 3 variants of 'وښایي': وښایي., وښایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایي.»';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وښایي' AND pashto_word NOT IN ('وښایي.','وښایي،','وښایي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښایي', 14);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښایي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښایي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وښایي.»';

-- Merge 2 variants of 'ګڼلو': ګڼلو., ګڼلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګڼلو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ګڼلو' AND pashto_word NOT IN ('ګڼلو.','ګڼلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګڼلو', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګڼلو،';

-- Merge 1 variants of 'منې': منې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'منې' AND pashto_word NOT IN ('منې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منې', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منې،';

-- Merge 2 variants of 'ولیکه': ولیکه., ولیکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیکه،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ولیکه' AND pashto_word NOT IN ('ولیکه.','ولیکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیکه', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیکه،';

-- Merge 1 variants of 'مرګ': مرګ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرګ،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'مرګ' AND pashto_word NOT IN ('مرګ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرګ', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرګ،';

-- Merge 2 variants of 'راوستلم': راوستلم،, راوستلم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلم.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'راوستلم' AND pashto_word NOT IN ('راوستلم،','راوستلم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستلم', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلم،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلم.';

-- Merge 2 variants of 'ورکوو': ورکوو., ورکوو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ورکوو' AND pashto_word NOT IN ('ورکوو.','ورکوو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوو،';

-- Merge 1 variants of 'اوسو': اوسو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسو.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اوسو' AND pashto_word NOT IN ('اوسو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسو.';

-- Merge 2 variants of 'ولمانځي': ولمانځي., ولمانځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولمانځي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولمانځي،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ولمانځي' AND pashto_word NOT IN ('ولمانځي.','ولمانځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولمانځي', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولمانځي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولمانځي،';

-- Merge 1 variants of 'لاویانو': لاویانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاویانو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'لاویانو' AND pashto_word NOT IN ('لاویانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاویانو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاویانو،';

-- Merge 1 variants of 'یشوع': یشوع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یشوع،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یشوع' AND pashto_word NOT IN ('یشوع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یشوع', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یشوع،';

-- Merge 2 variants of 'کاسې': کاسې،, کاسې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاسې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کاسې.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'کاسې' AND pashto_word NOT IN ('کاسې،','کاسې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاسې', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاسې،';
DELETE FROM word_frequencies WHERE pashto_word = 'کاسې.';

-- Merge 2 variants of 'ودرول': ودرول., ودرول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرول،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ودرول' AND pashto_word NOT IN ('ودرول.','ودرول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرول', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرول.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرول،';

-- Merge 2 variants of 'وړل': وړل., وړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړل،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'وړل' AND pashto_word NOT IN ('وړل.','وړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړل', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وړل،';

-- Merge 2 variants of 'پرېوتلم': پرېوتلم., پرېوتلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتلم،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'پرېوتلم' AND pashto_word NOT IN ('پرېوتلم.','پرېوتلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوتلم', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتلم،';

-- Merge 2 variants of 'ولګوه': ولګوه., ولګوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوه،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ولګوه' AND pashto_word NOT IN ('ولګوه.','ولګوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوه', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوه،';

-- Merge 1 variants of 'جادوګر': جادوګر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جادوګر،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'جادوګر' AND pashto_word NOT IN ('جادوګر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جادوګر', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جادوګر،';

-- Merge 1 variants of 'فالګر': فالګر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فالګر،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'فالګر' AND pashto_word NOT IN ('فالګر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فالګر', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فالګر،';

-- Merge 1 variants of 'ختميږى': ختميږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ختميږى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ختميږى' AND pashto_word NOT IN ('ختميږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ختميږى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ختميږى،';

-- Merge 1 variants of 'حکمرانانو': حکمرانانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکمرانانو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'حکمرانانو' AND pashto_word NOT IN ('حکمرانانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکمرانانو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکمرانانو،';

-- Merge 1 variants of 'بيګل': بيګل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيګل،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'بيګل' AND pashto_word NOT IN ('بيګل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيګل', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيګل،';

-- Merge 1 variants of 'شپيلۍ': شپيلۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شپيلۍ،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'شپيلۍ' AND pashto_word NOT IN ('شپيلۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شپيلۍ', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شپيلۍ،';
