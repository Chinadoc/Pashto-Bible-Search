
-- Merge 1 variants of 'تاکونه': تاکونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تاکونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تاکونه' AND pashto_word NOT IN ('تاکونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تاکونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تاکونه،';

-- Merge 2 variants of 'ځلېدل': ځلېدل،, ځلېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځلېدل.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ځلېدل' AND pashto_word NOT IN ('ځلېدل،','ځلېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځلېدل', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځلېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'ځلېدل.';

-- Merge 1 variants of 'ودرېدلم': ودرېدلم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرېدلم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ودرېدلم' AND pashto_word NOT IN ('ودرېدلم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرېدلم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرېدلم.';

-- Merge 1 variants of 'حاصل': حاصل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاصل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حاصل' AND pashto_word NOT IN ('حاصل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاصل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاصل.';

-- Merge 1 variants of 'صفا': صفا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صفا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'صفا' AND pashto_word NOT IN ('صفا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صفا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صفا،';

-- Merge 1 variants of 'بيلطشضر': بيلطشضر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيلطشضر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بيلطشضر' AND pashto_word NOT IN ('بيلطشضر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيلطشضر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيلطشضر،';

-- Merge 1 variants of 'ادب': ادب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ادب،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ادب' AND pashto_word NOT IN ('ادب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ادب', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ادب،';

-- Merge 1 variants of 'بياموندل': بياموندل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بياموندل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بياموندل' AND pashto_word NOT IN ('بياموندل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بياموندل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بياموندل.';

-- Merge 1 variants of 'تحفې': تحفې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تحفې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تحفې' AND pashto_word NOT IN ('تحفې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تحفې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تحفې،';

-- Merge 1 variants of 'مشيرانو': مشيرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشيرانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مشيرانو' AND pashto_word NOT IN ('مشيرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشيرانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشيرانو،';

-- Merge 1 variants of 'قاضيان': قاضيان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قاضيان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قاضيان' AND pashto_word NOT IN ('قاضيان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قاضيان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قاضيان،';

-- Merge 1 variants of 'سوزېدلې': سوزېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سوزېدلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سوزېدلې' AND pashto_word NOT IN ('سوزېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سوزېدلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سوزېدلې،';

-- Merge 1 variants of 'ښکارېدله': ښکارېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښکارېدله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښکارېدله' AND pashto_word NOT IN ('ښکارېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښکارېدله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښکارېدله،';

-- Merge 1 variants of 'تعبير': تعبير،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تعبير،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تعبير' AND pashto_word NOT IN ('تعبير،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تعبير', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تعبير،';

-- Merge 1 variants of 'بادشاهت': بادشاهت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادشاهت،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بادشاهت' AND pashto_word NOT IN ('بادشاهت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادشاهت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاهت،';

-- Merge 1 variants of 'بلکې': بلکې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بلکې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بلکې' AND pashto_word NOT IN ('بلکې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بلکې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بلکې،';

-- Merge 1 variants of 'شمېر': شمېر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمېر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شمېر' AND pashto_word NOT IN ('شمېر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمېر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمېر،';

-- Merge 1 variants of 'وزن': وزن،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزن،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزن' AND pashto_word NOT IN ('وزن،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزن', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزن،';

-- Merge 2 variants of 'وختلې': وختلې., وختلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وختلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وختلې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وختلې' AND pashto_word NOT IN ('وختلې.','وختلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وختلې', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وختلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وختلې،';

-- Merge 1 variants of 'فرسين': فرسين،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرسين،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فرسين' AND pashto_word NOT IN ('فرسين،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرسين', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرسين،';

-- Merge 1 variants of 'وزيران': وزيران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزيران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزيران' AND pashto_word NOT IN ('وزيران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزيران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزيران،';

-- Merge 1 variants of 'مټ': مټ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مټ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مټ' AND pashto_word NOT IN ('مټ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مټ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مټ،';

-- Merge 1 variants of 'وزې': وزې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزې' AND pashto_word NOT IN ('وزې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزې،';

-- Merge 1 variants of 'اوږه': اوږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوږه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوږه' AND pashto_word NOT IN ('اوږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوږه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوږه،';

-- Merge 1 variants of 'سترګه': سترګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سترګه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سترګه' AND pashto_word NOT IN ('سترګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سترګه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سترګه،';

-- Merge 1 variants of 'پښه': پښه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پښه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پښه' AND pashto_word NOT IN ('پښه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پښه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پښه.';

-- Merge 1 variants of 'لمنو': لمنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لمنو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لمنو' AND pashto_word NOT IN ('لمنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لمنو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لمنو،';

-- Merge 1 variants of 'سلو': سلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سلو' AND pashto_word NOT IN ('سلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سلو،';

-- Merge 1 variants of 'یبوسیان': یبوسیان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'یبوسیان.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یبوسیان' AND pashto_word NOT IN ('یبوسیان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یبوسیان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یبوسیان.';

-- Merge 1 variants of 'خوښیږي': خوښیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوښیږي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خوښیږي' AND pashto_word NOT IN ('خوښیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوښیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوښیږي.';

-- Merge 1 variants of 'تږي': تږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تږي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تږي' AND pashto_word NOT IN ('تږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تږي،';

-- Merge 1 variants of 'اخلي': اخلي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلي.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اخلي' AND pashto_word NOT IN ('اخلي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخلي.»';

-- Merge 1 variants of 'فرعون': فرعون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرعون،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فرعون' AND pashto_word NOT IN ('فرعون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرعون', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرعون،';

-- Merge 1 variants of 'یوشع': یوشع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوشع،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یوشع' AND pashto_word NOT IN ('یوشع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوشع', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوشع،';

-- Merge 1 variants of 'لورګانې': لورګانې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لورګانې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لورګانې' AND pashto_word NOT IN ('لورګانې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لورګانې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لورګانې،';

-- Merge 1 variants of 'رمې': رمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رمې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رمې' AND pashto_word NOT IN ('رمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رمې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رمې،';

-- Merge 1 variants of 'وڅېړم': وڅېړم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅېړم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅېړم' AND pashto_word NOT IN ('وڅېړم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅېړم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅېړم.';

-- Merge 1 variants of 'مال': مال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مال،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مال' AND pashto_word NOT IN ('مال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مال', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مال،';

-- Merge 1 variants of 'مرس': مرس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مرس' AND pashto_word NOT IN ('مرس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرس،';

-- Merge 1 variants of 'توفان': توفان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'توفان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'توفان' AND pashto_word NOT IN ('توفان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('توفان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'توفان،';

-- Merge 1 variants of 'ژغورم': ژغورم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغورم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ژغورم' AND pashto_word NOT IN ('ژغورم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژغورم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژغورم.';

-- Merge 1 variants of 'اغوستل': اغوستل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اغوستل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اغوستل' AND pashto_word NOT IN ('اغوستل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اغوستل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اغوستل.';

-- Merge 1 variants of 'وکړم.›': وکړم.›»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړم.›»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وکړم.›' AND pashto_word NOT IN ('وکړم.›»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړم.›', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړم.›»';

-- Merge 2 variants of 'راټولول': راټولول., راټولول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راټولول،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راټولول' AND pashto_word NOT IN ('راټولول.','راټولول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راټولول', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راټولول.';
DELETE FROM word_frequencies WHERE pashto_word = 'راټولول،';

-- Merge 1 variants of 'غني': غني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غني،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غني' AND pashto_word NOT IN ('غني،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غني', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غني،';

-- Merge 1 variants of 'ورپیږي': ورپیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورپیږي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورپیږي' AND pashto_word NOT IN ('ورپیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورپیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورپیږي.';

-- Merge 1 variants of 'وسوځي': وسوځي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوځي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وسوځي' AND pashto_word NOT IN ('وسوځي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوځي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوځي.';

-- Merge 1 variants of 'ګرځه': ګرځه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګرځه' AND pashto_word NOT IN ('ګرځه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځه.';

-- Merge 1 variants of 'اسونه': اسونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اسونه' AND pashto_word NOT IN ('اسونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسونه،';

-- Merge 1 variants of 'فرعونه': فرعونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرعونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فرعونه' AND pashto_word NOT IN ('فرعونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرعونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرعونه،';

-- Merge 1 variants of 'ونښلوم': ونښلوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونښلوم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونښلوم' AND pashto_word NOT IN ('ونښلوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونښلوم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونښلوم.';

-- Merge 1 variants of 'ایتوپیا': ایتوپیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ایتوپیا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ایتوپیا' AND pashto_word NOT IN ('ایتوپیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ایتوپیا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ایتوپیا،';

-- Merge 1 variants of 'وېرول': وېرول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرول،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وېرول' AND pashto_word NOT IN ('وېرول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېرول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېرول،';

-- Merge 1 variants of 'وېروي': وېروي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېروي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وېروي' AND pashto_word NOT IN ('وېروي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېروي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېروي.';

-- Merge 1 variants of 'ونیسې': ونیسې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونیسې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونیسې' AND pashto_word NOT IN ('ونیسې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونیسې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونیسې.';

-- Merge 1 variants of 'درو': درو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'درو' AND pashto_word NOT IN ('درو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درو،';

-- Merge 1 variants of 'هډوکو': هډوکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هډوکو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'هډوکو' AND pashto_word NOT IN ('هډوکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هډوکو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هډوکو،';

-- Merge 1 variants of 'زغرو': زغرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زغرو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زغرو' AND pashto_word NOT IN ('زغرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زغرو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زغرو،';

-- Merge 1 variants of 'لیندو': لیندو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لیندو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لیندو' AND pashto_word NOT IN ('لیندو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لیندو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لیندو،';

-- Merge 1 variants of 'غشو': غشو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غشو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غشو' AND pashto_word NOT IN ('غشو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غشو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غشو،';

-- Merge 1 variants of 'پاڅېدم': پاڅېدم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېدم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پاڅېدم' AND pashto_word NOT IN ('پاڅېدم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېدم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېدم،';

-- Merge 1 variants of 'مخکې': مخکې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخکې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مخکې' AND pashto_word NOT IN ('مخکې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخکې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخکې،';

-- Merge 1 variants of 'پرېوتم': پرېوتم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پرېوتم' AND pashto_word NOT IN ('پرېوتم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوتم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتم.';

-- Merge 1 variants of 'اخترونو': اخترونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخترونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اخترونو' AND pashto_word NOT IN ('اخترونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخترونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخترونو،';

-- Merge 1 variants of 'بهیږي': بهیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بهیږي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بهیږي' AND pashto_word NOT IN ('بهیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بهیږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بهیږي،';

-- Merge 1 variants of 'غونډۍ': غونډۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غونډۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غونډۍ' AND pashto_word NOT IN ('غونډۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غونډۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غونډۍ،';

-- Merge 1 variants of 'شوکت': شوکت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوکت.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شوکت' AND pashto_word NOT IN ('شوکت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوکت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوکت.';

-- Merge 1 variants of 'الیعازر': الیعازر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیعازر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'الیعازر' AND pashto_word NOT IN ('الیعازر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیعازر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیعازر،';

-- Merge 1 variants of 'نتنییل': نتنییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نتنییل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نتنییل' AND pashto_word NOT IN ('نتنییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نتنییل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نتنییل،';

-- Merge 1 variants of 'الیاشیب': الیاشیب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیاشیب،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'الیاشیب' AND pashto_word NOT IN ('الیاشیب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیاشیب', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیاشیب،';

-- Merge 1 variants of 'مشلام': مشلام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشلام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مشلام' AND pashto_word NOT IN ('مشلام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشلام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشلام،';

-- Merge 1 variants of 'عدایا': عدایا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عدایا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عدایا' AND pashto_word NOT IN ('عدایا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عدایا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عدایا،';

-- Merge 1 variants of 'متتیا': متتیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'متتیا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'متتیا' AND pashto_word NOT IN ('متتیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('متتیا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'متتیا،';

-- Merge 1 variants of 'نحمیا': نحمیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نحمیا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نحمیا' AND pashto_word NOT IN ('نحمیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نحمیا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نحمیا،';

-- Merge 1 variants of 'مردخای': مردخای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مردخای،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مردخای' AND pashto_word NOT IN ('مردخای،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مردخای', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مردخای،';

-- Merge 1 variants of 'بغوای': بغوای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بغوای،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بغوای' AND pashto_word NOT IN ('بغوای،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بغوای', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بغوای،';

-- Merge 1 variants of 'وطنداران': وطنداران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وطنداران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وطنداران' AND pashto_word NOT IN ('وطنداران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وطنداران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وطنداران،';

-- Merge 1 variants of 'رحوم': رحوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رحوم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رحوم' AND pashto_word NOT IN ('رحوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رحوم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رحوم،';

-- Merge 1 variants of 'تتنای': تتنای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تتنای،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تتنای' AND pashto_word NOT IN ('تتنای،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تتنای', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تتنای،';

-- Merge 1 variants of 'مالګه': مالګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مالګه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مالګه' AND pashto_word NOT IN ('مالګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالګه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مالګه،';

-- Merge 1 variants of 'یوییل': یوییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوییل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'یوییل' AND pashto_word NOT IN ('یوییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوییل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوییل،';

-- Merge 1 variants of 'الناتان': الناتان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الناتان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'الناتان' AND pashto_word NOT IN ('الناتان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الناتان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الناتان،';

-- Merge 1 variants of 'بتوییل': بتوییل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بتوییل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بتوییل' AND pashto_word NOT IN ('بتوییل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بتوییل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بتوییل.';

-- Merge 1 variants of 'وزېږول': وزېږول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزېږول.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وزېږول' AND pashto_word NOT IN ('وزېږول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزېږول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزېږول.';

-- Merge 1 variants of 'سېرلي': سېرلي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سېرلي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سېرلي' AND pashto_word NOT IN ('سېرلي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سېرلي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سېرلي،';

-- Merge 1 variants of 'قناز': قناز.

DELETE FROM word_verse_mapping WHERE pashto_word = 'قناز.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قناز' AND pashto_word NOT IN ('قناز.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قناز', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قناز.';

-- Merge 1 variants of 'مزه': مزه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مزه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مزه' AND pashto_word NOT IN ('مزه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مزه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مزه.';

-- Merge 1 variants of 'کران': کران.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کران.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کران' AND pashto_word NOT IN ('کران.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کران.';

-- Merge 1 variants of 'راولو': راولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راولو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راولو' AND pashto_word NOT IN ('راولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راولو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راولو،';

-- Merge 1 variants of 'سام': سام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سام' AND pashto_word NOT IN ('سام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سام،';

-- Merge 1 variants of 'رانیسي': رانیسي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رانیسي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رانیسي' AND pashto_word NOT IN ('رانیسي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رانیسي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رانیسي.';

-- Merge 1 variants of 'ولړزوم': ولړزوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولړزوم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولړزوم' AND pashto_word NOT IN ('ولړزوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولړزوم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولړزوم،';

-- Merge 1 variants of 'عزیا': عزیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزیا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عزیا' AND pashto_word NOT IN ('عزیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزیا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزیا،';

-- Merge 1 variants of 'فتروس': فتروس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فتروس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فتروس' AND pashto_word NOT IN ('فتروس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فتروس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فتروس،';

-- Merge 1 variants of 'فلسطینیانو': فلسطینیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فلسطینیانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فلسطینیانو' AND pashto_word NOT IN ('فلسطینیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فلسطینیانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فلسطینیانو،';

-- Merge 1 variants of 'والوزي': والوزي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'والوزي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'والوزي' AND pashto_word NOT IN ('والوزي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('والوزي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'والوزي.';

-- Merge 1 variants of 'ښوییږي': ښوییږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښوییږي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښوییږي' AND pashto_word NOT IN ('ښوییږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښوییږي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښوییږي.';

-- Merge 1 variants of 'مصریانو': مصریانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مصریانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مصریانو' AND pashto_word NOT IN ('مصریانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مصریانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مصریانو،';

-- Merge 1 variants of 'اخترونه': اخترونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخترونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اخترونه' AND pashto_word NOT IN ('اخترونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخترونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخترونه،';

-- Merge 1 variants of 'زغملی': زغملی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زغملی،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زغملی' AND pashto_word NOT IN ('زغملی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زغملی', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زغملی،';

-- Merge 1 variants of 'زه': زه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زه' AND pashto_word NOT IN ('زه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زه،';

-- Merge 1 variants of 'غوغا': غوغا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوغا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غوغا' AND pashto_word NOT IN ('غوغا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوغا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوغا،';

-- Merge 1 variants of 'وڅښو': وڅښو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅښو' AND pashto_word NOT IN ('وڅښو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښو،';

-- Merge 1 variants of 'راوغواړم': راوغواړم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوغواړم' AND pashto_word NOT IN ('راوغواړم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغواړم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړم.';

-- Merge 1 variants of 'چلوونکو': چلوونکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چلوونکو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چلوونکو' AND pashto_word NOT IN ('چلوونکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چلوونکو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چلوونکو،';

-- Merge 1 variants of 'اورو': اورو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اورو' AND pashto_word NOT IN ('اورو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورو.';

-- Merge 1 variants of 'ږلۍ': ږلۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږلۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ږلۍ' AND pashto_word NOT IN ('ږلۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږلۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږلۍ،';

-- Merge 1 variants of 'ولړزوي': ولړزوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولړزوي،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولړزوي' AND pashto_word NOT IN ('ولړزوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولړزوي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولړزوي،';

-- Merge 1 variants of 'قوت': قوت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قوت،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قوت' AND pashto_word NOT IN ('قوت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قوت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قوت،';

-- Merge 1 variants of 'چپنې': چپنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چپنې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چپنې' AND pashto_word NOT IN ('چپنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چپنې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چپنې،';

-- Merge 1 variants of 'سیندونو': سیندونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سیندونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سیندونو' AND pashto_word NOT IN ('سیندونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سیندونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سیندونو،';

-- Merge 1 variants of 'اسمانونو': اسمانونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسمانونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اسمانونو' AND pashto_word NOT IN ('اسمانونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسمانونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسمانونو،';

-- Merge 1 variants of 'ستاسو': ستاسو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ستاسو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ستاسو' AND pashto_word NOT IN ('ستاسو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ستاسو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ستاسو،';

-- Merge 1 variants of 'چیغې': چیغې!

DELETE FROM word_verse_mapping WHERE pashto_word = 'چیغې!';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چیغې' AND pashto_word NOT IN ('چیغې!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چیغې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چیغې!';

-- Merge 2 variants of 'وګورو': وګورو., وګورو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وګورو' AND pashto_word NOT IN ('وګورو.','وګورو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورو', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګورو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګورو،';

-- Merge 1 variants of 'وران': وران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وران' AND pashto_word NOT IN ('وران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وران،';

-- Merge 1 variants of 'خواهشات': خواهشات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خواهشات،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خواهشات' AND pashto_word NOT IN ('خواهشات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خواهشات', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خواهشات،';

-- Merge 1 variants of 'روياګانې': روياګانې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روياګانې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'روياګانې' AND pashto_word NOT IN ('روياګانې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روياګانې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روياګانې،';

-- Merge 1 variants of 'لختى': لختى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لختى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لختى' AND pashto_word NOT IN ('لختى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لختى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لختى،';

-- Merge 1 variants of 'ټپوسانو': ټپوسانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ټپوسانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ټپوسانو' AND pashto_word NOT IN ('ټپوسانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ټپوسانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ټپوسانو،';

-- Merge 1 variants of 'اُميده': اُميده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اُميده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اُميده' AND pashto_word NOT IN ('اُميده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اُميده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اُميده،';

-- Merge 1 variants of 'يروه': يروه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يروه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يروه' AND pashto_word NOT IN ('يروه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يروه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يروه،';

-- Merge 1 variants of 'راويستلو': راويستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راويستلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راويستلو' AND pashto_word NOT IN ('راويستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راويستلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راويستلو،';
