-- Mark All Verb Forms Based on LingDocs Master Chart
-- Reference: https://grammar.lingdocs.com/verbs/master-chart/
-- Reference: https://grammar.lingdocs.com/verbs/all-perfect-verbs/
-- Uses dictionary stems/roots data (no inference needed)

-- Add columns if missing
ALTER TABLE word_frequencies ADD COLUMN base_verb TEXT;
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Mark base verbs
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ټول' WHERE pashto_word = 'ټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شول' WHERE pashto_word = 'شول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تل' WHERE pashto_word = 'تل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کول' WHERE pashto_word = 'کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ډول' WHERE pashto_word = 'ډول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راټول' WHERE pashto_word = 'راټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اول' WHERE pashto_word = 'اول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غوښتل' WHERE pashto_word = 'غوښتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لیکل' WHERE pashto_word = 'لیکل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ویل' WHERE pashto_word = 'ویل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'واورېدل' WHERE pashto_word = 'واورېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'قبول' WHERE pashto_word = 'قبول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'یوځل' WHERE pashto_word = 'یوځل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورکول' WHERE pashto_word = 'ورکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لیدل' WHERE pashto_word = 'لیدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وژل' WHERE pashto_word = 'وژل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اصُول' WHERE pashto_word = 'اصُول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پرېښودل' WHERE pashto_word = 'پرېښودل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کېدل' WHERE pashto_word = 'کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اوسېدل' WHERE pashto_word = 'اوسېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کښې ېدل' WHERE pashto_word = 'کښې ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تلل' WHERE pashto_word = 'تلل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بوتلل' WHERE pashto_word = 'بوتلل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوستل' WHERE pashto_word = 'راوستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ونیول' WHERE pashto_word = 'ونیول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کتل' WHERE pashto_word = 'کتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وهل' WHERE pashto_word = 'وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نه ېدل' WHERE pashto_word = 'نه ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شاوول' WHERE pashto_word = 'شاوول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ته ېدل' WHERE pashto_word = 'ته ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'واچول' WHERE pashto_word = 'واچول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوړل' WHERE pashto_word = 'خوړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وشول' WHERE pashto_word = 'وشول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اخیستل' WHERE pashto_word = 'اخیستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'رسول' WHERE pashto_word = 'رسول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اورېدل' WHERE pashto_word = 'اورېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'محصُول' WHERE pashto_word = 'محصُول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ټاکل' WHERE pashto_word = 'ټاکل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'دا ېدل' WHERE pashto_word = 'دا ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مسوول' WHERE pashto_word = 'مسوول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کېښودل' WHERE pashto_word = 'کېښودل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اخستل' WHERE pashto_word = 'اخستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تول' WHERE pashto_word = 'تول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ساتل' WHERE pashto_word = 'ساتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کې ېدل' WHERE pashto_word = 'کې ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راتلل' WHERE pashto_word = 'راتلل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوړل' WHERE pashto_word = 'راوړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لرل' WHERE pashto_word = 'لرل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شان کړل' WHERE pashto_word = 'شان کړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'فضول' WHERE pashto_word = 'فضول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'جوړول' WHERE pashto_word = 'جوړول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هغوی ېدل' WHERE pashto_word = 'هغوی ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګڼل' WHERE pashto_word = 'ګڼل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورسېدل' WHERE pashto_word = 'ورسېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وغورځول' WHERE pashto_word = 'وغورځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وتښتېدل' WHERE pashto_word = 'وتښتېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وړل' WHERE pashto_word = 'وړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نیول' WHERE pashto_word = 'نیول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کارونه کړل' WHERE pashto_word = 'کارونه کړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لېږل' WHERE pashto_word = 'لېږل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ودرېدل' WHERE pashto_word = 'ودرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پاڅېدل' WHERE pashto_word = 'پاڅېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پوهېدل' WHERE pashto_word = 'پوهېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'يرېدل' WHERE pashto_word = 'يرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څۀ کول' WHERE pashto_word = 'څۀ کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څۀ کړل' WHERE pashto_word = 'څۀ کړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وتل' WHERE pashto_word = 'وتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څښل' WHERE pashto_word = 'څښل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ژړل' WHERE pashto_word = 'ژړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کښېناستل' WHERE pashto_word = 'کښېناستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اچول' WHERE pashto_word = 'اچول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سره ېدل' WHERE pashto_word = 'سره ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ننوتل' WHERE pashto_word = 'ننوتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نومېدل' WHERE pashto_word = 'نومېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شړل' WHERE pashto_word = 'شړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ودرول' WHERE pashto_word = 'ودرول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګرځېدل' WHERE pashto_word = 'ګرځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هلته ېدل' WHERE pashto_word = 'هلته ېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تړل' WHERE pashto_word = 'تړل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مسلسل' WHERE pashto_word = 'مسلسل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وسوزول' WHERE pashto_word = 'وسوزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولګول' WHERE pashto_word = 'ولګول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېژندل' WHERE pashto_word = 'پېژندل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بعلزبول' WHERE pashto_word = 'بعلزبول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'جوړېدل' WHERE pashto_word = 'جوړېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ویستل' WHERE pashto_word = 'ویستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښودل' WHERE pashto_word = 'ښودل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بخښل' WHERE pashto_word = 'بخښل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تېرېدل' WHERE pashto_word = 'تېرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راورسېدل' WHERE pashto_word = 'راورسېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سوځول' WHERE pashto_word = 'سوځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'منل' WHERE pashto_word = 'منل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پرانیستل' WHERE pashto_word = 'پرانیستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګول' WHERE pashto_word = 'ګول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'درلودل' WHERE pashto_word = 'درلودل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شپول' WHERE pashto_word = 'شپول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مشکل' WHERE pashto_word = 'مشکل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کارونه کول' WHERE pashto_word = 'کارونه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وسوځول' WHERE pashto_word = 'وسوځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پرېوتل' WHERE pashto_word = 'پرېوتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شمېرل' WHERE pashto_word = 'شمېرل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'منډې وهل' WHERE pashto_word = 'منډې وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ووېرېدل' WHERE pashto_word = 'ووېرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ويرېدل' WHERE pashto_word = 'ويرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ژغورل' WHERE pashto_word = 'ژغورل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'درکول' WHERE pashto_word = 'درکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'رېبل' WHERE pashto_word = 'رېبل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نيول' WHERE pashto_word = 'نيول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پوره کول' WHERE pashto_word = 'پوره کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'چیچل' WHERE pashto_word = 'چیچل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بچ کول' WHERE pashto_word = 'بچ کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوګرځېدل' WHERE pashto_word = 'راوګرځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زبول' WHERE pashto_word = 'زبول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شمول' WHERE pashto_word = 'شمول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'عبادت کول' WHERE pashto_word = 'عبادت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غورځول' WHERE pashto_word = 'غورځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نېکی کول' WHERE pashto_word = 'نېکی کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'واوړېدل' WHERE pashto_word = 'واوړېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وګرځېدل' WHERE pashto_word = 'وګرځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېش کول' WHERE pashto_word = 'پېش کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کارول' WHERE pashto_word = 'کارول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خبرې کول' WHERE pashto_word = 'خبرې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غورېدل' WHERE pashto_word = 'غورېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وخېژول' WHERE pashto_word = 'وخېژول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اصول' WHERE pashto_word = 'اصول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راپاڅېدل' WHERE pashto_word = 'راپاڅېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سپارل' WHERE pashto_word = 'سپارل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورسول' WHERE pashto_word = 'ورسول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وشکول' WHERE pashto_word = 'وشکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وېرېدل' WHERE pashto_word = 'وېرېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پاتې کېدل' WHERE pashto_word = 'پاتې کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ځان ساتل' WHERE pashto_word = 'ځان ساتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کار کول' WHERE pashto_word = 'کار کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کنډول' WHERE pashto_word = 'کنډول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بهېدل' WHERE pashto_word = 'بهېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حاصلول' WHERE pashto_word = 'حاصلول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ختمېدل' WHERE pashto_word = 'ختمېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'داخلېدل' WHERE pashto_word = 'داخلېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سنت کېدل' WHERE pashto_word = 'سنت کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سنتېدل' WHERE pashto_word = 'سنتېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سوزول' WHERE pashto_word = 'سوزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شرمېدل' WHERE pashto_word = 'شرمېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لوستل' WHERE pashto_word = 'لوستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'موندل' WHERE pashto_word = 'موندل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مړ کېدل' WHERE pashto_word = 'مړ کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولمسول' WHERE pashto_word = 'ولمسول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولټول' WHERE pashto_word = 'ولټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وېشل' WHERE pashto_word = 'وېشل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'يې کول' WHERE pashto_word = 'يې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېدل' WHERE pashto_word = 'پېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښکارېدل' WHERE pashto_word = 'ښکارېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کښېنول' WHERE pashto_word = 'کښېنول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بالکل' WHERE pashto_word = 'بالکل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بلل' WHERE pashto_word = 'بلل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بیانول' WHERE pashto_word = 'بیانول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تباه کول' WHERE pashto_word = 'تباه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تېرول' WHERE pashto_word = 'تېرول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'فخر کول' WHERE pashto_word = 'فخر کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'قبضه کول' WHERE pashto_word = 'قبضه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لګول' WHERE pashto_word = 'لګول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مړۀ کېدل' WHERE pashto_word = 'مړۀ کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورتلل' WHERE pashto_word = 'ورتلل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وهڅول' WHERE pashto_word = 'وهڅول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وځړول' WHERE pashto_word = 'وځړول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ازمایل' WHERE pashto_word = 'ازمایل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اعلانول' WHERE pashto_word = 'اعلانول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اغوستل' WHERE pashto_word = 'اغوستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تښتېدل' WHERE pashto_word = 'تښتېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خبره کول' WHERE pashto_word = 'خبره کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'داسې کول' WHERE pashto_word = 'داسې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوغورزول' WHERE pashto_word = 'راوغورزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زېږول' WHERE pashto_word = 'زېږول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سره کول' WHERE pashto_word = 'سره کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شاقول' WHERE pashto_word = 'شاقول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'عمل کول' WHERE pashto_word = 'عمل کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لټول' WHERE pashto_word = 'لټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مِلاوېدل' WHERE pashto_word = 'مِلاوېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورېدل' WHERE pashto_word = 'ورېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وزېږول' WHERE pashto_word = 'وزېږول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وغورېدل' WHERE pashto_word = 'وغورېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ټکول' WHERE pashto_word = 'ټکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ځورول' WHERE pashto_word = 'ځورول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ځړول' WHERE pashto_word = 'ځړول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اشتاول' WHERE pashto_word = 'اشتاول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اطاعت کول' WHERE pashto_word = 'اطاعت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اورول' WHERE pashto_word = 'اورول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حمله کول' WHERE pashto_word = 'حمله کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ختمول' WHERE pashto_word = 'ختمول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوشحالول' WHERE pashto_word = 'خوشحالول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'درناوی کول' WHERE pashto_word = 'درناوی کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راټولېدل' WHERE pashto_word = 'راټولېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راکول' WHERE pashto_word = 'راکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'رسېدل' WHERE pashto_word = 'رسېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'روغول' WHERE pashto_word = 'روغول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زخمى کول' WHERE pashto_word = 'زخمى کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زېږېدل' WHERE pashto_word = 'زېږېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غږول' WHERE pashto_word = 'غږول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'قتلول' WHERE pashto_word = 'قتلول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'قول' WHERE pashto_word = 'قول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مشغول' WHERE pashto_word = 'مشغول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'معلومول' WHERE pashto_word = 'معلومول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مینه کول' WHERE pashto_word = 'مینه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هڅول' WHERE pashto_word = 'هڅول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وادۀ کول' WHERE pashto_word = 'وادۀ کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وړاندې کول' WHERE pashto_word = 'وړاندې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څملاستل' WHERE pashto_word = 'څملاستل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کیندل' WHERE pashto_word = 'کیندل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګټل' WHERE pashto_word = 'ګټل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = '”اول' WHERE pashto_word = '”اول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'استعمالېدل' WHERE pashto_word = 'استعمالېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اشکول' WHERE pashto_word = 'اشکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'توږل' WHERE pashto_word = 'توږل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خبرول' WHERE pashto_word = 'خبرول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ختل' WHERE pashto_word = 'ختل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوځېدل' WHERE pashto_word = 'خوځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راستنېدل' WHERE pashto_word = 'راستنېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوغورځول' WHERE pashto_word = 'راوغورځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راونیول' WHERE pashto_word = 'راونیول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راټوکېدل' WHERE pashto_word = 'راټوکېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'روزل' WHERE pashto_word = 'روزل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زغمل' WHERE pashto_word = 'زغمل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'عزت کول' WHERE pashto_word = 'عزت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غوڅول' WHERE pashto_word = 'غوڅول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لګېدل' WHERE pashto_word = 'لګېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ماتول' WHERE pashto_word = 'ماتول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ملنډې وهل' WHERE pashto_word = 'ملنډې وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وشلول' WHERE pashto_word = 'وشلول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولړزېدل' WHERE pashto_word = 'ولړزېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پوهول' WHERE pashto_word = 'پوهول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېدا کول' WHERE pashto_word = 'پېدا کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښخول' WHERE pashto_word = 'ښخول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښېګړه کول' WHERE pashto_word = 'ښېګړه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګرځول' WHERE pashto_word = 'ګرځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = '”ټول' WHERE pashto_word = '”ټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = '«ټول' WHERE pashto_word = '«ټول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'آبادول' WHERE pashto_word = 'آبادول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اختر کول' WHERE pashto_word = 'اختر کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ادا کول' WHERE pashto_word = 'ادا کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اوبدل' WHERE pashto_word = 'اوبدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بحث کول' WHERE pashto_word = 'بحث کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بدلېدل' WHERE pashto_word = 'بدلېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بندول' WHERE pashto_word = 'بندول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بندېدل' WHERE pashto_word = 'بندېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بېول' WHERE pashto_word = 'بېول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حکومت کول' WHERE pashto_word = 'حکومت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خندل' WHERE pashto_word = 'خندل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوشحالېدل' WHERE pashto_word = 'خوشحالېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خِدمت کول' WHERE pashto_word = 'خِدمت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راجمع کېدل' WHERE pashto_word = 'راجمع کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راغورزېدل' WHERE pashto_word = 'راغورزېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راغورځول' WHERE pashto_word = 'راغورځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوتل' WHERE pashto_word = 'راوتل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوپارول' WHERE pashto_word = 'راوپارول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'رټل' WHERE pashto_word = 'رټل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زورول' WHERE pashto_word = 'زورول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زول' WHERE pashto_word = 'زول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سرني وهل' WHERE pashto_word = 'سرني وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شان کول' WHERE pashto_word = 'شان کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'صبر کول' WHERE pashto_word = 'صبر کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'صِفت کول' WHERE pashto_word = 'صِفت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غوړول' WHERE pashto_word = 'غوړول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لمانځل' WHERE pashto_word = 'لمانځل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'محصول' WHERE pashto_word = 'محصول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'معقول' WHERE pashto_word = 'معقول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مړۀ کول' WHERE pashto_word = 'مړۀ کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وجنګېدل' WHERE pashto_word = 'وجنګېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وروغورزول' WHERE pashto_word = 'وروغورزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وسوځېدل' WHERE pashto_word = 'وسوځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وصول' WHERE pashto_word = 'وصول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وغورزول' WHERE pashto_word = 'وغورزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولوېدل' WHERE pashto_word = 'ولوېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ولړزول' WHERE pashto_word = 'ولړزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پیروي کول' WHERE pashto_word = 'پیروي کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څرګندول' WHERE pashto_word = 'څرګندول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ژوندى کول' WHERE pashto_word = 'ژوندى کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښکاره کول' WHERE pashto_word = 'ښکاره کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښکاره کېدل' WHERE pashto_word = 'ښکاره کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کنترول' WHERE pashto_word = 'کنترول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'یادېدل' WHERE pashto_word = 'یادېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'استعمالول' WHERE pashto_word = 'استعمالول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'اندازه کول' WHERE pashto_word = 'اندازه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'او وهل' WHERE pashto_word = 'او وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ايسارېدل' WHERE pashto_word = 'ايسارېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'باندې وهل' WHERE pashto_word = 'باندې وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بحثونه کول' WHERE pashto_word = 'بحثونه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'بويول' WHERE pashto_word = 'بويول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تارکول' WHERE pashto_word = 'تارکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تاوېدل' WHERE pashto_word = 'تاوېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تباه کېدل' WHERE pashto_word = 'تباه کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تر‌لاسه کول' WHERE pashto_word = 'تر‌لاسه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'تقسيمول' WHERE pashto_word = 'تقسيمول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'توېدل' WHERE pashto_word = 'توېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حلالول' WHERE pashto_word = 'حلالول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حمول' WHERE pashto_word = 'حمول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'حِفاظت کول' WHERE pashto_word = 'حِفاظت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خدمت کول' WHERE pashto_word = 'خدمت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خرڅول' WHERE pashto_word = 'خرڅول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خلاصېدل' WHERE pashto_word = 'خلاصېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوراکونه کول' WHERE pashto_word = 'خوراکونه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوځول' WHERE pashto_word = 'خوځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'خوښېدل' WHERE pashto_word = 'خوښېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'درول' WHERE pashto_word = 'درول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'درېدل' WHERE pashto_word = 'درېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'دى کول' WHERE pashto_word = 'دى کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوشوکول' WHERE pashto_word = 'راوشوکول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راوغورځېدل' WHERE pashto_word = 'راوغورځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راټولول' WHERE pashto_word = 'راټولول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'راژوندي کول' WHERE pashto_word = 'راژوندي کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'رد کېدل' WHERE pashto_word = 'رد کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زبيرګى کول' WHERE pashto_word = 'زبيرګى کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'زنا کول' WHERE pashto_word = 'زنا کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سنتول' WHERE pashto_word = 'سنتول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سنګسارول' WHERE pashto_word = 'سنګسارول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سوځېدل' WHERE pashto_word = 'سوځېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'سږکال' WHERE pashto_word = 'سږکال';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شنۀ کېدل' WHERE pashto_word = 'شنۀ کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'شڼېدل' WHERE pashto_word = 'شڼېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'عاجز کول' WHERE pashto_word = 'عاجز کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غورزول' WHERE pashto_word = 'غورزول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'غوره کول' WHERE pashto_word = 'غوره کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لافې وهل' WHERE pashto_word = 'لافې وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لامبل' WHERE pashto_word = 'لامبل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لانجه کول' WHERE pashto_word = 'لانجه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ليکل کول' WHERE pashto_word = 'ليکل کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لړزېدل' WHERE pashto_word = 'لړزېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'لېږدول' WHERE pashto_word = 'لېږدول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مجبورول' WHERE pashto_word = 'مجبورول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مطابق کول' WHERE pashto_word = 'مطابق کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'منع کول' WHERE pashto_word = 'منع کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مو کول' WHERE pashto_word = 'مو کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مِنتُونه کول' WHERE pashto_word = 'مِنتُونه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'مړ کول' WHERE pashto_word = 'مړ کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نازلېدل' WHERE pashto_word = 'نازلېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نفرت کول' WHERE pashto_word = 'نفرت کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'نۀ کېدل' WHERE pashto_word = 'نۀ کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هغه وهل' WHERE pashto_word = 'هغه وهل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هغې کول' WHERE pashto_word = 'هغې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'هم کول' WHERE pashto_word = 'هم کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'واستول' WHERE pashto_word = 'واستول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'واپس کېدل' WHERE pashto_word = 'واپس کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وخوځول' WHERE pashto_word = 'وخوځول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورانول' WHERE pashto_word = 'ورانول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ورواوړېدل' WHERE pashto_word = 'ورواوړېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وشرمول' WHERE pashto_word = 'وشرمول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وشرمېدل' WHERE pashto_word = 'وشرمېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وغوړول' WHERE pashto_word = 'وغوړول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وپړقول' WHERE pashto_word = 'وپړقول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وځورول' WHERE pashto_word = 'وځورول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وښویېدل' WHERE pashto_word = 'وښویېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'وکارول' WHERE pashto_word = 'وکارول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ټېله کول' WHERE pashto_word = 'ټېله کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پخول' WHERE pashto_word = 'پخول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېش کېدل' WHERE pashto_word = 'پېش کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'پېښېدل' WHERE pashto_word = 'پېښېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ځلېدل' WHERE pashto_word = 'ځلېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ځپل' WHERE pashto_word = 'ځپل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څارل' WHERE pashto_word = 'څارل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'څملول' WHERE pashto_word = 'څملول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'چلول' WHERE pashto_word = 'چلول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'چې کول' WHERE pashto_word = 'چې کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ژوند کول' WHERE pashto_word = 'ژوند کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښخېدل' WHERE pashto_word = 'ښخېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ښکلول' WHERE pashto_word = 'ښکلول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کابول' WHERE pashto_word = 'کابول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'کل‌کُول' WHERE pashto_word = 'کل‌کُول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګناه کول' WHERE pashto_word = 'ګناه کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګنډل' WHERE pashto_word = 'ګنډل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'ګډېدل' WHERE pashto_word = 'ګډېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = 'یوځای کېدل' WHERE pashto_word = 'یوځای کېدل';
UPDATE word_frequencies SET word_type = 'verb', base_verb = '‎کول' WHERE pashto_word = '‎کول';
UPDATE word_frequencies SET word_type = 'verb', base_verb = '”داسې کول' WHERE pashto_word = '”داسې کول';

-- Mark verb conjugations
-- Conjugations of شول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شول', has_issues = 0 WHERE pashto_word = 'شوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شول', has_issues = 0 WHERE pashto_word = 'شوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شول', has_issues = 0 WHERE pashto_word = 'شوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شول', has_issues = 0 WHERE pashto_word = 'وشول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شول', has_issues = 0 WHERE pashto_word = 'وشوې';

-- Conjugations of تل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تل', has_issues = 0 WHERE pashto_word = 'تو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تل', has_issues = 0 WHERE pashto_word = 'تې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تل', has_issues = 0 WHERE pashto_word = 'وتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تل', has_issues = 0 WHERE pashto_word = 'وتو';

-- Conjugations of کول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'وکړئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'وکړل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'وکړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'وکړو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'وکړې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'کوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'کوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کول', has_issues = 0 WHERE pashto_word = 'کوې';

-- Conjugations of اول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اول', has_issues = 0 WHERE pashto_word = 'اوو';

-- Conjugations of غوښتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'غواړئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'غواړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'غواړو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'غواړې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'وغوښتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوښتل', has_issues = 0 WHERE pashto_word = 'وغوښتو';

-- Conjugations of لیکل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیکل', has_issues = 0 WHERE pashto_word = 'لیکم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیکل', has_issues = 0 WHERE pashto_word = 'لیکو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیکل', has_issues = 0 WHERE pashto_word = 'ولیکل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیکل', has_issues = 0 WHERE pashto_word = 'ولیکم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیکل', has_issues = 0 WHERE pashto_word = 'ولیکو';

-- Conjugations of ویل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ویل', has_issues = 0 WHERE pashto_word = 'ویل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ویل', has_issues = 0 WHERE pashto_word = 'ویې';

-- Conjugations of واورېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واورېدل', has_issues = 0 WHERE pashto_word = 'واورېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واورېدل', has_issues = 0 WHERE pashto_word = 'واورېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واورېدل', has_issues = 0 WHERE pashto_word = 'واورېدې';

-- Conjugations of ورکول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورکول', has_issues = 0 WHERE pashto_word = 'ورکول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورکول', has_issues = 0 WHERE pashto_word = 'ورکوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورکول', has_issues = 0 WHERE pashto_word = 'ورکوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورکول', has_issues = 0 WHERE pashto_word = 'ورکوې';

-- Conjugations of لیدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'لیدلی یې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'ولیدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'ولیدې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'وینم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'وینو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لیدل', has_issues = 0 WHERE pashto_word = 'وینې';

-- Conjugations of وژل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژلی یې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژنم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژنو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژني';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وژل', has_issues = 0 WHERE pashto_word = 'وژنې';

-- Conjugations of پرېښودل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېښودل', has_issues = 0 WHERE pashto_word = 'پرېږدئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېښودل', has_issues = 0 WHERE pashto_word = 'پرېږدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېښودل', has_issues = 0 WHERE pashto_word = 'پرېږدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېښودل', has_issues = 0 WHERE pashto_word = 'پرېږدې';

-- Conjugations of کېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېدل', has_issues = 0 WHERE pashto_word = 'وشو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېدل', has_issues = 0 WHERE pashto_word = 'وشول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېدل', has_issues = 0 WHERE pashto_word = 'کېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېدل', has_issues = 0 WHERE pashto_word = 'کېدې';

-- Conjugations of اوسېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اوسېدل', has_issues = 0 WHERE pashto_word = 'اوسېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اوسېدل', has_issues = 0 WHERE pashto_word = 'اوسېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اوسېدل', has_issues = 0 WHERE pashto_word = 'اوسېدې';

-- Conjugations of تلل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'تلو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'تلې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'وتلل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'وتلو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'وتلي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تلل', has_issues = 0 WHERE pashto_word = 'وتلې';

-- Conjugations of بوتلل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بوتلل', has_issues = 0 WHERE pashto_word = 'بوځم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بوتلل', has_issues = 0 WHERE pashto_word = 'بوځي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بوتلل', has_issues = 0 WHERE pashto_word = 'بوځې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بوتلل', has_issues = 0 WHERE pashto_word = 'بیایي';

-- Conjugations of راوستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوستل', has_issues = 0 WHERE pashto_word = 'راولم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوستل', has_issues = 0 WHERE pashto_word = 'راولو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوستل', has_issues = 0 WHERE pashto_word = 'راولې';

-- Conjugations of ونیول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ونیول', has_issues = 0 WHERE pashto_word = 'ونیول';

-- Conjugations of کتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کتل', has_issues = 0 WHERE pashto_word = 'وکتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کتل', has_issues = 0 WHERE pashto_word = 'ګورئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کتل', has_issues = 0 WHERE pashto_word = 'ګورم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کتل', has_issues = 0 WHERE pashto_word = 'ګورو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کتل', has_issues = 0 WHERE pashto_word = 'ګورې';

-- Conjugations of وهل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهل', has_issues = 0 WHERE pashto_word = 'وهل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهل', has_issues = 0 WHERE pashto_word = 'وهم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهل', has_issues = 0 WHERE pashto_word = 'وهې';

-- Conjugations of واچول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واچول', has_issues = 0 WHERE pashto_word = 'واچول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واچول', has_issues = 0 WHERE pashto_word = 'واچوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واچول', has_issues = 0 WHERE pashto_word = 'واچوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واچول', has_issues = 0 WHERE pashto_word = 'واچوي';

-- Conjugations of خوړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'خورئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'خورم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'خورو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'خورې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'وخوړل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوړل', has_issues = 0 WHERE pashto_word = 'وخوړو';

-- Conjugations of وشول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشول', has_issues = 0 WHERE pashto_word = 'وشول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشول', has_issues = 0 WHERE pashto_word = 'وشوې';

-- Conjugations of اخیستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخیستل', has_issues = 0 WHERE pashto_word = 'اخلم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخیستل', has_issues = 0 WHERE pashto_word = 'اخلو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخیستل', has_issues = 0 WHERE pashto_word = 'اخلې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخیستل', has_issues = 0 WHERE pashto_word = 'واخیستل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخیستل', has_issues = 0 WHERE pashto_word = 'واخیستې';

-- Conjugations of رسول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'رسوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'رسوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'رسوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'ورسول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'ورسوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'ورسوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'ورسوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسول', has_issues = 0 WHERE pashto_word = 'ورسوې';

-- Conjugations of اورېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'اورم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'اورو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'اورې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'واورېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'واورېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورېدل', has_issues = 0 WHERE pashto_word = 'واورېدې';

-- Conjugations of ټاکل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ټاکل', has_issues = 0 WHERE pashto_word = 'وټاکل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ټاکل', has_issues = 0 WHERE pashto_word = 'وټاکم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ټاکل', has_issues = 0 WHERE pashto_word = 'وټاکي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ټاکل', has_issues = 0 WHERE pashto_word = 'ټاکي';

-- Conjugations of کېښودل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'ږدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'ږدي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'ږدې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'کېږدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'کېږدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'کېږدي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کېښودل', has_issues = 0 WHERE pashto_word = 'کېږدې';

-- Conjugations of اخستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'اخلم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'اخلو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'اخلې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'واخستل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'واخستو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اخستل', has_issues = 0 WHERE pashto_word = 'واخستې';

-- Conjugations of ساتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'ساتئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'ساتم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'ساتو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'ساتې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'وساتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'وساتم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'وساتو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'وساتي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ساتل', has_issues = 0 WHERE pashto_word = 'وساتې';

-- Conjugations of راتلل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راشئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راشم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راشې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راغلل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راځئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راځم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راځو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راتلل', has_issues = 0 WHERE pashto_word = 'راځې';

-- Conjugations of راوړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوړل', has_issues = 0 WHERE pashto_word = 'راوړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوړل', has_issues = 0 WHERE pashto_word = 'راوړو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوړل', has_issues = 0 WHERE pashto_word = 'راوړې';

-- Conjugations of لرل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'لرئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'لرم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'لرو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'لرې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'ولرم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'ولرو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لرل', has_issues = 0 WHERE pashto_word = 'ولرې';

-- Conjugations of جوړول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'جوړول', has_issues = 0 WHERE pashto_word = 'جوړوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'جوړول', has_issues = 0 WHERE pashto_word = 'جوړوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'جوړول', has_issues = 0 WHERE pashto_word = 'جوړوې';

-- Conjugations of ګڼل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'وګڼل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'وګڼم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'وګڼې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'ګڼم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'ګڼو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'ګڼي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګڼل', has_issues = 0 WHERE pashto_word = 'ګڼې';

-- Conjugations of ورسېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدو';

-- Conjugations of وغورځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورځول', has_issues = 0 WHERE pashto_word = 'وغورځول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورځول', has_issues = 0 WHERE pashto_word = 'وغورځوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورځول', has_issues = 0 WHERE pashto_word = 'وغورځوي';

-- Conjugations of وتښتېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتښتېدل', has_issues = 0 WHERE pashto_word = 'وتښتېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتښتېدل', has_issues = 0 WHERE pashto_word = 'وتښتېدو';

-- Conjugations of وړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'وړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'وړو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'وړې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'یوسم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'یوسي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړل', has_issues = 0 WHERE pashto_word = 'یوسې';

-- Conjugations of نیول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نیول', has_issues = 0 WHERE pashto_word = 'نیسم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نیول', has_issues = 0 WHERE pashto_word = 'نیسو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نیول', has_issues = 0 WHERE pashto_word = 'نیسې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نیول', has_issues = 0 WHERE pashto_word = 'ونیول';

-- Conjugations of لېږل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لېږل', has_issues = 0 WHERE pashto_word = 'لېږم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لېږل', has_issues = 0 WHERE pashto_word = 'لېږې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لېږل', has_issues = 0 WHERE pashto_word = 'ولېږل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لېږل', has_issues = 0 WHERE pashto_word = 'ولېږم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لېږل', has_issues = 0 WHERE pashto_word = 'ولېږو';

-- Conjugations of ودرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ودرېدل', has_issues = 0 WHERE pashto_word = 'ودرېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ودرېدل', has_issues = 0 WHERE pashto_word = 'ودرېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ودرېدل', has_issues = 0 WHERE pashto_word = 'ودرېدو';

-- Conjugations of پاڅېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پاڅېدل', has_issues = 0 WHERE pashto_word = 'پاڅېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پاڅېدل', has_issues = 0 WHERE pashto_word = 'پاڅېدو';

-- Conjugations of پوهېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پوهېدل', has_issues = 0 WHERE pashto_word = 'پوهېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پوهېدل', has_issues = 0 WHERE pashto_word = 'پوهېدو';

-- Conjugations of يرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'يرېدل', has_issues = 0 WHERE pashto_word = 'ويرېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'يرېدل', has_issues = 0 WHERE pashto_word = 'ويرېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'يرېدل', has_issues = 0 WHERE pashto_word = 'يرېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'يرېدل', has_issues = 0 WHERE pashto_word = 'يرېدو';

-- Conjugations of وتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتل', has_issues = 0 WHERE pashto_word = 'وتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتل', has_issues = 0 WHERE pashto_word = 'وتو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتل', has_issues = 0 WHERE pashto_word = 'وځي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وتل', has_issues = 0 WHERE pashto_word = 'وځې';

-- Conjugations of څښل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'وڅښل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'وڅښم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'وڅښو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'وڅښي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'وڅښې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'څښم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'څښو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'څښي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څښل', has_issues = 0 WHERE pashto_word = 'څښې';

-- Conjugations of ژړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژړل', has_issues = 0 WHERE pashto_word = 'وژړل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژړل', has_issues = 0 WHERE pashto_word = 'ژاړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژړل', has_issues = 0 WHERE pashto_word = 'ژاړي';

-- Conjugations of کښېناستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کښېناستل', has_issues = 0 WHERE pashto_word = 'کښېنم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کښېناستل', has_issues = 0 WHERE pashto_word = 'کښېني';

-- Conjugations of اچول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'اچوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'اچوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'اچوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'اچوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'واچول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'واچوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'واچوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اچول', has_issues = 0 WHERE pashto_word = 'واچوي';

-- Conjugations of ننوتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ننوتل', has_issues = 0 WHERE pashto_word = 'ننوتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ننوتل', has_issues = 0 WHERE pashto_word = 'ننوځي';

-- Conjugations of شړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شړل', has_issues = 0 WHERE pashto_word = 'شړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شړل', has_issues = 0 WHERE pashto_word = 'وشړل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شړل', has_issues = 0 WHERE pashto_word = 'وشړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شړل', has_issues = 0 WHERE pashto_word = 'وشړي';

-- Conjugations of ودرول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ودرول', has_issues = 0 WHERE pashto_word = 'ودرول';

-- Conjugations of ګرځېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګرځېدل', has_issues = 0 WHERE pashto_word = 'وګرځېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګرځېدل', has_issues = 0 WHERE pashto_word = 'وګرځېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګرځېدل', has_issues = 0 WHERE pashto_word = 'ګرځېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګرځېدل', has_issues = 0 WHERE pashto_word = 'ګرځېدو';

-- Conjugations of تړل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'تړي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'وتړل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'وتړم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'وتړو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'وتړي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تړل', has_issues = 0 WHERE pashto_word = 'وتړې';

-- Conjugations of وسوزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوزول', has_issues = 0 WHERE pashto_word = 'وسوزول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوزول', has_issues = 0 WHERE pashto_word = 'وسوزوو';

-- Conjugations of ولګول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولګول', has_issues = 0 WHERE pashto_word = 'ولګول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولګول', has_issues = 0 WHERE pashto_word = 'ولګوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولګول', has_issues = 0 WHERE pashto_word = 'ولګوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولګول', has_issues = 0 WHERE pashto_word = 'ولګوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولګول', has_issues = 0 WHERE pashto_word = 'ولګوې';

-- Conjugations of پېژندل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېژندل', has_issues = 0 WHERE pashto_word = 'وپېژندل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېژندل', has_issues = 0 WHERE pashto_word = 'وپېژندو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېژندل', has_issues = 0 WHERE pashto_word = 'پېژنم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېژندل', has_issues = 0 WHERE pashto_word = 'پېژني';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېژندل', has_issues = 0 WHERE pashto_word = 'پېژنې';

-- Conjugations of جوړېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'جوړېدل', has_issues = 0 WHERE pashto_word = 'جوړېدو';

-- Conjugations of ویستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ویستل', has_issues = 0 WHERE pashto_word = 'وباسم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ویستل', has_issues = 0 WHERE pashto_word = 'وباسې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ویستل', has_issues = 0 WHERE pashto_word = 'ویستل';

-- Conjugations of ښودل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښودل', has_issues = 0 WHERE pashto_word = 'وښودل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښودل', has_issues = 0 WHERE pashto_word = 'وښودې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښودل', has_issues = 0 WHERE pashto_word = 'ښایم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښودل', has_issues = 0 WHERE pashto_word = 'ښایي';

-- Conjugations of بخښل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'بخښو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'بخښي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'بخښې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'وبخښل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'وبخښم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بخښل', has_issues = 0 WHERE pashto_word = 'وبخښي';

-- Conjugations of تېرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تېرېدل', has_issues = 0 WHERE pashto_word = 'تېرېدو';

-- Conjugations of راورسېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راورسېدل', has_issues = 0 WHERE pashto_word = 'راورسېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راورسېدل', has_issues = 0 WHERE pashto_word = 'راورسېدو';

-- Conjugations of سوځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوځول', has_issues = 0 WHERE pashto_word = 'سوځوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوځول', has_issues = 0 WHERE pashto_word = 'وسوځول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوځول', has_issues = 0 WHERE pashto_word = 'وسوځوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوځول', has_issues = 0 WHERE pashto_word = 'وسوځوي';

-- Conjugations of منل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'منم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'منو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'منې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'ومنل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'ومنم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'ومنو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'ومني';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'منل', has_issues = 0 WHERE pashto_word = 'ومنې';

-- Conjugations of درلودل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درلودل', has_issues = 0 WHERE pashto_word = 'لرئ';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درلودل', has_issues = 0 WHERE pashto_word = 'لرم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درلودل', has_issues = 0 WHERE pashto_word = 'لرو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درلودل', has_issues = 0 WHERE pashto_word = 'لرې';

-- Conjugations of مشکل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'مشکل', has_issues = 0 WHERE pashto_word = 'مشکو';

-- Conjugations of وسوځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوځول', has_issues = 0 WHERE pashto_word = 'وسوځول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوځول', has_issues = 0 WHERE pashto_word = 'وسوځوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوځول', has_issues = 0 WHERE pashto_word = 'وسوځوي';

-- Conjugations of پرېوتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېوتل', has_issues = 0 WHERE pashto_word = 'پرېوتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پرېوتل', has_issues = 0 WHERE pashto_word = 'پرېوځي';

-- Conjugations of شمېرل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شمېرل', has_issues = 0 WHERE pashto_word = 'شمېرې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شمېرل', has_issues = 0 WHERE pashto_word = 'وشمېرل';

-- Conjugations of ووېرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ووېرېدل', has_issues = 0 WHERE pashto_word = 'ووېرېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ووېرېدل', has_issues = 0 WHERE pashto_word = 'ووېرېدم';

-- Conjugations of ويرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ويرېدل', has_issues = 0 WHERE pashto_word = 'ويرېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ويرېدل', has_issues = 0 WHERE pashto_word = 'ويرېدو';

-- Conjugations of ژغورل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'وژغورل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'وژغورم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'وژغوري';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'وژغورې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'ژغورم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'ژغوري';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ژغورل', has_issues = 0 WHERE pashto_word = 'ژغورې';

-- Conjugations of درکول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درکول', has_issues = 0 WHERE pashto_word = 'درکوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درکول', has_issues = 0 WHERE pashto_word = 'درکوو';

-- Conjugations of رېبل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رېبل', has_issues = 0 WHERE pashto_word = 'رېبم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رېبل', has_issues = 0 WHERE pashto_word = 'رېبې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رېبل', has_issues = 0 WHERE pashto_word = 'ورېبل';

-- Conjugations of نيول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نيول', has_issues = 0 WHERE pashto_word = 'ونيوو';

-- Conjugations of راوګرځېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوګرځېدل', has_issues = 0 WHERE pashto_word = 'راوګرځېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوګرځېدل', has_issues = 0 WHERE pashto_word = 'راوګرځېدو';

-- Conjugations of غورځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورځول', has_issues = 0 WHERE pashto_word = 'غورځوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورځول', has_issues = 0 WHERE pashto_word = 'غورځوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورځول', has_issues = 0 WHERE pashto_word = 'وغورځول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورځول', has_issues = 0 WHERE pashto_word = 'وغورځوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورځول', has_issues = 0 WHERE pashto_word = 'وغورځوي';

-- Conjugations of واوړېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واوړېدل', has_issues = 0 WHERE pashto_word = 'واوړېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واوړېدل', has_issues = 0 WHERE pashto_word = 'واوړېدو';

-- Conjugations of وګرځېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وګرځېدل', has_issues = 0 WHERE pashto_word = 'وګرځېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وګرځېدل', has_issues = 0 WHERE pashto_word = 'وګرځېدو';

-- Conjugations of کارول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کارول', has_issues = 0 WHERE pashto_word = 'وکارول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کارول', has_issues = 0 WHERE pashto_word = 'کاروي';

-- Conjugations of غورېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورېدل', has_issues = 0 WHERE pashto_word = 'وغورېدل';

-- Conjugations of وخېژول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وخېژول', has_issues = 0 WHERE pashto_word = 'وخېژول';

-- Conjugations of راپاڅېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راپاڅېدل', has_issues = 0 WHERE pashto_word = 'راپاڅېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راپاڅېدل', has_issues = 0 WHERE pashto_word = 'راپاڅېدو';

-- Conjugations of سپارل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سپارل', has_issues = 0 WHERE pashto_word = 'وسپارل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سپارل', has_issues = 0 WHERE pashto_word = 'وسپاري';

-- Conjugations of ورسول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسول', has_issues = 0 WHERE pashto_word = 'ورسول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسول', has_issues = 0 WHERE pashto_word = 'ورسوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسول', has_issues = 0 WHERE pashto_word = 'ورسوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسول', has_issues = 0 WHERE pashto_word = 'ورسوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورسول', has_issues = 0 WHERE pashto_word = 'ورسوې';

-- Conjugations of وشکول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشکول', has_issues = 0 WHERE pashto_word = 'وشکول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشکول', has_issues = 0 WHERE pashto_word = 'وشکوم';

-- Conjugations of وېرېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وېرېدل', has_issues = 0 WHERE pashto_word = 'وېرېدل';

-- Conjugations of بهېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بهېدل', has_issues = 0 WHERE pashto_word = 'وبهېدې';

-- Conjugations of ختمېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ختمېدل', has_issues = 0 WHERE pashto_word = 'ختمېدو';

-- Conjugations of داخلېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'داخلېدل', has_issues = 0 WHERE pashto_word = 'داخلېدو';

-- Conjugations of سنتېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سنتېدل', has_issues = 0 WHERE pashto_word = 'سنتېدو';

-- Conjugations of سوزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوزول', has_issues = 0 WHERE pashto_word = 'وسوزول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوزول', has_issues = 0 WHERE pashto_word = 'وسوزوو';

-- Conjugations of شرمېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'شرمېدل', has_issues = 0 WHERE pashto_word = 'وشرمېدل';

-- Conjugations of لوستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لوستل', has_issues = 0 WHERE pashto_word = 'ولوستل';

-- Conjugations of موندل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'موندل', has_issues = 0 WHERE pashto_word = 'مومم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'موندل', has_issues = 0 WHERE pashto_word = 'مومو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'موندل', has_issues = 0 WHERE pashto_word = 'مومي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'موندل', has_issues = 0 WHERE pashto_word = 'وموندل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'موندل', has_issues = 0 WHERE pashto_word = 'وموندو';

-- Conjugations of ولمسول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولمسول', has_issues = 0 WHERE pashto_word = 'ولمسول';

-- Conjugations of ولټول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولټول', has_issues = 0 WHERE pashto_word = 'ولټول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولټول', has_issues = 0 WHERE pashto_word = 'ولټوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولټول', has_issues = 0 WHERE pashto_word = 'ولټوې';

-- Conjugations of وېشل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وېشل', has_issues = 0 WHERE pashto_word = 'وېشل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وېشل', has_issues = 0 WHERE pashto_word = 'وېشي';

-- Conjugations of ښکارېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښکارېدل', has_issues = 0 WHERE pashto_word = 'ښکارېدو';

-- Conjugations of بلل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بلل', has_issues = 0 WHERE pashto_word = 'وبلل';

-- Conjugations of بیانول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بیانول', has_issues = 0 WHERE pashto_word = 'بیانوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'بیانول', has_issues = 0 WHERE pashto_word = 'بیانوي';

-- Conjugations of تېرول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تېرول', has_issues = 0 WHERE pashto_word = 'تېروم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تېرول', has_issues = 0 WHERE pashto_word = 'تېروو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تېرول', has_issues = 0 WHERE pashto_word = 'تېروي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تېرول', has_issues = 0 WHERE pashto_word = 'تېروې';

-- Conjugations of لګول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'لګوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'لګوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'لګوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'ولګول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'ولګوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'ولګوو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'ولګوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګول', has_issues = 0 WHERE pashto_word = 'ولګوې';

-- Conjugations of ورتلل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورشم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورشو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورشي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورغلل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورځم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورځو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورځي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورتلل', has_issues = 0 WHERE pashto_word = 'ورځې';

-- Conjugations of وهڅول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهڅول', has_issues = 0 WHERE pashto_word = 'وهڅول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهڅول', has_issues = 0 WHERE pashto_word = 'وهڅوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وهڅول', has_issues = 0 WHERE pashto_word = 'وهڅوي';

-- Conjugations of وځړول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وځړول', has_issues = 0 WHERE pashto_word = 'وځړول';

-- Conjugations of ازمایل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ازمایل', has_issues = 0 WHERE pashto_word = 'وازمایل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ازمایل', has_issues = 0 WHERE pashto_word = 'وازمایي';

-- Conjugations of اعلانول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اعلانول', has_issues = 0 WHERE pashto_word = 'اعلانوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اعلانول', has_issues = 0 WHERE pashto_word = 'اعلانوي';

-- Conjugations of اغوستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اغوستل', has_issues = 0 WHERE pashto_word = 'واغوستل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اغوستل', has_issues = 0 WHERE pashto_word = 'واغوستې';

-- Conjugations of تښتېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تښتېدل', has_issues = 0 WHERE pashto_word = 'تښتېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تښتېدل', has_issues = 0 WHERE pashto_word = 'وتښتېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تښتېدل', has_issues = 0 WHERE pashto_word = 'وتښتېدو';

-- Conjugations of راوغورزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوغورزول', has_issues = 0 WHERE pashto_word = 'راوغورزوم';

-- Conjugations of زېږول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زېږول', has_issues = 0 WHERE pashto_word = 'زېږولی یې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زېږول', has_issues = 0 WHERE pashto_word = 'زېږوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زېږول', has_issues = 0 WHERE pashto_word = 'وزېږول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زېږول', has_issues = 0 WHERE pashto_word = 'وزېږوي';

-- Conjugations of لټول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لټول', has_issues = 0 WHERE pashto_word = 'لټوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لټول', has_issues = 0 WHERE pashto_word = 'ولټول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لټول', has_issues = 0 WHERE pashto_word = 'ولټوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لټول', has_issues = 0 WHERE pashto_word = 'ولټوې';

-- Conjugations of مِلاوېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'مِلاوېدل', has_issues = 0 WHERE pashto_word = 'مِلاوېدو';

-- Conjugations of ورېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورېدل', has_issues = 0 WHERE pashto_word = 'ورېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورېدل', has_issues = 0 WHERE pashto_word = 'ورېدو';

-- Conjugations of وزېږول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وزېږول', has_issues = 0 WHERE pashto_word = 'وزېږول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وزېږول', has_issues = 0 WHERE pashto_word = 'وزېږوي';

-- Conjugations of وغورېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورېدل', has_issues = 0 WHERE pashto_word = 'وغورېدل';

-- Conjugations of ځورول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ځورول', has_issues = 0 WHERE pashto_word = 'وځورول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ځورول', has_issues = 0 WHERE pashto_word = 'ځوروي';

-- Conjugations of ځړول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ځړول', has_issues = 0 WHERE pashto_word = 'وځړول';

-- Conjugations of اورول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اورول', has_issues = 0 WHERE pashto_word = 'اوروي';

-- Conjugations of راټولېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راټولېدل', has_issues = 0 WHERE pashto_word = 'راټولېدو';

-- Conjugations of راکول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راکول', has_issues = 0 WHERE pashto_word = 'راکوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راکول', has_issues = 0 WHERE pashto_word = 'راکوې';

-- Conjugations of رسېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسېدل', has_issues = 0 WHERE pashto_word = 'رسېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رسېدل', has_issues = 0 WHERE pashto_word = 'ورسېدو';

-- Conjugations of روغول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'روغول', has_issues = 0 WHERE pashto_word = 'روغوي';

-- Conjugations of زېږېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زېږېدل', has_issues = 0 WHERE pashto_word = 'زېږېدو';

-- Conjugations of قتلول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'قتلول', has_issues = 0 WHERE pashto_word = 'قتلوي';

-- Conjugations of قول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'قول', has_issues = 0 WHERE pashto_word = 'قوم';

-- Conjugations of معلومول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'معلومول', has_issues = 0 WHERE pashto_word = 'معلوموې';

-- Conjugations of هڅول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'هڅول', has_issues = 0 WHERE pashto_word = 'هڅوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'هڅول', has_issues = 0 WHERE pashto_word = 'وهڅول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'هڅول', has_issues = 0 WHERE pashto_word = 'وهڅوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'هڅول', has_issues = 0 WHERE pashto_word = 'وهڅوي';

-- Conjugations of وادۀ کول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وادۀ کول', has_issues = 0 WHERE pashto_word = 'وادۀ کول';

-- Conjugations of وړاندې کول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وړاندې کول', has_issues = 0 WHERE pashto_word = 'وړاندې کول';

-- Conjugations of څملاستل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څملاستل', has_issues = 0 WHERE pashto_word = 'څملم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څملاستل', has_issues = 0 WHERE pashto_word = 'څملي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څملاستل', has_issues = 0 WHERE pashto_word = 'څملې';

-- Conjugations of کیندل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'کیندل', has_issues = 0 WHERE pashto_word = 'کیندي';

-- Conjugations of ګټل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګټل', has_issues = 0 WHERE pashto_word = 'وګټم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګټل', has_issues = 0 WHERE pashto_word = 'وګټي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګټل', has_issues = 0 WHERE pashto_word = 'ګټم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګټل', has_issues = 0 WHERE pashto_word = 'ګټو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګټل', has_issues = 0 WHERE pashto_word = 'ګټې';

-- Conjugations of خبرول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خبرول', has_issues = 0 WHERE pashto_word = 'خبروم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خبرول', has_issues = 0 WHERE pashto_word = 'خبروي';

-- Conjugations of ختل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ختل', has_issues = 0 WHERE pashto_word = 'وختل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ختل', has_issues = 0 WHERE pashto_word = 'وختو';

-- Conjugations of راوغورځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوغورځول', has_issues = 0 WHERE pashto_word = 'راوغورځوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوغورځول', has_issues = 0 WHERE pashto_word = 'راوغورځوي';

-- Conjugations of روزل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'روزل', has_issues = 0 WHERE pashto_word = 'روزي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'روزل', has_issues = 0 WHERE pashto_word = 'وروزل';

-- Conjugations of زغمل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زغمل', has_issues = 0 WHERE pashto_word = 'وزغمل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زغمل', has_issues = 0 WHERE pashto_word = 'وزغمو';

-- Conjugations of لګېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګېدل', has_issues = 0 WHERE pashto_word = 'لګېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لګېدل', has_issues = 0 WHERE pashto_word = 'ولګېدو';

-- Conjugations of ماتول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ماتول', has_issues = 0 WHERE pashto_word = 'ماتوي';

-- Conjugations of وشلول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشلول', has_issues = 0 WHERE pashto_word = 'وشلول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشلول', has_issues = 0 WHERE pashto_word = 'وشلوم';

-- Conjugations of ولړزېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولړزېدل', has_issues = 0 WHERE pashto_word = 'ولړزېدل';

-- Conjugations of ګرځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګرځول', has_issues = 0 WHERE pashto_word = 'وګرځوم';

-- Conjugations of اوبدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'اوبدل', has_issues = 0 WHERE pashto_word = 'اوبو';

-- Conjugations of خندل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خندل', has_issues = 0 WHERE pashto_word = 'وخندل';

-- Conjugations of راغورزېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راغورزېدل', has_issues = 0 WHERE pashto_word = 'راغورزېدو';

-- Conjugations of راوتل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوتل', has_issues = 0 WHERE pashto_word = 'راووتل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوتل', has_issues = 0 WHERE pashto_word = 'راووځي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوتل', has_issues = 0 WHERE pashto_word = 'راوځي';

-- Conjugations of راوپارول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوپارول', has_issues = 0 WHERE pashto_word = 'راوپاروم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راوپارول', has_issues = 0 WHERE pashto_word = 'راوپاروي';

-- Conjugations of رټل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رټل', has_issues = 0 WHERE pashto_word = 'رټم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'رټل', has_issues = 0 WHERE pashto_word = 'ورټل';

-- Conjugations of زورول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زورول', has_issues = 0 WHERE pashto_word = 'زوروې';

-- Conjugations of زول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زول', has_issues = 0 WHERE pashto_word = 'زوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'زول', has_issues = 0 WHERE pashto_word = 'زوې';

-- Conjugations of غوړول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوړول', has_issues = 0 WHERE pashto_word = 'غوړوې';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوړول', has_issues = 0 WHERE pashto_word = 'وغوړول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غوړول', has_issues = 0 WHERE pashto_word = 'وغوړوي';

-- Conjugations of لمانځل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لمانځل', has_issues = 0 WHERE pashto_word = 'ولمانځل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لمانځل', has_issues = 0 WHERE pashto_word = 'ولمانځي';

-- Conjugations of وجنګېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وجنګېدل', has_issues = 0 WHERE pashto_word = 'وجنګېدل';

-- Conjugations of وروغورزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وروغورزول', has_issues = 0 WHERE pashto_word = 'وروغورزول';

-- Conjugations of وسوځېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وسوځېدل', has_issues = 0 WHERE pashto_word = 'وسوځېدل';

-- Conjugations of وصول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وصول', has_issues = 0 WHERE pashto_word = 'وصول';

-- Conjugations of وغورزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورزول', has_issues = 0 WHERE pashto_word = 'وغورزول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغورزول', has_issues = 0 WHERE pashto_word = 'وغورزوم';

-- Conjugations of ولوېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولوېدل', has_issues = 0 WHERE pashto_word = 'ولوېدل';

-- Conjugations of ولړزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولړزول', has_issues = 0 WHERE pashto_word = 'ولړزول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ولړزول', has_issues = 0 WHERE pashto_word = 'ولړزوم';

-- Conjugations of څرګندول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څرګندول', has_issues = 0 WHERE pashto_word = 'څرګندوم';

-- Conjugations of استعمالول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'استعمالول', has_issues = 0 WHERE pashto_word = 'استعمالوې';

-- Conjugations of تاوېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'تاوېدل', has_issues = 0 WHERE pashto_word = 'تاوېدو';

-- Conjugations of توېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'توېدل', has_issues = 0 WHERE pashto_word = 'توېدو';

-- Conjugations of خلاصېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خلاصېدل', has_issues = 0 WHERE pashto_word = 'خلاصېدو';

-- Conjugations of خوځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'خوځول', has_issues = 0 WHERE pashto_word = 'وخوځول';

-- Conjugations of درول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درول', has_issues = 0 WHERE pashto_word = 'ودرول';

-- Conjugations of درېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درېدل', has_issues = 0 WHERE pashto_word = 'ودرېدل';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درېدل', has_issues = 0 WHERE pashto_word = 'ودرېدم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'درېدل', has_issues = 0 WHERE pashto_word = 'ودرېدو';

-- Conjugations of راټولول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راټولول', has_issues = 0 WHERE pashto_word = 'راټولوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راټولول', has_issues = 0 WHERE pashto_word = 'راټولوي';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'راټولول', has_issues = 0 WHERE pashto_word = 'راټولوې';

-- Conjugations of سوځېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'سوځېدل', has_issues = 0 WHERE pashto_word = 'وسوځېدل';

-- Conjugations of غورزول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورزول', has_issues = 0 WHERE pashto_word = 'وغورزول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'غورزول', has_issues = 0 WHERE pashto_word = 'وغورزوم';

-- Conjugations of لامبل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لامبل', has_issues = 0 WHERE pashto_word = 'لامبو';

-- Conjugations of لړزېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لړزېدل', has_issues = 0 WHERE pashto_word = 'لړزېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'لړزېدل', has_issues = 0 WHERE pashto_word = 'ولړزېدل';

-- Conjugations of مجبورول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'مجبورول', has_issues = 0 WHERE pashto_word = 'مجبوروې';

-- Conjugations of نازلېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'نازلېدل', has_issues = 0 WHERE pashto_word = 'نازلېدو';

-- Conjugations of واستول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واستول', has_issues = 0 WHERE pashto_word = 'واستول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واستول', has_issues = 0 WHERE pashto_word = 'واستوي';

-- Conjugations of واپس کېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'واپس کېدل', has_issues = 0 WHERE pashto_word = 'واپس کېدل';

-- Conjugations of وخوځول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وخوځول', has_issues = 0 WHERE pashto_word = 'وخوځول';

-- Conjugations of ورانول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورانول', has_issues = 0 WHERE pashto_word = 'ورانول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورانول', has_issues = 0 WHERE pashto_word = 'ورانوم';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورانول', has_issues = 0 WHERE pashto_word = 'ورانوي';

-- Conjugations of ورواوړېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ورواوړېدل', has_issues = 0 WHERE pashto_word = 'ورواوړېدل';

-- Conjugations of وشرمول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشرمول', has_issues = 0 WHERE pashto_word = 'وشرمول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشرمول', has_issues = 0 WHERE pashto_word = 'وشرموي';

-- Conjugations of وشرمېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وشرمېدل', has_issues = 0 WHERE pashto_word = 'وشرمېدل';

-- Conjugations of وغوړول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغوړول', has_issues = 0 WHERE pashto_word = 'وغوړول';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وغوړول', has_issues = 0 WHERE pashto_word = 'وغوړوي';

-- Conjugations of وپړقول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وپړقول', has_issues = 0 WHERE pashto_word = 'وپړقول';

-- Conjugations of وځورول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وځورول', has_issues = 0 WHERE pashto_word = 'وځورول';

-- Conjugations of وښویېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وښویېدل', has_issues = 0 WHERE pashto_word = 'وښویېدل';

-- Conjugations of وکارول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'وکارول', has_issues = 0 WHERE pashto_word = 'وکارول';

-- Conjugations of پخول:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پخول', has_issues = 0 WHERE pashto_word = 'پخوې';

-- Conjugations of پېښېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'پېښېدل', has_issues = 0 WHERE pashto_word = 'پېښېدو';

-- Conjugations of ځلېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ځلېدل', has_issues = 0 WHERE pashto_word = 'ځلېدو';

-- Conjugations of څارل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'څارل', has_issues = 0 WHERE pashto_word = 'څاري';

-- Conjugations of ښخېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ښخېدل', has_issues = 0 WHERE pashto_word = 'ښخېدو';

-- Conjugations of ګډېدل:
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګډېدل', has_issues = 0 WHERE pashto_word = 'ګډېدو';
UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = 'ګډېدل', has_issues = 0 WHERE pashto_word = 'ګډېدې';


-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_verb ON word_frequencies (base_verb);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);