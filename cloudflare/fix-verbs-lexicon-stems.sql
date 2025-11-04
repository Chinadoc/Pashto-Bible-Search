-- Fix verbs_lexicon: populate missing stems
-- Based on irregular_verbs.json and dictionary data

-- Irregular verbs (from irregular_verbs.json)

-- تلل

UPDATE verbs_lexicon
SET imperfective_stem = 'ځ',
    perfective_stem = 'لاړ ش'
WHERE id = 1022;


-- Regular verbs (from dictionary/inference)

-- آبادول

UPDATE verbs_lexicon
SET imperfective_stem = 'آبادو',
    perfective_stem = 'وآبادو'
WHERE id = 1;


-- آبادېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'آبادېږ',
    perfective_stem = 'وآبادېږ'
WHERE id = 2;


-- آبدارول

UPDATE verbs_lexicon
SET imperfective_stem = 'آبدارو',
    perfective_stem = 'وآبدارو'
WHERE id = 3;


-- آبدارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'آبدارېږ',
    perfective_stem = 'وآبدارېږ'
WHERE id = 4;


-- آزادول

UPDATE verbs_lexicon
SET imperfective_stem = 'آزادو',
    perfective_stem = 'وآزادو'
WHERE id = 8;


-- آزادېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'آزادېږ',
    perfective_stem = 'وآزادېږ'
WHERE id = 9;


-- آزار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'آزار کو',
    perfective_stem = 'وآزار کو'
WHERE id = 10;


-- آزارول

UPDATE verbs_lexicon
SET imperfective_stem = 'آزارو',
    perfective_stem = 'وآزارو'
WHERE id = 11;


-- آماده کول

UPDATE verbs_lexicon
SET imperfective_stem = 'آماده کو',
    perfective_stem = 'وآماده کو'
WHERE id = 12;


-- آماده کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'آماده کېږ',
    perfective_stem = 'وآماده کېږ'
WHERE id = 13;


-- آواز کول

UPDATE verbs_lexicon
SET imperfective_stem = 'آواز کو',
    perfective_stem = 'وآواز کو'
WHERE id = 17;


-- ابلاغول

UPDATE verbs_lexicon
SET imperfective_stem = 'ابلاغو',
    perfective_stem = 'وابلاغو'
WHERE id = 21;


-- ابلاغېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ابلاغېږ',
    perfective_stem = 'وابلاغېږ'
WHERE id = 22;


-- اتفاق کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اتفاق کو',
    perfective_stem = 'واتفاق کو'
WHERE id = 24;


-- اثباتول

UPDATE verbs_lexicon
SET imperfective_stem = 'اثباتو',
    perfective_stem = 'واثباتو'
WHERE id = 28;


-- اثباتېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اثباتېږ',
    perfective_stem = 'واثباتېږ'
WHERE id = 29;


-- اثر کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اثر کو',
    perfective_stem = 'واثر کو'
WHERE id = 30;


-- اجازت ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اجازت ورکو',
    perfective_stem = 'واجازت ورکو'
WHERE id = 31;


-- اجازه ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اجازه ورکو',
    perfective_stem = 'واجازه ورکو'
WHERE id = 32;


-- اجرا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اجرا کو',
    perfective_stem = 'واجرا کو'
WHERE id = 33;


-- احاطه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'احاطه کو',
    perfective_stem = 'واحاطه کو'
WHERE id = 37;


-- احاطه کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'احاطه کېږ',
    perfective_stem = 'واحاطه کېږ'
WHERE id = 38;


-- احتجاج کول

UPDATE verbs_lexicon
SET imperfective_stem = 'احتجاج کو',
    perfective_stem = 'واحتجاج کو'
WHERE id = 39;


-- احترام کول

UPDATE verbs_lexicon
SET imperfective_stem = 'احترام کو',
    perfective_stem = 'واحترام کو'
WHERE id = 40;


-- احساس کول

UPDATE verbs_lexicon
SET imperfective_stem = 'احساس کو',
    perfective_stem = 'واحساس کو'
WHERE id = 41;


-- احساسول

UPDATE verbs_lexicon
SET imperfective_stem = 'احساسو',
    perfective_stem = 'واحساسو'
WHERE id = 42;


-- احساسېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'احساسېږ',
    perfective_stem = 'واحساسېږ'
WHERE id = 43;


-- احضارول

UPDATE verbs_lexicon
SET imperfective_stem = 'احضارو',
    perfective_stem = 'واحضارو'
WHERE id = 44;


-- احضارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'احضارېږ',
    perfective_stem = 'واحضارېږ'
WHERE id = 45;


-- اختطاف کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اختطاف کو',
    perfective_stem = 'واختطاف کو'
WHERE id = 48;


-- اختطاف کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اختطاف کېږ',
    perfective_stem = 'واختطاف کېږ'
WHERE id = 49;


-- اختلاط کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اختلاط کو',
    perfective_stem = 'واختلاط کو'
WHERE id = 50;


-- اختیارول

UPDATE verbs_lexicon
SET imperfective_stem = 'اختیارو',
    perfective_stem = 'واختیارو'
WHERE id = 51;


-- اخذ کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اخذ کو',
    perfective_stem = 'واخذ کو'
WHERE id = 52;


-- اخطار ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اخطار ورکو',
    perfective_stem = 'واخطار ورکو'
WHERE id = 57;


-- اخلالول

UPDATE verbs_lexicon
SET imperfective_stem = 'اخلالو',
    perfective_stem = 'واخلالو'
WHERE id = 59;


-- اخلالېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اخلالېږ',
    perfective_stem = 'واخلالېږ'
WHERE id = 60;


-- اخږل

UPDATE verbs_lexicon
SET imperfective_stem = 'اخږ',
    perfective_stem = 'واخږ'
WHERE id = 54;


-- اخښل

UPDATE verbs_lexicon
SET imperfective_stem = 'اخښ',
    perfective_stem = 'واخښ'
WHERE id = 56;


-- ادا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادا کو',
    perfective_stem = 'وادا کو'
WHERE id = 65;


-- ادا کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ادا کېږ',
    perfective_stem = 'وادا کېږ'
WHERE id = 66;


-- ادامه ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادامه ورکو',
    perfective_stem = 'وادامه ورکو'
WHERE id = 68;


-- اداکاري کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اداکاري کو',
    perfective_stem = 'واداکاري کو'
WHERE id = 67;


-- ادب کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادب کو',
    perfective_stem = 'وادب کو'
WHERE id = 69;


-- ادرار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادرار کو',
    perfective_stem = 'وادرار کو'
WHERE id = 70;


-- ادراک کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادراک کو',
    perfective_stem = 'وادراک کو'
WHERE id = 71;


-- ادغامول

UPDATE verbs_lexicon
SET imperfective_stem = 'ادغامو',
    perfective_stem = 'وادغامو'
WHERE id = 72;


-- ادغامېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ادغامېږ',
    perfective_stem = 'وادغامېږ'
WHERE id = 73;


-- اراده کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اراده کو',
    perfective_stem = 'واراده کو'
WHERE id = 77;


-- ارام کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارام کو',
    perfective_stem = 'وارام کو'
WHERE id = 79;


-- ارتاو کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارتاو کو',
    perfective_stem = 'وارتاو کو'
WHERE id = 80;


-- ارتاوول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارتاوو',
    perfective_stem = 'وارتاوو'
WHERE id = 81;


-- ارتاوېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ارتاوېږ',
    perfective_stem = 'وارتاوېږ'
WHERE id = 82;


-- ارتول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارتو',
    perfective_stem = 'وارتو'
WHERE id = 83;


-- ارزول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارزو',
    perfective_stem = 'وارزو'
WHERE id = 84;


-- ارزېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ارزېږ',
    perfective_stem = 'وارزېږ'
WHERE id = 85;


-- ارمان کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ارمان کو',
    perfective_stem = 'وارمان کو'
WHERE id = 87;


-- اره چلول

UPDATE verbs_lexicon
SET imperfective_stem = 'اره چلو',
    perfective_stem = 'واره چلو'
WHERE id = 88;


-- اره کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اره کو',
    perfective_stem = 'واره کو'
WHERE id = 89;


-- ارږمی کښل

UPDATE verbs_lexicon
SET imperfective_stem = 'ارږمی کښ',
    perfective_stem = 'وارږمی کښ'
WHERE id = 86;


-- ازارول

UPDATE verbs_lexicon
SET imperfective_stem = 'ازارو',
    perfective_stem = 'وازارو'
WHERE id = 97;


-- ازارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ازارېږ',
    perfective_stem = 'وازارېږ'
WHERE id = 98;


-- ازانګه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ازانګه کو',
    perfective_stem = 'وازانګه کو'
WHERE id = 99;


-- ازمایل

UPDATE verbs_lexicon
SET imperfective_stem = 'ازمای',
    perfective_stem = 'وازمای'
WHERE id = 100;


-- ازمویل

UPDATE verbs_lexicon
SET imperfective_stem = 'ازموی',
    perfective_stem = 'وازموی'
WHERE id = 101;


-- ازمیښت کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ازمیښت کو',
    perfective_stem = 'وازمیښت کو'
WHERE id = 102;


-- ازمیښت کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ازمیښت کېږ',
    perfective_stem = 'وازمیښت کېږ'
WHERE id = 103;


-- اسانول

UPDATE verbs_lexicon
SET imperfective_stem = 'اسانو',
    perfective_stem = 'واسانو'
WHERE id = 106;


-- اسانېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اسانېږ',
    perfective_stem = 'واسانېږ'
WHERE id = 107;


-- استثمارول

UPDATE verbs_lexicon
SET imperfective_stem = 'استثمارو',
    perfective_stem = 'واستثمارو'
WHERE id = 108;


-- استثمارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'استثمارېږ',
    perfective_stem = 'واستثمارېږ'
WHERE id = 109;


-- استري کول

UPDATE verbs_lexicon
SET imperfective_stem = 'استري کو',
    perfective_stem = 'واستري کو'
WHERE id = 110;


-- استعفا ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'استعفا ورکو',
    perfective_stem = 'واستعفا ورکو'
WHERE id = 112;


-- استعفا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'استعفا کو',
    perfective_stem = 'واستعفا کو'
WHERE id = 111;


-- استعمالول

UPDATE verbs_lexicon
SET imperfective_stem = 'استعمالو',
    perfective_stem = 'واستعمالو'
WHERE id = 113;


-- استعمالېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'استعمالېږ',
    perfective_stem = 'واستعمالېږ'
WHERE id = 114;


-- استغفار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'استغفار کو',
    perfective_stem = 'واستغفار کو'
WHERE id = 115;


-- استفاده کول

UPDATE verbs_lexicon
SET imperfective_stem = 'استفاده کو',
    perfective_stem = 'واستفاده کو'
WHERE id = 116;


-- استقبال کول

UPDATE verbs_lexicon
SET imperfective_stem = 'استقبال کو',
    perfective_stem = 'واستقبال کو'
WHERE id = 117;


-- استول

UPDATE verbs_lexicon
SET imperfective_stem = 'استو',
    perfective_stem = 'واستو'
WHERE id = 118;


-- اسرار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اسرار کو',
    perfective_stem = 'واسرار کو'
WHERE id = 119;


-- اسراف کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اسراف کو',
    perfective_stem = 'واسراف کو'
WHERE id = 120;


-- اسوېلي کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اسوېلي کو',
    perfective_stem = 'واسوېلي کو'
WHERE id = 122;


-- اسوېلی کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اسوېلی کو',
    perfective_stem = 'واسوېلی کو'
WHERE id = 121;


-- اسیر کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اسیر کېږ',
    perfective_stem = 'واسیر کېږ'
WHERE id = 123;


-- اشاره کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اشاره کو',
    perfective_stem = 'واشاره کو'
WHERE id = 124;


-- اشباع کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اشباع کو',
    perfective_stem = 'واشباع کو'
WHERE id = 125;


-- اشتهار ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اشتهار ورکو',
    perfective_stem = 'واشتهار ورکو'
WHERE id = 126;


-- اشغال کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اشغال کو',
    perfective_stem = 'واشغال کو'
WHERE id = 127;


-- اشنا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اشنا کو',
    perfective_stem = 'واشنا کو'
WHERE id = 128;


-- اشنا کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اشنا کېږ',
    perfective_stem = 'واشنا کېږ'
WHERE id = 129;


-- اصرار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اصرار کو',
    perfective_stem = 'واصرار کو'
WHERE id = 130;


-- اصلاح کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اصلاح کو',
    perfective_stem = 'واصلاح کو'
WHERE id = 133;


-- اصلاح کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اصلاح کېږ',
    perfective_stem = 'واصلاح کېږ'
WHERE id = 134;


-- اضافه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اضافه کو',
    perfective_stem = 'واضافه کو'
WHERE id = 135;


-- اطلاع ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اطلاع ورکو',
    perfective_stem = 'واطلاع ورکو'
WHERE id = 136;


-- اطلاقول

UPDATE verbs_lexicon
SET imperfective_stem = 'اطلاقو',
    perfective_stem = 'واطلاقو'
WHERE id = 137;


-- اطمنان کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اطمنان کو',
    perfective_stem = 'واطمنان کو'
WHERE id = 138;


-- اطمینان کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اطمینان کو',
    perfective_stem = 'واطمینان کو'
WHERE id = 139;


-- اظهارول

UPDATE verbs_lexicon
SET imperfective_stem = 'اظهارو',
    perfective_stem = 'واظهارو'
WHERE id = 140;


-- اظهارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اظهارېږ',
    perfective_stem = 'واظهارېږ'
WHERE id = 141;


-- اعتبار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعتبار کو',
    perfective_stem = 'واعتبار کو'
WHERE id = 142;


-- اعتراف کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعتراف کو',
    perfective_stem = 'واعتراف کو'
WHERE id = 143;


-- اعدامول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعدامو',
    perfective_stem = 'واعدامو'
WHERE id = 144;


-- اعدامېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اعدامېږ',
    perfective_stem = 'واعدامېږ'
WHERE id = 145;


-- اعلامول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعلامو',
    perfective_stem = 'واعلامو'
WHERE id = 146;


-- اعلامېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اعلامېږ',
    perfective_stem = 'واعلامېږ'
WHERE id = 147;


-- اعلان کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعلان کو',
    perfective_stem = 'واعلان کو'
WHERE id = 148;


-- اعلانول

UPDATE verbs_lexicon
SET imperfective_stem = 'اعلانو',
    perfective_stem = 'واعلانو'
WHERE id = 149;


-- اعلانېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اعلانېږ',
    perfective_stem = 'واعلانېږ'
WHERE id = 150;


-- اغوا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اغوا کو',
    perfective_stem = 'واغوا کو'
WHERE id = 154;


-- اغږل

UPDATE verbs_lexicon
SET imperfective_stem = 'اغږ',
    perfective_stem = 'واغږ'
WHERE id = 151;


-- اغېړېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اغېړېږ',
    perfective_stem = 'واغېړېږ'
WHERE id = 156;


-- افاده کول

UPDATE verbs_lexicon
SET imperfective_stem = 'افاده کو',
    perfective_stem = 'وافاده کو'
WHERE id = 157;


-- افواه خپرول

UPDATE verbs_lexicon
SET imperfective_stem = 'افواه خپرو',
    perfective_stem = 'وافواه خپرو'
WHERE id = 158;


-- اقرار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اقرار کو',
    perfective_stem = 'واقرار کو'
WHERE id = 159;


-- اقرارول

UPDATE verbs_lexicon
SET imperfective_stem = 'اقرارو',
    perfective_stem = 'واقرارو'
WHERE id = 160;


-- التباس کول

UPDATE verbs_lexicon
SET imperfective_stem = 'التباس کو',
    perfective_stem = 'والتباس کو'
WHERE id = 170;


-- التماس کول

UPDATE verbs_lexicon
SET imperfective_stem = 'التماس کو',
    perfective_stem = 'والتماس کو'
WHERE id = 171;


-- الزام لګول

UPDATE verbs_lexicon
SET imperfective_stem = 'الزام لګو',
    perfective_stem = 'والزام لګو'
WHERE id = 172;


-- الغه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'الغه کو',
    perfective_stem = 'والغه کو'
WHERE id = 173;


-- الوزول

UPDATE verbs_lexicon
SET imperfective_stem = 'الوزو',
    perfective_stem = 'والوزو'
WHERE id = 176;


-- الوځول

UPDATE verbs_lexicon
SET imperfective_stem = 'الوځو',
    perfective_stem = 'والوځو'
WHERE id = 175;


-- امبارول

UPDATE verbs_lexicon
SET imperfective_stem = 'امبارو',
    perfective_stem = 'وامبارو'
WHERE id = 177;


-- امبارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'امبارېږ',
    perfective_stem = 'وامبارېږ'
WHERE id = 178;


-- امتحان اخیستل

UPDATE verbs_lexicon
SET imperfective_stem = 'امتحان اخیست',
    perfective_stem = 'وامتحان اخیست'
WHERE id = 179;


-- امتحان ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'امتحان ورکو',
    perfective_stem = 'وامتحان ورکو'
WHERE id = 180;


-- امتناع کول

UPDATE verbs_lexicon
SET imperfective_stem = 'امتناع کو',
    perfective_stem = 'وامتناع کو'
WHERE id = 181;


-- امداد کول

UPDATE verbs_lexicon
SET imperfective_stem = 'امداد کو',
    perfective_stem = 'وامداد کو'
WHERE id = 182;


-- امر کول

UPDATE verbs_lexicon
SET imperfective_stem = 'امر کو',
    perfective_stem = 'وامر کو'
WHERE id = 183;


-- امضا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'امضا کو',
    perfective_stem = 'وامضا کو'
WHERE id = 184;


-- اموخته کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اموخته کېږ',
    perfective_stem = 'واموخته کېږ'
WHERE id = 185;


-- امید لرل

UPDATE verbs_lexicon
SET imperfective_stem = 'امید لر',
    perfective_stem = 'وامید لر'
WHERE id = 186;


-- امېد لرل

UPDATE verbs_lexicon
SET imperfective_stem = 'امېد لر',
    perfective_stem = 'وامېد لر'
WHERE id = 187;


-- انبارول

UPDATE verbs_lexicon
SET imperfective_stem = 'انبارو',
    perfective_stem = 'وانبارو'
WHERE id = 189;


-- انبارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'انبارېږ',
    perfective_stem = 'وانبارېږ'
WHERE id = 190;


-- انتروشی کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انتروشی کو',
    perfective_stem = 'وانتروشی کو'
WHERE id = 191;


-- انتظار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انتظار کو',
    perfective_stem = 'وانتظار کو'
WHERE id = 192;


-- انتظام کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انتظام کو',
    perfective_stem = 'وانتظام کو'
WHERE id = 193;


-- انتقال کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'انتقال کېږ',
    perfective_stem = 'وانتقال کېږ'
WHERE id = 194;


-- انتقالول

UPDATE verbs_lexicon
SET imperfective_stem = 'انتقالو',
    perfective_stem = 'وانتقالو'
WHERE id = 195;


-- انجامول

UPDATE verbs_lexicon
SET imperfective_stem = 'انجامو',
    perfective_stem = 'وانجامو'
WHERE id = 196;


-- انجامېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'انجامېږ',
    perfective_stem = 'وانجامېږ'
WHERE id = 197;


-- اندازه لګول

UPDATE verbs_lexicon
SET imperfective_stem = 'اندازه لګو',
    perfective_stem = 'واندازه لګو'
WHERE id = 198;


-- انعطاف کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انعطاف کو',
    perfective_stem = 'وانعطاف کو'
WHERE id = 199;


-- انموشی کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انموشی کو',
    perfective_stem = 'وانموشی کو'
WHERE id = 205;


-- انول

UPDATE verbs_lexicon
SET imperfective_stem = 'انو',
    perfective_stem = 'وانو'
WHERE id = 206;


-- انکار کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انکار کو',
    perfective_stem = 'وانکار کو'
WHERE id = 200;


-- انکاري کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'انکاري کېږ',
    perfective_stem = 'وانکاري کېږ'
WHERE id = 201;


-- انکوایري کول

UPDATE verbs_lexicon
SET imperfective_stem = 'انکوایري کو',
    perfective_stem = 'وانکوایري کو'
WHERE id = 202;


-- انګولل

UPDATE verbs_lexicon
SET imperfective_stem = 'انګول',
    perfective_stem = 'وانګول'
WHERE id = 203;


-- انګېرل

UPDATE verbs_lexicon
SET imperfective_stem = 'انګېر',
    perfective_stem = 'وانګېر'
WHERE id = 204;


-- اهل کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اهل کېږ',
    perfective_stem = 'واهل کېږ'
WHERE id = 207;


-- اوبه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوبه کو',
    perfective_stem = 'واوبه کو'
WHERE id = 210;


-- اوبېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوبېږ',
    perfective_stem = 'واوبېږ'
WHERE id = 211;


-- اوترول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوترو',
    perfective_stem = 'واوترو'
WHERE id = 212;


-- اوترېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوترېږ',
    perfective_stem = 'واوترېږ'
WHERE id = 213;


-- اوتو کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوتو کو',
    perfective_stem = 'واوتو کو'
WHERE id = 214;


-- اودرېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اودرېږ',
    perfective_stem = 'واودرېږ'
WHERE id = 217;


-- اوده کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوده کېږ',
    perfective_stem = 'واوده کېږ'
WHERE id = 218;


-- اور اخیستل

UPDATE verbs_lexicon
SET imperfective_stem = 'اور اخیست',
    perfective_stem = 'واور اخیست'
WHERE id = 219;


-- اور لګول

UPDATE verbs_lexicon
SET imperfective_stem = 'اور لګو',
    perfective_stem = 'واور لګو'
WHERE id = 220;


-- اورول

UPDATE verbs_lexicon
SET imperfective_stem = 'اورو',
    perfective_stem = 'واورو'
WHERE id = 221;


-- اوزګارول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوزګارو',
    perfective_stem = 'واوزګارو'
WHERE id = 226;


-- اوزګارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوزګارېږ',
    perfective_stem = 'واوزګارېږ'
WHERE id = 227;


-- اوسېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوسېږ',
    perfective_stem = 'واوسېږ'
WHERE id = 233;


-- اوسېلل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوسېل',
    perfective_stem = 'واوسېل'
WHERE id = 234;


-- اول

UPDATE verbs_lexicon
SET imperfective_stem = 'او',
    perfective_stem = 'واو'
WHERE id = 236;


-- اوچتول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوچتو',
    perfective_stem = 'واوچتو'
WHERE id = 215;


-- اوچتېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوچتېږ',
    perfective_stem = 'واوچتېږ'
WHERE id = 216;


-- اوړه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوړه کو',
    perfective_stem = 'واوړه کو'
WHERE id = 223;


-- اوړه کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوړه کېږ',
    perfective_stem = 'واوړه کېږ'
WHERE id = 224;


-- اوږدول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوږدو',
    perfective_stem = 'واوږدو'
WHERE id = 228;


-- اوږدېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوږدېږ',
    perfective_stem = 'واوږدېږ'
WHERE id = 229;


-- اوېزانول

UPDATE verbs_lexicon
SET imperfective_stem = 'اوېزانو',
    perfective_stem = 'واوېزانو'
WHERE id = 238;


-- اوېزانېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اوېزانېږ',
    perfective_stem = 'واوېزانېږ'
WHERE id = 239;


-- اټکلول

UPDATE verbs_lexicon
SET imperfective_stem = 'اټکلو',
    perfective_stem = 'واټکلو'
WHERE id = 27;


-- اپیل کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اپیل کو',
    perfective_stem = 'واپیل کو'
WHERE id = 23;


-- اڅڼل

UPDATE verbs_lexicon
SET imperfective_stem = 'اڅڼ',
    perfective_stem = 'واڅڼ'
WHERE id = 36;


-- اچول

UPDATE verbs_lexicon
SET imperfective_stem = 'اچو',
    perfective_stem = 'واچو'
WHERE id = 35;


-- اډر ورکول

UPDATE verbs_lexicon
SET imperfective_stem = 'اډر ورکو',
    perfective_stem = 'واډر ورکو'
WHERE id = 75;


-- اډر کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اډر کو',
    perfective_stem = 'واډر کو'
WHERE id = 74;


-- اړ کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اړ کو',
    perfective_stem = 'واړ کو'
WHERE id = 92;


-- اړ کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اړ کېږ',
    perfective_stem = 'واړ کېږ'
WHERE id = 93;


-- اړول

UPDATE verbs_lexicon
SET imperfective_stem = 'اړو',
    perfective_stem = 'واړو'
WHERE id = 94;


-- اړېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اړېږ',
    perfective_stem = 'واړېږ'
WHERE id = 95;


-- اږیل

UPDATE verbs_lexicon
SET imperfective_stem = 'اږی',
    perfective_stem = 'واږی'
WHERE id = 104;


-- اکتفا کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اکتفا کو',
    perfective_stem = 'واکتفا کو'
WHERE id = 162;


-- اګاه کول

UPDATE verbs_lexicon
SET imperfective_stem = 'اګاه کو',
    perfective_stem = 'واګاه کو'
WHERE id = 166;


-- اګاه کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'اګاه کېږ',
    perfective_stem = 'واګاه کېږ'
WHERE id = 167;


-- ایجابول

UPDATE verbs_lexicon
SET imperfective_stem = 'ایجابو',
    perfective_stem = 'وایجابو'
WHERE id = 240;


-- ایجابېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ایجابېږ',
    perfective_stem = 'وایجابېږ'
WHERE id = 241;


-- ایجاد کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ایجاد کو',
    perfective_stem = 'وایجاد کو'
WHERE id = 242;


-- ایجاد کېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ایجاد کېږ',
    perfective_stem = 'وایجاد کېږ'
WHERE id = 243;


-- ایسارول

UPDATE verbs_lexicon
SET imperfective_stem = 'ایسارو',
    perfective_stem = 'وایسارو'
WHERE id = 244;


-- ایسارېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ایسارېږ',
    perfective_stem = 'وایسارېږ'
WHERE id = 245;


-- ایسته کول

UPDATE verbs_lexicon
SET imperfective_stem = 'ایسته کو',
    perfective_stem = 'وایسته کو'
WHERE id = 249;


-- ایسېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ایسېږ',
    perfective_stem = 'وایسېږ'
WHERE id = 250;


-- ایشول

UPDATE verbs_lexicon
SET imperfective_stem = 'ایشو',
    perfective_stem = 'وایشو'
WHERE id = 252;


-- ایشېدل

UPDATE verbs_lexicon
SET imperfective_stem = 'ایشېږ',
    perfective_stem = 'وایشېږ'
WHERE id = 254;


-- NOTE: Adverbs found in verbs_lexicon (should be moved to separate table)
-- These entries should NOT be in verbs_lexicon:

-- ID 7: آخود (adv.)
-- ID 14: آمرانه (adv.)
-- ID 15: آن (adv.)
-- ID 19: ابتداً (adv.)
-- ID 20: ابرومندانه (adv.)
-- ID 25: اتفاقاً (adv.)
-- ID 46: احمقانه (adv. / adj.)
-- ID 47: احیاناً (adv.)
-- ID 53: اخر (adv. / n. m.)
-- ID 58: اخلاقاً (adv.)
-- ID 62: اخوا دېخوا (adv.)
-- ID 63: اخیر (adv. / n. m.)
-- ID 76: ارادتاً (adv.)
-- ID 78: ارام سره (adv.)
-- ID 90: ارو مرو (adv.)
-- ID 96: ازادانه (adv.)
-- ID 105: اساساً (adv.)
-- ID 131: اصل کې (adv.)
-- ID 132: اصلاً (adv.)
-- ID 153: اغلب (adv. / adj.)

-- Total: 100 adverbs found