
-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږلو.';

-- Merge 2 variants of 'ورسېده': ورسېده،, ورسېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېده.';

-- Sum frequencies from all variants: 46 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 46
WHERE pashto_word = 'ورسېده' AND pashto_word NOT IN ('ورسېده،','ورسېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېده', 46);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېده.';

-- Merge 1 variants of 'مشرانو': مشرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشرانو،';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'مشرانو' AND pashto_word NOT IN ('مشرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشرانو', 32);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشرانو،';

-- Merge 1 variants of 'ښکارى': ښکارى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارى،';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'ښکارى' AND pashto_word NOT IN ('ښکارى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارى', 32);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارى،';

-- Merge 2 variants of 'یووړل': یووړل., یووړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یووړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یووړل،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'یووړل' AND pashto_word NOT IN ('یووړل.','یووړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یووړل', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یووړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'یووړل،';

-- Merge 2 variants of 'واخله': واخله،, واخله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخله.';

-- Sum frequencies from all variants: 42 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 42
WHERE pashto_word = 'واخله' AND pashto_word NOT IN ('واخله،','واخله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخله', 42);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخله،';
DELETE FROM word_frequencies WHERE pashto_word = 'واخله.';

-- Merge 2 variants of 'قومه': قومه،, قومه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'قومه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'قومه!';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'قومه' AND pashto_word NOT IN ('قومه،','قومه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قومه', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قومه،';
DELETE FROM word_frequencies WHERE pashto_word = 'قومه!';

-- Merge 2 variants of 'راکړو': راکړو،, راکړو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړو.';

-- Sum frequencies from all variants: 41 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 41
WHERE pashto_word = 'راکړو' AND pashto_word NOT IN ('راکړو،','راکړو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړو', 41);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړو.';

-- Merge 1 variants of 'ګرځى': ګرځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځى،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'ګرځى' AND pashto_word NOT IN ('ګرځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځى', 31);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځى،';

-- Merge 1 variants of 'نيولو': نيولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيولو،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = 'نيولو' AND pashto_word NOT IN ('نيولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيولو', 31);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيولو،';

-- Merge 1 variants of '”ګوری': ”ګوری،

DELETE FROM word_verse_mapping WHERE pashto_word = '”ګوری،';

-- Sum frequencies from all variants: 31 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 31
WHERE pashto_word = '”ګوری' AND pashto_word NOT IN ('”ګوری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”ګوری', 31);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”ګوری،';

-- Merge 3 variants of 'مه': مه،, مه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مه!';

-- Sum frequencies from all variants: 51 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 51
WHERE pashto_word = 'مه' AND pashto_word NOT IN ('مه،','مه.','مه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مه', 51);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مه،';
DELETE FROM word_frequencies WHERE pashto_word = 'مه.';
DELETE FROM word_frequencies WHERE pashto_word = 'مه!';

-- Merge 1 variants of 'ښځو': ښځو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښځو،';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'ښځو' AND pashto_word NOT IN ('ښځو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښځو', 30);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښځو،';

-- Merge 2 variants of 'افسوس': افسوس،, افسوس.

DELETE FROM word_verse_mapping WHERE pashto_word = 'افسوس،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'افسوس.';

-- Sum frequencies from all variants: 37 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 37
WHERE pashto_word = 'افسوس' AND pashto_word NOT IN ('افسوس،','افسوس.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('افسوس', 37);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'افسوس،';
DELETE FROM word_frequencies WHERE pashto_word = 'افسوس.';

-- Merge 2 variants of 'ورسېدو': ورسېدو،, ورسېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدو.';

-- Sum frequencies from all variants: 59 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 59
WHERE pashto_word = 'ورسېدو' AND pashto_word NOT IN ('ورسېدو،','ورسېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدو', 59);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدو.';

-- Merge 2 variants of 'بوځى': بوځى., بوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځى،';

-- Sum frequencies from all variants: 50 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 50
WHERE pashto_word = 'بوځى' AND pashto_word NOT IN ('بوځى.','بوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځى', 50);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځى،';

-- Merge 1 variants of 'اِبراهيم': اِبراهيم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِبراهيم،';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'اِبراهيم' AND pashto_word NOT IN ('اِبراهيم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِبراهيم', 30);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِبراهيم،';

-- Merge 1 variants of 'وکړي': وکړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړي.»';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'وکړي' AND pashto_word NOT IN ('وکړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړي', 29);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړي.»';

-- Merge 2 variants of 'راوړو': راوړو., راوړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړو،';

-- Sum frequencies from all variants: 46 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 46
WHERE pashto_word = 'راوړو' AND pashto_word NOT IN ('راوړو.','راوړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړو', 46);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړو،';

-- Merge 3 variants of 'وژغوري': وژغوري., وژغوري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوري.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوري.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغوري،';

-- Sum frequencies from all variants: 41 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 41
WHERE pashto_word = 'وژغوري' AND pashto_word NOT IN ('وژغوري.','وژغوري.»','وژغوري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژغوري', 41);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوري.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوري.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغوري،';

-- Merge 2 variants of 'وليدو': وليدو،, وليدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وليدو.';

-- Sum frequencies from all variants: 50 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 50
WHERE pashto_word = 'وليدو' AND pashto_word NOT IN ('وليدو،','وليدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدو', 50);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وليدو.';

-- Merge 2 variants of 'کښېناستو': کښېناستو., کښېناستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناستو،';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'کښېناستو' AND pashto_word NOT IN ('کښېناستو.','کښېناستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناستو', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناستو،';

-- Merge 1 variants of 'يعنې': يعنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يعنې،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'يعنې' AND pashto_word NOT IN ('يعنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يعنې', 29);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يعنې،';

-- Merge 1 variants of 'زۀ': زۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زۀ،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'زۀ' AND pashto_word NOT IN ('زۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زۀ', 29);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زۀ،';

-- Merge 1 variants of '”اُستاذه': ”اُستاذه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”اُستاذه،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = '”اُستاذه' AND pashto_word NOT IN ('”اُستاذه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”اُستاذه', 29);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”اُستاذه،';

-- Merge 2 variants of 'راوړ': راوړ., راوړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړ.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړ،';

-- Sum frequencies from all variants: 43 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 43
WHERE pashto_word = 'راوړ' AND pashto_word NOT IN ('راوړ.','راوړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړ', 43);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړ.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړ،';

-- Merge 3 variants of 'کولای': کولای., کولای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولای.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کولای،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کولای.»';

-- Sum frequencies from all variants: 46 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 46
WHERE pashto_word = 'کولای' AND pashto_word NOT IN ('کولای.','کولای،','کولای.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولای', 46);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولای.';
DELETE FROM word_frequencies WHERE pashto_word = 'کولای،';
DELETE FROM word_frequencies WHERE pashto_word = 'کولای.»';

-- Merge 2 variants of 'پلار': پلار،, پلار.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پلار،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پلار.';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'پلار' AND pashto_word NOT IN ('پلار،','پلار.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پلار', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پلار،';
DELETE FROM word_frequencies WHERE pashto_word = 'پلار.';

-- Merge 1 variants of 'اوس': اوس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوس،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'اوس' AND pashto_word NOT IN ('اوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوس', 28);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوس،';

-- Merge 3 variants of 'لورې': لورې،, لورې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لورې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لورې.';
DELETE FROM word_verse_mapping WHERE pashto_word = '«لورې،';

-- Sum frequencies from all variants: 41 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 41
WHERE pashto_word = 'لورې' AND pashto_word NOT IN ('لورې،','لورې.','«لورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لورې', 41);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لورې،';
DELETE FROM word_frequencies WHERE pashto_word = 'لورې.';
DELETE FROM word_frequencies WHERE pashto_word = '«لورې،';

-- Merge 1 variants of 'ګورى': ګورى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګورى،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'ګورى' AND pashto_word NOT IN ('ګورى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورى', 28);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګورى،';

-- Merge 1 variants of 'پرېږدى': پرېږدى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدى،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'پرېږدى' AND pashto_word NOT IN ('پرېږدى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدى', 28);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدى،';

-- Merge 1 variants of 'يرېږی': يرېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږی،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'يرېږی' AND pashto_word NOT IN ('يرېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږی', 28);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږی،';

-- Merge 2 variants of 'لاړه': لاړه،, لاړه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړه.';

-- Sum frequencies from all variants: 48 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 48
WHERE pashto_word = 'لاړه' AND pashto_word NOT IN ('لاړه،','لاړه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړه', 48);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړه،';
DELETE FROM word_frequencies WHERE pashto_word = 'لاړه.';

-- Merge 2 variants of 'ولیدله': ولیدله،, ولیدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدله.';

-- Sum frequencies from all variants: 43 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 43
WHERE pashto_word = 'ولیدله' AND pashto_word NOT IN ('ولیدله،','ولیدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیدله', 43);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدله،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدله.';

-- Merge 2 variants of 'ولري': ولري،, ولري.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولري،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولري.»';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'ولري' AND pashto_word NOT IN ('ولري،','ولري.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولري', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولري،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولري.»';

-- Merge 2 variants of 'اوسېده': اوسېده., اوسېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېده،';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'اوسېده' AND pashto_word NOT IN ('اوسېده.','اوسېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېده', 36);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېده،';

-- Merge 2 variants of 'راوځى': راوځى., راوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوځى،';

-- Sum frequencies from all variants: 44 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 44
WHERE pashto_word = 'راوځى' AND pashto_word NOT IN ('راوځى.','راوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوځى', 44);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوځى،';

-- Merge 1 variants of 'يهوداه': يهوداه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يهوداه،';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'يهوداه' AND pashto_word NOT IN ('يهوداه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يهوداه', 27);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يهوداه،';

-- Merge 2 variants of 'واوسیږي': واوسیږي., واوسیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسیږي،';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'واوسیږي' AND pashto_word NOT IN ('واوسیږي.','واوسیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوسیږي', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوسیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'واوسیږي،';

-- Merge 2 variants of 'وهلې': وهلې،, وهلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وهلې.';

-- Sum frequencies from all variants: 49 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 49
WHERE pashto_word = 'وهلې' AND pashto_word NOT IN ('وهلې،','وهلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهلې', 49);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'وهلې.';

-- Merge 1 variants of 'قومونو': قومونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قومونو،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'قومونو' AND pashto_word NOT IN ('قومونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قومونو', 26);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قومونو،';

-- Merge 1 variants of 'وروستو': وروستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروستو،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'وروستو' AND pashto_word NOT IN ('وروستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروستو', 26);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروستو،';

-- Merge 2 variants of 'يرېږه': يرېږه،, يرېږه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږه.';

-- Sum frequencies from all variants: 44 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 44
WHERE pashto_word = 'يرېږه' AND pashto_word NOT IN ('يرېږه،','يرېږه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږه', 44);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږه،';
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږه.';

-- Merge 1 variants of 'محبوبې': محبوبې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'محبوبې،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'محبوبې' AND pashto_word NOT IN ('محبوبې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('محبوبې', 26);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'محبوبې،';

-- Merge 2 variants of 'ينه': ينه،, ينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ينه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ينه.';

-- Sum frequencies from all variants: 40 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 40
WHERE pashto_word = 'ينه' AND pashto_word NOT IN ('ينه،','ينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ينه', 40);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ينه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ينه.';

-- Merge 1 variants of 'بچو': بچو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بچو،';

-- Sum frequencies from all variants: 26 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 26
WHERE pashto_word = 'بچو' AND pashto_word NOT IN ('بچو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بچو', 26);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بچو،';

-- Merge 2 variants of 'ورکاوه': ورکاوه., ورکاوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکاوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکاوه،';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'ورکاوه' AND pashto_word NOT IN ('ورکاوه.','ورکاوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکاوه', 36);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکاوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکاوه،';

-- Merge 3 variants of 'ووایي': ووایي., ووایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایي.»';

-- Sum frequencies from all variants: 39 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 39
WHERE pashto_word = 'ووایي' AND pashto_word NOT IN ('ووایي.','ووایي،','ووایي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایي', 39);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایي.»';

-- Merge 2 variants of 'وویل': وویل., وویل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وویل،';

-- Sum frequencies from all variants: 40 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 40
WHERE pashto_word = 'وویل' AND pashto_word NOT IN ('وویل.','وویل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویل', 40);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وویل،';

-- Merge 2 variants of 'حال': حال!, حال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حال!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'حال،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'حال' AND pashto_word NOT IN ('حال!','حال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حال', 34);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حال!';
DELETE FROM word_frequencies WHERE pashto_word = 'حال،';

-- Merge 2 variants of 'وژړل': وژړل., وژړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژړل،';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'وژړل' AND pashto_word NOT IN ('وژړل.','وژړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژړل', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژړل،';

-- Merge 2 variants of 'دوستانو': دوستانو،, دوستانو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'دوستانو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دوستانو!';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'دوستانو' AND pashto_word NOT IN ('دوستانو،','دوستانو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دوستانو', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دوستانو،';
DELETE FROM word_frequencies WHERE pashto_word = 'دوستانو!';

-- Merge 2 variants of 'ګډې': ګډې،, ګډې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډې.';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'ګډې' AND pashto_word NOT IN ('ګډې،','ګډې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډې', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګډې.';

-- Merge 1 variants of 'پاڅېدو': پاڅېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېدو،';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'پاڅېدو' AND pashto_word NOT IN ('پاڅېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېدو', 25);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېدو،';

-- Merge 2 variants of 'هم': هم،, هم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'هم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هم.';

-- Sum frequencies from all variants: 37 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 37
WHERE pashto_word = 'هم' AND pashto_word NOT IN ('هم،','هم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هم', 37);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هم،';
DELETE FROM word_frequencies WHERE pashto_word = 'هم.';

-- Merge 2 variants of 'اُستاذه': اُستاذه،, اُستاذه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اُستاذه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اُستاذه.';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'اُستاذه' AND pashto_word NOT IN ('اُستاذه،','اُستاذه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اُستاذه', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اُستاذه،';
DELETE FROM word_frequencies WHERE pashto_word = 'اُستاذه.';

-- Merge 3 variants of 'کوو': کوو., کوو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوو.»';

-- Sum frequencies from all variants: 48 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 48
WHERE pashto_word = 'کوو' AND pashto_word NOT IN ('کوو.','کوو،','کوو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوو', 48);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کوو،';
DELETE FROM word_frequencies WHERE pashto_word = 'کوو.»';

-- Merge 2 variants of 'وساته': وساته., وساته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساته.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساته،';

-- Sum frequencies from all variants: 37 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 37
WHERE pashto_word = 'وساته' AND pashto_word NOT IN ('وساته.','وساته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساته', 37);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساته.';
DELETE FROM word_frequencies WHERE pashto_word = 'وساته،';

-- Merge 2 variants of 'راوغوښتل': راوغوښتل., راوغوښتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتل،';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'راوغوښتل' AND pashto_word NOT IN ('راوغوښتل.','راوغوښتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښتل', 38);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتل،';

-- Merge 2 variants of 'راووتل': راووتل., راووتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتل،';

-- Sum frequencies from all variants: 39 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 39
WHERE pashto_word = 'راووتل' AND pashto_word NOT IN ('راووتل.','راووتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتل', 39);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتل،';

-- Merge 2 variants of 'راوستل': راوستل., راوستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستل،';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'راوستل' AND pashto_word NOT IN ('راوستل.','راوستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستل', 36);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستل،';

-- Merge 4 variants of 'استاذه': «استاذه،, استاذه!

DELETE FROM word_verse_mapping WHERE pashto_word = '«استاذه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'استاذه!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'استاذه،';
DELETE FROM word_verse_mapping WHERE pashto_word = '«استاذه!»';

-- Sum frequencies from all variants: 52 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 52
WHERE pashto_word = 'استاذه' AND pashto_word NOT IN ('«استاذه،','استاذه!','استاذه،','«استاذه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استاذه', 52);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '«استاذه،';
DELETE FROM word_frequencies WHERE pashto_word = 'استاذه!';
DELETE FROM word_frequencies WHERE pashto_word = 'استاذه،';
DELETE FROM word_frequencies WHERE pashto_word = '«استاذه!»';

-- Merge 2 variants of 'غواړم': غواړم،, غواړم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړم.';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'غواړم' AND pashto_word NOT IN ('غواړم،','غواړم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړم', 38);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړم،';
DELETE FROM word_frequencies WHERE pashto_word = 'غواړم.';

-- Merge 2 variants of 'يريږى': يريږى., يريږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يريږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يريږى،';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = 'يريږى' AND pashto_word NOT IN ('يريږى.','يريږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يريږى', 47);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يريږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'يريږى،';

-- Merge 2 variants of 'څښی': څښی., څښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښی،';

-- Sum frequencies from all variants: 45 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 45
WHERE pashto_word = 'څښی' AND pashto_word NOT IN ('څښی.','څښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښی', 45);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښی.';
DELETE FROM word_frequencies WHERE pashto_word = 'څښی،';

-- Merge 2 variants of 'واورېدلې': واورېدلې،, واورېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدلې.';

-- Sum frequencies from all variants: 32 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 32
WHERE pashto_word = 'واورېدلې' AND pashto_word NOT IN ('واورېدلې،','واورېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېدلې', 32);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدلې.';

-- Merge 2 variants of 'تلل': تلل., تلل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تلل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تلل،';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'تلل' AND pashto_word NOT IN ('تلل.','تلل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تلل', 38);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تلل.';
DELETE FROM word_frequencies WHERE pashto_word = 'تلل،';

-- Merge 3 variants of 'کېږدي': کېږدي., کېږدي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېږدي.»';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'کېږدي' AND pashto_word NOT IN ('کېږدي.','کېږدي،','کېږدي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېږدي', 34);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدي.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدي،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېږدي.»';

-- Merge 1 variants of 'وينى': وينى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وينى،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'وينى' AND pashto_word NOT IN ('وينى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينى', 23);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وينى،';

-- Merge 2 variants of 'له': له،, له.

DELETE FROM word_verse_mapping WHERE pashto_word = 'له،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'له.';

-- Sum frequencies from all variants: 30 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 30
WHERE pashto_word = 'له' AND pashto_word NOT IN ('له،','له.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('له', 30);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'له،';
DELETE FROM word_frequencies WHERE pashto_word = 'له.';

-- Merge 1 variants of 'نامه': نامه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نامه،';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'نامه' AND pashto_word NOT IN ('نامه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نامه', 23);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نامه،';

-- Merge 4 variants of 'باندې': باندې،, باندې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'باندې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'باندې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'باندې!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'باندې!»';

-- Sum frequencies from all variants: 49 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 49
WHERE pashto_word = 'باندې' AND pashto_word NOT IN ('باندې،','باندې.','باندې!','باندې!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باندې', 49);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باندې،';
DELETE FROM word_frequencies WHERE pashto_word = 'باندې.';
DELETE FROM word_frequencies WHERE pashto_word = 'باندې!';
DELETE FROM word_frequencies WHERE pashto_word = 'باندې!»';

-- Merge 2 variants of 'شولو': شولو., شولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شولو،';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'شولو' AND pashto_word NOT IN ('شولو.','شولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شولو', 36);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'شولو،';

-- Merge 2 variants of 'بوتلم': بوتلم., بوتلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلم،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'بوتلم' AND pashto_word NOT IN ('بوتلم.','بوتلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتلم', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلم.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلم،';

-- Merge 3 variants of 'ورسوي': ورسوي., ورسوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوي.»';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'ورسوي' AND pashto_word NOT IN ('ورسوي.','ورسوي،','ورسوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوي', 36);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوي،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوي.»';

-- Merge 2 variants of 'وښودل': وښودل., وښودل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودل،';

-- Sum frequencies from all variants: 28 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 28
WHERE pashto_word = 'وښودل' AND pashto_word NOT IN ('وښودل.','وښودل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښودل', 28);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښودل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وښودل،';

-- Merge 2 variants of 'کېده': کېده., کېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېده،';

-- Sum frequencies from all variants: 42 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 42
WHERE pashto_word = 'کېده' AND pashto_word NOT IN ('کېده.','کېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېده', 42);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېده،';

-- Merge 1 variants of 'آفسران': آفسران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آفسران،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'آفسران' AND pashto_word NOT IN ('آفسران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آفسران', 22);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آفسران،';

-- Merge 2 variants of 'اِمامانو': اِمامانو،, اِمامانو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِمامانو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اِمامانو.';

-- Sum frequencies from all variants: 24 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 24
WHERE pashto_word = 'اِمامانو' AND pashto_word NOT IN ('اِمامانو،','اِمامانو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِمامانو', 24);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِمامانو،';
DELETE FROM word_frequencies WHERE pashto_word = 'اِمامانو.';

-- Merge 1 variants of 'اورى': اورى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورى،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'اورى' AND pashto_word NOT IN ('اورى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورى', 22);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورى،';

-- Merge 1 variants of 'وروڼو': وروڼو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروڼو،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وروڼو' AND pashto_word NOT IN ('وروڼو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروڼو', 22);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروڼو،';

-- Merge 1 variants of 'وينه': وينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وينه،';

-- Sum frequencies from all variants: 22 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 22
WHERE pashto_word = 'وينه' AND pashto_word NOT IN ('وينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينه', 22);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وينه،';

-- Merge 2 variants of 'کېښود': کېښود., کېښود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښود.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښود،';

-- Sum frequencies from all variants: 29 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 29
WHERE pashto_word = 'کېښود' AND pashto_word NOT IN ('کېښود.','کېښود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښود', 29);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښود.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښود،';

-- Merge 2 variants of 'واورېدله': واورېدله،, واورېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدله.';

-- Sum frequencies from all variants: 27 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 27
WHERE pashto_word = 'واورېدله' AND pashto_word NOT IN ('واورېدله،','واورېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېدله', 27);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدله،';
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدله.';

-- Merge 2 variants of 'رسیږي': رسیږي., رسیږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسیږي.»';

-- Sum frequencies from all variants: 23 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 23
WHERE pashto_word = 'رسیږي' AND pashto_word NOT IN ('رسیږي.','رسیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسیږي', 23);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسیږي.»';

-- Merge 4 variants of 'اوسه': اوسه،, اوسه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسه!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسه.»';

-- Sum frequencies from all variants: 43 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 43
WHERE pashto_word = 'اوسه' AND pashto_word NOT IN ('اوسه،','اوسه.','اوسه!','اوسه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسه', 43);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسه،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسه.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسه!';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسه.»';

-- Merge 1 variants of 'خلق': خلق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلق،';

-- Sum frequencies from all variants: 21 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 21
WHERE pashto_word = 'خلق' AND pashto_word NOT IN ('خلق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلق', 21);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلق،';

-- Merge 2 variants of 'غواړې': غواړې،, غواړې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړې.';

-- Sum frequencies from all variants: 25 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 25
WHERE pashto_word = 'غواړې' AND pashto_word NOT IN ('غواړې،','غواړې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړې', 25);
