-- Batch 0: Classify Verb Forms
-- Forms classified: 219
-- Perfect forms detected: 1798

UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ايل')
WHERE id = 1174;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ايل')
WHERE id = 16075;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ايل')
WHERE id = 17291;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ايل')
WHERE id = 17346;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ايل')
WHERE id = 17874;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اېل')
WHERE id = 1227;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نومېدل')
WHERE id = 3021;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نومېدل')
WHERE id = 18221;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شوباییل')
WHERE id = 5822;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ابیجایل')
WHERE id = 5835;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شوبال')
WHERE id = 5840;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وزېږول')
WHERE id = 6992;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وزېږول')
WHERE id = 27057;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وزېږول')
WHERE id = 37745;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وروسپارل')
WHERE id = 7052;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اعلانول')
WHERE id = 7054;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اعلانول')
WHERE id = 25316;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اعلانول')
WHERE id = 27321;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'اعلانول')
WHERE id = 33148;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اعلانول')
WHERE id = 33213;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'محلل')
WHERE id = 7152;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'محلل')
WHERE id = 9840;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'یرحمییل')
WHERE id = 7831;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'آصیل')
WHERE id = 7882;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خېل')
WHERE id = 8222;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اشبعل')
WHERE id = 8467;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'یدیعییل')
WHERE id = 8985;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خوشحالېدل')
WHERE id = 9733;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'خوشحالېدل')
WHERE id = 27774;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'خوشحالېدل')
WHERE id = 38537;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راننوتل')
WHERE id = 9894;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راننوتل')
WHERE id = 31982;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راننوتل')
WHERE id = 35343;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'راننوتل')
WHERE id = 40913;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'محفل')
WHERE id = 10026;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 10096;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 18638;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 19890;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 24120;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 25102;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 28438;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 34659;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 37960;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رټل')
WHERE id = 38309;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نرګل')
WHERE id = 10248;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وروغورزول')
WHERE id = 10251;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وروغورزول')
WHERE id = 26388;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وروغورزول')
WHERE id = 31812;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وروغورزول')
WHERE id = 37524;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 16012;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 17139;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 18554;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 25005;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 34185;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 34678;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وينځل')
WHERE id = 40682;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوپارول')
WHERE id = 6154;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوپارول')
WHERE id = 10463;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوپارول')
WHERE id = 27312;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوپارول')
WHERE id = 32569;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راوپارول')
WHERE id = 35718;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ابیطال')
WHERE id = 10614;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نتنییل')
WHERE id = 10727;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کښې ېدل')
WHERE id = 11402;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نه ېدل')
WHERE id = 11403;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ته ېدل')
WHERE id = 11404;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'دا ېدل')
WHERE id = 11405;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کې ېدل')
WHERE id = 11407;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شان کړل')
WHERE id = 11408;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کارونه کړل')
WHERE id = 11412;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'څۀ کړل')
WHERE id = 11413;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سره ېدل')
WHERE id = 11416;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'داسې کړل')
WHERE id = 11417;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هلته ېدل')
WHERE id = 11421;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خپل')
WHERE id = 11436;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خپل')
WHERE id = 11474;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خپل')
WHERE id = 11498;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خپل')
WHERE id = 11538;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'خپل')
WHERE id = 31025;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټول')
WHERE id = 11462;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټول')
WHERE id = 11478;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټول')
WHERE id = 11718;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټول')
WHERE id = 11725;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 6;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 11523;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 11913;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 12043;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 12628;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 12634;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 15902;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بل')
WHERE id = 20543;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 11439;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 11534;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 13437;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 13624;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 13699;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 19978;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 25106;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 25257;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 26013;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 26623;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 29166;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 31146;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 35607;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'هل')
WHERE id = 36161;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 11554;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 11614;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 11884;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 12566;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 12769;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 14512;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 17037;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 19123;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 22518;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شول')
WHERE id = 26137;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11500;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11579;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11615;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11622;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11659;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 11699;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 12240;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 14219;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 14471;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 14638;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 18384;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 18713;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 19873;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 25665;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کړل')
WHERE id = 38436;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 11660;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 11872;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 12514;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 12706;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 13637;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 16117;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 16315;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 16452;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 18089;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 19756;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 31208;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 35957;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 40372;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'تل')
WHERE id = 40514;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عمل')
WHERE id = 11709;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عمل')
WHERE id = 23598;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عمل')
WHERE id = 31011;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'عمل')
WHERE id = 40601;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بابل')
WHERE id = 11720;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بابل')
WHERE id = 31006;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 11822;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 12146;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 12342;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 13803;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 14848;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بدل')
WHERE id = 14926;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 42380;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 11476;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 11508;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 11826;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 15935;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 16740;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 18782;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'دل')
WHERE id = 19500;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کال')
WHERE id = 11830;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کال')
WHERE id = 11956;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کال')
WHERE id = 12213;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'کال')
WHERE id = 40498;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11470;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11543;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11605;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11661;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11670;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11833;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 11835;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12006;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12129;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12172;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12274;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12407;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12553;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 12809;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 14554;
UPDATE word_frequencies 
SET form_type = 'perfect', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 18899;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 20967;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'کول')
WHERE id = 30698;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جلال')
WHERE id = 11834;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'جلال')
WHERE id = 21968;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نازل')
WHERE id = 11889;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نازل')
WHERE id = 14540;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نازل')
WHERE id = 24889;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ساؤل')
WHERE id = 11899;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ساؤل')
WHERE id = 26591;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ډول')
WHERE id = 11936;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ډول')
WHERE id = 23741;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'څل')
WHERE id = 11548;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'څل')
WHERE id = 11917;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'څل')
WHERE id = 11972;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'څل')
WHERE id = 40178;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'دېوال')
WHERE id = 11976;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'دېوال')
WHERE id = 28339;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 12012;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 13030;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 13711;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 14479;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 14585;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 15093;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 17656;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 19850;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 19876;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 21006;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 30643;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 33281;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'ځل')
WHERE id = 39595;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سوال')
WHERE id = 12018;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راټول')
WHERE id = 12024;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راټول')
WHERE id = 15365;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راټول')
WHERE id = 16617;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راټول')
WHERE id = 26679;