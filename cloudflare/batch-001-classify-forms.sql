-- Batch 1: Classify Verb Forms
-- Forms classified: 313
-- Perfect forms detected: 1854

UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 12041;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 12575;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 13293;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 14034;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 15658;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 15682;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 18995;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 25194;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 38315;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لاړل')
WHERE id = 12070;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شمال')
WHERE id = 24031;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'شمال')
WHERE id = 40560;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شمال')
WHERE id = 12075;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راغلل')
WHERE id = 12292;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'راغلل')
WHERE id = 12897;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راغلل')
WHERE id = 13167;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راغلل')
WHERE id = 15457;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راغلل')
WHERE id = 12080;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اول')
WHERE id = 12931;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اول')
WHERE id = 15984;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اول')
WHERE id = 21159;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اول')
WHERE id = 37602;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اول')
WHERE id = 12102;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'مال')
WHERE id = 16616;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مال')
WHERE id = 36115;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مال')
WHERE id = 12104;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'حال')
WHERE id = 18070;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حال')
WHERE id = 36382;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حال')
WHERE id = 12111;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 11903;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 12150;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 12179;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 12494;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 13366;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 25239;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 26066;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 27182;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 38313;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکړل')
WHERE id = 12156;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'فضل')
WHERE id = 12178;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عقل')
WHERE id = 16687;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عقل')
WHERE id = 21972;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عقل')
WHERE id = 21982;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عقل')
WHERE id = 12196;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 18308;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 20495;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 20836;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 22789;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 23564;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 24593;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 26189;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 29684;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 32642;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 33199;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 41456;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غوښتل')
WHERE id = 12197;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پیل')
WHERE id = 30973;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پیل')
WHERE id = 12236;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ووژل')
WHERE id = 7504;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ووژل')
WHERE id = 17340;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ووژل')
WHERE id = 40969;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ووژل')
WHERE id = 12259;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قتل')
WHERE id = 12265;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 11665;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 12151;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 12357;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 13884;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 16601;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 17744;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 25370;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مل')
WHERE id = 12283;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حاصل')
WHERE id = 15703;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حاصل')
WHERE id = 12308;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نسل')
WHERE id = 19553;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نسل')
WHERE id = 12327;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'محل')
WHERE id = 40742;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'محل')
WHERE id = 12336;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ولیدل')
WHERE id = 13513;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولیدل')
WHERE id = 14759;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولیدل')
WHERE id = 18602;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ولیدل')
WHERE id = 38579;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولیدل')
WHERE id = 12358;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تېل')
WHERE id = 12903;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تېل')
WHERE id = 12369;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شامل')
WHERE id = 17489;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شامل')
WHERE id = 18939;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شامل')
WHERE id = 12372;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 12215;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 12301;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 12644;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 13267;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 13286;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 14190;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 14839;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 14849;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 15230;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 15770;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 16922;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 18560;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 22374;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 24823;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 25553;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 33466;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویل')
WHERE id = 12373;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واورېدل')
WHERE id = 14918;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واورېدل')
WHERE id = 17976;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واورېدل')
WHERE id = 26516;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'واورېدل')
WHERE id = 41060;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واورېدل')
WHERE id = 12380;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویل')
WHERE id = 23723;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویل')
WHERE id = 29873;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وویل')
WHERE id = 35606;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویل')
WHERE id = 12396;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وکتل')
WHERE id = 28750;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وکتل')
WHERE id = 31597;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وکتل')
WHERE id = 12438;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قبول')
WHERE id = 13169;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قبول')
WHERE id = 15443;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قبول')
WHERE id = 12439;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 22389;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 22452;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 23475;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 24964;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 26990;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 30805;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 33147;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 33265;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 34136;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 35417;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 35489;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیکل')
WHERE id = 12483;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مثال')
WHERE id = 7536;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مثال')
WHERE id = 12493;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'یوځل')
WHERE id = 28439;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'یوځل')
WHERE id = 12504;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 11517;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 11631;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 11918;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 11992;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 12096;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 13815;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 14790;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 15927;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 18596;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 22145;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شل')
WHERE id = 12515;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بعل')
WHERE id = 21105;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بعل')
WHERE id = 12521;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'فصل')
WHERE id = 12548;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 12288;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 13683;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 14247;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 15382;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 16410;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 21922;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 34910;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سل')
WHERE id = 12603;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حلال')
WHERE id = 19490;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حلال')
WHERE id = 23140;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حلال')
WHERE id = 28555;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'حلال')
WHERE id = 40009;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حلال')
WHERE id = 12626;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 12103;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 13680;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 14836;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 15894;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 16329;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 18853;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 19806;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 30785;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 33686;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورکول')
WHERE id = 12713;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غسل')
WHERE id = 12826;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وژل')
WHERE id = 13062;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وژل')
WHERE id = 18546;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وژل')
WHERE id = 28370;
UPDATE word_frequencies 
SET form_type = 'perfect', base_verb = COALESCE(base_verb, 'وژل')
WHERE id = 33390;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وژل')
WHERE id = 12837;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 14562;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 14728;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 18316;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 24608;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 28074;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 30350;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 39128;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 40935;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولېږل')
WHERE id = 12846;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'توکل')
WHERE id = 12912;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 14020;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 17891;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 18704;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 18867;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 19947;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 26365;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 27000;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 37123;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 40934;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېښودل')
WHERE id = 12913;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اصُول')
WHERE id = 14109;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اصُول')
WHERE id = 12916;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'شکل')
WHERE id = 15907;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شکل')
WHERE id = 25630;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شکل')
WHERE id = 12933;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 15417;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 17344;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 19819;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 24999;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 28590;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 40939;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوغوښتل')
WHERE id = 12987;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 11700;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 13022;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 13815;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 14420;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 15137;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 15927;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 16594;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 16787;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 18237;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 19906;
UPDATE word_frequencies 
SET form_type = 'perfect', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 20974;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 22417;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 26846;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 32960;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کېدل')
WHERE id = 13033;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 9127;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 14639;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 16637;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 20361;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 24045;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 29465;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 30439;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 31743;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 33177;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 37159;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوسېدل')
WHERE id = 13051;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بلکل')
WHERE id = 11642;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بلکل')
WHERE id = 13111;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'استعمال')
WHERE id = 13171;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځنګل')
WHERE id = 23298;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ځنګل')
WHERE id = 40506;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځنګل')
WHERE id = 13184;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 15878;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 16294;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 16308;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 25194;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 27470;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 38315;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تلل')
WHERE id = 13217;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 15815;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 17015;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 17194;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 21068;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 21911;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 36371;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 38586;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بوتلل')
WHERE id = 13266;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بيګل')
WHERE id = 16561;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بيګل')
WHERE id = 20628;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بيګل')
WHERE id = 13306;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مکمل')
WHERE id = 26368;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مکمل')
WHERE id = 38516;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مکمل')
WHERE id = 13349;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 12691;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 15011;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 15827;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 17979;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 17990;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 19937;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 20857;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 31013;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 31574;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوستل')
WHERE id = 13413;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'عادل')
WHERE id = 14915;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'عادل')
WHERE id = 36059;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'عادل')
WHERE id = 36064;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عادل')
WHERE id = 13430;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 13454;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 13617;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 13671;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 13911;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 14009;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 14759;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 16741;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 17604;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 18510;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 18556;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 18602;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 18900;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 19812;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 21692;
UPDATE word_frequencies 
SET form_type = 'perfect', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 27231;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 33665;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لیدل')
WHERE id = 13434;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جلیل')
WHERE id = 13435;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قابل')
WHERE id = 32817;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قابل')
WHERE id = 13447;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ګليل')
WHERE id = 33082;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ګليل')
WHERE id = 13453;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورغلل')
WHERE id = 15103;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ورغلل')
WHERE id = 15929;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورغلل')
WHERE id = 19849;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورغلل')
WHERE id = 21569;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورغلل')
WHERE id = 13455;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'جال')
WHERE id = 14093;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جال')
WHERE id = 16682;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جال')
WHERE id = 18091;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جال')
WHERE id = 37303;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جال')
WHERE id = 13522;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بېل')
WHERE id = 19664;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بېل')
WHERE id = 20515;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بېل')
WHERE id = 22887;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بېل')
WHERE id = 13601;