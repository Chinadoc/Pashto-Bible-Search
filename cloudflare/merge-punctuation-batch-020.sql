
-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتلې،';

-- Merge 1 variants of 'وغورځوي': وغورځوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورځوي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغورځوي' AND pashto_word NOT IN ('وغورځوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورځوي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورځوي.';

-- Merge 1 variants of 'پاڅېد': پاڅېد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پاڅېد،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پاڅېد' AND pashto_word NOT IN ('پاڅېد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پاڅېد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پاڅېد،';

-- Merge 1 variants of 'وغزوه': وغزوه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغزوه.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغزوه' AND pashto_word NOT IN ('وغزوه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغزوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغزوه.»';

-- Merge 1 variants of 'راپاڅېږه': راپاڅېږه.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅېږه.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راپاڅېږه' AND pashto_word NOT IN ('راپاڅېږه.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅېږه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅېږه.»';

-- Merge 1 variants of 'ولوېد': ولوېد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولوېد.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ولوېد' AND pashto_word NOT IN ('ولوېد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولوېد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولوېد.';

-- Merge 2 variants of 'بهېدله': بهېدله., بهېدله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بهېدله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بهېدله،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بهېدله' AND pashto_word NOT IN ('بهېدله.','بهېدله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بهېدله', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بهېدله.';
DELETE FROM word_frequencies WHERE pashto_word = 'بهېدله،';

-- Merge 1 variants of 'تودولو': تودولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تودولو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تودولو' AND pashto_word NOT IN ('تودولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تودولو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تودولو.';

-- Merge 1 variants of 'اخیسته': اخیسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخیسته.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اخیسته' AND pashto_word NOT IN ('اخیسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخیسته', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخیسته.';

-- Merge 2 variants of 'کېدلی': کېدلی., کېدلی،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلی.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېدلی،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'کېدلی' AND pashto_word NOT IN ('کېدلی.','کېدلی،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېدلی', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلی.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېدلی،';

-- Merge 2 variants of 'وروړ': وروړ., وروړ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړ.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وروړ،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وروړ' AND pashto_word NOT IN ('وروړ.','وروړ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروړ', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروړ.';
DELETE FROM word_frequencies WHERE pashto_word = 'وروړ،';

-- Merge 2 variants of 'وېرېده': وېرېده., وېرېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېده.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وېرېده،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وېرېده' AND pashto_word NOT IN ('وېرېده.','وېرېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وېرېده', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېده.';
DELETE FROM word_frequencies WHERE pashto_word = 'وېرېده،';

-- Merge 1 variants of 'حرص': حرص،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حرص،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'حرص' AND pashto_word NOT IN ('حرص،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حرص', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حرص،';

-- Merge 2 variants of 'پرېوتله': پرېوتله., پرېوتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوتله،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پرېوتله' AND pashto_word NOT IN ('پرېوتله.','پرېوتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوتله', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتله.';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوتله،';

-- Merge 1 variants of 'ټوکرۍ': ټوکرۍ.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ټوکرۍ.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ټوکرۍ' AND pashto_word NOT IN ('ټوکرۍ.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ټوکرۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ټوکرۍ.»';

-- Merge 1 variants of 'ځوروي': ځوروي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوروي،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ځوروي' AND pashto_word NOT IN ('ځوروي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوروي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوروي،';

-- Merge 2 variants of 'وکري': وکري., وکري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکري.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکري،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وکري' AND pashto_word NOT IN ('وکري.','وکري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکري', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکري.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکري،';

-- Merge 1 variants of 'کري': کري،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کري،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کري' AND pashto_word NOT IN ('کري،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کري', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کري،';

-- Merge 1 variants of 'چیچي': چیچي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'چیچي.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'چیچي' AND pashto_word NOT IN ('چیچي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چیچي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چیچي.»';

-- Merge 1 variants of 'وهي': وهي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهي.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وهي' AND pashto_word NOT IN ('وهي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهي.»';

-- Merge 1 variants of 'ومني': ومني.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'ومني.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ومني' AND pashto_word NOT IN ('ومني.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ومني', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ومني.»';

-- Merge 1 variants of 'راتله': راتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راتله،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راتله' AND pashto_word NOT IN ('راتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راتله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راتله،';

-- Merge 1 variants of 'ګورې': ګورې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګورې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ګورې' AND pashto_word NOT IN ('ګورې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګورې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګورې،';

-- Merge 2 variants of 'پسې': پسې., پسې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پسې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پسې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پسې' AND pashto_word NOT IN ('پسې.','پسې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پسې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پسې.';
DELETE FROM word_frequencies WHERE pashto_word = 'پسې،';

-- Merge 2 variants of 'وپېژنم': وپېژنم،, وپېژنم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژنم،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وپېژنم.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'وپېژنم' AND pashto_word NOT IN ('وپېژنم،','وپېژنم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وپېژنم', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژنم،';
DELETE FROM word_frequencies WHERE pashto_word = 'وپېژنم.';

-- Merge 1 variants of 'پیغمبرانو': پیغمبرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پیغمبرانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پیغمبرانو' AND pashto_word NOT IN ('پیغمبرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پیغمبرانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پیغمبرانو،';

-- Merge 1 variants of 'تیږې': تیږې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تیږې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تیږې' AND pashto_word NOT IN ('تیږې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تیږې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تیږې،';

-- Merge 1 variants of 'عطر': عطر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عطر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عطر' AND pashto_word NOT IN ('عطر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عطر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عطر،';

-- Merge 1 variants of 'کنډ': کنډ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کنډ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کنډ' AND pashto_word NOT IN ('کنډ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کنډ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کنډ،';

-- Merge 1 variants of 'وغولوي': وغولوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغولوي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغولوي' AND pashto_word NOT IN ('وغولوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغولوي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغولوي.';

-- Merge 1 variants of 'قاتلانو': قاتلانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قاتلانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'قاتلانو' AND pashto_word NOT IN ('قاتلانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قاتلانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قاتلانو،';

-- Merge 1 variants of 'جادوګرانو': جادوګرانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جادوګرانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جادوګرانو' AND pashto_word NOT IN ('جادوګرانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جادوګرانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جادوګرانو،';

-- Merge 1 variants of 'جادوګران': جادوګران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جادوګران،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'جادوګران' AND pashto_word NOT IN ('جادوګران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جادوګران', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جادوګران،';

-- Merge 1 variants of 'وغورځوم': وغورځوم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورځوم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وغورځوم' AND pashto_word NOT IN ('وغورځوم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورځوم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورځوم.';

-- Merge 1 variants of 'شتمني': شتمني،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شتمني،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شتمني' AND pashto_word NOT IN ('شتمني،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شتمني', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شتمني،';

-- Merge 1 variants of 'تخت': تخت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تخت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تخت' AND pashto_word NOT IN ('تخت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تخت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تخت،';

-- Merge 1 variants of 'بلېده': بلېده،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بلېده،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بلېده' AND pashto_word NOT IN ('بلېده،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بلېده', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بلېده،';

-- Merge 1 variants of 'انسانانو': انسانانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'انسانانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'انسانانو' AND pashto_word NOT IN ('انسانانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('انسانانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'انسانانو،';

-- Merge 1 variants of 'مرغانو': مرغانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرغانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مرغانو' AND pashto_word NOT IN ('مرغانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرغانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرغانو،';

-- Merge 1 variants of 'ناپوهه': ناپوهه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ناپوهه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ناپوهه' AND pashto_word NOT IN ('ناپوهه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ناپوهه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ناپوهه،';

-- Merge 1 variants of 'لوږه': لوږه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوږه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لوږه' AND pashto_word NOT IN ('لوږه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوږه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوږه،';

-- Merge 1 variants of 'فرښتې': فرښتې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فرښتې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'فرښتې' AND pashto_word NOT IN ('فرښتې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فرښتې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فرښتې،';

-- Merge 1 variants of 'شیان': شیان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شیان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شیان' AND pashto_word NOT IN ('شیان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شیان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شیان،';

-- Merge 1 variants of 'نافرمانه': نافرمانه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نافرمانه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'نافرمانه' AND pashto_word NOT IN ('نافرمانه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نافرمانه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نافرمانه،';

-- Merge 1 variants of 'لاخیش': لاخیش،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لاخیش،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لاخیش' AND pashto_word NOT IN ('لاخیش،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لاخیش', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لاخیش،';

-- Merge 1 variants of 'خواړه': خواړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خواړه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خواړه' AND pashto_word NOT IN ('خواړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خواړه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خواړه،';

-- Merge 1 variants of 'یحییل': یحییل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یحییل،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'یحییل' AND pashto_word NOT IN ('یحییل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یحییل', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یحییل،';

-- Merge 1 variants of 'ځان': ځان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ځان' AND pashto_word NOT IN ('ځان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځان،';

-- Merge 1 variants of 'قوماندانان': قوماندانان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قوماندانان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'قوماندانان' AND pashto_word NOT IN ('قوماندانان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قوماندانان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قوماندانان،';

-- Merge 1 variants of 'ربابونه': ربابونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ربابونه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ربابونه' AND pashto_word NOT IN ('ربابونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ربابونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ربابونه،';

-- Merge 1 variants of 'ماښام': ماښام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ماښام،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ماښام' AND pashto_word NOT IN ('ماښام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ماښام', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ماښام،';

-- Merge 1 variants of 'اوسپنو': اوسپنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اوسپنو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اوسپنو' AND pashto_word NOT IN ('اوسپنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اوسپنو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اوسپنو،';

-- Merge 1 variants of 'ووهو': ووهو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووهو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووهو' AND pashto_word NOT IN ('ووهو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووهو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووهو،';

-- Merge 1 variants of 'شرابو': شرابو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شرابو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شرابو' AND pashto_word NOT IN ('شرابو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شرابو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شرابو،';

-- Merge 1 variants of 'اعانې': اعانې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اعانې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اعانې' AND pashto_word NOT IN ('اعانې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اعانې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اعانې،';

-- Merge 1 variants of 'یوزاباد': یوزاباد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'یوزاباد،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'یوزاباد' AND pashto_word NOT IN ('یوزاباد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('یوزاباد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'یوزاباد،';

-- Merge 2 variants of 'پېغلې': پېغلې،, پېغلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پېغلې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پېغلې' AND pashto_word NOT IN ('پېغلې،','پېغلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېغلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېغلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'پېغلې.';

-- Merge 1 variants of 'تاجونه': تاجونه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تاجونه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تاجونه' AND pashto_word NOT IN ('تاجونه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تاجونه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تاجونه.';

-- Merge 1 variants of 'مامورینو': مامورینو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مامورینو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'مامورینو' AND pashto_word NOT IN ('مامورینو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مامورینو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مامورینو،';

-- Merge 1 variants of 'شمول': شمول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شمول،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شمول' AND pashto_word NOT IN ('شمول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شمول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شمول،';

-- Merge 1 variants of 'راوپاراوه': راوپاراوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوپاراوه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوپاراوه' AND pashto_word NOT IN ('راوپاراوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوپاراوه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوپاراوه.';

-- Merge 1 variants of 'وګرځېد': وګرځېد.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځېد.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وګرځېد' AND pashto_word NOT IN ('وګرځېد.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځېد', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځېد.';

-- Merge 2 variants of 'پوهېږو': پوهېږو., پوهېږو.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهېږو.»';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'پوهېږو' AND pashto_word NOT IN ('پوهېږو.','پوهېږو.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهېږو', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږو.';
DELETE FROM word_frequencies WHERE pashto_word = 'پوهېږو.»';

-- Merge 1 variants of 'بېلچې': بېلچې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بېلچې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'بېلچې' AND pashto_word NOT IN ('بېلچې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بېلچې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بېلچې،';

-- Merge 1 variants of 'الیشع': الیشع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'الیشع،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'الیشع' AND pashto_word NOT IN ('الیشع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('الیشع', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'الیشع،';

-- Merge 1 variants of 'وهله': وهله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وهله،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وهله' AND pashto_word NOT IN ('وهله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وهله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وهله،';

-- Merge 1 variants of 'وروسته': وروسته،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وروسته،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وروسته' AND pashto_word NOT IN ('وروسته،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وروسته', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وروسته،';

-- Merge 2 variants of 'وخورو': وخورو., وخورو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخورو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وخورو' AND pashto_word NOT IN ('وخورو.','وخورو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخورو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخورو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخورو،';

-- Merge 1 variants of 'ووروي': ووروي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووروي،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووروي' AND pashto_word NOT IN ('ووروي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووروي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووروي،';

-- Merge 1 variants of 'ساتو': ساتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ساتو' AND pashto_word NOT IN ('ساتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتو.';

-- Merge 1 variants of 'دال': دال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دال،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دال' AND pashto_word NOT IN ('دال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دال', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دال،';

-- Merge 1 variants of 'راځي': راځي.»

DELETE FROM word_verse_mapping WHERE pashto_word = 'راځي.»';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راځي' AND pashto_word NOT IN ('راځي.»');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راځي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راځي.»';

-- Merge 1 variants of 'ابشالومه': ابشالومه!

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابشالومه!';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ابشالومه' AND pashto_word NOT IN ('ابشالومه!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابشالومه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابشالومه!';

-- Merge 1 variants of 'لوظ': لوظ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوظ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'لوظ' AND pashto_word NOT IN ('لوظ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوظ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوظ،';

-- Merge 1 variants of 'راوپارول': راوپارول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوپارول.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوپارول' AND pashto_word NOT IN ('راوپارول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوپارول', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوپارول.';

-- Merge 2 variants of 'راوړلې': راوړلې،, راوړلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړلې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوړلې' AND pashto_word NOT IN ('راوړلې،','راوړلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوړلې.';

-- Merge 2 variants of 'څښلې': څښلې., څښلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څښلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'څښلې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'څښلې' AND pashto_word NOT IN ('څښلې.','څښلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څښلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څښلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'څښلې،';

-- Merge 1 variants of 'سهار': سهار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سهار،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'سهار' AND pashto_word NOT IN ('سهار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سهار', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سهار،';

-- Merge 1 variants of 'ویلې': ویلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ویلې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ویلې' AND pashto_word NOT IN ('ویلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ویلې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ویلې.';

-- Merge 1 variants of 'ووېشله': ووېشله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېشله.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووېشله' AND pashto_word NOT IN ('ووېشله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېشله', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېشله.';

-- Merge 2 variants of 'راوغورځیږي': راوغورځیږي., راوغورځیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورځیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغورځیږي،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راوغورځیږي' AND pashto_word NOT IN ('راوغورځیږي.','راوغورځیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغورځیږي', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورځیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغورځیږي،';

-- Merge 1 variants of 'خِدمتګارانو': خِدمتګارانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خِدمتګارانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خِدمتګارانو' AND pashto_word NOT IN ('خِدمتګارانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خِدمتګارانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خِدمتګارانو،';

-- Merge 1 variants of 'وشُو': وشُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشُو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وشُو' AND pashto_word NOT IN ('وشُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشُو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشُو.';

-- Merge 1 variants of 'پيتلو': پيتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پيتلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پيتلو' AND pashto_word NOT IN ('پيتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پيتلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پيتلو،';

-- Merge 2 variants of 'راوغواړه': راوغواړه،, راوغواړه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوغواړه.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راوغواړه' AND pashto_word NOT IN ('راوغواړه،','راوغواړه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوغواړه', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړه،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوغواړه.';

-- Merge 1 variants of 'غوښتلو': غوښتلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غوښتلو.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غوښتلو' AND pashto_word NOT IN ('غوښتلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غوښتلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غوښتلو.';

-- Merge 1 variants of 'ورورسېدو': ورورسېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورورسېدو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ورورسېدو' AND pashto_word NOT IN ('ورورسېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورورسېدو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورورسېدو،';

-- Merge 1 variants of 'راوختلو': راوختلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوختلو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'راوختلو' AND pashto_word NOT IN ('راوختلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوختلو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوختلو،';

-- Merge 1 variants of 'عشر': عشر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عشر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'عشر' AND pashto_word NOT IN ('عشر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عشر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عشر،';

-- Merge 1 variants of 'هوسۍ': هوسۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'هوسۍ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'هوسۍ' AND pashto_word NOT IN ('هوسۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('هوسۍ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'هوسۍ،';

-- Merge 1 variants of 'پسونو': پسونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پسونو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پسونو' AND pashto_word NOT IN ('پسونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پسونو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پسونو،';

-- Merge 1 variants of 'غاښ': غاښ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غاښ،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'غاښ' AND pashto_word NOT IN ('غاښ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غاښ', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غاښ،';

-- Merge 1 variants of 'درې': درې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'درې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'درې' AND pashto_word NOT IN ('درې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درې،';

-- Merge 1 variants of 'خر': خر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خر،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خر' AND pashto_word NOT IN ('خر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خر', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خر،';

-- Merge 2 variants of 'ورکولای': ورکولای., ورکولای،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولای.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکولای،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ورکولای' AND pashto_word NOT IN ('ورکولای.','ورکولای،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکولای', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولای.';
DELETE FROM word_frequencies WHERE pashto_word = 'ورکولای،';

-- Merge 1 variants of 'ووېریږي': ووېریږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ووېریږي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ووېریږي' AND pashto_word NOT IN ('ووېریږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ووېریږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ووېریږي.';

-- Merge 1 variants of 'افت': افت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'افت،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'افت' AND pashto_word NOT IN ('افت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('افت', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'افت،';

-- Merge 2 variants of 'راغورځیږي': راغورځیږي., راغورځیږي،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راغورځیږي.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راغورځیږي،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'راغورځیږي' AND pashto_word NOT IN ('راغورځیږي.','راغورځیږي،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راغورځیږي', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راغورځیږي.';
DELETE FROM word_frequencies WHERE pashto_word = 'راغورځیږي،';

-- Merge 1 variants of 'تیږو': تیږو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تیږو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'تیږو' AND pashto_word NOT IN ('تیږو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تیږو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تیږو،';

-- Merge 1 variants of 'پوکی': پوکی!

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوکی!';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پوکی' AND pashto_word NOT IN ('پوکی!');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوکی', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوکی!';

-- Merge 1 variants of 'پوهه': پوهه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پوهه،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پوهه' AND pashto_word NOT IN ('پوهه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پوهه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پوهه،';

-- Merge 1 variants of 'پرېږدې': پرېږدې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېږدې.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'پرېږدې' AND pashto_word NOT IN ('پرېږدې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېږدې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېږدې.';

-- Merge 1 variants of 'اسراییلیانو': اسراییلیانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسراییلیانو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'اسراییلیانو' AND pashto_word NOT IN ('اسراییلیانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسراییلیانو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسراییلیانو،';

-- Merge 1 variants of 'برنج': برنج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برنج،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'برنج' AND pashto_word NOT IN ('برنج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برنج', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برنج،';

-- Merge 1 variants of 'خلاصیږي': خلاصیږي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خلاصیږي.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'خلاصیږي' AND pashto_word NOT IN ('خلاصیږي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خلاصیږي', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خلاصیږي.';

-- Merge 2 variants of 'ګرځېدلې': ګرځېدلې،, ګرځېدلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدلې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ګرځېدلې.';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'ګرځېدلې' AND pashto_word NOT IN ('ګرځېدلې،','ګرځېدلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګرځېدلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدلې،';
DELETE FROM word_frequencies WHERE pashto_word = 'ګرځېدلې.';

-- Merge 1 variants of 'وګڼم': وګڼم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګڼم.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'وګڼم' AND pashto_word NOT IN ('وګڼم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګڼم', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګڼم.';

-- Merge 1 variants of 'شپنو': شپنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شپنو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'شپنو' AND pashto_word NOT IN ('شپنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شپنو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شپنو،';

-- Merge 1 variants of 'کوټو': کوټو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوټو،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'کوټو' AND pashto_word NOT IN ('کوټو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوټو', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوټو،';

-- Merge 1 variants of 'دېوال': دېوال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دېوال،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'دېوال' AND pashto_word NOT IN ('دېوال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دېوال', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دېوال،';

-- Merge 2 variants of 'بهېدلې': بهېدلې., بهېدلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بهېدلې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'بهېدلې،';

-- Sum frequencies from all variants: 5 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 5
WHERE pashto_word = 'بهېدلې' AND pashto_word NOT IN ('بهېدلې.','بهېدلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بهېدلې', 5);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بهېدلې.';
DELETE FROM word_frequencies WHERE pashto_word = 'بهېدلې،';

-- Merge 1 variants of 'ودروه': ودروه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ودروه.';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ودروه' AND pashto_word NOT IN ('ودروه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ودروه', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ودروه.';

-- Merge 1 variants of 'څملې': څملې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څملې،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'څملې' AND pashto_word NOT IN ('څملې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څملې', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څملې،';

-- Merge 1 variants of 'ځوانان': ځوانان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځوانان،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ځوانان' AND pashto_word NOT IN ('ځوانان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځوانان', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځوانان،';

-- Merge 1 variants of 'ملکیا': ملکیا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ملکیا،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'ملکیا' AND pashto_word NOT IN ('ملکیا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ملکیا', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ملکیا،';

-- Merge 1 variants of 'العازار': العازار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'العازار،';

-- Sum frequencies from all variants: 3 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 3
WHERE pashto_word = 'العازار' AND pashto_word NOT IN ('العازار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('العازار', 3);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'العازار،';
