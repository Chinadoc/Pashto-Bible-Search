
-- Merge 1 variants of 'زغمى': زغمى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'زغمى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زغمى' AND pashto_word NOT IN ('زغمى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زغمى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زغمى.';

-- Merge 2 variants of 'راوړلو': راوړلو., راوړلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راوړلو' AND pashto_word NOT IN ('راوړلو.','راوړلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړلو،';

-- Merge 2 variants of 'وغوښته': وغوښته., وغوښته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښته.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښته،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وغوښته' AND pashto_word NOT IN ('وغوښته.','وغوښته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغوښته', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښته.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښته،';

-- Merge 1 variants of 'ووتو': ووتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووتو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ووتو' AND pashto_word NOT IN ('ووتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووتو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووتو.';

-- Merge 1 variants of 'وځلېده': وځلېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځلېده.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وځلېده' AND pashto_word NOT IN ('وځلېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځلېده', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځلېده.';

-- Merge 1 variants of 'پېژندلی': پېژندلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندلی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پېژندلی' AND pashto_word NOT IN ('پېژندلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژندلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندلی،';

-- Merge 1 variants of 'نیکونو': نیکونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیکونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نیکونو' AND pashto_word NOT IN ('نیکونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیکونو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیکونو،';

-- Merge 1 variants of 'رښتیا': رښتیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رښتیا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'رښتیا' AND pashto_word NOT IN ('رښتیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رښتیا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رښتیا،';

-- Merge 1 variants of 'قبیلو': قبیلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قبیلو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'قبیلو' AND pashto_word NOT IN ('قبیلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قبیلو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قبیلو،';

-- Merge 1 variants of 'اورېدلی': اورېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدلی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اورېدلی' AND pashto_word NOT IN ('اورېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورېدلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدلی،';

-- Merge 1 variants of 'عزیقه': عزیقه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزیقه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عزیقه' AND pashto_word NOT IN ('عزیقه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزیقه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزیقه،';

-- Merge 1 variants of 'یوآب': یوآب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوآب،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'یوآب' AND pashto_word NOT IN ('یوآب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوآب', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوآب،';

-- Merge 2 variants of 'ځایه': ځایه،, ځایه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځایه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځایه!';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ځایه' AND pashto_word NOT IN ('ځایه،','ځایه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځایه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځایه،';
DELETE FROM word_frequencies WHERE pashto_word = 'ځایه!';

-- Merge 1 variants of 'اکزیب': اکزیب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اکزیب،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اکزیب' AND pashto_word NOT IN ('اکزیب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اکزیب', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اکزیب،';

-- Merge 2 variants of 'ولېږی': ولېږی., ولېږی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ولېږی' AND pashto_word NOT IN ('ولېږی.','ولېږی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږی.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږی،';

-- Merge 1 variants of 'کالی': کالی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کالی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کالی' AND pashto_word NOT IN ('کالی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کالی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کالی،';

-- Merge 1 variants of 'بلوی': بلوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بلوی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بلوی' AND pashto_word NOT IN ('بلوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بلوی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بلوی.';

-- Merge 2 variants of 'راټولوی': راټولوی., راټولوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولوی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راټولوی' AND pashto_word NOT IN ('راټولوی.','راټولوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راټولوی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راټولوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راټولوی،';

-- Merge 2 variants of 'ولولی': ولولی،, ولولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولولی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولولی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ولولی' AND pashto_word NOT IN ('ولولی،','ولولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولولی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولولی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولولی.';

-- Merge 1 variants of 'بخښی': بخښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بخښی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بخښی' AND pashto_word NOT IN ('بخښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بخښی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بخښی،';

-- Merge 2 variants of 'پخوی': پخوی., پخوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پخوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پخوی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'پخوی' AND pashto_word NOT IN ('پخوی.','پخوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پخوی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پخوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'پخوی،';

-- Merge 1 variants of 'وکری': وکری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکری،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وکری' AND pashto_word NOT IN ('وکری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکری', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکری،';

-- Merge 1 variants of 'خوشحالېږی': خوشحالېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالېږی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خوشحالېږی' AND pashto_word NOT IN ('خوشحالېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالېږی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالېږی.';

-- Merge 1 variants of 'ايسارولی': ايسارولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايسارولی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ايسارولی' AND pashto_word NOT IN ('ايسارولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايسارولی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايسارولی.';

-- Merge 2 variants of 'لویيږى': لویيږى،, لویيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لویيږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لویيږى.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'لویيږى' AND pashto_word NOT IN ('لویيږى،','لویيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لویيږى', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لویيږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'لویيږى.';

-- Merge 1 variants of 'قِريَتایم': قِريَتایم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قِريَتایم،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'قِريَتایم' AND pashto_word NOT IN ('قِريَتایم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قِريَتایم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قِريَتایم،';

-- Merge 2 variants of 'کَری': کَری., کَری،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کَری.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کَری،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'کَری' AND pashto_word NOT IN ('کَری.','کَری،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کَری', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کَری.';
DELETE FROM word_frequencies WHERE pashto_word = 'کَری،';

-- Merge 1 variants of 'پرېښی': پرېښی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'پرېښی' AND pashto_word NOT IN ('پرېښی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښی،';

-- Merge 1 variants of 'تېرېدلی': تېرېدلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېدلی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تېرېدلی' AND pashto_word NOT IN ('تېرېدلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرېدلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېدلی.';

-- Merge 1 variants of 'شړلی': شړلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شړلی،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شړلی' AND pashto_word NOT IN ('شړلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شړلی،';

-- Merge 2 variants of 'اخستی': اخستی., اخستی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستی،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اخستی' AND pashto_word NOT IN ('اخستی.','اخستی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخستی', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخستی.';
DELETE FROM word_frequencies WHERE pashto_word = 'اخستی،';

-- Merge 1 variants of 'تښتی': تښتی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تښتی' AND pashto_word NOT IN ('تښتی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتی.';

-- Merge 2 variants of 'اچوی': اچوی., اچوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اچوی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اچوی' AND pashto_word NOT IN ('اچوی.','اچوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچوی', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'اچوی،';

-- Merge 1 variants of 'عذابویينه': عذابویينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'عذابویينه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عذابویينه' AND pashto_word NOT IN ('عذابویينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عذابویينه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عذابویينه.';

-- Merge 1 variants of 'څښلی': څښلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښلی.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څښلی' AND pashto_word NOT IN ('څښلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښلی', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښلی.';

-- Merge 1 variants of 'اِفرایيم': اِفرایيم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِفرایيم،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اِفرایيم' AND pashto_word NOT IN ('اِفرایيم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِفرایيم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِفرایيم،';

-- Merge 2 variants of 'کارونه': کارونه،, کارونه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'کارونه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کارونه!';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کارونه' AND pashto_word NOT IN ('کارونه،','کارونه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کارونه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کارونه،';
DELETE FROM word_frequencies WHERE pashto_word = 'کارونه!';

-- Merge 1 variants of 'بيانوو': بيانوو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيانوو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بيانوو' AND pashto_word NOT IN ('بيانوو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيانوو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيانوو،';

-- Merge 1 variants of 'قُدوس': قُدوس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قُدوس،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'قُدوس' AND pashto_word NOT IN ('قُدوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قُدوس', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قُدوس،';

-- Merge 1 variants of 'یافیع': یافیع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یافیع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'یافیع' AND pashto_word NOT IN ('یافیع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یافیع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یافیع،';

-- Merge 1 variants of 'امنون': امنون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امنون،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'امنون' AND pashto_word NOT IN ('امنون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امنون', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امنون،';

-- Merge 1 variants of 'بقي': بقي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بقي،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بقي' AND pashto_word NOT IN ('بقي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بقي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بقي،';

-- Merge 1 variants of 'زرحیا': زرحیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زرحیا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'زرحیا' AND pashto_word NOT IN ('زرحیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زرحیا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زرحیا،';

-- Merge 1 variants of 'اخیمعص': اخیمعص،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخیمعص،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اخیمعص' AND pashto_word NOT IN ('اخیمعص،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخیمعص', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخیمعص،';

-- Merge 1 variants of 'شلوم': شلوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شلوم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شلوم' AND pashto_word NOT IN ('شلوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شلوم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شلوم،';

-- Merge 1 variants of 'حلقیا': حلقیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حلقیا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حلقیا' AND pashto_word NOT IN ('حلقیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حلقیا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حلقیا،';

-- Merge 1 variants of 'یدیعییل': یدیعییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یدیعییل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'یدیعییل' AND pashto_word NOT IN ('یدیعییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یدیعییل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یدیعییل،';

-- Merge 2 variants of 'خره': خره،, خره.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خره،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خره.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'خره' AND pashto_word NOT IN ('خره،','خره.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خره', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خره،';
DELETE FROM word_frequencies WHERE pashto_word = 'خره.';

-- Merge 2 variants of 'وژغورل': وژغورل،, وژغورل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژغورل.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وژغورل' AND pashto_word NOT IN ('وژغورل،','وژغورل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژغورل', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورل،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژغورل.';

-- Merge 1 variants of 'درباریان': درباریان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درباریان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'درباریان' AND pashto_word NOT IN ('درباریان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درباریان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درباریان،';

-- Merge 1 variants of 'زبدیا': زبدیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زبدیا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'زبدیا' AND pashto_word NOT IN ('زبدیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زبدیا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زبدیا،';

-- Merge 1 variants of 'شاوول': شاوول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شاوول،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شاوول' AND pashto_word NOT IN ('شاوول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شاوول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شاوول،';

-- Merge 1 variants of 'اوسېږو': اوسېږو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوسېږو' AND pashto_word NOT IN ('اوسېږو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږو،';

-- Merge 1 variants of 'وسیله': وسیله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسیله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وسیله' AND pashto_word NOT IN ('وسیله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسیله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسیله.';

-- Merge 1 variants of 'زغم': زغم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زغم،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'زغم' AND pashto_word NOT IN ('زغم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زغم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زغم،';

-- Merge 1 variants of 'واژه': واژه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واژه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واژه' AND pashto_word NOT IN ('واژه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واژه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واژه.';

-- Merge 1 variants of 'اوسېدلو': اوسېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوسېدلو' AND pashto_word NOT IN ('اوسېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدلو.';

-- Merge 1 variants of 'واغوستل': واغوستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واغوستل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'واغوستل' AND pashto_word NOT IN ('واغوستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واغوستل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واغوستل،';

-- Merge 2 variants of 'وزغملو': وزغملو., وزغملو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغملو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغملو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وزغملو' AND pashto_word NOT IN ('وزغملو.','وزغملو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزغملو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزغملو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وزغملو،';

-- Merge 1 variants of 'رسوې': رسوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رسوې' AND pashto_word NOT IN ('رسوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسوې،';

-- Merge 3 variants of 'ورځم': ورځم.», ورځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځم.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځم،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورځم' AND pashto_word NOT IN ('ورځم.»','ورځم.','ورځم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځم', 9);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځم.»';
DELETE FROM word_frequencies WHERE pashto_word = 'ورځم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورځم،';

-- Merge 2 variants of 'راولوېد': راولوېد., راولوېد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولوېد.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولوېد،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راولوېد' AND pashto_word NOT IN ('راولوېد.','راولوېد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولوېد', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولوېد.';
DELETE FROM word_frequencies WHERE pashto_word = 'راولوېد،';

-- Merge 1 variants of 'اچول': اچول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اچول.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اچول' AND pashto_word NOT IN ('اچول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اچول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اچول.';

-- Merge 2 variants of 'اورېدلو': اورېدلو., اورېدلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اورېدلو' AND pashto_word NOT IN ('اورېدلو.','اورېدلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورېدلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدلو،';

-- Merge 1 variants of 'عدالت': عدالت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عدالت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عدالت' AND pashto_word NOT IN ('عدالت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عدالت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عدالت،';

-- Merge 2 variants of 'کښېناسته': کښېناسته،, کښېناسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناسته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېناسته.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کښېناسته' AND pashto_word NOT IN ('کښېناسته،','کښېناسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېناسته', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناسته،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېناسته.';

-- Merge 2 variants of 'وګرځه': وګرځه.», وګرځه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځه.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګرځه' AND pashto_word NOT IN ('وګرځه.»','وګرځه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځه.»';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځه.';

-- Merge 1 variants of 'ویلی': ویلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویلی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ویلی' AND pashto_word NOT IN ('ویلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویلی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویلی.';

-- Merge 2 variants of 'نومېدله': نومېدله., نومېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نومېدله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'نومېدله،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'نومېدله' AND pashto_word NOT IN ('نومېدله.','نومېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نومېدله', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نومېدله.';
DELETE FROM word_frequencies WHERE pashto_word = 'نومېدله،';

-- Merge 1 variants of 'لیده': لیده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیده.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لیده' AND pashto_word NOT IN ('لیده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیده', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیده.';

-- Merge 1 variants of 'ږدي': ږدي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدي،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ږدي' AND pashto_word NOT IN ('ږدي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږدي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږدي،';

-- Merge 1 variants of 'راپاڅېد': راپاڅېد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅېد،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راپاڅېد' AND pashto_word NOT IN ('راپاڅېد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅېد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅېد،';

-- Merge 2 variants of 'واوسو': واوسو., واوسو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوسو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'واوسو' AND pashto_word NOT IN ('واوسو.','واوسو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوسو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوسو.';
DELETE FROM word_frequencies WHERE pashto_word = 'واوسو،';

-- Merge 1 variants of 'ولګاوه': ولګاوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګاوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ولګاوه' AND pashto_word NOT IN ('ولګاوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګاوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګاوه.';

-- Merge 1 variants of 'حکومت': حکومت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکومت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حکومت' AND pashto_word NOT IN ('حکومت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکومت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکومت،';

-- Merge 1 variants of 'خاوند': خاوند،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاوند،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خاوند' AND pashto_word NOT IN ('خاوند،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاوند', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاوند،';

-- Merge 1 variants of 'کښېنولو': کښېنولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنولو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کښېنولو' AND pashto_word NOT IN ('کښېنولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنولو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنولو.';

-- Merge 1 variants of 'رسولان': رسولان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسولان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'رسولان' AND pashto_word NOT IN ('رسولان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسولان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسولان،';

-- Merge 1 variants of 'پیغمبران': پیغمبران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پیغمبران،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پیغمبران' AND pashto_word NOT IN ('پیغمبران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پیغمبران', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پیغمبران،';

-- Merge 1 variants of 'حاکمانو': حاکمانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاکمانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حاکمانو' AND pashto_word NOT IN ('حاکمانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاکمانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاکمانو،';

-- Merge 1 variants of 'جګړې': جګړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جګړې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جګړې' AND pashto_word NOT IN ('جګړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جګړې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جګړې،';

-- Merge 1 variants of 'ورننوځو': ورننوځو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورننوځو' AND pashto_word NOT IN ('ورننوځو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوځو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځو.';

-- Merge 2 variants of 'وګڼل': وګڼل., وګڼل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګڼل' AND pashto_word NOT IN ('وګڼل.','وګڼل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګڼل', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼل،';

-- Merge 1 variants of 'جدعون': جدعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جدعون،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جدعون' AND pashto_word NOT IN ('جدعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جدعون', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جدعون،';

-- Merge 1 variants of 'پر‌دې': پر‌دې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پر‌دې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پر‌دې' AND pashto_word NOT IN ('پر‌دې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پر‌دې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پر‌دې،';

-- Merge 1 variants of 'لمبې': لمبې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لمبې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لمبې' AND pashto_word NOT IN ('لمبې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لمبې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لمبې،';

-- Merge 1 variants of 'تېز': تېز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېز،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تېز' AND pashto_word NOT IN ('تېز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېز', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېز،';

-- Merge 2 variants of 'منافقانو': منافقانو!, منافقانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منافقانو!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منافقانو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'منافقانو' AND pashto_word NOT IN ('منافقانو!','منافقانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منافقانو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منافقانو!';
DELETE FROM word_frequencies WHERE pashto_word = 'منافقانو،';

-- Merge 1 variants of 'ورکیږي': ورکیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکیږي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورکیږي' AND pashto_word NOT IN ('ورکیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکیږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکیږي.';

-- Merge 1 variants of 'قربانوم': قربانوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'قربانوم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'قربانوم' AND pashto_word NOT IN ('قربانوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قربانوم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قربانوم.';

-- Merge 1 variants of 'ومومم': ومومم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومومم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ومومم' AND pashto_word NOT IN ('ومومم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومومم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومومم.';

-- Merge 2 variants of 'خاطر': خاطر., خاطر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاطر.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خاطر،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خاطر' AND pashto_word NOT IN ('خاطر.','خاطر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاطر', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاطر.';
DELETE FROM word_frequencies WHERE pashto_word = 'خاطر،';

-- Merge 1 variants of 'ورواغوستله': ورواغوستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورواغوستله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورواغوستله' AND pashto_word NOT IN ('ورواغوستله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورواغوستله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورواغوستله.';

-- Merge 1 variants of 'وګڼله': وګڼله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وګڼله' AND pashto_word NOT IN ('وګڼله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګڼله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼله.';

-- Merge 1 variants of 'ړانده': ړانده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ړانده،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ړانده' AND pashto_word NOT IN ('ړانده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ړانده', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ړانده،';

-- Merge 2 variants of 'وګاڼه': وګاڼه., وګاڼه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګاڼه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګاڼه.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وګاڼه' AND pashto_word NOT IN ('وګاڼه.','وګاڼه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګاڼه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګاڼه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګاڼه.»';

-- Merge 2 variants of 'رارسېدلی': رارسېدلی., رارسېدلی.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'رارسېدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رارسېدلی.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'رارسېدلی' AND pashto_word NOT IN ('رارسېدلی.','رارسېدلی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رارسېدلی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رارسېدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'رارسېدلی.»';

-- Merge 1 variants of 'ولګوي': ولګوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولګوي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ولګوي' AND pashto_word NOT IN ('ولګوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولګوي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولګوي.';

-- Merge 1 variants of 'غورځولی': غورځولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورځولی.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غورځولی' AND pashto_word NOT IN ('غورځولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورځولی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورځولی.';

-- Merge 1 variants of 'دی.›': دی.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'دی.›»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دی.›' AND pashto_word NOT IN ('دی.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دی.›', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دی.›»';

-- Merge 1 variants of 'ابراهیمه': ابراهیمه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابراهیمه!';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ابراهیمه' AND pashto_word NOT IN ('ابراهیمه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابراهیمه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابراهیمه!';

-- Merge 1 variants of 'ده.›': ده.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ده.›»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ده.›' AND pashto_word NOT IN ('ده.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ده.›', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ده.›»';

-- Merge 1 variants of 'ځلیږي': ځلیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلیږي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ځلیږي' AND pashto_word NOT IN ('ځلیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځلیږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځلیږي.';

-- Merge 2 variants of 'خرڅول': خرڅول., خرڅول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرڅول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خرڅول،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'خرڅول' AND pashto_word NOT IN ('خرڅول.','خرڅول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرڅول', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرڅول.';
DELETE FROM word_frequencies WHERE pashto_word = 'خرڅول،';

-- Merge 1 variants of 'امپراتور': امپراتور.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'امپراتور.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'امپراتور' AND pashto_word NOT IN ('امپراتور.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امپراتور', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امپراتور.»';

-- Merge 1 variants of 'راونړیږي': راونړیږي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راونړیږي.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راونړیږي' AND pashto_word NOT IN ('راونړیږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راونړیږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راونړیږي.»';

-- Merge 1 variants of 'جنګیږي': جنګیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جنګیږي،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جنګیږي' AND pashto_word NOT IN ('جنګیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جنګیږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جنګیږي،';

-- Merge 2 variants of 'وبخښه': وبخښه،, وبخښه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وبخښه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وبخښه' AND pashto_word NOT IN ('وبخښه،','وبخښه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وبخښه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښه،';
DELETE FROM word_frequencies WHERE pashto_word = 'وبخښه.';

-- Merge 1 variants of 'وزېږاوه': وزېږاوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزېږاوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وزېږاوه' AND pashto_word NOT IN ('وزېږاوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزېږاوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزېږاوه.';

-- Merge 2 variants of 'ساتلې': ساتلې., ساتلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتلې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ساتلې' AND pashto_word NOT IN ('ساتلې.','ساتلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتلې', 5);
