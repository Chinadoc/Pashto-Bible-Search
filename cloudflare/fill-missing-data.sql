-- Fill Missing Data in Word Frequencies from Dictionary
-- This fills in NULL romanization and POS values for rapid searching

UPDATE word_frequencies SET romanization = 'hayáa', pos = 'n. f.' WHERE pashto_word = 'حيا';
UPDATE word_frequencies SET romanization = 'itifaaqée', pos = 'adj. / n. f.' WHERE pashto_word = 'اتفاقى';
UPDATE word_frequencies SET romanization = 'adabée', pos = 'adj.' WHERE pashto_word = 'ادبى';
UPDATE word_frequencies SET romanization = 'weendzúl', pos = 'v. trans.' WHERE pashto_word = 'وينځل';
UPDATE word_frequencies SET romanization = 'riyáa', pos = 'n. f.' WHERE pashto_word = 'ريا';
UPDATE word_frequencies SET romanization = 'saléem', pos = 'adj.' WHERE pashto_word = 'سليم';
UPDATE word_frequencies SET romanization = 'eesáa, eesáa', pos = 'n. m.' WHERE pashto_word = 'عيسىٰ';
UPDATE word_frequencies SET romanization = 'yarooshalám', pos = 'n. m.' WHERE pashto_word = 'يروشلم';
UPDATE word_frequencies SET romanization = 'heets, hits', pos = 'det. / adv.' WHERE pashto_word = 'هيڅ';
UPDATE word_frequencies SET romanization = 'moosáa', pos = 'name' WHERE pashto_word = 'موسىٰ';
UPDATE word_frequencies SET romanization = 'baadshaahée', pos = 'n. f.' WHERE pashto_word = 'بادشاهى';
UPDATE word_frequencies SET romanization = 'tseez', pos = 'n. m.' WHERE pashto_word = 'څيز';
UPDATE word_frequencies SET romanization = 'zaree''á, zareeyá', pos = 'n. f.' WHERE pashto_word = 'ذريعه';
UPDATE word_frequencies SET romanization = 'sahéeh, sahée, saée', pos = 'adj.' WHERE pashto_word = 'صحيح';
UPDATE word_frequencies SET romanization = 'yára', pos = 'n. f.' WHERE pashto_word = 'يره';
UPDATE word_frequencies SET romanization = 'aasmaanée', pos = 'adj.' WHERE pashto_word = 'آسمانى';