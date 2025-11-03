
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پردې', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پردې،';

-- Merge 1 variants of 'دانياله': دانياله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دانياله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'دانياله' AND pashto_word NOT IN ('دانياله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دانياله', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دانياله،';

-- Merge 2 variants of 'راپاڅى': راپاڅى., راپاڅى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅى،';

-- Sum frequencies from all variants: 20 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 20
WHERE pashto_word = 'راپاڅى' AND pashto_word NOT IN ('راپاڅى.','راپاڅى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅى', 20);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅى،';

-- Merge 1 variants of 'رباب': رباب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رباب،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'رباب' AND pashto_word NOT IN ('رباب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رباب', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رباب،';

-- Merge 1 variants of 'وليدله': وليدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وليدله،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وليدله' AND pashto_word NOT IN ('وليدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وليدله', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وليدله،';

-- Merge 1 variants of 'بادشاهان': بادشاهان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادشاهان،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'بادشاهان' AND pashto_word NOT IN ('بادشاهان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادشاهان', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادشاهان،';

-- Merge 1 variants of 'روبین': روبین،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روبین،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'روبین' AND pashto_word NOT IN ('روبین،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روبین', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روبین،';

-- Merge 1 variants of 'نذرانو': نذرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نذرانو،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'نذرانو' AND pashto_word NOT IN ('نذرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نذرانو', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نذرانو،';

-- Merge 1 variants of 'ییل': ییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ییل،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ییل' AND pashto_word NOT IN ('ییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ییل', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ییل،';

-- Merge 2 variants of 'رسېدله': رسېدله., رسېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'رسېدله،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'رسېدله' AND pashto_word NOT IN ('رسېدله.','رسېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسېدله', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدله.';
DELETE FROM word_frequencies WHERE pashto_word = 'رسېدله،';

-- Merge 1 variants of 'ساتې': ساتې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتې،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ساتې' AND pashto_word NOT IN ('ساتې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتې', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتې،';

-- Merge 1 variants of 'مسافرو': مسافرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسافرو،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'مسافرو' AND pashto_word NOT IN ('مسافرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسافرو', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسافرو،';

-- Merge 1 variants of 'وغورزوم': وغورزوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزوم.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وغورزوم' AND pashto_word NOT IN ('وغورزوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزوم', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزوم.';

-- Merge 1 variants of 'بيانوى': بيانوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيانوى،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'بيانوى' AND pashto_word NOT IN ('بيانوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيانوى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيانوى،';

-- Merge 1 variants of 'غزه': غزه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غزه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'غزه' AND pashto_word NOT IN ('غزه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غزه', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غزه،';

-- Merge 2 variants of 'ځناورو': ځناورو،, ځناورو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځناورو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ځناورو.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'ځناورو' AND pashto_word NOT IN ('ځناورو،','ځناورو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځناورو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځناورو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ځناورو.';

-- Merge 1 variants of 'تُورې': تُورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تُورې،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'تُورې' AND pashto_word NOT IN ('تُورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تُورې', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تُورې،';

-- Merge 2 variants of 'ولوستلو': ولوستلو., ولوستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوستلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوستلو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ولوستلو' AND pashto_word NOT IN ('ولوستلو.','ولوستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوستلو', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولوستلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ولوستلو،';

-- Merge 2 variants of 'راوګرځى': راوګرځى., راوګرځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځى،';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'راوګرځى' AND pashto_word NOT IN ('راوګرځى.','راوګرځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځى', 19);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځى،';

-- Merge 1 variants of 'نيکۀ': نيکۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيکۀ،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'نيکۀ' AND pashto_word NOT IN ('نيکۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيکۀ', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيکۀ،';

-- Merge 1 variants of 'اوړى': اوړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوړى،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اوړى' AND pashto_word NOT IN ('اوړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوړى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوړى،';

-- Merge 2 variants of 'ووژنه': ووژنه., ووژنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووژنه،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ووژنه' AND pashto_word NOT IN ('ووژنه.','ووژنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووژنه', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووژنه،';

-- Merge 1 variants of 'وژنى': وژنى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژنى.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وژنى' AND pashto_word NOT IN ('وژنى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژنى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژنى.';

-- Merge 1 variants of 'وغواړى': وغواړى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغواړى،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وغواړى' AND pashto_word NOT IN ('وغواړى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغواړى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغواړى،';

-- Merge 2 variants of 'ږدى': ږدى،, ږدى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ږدى.';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'ږدى' AND pashto_word NOT IN ('ږدى،','ږدى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ږدى', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ږدى،';
DELETE FROM word_frequencies WHERE pashto_word = 'ږدى.';

-- Merge 1 variants of 'ورننوځى': ورننوځى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوځى.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ورننوځى' AND pashto_word NOT IN ('ورننوځى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوځى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوځى.';

-- Merge 1 variants of 'صور': صور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صور،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'صور' AND pashto_word NOT IN ('صور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صور', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صور،';

-- Merge 1 variants of 'يوړې': يوړې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړې.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'يوړې' AND pashto_word NOT IN ('يوړې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوړې', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوړې.';

-- Merge 2 variants of 'شړل': شړل., شړل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شړل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شړل،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'شړل' AND pashto_word NOT IN ('شړل.','شړل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړل', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شړل.';
DELETE FROM word_frequencies WHERE pashto_word = 'شړل،';

-- Merge 1 variants of 'جانانه': جانانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جانانه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'جانانه' AND pashto_word NOT IN ('جانانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جانانه', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جانانه،';

-- Merge 2 variants of 'کړونه': کړونه., کړونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړونه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړونه،';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'کړونه' AND pashto_word NOT IN ('کړونه.','کړونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړونه', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړونه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړونه،';

-- Merge 1 variants of 'نېکه': نېکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نېکه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'نېکه' AND pashto_word NOT IN ('نېکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نېکه', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نېکه،';

-- Merge 1 variants of 'قربان‌ګاه': قربان‌ګاه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قربان‌ګاه،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'قربان‌ګاه' AND pashto_word NOT IN ('قربان‌ګاه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قربان‌ګاه', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قربان‌ګاه،';

-- Merge 1 variants of 'رسوى': رسوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رسوى.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'رسوى' AND pashto_word NOT IN ('رسوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رسوى', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رسوى.';

-- Merge 1 variants of 'اِلياقيم': اِلياقيم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِلياقيم،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'اِلياقيم' AND pashto_word NOT IN ('اِلياقيم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِلياقيم', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِلياقيم،';

-- Merge 1 variants of 'وویستل': وویستل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویستل.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وویستل' AND pashto_word NOT IN ('وویستل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویستل', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویستل.';

-- Merge 1 variants of 'وایو': وایو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وایو.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'وایو' AND pashto_word NOT IN ('وایو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وایو', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وایو.';

-- Merge 1 variants of 'یوسف': یوسف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسف،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'یوسف' AND pashto_word NOT IN ('یوسف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوسف', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوسف،';

-- Merge 1 variants of 'حاصلوی': حاصلوی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاصلوی.';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'حاصلوی' AND pashto_word NOT IN ('حاصلوی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاصلوی', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاصلوی.';

-- Merge 1 variants of 'ووینځی': ووینځی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووینځی،';

-- Sum frequencies from all variants: 10 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 10
WHERE pashto_word = 'ووینځی' AND pashto_word NOT IN ('ووینځی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووینځی', 10);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووینځی،';

-- Merge 2 variants of 'وزغمی': وزغمی., وزغمی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغمی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وزغمی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'وزغمی' AND pashto_word NOT IN ('وزغمی.','وزغمی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وزغمی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وزغمی.';
DELETE FROM word_frequencies WHERE pashto_word = 'وزغمی،';

-- Merge 2 variants of 'ګرځی': ګرځی،, ګرځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځی.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'ګرځی' AND pashto_word NOT IN ('ګرځی،','ګرځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځی', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځی.';

-- Merge 2 variants of 'ننوځی': ننوځی،, ننوځی.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوځی،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوځی.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ننوځی' AND pashto_word NOT IN ('ننوځی،','ننوځی.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوځی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوځی،';
DELETE FROM word_frequencies WHERE pashto_word = 'ننوځی.';

-- Merge 2 variants of 'واچوی': واچوی., واچوی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوی،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'واچوی' AND pashto_word NOT IN ('واچوی.','واچوی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوی', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوی.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوی،';

-- Merge 1 variants of 'عمرام': عمرام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عمرام،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'عمرام' AND pashto_word NOT IN ('عمرام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عمرام', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عمرام،';

-- Merge 1 variants of 'امریا': امریا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امریا،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'امریا' AND pashto_word NOT IN ('امریا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امریا', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امریا،';

-- Merge 1 variants of 'عیلام': عیلام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عیلام،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'عیلام' AND pashto_word NOT IN ('عیلام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عیلام', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عیلام،';

-- Merge 2 variants of 'ژغوري': ژغوري., ژغوري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغوري.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ژغوري،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'ژغوري' AND pashto_word NOT IN ('ژغوري.','ژغوري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ژغوري', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ژغوري.';
DELETE FROM word_frequencies WHERE pashto_word = 'ژغوري،';

-- Merge 3 variants of 'یادېده': یادېده،, یادېده.)

DELETE FROM word_verse_mapping WHERE pashto_word = 'یادېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یادېده.)';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یادېده.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'یادېده' AND pashto_word NOT IN ('یادېده،','یادېده.)','یادېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یادېده', 16);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یادېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'یادېده.)';
DELETE FROM word_frequencies WHERE pashto_word = 'یادېده.';

-- Merge 2 variants of 'ورسول': ورسول،, ورسول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسول،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسول.';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ورسول' AND pashto_word NOT IN ('ورسول،','ورسول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسول', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسول،';
DELETE FROM word_frequencies WHERE pashto_word = 'ورسول.';

-- Merge 1 variants of 'ځمکه': ځمکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځمکه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ځمکه' AND pashto_word NOT IN ('ځمکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځمکه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځمکه،';

-- Merge 3 variants of 'ووهلې': ووهلې،, ووهلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهلې.»';

-- Sum frequencies from all variants: 19 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 19
WHERE pashto_word = 'ووهلې' AND pashto_word NOT IN ('ووهلې،','ووهلې.','ووهلې.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهلې', 19);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ووهلې.»';

-- Merge 2 variants of 'راغلې': راغلې،, راغلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغلې.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'راغلې' AND pashto_word NOT IN ('راغلې،','راغلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغلې', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راغلې.';

-- Merge 1 variants of 'وویله': وویله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وویله.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وویله' AND pashto_word NOT IN ('وویله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وویله', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وویله.';

-- Merge 2 variants of 'یوسي': یوسي،, یوسي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'یوسي.»';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'یوسي' AND pashto_word NOT IN ('یوسي،','یوسي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوسي', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوسي،';
DELETE FROM word_frequencies WHERE pashto_word = 'یوسي.»';

-- Merge 2 variants of 'ننوتل': ننوتل., ننوتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوتل،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'ننوتل' AND pashto_word NOT IN ('ننوتل.','ننوتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوتل', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ننوتل،';

-- Merge 1 variants of 'راواخیستله': راواخیستله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخیستله،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'راواخیستله' AND pashto_word NOT IN ('راواخیستله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخیستله', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخیستله،';

-- Merge 2 variants of 'اورېدلې': اورېدلې., اورېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اورېدلې،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'اورېدلې' AND pashto_word NOT IN ('اورېدلې.','اورېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورېدلې', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'اورېدلې،';

-- Merge 1 variants of 'خلک': خلک،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلک،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'خلک' AND pashto_word NOT IN ('خلک،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلک', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلک،';

-- Merge 1 variants of 'کېښودلې': کېښودلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودلې.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'کېښودلې' AND pashto_word NOT IN ('کېښودلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودلې', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودلې.';

-- Merge 2 variants of 'راوستلو': راوستلو., راوستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستلو،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'راوستلو' AND pashto_word NOT IN ('راوستلو.','راوستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستلو', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوستلو،';

-- Merge 1 variants of 'شوي': شوي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوي،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'شوي' AND pashto_word NOT IN ('شوي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوي', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوي،';

-- Merge 2 variants of 'راوویستل': راوویستل،, راوویستل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویستل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوویستل.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'راوویستل' AND pashto_word NOT IN ('راوویستل،','راوویستل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوویستل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوویستل،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوویستل.';

-- Merge 2 variants of 'ورغله': ورغله., ورغله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغله،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'ورغله' AND pashto_word NOT IN ('ورغله.','ورغله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغله', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورغله،';

-- Merge 2 variants of 'ورننوتل': ورننوتل., ورننوتل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوتل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوتل،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ورننوتل' AND pashto_word NOT IN ('ورننوتل.','ورننوتل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوتل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوتل.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوتل،';

-- Merge 2 variants of 'وڅښلې': وڅښلې., وڅښلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښلې،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'وڅښلې' AND pashto_word NOT IN ('وڅښلې.','وڅښلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښلې', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښلې،';

-- Merge 2 variants of 'کېښودله': کېښودله., کېښودله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودله،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'کېښودله' AND pashto_word NOT IN ('کېښودله.','کېښودله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودله', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودله.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودله،';

-- Merge 2 variants of 'ګرځېده': ګرځېده،, ګرځېده.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېده،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېده.';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ګرځېده' AND pashto_word NOT IN ('ګرځېده،','ګرځېده.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځېده', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېده،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېده.';

-- Merge 1 variants of 'نو': نو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نو،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'نو' AND pashto_word NOT IN ('نو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نو', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نو،';

-- Merge 2 variants of 'ورکوه': ورکوه., ورکوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکوه،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'ورکوه' AND pashto_word NOT IN ('ورکوه.','ورکوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکوه', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکوه،';

-- Merge 2 variants of 'وژل': وژل., وژل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وژل،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وژل' AND pashto_word NOT IN ('وژل.','وژل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژل', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژل.';
DELETE FROM word_frequencies WHERE pashto_word = 'وژل،';

-- Merge 1 variants of 'لاړلې': لاړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړلې.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'لاړلې' AND pashto_word NOT IN ('لاړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړلې', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړلې.';

-- Merge 2 variants of 'درشم': درشم., درشم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درشم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'درشم،';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'درشم' AND pashto_word NOT IN ('درشم.','درشم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درشم', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درشم.';
DELETE FROM word_frequencies WHERE pashto_word = 'درشم،';

-- Merge 3 variants of 'وېریږي': وېریږي., وېریږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېریږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېریږي،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېریږي.»';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وېریږي' AND pashto_word NOT IN ('وېریږي.','وېریږي،','وېریږي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېریږي', 15);

-- Delete 3 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېریږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'وېریږي،';
DELETE FROM word_frequencies WHERE pashto_word = 'وېریږي.»';

-- Merge 2 variants of 'وخوړل': وخوړل،, وخوړل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخوړل.';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'وخوړل' AND pashto_word NOT IN ('وخوړل،','وخوړل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخوړل', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړل،';
DELETE FROM word_frequencies WHERE pashto_word = 'وخوړل.';

-- Merge 2 variants of 'دانې': دانې،, دانې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'دانې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'دانې.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'دانې' AND pashto_word NOT IN ('دانې،','دانې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دانې', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دانې،';
DELETE FROM word_frequencies WHERE pashto_word = 'دانې.';

-- Merge 2 variants of 'واچوه': واچوه., واچوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واچوه،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'واچوه' AND pashto_word NOT IN ('واچوه.','واچوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واچوه', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واچوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'واچوه،';

-- Merge 2 variants of 'وګورم': وګورم., وګورم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وګورم،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وګورم' AND pashto_word NOT IN ('وګورم.','وګورم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګورم', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګورم.';
DELETE FROM word_frequencies WHERE pashto_word = 'وګورم،';

-- Merge 2 variants of 'يرېږم': يرېږم،, يرېږم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يرېږم.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'يرېږم' AND pashto_word NOT IN ('يرېږم،','يرېږم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرېږم', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږم،';
DELETE FROM word_frequencies WHERE pashto_word = 'يرېږم.';

-- Merge 2 variants of 'واخستله': واخستله., واخستله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخستله،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'واخستله' AND pashto_word NOT IN ('واخستله.','واخستله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخستله', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخستله.';
DELETE FROM word_frequencies WHERE pashto_word = 'واخستله،';

-- Merge 2 variants of 'الوځى': الوځى., الوځى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الوځى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'الوځى،';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'الوځى' AND pashto_word NOT IN ('الوځى.','الوځى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الوځى', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الوځى.';
DELETE FROM word_frequencies WHERE pashto_word = 'الوځى،';

-- Merge 1 variants of 'وڅښى': وڅښى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښى.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وڅښى' AND pashto_word NOT IN ('وڅښى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښى', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښى.';

-- Merge 2 variants of 'راووتلو': راووتلو،, راووتلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راووتلو.';

-- Sum frequencies from all variants: 18 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 18
WHERE pashto_word = 'راووتلو' AND pashto_word NOT IN ('راووتلو،','راووتلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راووتلو', 18);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راووتلو.';

-- Merge 1 variants of 'ودرولم': ودرولم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودرولم.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ودرولم' AND pashto_word NOT IN ('ودرولم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودرولم', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودرولم.';

-- Merge 1 variants of 'درکول': درکول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکول.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'درکول' AND pashto_word NOT IN ('درکول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکول', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکول.';

-- Merge 2 variants of 'راوباسم': راوباسم., راوباسم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوباسم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوباسم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'راوباسم' AND pashto_word NOT IN ('راوباسم.','راوباسم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوباسم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسم.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوباسم،';

-- Merge 2 variants of 'ګورم': ګورم., ګورم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګورم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګورم،';

-- Sum frequencies from all variants: 17 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 17
WHERE pashto_word = 'ګورم' AND pashto_word NOT IN ('ګورم.','ګورم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورم', 17);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګورم.';
DELETE FROM word_frequencies WHERE pashto_word = 'ګورم،';

-- Merge 2 variants of 'لړزيږى': لړزيږى،, لړزيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لړزيږى،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'لړزيږى.';

-- Sum frequencies from all variants: 16 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 16
WHERE pashto_word = 'لړزيږى' AND pashto_word NOT IN ('لړزيږى،','لړزيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لړزيږى', 16);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لړزيږى،';
DELETE FROM word_frequencies WHERE pashto_word = 'لړزيږى.';

-- Merge 2 variants of 'تېرولو': تېرولو., تېرولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرولو،';

-- Sum frequencies from all variants: 13 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 13
WHERE pashto_word = 'تېرولو' AND pashto_word NOT IN ('تېرولو.','تېرولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرولو', 13);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'تېرولو،';

-- Merge 1 variants of 'وروڼه': وروڼه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروڼه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'وروڼه' AND pashto_word NOT IN ('وروڼه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروڼه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروڼه،';

-- Merge 2 variants of 'جوړوم': جوړوم., جوړوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړوم،';

-- Sum frequencies from all variants: 15 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 15
WHERE pashto_word = 'جوړوم' AND pashto_word NOT IN ('جوړوم.','جوړوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړوم', 15);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوم.';
DELETE FROM word_frequencies WHERE pashto_word = 'جوړوم،';

-- Merge 2 variants of 'خبردار': خبردار،, خبردار.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خبردار،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خبردار.';

-- Sum frequencies from all variants: 11 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 11
WHERE pashto_word = 'خبردار' AND pashto_word NOT IN ('خبردار،','خبردار.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خبردار', 11);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خبردار،';
DELETE FROM word_frequencies WHERE pashto_word = 'خبردار.';

-- Merge 1 variants of 'ورسولو': ورسولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسولو.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورسولو' AND pashto_word NOT IN ('ورسولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسولو', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسولو.';

-- Merge 1 variants of 'موآب': موآب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موآب،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'موآب' AND pashto_word NOT IN ('موآب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موآب', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موآب،';

-- Merge 1 variants of 'علاقه': علاقه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'علاقه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'علاقه' AND pashto_word NOT IN ('علاقه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('علاقه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'علاقه،';

-- Merge 2 variants of 'راوغوښتلو': راوغوښتلو،, راوغوښتلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغوښتلو.';

-- Sum frequencies from all variants: 12 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 12
WHERE pashto_word = 'راوغوښتلو' AND pashto_word NOT IN ('راوغوښتلو،','راوغوښتلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغوښتلو', 12);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغوښتلو.';

-- Merge 2 variants of 'وشلولې': وشلولې., وشلولې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلولې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وشلولې،';

-- Sum frequencies from all variants: 14 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 14
WHERE pashto_word = 'وشلولې' AND pashto_word NOT IN ('وشلولې.','وشلولې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشلولې', 14);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشلولې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وشلولې،';

-- Merge 1 variants of 'جامونه': جامونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جامونه،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'جامونه' AND pashto_word NOT IN ('جامونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جامونه', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جامونه،';

-- Merge 1 variants of 'نمر': نمر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نمر،';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'نمر' AND pashto_word NOT IN ('نمر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نمر', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نمر،';

-- Merge 1 variants of 'ورَوى': ورَوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورَوى.';

-- Sum frequencies from all variants: 9 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 9
WHERE pashto_word = 'ورَوى' AND pashto_word NOT IN ('ورَوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورَوى', 9);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورَوى.';
