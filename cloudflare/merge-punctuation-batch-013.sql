
-- Merge 1 variants of 'خوسی': خوسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوسی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خوسی' AND pashto_word NOT IN ('خوسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوسی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوسی،';

-- Merge 1 variants of 'ونو': ونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ونو' AND pashto_word NOT IN ('ونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونو،';

-- Merge 1 variants of 'اسراییله': اسراییله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسراییله،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اسراییله' AND pashto_word NOT IN ('اسراییله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسراییله', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسراییله،';

-- Merge 2 variants of 'وګرځېدل': وګرځېدل., وګرځېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځېدل،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وګرځېدل' AND pashto_word NOT IN ('وګرځېدل.','وګرځېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځېدل', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځېدل،';

-- Merge 3 variants of 'اوسې': اوسې،, اوسې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسې.»';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'اوسې' AND pashto_word NOT IN ('اوسې،','اوسې.','اوسې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسې', 12);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسې،';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسې.';
DELETE FROM word_frequencies WHERE pashto_word = 'اوسې.»';

-- Merge 1 variants of 'هلته': هلته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هلته،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'هلته' AND pashto_word NOT IN ('هلته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هلته', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هلته،';

-- Merge 2 variants of 'وينم': وينم., وينم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وينم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وينم،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'وينم' AND pashto_word NOT IN ('وينم.','وينم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وينم', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وينم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وينم،';

-- Merge 1 variants of 'قحط': قحط،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قحط،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'قحط' AND pashto_word NOT IN ('قحط،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قحط', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قحط،';

-- Merge 1 variants of '”يرمياه': ”يرمياه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”يرمياه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = '”يرمياه' AND pashto_word NOT IN ('”يرمياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”يرمياه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”يرمياه،';

-- Merge 2 variants of 'کړلو': کړلو., کړلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړلو،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کړلو' AND pashto_word NOT IN ('کړلو.','کړلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړلو', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړلو،';

-- Merge 1 variants of 'آبادى': آبادى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'آبادى.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'آبادى' AND pashto_word NOT IN ('آبادى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آبادى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آبادى.';

-- Merge 2 variants of 'يرېږې': يرېږې., يرېږې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږې،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'يرېږې' AND pashto_word NOT IN ('يرېږې.','يرېږې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږې.';
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږې،';

-- Merge 1 variants of 'باوجود': باوجود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باوجود،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'باوجود' AND pashto_word NOT IN ('باوجود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باوجود', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باوجود،';

-- Merge 1 variants of 'وګرځولو': وګرځولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځولو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وګرځولو' AND pashto_word NOT IN ('وګرځولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځولو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځولو.';

-- Merge 1 variants of 'اليسمع': اليسمع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اليسمع،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اليسمع' AND pashto_word NOT IN ('اليسمع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اليسمع', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اليسمع،';

-- Merge 1 variants of 'الناتن': الناتن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الناتن،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'الناتن' AND pashto_word NOT IN ('الناتن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الناتن', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الناتن،';

-- Merge 1 variants of 'شِکم': شِکم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شِکم،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شِکم' AND pashto_word NOT IN ('شِکم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شِکم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شِکم،';

-- Merge 1 variants of 'دريږى': دريږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دريږى.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'دريږى' AND pashto_word NOT IN ('دريږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دريږى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دريږى.';

-- Merge 2 variants of 'وړم': وړم., وړم.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړم.»';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وړم' AND pashto_word NOT IN ('وړم.','وړم.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړم', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وړم.»';

-- Merge 1 variants of 'راپاڅوم': راپاڅوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅوم.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راپاڅوم' AND pashto_word NOT IN ('راپاڅوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅوم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅوم.';

-- Merge 1 variants of 'بابله': بابله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بابله،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'بابله' AND pashto_word NOT IN ('بابله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بابله', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بابله،';

-- Merge 2 variants of 'لرلو': لرلو،, لرلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لرلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لرلو.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'لرلو' AND pashto_word NOT IN ('لرلو،','لرلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لرلو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لرلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'لرلو.';

-- Merge 2 variants of 'راغونډوى': راغونډوى،, راغونډوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغونډوى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغونډوى.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'راغونډوى' AND pashto_word NOT IN ('راغونډوى،','راغونډوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغونډوى', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغونډوى،';
DELETE FROM word_frequencies WHERE pashto_word = 'راغونډوى.';

-- Merge 1 variants of 'خلى': خلى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلى.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خلى' AND pashto_word NOT IN ('خلى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلى.';

-- Merge 1 variants of 'سړو': سړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سړو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'سړو' AND pashto_word NOT IN ('سړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سړو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سړو،';

-- Merge 1 variants of 'ووايو': ووايو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووايو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ووايو' AND pashto_word NOT IN ('ووايو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووايو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووايو،';

-- Merge 2 variants of 'ويروى': ويروى., ويروى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويروى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ويروى،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ويروى' AND pashto_word NOT IN ('ويروى.','ويروى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويروى', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويروى.';
DELETE FROM word_frequencies WHERE pashto_word = 'ويروى،';

-- Merge 2 variants of 'ويريږى': ويريږى،, ويريږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويريږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ويريږى.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ويريږى' AND pashto_word NOT IN ('ويريږى،','ويريږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويريږى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويريږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ويريږى.';

-- Merge 1 variants of 'تفوح': تفوح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تفوح،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'تفوح' AND pashto_word NOT IN ('تفوح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تفوح', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تفوح،';

-- Merge 1 variants of 'بعل': بعل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بعل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'بعل' AND pashto_word NOT IN ('بعل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بعل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بعل،';

-- Merge 1 variants of 'جبعون': جبعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جبعون،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جبعون' AND pashto_word NOT IN ('جبعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جبعون', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جبعون،';

-- Merge 1 variants of 'ښکارېدل': ښکارېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارېدل.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ښکارېدل' AND pashto_word NOT IN ('ښکارېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارېدل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارېدل.';

-- Merge 2 variants of 'کس': کس،, کس.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کس،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کس.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کس' AND pashto_word NOT IN ('کس،','کس.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کس', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کس،';
DELETE FROM word_frequencies WHERE pashto_word = 'کس.';

-- Merge 1 variants of 'ورځو': ورځو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورځو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ورځو' AND pashto_word NOT IN ('ورځو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورځو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورځو،';

-- Merge 1 variants of 'عقوب': عقوب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عقوب،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عقوب' AND pashto_word NOT IN ('عقوب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عقوب', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عقوب،';

-- Merge 2 variants of 'هېروه': هېروه., هېروه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هېروه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هېروه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'هېروه' AND pashto_word NOT IN ('هېروه.','هېروه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هېروه', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هېروه.';
DELETE FROM word_frequencies WHERE pashto_word = 'هېروه،';

-- Merge 1 variants of 'سنبلط': سنبلط،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سنبلط،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'سنبلط' AND pashto_word NOT IN ('سنبلط،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سنبلط', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سنبلط،';

-- Merge 1 variants of 'مونږ': مونږ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مونږ،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'مونږ' AND pashto_word NOT IN ('مونږ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مونږ', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مونږ،';

-- Merge 1 variants of 'هارون': هارون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هارون،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'هارون' AND pashto_word NOT IN ('هارون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هارون', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هارون،';

-- Merge 1 variants of 'خېمه': خېمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خېمه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'خېمه' AND pashto_word NOT IN ('خېمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خېمه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خېمه،';

-- Merge 1 variants of 'جينکو': جينکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جينکو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جينکو' AND pashto_word NOT IN ('جينکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جينکو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جينکو،';

-- Merge 2 variants of 'ځليږينه': ځليږينه., ځليږينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځليږينه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځليږينه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'ځليږينه' AND pashto_word NOT IN ('ځليږينه.','ځليږينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځليږينه', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځليږينه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ځليږينه،';

-- Merge 2 variants of 'کړمه': کړمه،, کړمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړمه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړمه.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کړمه' AND pashto_word NOT IN ('کړمه،','کړمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړمه', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړمه،';
DELETE FROM word_frequencies WHERE pashto_word = 'کړمه.';

-- Merge 1 variants of 'مطابق': مطابق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مطابق،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'مطابق' AND pashto_word NOT IN ('مطابق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مطابق', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مطابق،';

-- Merge 1 variants of 'نزدې': نزدې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نزدې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'نزدې' AND pashto_word NOT IN ('نزدې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نزدې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نزدې،';

-- Merge 2 variants of 'ورَغلو': ورَغلو., ورَغلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورَغلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورَغلو،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ورَغلو' AND pashto_word NOT IN ('ورَغلو.','ورَغلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورَغلو', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورَغلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورَغلو،';

-- Merge 1 variants of 'دې': دې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'دې' AND pashto_word NOT IN ('دې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دې،';

-- Merge 1 variants of 'جامې': جامې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جامې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'جامې' AND pashto_word NOT IN ('جامې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جامې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جامې،';

-- Merge 1 variants of 'اِسمٰعيل': اِسمٰعيل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسمٰعيل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اِسمٰعيل' AND pashto_word NOT IN ('اِسمٰعيل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسمٰعيل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسمٰعيل،';

-- Merge 2 variants of 'موندل': موندل., موندل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موندل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'موندل،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'موندل' AND pashto_word NOT IN ('موندل.','موندل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موندل', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موندل.';
DELETE FROM word_frequencies WHERE pashto_word = 'موندل،';

-- Merge 2 variants of 'راتلو': راتلو., راتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلو،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'راتلو' AND pashto_word NOT IN ('راتلو.','راتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتلو', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راتلو،';

-- Merge 2 variants of 'يرېدو': يرېدو., يرېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېدو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېدو،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'يرېدو' AND pashto_word NOT IN ('يرېدو.','يرېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېدو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېدو.';
DELETE FROM word_frequencies WHERE pashto_word = 'يرېدو،';

-- Merge 1 variants of 'عُمرام': عُمرام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُمرام،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عُمرام' AND pashto_word NOT IN ('عُمرام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُمرام', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُمرام،';

-- Merge 2 variants of 'پرېښوده': پرېښوده., پرېښوده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښوده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښوده،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'پرېښوده' AND pashto_word NOT IN ('پرېښوده.','پرېښوده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښوده', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښوده.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښوده،';

-- Merge 1 variants of 'نوکرانو': نوکرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نوکرانو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'نوکرانو' AND pashto_word NOT IN ('نوکرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نوکرانو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نوکرانو،';

-- Merge 1 variants of 'واخستلې': واخستلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستلې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'واخستلې' AND pashto_word NOT IN ('واخستلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخستلې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخستلې،';

-- Merge 2 variants of 'والوځى': والوځى., والوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'والوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'والوځى،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'والوځى' AND pashto_word NOT IN ('والوځى.','والوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('والوځى', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'والوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'والوځى،';

-- Merge 1 variants of 'ونيول': ونيول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونيول،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ونيول' AND pashto_word NOT IN ('ونيول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونيول', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونيول،';

-- Merge 2 variants of 'آشر': آشر،, آشر.

DELETE FROM word_verse_mapping WHERE pashto_word = 'آشر،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'آشر.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'آشر' AND pashto_word NOT IN ('آشر،','آشر.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آشر', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آشر،';
DELETE FROM word_frequencies WHERE pashto_word = 'آشر.';

-- Merge 2 variants of 'وختلو': وختلو،, وختلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وختلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وختلو.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وختلو' AND pashto_word NOT IN ('وختلو،','وختلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وختلو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وختلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وختلو.';

-- Merge 1 variants of 'بيت‌ايل': بيت‌ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيت‌ايل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'بيت‌ايل' AND pashto_word NOT IN ('بيت‌ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيت‌ايل', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيت‌ايل،';

-- Merge 1 variants of 'حصور': حصور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حصور،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'حصور' AND pashto_word NOT IN ('حصور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حصور', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حصور،';

-- Merge 2 variants of 'ولېږله': ولېږله., ولېږله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولېږله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ولېږله' AND pashto_word NOT IN ('ولېږله.','ولېږله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولېږله', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولېږله،';

-- Merge 1 variants of 'داؤد': داؤد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'داؤد،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'داؤد' AND pashto_word NOT IN ('داؤد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('داؤد', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'داؤد،';

-- Merge 2 variants of 'کار': کار،, کار.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کار،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کار.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'کار' AND pashto_word NOT IN ('کار،','کار.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کار', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کار،';
DELETE FROM word_frequencies WHERE pashto_word = 'کار.';

-- Merge 1 variants of 'ناتن': ناتن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناتن،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ناتن' AND pashto_word NOT IN ('ناتن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناتن', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناتن،';

-- Merge 2 variants of 'وغوښتو': وغوښتو., وغوښتو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتو،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وغوښتو' AND pashto_word NOT IN ('وغوښتو.','وغوښتو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغوښتو', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتو،';

-- Merge 1 variants of 'راتلې': راتلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتلې.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راتلې' AND pashto_word NOT IN ('راتلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتلې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتلې.';

-- Merge 2 variants of 'سِمعى': سِمعى،, سِمعى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سِمعى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'سِمعى.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'سِمعى' AND pashto_word NOT IN ('سِمعى،','سِمعى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سِمعى', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سِمعى،';
DELETE FROM word_frequencies WHERE pashto_word = 'سِمعى.';

-- Merge 2 variants of 'راولېږى': راولېږى،, راولېږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راولېږى.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'راولېږى' AND pashto_word NOT IN ('راولېږى،','راولېږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولېږى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'راولېږى.';

-- Merge 1 variants of 'عُزى': عُزى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُزى،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عُزى' AND pashto_word NOT IN ('عُزى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُزى', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُزى،';

-- Merge 1 variants of 'ليويان': ليويان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ليويان،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ليويان' AND pashto_word NOT IN ('ليويان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ليويان', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ليويان،';

-- Merge 1 variants of 'يوزبد': يوزبد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوزبد،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'يوزبد' AND pashto_word NOT IN ('يوزبد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوزبد', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوزبد،';

-- Merge 1 variants of 'متنياه': متنياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'متنياه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'متنياه' AND pashto_word NOT IN ('متنياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('متنياه', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'متنياه،';

-- Merge 1 variants of 'کپړې': کپړې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کپړې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کپړې' AND pashto_word NOT IN ('کپړې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کپړې', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کپړې،';

-- Merge 1 variants of 'صداقت': صداقت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صداقت،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'صداقت' AND pashto_word NOT IN ('صداقت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صداقت', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صداقت،';

-- Merge 2 variants of 'عالمانو': عالمانو،, عالمانو!

DELETE FROM word_verse_mapping WHERE pashto_word = 'عالمانو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عالمانو!';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'عالمانو' AND pashto_word NOT IN ('عالمانو،','عالمانو!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عالمانو', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عالمانو،';
DELETE FROM word_frequencies WHERE pashto_word = 'عالمانو!';

-- Merge 2 variants of 'راواخسته': راواخسته،, راواخسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخسته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخسته.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راواخسته' AND pashto_word NOT IN ('راواخسته،','راواخسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخسته', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخسته،';
DELETE FROM word_frequencies WHERE pashto_word = 'راواخسته.';

-- Merge 1 variants of 'اورولو': اورولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورولو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اورولو' AND pashto_word NOT IN ('اورولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورولو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورولو.';

-- Merge 1 variants of 'سپېڅلی': سپېڅلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سپېڅلی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'سپېڅلی' AND pashto_word NOT IN ('سپېڅلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سپېڅلی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سپېڅلی،';

-- Merge 1 variants of 'غریب': غریب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غریب،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'غریب' AND pashto_word NOT IN ('غریب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غریب', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غریب،';

-- Merge 1 variants of 'یهودیانو': یهودیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یهودیانو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'یهودیانو' AND pashto_word NOT IN ('یهودیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یهودیانو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یهودیانو،';

-- Merge 1 variants of 'فیلیپوس': فیلیپوس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فیلیپوس،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'فیلیپوس' AND pashto_word NOT IN ('فیلیپوس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فیلیپوس', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فیلیپوس،';

-- Merge 2 variants of 'وویستله': وویستله،, وویستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویستله،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وویستله.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وویستله' AND pashto_word NOT IN ('وویستله،','وویستله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویستله', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویستله،';
DELETE FROM word_frequencies WHERE pashto_word = 'وویستله.';

-- Merge 1 variants of 'سفروایم': سفروایم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سفروایم،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'سفروایم' AND pashto_word NOT IN ('سفروایم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سفروایم', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سفروایم،';

-- Merge 1 variants of 'شاملېدلی': شاملېدلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شاملېدلی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'شاملېدلی' AND pashto_word NOT IN ('شاملېدلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شاملېدلی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شاملېدلی.';

-- Merge 3 variants of 'هغوی': هغوی،, هغوی!

DELETE FROM word_verse_mapping WHERE pashto_word = 'هغوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هغوی!';
DELETE FROM word_verse_mapping WHERE pashto_word = 'هغوی.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'هغوی' AND pashto_word NOT IN ('هغوی،','هغوی!','هغوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هغوی', 11);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هغوی،';
DELETE FROM word_frequencies WHERE pashto_word = 'هغوی!';
DELETE FROM word_frequencies WHERE pashto_word = 'هغوی.';

-- Merge 2 variants of 'تللی': تللی., تللی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تللی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تللی،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'تللی' AND pashto_word NOT IN ('تللی.','تللی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تللی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تللی.';
DELETE FROM word_frequencies WHERE pashto_word = 'تللی،';

-- Merge 1 variants of 'رسولی': رسولی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسولی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'رسولی' AND pashto_word NOT IN ('رسولی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسولی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسولی.';

-- Merge 2 variants of 'راونیسی': راونیسی., راونیسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راونیسی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راونیسی،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'راونیسی' AND pashto_word NOT IN ('راونیسی.','راونیسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راونیسی', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راونیسی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راونیسی،';

-- Merge 1 variants of 'درلېږلی': درلېږلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درلېږلی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'درلېږلی' AND pashto_word NOT IN ('درلېږلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درلېږلی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درلېږلی.';

-- Merge 2 variants of 'کېدی': کېدی،, کېدی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدی.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کېدی' AND pashto_word NOT IN ('کېدی،','کېدی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدی', 9);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدی،';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدی.';

-- Merge 1 variants of 'یادوی': یادوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادوی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'یادوی' AND pashto_word NOT IN ('یادوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادوی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادوی.';

-- Merge 2 variants of 'خرڅوی': خرڅوی., خرڅوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرڅوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خرڅوی،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'خرڅوی' AND pashto_word NOT IN ('خرڅوی.','خرڅوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرڅوی', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرڅوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'خرڅوی،';

-- Merge 1 variants of 'نمسی': نمسی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نمسی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'نمسی' AND pashto_word NOT IN ('نمسی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نمسی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نمسی،';

-- Merge 2 variants of 'کښېنی': کښېنی،, کښېنی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنی.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'کښېنی' AND pashto_word NOT IN ('کښېنی،','کښېنی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنی', 10);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنی،';
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنی.';

-- Merge 1 variants of 'لېږی': لېږی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لېږی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'لېږی' AND pashto_word NOT IN ('لېږی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لېږی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لېږی.';

-- Merge 2 variants of 'راووتلی': راووتلی., راووتلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلی،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'راووتلی' AND pashto_word NOT IN ('راووتلی.','راووتلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتلی', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلی،';

-- Merge 1 variants of 'ویيلو': ویيلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویيلو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ویيلو' AND pashto_word NOT IN ('ویيلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویيلو', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویيلو.';

-- Merge 1 variants of '”راشی': ”راشی،

DELETE FROM word_verse_mapping WHERE pashto_word = '”راشی،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = '”راشی' AND pashto_word NOT IN ('”راشی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”راشی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”راشی،';

-- Merge 2 variants of 'وغږوی': وغږوی., وغږوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغږوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغږوی،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وغږوی' AND pashto_word NOT IN ('وغږوی.','وغږوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغږوی', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغږوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغږوی،';

-- Merge 1 variants of 'اوړېدلی': اوړېدلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړېدلی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'اوړېدلی' AND pashto_word NOT IN ('اوړېدلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړېدلی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړېدلی.';

-- Merge 2 variants of 'تلی': تلی،, تلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تلی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تلی.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'تلی' AND pashto_word NOT IN ('تلی،','تلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تلی', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تلی،';
DELETE FROM word_frequencies WHERE pashto_word = 'تلی.';

-- Merge 1 variants of 'پرېښودلی': پرېښودلی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېښودلی.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'پرېښودلی' AND pashto_word NOT IN ('پرېښودلی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېښودلی', 6);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېښودلی.';

-- Merge 2 variants of 'استعمالوی': استعمالوی،, استعمالوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالوی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالوی.';
