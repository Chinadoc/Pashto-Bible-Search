
-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'استعمالوی' AND pashto_word NOT IN ('استعمالوی،','استعمالوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعمالوی', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالوی.';

-- Merge 2 variants of 'ویيله': ویيله., ویيله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویيله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ویيله،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ویيله' AND pashto_word NOT IN ('ویيله.','ویيله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویيله', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویيله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ویيله،';

-- Merge 1 variants of 'ګاه': ګاه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګاه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګاه' AND pashto_word NOT IN ('ګاه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګاه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګاه،';

-- Merge 1 variants of 'آمين': آمين،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آمين،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'آمين' AND pashto_word NOT IN ('آمين،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آمين', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آمين،';

-- Merge 1 variants of 'عزي': عزي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزي،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عزي' AND pashto_word NOT IN ('عزي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزي،';

-- Merge 1 variants of 'نیکه': نیکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نیکه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'نیکه' AND pashto_word NOT IN ('نیکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نیکه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نیکه،';

-- Merge 1 variants of 'داوده': داوده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'داوده،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'داوده' AND pashto_word NOT IN ('داوده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('داوده', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'داوده،';

-- Merge 2 variants of 'شرمېږم': شرمېږم., شرمېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شرمېږم،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'شرمېږم' AND pashto_word NOT IN ('شرمېږم.','شرمېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرمېږم', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرمېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'شرمېږم،';

-- Merge 2 variants of 'پاڅېږه': پاڅېږه،, «پاڅېږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېږه،';
DELETE FROM word_verse_mapping WHERE pashto_word = '«پاڅېږه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'پاڅېږه' AND pashto_word NOT IN ('پاڅېږه،','«پاڅېږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېږه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېږه،';
DELETE FROM word_frequencies WHERE pashto_word = '«پاڅېږه،';

-- Merge 1 variants of 'اولادې': اولادې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اولادې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اولادې' AND pashto_word NOT IN ('اولادې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اولادې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اولادې،';

-- Merge 2 variants of 'ورسېدله': ورسېدله،, ورسېدله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدله.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورسېدله' AND pashto_word NOT IN ('ورسېدله،','ورسېدله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدله', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدله،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدله.';

-- Merge 1 variants of 'ورسوو': ورسوو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورسوو' AND pashto_word NOT IN ('ورسوو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوو.';

-- Merge 2 variants of 'پرېوت': پرېوت., پرېوت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوت.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوت،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'پرېوت' AND pashto_word NOT IN ('پرېوت.','پرېوت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوت', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوت.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوت،';

-- Merge 2 variants of 'ښودلې': ښودلې., ښودلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودلې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ښودلې' AND pashto_word NOT IN ('ښودلې.','ښودلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودلې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښودلې،';

-- Merge 1 variants of 'راووځه': راووځه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووځه.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راووځه' AND pashto_word NOT IN ('راووځه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووځه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووځه.»';

-- Merge 1 variants of 'پرېنښود': پرېنښود.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېنښود.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پرېنښود' AND pashto_word NOT IN ('پرېنښود.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېنښود', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېنښود.';

-- Merge 1 variants of 'اورشلیم': اورشلیم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورشلیم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اورشلیم' AND pashto_word NOT IN ('اورشلیم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورشلیم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورشلیم،';

-- Merge 1 variants of 'توما': توما،

DELETE FROM word_verse_mapping WHERE pashto_word = 'توما،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'توما' AND pashto_word NOT IN ('توما،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('توما', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'توما،';

-- Merge 2 variants of 'راورسېدل': راورسېدل،, راورسېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راورسېدل.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'راورسېدل' AND pashto_word NOT IN ('راورسېدل،','راورسېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راورسېدل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'راورسېدل.';

-- Merge 1 variants of 'ورځې': ورځې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورځې' AND pashto_word NOT IN ('ورځې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځې،';

-- Merge 3 variants of 'ولېږم': ولېږم., ولېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږم.»';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ولېږم' AND pashto_word NOT IN ('ولېږم.','ولېږم،','ولېږم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږم', 11);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږم.»';

-- Merge 1 variants of 'راننوتل': راننوتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راننوتل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راننوتل' AND pashto_word NOT IN ('راننوتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راننوتل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راننوتل،';

-- Merge 1 variants of 'پرېږدو': پرېږدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پرېږدو' AND pashto_word NOT IN ('پرېږدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدو.';

-- Merge 3 variants of 'پېژانده': پېژانده., پېژانده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژانده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژانده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژانده.»';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'پېژانده' AND pashto_word NOT IN ('پېژانده.','پېژانده،','پېژانده.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژانده', 11);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژانده.';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژانده،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژانده.»';

-- Merge 1 variants of 'غولوي': غولوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غولوي.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'غولوي' AND pashto_word NOT IN ('غولوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غولوي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غولوي.';

-- Merge 1 variants of 'مهربانۍ': مهربانۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مهربانۍ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مهربانۍ' AND pashto_word NOT IN ('مهربانۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مهربانۍ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مهربانۍ،';

-- Merge 1 variants of 'عاجزۍ': عاجزۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عاجزۍ،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عاجزۍ' AND pashto_word NOT IN ('عاجزۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عاجزۍ', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عاجزۍ،';

-- Merge 2 variants of 'لیدل': لیدل., لیدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لیدل،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'لیدل' AND pashto_word NOT IN ('لیدل.','لیدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیدل', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'لیدل،';

-- Merge 2 variants of 'سوځوي': سوځوي., سوځوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوځوي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سوځوي،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'سوځوي' AND pashto_word NOT IN ('سوځوي.','سوځوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوځوي', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوځوي.';
DELETE FROM word_frequencies WHERE pashto_word = 'سوځوي،';

-- Merge 1 variants of 'ډک': ډک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډک،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ډک' AND pashto_word NOT IN ('ډک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډک', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډک،';

-- Merge 2 variants of 'تښتي': تښتي., تښتي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتي،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'تښتي' AND pashto_word NOT IN ('تښتي.','تښتي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتي', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتي.';
DELETE FROM word_frequencies WHERE pashto_word = 'تښتي،';

-- Merge 2 variants of 'راوړم': راوړم., راوړم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړم،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'راوړم' AND pashto_word NOT IN ('راوړم.','راوړم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړم', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړم،';

-- Merge 1 variants of 'وغواړې': وغواړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وغواړې' AND pashto_word NOT IN ('وغواړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړې،';

-- Merge 2 variants of 'وتاړه': وتاړه., وتاړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتاړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتاړه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وتاړه' AND pashto_word NOT IN ('وتاړه.','وتاړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتاړه', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتاړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتاړه،';

-- Merge 1 variants of 'وینم': وینم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وینم.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وینم' AND pashto_word NOT IN ('وینم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وینم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وینم.»';

-- Merge 1 variants of 'دي': دي!»

DELETE FROM word_verse_mapping WHERE pashto_word = 'دي!»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دي' AND pashto_word NOT IN ('دي!»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دي!»';

-- Merge 1 variants of 'وشړلو': وشړلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړلو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وشړلو' AND pashto_word NOT IN ('وشړلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړلو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړلو.';

-- Merge 2 variants of 'ورولېږم': ورولېږم., ورولېږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورولېږم،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ورولېږم' AND pashto_word NOT IN ('ورولېږم.','ورولېږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورولېږم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورولېږم،';

-- Merge 1 variants of 'زکریا': زکریا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زکریا،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زکریا' AND pashto_word NOT IN ('زکریا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زکریا', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زکریا،';

-- Merge 1 variants of 'ورکړي': ورکړي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړي.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورکړي' AND pashto_word NOT IN ('ورکړي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړي.»';

-- Merge 2 variants of 'څښم': څښم،, څښم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښم.»';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'څښم' AND pashto_word NOT IN ('څښم،','څښم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښم', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښم،';
DELETE FROM word_frequencies WHERE pashto_word = 'څښم.»';

-- Merge 2 variants of 'لاړې': لاړې., لاړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړې،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'لاړې' AND pashto_word NOT IN ('لاړې.','لاړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړې.';
DELETE FROM word_frequencies WHERE pashto_word = 'لاړې،';

-- Merge 1 variants of 'وباسې': وباسې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباسې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وباسې' AND pashto_word NOT IN ('وباسې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباسې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباسې.';

-- Merge 2 variants of 'وړلې': وړلې،, وړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړلې.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وړلې' AND pashto_word NOT IN ('وړلې،','وړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړلې', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'وړلې.';

-- Merge 1 variants of 'وویني': وویني.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویني.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وویني' AND pashto_word NOT IN ('وویني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویني', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویني.»';

-- Merge 3 variants of 'عیسی': عیسی،, عیسی!

DELETE FROM word_verse_mapping WHERE pashto_word = 'عیسی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عیسی!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عیسی.»';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'عیسی' AND pashto_word NOT IN ('عیسی،','عیسی!','عیسی.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عیسی', 10);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عیسی،';
DELETE FROM word_frequencies WHERE pashto_word = 'عیسی!';
DELETE FROM word_frequencies WHERE pashto_word = 'عیسی.»';

-- Merge 1 variants of 'راواخیستل': راواخیستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخیستل،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راواخیستل' AND pashto_word NOT IN ('راواخیستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخیستل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخیستل،';

-- Merge 2 variants of 'وخندل': وخندل., وخندل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخندل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخندل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخندل' AND pashto_word NOT IN ('وخندل.','وخندل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخندل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخندل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخندل،';

-- Merge 1 variants of 'سوځي': سوځي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوځي،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'سوځي' AND pashto_word NOT IN ('سوځي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوځي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوځي،';

-- Merge 1 variants of 'رالویږي': رالویږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رالویږي.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'رالویږي' AND pashto_word NOT IN ('رالویږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رالویږي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رالویږي.';

-- Merge 1 variants of 'غورځیږي': غورځیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورځیږي.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'غورځیږي' AND pashto_word NOT IN ('غورځیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورځیږي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورځیږي.';

-- Merge 1 variants of 'مسافر': مسافر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسافر،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مسافر' AND pashto_word NOT IN ('مسافر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسافر', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسافر،';

-- Merge 2 variants of 'ومنله': ومنله., ومنله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ومنله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ومنله' AND pashto_word NOT IN ('ومنله.','ومنله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومنله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومنله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ومنله،';

-- Merge 1 variants of 'لاندې': لاندې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاندې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لاندې' AND pashto_word NOT IN ('لاندې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاندې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاندې،';

-- Merge 2 variants of 'رسېدلې': رسېدلې., رسېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدلې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'رسېدلې' AND pashto_word NOT IN ('رسېدلې.','رسېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېدلې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدلې،';

-- Merge 1 variants of 'غلامان': غلامان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلامان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'غلامان' AND pashto_word NOT IN ('غلامان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلامان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلامان،';

-- Merge 1 variants of 'یاقوتو': یاقوتو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یاقوتو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'یاقوتو' AND pashto_word NOT IN ('یاقوتو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یاقوتو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یاقوتو،';

-- Merge 1 variants of 'حکمت': حکمت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکمت،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حکمت' AND pashto_word NOT IN ('حکمت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکمت', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکمت،';

-- Merge 1 variants of 'کارونو': کارونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کارونو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کارونو' AND pashto_word NOT IN ('کارونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کارونو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کارونو،';

-- Merge 1 variants of 'اخیستل': اخیستل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخیستل.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'اخیستل' AND pashto_word NOT IN ('اخیستل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخیستل', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخیستل.';

-- Merge 1 variants of 'عزریا': عزریا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزریا،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عزریا' AND pashto_word NOT IN ('عزریا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزریا', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزریا،';

-- Merge 1 variants of 'شمعیه': شمعیه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمعیه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شمعیه' AND pashto_word NOT IN ('شمعیه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمعیه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمعیه،';

-- Merge 1 variants of 'ولمانځه': ولمانځه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولمانځه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ولمانځه' AND pashto_word NOT IN ('ولمانځه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولمانځه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولمانځه.';

-- Merge 1 variants of 'یهودا': یهودا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یهودا،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'یهودا' AND pashto_word NOT IN ('یهودا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یهودا', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یهودا،';

-- Merge 1 variants of 'پنځه': پنځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پنځه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پنځه' AND pashto_word NOT IN ('پنځه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پنځه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پنځه،';

-- Merge 2 variants of 'اوسېدلې': اوسېدلې., اوسېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېدلې،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اوسېدلې' AND pashto_word NOT IN ('اوسېدلې.','اوسېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېدلې', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېدلې،';

-- Merge 1 variants of 'حمات': حمات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حمات،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حمات' AND pashto_word NOT IN ('حمات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حمات', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حمات،';

-- Merge 1 variants of 'ورسوې': ورسوې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسوې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورسوې' AND pashto_word NOT IN ('ورسوې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسوې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسوې.';

-- Merge 1 variants of 'شات': شات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شات،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شات' AND pashto_word NOT IN ('شات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شات', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شات،';

-- Merge 1 variants of 'واورم': واورم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورم.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واورم' AND pashto_word NOT IN ('واورم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورم.';

-- Merge 1 variants of 'ځلېدو': ځلېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلېدو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ځلېدو' AND pashto_word NOT IN ('ځلېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځلېدو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځلېدو،';

-- Merge 1 variants of 'معبودان': معبودان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معبودان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'معبودان' AND pashto_word NOT IN ('معبودان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معبودان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معبودان،';

-- Merge 2 variants of 'پېژندلو': پېژندلو., پېژندلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېژندلو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پېژندلو' AND pashto_word NOT IN ('پېژندلو.','پېژندلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېژندلو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'پېژندلو،';

-- Merge 1 variants of 'عِلم': عِلم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عِلم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'عِلم' AND pashto_word NOT IN ('عِلم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عِلم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عِلم،';

-- Merge 1 variants of 'واوړېدو': واوړېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړېدو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'واوړېدو' AND pashto_word NOT IN ('واوړېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوړېدو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوړېدو،';

-- Merge 1 variants of 'خاوره': خاوره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاوره،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'خاوره' AND pashto_word NOT IN ('خاوره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاوره', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاوره،';

-- Merge 1 variants of 'مشيران': مشيران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشيران،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'مشيران' AND pashto_word NOT IN ('مشيران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشيران', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشيران،';

-- Merge 1 variants of 'کسان': کسان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کسان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کسان' AND pashto_word NOT IN ('کسان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کسان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کسان،';

-- Merge 1 variants of 'نبوکدنضر': نبوکدنضر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نبوکدنضر،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'نبوکدنضر' AND pashto_word NOT IN ('نبوکدنضر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نبوکدنضر', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نبوکدنضر،';

-- Merge 1 variants of 'زېړو': زېړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زېړو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زېړو' AND pashto_word NOT IN ('زېړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زېړو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زېړو،';

-- Merge 2 variants of 'وليکلو': وليکلو., وليکلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليکلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وليکلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وليکلو' AND pashto_word NOT IN ('وليکلو.','وليکلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليکلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليکلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وليکلو،';

-- Merge 1 variants of 'حکم': حکم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حکم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'حکم' AND pashto_word NOT IN ('حکم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حکم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حکم،';

-- Merge 1 variants of 'وروغورزولو': وروغورزولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروغورزولو.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وروغورزولو' AND pashto_word NOT IN ('وروغورزولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروغورزولو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروغورزولو.';

-- Merge 1 variants of 'کوونکيه': کوونکيه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوونکيه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کوونکيه' AND pashto_word NOT IN ('کوونکيه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوونکيه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوونکيه،';

-- Merge 2 variants of 'ودرېدلو': ودرېدلو،, ودرېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلو.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ودرېدلو' AND pashto_word NOT IN ('ودرېدلو،','ودرېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدلو', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلو.';

-- Merge 1 variants of 'غویانو': غویانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غویانو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'غویانو' AND pashto_word NOT IN ('غویانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غویانو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غویانو،';

-- Merge 2 variants of 'ووژنې': ووژنې،, ووژنې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنې.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ووژنې' AND pashto_word NOT IN ('ووژنې،','ووژنې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنې', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنې.';

-- Merge 1 variants of 'ځکه': ځکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځکه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ځکه' AND pashto_word NOT IN ('ځکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځکه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځکه،';

-- Merge 1 variants of 'ورسېدم': ورسېدم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسېدم،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورسېدم' AND pashto_word NOT IN ('ورسېدم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسېدم', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسېدم،';

-- Merge 1 variants of 'وانخلي': وانخلي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وانخلي،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وانخلي' AND pashto_word NOT IN ('وانخلي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وانخلي', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وانخلي،';

-- Merge 2 variants of 'منل': منل., منل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'منل،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'منل' AND pashto_word NOT IN ('منل.','منل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منل', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منل.';
DELETE FROM word_frequencies WHERE pashto_word = 'منل،';

-- Merge 3 variants of 'انسان': انسان،, انسان.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'انسان،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'انسان.»';
DELETE FROM word_verse_mapping WHERE pashto_word = 'انسان.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'انسان' AND pashto_word NOT IN ('انسان،','انسان.»','انسان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انسان', 9);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انسان،';
DELETE FROM word_frequencies WHERE pashto_word = 'انسان.»';
DELETE FROM word_frequencies WHERE pashto_word = 'انسان.';

-- Merge 2 variants of 'وژنم': وژنم،, وژنم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژنم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژنم.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وژنم' AND pashto_word NOT IN ('وژنم،','وژنم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژنم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژنم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وژنم.';

-- Merge 1 variants of 'دوه': دوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دوه،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دوه' AND pashto_word NOT IN ('دوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دوه', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دوه،';

-- Merge 2 variants of 'ساتل': ساتل., ساتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتل،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'ساتل' AND pashto_word NOT IN ('ساتل.','ساتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتل،';

-- Merge 1 variants of 'وشړلې': وشړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشړلې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وشړلې' AND pashto_word NOT IN ('وشړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشړلې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشړلې.';

-- Merge 2 variants of 'خوشحالېږم': خوشحالېږم،, خوشحالېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خوشحالېږم.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'خوشحالېږم' AND pashto_word NOT IN ('خوشحالېږم،','خوشحالېږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوشحالېږم', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'خوشحالېږم.';

-- Merge 1 variants of 'لښکرو': لښکرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لښکرو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لښکرو' AND pashto_word NOT IN ('لښکرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لښکرو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لښکرو،';

-- Merge 1 variants of 'دروازې': دروازې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دروازې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'دروازې' AND pashto_word NOT IN ('دروازې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دروازې', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دروازې،';

-- Merge 1 variants of 'چوکاټونو': چوکاټونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چوکاټونو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'چوکاټونو' AND pashto_word NOT IN ('چوکاټونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چوکاټونو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چوکاټونو،';

-- Merge 1 variants of 'زاباد': زاباد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زاباد،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زاباد' AND pashto_word NOT IN ('زاباد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زاباد', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زاباد،';

-- Merge 1 variants of 'سندرغاړو': سندرغاړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سندرغاړو،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'سندرغاړو' AND pashto_word NOT IN ('سندرغاړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سندرغاړو', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سندرغاړو،';

-- Merge 1 variants of 'شربیا': شربیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شربیا،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شربیا' AND pashto_word NOT IN ('شربیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شربیا', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شربیا،';

-- Merge 1 variants of 'زارح': زارح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زارح،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'زارح' AND pashto_word NOT IN ('زارح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زارح', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زارح،';

-- Merge 1 variants of 'لوتان': لوتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوتان،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'لوتان' AND pashto_word NOT IN ('لوتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوتان', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوتان،';

-- Merge 1 variants of 'شوبال': شوبال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوبال،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'شوبال' AND pashto_word NOT IN ('شوبال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوبال', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوبال،';

-- Merge 1 variants of 'صبعون': صبعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صبعون،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'صبعون' AND pashto_word NOT IN ('صبعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صبعون', 5);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صبعون،';
