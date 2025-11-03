-- Batch 10: Classify Verb Forms
-- Forms classified: 132
-- Perfect forms detected: 2480

UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'باندې کړل')
WHERE id = 38323;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خجل')
WHERE id = 38377;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عاقل')
WHERE id = 38426;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بې‌عقل')
WHERE id = 17783;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بې‌عقل')
WHERE id = 30746;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بې‌عقل')
WHERE id = 38490;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځپل')
WHERE id = 34244;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځپل')
WHERE id = 38507;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لوټ کړل')
WHERE id = 38523;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اخته کړل')
WHERE id = 38551;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پایمال')
WHERE id = 38558;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځلېدل')
WHERE id = 23431;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځلېدل')
WHERE id = 30111;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځلېدل')
WHERE id = 30858;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځلېدل')
WHERE id = 34577;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځلېدل')
WHERE id = 38561;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'درېدل')
WHERE id = 30827;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'درېدل')
WHERE id = 38595;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'آضل')
WHERE id = 38835;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کنګل')
WHERE id = 38837;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'محويااېل')
WHERE id = 38941;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تارکول')
WHERE id = 28554;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تارکول')
WHERE id = 39007;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حِفاظت کول')
WHERE id = 39047;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'دى کول')
WHERE id = 39050;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نچوړ کړل')
WHERE id = 39164;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کولاو کړل')
WHERE id = 39176;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حمول')
WHERE id = 39191;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اوږدۀ کړل')
WHERE id = 39211;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, '”داسې کول')
WHERE id = 39249;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټيټ کړل')
WHERE id = 39269;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پخول')
WHERE id = 30887;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'پخول')
WHERE id = 35953;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پخول')
WHERE id = 39287;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ګډېدل')
WHERE id = 40001;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ګډېدل')
WHERE id = 39364;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مسح کړل')
WHERE id = 39416;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راجمع کړل')
WHERE id = 39497;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پېش کېدل')
WHERE id = 39513;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نحلى‌اېل')
WHERE id = 39522;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راځوړند کړل')
WHERE id = 39699;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'يبنى‌اېل')
WHERE id = 39726;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قِريَت‌بعل')
WHERE id = 39750;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اِفتاح‌اېل')
WHERE id = 39766;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کابول')
WHERE id = 39768;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوشوکول')
WHERE id = 39824;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تاوېدل')
WHERE id = 27720;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تاوېدل')
WHERE id = 39831;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ابيل')
WHERE id = 39835;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ابى‌اېل')
WHERE id = 39907;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هم کول')
WHERE id = 39921;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ښکلول')
WHERE id = 34101;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ښکلول')
WHERE id = 34216;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ښکلول')
WHERE id = 42059;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ښکلول')
WHERE id = 39955;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قبول کړل')
WHERE id = 39970;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سنګسارول')
WHERE id = 32064;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'سنګسارول')
WHERE id = 41556;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سنګسارول')
WHERE id = 39977;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 10030;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 26497;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 27973;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 36683;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 41054;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غورزول')
WHERE id = 39986;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'فلطى‌ايل')
WHERE id = 39992;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'څملول')
WHERE id = 41926;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'څملول')
WHERE id = 40005;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'لامبل')
WHERE id = 24886;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لامبل')
WHERE id = 32023;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لامبل')
WHERE id = 40012;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, '”هل')
WHERE id = 18157;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, '”هل')
WHERE id = 40048;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورانول')
WHERE id = 21178;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورانول')
WHERE id = 27529;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ورانول')
WHERE id = 29919;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورانول')
WHERE id = 40056;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کل‌کُول')
WHERE id = 40085;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'جبل')
WHERE id = 36198;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'جبل')
WHERE id = 37082;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جبل')
WHERE id = 40090;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حى‌اېل')
WHERE id = 40139;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وپړقول')
WHERE id = 40221;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قتل کړل')
WHERE id = 40231;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غُل')
WHERE id = 40244;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مطابق کول')
WHERE id = 40326;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'الفعل')
WHERE id = 40337;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اورى‌اېل')
WHERE id = 40364;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 24619;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 32468;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 32567;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 37043;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 37909;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 39027;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 41282;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'استعمالول')
WHERE id = 40382;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورواوړېدل')
WHERE id = 40403;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نېکی کول')
WHERE id = 40713;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اِسرایيل')
WHERE id = 40941;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اِسرایيل')
WHERE id = 41204;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اِسرایيل')
WHERE id = 40944;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وفرمایيل')
WHERE id = 40945;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وویيل')
WHERE id = 41056;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویيل')
WHERE id = 41155;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویيل')
WHERE id = 41466;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وویيل')
WHERE id = 40946;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویيل')
WHERE id = 40981;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویيل')
WHERE id = 41274;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویيل')
WHERE id = 41548;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ویيل')
WHERE id = 40955;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سمویيل')
WHERE id = 41606;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سمویيل')
WHERE id = 40964;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'فرمایيل')
WHERE id = 41882;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'فرمایيل')
WHERE id = 42090;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'فرمایيل')
WHERE id = 40985;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هغوی ېدل')
WHERE id = 41004;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حِزایيل')
WHERE id = 41082;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'مایل')
WHERE id = 37583;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مایل')
WHERE id = 41236;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ميشایيل')
WHERE id = 41263;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ميکایيل')
WHERE id = 41298;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'يرحمیيل')
WHERE id = 41309;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خزایيل')
WHERE id = 41579;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'قایل')
WHERE id = 22790;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قایل')
WHERE id = 41599;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عزرایيل')
WHERE id = 41959;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عبدایيل')
WHERE id = 41960;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وآزمایيل')
WHERE id = 41254;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وآزمایيل')
WHERE id = 41604;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وآزمایيل')
WHERE id = 41612;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وآزمایيل')
WHERE id = 42147;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قبضیيل')
WHERE id = 42178;