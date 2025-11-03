-- Import Verb Stems/Roots from Dictionary to Word Frequencies
-- This adds base verb information (stems/roots) from dictionary to word_frequencies
-- Reference: https://grammar.lingdocs.com/verbs/master-chart/

-- Add columns if missing (SQLite doesn't support IF NOT EXISTS, so we'll handle errors)
-- These may already exist, which is fine
-- base_verb TEXT;
-- word_type TEXT;
-- imperfective_stem TEXT;
-- perfective_stem TEXT;
-- perfective_root TEXT;
-- past_participle TEXT;

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

-- ازمایل: psp=, ssp=, prp=وازمایل, pp=ازمایلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ازمایل',
  perfective_root = 'وازمایل',
  past_participle = 'ازمایلی',
  has_issues = 0
WHERE pashto_word = 'ازمایل';

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

-- اغوستل: psp=اغوند, ssp=واغوند, prp=واغوستل, pp=اغوستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اغوستل',
  imperfective_stem = 'اغوند',
  perfective_stem = 'واغوند',
  perfective_root = 'واغوستل',
  past_participle = 'اغوستلی',
  has_issues = 0
WHERE pashto_word = 'اغوستل';

-- اوبدل: psp=اوب, ssp=واوب, prp=واوبدل, pp=اوبدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اوبدل',
  imperfective_stem = 'اوب',
  perfective_stem = 'واوب',
  perfective_root = 'واوبدل',
  past_participle = 'اوبدلی',
  has_issues = 0
WHERE pashto_word = 'اوبدل';

-- اورول: psp=, ssp=, prp=واورول, pp=اور کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اورول',
  perfective_root = 'واورول',
  past_participle = 'اور کړی',
  has_issues = 0
WHERE pashto_word = 'اورول';

-- اورېدل: psp=اور, ssp=واور, prp=واورېدل, pp=اورېد
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اورېدل',
  imperfective_stem = 'اور',
  perfective_stem = 'واور',
  perfective_root = 'واورېدل',
  past_participle = 'اورېد',
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

-- اول: psp=, ssp=, prp=واول, pp=ا کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'اول',
  perfective_root = 'واول',
  past_participle = 'ا کړی',
  has_issues = 0
WHERE pashto_word = 'اول';

-- بالکل: psp=, ssp=, prp=وبالکل, pp=بالکلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بالکل',
  perfective_root = 'وبالکل',
  past_participle = 'بالکلی',
  has_issues = 0
WHERE pashto_word = 'بالکل';

-- بچ کول: psp=, ssp=, prp=وبچ کول, pp=بچ  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بچ کول',
  perfective_root = 'وبچ کول',
  past_participle = 'بچ  کړی',
  has_issues = 0
WHERE pashto_word = 'بچ کول';

-- بحث کول: psp=, ssp=, prp=وبحث کول, pp=بحث  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بحث کول',
  perfective_root = 'وبحث کول',
  past_participle = 'بحث  کړی',
  has_issues = 0
WHERE pashto_word = 'بحث کول';

-- بخښل: psp=, ssp=, prp=وبخښل, pp=بخښلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بخښل',
  perfective_root = 'وبخښل',
  past_participle = 'بخښلی',
  has_issues = 0
WHERE pashto_word = 'بخښل';

-- بدلېدل: psp=, ssp=, prp=وبدلېدل, pp=بدلېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بدلېدل',
  perfective_root = 'وبدلېدل',
  past_participle = 'بدلېدلی',
  has_issues = 0
WHERE pashto_word = 'بدلېدل';

-- بلل: psp=بول, ssp=وبول, prp=وبلل, pp=باله
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بلل',
  imperfective_stem = 'بول',
  perfective_stem = 'وبول',
  perfective_root = 'وبلل',
  past_participle = 'باله',
  has_issues = 0
WHERE pashto_word = 'بلل';

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

-- بهېدل: psp=, ssp=, prp=وبهېدل, pp=بهېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بهېدل',
  perfective_root = 'وبهېدل',
  past_participle = 'بهېدلی',
  has_issues = 0
WHERE pashto_word = 'بهېدل';

-- بوتلل: psp=بیای, ssp=بوځ, prp=وبوتلل, pp=بوتللی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بوتلل',
  imperfective_stem = 'بیای',
  perfective_stem = 'بوځ',
  perfective_root = 'وبوتلل',
  past_participle = 'بوتللی',
  has_issues = 0
WHERE pashto_word = 'بوتلل';

-- بیانول: psp=, ssp=, prp=وبیانول, pp=بیان کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بیانول',
  perfective_root = 'وبیانول',
  past_participle = 'بیان کړی',
  has_issues = 0
WHERE pashto_word = 'بیانول';

-- بېول: psp=, ssp=, prp=وبېول, pp=بې کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'بېول',
  perfective_root = 'وبېول',
  past_participle = 'بې کړی',
  has_issues = 0
WHERE pashto_word = 'بېول';

-- پاتې کېدل: psp=, ssp=, prp=وپاتې کېدل, pp=پاتې کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پاتې کېدل',
  perfective_root = 'وپاتې کېدل',
  past_participle = 'پاتې کېدلی',
  has_issues = 0
WHERE pashto_word = 'پاتې کېدل';

-- پاڅېدل: psp=, ssp=, prp=وپاڅېدل, pp=پاڅېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پاڅېدل',
  perfective_root = 'وپاڅېدل',
  past_participle = 'پاڅېدلی',
  has_issues = 0
WHERE pashto_word = 'پاڅېدل';

-- پخول: psp=, ssp=, prp=وپخول, pp=پخ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پخول',
  perfective_root = 'وپخول',
  past_participle = 'پخ کړی',
  has_issues = 0
WHERE pashto_word = 'پخول';

-- پرانیستل: psp=پرانیز, ssp=وپرانیز, prp=وپرانیستل, pp=پرانیستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرانیستل',
  imperfective_stem = 'پرانیز',
  perfective_stem = 'وپرانیز',
  perfective_root = 'وپرانیستل',
  past_participle = 'پرانیستلی',
  has_issues = 0
WHERE pashto_word = 'پرانیستل';

-- پرېښودل: psp=پرېږد, ssp=وپرېږد, prp=وپرېښودل, pp=پرېښودلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرېښودل',
  imperfective_stem = 'پرېږد',
  perfective_stem = 'وپرېږد',
  perfective_root = 'وپرېښودل',
  past_participle = 'پرېښودلی',
  has_issues = 0
WHERE pashto_word = 'پرېښودل';

-- پرېوتل: psp=پرېوځ, ssp=پرېووځ, prp=پرېوتل, pp=پرېوت, پرېواته
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پرېوتل',
  imperfective_stem = 'پرېوځ',
  perfective_stem = 'پرېووځ',
  perfective_root = 'پرېوتل',
  past_participle = 'پرېوت, پرېواته',
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

-- پوهول: psp=, ssp=, prp=وپوهول, pp=پوه کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پوهول',
  perfective_root = 'وپوهول',
  past_participle = 'پوه کړی',
  has_issues = 0
WHERE pashto_word = 'پوهول';

-- پوهېدل: psp=, ssp=, prp=وپوهېدل, pp=پوهېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پوهېدل',
  perfective_root = 'وپوهېدل',
  past_participle = 'پوهېدلی',
  has_issues = 0
WHERE pashto_word = 'پوهېدل';

-- پېدل: psp=, ssp=, prp=وپېدل, pp=پېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېدل',
  perfective_root = 'وپېدل',
  past_participle = 'پېدلی',
  has_issues = 0
WHERE pashto_word = 'پېدل';

-- پیروي کول: psp=, ssp=, prp=وپیروي کول, pp=پیروي  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پیروي کول',
  perfective_root = 'وپیروي کول',
  past_participle = 'پیروي  کړی',
  has_issues = 0
WHERE pashto_word = 'پیروي کول';

-- پېژندل: psp=پېژن, ssp=وپېژن, prp=وپېژندل, pp=پېژاند
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'پېژندل',
  imperfective_stem = 'پېژن',
  perfective_stem = 'وپېژن',
  perfective_root = 'وپېژندل',
  past_participle = 'پېژاند',
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

-- تاوېدل: psp=, ssp=, prp=وتاوېدل, pp=تاوېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تاوېدل',
  perfective_root = 'وتاوېدل',
  past_participle = 'تاوېدلی',
  has_issues = 0
WHERE pashto_word = 'تاوېدل';

-- تباه کول: psp=, ssp=, prp=وتباه کول, pp=تباه  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تباه کول',
  perfective_root = 'وتباه کول',
  past_participle = 'تباه  کړی',
  has_issues = 0
WHERE pashto_word = 'تباه کول';

-- تباه کېدل: psp=, ssp=, prp=وتباه کېدل, pp=تباه کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تباه کېدل',
  perfective_root = 'وتباه کېدل',
  past_participle = 'تباه کېدلی',
  has_issues = 0
WHERE pashto_word = 'تباه کېدل';

-- تړل: psp=, ssp=, prp=وتړل, pp=تاړه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تړل',
  perfective_root = 'وتړل',
  past_participle = 'تاړه',
  has_issues = 0
WHERE pashto_word = 'تړل';

-- تښتېدل: psp=, ssp=, prp=وتښتېدل, pp=تښتېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تښتېدل',
  perfective_root = 'وتښتېدل',
  past_participle = 'تښتېدلی',
  has_issues = 0
WHERE pashto_word = 'تښتېدل';

-- تل: psp=, ssp=, prp=وتل, pp=تلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تل',
  perfective_root = 'وتل',
  past_participle = 'تلی',
  has_issues = 0
WHERE pashto_word = 'تل';

-- تلل: psp=, ssp=, prp=وتلل, pp=تاله
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تلل',
  perfective_root = 'وتلل',
  past_participle = 'تاله',
  has_issues = 0
WHERE pashto_word = 'تلل';

-- توږل: psp=, ssp=, prp=وتوږل, pp=توږلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'توږل',
  perfective_root = 'وتوږل',
  past_participle = 'توږلی',
  has_issues = 0
WHERE pashto_word = 'توږل';

-- توکل: psp=, ssp=, prp=وتوکل, pp=توکلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'توکل',
  perfective_root = 'وتوکل',
  past_participle = 'توکلی',
  has_issues = 0
WHERE pashto_word = 'توکل';

-- تېرول: psp=, ssp=, prp=وتېرول, pp=تېر کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تېرول',
  perfective_root = 'وتېرول',
  past_participle = 'تېر کړی',
  has_issues = 0
WHERE pashto_word = 'تېرول';

-- تېرېدل: psp=, ssp=, prp=وتېرېدل, pp=تېرېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'تېرېدل',
  perfective_root = 'وتېرېدل',
  past_participle = 'تېرېدلی',
  has_issues = 0
WHERE pashto_word = 'تېرېدل';

-- ټاکل: psp=, ssp=, prp=وټاکل, pp=ټاکه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ټاکل',
  perfective_root = 'وټاکل',
  past_participle = 'ټاکه',
  has_issues = 0
WHERE pashto_word = 'ټاکل';

-- ټکول: psp=, ssp=, prp=وټکول, pp=ټ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ټکول',
  perfective_root = 'وټکول',
  past_participle = 'ټ کړی',
  has_issues = 0
WHERE pashto_word = 'ټکول';

-- ټول: psp=, ssp=, prp=وټول, pp=ټ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ټول',
  perfective_root = 'وټول',
  past_participle = 'ټ کړی',
  has_issues = 0
WHERE pashto_word = 'ټول';

-- ټېله کول: psp=, ssp=, prp=وټېله کول, pp=ټېله  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ټېله کول',
  perfective_root = 'وټېله کول',
  past_participle = 'ټېله  کړی',
  has_issues = 0
WHERE pashto_word = 'ټېله کول';

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

-- ځان ساتل: psp=, ssp=, prp=وځان ساتل, pp=ځان ساتلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ځان ساتل',
  perfective_root = 'وځان ساتل',
  past_participle = 'ځان ساتلی',
  has_issues = 0
WHERE pashto_word = 'ځان ساتل';

-- ځپل: psp=, ssp=, prp=وځپل, pp=ځاپه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ځپل',
  perfective_root = 'وځپل',
  past_participle = 'ځاپه',
  has_issues = 0
WHERE pashto_word = 'ځپل';

-- ځړول: psp=, ssp=, prp=وځړول, pp=ځړ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ځړول',
  perfective_root = 'وځړول',
  past_participle = 'ځړ کړی',
  has_issues = 0
WHERE pashto_word = 'ځړول';

-- ځلېدل: psp=, ssp=, prp=وځلېدل, pp=ځلېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ځلېدل',
  perfective_root = 'وځلېدل',
  past_participle = 'ځلېدلی',
  has_issues = 0
WHERE pashto_word = 'ځلېدل';

-- ځورول: psp=, ssp=, prp=وځورول, pp=ځور کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ځورول',
  perfective_root = 'وځورول',
  past_participle = 'ځور کړی',
  has_issues = 0
WHERE pashto_word = 'ځورول';

-- چلول: psp=, ssp=, prp=وچلول, pp=چل کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'چلول',
  perfective_root = 'وچلول',
  past_participle = 'چل کړی',
  has_issues = 0
WHERE pashto_word = 'چلول';

-- چیچل: psp=, ssp=, prp=وچیچل, pp=چیچلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'چیچل',
  perfective_root = 'وچیچل',
  past_participle = 'چیچلی',
  has_issues = 0
WHERE pashto_word = 'چیچل';

-- څارل: psp=, ssp=, prp=وڅارل, pp=څاره
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'څارل',
  perfective_root = 'وڅارل',
  past_participle = 'څاره',
  has_issues = 0
WHERE pashto_word = 'څارل';

-- څرګندول: psp=, ssp=, prp=وڅرګندول, pp=څرګند کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'څرګندول',
  perfective_root = 'وڅرګندول',
  past_participle = 'څرګند کړی',
  has_issues = 0
WHERE pashto_word = 'څرګندول';

-- څښل: psp=, ssp=, prp=وڅښل, pp=څښلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'څښل',
  perfective_root = 'وڅښل',
  past_participle = 'څښلی',
  has_issues = 0
WHERE pashto_word = 'څښل';

-- څملاستل: psp=څمل, ssp=وڅمل, prp=وڅملاستل, pp=څملاستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'څملاستل',
  imperfective_stem = 'څمل',
  perfective_stem = 'وڅمل',
  perfective_root = 'وڅملاستل',
  past_participle = 'څملاستلی',
  has_issues = 0
WHERE pashto_word = 'څملاستل';

-- څملول: psp=, ssp=, prp=وڅملول, pp=څمل کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'څملول',
  perfective_root = 'وڅملول',
  past_participle = 'څمل کړی',
  has_issues = 0
WHERE pashto_word = 'څملول';

-- حاصلول: psp=, ssp=, prp=وحاصلول, pp=حاصل کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'حاصلول',
  perfective_root = 'وحاصلول',
  past_participle = 'حاصل کړی',
  has_issues = 0
WHERE pashto_word = 'حاصلول';

-- حکومت کول: psp=, ssp=, prp=وحکومت کول, pp=حکومت  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'حکومت کول',
  perfective_root = 'وحکومت کول',
  past_participle = 'حکومت  کړی',
  has_issues = 0
WHERE pashto_word = 'حکومت کول';

-- حلالول: psp=, ssp=, prp=وحلالول, pp=حلال کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'حلالول',
  perfective_root = 'وحلالول',
  past_participle = 'حلال کړی',
  has_issues = 0
WHERE pashto_word = 'حلالول';

-- حمله کول: psp=, ssp=, prp=وحمله کول, pp=حمله  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'حمله کول',
  perfective_root = 'وحمله کول',
  past_participle = 'حمله  کړی',
  has_issues = 0
WHERE pashto_word = 'حمله کول';

-- خبرول: psp=, ssp=, prp=وخبرول, pp=خبر کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خبرول',
  perfective_root = 'وخبرول',
  past_participle = 'خبر کړی',
  has_issues = 0
WHERE pashto_word = 'خبرول';

-- خبرې کول: psp=, ssp=, prp=وخبرې کول, pp=خبرې  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خبرې کول',
  perfective_root = 'وخبرې کول',
  past_participle = 'خبرې  کړی',
  has_issues = 0
WHERE pashto_word = 'خبرې کول';

-- ختل: psp=خېژ, ssp=وخېژ, prp=وختل, pp=خوت
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ختل',
  imperfective_stem = 'خېژ',
  perfective_stem = 'وخېژ',
  perfective_root = 'وختل',
  past_participle = 'خوت',
  has_issues = 0
WHERE pashto_word = 'ختل';

-- ختمول: psp=, ssp=, prp=وختمول, pp=ختم کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ختمول',
  perfective_root = 'وختمول',
  past_participle = 'ختم کړی',
  has_issues = 0
WHERE pashto_word = 'ختمول';

-- ختمېدل: psp=, ssp=, prp=وختمېدل, pp=ختمېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ختمېدل',
  perfective_root = 'وختمېدل',
  past_participle = 'ختمېدلی',
  has_issues = 0
WHERE pashto_word = 'ختمېدل';

-- خدمت کول: psp=, ssp=, prp=وخدمت کول, pp=خدمت  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خدمت کول',
  perfective_root = 'وخدمت کول',
  past_participle = 'خدمت  کړی',
  has_issues = 0
WHERE pashto_word = 'خدمت کول';

-- خرڅول: psp=, ssp=, prp=وخرڅول, pp=خرڅ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خرڅول',
  perfective_root = 'وخرڅول',
  past_participle = 'خرڅ کړی',
  has_issues = 0
WHERE pashto_word = 'خرڅول';

-- خلاصېدل: psp=, ssp=, prp=وخلاصېدل, pp=خلاصېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خلاصېدل',
  perfective_root = 'وخلاصېدل',
  past_participle = 'خلاصېدلی',
  has_issues = 0
WHERE pashto_word = 'خلاصېدل';

-- خندل: psp=خاند, ssp=وخاند, prp=وخندل, pp=خندلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خندل',
  imperfective_stem = 'خاند',
  perfective_stem = 'وخاند',
  perfective_root = 'وخندل',
  past_participle = 'خندلی',
  has_issues = 0
WHERE pashto_word = 'خندل';

-- خوځول: psp=, ssp=, prp=وخوځول, pp=خوځ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوځول',
  perfective_root = 'وخوځول',
  past_participle = 'خوځ کړی',
  has_issues = 0
WHERE pashto_word = 'خوځول';

-- خوځېدل: psp=, ssp=, prp=وخوځېدل, pp=خوځېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوځېدل',
  perfective_root = 'وخوځېدل',
  past_participle = 'خوځېدلی',
  has_issues = 0
WHERE pashto_word = 'خوځېدل';

-- خوړل: psp=خور, ssp=وخور, prp=وخوړل, pp=خوړ
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوړل',
  imperfective_stem = 'خور',
  perfective_stem = 'وخور',
  perfective_root = 'وخوړل',
  past_participle = 'خوړ',
  has_issues = 0
WHERE pashto_word = 'خوړل';

-- خوشحالول: psp=, ssp=, prp=وخوشحالول, pp=خوشحال کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوشحالول',
  perfective_root = 'وخوشحالول',
  past_participle = 'خوشحال کړی',
  has_issues = 0
WHERE pashto_word = 'خوشحالول';

-- خوشحالېدل: psp=, ssp=, prp=وخوشحالېدل, pp=خوشحالېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوشحالېدل',
  perfective_root = 'وخوشحالېدل',
  past_participle = 'خوشحالېدلی',
  has_issues = 0
WHERE pashto_word = 'خوشحالېدل';

-- خوښېدل: psp=, ssp=, prp=وخوښېدل, pp=خوښېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'خوښېدل',
  perfective_root = 'وخوښېدل',
  past_participle = 'خوښېدلی',
  has_issues = 0
WHERE pashto_word = 'خوښېدل';

-- داخلېدل: psp=, ssp=, prp=وداخلېدل, pp=داخلېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'داخلېدل',
  perfective_root = 'وداخلېدل',
  past_participle = 'داخلېدلی',
  has_issues = 0
WHERE pashto_word = 'داخلېدل';

-- درکول: psp=, ssp=, prp=ودرکول, pp=در کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'درکول',
  perfective_root = 'ودرکول',
  past_participle = 'در کړی',
  has_issues = 0
WHERE pashto_word = 'درکول';

-- درلودل: psp=لر, ssp=ولر, prp=ودرلودل, pp=درلودلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'درلودل',
  imperfective_stem = 'لر',
  perfective_stem = 'ولر',
  perfective_root = 'ودرلودل',
  past_participle = 'درلودلی',
  has_issues = 0
WHERE pashto_word = 'درلودل';

-- درول: psp=, ssp=, prp=ودرول, pp=در کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'درول',
  perfective_root = 'ودرول',
  past_participle = 'در کړی',
  has_issues = 0
WHERE pashto_word = 'درول';

-- درېدل: psp=, ssp=, prp=ودرېدل, pp=درېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'درېدل',
  perfective_root = 'ودرېدل',
  past_participle = 'درېدلی',
  has_issues = 0
WHERE pashto_word = 'درېدل';

-- راتلل: psp=راځ, ssp=راش, prp=راغلل, pp=راغی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راتلل',
  imperfective_stem = 'راځ',
  perfective_stem = 'راش',
  perfective_root = 'راغلل',
  past_participle = 'راغی',
  has_issues = 0
WHERE pashto_word = 'راتلل';

-- راټولول: psp=, ssp=, prp=وراټولول, pp=راټول کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راټولول',
  perfective_root = 'وراټولول',
  past_participle = 'راټول کړی',
  has_issues = 0
WHERE pashto_word = 'راټولول';

-- راټولېدل: psp=, ssp=, prp=وراټولېدل, pp=راټولېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راټولېدل',
  perfective_root = 'وراټولېدل',
  past_participle = 'راټولېدلی',
  has_issues = 0
WHERE pashto_word = 'راټولېدل';

-- راستنېدل: psp=, ssp=, prp=وراستنېدل, pp=راستنېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راستنېدل',
  perfective_root = 'وراستنېدل',
  past_participle = 'راستنېدلی',
  has_issues = 0
WHERE pashto_word = 'راستنېدل';

-- راکول: psp=, ssp=, prp=وراکول, pp=را کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راکول',
  perfective_root = 'وراکول',
  past_participle = 'را کړی',
  has_issues = 0
WHERE pashto_word = 'راکول';

-- راوتل: psp=راوځ, ssp=راووځ, prp=راووتل, pp=راوتلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راوتل',
  imperfective_stem = 'راوځ',
  perfective_stem = 'راووځ',
  perfective_root = 'راووتل',
  past_participle = 'راوتلی',
  has_issues = 0
WHERE pashto_word = 'راوتل';

-- راوړل: psp=, ssp=, prp=وراوړل, pp=راووړ
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راوړل',
  perfective_root = 'وراوړل',
  past_participle = 'راووړ',
  has_issues = 0
WHERE pashto_word = 'راوړل';

-- راوستل: psp=راول, ssp=وراول, prp=وراوستل, pp=راوستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'راوستل',
  imperfective_stem = 'راول',
  perfective_stem = 'وراول',
  perfective_root = 'وراوستل',
  past_participle = 'راوستلی',
  has_issues = 0
WHERE pashto_word = 'راوستل';

-- رټل: psp=, ssp=, prp=ورټل, pp=راټه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'رټل',
  perfective_root = 'ورټل',
  past_participle = 'راټه',
  has_issues = 0
WHERE pashto_word = 'رټل';

-- رد کېدل: psp=, ssp=, prp=ورد کېدل, pp=رد کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'رد کېدل',
  perfective_root = 'ورد کېدل',
  past_participle = 'رد کېدلی',
  has_issues = 0
WHERE pashto_word = 'رد کېدل';

-- رسول: psp=, ssp=, prp=ورسول, pp=رس کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'رسول',
  perfective_root = 'ورسول',
  past_participle = 'رس کړی',
  has_issues = 0
WHERE pashto_word = 'رسول';

-- رسېدل: psp=, ssp=, prp=ورسېدل, pp=رسېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'رسېدل',
  perfective_root = 'ورسېدل',
  past_participle = 'رسېدلی',
  has_issues = 0
WHERE pashto_word = 'رسېدل';

-- روزل: psp=, ssp=, prp=وروزل, pp=روزلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'روزل',
  perfective_root = 'وروزل',
  past_participle = 'روزلی',
  has_issues = 0
WHERE pashto_word = 'روزل';

-- روغول: psp=, ssp=, prp=وروغول, pp=روغ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'روغول',
  perfective_root = 'وروغول',
  past_participle = 'روغ کړی',
  has_issues = 0
WHERE pashto_word = 'روغول';

-- رېبل: psp=, ssp=, prp=ورېبل, pp=رېبلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'رېبل',
  perfective_root = 'ورېبل',
  past_participle = 'رېبلی',
  has_issues = 0
WHERE pashto_word = 'رېبل';

-- زغمل: psp=, ssp=, prp=وزغمل, pp=زغامه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'زغمل',
  perfective_root = 'وزغمل',
  past_participle = 'زغامه',
  has_issues = 0
WHERE pashto_word = 'زغمل';

-- زورول: psp=, ssp=, prp=وزورول, pp=زور کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'زورول',
  perfective_root = 'وزورول',
  past_participle = 'زور کړی',
  has_issues = 0
WHERE pashto_word = 'زورول';

-- زېږول: psp=, ssp=, prp=وزېږول, pp=زېږ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'زېږول',
  perfective_root = 'وزېږول',
  past_participle = 'زېږ کړی',
  has_issues = 0
WHERE pashto_word = 'زېږول';

-- زېږېدل: psp=, ssp=, prp=وزېږېدل, pp=زېږېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'زېږېدل',
  perfective_root = 'وزېږېدل',
  past_participle = 'زېږېدلی',
  has_issues = 0
WHERE pashto_word = 'زېږېدل';

-- ژړل: psp=ژاړ, ssp=وژاړ, prp=وژړل, pp=ژړلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ژړل',
  imperfective_stem = 'ژاړ',
  perfective_stem = 'وژاړ',
  perfective_root = 'وژړل',
  past_participle = 'ژړلی',
  has_issues = 0
WHERE pashto_word = 'ژړل';

-- ژغورل: psp=, ssp=, prp=وژغورل, pp=ژغورلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ژغورل',
  perfective_root = 'وژغورل',
  past_participle = 'ژغورلی',
  has_issues = 0
WHERE pashto_word = 'ژغورل';

-- ساتل: psp=, ssp=, prp=وساتل, pp=ساتلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ساتل',
  perfective_root = 'وساتل',
  past_participle = 'ساتلی',
  has_issues = 0
WHERE pashto_word = 'ساتل';

-- سپارل: psp=, ssp=, prp=وسپارل, pp=سپارلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سپارل',
  perfective_root = 'وسپارل',
  past_participle = 'سپارلی',
  has_issues = 0
WHERE pashto_word = 'سپارل';

-- سږکال: psp=, ssp=, prp=وسږکال, pp=سږکالی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سږکال',
  perfective_root = 'وسږکال',
  past_participle = 'سږکالی',
  has_issues = 0
WHERE pashto_word = 'سږکال';

-- سنت کېدل: psp=, ssp=, prp=وسنت کېدل, pp=سنت کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سنت کېدل',
  perfective_root = 'وسنت کېدل',
  past_participle = 'سنت کېدلی',
  has_issues = 0
WHERE pashto_word = 'سنت کېدل';

-- سنتول: psp=, ssp=, prp=وسنتول, pp=سنت کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سنتول',
  perfective_root = 'وسنتول',
  past_participle = 'سنت کړی',
  has_issues = 0
WHERE pashto_word = 'سنتول';

-- سنتېدل: psp=, ssp=, prp=وسنتېدل, pp=سنتېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سنتېدل',
  perfective_root = 'وسنتېدل',
  past_participle = 'سنتېدلی',
  has_issues = 0
WHERE pashto_word = 'سنتېدل';

-- سنګسارول: psp=, ssp=, prp=وسنګسارول, pp=سنګسار کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سنګسارول',
  perfective_root = 'وسنګسارول',
  past_participle = 'سنګسار کړی',
  has_issues = 0
WHERE pashto_word = 'سنګسارول';

-- سوځول: psp=, ssp=, prp=وسوځول, pp=سوځ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سوځول',
  perfective_root = 'وسوځول',
  past_participle = 'سوځ کړی',
  has_issues = 0
WHERE pashto_word = 'سوځول';

-- سوځېدل: psp=, ssp=, prp=وسوځېدل, pp=سوځېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سوځېدل',
  perfective_root = 'وسوځېدل',
  past_participle = 'سوځېدلی',
  has_issues = 0
WHERE pashto_word = 'سوځېدل';

-- سوزول: psp=, ssp=, prp=وسوزول, pp=سوز کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'سوزول',
  perfective_root = 'وسوزول',
  past_participle = 'سوز کړی',
  has_issues = 0
WHERE pashto_word = 'سوزول';

-- شرمېدل: psp=, ssp=, prp=وشرمېدل, pp=شرمېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'شرمېدل',
  perfective_root = 'وشرمېدل',
  past_participle = 'شرمېدلی',
  has_issues = 0
WHERE pashto_word = 'شرمېدل';

-- شړل: psp=, ssp=, prp=وشړل, pp=شاړه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'شړل',
  perfective_root = 'وشړل',
  past_participle = 'شاړه',
  has_issues = 0
WHERE pashto_word = 'شړل';

-- شمېرل: psp=, ssp=, prp=وشمېرل, pp=شمېرلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'شمېرل',
  perfective_root = 'وشمېرل',
  past_participle = 'شمېرلی',
  has_issues = 0
WHERE pashto_word = 'شمېرل';

-- شڼېدل: psp=, ssp=, prp=وشڼېدل, pp=شڼېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'شڼېدل',
  perfective_root = 'وشڼېدل',
  past_participle = 'شڼېدلی',
  has_issues = 0
WHERE pashto_word = 'شڼېدل';

-- ښخول: psp=, ssp=, prp=وښخول, pp=ښخ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښخول',
  perfective_root = 'وښخول',
  past_participle = 'ښخ کړی',
  has_issues = 0
WHERE pashto_word = 'ښخول';

-- ښخېدل: psp=, ssp=, prp=وښخېدل, pp=ښخېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښخېدل',
  perfective_root = 'وښخېدل',
  past_participle = 'ښخېدلی',
  has_issues = 0
WHERE pashto_word = 'ښخېدل';

-- ښکاره کول: psp=, ssp=, prp=وښکاره کول, pp=ښکاره  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښکاره کول',
  perfective_root = 'وښکاره کول',
  past_participle = 'ښکاره  کړی',
  has_issues = 0
WHERE pashto_word = 'ښکاره کول';

-- ښکاره کېدل: psp=, ssp=, prp=وښکاره کېدل, pp=ښکاره کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښکاره کېدل',
  perfective_root = 'وښکاره کېدل',
  past_participle = 'ښکاره کېدلی',
  has_issues = 0
WHERE pashto_word = 'ښکاره کېدل';

-- ښکارېدل: psp=, ssp=, prp=وښکارېدل, pp=ښکارېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښکارېدل',
  perfective_root = 'وښکارېدل',
  past_participle = 'ښکارېدلی',
  has_issues = 0
WHERE pashto_word = 'ښکارېدل';

-- ښکل: psp=, ssp=, prp=وښکل, pp=ښکلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښکل',
  perfective_root = 'وښکل',
  past_participle = 'ښکلی',
  has_issues = 0
WHERE pashto_word = 'ښکل';

-- ښکلول: psp=, ssp=, prp=وښکلول, pp=ښکل کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښکلول',
  perfective_root = 'وښکلول',
  past_participle = 'ښکل کړی',
  has_issues = 0
WHERE pashto_word = 'ښکلول';

-- ښودل: psp=ښای, ssp=وښای, prp=وښودل, pp=ښودلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښودل',
  imperfective_stem = 'ښای',
  perfective_stem = 'وښای',
  perfective_root = 'وښودل',
  past_participle = 'ښودلی',
  has_issues = 0
WHERE pashto_word = 'ښودل';

-- ښېګړه کول: psp=, ssp=, prp=وښېګړه کول, pp=ښېګړه  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ښېګړه کول',
  perfective_root = 'وښېګړه کول',
  past_participle = 'ښېګړه  کړی',
  has_issues = 0
WHERE pashto_word = 'ښېګړه کول';

-- صبر کول: psp=, ssp=, prp=وصبر کول, pp=صبر  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'صبر کول',
  perfective_root = 'وصبر کول',
  past_participle = 'صبر  کړی',
  has_issues = 0
WHERE pashto_word = 'صبر کول';

-- عبادت کول: psp=, ssp=, prp=وعبادت کول, pp=عبادت  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'عبادت کول',
  perfective_root = 'وعبادت کول',
  past_participle = 'عبادت  کړی',
  has_issues = 0
WHERE pashto_word = 'عبادت کول';

-- عزت کول: psp=, ssp=, prp=وعزت کول, pp=عزت  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'عزت کول',
  perfective_root = 'وعزت کول',
  past_participle = 'عزت  کړی',
  has_issues = 0
WHERE pashto_word = 'عزت کول';

-- عمل کول: psp=, ssp=, prp=وعمل کول, pp=عمل  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'عمل کول',
  perfective_root = 'وعمل کول',
  past_participle = 'عمل  کړی',
  has_issues = 0
WHERE pashto_word = 'عمل کول';

-- غږول: psp=, ssp=, prp=وغږول, pp=غږ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غږول',
  perfective_root = 'وغږول',
  past_participle = 'غږ کړی',
  has_issues = 0
WHERE pashto_word = 'غږول';

-- غوڅول: psp=, ssp=, prp=وغوڅول, pp=غوڅ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غوڅول',
  perfective_root = 'وغوڅول',
  past_participle = 'غوڅ کړی',
  has_issues = 0
WHERE pashto_word = 'غوڅول';

-- غورځول: psp=, ssp=, prp=وغورځول, pp=غورځ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غورځول',
  perfective_root = 'وغورځول',
  past_participle = 'غورځ کړی',
  has_issues = 0
WHERE pashto_word = 'غورځول';

-- غورزول: psp=, ssp=, prp=وغورزول, pp=غورز کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غورزول',
  perfective_root = 'وغورزول',
  past_participle = 'غورز کړی',
  has_issues = 0
WHERE pashto_word = 'غورزول';

-- غوره کول: psp=, ssp=, prp=وغوره کول, pp=غوره  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غوره کول',
  perfective_root = 'وغوره کول',
  past_participle = 'غوره  کړی',
  has_issues = 0
WHERE pashto_word = 'غوره کول';

-- غورېدل: psp=, ssp=, prp=وغورېدل, pp=غورېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غورېدل',
  perfective_root = 'وغورېدل',
  past_participle = 'غورېدلی',
  has_issues = 0
WHERE pashto_word = 'غورېدل';

-- غوړول: psp=, ssp=, prp=وغوړول, pp=غوړ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غوړول',
  perfective_root = 'وغوړول',
  past_participle = 'غوړ کړی',
  has_issues = 0
WHERE pashto_word = 'غوړول';

-- غوښتل: psp=غواړ, ssp=وغواړ, prp=وغوښتل, pp=غوښتلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'غوښتل',
  imperfective_stem = 'غواړ',
  perfective_stem = 'وغواړ',
  perfective_root = 'وغوښتل',
  past_participle = 'غوښتلی',
  has_issues = 0
WHERE pashto_word = 'غوښتل';

-- قبضه کول: psp=, ssp=, prp=وقبضه کول, pp=قبضه  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'قبضه کول',
  perfective_root = 'وقبضه کول',
  past_participle = 'قبضه  کړی',
  has_issues = 0
WHERE pashto_word = 'قبضه کول';

-- قتلول: psp=, ssp=, prp=وقتلول, pp=قتل کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'قتلول',
  perfective_root = 'وقتلول',
  past_participle = 'قتل کړی',
  has_issues = 0
WHERE pashto_word = 'قتلول';

-- کار کول: psp=, ssp=, prp=وکار کول, pp=کار  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کار کول',
  perfective_root = 'وکار کول',
  past_participle = 'کار  کړی',
  has_issues = 0
WHERE pashto_word = 'کار کول';

-- کارول: psp=, ssp=, prp=وکارول, pp=کار کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کارول',
  perfective_root = 'وکارول',
  past_participle = 'کار کړی',
  has_issues = 0
WHERE pashto_word = 'کارول';

-- کتل: psp=ګور, ssp=وګور, prp=وکتل, pp=کوت,کاته
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کتل',
  imperfective_stem = 'ګور',
  perfective_stem = 'وګور',
  perfective_root = 'وکتل',
  past_participle = 'کوت,کاته',
  has_issues = 0
WHERE pashto_word = 'کتل';

-- کرل: psp=, ssp=, prp=وکرل, pp=کاره
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کرل',
  perfective_root = 'وکرل',
  past_participle = 'کاره',
  has_issues = 0
WHERE pashto_word = 'کرل';

-- کښېناستل: psp=کښېن, ssp=وکښېن, prp=وکښېناستل, pp=کښېناستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کښېناستل',
  imperfective_stem = 'کښېن',
  perfective_stem = 'وکښېن',
  perfective_root = 'وکښېناستل',
  past_participle = 'کښېناستلی',
  has_issues = 0
WHERE pashto_word = 'کښېناستل';

-- کښېنول: psp=, ssp=, prp=وکښېنول, pp=کښېن کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کښېنول',
  perfective_root = 'وکښېنول',
  past_participle = 'کښېن کړی',
  has_issues = 0
WHERE pashto_word = 'کښېنول';

-- کل: psp=, ssp=, prp=وکل, pp=کلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کل',
  perfective_root = 'وکل',
  past_participle = 'کلی',
  has_issues = 0
WHERE pashto_word = 'کل';

-- کنځل: psp=, ssp=, prp=وکنځل, pp=کنځلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کنځل',
  perfective_root = 'وکنځل',
  past_participle = 'کنځلی',
  has_issues = 0
WHERE pashto_word = 'کنځل';

-- کول: psp=, ssp=وکړ, prp=وکړل, pp= کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کول',
  perfective_stem = 'وکړ',
  perfective_root = 'وکړل',
  past_participle = ' کړی',
  has_issues = 0
WHERE pashto_word = 'کول';

-- کېدل: psp=, ssp=وش, prp=وشول, pp=کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کېدل',
  perfective_stem = 'وش',
  perfective_root = 'وشول',
  past_participle = 'کېدلی',
  has_issues = 0
WHERE pashto_word = 'کېدل';

-- کېښودل: psp=ږد, ssp=کېږد, prp=وکېښودل, pp=کېښودلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کېښودل',
  imperfective_stem = 'ږد',
  perfective_stem = 'کېږد',
  perfective_root = 'وکېښودل',
  past_participle = 'کېښودلی',
  has_issues = 0
WHERE pashto_word = 'کېښودل';

-- کیندل: psp=, ssp=, prp=وکیندل, pp=کیندلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'کیندل',
  perfective_root = 'وکیندل',
  past_participle = 'کیندلی',
  has_issues = 0
WHERE pashto_word = 'کیندل';

-- ګټل: psp=, ssp=, prp=وګټل, pp=ګاټه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګټل',
  perfective_root = 'وګټل',
  past_participle = 'ګاټه',
  has_issues = 0
WHERE pashto_word = 'ګټل';

-- ګډېدل: psp=, ssp=, prp=وګډېدل, pp=ګډېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګډېدل',
  perfective_root = 'وګډېدل',
  past_participle = 'ګډېدلی',
  has_issues = 0
WHERE pashto_word = 'ګډېدل';

-- ګرځول: psp=, ssp=, prp=وګرځول, pp=ګرځ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګرځول',
  perfective_root = 'وګرځول',
  past_participle = 'ګرځ کړی',
  has_issues = 0
WHERE pashto_word = 'ګرځول';

-- ګرځېدل: psp=, ssp=, prp=وګرځېدل, pp=ګرځېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګرځېدل',
  perfective_root = 'وګرځېدل',
  past_participle = 'ګرځېدلی',
  has_issues = 0
WHERE pashto_word = 'ګرځېدل';

-- ګنډل: psp=, ssp=, prp=وګنډل, pp=ګانډه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګنډل',
  perfective_root = 'وګنډل',
  past_participle = 'ګانډه',
  has_issues = 0
WHERE pashto_word = 'ګنډل';

-- ګڼل: psp=, ssp=, prp=وګڼل, pp=ګاڼه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ګڼل',
  perfective_root = 'وګڼل',
  past_participle = 'ګاڼه',
  has_issues = 0
WHERE pashto_word = 'ګڼل';

-- لامبل: psp=, ssp=, prp=ولامبل, pp=لامبلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لامبل',
  perfective_root = 'ولامبل',
  past_participle = 'لامبلی',
  has_issues = 0
WHERE pashto_word = 'لامبل';

-- لټول: psp=, ssp=, prp=ولټول, pp=لټ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لټول',
  perfective_root = 'ولټول',
  past_participle = 'لټ کړی',
  has_issues = 0
WHERE pashto_word = 'لټول';

-- لرل: psp=, ssp=, prp=ولرل, pp=لاره
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لرل',
  perfective_root = 'ولرل',
  past_participle = 'لاره',
  has_issues = 0
WHERE pashto_word = 'لرل';

-- لړزېدل: psp=, ssp=, prp=ولړزېدل, pp=لړزېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لړزېدل',
  perfective_root = 'ولړزېدل',
  past_participle = 'لړزېدلی',
  has_issues = 0
WHERE pashto_word = 'لړزېدل';

-- لګول: psp=, ssp=, prp=ولګول, pp=لګ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لګول',
  perfective_root = 'ولګول',
  past_participle = 'لګ کړی',
  has_issues = 0
WHERE pashto_word = 'لګول';

-- لګېدل: psp=, ssp=, prp=ولګېدل, pp=لګېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لګېدل',
  perfective_root = 'ولګېدل',
  past_participle = 'لګېدلی',
  has_issues = 0
WHERE pashto_word = 'لګېدل';

-- لمانځل: psp=, ssp=, prp=ولمانځل, pp=لمانځلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لمانځل',
  perfective_root = 'ولمانځل',
  past_participle = 'لمانځلی',
  has_issues = 0
WHERE pashto_word = 'لمانځل';

-- لوستل: psp=لون, ssp=ولون, prp=ولوستل, pp=لوستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لوستل',
  imperfective_stem = 'لون',
  perfective_stem = 'ولون',
  perfective_root = 'ولوستل',
  past_participle = 'لوستلی',
  has_issues = 0
WHERE pashto_word = 'لوستل';

-- لیدل: psp=وین, ssp=, prp=ولیدل, pp=لید
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لیدل',
  imperfective_stem = 'وین',
  perfective_root = 'ولیدل',
  past_participle = 'لید',
  has_issues = 0
WHERE pashto_word = 'لیدل';

-- لېږدول: psp=, ssp=, prp=ولېږدول, pp=لېږد کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لېږدول',
  perfective_root = 'ولېږدول',
  past_participle = 'لېږد کړی',
  has_issues = 0
WHERE pashto_word = 'لېږدول';

-- لېږل: psp=, ssp=, prp=ولېږل, pp=لېږلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لېږل',
  perfective_root = 'ولېږل',
  past_participle = 'لېږلی',
  has_issues = 0
WHERE pashto_word = 'لېږل';

-- لیکل: psp=, ssp=, prp=ولیکل, pp=لیکلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'لیکل',
  perfective_root = 'ولیکل',
  past_participle = 'لیکلی',
  has_issues = 0
WHERE pashto_word = 'لیکل';

-- ماتول: psp=, ssp=, prp=وماتول, pp=مات کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ماتول',
  perfective_root = 'وماتول',
  past_participle = 'مات کړی',
  has_issues = 0
WHERE pashto_word = 'ماتول';

-- مجبورول: psp=, ssp=, prp=ومجبورول, pp=مجبور کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مجبورول',
  perfective_root = 'ومجبورول',
  past_participle = 'مجبور کړی',
  has_issues = 0
WHERE pashto_word = 'مجبورول';

-- مړ کول: psp=, ssp=, prp=ومړ کول, pp=مړ  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مړ کول',
  perfective_root = 'ومړ کول',
  past_participle = 'مړ  کړی',
  has_issues = 0
WHERE pashto_word = 'مړ کول';

-- مړ کېدل: psp=, ssp=, prp=ومړ کېدل, pp=مړ کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مړ کېدل',
  perfective_root = 'ومړ کېدل',
  past_participle = 'مړ کېدلی',
  has_issues = 0
WHERE pashto_word = 'مړ کېدل';

-- مسلسل: psp=, ssp=, prp=ومسلسل, pp=مسلسلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مسلسل',
  perfective_root = 'ومسلسل',
  past_participle = 'مسلسلی',
  has_issues = 0
WHERE pashto_word = 'مسلسل';

-- مشکل: psp=, ssp=, prp=ومشکل, pp=مشکلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مشکل',
  perfective_root = 'ومشکل',
  past_participle = 'مشکلی',
  has_issues = 0
WHERE pashto_word = 'مشکل';

-- معلومول: psp=, ssp=, prp=ومعلومول, pp=معلوم کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'معلومول',
  perfective_root = 'ومعلومول',
  past_participle = 'معلوم کړی',
  has_issues = 0
WHERE pashto_word = 'معلومول';

-- ملنډې وهل: psp=, ssp=, prp=وملنډې وهل, pp=ملنډې وهلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ملنډې وهل',
  perfective_root = 'وملنډې وهل',
  past_participle = 'ملنډې وهلی',
  has_issues = 0
WHERE pashto_word = 'ملنډې وهل';

-- منډې وهل: psp=, ssp=, prp=ومنډې وهل, pp=منډې وهلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'منډې وهل',
  perfective_root = 'ومنډې وهل',
  past_participle = 'منډې وهلی',
  has_issues = 0
WHERE pashto_word = 'منډې وهل';

-- منع کول: psp=, ssp=, prp=ومنع کول, pp=منع  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'منع کول',
  perfective_root = 'ومنع کول',
  past_participle = 'منع  کړی',
  has_issues = 0
WHERE pashto_word = 'منع کول';

-- منل: psp=, ssp=, prp=ومنل, pp=مانه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'منل',
  perfective_root = 'ومنل',
  past_participle = 'مانه',
  has_issues = 0
WHERE pashto_word = 'منل';

-- موندل: psp=موم, ssp=وموم, prp=وموندل, pp=موند
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'موندل',
  imperfective_stem = 'موم',
  perfective_stem = 'وموم',
  perfective_root = 'وموندل',
  past_participle = 'موند',
  has_issues = 0
WHERE pashto_word = 'موندل';

-- مینه کول: psp=, ssp=, prp=ومینه کول, pp=مینه  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'مینه کول',
  perfective_root = 'ومینه کول',
  past_participle = 'مینه  کړی',
  has_issues = 0
WHERE pashto_word = 'مینه کول';

-- نازلېدل: psp=, ssp=, prp=ونازلېدل, pp=نازلېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'نازلېدل',
  perfective_root = 'ونازلېدل',
  past_participle = 'نازلېدلی',
  has_issues = 0
WHERE pashto_word = 'نازلېدل';

-- نفرت کول: psp=, ssp=, prp=ونفرت کول, pp=نفرت  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'نفرت کول',
  perfective_root = 'ونفرت کول',
  past_participle = 'نفرت  کړی',
  has_issues = 0
WHERE pashto_word = 'نفرت کول';

-- ننوتل: psp=ننوځ, ssp=ننووځ, prp=ننوتل, pp=ننوتلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ننوتل',
  imperfective_stem = 'ننوځ',
  perfective_stem = 'ننووځ',
  perfective_root = 'ننوتل',
  past_participle = 'ننوتلی',
  has_issues = 0
WHERE pashto_word = 'ننوتل';

-- نومېدل: psp=, ssp=, prp=ونومېدل, pp=نومېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'نومېدل',
  perfective_root = 'ونومېدل',
  past_participle = 'نومېدلی',
  has_issues = 0
WHERE pashto_word = 'نومېدل';

-- نیول: psp=نیس, ssp=ونیس, prp=ونیول, pp=نی کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'نیول',
  imperfective_stem = 'نیس',
  perfective_stem = 'ونیس',
  perfective_root = 'ونیول',
  past_participle = 'نی کړی',
  has_issues = 0
WHERE pashto_word = 'نیول';

-- هڅول: psp=, ssp=, prp=وهڅول, pp=هڅ کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'هڅول',
  perfective_root = 'وهڅول',
  past_participle = 'هڅ کړی',
  has_issues = 0
WHERE pashto_word = 'هڅول';

-- واپس کېدل: psp=, ssp=, prp=واپس کېدل, pp=واپس کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'واپس کېدل',
  perfective_root = 'واپس کېدل',
  past_participle = 'واپس کېدلی',
  has_issues = 0
WHERE pashto_word = 'واپس کېدل';

-- وتل: psp=وځ, ssp=, prp=وتل, pp=ووت,واته
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وتل',
  imperfective_stem = 'وځ',
  perfective_root = 'وتل',
  past_participle = 'ووت,واته',
  has_issues = 0
WHERE pashto_word = 'وتل';

-- ودرول: psp=, ssp=, prp=ودرول, pp=ودر کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ودرول',
  perfective_root = 'ودرول',
  past_participle = 'ودر کړی',
  has_issues = 0
WHERE pashto_word = 'ودرول';

-- ورانول: psp=, ssp=, prp=ورانول, pp=وران کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ورانول',
  perfective_root = 'ورانول',
  past_participle = 'وران کړی',
  has_issues = 0
WHERE pashto_word = 'ورانول';

-- ورتلل: psp=ورځ, ssp=ورش, prp=ورغلل, pp=ورغی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ورتلل',
  imperfective_stem = 'ورځ',
  perfective_stem = 'ورش',
  perfective_root = 'ورغلل',
  past_participle = 'ورغی',
  has_issues = 0
WHERE pashto_word = 'ورتلل';

-- ورکول: psp=, ssp=, prp=ورکول, pp=ور کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ورکول',
  perfective_root = 'ورکول',
  past_participle = 'ور کړی',
  has_issues = 0
WHERE pashto_word = 'ورکول';

-- ورېدل: psp=, ssp=, prp=ورېدل, pp=ورېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ورېدل',
  perfective_root = 'ورېدل',
  past_participle = 'ورېدلی',
  has_issues = 0
WHERE pashto_word = 'ورېدل';

-- وړاندې کول: psp=, ssp=, prp=وړاندې کول, pp=وړاندې  کړی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وړاندې کول',
  perfective_root = 'وړاندې کول',
  past_participle = 'وړاندې  کړی',
  has_issues = 0
WHERE pashto_word = 'وړاندې کول';

-- وړل: psp=, ssp=یوس, prp=یوړل, pp=وړلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وړل',
  perfective_stem = 'یوس',
  perfective_root = 'یوړل',
  past_participle = 'وړلی',
  has_issues = 0
WHERE pashto_word = 'وړل';

-- وژل: psp=وژن, ssp=, prp=وژل, pp=واژه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وژل',
  imperfective_stem = 'وژن',
  perfective_root = 'وژل',
  past_participle = 'واژه',
  has_issues = 0
WHERE pashto_word = 'وژل';

-- وهل: psp=, ssp=, prp=وهل, pp=واهه
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وهل',
  perfective_root = 'وهل',
  past_participle = 'واهه',
  has_issues = 0
WHERE pashto_word = 'وهل';

-- وېرېدل: psp=, ssp=, prp=وېرېدل, pp=وېرېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وېرېدل',
  perfective_root = 'وېرېدل',
  past_participle = 'وېرېدلی',
  has_issues = 0
WHERE pashto_word = 'وېرېدل';

-- ویستل: psp=باس, ssp=وباس, prp=ویستل, pp=ویستلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ویستل',
  imperfective_stem = 'باس',
  perfective_stem = 'وباس',
  perfective_root = 'ویستل',
  past_participle = 'ویستلی',
  has_issues = 0
WHERE pashto_word = 'ویستل';

-- وېشل: psp=, ssp=, prp=وېشل, pp=وېشلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'وېشل',
  perfective_root = 'وېشل',
  past_participle = 'وېشلی',
  has_issues = 0
WHERE pashto_word = 'وېشل';

-- ویل: psp=, ssp=, prp=ویل, pp=ویلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'ویل',
  perfective_root = 'ویل',
  past_participle = 'ویلی',
  has_issues = 0
WHERE pashto_word = 'ویل';

-- یادېدل: psp=, ssp=, prp=ویادېدل, pp=یادېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'یادېدل',
  perfective_root = 'ویادېدل',
  past_participle = 'یادېدلی',
  has_issues = 0
WHERE pashto_word = 'یادېدل';

-- یوځای کېدل: psp=, ssp=, prp=ویوځای کېدل, pp=یوځای کېدلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'یوځای کېدل',
  perfective_root = 'ویوځای کېدل',
  past_participle = 'یوځای کېدلی',
  has_issues = 0
WHERE pashto_word = 'یوځای کېدل';

-- یوځل: psp=, ssp=, prp=ویوځل, pp=یوځلی
UPDATE word_frequencies SET
  word_type = 'verb',
  base_verb = 'یوځل',
  perfective_root = 'ویوځل',
  past_participle = 'یوځلی',
  has_issues = 0
WHERE pashto_word = 'یوځل';


-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_verb ON word_frequencies (base_verb);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_imperfective_stem ON word_frequencies (imperfective_stem);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_perfective_stem ON word_frequencies (perfective_stem);