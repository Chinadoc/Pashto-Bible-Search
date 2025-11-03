-- Link dynamic compound verbs to their base forms
-- Based on: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/
-- Dynamic compounds have و - óo prefix on helper verbs in perfective forms

-- څۀ کول -> base: څۀ کول

UPDATE word_frequencies
SET base_verb = 'څۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 16109;


-- کارونه کول -> base: کارونه کول

UPDATE word_frequencies
SET base_verb = 'کارونه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 18255;


-- منډې وهل -> base: منډې وهل

UPDATE word_frequencies
SET base_verb = 'منډې وهل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 19099;


-- پوره کول -> base: پوره کول

UPDATE word_frequencies
SET base_verb = 'پوره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 19387;


-- عبادت کول -> base: عبادت کول

UPDATE word_frequencies
SET base_verb = 'عبادت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 19946;


-- پېش کول -> base: پېش کول

UPDATE word_frequencies
SET base_verb = 'پېش کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 20001;


-- بچ کول -> base: بچ کول

UPDATE word_frequencies
SET base_verb = 'بچ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 20150;


-- خبرې کول -> base: خبرې کول

UPDATE word_frequencies
SET base_verb = 'خبرې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 20315;


-- کې ساتل -> base: کې ساتل

UPDATE word_frequencies
SET base_verb = 'کې ساتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 20788;


-- کار کول -> base: کار کول

UPDATE word_frequencies
SET base_verb = 'کار کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 21040;


-- ځان ساتل -> base: ځان ساتل

UPDATE word_frequencies
SET base_verb = 'ځان ساتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 21045;


-- پاتې کېدل -> base: پاتې کېدل

UPDATE word_frequencies
SET base_verb = 'پاتې کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 21057;


-- مړ کېدل -> base: مړ کېدل

UPDATE word_frequencies
SET base_verb = 'مړ کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 21608;


-- سنت کېدل -> base: سنت کېدل

UPDATE word_frequencies
SET base_verb = 'سنت کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 21796;


-- يې کول -> base: يې کول

UPDATE word_frequencies
SET base_verb = 'يې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 22293;


-- قبضه کول -> base: قبضه کول

UPDATE word_frequencies
SET base_verb = 'قبضه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 22943;


-- مړۀ کېدل -> base: مړۀ کېدل

UPDATE word_frequencies
SET base_verb = 'مړۀ کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 22949;


-- فخر کول -> base: فخر کول

UPDATE word_frequencies
SET base_verb = 'فخر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 23047;


-- تباه کول -> base: تباه کول

UPDATE word_frequencies
SET base_verb = 'تباه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 23176;


-- عمل کول -> base: عمل کول

UPDATE word_frequencies
SET base_verb = 'عمل کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 23450;


-- سره کول -> base: سره کول

UPDATE word_frequencies
SET base_verb = 'سره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 24225;


-- خبره کول -> base: خبره کول

UPDATE word_frequencies
SET base_verb = 'خبره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 24396;


-- داسې کول -> base: داسې کول

UPDATE word_frequencies
SET base_verb = 'داسې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 24634;


-- اطاعت کول -> base: اطاعت کول

UPDATE word_frequencies
SET base_verb = 'اطاعت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 24969;


-- مینه کول -> base: مینه کول

UPDATE word_frequencies
SET base_verb = 'مینه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 25188;


-- وړاندې کول -> base: وړاندې کول

UPDATE word_frequencies
SET base_verb = 'وړاندې کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 25346;


-- درناوی کول -> base: درناوی کول

UPDATE word_frequencies
SET base_verb = 'درناوی کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 25511;


-- حمله کول -> base: حمله کول

UPDATE word_frequencies
SET base_verb = 'حمله کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 25517;


-- زخمى کول -> base: زخمى کول

UPDATE word_frequencies
SET base_verb = 'زخمى کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 25852;


-- وادۀ کول -> base: وادۀ کول

UPDATE word_frequencies
SET base_verb = 'وادۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 26337;


-- ملنډې وهل -> base: ملنډې وهل

UPDATE word_frequencies
SET base_verb = 'ملنډې وهل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 27164;


-- ښېګړه کول -> base: ښېګړه کول

UPDATE word_frequencies
SET base_verb = 'ښېګړه کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 28036;


-- عزت کول -> base: عزت کول

UPDATE word_frequencies
SET base_verb = 'عزت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 28435;


-- پېدا کول -> base: پېدا کول

UPDATE word_frequencies
SET base_verb = 'پېدا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 28829;


-- ښکاره کول -> base: ښکاره کول

UPDATE word_frequencies
SET base_verb = 'ښکاره کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 29494;


-- صبر کول -> base: صبر کول

UPDATE word_frequencies
SET base_verb = 'صبر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 29595;


-- ښکاره کېدل -> base: ښکاره کېدل

UPDATE word_frequencies
SET base_verb = 'ښکاره کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30107;


-- سرني وهل -> base: سرني وهل

UPDATE word_frequencies
SET base_verb = 'سرني وهل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30445;


-- حکومت کول -> base: حکومت کول

UPDATE word_frequencies
SET base_verb = 'حکومت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30825;


-- پیروي کول -> base: پیروي کول

UPDATE word_frequencies
SET base_verb = 'پیروي کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30883;


-- پیروي کول -> base: پیروي کول

UPDATE word_frequencies
SET base_verb = 'پیروي کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30883;


-- شان کول -> base: شان کول

UPDATE word_frequencies
SET base_verb = 'شان کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 30965;


-- بحث کول -> base: بحث کول

UPDATE word_frequencies
SET base_verb = 'بحث کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 31400;


-- خِدمت کول -> base: خِدمت کول

UPDATE word_frequencies
SET base_verb = 'خِدمت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 31559;


-- خيال ساتل -> base: خيال ساتل

UPDATE word_frequencies
SET base_verb = 'خيال ساتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 31872;


-- خيال ساتل -> base: خيال ساتل

UPDATE word_frequencies
SET base_verb = 'خيال ساتل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 31872;


-- اختر کول -> base: اختر کول

UPDATE word_frequencies
SET base_verb = 'اختر کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 32050;


-- ادا کول -> base: ادا کول

UPDATE word_frequencies
SET base_verb = 'ادا کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 32155;


-- مړۀ کول -> base: مړۀ کول

UPDATE word_frequencies
SET base_verb = 'مړۀ کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 32274;


-- ژوندى کول -> base: ژوندى کول

UPDATE word_frequencies
SET base_verb = 'ژوندى کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 32275;


-- صِفت کول -> base: صِفت کول

UPDATE word_frequencies
SET base_verb = 'صِفت کول',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 32625;


-- راجمع کېدل -> base: راجمع کېدل

UPDATE word_frequencies
SET base_verb = 'راجمع کېدل',
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = 33035;

