DELETE FROM word_verse_mapping WHERE pashto_word = 'شه!»';

-- Sum frequencies from all variants: 287 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 287
WHERE pashto_word = 'شه' AND pashto_word NOT IN ('شه،','شه.','شه.»','شه!','شه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شه', 287);

-- Delete 5 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شه،';
DELETE FROM word_frequencies WHERE pashto_word = 'شه.';
DELETE FROM word_frequencies WHERE pashto_word = 'شه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'شه!';
DELETE FROM word_frequencies WHERE pashto_word = 'شه!»';

-- Merge 3 variants of 'ساتی': ساتی., ساتی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتی.»';

-- Sum frequencies from all variants: 208 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 208
WHERE pashto_word = 'ساتی' AND pashto_word NOT IN ('ساتی.','ساتی،','ساتی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتی', 208);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتی.»';

-- Merge 3 variants of 'راولی': راولی., راولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولی.»';

-- Sum frequencies from all variants: 194 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 194
WHERE pashto_word = 'راولی' AND pashto_word NOT IN ('راولی.','راولی،','راولی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولی', 194);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راولی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولی.»';

-- Merge 2 variants of 'خوری': خوری., خوری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوری،';

-- Sum frequencies from all variants: 168 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 168
WHERE pashto_word = 'خوری' AND pashto_word NOT IN ('خوری.','خوری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوری', 168);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوری.';
DELETE FROM word_frequencies WHERE pashto_word = 'خوری،';

-- Merge 3 variants of 'وکړل': وکړل., وکړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړل.»';

-- Sum frequencies from all variants: 183 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 183
WHERE pashto_word = 'وکړل' AND pashto_word NOT IN ('وکړل.','وکړل،','وکړل.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړل', 183);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړل،';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړل.»';

-- Merge 2 variants of 'شُو': شُو., شُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شُو،';

-- Sum frequencies from all variants: 190 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 190
WHERE pashto_word = 'شُو' AND pashto_word NOT IN ('شُو.','شُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شُو', 190);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'شُو،';

-- Merge 3 variants of 'اوسېدل': اوسېدل., اوسېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدل.)';

-- Sum frequencies from all variants: 220 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 220
WHERE pashto_word = 'اوسېدل' AND pashto_word NOT IN ('اوسېدل.','اوسېدل،','اوسېدل.)');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدل', 220);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدل.)';

-- Merge 4 variants of 'ورکړم': ورکړم., ورکړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړم!';

-- Sum frequencies from all variants: 206 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 206
WHERE pashto_word = 'ورکړم' AND pashto_word NOT IN ('ورکړم.','ورکړم،','ورکړم.»','ورکړم!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړم', 206);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړم!';

-- Merge 2 variants of 'سلامت': سلامت،, سلامت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سلامت،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سلامت.';

-- Sum frequencies from all variants: 123 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 123
WHERE pashto_word = 'سلامت' AND pashto_word NOT IN ('سلامت،','سلامت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلامت', 123);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سلامت،';
DELETE FROM word_frequencies WHERE pashto_word = 'سلامت.';

-- Merge 5 variants of 'شم': شم،, شم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شم!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شم!»';

-- Sum frequencies from all variants: 259 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 259
WHERE pashto_word = 'شم' AND pashto_word NOT IN ('شم،','شم.','شم.»','شم!','شم!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شم', 259);

-- Delete 5 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شم،';
DELETE FROM word_frequencies WHERE pashto_word = 'شم.';
DELETE FROM word_frequencies WHERE pashto_word = 'شم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'شم!';
DELETE FROM word_frequencies WHERE pashto_word = 'شم!»';

-- Merge 2 variants of 'يُو': يُو., يُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يُو،';

-- Sum frequencies from all variants: 201 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 201
WHERE pashto_word = 'يُو' AND pashto_word NOT IN ('يُو.','يُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يُو', 201);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'يُو،';

-- Merge 2 variants of 'واخلی': واخلی., واخلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخلی،';

-- Sum frequencies from all variants: 137 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 137
WHERE pashto_word = 'واخلی' AND pashto_word NOT IN ('واخلی.','واخلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخلی', 137);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخلی،';

-- Merge 5 variants of 'ګوره': ګوره،, «ګوره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = '«ګوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوره.';
DELETE FROM word_verse_mapping WHERE pashto_word = '«ګوره!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوره!';

-- Sum frequencies from all variants: 133 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 133
WHERE pashto_word = 'ګوره' AND pashto_word NOT IN ('ګوره،','«ګوره،','ګوره.','«ګوره!','ګوره!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوره', 133);

-- Delete 5 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوره،';
DELETE FROM word_frequencies WHERE pashto_word = '«ګوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګوره.';
DELETE FROM word_frequencies WHERE pashto_word = '«ګوره!';
DELETE FROM word_frequencies WHERE pashto_word = 'ګوره!';

-- Merge 3 variants of 'شې': شې., شې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شې.»';

-- Sum frequencies from all variants: 225 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 225
WHERE pashto_word = 'شې' AND pashto_word NOT IN ('شې.','شې،','شې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شې', 225);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شې.';
DELETE FROM word_frequencies WHERE pashto_word = 'شې،';
DELETE FROM word_frequencies WHERE pashto_word = 'شې.»';

-- Merge 4 variants of 'ووایه': ووایه،, ووایه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایه!';

-- Sum frequencies from all variants: 136 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 136
WHERE pashto_word = 'ووایه' AND pashto_word NOT IN ('ووایه،','ووایه.','ووایه.»','ووایه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایه', 136);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایه!';

-- Merge 4 variants of 'ته': ته،, ته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ته.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ته!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ته.»';

-- Sum frequencies from all variants: 161 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 161
WHERE pashto_word = 'ته' AND pashto_word NOT IN ('ته،','ته.','ته!','ته.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ته', 161);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ته،';
DELETE FROM word_frequencies WHERE pashto_word = 'ته.';
DELETE FROM word_frequencies WHERE pashto_word = 'ته!';
DELETE FROM word_frequencies WHERE pashto_word = 'ته.»';

-- Merge 2 variants of 'ووژل': ووژل., ووژل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژل،';

-- Sum frequencies from all variants: 149 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 149
WHERE pashto_word = 'ووژل' AND pashto_word NOT IN ('ووژل.','ووژل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژل', 149);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژل،';

-- Merge 1 variants of 'درکړی': درکړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړی.';

-- Sum frequencies from all variants: 108 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 108
WHERE pashto_word = 'درکړی' AND pashto_word NOT IN ('درکړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړی', 108);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړی.';

-- Merge 3 variants of 'راوړی': راوړی., راوړی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړی.»';

-- Sum frequencies from all variants: 200 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 200
WHERE pashto_word = 'راوړی' AND pashto_word NOT IN ('راوړی.','راوړی،','راوړی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړی', 200);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړی.»';

-- Merge 2 variants of 'کاوه': کاوه., کاوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کاوه،';

-- Sum frequencies from all variants: 170 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 170
WHERE pashto_word = 'کاوه' AND pashto_word NOT IN ('کاوه.','کاوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاوه', 170);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کاوه،';

-- Merge 2 variants of 'یوسی': یوسی., یوسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسی،';

-- Sum frequencies from all variants: 111 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 111
WHERE pashto_word = 'یوسی' AND pashto_word NOT IN ('یوسی.','یوسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوسی', 111);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوسی.';
DELETE FROM word_frequencies WHERE pashto_word = 'یوسی،';

-- Merge 2 variants of 'خلکو': خلکو،, خلکو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلکو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خلکو!';

-- Sum frequencies from all variants: 121 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 121
WHERE pashto_word = 'خلکو' AND pashto_word NOT IN ('خلکو،','خلکو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلکو', 121);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلکو،';
DELETE FROM word_frequencies WHERE pashto_word = 'خلکو!';

-- Merge 3 variants of 'اخلی': اخلی., اخلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلی.»';

-- Sum frequencies from all variants: 131 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 131
WHERE pashto_word = 'اخلی' AND pashto_word NOT IN ('اخلی.','اخلی،','اخلی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلی', 131);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'اخلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'اخلی.»';

-- Merge 4 variants of 'کوه': کوه., کوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوه!';

-- Sum frequencies from all variants: 217 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 217
WHERE pashto_word = 'کوه' AND pashto_word NOT IN ('کوه.','کوه،','کوه.»','کوه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوه', 217);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کوه،';
DELETE FROM word_frequencies WHERE pashto_word = 'کوه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'کوه!';

-- Merge 2 variants of 'کېښودو': کېښودو., کېښودو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودو،';

-- Sum frequencies from all variants: 135 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 135
WHERE pashto_word = 'کېښودو' AND pashto_word NOT IN ('کېښودو.','کېښودو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودو', 135);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودو،';

-- Merge 1 variants of 'انسانه': انسانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'انسانه،';

-- Sum frequencies from all variants: 97 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 97
WHERE pashto_word = 'انسانه' AND pashto_word NOT IN ('انسانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انسانه', 97);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انسانه،';

-- Merge 2 variants of 'خلقو': خلقو،, خلقو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلقو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خلقو.';

-- Sum frequencies from all variants: 96 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 96
WHERE pashto_word = 'خلقو' AND pashto_word NOT IN ('خلقو،','خلقو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلقو', 96);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلقو،';
DELETE FROM word_frequencies WHERE pashto_word = 'خلقو.';

-- Merge 1 variants of 'وشی': وشی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشی.';

-- Sum frequencies from all variants: 91 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 91
WHERE pashto_word = 'وشی' AND pashto_word NOT IN ('وشی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشی', 91);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشی.';

-- Merge 3 variants of 'کوې': کوې،, کوې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوې.»';

-- Sum frequencies from all variants: 162 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 162
WHERE pashto_word = 'کوې' AND pashto_word NOT IN ('کوې،','کوې.','کوې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوې', 162);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوې،';
DELETE FROM word_frequencies WHERE pashto_word = 'کوې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کوې.»';

-- Merge 3 variants of 'درکړم': درکړم., درکړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړم.»';

-- Sum frequencies from all variants: 140 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 140
WHERE pashto_word = 'درکړم' AND pashto_word NOT IN ('درکړم.','درکړم،','درکړم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړم', 140);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړم.';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړم،';
DELETE FROM word_frequencies WHERE pashto_word = 'درکړم.»';

-- Merge 1 variants of 'آدمه': آدمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آدمه،';

-- Sum frequencies from all variants: 90 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 90
WHERE pashto_word = 'آدمه' AND pashto_word NOT IN ('آدمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آدمه', 90);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آدمه،';

-- Merge 2 variants of 'پاکه': پاکه،, پاکه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاکه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاکه.';

-- Sum frequencies from all variants: 96 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 96
WHERE pashto_word = 'پاکه' AND pashto_word NOT IN ('پاکه،','پاکه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاکه', 96);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاکه،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاکه.';

-- Merge 2 variants of 'راولم': راولم., راولم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولم،';

-- Sum frequencies from all variants: 133 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 133
WHERE pashto_word = 'راولم' AND pashto_word NOT IN ('راولم.','راولم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولم', 133);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راولم،';

-- Merge 3 variants of 'وم': وم., وم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وم.»';

-- Sum frequencies from all variants: 169 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 169
WHERE pashto_word = 'وم' AND pashto_word NOT IN ('وم.','وم،','وم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وم', 169);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وم.»';

-- Merge 2 variants of 'کولی': کولی., کولی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کولی،';

-- Sum frequencies from all variants: 117 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 117
WHERE pashto_word = 'کولی' AND pashto_word NOT IN ('کولی.','کولی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولی', 117);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولی.';
DELETE FROM word_frequencies WHERE pashto_word = 'کولی،';

-- Merge 2 variants of 'ځی': ځی., ځی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځی،';

-- Sum frequencies from all variants: 109 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 109
WHERE pashto_word = 'ځی' AND pashto_word NOT IN ('ځی.','ځی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځی', 109);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځی،';

-- Merge 3 variants of 'وخوری': وخوری،, وخوری.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوری.»';

-- Sum frequencies from all variants: 173 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 173
WHERE pashto_word = 'وخوری' AND pashto_word NOT IN ('وخوری،','وخوری.','وخوری.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوری', 173);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوری،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوری.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوری.»';

-- Merge 1 variants of 'کال': کال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کال،';

-- Sum frequencies from all variants: 84 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 84
WHERE pashto_word = 'کال' AND pashto_word NOT IN ('کال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کال', 84);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کال،';

-- Merge 2 variants of 'لاړ': لاړ., لاړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړ.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړ،';

-- Sum frequencies from all variants: 107 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 107
WHERE pashto_word = 'لاړ' AND pashto_word NOT IN ('لاړ.','لاړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړ', 107);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړ.';
DELETE FROM word_frequencies WHERE pashto_word = 'لاړ،';

-- Merge 1 variants of 'خوېندو': خوېندو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوېندو،';

-- Sum frequencies from all variants: 83 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 83
WHERE pashto_word = 'خوېندو' AND pashto_word NOT IN ('خوېندو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوېندو', 83);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوېندو،';

-- Merge 3 variants of 'وکړې': وکړې،, وکړې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړې.»';

-- Sum frequencies from all variants: 169 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 169
WHERE pashto_word = 'وکړې' AND pashto_word NOT IN ('وکړې،','وکړې.','وکړې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړې', 169);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړې،';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړې.»';

-- Merge 1 variants of 'پس': پس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پس،';

-- Sum frequencies from all variants: 82 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 82
WHERE pashto_word = 'پس' AND pashto_word NOT IN ('پس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پس', 82);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پس،';

-- Merge 2 variants of 'غواړی': غواړی،, غواړی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړی.';

-- Sum frequencies from all variants: 155 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 155
WHERE pashto_word = 'غواړی' AND pashto_word NOT IN ('غواړی،','غواړی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړی', 155);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړی،';
DELETE FROM word_frequencies WHERE pashto_word = 'غواړی.';

-- Merge 2 variants of 'کولې': کولې., کولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کولې،';

-- Sum frequencies from all variants: 143 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 143
WHERE pashto_word = 'کولې' AND pashto_word NOT IN ('کولې.','کولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولې', 143);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کولې،';

-- Merge 3 variants of 'شوم': شوم., شوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شوم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شوم.»';

-- Sum frequencies from all variants: 133 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 133
WHERE pashto_word = 'شوم' AND pashto_word NOT IN ('شوم.','شوم،','شوم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوم', 133);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'شوم،';
DELETE FROM word_frequencies WHERE pashto_word = 'شوم.»';

-- Merge 2 variants of 'ولیدل': ولیدل،, ولیدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیدل.';

-- Sum frequencies from all variants: 86 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 86
WHERE pashto_word = 'ولیدل' AND pashto_word NOT IN ('ولیدل،','ولیدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیدل', 86);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیدل.';

-- Merge 4 variants of 'ووژنی': ووژنی., ووژنی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنی!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنی.»';

-- Sum frequencies from all variants: 96 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 96
WHERE pashto_word = 'ووژنی' AND pashto_word NOT IN ('ووژنی.','ووژنی،','ووژنی!','ووژنی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنی', 96);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنی!';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنی.»';

-- Merge 2 variants of 'راغلو': راغلو،, راغلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلو.';

-- Sum frequencies from all variants: 140 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 140
WHERE pashto_word = 'راغلو' AND pashto_word NOT IN ('راغلو،','راغلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلو', 140);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راغلو.';

-- Merge 2 variants of 'وهی': وهی., وهی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وهی،';

-- Sum frequencies from all variants: 130 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 130
WHERE pashto_word = 'وهی' AND pashto_word NOT IN ('وهی.','وهی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهی', 130);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وهی،';

-- Merge 1 variants of 'فرمایيل': فرمایيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرمایيل،';

-- Sum frequencies from all variants: 75 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 75
WHERE pashto_word = 'فرمایيل' AND pashto_word NOT IN ('فرمایيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرمایيل', 75);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرمایيل،';

-- Merge 3 variants of 'وساتی': وساتی., وساتی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وساتی.»';

-- Sum frequencies from all variants: 93 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 93
WHERE pashto_word = 'وساتی' AND pashto_word NOT IN ('وساتی.','وساتی،','وساتی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وساتی', 93);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وساتی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وساتی.»';

-- Merge 3 variants of 'وایم': وایم،, وایم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وایم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایم.»';

-- Sum frequencies from all variants: 93 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 93
WHERE pashto_word = 'وایم' AND pashto_word NOT IN ('وایم،','وایم.','وایم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایم', 93);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وایم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وایم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وایم.»';

-- Merge 3 variants of 'زویه': زویه،, زویه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'زویه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زویه!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زویه!»';

-- Sum frequencies from all variants: 112 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 112
WHERE pashto_word = 'زویه' AND pashto_word NOT IN ('زویه،','زویه!','زویه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زویه', 112);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زویه،';
DELETE FROM word_frequencies WHERE pashto_word = 'زویه!';
DELETE FROM word_frequencies WHERE pashto_word = 'زویه!»';

-- Merge 2 variants of 'ووایى': ووایى،, ووایى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایى.';

-- Sum frequencies from all variants: 90 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 90
WHERE pashto_word = 'ووایى' AND pashto_word NOT IN ('ووایى،','ووایى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایى', 90);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایى.';

-- Merge 2 variants of 'وي': وي.», وي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وي!»';

-- Sum frequencies from all variants: 72 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 72
WHERE pashto_word = 'وي' AND pashto_word NOT IN ('وي.»','وي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وي', 72);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وي!»';

-- Merge 2 variants of 'کړُو': کړُو., کړُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړُو،';

-- Sum frequencies from all variants: 107 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 107
WHERE pashto_word = 'کړُو' AND pashto_word NOT IN ('کړُو.','کړُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړُو', 107);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړُو،';

-- Merge 3 variants of 'ورکړ': ورکړ., ورکړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړ.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړ،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړ.»';

-- Sum frequencies from all variants: 98 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 98
WHERE pashto_word = 'ورکړ' AND pashto_word NOT IN ('ورکړ.','ورکړ،','ورکړ.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړ', 98);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړ.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړ،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړ.»';

-- Merge 2 variants of 'شته': شته،, شته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شته.';

-- Sum frequencies from all variants: 104 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 104
WHERE pashto_word = 'شته' AND pashto_word NOT IN ('شته،','شته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شته', 104);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شته،';
DELETE FROM word_frequencies WHERE pashto_word = 'شته.';

-- Merge 2 variants of 'خدایه': خدایه،, خدایه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'خدایه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خدایه!';

-- Sum frequencies from all variants: 99 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 99
WHERE pashto_word = 'خدایه' AND pashto_word NOT IN ('خدایه،','خدایه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خدایه', 99);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه،';
DELETE FROM word_frequencies WHERE pashto_word = 'خدایه!';

-- Merge 2 variants of 'جوړوی': جوړوی،, جوړوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوی.';

-- Sum frequencies from all variants: 130 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 130
WHERE pashto_word = 'جوړوی' AND pashto_word NOT IN ('جوړوی،','جوړوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړوی', 130);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوی.';

-- Merge 4 variants of 'اوسی': اوسی., اوسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسی.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسی!';

-- Sum frequencies from all variants: 140 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 140
WHERE pashto_word = 'اوسی' AND pashto_word NOT IN ('اوسی.','اوسی،','اوسی.»','اوسی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسی', 140);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسی.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسی،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسی.»';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسی!';

-- Merge 3 variants of 'واوری': واوری،, واوری.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوری!';

-- Sum frequencies from all variants: 140 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 140
WHERE pashto_word = 'واوری' AND pashto_word NOT IN ('واوری،','واوری.','واوری!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوری', 140);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوری،';
DELETE FROM word_frequencies WHERE pashto_word = 'واوری.';
DELETE FROM word_frequencies WHERE pashto_word = 'واوری!';

-- Merge 2 variants of 'ورکړل': ورکړل., ورکړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړل،';

-- Sum frequencies from all variants: 81 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 81
WHERE pashto_word = 'ورکړل' AND pashto_word NOT IN ('ورکړل.','ورکړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړل', 81);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړل،';

-- Merge 1 variants of '”مالِکه': ”مالِکه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”مالِکه،';

-- Sum frequencies from all variants: 65 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 65
WHERE pashto_word = '”مالِکه' AND pashto_word NOT IN ('”مالِکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”مالِکه', 65);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”مالِکه،';

-- Merge 2 variants of 'راغلل': راغلل., راغلل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلل،';

-- Sum frequencies from all variants: 126 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 126
WHERE pashto_word = 'راغلل' AND pashto_word NOT IN ('راغلل.','راغلل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلل', 126);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغلل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راغلل،';

-- Merge 2 variants of 'واورېدل': واورېدل،, واورېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدل.';

-- Sum frequencies from all variants: 72 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 72
WHERE pashto_word = 'واورېدل' AND pashto_word NOT IN ('واورېدل،','واورېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېدل', 72);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدل.';

-- Merge 2 variants of 'کوُو': کوُو., کوُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوُو،';

-- Sum frequencies from all variants: 97 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 97
WHERE pashto_word = 'کوُو' AND pashto_word NOT IN ('کوُو.','کوُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوُو', 97);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کوُو،';

-- Merge 2 variants of 'کول': کول., کول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کول،';

-- Sum frequencies from all variants: 110 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 110
WHERE pashto_word = 'کول' AND pashto_word NOT IN ('کول.','کول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کول', 110);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کول.';
DELETE FROM word_frequencies WHERE pashto_word = 'کول،';

-- Merge 2 variants of 'سره': سره،, سره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سره.';

-- Sum frequencies from all variants: 94 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 94
WHERE pashto_word = 'سره' AND pashto_word NOT IN ('سره،','سره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سره', 94);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سره،';
DELETE FROM word_frequencies WHERE pashto_word = 'سره.';

-- Merge 4 variants of 'یو': یو., یو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یو.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یو!»';

-- Sum frequencies from all variants: 135 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 135
WHERE pashto_word = 'یو' AND pashto_word NOT IN ('یو.','یو،','یو.»','یو!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یو', 135);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یو.';
DELETE FROM word_frequencies WHERE pashto_word = 'یو،';
DELETE FROM word_frequencies WHERE pashto_word = 'یو.»';
DELETE FROM word_frequencies WHERE pashto_word = 'یو!»';

-- Merge 2 variants of 'څخه': څخه., څخه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څخه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څخه،';

-- Sum frequencies from all variants: 81 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 81
WHERE pashto_word = 'څخه' AND pashto_word NOT IN ('څخه.','څخه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څخه', 81);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څخه.';
DELETE FROM word_frequencies WHERE pashto_word = 'څخه،';

-- Merge 2 variants of 'مالِکه': مالِکه،, مالِکه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مالِکه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'مالِکه.';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'مالِکه' AND pashto_word NOT IN ('مالِکه،','مالِکه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِکه', 62);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکه،';
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکه.';

-- Merge 1 variants of '”آو': ”آو،

DELETE FROM word_verse_mapping WHERE pashto_word = '”آو،';

-- Sum frequencies from all variants: 60 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 60
WHERE pashto_word = '”آو' AND pashto_word NOT IN ('”آو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”آو', 60);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”آو،';

-- Merge 1 variants of 'زر': زر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زر،';

-- Sum frequencies from all variants: 59 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 59
WHERE pashto_word = 'زر' AND pashto_word NOT IN ('زر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زر', 59);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زر،';
