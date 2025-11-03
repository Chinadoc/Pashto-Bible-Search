-- Import Verb Stems/Roots from Dictionary to Word Frequencies
-- This adds base verb information (stems/roots) from dictionary to word_frequencies
-- Reference: https://grammar.lingdocs.com/verbs/master-chart/
-- Note: Some columns may already exist, which is fine - we'll just update existing rows

-- Update base verbs with dictionary stems/roots
-- آبادول: psp=, ssp=, prp=وآبادول, pp=آباد کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'آبادول',
  perfective_root = 'وآبادول',
  past_participle = 'آباد کړی',
  has_issues = 0
WHERE pashto_word = 'آبادول';

-- اچول: psp=, ssp=, prp=واچول, pp=اچ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اچول',
  perfective_root = 'واچول',
  past_participle = 'اچ کړی',
  has_issues = 0
WHERE pashto_word = 'اچول';

-- اخستل: psp=اخل, ssp=واخل, prp=واخستل, pp=اخست
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اخستل',
  imperfective_stem = 'اخل',
  perfective_stem = 'واخل',
  perfective_root = 'واخستل',
  past_participle = 'اخست',
  has_issues = 0
WHERE pashto_word = 'اخستل';

-- اخیستل: psp=اخل, ssp=واخل, prp=واخیستل, pp=اخیست
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اخیستل',
  imperfective_stem = 'اخل',
  perfective_stem = 'واخل',
  perfective_root = 'واخیستل',
  past_participle = 'اخیست',
  has_issues = 0
WHERE pashto_word = 'اخیستل';

-- ادا کول: psp=, ssp=, prp=وادا کول, pp=ادا  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ادا کول',
  perfective_root = 'وادا کول',
  past_participle = 'ادا  کړی',
  has_issues = 0
WHERE pashto_word = 'ادا کول';

-- استعمالول: psp=, ssp=, prp=واستعمالول, pp=استعمال کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'استعمالول',
  perfective_root = 'واستعمالول',
  past_participle = 'استعمال کړی',
  has_issues = 0
WHERE pashto_word = 'استعمالول';

-- استعمالېدل: psp=, ssp=, prp=واستعمالېدل, pp=استعمالېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'استعمالېدل',
  perfective_root = 'واستعمالېدل',
  past_participle = 'استعمالېدلی',
  has_issues = 0
WHERE pashto_word = 'استعمالېدل';

-- اعلانول: psp=, ssp=, prp=واعلانول, pp=اعلان کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اعلانول',
  perfective_root = 'واعلانول',
  past_participle = 'اعلان کړی',
  has_issues = 0
WHERE pashto_word = 'اعلانول';

-- اغوستل: psp=اغوند, ssp=واغوند, prp=واغوستل, pp=اغوست
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اغوستل',
  imperfective_stem = 'اغوند',
  perfective_stem = 'واغوند',
  perfective_root = 'واغوستل',
  past_participle = 'اغوست',
  has_issues = 0
WHERE pashto_word = 'اغوستل';

-- اوبدل: psp=اوب, ssp=واوب, prp=واوبدل, pp=اوبد
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اوبدل',
  imperfective_stem = 'اوب',
  perfective_stem = 'واوب',
  perfective_root = 'واوبدل',
  past_participle = 'اوبد',
  has_issues = 0
WHERE pashto_word = 'اوبدل';

-- اورېدل: psp=آور, ssp=وآور, prp=وآرېدل, pp=آرېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اورېدل',
  imperfective_stem = 'آور',
  perfective_stem = 'وآور',
  perfective_root = 'وآرېدل',
  past_participle = 'آرېدلی',
  has_issues = 0
WHERE pashto_word = 'اورېدل';

-- اوسېدل: psp=, ssp=, prp=واوسېدل, pp=اوسېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اوسېدل',
  perfective_root = 'واوسېدل',
  past_participle = 'اوسېدلی',
  has_issues = 0
WHERE pashto_word = 'اوسېدل';

-- بچ کول: psp=, ssp=, prp=وبچ کول, pp=بچ  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بچ کول',
  perfective_root = 'وبچ کول',
  past_participle = 'بچ  کړی',
  has_issues = 0
WHERE pashto_word = 'بچ کول';

-- بدلېدل: psp=, ssp=, prp=وبدلېدل, pp=بدلېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بدلېدل',
  perfective_root = 'وبدلېدل',
  past_participle = 'بدلېدلی',
  has_issues = 0
WHERE pashto_word = 'بدلېدل';

-- بندول: psp=, ssp=, prp=وبندول, pp=بند کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بندول',
  perfective_root = 'وبندول',
  past_participle = 'بند کړی',
  has_issues = 0
WHERE pashto_word = 'بندول';

-- بندېدل: psp=, ssp=, prp=وبندېدل, pp=بندېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بندېدل',
  perfective_root = 'وبندېدل',
  past_participle = 'بندېدلی',
  has_issues = 0
WHERE pashto_word = 'بندېدل';

-- بلل: psp=بول, ssp=وبول, prp=وبلل, pp=بل
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بلل',
  imperfective_stem = 'بول',
  perfective_stem = 'وبول',
  perfective_root = 'وبلل',
  past_participle = 'بل',
  has_issues = 0
WHERE pashto_word = 'بلل';

-- بوتلل: psp=بیای, ssp=بوځ, prp=, pp=
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بوتلل',
  imperfective_stem = 'بیای',
  perfective_stem = 'بوځ',
  has_issues = 0
WHERE pashto_word = 'بوتلل';

-- پاتې کېدل: psp=, ssp=, prp=وپاتې کېدل, pp=پاتې کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پاتې کېدل',
  perfective_root = 'وپاتې کېدل',
  past_participle = 'پاتې کېدلی',
  has_issues = 0
WHERE pashto_word = 'پاتې کېدل';

-- پرانیستل: psp=پرانیز, ssp=وپرانیز, prp=وپرانیستل, pp=پرانیست
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرانیستل',
  imperfective_stem = 'پرانیز',
  perfective_stem = 'وپرانیز',
  perfective_root = 'وپرانیستل',
  past_participle = 'پرانیست',
  has_issues = 0
WHERE pashto_word = 'پرانیستل';

-- پرېښودل: psp=پرېږد, ssp=وپرېږد, prp=وپرېښودل, pp=پرېښود
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرېښودل',
  imperfective_stem = 'پرېږد',
  perfective_stem = 'وپرېږد',
  perfective_root = 'وپرېښودل',
  past_participle = 'پرېښود',
  has_issues = 0
WHERE pashto_word = 'پرېښودل';

-- پرېوتل: psp=پرېوځ, ssp=پرېووځ, prp=پرېوتل, pp=
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرېوتل',
  imperfective_stem = 'پرېوځ',
  perfective_stem = 'پرېووځ',
  perfective_root = 'پرېوتل',
  has_issues = 0
WHERE pashto_word = 'پرېوتل';

-- پوره کول: psp=, ssp=, prp=وپوره کول, pp=پوره  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پوره کول',
  perfective_root = 'وپوره کول',
  past_participle = 'پوره  کړی',
  has_issues = 0
WHERE pashto_word = 'پوره کول';

-- پوهېدل: psp=, ssp=, prp=وپوهېدل, pp=پوهېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پوهېدل',
  perfective_root = 'وپوهېدل',
  past_participle = 'پوهېدلی',
  has_issues = 0
WHERE pashto_word = 'پوهېدل';

-- پېژندل: psp=پېژن, ssp=وپېژن, prp=وپېژندل, pp=پېژند
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېژندل',
  imperfective_stem = 'پېژن',
  perfective_stem = 'وپېژن',
  perfective_root = 'وپېژندل',
  past_participle = 'پېژند',
  has_issues = 0
WHERE pashto_word = 'پېژندل';

-- پېش کول: psp=, ssp=, prp=وپېش کول, pp=پېش  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېش کول',
  perfective_root = 'وپېش کول',
  past_participle = 'پېش  کړی',
  has_issues = 0
WHERE pashto_word = 'پېش کول';

-- پېش کېدل: psp=, ssp=, prp=وپېش کېدل, pp=پېش کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېش کېدل',
  perfective_root = 'وپېش کېدل',
  past_participle = 'پېش کېدلی',
  has_issues = 0
WHERE pashto_word = 'پېش کېدل';

-- پېښېدل: psp=, ssp=, prp=وپېښېدل, pp=پېښېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېښېدل',
  perfective_root = 'وپېښېدل',
  past_participle = 'پېښېدلی',
  has_issues = 0
WHERE pashto_word = 'پېښېدل';

-- جوړول: psp=, ssp=, prp=وجوړول, pp=جوړ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'جوړول',
  perfective_root = 'وجوړول',
  past_participle = 'جوړ کړی',
  has_issues = 0
WHERE pashto_word = 'جوړول';

-- جوړېدل: psp=, ssp=, prp=وجوړېدل, pp=جوړېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'جوړېدل',
  perfective_root = 'وجوړېدل',
  past_participle = 'جوړېدلی',
  has_issues = 0
WHERE pashto_word = 'جوړېدل';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_verb ON word_frequencies (base_verb);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_imperfective_stem ON word_frequencies (imperfective_stem);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_perfective_stem ON word_frequencies (perfective_stem);

