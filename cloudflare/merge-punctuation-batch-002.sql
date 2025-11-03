
-- Merge 4 variants of 'شوی': شوی., شوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شوی.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شوی.)';

-- Sum frequencies from all variants: 118 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 118
WHERE pashto_word = 'شوی' AND pashto_word NOT IN ('شوی.','شوی،','شوی.»','شوی.)');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوی', 118);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'شوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'شوی.»';
DELETE FROM word_frequencies WHERE pashto_word = 'شوی.)';

-- Merge 5 variants of 'وګوری': وګوری،, وګوری.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوری!';
DELETE FROM word_verse_mapping WHERE pashto_word = '«وګوری،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوری.»';

-- Sum frequencies from all variants: 86 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 86
WHERE pashto_word = 'وګوری' AND pashto_word NOT IN ('وګوری،','وګوری.','وګوری!','«وګوری،','وګوری.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګوری', 86);

-- Delete 5 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګوری،';
DELETE FROM word_frequencies WHERE pashto_word = 'وګوری.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګوری!';
DELETE FROM word_frequencies WHERE pashto_word = '«وګوری،';
DELETE FROM word_frequencies WHERE pashto_word = 'وګوری.»';

-- Merge 2 variants of 'ورسېدل': ورسېدل،, ورسېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدل.';

-- Sum frequencies from all variants: 82 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 82
WHERE pashto_word = 'ورسېدل' AND pashto_word NOT IN ('ورسېدل،','ورسېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدل', 82);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدل.';

-- Merge 1 variants of 'ورځ': ورځ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځ،';

-- Sum frequencies from all variants: 56 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 56
WHERE pashto_word = 'ورځ' AND pashto_word NOT IN ('ورځ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځ', 56);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځ،';

-- Merge 2 variants of 'پورې': پورې،, پورې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پورې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پورې.';

-- Sum frequencies from all variants: 67 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 67
WHERE pashto_word = 'پورې' AND pashto_word NOT IN ('پورې،','پورې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پورې', 67);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پورې،';
DELETE FROM word_frequencies WHERE pashto_word = 'پورې.';

-- Merge 2 variants of 'بادشاه': بادشاه،, بادشاه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادشاه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بادشاه.';

-- Sum frequencies from all variants: 58 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 58
WHERE pashto_word = 'بادشاه' AND pashto_word NOT IN ('بادشاه،','بادشاه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادشاه', 58);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاه،';
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاه.';

-- Merge 3 variants of 'زوی': زوی،, زوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زوی.»';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'زوی' AND pashto_word NOT IN ('زوی،','زوی.','زوی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زوی', 62);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'زوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'زوی.»';

-- Merge 2 variants of 'ورونو': ورونو!, ورونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورونو!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورونو،';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'ورونو' AND pashto_word NOT IN ('ورونو!','ورونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورونو', 62);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورونو!';
DELETE FROM word_frequencies WHERE pashto_word = 'ورونو،';

-- Merge 3 variants of 'وګوره': وګوره،, وګوره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوره.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګوره.»';

-- Sum frequencies from all variants: 73 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 73
WHERE pashto_word = 'وګوره' AND pashto_word NOT IN ('وګوره،','وګوره.','وګوره.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګوره', 73);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'وګوره.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګوره.»';

-- Merge 3 variants of 'ووینی': ووینی., ووینی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینی.»';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'ووینی' AND pashto_word NOT IN ('ووینی.','ووینی،','ووینی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینی', 62);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووینی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووینی.»';

-- Merge 3 variants of 'درکوم': درکوم., درکوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکوم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درکوم.»';

-- Sum frequencies from all variants: 91 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 91
WHERE pashto_word = 'درکوم' AND pashto_word NOT IN ('درکوم.','درکوم،','درکوم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکوم', 91);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'درکوم،';
DELETE FROM word_frequencies WHERE pashto_word = 'درکوم.»';

-- Merge 1 variants of 'څۀ': څۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څۀ،';

-- Sum frequencies from all variants: 52 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 52
WHERE pashto_word = 'څۀ' AND pashto_word NOT IN ('څۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څۀ', 52);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څۀ،';

-- Merge 2 variants of 'ولیده': ولیده،, ولیده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولیده.';

-- Sum frequencies from all variants: 58 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 58
WHERE pashto_word = 'ولیده' AND pashto_word NOT IN ('ولیده،','ولیده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولیده', 58);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولیده،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولیده.';

-- Merge 2 variants of 'اوسېږی': اوسېږی،, اوسېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږی.';

-- Sum frequencies from all variants: 81 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 81
WHERE pashto_word = 'اوسېږی' AND pashto_word NOT IN ('اوسېږی،','اوسېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږی', 81);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږی،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږی.';

-- Merge 2 variants of 'بوتلل': بوتلل., بوتلل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلل،';

-- Sum frequencies from all variants: 73 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 73
WHERE pashto_word = 'بوتلل' AND pashto_word NOT IN ('بوتلل.','بوتلل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتلل', 73);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلل.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلل،';

-- Merge 1 variants of 'درکوی': درکوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکوی.';

-- Sum frequencies from all variants: 50 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 50
WHERE pashto_word = 'درکوی' AND pashto_word NOT IN ('درکوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکوی', 50);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکوی.';

-- Merge 2 variants of 'پاک': پاک،, پاک.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاک،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پاک.';

-- Sum frequencies from all variants: 52 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 52
WHERE pashto_word = 'پاک' AND pashto_word NOT IN ('پاک،','پاک.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاک', 52);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاک،';
DELETE FROM word_frequencies WHERE pashto_word = 'پاک.';

-- Merge 3 variants of 'دپاره': دپاره،, دپاره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دپاره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دپاره.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دپاره.»';

-- Sum frequencies from all variants: 79 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 79
WHERE pashto_word = 'دپاره' AND pashto_word NOT IN ('دپاره،','دپاره.','دپاره.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دپاره', 79);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دپاره،';
DELETE FROM word_frequencies WHERE pashto_word = 'دپاره.';
DELETE FROM word_frequencies WHERE pashto_word = 'دپاره.»';

-- Merge 3 variants of 'وایي': وایي., وایي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وایي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایي.»';

-- Sum frequencies from all variants: 86 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 86
WHERE pashto_word = 'وایي' AND pashto_word NOT IN ('وایي.','وایي،','وایي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایي', 86);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وایي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وایي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وایي.»';

-- Merge 2 variants of 'وتښتېدل': وتښتېدل., وتښتېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتښتېدل،';

-- Sum frequencies from all variants: 64 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 64
WHERE pashto_word = 'وتښتېدل' AND pashto_word NOT IN ('وتښتېدل.','وتښتېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتښتېدل', 64);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتښتېدل،';

-- Merge 1 variants of 'کوي': کوي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوي.»';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = 'کوي' AND pashto_word NOT IN ('کوي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوي', 47);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوي.»';

-- Merge 1 variants of '”ګوره': ”ګوره،

DELETE FROM word_verse_mapping WHERE pashto_word = '”ګوره،';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = '”ګوره' AND pashto_word NOT IN ('”ګوره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”ګوره', 47);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”ګوره،';

-- Merge 2 variants of 'اِسرایيلو': اِسرایيلو،, اِسرایيلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسرایيلو.';

-- Sum frequencies from all variants: 50 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 50
WHERE pashto_word = 'اِسرایيلو' AND pashto_word NOT IN ('اِسرایيلو،','اِسرایيلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسرایيلو', 50);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'اِسرایيلو.';

-- Merge 3 variants of 'ورکړې': ورکړې., ورکړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړې.»';

-- Sum frequencies from all variants: 76 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 76
WHERE pashto_word = 'ورکړې' AND pashto_word NOT IN ('ورکړې.','ورکړې،','ورکړې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړې', 76);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړې.»';

-- Merge 4 variants of 'راکړه': راکړه., راکړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راکړه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = '«راکړه!»';

-- Sum frequencies from all variants: 84 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 84
WHERE pashto_word = 'راکړه' AND pashto_word NOT IN ('راکړه.','راکړه،','راکړه.»','«راکړه!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکړه', 84);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راکړه.»';
DELETE FROM word_frequencies WHERE pashto_word = '«راکړه!»';

-- Merge 3 variants of 'پلاره': پلاره،, پلاره!

DELETE FROM word_verse_mapping WHERE pashto_word = 'پلاره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پلاره!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پلاره.';

-- Sum frequencies from all variants: 56 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 56
WHERE pashto_word = 'پلاره' AND pashto_word NOT IN ('پلاره،','پلاره!','پلاره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پلاره', 56);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پلاره،';
DELETE FROM word_frequencies WHERE pashto_word = 'پلاره!';
DELETE FROM word_frequencies WHERE pashto_word = 'پلاره.';

-- Merge 2 variants of '”نه': ”نه،, ”نه.

DELETE FROM word_verse_mapping WHERE pashto_word = '”نه،';
DELETE FROM word_verse_mapping WHERE pashto_word = '”نه.';

-- Sum frequencies from all variants: 48 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 48
WHERE pashto_word = '”نه' AND pashto_word NOT IN ('”نه،','”نه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”نه', 48);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”نه،';
DELETE FROM word_frequencies WHERE pashto_word = '”نه.';

-- Merge 2 variants of 'دينه': دينه،, دينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دينه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دينه.';

-- Sum frequencies from all variants: 73 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 73
WHERE pashto_word = 'دينه' AND pashto_word NOT IN ('دينه،','دينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دينه', 73);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دينه،';
DELETE FROM word_frequencies WHERE pashto_word = 'دينه.';

-- Merge 1 variants of 'زرو': زرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زرو،';

-- Sum frequencies from all variants: 44 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 44
WHERE pashto_word = 'زرو' AND pashto_word NOT IN ('زرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زرو', 44);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زرو،';

-- Merge 2 variants of 'کېښودل': کېښودل., کېښودل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودل،';

-- Sum frequencies from all variants: 56 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 56
WHERE pashto_word = 'کېښودل' AND pashto_word NOT IN ('کېښودل.','کېښودل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودل', 56);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودل.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودل،';

-- Merge 2 variants of 'وکړُو': وکړُو., وکړُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړُو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړُو،';

-- Sum frequencies from all variants: 61 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 61
WHERE pashto_word = 'وکړُو' AND pashto_word NOT IN ('وکړُو.','وکړُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړُو', 61);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړُو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړُو،';

-- Merge 2 variants of 'لګى': لګى., لګى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لګى،';

-- Sum frequencies from all variants: 60 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 60
WHERE pashto_word = 'لګى' AND pashto_word NOT IN ('لګى.','لګى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګى', 60);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګى.';
DELETE FROM word_frequencies WHERE pashto_word = 'لګى،';

-- Merge 2 variants of 'نذرانې': نذرانې،, نذرانې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نذرانې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نذرانې.';

-- Sum frequencies from all variants: 48 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 48
WHERE pashto_word = 'نذرانې' AND pashto_word NOT IN ('نذرانې،','نذرانې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نذرانې', 48);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نذرانې،';
DELETE FROM word_frequencies WHERE pashto_word = 'نذرانې.';

-- Merge 2 variants of 'ښځې': ښځې،, ښځې!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښځې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښځې!';

-- Sum frequencies from all variants: 45 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 45
WHERE pashto_word = 'ښځې' AND pashto_word NOT IN ('ښځې،','ښځې!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښځې', 45);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښځې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ښځې!';

-- Merge 2 variants of 'ملاويږى': ملاويږى., ملاويږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ملاويږى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ملاويږى،';

-- Sum frequencies from all variants: 77 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 77
WHERE pashto_word = 'ملاويږى' AND pashto_word NOT IN ('ملاويږى.','ملاويږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ملاويږى', 77);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ملاويږى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ملاويږى،';

-- Merge 1 variants of 'پوهیږی': پوهیږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهیږی.';

-- Sum frequencies from all variants: 43 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 43
WHERE pashto_word = 'پوهیږی' AND pashto_word NOT IN ('پوهیږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهیږی', 43);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهیږی.';

-- Merge 2 variants of 'ولېږل': ولېږل., ولېږل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږل،';

-- Sum frequencies from all variants: 65 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 65
WHERE pashto_word = 'ولېږل' AND pashto_word NOT IN ('ولېږل.','ولېږل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږل', 65);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږل،';

-- Merge 2 variants of 'ورکولو': ورکولو., ورکولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولو،';

-- Sum frequencies from all variants: 54 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 54
WHERE pashto_word = 'ورکولو' AND pashto_word NOT IN ('ورکولو.','ورکولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکولو', 54);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولو،';

-- Merge 4 variants of 'وای': وای،, وای.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وای،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وای.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وای.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وای!';

-- Sum frequencies from all variants: 92 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 92
WHERE pashto_word = 'وای' AND pashto_word NOT IN ('وای،','وای.','وای.»','وای!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وای', 92);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وای،';
DELETE FROM word_frequencies WHERE pashto_word = 'وای.';
DELETE FROM word_frequencies WHERE pashto_word = 'وای.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وای!';

-- Merge 2 variants of 'وایی': وایی،, وایی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وایی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وایی.»';

-- Sum frequencies from all variants: 45 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 45
WHERE pashto_word = 'وایی' AND pashto_word NOT IN ('وایی،','وایی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایی', 45);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وایی،';
DELETE FROM word_frequencies WHERE pashto_word = 'وایی.»';

-- Merge 2 variants of 'هو': هو،, «هو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'هو،';
DELETE FROM word_verse_mapping WHERE pashto_word = '«هو.»';

-- Sum frequencies from all variants: 44 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 44
WHERE pashto_word = 'هو' AND pashto_word NOT IN ('هو،','«هو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هو', 44);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هو،';
DELETE FROM word_frequencies WHERE pashto_word = '«هو.»';

-- Merge 2 variants of 'وشو': وشو،, وشو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشو.';

-- Sum frequencies from all variants: 79 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 79
WHERE pashto_word = 'وشو' AND pashto_word NOT IN ('وشو،','وشو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشو', 79);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وشو.';

-- Merge 3 variants of 'شان': شان،, شان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شان.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شان.»';

-- Sum frequencies from all variants: 60 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 60
WHERE pashto_word = 'شان' AND pashto_word NOT IN ('شان،','شان.','شان.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شان', 60);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شان،';
DELETE FROM word_frequencies WHERE pashto_word = 'شان.';
DELETE FROM word_frequencies WHERE pashto_word = 'شان.»';

-- Merge 2 variants of 'ودرېدل': ودرېدل., ودرېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدل،';

-- Sum frequencies from all variants: 56 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 56
WHERE pashto_word = 'ودرېدل' AND pashto_word NOT IN ('ودرېدل.','ودرېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدل', 56);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدل،';

-- Merge 2 variants of 'واوره': واوره،, واوره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوره.';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'واوره' AND pashto_word NOT IN ('واوره،','واوره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوره', 62);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوره،';
DELETE FROM word_frequencies WHERE pashto_word = 'واوره.';

-- Merge 2 variants of 'دېنه': دېنه،, دېنه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دېنه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دېنه.';

-- Sum frequencies from all variants: 60 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 60
WHERE pashto_word = 'دېنه' AND pashto_word NOT IN ('دېنه،','دېنه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دېنه', 60);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دېنه،';
DELETE FROM word_frequencies WHERE pashto_word = 'دېنه.';

-- Merge 3 variants of 'ووایی': ووایی،, ووایی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووایی.»';

-- Sum frequencies from all variants: 64 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 64
WHERE pashto_word = 'ووایی' AND pashto_word NOT IN ('ووایی،','ووایی.','ووایی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووایی', 64);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووایی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووایی.»';

-- Merge 2 variants of 'وشول': وشول., وشول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشول،';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'وشول' AND pashto_word NOT IN ('وشول.','وشول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشول', 62);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشول.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشول،';

-- Merge 2 variants of 'راوړل': راوړل., راوړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړل،';

-- Sum frequencies from all variants: 54 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 54
WHERE pashto_word = 'راوړل' AND pashto_word NOT IN ('راوړل.','راوړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړل', 54);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړل،';

-- Merge 4 variants of 'راشه': راشه،, راشه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راشه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راشه.';
DELETE FROM word_verse_mapping WHERE pashto_word = '«راشه!»';
DELETE FROM word_verse_mapping WHERE pashto_word = '«راشه،';

-- Sum frequencies from all variants: 63 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 63
WHERE pashto_word = 'راشه' AND pashto_word NOT IN ('راشه،','راشه.','«راشه!»','«راشه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راشه', 63);

-- Delete 4 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راشه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راشه.';
DELETE FROM word_frequencies WHERE pashto_word = '«راشه!»';
DELETE FROM word_frequencies WHERE pashto_word = '«راشه،';

-- Merge 2 variants of 'ودرولې': ودرولې., ودرولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرولې،';

-- Sum frequencies from all variants: 50 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 50
WHERE pashto_word = 'ودرولې' AND pashto_word NOT IN ('ودرولې.','ودرولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرولې', 50);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرولې،';

-- Merge 2 variants of 'وکتل': وکتل،, وکتل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکتل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکتل.';

-- Sum frequencies from all variants: 42 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 42
WHERE pashto_word = 'وکتل' AND pashto_word NOT IN ('وکتل،','وکتل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکتل', 42);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکتل،';
DELETE FROM word_frequencies WHERE pashto_word = 'وکتل.';

-- Merge 2 variants of 'پرېښودل': پرېښودل., پرېښودل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودل،';

-- Sum frequencies from all variants: 58 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 58
WHERE pashto_word = 'پرېښودل' AND pashto_word NOT IN ('پرېښودل.','پرېښودل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودل', 58);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودل.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودل،';

-- Merge 3 variants of 'ورکوم': ورکوم., ورکوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوم.»';

-- Sum frequencies from all variants: 65 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 65
WHERE pashto_word = 'ورکوم' AND pashto_word NOT IN ('ورکوم.','ورکوم،','ورکوم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوم', 65);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوم.»';

-- Merge 2 variants of 'وسوزوى': وسوزوى., وسوزوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوى،';

-- Sum frequencies from all variants: 55 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 55
WHERE pashto_word = 'وسوزوى' AND pashto_word NOT IN ('وسوزوى.','وسوزوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوى', 55);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوى،';

-- Merge 2 variants of 'درلود': درلود., درلود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلود.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درلود،';

-- Sum frequencies from all variants: 62 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 62
WHERE pashto_word = 'درلود' AND pashto_word NOT IN ('درلود.','درلود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلود', 62);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلود.';
DELETE FROM word_frequencies WHERE pashto_word = 'درلود،';

-- Merge 1 variants of 'علاوه': علاوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'علاوه،';

-- Sum frequencies from all variants: 37 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 37
WHERE pashto_word = 'علاوه' AND pashto_word NOT IN ('علاوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('علاوه', 37);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'علاوه،';

-- Merge 2 variants of 'ولګولې': ولګولې., ولګولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګولې،';

-- Sum frequencies from all variants: 54 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 54
WHERE pashto_word = 'ولګولې' AND pashto_word NOT IN ('ولګولې.','ولګولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګولې', 54);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولګولې،';

-- Merge 2 variants of 'ووژلو': ووژلو., ووژلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژلو،';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = 'ووژلو' AND pashto_word NOT IN ('ووژلو.','ووژلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژلو', 47);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژلو،';

-- Merge 2 variants of 'بوتلو': بوتلو., بوتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بوتلو،';

-- Sum frequencies from all variants: 54 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 54
WHERE pashto_word = 'بوتلو' AND pashto_word NOT IN ('بوتلو.','بوتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوتلو', 54);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'بوتلو،';

-- Merge 2 variants of 'کېدل': کېدل., کېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدل،';

-- Sum frequencies from all variants: 58 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 58
WHERE pashto_word = 'کېدل' AND pashto_word NOT IN ('کېدل.','کېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدل', 58);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدل،';

-- Merge 3 variants of 'کې': کې،, کې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کې.»';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = 'کې' AND pashto_word NOT IN ('کې،','کې.','کې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کې', 47);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کې،';
DELETE FROM word_frequencies WHERE pashto_word = 'کې.';
DELETE FROM word_frequencies WHERE pashto_word = 'کې.»';

-- Merge 2 variants of 'جنګ': جنګ،, جنګ.

DELETE FROM word_verse_mapping WHERE pashto_word = 'جنګ،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جنګ.';

-- Sum frequencies from all variants: 38 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 38
WHERE pashto_word = 'جنګ' AND pashto_word NOT IN ('جنګ،','جنګ.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جنګ', 38);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جنګ،';
DELETE FROM word_frequencies WHERE pashto_word = 'جنګ.';

-- Merge 3 variants of 'ما': ما،, ما.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ما،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ما.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ما!';

-- Sum frequencies from all variants: 47 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 47
WHERE pashto_word = 'ما' AND pashto_word NOT IN ('ما،','ما.','ما!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ما', 47);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ما،';
DELETE FROM word_frequencies WHERE pashto_word = 'ما.';
DELETE FROM word_frequencies WHERE pashto_word = 'ما!';

-- Merge 3 variants of 'پرېږدی': پرېږدی., پرېږدی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدی.»';

-- Sum frequencies from all variants: 63 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 63
WHERE pashto_word = 'پرېږدی' AND pashto_word NOT IN ('پرېږدی.','پرېږدی،','پرېږدی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدی', 63);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدی.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدی،';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدی.»';

-- Merge 3 variants of 'کیږي': کیږي.», کیږي.]

DELETE FROM word_verse_mapping WHERE pashto_word = 'کیږي.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کیږي.]';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کیږي!»';

-- Sum frequencies from all variants: 41 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 41
WHERE pashto_word = 'کیږي' AND pashto_word NOT IN ('کیږي.»','کیږي.]','کیږي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کیږي', 41);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کیږي.»';
DELETE FROM word_frequencies WHERE pashto_word = 'کیږي.]';
DELETE FROM word_frequencies WHERE pashto_word = 'کیږي!»';

-- Merge 3 variants of 'زما': زما،, زما.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زما،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زما.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زما!';

-- Sum frequencies from all variants: 48 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 48
WHERE pashto_word = 'زما' AND pashto_word NOT IN ('زما،','زما.','زما!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زما', 48);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زما،';
DELETE FROM word_frequencies WHERE pashto_word = 'زما.';
DELETE FROM word_frequencies WHERE pashto_word = 'زما!';

-- Merge 1 variants of 'آو': آو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آو،';

-- Sum frequencies from all variants: 34 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 34
WHERE pashto_word = 'آو' AND pashto_word NOT IN ('آو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آو', 34);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آو،';

-- Merge 2 variants of 'راغی': راغی،, راغی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغی.';

-- Sum frequencies from all variants: 60 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 60
WHERE pashto_word = 'راغی' AND pashto_word NOT IN ('راغی،','راغی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغی', 60);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغی،';
DELETE FROM word_frequencies WHERE pashto_word = 'راغی.';

-- Merge 2 variants of 'راغله': راغله., راغله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغله،';

-- Sum frequencies from all variants: 55 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 55
WHERE pashto_word = 'راغله' AND pashto_word NOT IN ('راغله.','راغله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغله', 55);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغله.';
DELETE FROM word_frequencies WHERE pashto_word = 'راغله،';

-- Merge 2 variants of 'وشړل': وشړل., وشړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړل،';

-- Sum frequencies from all variants: 36 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 36
WHERE pashto_word = 'وشړل' AND pashto_word NOT IN ('وشړل.','وشړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړل', 36);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشړل،';

-- Merge 2 variants of 'ورکوله': ورکوله., ورکوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوله،';

-- Sum frequencies from all variants: 41 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 41
WHERE pashto_word = 'ورکوله' AND pashto_word NOT IN ('ورکوله.','ورکوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوله', 41);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوله،';

-- Merge 1 variants of 'مشران': مشران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشران،';

-- Sum frequencies from all variants: 33 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 33
WHERE pashto_word = 'مشران' AND pashto_word NOT IN ('مشران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشران', 33);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشران،';

-- Merge 2 variants of 'زامن': زامن،, زامن.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زامن،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زامن.';

-- Sum frequencies from all variants: 37 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 37
WHERE pashto_word = 'زامن' AND pashto_word NOT IN ('زامن،','زامن.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زامن', 37);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زامن،';
DELETE FROM word_frequencies WHERE pashto_word = 'زامن.';

-- Merge 2 variants of 'واورېدو': واورېدو،, واورېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورېدو.';

-- Sum frequencies from all variants: 45 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 45
WHERE pashto_word = 'واورېدو' AND pashto_word NOT IN ('واورېدو،','واورېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورېدو', 45);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'واورېدو.';

-- Merge 2 variants of 'اوسېدو': اوسېدو., اوسېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدو،';

-- Sum frequencies from all variants: 53 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 53
WHERE pashto_word = 'اوسېدو' AND pashto_word NOT IN ('اوسېدو.','اوسېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدو', 53);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدو،';

-- Merge 2 variants of 'وجه': وجه،, وجه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وجه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وجه.';

-- Sum frequencies from all variants: 35 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 35
WHERE pashto_word = 'وجه' AND pashto_word NOT IN ('وجه،','وجه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وجه', 35);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وجه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وجه.';

-- Merge 2 variants of 'ولېږلو': ولېږلو،, ولېږلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږلو.';

-- Sum frequencies from all variants: 52 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 52
WHERE pashto_word = 'ولېږلو' AND pashto_word NOT IN ('ولېږلو،','ولېږلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږلو', 52);
