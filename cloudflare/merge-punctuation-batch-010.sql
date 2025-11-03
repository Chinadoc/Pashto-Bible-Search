
-- Merge 1 variants of 'سريندې': سريندې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سريندې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'سريندې' AND pashto_word NOT IN ('سريندې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سريندې', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سريندې،';

-- Merge 1 variants of 'واورېده': واورېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېده،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'واورېده' AND pashto_word NOT IN ('واورېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېده', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېده،';

-- Merge 2 variants of 'درکړو': درکړو., درکړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړو،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'درکړو' AND pashto_word NOT IN ('درکړو.','درکړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړو', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړو،';

-- Merge 1 variants of 'سیمه': سیمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سیمه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'سیمه' AND pashto_word NOT IN ('سیمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سیمه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سیمه،';

-- Merge 2 variants of 'بوتله': بوتله., بوتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'بوتله' AND pashto_word NOT IN ('بوتله.','بوتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوتله.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوتله،';

-- Merge 1 variants of 'لښکر': لښکر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لښکر،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'لښکر' AND pashto_word NOT IN ('لښکر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لښکر', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لښکر،';

-- Merge 2 variants of 'غره': غره،, غره!

DELETE FROM word_verse_mapping WHERE pashto_word = 'غره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غره!';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'غره' AND pashto_word NOT IN ('غره،','غره!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غره', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غره،';
DELETE FROM word_frequencies WHERE pashto_word = 'غره!';

-- Merge 3 variants of 'وخوره': وخوره., وخوره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوره.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوره.»';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'وخوره' AND pashto_word NOT IN ('وخوره.','وخوره،','وخوره.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوره', 16);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوره.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوره.»';

-- Merge 1 variants of 'معسیا': معسیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معسیا،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'معسیا' AND pashto_word NOT IN ('معسیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معسیا', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معسیا،';

-- Merge 2 variants of 'وساتلو': وساتلو., وساتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتلو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وساتلو' AND pashto_word NOT IN ('وساتلو.','وساتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتلو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتلو،';

-- Merge 2 variants of 'وهم': وهم،, وهم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وهم.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وهم' AND pashto_word NOT IN ('وهم،','وهم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهم', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وهم.';

-- Merge 1 variants of 'راوسته': راوسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوسته.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راوسته' AND pashto_word NOT IN ('راوسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوسته', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوسته.';

-- Merge 2 variants of 'ستا': ستا،, ستا!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ستا،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ستا!';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ستا' AND pashto_word NOT IN ('ستا،','ستا!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ستا', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ستا،';
DELETE FROM word_frequencies WHERE pashto_word = 'ستا!';

-- Merge 1 variants of 'خوروى': خوروى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوروى.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'خوروى' AND pashto_word NOT IN ('خوروى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوروى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوروى.';

-- Merge 1 variants of 'سوزولې': سوزولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزولې.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'سوزولې' AND pashto_word NOT IN ('سوزولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوزولې', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوزولې.';

-- Merge 1 variants of 'غر': غر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غر،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'غر' AND pashto_word NOT IN ('غر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غر', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غر،';

-- Merge 2 variants of 'وګرځى': وګرځى., وګرځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځى،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وګرځى' AND pashto_word NOT IN ('وګرځى.','وګرځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځى', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځى،';

-- Merge 1 variants of 'ورکړُو': ورکړُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړُو.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ورکړُو' AND pashto_word NOT IN ('ورکړُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړُو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړُو.';

-- Merge 2 variants of 'دهشت': دهشت،, دهشت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دهشت،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دهشت.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'دهشت' AND pashto_word NOT IN ('دهشت،','دهشت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دهشت', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دهشت،';
DELETE FROM word_frequencies WHERE pashto_word = 'دهشت.';

-- Merge 2 variants of 'راولېږلو': راولېږلو،, راولېږلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږلو.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'راولېږلو' AND pashto_word NOT IN ('راولېږلو،','راولېږلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږلو', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږلو.';

-- Merge 1 variants of 'زنانه': زنانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زنانه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'زنانه' AND pashto_word NOT IN ('زنانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زنانه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زنانه،';

-- Merge 1 variants of 'راغورزيږى': راغورزيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغورزيږى.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راغورزيږى' AND pashto_word NOT IN ('راغورزيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغورزيږى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغورزيږى.';

-- Merge 2 variants of 'زمکې': زمکې،, زمکې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زمکې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زمکې.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'زمکې' AND pashto_word NOT IN ('زمکې،','زمکې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زمکې', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زمکې،';
DELETE FROM word_frequencies WHERE pashto_word = 'زمکې.';

-- Merge 2 variants of 'راکوې': راکوې،, راکوې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوې.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راکوې' AND pashto_word NOT IN ('راکوې،','راکوې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوې', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکوې.';

-- Merge 1 variants of 'يوسى': يوسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوسى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'يوسى' AND pashto_word NOT IN ('يوسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوسى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوسى،';

-- Merge 1 variants of 'پټوى': پټوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پټوى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پټوى' AND pashto_word NOT IN ('پټوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پټوى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پټوى،';

-- Merge 2 variants of 'وغورزيږى': وغورزيږى،, وغورزيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزيږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزيږى.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وغورزيږى' AND pashto_word NOT IN ('وغورزيږى،','وغورزيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزيږى', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزيږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزيږى.';

-- Merge 1 variants of 'وباسى': وباسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وباسى' AND pashto_word NOT IN ('وباسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسى،';

-- Merge 1 variants of 'اوچتوى': اوچتوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوچتوى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اوچتوى' AND pashto_word NOT IN ('اوچتوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوچتوى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوچتوى،';

-- Merge 1 variants of 'ووتله': ووتله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووتله.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ووتله' AND pashto_word NOT IN ('ووتله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووتله', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووتله.';

-- Merge 2 variants of 'لور': لور،, لور.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لور،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لور.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'لور' AND pashto_word NOT IN ('لور،','لور.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لور', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لور،';
DELETE FROM word_frequencies WHERE pashto_word = 'لور.';

-- Merge 1 variants of 'حنوک': حنوک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حنوک،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'حنوک' AND pashto_word NOT IN ('حنوک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حنوک', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حنوک،';

-- Merge 2 variants of 'ښکارينه': ښکارينه., ښکارينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارينه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارينه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ښکارينه' AND pashto_word NOT IN ('ښکارينه.','ښکارينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارينه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارينه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارينه،';

-- Merge 2 variants of 'شونه': شونه., شونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شونه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شونه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'شونه' AND pashto_word NOT IN ('شونه.','شونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شونه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شونه.';
DELETE FROM word_frequencies WHERE pashto_word = 'شونه،';

-- Merge 1 variants of 'ناوې': ناوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناوې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ناوې' AND pashto_word NOT IN ('ناوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناوې', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناوې،';

-- Merge 1 variants of 'جُدا': جُدا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جُدا،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'جُدا' AND pashto_word NOT IN ('جُدا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جُدا', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جُدا،';

-- Merge 2 variants of 'وژلو': وژلو., وژلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژلو،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'وژلو' AND pashto_word NOT IN ('وژلو.','وژلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژلو', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژلو،';

-- Merge 1 variants of 'غږوى': غږوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غږوى.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'غږوى' AND pashto_word NOT IN ('غږوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غږوى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غږوى.';

-- Merge 1 variants of 'حِتيانو': حِتيانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِتيانو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'حِتيانو' AND pashto_word NOT IN ('حِتيانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِتيانو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِتيانو،';

-- Merge 1 variants of 'ليوى': ليوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليوى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ليوى' AND pashto_word NOT IN ('ليوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليوى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليوى،';

-- Merge 1 variants of 'مصالحې': مصالحې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مصالحې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'مصالحې' AND pashto_word NOT IN ('مصالحې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مصالحې', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مصالحې،';

-- Merge 1 variants of 'آسونو': آسونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسونو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'آسونو' AND pashto_word NOT IN ('آسونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسونو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسونو،';

-- Merge 2 variants of 'واخستلو': واخستلو،, واخستلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستلو.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'واخستلو' AND pashto_word NOT IN ('واخستلو،','واخستلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخستلو', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخستلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'واخستلو.';

-- Merge 1 variants of 'اِضهار': اِضهار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِضهار،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اِضهار' AND pashto_word NOT IN ('اِضهار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِضهار', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِضهار،';

-- Merge 1 variants of 'څاروو': څاروو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څاروو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'څاروو' AND pashto_word NOT IN ('څاروو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څاروو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څاروو،';

-- Merge 2 variants of 'تلو': تلو،, تلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تلو.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'تلو' AND pashto_word NOT IN ('تلو،','تلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تلو', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'تلو.';

-- Merge 1 variants of 'غله': غله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غله،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'غله' AND pashto_word NOT IN ('غله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غله', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غله،';

-- Merge 1 variants of 'وړۍ': وړۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړۍ،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وړۍ' AND pashto_word NOT IN ('وړۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړۍ', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړۍ،';

-- Merge 1 variants of 'څرمن': څرمن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څرمن،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'څرمن' AND pashto_word NOT IN ('څرمن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څرمن', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څرمن،';

-- Merge 1 variants of 'پړده': پړده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پړده،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پړده' AND pashto_word NOT IN ('پړده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پړده', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پړده،';

-- Merge 1 variants of 'ليويانو': ليويانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليويانو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ليويانو' AND pashto_word NOT IN ('ليويانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليويانو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليويانو،';

-- Merge 2 variants of 'وتښتېدو': وتښتېدو،, وتښتېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېدو.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وتښتېدو' AND pashto_word NOT IN ('وتښتېدو،','وتښتېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتېدو', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېدو.';

-- Merge 2 variants of 'ووهلو': ووهلو., ووهلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهلو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ووهلو' AND pashto_word NOT IN ('ووهلو.','ووهلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهلو', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلو،';

-- Merge 1 variants of 'صدوق': صدوق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صدوق،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'صدوق' AND pashto_word NOT IN ('صدوق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صدوق', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صدوق،';

-- Merge 1 variants of 'حِکمت': حِکمت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِکمت،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'حِکمت' AND pashto_word NOT IN ('حِکمت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِکمت', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِکمت،';

-- Merge 1 variants of 'اوسى': اوسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اوسى' AND pashto_word NOT IN ('اوسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسى،';

-- Merge 1 variants of 'سلوم': سلوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سلوم،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'سلوم' AND pashto_word NOT IN ('سلوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلوم', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سلوم،';

-- Merge 1 variants of 'زکرياه': زکرياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زکرياه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'زکرياه' AND pashto_word NOT IN ('زکرياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زکرياه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زکرياه،';

-- Merge 1 variants of 'دولت': دولت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دولت،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'دولت' AND pashto_word NOT IN ('دولت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دولت', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دولت،';

-- Merge 1 variants of 'مُنافقانو': مُنافقانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُنافقانو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'مُنافقانو' AND pashto_word NOT IN ('مُنافقانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُنافقانو', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُنافقانو،';

-- Merge 1 variants of 'او': او،

DELETE FROM word_verse_mapping WHERE pashto_word = 'او،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'او' AND pashto_word NOT IN ('او،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('او', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'او،';

-- Merge 1 variants of 'یعقوبه': یعقوبه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یعقوبه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یعقوبه' AND pashto_word NOT IN ('یعقوبه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یعقوبه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یعقوبه،';

-- Merge 1 variants of 'اندریاس': اندریاس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اندریاس،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اندریاس' AND pashto_word NOT IN ('اندریاس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اندریاس', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اندریاس،';

-- Merge 1 variants of 'وښایم': وښایم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وښایم.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وښایم' AND pashto_word NOT IN ('وښایم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وښایم', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وښایم.';

-- Merge 2 variants of 'ووینم': ووینم., ووینم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینم،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ووینم' AND pashto_word NOT IN ('ووینم.','ووینم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینم', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووینم،';

-- Merge 1 variants of 'یوتام': یوتام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوتام،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یوتام' AND pashto_word NOT IN ('یوتام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوتام', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوتام،';

-- Merge 1 variants of 'مسیح': مسیح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسیح،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'مسیح' AND pashto_word NOT IN ('مسیح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسیح', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسیح،';

-- Merge 1 variants of 'یریموت': یریموت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یریموت،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یریموت' AND pashto_word NOT IN ('یریموت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یریموت', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یریموت،';

-- Merge 1 variants of 'اموریان': اموریان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اموریان،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'اموریان' AND pashto_word NOT IN ('اموریان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اموریان', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اموریان،';

-- Merge 1 variants of 'یساکار': یساکار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یساکار،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'یساکار' AND pashto_word NOT IN ('یساکار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یساکار', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یساکار،';

-- Merge 1 variants of 'نارینه': نارینه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نارینه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'نارینه' AND pashto_word NOT IN ('نارینه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نارینه', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نارینه،';

-- Merge 1 variants of 'کاڼی': کاڼی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاڼی،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کاڼی' AND pashto_word NOT IN ('کاڼی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاڼی', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاڼی،';

-- Merge 1 variants of 'خوشحالوی': خوشحالوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالوی.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'خوشحالوی' AND pashto_word NOT IN ('خوشحالوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالوی', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالوی.';

-- Merge 2 variants of 'ولګوی': ولګوی،, ولګوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوی.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ولګوی' AND pashto_word NOT IN ('ولګوی،','ولګوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوی', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوی.';

-- Merge 1 variants of 'زیاتوی': زیاتوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زیاتوی.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'زیاتوی' AND pashto_word NOT IN ('زیاتوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زیاتوی', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زیاتوی.';

-- Merge 2 variants of 'وتړی': وتړی،, وتړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړی.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وتړی' AND pashto_word NOT IN ('وتړی،','وتړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتړی', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وتړی.';

-- Merge 2 variants of 'اغوندی': اغوندی،, اغوندی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اغوندی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اغوندی.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اغوندی' AND pashto_word NOT IN ('اغوندی،','اغوندی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اغوندی', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اغوندی،';
DELETE FROM word_frequencies WHERE pashto_word = 'اغوندی.';

-- Merge 1 variants of 'وهلی': وهلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهلی،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وهلی' AND pashto_word NOT IN ('وهلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهلی', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهلی،';

-- Merge 1 variants of 'وپېژنی': وپېژنی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژنی.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وپېژنی' AND pashto_word NOT IN ('وپېژنی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژنی', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژنی.';

-- Merge 2 variants of 'ورکولی': ورکولی., ورکولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ورکولی' AND pashto_word NOT IN ('ورکولی.','ورکولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکولی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولی،';

-- Merge 1 variants of 'لویى': لویى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لویى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'لویى' AND pashto_word NOT IN ('لویى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لویى', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لویى،';

-- Merge 3 variants of 'راکړی': راکړی., راکړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړی.»';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'راکړی' AND pashto_word NOT IN ('راکړی.','راکړی،','راکړی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړی', 20);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړی.»';

-- Merge 1 variants of '”وګوری': ”وګوری،

DELETE FROM word_verse_mapping WHERE pashto_word = '”وګوری،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = '”وګوری' AND pashto_word NOT IN ('”وګوری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”وګوری', 8);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”وګوری،';

-- Merge 1 variants of 'جرشون': جرشون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جرشون،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'جرشون' AND pashto_word NOT IN ('جرشون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جرشون', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جرشون،';

-- Merge 1 variants of 'ناداب': ناداب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناداب،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ناداب' AND pashto_word NOT IN ('ناداب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناداب', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناداب،';

-- Merge 1 variants of 'شمعي': شمعي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمعي،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'شمعي' AND pashto_word NOT IN ('شمعي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمعي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمعي،';

-- Merge 1 variants of 'مرایوت': مرایوت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرایوت،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'مرایوت' AND pashto_word NOT IN ('مرایوت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرایوت', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرایوت،';

-- Merge 1 variants of 'اسیر': اسیر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسیر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اسیر' AND pashto_word NOT IN ('اسیر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسیر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسیر،';

-- Merge 2 variants of 'تېروو': تېروو., تېروو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېروو،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'تېروو' AND pashto_word NOT IN ('تېروو.','تېروو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروو.';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروو،';

-- Merge 2 variants of 'ورسوم': ورسوم., ورسوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوم،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ورسوم' AND pashto_word NOT IN ('ورسوم.','ورسوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوم', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوم،';

-- Merge 1 variants of 'راورسېده': راورسېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېده،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راورسېده' AND pashto_word NOT IN ('راورسېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسېده', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېده،';

-- Merge 1 variants of 'اسمان': اسمان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسمان،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اسمان' AND pashto_word NOT IN ('اسمان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسمان', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسمان،';

-- Merge 2 variants of 'ورسوله': ورسوله., ورسوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوله،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورسوله' AND pashto_word NOT IN ('ورسوله.','ورسوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوله', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوله،';

-- Merge 2 variants of 'تېرېدل': تېرېدل،, تېرېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېدل.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'تېرېدل' AND pashto_word NOT IN ('تېرېدل،','تېرېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرېدل', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېدل.';

-- Merge 1 variants of 'ژوند': ژوند،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژوند،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ژوند' AND pashto_word NOT IN ('ژوند،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژوند', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژوند،';

-- Merge 1 variants of 'ووځي': ووځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووځي.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ووځي' AND pashto_word NOT IN ('ووځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووځي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووځي.';

-- Merge 2 variants of 'ویل': ویل., ویل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ویل،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ویل' AND pashto_word NOT IN ('ویل.','ویل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ویل،';

-- Merge 3 variants of 'وژغورم': وژغورم., وژغورم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورم.»';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وژغورم' AND pashto_word NOT IN ('وژغورم.','وژغورم،','وژغورم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژغورم', 13);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورم.»';

-- Merge 2 variants of 'لګېده': لګېده., لګېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لګېده،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'لګېده' AND pashto_word NOT IN ('لګېده.','لګېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګېده', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'لګېده،';

-- Merge 1 variants of 'ورشي': ورشي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورشي.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ورشي' AND pashto_word NOT IN ('ورشي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورشي', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورشي.';

-- Merge 2 variants of 'ننوت': ننوت،, ننوت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوت،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوت.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ننوت' AND pashto_word NOT IN ('ننوت،','ننوت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوت', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوت،';
DELETE FROM word_frequencies WHERE pashto_word = 'ننوت.';

-- Merge 3 variants of 'وبخښي': وبخښي., وبخښي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښي،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وبخښي' AND pashto_word NOT IN ('وبخښي.','وبخښي.»','وبخښي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبخښي', 12);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښي،';

-- Merge 1 variants of 'خوا': خوا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوا،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'خوا' AND pashto_word NOT IN ('خوا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوا', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوا،';

-- Merge 1 variants of 'قهر': قهر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قهر،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'قهر' AND pashto_word NOT IN ('قهر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قهر', 7);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قهر،';

-- Merge 2 variants of 'وموند': وموند., وموند،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وموند.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وموند،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وموند' AND pashto_word NOT IN ('وموند.','وموند،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وموند', 10);
