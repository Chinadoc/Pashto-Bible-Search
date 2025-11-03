
-- Merge 1 variants of 'حاشوم': حاشوم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاشوم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حاشوم' AND pashto_word NOT IN ('حاشوم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاشوم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاشوم،';

-- Merge 1 variants of 'وشوې': وشوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشوې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وشوې' AND pashto_word NOT IN ('وشوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشوې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشوې،';

-- Merge 1 variants of 'ووځو': ووځو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووځو.»';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ووځو' AND pashto_word NOT IN ('ووځو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووځو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووځو.»';

-- Merge 1 variants of 'ابیهو': ابیهو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابیهو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ابیهو' AND pashto_word NOT IN ('ابیهو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابیهو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابیهو،';

-- Merge 1 variants of 'ګوتې': ګوتې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګوتې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګوتې' AND pashto_word NOT IN ('ګوتې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګوتې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګوتې،';

-- Merge 1 variants of 'اړمونو': اړمونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اړمونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اړمونو' AND pashto_word NOT IN ('اړمونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اړمونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اړمونو،';

-- Merge 1 variants of 'پایو': پایو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پایو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پایو' AND pashto_word NOT IN ('پایو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پایو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پایو،';

-- Merge 1 variants of 'پوښ': پوښ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوښ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پوښ' AND pashto_word NOT IN ('پوښ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوښ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوښ،';

-- Merge 1 variants of 'پرده': پرده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پرده' AND pashto_word NOT IN ('پرده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرده،';

-- Merge 1 variants of 'هڅوي': هڅوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'هڅوي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'هڅوي' AND pashto_word NOT IN ('هڅوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هڅوي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هڅوي.';

-- Merge 1 variants of 'انصاف': انصاف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'انصاف،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'انصاف' AND pashto_word NOT IN ('انصاف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انصاف', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انصاف،';

-- Merge 1 variants of 'نښلي': نښلي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نښلي.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نښلي' AND pashto_word NOT IN ('نښلي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نښلي', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نښلي.';

-- Merge 1 variants of 'وپېژنې': وپېژنې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژنې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وپېژنې' AND pashto_word NOT IN ('وپېژنې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژنې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژنې.';

-- Merge 1 variants of 'اړوه': اړوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اړوه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اړوه' AND pashto_word NOT IN ('اړوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اړوه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اړوه.';

-- Merge 1 variants of 'صادقانو': صادقانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صادقانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'صادقانو' AND pashto_word NOT IN ('صادقانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صادقانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صادقانو،';

-- Merge 1 variants of 'لورګانو': لورګانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لورګانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لورګانو' AND pashto_word NOT IN ('لورګانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لورګانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لورګانو،';

-- Merge 1 variants of 'خاورې': خاورې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خاورې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خاورې' AND pashto_word NOT IN ('خاورې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خاورې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خاورې.';

-- Merge 1 variants of 'نومېدل': نومېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'نومېدل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نومېدل' AND pashto_word NOT IN ('نومېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نومېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نومېدل.';

-- Merge 1 variants of 'سرودونه': سرودونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سرودونه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سرودونه' AND pashto_word NOT IN ('سرودونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سرودونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سرودونه.';

-- Merge 1 variants of 'يونه': يونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يونه' AND pashto_word NOT IN ('يونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يونه،';

-- Merge 1 variants of 'روانه': روانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'روانه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'روانه' AND pashto_word NOT IN ('روانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('روانه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'روانه،';

-- Merge 1 variants of 'کولونه': کولونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کولونه' AND pashto_word NOT IN ('کولونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولونه،';

-- Merge 2 variants of 'غواړمه': غواړمه،, غواړمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړمه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړمه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غواړمه' AND pashto_word NOT IN ('غواړمه،','غواړمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړمه', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړمه،';
DELETE FROM word_frequencies WHERE pashto_word = 'غواړمه.';

-- Merge 1 variants of 'کومه': کومه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کومه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کومه' AND pashto_word NOT IN ('کومه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کومه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کومه.';

-- Merge 1 variants of 'کنه': کنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کنه' AND pashto_word NOT IN ('کنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنه،';

-- Merge 1 variants of 'مناره': مناره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مناره،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مناره' AND pashto_word NOT IN ('مناره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مناره', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مناره،';

-- Merge 1 variants of 'شمه': شمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شمه' AND pashto_word NOT IN ('شمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمه.';

-- Merge 1 variants of 'مشکو': مشکو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مشکو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مشکو' AND pashto_word NOT IN ('مشکو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مشکو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مشکو،';

-- Merge 1 variants of 'عُود': عُود،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُود،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عُود' AND pashto_word NOT IN ('عُود،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُود', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُود،';

-- Merge 1 variants of 'باده': باده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'باده،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'باده' AND pashto_word NOT IN ('باده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('باده', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'باده،';

-- Merge 1 variants of 'راوالوځه': راوالوځه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوالوځه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوالوځه' AND pashto_word NOT IN ('راوالوځه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوالوځه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوالوځه،';

-- Merge 1 variants of 'عاشقانو': عاشقانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عاشقانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عاشقانو' AND pashto_word NOT IN ('عاشقانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عاشقانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عاشقانو،';

-- Merge 1 variants of 'جينۍ': جينۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جينۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جينۍ' AND pashto_word NOT IN ('جينۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جينۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جينۍ،';

-- Merge 1 variants of 'لاړمه': لاړمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاړمه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لاړمه' AND pashto_word NOT IN ('لاړمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاړمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاړمه،';

-- Merge 1 variants of 'خوندونه': خوندونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوندونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خوندونه' AND pashto_word NOT IN ('خوندونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوندونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوندونه،';

-- Merge 1 variants of 'پېغلو': پېغلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پېغلو' AND pashto_word NOT IN ('پېغلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغلو،';

-- Merge 1 variants of 'ونه': ونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونه' AND pashto_word NOT IN ('ونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونه.';

-- Merge 1 variants of 'ګورينه': ګورينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګورينه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګورينه' AND pashto_word NOT IN ('ګورينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورينه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګورينه،';

-- Merge 1 variants of 'ورکومه': ورکومه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکومه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورکومه' AND pashto_word NOT IN ('ورکومه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکومه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکومه،';

-- Merge 1 variants of 'ورکړمه': ورکړمه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړمه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورکړمه' AND pashto_word NOT IN ('ورکړمه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړمه،';

-- Merge 1 variants of 'کونډو': کونډو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کونډو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کونډو' AND pashto_word NOT IN ('کونډو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کونډو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کونډو،';

-- Merge 1 variants of 'يتيمانو': يتيمانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يتيمانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يتيمانو' AND pashto_word NOT IN ('يتيمانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يتيمانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يتيمانو،';

-- Merge 1 variants of 'وګرځې': وګرځې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وګرځې' AND pashto_word NOT IN ('وګرځې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځې.';

-- Merge 1 variants of 'څلورمې': څلورمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څلورمې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'څلورمې' AND pashto_word NOT IN ('څلورمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څلورمې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څلورمې،';

-- Merge 1 variants of 'پينځمې': پينځمې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پينځمې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پينځمې' AND pashto_word NOT IN ('پينځمې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پينځمې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پينځمې،';

-- Merge 1 variants of 'راکاږم': راکاږم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکاږم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راکاږم' AND pashto_word NOT IN ('راکاږم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکاږم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکاږم،';

-- Merge 1 variants of 'کبانو': کبانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کبانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کبانو' AND pashto_word NOT IN ('کبانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کبانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کبانو،';

-- Merge 1 variants of 'وګرځوله': وګرځوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځوله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وګرځوله' AND pashto_word NOT IN ('وګرځوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځوله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځوله،';

-- Merge 1 variants of 'وخېژه': وخېژه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وخېژه' AND pashto_word NOT IN ('وخېژه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژه،';

-- Merge 2 variants of 'آدم': آدم., آدم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آدم.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'آدم،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'آدم' AND pashto_word NOT IN ('آدم.','آدم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آدم', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آدم.';
DELETE FROM word_frequencies WHERE pashto_word = 'آدم،';

-- Merge 1 variants of 'جُمر': جُمر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جُمر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جُمر' AND pashto_word NOT IN ('جُمر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جُمر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جُمر،';

-- Merge 1 variants of 'مادى': مادى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مادى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مادى' AND pashto_word NOT IN ('مادى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مادى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مادى،';

-- Merge 1 variants of 'ياوان': ياوان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ياوان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ياوان' AND pashto_word NOT IN ('ياوان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ياوان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ياوان،';

-- Merge 1 variants of 'توبل': توبل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'توبل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'توبل' AND pashto_word NOT IN ('توبل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('توبل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'توبل،';

-- Merge 1 variants of 'تيراس': تيراس.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تيراس.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تيراس' AND pashto_word NOT IN ('تيراس.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تيراس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تيراس.';

-- Merge 1 variants of 'اشکناز': اشکناز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اشکناز،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اشکناز' AND pashto_word NOT IN ('اشکناز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اشکناز', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اشکناز،';

-- Merge 1 variants of 'تُجرمه': تُجرمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تُجرمه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تُجرمه' AND pashto_word NOT IN ('تُجرمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تُجرمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تُجرمه.';

-- Merge 1 variants of 'رهودس': رهودس.

DELETE FROM word_verse_mapping WHERE pashto_word = 'رهودس.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رهودس' AND pashto_word NOT IN ('رهودس.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رهودس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رهودس.';

-- Merge 1 variants of 'کوش': کوش،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوش،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کوش' AND pashto_word NOT IN ('کوش،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوش', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوش،';

-- Merge 1 variants of 'کنعان': کنعان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنعان.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کنعان' AND pashto_word NOT IN ('کنعان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنعان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنعان.';

-- Merge 1 variants of 'حويله': حويله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حويله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حويله' AND pashto_word NOT IN ('حويله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حويله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حويله،';

-- Merge 1 variants of 'امورى': امورى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امورى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'امورى' AND pashto_word NOT IN ('امورى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امورى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امورى،';

-- Merge 1 variants of 'حِوى': حِوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حِوى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حِوى' AND pashto_word NOT IN ('حِوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حِوى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حِوى،';

-- Merge 1 variants of 'حماتى': حماتى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حماتى.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حماتى' AND pashto_word NOT IN ('حماتى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حماتى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حماتى.';

-- Merge 1 variants of 'آرام': آرام.

DELETE FROM word_verse_mapping WHERE pashto_word = 'آرام.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'آرام' AND pashto_word NOT IN ('آرام.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آرام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آرام.';

-- Merge 1 variants of 'هدورام': هدورام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هدورام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'هدورام' AND pashto_word NOT IN ('هدورام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هدورام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هدورام،';

-- Merge 1 variants of 'اوفير': اوفير،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوفير،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوفير' AND pashto_word NOT IN ('اوفير،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوفير', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوفير،';

-- Merge 1 variants of 'مَلِک‌صِدق': مَلِک‌صِدق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مَلِک‌صِدق،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مَلِک‌صِدق' AND pashto_word NOT IN ('مَلِک‌صِدق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مَلِک‌صِدق', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مَلِک‌صِدق،';

-- Merge 1 variants of 'راوويستلې': راوويستلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوويستلې' AND pashto_word NOT IN ('راوويستلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستلې،';

-- Merge 1 variants of 'ښايم': ښايم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښايم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښايم' AND pashto_word NOT IN ('ښايم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښايم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښايم،';

-- Merge 1 variants of 'راوستم': راوستم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوستم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوستم' AND pashto_word NOT IN ('راوستم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوستم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوستم،';

-- Merge 1 variants of 'يُقسان': يُقسان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يُقسان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يُقسان' AND pashto_word NOT IN ('يُقسان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يُقسان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يُقسان،';

-- Merge 1 variants of 'عيفه': عيفه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عيفه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عيفه' AND pashto_word NOT IN ('عيفه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عيفه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عيفه،';

-- Merge 1 variants of 'قيدار': قيدار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قيدار،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قيدار' AND pashto_word NOT IN ('قيدار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قيدار', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قيدار،';

-- Merge 1 variants of 'مِبسام': مِبسام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِبسام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مِبسام' AND pashto_word NOT IN ('مِبسام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِبسام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِبسام،';

-- Merge 1 variants of 'مِشماع': مِشماع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِشماع،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مِشماع' AND pashto_word NOT IN ('مِشماع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِشماع', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِشماع،';

-- Merge 1 variants of 'مسا': مسا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مسا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مسا' AND pashto_word NOT IN ('مسا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مسا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مسا،';

-- Merge 1 variants of 'حدد': حدد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حدد،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حدد' AND pashto_word NOT IN ('حدد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حدد', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حدد،';

-- Merge 1 variants of 'تيما': تيما،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تيما،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تيما' AND pashto_word NOT IN ('تيما،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تيما', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تيما،';

-- Merge 1 variants of 'قِدمه': قِدمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'قِدمه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قِدمه' AND pashto_word NOT IN ('قِدمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قِدمه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قِدمه.';

-- Merge 1 variants of 'اوسېږه': اوسېږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسېږه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اوسېږه' AND pashto_word NOT IN ('اوسېږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسېږه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسېږه،';

-- Merge 1 variants of 'نوکران': نوکران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نوکران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نوکران' AND pashto_word NOT IN ('نوکران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نوکران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نوکران،';

-- Merge 1 variants of '”ښه': ”ښه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”ښه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = '”ښه' AND pashto_word NOT IN ('”ښه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”ښه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”ښه،';

-- Merge 1 variants of 'رشته‌دار': رشته‌دار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رشته‌دار،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رشته‌دار' AND pashto_word NOT IN ('رشته‌دار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رشته‌دار', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رشته‌دار،';

-- Merge 1 variants of 'شپه': شپه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شپه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شپه' AND pashto_word NOT IN ('شپه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شپه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شپه،';

-- Merge 1 variants of 'ګډه': ګډه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګډه' AND pashto_word NOT IN ('ګډه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډه،';

-- Merge 1 variants of 'ولټوله': ولټوله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولټوله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولټوله' AND pashto_word NOT IN ('ولټوله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولټوله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولټوله،';

-- Merge 1 variants of 'ويستل': ويستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ويستل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ويستل' AND pashto_word NOT IN ('ويستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ويستل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ويستل،';

-- Merge 1 variants of 'تښتېدلو': تښتېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتېدلو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تښتېدلو' AND pashto_word NOT IN ('تښتېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتېدلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتېدلو.';

-- Merge 1 variants of 'اُهليبامه': اُهليبامه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اُهليبامه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اُهليبامه' AND pashto_word NOT IN ('اُهليبامه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اُهليبامه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اُهليبامه،';

-- Merge 1 variants of 'خور': خور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خور' AND pashto_word NOT IN ('خور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خور،';

-- Merge 1 variants of 'اومر': اومر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اومر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اومر' AND pashto_word NOT IN ('اومر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اومر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اومر،';

-- Merge 1 variants of 'قنز': قنز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قنز،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قنز' AND pashto_word NOT IN ('قنز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قنز', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قنز،';

-- Merge 1 variants of 'تړلې': تړلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تړلې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تړلې' AND pashto_word NOT IN ('تړلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تړلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تړلې،';

-- Merge 1 variants of 'ورټلو': ورټلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورټلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورټلو' AND pashto_word NOT IN ('ورټلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورټلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورټلو،';

-- Merge 1 variants of '”راشه': ”راشه.

DELETE FROM word_verse_mapping WHERE pashto_word = '”راشه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = '”راشه' AND pashto_word NOT IN ('”راشه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”راشه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”راشه.';

-- Merge 1 variants of 'کښېنولم': کښېنولم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کښېنولم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کښېنولم' AND pashto_word NOT IN ('کښېنولم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کښېنولم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کښېنولم،';

-- Merge 1 variants of 'خرڅوله': خرڅوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرڅوله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خرڅوله' AND pashto_word NOT IN ('خرڅوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرڅوله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرڅوله.';

-- Merge 1 variants of 'وپېژندل': وپېژندل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژندل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وپېژندل' AND pashto_word NOT IN ('وپېژندل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژندل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژندل،';

-- Merge 1 variants of 'وستلو': وستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وستلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وستلو' AND pashto_word NOT IN ('وستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وستلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وستلو،';

-- Merge 1 variants of 'وتو': وتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وتو' AND pashto_word NOT IN ('وتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتو.';

-- Merge 1 variants of 'اريلى': اريلى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اريلى.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اريلى' AND pashto_word NOT IN ('اريلى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اريلى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اريلى.';

-- Merge 1 variants of 'سليم': سليم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'سليم.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سليم' AND pashto_word NOT IN ('سليم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سليم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سليم.';

-- Merge 1 variants of 'څانګه': څانګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څانګه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'څانګه' AND pashto_word NOT IN ('څانګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څانګه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څانګه،';

-- Merge 1 variants of 'اخستو': اخستو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخستو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اخستو' AND pashto_word NOT IN ('اخستو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخستو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخستو.';

-- Merge 1 variants of 'وسوزېدلو': وسوزېدلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزېدلو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وسوزېدلو' AND pashto_word NOT IN ('وسوزېدلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزېدلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزېدلو.';

-- Merge 1 variants of 'کرمى': کرمى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کرمى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کرمى' AND pashto_word NOT IN ('کرمى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کرمى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کرمى،';

-- Merge 2 variants of 'زِکرى': زِکرى., زِکرى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زِکرى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'زِکرى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'زِکرى' AND pashto_word NOT IN ('زِکرى.','زِکرى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زِکرى', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زِکرى.';
DELETE FROM word_frequencies WHERE pashto_word = 'زِکرى،';

-- Merge 1 variants of 'ورېدلې': ورېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورېدلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورېدلې' AND pashto_word NOT IN ('ورېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورېدلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورېدلې.';

-- Merge 1 variants of 'لسو': لسو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لسو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لسو' AND pashto_word NOT IN ('لسو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لسو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لسو،';

-- Merge 1 variants of 'ورغورزيږى': ورغورزيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورغورزيږى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورغورزيږى' AND pashto_word NOT IN ('ورغورزيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورغورزيږى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورغورزيږى،';

-- Merge 1 variants of 'جامو': جامو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جامو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جامو' AND pashto_word NOT IN ('جامو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جامو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جامو،';

-- Merge 1 variants of 'غوا': غوا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوا،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غوا' AND pashto_word NOT IN ('غوا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوا', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوا،';

-- Merge 1 variants of 'غوټۍ': غوټۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوټۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غوټۍ' AND pashto_word NOT IN ('غوټۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوټۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوټۍ،';

-- Merge 1 variants of 'ونښلوى': ونښلوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونښلوى.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونښلوى' AND pashto_word NOT IN ('ونښلوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونښلوى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونښلوى.';

-- Merge 1 variants of 'چُوغه': چُوغه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چُوغه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چُوغه' AND pashto_word NOT IN ('چُوغه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چُوغه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چُوغه،';

-- Merge 1 variants of 'ګرځوى': ګرځوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځوى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ګرځوى' AND pashto_word NOT IN ('ګرځوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځوى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځوى،';

-- Merge 1 variants of 'چت': چت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چت،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چت' AND pashto_word NOT IN ('چت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چت،';

-- Merge 1 variants of 'مُر': مُر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مُر' AND pashto_word NOT IN ('مُر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُر،';

-- Merge 1 variants of 'مصالحه': مصالحه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مصالحه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مصالحه' AND pashto_word NOT IN ('مصالحه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مصالحه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مصالحه،';

-- Merge 1 variants of 'وڅښلو': وڅښلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وڅښلو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وڅښلو' AND pashto_word NOT IN ('وڅښلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وڅښلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وڅښلو.';

-- Merge 1 variants of 'وخېژم': وخېژم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وخېژم' AND pashto_word NOT IN ('وخېژم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژم،';

-- Merge 1 variants of 'ننوتلو': ننوتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوتلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ننوتلو' AND pashto_word NOT IN ('ننوتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوتلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوتلو،';

-- Merge 1 variants of 'چوکاټونه': چوکاټونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چوکاټونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چوکاټونه' AND pashto_word NOT IN ('چوکاټونه،');
