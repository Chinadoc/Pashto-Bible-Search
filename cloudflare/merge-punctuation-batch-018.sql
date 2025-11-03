
-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'تېروم' AND pashto_word NOT IN ('تېروم.','تېروم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېروم', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېروم.';
DELETE FROM word_frequencies WHERE pashto_word = 'تېروم،';

-- Merge 1 variants of 'مُلخانو': مُلخانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُلخانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مُلخانو' AND pashto_word NOT IN ('مُلخانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُلخانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُلخانو،';

-- Merge 2 variants of 'تښتېدل': تښتېدل،, تښتېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتېدل،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'تښتېدل.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'تښتېدل' AND pashto_word NOT IN ('تښتېدل،','تښتېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تښتېدل', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تښتېدل،';
DELETE FROM word_frequencies WHERE pashto_word = 'تښتېدل.';

-- Merge 1 variants of 'عجلون': عجلون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عجلون،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عجلون' AND pashto_word NOT IN ('عجلون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عجلون', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عجلون،';

-- Merge 1 variants of 'دور': دور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دور،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'دور' AND pashto_word NOT IN ('دور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دور', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دور،';

-- Merge 1 variants of 'جبتون': جبتون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جبتون،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'جبتون' AND pashto_word NOT IN ('جبتون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جبتون', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جبتون،';

-- Merge 2 variants of 'وتړه': وتړه., وتړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وتړه' AND pashto_word NOT IN ('وتړه.','وتړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتړه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتړه،';

-- Merge 2 variants of 'پرېوته': پرېوته،, پرېوته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'پرېوته.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'پرېوته' AND pashto_word NOT IN ('پرېوته،','پرېوته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پرېوته', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوته،';
DELETE FROM word_frequencies WHERE pashto_word = 'پرېوته.';

-- Merge 1 variants of 'دېوالونو': دېوالونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دېوالونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'دېوالونو' AND pashto_word NOT IN ('دېوالونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دېوالونو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دېوالونو،';

-- Merge 2 variants of 'اخلو': اخلو., اخلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'اخلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'اخلو' AND pashto_word NOT IN ('اخلو.','اخلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'اخلو،';

-- Merge 1 variants of 'بليږى': بليږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بليږى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بليږى' AND pashto_word NOT IN ('بليږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بليږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بليږى.';

-- Merge 1 variants of 'نینوا': نینوا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نینوا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نینوا' AND pashto_word NOT IN ('نینوا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نینوا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نینوا،';

-- Merge 1 variants of 'لوستله': لوستله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوستله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'لوستله' AND pashto_word NOT IN ('لوستله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوستله', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوستله.';

-- Merge 1 variants of 'څرمنې': څرمنې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څرمنې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څرمنې' AND pashto_word NOT IN ('څرمنې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څرمنې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څرمنې،';

-- Merge 1 variants of 'خرو': خرو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خرو' AND pashto_word NOT IN ('خرو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرو،';

-- Merge 2 variants of 'وکتلو': وکتلو،, وکتلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکتلو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکتلو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وکتلو' AND pashto_word NOT IN ('وکتلو،','وکتلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکتلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکتلو،';
DELETE FROM word_frequencies WHERE pashto_word = 'وکتلو.';

-- Merge 1 variants of 'صندوق': صندوق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صندوق،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'صندوق' AND pashto_word NOT IN ('صندوق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صندوق', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صندوق،';

-- Merge 1 variants of 'توګه': توګه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'توګه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'توګه' AND pashto_word NOT IN ('توګه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('توګه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'توګه،';

-- Merge 1 variants of 'بادوي': بادوي.

DELETE FROM word_verse_mapping WHERE pashto_word = 'بادوي.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بادوي' AND pashto_word NOT IN ('بادوي.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بادوي', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بادوي.';

-- Merge 1 variants of 'لګوه': لګوه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لګوه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'لګوه' AND pashto_word NOT IN ('لګوه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لګوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لګوه.';

-- Merge 2 variants of 'کړينه': کړينه., کړينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کړينه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کړينه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کړينه' AND pashto_word NOT IN ('کړينه.','کړينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کړينه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کړينه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کړينه،';

-- Merge 2 variants of 'وکړلو': وکړلو., وکړلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړلو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وکړلو' AND pashto_word NOT IN ('وکړلو.','وکړلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړلو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړلو،';

-- Merge 1 variants of 'ايستمه': ايستمه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايستمه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ايستمه' AND pashto_word NOT IN ('ايستمه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايستمه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايستمه.';

-- Merge 2 variants of 'کيږينه': کيږينه., کيږينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کيږينه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کيږينه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کيږينه' AND pashto_word NOT IN ('کيږينه.','کيږينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کيږينه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کيږينه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کيږينه،';

-- Merge 2 variants of 'کوينه': کوينه., کوينه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوينه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کوينه،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'کوينه' AND pashto_word NOT IN ('کوينه.','کوينه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوينه', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوينه.';
DELETE FROM word_frequencies WHERE pashto_word = 'کوينه،';

-- Merge 1 variants of 'راکوزيږينه': راکوزيږينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راکوزيږينه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راکوزيږينه' AND pashto_word NOT IN ('راکوزيږينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راکوزيږينه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راکوزيږينه.';

-- Merge 2 variants of 'شينه': شينه،, شينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'شينه،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'شينه.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'شينه' AND pashto_word NOT IN ('شينه،','شينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شينه', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شينه،';
DELETE FROM word_frequencies WHERE pashto_word = 'شينه.';

-- Merge 1 variants of 'راښکله': راښکله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راښکله.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راښکله' AND pashto_word NOT IN ('راښکله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راښکله', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راښکله.';

-- Merge 1 variants of 'غواړينه': غواړينه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غواړينه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غواړينه' AND pashto_word NOT IN ('غواړينه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غواړينه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غواړينه.';

-- Merge 1 variants of 'راپاڅوى': راپاڅوى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راپاڅوى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راپاڅوى' AND pashto_word NOT IN ('راپاڅوى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راپاڅوى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راپاڅوى.';

-- Merge 1 variants of 'طوبياه': طوبياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'طوبياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'طوبياه' AND pashto_word NOT IN ('طوبياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('طوبياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'طوبياه،';

-- Merge 1 variants of 'قېديانو': قېديانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قېديانو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'قېديانو' AND pashto_word NOT IN ('قېديانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قېديانو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قېديانو،';

-- Merge 1 variants of 'څيز': څيز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'څيز،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'څيز' AND pashto_word NOT IN ('څيز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('څيز', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'څيز،';

-- Merge 1 variants of 'وکَرلو': وکَرلو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکَرلو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وکَرلو' AND pashto_word NOT IN ('وکَرلو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکَرلو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکَرلو.';

-- Merge 1 variants of 'ترسيس': ترسيس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ترسيس،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ترسيس' AND pashto_word NOT IN ('ترسيس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ترسيس', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ترسيس،';

-- Merge 1 variants of 'نينوه': نينوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نينوه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'نينوه' AND pashto_word NOT IN ('نينوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نينوه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نينوه،';

-- Merge 1 variants of 'اسور': اسور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اسور،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اسور' AND pashto_word NOT IN ('اسور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اسور', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اسور،';

-- Merge 1 variants of 'ارفکسد': ارفکسد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ارفکسد،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ارفکسد' AND pashto_word NOT IN ('ارفکسد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ارفکسد', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ارفکسد،';

-- Merge 1 variants of 'ابرام': ابرام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابرام،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ابرام' AND pashto_word NOT IN ('ابرام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابرام', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابرام،';

-- Merge 1 variants of 'اِسحاق': اِسحاق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِسحاق،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اِسحاق' AND pashto_word NOT IN ('اِسحاق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِسحاق', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِسحاق،';

-- Merge 1 variants of 'مرم': مرم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرم،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مرم' AND pashto_word NOT IN ('مرم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرم،';

-- Merge 2 variants of 'ننوتو': ننوتو،, ننوتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوتو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ننوتو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ننوتو' AND pashto_word NOT IN ('ننوتو،','ننوتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ننوتو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ننوتو،';
DELETE FROM word_frequencies WHERE pashto_word = 'ننوتو.';

-- Merge 2 variants of 'وتړلو': وتړلو., وتړلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وتړلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وتړلو' AND pashto_word NOT IN ('وتړلو.','وتړلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وتړلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وتړلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وتړلو،';

-- Merge 1 variants of 'يحزى‌ايل': يحزى‌ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يحزى‌ايل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'يحزى‌ايل' AND pashto_word NOT IN ('يحزى‌ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يحزى‌ايل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يحزى‌ايل،';

-- Merge 1 variants of 'ټيټيږى': ټيټيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ټيټيږى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ټيټيږى' AND pashto_word NOT IN ('ټيټيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ټيټيږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ټيټيږى.';

-- Merge 1 variants of 'مار': مار،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مار،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مار' AND pashto_word NOT IN ('مار،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مار', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مار،';

-- Merge 2 variants of 'عُزى‌اېل': عُزى‌اېل., عُزى‌اېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عُزى‌اېل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'عُزى‌اېل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'عُزى‌اېل' AND pashto_word NOT IN ('عُزى‌اېل.','عُزى‌اېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عُزى‌اېل', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عُزى‌اېل.';
DELETE FROM word_frequencies WHERE pashto_word = 'عُزى‌اېل،';

-- Merge 1 variants of 'کوزيږى': کوزيږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کوزيږى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کوزيږى' AND pashto_word NOT IN ('کوزيږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کوزيږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کوزيږى.';

-- Merge 1 variants of 'خرونو': خرونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خرونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خرونو' AND pashto_word NOT IN ('خرونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خرونو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خرونو،';

-- Merge 1 variants of 'ګډان': ګډان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ګډان،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ګډان' AND pashto_word NOT IN ('ګډان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ګډان', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ګډان،';

-- Merge 1 variants of 'حاضريږى': حاضريږى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاضريږى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'حاضريږى' AND pashto_word NOT IN ('حاضريږى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاضريږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاضريږى.';

-- Merge 2 variants of 'واورولو': واورولو., واورولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واورولو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واورولو،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'واورولو' AND pashto_word NOT IN ('واورولو.','واورولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واورولو', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واورولو.';
DELETE FROM word_frequencies WHERE pashto_word = 'واورولو،';

-- Merge 1 variants of 'کپړه': کپړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کپړه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کپړه' AND pashto_word NOT IN ('کپړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کپړه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کپړه،';

-- Merge 1 variants of 'ايکوامرين': ايکوامرين،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ايکوامرين،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ايکوامرين' AND pashto_word NOT IN ('ايکوامرين،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ايکوامرين', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ايکوامرين،';

-- Merge 2 variants of 'معلوموى': معلوموى., معلوموى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معلوموى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'معلوموى،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'معلوموى' AND pashto_word NOT IN ('معلوموى.','معلوموى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معلوموى', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معلوموى.';
DELETE FROM word_frequencies WHERE pashto_word = 'معلوموى،';

-- Merge 2 variants of 'وسوزوه': وسوزوه., وسوزوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وسوزوه،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وسوزوه' AND pashto_word NOT IN ('وسوزوه.','وسوزوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وسوزوه', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وسوزوه،';

-- Merge 1 variants of 'بېخ': بېخ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بېخ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بېخ' AND pashto_word NOT IN ('بېخ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بېخ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بېخ،';

-- Merge 1 variants of 'کُنډې': کُنډې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کُنډې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کُنډې' AND pashto_word NOT IN ('کُنډې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کُنډې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کُنډې،';

-- Merge 1 variants of 'بضلى‌اېل': بضلى‌اېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بضلى‌اېل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بضلى‌اېل' AND pashto_word NOT IN ('بضلى‌اېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بضلى‌اېل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بضلى‌اېل،';

-- Merge 2 variants of 'وخېژول': وخېژول., وخېژول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژول.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژول،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وخېژول' AND pashto_word NOT IN ('وخېژول.','وخېژول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژول', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژول.';
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژول،';

-- Merge 1 variants of 'ډيوټ': ډيوټ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډيوټ،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ډيوټ' AND pashto_word NOT IN ('ډيوټ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډيوټ', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډيوټ،';

-- Merge 2 variants of 'وغوښتلو': وغوښتلو., وغوښتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وغوښتلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وغوښتلو' AND pashto_word NOT IN ('وغوښتلو.','وغوښتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغوښتلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وغوښتلو،';

-- Merge 1 variants of 'ورپسې': ورپسې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورپسې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ورپسې' AND pashto_word NOT IN ('ورپسې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورپسې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورپسې،';

-- Merge 1 variants of 'عملونو': عملونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عملونو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عملونو' AND pashto_word NOT IN ('عملونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عملونو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عملونو،';

-- Merge 1 variants of 'تلې': تلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تلې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'تلې' AND pashto_word NOT IN ('تلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تلې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تلې،';

-- Merge 1 variants of 'اِتمر': اِتمر.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِتمر.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اِتمر' AND pashto_word NOT IN ('اِتمر.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِتمر', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِتمر.';

-- Merge 1 variants of 'وغږيږى': وغږيږى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغږيږى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وغږيږى' AND pashto_word NOT IN ('وغږيږى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغږيږى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغږيږى،';

-- Merge 1 variants of 'مِلاوېدو': مِلاوېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مِلاوېدو.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مِلاوېدو' AND pashto_word NOT IN ('مِلاوېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مِلاوېدو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مِلاوېدو.';

-- Merge 1 variants of 'جِلعاد': جِلعاد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جِلعاد،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'جِلعاد' AND pashto_word NOT IN ('جِلعاد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جِلعاد', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جِلعاد،';

-- Merge 2 variants of 'وځې': وځې., وځې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځې.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وځې،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'وځې' AND pashto_word NOT IN ('وځې.','وځې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځې', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځې.';
DELETE FROM word_frequencies WHERE pashto_word = 'وځې،';

-- Merge 2 variants of 'ښودو': ښودو., ښودو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ښودو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ښودو' AND pashto_word NOT IN ('ښودو.','ښودو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښودو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښودو.';
DELETE FROM word_frequencies WHERE pashto_word = 'ښودو،';

-- Merge 1 variants of 'برخه': برخه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'برخه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'برخه' AND pashto_word NOT IN ('برخه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('برخه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'برخه،';

-- Merge 2 variants of 'طاقت': طاقت،, طاقت.

DELETE FROM word_verse_mapping WHERE pashto_word = 'طاقت،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'طاقت.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'طاقت' AND pashto_word NOT IN ('طاقت،','طاقت.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('طاقت', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'طاقت،';
DELETE FROM word_frequencies WHERE pashto_word = 'طاقت.';

-- Merge 1 variants of 'غلې': غلې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غلې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غلې' AND pashto_word NOT IN ('غلې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غلې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غلې،';

-- Merge 2 variants of 'واوړېدل': واوړېدل., واوړېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړېدل.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واوړېدل،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'واوړېدل' AND pashto_word NOT IN ('واوړېدل.','واوړېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واوړېدل', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واوړېدل.';
DELETE FROM word_frequencies WHERE pashto_word = 'واوړېدل،';

-- Merge 1 variants of 'صُرعا': صُرعا،

DELETE FROM word_verse_mapping WHERE pashto_word = 'صُرعا،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'صُرعا' AND pashto_word NOT IN ('صُرعا،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('صُرعا', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'صُرعا،';

-- Merge 1 variants of 'جبعه': جبعه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جبعه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'جبعه' AND pashto_word NOT IN ('جبعه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جبعه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جبعه،';

-- Merge 1 variants of 'بيت‌شمس': بيت‌شمس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيت‌شمس،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بيت‌شمس' AND pashto_word NOT IN ('بيت‌شمس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيت‌شمس', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيت‌شمس،';

-- Merge 2 variants of 'غږولې': غږولې،, غږولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'غږولې،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غږولې.';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'غږولې' AND pashto_word NOT IN ('غږولې،','غږولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غږولې', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غږولې،';
DELETE FROM word_frequencies WHERE pashto_word = 'غږولې.';

-- Merge 1 variants of 'لوڼو': لوڼو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لوڼو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'لوڼو' AND pashto_word NOT IN ('لوڼو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لوڼو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لوڼو،';

-- Merge 1 variants of 'بوعز': بوعز،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بوعز،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'بوعز' AND pashto_word NOT IN ('بوعز،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بوعز', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بوعز،';

-- Merge 2 variants of 'ساتله': ساتله., ساتله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'ساتله،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'ساتله' AND pashto_word NOT IN ('ساتله.','ساتله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ساتله', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ساتله.';
DELETE FROM word_frequencies WHERE pashto_word = 'ساتله،';

-- Merge 2 variants of 'راوګرځېدو': راوګرځېدو،, راوګرځېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځېدو،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'راوګرځېدو.';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'راوګرځېدو' AND pashto_word NOT IN ('راوګرځېدو،','راوګرځېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوګرځېدو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځېدو،';
DELETE FROM word_frequencies WHERE pashto_word = 'راوګرځېدو.';

-- Merge 1 variants of 'وژنه': وژنه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وژنه.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وژنه' AND pashto_word NOT IN ('وژنه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وژنه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وژنه.';

-- Merge 1 variants of 'مخلوق': مخلوق،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مخلوق،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مخلوق' AND pashto_word NOT IN ('مخلوق،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مخلوق', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مخلوق،';

-- Merge 1 variants of 'مصالحو': مصالحو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مصالحو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مصالحو' AND pashto_word NOT IN ('مصالحو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مصالحو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مصالحو،';

-- Merge 2 variants of 'واخسته': واخسته،, واخسته.

DELETE FROM word_verse_mapping WHERE pashto_word = 'واخسته،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'واخسته.';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'واخسته' AND pashto_word NOT IN ('واخسته،','واخسته.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واخسته', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واخسته،';
DELETE FROM word_frequencies WHERE pashto_word = 'واخسته.';

-- Merge 1 variants of 'امصياه': امصياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'امصياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'امصياه' AND pashto_word NOT IN ('امصياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('امصياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'امصياه،';

-- Merge 1 variants of 'شبناه': شبناه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شبناه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'شبناه' AND pashto_word NOT IN ('شبناه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شبناه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شبناه،';

-- Merge 1 variants of 'وړاندې': وړاندې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړاندې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وړاندې' AND pashto_word NOT IN ('وړاندې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړاندې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړاندې،';

-- Merge 1 variants of 'عِبر': عِبر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عِبر،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عِبر' AND pashto_word NOT IN ('عِبر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عِبر', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عِبر،';

-- Merge 1 variants of 'عمى‌نداب': عمى‌نداب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عمى‌نداب،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عمى‌نداب' AND pashto_word NOT IN ('عمى‌نداب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عمى‌نداب', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عمى‌نداب،';

-- Merge 1 variants of 'ابياه': ابياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ابياه' AND pashto_word NOT IN ('ابياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابياه،';

-- Merge 1 variants of 'اِلياسب': اِلياسب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِلياسب،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'اِلياسب' AND pashto_word NOT IN ('اِلياسب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِلياسب', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِلياسب،';

-- Merge 1 variants of 'آسف': آسف،

DELETE FROM word_verse_mapping WHERE pashto_word = 'آسف،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'آسف' AND pashto_word NOT IN ('آسف،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('آسف', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'آسف،';

-- Merge 1 variants of 'مُلکياه': مُلکياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُلکياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'مُلکياه' AND pashto_word NOT IN ('مُلکياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُلکياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُلکياه،';

-- Merge 1 variants of 'عداياه': عداياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عداياه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'عداياه' AND pashto_word NOT IN ('عداياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عداياه', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عداياه،';

-- Merge 1 variants of 'کاڼو': کاڼو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاڼو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کاڼو' AND pashto_word NOT IN ('کاڼو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاڼو', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاڼو،';

-- Merge 1 variants of 'يحى‌ايل': يحى‌ايل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يحى‌ايل،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'يحى‌ايل' AND pashto_word NOT IN ('يحى‌ايل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يحى‌ايل', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يحى‌ايل،';

-- Merge 2 variants of 'خپله': خپله., خپله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خپله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'خپله،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'خپله' AND pashto_word NOT IN ('خپله.','خپله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خپله', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خپله.';
DELETE FROM word_frequencies WHERE pashto_word = 'خپله،';

-- Merge 1 variants of 'راڅاڅى': راڅاڅى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'راڅاڅى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'راڅاڅى' AND pashto_word NOT IN ('راڅاڅى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راڅاڅى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راڅاڅى.';

-- Merge 2 variants of 'وځلوه': وځلوه., وځلوه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وځلوه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وځلوه،';

-- Sum frequencies from all variants: 7 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 7
WHERE pashto_word = 'وځلوه' AND pashto_word NOT IN ('وځلوه.','وځلوه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وځلوه', 7);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وځلوه.';
DELETE FROM word_frequencies WHERE pashto_word = 'وځلوه،';

-- Merge 1 variants of 'وګرځم': وګرځم.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګرځم.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وګرځم' AND pashto_word NOT IN ('وګرځم.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګرځم', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګرځم.';

-- Merge 1 variants of 'ولى': ولى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ولى' AND pashto_word NOT IN ('ولى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولى،';

-- Merge 2 variants of 'کېښودلو': کېښودلو., کېښودلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودلو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'کېښودلو،';

-- Sum frequencies from all variants: 6 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 6
WHERE pashto_word = 'کېښودلو' AND pashto_word NOT IN ('کېښودلو.','کېښودلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کېښودلو', 6);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودلو.';
DELETE FROM word_frequencies WHERE pashto_word = 'کېښودلو،';

-- Merge 2 variants of 'وکړله': وکړله., وکړله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړله.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وکړله،';

-- Sum frequencies from all variants: 8 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 8
WHERE pashto_word = 'وکړله' AND pashto_word NOT IN ('وکړله.','وکړله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وکړله', 8);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وکړله.';
DELETE FROM word_frequencies WHERE pashto_word = 'وکړله،';

-- Merge 1 variants of 'کَرى': کَرى.

DELETE FROM word_verse_mapping WHERE pashto_word = 'کَرى.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'کَرى' AND pashto_word NOT IN ('کَرى.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کَرى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کَرى.';

-- Merge 1 variants of 'ورسى': ورسى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورسى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ورسى' AND pashto_word NOT IN ('ورسى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورسى', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورسى،';

-- Merge 1 variants of 'ذات': ذات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ذات،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'ذات' AND pashto_word NOT IN ('ذات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ذات', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ذات،';

-- Merge 1 variants of 'خوېندې': خوېندې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خوېندې،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'خوېندې' AND pashto_word NOT IN ('خوېندې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خوېندې', 4);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خوېندې،';
