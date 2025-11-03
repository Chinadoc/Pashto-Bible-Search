
-- Merge 1 variants of 'عنه': عنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عنه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عنه' AND pashto_word NOT IN ('عنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عنه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عنه،';

-- Merge 1 variants of 'دیشون': دیشون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دیشون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دیشون' AND pashto_word NOT IN ('دیشون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دیشون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دیشون،';

-- Merge 1 variants of 'دیشان': دیشان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دیشان.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دیشان' AND pashto_word NOT IN ('دیشان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دیشان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دیشان.';

-- Merge 1 variants of 'راوباسى': راوباسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوباسى،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوباسى' AND pashto_word NOT IN ('راوباسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوباسى', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسى،';

-- Merge 1 variants of 'واړوم': واړوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واړوم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واړوم' AND pashto_word NOT IN ('واړوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واړوم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واړوم،';

-- Merge 2 variants of 'ورکول': ورکول،, ورکول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکول،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکول.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورکول' AND pashto_word NOT IN ('ورکول،','ورکول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکول', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکول،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکول.';

-- Merge 1 variants of 'ځوانانو': ځوانانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوانانو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ځوانانو' AND pashto_word NOT IN ('ځوانانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوانانو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوانانو،';

-- Merge 1 variants of 'راوکاږم': راوکاږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوکاږم.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوکاږم' AND pashto_word NOT IN ('راوکاږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوکاږم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوکاږم.';

-- Merge 1 variants of 'شُهرت': شُهرت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شُهرت،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شُهرت' AND pashto_word NOT IN ('شُهرت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شُهرت', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شُهرت،';

-- Merge 1 variants of 'بې‌شکه': بې‌شکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بې‌شکه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بې‌شکه' AND pashto_word NOT IN ('بې‌شکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بې‌شکه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بې‌شکه،';

-- Merge 2 variants of 'راولېږم': راولېږم., راولېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږم،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راولېږم' AND pashto_word NOT IN ('راولېږم.','راولېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږم،';

-- Merge 1 variants of 'عقرون': عقرون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عقرون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عقرون' AND pashto_word NOT IN ('عقرون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عقرون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عقرون،';

-- Merge 1 variants of 'وتښتېدلو': وتښتېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېدلو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وتښتېدلو' AND pashto_word NOT IN ('وتښتېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتېدلو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېدلو.';

-- Merge 2 variants of 'ولګوم': ولګوم., ولګوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوم،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ولګوم' AND pashto_word NOT IN ('ولګوم.','ولګوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوم', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوم،';

-- Merge 2 variants of 'دانه': دانه،, دانه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دانه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دانه.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'دانه' AND pashto_word NOT IN ('دانه،','دانه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دانه', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دانه،';
DELETE FROM word_frequencies WHERE pashto_word = 'دانه.';

-- Merge 1 variants of 'لاس': لاس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاس،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لاس' AND pashto_word NOT IN ('لاس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاس', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاس،';

-- Merge 1 variants of 'ښارونو': ښارونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښارونو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ښارونو' AND pashto_word NOT IN ('ښارونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښارونو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښارونو،';

-- Merge 2 variants of 'ومنلو': ومنلو., ومنلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ومنلو' AND pashto_word NOT IN ('ومنلو.','ومنلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومنلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومنلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ومنلو،';

-- Merge 1 variants of 'واوروله': واوروله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوروله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واوروله' AND pashto_word NOT IN ('واوروله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوروله', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوروله.';

-- Merge 1 variants of 'آفسر': آفسر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آفسر،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'آفسر' AND pashto_word NOT IN ('آفسر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آفسر', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آفسر،';

-- Merge 1 variants of 'وګورې': وګورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګورې' AND pashto_word NOT IN ('وګورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګورې،';

-- Merge 2 variants of 'ځُو': ځُو., ځُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځُو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ځُو' AND pashto_word NOT IN ('ځُو.','ځُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځُو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځُو،';

-- Merge 1 variants of 'لعنت': لعنت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لعنت،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لعنت' AND pashto_word NOT IN ('لعنت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لعنت', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لعنت،';

-- Merge 1 variants of 'راوچتيږى': راوچتيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوچتيږى،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوچتيږى' AND pashto_word NOT IN ('راوچتيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوچتيږى', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوچتيږى،';

-- Merge 1 variants of 'يهض': يهض،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يهض،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'يهض' AND pashto_word NOT IN ('يهض،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يهض', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يهض،';

-- Merge 1 variants of 'راوغورزول': راوغورزول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزول.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوغورزول' AND pashto_word NOT IN ('راوغورزول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزول', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزول.';

-- Merge 1 variants of 'پيالۍ': پيالۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پيالۍ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پيالۍ' AND pashto_word NOT IN ('پيالۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پيالۍ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پيالۍ،';

-- Merge 2 variants of 'پرېښودلو': پرېښودلو., پرېښودلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پرېښودلو' AND pashto_word NOT IN ('پرېښودلو.','پرېښودلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودلو،';

-- Merge 1 variants of 'استعمالوې': استعمالوې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالوې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'استعمالوې' AND pashto_word NOT IN ('استعمالوې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعمالوې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالوې.';

-- Merge 1 variants of 'حاصليږى': حاصليږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاصليږى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حاصليږى' AND pashto_word NOT IN ('حاصليږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاصليږى', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاصليږى.';

-- Merge 1 variants of 'پټوم': پټوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټوم.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پټوم' AND pashto_word NOT IN ('پټوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټوم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټوم.';

-- Merge 2 variants of 'بوځې': بوځې., بوځې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوځې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'بوځې' AND pashto_word NOT IN ('بوځې.','بوځې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوځې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوځې.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوځې،';

-- Merge 2 variants of 'پرېوځى': پرېوځى., پرېوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوځى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پرېوځى' AND pashto_word NOT IN ('پرېوځى.','پرېوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوځى', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوځى،';

-- Merge 1 variants of 'اوښان': اوښان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوښان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اوښان' AND pashto_word NOT IN ('اوښان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوښان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوښان،';

-- Merge 2 variants of 'راوروى': راوروى., راوروى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوروى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوروى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راوروى' AND pashto_word NOT IN ('راوروى.','راوروى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوروى', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوروى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوروى،';

-- Merge 1 variants of 'سپوږمۍ': سپوږمۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سپوږمۍ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'سپوږمۍ' AND pashto_word NOT IN ('سپوږمۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سپوږمۍ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سپوږمۍ،';

-- Merge 1 variants of 'حاصور': حاصور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاصور،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حاصور' AND pashto_word NOT IN ('حاصور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاصور', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاصور،';

-- Merge 1 variants of 'اشدود': اشدود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اشدود،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اشدود' AND pashto_word NOT IN ('اشدود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اشدود', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اشدود،';

-- Merge 1 variants of 'معون': معون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'معون' AND pashto_word NOT IN ('معون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معون،';

-- Merge 1 variants of 'کاهن': کاهن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاهن،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کاهن' AND pashto_word NOT IN ('کاهن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاهن', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاهن،';

-- Merge 1 variants of 'عبدون': عبدون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عبدون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عبدون' AND pashto_word NOT IN ('عبدون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عبدون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عبدون،';

-- Merge 2 variants of 'وهل': وهل،, وهل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وهل.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وهل' AND pashto_word NOT IN ('وهل،','وهل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهل', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهل،';
DELETE FROM word_frequencies WHERE pashto_word = 'وهل.';

-- Merge 2 variants of 'وړلو': وړلو., وړلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړلو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وړلو' AND pashto_word NOT IN ('وړلو.','وړلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړلو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وړلو،';

-- Merge 1 variants of 'ورولېږله': ورولېږله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورولېږله' AND pashto_word NOT IN ('ورولېږله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولېږله', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږله.';

-- Merge 2 variants of 'راوغورزولې': راوغورزولې., راوغورزولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورزولې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راوغورزولې' AND pashto_word NOT IN ('راوغورزولې.','راوغورزولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورزولې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورزولې،';

-- Merge 2 variants of 'وشمېرل': وشمېرل., وشمېرل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشمېرل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشمېرل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وشمېرل' AND pashto_word NOT IN ('وشمېرل.','وشمېرل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشمېرل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشمېرل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشمېرل،';

-- Merge 1 variants of 'فلو': فلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فلو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'فلو' AND pashto_word NOT IN ('فلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فلو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فلو،';

-- Merge 1 variants of 'مېز': مېز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مېز،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مېز' AND pashto_word NOT IN ('مېز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مېز', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مېز،';

-- Merge 2 variants of 'ومه': ومه،, ومه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومه.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ومه' AND pashto_word NOT IN ('ومه،','ومه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومه', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ومه.';

-- Merge 1 variants of 'مارغان': مارغان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مارغان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مارغان' AND pashto_word NOT IN ('مارغان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مارغان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مارغان،';

-- Merge 1 variants of 'پوهېدل': پوهېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېدل.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پوهېدل' AND pashto_word NOT IN ('پوهېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېدل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېدل.';

-- Merge 2 variants of 'وايه': وايه،, وايه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وايه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وايه.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وايه' AND pashto_word NOT IN ('وايه،','وايه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وايه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وايه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وايه.';

-- Merge 2 variants of 'وتلو': وتلو., وتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتلو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وتلو' AND pashto_word NOT IN ('وتلو.','وتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتلو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتلو،';

-- Merge 1 variants of 'لګېدو': لګېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګېدو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لګېدو' AND pashto_word NOT IN ('لګېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګېدو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګېدو.';

-- Merge 2 variants of 'ودرولو': ودرولو., ودرولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرولو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ودرولو' AND pashto_word NOT IN ('ودرولو.','ودرولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرولو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرولو،';

-- Merge 1 variants of 'فِرعون': فِرعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فِرعون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'فِرعون' AND pashto_word NOT IN ('فِرعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فِرعون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فِرعون،';

-- Merge 1 variants of 'جيرسون': جيرسون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جيرسون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'جيرسون' AND pashto_word NOT IN ('جيرسون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جيرسون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جيرسون،';

-- Merge 1 variants of 'مرارى': مرارى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرارى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مرارى' AND pashto_word NOT IN ('مرارى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرارى', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرارى.';

-- Merge 1 variants of 'تنه': تنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تنه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'تنه' AND pashto_word NOT IN ('تنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تنه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تنه،';

-- Merge 1 variants of 'بالع': بالع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بالع،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بالع' AND pashto_word NOT IN ('بالع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بالع', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بالع،';

-- Merge 1 variants of 'دان': دان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دان' AND pashto_word NOT IN ('دان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دان،';

-- Merge 1 variants of 'راوويستلو': راوويستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستلو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوويستلو' AND pashto_word NOT IN ('راوويستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستلو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستلو،';

-- Merge 1 variants of 'ګاډۍ': ګاډۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګاډۍ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګاډۍ' AND pashto_word NOT IN ('ګاډۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګاډۍ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګاډۍ،';

-- Merge 1 variants of 'آسمان': آسمان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسمان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'آسمان' AND pashto_word NOT IN ('آسمان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسمان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسمان،';

-- Merge 1 variants of 'وازګه': وازګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وازګه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وازګه' AND pashto_word NOT IN ('وازګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وازګه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وازګه،';

-- Merge 2 variants of 'راولېږله': راولېږله،, راولېږله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږله.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راولېږله' AND pashto_word NOT IN ('راولېږله،','راولېږله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږله', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږله،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږله.';

-- Merge 1 variants of 'خو': خو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'خو' AND pashto_word NOT IN ('خو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خو،';

-- Merge 1 variants of 'ګډ': ګډ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګډ' AND pashto_word NOT IN ('ګډ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډ،';

-- Merge 1 variants of 'فينحاس': فينحاس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فينحاس،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'فينحاس' AND pashto_word NOT IN ('فينحاس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فينحاس', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فينحاس،';

-- Merge 1 variants of 'حُرمه': حُرمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حُرمه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حُرمه' AND pashto_word NOT IN ('حُرمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حُرمه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حُرمه،';

-- Merge 1 variants of 'ښکارېده': ښکارېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارېده.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ښکارېده' AND pashto_word NOT IN ('ښکارېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارېده', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارېده.';

-- Merge 2 variants of 'روان': روان., روان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روان.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'روان،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'روان' AND pashto_word NOT IN ('روان.','روان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روان', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روان.';
DELETE FROM word_frequencies WHERE pashto_word = 'روان،';

-- Merge 2 variants of 'وښودلو': وښودلو،, وښودلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وښودلو.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وښودلو' AND pashto_word NOT IN ('وښودلو،','وښودلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښودلو', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښودلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وښودلو.';

-- Merge 2 variants of 'ساؤل': ساؤل،, ساؤل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساؤل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساؤل.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ساؤل' AND pashto_word NOT IN ('ساؤل،','ساؤل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساؤل', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساؤل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ساؤل.';

-- Merge 2 variants of 'جوړوې': جوړوې., جوړوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'جوړوې' AND pashto_word NOT IN ('جوړوې.','جوړوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړوې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوې.';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوې،';

-- Merge 1 variants of 'نيوله': نيوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيوله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'نيوله' AND pashto_word NOT IN ('نيوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيوله', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيوله.';

-- Merge 1 variants of 'غوَيانو': غوَيانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوَيانو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'غوَيانو' AND pashto_word NOT IN ('غوَيانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوَيانو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوَيانو،';

-- Merge 1 variants of 'يهوسفط': يهوسفط،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يهوسفط،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'يهوسفط' AND pashto_word NOT IN ('يهوسفط،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يهوسفط', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يهوسفط،';

-- Merge 1 variants of 'سوزوله': سوزوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزوله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'سوزوله' AND pashto_word NOT IN ('سوزوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوزوله', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوزوله.';

-- Merge 1 variants of 'کوټې': کوټې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوټې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کوټې' AND pashto_word NOT IN ('کوټې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوټې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوټې،';

-- Merge 2 variants of 'منلو': منلو., منلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منلو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'منلو' AND pashto_word NOT IN ('منلو.','منلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منلو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'منلو،';

-- Merge 1 variants of 'ګاډو': ګاډو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګاډو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګاډو' AND pashto_word NOT IN ('ګاډو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګاډو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګاډو،';

-- Merge 1 variants of 'نتنى‌ايل': نتنى‌ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نتنى‌ايل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'نتنى‌ايل' AND pashto_word NOT IN ('نتنى‌ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نتنى‌ايل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نتنى‌ايل،';

-- Merge 1 variants of 'عُزياه': عُزياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُزياه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عُزياه' AND pashto_word NOT IN ('عُزياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُزياه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُزياه،';

-- Merge 1 variants of 'مسلام': مسلام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسلام،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مسلام' AND pashto_word NOT IN ('مسلام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسلام', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسلام،';

-- Merge 1 variants of 'القنه': القنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'القنه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'القنه' AND pashto_word NOT IN ('القنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('القنه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'القنه،';

-- Merge 1 variants of 'يوايل': يوايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوايل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'يوايل' AND pashto_word NOT IN ('يوايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوايل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوايل،';

-- Merge 1 variants of 'زرُبابل': زرُبابل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زرُبابل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زرُبابل' AND pashto_word NOT IN ('زرُبابل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زرُبابل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زرُبابل،';

-- Merge 1 variants of 'حکمران': حکمران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکمران،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حکمران' AND pashto_word NOT IN ('حکمران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکمران', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکمران،';

-- Merge 1 variants of 'بيامومى': بيامومى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيامومى.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بيامومى' AND pashto_word NOT IN ('بيامومى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيامومى', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيامومى.';

-- Merge 2 variants of 'راوټوکيږى': راوټوکيږى., راوټوکيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوټوکيږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوټوکيږى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راوټوکيږى' AND pashto_word NOT IN ('راوټوکيږى.','راوټوکيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوټوکيږى', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوټوکيږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوټوکيږى،';

-- Merge 1 variants of 'ورننوتو': ورننوتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوتو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورننوتو' AND pashto_word NOT IN ('ورننوتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوتو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوتو.';

-- Merge 2 variants of 'دروازه': دروازه،, دروازه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دروازه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دروازه.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'دروازه' AND pashto_word NOT IN ('دروازه،','دروازه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دروازه', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دروازه،';
DELETE FROM word_frequencies WHERE pashto_word = 'دروازه.';

-- Merge 1 variants of 'وموندلو': وموندلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموندلو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وموندلو' AND pashto_word NOT IN ('وموندلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموندلو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وموندلو.';

-- Merge 2 variants of 'وسپارلو': وسپارلو., وسپارلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپارلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسپارلو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وسپارلو' AND pashto_word NOT IN ('وسپارلو.','وسپارلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسپارلو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسپارلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسپارلو،';

-- Merge 1 variants of 'شوله': شوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوله.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شوله' AND pashto_word NOT IN ('شوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوله', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوله.';

-- Merge 2 variants of 'عزيزانو': عزيزانو،, عزيزانو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزيزانو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عزيزانو.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'عزيزانو' AND pashto_word NOT IN ('عزيزانو،','عزيزانو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزيزانو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزيزانو،';
DELETE FROM word_frequencies WHERE pashto_word = 'عزيزانو.';

-- Merge 1 variants of 'عمونیانو': عمونیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عمونیانو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عمونیانو' AND pashto_word NOT IN ('عمونیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عمونیانو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عمونیانو،';

-- Merge 1 variants of 'الیفلط': الیفلط،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیفلط،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'الیفلط' AND pashto_word NOT IN ('الیفلط،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیفلط', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیفلط،';

-- Merge 1 variants of 'ځایونو': ځایونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځایونو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ځایونو' AND pashto_word NOT IN ('ځایونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځایونو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځایونو،';

-- Merge 1 variants of 'یهودیه': یهودیه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یهودیه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'یهودیه' AND pashto_word NOT IN ('یهودیه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یهودیه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یهودیه،';

-- Merge 2 variants of 'نیولی': نیولی., نیولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیولی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نیولی،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'نیولی' AND pashto_word NOT IN ('نیولی.','نیولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیولی', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیولی.';
DELETE FROM word_frequencies WHERE pashto_word = 'نیولی،';

-- Merge 1 variants of 'تیمان': تیمان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تیمان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'تیمان' AND pashto_word NOT IN ('تیمان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تیمان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تیمان،';

-- Merge 1 variants of 'یزرعیل': یزرعیل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یزرعیل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'یزرعیل' AND pashto_word NOT IN ('یزرعیل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یزرعیل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یزرعیل،';

-- Merge 1 variants of 'عین': عین،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عین،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عین' AND pashto_word NOT IN ('عین،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عین', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عین،';

-- Merge 1 variants of 'ایالون': ایالون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ایالون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ایالون' AND pashto_word NOT IN ('ایالون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ایالون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ایالون،';

-- Merge 1 variants of 'راکاږی': راکاږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکاږی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راکاږی' AND pashto_word NOT IN ('راکاږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکاږی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکاږی.';

-- Merge 1 variants of 'واړوی': واړوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واړوی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واړوی' AND pashto_word NOT IN ('واړوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واړوی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واړوی.';

-- Merge 1 variants of 'پټی': پټی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پټی' AND pashto_word NOT IN ('پټی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټی،';

-- Merge 1 variants of 'زغمی': زغمی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زغمی.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زغمی' AND pashto_word NOT IN ('زغمی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زغمی', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زغمی.';

-- Merge 2 variants of 'وبخښی': وبخښی،, وبخښی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښی.';
