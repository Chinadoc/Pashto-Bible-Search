-- Link split-head perfective verbs to their base verbs
-- Based on: https://grammar.lingdocs.com/verbs/roots-and-stems/
-- Includes:
--   1. Perfective verbs (dynamic) with minipronouns/particles in split head
--   2. Stative compound perfective forms (complement splits off in perfective)
--      Examples: "ستړی شول" -> "ستړی کېدل", "کرم کړل" -> "کرم کول"

-- جوړ کړل -> base: جوړ کول (perfective: جوړ کول)

UPDATE word_frequencies
SET base_verb = 'جوړ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 13656;


-- شان کړل -> base: شان کول (perfective: شان کول)

UPDATE word_frequencies
SET base_verb = 'شان کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 11408;


-- مقرر کړل -> base: مقرر کول (perfective: مقرر کول)

UPDATE word_frequencies
SET base_verb = 'مقرر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 15183;


-- کارونه کړل -> base: کارونه کول (perfective: کارونه کول)

UPDATE word_frequencies
SET base_verb = 'کارونه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 11412;


-- راټول کړل -> base: راټول کول (perfective: راټول کول)

UPDATE word_frequencies
SET base_verb = 'راټول کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 15888;


-- څۀ کړل -> base: څۀ کول (perfective: څۀ کول)

UPDATE word_frequencies
SET base_verb = 'څۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 11413;


-- راغونډ کړل -> base: راغونډ کول (perfective: راغونډ کول)

UPDATE word_frequencies
SET base_verb = 'راغونډ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 16393;


-- داسې کړل -> base: داسې کول (perfective: داسې کول)

UPDATE word_frequencies
SET base_verb = 'داسې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 11417;


-- مجبور کړل -> base: مجبور کول (perfective: مجبور کول)

UPDATE word_frequencies
SET base_verb = 'مجبور کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 16778;


-- غوره کړل -> base: غوره کول (perfective: غوره کول)

UPDATE word_frequencies
SET base_verb = 'غوره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 17124;


-- تباه کړل -> base: تباه کول (perfective: تباه کول)

UPDATE word_frequencies
SET base_verb = 'تباه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 17205;


-- شروع کړل -> base: شروع کول (perfective: شروع کول)

UPDATE word_frequencies
SET base_verb = 'شروع کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 17288;


-- مات کړل -> base: مات کول (perfective: مات کول)

UPDATE word_frequencies
SET base_verb = 'مات کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19049;


-- يې کړل -> base: يې کول (perfective: يې کول)

UPDATE word_frequencies
SET base_verb = 'يې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19073;


-- خوښ کړل -> base: خوښ کول (perfective: خوښ کول)

UPDATE word_frequencies
SET base_verb = 'خوښ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19578;


-- حواله کړل -> base: حواله کول (perfective: حواله کول)

UPDATE word_frequencies
SET base_verb = 'حواله کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19609;


-- روان کړل -> base: روان کول (perfective: روان کول)

UPDATE word_frequencies
SET base_verb = 'روان کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19612;


-- خلاص کړل -> base: خلاص کول (perfective: خلاص کول)

UPDATE word_frequencies
SET base_verb = 'خلاص کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19839;


-- سره کړل -> base: سره کول (perfective: سره کول)

UPDATE word_frequencies
SET base_verb = 'سره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 19913;


-- حلال کړل -> base: حلال کول (perfective: حلال کول)

UPDATE word_frequencies
SET base_verb = 'حلال کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 20449;


-- نۀ کړل -> base: نۀ کول (perfective: نۀ کول)

UPDATE word_frequencies
SET base_verb = 'نۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 20677;


-- خبر کړل -> base: خبر کول (perfective: خبر کول)

UPDATE word_frequencies
SET base_verb = 'خبر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 20812;


-- پرې کړل -> base: پرې کول (perfective: پرې کول)

UPDATE word_frequencies
SET base_verb = 'پرې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 20878;


-- پېدا کړل -> base: پېدا کول (perfective: پېدا کول)

UPDATE word_frequencies
SET base_verb = 'پېدا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 21389;


-- پېش کړل -> base: پېش کول (perfective: پېش کول)

UPDATE word_frequencies
SET base_verb = 'پېش کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22037;


-- لرې کړل -> base: لرې کول (perfective: لرې کول)

UPDATE word_frequencies
SET base_verb = 'لرې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22199;


-- قبضه کړل -> base: قبضه کول (perfective: قبضه کول)

UPDATE word_frequencies
SET base_verb = 'قبضه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22308;


-- تیار کړل -> base: تیار کول (perfective: تیار کول)

UPDATE word_frequencies
SET base_verb = 'تیار کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27091;


-- پیدا کړل -> base: پیدا کول (perfective: پیدا کول)

UPDATE word_frequencies
SET base_verb = 'پیدا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22425;


-- روغ کړل -> base: روغ کول (perfective: روغ کول)

UPDATE word_frequencies
SET base_verb = 'روغ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22635;


-- مړه کړل -> base: مړه کول (perfective: مړه کول)

UPDATE word_frequencies
SET base_verb = 'مړه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22739;


-- وران کړل -> base: وران کول (perfective: وران کول)

UPDATE word_frequencies
SET base_verb = 'وران کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22758;


-- اوچت کړل -> base: اوچت کول (perfective: اوچت کول)

UPDATE word_frequencies
SET base_verb = 'اوچت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 22798;


-- خرڅ کړل -> base: خرڅ کول (perfective: خرڅ کول)

UPDATE word_frequencies
SET base_verb = 'خرڅ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23096;


-- ونۀ کړل -> base: ونۀ کول (perfective: ونۀ کول)

UPDATE word_frequencies
SET base_verb = 'ونۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23289;


-- بیان کړل -> base: بیان کول (perfective: بیان کول)

UPDATE word_frequencies
SET base_verb = 'بیان کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27095;


-- لاندې کړل -> base: لاندې کول (perfective: لاندې کول)

UPDATE word_frequencies
SET base_verb = 'لاندې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23462;


-- نه کړل -> base: نه کول (perfective: نه کول)

UPDATE word_frequencies
SET base_verb = 'نه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23572;


-- هېر کړل -> base: هېر کول (perfective: هېر کول)

UPDATE word_frequencies
SET base_verb = 'هېر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23774;


-- ټوټې کړل -> base: ټوټې کول (perfective: ټوټې کول)

UPDATE word_frequencies
SET base_verb = 'ټوټې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23846;


-- لېرې کړل -> base: لېرې کول (perfective: لېرې کول)

UPDATE word_frequencies
SET base_verb = 'لېرې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23855;


-- پاک کړل -> base: پاک کول (perfective: پاک کول)

UPDATE word_frequencies
SET base_verb = 'پاک کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23856;


-- وقف کړل -> base: وقف کول (perfective: وقف کول)

UPDATE word_frequencies
SET base_verb = 'وقف کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23870;


-- نازل کړل -> base: نازل کول (perfective: نازل کول)

UPDATE word_frequencies
SET base_verb = 'نازل کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 23997;


-- رد کړل -> base: رد کول (perfective: رد کول)

UPDATE word_frequencies
SET base_verb = 'رد کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24180;


-- سخت کړل -> base: سخت کول (perfective: سخت کول)

UPDATE word_frequencies
SET base_verb = 'سخت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24245;


-- تقسيم کړل -> base: تقسيم کول (perfective: تقسيم کول)

UPDATE word_frequencies
SET base_verb = 'تقسيم کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24458;


-- تاو کړل -> base: تاو کول (perfective: تاو کول)

UPDATE word_frequencies
SET base_verb = 'تاو کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24498;


-- بچ کړل -> base: بچ کول (perfective: بچ کول)

UPDATE word_frequencies
SET base_verb = 'بچ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24517;


-- ثابت کړل -> base: ثابت کول (perfective: ثابت کول)

UPDATE word_frequencies
SET base_verb = 'ثابت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 24828;


-- ختم کړل -> base: ختم کول (perfective: ختم کول)

UPDATE word_frequencies
SET base_verb = 'ختم کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 25497;


-- له کړل -> base: له کول (perfective: له کول)

UPDATE word_frequencies
SET base_verb = 'له کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 25894;


-- رُخصت کړل -> base: رُخصت کول (perfective: رُخصت کول)

UPDATE word_frequencies
SET base_verb = 'رُخصت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 26197;


-- منع کړل -> base: منع کول (perfective: منع کول)

UPDATE word_frequencies
SET base_verb = 'منع کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 26567;


-- زده کړل -> base: زده کول (perfective: زده کول)

UPDATE word_frequencies
SET base_verb = 'زده کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 26727;


-- بند کړل -> base: بند کول (perfective: بند کول)

UPDATE word_frequencies
SET base_verb = 'بند کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 26793;


-- پورته کړل -> base: پورته کول (perfective: پورته کول)

UPDATE word_frequencies
SET base_verb = 'پورته کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27098;


-- ملامته کړل -> base: ملامته کول (perfective: ملامته کول)

UPDATE word_frequencies
SET base_verb = 'ملامته کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27192;


-- ورنه کړل -> base: ورنه کول (perfective: ورنه کول)

UPDATE word_frequencies
SET base_verb = 'ورنه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27331;


-- قرباني کړل -> base: قرباني کول (perfective: قرباني کول)

UPDATE word_frequencies
SET base_verb = 'قرباني کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27384;


-- خپاره کړل -> base: خپاره کول (perfective: خپاره کول)

UPDATE word_frequencies
SET base_verb = 'خپاره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 27722;


-- ډک کړل -> base: ډک کول (perfective: ډک کول)

UPDATE word_frequencies
SET base_verb = 'ډک کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28042;


-- وارۀ کړل -> base: وارۀ کول (perfective: وارۀ کول)

UPDATE word_frequencies
SET base_verb = 'وارۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28326;


-- معاف کړل -> base: معاف کول (perfective: معاف کول)

UPDATE word_frequencies
SET base_verb = 'معاف کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28434;


-- پوره کړل -> base: پوره کول (perfective: پوره کول)

UPDATE word_frequencies
SET base_verb = 'پوره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28545;


-- رابهر کړل -> base: رابهر کول (perfective: رابهر کول)

UPDATE word_frequencies
SET base_verb = 'رابهر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28623;


-- ښخ کړل -> base: ښخ کول (perfective: ښخ کول)

UPDATE word_frequencies
SET base_verb = 'ښخ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 28744;


-- ځوړند کړل -> base: ځوړند کول (perfective: ځوړند کول)

UPDATE word_frequencies
SET base_verb = 'ځوړند کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 29642;


-- خوشحاله کړل -> base: خوشحاله کول (perfective: خوشحاله کول)

UPDATE word_frequencies
SET base_verb = 'خوشحاله کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 29958;


-- رخصت کړل -> base: رخصت کول (perfective: رخصت کول)

UPDATE word_frequencies
SET base_verb = 'رخصت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 29993;


-- اباد کړل -> base: اباد کول (perfective: اباد کول)

UPDATE word_frequencies
SET base_verb = 'اباد کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30212;


-- تعقیب کړل -> base: تعقیب کول (perfective: تعقیب کول)

UPDATE word_frequencies
SET base_verb = 'تعقیب کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30434;


-- نابود کړل -> base: نابود کول (perfective: نابود کول)

UPDATE word_frequencies
SET base_verb = 'نابود کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30447;


-- او کړل -> base: او کول (perfective: او کول)

UPDATE word_frequencies
SET base_verb = 'او کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30598;


-- تسلیم کړل -> base: تسلیم کول (perfective: تسلیم کول)

UPDATE word_frequencies
SET base_verb = 'تسلیم کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30828;


-- مخکې کړل -> base: مخکې کول (perfective: مخکې کول)

UPDATE word_frequencies
SET base_verb = 'مخکې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 30843;


-- جدا کړل -> base: جدا کول (perfective: جدا کول)

UPDATE word_frequencies
SET base_verb = 'جدا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31091;


-- ګېر کړل -> base: ګېر کول (perfective: ګېر کول)

UPDATE word_frequencies
SET base_verb = 'ګېر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31204;


-- تېر کړل -> base: تېر کول (perfective: تېر کول)

UPDATE word_frequencies
SET base_verb = 'تېر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31254;


-- سنت کړل -> base: سنت کول (perfective: سنت کول)

UPDATE word_frequencies
SET base_verb = 'سنت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31469;


-- دوی کړل -> base: دوی کول (perfective: دوی کول)

UPDATE word_frequencies
SET base_verb = 'دوی کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31706;


-- بار کړل -> base: بار کول (perfective: بار کول)

UPDATE word_frequencies
SET base_verb = 'بار کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 31984;


-- آزاد کړل -> base: آزاد کول (perfective: آزاد کول)

UPDATE word_frequencies
SET base_verb = 'آزاد کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 32436;


-- استعمال کړل -> base: استعمال کول (perfective: استعمال کول)

UPDATE word_frequencies
SET base_verb = 'استعمال کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 32491;


-- پټ کړل -> base: پټ کول (perfective: پټ کول)

UPDATE word_frequencies
SET base_verb = 'پټ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 32517;


-- منتخب کړل -> base: منتخب کول (perfective: منتخب کول)

UPDATE word_frequencies
SET base_verb = 'منتخب کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 32667;


-- خوارۀ کړل -> base: خوارۀ کول (perfective: خوارۀ کول)

UPDATE word_frequencies
SET base_verb = 'خوارۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 32883;


-- غلي کړل -> base: غلي کول (perfective: غلي کول)

UPDATE word_frequencies
SET base_verb = 'غلي کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 33329;


-- وړاندې کړل -> base: وړاندې کول (perfective: وړاندې کول)

UPDATE word_frequencies
SET base_verb = 'وړاندې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 33336;


-- رسوا کړل -> base: رسوا کول (perfective: رسوا کول)

UPDATE word_frequencies
SET base_verb = 'رسوا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 33543;


-- تر‌لاسه کړل -> base: تر‌لاسه کول (perfective: تر‌لاسه کول)

UPDATE word_frequencies
SET base_verb = 'تر‌لاسه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 33646;


-- ګوښه کړل -> base: ګوښه کول (perfective: ګوښه کول)

UPDATE word_frequencies
SET base_verb = 'ګوښه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34035;


-- یاد کړل -> base: یاد کول (perfective: یاد کول)

UPDATE word_frequencies
SET base_verb = 'یاد کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34354;


-- غوړ کړل -> base: غوړ کول (perfective: غوړ کول)

UPDATE word_frequencies
SET base_verb = 'غوړ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34388;


-- راکش کړل -> base: راکش کول (perfective: راکش کول)

UPDATE word_frequencies
SET base_verb = 'راکش کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34587;


-- اندازه کړل -> base: اندازه کول (perfective: اندازه کول)

UPDATE word_frequencies
SET base_verb = 'اندازه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34640;


-- سمبال کړل -> base: سمبال کول (perfective: سمبال کول)

UPDATE word_frequencies
SET base_verb = 'سمبال کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34766;


-- کلابند کړل -> base: کلابند کول (perfective: کلابند کول)

UPDATE word_frequencies
SET base_verb = 'کلابند کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 34854;


-- تار کړل -> base: تار کول (perfective: تار کول)

UPDATE word_frequencies
SET base_verb = 'تار کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35082;


-- وارخطا کړل -> base: وارخطا کول (perfective: وارخطا کول)

UPDATE word_frequencies
SET base_verb = 'وارخطا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35085;


-- اخوا کړل -> base: اخوا کول (perfective: اخوا کول)

UPDATE word_frequencies
SET base_verb = 'اخوا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35260;


-- ريچې کړل -> base: ريچې کول (perfective: ريچې کول)

UPDATE word_frequencies
SET base_verb = 'ريچې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35388;


-- ډوب کړل -> base: ډوب کول (perfective: ډوب کول)

UPDATE word_frequencies
SET base_verb = 'ډوب کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35422;


-- برابر کړل -> base: برابر کول (perfective: برابر کول)

UPDATE word_frequencies
SET base_verb = 'برابر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35519;


-- بېل کړل -> base: بېل کول (perfective: بېل کول)

UPDATE word_frequencies
SET base_verb = 'بېل کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35567;


-- ودان کړل -> base: ودان کول (perfective: ودان کول)

UPDATE word_frequencies
SET base_verb = 'ودان کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35613;


-- لاس کړل -> base: لاس کول (perfective: لاس کول)

UPDATE word_frequencies
SET base_verb = 'لاس کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 35710;


-- نشه کړل -> base: نشه کول (perfective: نشه کول)

UPDATE word_frequencies
SET base_verb = 'نشه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 36091;


-- ورګزار کړل -> base: ورګزار کول (perfective: ورګزار کول)

UPDATE word_frequencies
SET base_verb = 'ورګزار کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 36924;


-- جلاوطن کړل -> base: جلاوطن کول (perfective: جلاوطن کول)

UPDATE word_frequencies
SET base_verb = 'جلاوطن کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37105;


-- راښکته کړل -> base: راښکته کول (perfective: راښکته کول)

UPDATE word_frequencies
SET base_verb = 'راښکته کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37576;


-- ګوډ کړل -> base: ګوډ کول (perfective: ګوډ کول)

UPDATE word_frequencies
SET base_verb = 'ګوډ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37584;


-- وراوږدۀ کړل -> base: وراوږدۀ کول (perfective: وراوږدۀ کول)

UPDATE word_frequencies
SET base_verb = 'وراوږدۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37841;


-- مړۀ کړل -> base: مړۀ کول (perfective: مړۀ کول)

UPDATE word_frequencies
SET base_verb = 'مړۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37876;


-- پاخۀ کړل -> base: پاخۀ کول (perfective: پاخۀ کول)

UPDATE word_frequencies
SET base_verb = 'پاخۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 37914;


-- خپل کړل -> base: خپل کول (perfective: خپل کول)

UPDATE word_frequencies
SET base_verb = 'خپل کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 38321;


-- باندې کړل -> base: باندې کول (perfective: باندې کول)

UPDATE word_frequencies
SET base_verb = 'باندې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 38323;


-- لوټ کړل -> base: لوټ کول (perfective: لوټ کول)

UPDATE word_frequencies
SET base_verb = 'لوټ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 38523;


-- اخته کړل -> base: اخته کول (perfective: اخته کول)

UPDATE word_frequencies
SET base_verb = 'اخته کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 38551;


-- وهمه -> base: هم (perfective: وهمه)

UPDATE word_frequencies
SET base_verb = 'هم',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 38552;


-- نچوړ کړل -> base: نچوړ کول (perfective: نچوړ کول)

UPDATE word_frequencies
SET base_verb = 'نچوړ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39164;


-- کولاو کړل -> base: کولاو کول (perfective: کولاو کول)

UPDATE word_frequencies
SET base_verb = 'کولاو کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39176;


-- اوږدۀ کړل -> base: اوږدۀ کول (perfective: اوږدۀ کول)

UPDATE word_frequencies
SET base_verb = 'اوږدۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39211;


-- ټيټ کړل -> base: ټيټ کول (perfective: ټيټ کول)

UPDATE word_frequencies
SET base_verb = 'ټيټ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39269;


-- مسح کړل -> base: مسح کول (perfective: مسح کول)

UPDATE word_frequencies
SET base_verb = 'مسح کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39416;


-- راجمع کړل -> base: راجمع کول (perfective: راجمع کول)

UPDATE word_frequencies
SET base_verb = 'راجمع کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39497;


-- راځوړند کړل -> base: راځوړند کول (perfective: راځوړند کول)

UPDATE word_frequencies
SET base_verb = 'راځوړند کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39699;


-- قبول کړل -> base: قبول کول (perfective: قبول کول)

UPDATE word_frequencies
SET base_verb = 'قبول کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 39970;


-- قتل کړل -> base: قتل کول (perfective: قتل کول)

UPDATE word_frequencies
SET base_verb = 'قتل کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_stative_compound_split_head')
WHERE id = 40231;


-- ولیدل -> base: لیدل (perfective: ولیدل)

UPDATE word_frequencies
SET base_verb = 'لیدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12358;


-- ووژل -> base: وژل (perfective: ووژل)

UPDATE word_frequencies
SET base_verb = 'وژل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12259;


-- واورېدل -> base: اورېدل (perfective: واورېدل)

UPDATE word_frequencies
SET base_verb = 'اورېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12380;


-- وویل -> base: ویل (perfective: وویل)

UPDATE word_frequencies
SET base_verb = 'ویل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12396;


-- وکتل -> base: کتل (perfective: وکتل)

UPDATE word_frequencies
SET base_verb = 'کتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12438;


-- ولېږل -> base: لېږل (perfective: ولېږل)

UPDATE word_frequencies
SET base_verb = 'لېږل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12846;


-- ویل -> base: ویل (perfective: ویل)

UPDATE word_frequencies
SET base_verb = 'ویل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12373;


-- ورسېدل -> base: رسېدل (perfective: ورسېدل)

UPDATE word_frequencies
SET base_verb = 'رسېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15442;


-- وشول -> base: کېدل (perfective: وشول)

UPDATE word_frequencies
SET base_verb = 'کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14073;


-- وتښتېدل -> base: تښتېدل (perfective: وتښتېدل)

UPDATE word_frequencies
SET base_verb = 'تښتېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15695;


-- ورکول -> base: ورکول (perfective: ورکول)

UPDATE word_frequencies
SET base_verb = 'ورکول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12713;


-- وژل -> base: وژل (perfective: وژل)

UPDATE word_frequencies
SET base_verb = 'وژل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 12837;


-- ودرېدل -> base: درېدل (perfective: ودرېدل)

UPDATE word_frequencies
SET base_verb = 'درېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15899;


-- ورغلل -> base: ورتلل (perfective: ورغلل)

UPDATE word_frequencies
SET base_verb = 'ورتلل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 13455;


-- ونیول -> base: نیول (perfective: ونیول)

UPDATE word_frequencies
SET base_verb = 'نیول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14238;


-- وشړل -> base: شړل (perfective: وشړل)

UPDATE word_frequencies
SET base_verb = 'شړل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15012;


-- واچول -> base: اچول (perfective: واچول)

UPDATE word_frequencies
SET base_verb = 'اچول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 13915;


-- وښودل -> base: ښودل (perfective: وښودل)

UPDATE word_frequencies
SET base_verb = 'ښودل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14766;


-- ورولېږل -> base: رو (perfective: ورولېږل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14157;


-- وژړل -> base: ژړل (perfective: وژړل)

UPDATE word_frequencies
SET base_verb = 'ژړل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18723;


-- واخستل -> base: اخستل (perfective: واخستل)

UPDATE word_frequencies
SET base_verb = 'اخستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14666;


-- وګڼل -> base: ګڼل (perfective: وګڼل)

UPDATE word_frequencies
SET base_verb = 'ګڼل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 13833;


-- واخیستل -> base: اخیستل (perfective: واخیستل)

UPDATE word_frequencies
SET base_verb = 'اخیستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14403;


-- ولګول -> base: لګول (perfective: ولګول)

UPDATE word_frequencies
SET base_verb = 'لګول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 17411;


-- وخوړل -> base: خوړل (perfective: وخوړل)

UPDATE word_frequencies
SET base_verb = 'خوړل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15444;


-- ووتل -> base: وتل (perfective: ووتل)

UPDATE word_frequencies
SET base_verb = 'وتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15452;


-- ووهل -> base: وهل (perfective: ووهل)

UPDATE word_frequencies
SET base_verb = 'وهل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15071;


-- وسوزول -> base: سوزول (perfective: وسوزول)

UPDATE word_frequencies
SET base_verb = 'سوزول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 17510;


-- وړل -> base: وړل (perfective: وړل)

UPDATE word_frequencies
SET base_verb = 'وړل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15648;


-- ولیکل -> base: لیکل (perfective: ولیکل)

UPDATE word_frequencies
SET base_verb = 'لیکل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 16761;


-- وغوښتل -> base: غوښتل (perfective: وغوښتل)

UPDATE word_frequencies
SET base_verb = 'غوښتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 14325;


-- وټاکل -> base: ټاکل (perfective: وټاکل)

UPDATE word_frequencies
SET base_verb = 'ټاکل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 16005;


-- ودرول -> base: ودرول (perfective: ودرول)

UPDATE word_frequencies
SET base_verb = 'ودرول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 16956;


-- ووېرېدل -> base: وېرېدل (perfective: ووېرېدل)

UPDATE word_frequencies
SET base_verb = 'وېرېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18885;


-- وغورځول -> base: غورځول (perfective: وغورځول)

UPDATE word_frequencies
SET base_verb = 'غورځول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15558;


-- وویستل -> base: ویستل (perfective: وویستل)

UPDATE word_frequencies
SET base_verb = 'ویستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 16612;


-- وېرېدل -> base: وېرېدل (perfective: وېرېدل)

UPDATE word_frequencies
SET base_verb = 'وېرېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 20875;


-- وژغورل -> base: ژغورل (perfective: وژغورل)

UPDATE word_frequencies
SET base_verb = 'ژغورل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 16300;


-- وڅښل -> base: څښل (perfective: وڅښل)

UPDATE word_frequencies
SET base_verb = 'څښل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21678;


-- وبخښل -> base: بخښل (perfective: وبخښل)

UPDATE word_frequencies
SET base_verb = 'بخښل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 15445;


-- ورسول -> base: رسول (perfective: ورسول)

UPDATE word_frequencies
SET base_verb = 'رسول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 20848;


-- وسوځول -> base: سوځول (perfective: وسوځول)

UPDATE word_frequencies
SET base_verb = 'سوځول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18585;


-- وسپارل -> base: سپارل (perfective: وسپارل)

UPDATE word_frequencies
SET base_verb = 'سپارل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18216;


-- ووېشل -> base: وېشل (perfective: ووېشل)

UPDATE word_frequencies
SET base_verb = 'وېشل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18502;


-- وموندل -> base: موندل (perfective: وموندل)

UPDATE word_frequencies
SET base_verb = 'موندل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18341;


-- وګرځېدل -> base: ګرځېدل (perfective: وګرځېدل)

UPDATE word_frequencies
SET base_verb = 'ګرځېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 19757;


-- وساتل -> base: ساتل (perfective: وساتل)

UPDATE word_frequencies
SET base_verb = 'ساتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 17932;


-- وشمېرل -> base: شمېرل (perfective: وشمېرل)

UPDATE word_frequencies
SET base_verb = 'شمېرل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 18613;


-- وختل -> base: ختل (perfective: وختل)

UPDATE word_frequencies
SET base_verb = 'ختل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21691;


-- وشکول -> base: شکول (perfective: وشکول)

UPDATE word_frequencies
SET base_verb = 'شکول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 20820;


-- وخېژول -> base: خېژول (perfective: وخېژول)

UPDATE word_frequencies
SET base_verb = 'خېژول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 20345;


-- وتړل -> base: تړل (perfective: وتړل)

UPDATE word_frequencies
SET base_verb = 'تړل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 17186;


-- واوړېدل -> base: اوړېدل (perfective: واوړېدل)

UPDATE word_frequencies
SET base_verb = 'اوړېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 20099;


-- ورېدل -> base: ورېدل (perfective: ورېدل)

UPDATE word_frequencies
SET base_verb = 'ورېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 23803;


-- وخندل -> base: خندل (perfective: وخندل)

UPDATE word_frequencies
SET base_verb = 'خندل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 28423;


-- ویستل -> base: ویستل (perfective: ویستل)

UPDATE word_frequencies
SET base_verb = 'ویستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 17674;


-- ولوستل -> base: لوستل (perfective: ولوستل)

UPDATE word_frequencies
SET base_verb = 'لوستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21616;


-- وروغورزول -> base: رو (perfective: وروغورزول)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 10251;


-- وروړ -> base: رو (perfective: وروړ)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29886;


-- وغورزول -> base: غورزول (perfective: وغورزول)

UPDATE word_frequencies
SET base_verb = 'غورزول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 32040;


-- واغوستل -> base: اغوستل (perfective: واغوستل)

UPDATE word_frequencies
SET base_verb = 'اغوستل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22713;


-- وزغمل -> base: زغمل (perfective: وزغمل)

UPDATE word_frequencies
SET base_verb = 'زغمل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21641;


-- ورتلل -> base: ورتلل (perfective: ورتلل)

UPDATE word_frequencies
SET base_verb = 'ورتلل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22571;


-- وغواړه -> base: غوښتل (perfective: وغواړه)

UPDATE word_frequencies
SET base_verb = 'غوښتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 25582;


-- وزېږول -> base: زېږول (perfective: وزېږول)

UPDATE word_frequencies
SET base_verb = 'زېږول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 6992;


-- وپېژندل -> base: پېژندل (perfective: وپېژندل)

UPDATE word_frequencies
SET base_verb = 'پېژندل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 23510;


-- وتلل -> base: تلل (perfective: وتلل)

UPDATE word_frequencies
SET base_verb = 'تلل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 24068;


-- ورواغوستله -> base: رو (perfective: ورواغوستله)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 27084;


-- ورېبل -> base: رېبل (perfective: ورېبل)

UPDATE word_frequencies
SET base_verb = 'رېبل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 30088;


-- ورواغوستلې -> base: رو (perfective: ورواغوستلې)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 31831;


-- ولمسول -> base: لمسول (perfective: ولمسول)

UPDATE word_frequencies
SET base_verb = 'لمسول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21542;


-- وېشل -> base: وېشل (perfective: وېشل)

UPDATE word_frequencies
SET base_verb = 'وېشل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21599;


-- ولټول -> base: لټول (perfective: ولټول)

UPDATE word_frequencies
SET base_verb = 'لټول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 21811;


-- ووینځل -> base: وینځل (perfective: ووینځل)

UPDATE word_frequencies
SET base_verb = 'وینځل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 24826;


-- ولړزېدل -> base: لړزېدل (perfective: ولړزېدل)

UPDATE word_frequencies
SET base_verb = 'لړزېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 27235;


-- وهڅول -> base: هڅول (perfective: وهڅول)

UPDATE word_frequencies
SET base_verb = 'هڅول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22402;


-- ومنل -> base: منل (perfective: ومنل)

UPDATE word_frequencies
SET base_verb = 'منل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22517;


-- وځړول -> base: ځړول (perfective: وځړول)

UPDATE word_frequencies
SET base_verb = 'ځړول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22627;


-- وکرل -> base: کرل (perfective: وکرل)

UPDATE word_frequencies
SET base_verb = 'کرل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 22658;


-- ولړزول -> base: لړزول (perfective: ولړزول)

UPDATE word_frequencies
SET base_verb = 'لړزول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29556;


-- ورورسېدل -> base: رو (perfective: ورورسېدل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 30319;


-- وېرول -> base: وېرول (perfective: وېرول)

UPDATE word_frequencies
SET base_verb = 'وېرول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 30754;


-- ولوېدل -> base: لوېدل (perfective: ولوېدل)

UPDATE word_frequencies
SET base_verb = 'لوېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 31690;


-- وجنګېدل -> base: جنګېدل (perfective: وجنګېدل)

UPDATE word_frequencies
SET base_verb = 'جنګېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 31903;


-- وروسپارل -> base: رو (perfective: وروسپارل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 7052;


-- وغورېدل -> base: غورېدل (perfective: وغورېدل)

UPDATE word_frequencies
SET base_verb = 'غورېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 24520;


-- وشلول -> base: شلول (perfective: وشلول)

UPDATE word_frequencies
SET base_verb = 'شلول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 28835;


-- وازمایل -> base: ازمایل (perfective: وازمایل)

UPDATE word_frequencies
SET base_verb = 'ازمایل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29571;


-- وبلل -> base: بلل (perfective: وبلل)

UPDATE word_frequencies
SET base_verb = 'بلل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29587;


-- وانخیستل -> base: ان (perfective: وانخیستل)

UPDATE word_frequencies
SET base_verb = 'ان',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29706;


-- ورواغوستل -> base: رو (perfective: ورواغوستل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29923;


-- وسوځېدل -> base: سوځېدل (perfective: وسوځېدل)

UPDATE word_frequencies
SET base_verb = 'سوځېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 29944;


-- ولمانځل -> base: لمانځل (perfective: ولمانځل)

UPDATE word_frequencies
SET base_verb = 'لمانځل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 30238;


-- وروړله -> base: رو (perfective: وروړله)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 30369;


-- وکارول -> base: کارول (perfective: وکارول)

UPDATE word_frequencies
SET base_verb = 'کارول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 33548;


-- وځورول -> base: ځورول (perfective: وځورول)

UPDATE word_frequencies
SET base_verb = 'ځورول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 33625;


-- ورووتل -> base: رو (perfective: ورووتل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 33766;


-- وروښودل -> base: رو (perfective: وروښودل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 33827;


-- وغوړول -> base: غوړول (perfective: وغوړول)

UPDATE word_frequencies
SET base_verb = 'غوړول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 34263;


-- وشیندل -> base: شیندل (perfective: وشیندل)

UPDATE word_frequencies
SET base_verb = 'شیندل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 34445;


-- وښویېدل -> base: ښویېدل (perfective: وښویېدل)

UPDATE word_frequencies
SET base_verb = 'ښویېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 34699;


-- وشرمېدل -> base: شرمېدل (perfective: وشرمېدل)

UPDATE word_frequencies
SET base_verb = 'شرمېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 34843;


-- وویشتل -> base: ویشتل (perfective: وویشتل)

UPDATE word_frequencies
SET base_verb = 'ویشتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 35081;


-- والوتل -> base: الوتل (perfective: والوتل)

UPDATE word_frequencies
SET base_verb = 'الوتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 35278;


-- واستول -> base: استول (perfective: واستول)

UPDATE word_frequencies
SET base_verb = 'استول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 35649;


-- وشرمول -> base: شرمول (perfective: وشرمول)

UPDATE word_frequencies
SET base_verb = 'شرمول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 36092;


-- وروزل -> base: روزل (perfective: وروزل)

UPDATE word_frequencies
SET base_verb = 'روزل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 36227;


-- وخوځول -> base: خوځول (perfective: وخوځول)

UPDATE word_frequencies
SET base_verb = 'خوځول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 37257;


-- ووېرول -> base: وېرول (perfective: ووېرول)

UPDATE word_frequencies
SET base_verb = 'وېرول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 37573;


-- ورانول -> base: ورانول (perfective: ورانول)

UPDATE word_frequencies
SET base_verb = 'ورانول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 40056;


-- ورواوړېدل -> base: رو (perfective: ورواوړېدل)

UPDATE word_frequencies
SET base_verb = 'رو',
    pos = COALESCE(NULLIF(pos, ''), 'verb_perfective_split_head')
WHERE id = 40403;

