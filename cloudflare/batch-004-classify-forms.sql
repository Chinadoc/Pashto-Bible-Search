-- Batch 4: Classify Verb Forms
-- Forms classified: 194
-- Perfect forms detected: 2666

UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وژړل')
WHERE id = 18723;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ووېرېدل')
WHERE id = 29720;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ووېرېدل')
WHERE id = 18885;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 16321;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 17679;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 22519;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 30875;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 31741;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 38379;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ژغورل')
WHERE id = 18906;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'شمېرل')
WHERE id = 20429;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'شمېرل')
WHERE id = 27265;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شمېرل')
WHERE id = 27395;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'شمېرل')
WHERE id = 36142;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شمېرل')
WHERE id = 18985;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مات کړل')
WHERE id = 19049;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'يې کړل')
WHERE id = 19073;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'منډې وهل')
WHERE id = 19099;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ويرېدل')
WHERE id = 19249;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 13201;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 18568;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 19378;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 26127;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 29677;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 35812;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 41346;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'درکول')
WHERE id = 19314;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'منزل')
WHERE id = 35912;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'منزل')
WHERE id = 19340;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خیال')
WHERE id = 19358;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 11839;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 12969;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 17898;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 22316;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 28550;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عدل')
WHERE id = 19381;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پوره کول')
WHERE id = 19387;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'پوښل')
WHERE id = 36415;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پوښل')
WHERE id = 19407;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نتناییل')
WHERE id = 19435;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'نیل')
WHERE id = 14580;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نیل')
WHERE id = 19520;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مستقبل')
WHERE id = 19546;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 10316;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 17715;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 25112;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 27048;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 36211;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 41092;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رېبل')
WHERE id = 19550;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شلتى‌اېل')
WHERE id = 19574;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خوښ کړل')
WHERE id = 19578;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حواله کړل')
WHERE id = 19609;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'روان کړل')
WHERE id = 19612;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'هابيل')
WHERE id = 19662;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عُزى‌اېل')
WHERE id = 19683;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ميکل')
WHERE id = 19709;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'باطل')
WHERE id = 29499;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'باطل')
WHERE id = 33142;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'باطل')
WHERE id = 33628;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'باطل')
WHERE id = 19729;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وګرځېدل')
WHERE id = 19757;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ژوبل')
WHERE id = 19775;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, '«دل')
WHERE id = 21555;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, '«دل')
WHERE id = 31704;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, '«دل')
WHERE id = 19789;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'رابلل')
WHERE id = 36567;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رابلل')
WHERE id = 39909;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'رابلل')
WHERE id = 41044;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'رابلل')
WHERE id = 19833;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خلاص کړل')
WHERE id = 19839;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کارول')
WHERE id = 24938;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کارول')
WHERE id = 35111;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'کارول')
WHERE id = 35570;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کارول')
WHERE id = 19842;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'غورځول')
WHERE id = 25208;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'غورځول')
WHERE id = 25412;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'غورځول')
WHERE id = 25565;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غورځول')
WHERE id = 19843;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سره کړل')
WHERE id = 19913;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عبادت کول')
WHERE id = 19946;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'شمول')
WHERE id = 19952;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پېش کول')
WHERE id = 20001;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واوړېدل')
WHERE id = 39526;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'واوړېدل')
WHERE id = 20099;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوګرځېدل')
WHERE id = 10894;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راوګرځېدل')
WHERE id = 20142;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'زبول')
WHERE id = 20145;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بچ کول')
WHERE id = 20150;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'يوايل')
WHERE id = 20196;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مرستیال')
WHERE id = 20247;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېنښودل')
WHERE id = 31038;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېنښودل')
WHERE id = 20309;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خبرې کول')
WHERE id = 20315;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وخېژول')
WHERE id = 23329;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'وخېژول')
WHERE id = 24386;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وخېژول')
WHERE id = 31833;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وخېژول')
WHERE id = 35416;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وخېژول')
WHERE id = 20345;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'کلال')
WHERE id = 11656;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کلال')
WHERE id = 20418;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ټال')
WHERE id = 20424;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'صیقل')
WHERE id = 20433;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'حلال کړل')
WHERE id = 20449;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'غورېدل')
WHERE id = 20546;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نۀ کړل')
WHERE id = 20677;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کې ساتل')
WHERE id = 20788;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'سپارل')
WHERE id = 14984;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سپارل')
WHERE id = 23472;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'سپارل')
WHERE id = 29573;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'سپارل')
WHERE id = 33355;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سپارل')
WHERE id = 20799;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'خبر کړل')
WHERE id = 20812;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وشکول')
WHERE id = 30839;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وشکول')
WHERE id = 35167;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وشکول')
WHERE id = 35701;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وشکول')
WHERE id = 20820;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 24996;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 29505;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 30025;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 33940;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 40842;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'راپاڅېدل')
WHERE id = 20826;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ورسول')
WHERE id = 20848;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 23559;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 25708;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 31715;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 34483;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 36444;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وېرېدل')
WHERE id = 20875;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرې کړل')
WHERE id = 20878;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اصول')
WHERE id = 17182;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'اصول')
WHERE id = 20940;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کار کول')
WHERE id = 21040;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ځان ساتل')
WHERE id = 21045;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پاتې کېدل')
WHERE id = 21057;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'بیت‌ییل')
WHERE id = 21109;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'به خپل')
WHERE id = 33393;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'به خپل')
WHERE id = 21158;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وال')
WHERE id = 21289;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'وال')
WHERE id = 25294;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'وال')
WHERE id = 34732;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وال')
WHERE id = 21183;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'تمبل')
WHERE id = 36935;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'تمبل')
WHERE id = 21272;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قاتِل')
WHERE id = 40041;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'قاتِل')
WHERE id = 21322;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پېدا کړل')
WHERE id = 21389;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'کنډول')
WHERE id = 21445;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'نتنى‌ايل')
WHERE id = 21446;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'عتنى‌اېل')
WHERE id = 21457;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لوستل')
WHERE id = 20815;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لوستل')
WHERE id = 32588;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لوستل')
WHERE id = 33516;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'لوستل')
WHERE id = 41156;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'لوستل')
WHERE id = 21540;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولمسول')
WHERE id = 21542;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'پرېکړل')
WHERE id = 12956;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'پرېکړل')
WHERE id = 19327;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'پرېکړل')
WHERE id = 21586;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وېشل')
WHERE id = 22441;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وېشل')
WHERE id = 25026;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وېشل')
WHERE id = 21599;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سنتېدل')
WHERE id = 33617;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'سنتېدل')
WHERE id = 21607;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مړ کېدل')
WHERE id = 21608;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولوستل')
WHERE id = 32588;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'ولوستل')
WHERE id = 41770;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'ولوستل')
WHERE id = 21616;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 10719;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 23575;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 26883;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 35720;
UPDATE word_frequencies 
SET form_type = 'imperative', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 35721;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وزغمل')
WHERE id = 21641;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 6250;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 10455;
UPDATE word_frequencies 
SET form_type = 'subjunctive', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 17612;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 18272;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 18558;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 19300;
UPDATE word_frequencies 
SET form_type = 'past_participle', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 19302;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 33172;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 34190;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 38369;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'موندل')
WHERE id = 21672;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وڅښل')
WHERE id = 21678;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وختل')
WHERE id = 18163;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'وختل')
WHERE id = 25666;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وختل')
WHERE id = 35581;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وختل')
WHERE id = 35727;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'وختل')
WHERE id = 21691;
UPDATE word_frequencies 
SET form_type = 'present', base_verb = COALESCE(base_verb, 'مجدل')
WHERE id = 25355;
UPDATE word_frequencies 
SET form_type = 'past', base_verb = COALESCE(base_verb, 'مجدل')
WHERE id = 21752;