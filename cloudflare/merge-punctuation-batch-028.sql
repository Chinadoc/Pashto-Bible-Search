
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چوکاټونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چوکاټونه،';

-- Merge 1 variants of 'بازوګان': بازوګان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بازوګان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بازوګان' AND pashto_word NOT IN ('بازوګان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بازوګان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بازوګان،';

-- Merge 1 variants of 'جالۍ': جالۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جالۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جالۍ' AND pashto_word NOT IN ('جالۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جالۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جالۍ،';

-- Merge 1 variants of 'والۍ': والۍ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'والۍ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'والۍ' AND pashto_word NOT IN ('والۍ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('والۍ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'والۍ،';

-- Merge 1 variants of 'وګنډلې': وګنډلې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وګنډلې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وګنډلې' AND pashto_word NOT IN ('وګنډلې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وګنډلې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وګنډلې.';

-- Merge 1 variants of 'سيخونه': سيخونه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سيخونه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سيخونه' AND pashto_word NOT IN ('سيخونه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سيخونه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سيخونه،';

-- Merge 1 variants of 'ونښلولې': ونښلولې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ونښلولې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ونښلولې' AND pashto_word NOT IN ('ونښلولې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ونښلولې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ونښلولې.';

-- Merge 1 variants of 'کولمو': کولمو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کولمو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کولمو' AND pashto_word NOT IN ('کولمو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کولمو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کولمو،';

-- Merge 1 variants of 'وشيندى': وشيندى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وشيندى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وشيندى' AND pashto_word NOT IN ('وشيندى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وشيندى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وشيندى،';

-- Merge 1 variants of 'لِباس': لِباس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'لِباس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لِباس' AND pashto_word NOT IN ('لِباس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لِباس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لِباس،';

-- Merge 1 variants of 'دپاسه': دپاسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'دپاسه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'دپاسه' AND pashto_word NOT IN ('دپاسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('دپاسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'دپاسه،';

-- Merge 1 variants of 'مارغۀ': مارغۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مارغۀ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مارغۀ' AND pashto_word NOT IN ('مارغۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مارغۀ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مارغۀ،';

-- Merge 1 variants of 'ټکولو': ټکولو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ټکولو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ټکولو' AND pashto_word NOT IN ('ټکولو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ټکولو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ټکولو،';

-- Merge 1 variants of 'پښو': پښو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'پښو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پښو' AND pashto_word NOT IN ('پښو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پښو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پښو،';

-- Merge 1 variants of 'ښائې': ښائې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ښائې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ښائې' AND pashto_word NOT IN ('ښائې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ښائې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ښائې.';

-- Merge 1 variants of 'زکور': زکور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'زکور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'زکور' AND pashto_word NOT IN ('زکور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('زکور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'زکور،';

-- Merge 1 variants of 'يفُنه': يفُنه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يفُنه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يفُنه' AND pashto_word NOT IN ('يفُنه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يفُنه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يفُنه،';

-- Merge 1 variants of 'راواخستله': راواخستله،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستله،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راواخستله' AND pashto_word NOT IN ('راواخستله،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخستله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستله،';

-- Merge 1 variants of 'درکړُو': درکړُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'درکړُو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'درکړُو' AND pashto_word NOT IN ('درکړُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('درکړُو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'درکړُو.';

-- Merge 1 variants of 'ځل': ځل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ځل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ځل' AND pashto_word NOT IN ('ځل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ځل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ځل،';

-- Merge 1 variants of 'تِرضاه': تِرضاه.

DELETE FROM word_verse_mapping WHERE pashto_word = 'تِرضاه.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تِرضاه' AND pashto_word NOT IN ('تِرضاه.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تِرضاه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تِرضاه.';

-- Merge 1 variants of 'مکير': مکير،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مکير،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مکير' AND pashto_word NOT IN ('مکير،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مکير', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مکير،';

-- Merge 1 variants of 'مېدان': مېدان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مېدان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مېدان' AND pashto_word NOT IN ('مېدان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مېدان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مېدان،';

-- Merge 1 variants of 'غاړه': غاړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غاړه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غاړه' AND pashto_word NOT IN ('غاړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غاړه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غاړه،';

-- Merge 1 variants of 'وباګانې': وباګانې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وباګانې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وباګانې' AND pashto_word NOT IN ('وباګانې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وباګانې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وباګانې،';

-- Merge 1 variants of 'کورَنو': کورَنو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کورَنو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کورَنو' AND pashto_word NOT IN ('کورَنو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کورَنو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کورَنو،';

-- Merge 1 variants of 'فصل': فصل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فصل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فصل' AND pashto_word NOT IN ('فصل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فصل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فصل،';

-- Merge 1 variants of 'معبودانو': معبودانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'معبودانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'معبودانو' AND pashto_word NOT IN ('معبودانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('معبودانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'معبودانو،';

-- Merge 1 variants of 'سترګې': سترګې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سترګې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سترګې' AND pashto_word NOT IN ('سترګې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سترګې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سترګې،';

-- Merge 1 variants of 'يريحو': يريحو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يريحو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يريحو' AND pashto_word NOT IN ('يريحو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يريحو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يريحو،';

-- Merge 1 variants of 'وويستلو': وويستلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وويستلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وويستلو' AND pashto_word NOT IN ('وويستلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وويستلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وويستلو،';

-- Merge 1 variants of 'عدر': عدر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عدر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عدر' AND pashto_word NOT IN ('عدر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عدر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عدر،';

-- Merge 1 variants of 'سمع': سمع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سمع،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سمع' AND pashto_word NOT IN ('سمع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سمع', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سمع،';

-- Merge 1 variants of 'اِستال': اِستال،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اِستال،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اِستال' AND pashto_word NOT IN ('اِستال،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اِستال', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اِستال،';

-- Merge 1 variants of 'شوکه': شوکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شوکه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شوکه' AND pashto_word NOT IN ('شوکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شوکه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شوکه،';

-- Merge 1 variants of 'مصفاه': مصفاه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مصفاه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مصفاه' AND pashto_word NOT IN ('مصفاه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مصفاه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مصفاه،';

-- Merge 1 variants of 'مريسه': مريسه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مريسه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مريسه' AND pashto_word NOT IN ('مريسه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مريسه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مريسه،';

-- Merge 1 variants of 'سمير': سمير،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سمير،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سمير' AND pashto_word NOT IN ('سمير،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سمير', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سمير،';

-- Merge 1 variants of 'عرب': عرب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عرب،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عرب' AND pashto_word NOT IN ('عرب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عرب', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عرب،';

-- Merge 1 variants of 'تمنت': تمنت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تمنت،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تمنت' AND pashto_word NOT IN ('تمنت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تمنت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تمنت،';

-- Merge 1 variants of 'بيت‌صور': بيت‌صور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيت‌صور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بيت‌صور' AND pashto_word NOT IN ('بيت‌صور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيت‌صور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيت‌صور،';

-- Merge 1 variants of 'بعلات': بعلات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بعلات،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بعلات' AND pashto_word NOT IN ('بعلات،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بعلات', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بعلات،';

-- Merge 1 variants of 'جولان': جولان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جولان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جولان' AND pashto_word NOT IN ('جولان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جولان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جولان،';

-- Merge 1 variants of 'محنايم': محنايم،

DELETE FROM word_verse_mapping WHERE pashto_word = 'محنايم،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'محنايم' AND pashto_word NOT IN ('محنايم،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('محنايم', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'محنايم،';

-- Merge 1 variants of 'مالِکان': مالِکان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مالِکان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مالِکان' AND pashto_word NOT IN ('مالِکان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مالِکان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مالِکان،';

-- Merge 1 variants of 'خبره': خبره،

DELETE FROM word_verse_mapping WHERE pashto_word = 'خبره،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خبره' AND pashto_word NOT IN ('خبره،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خبره', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خبره،';

-- Merge 1 variants of 'بيت‌شان': بيت‌شان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'بيت‌شان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'بيت‌شان' AND pashto_word NOT IN ('بيت‌شان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('بيت‌شان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'بيت‌شان،';

-- Merge 1 variants of 'ولړزېدل': ولړزېدل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولړزېدل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولړزېدل' AND pashto_word NOT IN ('ولړزېدل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولړزېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولړزېدل،';

-- Merge 1 variants of 'ميديانيان': ميديانيان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ميديانيان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ميديانيان' AND pashto_word NOT IN ('ميديانيان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ميديانيان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ميديانيان،';

-- Merge 1 variants of 'لټوله': لټوله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټوله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لټوله' AND pashto_word NOT IN ('لټوله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټوله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټوله.';

-- Merge 1 variants of 'سيکې': سيکې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سيکې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سيکې' AND pashto_word NOT IN ('سيکې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سيکې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سيکې،';

-- Merge 1 variants of 'راواخستل': راواخستل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راواخستل' AND pashto_word NOT IN ('راواخستل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخستل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستل،';

-- Merge 1 variants of 'شړه': شړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شړه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شړه' AND pashto_word NOT IN ('شړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شړه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شړه،';

-- Merge 1 variants of 'ورکړله': ورکړله.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورکړله.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورکړله' AND pashto_word NOT IN ('ورکړله.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورکړله', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورکړله.';

-- Merge 2 variants of 'يوړه': يوړه., يوړه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړه.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'يوړه،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'يوړه' AND pashto_word NOT IN ('يوړه.','يوړه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوړه', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوړه.';
DELETE FROM word_frequencies WHERE pashto_word = 'يوړه،';

-- Merge 1 variants of 'عيلى': عيلى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عيلى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عيلى' AND pashto_word NOT IN ('عيلى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عيلى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عيلى،';

-- Merge 1 variants of 'راوړُو': راوړُو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوړُو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوړُو' AND pashto_word NOT IN ('راوړُو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوړُو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوړُو،';

-- Merge 1 variants of 'وغورزېدو': وغورزېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وغورزېدو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وغورزېدو' AND pashto_word NOT IN ('وغورزېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وغورزېدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وغورزېدو.';

-- Merge 1 variants of 'واړول': واړول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'واړول،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'واړول' AND pashto_word NOT IN ('واړول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('واړول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'واړول،';

-- Merge 1 variants of 'لټول': لټول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'لټول.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'لټول' AND pashto_word NOT IN ('لټول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('لټول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'لټول.';

-- Merge 2 variants of 'غورزوى': غورزوى., غورزوى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غورزوى.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'غورزوى،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'غورزوى' AND pashto_word NOT IN ('غورزوى.','غورزوى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غورزوى', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غورزوى.';
DELETE FROM word_frequencies WHERE pashto_word = 'غورزوى،';

-- Merge 1 variants of 'راوويستو': راوويستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راوويستو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راوويستو' AND pashto_word NOT IN ('راوويستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راوويستو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راوويستو،';

-- Merge 1 variants of 'وويشتو': وويشتو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وويشتو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وويشتو' AND pashto_word NOT IN ('وويشتو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وويشتو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وويشتو.';

-- Merge 1 variants of 'کاميابېدو': کاميابېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کاميابېدو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کاميابېدو' AND pashto_word NOT IN ('کاميابېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کاميابېدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کاميابېدو،';

-- Merge 1 variants of 'خبر': خبر.

DELETE FROM word_verse_mapping WHERE pashto_word = 'خبر.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'خبر' AND pashto_word NOT IN ('خبر.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('خبر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'خبر.';

-- Merge 1 variants of 'نيسې': نيسې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نيسې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نيسې' AND pashto_word NOT IN ('نيسې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نيسې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نيسې،';

-- Merge 1 variants of 'مرې': مرې.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مرې.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مرې' AND pashto_word NOT IN ('مرې.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مرې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مرې.';

-- Merge 1 variants of 'کشمشو': کشمشو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'کشمشو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'کشمشو' AND pashto_word NOT IN ('کشمشو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('کشمشو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'کشمشو،';

-- Merge 1 variants of 'منه': منه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'منه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'منه' AND pashto_word NOT IN ('منه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('منه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'منه،';

-- Merge 1 variants of '”نۀ': ”نۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = '”نۀ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = '”نۀ' AND pashto_word NOT IN ('”نۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”نۀ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”نۀ،';

-- Merge 1 variants of 'اخيمعض': اخيمعض،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اخيمعض،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اخيمعض' AND pashto_word NOT IN ('اخيمعض،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اخيمعض', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اخيمعض،';

-- Merge 1 variants of 'جوړېدو': جوړېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جوړېدو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جوړېدو' AND pashto_word NOT IN ('جوړېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جوړېدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جوړېدو،';

-- Merge 1 variants of 'چمټې': چمټې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'چمټې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'چمټې' AND pashto_word NOT IN ('چمټې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('چمټې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'چمټې،';

-- Merge 1 variants of 'فوجيانو': فوجيانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فوجيانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فوجيانو' AND pashto_word NOT IN ('فوجيانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فوجيانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فوجيانو،';

-- Merge 1 variants of 'قچر': قچر.

DELETE FROM word_verse_mapping WHERE pashto_word = 'قچر.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قچر' AND pashto_word NOT IN ('قچر.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قچر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قچر.';

-- Merge 1 variants of 'مولک': مولک.

DELETE FROM word_verse_mapping WHERE pashto_word = 'مولک.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مولک' AND pashto_word NOT IN ('مولک.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مولک', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مولک.';

-- Merge 1 variants of 'راواخستو': راواخستو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'راواخستو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'راواخستو' AND pashto_word NOT IN ('راواخستو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('راواخستو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'راواخستو،';

-- Merge 1 variants of 'ابيل‌بيت‌معکه': ابيل‌بيت‌معکه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ابيل‌بيت‌معکه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ابيل‌بيت‌معکه' AND pashto_word NOT IN ('ابيل‌بيت‌معکه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ابيل‌بيت‌معکه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ابيل‌بيت‌معکه،';

-- Merge 1 variants of 'استعمالول': استعمالول.

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالول.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'استعمالول' AND pashto_word NOT IN ('استعمالول.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعمالول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالول.';

-- Merge 1 variants of 'ورننوتلو': ورننوتلو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ورننوتلو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ورننوتلو' AND pashto_word NOT IN ('ورننوتلو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ورننوتلو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ورننوتلو،';

-- Merge 1 variants of 'اول': اول،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اول،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اول' AND pashto_word NOT IN ('اول،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اول', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اول،';

-- Merge 1 variants of 'نۀ': نۀ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نۀ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نۀ' AND pashto_word NOT IN ('نۀ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نۀ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نۀ،';

-- Merge 1 variants of 'تېرېدو': تېرېدو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'تېرېدو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'تېرېدو' AND pashto_word NOT IN ('تېرېدو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('تېرېدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'تېرېدو،';

-- Merge 1 variants of '”ميکاياه': ”ميکاياه،

DELETE FROM word_verse_mapping WHERE pashto_word = '”ميکاياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = '”ميکاياه' AND pashto_word NOT IN ('”ميکاياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('”ميکاياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = '”ميکاياه،';

-- Merge 1 variants of 'وخېژولو': وخېژولو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'وخېژولو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'وخېژولو' AND pashto_word NOT IN ('وخېژولو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وخېژولو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وخېژولو.';

-- Merge 1 variants of 'ولټوُو': ولټوُو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'ولټوُو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ولټوُو' AND pashto_word NOT IN ('ولټوُو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ولټوُو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ولټوُو.';

-- Merge 1 variants of 'سحر': سحر،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سحر،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سحر' AND pashto_word NOT IN ('سحر،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سحر', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سحر،';

-- Merge 1 variants of 'قبلوې': قبلوې،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قبلوې،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قبلوې' AND pashto_word NOT IN ('قبلوې،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قبلوې', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قبلوې،';

-- Merge 1 variants of 'پېښېدو': پېښېدو.

DELETE FROM word_verse_mapping WHERE pashto_word = 'پېښېدو.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'پېښېدو' AND pashto_word NOT IN ('پېښېدو.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('پېښېدو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'پېښېدو.';

-- Merge 1 variants of 'سينحرب': سينحرب،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سينحرب،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سينحرب' AND pashto_word NOT IN ('سينحرب،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سينحرب', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سينحرب،';

-- Merge 1 variants of 'سامريه': سامريه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سامريه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سامريه' AND pashto_word NOT IN ('سامريه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سامريه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سامريه،';

-- Merge 1 variants of 'عکبور': عکبور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عکبور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عکبور' AND pashto_word NOT IN ('عکبور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عکبور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عکبور،';

-- Merge 1 variants of 'استعمالېدل': استعمالېدل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'استعمالېدل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'استعمالېدل' AND pashto_word NOT IN ('استعمالېدل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('استعمالېدل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'استعمالېدل.';

-- Merge 1 variants of 'جدلياه': جدلياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جدلياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جدلياه' AND pashto_word NOT IN ('جدلياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('جدلياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'جدلياه،';

-- Merge 1 variants of 'غريبانان': غريبانان،

DELETE FROM word_verse_mapping WHERE pashto_word = 'غريبانان،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'غريبانان' AND pashto_word NOT IN ('غريبانان،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('غريبانان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'غريبانان،';

-- Merge 1 variants of 'سِلح': سِلح،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سِلح،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سِلح' AND pashto_word NOT IN ('سِلح،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سِلح', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سِلح،';

-- Merge 1 variants of 'فلج': فلج،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فلج،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فلج' AND pashto_word NOT IN ('فلج،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فلج', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فلج،';

-- Merge 1 variants of 'رعو': رعو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رعو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رعو' AND pashto_word NOT IN ('رعو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رعو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رعو،';

-- Merge 1 variants of 'سروګ': سروګ،

DELETE FROM word_verse_mapping WHERE pashto_word = 'سروګ،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'سروګ' AND pashto_word NOT IN ('سروګ،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('سروګ', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'سروګ،';

-- Merge 1 variants of 'نحور': نحور،

DELETE FROM word_verse_mapping WHERE pashto_word = 'نحور،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'نحور' AND pashto_word NOT IN ('نحور،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('نحور', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'نحور،';

-- Merge 1 variants of 'عتى': عتى،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عتى،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عتى' AND pashto_word NOT IN ('عتى،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عتى', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عتى،';

-- Merge 1 variants of 'عوبيد': عوبيد،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عوبيد،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عوبيد' AND pashto_word NOT IN ('عوبيد،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عوبيد', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عوبيد،';

-- Merge 1 variants of 'حاران': حاران،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حاران،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حاران' AND pashto_word NOT IN ('حاران،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حاران', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حاران،';

-- Merge 1 variants of 'يوآس': يوآس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يوآس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يوآس' AND pashto_word NOT IN ('يوآس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يوآس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يوآس،';

-- Merge 2 variants of 'احاز': احاز،, احاز.

DELETE FROM word_verse_mapping WHERE pashto_word = 'احاز،';
DELETE FROM word_verse_mapping WHERE pashto_word = 'احاز.';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'احاز' AND pashto_word NOT IN ('احاز،','احاز.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('احاز', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'احاز،';
DELETE FROM word_frequencies WHERE pashto_word = 'احاز.';

-- Merge 1 variants of 'حزقياه': حزقياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حزقياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حزقياه' AND pashto_word NOT IN ('حزقياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حزقياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حزقياه،';

-- Merge 1 variants of 'شلتى‌اېل': شلتى‌اېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'شلتى‌اېل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'شلتى‌اېل' AND pashto_word NOT IN ('شلتى‌اېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('شلتى‌اېل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'شلتى‌اېل،';

-- Merge 1 variants of 'فارص': فارص،

DELETE FROM word_verse_mapping WHERE pashto_word = 'فارص،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'فارص' AND pashto_word NOT IN ('فارص،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('فارص', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'فارص،';

-- Merge 1 variants of 'حصرون': حصرون،

DELETE FROM word_verse_mapping WHERE pashto_word = 'حصرون،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حصرون' AND pashto_word NOT IN ('حصرون،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حصرون', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حصرون،';

-- Merge 1 variants of 'ډالونو': ډالونو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'ډالونو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'ډالونو' AND pashto_word NOT IN ('ډالونو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('ډالونو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'ډالونو،';

-- Merge 1 variants of 'اورى‌اېل': اورى‌اېل،

DELETE FROM word_verse_mapping WHERE pashto_word = 'اورى‌اېل،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اورى‌اېل' AND pashto_word NOT IN ('اورى‌اېل،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اورى‌اېل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اورى‌اېل،';

-- Merge 1 variants of 'رفاياه': رفاياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'رفاياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'رفاياه' AND pashto_word NOT IN ('رفاياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('رفاياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'رفاياه،';

-- Merge 1 variants of 'قيس': قيس،

DELETE FROM word_verse_mapping WHERE pashto_word = 'قيس،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'قيس' AND pashto_word NOT IN ('قيس،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('قيس', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'قيس،';

-- Merge 1 variants of 'مُلکى‌شوَع': مُلکى‌شوَع،

DELETE FROM word_verse_mapping WHERE pashto_word = 'مُلکى‌شوَع،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'مُلکى‌شوَع' AND pashto_word NOT IN ('مُلکى‌شوَع،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('مُلکى‌شوَع', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'مُلکى‌شوَع،';

-- Merge 1 variants of 'اشبعل': اشبعل.

DELETE FROM word_verse_mapping WHERE pashto_word = 'اشبعل.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'اشبعل' AND pashto_word NOT IN ('اشبعل.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('اشبعل', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'اشبعل.';

-- Merge 1 variants of 'علمت': علمت،

DELETE FROM word_verse_mapping WHERE pashto_word = 'علمت،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'علمت' AND pashto_word NOT IN ('علمت،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('علمت', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'علمت،';

-- Merge 1 variants of 'عزريقام': عزريقام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عزريقام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عزريقام' AND pashto_word NOT IN ('عزريقام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عزريقام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عزريقام،';

-- Merge 1 variants of 'حنان': حنان.

DELETE FROM word_verse_mapping WHERE pashto_word = 'حنان.';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'حنان' AND pashto_word NOT IN ('حنان.');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('حنان', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'حنان.';

-- Merge 2 variants of 'وړو': وړو., وړو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'وړو.';
DELETE FROM word_verse_mapping WHERE pashto_word = 'وړو،';

-- Sum frequencies from all variants: 4 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 4
WHERE pashto_word = 'وړو' AND pashto_word NOT IN ('وړو.','وړو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('وړو', 4);

-- Delete 2 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'وړو.';
DELETE FROM word_frequencies WHERE pashto_word = 'وړو،';

-- Merge 1 variants of 'عساياه': عساياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'عساياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'عساياه' AND pashto_word NOT IN ('عساياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('عساياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'عساياه،';

-- Merge 1 variants of 'موسيقارانو': موسيقارانو،

DELETE FROM word_verse_mapping WHERE pashto_word = 'موسيقارانو،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'موسيقارانو' AND pashto_word NOT IN ('موسيقارانو،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('موسيقارانو', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'موسيقارانو،';

-- Merge 1 variants of 'يرياه': يرياه،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يرياه،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يرياه' AND pashto_word NOT IN ('يرياه،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يرياه', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يرياه،';

-- Merge 1 variants of 'يورام': يورام،

DELETE FROM word_verse_mapping WHERE pashto_word = 'يورام،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'يورام' AND pashto_word NOT IN ('يورام،');

INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total) VALUES ('يورام', 2);

-- Delete 1 punctuation variants
DELETE FROM word_frequencies WHERE pashto_word = 'يورام،';

-- Merge 1 variants of 'جات': جات،

DELETE FROM word_verse_mapping WHERE pashto_word = 'جات،';

-- Sum frequencies from all variants: 2 total occurrences
UPDATE word_frequencies SET
  frequency_total = frequency_total + 2
WHERE pashto_word = 'جات' AND pashto_word NOT IN ('جات،');
