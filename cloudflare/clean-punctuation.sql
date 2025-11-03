-- Clean Punctuation from Word Frequencies
-- This removes punctuation, exclamation marks, question marks, etc. from pashto_word

UPDATE word_frequencies 
SET pashto_word = 'اربع' 
WHERE id = 37691 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اربع' 
    AND wf2.id != 37691
);
UPDATE word_frequencies 
SET pashto_word = 'بوهن' 
WHERE id = 37613 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوهن' 
    AND wf2.id != 37613
);
UPDATE word_frequencies 
SET pashto_word = 'حبرون' 
WHERE id = 37770 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حبرون' 
    AND wf2.id != 37770
);
UPDATE word_frequencies 
SET pashto_word = 'د' 
WHERE id = 17685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'د' 
    AND wf2.id != 17685
);
UPDATE word_frequencies 
SET pashto_word = 'دا' 
WHERE id = 20913 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دا' 
    AND wf2.id != 20913
);
UPDATE word_frequencies 
SET pashto_word = 'شمېر' 
WHERE id = 35464 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمېر' 
    AND wf2.id != 35464
);
UPDATE word_frequencies 
SET pashto_word = 'قریت' 
WHERE id = 37643 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قریت' 
    AND wf2.id != 37643
);
UPDATE word_frequencies 
SET pashto_word = 'لوقا' 
WHERE id = 15095 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوقا' 
    AND wf2.id != 15095
);
UPDATE word_frequencies 
SET pashto_word = 'متي' 
WHERE id = 12449 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متي' 
    AND wf2.id != 12449
);
UPDATE word_frequencies 
SET pashto_word = 'مرقوس' 
WHERE id = 13478 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرقوس' 
    AND wf2.id != 13478
);
UPDATE word_frequencies 
SET pashto_word = 'نو' 
WHERE id = 39946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نو' 
    AND wf2.id != 39946
);
UPDATE word_frequencies 
SET pashto_word = 'هغه' 
WHERE id = 28277 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هغه' 
    AND wf2.id != 28277
);
UPDATE word_frequencies 
SET pashto_word = 'هل' 
WHERE id = 34240 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هل' 
    AND wf2.id != 34240
);
UPDATE word_frequencies 
SET pashto_word = 'هلته' 
WHERE id = 34241 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هلته' 
    AND wf2.id != 34241
);
UPDATE word_frequencies 
SET pashto_word = 'يعنې' 
WHERE id = 39293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يعنې' 
    AND wf2.id != 39293
);
UPDATE word_frequencies 
SET pashto_word = 'په' 
WHERE id = 19818 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'په' 
    AND wf2.id != 19818
);
UPDATE word_frequencies 
SET pashto_word = 'ځکه' 
WHERE id = 24831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځکه' 
    AND wf2.id != 24831
);
UPDATE word_frequencies 
SET pashto_word = 'چې' 
WHERE id = 19101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چې' 
    AND wf2.id != 19101
);
UPDATE word_frequencies 
SET pashto_word = 'چې په' 
WHERE id = 26000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چې په' 
    AND wf2.id != 26000
);
UPDATE word_frequencies 
SET pashto_word = 'خو' 
WHERE id = 34272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خو' 
    AND wf2.id != 34272
);
UPDATE word_frequencies 
SET pashto_word = '«ابا' 
WHERE id = 29526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ابا' 
    AND wf2.id != 29526
);
UPDATE word_frequencies 
SET pashto_word = '«استاذه' 
WHERE id = 15578 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«استاذه' 
    AND wf2.id != 15578
);
UPDATE word_frequencies 
SET pashto_word = '«اعلیحضرته' 
WHERE id = 25421 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«اعلیحضرته' 
    AND wf2.id != 25421
);
UPDATE word_frequencies 
SET pashto_word = '«ایلي' 
WHERE id = 34323 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ایلي' 
    AND wf2.id != 34323
);
UPDATE word_frequencies 
SET pashto_word = '«باداره' 
WHERE id = 25692 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«باداره' 
    AND wf2.id != 25692
);
UPDATE word_frequencies 
SET pashto_word = '«خیانت' 
WHERE id = 34822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«خیانت' 
    AND wf2.id != 34822
);
UPDATE word_frequencies 
SET pashto_word = '«راشه' 
WHERE id = 34602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«راشه' 
    AND wf2.id != 34602
);
UPDATE word_frequencies 
SET pashto_word = '«شمشونه' 
WHERE id = 28289 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«شمشونه' 
    AND wf2.id != 28289
);
UPDATE word_frequencies 
SET pashto_word = '«لورې' 
WHERE id = 34231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«لورې' 
    AND wf2.id != 34231
);
UPDATE word_frequencies 
SET pashto_word = '«نه' 
WHERE id = 30370 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«نه' 
    AND wf2.id != 30370
);
UPDATE word_frequencies 
SET pashto_word = '«هو' 
WHERE id = 15459 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«هو' 
    AND wf2.id != 15459
);
UPDATE word_frequencies 
SET pashto_word = '«واوری' 
WHERE id = 41635 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«واوری' 
    AND wf2.id != 41635
);
UPDATE word_frequencies 
SET pashto_word = '«ولې' 
WHERE id = 34114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ولې' 
    AND wf2.id != 34114
);
UPDATE word_frequencies 
SET pashto_word = '«وګوره' 
WHERE id = 22608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«وګوره' 
    AND wf2.id != 22608
);
UPDATE word_frequencies 
SET pashto_word = '«وګوری' 
WHERE id = 41629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«وګوری' 
    AND wf2.id != 41629
);
UPDATE word_frequencies 
SET pashto_word = '«پاڅېږه' 
WHERE id = 25045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«پاڅېږه' 
    AND wf2.id != 25045
);
UPDATE word_frequencies 
SET pashto_word = '«پلاره' 
WHERE id = 34918 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«پلاره' 
    AND wf2.id != 34918
);
UPDATE word_frequencies 
SET pashto_word = '«څښتنه' 
WHERE id = 24848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«څښتنه' 
    AND wf2.id != 24848
);
UPDATE word_frequencies 
SET pashto_word = '«ښاغلیه' 
WHERE id = 29867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ښاغلیه' 
    AND wf2.id != 29867
);
UPDATE word_frequencies 
SET pashto_word = '«ګوره' 
WHERE id = 29988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ګوره' 
    AND wf2.id != 29988
);
UPDATE word_frequencies 
SET pashto_word = '«ګوری' 
WHERE id = 41036 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '«ګوری' 
    AND wf2.id != 41036
);
UPDATE word_frequencies 
SET pashto_word = 'آبادى' 
WHERE id = 24152 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آبادى' 
    AND wf2.id != 24152
);
UPDATE word_frequencies 
SET pashto_word = 'آدم' 
WHERE id = 38946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آدم' 
    AND wf2.id != 38946
);
UPDATE word_frequencies 
SET pashto_word = 'آدمه' 
WHERE id = 13189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آدمه' 
    AND wf2.id != 13189
);
UPDATE word_frequencies 
SET pashto_word = 'آرام' 
WHERE id = 38993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آرام' 
    AND wf2.id != 38993
);
UPDATE word_frequencies 
SET pashto_word = 'آزاد' 
WHERE id = 33109 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزاد' 
    AND wf2.id != 33109
);
UPDATE word_frequencies 
SET pashto_word = 'آزادوم' 
WHERE id = 31198 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزادوم' 
    AND wf2.id != 31198
);
UPDATE word_frequencies 
SET pashto_word = 'آزادوى' 
WHERE id = 36829 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزادوى' 
    AND wf2.id != 36829
);
UPDATE word_frequencies 
SET pashto_word = 'آزمايمه' 
WHERE id = 37163 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزمايمه' 
    AND wf2.id != 37163
);
UPDATE word_frequencies 
SET pashto_word = 'آزمايی' 
WHERE id = 41940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزمايی' 
    AND wf2.id != 41940
);
UPDATE word_frequencies 
SET pashto_word = 'آزمایى' 
WHERE id = 41774 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزمایى' 
    AND wf2.id != 41774
);
UPDATE word_frequencies 
SET pashto_word = 'آزمایيم' 
WHERE id = 41935 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آزمایيم' 
    AND wf2.id != 41935
);
UPDATE word_frequencies 
SET pashto_word = 'آسف' 
WHERE id = 28962 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسف' 
    AND wf2.id != 28962
);
UPDATE word_frequencies 
SET pashto_word = 'آسمان' 
WHERE id = 26270 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسمان' 
    AND wf2.id != 26270
);
UPDATE word_frequencies 
SET pashto_word = 'آسمانونه' 
WHERE id = 32634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسمانونه' 
    AND wf2.id != 32634
);
UPDATE word_frequencies 
SET pashto_word = 'آسمانى' 
WHERE id = 32128 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسمانى' 
    AND wf2.id != 32128
);
UPDATE word_frequencies 
SET pashto_word = 'آسونه' 
WHERE id = 23179 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسونه' 
    AND wf2.id != 23179
);
UPDATE word_frequencies 
SET pashto_word = 'آسونو' 
WHERE id = 22218 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آسونو' 
    AND wf2.id != 22218
);
UPDATE word_frequencies 
SET pashto_word = 'آشر' 
WHERE id = 39225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آشر' 
    AND wf2.id != 39225
);
UPDATE word_frequencies 
SET pashto_word = 'آفسر' 
WHERE id = 25831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آفسر' 
    AND wf2.id != 25831
);
UPDATE word_frequencies 
SET pashto_word = 'آفسران' 
WHERE id = 16680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آفسران' 
    AND wf2.id != 16680
);
UPDATE word_frequencies 
SET pashto_word = 'آفسرانو' 
WHERE id = 17254 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آفسرانو' 
    AND wf2.id != 17254
);
UPDATE word_frequencies 
SET pashto_word = 'آمين' 
WHERE id = 14894 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آمين' 
    AND wf2.id != 14894
);
UPDATE word_frequencies 
SET pashto_word = 'آمین' 
WHERE id = 19555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آمین' 
    AND wf2.id != 19555
);
UPDATE word_frequencies 
SET pashto_word = 'آو' 
WHERE id = 15207 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آو' 
    AND wf2.id != 15207
);
UPDATE word_frequencies 
SET pashto_word = 'آواز' 
WHERE id = 28022 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آواز' 
    AND wf2.id != 28022
);
UPDATE word_frequencies 
SET pashto_word = 'آوازونه' 
WHERE id = 32718 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'آوازونه' 
    AND wf2.id != 32718
);
UPDATE word_frequencies 
SET pashto_word = 'ؤ' 
WHERE id = 30608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ؤ' 
    AND wf2.id != 30608
);
UPDATE word_frequencies 
SET pashto_word = 'اب' 
WHERE id = 11132 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اب' 
    AND wf2.id != 11132
);
UPDATE word_frequencies 
SET pashto_word = 'ابرام' 
WHERE id = 28569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابرام' 
    AND wf2.id != 28569
);
UPDATE word_frequencies 
SET pashto_word = 'ابراهیم' 
WHERE id = 18910 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابراهیم' 
    AND wf2.id != 18910
);
UPDATE word_frequencies 
SET pashto_word = 'ابراهیمه' 
WHERE id = 29748 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابراهیمه' 
    AND wf2.id != 29748
);
UPDATE word_frequencies 
SET pashto_word = 'ابشالومه' 
WHERE id = 30389 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابشالومه' 
    AND wf2.id != 30389
);
UPDATE word_frequencies 
SET pashto_word = 'ابى‌آسف' 
WHERE id = 40317 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابى‌آسف' 
    AND wf2.id != 40317
);
UPDATE word_frequencies 
SET pashto_word = 'ابى‌سلومه' 
WHERE id = 28896 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابى‌سلومه' 
    AND wf2.id != 28896
);
UPDATE word_frequencies 
SET pashto_word = 'ابى‌مایيل' 
WHERE id = 42075 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابى‌مایيل' 
    AND wf2.id != 42075
);
UPDATE word_frequencies 
SET pashto_word = 'ابي' 
WHERE id = 27718 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابي' 
    AND wf2.id != 27718
);
UPDATE word_frequencies 
SET pashto_word = 'ابياه' 
WHERE id = 28956 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابياه' 
    AND wf2.id != 28956
);
UPDATE word_frequencies 
SET pashto_word = 'ابيسوع' 
WHERE id = 28959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابيسوع' 
    AND wf2.id != 28959
);
UPDATE word_frequencies 
SET pashto_word = 'ابيل‌بيت‌معکه' 
WHERE id = 40133 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابيل‌بيت‌معکه' 
    AND wf2.id != 40133
);
UPDATE word_frequencies 
SET pashto_word = 'ابيهود' 
WHERE id = 40336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابيهود' 
    AND wf2.id != 40336
);
UPDATE word_frequencies 
SET pashto_word = 'ابيهُو' 
WHERE id = 23231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابيهُو' 
    AND wf2.id != 23231
);
UPDATE word_frequencies 
SET pashto_word = 'ابیهو' 
WHERE id = 38128 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ابیهو' 
    AND wf2.id != 38128
);
UPDATE word_frequencies 
SET pashto_word = 'احاز' 
WHERE id = 40348 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'احاز' 
    AND wf2.id != 40348
);
UPDATE word_frequencies 
SET pashto_word = 'احکام' 
WHERE id = 37983 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'احکام' 
    AND wf2.id != 37983
);
UPDATE word_frequencies 
SET pashto_word = 'اختر' 
WHERE id = 35443 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اختر' 
    AND wf2.id != 35443
);
UPDATE word_frequencies 
SET pashto_word = 'اخترونه' 
WHERE id = 36232 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخترونه' 
    AND wf2.id != 36232
);
UPDATE word_frequencies 
SET pashto_word = 'اخترونو' 
WHERE id = 35931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخترونو' 
    AND wf2.id != 35931
);
UPDATE word_frequencies 
SET pashto_word = 'اختيار' 
WHERE id = 35385 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اختيار' 
    AND wf2.id != 35385
);
UPDATE word_frequencies 
SET pashto_word = 'اختياروم' 
WHERE id = 37453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اختياروم' 
    AND wf2.id != 37453
);
UPDATE word_frequencies 
SET pashto_word = 'اخستله' 
WHERE id = 40198 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستله' 
    AND wf2.id != 40198
);
UPDATE word_frequencies 
SET pashto_word = 'اخستلو' 
WHERE id = 21461 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستلو' 
    AND wf2.id != 21461
);
UPDATE word_frequencies 
SET pashto_word = 'اخستلی' 
WHERE id = 41735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستلی' 
    AND wf2.id != 41735
);
UPDATE word_frequencies 
SET pashto_word = 'اخستلې' 
WHERE id = 40235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستلې' 
    AND wf2.id != 40235
);
UPDATE word_frequencies 
SET pashto_word = 'اخستو' 
WHERE id = 39226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستو' 
    AND wf2.id != 39226
);
UPDATE word_frequencies 
SET pashto_word = 'اخستونکى' 
WHERE id = 32788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستونکى' 
    AND wf2.id != 32788
);
UPDATE word_frequencies 
SET pashto_word = 'اخستی' 
WHERE id = 41539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخستی' 
    AND wf2.id != 41539
);
UPDATE word_frequencies 
SET pashto_word = 'اخلم' 
WHERE id = 23569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلم' 
    AND wf2.id != 23569
);
UPDATE word_frequencies 
SET pashto_word = 'اخله' 
WHERE id = 23788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخله' 
    AND wf2.id != 23788
);
UPDATE word_frequencies 
SET pashto_word = 'اخلو' 
WHERE id = 28330 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلو' 
    AND wf2.id != 28330
);
UPDATE word_frequencies 
SET pashto_word = 'اخلى' 
WHERE id = 15610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلى' 
    AND wf2.id != 15610
);
UPDATE word_frequencies 
SET pashto_word = 'اخلي' 
WHERE id = 18565 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلي' 
    AND wf2.id != 18565
);
UPDATE word_frequencies 
SET pashto_word = 'اخلی' 
WHERE id = 40615 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلی' 
    AND wf2.id != 40615
);
UPDATE word_frequencies 
SET pashto_word = 'اخلې' 
WHERE id = 23621 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخلې' 
    AND wf2.id != 23621
);
UPDATE word_frequencies 
SET pashto_word = 'اخيقام' 
WHERE id = 32586 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخيقام' 
    AND wf2.id != 32586
);
UPDATE word_frequencies 
SET pashto_word = 'اخيمعض' 
WHERE id = 40081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخيمعض' 
    AND wf2.id != 40081
);
UPDATE word_frequencies 
SET pashto_word = 'اخيو' 
WHERE id = 32614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخيو' 
    AND wf2.id != 32614
);
UPDATE word_frequencies 
SET pashto_word = 'اخیست' 
WHERE id = 27358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیست' 
    AND wf2.id != 27358
);
UPDATE word_frequencies 
SET pashto_word = 'اخیستل' 
WHERE id = 25332 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیستل' 
    AND wf2.id != 25332
);
UPDATE word_frequencies 
SET pashto_word = 'اخیستلی' 
WHERE id = 37990 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیستلی' 
    AND wf2.id != 37990
);
UPDATE word_frequencies 
SET pashto_word = 'اخیسته' 
WHERE id = 29928 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیسته' 
    AND wf2.id != 29928
);
UPDATE word_frequencies 
SET pashto_word = 'اخیطوب' 
WHERE id = 7874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیطوب' 
    AND wf2.id != 7874
);
UPDATE word_frequencies 
SET pashto_word = 'اخیمعص' 
WHERE id = 10665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اخیمعص' 
    AND wf2.id != 10665
);
UPDATE word_frequencies 
SET pashto_word = 'ادامه' 
WHERE id = 37680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادامه' 
    AND wf2.id != 37680
);
UPDATE word_frequencies 
SET pashto_word = 'ادب' 
WHERE id = 35261 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادب' 
    AND wf2.id != 35261
);
UPDATE word_frequencies 
SET pashto_word = 'ادبیيل' 
WHERE id = 42082 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادبیيل' 
    AND wf2.id != 42082
);
UPDATE word_frequencies 
SET pashto_word = 'ادرعى' 
WHERE id = 39718 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادرعى' 
    AND wf2.id != 39718
);
UPDATE word_frequencies 
SET pashto_word = 'ادلیا' 
WHERE id = 35675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادلیا' 
    AND wf2.id != 35675
);
UPDATE word_frequencies 
SET pashto_word = 'ادماتا' 
WHERE id = 35643 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادماتا' 
    AND wf2.id != 35643
);
UPDATE word_frequencies 
SET pashto_word = 'ادوم' 
WHERE id = 19980 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادوم' 
    AND wf2.id != 19980
);
UPDATE word_frequencies 
SET pashto_word = 'ادونياه' 
WHERE id = 40416 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ادونياه' 
    AND wf2.id != 40416
);
UPDATE word_frequencies 
SET pashto_word = 'اراراط' 
WHERE id = 37076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اراراط' 
    AND wf2.id != 37076
);
UPDATE word_frequencies 
SET pashto_word = 'اربي' 
WHERE id = 35130 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اربي' 
    AND wf2.id != 35130
);
UPDATE word_frequencies 
SET pashto_word = 'ارفاد' 
WHERE id = 27421 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ارفاد' 
    AND wf2.id != 27421
);
UPDATE word_frequencies 
SET pashto_word = 'ارفکسد' 
WHERE id = 28565 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ارفکسد' 
    AND wf2.id != 28565
);
UPDATE word_frequencies 
SET pashto_word = 'ارو' 
WHERE id = 30364 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ارو' 
    AND wf2.id != 30364
);
UPDATE word_frequencies 
SET pashto_word = 'اروادى' 
WHERE id = 38989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اروادى' 
    AND wf2.id != 38989
);
UPDATE word_frequencies 
SET pashto_word = 'ارى‌ايل' 
WHERE id = 32668 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ارى‌ايل' 
    AND wf2.id != 32668
);
UPDATE word_frequencies 
SET pashto_word = 'اريلى' 
WHERE id = 39198 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اريلى' 
    AND wf2.id != 39198
);
UPDATE word_frequencies 
SET pashto_word = 'ارک' 
WHERE id = 36004 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ارک' 
    AND wf2.id != 36004
);
UPDATE word_frequencies 
SET pashto_word = 'اریحا' 
WHERE id = 37589 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اریحا' 
    AND wf2.id != 37589
);
UPDATE word_frequencies 
SET pashto_word = 'اریداتا' 
WHERE id = 35676 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اریداتا' 
    AND wf2.id != 35676
);
UPDATE word_frequencies 
SET pashto_word = 'اریسای' 
WHERE id = 35678 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اریسای' 
    AND wf2.id != 35678
);
UPDATE word_frequencies 
SET pashto_word = 'ازاد' 
WHERE id = 33585 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ازاد' 
    AND wf2.id != 33585
);
UPDATE word_frequencies 
SET pashto_word = 'اساف' 
WHERE id = 9059 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اساف' 
    AND wf2.id != 9059
);
UPDATE word_frequencies 
SET pashto_word = 'استاذه' 
WHERE id = 17968 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استاذه' 
    AND wf2.id != 17968
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالول' 
WHERE id = 40134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالول' 
    AND wf2.id != 40134
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوله' 
WHERE id = 32468 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوله' 
    AND wf2.id != 32468
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوم' 
WHERE id = 39027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوم' 
    AND wf2.id != 39027
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوه' 
WHERE id = 32567 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوه' 
    AND wf2.id != 32567
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوى' 
WHERE id = 19592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوى' 
    AND wf2.id != 19592
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوی' 
WHERE id = 42129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوی' 
    AND wf2.id != 42129
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالوې' 
WHERE id = 25911 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالوې' 
    AND wf2.id != 25911
);
UPDATE word_frequencies 
SET pashto_word = 'استعماليږى' 
WHERE id = 21386 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعماليږى' 
    AND wf2.id != 21386
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالېدل' 
WHERE id = 40268 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالېدل' 
    AND wf2.id != 40268
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالېدلو' 
WHERE id = 31277 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالېدلو' 
    AND wf2.id != 31277
);
UPDATE word_frequencies 
SET pashto_word = 'استعمالېدو' 
WHERE id = 40267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استعمالېدو' 
    AND wf2.id != 40267
);
UPDATE word_frequencies 
SET pashto_word = 'استموع' 
WHERE id = 32301 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'استموع' 
    AND wf2.id != 32301
);
UPDATE word_frequencies 
SET pashto_word = 'اسحاق' 
WHERE id = 33470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسحاق' 
    AND wf2.id != 33470
);
UPDATE word_frequencies 
SET pashto_word = 'اسراییله' 
WHERE id = 24079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسراییله' 
    AND wf2.id != 24079
);
UPDATE word_frequencies 
SET pashto_word = 'اسراییلو' 
WHERE id = 35552 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسراییلو' 
    AND wf2.id != 35552
);
UPDATE word_frequencies 
SET pashto_word = 'اسراییلیانو' 
WHERE id = 30710 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسراییلیانو' 
    AND wf2.id != 30710
);
UPDATE word_frequencies 
SET pashto_word = 'اسرى‌اېل' 
WHERE id = 39536 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسرى‌اېل' 
    AND wf2.id != 39536
);
UPDATE word_frequencies 
SET pashto_word = 'اسفاتا' 
WHERE id = 35673 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسفاتا' 
    AND wf2.id != 35673
);
UPDATE word_frequencies 
SET pashto_word = 'اسقلون' 
WHERE id = 27984 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسقلون' 
    AND wf2.id != 27984
);
UPDATE word_frequencies 
SET pashto_word = 'اسماعیل' 
WHERE id = 34817 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسماعیل' 
    AND wf2.id != 34817
);
UPDATE word_frequencies 
SET pashto_word = 'اسمان' 
WHERE id = 22409 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسمان' 
    AND wf2.id != 22409
);
UPDATE word_frequencies 
SET pashto_word = 'اسمانه' 
WHERE id = 34619 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسمانه' 
    AND wf2.id != 34619
);
UPDATE word_frequencies 
SET pashto_word = 'اسمانونو' 
WHERE id = 36388 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسمانونو' 
    AND wf2.id != 36388
);
UPDATE word_frequencies 
SET pashto_word = 'اسنا' 
WHERE id = 39735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسنا' 
    AND wf2.id != 39735
);
UPDATE word_frequencies 
SET pashto_word = 'اسور' 
WHERE id = 28564 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسور' 
    AND wf2.id != 28564
);
UPDATE word_frequencies 
SET pashto_word = 'اسونه' 
WHERE id = 35796 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسونه' 
    AND wf2.id != 35796
);
UPDATE word_frequencies 
SET pashto_word = 'اسونو' 
WHERE id = 27280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسونو' 
    AND wf2.id != 27280
);
UPDATE word_frequencies 
SET pashto_word = 'اسیر' 
WHERE id = 10672 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اسیر' 
    AND wf2.id != 10672
);
UPDATE word_frequencies 
SET pashto_word = 'اشبان' 
WHERE id = 30849 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشبان' 
    AND wf2.id != 30849
);
UPDATE word_frequencies 
SET pashto_word = 'اشبعل' 
WHERE id = 40344 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشبعل' 
    AND wf2.id != 40344
);
UPDATE word_frequencies 
SET pashto_word = 'اشبيل' 
WHERE id = 32004 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشبيل' 
    AND wf2.id != 32004
);
UPDATE word_frequencies 
SET pashto_word = 'اشتاول' 
WHERE id = 37626 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشتاول' 
    AND wf2.id != 37626
);
UPDATE word_frequencies 
SET pashto_word = 'اشتموع' 
WHERE id = 37637 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشتموع' 
    AND wf2.id != 37637
);
UPDATE word_frequencies 
SET pashto_word = 'اشدود' 
WHERE id = 25989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشدود' 
    AND wf2.id != 25989
);
UPDATE word_frequencies 
SET pashto_word = 'اشعان' 
WHERE id = 37639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشعان' 
    AND wf2.id != 37639
);
UPDATE word_frequencies 
SET pashto_word = 'اشنه' 
WHERE id = 37627 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشنه' 
    AND wf2.id != 37627
);
UPDATE word_frequencies 
SET pashto_word = 'اشکناز' 
WHERE id = 38962 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشکناز' 
    AND wf2.id != 38962
);
UPDATE word_frequencies 
SET pashto_word = 'اشیر' 
WHERE id = 27367 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اشیر' 
    AND wf2.id != 27367
);
UPDATE word_frequencies 
SET pashto_word = 'اصبان' 
WHERE id = 39195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اصبان' 
    AND wf2.id != 39195
);
UPDATE word_frequencies 
SET pashto_word = 'اعانې' 
WHERE id = 30244 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اعانې' 
    AND wf2.id != 30244
);
UPDATE word_frequencies 
SET pashto_word = 'اعلانوو' 
WHERE id = 33148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اعلانوو' 
    AND wf2.id != 33148
);
UPDATE word_frequencies 
SET pashto_word = 'اعلیحضرته' 
WHERE id = 27390 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اعلیحضرته' 
    AND wf2.id != 27390
);
UPDATE word_frequencies 
SET pashto_word = 'اغوستل' 
WHERE id = 35712 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اغوستل' 
    AND wf2.id != 35712
);
UPDATE word_frequencies 
SET pashto_word = 'اغوستي' 
WHERE id = 34486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اغوستي' 
    AND wf2.id != 34486
);
UPDATE word_frequencies 
SET pashto_word = 'اغوندى' 
WHERE id = 28691 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اغوندى' 
    AND wf2.id != 28691
);
UPDATE word_frequencies 
SET pashto_word = 'اغوندی' 
WHERE id = 41857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اغوندی' 
    AND wf2.id != 41857
);
UPDATE word_frequencies 
SET pashto_word = 'افت' 
WHERE id = 30581 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'افت' 
    AND wf2.id != 30581
);
UPDATE word_frequencies 
SET pashto_word = 'افرایم' 
WHERE id = 37689 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'افرایم' 
    AND wf2.id != 37689
);
UPDATE word_frequencies 
SET pashto_word = 'افسوس' 
WHERE id = 23361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'افسوس' 
    AND wf2.id != 23361
);
UPDATE word_frequencies 
SET pashto_word = 'افيق' 
WHERE id = 39712 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'افيق' 
    AND wf2.id != 39712
);
UPDATE word_frequencies 
SET pashto_word = 'الافواج' 
WHERE id = 19144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الافواج' 
    AND wf2.id != 19144
);
UPDATE word_frequencies 
SET pashto_word = 'الافواجه' 
WHERE id = 31064 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الافواجه' 
    AND wf2.id != 31064
);
UPDATE word_frequencies 
SET pashto_word = 'التقي' 
WHERE id = 37682 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'التقي' 
    AND wf2.id != 37682
);
UPDATE word_frequencies 
SET pashto_word = 'التولد' 
WHERE id = 28272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'التولد' 
    AND wf2.id != 28272
);
UPDATE word_frequencies 
SET pashto_word = 'التِقيه' 
WHERE id = 39773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'التِقيه' 
    AND wf2.id != 39773
);
UPDATE word_frequencies 
SET pashto_word = 'العازار' 
WHERE id = 30813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'العازار' 
    AND wf2.id != 30813
);
UPDATE word_frequencies 
SET pashto_word = 'الف' 
WHERE id = 37663 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الف' 
    AND wf2.id != 37663
);
UPDATE word_frequencies 
SET pashto_word = 'القانه' 
WHERE id = 9015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'القانه' 
    AND wf2.id != 9015
);
UPDATE word_frequencies 
SET pashto_word = 'القنه' 
WHERE id = 26485 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'القنه' 
    AND wf2.id != 26485
);
UPDATE word_frequencies 
SET pashto_word = 'الموداد' 
WHERE id = 38996 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الموداد' 
    AND wf2.id != 38996
);
UPDATE word_frequencies 
SET pashto_word = 'الناتان' 
WHERE id = 36036 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الناتان' 
    AND wf2.id != 36036
);
UPDATE word_frequencies 
SET pashto_word = 'الناتن' 
WHERE id = 24195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الناتن' 
    AND wf2.id != 24195
);
UPDATE word_frequencies 
SET pashto_word = 'الوتل' 
WHERE id = 27721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الوتل' 
    AND wf2.id != 27721
);
UPDATE word_frequencies 
SET pashto_word = 'الوځى' 
WHERE id = 21133 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الوځى' 
    AND wf2.id != 21133
);
UPDATE word_frequencies 
SET pashto_word = 'الياس' 
WHERE id = 32674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الياس' 
    AND wf2.id != 32674
);
UPDATE word_frequencies 
SET pashto_word = 'اليسمع' 
WHERE id = 24194 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اليسمع' 
    AND wf2.id != 24194
);
UPDATE word_frequencies 
SET pashto_word = 'اليسوع' 
WHERE id = 32430 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اليسوع' 
    AND wf2.id != 32430
);
UPDATE word_frequencies 
SET pashto_word = 'اليفز' 
WHERE id = 31410 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اليفز' 
    AND wf2.id != 31410
);
UPDATE word_frequencies 
SET pashto_word = 'اليفلط' 
WHERE id = 28877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اليفلط' 
    AND wf2.id != 28877
);
UPDATE word_frequencies 
SET pashto_word = 'اليوعينى' 
WHERE id = 26482 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اليوعينى' 
    AND wf2.id != 26482
);
UPDATE word_frequencies 
SET pashto_word = 'الیاشیب' 
WHERE id = 35982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیاشیب' 
    AND wf2.id != 35982
);
UPDATE word_frequencies 
SET pashto_word = 'الیاقیم' 
WHERE id = 22756 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیاقیم' 
    AND wf2.id != 22756
);
UPDATE word_frequencies 
SET pashto_word = 'الیشع' 
WHERE id = 30330 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیشع' 
    AND wf2.id != 30330
);
UPDATE word_frequencies 
SET pashto_word = 'الیشمع' 
WHERE id = 8997 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیشمع' 
    AND wf2.id != 8997
);
UPDATE word_frequencies 
SET pashto_word = 'الیشوع' 
WHERE id = 10645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیشوع' 
    AND wf2.id != 10645
);
UPDATE word_frequencies 
SET pashto_word = 'الیعازر' 
WHERE id = 35979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیعازر' 
    AND wf2.id != 35979
);
UPDATE word_frequencies 
SET pashto_word = 'الیفالط' 
WHERE id = 10646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیفالط' 
    AND wf2.id != 10646
);
UPDATE word_frequencies 
SET pashto_word = 'الیفلط' 
WHERE id = 30817 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیفلط' 
    AND wf2.id != 30817
);
UPDATE word_frequencies 
SET pashto_word = 'الیوعینای' 
WHERE id = 30810 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'الیوعینای' 
    AND wf2.id != 30810
);
UPDATE word_frequencies 
SET pashto_word = 'امرياه' 
WHERE id = 23337 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امرياه' 
    AND wf2.id != 23337
);
UPDATE word_frequencies 
SET pashto_word = 'امریا' 
WHERE id = 5427 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امریا' 
    AND wf2.id != 5427
);
UPDATE word_frequencies 
SET pashto_word = 'امسا' 
WHERE id = 27136 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امسا' 
    AND wf2.id != 27136
);
UPDATE word_frequencies 
SET pashto_word = 'امصى' 
WHERE id = 40325 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امصى' 
    AND wf2.id != 40325
);
UPDATE word_frequencies 
SET pashto_word = 'امصياه' 
WHERE id = 28934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امصياه' 
    AND wf2.id != 28934
);
UPDATE word_frequencies 
SET pashto_word = 'امله' 
WHERE id = 33602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امله' 
    AND wf2.id != 33602
);
UPDATE word_frequencies 
SET pashto_word = 'امنون' 
WHERE id = 10653 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امنون' 
    AND wf2.id != 10653
);
UPDATE word_frequencies 
SET pashto_word = 'امورى' 
WHERE id = 38984 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امورى' 
    AND wf2.id != 38984
);
UPDATE word_frequencies 
SET pashto_word = 'اموریان' 
WHERE id = 35469 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اموریان' 
    AND wf2.id != 35469
);
UPDATE word_frequencies 
SET pashto_word = 'اموریانو' 
WHERE id = 24335 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اموریانو' 
    AND wf2.id != 24335
);
UPDATE word_frequencies 
SET pashto_word = 'امین' 
WHERE id = 20987 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'امین' 
    AND wf2.id != 20987
);
UPDATE word_frequencies 
SET pashto_word = 'انار' 
WHERE id = 27382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انار' 
    AND wf2.id != 27382
);
UPDATE word_frequencies 
SET pashto_word = 'اندریاس' 
WHERE id = 26702 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اندریاس' 
    AND wf2.id != 26702
);
UPDATE word_frequencies 
SET pashto_word = 'اندېښنې' 
WHERE id = 34220 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اندېښنې' 
    AND wf2.id != 34220
);
UPDATE word_frequencies 
SET pashto_word = 'انسان' 
WHERE id = 33493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انسان' 
    AND wf2.id != 33493
);
UPDATE word_frequencies 
SET pashto_word = 'انسانانو' 
WHERE id = 30150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انسانانو' 
    AND wf2.id != 30150
);
UPDATE word_frequencies 
SET pashto_word = 'انسانه' 
WHERE id = 13077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انسانه' 
    AND wf2.id != 13077
);
UPDATE word_frequencies 
SET pashto_word = 'انصاف' 
WHERE id = 38225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انصاف' 
    AND wf2.id != 38225
);
UPDATE word_frequencies 
SET pashto_word = 'انښلى' 
WHERE id = 37455 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انښلى' 
    AND wf2.id != 37455
);
UPDATE word_frequencies 
SET pashto_word = 'انګور' 
WHERE id = 22860 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انګور' 
    AND wf2.id != 22860
);
UPDATE word_frequencies 
SET pashto_word = 'انګيټۍ' 
WHERE id = 37109 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'انګيټۍ' 
    AND wf2.id != 37109
);
UPDATE word_frequencies 
SET pashto_word = 'اهولیبې' 
WHERE id = 35779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اهولیبې' 
    AND wf2.id != 35779
);
UPDATE word_frequencies 
SET pashto_word = 'او' 
WHERE id = 22364 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'او' 
    AND wf2.id != 22364
);
UPDATE word_frequencies 
SET pashto_word = 'اور' 
WHERE id = 31355 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اور' 
    AND wf2.id != 31355
);
UPDATE word_frequencies 
SET pashto_word = 'اوراوه' 
WHERE id = 29454 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوراوه' 
    AND wf2.id != 29454
);
UPDATE word_frequencies 
SET pashto_word = 'اوربشې' 
WHERE id = 19958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوربشې' 
    AND wf2.id != 19958
);
UPDATE word_frequencies 
SET pashto_word = 'اورشلیم' 
WHERE id = 24849 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورشلیم' 
    AND wf2.id != 24849
);
UPDATE word_frequencies 
SET pashto_word = 'اورشلیمه' 
WHERE id = 23681 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورشلیمه' 
    AND wf2.id != 23681
);
UPDATE word_frequencies 
SET pashto_word = 'اورم' 
WHERE id = 21689 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورم' 
    AND wf2.id != 21689
);
UPDATE word_frequencies 
SET pashto_word = 'اوره' 
WHERE id = 17114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوره' 
    AND wf2.id != 17114
);
UPDATE word_frequencies 
SET pashto_word = 'اورو' 
WHERE id = 36266 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورو' 
    AND wf2.id != 36266
);
UPDATE word_frequencies 
SET pashto_word = 'اورولو' 
WHERE id = 24730 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورولو' 
    AND wf2.id != 24730
);
UPDATE word_frequencies 
SET pashto_word = 'اورولی' 
WHERE id = 42018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورولی' 
    AND wf2.id != 42018
);
UPDATE word_frequencies 
SET pashto_word = 'اورى' 
WHERE id = 16892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورى' 
    AND wf2.id != 16892
);
UPDATE word_frequencies 
SET pashto_word = 'اورى‌اېل' 
WHERE id = 40318 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورى‌اېل' 
    AND wf2.id != 40318
);
UPDATE word_frequencies 
SET pashto_word = 'اوري' 
WHERE id = 21698 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوري' 
    AND wf2.id != 21698
);
UPDATE word_frequencies 
SET pashto_word = 'اوری' 
WHERE id = 41255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوری' 
    AND wf2.id != 41255
);
UPDATE word_frequencies 
SET pashto_word = 'اوریږي' 
WHERE id = 35767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوریږي' 
    AND wf2.id != 35767
);
UPDATE word_frequencies 
SET pashto_word = 'اورې' 
WHERE id = 22546 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورې' 
    AND wf2.id != 22546
);
UPDATE word_frequencies 
SET pashto_word = 'اورېدل' 
WHERE id = 33446 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورېدل' 
    AND wf2.id != 33446
);
UPDATE word_frequencies 
SET pashto_word = 'اورېدلو' 
WHERE id = 29356 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورېدلو' 
    AND wf2.id != 29356
);
UPDATE word_frequencies 
SET pashto_word = 'اورېدلی' 
WHERE id = 34717 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورېدلی' 
    AND wf2.id != 34717
);
UPDATE word_frequencies 
SET pashto_word = 'اورېدلې' 
WHERE id = 20884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورېدلې' 
    AND wf2.id != 20884
);
UPDATE word_frequencies 
SET pashto_word = 'اورېدو' 
WHERE id = 37327 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اورېدو' 
    AND wf2.id != 37327
);
UPDATE word_frequencies 
SET pashto_word = 'اوس' 
WHERE id = 15829 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوس' 
    AND wf2.id != 15829
);
UPDATE word_frequencies 
SET pashto_word = 'اوسم' 
WHERE id = 27777 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسم' 
    AND wf2.id != 27777
);
UPDATE word_frequencies 
SET pashto_word = 'اوسه' 
WHERE id = 29368 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسه' 
    AND wf2.id != 29368
);
UPDATE word_frequencies 
SET pashto_word = 'اوسو' 
WHERE id = 21792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسو' 
    AND wf2.id != 21792
);
UPDATE word_frequencies 
SET pashto_word = 'اوسى' 
WHERE id = 21472 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسى' 
    AND wf2.id != 21472
);
UPDATE word_frequencies 
SET pashto_word = 'اوسي' 
WHERE id = 17429 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسي' 
    AND wf2.id != 17429
);
UPDATE word_frequencies 
SET pashto_word = 'اوسيږو' 
WHERE id = 31090 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسيږو' 
    AND wf2.id != 31090
);
UPDATE word_frequencies 
SET pashto_word = 'اوسيږى' 
WHERE id = 29195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسيږى' 
    AND wf2.id != 29195
);
UPDATE word_frequencies 
SET pashto_word = 'اوسپنه' 
WHERE id = 19991 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسپنه' 
    AND wf2.id != 19991
);
UPDATE word_frequencies 
SET pashto_word = 'اوسپنو' 
WHERE id = 30236 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسپنو' 
    AND wf2.id != 30236
);
UPDATE word_frequencies 
SET pashto_word = 'اوسپنې' 
WHERE id = 23939 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسپنې' 
    AND wf2.id != 23939
);
UPDATE word_frequencies 
SET pashto_word = 'اوسی' 
WHERE id = 41483 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسی' 
    AND wf2.id != 41483
);
UPDATE word_frequencies 
SET pashto_word = 'اوسیږی' 
WHERE id = 40515 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسیږی' 
    AND wf2.id != 40515
);
UPDATE word_frequencies 
SET pashto_word = 'اوسې' 
WHERE id = 27585 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسې' 
    AND wf2.id != 27585
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدل' 
WHERE id = 12755 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدل' 
    AND wf2.id != 12755
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدلم' 
WHERE id = 37159 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدلم' 
    AND wf2.id != 37159
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدله' 
WHERE id = 21664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدله' 
    AND wf2.id != 21664
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدلو' 
WHERE id = 29260 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدلو' 
    AND wf2.id != 29260
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدلی' 
WHERE id = 41656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدلی' 
    AND wf2.id != 41656
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدلې' 
WHERE id = 25368 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدلې' 
    AND wf2.id != 25368
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدم' 
WHERE id = 27740 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدم' 
    AND wf2.id != 27740
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېده' 
WHERE id = 15912 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېده' 
    AND wf2.id != 15912
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدو' 
WHERE id = 15296 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدو' 
    AND wf2.id != 15296
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدونکو' 
WHERE id = 33458 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدونکو' 
    AND wf2.id != 33458
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېدی' 
WHERE id = 41745 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېدی' 
    AND wf2.id != 41745
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېږم' 
WHERE id = 17971 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېږم' 
    AND wf2.id != 17971
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېږه' 
WHERE id = 39088 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېږه' 
    AND wf2.id != 39088
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېږو' 
WHERE id = 29214 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېږو' 
    AND wf2.id != 29214
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېږی' 
WHERE id = 41013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېږی' 
    AND wf2.id != 41013
);
UPDATE word_frequencies 
SET pashto_word = 'اوسېږې' 
WHERE id = 24022 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوسېږې' 
    AND wf2.id != 24022
);
UPDATE word_frequencies 
SET pashto_word = 'اوفير' 
WHERE id = 39005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوفير' 
    AND wf2.id != 39005
);
UPDATE word_frequencies 
SET pashto_word = 'اول' 
WHERE id = 40140 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اول' 
    AND wf2.id != 40140
);
UPDATE word_frequencies 
SET pashto_word = 'اولاد' 
WHERE id = 40271 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اولاد' 
    AND wf2.id != 40271
);
UPDATE word_frequencies 
SET pashto_word = 'اولاده' 
WHERE id = 20062 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اولاده' 
    AND wf2.id != 20062
);
UPDATE word_frequencies 
SET pashto_word = 'اولادونه' 
WHERE id = 36066 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اولادونه' 
    AND wf2.id != 36066
);
UPDATE word_frequencies 
SET pashto_word = 'اولادونو' 
WHERE id = 21613 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اولادونو' 
    AND wf2.id != 21613
);
UPDATE word_frequencies 
SET pashto_word = 'اولادې' 
WHERE id = 24803 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اولادې' 
    AND wf2.id != 24803
);
UPDATE word_frequencies 
SET pashto_word = 'اومار' 
WHERE id = 36062 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اومار' 
    AND wf2.id != 36062
);
UPDATE word_frequencies 
SET pashto_word = 'اومر' 
WHERE id = 39144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اومر' 
    AND wf2.id != 39144
);
UPDATE word_frequencies 
SET pashto_word = 'اوي' 
WHERE id = 37602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوي' 
    AND wf2.id != 37602
);
UPDATE word_frequencies 
SET pashto_word = 'اوځه' 
WHERE id = 40040 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوځه' 
    AND wf2.id != 40040
);
UPDATE word_frequencies 
SET pashto_word = 'اوچتولی' 
WHERE id = 41988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوچتولی' 
    AND wf2.id != 41988
);
UPDATE word_frequencies 
SET pashto_word = 'اوچتوم' 
WHERE id = 37186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوچتوم' 
    AND wf2.id != 37186
);
UPDATE word_frequencies 
SET pashto_word = 'اوچتوى' 
WHERE id = 23090 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوچتوى' 
    AND wf2.id != 23090
);
UPDATE word_frequencies 
SET pashto_word = 'اوچتوی' 
WHERE id = 41936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوچتوی' 
    AND wf2.id != 41936
);
UPDATE word_frequencies 
SET pashto_word = 'اوچيږى' 
WHERE id = 37214 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوچيږى' 
    AND wf2.id != 37214
);
UPDATE word_frequencies 
SET pashto_word = 'اوړه' 
WHERE id = 27279 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړه' 
    AND wf2.id != 27279
);
UPDATE word_frequencies 
SET pashto_word = 'اوړو' 
WHERE id = 32134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړو' 
    AND wf2.id != 32134
);
UPDATE word_frequencies 
SET pashto_word = 'اوړى' 
WHERE id = 24329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړى' 
    AND wf2.id != 24329
);
UPDATE word_frequencies 
SET pashto_word = 'اوړۀ' 
WHERE id = 32212 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړۀ' 
    AND wf2.id != 32212
);
UPDATE word_frequencies 
SET pashto_word = 'اوړی' 
WHERE id = 42138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړی' 
    AND wf2.id != 42138
);
UPDATE word_frequencies 
SET pashto_word = 'اوړېدلی' 
WHERE id = 41356 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړېدلی' 
    AND wf2.id != 41356
);
UPDATE word_frequencies 
SET pashto_word = 'اوړېدو' 
WHERE id = 40258 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوړېدو' 
    AND wf2.id != 40258
);
UPDATE word_frequencies 
SET pashto_word = 'اوږده' 
WHERE id = 21622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوږده' 
    AND wf2.id != 21622
);
UPDATE word_frequencies 
SET pashto_word = 'اوږدوالی' 
WHERE id = 34639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوږدوالی' 
    AND wf2.id != 34639
);
UPDATE word_frequencies 
SET pashto_word = 'اوږه' 
WHERE id = 35448 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوږه' 
    AND wf2.id != 35448
);
UPDATE word_frequencies 
SET pashto_word = 'اوږى' 
WHERE id = 32266 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوږى' 
    AND wf2.id != 32266
);
UPDATE word_frequencies 
SET pashto_word = 'اوښ' 
WHERE id = 31541 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوښ' 
    AND wf2.id != 31541
);
UPDATE word_frequencies 
SET pashto_word = 'اوښان' 
WHERE id = 25923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوښان' 
    AND wf2.id != 25923
);
UPDATE word_frequencies 
SET pashto_word = 'اوښانو' 
WHERE id = 22832 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اوښانو' 
    AND wf2.id != 22832
);
UPDATE word_frequencies 
SET pashto_word = 'ايتام' 
WHERE id = 40311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايتام' 
    AND wf2.id != 40311
);
UPDATE word_frequencies 
SET pashto_word = 'ايتهوپيا' 
WHERE id = 28094 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايتهوپيا' 
    AND wf2.id != 28094
);
UPDATE word_frequencies 
SET pashto_word = 'ايسارولی' 
WHERE id = 41515 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايسارولی' 
    AND wf2.id != 41515
);
UPDATE word_frequencies 
SET pashto_word = 'ايساروى' 
WHERE id = 37388 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايساروى' 
    AND wf2.id != 37388
);
UPDATE word_frequencies 
SET pashto_word = 'ايساروی' 
WHERE id = 42081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايساروی' 
    AND wf2.id != 42081
);
UPDATE word_frequencies 
SET pashto_word = 'ايساريږى' 
WHERE id = 32217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايساريږى' 
    AND wf2.id != 32217
);
UPDATE word_frequencies 
SET pashto_word = 'ايسارېږه' 
WHERE id = 27604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايسارېږه' 
    AND wf2.id != 27604
);
UPDATE word_frequencies 
SET pashto_word = 'ايسارېږی' 
WHERE id = 42151 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايسارېږی' 
    AND wf2.id != 42151
);
UPDATE word_frequencies 
SET pashto_word = 'ايستمه' 
WHERE id = 28465 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايستمه' 
    AND wf2.id != 28465
);
UPDATE word_frequencies 
SET pashto_word = 'ايل' 
WHERE id = 3187 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايل' 
    AND wf2.id != 3187
);
UPDATE word_frequencies 
SET pashto_word = 'ايلون' 
WHERE id = 39772 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايلون' 
    AND wf2.id != 39772
);
UPDATE word_frequencies 
SET pashto_word = 'ايمان' 
WHERE id = 22337 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايمان' 
    AND wf2.id != 22337
);
UPDATE word_frequencies 
SET pashto_word = 'ايمانه' 
WHERE id = 10445 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايمانه' 
    AND wf2.id != 10445
);
UPDATE word_frequencies 
SET pashto_word = 'اينځر' 
WHERE id = 32189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اينځر' 
    AND wf2.id != 32189
);
UPDATE word_frequencies 
SET pashto_word = 'ايوى' 
WHERE id = 39551 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايوى' 
    AND wf2.id != 39551
);
UPDATE word_frequencies 
SET pashto_word = 'ايُوبه' 
WHERE id = 20652 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايُوبه' 
    AND wf2.id != 20652
);
UPDATE word_frequencies 
SET pashto_word = 'ايکوامرين' 
WHERE id = 28687 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ايکوامرين' 
    AND wf2.id != 28687
);
UPDATE word_frequencies 
SET pashto_word = 'اُستاذه' 
WHERE id = 33019 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اُستاذه' 
    AND wf2.id != 33019
);
UPDATE word_frequencies 
SET pashto_word = 'اُميده' 
WHERE id = 36586 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اُميده' 
    AND wf2.id != 36586
);
UPDATE word_frequencies 
SET pashto_word = 'اُهد' 
WHERE id = 39190 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اُهد' 
    AND wf2.id != 39190
);
UPDATE word_frequencies 
SET pashto_word = 'اُهليبامه' 
WHERE id = 39142 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اُهليبامه' 
    AND wf2.id != 39142
);
UPDATE word_frequencies 
SET pashto_word = 'اُوزال' 
WHERE id = 39001 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اُوزال' 
    AND wf2.id != 39001
);
UPDATE word_frequencies 
SET pashto_word = 'اِبحار' 
WHERE id = 32429 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِبحار' 
    AND wf2.id != 32429
);
UPDATE word_frequencies 
SET pashto_word = 'اِبراهيم' 
WHERE id = 15624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِبراهيم' 
    AND wf2.id != 15624
);
UPDATE word_frequencies 
SET pashto_word = 'اِبراهيمه' 
WHERE id = 11155 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِبراهيمه' 
    AND wf2.id != 11155
);
UPDATE word_frequencies 
SET pashto_word = 'اِتمر' 
WHERE id = 28732 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِتمر' 
    AND wf2.id != 28732
);
UPDATE word_frequencies 
SET pashto_word = 'اِراخ' 
WHERE id = 38999 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِراخ' 
    AND wf2.id != 38999
);
UPDATE word_frequencies 
SET pashto_word = 'اِستال' 
WHERE id = 39734 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِستال' 
    AND wf2.id != 39734
);
UPDATE word_frequencies 
SET pashto_word = 'اِسحاق' 
WHERE id = 28581 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسحاق' 
    AND wf2.id != 28581
);
UPDATE word_frequencies 
SET pashto_word = 'اِسرایيل' 
WHERE id = 41753 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسرایيل' 
    AND wf2.id != 41753
);
UPDATE word_frequencies 
SET pashto_word = 'اِسرایيله' 
WHERE id = 41520 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسرایيله' 
    AND wf2.id != 41520
);
UPDATE word_frequencies 
SET pashto_word = 'اِسرایيلو' 
WHERE id = 41742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسرایيلو' 
    AND wf2.id != 41742
);
UPDATE word_frequencies 
SET pashto_word = 'اِسرایيليان' 
WHERE id = 41769 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسرایيليان' 
    AND wf2.id != 41769
);
UPDATE word_frequencies 
SET pashto_word = 'اِسرایيليانو' 
WHERE id = 42179 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسرایيليانو' 
    AND wf2.id != 42179
);
UPDATE word_frequencies 
SET pashto_word = 'اِسمٰعيل' 
WHERE id = 24470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسمٰعيل' 
    AND wf2.id != 24470
);
UPDATE word_frequencies 
SET pashto_word = 'اِسواه' 
WHERE id = 39199 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِسواه' 
    AND wf2.id != 39199
);
UPDATE word_frequencies 
SET pashto_word = 'اِضهار' 
WHERE id = 22225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِضهار' 
    AND wf2.id != 22225
);
UPDATE word_frequencies 
SET pashto_word = 'اِفرایيم' 
WHERE id = 41571 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِفرایيم' 
    AND wf2.id != 41571
);
UPDATE word_frequencies 
SET pashto_word = 'اِلعاسه' 
WHERE id = 32596 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلعاسه' 
    AND wf2.id != 32596
);
UPDATE word_frequencies 
SET pashto_word = 'اِلى‌ايل' 
WHERE id = 24657 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلى‌ايل' 
    AND wf2.id != 24657
);
UPDATE word_frequencies 
SET pashto_word = 'اِلى‌عزر' 
WHERE id = 19252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلى‌عزر' 
    AND wf2.id != 19252
);
UPDATE word_frequencies 
SET pashto_word = 'اِلياب' 
WHERE id = 32592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلياب' 
    AND wf2.id != 32592
);
UPDATE word_frequencies 
SET pashto_word = 'اِلياسب' 
WHERE id = 28958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلياسب' 
    AND wf2.id != 28958
);
UPDATE word_frequencies 
SET pashto_word = 'اِلياقيم' 
WHERE id = 20771 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِلياقيم' 
    AND wf2.id != 20771
);
UPDATE word_frequencies 
SET pashto_word = 'اِليسه' 
WHERE id = 38966 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِليسه' 
    AND wf2.id != 38966
);
UPDATE word_frequencies 
SET pashto_word = 'اِمام' 
WHERE id = 18169 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِمام' 
    AND wf2.id != 18169
);
UPDATE word_frequencies 
SET pashto_word = 'اِمامان' 
WHERE id = 17290 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِمامان' 
    AND wf2.id != 17290
);
UPDATE word_frequencies 
SET pashto_word = 'اِمامانو' 
WHERE id = 37959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِمامانو' 
    AND wf2.id != 37959
);
UPDATE word_frequencies 
SET pashto_word = 'اِنصاف' 
WHERE id = 28122 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اِنصاف' 
    AND wf2.id != 28122
);
UPDATE word_frequencies 
SET pashto_word = 'اچاوه' 
WHERE id = 34336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچاوه' 
    AND wf2.id != 34336
);
UPDATE word_frequencies 
SET pashto_word = 'اچول' 
WHERE id = 29355 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچول' 
    AND wf2.id != 29355
);
UPDATE word_frequencies 
SET pashto_word = 'اچولې' 
WHERE id = 27156 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچولې' 
    AND wf2.id != 27156
);
UPDATE word_frequencies 
SET pashto_word = 'اچوه' 
WHERE id = 35475 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچوه' 
    AND wf2.id != 35475
);
UPDATE word_frequencies 
SET pashto_word = 'اچوى' 
WHERE id = 19638 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچوى' 
    AND wf2.id != 19638
);
UPDATE word_frequencies 
SET pashto_word = 'اچوي' 
WHERE id = 21754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچوي' 
    AND wf2.id != 21754
);
UPDATE word_frequencies 
SET pashto_word = 'اچوی' 
WHERE id = 41542 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اچوی' 
    AND wf2.id != 41542
);
UPDATE word_frequencies 
SET pashto_word = 'اړمونو' 
WHERE id = 38166 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اړمونو' 
    AND wf2.id != 38166
);
UPDATE word_frequencies 
SET pashto_word = 'اړوه' 
WHERE id = 38285 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اړوه' 
    AND wf2.id != 38285
);
UPDATE word_frequencies 
SET pashto_word = 'اړوي' 
WHERE id = 36039 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اړوي' 
    AND wf2.id != 36039
);
UPDATE word_frequencies 
SET pashto_word = 'اړوی' 
WHERE id = 42045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اړوی' 
    AND wf2.id != 42045
);
UPDATE word_frequencies 
SET pashto_word = 'اړَوى' 
WHERE id = 37311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اړَوى' 
    AND wf2.id != 37311
);
UPDATE word_frequencies 
SET pashto_word = 'اکبر' 
WHERE id = 37516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اکبر' 
    AND wf2.id != 37516
);
UPDATE word_frequencies 
SET pashto_word = 'اکزیب' 
WHERE id = 37676 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اکزیب' 
    AND wf2.id != 37676
);
UPDATE word_frequencies 
SET pashto_word = 'اکشاف' 
WHERE id = 31466 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اکشاف' 
    AND wf2.id != 31466
);
UPDATE word_frequencies 
SET pashto_word = 'ایالون' 
WHERE id = 37681 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایالون' 
    AND wf2.id != 37681
);
UPDATE word_frequencies 
SET pashto_word = 'ایبحار' 
WHERE id = 10644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایبحار' 
    AND wf2.id != 10644
);
UPDATE word_frequencies 
SET pashto_word = 'ایتان' 
WHERE id = 10639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایتان' 
    AND wf2.id != 10639
);
UPDATE word_frequencies 
SET pashto_word = 'ایتوپیا' 
WHERE id = 35844 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایتوپیا' 
    AND wf2.id != 35844
);
UPDATE word_frequencies 
SET pashto_word = 'ایلی' 
WHERE id = 40448 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایلی' 
    AND wf2.id != 40448
);
UPDATE word_frequencies 
SET pashto_word = 'ایښوده' 
WHERE id = 34923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایښوده' 
    AND wf2.id != 34923
);
UPDATE word_frequencies 
SET pashto_word = 'ایښی' 
WHERE id = 38451 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ایښی' 
    AND wf2.id != 38451
);
UPDATE word_frequencies 
SET pashto_word = 'اېل' 
WHERE id = 3569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اېل' 
    AND wf2.id != 3569
);
UPDATE word_frequencies 
SET pashto_word = 'اېښی' 
WHERE id = 42003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'اېښی' 
    AND wf2.id != 42003
);
UPDATE word_frequencies 
SET pashto_word = 'بابل' 
WHERE id = 22697 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بابل' 
    AND wf2.id != 22697
);
UPDATE word_frequencies 
SET pashto_word = 'بابله' 
WHERE id = 24237 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بابله' 
    AND wf2.id != 24237
);
UPDATE word_frequencies 
SET pashto_word = 'بابليانو' 
WHERE id = 37062 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بابليانو' 
    AND wf2.id != 37062
);
UPDATE word_frequencies 
SET pashto_word = 'بادار' 
WHERE id = 34936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادار' 
    AND wf2.id != 34936
);
UPDATE word_frequencies 
SET pashto_word = 'بادارانو' 
WHERE id = 33561 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادارانو' 
    AND wf2.id != 33561
);
UPDATE word_frequencies 
SET pashto_word = 'باداره' 
WHERE id = 21716 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باداره' 
    AND wf2.id != 21716
);
UPDATE word_frequencies 
SET pashto_word = 'بادرنګ' 
WHERE id = 38074 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادرنګ' 
    AND wf2.id != 38074
);
UPDATE word_frequencies 
SET pashto_word = 'بادشاه' 
WHERE id = 28573 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادشاه' 
    AND wf2.id != 28573
);
UPDATE word_frequencies 
SET pashto_word = 'بادشاهان' 
WHERE id = 20512 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادشاهان' 
    AND wf2.id != 20512
);
UPDATE word_frequencies 
SET pashto_word = 'بادشاهانو' 
WHERE id = 18055 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادشاهانو' 
    AND wf2.id != 18055
);
UPDATE word_frequencies 
SET pashto_word = 'بادشاهت' 
WHERE id = 35354 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادشاهت' 
    AND wf2.id != 35354
);
UPDATE word_frequencies 
SET pashto_word = 'باده' 
WHERE id = 38705 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باده' 
    AND wf2.id != 38705
);
UPDATE word_frequencies 
SET pashto_word = 'بادوي' 
WHERE id = 28388 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بادوي' 
    AND wf2.id != 28388
);
UPDATE word_frequencies 
SET pashto_word = 'بارتولما' 
WHERE id = 26703 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بارتولما' 
    AND wf2.id != 26703
);
UPDATE word_frequencies 
SET pashto_word = 'باروکه' 
WHERE id = 28090 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باروکه' 
    AND wf2.id != 28090
);
UPDATE word_frequencies 
SET pashto_word = 'بازوبندونه' 
WHERE id = 36341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بازوبندونه' 
    AND wf2.id != 36341
);
UPDATE word_frequencies 
SET pashto_word = 'بازوګان' 
WHERE id = 39376 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بازوګان' 
    AND wf2.id != 39376
);
UPDATE word_frequencies 
SET pashto_word = 'باسى' 
WHERE id = 40051 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باسى' 
    AND wf2.id != 40051
);
UPDATE word_frequencies 
SET pashto_word = 'باسی' 
WHERE id = 41633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باسی' 
    AND wf2.id != 41633
);
UPDATE word_frequencies 
SET pashto_word = 'باغ' 
WHERE id = 28043 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باغ' 
    AND wf2.id != 28043
);
UPDATE word_frequencies 
SET pashto_word = 'باغونه' 
WHERE id = 27414 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باغونه' 
    AND wf2.id != 27414
);
UPDATE word_frequencies 
SET pashto_word = 'باغونو' 
WHERE id = 30862 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باغونو' 
    AND wf2.id != 30862
);
UPDATE word_frequencies 
SET pashto_word = 'بالع' 
WHERE id = 26238 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بالع' 
    AND wf2.id != 26238
);
UPDATE word_frequencies 
SET pashto_word = 'باندې' 
WHERE id = 26957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باندې' 
    AND wf2.id != 26957
);
UPDATE word_frequencies 
SET pashto_word = 'بانی' 
WHERE id = 40862 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بانی' 
    AND wf2.id != 40862
);
UPDATE word_frequencies 
SET pashto_word = 'باوجود' 
WHERE id = 24172 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'باوجود' 
    AND wf2.id != 24172
);
UPDATE word_frequencies 
SET pashto_word = 'بایيلو' 
WHERE id = 41786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بایيلو' 
    AND wf2.id != 41786
);
UPDATE word_frequencies 
SET pashto_word = 'بایيلى' 
WHERE id = 41403 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بایيلى' 
    AND wf2.id != 41403
);
UPDATE word_frequencies 
SET pashto_word = 'بایيلې' 
WHERE id = 41785 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بایيلې' 
    AND wf2.id != 41785
);
UPDATE word_frequencies 
SET pashto_word = 'بتان' 
WHERE id = 27406 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بتان' 
    AND wf2.id != 27406
);
UPDATE word_frequencies 
SET pashto_word = 'بتوییل' 
WHERE id = 36048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بتوییل' 
    AND wf2.id != 36048
);
UPDATE word_frequencies 
SET pashto_word = 'بحثونو' 
WHERE id = 34758 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بحثونو' 
    AND wf2.id != 34758
);
UPDATE word_frequencies 
SET pashto_word = 'بخښم' 
WHERE id = 38083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بخښم' 
    AND wf2.id != 38083
);
UPDATE word_frequencies 
SET pashto_word = 'بخښي' 
WHERE id = 34553 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بخښي' 
    AND wf2.id != 34553
);
UPDATE word_frequencies 
SET pashto_word = 'بخښی' 
WHERE id = 41491 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بخښی' 
    AND wf2.id != 41491
);
UPDATE word_frequencies 
SET pashto_word = 'بخیلي' 
WHERE id = 33618 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بخیلي' 
    AND wf2.id != 33618
);
UPDATE word_frequencies 
SET pashto_word = 'بد' 
WHERE id = 30640 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بد' 
    AND wf2.id != 30640
);
UPDATE word_frequencies 
SET pashto_word = 'بدلوى' 
WHERE id = 23050 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدلوى' 
    AND wf2.id != 23050
);
UPDATE word_frequencies 
SET pashto_word = 'بدلوې' 
WHERE id = 36768 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدلوې' 
    AND wf2.id != 36768
);
UPDATE word_frequencies 
SET pashto_word = 'بدليږى' 
WHERE id = 32466 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدليږى' 
    AND wf2.id != 32466
);
UPDATE word_frequencies 
SET pashto_word = 'بدلېدلی' 
WHERE id = 41990 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدلېدلی' 
    AND wf2.id != 41990
);
UPDATE word_frequencies 
SET pashto_word = 'بدى' 
WHERE id = 32123 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدى' 
    AND wf2.id != 32123
);
UPDATE word_frequencies 
SET pashto_word = 'بدکاران' 
WHERE id = 29010 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدکاران' 
    AND wf2.id != 29010
);
UPDATE word_frequencies 
SET pashto_word = 'بدیو' 
WHERE id = 34728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بدیو' 
    AND wf2.id != 34728
);
UPDATE word_frequencies 
SET pashto_word = 'بد‌اخلاقي' 
WHERE id = 26818 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بد‌اخلاقي' 
    AND wf2.id != 26818
);
UPDATE word_frequencies 
SET pashto_word = 'برتلماۍ' 
WHERE id = 29128 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برتلماۍ' 
    AND wf2.id != 29128
);
UPDATE word_frequencies 
SET pashto_word = 'برخه' 
WHERE id = 28779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برخه' 
    AND wf2.id != 28779
);
UPDATE word_frequencies 
SET pashto_word = 'برق' 
WHERE id = 37684 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برق' 
    AND wf2.id != 37684
);
UPDATE word_frequencies 
SET pashto_word = 'برنج' 
WHERE id = 30729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برنج' 
    AND wf2.id != 30729
);
UPDATE word_frequencies 
SET pashto_word = 'برنجو' 
WHERE id = 27277 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برنجو' 
    AND wf2.id != 27277
);
UPDATE word_frequencies 
SET pashto_word = 'برندوى' 
WHERE id = 37231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برندوى' 
    AND wf2.id != 37231
);
UPDATE word_frequencies 
SET pashto_word = 'برکت' 
WHERE id = 27944 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برکت' 
    AND wf2.id != 27944
);
UPDATE word_frequencies 
SET pashto_word = 'برکياه' 
WHERE id = 32601 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برکياه' 
    AND wf2.id != 32601
);
UPDATE word_frequencies 
SET pashto_word = 'برېښنا' 
WHERE id = 34664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'برېښنا' 
    AND wf2.id != 34664
);
UPDATE word_frequencies 
SET pashto_word = 'بس' 
WHERE id = 34921 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بس' 
    AND wf2.id != 34921
);
UPDATE word_frequencies 
SET pashto_word = 'بسترې' 
WHERE id = 35064 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بسترې' 
    AND wf2.id != 35064
);
UPDATE word_frequencies 
SET pashto_word = 'بصر' 
WHERE id = 32315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بصر' 
    AND wf2.id != 32315
);
UPDATE word_frequencies 
SET pashto_word = 'بضلى‌اېل' 
WHERE id = 28702 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بضلى‌اېل' 
    AND wf2.id != 28702
);
UPDATE word_frequencies 
SET pashto_word = 'بعل' 
WHERE id = 24338 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بعل' 
    AND wf2.id != 24338
);
UPDATE word_frequencies 
SET pashto_word = 'بعلات' 
WHERE id = 39774 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بعلات' 
    AND wf2.id != 39774
);
UPDATE word_frequencies 
SET pashto_word = 'بعله' 
WHERE id = 37683 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بعله' 
    AND wf2.id != 37683
);
UPDATE word_frequencies 
SET pashto_word = 'بعلوت' 
WHERE id = 37620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بعلوت' 
    AND wf2.id != 37620
);
UPDATE word_frequencies 
SET pashto_word = 'بعنه' 
WHERE id = 30820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بعنه' 
    AND wf2.id != 30820
);
UPDATE word_frequencies 
SET pashto_word = 'بغوای' 
WHERE id = 35995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بغوای' 
    AND wf2.id != 35995
);
UPDATE word_frequencies 
SET pashto_word = 'بغېر' 
WHERE id = 40414 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بغېر' 
    AND wf2.id != 40414
);
UPDATE word_frequencies 
SET pashto_word = 'بقي' 
WHERE id = 10662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بقي' 
    AND wf2.id != 10662
);
UPDATE word_frequencies 
SET pashto_word = 'بلا' 
WHERE id = 34800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلا' 
    AND wf2.id != 34800
);
UPDATE word_frequencies 
SET pashto_word = 'بلشان' 
WHERE id = 35994 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلشان' 
    AND wf2.id != 35994
);
UPDATE word_frequencies 
SET pashto_word = 'بلوى' 
WHERE id = 31407 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلوى' 
    AND wf2.id != 31407
);
UPDATE word_frequencies 
SET pashto_word = 'بلوی' 
WHERE id = 40918 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلوی' 
    AND wf2.id != 40918
);
UPDATE word_frequencies 
SET pashto_word = 'بليږى' 
WHERE id = 28346 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بليږى' 
    AND wf2.id != 28346
);
UPDATE word_frequencies 
SET pashto_word = 'بلکې' 
WHERE id = 35359 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلکې' 
    AND wf2.id != 35359
);
UPDATE word_frequencies 
SET pashto_word = 'بلېدل' 
WHERE id = 34665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلېدل' 
    AND wf2.id != 34665
);
UPDATE word_frequencies 
SET pashto_word = 'بلېدلې' 
WHERE id = 35211 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلېدلې' 
    AND wf2.id != 35211
);
UPDATE word_frequencies 
SET pashto_word = 'بلېده' 
WHERE id = 30134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بلېده' 
    AND wf2.id != 30134
);
UPDATE word_frequencies 
SET pashto_word = 'بنایاه' 
WHERE id = 30246 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بنایاه' 
    AND wf2.id != 30246
);
UPDATE word_frequencies 
SET pashto_word = 'بندوم' 
WHERE id = 37501 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بندوم' 
    AND wf2.id != 37501
);
UPDATE word_frequencies 
SET pashto_word = 'بندوه' 
WHERE id = 37873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بندوه' 
    AND wf2.id != 37873
);
UPDATE word_frequencies 
SET pashto_word = 'بندوى' 
WHERE id = 28210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بندوى' 
    AND wf2.id != 28210
);
UPDATE word_frequencies 
SET pashto_word = 'بندوی' 
WHERE id = 41850 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بندوی' 
    AND wf2.id != 41850
);
UPDATE word_frequencies 
SET pashto_word = 'بنيامين' 
WHERE id = 26245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بنيامين' 
    AND wf2.id != 26245
);
UPDATE word_frequencies 
SET pashto_word = 'بنګړى' 
WHERE id = 39555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بنګړى' 
    AND wf2.id != 39555
);
UPDATE word_frequencies 
SET pashto_word = 'به ننوځى' 
WHERE id = 35225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'به ننوځى' 
    AND wf2.id != 35225
);
UPDATE word_frequencies 
SET pashto_word = 'به ووایي' 
WHERE id = 27025 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'به ووایي' 
    AND wf2.id != 27025
);
UPDATE word_frequencies 
SET pashto_word = 'به' 
WHERE id = 26055 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'به' 
    AND wf2.id != 26055
);
UPDATE word_frequencies 
SET pashto_word = 'بهادرى' 
WHERE id = 40227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهادرى' 
    AND wf2.id != 40227
);
UPDATE word_frequencies 
SET pashto_word = 'بهيږى' 
WHERE id = 17796 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهيږى' 
    AND wf2.id != 17796
);
UPDATE word_frequencies 
SET pashto_word = 'بهیږي' 
WHERE id = 35940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهیږي' 
    AND wf2.id != 35940
);
UPDATE word_frequencies 
SET pashto_word = 'بهېدل' 
WHERE id = 37316 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهېدل' 
    AND wf2.id != 37316
);
UPDATE word_frequencies 
SET pashto_word = 'بهېدله' 
WHERE id = 29884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهېدله' 
    AND wf2.id != 29884
);
UPDATE word_frequencies 
SET pashto_word = 'بهېدلې' 
WHERE id = 30788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بهېدلې' 
    AND wf2.id != 30788
);
UPDATE word_frequencies 
SET pashto_word = 'بوتلل' 
WHERE id = 14208 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوتلل' 
    AND wf2.id != 14208
);
UPDATE word_frequencies 
SET pashto_word = 'بوتلم' 
WHERE id = 16604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوتلم' 
    AND wf2.id != 16604
);
UPDATE word_frequencies 
SET pashto_word = 'بوتله' 
WHERE id = 21926 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوتله' 
    AND wf2.id != 21926
);
UPDATE word_frequencies 
SET pashto_word = 'بوتلو' 
WHERE id = 14980 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوتلو' 
    AND wf2.id != 14980
);
UPDATE word_frequencies 
SET pashto_word = 'بوتلې' 
WHERE id = 32215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوتلې' 
    AND wf2.id != 32215
);
UPDATE word_frequencies 
SET pashto_word = 'بوته' 
WHERE id = 19788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوته' 
    AND wf2.id != 19788
);
UPDATE word_frequencies 
SET pashto_word = 'بوعز' 
WHERE id = 28848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوعز' 
    AND wf2.id != 28848
);
UPDATE word_frequencies 
SET pashto_word = 'بولي' 
WHERE id = 33394 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بولي' 
    AND wf2.id != 33394
);
UPDATE word_frequencies 
SET pashto_word = 'بوټى' 
WHERE id = 37978 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوټى' 
    AND wf2.id != 37978
);
UPDATE word_frequencies 
SET pashto_word = 'بوځم' 
WHERE id = 25535 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځم' 
    AND wf2.id != 25535
);
UPDATE word_frequencies 
SET pashto_word = 'بوځه' 
WHERE id = 18395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځه' 
    AND wf2.id != 18395
);
UPDATE word_frequencies 
SET pashto_word = 'بوځى' 
WHERE id = 15614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځى' 
    AND wf2.id != 15614
);
UPDATE word_frequencies 
SET pashto_word = 'بوځي' 
WHERE id = 19321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځي' 
    AND wf2.id != 19321
);
UPDATE word_frequencies 
SET pashto_word = 'بوځُو' 
WHERE id = 31956 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځُو' 
    AND wf2.id != 31956
);
UPDATE word_frequencies 
SET pashto_word = 'بوځی' 
WHERE id = 41222 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځی' 
    AND wf2.id != 41222
);
UPDATE word_frequencies 
SET pashto_word = 'بوځې' 
WHERE id = 25918 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوځې' 
    AND wf2.id != 25918
);
UPDATE word_frequencies 
SET pashto_word = 'بوډاګان' 
WHERE id = 32629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوډاګان' 
    AND wf2.id != 32629
);
UPDATE word_frequencies 
SET pashto_word = 'بوکرو' 
WHERE id = 40352 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بوکرو' 
    AND wf2.id != 40352
);
UPDATE word_frequencies 
SET pashto_word = 'بيا' 
WHERE id = 18152 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيا' 
    AND wf2.id != 18152
);
UPDATE word_frequencies 
SET pashto_word = 'بيامومى' 
WHERE id = 26520 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيامومى' 
    AND wf2.id != 26520
);
UPDATE word_frequencies 
SET pashto_word = 'بياموندل' 
WHERE id = 35262 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بياموندل' 
    AND wf2.id != 35262
);
UPDATE word_frequencies 
SET pashto_word = 'بيانولو' 
WHERE id = 40389 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيانولو' 
    AND wf2.id != 40389
);
UPDATE word_frequencies 
SET pashto_word = 'بيانوم' 
WHERE id = 26438 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيانوم' 
    AND wf2.id != 26438
);
UPDATE word_frequencies 
SET pashto_word = 'بيانوو' 
WHERE id = 10083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيانوو' 
    AND wf2.id != 10083
);
UPDATE word_frequencies 
SET pashto_word = 'بيانوى' 
WHERE id = 20593 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيانوى' 
    AND wf2.id != 20593
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌اراباه' 
WHERE id = 39751 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌اراباه' 
    AND wf2.id != 39751
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌ايل' 
WHERE id = 24581 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌ايل' 
    AND wf2.id != 24581
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌جمول' 
WHERE id = 36995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌جمول' 
    AND wf2.id != 36995
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌دبلاتايم' 
WHERE id = 36994 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌دبلاتايم' 
    AND wf2.id != 36994
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌شان' 
WHERE id = 39794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌شان' 
    AND wf2.id != 39794
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌شمس' 
WHERE id = 28816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌شمس' 
    AND wf2.id != 28816
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌صور' 
WHERE id = 39749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌صور' 
    AND wf2.id != 39749
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌لحم' 
WHERE id = 40289 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌لحم' 
    AND wf2.id != 40289
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌مرکبوت' 
WHERE id = 39762 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌مرکبوت' 
    AND wf2.id != 39762
);
UPDATE word_frequencies 
SET pashto_word = 'بيت‌معون' 
WHERE id = 36996 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيت‌معون' 
    AND wf2.id != 36996
);
UPDATE word_frequencies 
SET pashto_word = 'بيرسبع' 
WHERE id = 32295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيرسبع' 
    AND wf2.id != 32295
);
UPDATE word_frequencies 
SET pashto_word = 'بيلشضره' 
WHERE id = 35358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيلشضره' 
    AND wf2.id != 35358
);
UPDATE word_frequencies 
SET pashto_word = 'بيلطشضر' 
WHERE id = 35255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيلطشضر' 
    AND wf2.id != 35255
);
UPDATE word_frequencies 
SET pashto_word = 'بيلطشضره' 
WHERE id = 35315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيلطشضره' 
    AND wf2.id != 35315
);
UPDATE word_frequencies 
SET pashto_word = 'بيمارېږم' 
WHERE id = 37493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيمارېږم' 
    AND wf2.id != 37493
);
UPDATE word_frequencies 
SET pashto_word = 'بينجو' 
WHERE id = 19072 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بينجو' 
    AND wf2.id != 19072
);
UPDATE word_frequencies 
SET pashto_word = 'بيګل' 
WHERE id = 21877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيګل' 
    AND wf2.id != 21877
);
UPDATE word_frequencies 
SET pashto_word = 'بيګلو' 
WHERE id = 32562 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بيګلو' 
    AND wf2.id != 32562
);
UPDATE word_frequencies 
SET pashto_word = 'بُتان' 
WHERE id = 32572 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بُتان' 
    AND wf2.id != 32572
);
UPDATE word_frequencies 
SET pashto_word = 'بُقى' 
WHERE id = 32606 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بُقى' 
    AND wf2.id != 32606
);
UPDATE word_frequencies 
SET pashto_word = 'بچو' 
WHERE id = 16126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بچو' 
    AND wf2.id != 16126
);
UPDATE word_frequencies 
SET pashto_word = 'بچی' 
WHERE id = 40706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بچی' 
    AND wf2.id != 40706
);
UPDATE word_frequencies 
SET pashto_word = 'بچیانو' 
WHERE id = 23560 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بچیانو' 
    AND wf2.id != 23560
);
UPDATE word_frequencies 
SET pashto_word = 'بیانوی' 
WHERE id = 40671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بیانوی' 
    AND wf2.id != 40671
);
UPDATE word_frequencies 
SET pashto_word = 'بیاهم' 
WHERE id = 37585 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بیاهم' 
    AND wf2.id != 37585
);
UPDATE word_frequencies 
SET pashto_word = 'بېخ' 
WHERE id = 28695 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بېخ' 
    AND wf2.id != 28695
);
UPDATE word_frequencies 
SET pashto_word = 'بېلوي' 
WHERE id = 30030 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بېلوي' 
    AND wf2.id != 30030
);
UPDATE word_frequencies 
SET pashto_word = 'بېلچې' 
WHERE id = 30322 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بېلچې' 
    AND wf2.id != 30322
);
UPDATE word_frequencies 
SET pashto_word = 'بې‌ايمانه' 
WHERE id = 33048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بې‌ايمانه' 
    AND wf2.id != 33048
);
UPDATE word_frequencies 
SET pashto_word = 'بې‌شکه' 
WHERE id = 25736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بې‌شکه' 
    AND wf2.id != 25736
);
UPDATE word_frequencies 
SET pashto_word = 'بې‌عیبه' 
WHERE id = 33689 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بې‌عیبه' 
    AND wf2.id != 33689
);
UPDATE word_frequencies 
SET pashto_word = 'بې‌فایدې' 
WHERE id = 42033 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بې‌فایدې' 
    AND wf2.id != 42033
);
UPDATE word_frequencies 
SET pashto_word = 'بې‌پلاره' 
WHERE id = 33681 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'بې‌پلاره' 
    AND wf2.id != 33681
);
UPDATE word_frequencies 
SET pashto_word = 'تا' 
WHERE id = 17438 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تا' 
    AND wf2.id != 17438
);
UPDATE word_frequencies 
SET pashto_word = 'تاته' 
WHERE id = 27140 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تاته' 
    AND wf2.id != 27140
);
UPDATE word_frequencies 
SET pashto_word = 'تاجونه' 
WHERE id = 30266 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تاجونه' 
    AND wf2.id != 30266
);
UPDATE word_frequencies 
SET pashto_word = 'تارح' 
WHERE id = 32318 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تارح' 
    AND wf2.id != 32318
);
UPDATE word_frequencies 
SET pashto_word = 'تاسو' 
WHERE id = 17497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تاسو' 
    AND wf2.id != 17497
);
UPDATE word_frequencies 
SET pashto_word = 'تاويږى' 
WHERE id = 32645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تاويږى' 
    AND wf2.id != 32645
);
UPDATE word_frequencies 
SET pashto_word = 'تاکونه' 
WHERE id = 35182 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تاکونه' 
    AND wf2.id != 35182
);
UPDATE word_frequencies 
SET pashto_word = 'تتنای' 
WHERE id = 36011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تتنای' 
    AND wf2.id != 36011
);
UPDATE word_frequencies 
SET pashto_word = 'تحت' 
WHERE id = 28961 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تحت' 
    AND wf2.id != 28961
);
UPDATE word_frequencies 
SET pashto_word = 'تحفنحيس' 
WHERE id = 36941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تحفنحيس' 
    AND wf2.id != 36941
);
UPDATE word_frequencies 
SET pashto_word = 'تحفې' 
WHERE id = 35265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تحفې' 
    AND wf2.id != 35265
);
UPDATE word_frequencies 
SET pashto_word = 'تخت' 
WHERE id = 30132 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تخت' 
    AND wf2.id != 30132
);
UPDATE word_frequencies 
SET pashto_word = 'تدي' 
WHERE id = 34355 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تدي' 
    AND wf2.id != 34355
);
UPDATE word_frequencies 
SET pashto_word = 'تراله' 
WHERE id = 37662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تراله' 
    AND wf2.id != 37662
);
UPDATE word_frequencies 
SET pashto_word = 'ترزه' 
WHERE id = 37594 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ترزه' 
    AND wf2.id != 37594
);
UPDATE word_frequencies 
SET pashto_word = 'ترسيس' 
WHERE id = 28561 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ترسيس' 
    AND wf2.id != 28561
);
UPDATE word_frequencies 
SET pashto_word = 'ترکارۍ' 
WHERE id = 36106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ترکارۍ' 
    AND wf2.id != 36106
);
UPDATE word_frequencies 
SET pashto_word = 'تسلیموم' 
WHERE id = 35530 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تسلیموم' 
    AND wf2.id != 35530
);
UPDATE word_frequencies 
SET pashto_word = 'تشتونه' 
WHERE id = 30265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تشتونه' 
    AND wf2.id != 30265
);
UPDATE word_frequencies 
SET pashto_word = 'تعالی' 
WHERE id = 21107 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تعالی' 
    AND wf2.id != 21107
);
UPDATE word_frequencies 
SET pashto_word = 'تعبير' 
WHERE id = 35346 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تعبير' 
    AND wf2.id != 35346
);
UPDATE word_frequencies 
SET pashto_word = 'تعليم' 
WHERE id = 25756 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تعليم' 
    AND wf2.id != 25756
);
UPDATE word_frequencies 
SET pashto_word = 'تعنک' 
WHERE id = 23099 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تعنک' 
    AND wf2.id != 23099
);
UPDATE word_frequencies 
SET pashto_word = 'تفوح' 
WHERE id = 24336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تفوح' 
    AND wf2.id != 24336
);
UPDATE word_frequencies 
SET pashto_word = 'تقسيم' 
WHERE id = 35365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تقسيم' 
    AND wf2.id != 35365
);
UPDATE word_frequencies 
SET pashto_word = 'تقوع' 
WHERE id = 34764 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تقوع' 
    AND wf2.id != 34764
);
UPDATE word_frequencies 
SET pashto_word = 'تقيل' 
WHERE id = 27579 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تقيل' 
    AND wf2.id != 27579
);
UPDATE word_frequencies 
SET pashto_word = 'تلل' 
WHERE id = 16438 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تلل' 
    AND wf2.id != 16438
);
UPDATE word_frequencies 
SET pashto_word = 'تللو' 
WHERE id = 27035 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تللو' 
    AND wf2.id != 27035
);
UPDATE word_frequencies 
SET pashto_word = 'تللی' 
WHERE id = 33782 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تللی' 
    AND wf2.id != 33782
);
UPDATE word_frequencies 
SET pashto_word = 'تللې' 
WHERE id = 30677 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تللې' 
    AND wf2.id != 30677
);
UPDATE word_frequencies 
SET pashto_word = 'تلم' 
WHERE id = 40372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تلم' 
    AND wf2.id != 40372
);
UPDATE word_frequencies 
SET pashto_word = 'تله' 
WHERE id = 31929 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تله' 
    AND wf2.id != 31929
);
UPDATE word_frequencies 
SET pashto_word = 'تلو' 
WHERE id = 22808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تلو' 
    AND wf2.id != 22808
);
UPDATE word_frequencies 
SET pashto_word = 'تلی' 
WHERE id = 41453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تلی' 
    AND wf2.id != 41453
);
UPDATE word_frequencies 
SET pashto_word = 'تلې' 
WHERE id = 28723 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تلې' 
    AND wf2.id != 28723
);
UPDATE word_frequencies 
SET pashto_word = 'تمبل' 
WHERE id = 31952 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تمبل' 
    AND wf2.id != 31952
);
UPDATE word_frequencies 
SET pashto_word = 'تمبلونه' 
WHERE id = 40360 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تمبلونه' 
    AND wf2.id != 40360
);
UPDATE word_frequencies 
SET pashto_word = 'تمنت' 
WHERE id = 39748 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تمنت' 
    AND wf2.id != 39748
);
UPDATE word_frequencies 
SET pashto_word = 'تندر' 
WHERE id = 30941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تندر' 
    AND wf2.id != 30941
);
UPDATE word_frequencies 
SET pashto_word = 'تنه' 
WHERE id = 26237 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تنه' 
    AND wf2.id != 26237
);
UPDATE word_frequencies 
SET pashto_word = 'تنګوه' 
WHERE id = 31114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تنګوه' 
    AND wf2.id != 31114
);
UPDATE word_frequencies 
SET pashto_word = 'تنګوی' 
WHERE id = 41492 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تنګوی' 
    AND wf2.id != 41492
);
UPDATE word_frequencies 
SET pashto_word = 'ته' 
WHERE id = 17013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ته' 
    AND wf2.id != 17013
);
UPDATE word_frequencies 
SET pashto_word = 'تهمت' 
WHERE id = 36948 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تهمت' 
    AND wf2.id != 36948
);
UPDATE word_frequencies 
SET pashto_word = 'توبل' 
WHERE id = 38960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توبل' 
    AND wf2.id != 38960
);
UPDATE word_frequencies 
SET pashto_word = 'تودولو' 
WHERE id = 29918 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تودولو' 
    AND wf2.id != 29918
);
UPDATE word_frequencies 
SET pashto_word = 'تورو' 
WHERE id = 30879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تورو' 
    AND wf2.id != 30879
);
UPDATE word_frequencies 
SET pashto_word = 'توروې' 
WHERE id = 37044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توروې' 
    AND wf2.id != 37044
);
UPDATE word_frequencies 
SET pashto_word = 'توفان' 
WHERE id = 35697 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توفان' 
    AND wf2.id != 35697
);
UPDATE word_frequencies 
SET pashto_word = 'تولع' 
WHERE id = 31999 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تولع' 
    AND wf2.id != 31999
);
UPDATE word_frequencies 
SET pashto_word = 'توما' 
WHERE id = 24851 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توما' 
    AND wf2.id != 24851
);
UPDATE word_frequencies 
SET pashto_word = 'تويَوی' 
WHERE id = 41450 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تويَوی' 
    AND wf2.id != 41450
);
UPDATE word_frequencies 
SET pashto_word = 'توکى' 
WHERE id = 37239 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توکى' 
    AND wf2.id != 37239
);
UPDATE word_frequencies 
SET pashto_word = 'توګه' 
WHERE id = 28382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توګه' 
    AND wf2.id != 28382
);
UPDATE word_frequencies 
SET pashto_word = 'تویوی' 
WHERE id = 40883 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تویوی' 
    AND wf2.id != 40883
);
UPDATE word_frequencies 
SET pashto_word = 'تویيوی' 
WHERE id = 41941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تویيوی' 
    AND wf2.id != 41941
);
UPDATE word_frequencies 
SET pashto_word = 'تویيږى' 
WHERE id = 41760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تویيږى' 
    AND wf2.id != 41760
);
UPDATE word_frequencies 
SET pashto_word = 'توییږي' 
WHERE id = 25132 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'توییږي' 
    AND wf2.id != 25132
);
UPDATE word_frequencies 
SET pashto_word = 'تيارولو' 
WHERE id = 39361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيارولو' 
    AND wf2.id != 39361
);
UPDATE word_frequencies 
SET pashto_word = 'تيارۀ' 
WHERE id = 31308 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيارۀ' 
    AND wf2.id != 31308
);
UPDATE word_frequencies 
SET pashto_word = 'تيراس' 
WHERE id = 38961 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيراس' 
    AND wf2.id != 38961
);
UPDATE word_frequencies 
SET pashto_word = 'تيرونه' 
WHERE id = 28461 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيرونه' 
    AND wf2.id != 28461
);
UPDATE word_frequencies 
SET pashto_word = 'تيما' 
WHERE id = 39083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيما' 
    AND wf2.id != 39083
);
UPDATE word_frequencies 
SET pashto_word = 'تيمانى' 
WHERE id = 37333 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تيمانى' 
    AND wf2.id != 37333
);
UPDATE word_frequencies 
SET pashto_word = 'تُجرمه' 
WHERE id = 38964 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تُجرمه' 
    AND wf2.id != 38964
);
UPDATE word_frequencies 
SET pashto_word = 'تُورې' 
WHERE id = 20604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تُورې' 
    AND wf2.id != 20604
);
UPDATE word_frequencies 
SET pashto_word = 'تُوکى' 
WHERE id = 37342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تُوکى' 
    AND wf2.id != 37342
);
UPDATE word_frequencies 
SET pashto_word = 'تِرضاه' 
WHERE id = 39538 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تِرضاه' 
    AND wf2.id != 39538
);
UPDATE word_frequencies 
SET pashto_word = 'تړلې' 
WHERE id = 39151 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تړلې' 
    AND wf2.id != 39151
);
UPDATE word_frequencies 
SET pashto_word = 'تړی' 
WHERE id = 41662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تړی' 
    AND wf2.id != 41662
);
UPDATE word_frequencies 
SET pashto_word = 'تړې' 
WHERE id = 37204 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تړې' 
    AND wf2.id != 37204
);
UPDATE word_frequencies 
SET pashto_word = 'تږي' 
WHERE id = 35515 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تږي' 
    AND wf2.id != 35515
);
UPDATE word_frequencies 
SET pashto_word = 'تښتم' 
WHERE id = 33400 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتم' 
    AND wf2.id != 33400
);
UPDATE word_frequencies 
SET pashto_word = 'تښتى' 
WHERE id = 19182 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتى' 
    AND wf2.id != 19182
);
UPDATE word_frequencies 
SET pashto_word = 'تښتي' 
WHERE id = 24989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتي' 
    AND wf2.id != 24989
);
UPDATE word_frequencies 
SET pashto_word = 'تښتی' 
WHERE id = 41541 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتی' 
    AND wf2.id != 41541
);
UPDATE word_frequencies 
SET pashto_word = 'تښتې' 
WHERE id = 34954 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتې' 
    AND wf2.id != 34954
);
UPDATE word_frequencies 
SET pashto_word = 'تښتېدل' 
WHERE id = 32853 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتېدل' 
    AND wf2.id != 32853
);
UPDATE word_frequencies 
SET pashto_word = 'تښتېدلو' 
WHERE id = 39140 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتېدلو' 
    AND wf2.id != 39140
);
UPDATE word_frequencies 
SET pashto_word = 'تښتېدلی' 
WHERE id = 34807 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تښتېدلی' 
    AND wf2.id != 34807
);
UPDATE word_frequencies 
SET pashto_word = 'تکليف' 
WHERE id = 39653 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تکليف' 
    AND wf2.id != 39653
);
UPDATE word_frequencies 
SET pashto_word = 'تۀ' 
WHERE id = 16209 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تۀ' 
    AND wf2.id != 16209
);
UPDATE word_frequencies 
SET pashto_word = 'تیارول' 
WHERE id = 29931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیارول' 
    AND wf2.id != 29931
);
UPDATE word_frequencies 
SET pashto_word = 'تیاروم' 
WHERE id = 30661 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیاروم' 
    AND wf2.id != 30661
);
UPDATE word_frequencies 
SET pashto_word = 'تیاروی' 
WHERE id = 40750 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیاروی' 
    AND wf2.id != 40750
);
UPDATE word_frequencies 
SET pashto_word = 'تیاریږي' 
WHERE id = 23122 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیاریږي' 
    AND wf2.id != 23122
);
UPDATE word_frequencies 
SET pashto_word = 'تیمان' 
WHERE id = 36061 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیمان' 
    AND wf2.id != 36061
);
UPDATE word_frequencies 
SET pashto_word = 'تیږو' 
WHERE id = 30587 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیږو' 
    AND wf2.id != 30587
);
UPDATE word_frequencies 
SET pashto_word = 'تیږې' 
WHERE id = 30096 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تیږې' 
    AND wf2.id != 30096
);
UPDATE word_frequencies 
SET pashto_word = 'تېراوه' 
WHERE id = 24894 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېراوه' 
    AND wf2.id != 24894
);
UPDATE word_frequencies 
SET pashto_word = 'تېروله' 
WHERE id = 35039 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروله' 
    AND wf2.id != 35039
);
UPDATE word_frequencies 
SET pashto_word = 'تېرولو' 
WHERE id = 21234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرولو' 
    AND wf2.id != 21234
);
UPDATE word_frequencies 
SET pashto_word = 'تېرولې' 
WHERE id = 37765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرولې' 
    AND wf2.id != 37765
);
UPDATE word_frequencies 
SET pashto_word = 'تېروم' 
WHERE id = 28255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروم' 
    AND wf2.id != 28255
);
UPDATE word_frequencies 
SET pashto_word = 'تېروو' 
WHERE id = 22375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروو' 
    AND wf2.id != 22375
);
UPDATE word_frequencies 
SET pashto_word = 'تېروى' 
WHERE id = 17078 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروى' 
    AND wf2.id != 17078
);
UPDATE word_frequencies 
SET pashto_word = 'تېروي' 
WHERE id = 25260 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروي' 
    AND wf2.id != 25260
);
UPDATE word_frequencies 
SET pashto_word = 'تېروی' 
WHERE id = 41135 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروی' 
    AND wf2.id != 41135
);
UPDATE word_frequencies 
SET pashto_word = 'تېروې' 
WHERE id = 33366 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېروې' 
    AND wf2.id != 33366
);
UPDATE word_frequencies 
SET pashto_word = 'تېریږی' 
WHERE id = 40791 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېریږی' 
    AND wf2.id != 40791
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېدل' 
WHERE id = 37703 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېدل' 
    AND wf2.id != 37703
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېدلی' 
WHERE id = 41537 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېدلی' 
    AND wf2.id != 41537
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېدم' 
WHERE id = 30687 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېدم' 
    AND wf2.id != 30687
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېده' 
WHERE id = 29763 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېده' 
    AND wf2.id != 29763
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېدو' 
WHERE id = 40158 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېدو' 
    AND wf2.id != 40158
);
UPDATE word_frequencies 
SET pashto_word = 'تېرېږی' 
WHERE id = 42144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېرېږی' 
    AND wf2.id != 42144
);
UPDATE word_frequencies 
SET pashto_word = 'تېز' 
WHERE id = 29584 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېز' 
    AND wf2.id != 29584
);
UPDATE word_frequencies 
SET pashto_word = 'تېل' 
WHERE id = 17479 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېل' 
    AND wf2.id != 17479
);
UPDATE word_frequencies 
SET pashto_word = 'تېلو' 
WHERE id = 23857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'تېلو' 
    AND wf2.id != 23857
);
UPDATE word_frequencies 
SET pashto_word = 'ثابِتوى' 
WHERE id = 37519 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ثابِتوى' 
    AND wf2.id != 37519
);
UPDATE word_frequencies 
SET pashto_word = 'جات' 
WHERE id = 40409 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جات' 
    AND wf2.id != 40409
);
UPDATE word_frequencies 
SET pashto_word = 'جاد' 
WHERE id = 22749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جاد' 
    AND wf2.id != 22749
);
UPDATE word_frequencies 
SET pashto_word = 'جادوګر' 
WHERE id = 21870 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جادوګر' 
    AND wf2.id != 21870
);
UPDATE word_frequencies 
SET pashto_word = 'جادوګران' 
WHERE id = 30120 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جادوګران' 
    AND wf2.id != 30120
);
UPDATE word_frequencies 
SET pashto_word = 'جادوګرانو' 
WHERE id = 30116 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جادوګرانو' 
    AND wf2.id != 30116
);
UPDATE word_frequencies 
SET pashto_word = 'جادوګرو' 
WHERE id = 27575 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جادوګرو' 
    AND wf2.id != 27575
);
UPDATE word_frequencies 
SET pashto_word = 'جادوګرۍ' 
WHERE id = 34691 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جادوګرۍ' 
    AND wf2.id != 34691
);
UPDATE word_frequencies 
SET pashto_word = 'جازر' 
WHERE id = 37590 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جازر' 
    AND wf2.id != 37590
);
UPDATE word_frequencies 
SET pashto_word = 'جالۍ' 
WHERE id = 39377 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جالۍ' 
    AND wf2.id != 39377
);
UPDATE word_frequencies 
SET pashto_word = 'جامو' 
WHERE id = 39310 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جامو' 
    AND wf2.id != 39310
);
UPDATE word_frequencies 
SET pashto_word = 'جامونه' 
WHERE id = 21307 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جامونه' 
    AND wf2.id != 21307
);
UPDATE word_frequencies 
SET pashto_word = 'جامې' 
WHERE id = 24468 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جامې' 
    AND wf2.id != 24468
);
UPDATE word_frequencies 
SET pashto_word = 'جانانه' 
WHERE id = 20688 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جانانه' 
    AND wf2.id != 20688
);
UPDATE word_frequencies 
SET pashto_word = 'جانګى' 
WHERE id = 39392 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جانګى' 
    AND wf2.id != 39392
);
UPDATE word_frequencies 
SET pashto_word = 'جبتون' 
WHERE id = 28281 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبتون' 
    AND wf2.id != 28281
);
UPDATE word_frequencies 
SET pashto_word = 'جبرایيل' 
WHERE id = 41892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبرایيل' 
    AND wf2.id != 41892
);
UPDATE word_frequencies 
SET pashto_word = 'جبرایيله' 
WHERE id = 41890 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبرایيله' 
    AND wf2.id != 41890
);
UPDATE word_frequencies 
SET pashto_word = 'جبع' 
WHERE id = 37692 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبع' 
    AND wf2.id != 37692
);
UPDATE word_frequencies 
SET pashto_word = 'جبعه' 
WHERE id = 28813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبعه' 
    AND wf2.id != 28813
);
UPDATE word_frequencies 
SET pashto_word = 'جبعون' 
WHERE id = 24342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جبعون' 
    AND wf2.id != 24342
);
UPDATE word_frequencies 
SET pashto_word = 'جدر' 
WHERE id = 37591 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جدر' 
    AND wf2.id != 37591
);
UPDATE word_frequencies 
SET pashto_word = 'جدعون' 
WHERE id = 29548 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جدعون' 
    AND wf2.id != 29548
);
UPDATE word_frequencies 
SET pashto_word = 'جدلياه' 
WHERE id = 40269 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جدلياه' 
    AND wf2.id != 40269
);
UPDATE word_frequencies 
SET pashto_word = 'جدور' 
WHERE id = 28274 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جدور' 
    AND wf2.id != 28274
);
UPDATE word_frequencies 
SET pashto_word = 'جديروت' 
WHERE id = 39740 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جديروت' 
    AND wf2.id != 39740
);
UPDATE word_frequencies 
SET pashto_word = 'جرجاسى' 
WHERE id = 38985 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جرجاسى' 
    AND wf2.id != 38985
);
UPDATE word_frequencies 
SET pashto_word = 'جرجاسيان' 
WHERE id = 39605 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جرجاسيان' 
    AND wf2.id != 39605
);
UPDATE word_frequencies 
SET pashto_word = 'جرجاشیان' 
WHERE id = 35574 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جرجاشیان' 
    AND wf2.id != 35574
);
UPDATE word_frequencies 
SET pashto_word = 'جرشون' 
WHERE id = 6365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جرشون' 
    AND wf2.id != 6365
);
UPDATE word_frequencies 
SET pashto_word = 'جزر' 
WHERE id = 32292 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جزر' 
    AND wf2.id != 32292
);
UPDATE word_frequencies 
SET pashto_word = 'جلال' 
WHERE id = 23663 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جلال' 
    AND wf2.id != 23663
);
UPDATE word_frequencies 
SET pashto_word = 'جلعاد' 
WHERE id = 37598 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جلعاد' 
    AND wf2.id != 37598
);
UPDATE word_frequencies 
SET pashto_word = 'جلیل' 
WHERE id = 34353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جلیل' 
    AND wf2.id != 34353
);
UPDATE word_frequencies 
SET pashto_word = 'جنګ' 
WHERE id = 37006 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنګ' 
    AND wf2.id != 37006
);
UPDATE word_frequencies 
SET pashto_word = 'جنګونه' 
WHERE id = 32533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنګونه' 
    AND wf2.id != 32533
);
UPDATE word_frequencies 
SET pashto_word = 'جنګونو' 
WHERE id = 36932 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنګونو' 
    AND wf2.id != 36932
);
UPDATE word_frequencies 
SET pashto_word = 'جنګیږي' 
WHERE id = 34076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنګیږي' 
    AND wf2.id != 34076
);
UPDATE word_frequencies 
SET pashto_word = 'جنګېدل' 
WHERE id = 39923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنګېدل' 
    AND wf2.id != 39923
);
UPDATE word_frequencies 
SET pashto_word = 'جنیم' 
WHERE id = 37628 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جنیم' 
    AND wf2.id != 37628
);
UPDATE word_frequencies 
SET pashto_word = 'جوجه' 
WHERE id = 25623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوجه' 
    AND wf2.id != 25623
);
UPDATE word_frequencies 
SET pashto_word = 'جوزان' 
WHERE id = 27418 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوزان' 
    AND wf2.id != 27418
);
UPDATE word_frequencies 
SET pashto_word = 'جولان' 
WHERE id = 39780 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جولان' 
    AND wf2.id != 39780
);
UPDATE word_frequencies 
SET pashto_word = 'جونى' 
WHERE id = 32008 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جونى' 
    AND wf2.id != 32008
);
UPDATE word_frequencies 
SET pashto_word = 'جوړول' 
WHERE id = 30869 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړول' 
    AND wf2.id != 30869
);
UPDATE word_frequencies 
SET pashto_word = 'جوړولو' 
WHERE id = 40396 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړولو' 
    AND wf2.id != 40396
);
UPDATE word_frequencies 
SET pashto_word = 'جوړولی' 
WHERE id = 41428 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړولی' 
    AND wf2.id != 41428
);
UPDATE word_frequencies 
SET pashto_word = 'جوړولې' 
WHERE id = 22607 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړولې' 
    AND wf2.id != 22607
);
UPDATE word_frequencies 
SET pashto_word = 'جوړوم' 
WHERE id = 21252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړوم' 
    AND wf2.id != 21252
);
UPDATE word_frequencies 
SET pashto_word = 'جوړوه' 
WHERE id = 32739 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړوه' 
    AND wf2.id != 32739
);
UPDATE word_frequencies 
SET pashto_word = 'جوړوى' 
WHERE id = 31397 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړوى' 
    AND wf2.id != 31397
);
UPDATE word_frequencies 
SET pashto_word = 'جوړوی' 
WHERE id = 40614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړوی' 
    AND wf2.id != 40614
);
UPDATE word_frequencies 
SET pashto_word = 'جوړوې' 
WHERE id = 26423 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړوې' 
    AND wf2.id != 26423
);
UPDATE word_frequencies 
SET pashto_word = 'جوړيږى' 
WHERE id = 18824 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړيږى' 
    AND wf2.id != 18824
);
UPDATE word_frequencies 
SET pashto_word = 'جوړَوی' 
WHERE id = 41210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړَوی' 
    AND wf2.id != 41210
);
UPDATE word_frequencies 
SET pashto_word = 'جوړېدو' 
WHERE id = 40093 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړېدو' 
    AND wf2.id != 40093
);
UPDATE word_frequencies 
SET pashto_word = 'جوړېږه' 
WHERE id = 36571 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړېږه' 
    AND wf2.id != 36571
);
UPDATE word_frequencies 
SET pashto_word = 'جوړېږی' 
WHERE id = 41592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جوړېږی' 
    AND wf2.id != 41592
);
UPDATE word_frequencies 
SET pashto_word = 'جویيم' 
WHERE id = 42077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جویيم' 
    AND wf2.id != 42077
);
UPDATE word_frequencies 
SET pashto_word = 'جيرا' 
WHERE id = 32005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جيرا' 
    AND wf2.id != 32005
);
UPDATE word_frequencies 
SET pashto_word = 'جيرسون' 
WHERE id = 26235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جيرسون' 
    AND wf2.id != 26235
);
UPDATE word_frequencies 
SET pashto_word = 'جينکو' 
WHERE id = 24413 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جينکو' 
    AND wf2.id != 24413
);
UPDATE word_frequencies 
SET pashto_word = 'جينۍ' 
WHERE id = 38728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جينۍ' 
    AND wf2.id != 38728
);
UPDATE word_frequencies 
SET pashto_word = 'جُدا' 
WHERE id = 22174 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جُدا' 
    AND wf2.id != 22174
);
UPDATE word_frequencies 
SET pashto_word = 'جُمر' 
WHERE id = 38957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جُمر' 
    AND wf2.id != 38957
);
UPDATE word_frequencies 
SET pashto_word = 'جِلعاد' 
WHERE id = 28767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جِلعاد' 
    AND wf2.id != 28767
);
UPDATE word_frequencies 
SET pashto_word = 'جګړه' 
WHERE id = 34801 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جګړه' 
    AND wf2.id != 34801
);
UPDATE word_frequencies 
SET pashto_word = 'جګړې' 
WHERE id = 29535 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جګړې' 
    AND wf2.id != 29535
);
UPDATE word_frequencies 
SET pashto_word = 'جې' 
WHERE id = 35300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'جې' 
    AND wf2.id != 35300
);
UPDATE word_frequencies 
SET pashto_word = 'حاران' 
WHERE id = 40287 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاران' 
    AND wf2.id != 40287
);
UPDATE word_frequencies 
SET pashto_word = 'حاشوم' 
WHERE id = 38057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاشوم' 
    AND wf2.id != 38057
);
UPDATE word_frequencies 
SET pashto_word = 'حاصل' 
WHERE id = 35232 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاصل' 
    AND wf2.id != 35232
);
UPDATE word_frequencies 
SET pashto_word = 'حاصلوی' 
WHERE id = 40686 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاصلوی' 
    AND wf2.id != 40686
);
UPDATE word_frequencies 
SET pashto_word = 'حاصليږى' 
WHERE id = 25912 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاصليږى' 
    AND wf2.id != 25912
);
UPDATE word_frequencies 
SET pashto_word = 'حاصور' 
WHERE id = 25988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاصور' 
    AND wf2.id != 25988
);
UPDATE word_frequencies 
SET pashto_word = 'حاضريږى' 
WHERE id = 28683 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاضريږى' 
    AND wf2.id != 28683
);
UPDATE word_frequencies 
SET pashto_word = 'حاضرېدلی' 
WHERE id = 42086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاضرېدلی' 
    AND wf2.id != 42086
);
UPDATE word_frequencies 
SET pashto_word = 'حال' 
WHERE id = 16184 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حال' 
    AND wf2.id != 16184
);
UPDATE word_frequencies 
SET pashto_word = 'حاکمان' 
WHERE id = 26783 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاکمان' 
    AND wf2.id != 26783
);
UPDATE word_frequencies 
SET pashto_word = 'حاکمانو' 
WHERE id = 29511 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حاکمانو' 
    AND wf2.id != 29511
);
UPDATE word_frequencies 
SET pashto_word = 'حت' 
WHERE id = 38982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حت' 
    AND wf2.id != 38982
);
UPDATE word_frequencies 
SET pashto_word = 'حجلاه' 
WHERE id = 32206 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حجلاه' 
    AND wf2.id != 32206
);
UPDATE word_frequencies 
SET pashto_word = 'حجله' 
WHERE id = 31461 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حجله' 
    AND wf2.id != 31461
);
UPDATE word_frequencies 
SET pashto_word = 'حجى' 
WHERE id = 32002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حجى' 
    AND wf2.id != 32002
);
UPDATE word_frequencies 
SET pashto_word = 'حدد' 
WHERE id = 39082 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حدد' 
    AND wf2.id != 39082
);
UPDATE word_frequencies 
SET pashto_word = 'حرص' 
WHERE id = 29963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حرص' 
    AND wf2.id != 29963
);
UPDATE word_frequencies 
SET pashto_word = 'حرما' 
WHERE id = 10657 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حرما' 
    AND wf2.id != 10657
);
UPDATE word_frequencies 
SET pashto_word = 'حرمه' 
WHERE id = 37624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حرمه' 
    AND wf2.id != 37624
);
UPDATE word_frequencies 
SET pashto_word = 'حزقياه' 
WHERE id = 40296 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حزقياه' 
    AND wf2.id != 40296
);
UPDATE word_frequencies 
SET pashto_word = 'حزو' 
WHERE id = 36045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حزو' 
    AND wf2.id != 36045
);
UPDATE word_frequencies 
SET pashto_word = 'حسابيږى' 
WHERE id = 32903 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حسابيږى' 
    AND wf2.id != 32903
);
UPDATE word_frequencies 
SET pashto_word = 'حسابیږی' 
WHERE id = 40917 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حسابیږی' 
    AND wf2.id != 40917
);
UPDATE word_frequencies 
SET pashto_word = 'حسبياه' 
WHERE id = 32609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حسبياه' 
    AND wf2.id != 32609
);
UPDATE word_frequencies 
SET pashto_word = 'حشبون' 
WHERE id = 37735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حشبون' 
    AND wf2.id != 37735
);
UPDATE word_frequencies 
SET pashto_word = 'حشمون' 
WHERE id = 37622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حشمون' 
    AND wf2.id != 37622
);
UPDATE word_frequencies 
SET pashto_word = 'حصارسعول' 
WHERE id = 28807 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حصارسعول' 
    AND wf2.id != 28807
);
UPDATE word_frequencies 
SET pashto_word = 'حصارماوت' 
WHERE id = 38998 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حصارماوت' 
    AND wf2.id != 38998
);
UPDATE word_frequencies 
SET pashto_word = 'حصرون' 
WHERE id = 40302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حصرون' 
    AND wf2.id != 40302
);
UPDATE word_frequencies 
SET pashto_word = 'حصور' 
WHERE id = 24582 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حصور' 
    AND wf2.id != 24582
);
UPDATE word_frequencies 
SET pashto_word = 'حلالوى' 
WHERE id = 39448 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلالوى' 
    AND wf2.id != 39448
);
UPDATE word_frequencies 
SET pashto_word = 'حلالوي' 
WHERE id = 36485 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلالوي' 
    AND wf2.id != 36485
);
UPDATE word_frequencies 
SET pashto_word = 'حلالوی' 
WHERE id = 41709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلالوی' 
    AND wf2.id != 41709
);
UPDATE word_frequencies 
SET pashto_word = 'حلاليږى' 
WHERE id = 32135 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلاليږى' 
    AND wf2.id != 32135
);
UPDATE word_frequencies 
SET pashto_word = 'حلبه' 
WHERE id = 37773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلبه' 
    AND wf2.id != 37773
);
UPDATE word_frequencies 
SET pashto_word = 'حلقیا' 
WHERE id = 10667 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حلقیا' 
    AND wf2.id != 10667
);
UPDATE word_frequencies 
SET pashto_word = 'حمات' 
WHERE id = 25380 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حمات' 
    AND wf2.id != 25380
);
UPDATE word_frequencies 
SET pashto_word = 'حماتى' 
WHERE id = 38991 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حماتى' 
    AND wf2.id != 38991
);
UPDATE word_frequencies 
SET pashto_word = 'حمدان' 
WHERE id = 36068 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حمدان' 
    AND wf2.id != 36068
);
UPDATE word_frequencies 
SET pashto_word = 'حمون' 
WHERE id = 37675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حمون' 
    AND wf2.id != 37675
);
UPDATE word_frequencies 
SET pashto_word = 'حنان' 
WHERE id = 40354 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حنان' 
    AND wf2.id != 40354
);
UPDATE word_frequencies 
SET pashto_word = 'حننياه' 
WHERE id = 40298 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حننياه' 
    AND wf2.id != 40298
);
UPDATE word_frequencies 
SET pashto_word = 'حننیا' 
WHERE id = 38030 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حننیا' 
    AND wf2.id != 38030
);
UPDATE word_frequencies 
SET pashto_word = 'حنوک' 
WHERE id = 22147 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حنوک' 
    AND wf2.id != 22147
);
UPDATE word_frequencies 
SET pashto_word = 'حولون' 
WHERE id = 28106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حولون' 
    AND wf2.id != 28106
);
UPDATE word_frequencies 
SET pashto_word = 'حويله' 
WHERE id = 38972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حويله' 
    AND wf2.id != 38972
);
UPDATE word_frequencies 
SET pashto_word = 'حُرمه' 
WHERE id = 26375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حُرمه' 
    AND wf2.id != 26375
);
UPDATE word_frequencies 
SET pashto_word = 'حُول' 
WHERE id = 38994 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حُول' 
    AND wf2.id != 38994
);
UPDATE word_frequencies 
SET pashto_word = 'حِتيان' 
WHERE id = 23227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِتيان' 
    AND wf2.id != 23227
);
UPDATE word_frequencies 
SET pashto_word = 'حِتيانو' 
WHERE id = 22188 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِتيانو' 
    AND wf2.id != 22188
);
UPDATE word_frequencies 
SET pashto_word = 'حِصه' 
WHERE id = 39403 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِصه' 
    AND wf2.id != 39403
);
UPDATE word_frequencies 
SET pashto_word = 'حِفر' 
WHERE id = 32211 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِفر' 
    AND wf2.id != 32211
);
UPDATE word_frequencies 
SET pashto_word = 'حِوى' 
WHERE id = 38986 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِوى' 
    AND wf2.id != 38986
);
UPDATE word_frequencies 
SET pashto_word = 'حِويان' 
WHERE id = 32085 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِويان' 
    AND wf2.id != 32085
);
UPDATE word_frequencies 
SET pashto_word = 'حِکمت' 
WHERE id = 22317 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حِکمت' 
    AND wf2.id != 22317
);
UPDATE word_frequencies 
SET pashto_word = 'حکم' 
WHERE id = 25487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکم' 
    AND wf2.id != 25487
);
UPDATE word_frequencies 
SET pashto_word = 'حکمت' 
WHERE id = 25292 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکمت' 
    AND wf2.id != 25292
);
UPDATE word_frequencies 
SET pashto_word = 'حکمران' 
WHERE id = 26500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکمران' 
    AND wf2.id != 26500
);
UPDATE word_frequencies 
SET pashto_word = 'حکمرانان' 
WHERE id = 22806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکمرانان' 
    AND wf2.id != 22806
);
UPDATE word_frequencies 
SET pashto_word = 'حکمرانانو' 
WHERE id = 21876 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکمرانانو' 
    AND wf2.id != 21876
);
UPDATE word_frequencies 
SET pashto_word = 'حکومت' 
WHERE id = 29487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حکومت' 
    AND wf2.id != 29487
);
UPDATE word_frequencies 
SET pashto_word = 'حیتي' 
WHERE id = 35132 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حیتي' 
    AND wf2.id != 35132
);
UPDATE word_frequencies 
SET pashto_word = 'حیتیان' 
WHERE id = 27634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حیتیان' 
    AND wf2.id != 27634
);
UPDATE word_frequencies 
SET pashto_word = 'حیتیانو' 
WHERE id = 22911 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حیتیانو' 
    AND wf2.id != 22911
);
UPDATE word_frequencies 
SET pashto_word = 'حیوانات' 
WHERE id = 21526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'حیوانات' 
    AND wf2.id != 21526
);
UPDATE word_frequencies 
SET pashto_word = 'خاطر' 
WHERE id = 29605 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاطر' 
    AND wf2.id != 29605
);
UPDATE word_frequencies 
SET pashto_word = 'خاطره' 
WHERE id = 32620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاطره' 
    AND wf2.id != 32620
);
UPDATE word_frequencies 
SET pashto_word = 'خاندان' 
WHERE id = 32009 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاندان' 
    AND wf2.id != 32009
);
UPDATE word_frequencies 
SET pashto_word = 'خاندانه' 
WHERE id = 31109 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاندانه' 
    AND wf2.id != 31109
);
UPDATE word_frequencies 
SET pashto_word = 'خاندي' 
WHERE id = 29737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاندي' 
    AND wf2.id != 29737
);
UPDATE word_frequencies 
SET pashto_word = 'خاندی' 
WHERE id = 41841 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاندی' 
    AND wf2.id != 41841
);
UPDATE word_frequencies 
SET pashto_word = 'خاوره' 
WHERE id = 25466 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاوره' 
    AND wf2.id != 25466
);
UPDATE word_frequencies 
SET pashto_word = 'خاورې' 
WHERE id = 38616 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاورې' 
    AND wf2.id != 38616
);
UPDATE word_frequencies 
SET pashto_word = 'خاوند' 
WHERE id = 29488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاوند' 
    AND wf2.id != 29488
);
UPDATE word_frequencies 
SET pashto_word = 'خاوندان' 
WHERE id = 33534 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاوندان' 
    AND wf2.id != 33534
);
UPDATE word_frequencies 
SET pashto_word = 'خاوندانو' 
WHERE id = 26839 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خاوندانو' 
    AND wf2.id != 26839
);
UPDATE word_frequencies 
SET pashto_word = 'خبر' 
WHERE id = 39962 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خبر' 
    AND wf2.id != 39962
);
UPDATE word_frequencies 
SET pashto_word = 'خبردار' 
WHERE id = 37138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خبردار' 
    AND wf2.id != 37138
);
UPDATE word_frequencies 
SET pashto_word = 'خبره' 
WHERE id = 39786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خبره' 
    AND wf2.id != 39786
);
UPDATE word_frequencies 
SET pashto_word = 'خبریږی' 
WHERE id = 40868 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خبریږی' 
    AND wf2.id != 40868
);
UPDATE word_frequencies 
SET pashto_word = 'خبرې' 
WHERE id = 36385 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خبرې' 
    AND wf2.id != 36385
);
UPDATE word_frequencies 
SET pashto_word = 'ختلی' 
WHERE id = 33855 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ختلی' 
    AND wf2.id != 33855
);
UPDATE word_frequencies 
SET pashto_word = 'ختلې' 
WHERE id = 23960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ختلې' 
    AND wf2.id != 23960
);
UPDATE word_frequencies 
SET pashto_word = 'ختموى' 
WHERE id = 23056 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ختموى' 
    AND wf2.id != 23056
);
UPDATE word_frequencies 
SET pashto_word = 'ختميږى' 
WHERE id = 15834 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ختميږى' 
    AND wf2.id != 15834
);
UPDATE word_frequencies 
SET pashto_word = 'ختمیږي' 
WHERE id = 33685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ختمیږي' 
    AND wf2.id != 33685
);
UPDATE word_frequencies 
SET pashto_word = 'خدای' 
WHERE id = 35823 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خدای' 
    AND wf2.id != 35823
);
UPDATE word_frequencies 
SET pashto_word = 'خدایان' 
WHERE id = 27415 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خدایان' 
    AND wf2.id != 27415
);
UPDATE word_frequencies 
SET pashto_word = 'خدایه' 
WHERE id = 15463 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خدایه' 
    AND wf2.id != 15463
);
UPDATE word_frequencies 
SET pashto_word = 'خر' 
WHERE id = 30554 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خر' 
    AND wf2.id != 30554
);
UPDATE word_frequencies 
SET pashto_word = 'خرابوم' 
WHERE id = 36931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرابوم' 
    AND wf2.id != 36931
);
UPDATE word_frequencies 
SET pashto_word = 'خرابوه' 
WHERE id = 36595 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرابوه' 
    AND wf2.id != 36595
);
UPDATE word_frequencies 
SET pashto_word = 'خرابوى' 
WHERE id = 29066 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرابوى' 
    AND wf2.id != 29066
);
UPDATE word_frequencies 
SET pashto_word = 'خره' 
WHERE id = 36058 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خره' 
    AND wf2.id != 36058
);
UPDATE word_frequencies 
SET pashto_word = 'خرو' 
WHERE id = 28373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرو' 
    AND wf2.id != 28373
);
UPDATE word_frequencies 
SET pashto_word = 'خرونو' 
WHERE id = 28659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرونو' 
    AND wf2.id != 28659
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅول' 
WHERE id = 29775 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅول' 
    AND wf2.id != 29775
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅوله' 
WHERE id = 39177 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅوله' 
    AND wf2.id != 39177
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅوی' 
WHERE id = 40877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅوی' 
    AND wf2.id != 40877
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅیږي' 
WHERE id = 33954 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅیږي' 
    AND wf2.id != 33954
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅیږی' 
WHERE id = 40898 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅیږی' 
    AND wf2.id != 40898
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅېدل' 
WHERE id = 34995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅېدل' 
    AND wf2.id != 34995
);
UPDATE word_frequencies 
SET pashto_word = 'خرڅېدلې' 
WHERE id = 35005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرڅېدلې' 
    AND wf2.id != 35005
);
UPDATE word_frequencies 
SET pashto_word = 'خرۀ' 
WHERE id = 31899 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خرۀ' 
    AND wf2.id != 31899
);
UPDATE word_frequencies 
SET pashto_word = 'خزانچيان' 
WHERE id = 35290 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خزانچيان' 
    AND wf2.id != 35290
);
UPDATE word_frequencies 
SET pashto_word = 'خزانچيانو' 
WHERE id = 35289 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خزانچيانو' 
    AND wf2.id != 35289
);
UPDATE word_frequencies 
SET pashto_word = 'خستلو' 
WHERE id = 40200 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خستلو' 
    AND wf2.id != 40200
);
UPDATE word_frequencies 
SET pashto_word = 'خفګان' 
WHERE id = 32576 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خفګان' 
    AND wf2.id != 32576
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصولی' 
WHERE id = 27297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصولی' 
    AND wf2.id != 27297
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصوم' 
WHERE id = 36634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصوم' 
    AND wf2.id != 36634
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصون' 
WHERE id = 23805 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصون' 
    AND wf2.id != 23805
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصوونکيه' 
WHERE id = 32740 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصوونکيه' 
    AND wf2.id != 32740
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصوى' 
WHERE id = 29015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصوى' 
    AND wf2.id != 29015
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصیږي' 
WHERE id = 30737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصیږي' 
    AND wf2.id != 30737
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصېدله' 
WHERE id = 27785 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصېدله' 
    AND wf2.id != 27785
);
UPDATE word_frequencies 
SET pashto_word = 'خلاصېدلې' 
WHERE id = 35913 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاصېدلې' 
    AND wf2.id != 35913
);
UPDATE word_frequencies 
SET pashto_word = 'خلاف' 
WHERE id = 21571 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلاف' 
    AND wf2.id != 21571
);
UPDATE word_frequencies 
SET pashto_word = 'خلدى' 
WHERE id = 28520 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلدى' 
    AND wf2.id != 28520
);
UPDATE word_frequencies 
SET pashto_word = 'خلق' 
WHERE id = 16841 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلق' 
    AND wf2.id != 16841
);
UPDATE word_frequencies 
SET pashto_word = 'خلقو' 
WHERE id = 26358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلقو' 
    AND wf2.id != 26358
);
UPDATE word_frequencies 
SET pashto_word = 'خلى' 
WHERE id = 24270 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلى' 
    AND wf2.id != 24270
);
UPDATE word_frequencies 
SET pashto_word = 'خلک' 
WHERE id = 20897 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلک' 
    AND wf2.id != 20897
);
UPDATE word_frequencies 
SET pashto_word = 'خلکو' 
WHERE id = 16751 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خلکو' 
    AND wf2.id != 16751
);
UPDATE word_frequencies 
SET pashto_word = 'خوا' 
WHERE id = 22488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوا' 
    AND wf2.id != 22488
);
UPDATE word_frequencies 
SET pashto_word = 'خواته' 
WHERE id = 27288 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خواته' 
    AND wf2.id != 27288
);
UPDATE word_frequencies 
SET pashto_word = 'خواهشات' 
WHERE id = 36543 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خواهشات' 
    AND wf2.id != 36543
);
UPDATE word_frequencies 
SET pashto_word = 'خواړه' 
WHERE id = 30200 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خواړه' 
    AND wf2.id != 30200
);
UPDATE word_frequencies 
SET pashto_word = 'خور' 
WHERE id = 39143 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خور' 
    AND wf2.id != 39143
);
UPDATE word_frequencies 
SET pashto_word = 'خوراک' 
WHERE id = 23244 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوراک' 
    AND wf2.id != 23244
);
UPDATE word_frequencies 
SET pashto_word = 'خورجین' 
WHERE id = 34236 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خورجین' 
    AND wf2.id != 34236
);
UPDATE word_frequencies 
SET pashto_word = 'خورم' 
WHERE id = 27467 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خورم' 
    AND wf2.id != 27467
);
UPDATE word_frequencies 
SET pashto_word = 'خوره' 
WHERE id = 32807 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوره' 
    AND wf2.id != 32807
);
UPDATE word_frequencies 
SET pashto_word = 'خورو' 
WHERE id = 23486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خورو' 
    AND wf2.id != 23486
);
UPDATE word_frequencies 
SET pashto_word = 'خوروى' 
WHERE id = 21991 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوروى' 
    AND wf2.id != 21991
);
UPDATE word_frequencies 
SET pashto_word = 'خورى' 
WHERE id = 16533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خورى' 
    AND wf2.id != 16533
);
UPDATE word_frequencies 
SET pashto_word = 'خوري' 
WHERE id = 16752 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوري' 
    AND wf2.id != 16752
);
UPDATE word_frequencies 
SET pashto_word = 'خوريږى' 
WHERE id = 25982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوريږى' 
    AND wf2.id != 25982
);
UPDATE word_frequencies 
SET pashto_word = 'خوری' 
WHERE id = 40583 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوری' 
    AND wf2.id != 40583
);
UPDATE word_frequencies 
SET pashto_word = 'خورې' 
WHERE id = 20445 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خورې' 
    AND wf2.id != 20445
);
UPDATE word_frequencies 
SET pashto_word = 'خوسی' 
WHERE id = 24057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوسی' 
    AND wf2.id != 24057
);
UPDATE word_frequencies 
SET pashto_word = 'خوسیان' 
WHERE id = 31628 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوسیان' 
    AND wf2.id != 31628
);
UPDATE word_frequencies 
SET pashto_word = 'خوشبویي' 
WHERE id = 34613 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشبویي' 
    AND wf2.id != 34613
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالوه' 
WHERE id = 32423 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالوه' 
    AND wf2.id != 32423
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالوى' 
WHERE id = 22982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالوى' 
    AND wf2.id != 22982
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالوی' 
WHERE id = 40749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالوی' 
    AND wf2.id != 40749
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالى' 
WHERE id = 28039 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالى' 
    AND wf2.id != 28039
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحاليږى' 
WHERE id = 18141 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحاليږى' 
    AND wf2.id != 18141
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحاليږينه' 
WHERE id = 38797 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحاليږينه' 
    AND wf2.id != 38797
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالیږي' 
WHERE id = 21614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالیږي' 
    AND wf2.id != 21614
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالېده' 
WHERE id = 34828 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالېده' 
    AND wf2.id != 34828
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالېږم' 
WHERE id = 27737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالېږم' 
    AND wf2.id != 27737
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالېږمه' 
WHERE id = 38645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالېږمه' 
    AND wf2.id != 38645
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالېږی' 
WHERE id = 41508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالېږی' 
    AND wf2.id != 41508
);
UPDATE word_frequencies 
SET pashto_word = 'خوشحالېږې' 
WHERE id = 31569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوشحالېږې' 
    AND wf2.id != 31569
);
UPDATE word_frequencies 
SET pashto_word = 'خوندونه' 
WHERE id = 38781 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوندونه' 
    AND wf2.id != 38781
);
UPDATE word_frequencies 
SET pashto_word = 'خوځول' 
WHERE id = 34321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوځول' 
    AND wf2.id != 34321
);
UPDATE word_frequencies 
SET pashto_word = 'خوځوى' 
WHERE id = 32262 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوځوى' 
    AND wf2.id != 32262
);
UPDATE word_frequencies 
SET pashto_word = 'خوځيږى' 
WHERE id = 37538 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوځيږى' 
    AND wf2.id != 37538
);
UPDATE word_frequencies 
SET pashto_word = 'خوځیږی' 
WHERE id = 40738 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوځیږی' 
    AND wf2.id != 40738
);
UPDATE word_frequencies 
SET pashto_word = 'خوړل' 
WHERE id = 18007 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوړل' 
    AND wf2.id != 18007
);
UPDATE word_frequencies 
SET pashto_word = 'خوړله' 
WHERE id = 19780 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوړله' 
    AND wf2.id != 19780
);
UPDATE word_frequencies 
SET pashto_word = 'خوړلى' 
WHERE id = 32420 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوړلى' 
    AND wf2.id != 32420
);
UPDATE word_frequencies 
SET pashto_word = 'خوړلی' 
WHERE id = 30576 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوړلی' 
    AND wf2.id != 30576
);
UPDATE word_frequencies 
SET pashto_word = 'خوړلې' 
WHERE id = 37336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوړلې' 
    AND wf2.id != 37336
);
UPDATE word_frequencies 
SET pashto_word = 'خوښوله' 
WHERE id = 33773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوښوله' 
    AND wf2.id != 33773
);
UPDATE word_frequencies 
SET pashto_word = 'خوښومه' 
WHERE id = 38742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوښومه' 
    AND wf2.id != 38742
);
UPDATE word_frequencies 
SET pashto_word = 'خوښوى' 
WHERE id = 32404 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوښوى' 
    AND wf2.id != 32404
);
UPDATE word_frequencies 
SET pashto_word = 'خوښوی' 
WHERE id = 40766 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوښوی' 
    AND wf2.id != 40766
);
UPDATE word_frequencies 
SET pashto_word = 'خوښیږي' 
WHERE id = 35485 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوښیږي' 
    AND wf2.id != 35485
);
UPDATE word_frequencies 
SET pashto_word = 'خویندې' 
WHERE id = 34254 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خویندې' 
    AND wf2.id != 34254
);
UPDATE word_frequencies 
SET pashto_word = 'خوېندو' 
WHERE id = 13330 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوېندو' 
    AND wf2.id != 13330
);
UPDATE word_frequencies 
SET pashto_word = 'خوېندې' 
WHERE id = 29092 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خوېندې' 
    AND wf2.id != 29092
);
UPDATE word_frequencies 
SET pashto_word = 'خُدايه' 
WHERE id = 16077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خُدايه' 
    AND wf2.id != 16077
);
UPDATE word_frequencies 
SET pashto_word = 'خُدای' 
WHERE id = 40963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خُدای' 
    AND wf2.id != 40963
);
UPDATE word_frequencies 
SET pashto_word = 'خِدمتګارانو' 
WHERE id = 30484 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خِدمتګارانو' 
    AND wf2.id != 30484
);
UPDATE word_frequencies 
SET pashto_word = 'خِدمتګاره' 
WHERE id = 40179 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خِدمتګاره' 
    AND wf2.id != 40179
);
UPDATE word_frequencies 
SET pashto_word = 'خِلقياه' 
WHERE id = 21479 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خِلقياه' 
    AND wf2.id != 21479
);
UPDATE word_frequencies 
SET pashto_word = 'خپله' 
WHERE id = 29011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خپله' 
    AND wf2.id != 29011
);
UPDATE word_frequencies 
SET pashto_word = 'خپلوان' 
WHERE id = 28114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خپلوان' 
    AND wf2.id != 28114
);
UPDATE word_frequencies 
SET pashto_word = 'خپلوانو' 
WHERE id = 31586 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خپلوانو' 
    AND wf2.id != 31586
);
UPDATE word_frequencies 
SET pashto_word = 'خیالونه' 
WHERE id = 34407 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خیالونه' 
    AND wf2.id != 34407
);
UPDATE word_frequencies 
SET pashto_word = 'خېمه' 
WHERE id = 24391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خېمه' 
    AND wf2.id != 24391
);
UPDATE word_frequencies 
SET pashto_word = 'خېمې' 
WHERE id = 27444 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خېمې' 
    AND wf2.id != 27444
);
UPDATE word_frequencies 
SET pashto_word = 'خېټور' 
WHERE id = 34213 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خېټور' 
    AND wf2.id != 34213
);
UPDATE word_frequencies 
SET pashto_word = 'خېژوى' 
WHERE id = 36651 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خېژوى' 
    AND wf2.id != 36651
);
UPDATE word_frequencies 
SET pashto_word = 'خېژى' 
WHERE id = 25935 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'خېژى' 
    AND wf2.id != 25935
);
UPDATE word_frequencies 
SET pashto_word = 'داؤد' 
WHERE id = 24618 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'داؤد' 
    AND wf2.id != 24618
);
UPDATE word_frequencies 
SET pashto_word = 'داؤده' 
WHERE id = 28867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'داؤده' 
    AND wf2.id != 28867
);
UPDATE word_frequencies 
SET pashto_word = 'دارچينى' 
WHERE id = 39357 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دارچينى' 
    AND wf2.id != 39357
);
UPDATE word_frequencies 
SET pashto_word = 'داسې' 
WHERE id = 25699 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'داسې' 
    AND wf2.id != 25699
);
UPDATE word_frequencies 
SET pashto_word = 'دال' 
WHERE id = 30380 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دال' 
    AND wf2.id != 30380
);
UPDATE word_frequencies 
SET pashto_word = 'دان' 
WHERE id = 26246 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دان' 
    AND wf2.id != 26246
);
UPDATE word_frequencies 
SET pashto_word = 'دانه' 
WHERE id = 38093 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانه' 
    AND wf2.id != 38093
);
UPDATE word_frequencies 
SET pashto_word = 'دانو' 
WHERE id = 22742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانو' 
    AND wf2.id != 22742
);
UPDATE word_frequencies 
SET pashto_word = 'دانونه' 
WHERE id = 37111 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانونه' 
    AND wf2.id != 37111
);
UPDATE word_frequencies 
SET pashto_word = 'دانيال' 
WHERE id = 17750 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانيال' 
    AND wf2.id != 17750
);
UPDATE word_frequencies 
SET pashto_word = 'دانياله' 
WHERE id = 20485 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانياله' 
    AND wf2.id != 20485
);
UPDATE word_frequencies 
SET pashto_word = 'دانې' 
WHERE id = 38098 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دانې' 
    AND wf2.id != 38098
);
UPDATE word_frequencies 
SET pashto_word = 'داوده' 
WHERE id = 7886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'داوده' 
    AND wf2.id != 7886
);
UPDATE word_frequencies 
SET pashto_word = 'دبرت' 
WHERE id = 39781 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دبرت' 
    AND wf2.id != 39781
);
UPDATE word_frequencies 
SET pashto_word = 'دبورې' 
WHERE id = 37801 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دبورې' 
    AND wf2.id != 37801
);
UPDATE word_frequencies 
SET pashto_word = 'دبیر' 
WHERE id = 31439 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دبیر' 
    AND wf2.id != 31439
);
UPDATE word_frequencies 
SET pashto_word = 'ددان' 
WHERE id = 36693 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ددان' 
    AND wf2.id != 36693
);
UPDATE word_frequencies 
SET pashto_word = 'درباریان' 
WHERE id = 10728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درباریان' 
    AND wf2.id != 10728
);
UPDATE word_frequencies 
SET pashto_word = 'درد' 
WHERE id = 37133 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درد' 
    AND wf2.id != 37133
);
UPDATE word_frequencies 
SET pashto_word = 'درزيږى' 
WHERE id = 39656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درزيږى' 
    AND wf2.id != 39656
);
UPDATE word_frequencies 
SET pashto_word = 'درشم' 
WHERE id = 21058 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درشم' 
    AND wf2.id != 21058
);
UPDATE word_frequencies 
SET pashto_word = 'درلود' 
WHERE id = 14917 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلود' 
    AND wf2.id != 14917
);
UPDATE word_frequencies 
SET pashto_word = 'درلودل' 
WHERE id = 19042 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلودل' 
    AND wf2.id != 19042
);
UPDATE word_frequencies 
SET pashto_word = 'درلودله' 
WHERE id = 18979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلودله' 
    AND wf2.id != 18979
);
UPDATE word_frequencies 
SET pashto_word = 'درلودلی' 
WHERE id = 29674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلودلی' 
    AND wf2.id != 29674
);
UPDATE word_frequencies 
SET pashto_word = 'درلودلې' 
WHERE id = 19037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلودلې' 
    AND wf2.id != 19037
);
UPDATE word_frequencies 
SET pashto_word = 'درلېږلی' 
WHERE id = 40838 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلېږلی' 
    AND wf2.id != 40838
);
UPDATE word_frequencies 
SET pashto_word = 'درلېږم' 
WHERE id = 27097 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درلېږم' 
    AND wf2.id != 27097
);
UPDATE word_frequencies 
SET pashto_word = 'درو' 
WHERE id = 35876 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درو' 
    AND wf2.id != 35876
);
UPDATE word_frequencies 
SET pashto_word = 'دروازه' 
WHERE id = 32920 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دروازه' 
    AND wf2.id != 32920
);
UPDATE word_frequencies 
SET pashto_word = 'دروازې' 
WHERE id = 25632 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دروازې' 
    AND wf2.id != 25632
);
UPDATE word_frequencies 
SET pashto_word = 'درورسېد' 
WHERE id = 33507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درورسېد' 
    AND wf2.id != 33507
);
UPDATE word_frequencies 
SET pashto_word = 'دروسپارم' 
WHERE id = 34510 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دروسپارم' 
    AND wf2.id != 34510
);
UPDATE word_frequencies 
SET pashto_word = 'درولېږل' 
WHERE id = 28044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درولېږل' 
    AND wf2.id != 28044
);
UPDATE word_frequencies 
SET pashto_word = 'درولېږم' 
WHERE id = 21671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درولېږم' 
    AND wf2.id != 21671
);
UPDATE word_frequencies 
SET pashto_word = 'درولېږو' 
WHERE id = 33271 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درولېږو' 
    AND wf2.id != 33271
);
UPDATE word_frequencies 
SET pashto_word = 'درولېږي' 
WHERE id = 33471 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درولېږي' 
    AND wf2.id != 33471
);
UPDATE word_frequencies 
SET pashto_word = 'دروړم' 
WHERE id = 39101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دروړم' 
    AND wf2.id != 39101
);
UPDATE word_frequencies 
SET pashto_word = 'دروښایي' 
WHERE id = 34087 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دروښایي' 
    AND wf2.id != 34087
);
UPDATE word_frequencies 
SET pashto_word = 'دريابونو' 
WHERE id = 32036 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دريابونو' 
    AND wf2.id != 32036
);
UPDATE word_frequencies 
SET pashto_word = 'دريږى' 
WHERE id = 24216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دريږى' 
    AND wf2.id != 24216
);
UPDATE word_frequencies 
SET pashto_word = 'درځم' 
WHERE id = 27320 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درځم' 
    AND wf2.id != 27320
);
UPDATE word_frequencies 
SET pashto_word = 'درځى' 
WHERE id = 36905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درځى' 
    AND wf2.id != 36905
);
UPDATE word_frequencies 
SET pashto_word = 'درځي' 
WHERE id = 33725 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درځي' 
    AND wf2.id != 33725
);
UPDATE word_frequencies 
SET pashto_word = 'درکول' 
WHERE id = 21194 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکول' 
    AND wf2.id != 21194
);
UPDATE word_frequencies 
SET pashto_word = 'درکولی' 
WHERE id = 41751 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکولی' 
    AND wf2.id != 41751
);
UPDATE word_frequencies 
SET pashto_word = 'درکولې' 
WHERE id = 35812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکولې' 
    AND wf2.id != 35812
);
UPDATE word_frequencies 
SET pashto_word = 'درکوم' 
WHERE id = 14126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکوم' 
    AND wf2.id != 14126
);
UPDATE word_frequencies 
SET pashto_word = 'درکوى' 
WHERE id = 17341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکوى' 
    AND wf2.id != 17341
);
UPDATE word_frequencies 
SET pashto_word = 'درکوي' 
WHERE id = 19378 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکوي' 
    AND wf2.id != 19378
);
UPDATE word_frequencies 
SET pashto_word = 'درکوی' 
WHERE id = 40631 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکوی' 
    AND wf2.id != 40631
);
UPDATE word_frequencies 
SET pashto_word = 'درکړ' 
WHERE id = 33790 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړ' 
    AND wf2.id != 33790
);
UPDATE word_frequencies 
SET pashto_word = 'درکړل' 
WHERE id = 23969 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړل' 
    AND wf2.id != 23969
);
UPDATE word_frequencies 
SET pashto_word = 'درکړم' 
WHERE id = 13186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړم' 
    AND wf2.id != 13186
);
UPDATE word_frequencies 
SET pashto_word = 'درکړمه' 
WHERE id = 37865 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړمه' 
    AND wf2.id != 37865
);
UPDATE word_frequencies 
SET pashto_word = 'درکړه' 
WHERE id = 22837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړه' 
    AND wf2.id != 22837
);
UPDATE word_frequencies 
SET pashto_word = 'درکړو' 
WHERE id = 21909 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړو' 
    AND wf2.id != 21909
);
UPDATE word_frequencies 
SET pashto_word = 'درکړى' 
WHERE id = 15972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړى' 
    AND wf2.id != 15972
);
UPDATE word_frequencies 
SET pashto_word = 'درکړي' 
WHERE id = 35459 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړي' 
    AND wf2.id != 35459
);
UPDATE word_frequencies 
SET pashto_word = 'درکړُو' 
WHERE id = 39518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړُو' 
    AND wf2.id != 39518
);
UPDATE word_frequencies 
SET pashto_word = 'درکړی' 
WHERE id = 40555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړی' 
    AND wf2.id != 40555
);
UPDATE word_frequencies 
SET pashto_word = 'درکړې' 
WHERE id = 35036 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درکړې' 
    AND wf2.id != 35036
);
UPDATE word_frequencies 
SET pashto_word = 'درې' 
WHERE id = 30543 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درې' 
    AND wf2.id != 30543
);
UPDATE word_frequencies 
SET pashto_word = 'درېدل' 
WHERE id = 37318 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'درېدل' 
    AND wf2.id != 37318
);
UPDATE word_frequencies 
SET pashto_word = 'دشتو' 
WHERE id = 31252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دشتو' 
    AND wf2.id != 31252
);
UPDATE word_frequencies 
SET pashto_word = 'دشمنان' 
WHERE id = 32704 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دشمنان' 
    AND wf2.id != 32704
);
UPDATE word_frequencies 
SET pashto_word = 'دشمنه' 
WHERE id = 32529 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دشمنه' 
    AND wf2.id != 32529
);
UPDATE word_frequencies 
SET pashto_word = 'دلاياه' 
WHERE id = 36845 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دلاياه' 
    AND wf2.id != 36845
);
UPDATE word_frequencies 
SET pashto_word = 'دلعان' 
WHERE id = 37629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دلعان' 
    AND wf2.id != 37629
);
UPDATE word_frequencies 
SET pashto_word = 'دلفون' 
WHERE id = 35672 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دلفون' 
    AND wf2.id != 35672
);
UPDATE word_frequencies 
SET pashto_word = 'ده' 
WHERE id = 20369 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ده' 
    AND wf2.id != 20369
);
UPDATE word_frequencies 
SET pashto_word = 'دهشت' 
WHERE id = 27964 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دهشت' 
    AND wf2.id != 27964
);
UPDATE word_frequencies 
SET pashto_word = 'دواړه' 
WHERE id = 37586 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دواړه' 
    AND wf2.id != 37586
);
UPDATE word_frequencies 
SET pashto_word = 'دور' 
WHERE id = 28278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دور' 
    AND wf2.id != 28278
);
UPDATE word_frequencies 
SET pashto_word = 'دوستانو' 
WHERE id = 22473 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دوستانو' 
    AND wf2.id != 22473
);
UPDATE word_frequencies 
SET pashto_word = 'دوسته' 
WHERE id = 33201 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دوسته' 
    AND wf2.id != 33201
);
UPDATE word_frequencies 
SET pashto_word = 'دولت' 
WHERE id = 22334 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دولت' 
    AND wf2.id != 22334
);
UPDATE word_frequencies 
SET pashto_word = 'دومه' 
WHERE id = 28273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دومه' 
    AND wf2.id != 28273
);
UPDATE word_frequencies 
SET pashto_word = 'دوه' 
WHERE id = 25602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دوه' 
    AND wf2.id != 25602
);
UPDATE word_frequencies 
SET pashto_word = 'دي' 
WHERE id = 19500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دي' 
    AND wf2.id != 19500
);
UPDATE word_frequencies 
SET pashto_word = 'دينه' 
WHERE id = 15859 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دينه' 
    AND wf2.id != 15859
);
UPDATE word_frequencies 
SET pashto_word = 'دُرشلو' 
WHERE id = 32175 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دُرشلو' 
    AND wf2.id != 32175
);
UPDATE word_frequencies 
SET pashto_word = 'دُنيا' 
WHERE id = 19115 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دُنيا' 
    AND wf2.id != 19115
);
UPDATE word_frequencies 
SET pashto_word = 'دِقله' 
WHERE id = 39002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دِقله' 
    AND wf2.id != 39002
);
UPDATE word_frequencies 
SET pashto_word = 'دپاره' 
WHERE id = 15666 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دپاره' 
    AND wf2.id != 15666
);
UPDATE word_frequencies 
SET pashto_word = 'دپاسه' 
WHERE id = 39420 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دپاسه' 
    AND wf2.id != 39420
);
UPDATE word_frequencies 
SET pashto_word = 'دی' 
WHERE id = 15470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دی' 
    AND wf2.id != 15470
);
UPDATE word_frequencies 
SET pashto_word = 'دی.»' 
WHERE id = 33519 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دی.»' 
    AND wf2.id != 33519
);
UPDATE word_frequencies 
SET pashto_word = 'دیبون' 
WHERE id = 37599 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دیبون' 
    AND wf2.id != 37599
);
UPDATE word_frequencies 
SET pashto_word = 'دیشان' 
WHERE id = 25662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دیشان' 
    AND wf2.id != 25662
);
UPDATE word_frequencies 
SET pashto_word = 'دیشون' 
WHERE id = 25661 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دیشون' 
    AND wf2.id != 25661
);
UPDATE word_frequencies 
SET pashto_word = 'دې' 
WHERE id = 24466 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دې' 
    AND wf2.id != 24466
);
UPDATE word_frequencies 
SET pashto_word = 'دېنه' 
WHERE id = 17092 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دېنه' 
    AND wf2.id != 17092
);
UPDATE word_frequencies 
SET pashto_word = 'دېوال' 
WHERE id = 30775 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دېوال' 
    AND wf2.id != 30775
);
UPDATE word_frequencies 
SET pashto_word = 'دېوالونو' 
WHERE id = 28319 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دېوالونو' 
    AND wf2.id != 28319
);
UPDATE word_frequencies 
SET pashto_word = 'دېګونه' 
WHERE id = 37110 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'دېګونه' 
    AND wf2.id != 37110
);
UPDATE word_frequencies 
SET pashto_word = 'ذات' 
WHERE id = 29076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ذات' 
    AND wf2.id != 29076
);
UPDATE word_frequencies 
SET pashto_word = 'ذريعه' 
WHERE id = 39974 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ذريعه' 
    AND wf2.id != 39974
);
UPDATE word_frequencies 
SET pashto_word = 'راؤړی' 
WHERE id = 41937 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راؤړی' 
    AND wf2.id != 41937
);
UPDATE word_frequencies 
SET pashto_word = 'رابهيږينه' 
WHERE id = 38704 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رابهيږينه' 
    AND wf2.id != 38704
);
UPDATE word_frequencies 
SET pashto_word = 'رابېدارویينه' 
WHERE id = 42060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رابېدارویينه' 
    AND wf2.id != 42060
);
UPDATE word_frequencies 
SET pashto_word = 'راتلل' 
WHERE id = 17910 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتلل' 
    AND wf2.id != 17910
);
UPDATE word_frequencies 
SET pashto_word = 'راتللو' 
WHERE id = 33449 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتللو' 
    AND wf2.id != 33449
);
UPDATE word_frequencies 
SET pashto_word = 'راتله' 
WHERE id = 30011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتله' 
    AND wf2.id != 30011
);
UPDATE word_frequencies 
SET pashto_word = 'راتلو' 
WHERE id = 24499 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتلو' 
    AND wf2.id != 24499
);
UPDATE word_frequencies 
SET pashto_word = 'راتلی' 
WHERE id = 41440 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتلی' 
    AND wf2.id != 41440
);
UPDATE word_frequencies 
SET pashto_word = 'راتلې' 
WHERE id = 24632 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راتلې' 
    AND wf2.id != 24632
);
UPDATE word_frequencies 
SET pashto_word = 'راختلی' 
WHERE id = 41706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راختلی' 
    AND wf2.id != 41706
);
UPDATE word_frequencies 
SET pashto_word = 'راخېژى' 
WHERE id = 28227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راخېژى' 
    AND wf2.id != 28227
);
UPDATE word_frequencies 
SET pashto_word = 'راخېژينه' 
WHERE id = 38650 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راخېژينه' 
    AND wf2.id != 38650
);
UPDATE word_frequencies 
SET pashto_word = 'رارسولی' 
WHERE id = 41888 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رارسولی' 
    AND wf2.id != 41888
);
UPDATE word_frequencies 
SET pashto_word = 'رارسيږى' 
WHERE id = 37229 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رارسيږى' 
    AND wf2.id != 37229
);
UPDATE word_frequencies 
SET pashto_word = 'رارسېدلی' 
WHERE id = 29679 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رارسېدلی' 
    AND wf2.id != 29679
);
UPDATE word_frequencies 
SET pashto_word = 'راشم' 
WHERE id = 29561 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راشم' 
    AND wf2.id != 29561
);
UPDATE word_frequencies 
SET pashto_word = 'راشه' 
WHERE id = 18138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راشه' 
    AND wf2.id != 18138
);
UPDATE word_frequencies 
SET pashto_word = 'راشى' 
WHERE id = 25800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راشى' 
    AND wf2.id != 25800
);
UPDATE word_frequencies 
SET pashto_word = 'راشی' 
WHERE id = 40523 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راشی' 
    AND wf2.id != 40523
);
UPDATE word_frequencies 
SET pashto_word = 'راشې' 
WHERE id = 23791 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راشې' 
    AND wf2.id != 23791
);
UPDATE word_frequencies 
SET pashto_word = 'راغلل' 
WHERE id = 13733 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلل' 
    AND wf2.id != 13733
);
UPDATE word_frequencies 
SET pashto_word = 'راغلم' 
WHERE id = 26646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلم' 
    AND wf2.id != 26646
);
UPDATE word_frequencies 
SET pashto_word = 'راغله' 
WHERE id = 15235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغله' 
    AND wf2.id != 15235
);
UPDATE word_frequencies 
SET pashto_word = 'راغلو' 
WHERE id = 13701 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلو' 
    AND wf2.id != 13701
);
UPDATE word_frequencies 
SET pashto_word = 'راغلى' 
WHERE id = 31326 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلى' 
    AND wf2.id != 31326
);
UPDATE word_frequencies 
SET pashto_word = 'راغلی' 
WHERE id = 26979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلی' 
    AND wf2.id != 26979
);
UPDATE word_frequencies 
SET pashto_word = 'راغلې' 
WHERE id = 22398 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغلې' 
    AND wf2.id != 22398
);
UPDATE word_frequencies 
SET pashto_word = 'راغورزيږى' 
WHERE id = 22051 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغورزيږى' 
    AND wf2.id != 22051
);
UPDATE word_frequencies 
SET pashto_word = 'راغورزېږې' 
WHERE id = 36519 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغورزېږې' 
    AND wf2.id != 36519
);
UPDATE word_frequencies 
SET pashto_word = 'راغورځیږي' 
WHERE id = 30583 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغورځیږي' 
    AND wf2.id != 30583
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډوم' 
WHERE id = 31097 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډوم' 
    AND wf2.id != 31097
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډوى' 
WHERE id = 32030 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډوى' 
    AND wf2.id != 32030
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډوې' 
WHERE id = 38629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډوې' 
    AND wf2.id != 38629
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډيږى' 
WHERE id = 25940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډيږى' 
    AND wf2.id != 25940
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډېدلی' 
WHERE id = 42172 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډېدلی' 
    AND wf2.id != 42172
);
UPDATE word_frequencies 
SET pashto_word = 'راغونډېږی' 
WHERE id = 41737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغونډېږی' 
    AND wf2.id != 41737
);
UPDATE word_frequencies 
SET pashto_word = 'راغی' 
WHERE id = 16272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راغی' 
    AND wf2.id != 16272
);
UPDATE word_frequencies 
SET pashto_word = 'راقم' 
WHERE id = 31446 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راقم' 
    AND wf2.id != 31446
);
UPDATE word_frequencies 
SET pashto_word = 'رالوځوى' 
WHERE id = 27916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالوځوى' 
    AND wf2.id != 27916
);
UPDATE word_frequencies 
SET pashto_word = 'رالوځى' 
WHERE id = 36521 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالوځى' 
    AND wf2.id != 36521
);
UPDATE word_frequencies 
SET pashto_word = 'رالویږي' 
WHERE id = 25211 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالویږي' 
    AND wf2.id != 25211
);
UPDATE word_frequencies 
SET pashto_word = 'رالېږلی' 
WHERE id = 41948 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالېږلی' 
    AND wf2.id != 41948
);
UPDATE word_frequencies 
SET pashto_word = 'رالېږى' 
WHERE id = 26138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالېږى' 
    AND wf2.id != 26138
);
UPDATE word_frequencies 
SET pashto_word = 'رالېږې' 
WHERE id = 37189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رالېږې' 
    AND wf2.id != 37189
);
UPDATE word_frequencies 
SET pashto_word = 'راما' 
WHERE id = 32310 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راما' 
    AND wf2.id != 32310
);
UPDATE word_frequencies 
SET pashto_word = 'رامات' 
WHERE id = 32314 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رامات' 
    AND wf2.id != 32314
);
UPDATE word_frequencies 
SET pashto_word = 'رامه' 
WHERE id = 31464 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رامه' 
    AND wf2.id != 31464
);
UPDATE word_frequencies 
SET pashto_word = 'رانازليږى' 
WHERE id = 36776 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رانازليږى' 
    AND wf2.id != 36776
);
UPDATE word_frequencies 
SET pashto_word = 'رانسکورولو' 
WHERE id = 36620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رانسکورولو' 
    AND wf2.id != 36620
);
UPDATE word_frequencies 
SET pashto_word = 'راننوتل' 
WHERE id = 24901 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راننوتل' 
    AND wf2.id != 24901
);
UPDATE word_frequencies 
SET pashto_word = 'راننوتله' 
WHERE id = 35343 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راننوتله' 
    AND wf2.id != 35343
);
UPDATE word_frequencies 
SET pashto_word = 'راننوځى' 
WHERE id = 31534 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راننوځى' 
    AND wf2.id != 31534
);
UPDATE word_frequencies 
SET pashto_word = 'راننوځي' 
WHERE id = 30786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راننوځي' 
    AND wf2.id != 30786
);
UPDATE word_frequencies 
SET pashto_word = 'رانیسي' 
WHERE id = 36088 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رانیسي' 
    AND wf2.id != 36088
);
UPDATE word_frequencies 
SET pashto_word = 'راواخستل' 
WHERE id = 39863 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخستل' 
    AND wf2.id != 39863
);
UPDATE word_frequencies 
SET pashto_word = 'راواخستله' 
WHERE id = 39515 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخستله' 
    AND wf2.id != 39515
);
UPDATE word_frequencies 
SET pashto_word = 'راواخستلو' 
WHERE id = 31293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخستلو' 
    AND wf2.id != 31293
);
UPDATE word_frequencies 
SET pashto_word = 'راواخستلې' 
WHERE id = 36879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخستلې' 
    AND wf2.id != 36879
);
UPDATE word_frequencies 
SET pashto_word = 'راواخسته' 
WHERE id = 36809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخسته' 
    AND wf2.id != 36809
);
UPDATE word_frequencies 
SET pashto_word = 'راواخستو' 
WHERE id = 40129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخستو' 
    AND wf2.id != 40129
);
UPDATE word_frequencies 
SET pashto_word = 'راواخله' 
WHERE id = 28508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخله' 
    AND wf2.id != 28508
);
UPDATE word_frequencies 
SET pashto_word = 'راواخلی' 
WHERE id = 41623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخلی' 
    AND wf2.id != 41623
);
UPDATE word_frequencies 
SET pashto_word = 'راواخیست' 
WHERE id = 34330 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخیست' 
    AND wf2.id != 34330
);
UPDATE word_frequencies 
SET pashto_word = 'راواخیستل' 
WHERE id = 25180 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخیستل' 
    AND wf2.id != 25180
);
UPDATE word_frequencies 
SET pashto_word = 'راواخیستله' 
WHERE id = 20879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخیستله' 
    AND wf2.id != 20879
);
UPDATE word_frequencies 
SET pashto_word = 'راواخیستلې' 
WHERE id = 33877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواخیستلې' 
    AND wf2.id != 33877
);
UPDATE word_frequencies 
SET pashto_word = 'راوالوت' 
WHERE id = 33427 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوالوت' 
    AND wf2.id != 33427
);
UPDATE word_frequencies 
SET pashto_word = 'راوالوځه' 
WHERE id = 38706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوالوځه' 
    AND wf2.id != 38706
);
UPDATE word_frequencies 
SET pashto_word = 'راواوړى' 
WHERE id = 36703 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواوړى' 
    AND wf2.id != 36703
);
UPDATE word_frequencies 
SET pashto_word = 'راواوړېدو' 
WHERE id = 35393 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواوړېدو' 
    AND wf2.id != 35393
);
UPDATE word_frequencies 
SET pashto_word = 'راوايخله' 
WHERE id = 39951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوايخله' 
    AND wf2.id != 39951
);
UPDATE word_frequencies 
SET pashto_word = 'راواړوی' 
WHERE id = 40812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواړوی' 
    AND wf2.id != 40812
);
UPDATE word_frequencies 
SET pashto_word = 'راواړوې' 
WHERE id = 33410 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راواړوې' 
    AND wf2.id != 33410
);
UPDATE word_frequencies 
SET pashto_word = 'راوباسم' 
WHERE id = 21197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوباسم' 
    AND wf2.id != 21197
);
UPDATE word_frequencies 
SET pashto_word = 'راوباسى' 
WHERE id = 25668 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوباسى' 
    AND wf2.id != 25668
);
UPDATE word_frequencies 
SET pashto_word = 'راوباسی' 
WHERE id = 40701 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوباسی' 
    AND wf2.id != 40701
);
UPDATE word_frequencies 
SET pashto_word = 'راوبلل' 
WHERE id = 27021 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوبلل' 
    AND wf2.id != 27021
);
UPDATE word_frequencies 
SET pashto_word = 'راوبللم' 
WHERE id = 33590 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوبللم' 
    AND wf2.id != 33590
);
UPDATE word_frequencies 
SET pashto_word = 'راوبللو' 
WHERE id = 26632 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوبللو' 
    AND wf2.id != 26632
);
UPDATE word_frequencies 
SET pashto_word = 'راوبله' 
WHERE id = 31540 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوبله' 
    AND wf2.id != 31540
);
UPDATE word_frequencies 
SET pashto_word = 'راوبهېدلې' 
WHERE id = 33814 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوبهېدلې' 
    AND wf2.id != 33814
);
UPDATE word_frequencies 
SET pashto_word = 'راوتل' 
WHERE id = 28518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوتل' 
    AND wf2.id != 28518
);
UPDATE word_frequencies 
SET pashto_word = 'راوتله' 
WHERE id = 36145 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوتله' 
    AND wf2.id != 36145
);
UPDATE word_frequencies 
SET pashto_word = 'راوتلی' 
WHERE id = 41667 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوتلی' 
    AND wf2.id != 41667
);
UPDATE word_frequencies 
SET pashto_word = 'راوتښتی' 
WHERE id = 42067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوتښتی' 
    AND wf2.id != 42067
);
UPDATE word_frequencies 
SET pashto_word = 'راوختلو' 
WHERE id = 30506 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوختلو' 
    AND wf2.id != 30506
);
UPDATE word_frequencies 
SET pashto_word = 'راوخوت' 
WHERE id = 34359 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوخوت' 
    AND wf2.id != 34359
);
UPDATE word_frequencies 
SET pashto_word = 'راوخېژولې' 
WHERE id = 37331 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوخېژولې' 
    AND wf2.id != 37331
);
UPDATE word_frequencies 
SET pashto_word = 'راوخېژى' 
WHERE id = 32264 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوخېژى' 
    AND wf2.id != 32264
);
UPDATE word_frequencies 
SET pashto_word = 'راوخېژي' 
WHERE id = 34804 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوخېژي' 
    AND wf2.id != 34804
);
UPDATE word_frequencies 
SET pashto_word = 'راورسیږی' 
WHERE id = 40851 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسیږی' 
    AND wf2.id != 40851
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېد' 
WHERE id = 25145 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېد' 
    AND wf2.id != 25145
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېدل' 
WHERE id = 33472 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېدل' 
    AND wf2.id != 33472
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېدله' 
WHERE id = 23504 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېدله' 
    AND wf2.id != 23504
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېدلی' 
WHERE id = 41655 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېدلی' 
    AND wf2.id != 41655
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېده' 
WHERE id = 22392 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېده' 
    AND wf2.id != 22392
);
UPDATE word_frequencies 
SET pashto_word = 'راورسېدو' 
WHERE id = 22295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راورسېدو' 
    AND wf2.id != 22295
);
UPDATE word_frequencies 
SET pashto_word = 'راوروى' 
WHERE id = 25952 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوروى' 
    AND wf2.id != 25952
);
UPDATE word_frequencies 
SET pashto_word = 'راوريږى' 
WHERE id = 37261 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوريږى' 
    AND wf2.id != 37261
);
UPDATE word_frequencies 
SET pashto_word = 'راوست' 
WHERE id = 19372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوست' 
    AND wf2.id != 19372
);
UPDATE word_frequencies 
SET pashto_word = 'راوستل' 
WHERE id = 16285 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستل' 
    AND wf2.id != 16285
);
UPDATE word_frequencies 
SET pashto_word = 'راوستلم' 
WHERE id = 24021 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستلم' 
    AND wf2.id != 24021
);
UPDATE word_frequencies 
SET pashto_word = 'راوستله' 
WHERE id = 18263 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستله' 
    AND wf2.id != 18263
);
UPDATE word_frequencies 
SET pashto_word = 'راوستلو' 
WHERE id = 20914 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستلو' 
    AND wf2.id != 20914
);
UPDATE word_frequencies 
SET pashto_word = 'راوستلی' 
WHERE id = 41741 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستلی' 
    AND wf2.id != 41741
);
UPDATE word_frequencies 
SET pashto_word = 'راوستلې' 
WHERE id = 30278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستلې' 
    AND wf2.id != 30278
);
UPDATE word_frequencies 
SET pashto_word = 'راوستم' 
WHERE id = 39060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستم' 
    AND wf2.id != 39060
);
UPDATE word_frequencies 
SET pashto_word = 'راوسته' 
WHERE id = 21963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوسته' 
    AND wf2.id != 21963
);
UPDATE word_frequencies 
SET pashto_word = 'راوستو' 
WHERE id = 18762 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوستو' 
    AND wf2.id != 18762
);
UPDATE word_frequencies 
SET pashto_word = 'راوشى' 
WHERE id = 37208 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوشى' 
    AND wf2.id != 37208
);
UPDATE word_frequencies 
SET pashto_word = 'راوغواړم' 
WHERE id = 36254 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغواړم' 
    AND wf2.id != 36254
);
UPDATE word_frequencies 
SET pashto_word = 'راوغواړه' 
WHERE id = 37556 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغواړه' 
    AND wf2.id != 37556
);
UPDATE word_frequencies 
SET pashto_word = 'راوغواړى' 
WHERE id = 40412 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغواړى' 
    AND wf2.id != 40412
);
UPDATE word_frequencies 
SET pashto_word = 'راوغواړی' 
WHERE id = 41231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغواړی' 
    AND wf2.id != 41231
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزول' 
WHERE id = 25891 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزول' 
    AND wf2.id != 25891
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزوله' 
WHERE id = 31509 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزوله' 
    AND wf2.id != 31509
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزولو' 
WHERE id = 31507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزولو' 
    AND wf2.id != 31507
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزولې' 
WHERE id = 26025 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزولې' 
    AND wf2.id != 26025
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزوى' 
WHERE id = 20086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزوى' 
    AND wf2.id != 20086
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزوُو' 
WHERE id = 36513 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزوُو' 
    AND wf2.id != 36513
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزوی' 
WHERE id = 42110 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزوی' 
    AND wf2.id != 42110
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزيږى' 
WHERE id = 18736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزيږى' 
    AND wf2.id != 18736
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزېدل' 
WHERE id = 32284 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزېدل' 
    AND wf2.id != 32284
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورزېږی' 
WHERE id = 41934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورزېږی' 
    AND wf2.id != 41934
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورځول' 
WHERE id = 27261 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورځول' 
    AND wf2.id != 27261
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورځوله' 
WHERE id = 34826 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورځوله' 
    AND wf2.id != 34826
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورځوي' 
WHERE id = 27469 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورځوي' 
    AND wf2.id != 27469
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورځیږي' 
WHERE id = 30452 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورځیږي' 
    AND wf2.id != 30452
);
UPDATE word_frequencies 
SET pashto_word = 'راوغورځېدل' 
WHERE id = 33642 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغورځېدل' 
    AND wf2.id != 33642
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښت' 
WHERE id = 27031 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښت' 
    AND wf2.id != 27031
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښتل' 
WHERE id = 16276 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښتل' 
    AND wf2.id != 16276
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښتله' 
WHERE id = 35034 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښتله' 
    AND wf2.id != 35034
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښتلو' 
WHERE id = 32071 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښتلو' 
    AND wf2.id != 32071
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښتلی' 
WHERE id = 41925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښتلی' 
    AND wf2.id != 41925
);
UPDATE word_frequencies 
SET pashto_word = 'راوغوښتو' 
WHERE id = 39929 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوغوښتو' 
    AND wf2.id != 39929
);
UPDATE word_frequencies 
SET pashto_word = 'راولم' 
WHERE id = 13219 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولم' 
    AND wf2.id != 13219
);
UPDATE word_frequencies 
SET pashto_word = 'راوله' 
WHERE id = 36131 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوله' 
    AND wf2.id != 36131
);
UPDATE word_frequencies 
SET pashto_word = 'راولو' 
WHERE id = 36075 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولو' 
    AND wf2.id != 36075
);
UPDATE word_frequencies 
SET pashto_word = 'راولویږي' 
WHERE id = 35199 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولویږي' 
    AND wf2.id != 35199
);
UPDATE word_frequencies 
SET pashto_word = 'راولوېد' 
WHERE id = 29337 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولوېد' 
    AND wf2.id != 29337
);
UPDATE word_frequencies 
SET pashto_word = 'راولى' 
WHERE id = 40378 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولى' 
    AND wf2.id != 40378
);
UPDATE word_frequencies 
SET pashto_word = 'راولی' 
WHERE id = 40563 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولی' 
    AND wf2.id != 40563
);
UPDATE word_frequencies 
SET pashto_word = 'راولې' 
WHERE id = 37330 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولې' 
    AND wf2.id != 37330
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږل' 
WHERE id = 27808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږل' 
    AND wf2.id != 27808
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږلم' 
WHERE id = 31993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږلم' 
    AND wf2.id != 31993
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږله' 
WHERE id = 30076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږله' 
    AND wf2.id != 30076
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږلو' 
WHERE id = 22294 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږلو' 
    AND wf2.id != 22294
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږم' 
WHERE id = 25780 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږم' 
    AND wf2.id != 25780
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږه' 
WHERE id = 26663 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږه' 
    AND wf2.id != 26663
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږى' 
WHERE id = 26185 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږى' 
    AND wf2.id != 26185
);
UPDATE word_frequencies 
SET pashto_word = 'راولېږی' 
WHERE id = 41863 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راولېږی' 
    AND wf2.id != 41863
);
UPDATE word_frequencies 
SET pashto_word = 'راونغښتلو' 
WHERE id = 37401 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راونغښتلو' 
    AND wf2.id != 37401
);
UPDATE word_frequencies 
SET pashto_word = 'راونيسه' 
WHERE id = 31531 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راونيسه' 
    AND wf2.id != 31531
);
UPDATE word_frequencies 
SET pashto_word = 'راونيول' 
WHERE id = 39500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راونيول' 
    AND wf2.id != 39500
);
UPDATE word_frequencies 
SET pashto_word = 'راونیسی' 
WHERE id = 40819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راونیسی' 
    AND wf2.id != 40819
);
UPDATE word_frequencies 
SET pashto_word = 'راونیوه' 
WHERE id = 34117 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راونیوه' 
    AND wf2.id != 34117
);
UPDATE word_frequencies 
SET pashto_word = 'راووت' 
WHERE id = 22547 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووت' 
    AND wf2.id != 22547
);
UPDATE word_frequencies 
SET pashto_word = 'راووتل' 
WHERE id = 16279 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتل' 
    AND wf2.id != 16279
);
UPDATE word_frequencies 
SET pashto_word = 'راووتله' 
WHERE id = 18627 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتله' 
    AND wf2.id != 18627
);
UPDATE word_frequencies 
SET pashto_word = 'راووتلو' 
WHERE id = 21416 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتلو' 
    AND wf2.id != 21416
);
UPDATE word_frequencies 
SET pashto_word = 'راووتلی' 
WHERE id = 41343 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتلی' 
    AND wf2.id != 41343
);
UPDATE word_frequencies 
SET pashto_word = 'راووتلې' 
WHERE id = 23470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتلې' 
    AND wf2.id != 23470
);
UPDATE word_frequencies 
SET pashto_word = 'راووتو' 
WHERE id = 32778 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووتو' 
    AND wf2.id != 32778
);
UPDATE word_frequencies 
SET pashto_word = 'راوورولو' 
WHERE id = 37854 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوورولو' 
    AND wf2.id != 37854
);
UPDATE word_frequencies 
SET pashto_word = 'راووهى' 
WHERE id = 36493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووهى' 
    AND wf2.id != 36493
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستل' 
WHERE id = 18392 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستل' 
    AND wf2.id != 18392
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستلم' 
WHERE id = 37190 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستلم' 
    AND wf2.id != 37190
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستلو' 
WHERE id = 24200 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستلو' 
    AND wf2.id != 24200
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستلی' 
WHERE id = 41189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستلی' 
    AND wf2.id != 41189
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستلې' 
WHERE id = 39030 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستلې' 
    AND wf2.id != 39030
);
UPDATE word_frequencies 
SET pashto_word = 'راوويستو' 
WHERE id = 39938 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويستو' 
    AND wf2.id != 39938
);
UPDATE word_frequencies 
SET pashto_word = 'راوويشتل' 
WHERE id = 37898 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوويشتل' 
    AND wf2.id != 37898
);
UPDATE word_frequencies 
SET pashto_word = 'راووځي' 
WHERE id = 26972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووځي' 
    AND wf2.id != 26972
);
UPDATE word_frequencies 
SET pashto_word = 'راووځې' 
WHERE id = 36779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راووځې' 
    AND wf2.id != 36779
);
UPDATE word_frequencies 
SET pashto_word = 'راوویست' 
WHERE id = 33234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوویست' 
    AND wf2.id != 33234
);
UPDATE word_frequencies 
SET pashto_word = 'راوویستل' 
WHERE id = 25532 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوویستل' 
    AND wf2.id != 25532
);
UPDATE word_frequencies 
SET pashto_word = 'راوویستلو' 
WHERE id = 10949 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوویستلو' 
    AND wf2.id != 10949
);
UPDATE word_frequencies 
SET pashto_word = 'راوویستلی' 
WHERE id = 41226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوویستلی' 
    AND wf2.id != 41226
);
UPDATE word_frequencies 
SET pashto_word = 'راويستل' 
WHERE id = 36794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راويستل' 
    AND wf2.id != 36794
);
UPDATE word_frequencies 
SET pashto_word = 'راويستلو' 
WHERE id = 36619 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راويستلو' 
    AND wf2.id != 36619
);
UPDATE word_frequencies 
SET pashto_word = 'راوټوکوم' 
WHERE id = 36821 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوټوکوم' 
    AND wf2.id != 36821
);
UPDATE word_frequencies 
SET pashto_word = 'راوټوکيږى' 
WHERE id = 26537 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوټوکيږى' 
    AND wf2.id != 26537
);
UPDATE word_frequencies 
SET pashto_word = 'راوپاراوه' 
WHERE id = 30288 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوپاراوه' 
    AND wf2.id != 30288
);
UPDATE word_frequencies 
SET pashto_word = 'راوپارول' 
WHERE id = 30411 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوپارول' 
    AND wf2.id != 30411
);
UPDATE word_frequencies 
SET pashto_word = 'راوپاروله' 
WHERE id = 23839 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوپاروله' 
    AND wf2.id != 23839
);
UPDATE word_frequencies 
SET pashto_word = 'راوپارولو' 
WHERE id = 32569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوپارولو' 
    AND wf2.id != 32569
);
UPDATE word_frequencies 
SET pashto_word = 'راوپاروم' 
WHERE id = 34695 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوپاروم' 
    AND wf2.id != 34695
);
UPDATE word_frequencies 
SET pashto_word = 'راوځى' 
WHERE id = 15946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوځى' 
    AND wf2.id != 15946
);
UPDATE word_frequencies 
SET pashto_word = 'راوځي' 
WHERE id = 20397 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوځي' 
    AND wf2.id != 20397
);
UPDATE word_frequencies 
SET pashto_word = 'راوځی' 
WHERE id = 41301 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوځی' 
    AND wf2.id != 41301
);
UPDATE word_frequencies 
SET pashto_word = 'راوچتوى' 
WHERE id = 31259 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوچتوى' 
    AND wf2.id != 31259
);
UPDATE word_frequencies 
SET pashto_word = 'راوچتيږى' 
WHERE id = 37013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوچتيږى' 
    AND wf2.id != 37013
);
UPDATE word_frequencies 
SET pashto_word = 'راوچتيږينه' 
WHERE id = 38746 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوچتيږينه' 
    AND wf2.id != 38746
);
UPDATE word_frequencies 
SET pashto_word = 'راوړ' 
WHERE id = 15772 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړ' 
    AND wf2.id != 15772
);
UPDATE word_frequencies 
SET pashto_word = 'راوړل' 
WHERE id = 14768 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړل' 
    AND wf2.id != 14768
);
UPDATE word_frequencies 
SET pashto_word = 'راوړله' 
WHERE id = 34488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړله' 
    AND wf2.id != 34488
);
UPDATE word_frequencies 
SET pashto_word = 'راوړلو' 
WHERE id = 29152 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړلو' 
    AND wf2.id != 29152
);
UPDATE word_frequencies 
SET pashto_word = 'راوړلی' 
WHERE id = 42143 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړلی' 
    AND wf2.id != 42143
);
UPDATE word_frequencies 
SET pashto_word = 'راوړلې' 
WHERE id = 33483 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړلې' 
    AND wf2.id != 33483
);
UPDATE word_frequencies 
SET pashto_word = 'راوړم' 
WHERE id = 24990 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړم' 
    AND wf2.id != 24990
);
UPDATE word_frequencies 
SET pashto_word = 'راوړه' 
WHERE id = 20255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړه' 
    AND wf2.id != 20255
);
UPDATE word_frequencies 
SET pashto_word = 'راوړو' 
WHERE id = 15673 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړو' 
    AND wf2.id != 15673
);
UPDATE word_frequencies 
SET pashto_word = 'راوړى' 
WHERE id = 24312 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړى' 
    AND wf2.id != 24312
);
UPDATE word_frequencies 
SET pashto_word = 'راوړُو' 
WHERE id = 39895 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړُو' 
    AND wf2.id != 39895
);
UPDATE word_frequencies 
SET pashto_word = 'راوړی' 
WHERE id = 40617 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړی' 
    AND wf2.id != 40617
);
UPDATE word_frequencies 
SET pashto_word = 'راوړې' 
WHERE id = 19647 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوړې' 
    AND wf2.id != 19647
);
UPDATE word_frequencies 
SET pashto_word = 'راوښايه' 
WHERE id = 26507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوښايه' 
    AND wf2.id != 26507
);
UPDATE word_frequencies 
SET pashto_word = 'راوکاږم' 
WHERE id = 25733 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوکاږم' 
    AND wf2.id != 25733
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځه' 
WHERE id = 31050 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځه' 
    AND wf2.id != 31050
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځوم' 
WHERE id = 30764 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځوم' 
    AND wf2.id != 30764
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځوی' 
WHERE id = 40886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځوی' 
    AND wf2.id != 40886
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځى' 
WHERE id = 20609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځى' 
    AND wf2.id != 20609
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځي' 
WHERE id = 23666 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځي' 
    AND wf2.id != 23666
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځُو' 
WHERE id = 31526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځُو' 
    AND wf2.id != 31526
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځی' 
WHERE id = 41265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځی' 
    AND wf2.id != 41265
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځېدل' 
WHERE id = 32361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځېدل' 
    AND wf2.id != 32361
);
UPDATE word_frequencies 
SET pashto_word = 'راوګرځېدو' 
WHERE id = 39045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راوګرځېدو' 
    AND wf2.id != 39045
);
UPDATE word_frequencies 
SET pashto_word = 'راویښه' 
WHERE id = 37804 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راویښه' 
    AND wf2.id != 37804
);
UPDATE word_frequencies 
SET pashto_word = 'راټولول' 
WHERE id = 35741 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولول' 
    AND wf2.id != 35741
);
UPDATE word_frequencies 
SET pashto_word = 'راټولومه' 
WHERE id = 38709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولومه' 
    AND wf2.id != 38709
);
UPDATE word_frequencies 
SET pashto_word = 'راټولوي' 
WHERE id = 22531 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولوي' 
    AND wf2.id != 22531
);
UPDATE word_frequencies 
SET pashto_word = 'راټولوی' 
WHERE id = 40922 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولوی' 
    AND wf2.id != 40922
);
UPDATE word_frequencies 
SET pashto_word = 'راټولیږي' 
WHERE id = 30020 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولیږي' 
    AND wf2.id != 30020
);
UPDATE word_frequencies 
SET pashto_word = 'راټولېدل' 
WHERE id = 33489 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټولېدل' 
    AND wf2.id != 33489
);
UPDATE word_frequencies 
SET pashto_word = 'راټوکيږى' 
WHERE id = 32786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راټوکيږى' 
    AND wf2.id != 32786
);
UPDATE word_frequencies 
SET pashto_word = 'راپاروم' 
WHERE id = 38897 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاروم' 
    AND wf2.id != 38897
);
UPDATE word_frequencies 
SET pashto_word = 'راپاروي' 
WHERE id = 34109 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاروي' 
    AND wf2.id != 34109
);
UPDATE word_frequencies 
SET pashto_word = 'راپاروی' 
WHERE id = 41946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاروی' 
    AND wf2.id != 41946
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅه' 
WHERE id = 18455 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅه' 
    AND wf2.id != 18455
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅوم' 
WHERE id = 24233 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅوم' 
    AND wf2.id != 24233
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅومه' 
WHERE id = 38788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅومه' 
    AND wf2.id != 38788
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅوى' 
WHERE id = 28515 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅوى' 
    AND wf2.id != 28515
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅى' 
WHERE id = 20488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅى' 
    AND wf2.id != 20488
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅیږي' 
WHERE id = 34022 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅیږي' 
    AND wf2.id != 34022
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅېد' 
WHERE id = 29472 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅېد' 
    AND wf2.id != 29472
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅېدله' 
WHERE id = 34235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅېدله' 
    AND wf2.id != 34235
);
UPDATE word_frequencies 
SET pashto_word = 'راپاڅېده' 
WHERE id = 33775 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپاڅېده' 
    AND wf2.id != 33775
);
UPDATE word_frequencies 
SET pashto_word = 'راپرېوځى' 
WHERE id = 23042 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپرېوځى' 
    AND wf2.id != 23042
);
UPDATE word_frequencies 
SET pashto_word = 'راپرېږدى' 
WHERE id = 37197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپرېږدى' 
    AND wf2.id != 37197
);
UPDATE word_frequencies 
SET pashto_word = 'راپرېږدی' 
WHERE id = 41869 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راپرېږدی' 
    AND wf2.id != 41869
);
UPDATE word_frequencies 
SET pashto_word = 'راځم' 
WHERE id = 23615 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځم' 
    AND wf2.id != 23615
);
UPDATE word_frequencies 
SET pashto_word = 'راځه' 
WHERE id = 24506 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځه' 
    AND wf2.id != 24506
);
UPDATE word_frequencies 
SET pashto_word = 'راځو' 
WHERE id = 37372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځو' 
    AND wf2.id != 37372
);
UPDATE word_frequencies 
SET pashto_word = 'راځي' 
WHERE id = 33767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځي' 
    AND wf2.id != 33767
);
UPDATE word_frequencies 
SET pashto_word = 'راځی' 
WHERE id = 40522 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځی' 
    AND wf2.id != 40522
);
UPDATE word_frequencies 
SET pashto_word = 'راځې' 
WHERE id = 27426 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راځې' 
    AND wf2.id != 27426
);
UPDATE word_frequencies 
SET pashto_word = 'راڅاڅى' 
WHERE id = 29014 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راڅاڅى' 
    AND wf2.id != 29014
);
UPDATE word_frequencies 
SET pashto_word = 'راڅاڅيږينه' 
WHERE id = 38692 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راڅاڅيږينه' 
    AND wf2.id != 38692
);
UPDATE word_frequencies 
SET pashto_word = 'راښکله' 
WHERE id = 28489 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راښکله' 
    AND wf2.id != 28489
);
UPDATE word_frequencies 
SET pashto_word = 'راکاږم' 
WHERE id = 38895 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکاږم' 
    AND wf2.id != 38895
);
UPDATE word_frequencies 
SET pashto_word = 'راکاږى' 
WHERE id = 27938 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکاږى' 
    AND wf2.id != 27938
);
UPDATE word_frequencies 
SET pashto_word = 'راکاږی' 
WHERE id = 40871 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکاږی' 
    AND wf2.id != 40871
);
UPDATE word_frequencies 
SET pashto_word = 'راکوزيږى' 
WHERE id = 32272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوزيږى' 
    AND wf2.id != 32272
);
UPDATE word_frequencies 
SET pashto_word = 'راکوزيږينه' 
WHERE id = 28474 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوزيږينه' 
    AND wf2.id != 28474
);
UPDATE word_frequencies 
SET pashto_word = 'راکوزېده' 
WHERE id = 35313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوزېده' 
    AND wf2.id != 35313
);
UPDATE word_frequencies 
SET pashto_word = 'راکوله' 
WHERE id = 35018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوله' 
    AND wf2.id != 35018
);
UPDATE word_frequencies 
SET pashto_word = 'راکولی' 
WHERE id = 41881 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکولی' 
    AND wf2.id != 41881
);
UPDATE word_frequencies 
SET pashto_word = 'راکوه' 
WHERE id = 23746 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوه' 
    AND wf2.id != 23746
);
UPDATE word_frequencies 
SET pashto_word = 'راکوى' 
WHERE id = 17556 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوى' 
    AND wf2.id != 17556
);
UPDATE word_frequencies 
SET pashto_word = 'راکوي' 
WHERE id = 23577 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوي' 
    AND wf2.id != 23577
);
UPDATE word_frequencies 
SET pashto_word = 'راکوی' 
WHERE id = 41876 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوی' 
    AND wf2.id != 41876
);
UPDATE word_frequencies 
SET pashto_word = 'راکوې' 
WHERE id = 23054 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکوې' 
    AND wf2.id != 23054
);
UPDATE word_frequencies 
SET pashto_word = 'راکړ' 
WHERE id = 21505 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړ' 
    AND wf2.id != 21505
);
UPDATE word_frequencies 
SET pashto_word = 'راکړل' 
WHERE id = 23968 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړل' 
    AND wf2.id != 23968
);
UPDATE word_frequencies 
SET pashto_word = 'راکړلو' 
WHERE id = 38648 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړلو' 
    AND wf2.id != 38648
);
UPDATE word_frequencies 
SET pashto_word = 'راکړه' 
WHERE id = 14379 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړه' 
    AND wf2.id != 14379
);
UPDATE word_frequencies 
SET pashto_word = 'راکړو' 
WHERE id = 20486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړو' 
    AND wf2.id != 20486
);
UPDATE word_frequencies 
SET pashto_word = 'راکړى' 
WHERE id = 18127 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړى' 
    AND wf2.id != 18127
);
UPDATE word_frequencies 
SET pashto_word = 'راکړي' 
WHERE id = 21518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړي' 
    AND wf2.id != 21518
);
UPDATE word_frequencies 
SET pashto_word = 'راکړی' 
WHERE id = 41277 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړی' 
    AND wf2.id != 41277
);
UPDATE word_frequencies 
SET pashto_word = 'راکړې' 
WHERE id = 23080 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راکړې' 
    AND wf2.id != 23080
);
UPDATE word_frequencies 
SET pashto_word = 'راګرځوى' 
WHERE id = 37383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راګرځوى' 
    AND wf2.id != 37383
);
UPDATE word_frequencies 
SET pashto_word = 'راګرځى' 
WHERE id = 37420 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راګرځى' 
    AND wf2.id != 37420
);
UPDATE word_frequencies 
SET pashto_word = 'راګرځي' 
WHERE id = 33264 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راګرځي' 
    AND wf2.id != 33264
);
UPDATE word_frequencies 
SET pashto_word = 'راګرځېدو' 
WHERE id = 40219 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راګرځېدو' 
    AND wf2.id != 40219
);
UPDATE word_frequencies 
SET pashto_word = 'راګېروى' 
WHERE id = 32707 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'راګېروى' 
    AND wf2.id != 32707
);
UPDATE word_frequencies 
SET pashto_word = 'رباب' 
WHERE id = 20501 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رباب' 
    AND wf2.id != 20501
);
UPDATE word_frequencies 
SET pashto_word = 'ربابونه' 
WHERE id = 30232 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ربابونه' 
    AND wf2.id != 30232
);
UPDATE word_frequencies 
SET pashto_word = 'رحم' 
WHERE id = 23660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رحم' 
    AND wf2.id != 23660
);
UPDATE word_frequencies 
SET pashto_word = 'رحوم' 
WHERE id = 36003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رحوم' 
    AND wf2.id != 36003
);
UPDATE word_frequencies 
SET pashto_word = 'رختونه' 
WHERE id = 35813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رختونه' 
    AND wf2.id != 35813
);
UPDATE word_frequencies 
SET pashto_word = 'رخصتېدل' 
WHERE id = 34820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رخصتېدل' 
    AND wf2.id != 34820
);
UPDATE word_frequencies 
SET pashto_word = 'رساوه' 
WHERE id = 29327 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رساوه' 
    AND wf2.id != 29327
);
UPDATE word_frequencies 
SET pashto_word = 'رسولان' 
WHERE id = 29497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسولان' 
    AND wf2.id != 29497
);
UPDATE word_frequencies 
SET pashto_word = 'رسولو' 
WHERE id = 32401 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسولو' 
    AND wf2.id != 32401
);
UPDATE word_frequencies 
SET pashto_word = 'رسولی' 
WHERE id = 33931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسولی' 
    AND wf2.id != 33931
);
UPDATE word_frequencies 
SET pashto_word = 'رسوم' 
WHERE id = 22553 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسوم' 
    AND wf2.id != 22553
);
UPDATE word_frequencies 
SET pashto_word = 'رسوى' 
WHERE id = 20743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسوى' 
    AND wf2.id != 20743
);
UPDATE word_frequencies 
SET pashto_word = 'رسوي' 
WHERE id = 17419 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسوي' 
    AND wf2.id != 17419
);
UPDATE word_frequencies 
SET pashto_word = 'رسوی' 
WHERE id = 41650 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسوی' 
    AND wf2.id != 41650
);
UPDATE word_frequencies 
SET pashto_word = 'رسوې' 
WHERE id = 29304 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسوې' 
    AND wf2.id != 29304
);
UPDATE word_frequencies 
SET pashto_word = 'رسى' 
WHERE id = 29005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسى' 
    AND wf2.id != 29005
);
UPDATE word_frequencies 
SET pashto_word = 'رسيږى' 
WHERE id = 18358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسيږى' 
    AND wf2.id != 18358
);
UPDATE word_frequencies 
SET pashto_word = 'رسيږينه' 
WHERE id = 38790 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسيږينه' 
    AND wf2.id != 38790
);
UPDATE word_frequencies 
SET pashto_word = 'رسیږي' 
WHERE id = 16786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسیږي' 
    AND wf2.id != 16786
);
UPDATE word_frequencies 
SET pashto_word = 'رسیږی' 
WHERE id = 40680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسیږی' 
    AND wf2.id != 40680
);
UPDATE word_frequencies 
SET pashto_word = 'رسۍ' 
WHERE id = 32126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسۍ' 
    AND wf2.id != 32126
);
UPDATE word_frequencies 
SET pashto_word = 'رسېدل' 
WHERE id = 27659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېدل' 
    AND wf2.id != 27659
);
UPDATE word_frequencies 
SET pashto_word = 'رسېدله' 
WHERE id = 20564 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېدله' 
    AND wf2.id != 20564
);
UPDATE word_frequencies 
SET pashto_word = 'رسېدلی' 
WHERE id = 33893 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېدلی' 
    AND wf2.id != 33893
);
UPDATE word_frequencies 
SET pashto_word = 'رسېدلې' 
WHERE id = 25280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېدلې' 
    AND wf2.id != 25280
);
UPDATE word_frequencies 
SET pashto_word = 'رسېده' 
WHERE id = 21588 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېده' 
    AND wf2.id != 21588
);
UPDATE word_frequencies 
SET pashto_word = 'رسېدو' 
WHERE id = 31280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رسېدو' 
    AND wf2.id != 31280
);
UPDATE word_frequencies 
SET pashto_word = 'رشته‌دار' 
WHERE id = 39111 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رشته‌دار' 
    AND wf2.id != 39111
);
UPDATE word_frequencies 
SET pashto_word = 'رعو' 
WHERE id = 40274 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رعو' 
    AND wf2.id != 40274
);
UPDATE word_frequencies 
SET pashto_word = 'رغيږى' 
WHERE id = 37072 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رغيږى' 
    AND wf2.id != 37072
);
UPDATE word_frequencies 
SET pashto_word = 'رفاياه' 
WHERE id = 40328 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رفاياه' 
    AND wf2.id != 40328
);
UPDATE word_frequencies 
SET pashto_word = 'رقت' 
WHERE id = 37679 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رقت' 
    AND wf2.id != 37679
);
UPDATE word_frequencies 
SET pashto_word = 'رمون' 
WHERE id = 31465 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رمون' 
    AND wf2.id != 31465
);
UPDATE word_frequencies 
SET pashto_word = 'رمې' 
WHERE id = 35580 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رمې' 
    AND wf2.id != 35580
);
UPDATE word_frequencies 
SET pashto_word = 'رنګ' 
WHERE id = 17351 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رنګ' 
    AND wf2.id != 17351
);
UPDATE word_frequencies 
SET pashto_word = 'رهودس' 
WHERE id = 38967 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رهودس' 
    AND wf2.id != 38967
);
UPDATE word_frequencies 
SET pashto_word = 'روان' 
WHERE id = 26381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روان' 
    AND wf2.id != 26381
);
UPDATE word_frequencies 
SET pashto_word = 'روانه' 
WHERE id = 38634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روانه' 
    AND wf2.id != 38634
);
UPDATE word_frequencies 
SET pashto_word = 'روبين' 
WHERE id = 16904 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روبين' 
    AND wf2.id != 16904
);
UPDATE word_frequencies 
SET pashto_word = 'روبین' 
WHERE id = 20526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روبین' 
    AND wf2.id != 20526
);
UPDATE word_frequencies 
SET pashto_word = 'روت' 
WHERE id = 32366 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روت' 
    AND wf2.id != 32366
);
UPDATE word_frequencies 
SET pashto_word = 'روح' 
WHERE id = 27154 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روح' 
    AND wf2.id != 27154
);
UPDATE word_frequencies 
SET pashto_word = 'روحه' 
WHERE id = 7634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روحه' 
    AND wf2.id != 7634
);
UPDATE word_frequencies 
SET pashto_word = 'روغول' 
WHERE id = 23736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روغول' 
    AND wf2.id != 23736
);
UPDATE word_frequencies 
SET pashto_word = 'روغېدل' 
WHERE id = 29456 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روغېدل' 
    AND wf2.id != 29456
);
UPDATE word_frequencies 
SET pashto_word = 'روياګانې' 
WHERE id = 36555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روياګانې' 
    AND wf2.id != 36555
);
UPDATE word_frequencies 
SET pashto_word = 'روټۍ' 
WHERE id = 21437 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'روټۍ' 
    AND wf2.id != 21437
);
UPDATE word_frequencies 
SET pashto_word = 'ريږدى' 
WHERE id = 32870 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ريږدى' 
    AND wf2.id != 32870
);
UPDATE word_frequencies 
SET pashto_word = 'ريږدېدل' 
WHERE id = 30493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ريږدېدل' 
    AND wf2.id != 30493
);
UPDATE word_frequencies 
SET pashto_word = 'رَمې' 
WHERE id = 31930 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رَمې' 
    AND wf2.id != 31930
);
UPDATE word_frequencies 
SET pashto_word = 'رِبع' 
WHERE id = 39552 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رِبع' 
    AND wf2.id != 39552
);
UPDATE word_frequencies 
SET pashto_word = 'رِقم' 
WHERE id = 32214 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رِقم' 
    AND wf2.id != 32214
);
UPDATE word_frequencies 
SET pashto_word = 'رِمون' 
WHERE id = 23297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رِمون' 
    AND wf2.id != 23297
);
UPDATE word_frequencies 
SET pashto_word = 'رټى' 
WHERE id = 38847 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رټى' 
    AND wf2.id != 38847
);
UPDATE word_frequencies 
SET pashto_word = 'رپیږي' 
WHERE id = 24979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رپیږي' 
    AND wf2.id != 24979
);
UPDATE word_frequencies 
SET pashto_word = 'رپېږم' 
WHERE id = 36240 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رپېږم' 
    AND wf2.id != 36240
);
UPDATE word_frequencies 
SET pashto_word = 'رښتیا' 
WHERE id = 34575 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رښتیا' 
    AND wf2.id != 34575
);
UPDATE word_frequencies 
SET pashto_word = 'رېبى' 
WHERE id = 32381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رېبى' 
    AND wf2.id != 32381
);
UPDATE word_frequencies 
SET pashto_word = 'رېبی' 
WHERE id = 40809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'رېبی' 
    AND wf2.id != 40809
);
UPDATE word_frequencies 
SET pashto_word = 'زاباد' 
WHERE id = 25644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زاباد' 
    AND wf2.id != 25644
);
UPDATE word_frequencies 
SET pashto_word = 'زارح' 
WHERE id = 25656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زارح' 
    AND wf2.id != 25656
);
UPDATE word_frequencies 
SET pashto_word = 'زامن' 
WHERE id = 27503 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زامن' 
    AND wf2.id != 27503
);
UPDATE word_frequencies 
SET pashto_word = 'زامنو' 
WHERE id = 28404 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زامنو' 
    AND wf2.id != 28404
);
UPDATE word_frequencies 
SET pashto_word = 'زانوح' 
WHERE id = 31454 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زانوح' 
    AND wf2.id != 31454
);
UPDATE word_frequencies 
SET pashto_word = 'زبدياه' 
WHERE id = 26487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زبدياه' 
    AND wf2.id != 26487
);
UPDATE word_frequencies 
SET pashto_word = 'زبدیا' 
WHERE id = 10730 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زبدیا' 
    AND wf2.id != 10730
);
UPDATE word_frequencies 
SET pashto_word = 'زبورونه' 
WHERE id = 29478 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زبورونه' 
    AND wf2.id != 29478
);
UPDATE word_frequencies 
SET pashto_word = 'زبولون' 
WHERE id = 27646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زبولون' 
    AND wf2.id != 27646
);
UPDATE word_frequencies 
SET pashto_word = 'زخم' 
WHERE id = 11308 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زخم' 
    AND wf2.id != 11308
);
UPDATE word_frequencies 
SET pashto_word = 'زر' 
WHERE id = 13892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زر' 
    AND wf2.id != 13892
);
UPDATE word_frequencies 
SET pashto_word = 'زرحیا' 
WHERE id = 10663 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرحیا' 
    AND wf2.id != 10663
);
UPDATE word_frequencies 
SET pashto_word = 'زرخياه' 
WHERE id = 32607 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرخياه' 
    AND wf2.id != 32607
);
UPDATE word_frequencies 
SET pashto_word = 'زرعه' 
WHERE id = 27339 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرعه' 
    AND wf2.id != 27339
);
UPDATE word_frequencies 
SET pashto_word = 'زرو' 
WHERE id = 14467 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرو' 
    AND wf2.id != 14467
);
UPDATE word_frequencies 
SET pashto_word = 'زروبابل' 
WHERE id = 27800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زروبابل' 
    AND wf2.id != 27800
);
UPDATE word_frequencies 
SET pashto_word = 'زرُبابل' 
WHERE id = 26499 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرُبابل' 
    AND wf2.id != 26499
);
UPDATE word_frequencies 
SET pashto_word = 'زرُبابله' 
WHERE id = 36104 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زرُبابله' 
    AND wf2.id != 36104
);
UPDATE word_frequencies 
SET pashto_word = 'زعفرانو' 
WHERE id = 38699 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زعفرانو' 
    AND wf2.id != 38699
);
UPDATE word_frequencies 
SET pashto_word = 'زغرو' 
WHERE id = 35886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغرو' 
    AND wf2.id != 35886
);
UPDATE word_frequencies 
SET pashto_word = 'زغلى' 
WHERE id = 29032 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغلى' 
    AND wf2.id != 29032
);
UPDATE word_frequencies 
SET pashto_word = 'زغم' 
WHERE id = 29235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغم' 
    AND wf2.id != 29235
);
UPDATE word_frequencies 
SET pashto_word = 'زغملی' 
WHERE id = 36233 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغملی' 
    AND wf2.id != 36233
);
UPDATE word_frequencies 
SET pashto_word = 'زغمم' 
WHERE id = 32972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغمم' 
    AND wf2.id != 32972
);
UPDATE word_frequencies 
SET pashto_word = 'زغمى' 
WHERE id = 29100 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغمى' 
    AND wf2.id != 29100
);
UPDATE word_frequencies 
SET pashto_word = 'زغمی' 
WHERE id = 41384 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زغمی' 
    AND wf2.id != 41384
);
UPDATE word_frequencies 
SET pashto_word = 'زما' 
WHERE id = 31760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زما' 
    AND wf2.id != 31760
);
UPDATE word_frequencies 
SET pashto_word = 'زمران' 
WHERE id = 39070 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زمران' 
    AND wf2.id != 39070
);
UPDATE word_frequencies 
SET pashto_word = 'زمرد' 
WHERE id = 27765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زمرد' 
    AND wf2.id != 27765
);
UPDATE word_frequencies 
SET pashto_word = 'زمونږ' 
WHERE id = 27809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زمونږ' 
    AND wf2.id != 27809
);
UPDATE word_frequencies 
SET pashto_word = 'زمکه' 
WHERE id = 19625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زمکه' 
    AND wf2.id != 19625
);
UPDATE word_frequencies 
SET pashto_word = 'زمکې' 
WHERE id = 38902 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زمکې' 
    AND wf2.id != 38902
);
UPDATE word_frequencies 
SET pashto_word = 'زنانه' 
WHERE id = 22044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زنانه' 
    AND wf2.id != 22044
);
UPDATE word_frequencies 
SET pashto_word = 'زناکاري' 
WHERE id = 34408 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زناکاري' 
    AND wf2.id != 34408
);
UPDATE word_frequencies 
SET pashto_word = 'زنده‌باد' 
WHERE id = 32452 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زنده‌باد' 
    AND wf2.id != 32452
);
UPDATE word_frequencies 
SET pashto_word = 'زنوح' 
WHERE id = 32299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زنوح' 
    AND wf2.id != 32299
);
UPDATE word_frequencies 
SET pashto_word = 'زنګیږي' 
WHERE id = 30934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زنګیږي' 
    AND wf2.id != 30934
);
UPDATE word_frequencies 
SET pashto_word = 'زه' 
WHERE id = 36391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زه' 
    AND wf2.id != 36391
);
UPDATE word_frequencies 
SET pashto_word = 'زهم' 
WHERE id = 34769 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زهم' 
    AND wf2.id != 34769
);
UPDATE word_frequencies 
SET pashto_word = 'زهيريږى' 
WHERE id = 36786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زهيريږى' 
    AND wf2.id != 36786
);
UPDATE word_frequencies 
SET pashto_word = 'زور' 
WHERE id = 34670 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زور' 
    AND wf2.id != 34670
);
UPDATE word_frequencies 
SET pashto_word = 'زوروې' 
WHERE id = 33071 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زوروې' 
    AND wf2.id != 33071
);
UPDATE word_frequencies 
SET pashto_word = 'زويه' 
WHERE id = 23321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زويه' 
    AND wf2.id != 23321
);
UPDATE word_frequencies 
SET pashto_word = 'زوی' 
WHERE id = 36060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زوی' 
    AND wf2.id != 36060
);
UPDATE word_frequencies 
SET pashto_word = 'زویه' 
WHERE id = 14830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زویه' 
    AND wf2.id != 14830
);
UPDATE word_frequencies 
SET pashto_word = 'زيات' 
WHERE id = 29190 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زيات' 
    AND wf2.id != 29190
);
UPDATE word_frequencies 
SET pashto_word = 'زياتوې' 
WHERE id = 37188 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زياتوې' 
    AND wf2.id != 37188
);
UPDATE word_frequencies 
SET pashto_word = 'زياتېدلو' 
WHERE id = 39298 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زياتېدلو' 
    AND wf2.id != 39298
);
UPDATE word_frequencies 
SET pashto_word = 'زياتېدو' 
WHERE id = 28205 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زياتېدو' 
    AND wf2.id != 28205
);
UPDATE word_frequencies 
SET pashto_word = 'زِمرى' 
WHERE id = 40350 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زِمرى' 
    AND wf2.id != 40350
);
UPDATE word_frequencies 
SET pashto_word = 'زِمه' 
WHERE id = 40316 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زِمه' 
    AND wf2.id != 40316
);
UPDATE word_frequencies 
SET pashto_word = 'زِکرى' 
WHERE id = 39243 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زِکرى' 
    AND wf2.id != 39243
);
UPDATE word_frequencies 
SET pashto_word = 'زړيږى' 
WHERE id = 37210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زړيږى' 
    AND wf2.id != 37210
);
UPDATE word_frequencies 
SET pashto_word = 'زکرياه' 
WHERE id = 22329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زکرياه' 
    AND wf2.id != 22329
);
UPDATE word_frequencies 
SET pashto_word = 'زکریا' 
WHERE id = 25115 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زکریا' 
    AND wf2.id != 25115
);
UPDATE word_frequencies 
SET pashto_word = 'زکور' 
WHERE id = 39504 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زکور' 
    AND wf2.id != 39504
);
UPDATE word_frequencies 
SET pashto_word = 'زۀ' 
WHERE id = 15756 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زۀ' 
    AND wf2.id != 15756
);
UPDATE word_frequencies 
SET pashto_word = 'زیاتوی' 
WHERE id = 40804 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زیاتوی' 
    AND wf2.id != 40804
);
UPDATE word_frequencies 
SET pashto_word = 'زیاتیږي' 
WHERE id = 27186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زیاتیږي' 
    AND wf2.id != 27186
);
UPDATE word_frequencies 
SET pashto_word = 'زیاتیږی' 
WHERE id = 40662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زیاتیږی' 
    AND wf2.id != 40662
);
UPDATE word_frequencies 
SET pashto_word = 'زیاتېده' 
WHERE id = 33278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زیاتېده' 
    AND wf2.id != 33278
);
UPDATE word_frequencies 
SET pashto_word = 'زیف' 
WHERE id = 30197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زیف' 
    AND wf2.id != 30197
);
UPDATE word_frequencies 
SET pashto_word = 'زېړ' 
WHERE id = 23941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زېړ' 
    AND wf2.id != 23941
);
UPDATE word_frequencies 
SET pashto_word = 'زېړو' 
WHERE id = 25484 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زېړو' 
    AND wf2.id != 25484
);
UPDATE word_frequencies 
SET pashto_word = 'زېړېږه' 
WHERE id = 35344 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'زېړېږه' 
    AND wf2.id != 35344
);
UPDATE word_frequencies 
SET pashto_word = 'ساؤل' 
WHERE id = 28763 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساؤل' 
    AND wf2.id != 28763
);
UPDATE word_frequencies 
SET pashto_word = 'ساؤله' 
WHERE id = 26591 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساؤله' 
    AND wf2.id != 26591
);
UPDATE word_frequencies 
SET pashto_word = 'ساتل' 
WHERE id = 25609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتل' 
    AND wf2.id != 25609
);
UPDATE word_frequencies 
SET pashto_word = 'ساتله' 
WHERE id = 28854 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتله' 
    AND wf2.id != 28854
);
UPDATE word_frequencies 
SET pashto_word = 'ساتلو' 
WHERE id = 17830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتلو' 
    AND wf2.id != 17830
);
UPDATE word_frequencies 
SET pashto_word = 'ساتلی' 
WHERE id = 41419 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتلی' 
    AND wf2.id != 41419
);
UPDATE word_frequencies 
SET pashto_word = 'ساتلې' 
WHERE id = 29839 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتلې' 
    AND wf2.id != 29839
);
UPDATE word_frequencies 
SET pashto_word = 'ساتم' 
WHERE id = 17244 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتم' 
    AND wf2.id != 17244
);
UPDATE word_frequencies 
SET pashto_word = 'ساته' 
WHERE id = 24566 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساته' 
    AND wf2.id != 24566
);
UPDATE word_frequencies 
SET pashto_word = 'ساتو' 
WHERE id = 30349 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتو' 
    AND wf2.id != 30349
);
UPDATE word_frequencies 
SET pashto_word = 'ساتونکو' 
WHERE id = 27805 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتونکو' 
    AND wf2.id != 27805
);
UPDATE word_frequencies 
SET pashto_word = 'ساتينه' 
WHERE id = 38803 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتينه' 
    AND wf2.id != 38803
);
UPDATE word_frequencies 
SET pashto_word = 'ساتی' 
WHERE id = 40549 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتی' 
    AND wf2.id != 40549
);
UPDATE word_frequencies 
SET pashto_word = 'ساتې' 
WHERE id = 20570 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ساتې' 
    AND wf2.id != 20570
);
UPDATE word_frequencies 
SET pashto_word = 'سام' 
WHERE id = 36081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سام' 
    AND wf2.id != 36081
);
UPDATE word_frequencies 
SET pashto_word = 'سامان' 
WHERE id = 40107 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سامان' 
    AND wf2.id != 40107
);
UPDATE word_frequencies 
SET pashto_word = 'سامانونه' 
WHERE id = 36719 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سامانونه' 
    AND wf2.id != 36719
);
UPDATE word_frequencies 
SET pashto_word = 'سامريه' 
WHERE id = 40255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سامريه' 
    AND wf2.id != 40255
);
UPDATE word_frequencies 
SET pashto_word = 'سبت' 
WHERE id = 38011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سبت' 
    AND wf2.id != 38011
);
UPDATE word_frequencies 
SET pashto_word = 'سبته' 
WHERE id = 38973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سبته' 
    AND wf2.id != 38973
);
UPDATE word_frequencies 
SET pashto_word = 'سبماه' 
WHERE id = 37003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سبماه' 
    AND wf2.id != 37003
);
UPDATE word_frequencies 
SET pashto_word = 'ستا' 
WHERE id = 36186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ستا' 
    AND wf2.id != 36186
);
UPDATE word_frequencies 
SET pashto_word = 'ستاسو' 
WHERE id = 36419 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ستاسو' 
    AND wf2.id != 36419
);
UPDATE word_frequencies 
SET pashto_word = 'سترګه' 
WHERE id = 35452 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سترګه' 
    AND wf2.id != 35452
);
UPDATE word_frequencies 
SET pashto_word = 'سترګې' 
WHERE id = 39635 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سترګې' 
    AND wf2.id != 39635
);
UPDATE word_frequencies 
SET pashto_word = 'ستن' 
WHERE id = 36628 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ستن' 
    AND wf2.id != 36628
);
UPDATE word_frequencies 
SET pashto_word = 'ستنو' 
WHERE id = 22922 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ستنو' 
    AND wf2.id != 22922
);
UPDATE word_frequencies 
SET pashto_word = 'ستنې' 
WHERE id = 34879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ستنې' 
    AND wf2.id != 34879
);
UPDATE word_frequencies 
SET pashto_word = 'سحر' 
WHERE id = 40190 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سحر' 
    AND wf2.id != 40190
);
UPDATE word_frequencies 
SET pashto_word = 'سخى' 
WHERE id = 20187 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سخى' 
    AND wf2.id != 20187
);
UPDATE word_frequencies 
SET pashto_word = 'سخی' 
WHERE id = 41315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سخی' 
    AND wf2.id != 41315
);
UPDATE word_frequencies 
SET pashto_word = 'سر' 
WHERE id = 32044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سر' 
    AND wf2.id != 32044
);
UPDATE word_frequencies 
SET pashto_word = 'سرایا' 
WHERE id = 34977 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سرایا' 
    AND wf2.id != 34977
);
UPDATE word_frequencies 
SET pashto_word = 'سربياه' 
WHERE id = 24670 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سربياه' 
    AND wf2.id != 24670
);
UPDATE word_frequencies 
SET pashto_word = 'سرد' 
WHERE id = 39192 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سرد' 
    AND wf2.id != 39192
);
UPDATE word_frequencies 
SET pashto_word = 'سره' 
WHERE id = 15257 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سره' 
    AND wf2.id != 15257
);
UPDATE word_frequencies 
SET pashto_word = 'سرودونه' 
WHERE id = 38623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سرودونه' 
    AND wf2.id != 38623
);
UPDATE word_frequencies 
SET pashto_word = 'سروګ' 
WHERE id = 40275 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سروګ' 
    AND wf2.id != 40275
);
UPDATE word_frequencies 
SET pashto_word = 'سريندې' 
WHERE id = 21879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سريندې' 
    AND wf2.id != 21879
);
UPDATE word_frequencies 
SET pashto_word = 'سرپوښونه' 
WHERE id = 24243 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سرپوښونه' 
    AND wf2.id != 24243
);
UPDATE word_frequencies 
SET pashto_word = 'سرې' 
WHERE id = 34690 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سرې' 
    AND wf2.id != 34690
);
UPDATE word_frequencies 
SET pashto_word = 'سعرياه' 
WHERE id = 40353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سعرياه' 
    AND wf2.id != 40353
);
UPDATE word_frequencies 
SET pashto_word = 'سعلبيم' 
WHERE id = 39795 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سعلبيم' 
    AND wf2.id != 39795
);
UPDATE word_frequencies 
SET pashto_word = 'سفروایم' 
WHERE id = 30300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سفروایم' 
    AND wf2.id != 30300
);
UPDATE word_frequencies 
SET pashto_word = 'سلامت' 
WHERE id = 40047 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلامت' 
    AND wf2.id != 40047
);
UPDATE word_frequencies 
SET pashto_word = 'سلامته' 
WHERE id = 31186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلامته' 
    AND wf2.id != 31186
);
UPDATE word_frequencies 
SET pashto_word = 'سلامونه' 
WHERE id = 32662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلامونه' 
    AND wf2.id != 32662
);
UPDATE word_frequencies 
SET pashto_word = 'سلف' 
WHERE id = 38997 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلف' 
    AND wf2.id != 38997
);
UPDATE word_frequencies 
SET pashto_word = 'سلمون' 
WHERE id = 32591 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلمون' 
    AND wf2.id != 32591
);
UPDATE word_frequencies 
SET pashto_word = 'سلو' 
WHERE id = 35460 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلو' 
    AND wf2.id != 35460
);
UPDATE word_frequencies 
SET pashto_word = 'سلوم' 
WHERE id = 22327 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سلوم' 
    AND wf2.id != 22327
);
UPDATE word_frequencies 
SET pashto_word = 'سليم' 
WHERE id = 39202 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سليم' 
    AND wf2.id != 39202
);
UPDATE word_frequencies 
SET pashto_word = 'سليمان' 
WHERE id = 28875 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سليمان' 
    AND wf2.id != 28875
);
UPDATE word_frequencies 
SET pashto_word = 'سليمانه' 
WHERE id = 38801 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سليمانه' 
    AND wf2.id != 38801
);
UPDATE word_frequencies 
SET pashto_word = 'سمساره' 
WHERE id = 37927 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمساره' 
    AND wf2.id != 37927
);
UPDATE word_frequencies 
SET pashto_word = 'سمسونه' 
WHERE id = 8329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمسونه' 
    AND wf2.id != 8329
);
UPDATE word_frequencies 
SET pashto_word = 'سمع' 
WHERE id = 39733 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمع' 
    AND wf2.id != 39733
);
UPDATE word_frequencies 
SET pashto_word = 'سمعياه' 
WHERE id = 21480 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمعياه' 
    AND wf2.id != 21480
);
UPDATE word_frequencies 
SET pashto_word = 'سموع' 
WHERE id = 32427 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سموع' 
    AND wf2.id != 32427
);
UPDATE word_frequencies 
SET pashto_word = 'سموى' 
WHERE id = 28898 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سموى' 
    AND wf2.id != 28898
);
UPDATE word_frequencies 
SET pashto_word = 'سمویيل' 
WHERE id = 41761 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمویيل' 
    AND wf2.id != 41761
);
UPDATE word_frequencies 
SET pashto_word = 'سمير' 
WHERE id = 39745 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمير' 
    AND wf2.id != 39745
);
UPDATE word_frequencies 
SET pashto_word = 'سميراموت' 
WHERE id = 40370 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سميراموت' 
    AND wf2.id != 40370
);
UPDATE word_frequencies 
SET pashto_word = 'سمګر' 
WHERE id = 36893 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سمګر' 
    AND wf2.id != 36893
);
UPDATE word_frequencies 
SET pashto_word = 'سنبلط' 
WHERE id = 24375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سنبلط' 
    AND wf2.id != 24375
);
UPDATE word_frequencies 
SET pashto_word = 'سنتوی' 
WHERE id = 41831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سنتوی' 
    AND wf2.id != 41831
);
UPDATE word_frequencies 
SET pashto_word = 'سندرغاړو' 
WHERE id = 25651 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سندرغاړو' 
    AND wf2.id != 25651
);
UPDATE word_frequencies 
SET pashto_word = 'سندرغاړي' 
WHERE id = 35998 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سندرغاړي' 
    AND wf2.id != 35998
);
UPDATE word_frequencies 
SET pashto_word = 'سندرې' 
WHERE id = 30996 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سندرې' 
    AND wf2.id != 30996
);
UPDATE word_frequencies 
SET pashto_word = 'سهار' 
WHERE id = 30427 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سهار' 
    AND wf2.id != 30427
);
UPDATE word_frequencies 
SET pashto_word = 'سواندۍ' 
WHERE id = 33554 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سواندۍ' 
    AND wf2.id != 33554
);
UPDATE word_frequencies 
SET pashto_word = 'سوباب' 
WHERE id = 32428 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوباب' 
    AND wf2.id != 32428
);
UPDATE word_frequencies 
SET pashto_word = 'سوتلح' 
WHERE id = 39539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوتلح' 
    AND wf2.id != 39539
);
UPDATE word_frequencies 
SET pashto_word = 'سوداګرو' 
WHERE id = 33166 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوداګرو' 
    AND wf2.id != 33166
);
UPDATE word_frequencies 
SET pashto_word = 'سوزوله' 
WHERE id = 26450 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزوله' 
    AND wf2.id != 26450
);
UPDATE word_frequencies 
SET pashto_word = 'سوزولی' 
WHERE id = 42114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزولی' 
    AND wf2.id != 42114
);
UPDATE word_frequencies 
SET pashto_word = 'سوزولې' 
WHERE id = 21995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزولې' 
    AND wf2.id != 21995
);
UPDATE word_frequencies 
SET pashto_word = 'سوزوى' 
WHERE id = 17820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزوى' 
    AND wf2.id != 17820
);
UPDATE word_frequencies 
SET pashto_word = 'سوزوې' 
WHERE id = 37241 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزوې' 
    AND wf2.id != 37241
);
UPDATE word_frequencies 
SET pashto_word = 'سوزيږى' 
WHERE id = 39514 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزيږى' 
    AND wf2.id != 39514
);
UPDATE word_frequencies 
SET pashto_word = 'سوزېدلې' 
WHERE id = 35302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوزېدلې' 
    AND wf2.id != 35302
);
UPDATE word_frequencies 
SET pashto_word = 'سونى' 
WHERE id = 39194 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سونى' 
    AND wf2.id != 39194
);
UPDATE word_frequencies 
SET pashto_word = 'سوځوي' 
WHERE id = 24956 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوځوي' 
    AND wf2.id != 24956
);
UPDATE word_frequencies 
SET pashto_word = 'سوځي' 
WHERE id = 25207 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوځي' 
    AND wf2.id != 25207
);
UPDATE word_frequencies 
SET pashto_word = 'سوځیږي' 
WHERE id = 26913 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوځیږي' 
    AND wf2.id != 26913
);
UPDATE word_frequencies 
SET pashto_word = 'سوچ' 
WHERE id = 37002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوچ' 
    AND wf2.id != 37002
);
UPDATE word_frequencies 
SET pashto_word = 'سوکوه' 
WHERE id = 30196 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سوکوه' 
    AND wf2.id != 30196
);
UPDATE word_frequencies 
SET pashto_word = 'سویه' 
WHERE id = 37924 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سویه' 
    AND wf2.id != 37924
);
UPDATE word_frequencies 
SET pashto_word = 'سيخونه' 
WHERE id = 39387 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سيخونه' 
    AND wf2.id != 39387
);
UPDATE word_frequencies 
SET pashto_word = 'سيسى' 
WHERE id = 39729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سيسى' 
    AND wf2.id != 39729
);
UPDATE word_frequencies 
SET pashto_word = 'سينحرب' 
WHERE id = 40242 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سينحرب' 
    AND wf2.id != 40242
);
UPDATE word_frequencies 
SET pashto_word = 'سينى' 
WHERE id = 38988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سينى' 
    AND wf2.id != 38988
);
UPDATE word_frequencies 
SET pashto_word = 'سينګاره' 
WHERE id = 38681 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سينګاره' 
    AND wf2.id != 38681
);
UPDATE word_frequencies 
SET pashto_word = 'سينګاروې' 
WHERE id = 37045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سينګاروې' 
    AND wf2.id != 37045
);
UPDATE word_frequencies 
SET pashto_word = 'سيکې' 
WHERE id = 39857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سيکې' 
    AND wf2.id != 39857
);
UPDATE word_frequencies 
SET pashto_word = 'سِلح' 
WHERE id = 40272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سِلح' 
    AND wf2.id != 40272
);
UPDATE word_frequencies 
SET pashto_word = 'سِمرون' 
WHERE id = 32001 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سِمرون' 
    AND wf2.id != 32001
);
UPDATE word_frequencies 
SET pashto_word = 'سِمعا' 
WHERE id = 40321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سِمعا' 
    AND wf2.id != 40321
);
UPDATE word_frequencies 
SET pashto_word = 'سِمعى' 
WHERE id = 28957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سِمعى' 
    AND wf2.id != 28957
);
UPDATE word_frequencies 
SET pashto_word = 'سِيبا' 
WHERE id = 38971 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سِيبا' 
    AND wf2.id != 38971
);
UPDATE word_frequencies 
SET pashto_word = 'سپارم' 
WHERE id = 33355 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپارم' 
    AND wf2.id != 33355
);
UPDATE word_frequencies 
SET pashto_word = 'سپاهيان' 
WHERE id = 36925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپاهيان' 
    AND wf2.id != 36925
);
UPDATE word_frequencies 
SET pashto_word = 'سپرېده' 
WHERE id = 37728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپرېده' 
    AND wf2.id != 37728
);
UPDATE word_frequencies 
SET pashto_word = 'سپوږمۍ' 
WHERE id = 25987 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپوږمۍ' 
    AND wf2.id != 25987
);
UPDATE word_frequencies 
SET pashto_word = 'سپکوه' 
WHERE id = 36559 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپکوه' 
    AND wf2.id != 36559
);
UPDATE word_frequencies 
SET pashto_word = 'سپکوي' 
WHERE id = 23986 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپکوي' 
    AND wf2.id != 23986
);
UPDATE word_frequencies 
SET pashto_word = 'سپین‌ږیري' 
WHERE id = 34868 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپین‌ږیري' 
    AND wf2.id != 34868
);
UPDATE word_frequencies 
SET pashto_word = 'سپېڅلی' 
WHERE id = 26901 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سپېڅلی' 
    AND wf2.id != 26901
);
UPDATE word_frequencies 
SET pashto_word = 'سړو' 
WHERE id = 24302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړو' 
    AND wf2.id != 24302
);
UPDATE word_frequencies 
SET pashto_word = 'سړوی' 
WHERE id = 40854 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړوی' 
    AND wf2.id != 40854
);
UPDATE word_frequencies 
SET pashto_word = 'سړى' 
WHERE id = 17860 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړى' 
    AND wf2.id != 17860
);
UPDATE word_frequencies 
SET pashto_word = 'سړي' 
WHERE id = 27664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړي' 
    AND wf2.id != 27664
);
UPDATE word_frequencies 
SET pashto_word = 'سړيه' 
WHERE id = 32857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړيه' 
    AND wf2.id != 32857
);
UPDATE word_frequencies 
SET pashto_word = 'سړی' 
WHERE id = 41750 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړی' 
    AND wf2.id != 41750
);
UPDATE word_frequencies 
SET pashto_word = 'سړیه' 
WHERE id = 33716 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سړیه' 
    AND wf2.id != 33716
);
UPDATE word_frequencies 
SET pashto_word = 'سکاکه' 
WHERE id = 37646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سکاکه' 
    AND wf2.id != 37646
);
UPDATE word_frequencies 
SET pashto_word = 'سکې' 
WHERE id = 34215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سکې' 
    AND wf2.id != 34215
);
UPDATE word_frequencies 
SET pashto_word = 'سیمه' 
WHERE id = 21916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سیمه' 
    AND wf2.id != 21916
);
UPDATE word_frequencies 
SET pashto_word = 'سیمې' 
WHERE id = 27626 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سیمې' 
    AND wf2.id != 27626
);
UPDATE word_frequencies 
SET pashto_word = 'سیندونو' 
WHERE id = 36366 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سیندونو' 
    AND wf2.id != 36366
);
UPDATE word_frequencies 
SET pashto_word = 'سېرلي' 
WHERE id = 36056 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سېرلي' 
    AND wf2.id != 36056
);
UPDATE word_frequencies 
SET pashto_word = 'سېټونه' 
WHERE id = 30267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'سېټونه' 
    AND wf2.id != 30267
);
UPDATE word_frequencies 
SET pashto_word = 'شا' 
WHERE id = 36815 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شا' 
    AND wf2.id != 36815
);
UPDATE word_frequencies 
SET pashto_word = 'شات' 
WHERE id = 25406 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شات' 
    AND wf2.id != 25406
);
UPDATE word_frequencies 
SET pashto_word = 'شالونه' 
WHERE id = 36343 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شالونه' 
    AND wf2.id != 36343
);
UPDATE word_frequencies 
SET pashto_word = 'شام' 
WHERE id = 32340 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شام' 
    AND wf2.id != 32340
);
UPDATE word_frequencies 
SET pashto_word = 'شاملول' 
WHERE id = 33467 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شاملول' 
    AND wf2.id != 33467
);
UPDATE word_frequencies 
SET pashto_word = 'شاملوه' 
WHERE id = 38103 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شاملوه' 
    AND wf2.id != 38103
);
UPDATE word_frequencies 
SET pashto_word = 'شاملېدلی' 
WHERE id = 30563 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شاملېدلی' 
    AND wf2.id != 30563
);
UPDATE word_frequencies 
SET pashto_word = 'شان' 
WHERE id = 17675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شان' 
    AND wf2.id != 17675
);
UPDATE word_frequencies 
SET pashto_word = 'شاوول' 
WHERE id = 10822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شاوول' 
    AND wf2.id != 10822
);
UPDATE word_frequencies 
SET pashto_word = 'شاووله' 
WHERE id = 33374 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شاووله' 
    AND wf2.id != 33374
);
UPDATE word_frequencies 
SET pashto_word = 'شبناه' 
WHERE id = 28940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شبناه' 
    AND wf2.id != 28940
);
UPDATE word_frequencies 
SET pashto_word = 'شتمني' 
WHERE id = 30128 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شتمني' 
    AND wf2.id != 30128
);
UPDATE word_frequencies 
SET pashto_word = 'شته' 
WHERE id = 15087 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شته' 
    AND wf2.id != 15087
);
UPDATE word_frequencies 
SET pashto_word = 'شدرک' 
WHERE id = 16346 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شدرک' 
    AND wf2.id != 16346
);
UPDATE word_frequencies 
SET pashto_word = 'شراب' 
WHERE id = 22701 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شراب' 
    AND wf2.id != 22701
);
UPDATE word_frequencies 
SET pashto_word = 'شرابو' 
WHERE id = 30243 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرابو' 
    AND wf2.id != 30243
);
UPDATE word_frequencies 
SET pashto_word = 'شرابى' 
WHERE id = 32959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرابى' 
    AND wf2.id != 32959
);
UPDATE word_frequencies 
SET pashto_word = 'شراياه' 
WHERE id = 28144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شراياه' 
    AND wf2.id != 28144
);
UPDATE word_frequencies 
SET pashto_word = 'شربیا' 
WHERE id = 25653 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شربیا' 
    AND wf2.id != 25653
);
UPDATE word_frequencies 
SET pashto_word = 'شرموه' 
WHERE id = 36589 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرموه' 
    AND wf2.id != 36589
);
UPDATE word_frequencies 
SET pashto_word = 'شرموی' 
WHERE id = 40843 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرموی' 
    AND wf2.id != 40843
);
UPDATE word_frequencies 
SET pashto_word = 'شرميږى' 
WHERE id = 20131 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرميږى' 
    AND wf2.id != 20131
);
UPDATE word_frequencies 
SET pashto_word = 'شرمیږي' 
WHERE id = 23828 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمیږي' 
    AND wf2.id != 23828
);
UPDATE word_frequencies 
SET pashto_word = 'شرمیږی' 
WHERE id = 40732 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمیږی' 
    AND wf2.id != 40732
);
UPDATE word_frequencies 
SET pashto_word = 'شرمېدل' 
WHERE id = 31225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمېدل' 
    AND wf2.id != 31225
);
UPDATE word_frequencies 
SET pashto_word = 'شرمېږم' 
WHERE id = 24779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمېږم' 
    AND wf2.id != 24779
);
UPDATE word_frequencies 
SET pashto_word = 'شرمېږه' 
WHERE id = 33194 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمېږه' 
    AND wf2.id != 33194
);
UPDATE word_frequencies 
SET pashto_word = 'شرمېږی' 
WHERE id = 41907 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شرمېږی' 
    AND wf2.id != 41907
);
UPDATE word_frequencies 
SET pashto_word = 'شلان' 
WHERE id = 34002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شلان' 
    AND wf2.id != 34002
);
UPDATE word_frequencies 
SET pashto_word = 'شلتى‌اېل' 
WHERE id = 40297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شلتى‌اېل' 
    AND wf2.id != 40297
);
UPDATE word_frequencies 
SET pashto_word = 'شلوم' 
WHERE id = 10666 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شلوم' 
    AND wf2.id != 10666
);
UPDATE word_frequencies 
SET pashto_word = 'شلیږی' 
WHERE id = 40735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شلیږی' 
    AND wf2.id != 40735
);
UPDATE word_frequencies 
SET pashto_word = 'شم' 
WHERE id = 31019 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شم' 
    AND wf2.id != 31019
);
UPDATE word_frequencies 
SET pashto_word = 'شمس' 
WHERE id = 8313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمس' 
    AND wf2.id != 8313
);
UPDATE word_frequencies 
SET pashto_word = 'شمع' 
WHERE id = 37621 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمع' 
    AND wf2.id != 37621
);
UPDATE word_frequencies 
SET pashto_word = 'شمعون' 
WHERE id = 23990 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمعون' 
    AND wf2.id != 23990
);
UPDATE word_frequencies 
SET pashto_word = 'شمعونه' 
WHERE id = 27081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمعونه' 
    AND wf2.id != 27081
);
UPDATE word_frequencies 
SET pashto_word = 'شمعي' 
WHERE id = 6370 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمعي' 
    AND wf2.id != 6370
);
UPDATE word_frequencies 
SET pashto_word = 'شمعیه' 
WHERE id = 25351 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمعیه' 
    AND wf2.id != 25351
);
UPDATE word_frequencies 
SET pashto_word = 'شمه' 
WHERE id = 38685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمه' 
    AND wf2.id != 38685
);
UPDATE word_frequencies 
SET pashto_word = 'شمول' 
WHERE id = 30284 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمول' 
    AND wf2.id != 30284
);
UPDATE word_frequencies 
SET pashto_word = 'شمیراموت' 
WHERE id = 10697 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمیراموت' 
    AND wf2.id != 10697
);
UPDATE word_frequencies 
SET pashto_word = 'شمېرلی' 
WHERE id = 42080 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شمېرلی' 
    AND wf2.id != 42080
);
UPDATE word_frequencies 
SET pashto_word = 'شه' 
WHERE id = 19971 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شه' 
    AND wf2.id != 19971
);
UPDATE word_frequencies 
SET pashto_word = 'شهوت‌پرستي' 
WHERE id = 33551 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شهوت‌پرستي' 
    AND wf2.id != 33551
);
UPDATE word_frequencies 
SET pashto_word = 'شو' 
WHERE id = 11570 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شو' 
    AND wf2.id != 11570
);
UPDATE word_frequencies 
SET pashto_word = 'شو.»' 
WHERE id = 34320 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شو.»' 
    AND wf2.id != 34320
);
UPDATE word_frequencies 
SET pashto_word = 'شوباب' 
WHERE id = 10643 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوباب' 
    AND wf2.id != 10643
);
UPDATE word_frequencies 
SET pashto_word = 'شوبال' 
WHERE id = 25658 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوبال' 
    AND wf2.id != 25658
);
UPDATE word_frequencies 
SET pashto_word = 'شوحى' 
WHERE id = 37334 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوحى' 
    AND wf2.id != 37334
);
UPDATE word_frequencies 
SET pashto_word = 'شور' 
WHERE id = 27864 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شور' 
    AND wf2.id != 27864
);
UPDATE word_frequencies 
SET pashto_word = 'شوعال' 
WHERE id = 10656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوعال' 
    AND wf2.id != 10656
);
UPDATE word_frequencies 
SET pashto_word = 'شوفان' 
WHERE id = 38147 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوفان' 
    AND wf2.id != 38147
);
UPDATE word_frequencies 
SET pashto_word = 'شول' 
WHERE id = 11673 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شول' 
    AND wf2.id != 11673
);
UPDATE word_frequencies 
SET pashto_word = 'شوله' 
WHERE id = 26577 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوله' 
    AND wf2.id != 26577
);
UPDATE word_frequencies 
SET pashto_word = 'شولو' 
WHERE id = 16599 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شولو' 
    AND wf2.id != 16599
);
UPDATE word_frequencies 
SET pashto_word = 'شولې' 
WHERE id = 27303 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شولې' 
    AND wf2.id != 27303
);
UPDATE word_frequencies 
SET pashto_word = 'شوم' 
WHERE id = 13375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوم' 
    AND wf2.id != 13375
);
UPDATE word_frequencies 
SET pashto_word = 'شومه' 
WHERE id = 31789 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شومه' 
    AND wf2.id != 31789
);
UPDATE word_frequencies 
SET pashto_word = 'شونه' 
WHERE id = 22164 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شونه' 
    AND wf2.id != 22164
);
UPDATE word_frequencies 
SET pashto_word = 'شوه' 
WHERE id = 12047 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوه' 
    AND wf2.id != 12047
);
UPDATE word_frequencies 
SET pashto_word = 'شوى' 
WHERE id = 19180 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوى' 
    AND wf2.id != 19180
);
UPDATE word_frequencies 
SET pashto_word = 'شوي' 
WHERE id = 22518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوي' 
    AND wf2.id != 22518
);
UPDATE word_frequencies 
SET pashto_word = 'شوکت' 
WHERE id = 35965 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوکت' 
    AND wf2.id != 35965
);
UPDATE word_frequencies 
SET pashto_word = 'شوکه' 
WHERE id = 39736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوکه' 
    AND wf2.id != 39736
);
UPDATE word_frequencies 
SET pashto_word = 'شوکو' 
WHERE id = 40408 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوکو' 
    AND wf2.id != 40408
);
UPDATE word_frequencies 
SET pashto_word = 'شوی' 
WHERE id = 18857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوی' 
    AND wf2.id != 18857
);
UPDATE word_frequencies 
SET pashto_word = 'شوې' 
WHERE id = 12525 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شوې' 
    AND wf2.id != 12525
);
UPDATE word_frequencies 
SET pashto_word = 'شي' 
WHERE id = 18596 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شي' 
    AND wf2.id != 18596
);
UPDATE word_frequencies 
SET pashto_word = 'شيبا' 
WHERE id = 28566 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شيبا' 
    AND wf2.id != 28566
);
UPDATE word_frequencies 
SET pashto_word = 'شيم' 
WHERE id = 23188 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شيم' 
    AND wf2.id != 23188
);
UPDATE word_frequencies 
SET pashto_word = 'شينه' 
WHERE id = 28502 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شينه' 
    AND wf2.id != 28502
);
UPDATE word_frequencies 
SET pashto_word = 'شُملې' 
WHERE id = 37469 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شُملې' 
    AND wf2.id != 37469
);
UPDATE word_frequencies 
SET pashto_word = 'شُهرت' 
WHERE id = 25735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شُهرت' 
    AND wf2.id != 25735
);
UPDATE word_frequencies 
SET pashto_word = 'شُو' 
WHERE id = 12747 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شُو' 
    AND wf2.id != 12747
);
UPDATE word_frequencies 
SET pashto_word = 'شِکم' 
WHERE id = 24210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شِکم' 
    AND wf2.id != 24210
);
UPDATE word_frequencies 
SET pashto_word = 'شپنو' 
WHERE id = 30760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شپنو' 
    AND wf2.id != 30760
);
UPDATE word_frequencies 
SET pashto_word = 'شپه' 
WHERE id = 39113 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شپه' 
    AND wf2.id != 39113
);
UPDATE word_frequencies 
SET pashto_word = 'شپيلۍ' 
WHERE id = 21878 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شپيلۍ' 
    AND wf2.id != 21878
);
UPDATE word_frequencies 
SET pashto_word = 'شړل' 
WHERE id = 20672 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شړل' 
    AND wf2.id != 20672
);
UPDATE word_frequencies 
SET pashto_word = 'شړلی' 
WHERE id = 41538 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شړلی' 
    AND wf2.id != 41538
);
UPDATE word_frequencies 
SET pashto_word = 'شړم' 
WHERE id = 23656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شړم' 
    AND wf2.id != 23656
);
UPDATE word_frequencies 
SET pashto_word = 'شړه' 
WHERE id = 39871 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شړه' 
    AND wf2.id != 39871
);
UPDATE word_frequencies 
SET pashto_word = 'شړی' 
WHERE id = 40709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شړی' 
    AND wf2.id != 40709
);
UPDATE word_frequencies 
SET pashto_word = 'شکه' 
WHERE id = 6680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شکه' 
    AND wf2.id != 6680
);
UPDATE word_frequencies 
SET pashto_word = 'شی' 
WHERE id = 41086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شی' 
    AND wf2.id != 41086
);
UPDATE word_frequencies 
SET pashto_word = 'شیان' 
WHERE id = 30174 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شیان' 
    AND wf2.id != 30174
);
UPDATE word_frequencies 
SET pashto_word = 'شیشای' 
WHERE id = 37616 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شیشای' 
    AND wf2.id != 37616
);
UPDATE word_frequencies 
SET pashto_word = 'شیطانه' 
WHERE id = 29972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شیطانه' 
    AND wf2.id != 29972
);
UPDATE word_frequencies 
SET pashto_word = 'شینده' 
WHERE id = 34358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شینده' 
    AND wf2.id != 34358
);
UPDATE word_frequencies 
SET pashto_word = 'شیينه' 
WHERE id = 42051 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شیينه' 
    AND wf2.id != 42051
);
UPDATE word_frequencies 
SET pashto_word = 'شی‎' 
WHERE id = 41957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شی‎' 
    AND wf2.id != 41957
);
UPDATE word_frequencies 
SET pashto_word = 'شې' 
WHERE id = 12877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شې' 
    AND wf2.id != 12877
);
UPDATE word_frequencies 
SET pashto_word = 'شېطانه' 
WHERE id = 38846 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'شېطانه' 
    AND wf2.id != 38846
);
UPDATE word_frequencies 
SET pashto_word = 'صاحبه' 
WHERE id = 28514 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صاحبه' 
    AND wf2.id != 28514
);
UPDATE word_frequencies 
SET pashto_word = 'صاحِبانو' 
WHERE id = 9287 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صاحِبانو' 
    AND wf2.id != 9287
);
UPDATE word_frequencies 
SET pashto_word = 'صاحِبه' 
WHERE id = 17102 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صاحِبه' 
    AND wf2.id != 17102
);
UPDATE word_frequencies 
SET pashto_word = 'صادقانو' 
WHERE id = 38492 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صادقانو' 
    AND wf2.id != 38492
);
UPDATE word_frequencies 
SET pashto_word = 'صادوق' 
WHERE id = 38018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صادوق' 
    AND wf2.id != 38018
);
UPDATE word_frequencies 
SET pashto_word = 'صبر' 
WHERE id = 26858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صبر' 
    AND wf2.id != 26858
);
UPDATE word_frequencies 
SET pashto_word = 'صبعون' 
WHERE id = 25659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صبعون' 
    AND wf2.id != 25659
);
UPDATE word_frequencies 
SET pashto_word = 'صحرا' 
WHERE id = 36819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صحرا' 
    AND wf2.id != 36819
);
UPDATE word_frequencies 
SET pashto_word = 'صداقت' 
WHERE id = 24705 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صداقت' 
    AND wf2.id != 24705
);
UPDATE word_frequencies 
SET pashto_word = 'صدوق' 
WHERE id = 22315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صدوق' 
    AND wf2.id != 22315
);
UPDATE word_frequencies 
SET pashto_word = 'صفا' 
WHERE id = 35243 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صفا' 
    AND wf2.id != 35243
);
UPDATE word_frequencies 
SET pashto_word = 'صفو' 
WHERE id = 27816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صفو' 
    AND wf2.id != 27816
);
UPDATE word_frequencies 
SET pashto_word = 'صندوق' 
WHERE id = 28379 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صندوق' 
    AND wf2.id != 28379
);
UPDATE word_frequencies 
SET pashto_word = 'صهیونه' 
WHERE id = 27881 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صهیونه' 
    AND wf2.id != 27881
);
UPDATE word_frequencies 
SET pashto_word = 'صور' 
WHERE id = 20667 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صور' 
    AND wf2.id != 20667
);
UPDATE word_frequencies 
SET pashto_word = 'صوره' 
WHERE id = 30738 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صوره' 
    AND wf2.id != 30738
);
UPDATE word_frequencies 
SET pashto_word = 'صيدا' 
WHERE id = 32321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صيدا' 
    AND wf2.id != 32321
);
UPDATE word_frequencies 
SET pashto_word = 'صيونه' 
WHERE id = 26150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صيونه' 
    AND wf2.id != 26150
);
UPDATE word_frequencies 
SET pashto_word = 'صُرعا' 
WHERE id = 28808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صُرعا' 
    AND wf2.id != 28808
);
UPDATE word_frequencies 
SET pashto_word = 'صِدق' 
WHERE id = 11138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صِدق' 
    AND wf2.id != 11138
);
UPDATE word_frequencies 
SET pashto_word = 'صِقلاج' 
WHERE id = 32297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صِقلاج' 
    AND wf2.id != 32297
);
UPDATE word_frequencies 
SET pashto_word = 'صیدون' 
WHERE id = 37731 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'صیدون' 
    AND wf2.id != 37731
);
UPDATE word_frequencies 
SET pashto_word = 'طاقت' 
WHERE id = 30514 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'طاقت' 
    AND wf2.id != 30514
);
UPDATE word_frequencies 
SET pashto_word = 'طوبياه' 
WHERE id = 28521 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'طوبياه' 
    AND wf2.id != 28521
);
UPDATE word_frequencies 
SET pashto_word = 'ظلم' 
WHERE id = 31041 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ظلم' 
    AND wf2.id != 31041
);
UPDATE word_frequencies 
SET pashto_word = 'عاجزۍ' 
WHERE id = 24931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عاجزۍ' 
    AND wf2.id != 24931
);
UPDATE word_frequencies 
SET pashto_word = 'عاشقانو' 
WHERE id = 38712 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عاشقانو' 
    AND wf2.id != 38712
);
UPDATE word_frequencies 
SET pashto_word = 'عاصم' 
WHERE id = 37623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عاصم' 
    AND wf2.id != 37623
);
UPDATE word_frequencies 
SET pashto_word = 'عالمانو' 
WHERE id = 33951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عالمانو' 
    AND wf2.id != 33951
);
UPDATE word_frequencies 
SET pashto_word = 'عاموسه' 
WHERE id = 35192 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عاموسه' 
    AND wf2.id != 35192
);
UPDATE word_frequencies 
SET pashto_word = 'عبادتګاه' 
WHERE id = 37102 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبادتګاه' 
    AND wf2.id != 37102
);
UPDATE word_frequencies 
SET pashto_word = 'عبدنجو' 
WHERE id = 27562 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبدنجو' 
    AND wf2.id != 27562
);
UPDATE word_frequencies 
SET pashto_word = 'عبدون' 
WHERE id = 26002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبدون' 
    AND wf2.id != 26002
);
UPDATE word_frequencies 
SET pashto_word = 'عبدى' 
WHERE id = 40324 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبدى' 
    AND wf2.id != 40324
);
UPDATE word_frequencies 
SET pashto_word = 'عبدياه' 
WHERE id = 32610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبدياه' 
    AND wf2.id != 32610
);
UPDATE word_frequencies 
SET pashto_word = 'عبرون' 
WHERE id = 37674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عبرون' 
    AND wf2.id != 37674
);
UPDATE word_frequencies 
SET pashto_word = 'عتر' 
WHERE id = 39741 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عتر' 
    AND wf2.id != 39741
);
UPDATE word_frequencies 
SET pashto_word = 'عتى' 
WHERE id = 40283 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عتى' 
    AND wf2.id != 40283
);
UPDATE word_frequencies 
SET pashto_word = 'عجلون' 
WHERE id = 28266 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عجلون' 
    AND wf2.id != 28266
);
UPDATE word_frequencies 
SET pashto_word = 'عدالت' 
WHERE id = 29383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدالت' 
    AND wf2.id != 29383
);
UPDATE word_frequencies 
SET pashto_word = 'عداياه' 
WHERE id = 28964 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عداياه' 
    AND wf2.id != 28964
);
UPDATE word_frequencies 
SET pashto_word = 'عدایا' 
WHERE id = 35985 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدایا' 
    AND wf2.id != 35985
);
UPDATE word_frequencies 
SET pashto_word = 'عدر' 
WHERE id = 39732 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدر' 
    AND wf2.id != 39732
);
UPDATE word_frequencies 
SET pashto_word = 'عدعده' 
WHERE id = 37619 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدعده' 
    AND wf2.id != 37619
);
UPDATE word_frequencies 
SET pashto_word = 'عدن' 
WHERE id = 27373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدن' 
    AND wf2.id != 27373
);
UPDATE word_frequencies 
SET pashto_word = 'عدنا' 
WHERE id = 35986 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدنا' 
    AND wf2.id != 35986
);
UPDATE word_frequencies 
SET pashto_word = 'عدولام' 
WHERE id = 23833 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عدولام' 
    AND wf2.id != 23833
);
UPDATE word_frequencies 
SET pashto_word = 'عذابویينه' 
WHERE id = 41545 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عذابویينه' 
    AND wf2.id != 41545
);
UPDATE word_frequencies 
SET pashto_word = 'عراد' 
WHERE id = 31441 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عراد' 
    AND wf2.id != 31441
);
UPDATE word_frequencies 
SET pashto_word = 'عرب' 
WHERE id = 39747 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عرب' 
    AND wf2.id != 39747
);
UPDATE word_frequencies 
SET pashto_word = 'عربه' 
WHERE id = 37645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عربه' 
    AND wf2.id != 37645
);
UPDATE word_frequencies 
SET pashto_word = 'عربو' 
WHERE id = 31585 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عربو' 
    AND wf2.id != 31585
);
UPDATE word_frequencies 
SET pashto_word = 'عرقى' 
WHERE id = 38987 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عرقى' 
    AND wf2.id != 38987
);
UPDATE word_frequencies 
SET pashto_word = 'عزت' 
WHERE id = 22716 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزت' 
    AND wf2.id != 22716
);
UPDATE word_frequencies 
SET pashto_word = 'عزتمن' 
WHERE id = 34576 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزتمن' 
    AND wf2.id != 34576
);
UPDATE word_frequencies 
SET pashto_word = 'عزر' 
WHERE id = 4120 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزر' 
    AND wf2.id != 4120
);
UPDATE word_frequencies 
SET pashto_word = 'عزرياه' 
WHERE id = 35254 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزرياه' 
    AND wf2.id != 35254
);
UPDATE word_frequencies 
SET pashto_word = 'عزريقام' 
WHERE id = 40351 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزريقام' 
    AND wf2.id != 40351
);
UPDATE word_frequencies 
SET pashto_word = 'عزریا' 
WHERE id = 25339 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزریا' 
    AND wf2.id != 25339
);
UPDATE word_frequencies 
SET pashto_word = 'عزي' 
WHERE id = 7873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزي' 
    AND wf2.id != 7873
);
UPDATE word_frequencies 
SET pashto_word = 'عزيزانو' 
WHERE id = 37036 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزيزانو' 
    AND wf2.id != 37036
);
UPDATE word_frequencies 
SET pashto_word = 'عزیا' 
WHERE id = 36138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزیا' 
    AND wf2.id != 36138
);
UPDATE word_frequencies 
SET pashto_word = 'عزیقه' 
WHERE id = 34765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عزیقه' 
    AND wf2.id != 34765
);
UPDATE word_frequencies 
SET pashto_word = 'عساهيل' 
WHERE id = 39989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عساهيل' 
    AND wf2.id != 39989
);
UPDATE word_frequencies 
SET pashto_word = 'عساياه' 
WHERE id = 40365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عساياه' 
    AND wf2.id != 40365
);
UPDATE word_frequencies 
SET pashto_word = 'عسن' 
WHERE id = 39742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عسن' 
    AND wf2.id != 39742
);
UPDATE word_frequencies 
SET pashto_word = 'عسکرو' 
WHERE id = 34917 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عسکرو' 
    AND wf2.id != 34917
);
UPDATE word_frequencies 
SET pashto_word = 'عشر' 
WHERE id = 30525 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عشر' 
    AND wf2.id != 30525
);
UPDATE word_frequencies 
SET pashto_word = 'عضم' 
WHERE id = 32296 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عضم' 
    AND wf2.id != 32296
);
UPDATE word_frequencies 
SET pashto_word = 'عطر' 
WHERE id = 30097 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عطر' 
    AND wf2.id != 30097
);
UPDATE word_frequencies 
SET pashto_word = 'عظيمه' 
WHERE id = 37541 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عظيمه' 
    AND wf2.id != 37541
);
UPDATE word_frequencies 
SET pashto_word = 'عفره' 
WHERE id = 37660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عفره' 
    AND wf2.id != 37660
);
UPDATE word_frequencies 
SET pashto_word = 'عقرون' 
WHERE id = 25783 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عقرون' 
    AND wf2.id != 25783
);
UPDATE word_frequencies 
SET pashto_word = 'عقل' 
WHERE id = 23955 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عقل' 
    AND wf2.id != 23955
);
UPDATE word_frequencies 
SET pashto_word = 'عقوب' 
WHERE id = 38026 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عقوب' 
    AND wf2.id != 38026
);
UPDATE word_frequencies 
SET pashto_word = 'عقیقو' 
WHERE id = 25289 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عقیقو' 
    AND wf2.id != 25289
);
UPDATE word_frequencies 
SET pashto_word = 'علاقه' 
WHERE id = 21278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علاقه' 
    AND wf2.id != 21278
);
UPDATE word_frequencies 
SET pashto_word = 'علاقو' 
WHERE id = 28037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علاقو' 
    AND wf2.id != 28037
);
UPDATE word_frequencies 
SET pashto_word = 'علاقې' 
WHERE id = 20044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علاقې' 
    AND wf2.id != 20044
);
UPDATE word_frequencies 
SET pashto_word = 'علاوه' 
WHERE id = 14949 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علاوه' 
    AND wf2.id != 14949
);
UPDATE word_frequencies 
SET pashto_word = 'علمت' 
WHERE id = 40349 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علمت' 
    AND wf2.id != 40349
);
UPDATE word_frequencies 
SET pashto_word = 'علوان' 
WHERE id = 39148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'علوان' 
    AND wf2.id != 39148
);
UPDATE word_frequencies 
SET pashto_word = 'عماليق' 
WHERE id = 31967 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عماليق' 
    AND wf2.id != 31967
);
UPDATE word_frequencies 
SET pashto_word = 'عمرام' 
WHERE id = 5426 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عمرام' 
    AND wf2.id != 5426
);
UPDATE word_frequencies 
SET pashto_word = 'عملونو' 
WHERE id = 28721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عملونو' 
    AND wf2.id != 28721
);
UPDATE word_frequencies 
SET pashto_word = 'عموره' 
WHERE id = 23024 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عموره' 
    AND wf2.id != 23024
);
UPDATE word_frequencies 
SET pashto_word = 'عمون' 
WHERE id = 19039 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عمون' 
    AND wf2.id != 19039
);
UPDATE word_frequencies 
SET pashto_word = 'عمونه' 
WHERE id = 37018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عمونه' 
    AND wf2.id != 37018
);
UPDATE word_frequencies 
SET pashto_word = 'عمونیانو' 
WHERE id = 30440 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عمونیانو' 
    AND wf2.id != 30440
);
UPDATE word_frequencies 
SET pashto_word = 'عمى‌نداب' 
WHERE id = 28953 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عمى‌نداب' 
    AND wf2.id != 28953
);
UPDATE word_frequencies 
SET pashto_word = 'عناب' 
WHERE id = 37636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عناب' 
    AND wf2.id != 37636
);
UPDATE word_frequencies 
SET pashto_word = 'عنامى' 
WHERE id = 38977 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عنامى' 
    AND wf2.id != 38977
);
UPDATE word_frequencies 
SET pashto_word = 'عنه' 
WHERE id = 25660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عنه' 
    AND wf2.id != 25660
);
UPDATE word_frequencies 
SET pashto_word = 'عوبال' 
WHERE id = 39003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عوبال' 
    AND wf2.id != 39003
);
UPDATE word_frequencies 
SET pashto_word = 'عوبيد' 
WHERE id = 40284 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عوبيد' 
    AND wf2.id != 40284
);
UPDATE word_frequencies 
SET pashto_word = 'عوج' 
WHERE id = 31621 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عوج' 
    AND wf2.id != 31621
);
UPDATE word_frequencies 
SET pashto_word = 'عير' 
WHERE id = 31890 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عير' 
    AND wf2.id != 31890
);
UPDATE word_frequencies 
SET pashto_word = 'عيرى' 
WHERE id = 39196 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عيرى' 
    AND wf2.id != 39196
);
UPDATE word_frequencies 
SET pashto_word = 'عيسىٰ' 
WHERE id = 23380 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عيسىٰ' 
    AND wf2.id != 23380
);
UPDATE word_frequencies 
SET pashto_word = 'عيفه' 
WHERE id = 39075 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عيفه' 
    AND wf2.id != 39075
);
UPDATE word_frequencies 
SET pashto_word = 'عيلى' 
WHERE id = 39887 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عيلى' 
    AND wf2.id != 39887
);
UPDATE word_frequencies 
SET pashto_word = 'عين‌جنيم' 
WHERE id = 32300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عين‌جنيم' 
    AND wf2.id != 32300
);
UPDATE word_frequencies 
SET pashto_word = 'عُزى' 
WHERE id = 24658 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُزى' 
    AND wf2.id != 24658
);
UPDATE word_frequencies 
SET pashto_word = 'عُزى‌اېل' 
WHERE id = 28652 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُزى‌اېل' 
    AND wf2.id != 28652
);
UPDATE word_frequencies 
SET pashto_word = 'عُزياه' 
WHERE id = 26480 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُزياه' 
    AND wf2.id != 26480
);
UPDATE word_frequencies 
SET pashto_word = 'عُمرام' 
WHERE id = 24512 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُمرام' 
    AND wf2.id != 24512
);
UPDATE word_frequencies 
SET pashto_word = 'عُود' 
WHERE id = 38702 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُود' 
    AND wf2.id != 38702
);
UPDATE word_frequencies 
SET pashto_word = 'عُوض' 
WHERE id = 31892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عُوض' 
    AND wf2.id != 31892
);
UPDATE word_frequencies 
SET pashto_word = 'عِبر' 
WHERE id = 28952 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عِبر' 
    AND wf2.id != 28952
);
UPDATE word_frequencies 
SET pashto_word = 'عِفر' 
WHERE id = 31934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عِفر' 
    AND wf2.id != 31934
);
UPDATE word_frequencies 
SET pashto_word = 'عِلم' 
WHERE id = 25460 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عِلم' 
    AND wf2.id != 25460
);
UPDATE word_frequencies 
SET pashto_word = 'عکبور' 
WHERE id = 40260 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عکبور' 
    AND wf2.id != 40260
);
UPDATE word_frequencies 
SET pashto_word = 'عکو' 
WHERE id = 37772 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عکو' 
    AND wf2.id != 37772
);
UPDATE word_frequencies 
SET pashto_word = 'عیسی' 
WHERE id = 29453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عیسی' 
    AND wf2.id != 29453
);
UPDATE word_frequencies 
SET pashto_word = 'عیفر' 
WHERE id = 10637 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عیفر' 
    AND wf2.id != 10637
);
UPDATE word_frequencies 
SET pashto_word = 'عیلام' 
WHERE id = 10635 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عیلام' 
    AND wf2.id != 10635
);
UPDATE word_frequencies 
SET pashto_word = 'عین' 
WHERE id = 37664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عین' 
    AND wf2.id != 37664
);
UPDATE word_frequencies 
SET pashto_word = 'عیون' 
WHERE id = 10804 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'عیون' 
    AND wf2.id != 10804
);
UPDATE word_frequencies 
SET pashto_word = 'غاړه' 
WHERE id = 39599 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غاړه' 
    AND wf2.id != 39599
);
UPDATE word_frequencies 
SET pashto_word = 'غاښ' 
WHERE id = 30539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غاښ' 
    AND wf2.id != 30539
);
UPDATE word_frequencies 
SET pashto_word = 'غاښونه' 
WHERE id = 32493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غاښونه' 
    AND wf2.id != 32493
);
UPDATE word_frequencies 
SET pashto_word = 'غر' 
WHERE id = 22004 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غر' 
    AND wf2.id != 22004
);
UPDATE word_frequencies 
SET pashto_word = 'غره' 
WHERE id = 31763 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غره' 
    AND wf2.id != 31763
);
UPDATE word_frequencies 
SET pashto_word = 'غرور' 
WHERE id = 31680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غرور' 
    AND wf2.id != 31680
);
UPDATE word_frequencies 
SET pashto_word = 'غرونو' 
WHERE id = 17038 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غرونو' 
    AND wf2.id != 17038
);
UPDATE word_frequencies 
SET pashto_word = 'غريبانان' 
WHERE id = 40270 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غريبانان' 
    AND wf2.id != 40270
);
UPDATE word_frequencies 
SET pashto_word = 'غريږى' 
WHERE id = 37085 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غريږى' 
    AND wf2.id != 37085
);
UPDATE word_frequencies 
SET pashto_word = 'غریب' 
WHERE id = 27299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غریب' 
    AND wf2.id != 27299
);
UPDATE word_frequencies 
SET pashto_word = 'غزه' 
WHERE id = 20595 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غزه' 
    AND wf2.id != 20595
);
UPDATE word_frequencies 
SET pashto_word = 'غزوى' 
WHERE id = 37847 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غزوى' 
    AND wf2.id != 37847
);
UPDATE word_frequencies 
SET pashto_word = 'غشو' 
WHERE id = 35893 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غشو' 
    AND wf2.id != 35893
);
UPDATE word_frequencies 
SET pashto_word = 'غصې' 
WHERE id = 31105 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غصې' 
    AND wf2.id != 31105
);
UPDATE word_frequencies 
SET pashto_word = 'غضب' 
WHERE id = 26836 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غضب' 
    AND wf2.id != 26836
);
UPDATE word_frequencies 
SET pashto_word = 'غلا' 
WHERE id = 22544 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلا' 
    AND wf2.id != 22544
);
UPDATE word_frequencies 
SET pashto_word = 'غلامان' 
WHERE id = 25286 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلامان' 
    AND wf2.id != 25286
);
UPDATE word_frequencies 
SET pashto_word = 'غلامانو' 
WHERE id = 26820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلامانو' 
    AND wf2.id != 26820
);
UPDATE word_frequencies 
SET pashto_word = 'غلل' 
WHERE id = 32691 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلل' 
    AND wf2.id != 32691
);
UPDATE word_frequencies 
SET pashto_word = 'غله' 
WHERE id = 22234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غله' 
    AND wf2.id != 22234
);
UPDATE word_frequencies 
SET pashto_word = 'غلو' 
WHERE id = 23119 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلو' 
    AND wf2.id != 23119
);
UPDATE word_frequencies 
SET pashto_word = 'غلونه' 
WHERE id = 38657 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلونه' 
    AND wf2.id != 38657
);
UPDATE word_frequencies 
SET pashto_word = 'غلی' 
WHERE id = 41668 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلی' 
    AND wf2.id != 41668
);
UPDATE word_frequencies 
SET pashto_word = 'غلې' 
WHERE id = 28788 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غلې' 
    AND wf2.id != 28788
);
UPDATE word_frequencies 
SET pashto_word = 'غم' 
WHERE id = 33729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غم' 
    AND wf2.id != 33729
);
UPDATE word_frequencies 
SET pashto_word = 'غنم' 
WHERE id = 18328 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غنم' 
    AND wf2.id != 18328
);
UPDATE word_frequencies 
SET pashto_word = 'غني' 
WHERE id = 35743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غني' 
    AND wf2.id != 35743
);
UPDATE word_frequencies 
SET pashto_word = 'غنيمت' 
WHERE id = 35234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غنيمت' 
    AND wf2.id != 35234
);
UPDATE word_frequencies 
SET pashto_word = 'غوا' 
WHERE id = 39311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوا' 
    AND wf2.id != 39311
);
UPDATE word_frequencies 
SET pashto_word = 'غواړم' 
WHERE id = 18793 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړم' 
    AND wf2.id != 18793
);
UPDATE word_frequencies 
SET pashto_word = 'غواړمه' 
WHERE id = 38655 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړمه' 
    AND wf2.id != 38655
);
UPDATE word_frequencies 
SET pashto_word = 'غواړه' 
WHERE id = 29960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړه' 
    AND wf2.id != 29960
);
UPDATE word_frequencies 
SET pashto_word = 'غواړو' 
WHERE id = 27623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړو' 
    AND wf2.id != 27623
);
UPDATE word_frequencies 
SET pashto_word = 'غواړينه' 
WHERE id = 28499 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړينه' 
    AND wf2.id != 28499
);
UPDATE word_frequencies 
SET pashto_word = 'غواړی' 
WHERE id = 40586 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړی' 
    AND wf2.id != 40586
);
UPDATE word_frequencies 
SET pashto_word = 'غواړې' 
WHERE id = 28355 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواړې' 
    AND wf2.id != 28355
);
UPDATE word_frequencies 
SET pashto_word = 'غواګانو' 
WHERE id = 23975 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غواګانو' 
    AND wf2.id != 23975
);
UPDATE word_frequencies 
SET pashto_word = 'غورزول' 
WHERE id = 31162 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورزول' 
    AND wf2.id != 31162
);
UPDATE word_frequencies 
SET pashto_word = 'غورزولو' 
WHERE id = 36621 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورزولو' 
    AND wf2.id != 36621
);
UPDATE word_frequencies 
SET pashto_word = 'غورزوم' 
WHERE id = 36683 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورزوم' 
    AND wf2.id != 36683
);
UPDATE word_frequencies 
SET pashto_word = 'غورزوى' 
WHERE id = 39925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورزوى' 
    AND wf2.id != 39925
);
UPDATE word_frequencies 
SET pashto_word = 'غورزيږى' 
WHERE id = 22940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورزيږى' 
    AND wf2.id != 22940
);
UPDATE word_frequencies 
SET pashto_word = 'غوريږى' 
WHERE id = 39844 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوريږى' 
    AND wf2.id != 39844
);
UPDATE word_frequencies 
SET pashto_word = 'غورځولی' 
WHERE id = 29719 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورځولی' 
    AND wf2.id != 29719
);
UPDATE word_frequencies 
SET pashto_word = 'غورځیږي' 
WHERE id = 25224 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورځیږي' 
    AND wf2.id != 25224
);
UPDATE word_frequencies 
SET pashto_word = 'غورېږی' 
WHERE id = 41830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غورېږی' 
    AND wf2.id != 41830
);
UPDATE word_frequencies 
SET pashto_word = 'غوغا' 
WHERE id = 36247 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوغا' 
    AND wf2.id != 36247
);
UPDATE word_frequencies 
SET pashto_word = 'غولوي' 
WHERE id = 24925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غولوي' 
    AND wf2.id != 24925
);
UPDATE word_frequencies 
SET pashto_word = 'غولوی' 
WHERE id = 41824 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غولوی' 
    AND wf2.id != 41824
);
UPDATE word_frequencies 
SET pashto_word = 'غونډیو' 
WHERE id = 22903 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غونډیو' 
    AND wf2.id != 22903
);
UPDATE word_frequencies 
SET pashto_word = 'غونډۍ' 
WHERE id = 35961 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غونډۍ' 
    AND wf2.id != 35961
);
UPDATE word_frequencies 
SET pashto_word = 'غوَيانو' 
WHERE id = 26442 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوَيانو' 
    AND wf2.id != 26442
);
UPDATE word_frequencies 
SET pashto_word = 'غوَیی' 
WHERE id = 40678 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوَیی' 
    AND wf2.id != 40678
);
UPDATE word_frequencies 
SET pashto_word = 'غوټۍ' 
WHERE id = 39325 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوټۍ' 
    AND wf2.id != 39325
);
UPDATE word_frequencies 
SET pashto_word = 'غوڅوي' 
WHERE id = 36160 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوڅوي' 
    AND wf2.id != 36160
);
UPDATE word_frequencies 
SET pashto_word = 'غوڅوې' 
WHERE id = 37247 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوڅوې' 
    AND wf2.id != 37247
);
UPDATE word_frequencies 
SET pashto_word = 'غوړوي' 
WHERE id = 35795 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوړوي' 
    AND wf2.id != 35795
);
UPDATE word_frequencies 
SET pashto_word = 'غوښتل' 
WHERE id = 19386 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوښتل' 
    AND wf2.id != 19386
);
UPDATE word_frequencies 
SET pashto_word = 'غوښتله' 
WHERE id = 33199 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوښتله' 
    AND wf2.id != 33199
);
UPDATE word_frequencies 
SET pashto_word = 'غوښتلو' 
WHERE id = 30500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوښتلو' 
    AND wf2.id != 30500
);
UPDATE word_frequencies 
SET pashto_word = 'غوښه' 
WHERE id = 22938 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوښه' 
    AND wf2.id != 22938
);
UPDATE word_frequencies 
SET pashto_word = 'غوښې' 
WHERE id = 31602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غوښې' 
    AND wf2.id != 31602
);
UPDATE word_frequencies 
SET pashto_word = 'غویان' 
WHERE id = 34880 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غویان' 
    AND wf2.id != 34880
);
UPDATE word_frequencies 
SET pashto_word = 'غویانو' 
WHERE id = 25547 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غویانو' 
    AND wf2.id != 25547
);
UPDATE word_frequencies 
SET pashto_word = 'غپيږى' 
WHERE id = 32042 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غپيږى' 
    AND wf2.id != 32042
);
UPDATE word_frequencies 
SET pashto_word = 'غړمبيږى' 
WHERE id = 28241 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غړمبيږى' 
    AND wf2.id != 28241
);
UPDATE word_frequencies 
SET pashto_word = 'غږول' 
WHERE id = 23864 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غږول' 
    AND wf2.id != 23864
);
UPDATE word_frequencies 
SET pashto_word = 'غږولې' 
WHERE id = 28933 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غږولې' 
    AND wf2.id != 28933
);
UPDATE word_frequencies 
SET pashto_word = 'غږوونکو' 
WHERE id = 34620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غږوونکو' 
    AND wf2.id != 34620
);
UPDATE word_frequencies 
SET pashto_word = 'غږوى' 
WHERE id = 22180 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غږوى' 
    AND wf2.id != 22180
);
UPDATE word_frequencies 
SET pashto_word = 'غېبوى' 
WHERE id = 37290 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'غېبوى' 
    AND wf2.id != 37290
);
UPDATE word_frequencies 
SET pashto_word = 'فارس' 
WHERE id = 27763 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فارس' 
    AND wf2.id != 27763
);
UPDATE word_frequencies 
SET pashto_word = 'فارص' 
WHERE id = 40301 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فارص' 
    AND wf2.id != 40301
);
UPDATE word_frequencies 
SET pashto_word = 'فاره' 
WHERE id = 37659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فاره' 
    AND wf2.id != 37659
);
UPDATE word_frequencies 
SET pashto_word = 'فالګر' 
WHERE id = 21871 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فالګر' 
    AND wf2.id != 21871
);
UPDATE word_frequencies 
SET pashto_word = 'فالګرو' 
WHERE id = 27576 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فالګرو' 
    AND wf2.id != 27576
);
UPDATE word_frequencies 
SET pashto_word = 'فتروس' 
WHERE id = 36185 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فتروس' 
    AND wf2.id != 36185
);
UPDATE word_frequencies 
SET pashto_word = 'فتروسى' 
WHERE id = 38980 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فتروسى' 
    AND wf2.id != 38980
);
UPDATE word_frequencies 
SET pashto_word = 'فداياه' 
WHERE id = 32600 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فداياه' 
    AND wf2.id != 32600
);
UPDATE word_frequencies 
SET pashto_word = 'فدایا' 
WHERE id = 38015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فدایا' 
    AND wf2.id != 38015
);
UPDATE word_frequencies 
SET pashto_word = 'فرزیان' 
WHERE id = 30551 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرزیان' 
    AND wf2.id != 30551
);
UPDATE word_frequencies 
SET pashto_word = 'فرزیانو' 
WHERE id = 24069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرزیانو' 
    AND wf2.id != 24069
);
UPDATE word_frequencies 
SET pashto_word = 'فرسين' 
WHERE id = 35360 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرسين' 
    AND wf2.id != 35360
);
UPDATE word_frequencies 
SET pashto_word = 'فرشنداطا' 
WHERE id = 35671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرشنداطا' 
    AND wf2.id != 35671
);
UPDATE word_frequencies 
SET pashto_word = 'فرعون' 
WHERE id = 35518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرعون' 
    AND wf2.id != 35518
);
UPDATE word_frequencies 
SET pashto_word = 'فرعونه' 
WHERE id = 35826 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرعونه' 
    AND wf2.id != 35826
);
UPDATE word_frequencies 
SET pashto_word = 'فرمایى' 
WHERE id = 40959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرمایى' 
    AND wf2.id != 40959
);
UPDATE word_frequencies 
SET pashto_word = 'فرمایيل' 
WHERE id = 40973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرمایيل' 
    AND wf2.id != 40973
);
UPDATE word_frequencies 
SET pashto_word = 'فرمایيلی' 
WHERE id = 41882 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرمایيلی' 
    AND wf2.id != 41882
);
UPDATE word_frequencies 
SET pashto_word = 'فرمشتا' 
WHERE id = 35677 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرمشتا' 
    AND wf2.id != 35677
);
UPDATE word_frequencies 
SET pashto_word = 'فريسيانو' 
WHERE id = 20779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فريسيانو' 
    AND wf2.id != 20779
);
UPDATE word_frequencies 
SET pashto_word = 'فرښتې' 
WHERE id = 30173 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فرښتې' 
    AND wf2.id != 30173
);
UPDATE word_frequencies 
SET pashto_word = 'فریسیانو' 
WHERE id = 19443 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فریسیانو' 
    AND wf2.id != 19443
);
UPDATE word_frequencies 
SET pashto_word = 'فشحوره' 
WHERE id = 36633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فشحوره' 
    AND wf2.id != 36633
);
UPDATE word_frequencies 
SET pashto_word = 'فصل' 
WHERE id = 39624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فصل' 
    AND wf2.id != 39624
);
UPDATE word_frequencies 
SET pashto_word = 'فضل' 
WHERE id = 23398 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فضل' 
    AND wf2.id != 23398
);
UPDATE word_frequencies 
SET pashto_word = 'فلتي' 
WHERE id = 35118 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلتي' 
    AND wf2.id != 35118
);
UPDATE word_frequencies 
SET pashto_word = 'فلج' 
WHERE id = 40273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلج' 
    AND wf2.id != 40273
);
UPDATE word_frequencies 
SET pashto_word = 'فلداش' 
WHERE id = 36046 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلداش' 
    AND wf2.id != 36046
);
UPDATE word_frequencies 
SET pashto_word = 'فلستيانو' 
WHERE id = 32341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلستيانو' 
    AND wf2.id != 32341
);
UPDATE word_frequencies 
SET pashto_word = 'فلسطینیانو' 
WHERE id = 36201 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلسطینیانو' 
    AND wf2.id != 36201
);
UPDATE word_frequencies 
SET pashto_word = 'فلو' 
WHERE id = 26087 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فلو' 
    AND wf2.id != 26087
);
UPDATE word_frequencies 
SET pashto_word = 'فوجيان' 
WHERE id = 36914 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فوجيان' 
    AND wf2.id != 36914
);
UPDATE word_frequencies 
SET pashto_word = 'فوجيانو' 
WHERE id = 40113 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فوجيانو' 
    AND wf2.id != 40113
);
UPDATE word_frequencies 
SET pashto_word = 'فوراتا' 
WHERE id = 35674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فوراتا' 
    AND wf2.id != 35674
);
UPDATE word_frequencies 
SET pashto_word = 'فيتون' 
WHERE id = 40346 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فيتون' 
    AND wf2.id != 40346
);
UPDATE word_frequencies 
SET pashto_word = 'فينحاس' 
WHERE id = 26333 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فينحاس' 
    AND wf2.id != 26333
);
UPDATE word_frequencies 
SET pashto_word = 'فُوه' 
WHERE id = 32000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فُوه' 
    AND wf2.id != 32000
);
UPDATE word_frequencies 
SET pashto_word = 'فِرعون' 
WHERE id = 26225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فِرعون' 
    AND wf2.id != 26225
);
UPDATE word_frequencies 
SET pashto_word = 'فیلیپوس' 
WHERE id = 29336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'فیلیپوس' 
    AND wf2.id != 29336
);
UPDATE word_frequencies 
SET pashto_word = 'قاتلانو' 
WHERE id = 30115 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قاتلانو' 
    AND wf2.id != 30115
);
UPDATE word_frequencies 
SET pashto_word = 'قاتِله' 
WHERE id = 40041 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قاتِله' 
    AND wf2.id != 40041
);
UPDATE word_frequencies 
SET pashto_word = 'قادش' 
WHERE id = 31443 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قادش' 
    AND wf2.id != 31443
);
UPDATE word_frequencies 
SET pashto_word = 'قادِس' 
WHERE id = 23294 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قادِس' 
    AND wf2.id != 23294
);
UPDATE word_frequencies 
SET pashto_word = 'قاضيان' 
WHERE id = 35291 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قاضيان' 
    AND wf2.id != 35291
);
UPDATE word_frequencies 
SET pashto_word = 'قایموى' 
WHERE id = 41701 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قایموى' 
    AND wf2.id != 41701
);
UPDATE word_frequencies 
SET pashto_word = 'قبلوم' 
WHERE id = 22787 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبلوم' 
    AND wf2.id != 22787
);
UPDATE word_frequencies 
SET pashto_word = 'قبلوى' 
WHERE id = 21358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبلوى' 
    AND wf2.id != 21358
);
UPDATE word_frequencies 
SET pashto_word = 'قبلوې' 
WHERE id = 40199 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبلوې' 
    AND wf2.id != 40199
);
UPDATE word_frequencies 
SET pashto_word = 'قبيله' 
WHERE id = 28743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبيله' 
    AND wf2.id != 28743
);
UPDATE word_frequencies 
SET pashto_word = 'قبيلې' 
WHERE id = 39654 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبيلې' 
    AND wf2.id != 39654
);
UPDATE word_frequencies 
SET pashto_word = 'قبیلو' 
WHERE id = 34594 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبیلو' 
    AND wf2.id != 34594
);
UPDATE word_frequencies 
SET pashto_word = 'قبیلې' 
WHERE id = 25264 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قبیلې' 
    AND wf2.id != 25264
);
UPDATE word_frequencies 
SET pashto_word = 'قتل' 
WHERE id = 22665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قتل' 
    AND wf2.id != 22665
);
UPDATE word_frequencies 
SET pashto_word = 'قتلوه' 
WHERE id = 35274 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قتلوه' 
    AND wf2.id != 35274
);
UPDATE word_frequencies 
SET pashto_word = 'قتلوى' 
WHERE id = 38955 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قتلوى' 
    AND wf2.id != 38955
);
UPDATE word_frequencies 
SET pashto_word = 'قحط' 
WHERE id = 24134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قحط' 
    AND wf2.id != 24134
);
UPDATE word_frequencies 
SET pashto_word = 'قدرت' 
WHERE id = 19744 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قدرت' 
    AND wf2.id != 19744
);
UPDATE word_frequencies 
SET pashto_word = 'قدمى‌اېل' 
WHERE id = 32684 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قدمى‌اېل' 
    AND wf2.id != 32684
);
UPDATE word_frequencies 
SET pashto_word = 'قربانوم' 
WHERE id = 29603 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قربانوم' 
    AND wf2.id != 29603
);
UPDATE word_frequencies 
SET pashto_word = 'قربانۍ' 
WHERE id = 23566 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قربانۍ' 
    AND wf2.id != 23566
);
UPDATE word_frequencies 
SET pashto_word = 'قربان‌ګاه' 
WHERE id = 20732 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قربان‌ګاه' 
    AND wf2.id != 20732
);
UPDATE word_frequencies 
SET pashto_word = 'قریتایم' 
WHERE id = 37601 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قریتایم' 
    AND wf2.id != 37601
);
UPDATE word_frequencies 
SET pashto_word = 'قشیون' 
WHERE id = 37671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قشیون' 
    AND wf2.id != 37671
);
UPDATE word_frequencies 
SET pashto_word = 'قلبې' 
WHERE id = 37252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قلبې' 
    AND wf2.id != 37252
);
UPDATE word_frequencies 
SET pashto_word = 'قميصونو' 
WHERE id = 35296 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قميصونو' 
    AND wf2.id != 35296
);
UPDATE word_frequencies 
SET pashto_word = 'قناز' 
WHERE id = 36063 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قناز' 
    AND wf2.id != 36063
);
UPDATE word_frequencies 
SET pashto_word = 'قنز' 
WHERE id = 39145 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قنز' 
    AND wf2.id != 39145
);
UPDATE word_frequencies 
SET pashto_word = 'قهر' 
WHERE id = 22492 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قهر' 
    AND wf2.id != 22492
);
UPDATE word_frequencies 
SET pashto_word = 'قوت' 
WHERE id = 36309 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قوت' 
    AND wf2.id != 36309
);
UPDATE word_frequencies 
SET pashto_word = 'قورح' 
WHERE id = 31965 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قورح' 
    AND wf2.id != 31965
);
UPDATE word_frequencies 
SET pashto_word = 'قوم' 
WHERE id = 17929 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قوم' 
    AND wf2.id != 17929
);
UPDATE word_frequencies 
SET pashto_word = 'قوماندان' 
WHERE id = 34976 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قوماندان' 
    AND wf2.id != 34976
);
UPDATE word_frequencies 
SET pashto_word = 'قوماندانان' 
WHERE id = 30230 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قوماندانان' 
    AND wf2.id != 30230
);
UPDATE word_frequencies 
SET pashto_word = 'قومندانانو' 
WHERE id = 34629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قومندانانو' 
    AND wf2.id != 34629
);
UPDATE word_frequencies 
SET pashto_word = 'قومه' 
WHERE id = 26792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قومه' 
    AND wf2.id != 26792
);
UPDATE word_frequencies 
SET pashto_word = 'قومونه' 
WHERE id = 34607 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قومونه' 
    AND wf2.id != 34607
);
UPDATE word_frequencies 
SET pashto_word = 'قومونو' 
WHERE id = 16062 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قومونو' 
    AND wf2.id != 16062
);
UPDATE word_frequencies 
SET pashto_word = 'قوي' 
WHERE id = 30946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قوي' 
    AND wf2.id != 30946
);
UPDATE word_frequencies 
SET pashto_word = 'قيدار' 
WHERE id = 39077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قيدار' 
    AND wf2.id != 39077
);
UPDATE word_frequencies 
SET pashto_word = 'قيس' 
WHERE id = 40340 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قيس' 
    AND wf2.id != 40340
);
UPDATE word_frequencies 
SET pashto_word = 'قُدوس' 
WHERE id = 10540 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قُدوس' 
    AND wf2.id != 10540
);
UPDATE word_frequencies 
SET pashto_word = 'قِدمه' 
WHERE id = 39084 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قِدمه' 
    AND wf2.id != 39084
);
UPDATE word_frequencies 
SET pashto_word = 'قِريَتایم' 
WHERE id = 41525 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قِريَتایم' 
    AND wf2.id != 41525
);
UPDATE word_frequencies 
SET pashto_word = 'قِسيون' 
WHERE id = 39767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قِسيون' 
    AND wf2.id != 39767
);
UPDATE word_frequencies 
SET pashto_word = 'قچر' 
WHERE id = 40120 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قچر' 
    AND wf2.id != 40120
);
UPDATE word_frequencies 
SET pashto_word = 'قچرو' 
WHERE id = 27914 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قچرو' 
    AND wf2.id != 27914
);
UPDATE word_frequencies 
SET pashto_word = 'قېديانو' 
WHERE id = 28532 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'قېديانو' 
    AND wf2.id != 28532
);
UPDATE word_frequencies 
SET pashto_word = 'لاخیش' 
WHERE id = 30198 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاخیش' 
    AND wf2.id != 30198
);
UPDATE word_frequencies 
SET pashto_word = 'لارښودنو' 
WHERE id = 36960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لارښودنو' 
    AND wf2.id != 36960
);
UPDATE word_frequencies 
SET pashto_word = 'لارښوونکو' 
WHERE id = 34494 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لارښوونکو' 
    AND wf2.id != 34494
);
UPDATE word_frequencies 
SET pashto_word = 'لارې' 
WHERE id = 38000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لارې' 
    AND wf2.id != 38000
);
UPDATE word_frequencies 
SET pashto_word = 'لاس' 
WHERE id = 25809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاس' 
    AND wf2.id != 25809
);
UPDATE word_frequencies 
SET pashto_word = 'لاسه' 
WHERE id = 34615 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاسه' 
    AND wf2.id != 34615
);
UPDATE word_frequencies 
SET pashto_word = 'لاندې' 
WHERE id = 25258 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاندې' 
    AND wf2.id != 25258
);
UPDATE word_frequencies 
SET pashto_word = 'لاویان' 
WHERE id = 38019 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاویان' 
    AND wf2.id != 38019
);
UPDATE word_frequencies 
SET pashto_word = 'لاویانو' 
WHERE id = 21821 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاویانو' 
    AND wf2.id != 21821
);
UPDATE word_frequencies 
SET pashto_word = 'لاړ' 
WHERE id = 13314 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړ' 
    AND wf2.id != 13314
);
UPDATE word_frequencies 
SET pashto_word = 'لاړل' 
WHERE id = 12359 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړل' 
    AND wf2.id != 12359
);
UPDATE word_frequencies 
SET pashto_word = 'لاړلې' 
WHERE id = 21052 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړلې' 
    AND wf2.id != 21052
);
UPDATE word_frequencies 
SET pashto_word = 'لاړم' 
WHERE id = 18936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړم' 
    AND wf2.id != 18936
);
UPDATE word_frequencies 
SET pashto_word = 'لاړمه' 
WHERE id = 38753 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړمه' 
    AND wf2.id != 38753
);
UPDATE word_frequencies 
SET pashto_word = 'لاړه' 
WHERE id = 16811 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړه' 
    AND wf2.id != 16811
);
UPDATE word_frequencies 
SET pashto_word = 'لاړو' 
WHERE id = 12497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړو' 
    AND wf2.id != 12497
);
UPDATE word_frequencies 
SET pashto_word = 'لاړونه' 
WHERE id = 38738 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړونه' 
    AND wf2.id != 38738
);
UPDATE word_frequencies 
SET pashto_word = 'لاړُو' 
WHERE id = 32359 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړُو' 
    AND wf2.id != 32359
);
UPDATE word_frequencies 
SET pashto_word = 'لاړی' 
WHERE id = 41669 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړی' 
    AND wf2.id != 41669
);
UPDATE word_frequencies 
SET pashto_word = 'لاړې' 
WHERE id = 25144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لاړې' 
    AND wf2.id != 25144
);
UPDATE word_frequencies 
SET pashto_word = 'لبنانه' 
WHERE id = 38811 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لبنانه' 
    AND wf2.id != 38811
);
UPDATE word_frequencies 
SET pashto_word = 'لبنه' 
WHERE id = 31442 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لبنه' 
    AND wf2.id != 31442
);
UPDATE word_frequencies 
SET pashto_word = 'لختى' 
WHERE id = 36570 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لختى' 
    AND wf2.id != 36570
);
UPDATE word_frequencies 
SET pashto_word = 'لرل' 
WHERE id = 17951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرل' 
    AND wf2.id != 17951
);
UPDATE word_frequencies 
SET pashto_word = 'لرله' 
WHERE id = 20907 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرله' 
    AND wf2.id != 20907
);
UPDATE word_frequencies 
SET pashto_word = 'لرلو' 
WHERE id = 24554 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرلو' 
    AND wf2.id != 24554
);
UPDATE word_frequencies 
SET pashto_word = 'لرلی' 
WHERE id = 42137 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرلی' 
    AND wf2.id != 42137
);
UPDATE word_frequencies 
SET pashto_word = 'لرلې' 
WHERE id = 17481 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرلې' 
    AND wf2.id != 17481
);
UPDATE word_frequencies 
SET pashto_word = 'لرم' 
WHERE id = 30345 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرم' 
    AND wf2.id != 30345
);
UPDATE word_frequencies 
SET pashto_word = 'لرو' 
WHERE id = 22508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرو' 
    AND wf2.id != 22508
);
UPDATE word_frequencies 
SET pashto_word = 'لرى' 
WHERE id = 23083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرى' 
    AND wf2.id != 23083
);
UPDATE word_frequencies 
SET pashto_word = 'لري' 
WHERE id = 29989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لري' 
    AND wf2.id != 29989
);
UPDATE word_frequencies 
SET pashto_word = 'لرينه' 
WHERE id = 38736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرينه' 
    AND wf2.id != 38736
);
UPDATE word_frequencies 
SET pashto_word = 'لرګی' 
WHERE id = 40708 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرګی' 
    AND wf2.id != 40708
);
UPDATE word_frequencies 
SET pashto_word = 'لرګیو' 
WHERE id = 34612 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرګیو' 
    AND wf2.id != 34612
);
UPDATE word_frequencies 
SET pashto_word = 'لری' 
WHERE id = 40531 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لری' 
    AND wf2.id != 40531
);
UPDATE word_frequencies 
SET pashto_word = 'لرې' 
WHERE id = 22391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لرې' 
    AND wf2.id != 22391
);
UPDATE word_frequencies 
SET pashto_word = 'لسو' 
WHERE id = 39295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لسو' 
    AND wf2.id != 39295
);
UPDATE word_frequencies 
SET pashto_word = 'لعنت' 
WHERE id = 25839 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لعنت' 
    AND wf2.id != 25839
);
UPDATE word_frequencies 
SET pashto_word = 'لم' 
WHERE id = 32112 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لم' 
    AND wf2.id != 32112
);
UPDATE word_frequencies 
SET pashto_word = 'لمانځي' 
WHERE id = 31593 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمانځي' 
    AND wf2.id != 31593
);
UPDATE word_frequencies 
SET pashto_word = 'لمانځی' 
WHERE id = 41624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمانځی' 
    AND wf2.id != 41624
);
UPDATE word_frequencies 
SET pashto_word = 'لمبې' 
WHERE id = 29554 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمبې' 
    AND wf2.id != 29554
);
UPDATE word_frequencies 
SET pashto_word = 'لمر' 
WHERE id = 22539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمر' 
    AND wf2.id != 22539
);
UPDATE word_frequencies 
SET pashto_word = 'لمسولم' 
WHERE id = 37329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمسولم' 
    AND wf2.id != 37329
);
UPDATE word_frequencies 
SET pashto_word = 'لمنو' 
WHERE id = 35457 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمنو' 
    AND wf2.id != 35457
);
UPDATE word_frequencies 
SET pashto_word = 'لمنې' 
WHERE id = 23830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لمنې' 
    AND wf2.id != 23830
);
UPDATE word_frequencies 
SET pashto_word = 'له' 
WHERE id = 23356 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'له' 
    AND wf2.id != 23356
);
UPDATE word_frequencies 
SET pashto_word = 'لهابى' 
WHERE id = 38978 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لهابى' 
    AND wf2.id != 38978
);
UPDATE word_frequencies 
SET pashto_word = 'لوبیا' 
WHERE id = 30381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوبیا' 
    AND wf2.id != 30381
);
UPDATE word_frequencies 
SET pashto_word = 'لوتان' 
WHERE id = 25657 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوتان' 
    AND wf2.id != 25657
);
UPDATE word_frequencies 
SET pashto_word = 'لودى' 
WHERE id = 38976 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لودى' 
    AND wf2.id != 38976
);
UPDATE word_frequencies 
SET pashto_word = 'لور' 
WHERE id = 30848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لور' 
    AND wf2.id != 30848
);
UPDATE word_frequencies 
SET pashto_word = 'لورګانو' 
WHERE id = 38608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لورګانو' 
    AND wf2.id != 38608
);
UPDATE word_frequencies 
SET pashto_word = 'لورګانې' 
WHERE id = 35571 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لورګانې' 
    AND wf2.id != 35571
);
UPDATE word_frequencies 
SET pashto_word = 'لورې' 
WHERE id = 20157 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لورې' 
    AND wf2.id != 20157
);
UPDATE word_frequencies 
SET pashto_word = 'لوستله' 
WHERE id = 28364 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوستله' 
    AND wf2.id != 28364
);
UPDATE word_frequencies 
SET pashto_word = 'لوستلي' 
WHERE id = 29910 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوستلي' 
    AND wf2.id != 29910
);
UPDATE word_frequencies 
SET pashto_word = 'لوط' 
WHERE id = 31896 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوط' 
    AND wf2.id != 31896
);
UPDATE word_frequencies 
SET pashto_word = 'لوظ' 
WHERE id = 30409 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوظ' 
    AND wf2.id != 30409
);
UPDATE word_frequencies 
SET pashto_word = 'لويوالی' 
WHERE id = 41886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لويوالی' 
    AND wf2.id != 41886
);
UPDATE word_frequencies 
SET pashto_word = 'لوږه' 
WHERE id = 30171 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوږه' 
    AND wf2.id != 30171
);
UPDATE word_frequencies 
SET pashto_word = 'لوښى' 
WHERE id = 39384 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوښى' 
    AND wf2.id != 39384
);
UPDATE word_frequencies 
SET pashto_word = 'لوښی' 
WHERE id = 40650 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوښی' 
    AND wf2.id != 40650
);
UPDATE word_frequencies 
SET pashto_word = 'لوڼه' 
WHERE id = 23012 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوڼه' 
    AND wf2.id != 23012
);
UPDATE word_frequencies 
SET pashto_word = 'لوڼو' 
WHERE id = 28844 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوڼو' 
    AND wf2.id != 28844
);
UPDATE word_frequencies 
SET pashto_word = 'لویى' 
WHERE id = 41273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لویى' 
    AND wf2.id != 41273
);
UPDATE word_frequencies 
SET pashto_word = 'لویي' 
WHERE id = 33922 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لویي' 
    AND wf2.id != 33922
);
UPDATE word_frequencies 
SET pashto_word = 'لویيږى' 
WHERE id = 41779 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لویيږى' 
    AND wf2.id != 41779
);
UPDATE word_frequencies 
SET pashto_word = 'لویږي' 
WHERE id = 34363 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لویږي' 
    AND wf2.id != 34363
);
UPDATE word_frequencies 
SET pashto_word = 'لوییږي' 
WHERE id = 33963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لوییږي' 
    AND wf2.id != 33963
);
UPDATE word_frequencies 
SET pashto_word = 'ليبيا' 
WHERE id = 28095 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليبيا' 
    AND wf2.id != 28095
);
UPDATE word_frequencies 
SET pashto_word = 'ليدلو' 
WHERE id = 28164 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليدلو' 
    AND wf2.id != 28164
);
UPDATE word_frequencies 
SET pashto_word = 'ليدلې' 
WHERE id = 31340 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليدلې' 
    AND wf2.id != 31340
);
UPDATE word_frequencies 
SET pashto_word = 'ليده' 
WHERE id = 35213 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليده' 
    AND wf2.id != 35213
);
UPDATE word_frequencies 
SET pashto_word = 'ليدو' 
WHERE id = 31874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليدو' 
    AND wf2.id != 31874
);
UPDATE word_frequencies 
SET pashto_word = 'ليدونکيه' 
WHERE id = 37505 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليدونکيه' 
    AND wf2.id != 37505
);
UPDATE word_frequencies 
SET pashto_word = 'ليوى' 
WHERE id = 40323 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليوى' 
    AND wf2.id != 40323
);
UPDATE word_frequencies 
SET pashto_word = 'ليويان' 
WHERE id = 32675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليويان' 
    AND wf2.id != 32675
);
UPDATE word_frequencies 
SET pashto_word = 'ليويانو' 
WHERE id = 22264 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليويانو' 
    AND wf2.id != 22264
);
UPDATE word_frequencies 
SET pashto_word = 'ليکم' 
WHERE id = 33119 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليکم' 
    AND wf2.id != 33119
);
UPDATE word_frequencies 
SET pashto_word = 'ليکې' 
WHERE id = 37203 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ليکې' 
    AND wf2.id != 37203
);
UPDATE word_frequencies 
SET pashto_word = 'لِباس' 
WHERE id = 39417 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لِباس' 
    AND wf2.id != 39417
);
UPDATE word_frequencies 
SET pashto_word = 'لِبناه' 
WHERE id = 32293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لِبناه' 
    AND wf2.id != 32293
);
UPDATE word_frequencies 
SET pashto_word = 'لِبنى' 
WHERE id = 32210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لِبنى' 
    AND wf2.id != 32210
);
UPDATE word_frequencies 
SET pashto_word = 'لټول' 
WHERE id = 39912 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټول' 
    AND wf2.id != 39912
);
UPDATE word_frequencies 
SET pashto_word = 'لټولم' 
WHERE id = 34144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټولم' 
    AND wf2.id != 34144
);
UPDATE word_frequencies 
SET pashto_word = 'لټوله' 
WHERE id = 39843 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوله' 
    AND wf2.id != 39843
);
UPDATE word_frequencies 
SET pashto_word = 'لټولی' 
WHERE id = 42017 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټولی' 
    AND wf2.id != 42017
);
UPDATE word_frequencies 
SET pashto_word = 'لټوم' 
WHERE id = 29729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوم' 
    AND wf2.id != 29729
);
UPDATE word_frequencies 
SET pashto_word = 'لټوى' 
WHERE id = 24292 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوى' 
    AND wf2.id != 24292
);
UPDATE word_frequencies 
SET pashto_word = 'لټوي' 
WHERE id = 23570 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوي' 
    AND wf2.id != 23570
);
UPDATE word_frequencies 
SET pashto_word = 'لټوی' 
WHERE id = 41614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوی' 
    AND wf2.id != 41614
);
UPDATE word_frequencies 
SET pashto_word = 'لټوې' 
WHERE id = 24257 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لټوې' 
    AND wf2.id != 24257
);
UPDATE word_frequencies 
SET pashto_word = 'لړزيږى' 
WHERE id = 23059 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لړزيږى' 
    AND wf2.id != 23059
);
UPDATE word_frequencies 
SET pashto_word = 'لښکر' 
WHERE id = 21939 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لښکر' 
    AND wf2.id != 21939
);
UPDATE word_frequencies 
SET pashto_word = 'لښکرو' 
WHERE id = 25625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لښکرو' 
    AND wf2.id != 25625
);
UPDATE word_frequencies 
SET pashto_word = 'لکيس' 
WHERE id = 32291 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لکيس' 
    AND wf2.id != 32291
);
UPDATE word_frequencies 
SET pashto_word = 'لګولو' 
WHERE id = 37357 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګولو' 
    AND wf2.id != 37357
);
UPDATE word_frequencies 
SET pashto_word = 'لګولی' 
WHERE id = 42007 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګولی' 
    AND wf2.id != 42007
);
UPDATE word_frequencies 
SET pashto_word = 'لګولې' 
WHERE id = 32223 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګولې' 
    AND wf2.id != 32223
);
UPDATE word_frequencies 
SET pashto_word = 'لګوم' 
WHERE id = 32756 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګوم' 
    AND wf2.id != 32756
);
UPDATE word_frequencies 
SET pashto_word = 'لګوه' 
WHERE id = 28403 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګوه' 
    AND wf2.id != 28403
);
UPDATE word_frequencies 
SET pashto_word = 'لګوی' 
WHERE id = 40660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګوی' 
    AND wf2.id != 40660
);
UPDATE word_frequencies 
SET pashto_word = 'لګوې' 
WHERE id = 37365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګوې' 
    AND wf2.id != 37365
);
UPDATE word_frequencies 
SET pashto_word = 'لګى' 
WHERE id = 14490 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګى' 
    AND wf2.id != 14490
);
UPDATE word_frequencies 
SET pashto_word = 'لګيږى' 
WHERE id = 22984 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګيږى' 
    AND wf2.id != 22984
);
UPDATE word_frequencies 
SET pashto_word = 'لګيږينه' 
WHERE id = 38646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګيږينه' 
    AND wf2.id != 38646
);
UPDATE word_frequencies 
SET pashto_word = 'لګیږي' 
WHERE id = 17690 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګیږي' 
    AND wf2.id != 17690
);
UPDATE word_frequencies 
SET pashto_word = 'لګېدل' 
WHERE id = 32481 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګېدل' 
    AND wf2.id != 32481
);
UPDATE word_frequencies 
SET pashto_word = 'لګېدلې' 
WHERE id = 27397 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګېدلې' 
    AND wf2.id != 27397
);
UPDATE word_frequencies 
SET pashto_word = 'لګېده' 
WHERE id = 22463 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګېده' 
    AND wf2.id != 22463
);
UPDATE word_frequencies 
SET pashto_word = 'لګېدو' 
WHERE id = 26196 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګېدو' 
    AND wf2.id != 26196
);
UPDATE word_frequencies 
SET pashto_word = 'لګېدې' 
WHERE id = 28206 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لګېدې' 
    AND wf2.id != 28206
);
UPDATE word_frequencies 
SET pashto_word = 'لیدل' 
WHERE id = 24948 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیدل' 
    AND wf2.id != 24948
);
UPDATE word_frequencies 
SET pashto_word = 'لیدله' 
WHERE id = 33665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیدله' 
    AND wf2.id != 33665
);
UPDATE word_frequencies 
SET pashto_word = 'لیدلی' 
WHERE id = 24782 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیدلی' 
    AND wf2.id != 24782
);
UPDATE word_frequencies 
SET pashto_word = 'لیدلې' 
WHERE id = 34054 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیدلې' 
    AND wf2.id != 34054
);
UPDATE word_frequencies 
SET pashto_word = 'لیده' 
WHERE id = 29460 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیده' 
    AND wf2.id != 29460
);
UPDATE word_frequencies 
SET pashto_word = 'لیندو' 
WHERE id = 35892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیندو' 
    AND wf2.id != 35892
);
UPDATE word_frequencies 
SET pashto_word = 'لیکم' 
WHERE id = 29241 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیکم' 
    AND wf2.id != 29241
);
UPDATE word_frequencies 
SET pashto_word = 'لیکي' 
WHERE id = 35489 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لیکي' 
    AND wf2.id != 35489
);
UPDATE word_frequencies 
SET pashto_word = 'لېږلى' 
WHERE id = 36671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږلى' 
    AND wf2.id != 36671
);
UPDATE word_frequencies 
SET pashto_word = 'لېږم' 
WHERE id = 26993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږم' 
    AND wf2.id != 26993
);
UPDATE word_frequencies 
SET pashto_word = 'لېږه' 
WHERE id = 31187 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږه' 
    AND wf2.id != 31187
);
UPDATE word_frequencies 
SET pashto_word = 'لېږى' 
WHERE id = 39127 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږى' 
    AND wf2.id != 39127
);
UPDATE word_frequencies 
SET pashto_word = 'لېږی' 
WHERE id = 41342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږی' 
    AND wf2.id != 41342
);
UPDATE word_frequencies 
SET pashto_word = 'لېږې' 
WHERE id = 28071 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'لېږې' 
    AND wf2.id != 28071
);
UPDATE word_frequencies 
SET pashto_word = 'ما' 
WHERE id = 37046 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ما' 
    AND wf2.id != 37046
);
UPDATE word_frequencies 
SET pashto_word = 'ماته' 
WHERE id = 27423 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماته' 
    AND wf2.id != 27423
);
UPDATE word_frequencies 
SET pashto_word = 'ماتوه' 
WHERE id = 36560 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماتوه' 
    AND wf2.id != 36560
);
UPDATE word_frequencies 
SET pashto_word = 'ماتوى' 
WHERE id = 20125 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماتوى' 
    AND wf2.id != 20125
);
UPDATE word_frequencies 
SET pashto_word = 'ماتوي' 
WHERE id = 27912 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماتوي' 
    AND wf2.id != 27912
);
UPDATE word_frequencies 
SET pashto_word = 'ماتوی' 
WHERE id = 41908 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماتوی' 
    AND wf2.id != 41908
);
UPDATE word_frequencies 
SET pashto_word = 'ماجوج' 
WHERE id = 31888 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماجوج' 
    AND wf2.id != 31888
);
UPDATE word_frequencies 
SET pashto_word = 'مادى' 
WHERE id = 38958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مادى' 
    AND wf2.id != 38958
);
UPDATE word_frequencies 
SET pashto_word = 'مار' 
WHERE id = 28641 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مار' 
    AND wf2.id != 28641
);
UPDATE word_frequencies 
SET pashto_word = 'مارغان' 
WHERE id = 26164 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مارغان' 
    AND wf2.id != 26164
);
UPDATE word_frequencies 
SET pashto_word = 'مارغانو' 
WHERE id = 31884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مارغانو' 
    AND wf2.id != 31884
);
UPDATE word_frequencies 
SET pashto_word = 'مارغۀ' 
WHERE id = 39437 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مارغۀ' 
    AND wf2.id != 39437
);
UPDATE word_frequencies 
SET pashto_word = 'ماشومان' 
WHERE id = 19552 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماشومان' 
    AND wf2.id != 19552
);
UPDATE word_frequencies 
SET pashto_word = 'مال' 
WHERE id = 35624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مال' 
    AND wf2.id != 35624
);
UPDATE word_frequencies 
SET pashto_word = 'مالِک' 
WHERE id = 32743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مالِک' 
    AND wf2.id != 32743
);
UPDATE word_frequencies 
SET pashto_word = 'مالِکان' 
WHERE id = 39785 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مالِکان' 
    AND wf2.id != 39785
);
UPDATE word_frequencies 
SET pashto_word = 'مالِکانو' 
WHERE id = 33122 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مالِکانو' 
    AND wf2.id != 33122
);
UPDATE word_frequencies 
SET pashto_word = 'مالِکه' 
WHERE id = 36656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مالِکه' 
    AND wf2.id != 36656
);
UPDATE word_frequencies 
SET pashto_word = 'مالګه' 
WHERE id = 36013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مالګه' 
    AND wf2.id != 36013
);
UPDATE word_frequencies 
SET pashto_word = 'مامورینو' 
WHERE id = 30275 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مامورینو' 
    AND wf2.id != 30275
);
UPDATE word_frequencies 
SET pashto_word = 'مانځی' 
WHERE id = 42126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مانځی' 
    AND wf2.id != 42126
);
UPDATE word_frequencies 
SET pashto_word = 'ماښام' 
WHERE id = 30234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ماښام' 
    AND wf2.id != 30234
);
UPDATE word_frequencies 
SET pashto_word = 'مایيل' 
WHERE id = 41805 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مایيل' 
    AND wf2.id != 41805
);
UPDATE word_frequencies 
SET pashto_word = 'متتياه' 
WHERE id = 24662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متتياه' 
    AND wf2.id != 24662
);
UPDATE word_frequencies 
SET pashto_word = 'متتیا' 
WHERE id = 35988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متتیا' 
    AND wf2.id != 35988
);
UPDATE word_frequencies 
SET pashto_word = 'متنياه' 
WHERE id = 24664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متنياه' 
    AND wf2.id != 24664
);
UPDATE word_frequencies 
SET pashto_word = 'متنیا' 
WHERE id = 27797 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متنیا' 
    AND wf2.id != 27797
);
UPDATE word_frequencies 
SET pashto_word = 'متی' 
WHERE id = 40811 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'متی' 
    AND wf2.id != 40811
);
UPDATE word_frequencies 
SET pashto_word = 'مجبورول' 
WHERE id = 37775 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مجبورول' 
    AND wf2.id != 37775
);
UPDATE word_frequencies 
SET pashto_word = 'مجبوروى' 
WHERE id = 28217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مجبوروى' 
    AND wf2.id != 28217
);
UPDATE word_frequencies 
SET pashto_word = 'مجدال' 
WHERE id = 28079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مجدال' 
    AND wf2.id != 28079
);
UPDATE word_frequencies 
SET pashto_word = 'مجدلیه' 
WHERE id = 34129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مجدلیه' 
    AND wf2.id != 34129
);
UPDATE word_frequencies 
SET pashto_word = 'محبوبې' 
WHERE id = 16121 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محبوبې' 
    AND wf2.id != 16121
);
UPDATE word_frequencies 
SET pashto_word = 'محت' 
WHERE id = 40322 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محت' 
    AND wf2.id != 40322
);
UPDATE word_frequencies 
SET pashto_word = 'محروموى' 
WHERE id = 37891 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محروموى' 
    AND wf2.id != 37891
);
UPDATE word_frequencies 
SET pashto_word = 'محسوسيږى' 
WHERE id = 37218 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محسوسيږى' 
    AND wf2.id != 37218
);
UPDATE word_frequencies 
SET pashto_word = 'محل' 
WHERE id = 32037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محل' 
    AND wf2.id != 32037
);
UPDATE word_frequencies 
SET pashto_word = 'محلاه' 
WHERE id = 32204 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محلاه' 
    AND wf2.id != 32204
);
UPDATE word_frequencies 
SET pashto_word = 'محله' 
WHERE id = 37651 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محله' 
    AND wf2.id != 37651
);
UPDATE word_frequencies 
SET pashto_word = 'محلی' 
WHERE id = 40428 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محلی' 
    AND wf2.id != 40428
);
UPDATE word_frequencies 
SET pashto_word = 'محنايم' 
WHERE id = 39783 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'محنايم' 
    AND wf2.id != 39783
);
UPDATE word_frequencies 
SET pashto_word = 'مخامخ' 
WHERE id = 38156 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخامخ' 
    AND wf2.id != 38156
);
UPDATE word_frequencies 
SET pashto_word = 'مخلوق' 
WHERE id = 28905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخلوق' 
    AND wf2.id != 28905
);
UPDATE word_frequencies 
SET pashto_word = 'مخلوقاتو' 
WHERE id = 9087 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخلوقاتو' 
    AND wf2.id != 9087
);
UPDATE word_frequencies 
SET pashto_word = 'مخلوقه' 
WHERE id = 27767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخلوقه' 
    AND wf2.id != 27767
);
UPDATE word_frequencies 
SET pashto_word = 'مخکښې' 
WHERE id = 19178 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخکښې' 
    AND wf2.id != 19178
);
UPDATE word_frequencies 
SET pashto_word = 'مخکې' 
WHERE id = 35917 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مخکې' 
    AND wf2.id != 35917
);
UPDATE word_frequencies 
SET pashto_word = 'مدام' 
WHERE id = 32711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مدام' 
    AND wf2.id != 32711
);
UPDATE word_frequencies 
SET pashto_word = 'مدمنه' 
WHERE id = 37625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مدمنه' 
    AND wf2.id != 37625
);
UPDATE word_frequencies 
SET pashto_word = 'مدیانیان' 
WHERE id = 31496 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مدیانیان' 
    AND wf2.id != 31496
);
UPDATE word_frequencies 
SET pashto_word = 'مرارى' 
WHERE id = 26236 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرارى' 
    AND wf2.id != 26236
);
UPDATE word_frequencies 
SET pashto_word = 'مرایوت' 
WHERE id = 10664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرایوت' 
    AND wf2.id != 10664
);
UPDATE word_frequencies 
SET pashto_word = 'مرتا' 
WHERE id = 26922 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرتا' 
    AND wf2.id != 26922
);
UPDATE word_frequencies 
SET pashto_word = 'مردخای' 
WHERE id = 35993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مردخای' 
    AND wf2.id != 35993
);
UPDATE word_frequencies 
SET pashto_word = 'مرس' 
WHERE id = 35644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرس' 
    AND wf2.id != 35644
);
UPDATE word_frequencies 
SET pashto_word = 'مرغان' 
WHERE id = 33721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرغان' 
    AND wf2.id != 33721
);
UPDATE word_frequencies 
SET pashto_word = 'مرغانو' 
WHERE id = 30151 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرغانو' 
    AND wf2.id != 30151
);
UPDATE word_frequencies 
SET pashto_word = 'مرم' 
WHERE id = 28594 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرم' 
    AND wf2.id != 28594
);
UPDATE word_frequencies 
SET pashto_word = 'مرون' 
WHERE id = 37592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرون' 
    AND wf2.id != 37592
);
UPDATE word_frequencies 
SET pashto_word = 'مروړلو' 
WHERE id = 37910 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مروړلو' 
    AND wf2.id != 37910
);
UPDATE word_frequencies 
SET pashto_word = 'مرى' 
WHERE id = 19687 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرى' 
    AND wf2.id != 19687
);
UPDATE word_frequencies 
SET pashto_word = 'مريسه' 
WHERE id = 39744 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مريسه' 
    AND wf2.id != 39744
);
UPDATE word_frequencies 
SET pashto_word = 'مريم' 
WHERE id = 39280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مريم' 
    AND wf2.id != 39280
);
UPDATE word_frequencies 
SET pashto_word = 'مرکبوت' 
WHERE id = 9626 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرکبوت' 
    AND wf2.id != 9626
);
UPDATE word_frequencies 
SET pashto_word = 'مرګ' 
WHERE id = 21783 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرګ' 
    AND wf2.id != 21783
);
UPDATE word_frequencies 
SET pashto_word = 'مرګه' 
WHERE id = 27830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرګه' 
    AND wf2.id != 27830
);
UPDATE word_frequencies 
SET pashto_word = 'مری' 
WHERE id = 40800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مری' 
    AND wf2.id != 40800
);
UPDATE word_frequencies 
SET pashto_word = 'مریمې' 
WHERE id = 34057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مریمې' 
    AND wf2.id != 34057
);
UPDATE word_frequencies 
SET pashto_word = 'مرې' 
WHERE id = 40019 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مرې' 
    AND wf2.id != 40019
);
UPDATE word_frequencies 
SET pashto_word = 'مزه' 
WHERE id = 36065 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مزه' 
    AND wf2.id != 36065
);
UPDATE word_frequencies 
SET pashto_word = 'مسا' 
WHERE id = 39081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسا' 
    AND wf2.id != 39081
);
UPDATE word_frequencies 
SET pashto_word = 'مسافر' 
WHERE id = 25240 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسافر' 
    AND wf2.id != 25240
);
UPDATE word_frequencies 
SET pashto_word = 'مسافران' 
WHERE id = 34616 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسافران' 
    AND wf2.id != 34616
);
UPDATE word_frequencies 
SET pashto_word = 'مسافرو' 
WHERE id = 20577 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسافرو' 
    AND wf2.id != 20577
);
UPDATE word_frequencies 
SET pashto_word = 'مستۍ' 
WHERE id = 33052 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مستۍ' 
    AND wf2.id != 33052
);
UPDATE word_frequencies 
SET pashto_word = 'مستې' 
WHERE id = 35065 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مستې' 
    AND wf2.id != 35065
);
UPDATE word_frequencies 
SET pashto_word = 'مسلام' 
WHERE id = 26483 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسلام' 
    AND wf2.id != 26483
);
UPDATE word_frequencies 
SET pashto_word = 'مسيح' 
WHERE id = 33100 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسيح' 
    AND wf2.id != 33100
);
UPDATE word_frequencies 
SET pashto_word = 'مسیح' 
WHERE id = 34307 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مسیح' 
    AND wf2.id != 34307
);
UPDATE word_frequencies 
SET pashto_word = 'مشاور' 
WHERE id = 28060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشاور' 
    AND wf2.id != 28060
);
UPDATE word_frequencies 
SET pashto_word = 'مشر' 
WHERE id = 23933 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشر' 
    AND wf2.id != 23933
);
UPDATE word_frequencies 
SET pashto_word = 'مشران' 
WHERE id = 15271 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشران' 
    AND wf2.id != 15271
);
UPDATE word_frequencies 
SET pashto_word = 'مشرانو' 
WHERE id = 15371 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشرانو' 
    AND wf2.id != 15371
);
UPDATE word_frequencies 
SET pashto_word = 'مشلام' 
WHERE id = 35984 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشلام' 
    AND wf2.id != 35984
);
UPDATE word_frequencies 
SET pashto_word = 'مشيران' 
WHERE id = 25467 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشيران' 
    AND wf2.id != 25467
);
UPDATE word_frequencies 
SET pashto_word = 'مشيرانو' 
WHERE id = 35288 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشيرانو' 
    AND wf2.id != 35288
);
UPDATE word_frequencies 
SET pashto_word = 'مشکو' 
WHERE id = 38698 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مشکو' 
    AND wf2.id != 38698
);
UPDATE word_frequencies 
SET pashto_word = 'مصالحه' 
WHERE id = 39358 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصالحه' 
    AND wf2.id != 39358
);
UPDATE word_frequencies 
SET pashto_word = 'مصالحو' 
WHERE id = 28909 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصالحو' 
    AND wf2.id != 28909
);
UPDATE word_frequencies 
SET pashto_word = 'مصالحې' 
WHERE id = 22215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصالحې' 
    AND wf2.id != 22215
);
UPDATE word_frequencies 
SET pashto_word = 'مصرفېدلې' 
WHERE id = 34908 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصرفېدلې' 
    AND wf2.id != 34908
);
UPDATE word_frequencies 
SET pashto_word = 'مصریانو' 
WHERE id = 36226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصریانو' 
    AND wf2.id != 36226
);
UPDATE word_frequencies 
SET pashto_word = 'مصفاه' 
WHERE id = 39739 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصفاه' 
    AND wf2.id != 39739
);
UPDATE word_frequencies 
SET pashto_word = 'مصفه' 
WHERE id = 37630 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مصفه' 
    AND wf2.id != 37630
);
UPDATE word_frequencies 
SET pashto_word = 'مطابق' 
WHERE id = 24431 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مطابق' 
    AND wf2.id != 24431
);
UPDATE word_frequencies 
SET pashto_word = 'معبودان' 
WHERE id = 25450 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معبودان' 
    AND wf2.id != 25450
);
UPDATE word_frequencies 
SET pashto_word = 'معبودانو' 
WHERE id = 39630 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معبودانو' 
    AND wf2.id != 39630
);
UPDATE word_frequencies 
SET pashto_word = 'معسياه' 
WHERE id = 20205 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معسياه' 
    AND wf2.id != 20205
);
UPDATE word_frequencies 
SET pashto_word = 'معسیا' 
WHERE id = 21956 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معسیا' 
    AND wf2.id != 21956
);
UPDATE word_frequencies 
SET pashto_word = 'معلومه' 
WHERE id = 37309 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معلومه' 
    AND wf2.id != 37309
);
UPDATE word_frequencies 
SET pashto_word = 'معلوموى' 
WHERE id = 28689 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معلوموى' 
    AND wf2.id != 28689
);
UPDATE word_frequencies 
SET pashto_word = 'معلوموې' 
WHERE id = 31321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معلوموې' 
    AND wf2.id != 31321
);
UPDATE word_frequencies 
SET pashto_word = 'معون' 
WHERE id = 25992 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'معون' 
    AND wf2.id != 25992
);
UPDATE word_frequencies 
SET pashto_word = 'مفعت' 
WHERE id = 31226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مفعت' 
    AND wf2.id != 31226
);
UPDATE word_frequencies 
SET pashto_word = 'مقررولو' 
WHERE id = 36927 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مقررولو' 
    AND wf2.id != 36927
);
UPDATE word_frequencies 
SET pashto_word = 'مقرروم' 
WHERE id = 28013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مقرروم' 
    AND wf2.id != 28013
);
UPDATE word_frequencies 
SET pashto_word = 'مقرروى' 
WHERE id = 32386 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مقرروى' 
    AND wf2.id != 32386
);
UPDATE word_frequencies 
SET pashto_word = 'مقيده' 
WHERE id = 39711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مقيده' 
    AND wf2.id != 39711
);
UPDATE word_frequencies 
SET pashto_word = 'ملامتوي' 
WHERE id = 29866 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملامتوي' 
    AND wf2.id != 29866
);
UPDATE word_frequencies 
SET pashto_word = 'ملامتوی' 
WHERE id = 41842 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملامتوی' 
    AND wf2.id != 41842
);
UPDATE word_frequencies 
SET pashto_word = 'ملاويږى' 
WHERE id = 14551 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملاويږى' 
    AND wf2.id != 14551
);
UPDATE word_frequencies 
SET pashto_word = 'ملوک' 
WHERE id = 30815 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملوک' 
    AND wf2.id != 30815
);
UPDATE word_frequencies 
SET pashto_word = 'ملکیا' 
WHERE id = 30812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملکیا' 
    AND wf2.id != 30812
);
UPDATE word_frequencies 
SET pashto_word = 'ملګرو' 
WHERE id = 18227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملګرو' 
    AND wf2.id != 18227
);
UPDATE word_frequencies 
SET pashto_word = 'ملګرى' 
WHERE id = 39028 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملګرى' 
    AND wf2.id != 39028
);
UPDATE word_frequencies 
SET pashto_word = 'ملګريه' 
WHERE id = 24601 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملګريه' 
    AND wf2.id != 24601
);
UPDATE word_frequencies 
SET pashto_word = 'ملګریه' 
WHERE id = 26633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ملګریه' 
    AND wf2.id != 26633
);
UPDATE word_frequencies 
SET pashto_word = 'مناره' 
WHERE id = 38678 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مناره' 
    AND wf2.id != 38678
);
UPDATE word_frequencies 
SET pashto_word = 'منافقانو' 
WHERE id = 29591 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منافقانو' 
    AND wf2.id != 29591
);
UPDATE word_frequencies 
SET pashto_word = 'منسى' 
WHERE id = 24563 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منسى' 
    AND wf2.id != 24563
);
UPDATE word_frequencies 
SET pashto_word = 'منشى' 
WHERE id = 25820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منشى' 
    AND wf2.id != 25820
);
UPDATE word_frequencies 
SET pashto_word = 'منل' 
WHERE id = 25579 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منل' 
    AND wf2.id != 25579
);
UPDATE word_frequencies 
SET pashto_word = 'منله' 
WHERE id = 19336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منله' 
    AND wf2.id != 19336
);
UPDATE word_frequencies 
SET pashto_word = 'منلو' 
WHERE id = 26454 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منلو' 
    AND wf2.id != 26454
);
UPDATE word_frequencies 
SET pashto_word = 'منلی' 
WHERE id = 42164 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منلی' 
    AND wf2.id != 42164
);
UPDATE word_frequencies 
SET pashto_word = 'منه' 
WHERE id = 40075 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منه' 
    AND wf2.id != 40075
);
UPDATE word_frequencies 
SET pashto_word = 'منو' 
WHERE id = 31043 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منو' 
    AND wf2.id != 31043
);
UPDATE word_frequencies 
SET pashto_word = 'منى' 
WHERE id = 15490 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منى' 
    AND wf2.id != 15490
);
UPDATE word_frequencies 
SET pashto_word = 'مني' 
WHERE id = 20800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مني' 
    AND wf2.id != 20800
);
UPDATE word_frequencies 
SET pashto_word = 'منی' 
WHERE id = 41129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منی' 
    AND wf2.id != 41129
);
UPDATE word_frequencies 
SET pashto_word = 'منیامین' 
WHERE id = 34848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منیامین' 
    AND wf2.id != 34848
);
UPDATE word_frequencies 
SET pashto_word = 'منې' 
WHERE id = 21777 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'منې' 
    AND wf2.id != 21777
);
UPDATE word_frequencies 
SET pashto_word = 'مه' 
WHERE id = 36380 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مه' 
    AND wf2.id != 36380
);
UPDATE word_frequencies 
SET pashto_word = 'مهربانۍ' 
WHERE id = 24930 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مهربانۍ' 
    AND wf2.id != 24930
);
UPDATE word_frequencies 
SET pashto_word = 'موآب' 
WHERE id = 21267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موآب' 
    AND wf2.id != 21267
);
UPDATE word_frequencies 
SET pashto_word = 'موآبه' 
WHERE id = 37015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موآبه' 
    AND wf2.id != 37015
);
UPDATE word_frequencies 
SET pashto_word = 'موآبیانو' 
WHERE id = 35159 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موآبیانو' 
    AND wf2.id != 35159
);
UPDATE word_frequencies 
SET pashto_word = 'مور' 
WHERE id = 17201 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مور' 
    AND wf2.id != 17201
);
UPDATE word_frequencies 
SET pashto_word = 'مورې' 
WHERE id = 40076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مورې' 
    AND wf2.id != 40076
);
UPDATE word_frequencies 
SET pashto_word = 'موسىٰ' 
WHERE id = 17349 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موسىٰ' 
    AND wf2.id != 17349
);
UPDATE word_frequencies 
SET pashto_word = 'موسيقارانو' 
WHERE id = 40368 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موسيقارانو' 
    AND wf2.id != 40368
);
UPDATE word_frequencies 
SET pashto_word = 'موسی' 
WHERE id = 19094 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موسی' 
    AND wf2.id != 19094
);
UPDATE word_frequencies 
SET pashto_word = 'مولاده' 
WHERE id = 24341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مولاده' 
    AND wf2.id != 24341
);
UPDATE word_frequencies 
SET pashto_word = 'مولک' 
WHERE id = 40123 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مولک' 
    AND wf2.id != 40123
);
UPDATE word_frequencies 
SET pashto_word = 'مومى' 
WHERE id = 18125 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مومى' 
    AND wf2.id != 18125
);
UPDATE word_frequencies 
SET pashto_word = 'مومي' 
WHERE id = 21654 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مومي' 
    AND wf2.id != 21654
);
UPDATE word_frequencies 
SET pashto_word = 'مومی' 
WHERE id = 42101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مومی' 
    AND wf2.id != 42101
);
UPDATE word_frequencies 
SET pashto_word = 'موندل' 
WHERE id = 24482 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موندل' 
    AND wf2.id != 24482
);
UPDATE word_frequencies 
SET pashto_word = 'موندله' 
WHERE id = 31979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موندله' 
    AND wf2.id != 31979
);
UPDATE word_frequencies 
SET pashto_word = 'موندلو' 
WHERE id = 32538 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موندلو' 
    AND wf2.id != 32538
);
UPDATE word_frequencies 
SET pashto_word = 'موندلی' 
WHERE id = 42116 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موندلی' 
    AND wf2.id != 42116
);
UPDATE word_frequencies 
SET pashto_word = 'موندلې' 
WHERE id = 39281 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موندلې' 
    AND wf2.id != 39281
);
UPDATE word_frequencies 
SET pashto_word = 'مونږ' 
WHERE id = 24378 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مونږ' 
    AND wf2.id != 24378
);
UPDATE word_frequencies 
SET pashto_word = 'موږک' 
WHERE id = 37926 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موږک' 
    AND wf2.id != 37926
);
UPDATE word_frequencies 
SET pashto_word = 'موږی' 
WHERE id = 42061 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'موږی' 
    AND wf2.id != 42061
);
UPDATE word_frequencies 
SET pashto_word = 'مياشت' 
WHERE id = 21215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مياشت' 
    AND wf2.id != 21215
);
UPDATE word_frequencies 
SET pashto_word = 'ميديان' 
WHERE id = 31933 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميديان' 
    AND wf2.id != 31933
);
UPDATE word_frequencies 
SET pashto_word = 'ميديانيان' 
WHERE id = 39813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميديانيان' 
    AND wf2.id != 39813
);
UPDATE word_frequencies 
SET pashto_word = 'ميسایيل' 
WHERE id = 42094 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميسایيل' 
    AND wf2.id != 42094
);
UPDATE word_frequencies 
SET pashto_word = 'ميشایيل' 
WHERE id = 41878 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميشایيل' 
    AND wf2.id != 41878
);
UPDATE word_frequencies 
SET pashto_word = 'ميشک' 
WHERE id = 23931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميشک' 
    AND wf2.id != 23931
);
UPDATE word_frequencies 
SET pashto_word = 'مينه' 
WHERE id = 20103 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مينه' 
    AND wf2.id != 20103
);
UPDATE word_frequencies 
SET pashto_word = 'مينې' 
WHERE id = 38718 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مينې' 
    AND wf2.id != 38718
);
UPDATE word_frequencies 
SET pashto_word = 'ميو' 
WHERE id = 22916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميو' 
    AND wf2.id != 22916
);
UPDATE word_frequencies 
SET pashto_word = 'ميکایيل' 
WHERE id = 41228 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ميکایيل' 
    AND wf2.id != 41228
);
UPDATE word_frequencies 
SET pashto_word = 'مَلِکه' 
WHERE id = 36728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مَلِکه' 
    AND wf2.id != 36728
);
UPDATE word_frequencies 
SET pashto_word = 'مَلِک‌صِدق' 
WHERE id = 39026 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مَلِک‌صِدق' 
    AND wf2.id != 39026
);
UPDATE word_frequencies 
SET pashto_word = 'مُر' 
WHERE id = 39356 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُر' 
    AND wf2.id != 39356
);
UPDATE word_frequencies 
SET pashto_word = 'مُلخانو' 
WHERE id = 28257 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُلخانو' 
    AND wf2.id != 28257
);
UPDATE word_frequencies 
SET pashto_word = 'مُلک' 
WHERE id = 17858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُلک' 
    AND wf2.id != 17858
);
UPDATE word_frequencies 
SET pashto_word = 'مُلکى‌شوَع' 
WHERE id = 40343 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُلکى‌شوَع' 
    AND wf2.id != 40343
);
UPDATE word_frequencies 
SET pashto_word = 'مُلکياه' 
WHERE id = 28963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُلکياه' 
    AND wf2.id != 28963
);
UPDATE word_frequencies 
SET pashto_word = 'مُنافقانو' 
WHERE id = 22361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مُنافقانو' 
    AND wf2.id != 22361
);
UPDATE word_frequencies 
SET pashto_word = 'مِبسام' 
WHERE id = 39079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِبسام' 
    AND wf2.id != 39079
);
UPDATE word_frequencies 
SET pashto_word = 'مِدان' 
WHERE id = 39072 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِدان' 
    AND wf2.id != 39072
);
UPDATE word_frequencies 
SET pashto_word = 'مِشماع' 
WHERE id = 39080 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِشماع' 
    AND wf2.id != 39080
);
UPDATE word_frequencies 
SET pashto_word = 'مِصر' 
WHERE id = 23048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِصر' 
    AND wf2.id != 23048
);
UPDATE word_frequencies 
SET pashto_word = 'مِصريانو' 
WHERE id = 32058 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِصريانو' 
    AND wf2.id != 32058
);
UPDATE word_frequencies 
SET pashto_word = 'مِلاوېدل' 
WHERE id = 32031 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِلاوېدل' 
    AND wf2.id != 32031
);
UPDATE word_frequencies 
SET pashto_word = 'مِلاوېدلو' 
WHERE id = 35312 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِلاوېدلو' 
    AND wf2.id != 35312
);
UPDATE word_frequencies 
SET pashto_word = 'مِلاوېدو' 
WHERE id = 28766 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِلاوېدو' 
    AND wf2.id != 28766
);
UPDATE word_frequencies 
SET pashto_word = 'مِنى' 
WHERE id = 37077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مِنى' 
    AND wf2.id != 37077
);
UPDATE word_frequencies 
SET pashto_word = 'مټ' 
WHERE id = 35421 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مټ' 
    AND wf2.id != 35421
);
UPDATE word_frequencies 
SET pashto_word = 'مړيږى' 
WHERE id = 26524 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مړيږى' 
    AND wf2.id != 26524
);
UPDATE word_frequencies 
SET pashto_word = 'مړیږي' 
WHERE id = 27793 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مړیږي' 
    AND wf2.id != 27793
);
UPDATE word_frequencies 
SET pashto_word = 'مږه' 
WHERE id = 37925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مږه' 
    AND wf2.id != 37925
);
UPDATE word_frequencies 
SET pashto_word = 'مږى' 
WHERE id = 37217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مږى' 
    AND wf2.id != 37217
);
UPDATE word_frequencies 
SET pashto_word = 'مکير' 
WHERE id = 39543 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مکير' 
    AND wf2.id != 39543
);
UPDATE word_frequencies 
SET pashto_word = 'مګدلينى' 
WHERE id = 33025 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مګدلينى' 
    AND wf2.id != 33025
);
UPDATE word_frequencies 
SET pashto_word = 'مۀ' 
WHERE id = 28526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مۀ' 
    AND wf2.id != 28526
);
UPDATE word_frequencies 
SET pashto_word = 'می' 
WHERE id = 40646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'می' 
    AND wf2.id != 40646
);
UPDATE word_frequencies 
SET pashto_word = 'میاشتې' 
WHERE id = 33610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'میاشتې' 
    AND wf2.id != 33610
);
UPDATE word_frequencies 
SET pashto_word = 'مینه' 
WHERE id = 33620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مینه' 
    AND wf2.id != 33620
);
UPDATE word_frequencies 
SET pashto_word = 'میکاییل' 
WHERE id = 7011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'میکاییل' 
    AND wf2.id != 7011
);
UPDATE word_frequencies 
SET pashto_word = 'مېدان' 
WHERE id = 39573 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مېدان' 
    AND wf2.id != 39573
);
UPDATE word_frequencies 
SET pashto_word = 'مېز' 
WHERE id = 26088 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مېز' 
    AND wf2.id != 26088
);
UPDATE word_frequencies 
SET pashto_word = 'مېوه' 
WHERE id = 28062 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مېوه' 
    AND wf2.id != 28062
);
UPDATE word_frequencies 
SET pashto_word = 'مېوې' 
WHERE id = 36916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مېوې' 
    AND wf2.id != 36916
);
UPDATE word_frequencies 
SET pashto_word = 'مېړونو' 
WHERE id = 33557 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'مېړونو' 
    AND wf2.id != 33557
);
UPDATE word_frequencies 
SET pashto_word = 'ناتن' 
WHERE id = 24625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناتن' 
    AND wf2.id != 24625
);
UPDATE word_frequencies 
SET pashto_word = 'ناداب' 
WHERE id = 6366 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناداب' 
    AND wf2.id != 6366
);
UPDATE word_frequencies 
SET pashto_word = 'ناروغیو' 
WHERE id = 34210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناروغیو' 
    AND wf2.id != 34210
);
UPDATE word_frequencies 
SET pashto_word = 'نارینه' 
WHERE id = 35533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نارینه' 
    AND wf2.id != 35533
);
UPDATE word_frequencies 
SET pashto_word = 'نازلول' 
WHERE id = 36744 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نازلول' 
    AND wf2.id != 36744
);
UPDATE word_frequencies 
SET pashto_word = 'نازلوم' 
WHERE id = 37099 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نازلوم' 
    AND wf2.id != 37099
);
UPDATE word_frequencies 
SET pashto_word = 'نازلوه' 
WHERE id = 36602 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نازلوه' 
    AND wf2.id != 36602
);
UPDATE word_frequencies 
SET pashto_word = 'نازلوى' 
WHERE id = 36705 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نازلوى' 
    AND wf2.id != 36705
);
UPDATE word_frequencies 
SET pashto_word = 'ناسنته' 
WHERE id = 33553 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناسنته' 
    AND wf2.id != 33553
);
UPDATE word_frequencies 
SET pashto_word = 'نافرمانه' 
WHERE id = 30189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نافرمانه' 
    AND wf2.id != 30189
);
UPDATE word_frequencies 
SET pashto_word = 'نامه' 
WHERE id = 16558 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نامه' 
    AND wf2.id != 16558
);
UPDATE word_frequencies 
SET pashto_word = 'ناوې' 
WHERE id = 22168 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناوې' 
    AND wf2.id != 22168
);
UPDATE word_frequencies 
SET pashto_word = 'ناپاک' 
WHERE id = 22831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناپاک' 
    AND wf2.id != 22831
);
UPDATE word_frequencies 
SET pashto_word = 'ناپاکي' 
WHERE id = 33550 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناپاکي' 
    AND wf2.id != 33550
);
UPDATE word_frequencies 
SET pashto_word = 'ناپوهه' 
WHERE id = 30153 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ناپوهه' 
    AND wf2.id != 30153
);
UPDATE word_frequencies 
SET pashto_word = 'نبو' 
WHERE id = 31227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبو' 
    AND wf2.id != 31227
);
UPDATE word_frequencies 
SET pashto_word = 'نبوزردان' 
WHERE id = 31192 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبوزردان' 
    AND wf2.id != 31192
);
UPDATE word_frequencies 
SET pashto_word = 'نبوکدنصر' 
WHERE id = 34973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبوکدنصر' 
    AND wf2.id != 34973
);
UPDATE word_frequencies 
SET pashto_word = 'نبوکدنضر' 
WHERE id = 25479 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبوکدنضر' 
    AND wf2.id != 25479
);
UPDATE word_frequencies 
SET pashto_word = 'نبوکدنضره' 
WHERE id = 35295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبوکدنضره' 
    AND wf2.id != 35295
);
UPDATE word_frequencies 
SET pashto_word = 'نبي' 
WHERE id = 5450 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبي' 
    AND wf2.id != 5450
);
UPDATE word_frequencies 
SET pashto_word = 'نبيانو' 
WHERE id = 31129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نبيانو' 
    AND wf2.id != 31129
);
UPDATE word_frequencies 
SET pashto_word = 'نتنى‌ايل' 
WHERE id = 26477 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نتنى‌ايل' 
    AND wf2.id != 26477
);
UPDATE word_frequencies 
SET pashto_word = 'نتنییل' 
WHERE id = 35981 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نتنییل' 
    AND wf2.id != 35981
);
UPDATE word_frequencies 
SET pashto_word = 'نجه' 
WHERE id = 40293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نجه' 
    AND wf2.id != 40293
);
UPDATE word_frequencies 
SET pashto_word = 'نحت' 
WHERE id = 22743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نحت' 
    AND wf2.id != 22743
);
UPDATE word_frequencies 
SET pashto_word = 'نحمیا' 
WHERE id = 35992 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نحمیا' 
    AND wf2.id != 35992
);
UPDATE word_frequencies 
SET pashto_word = 'نحور' 
WHERE id = 40276 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نحور' 
    AND wf2.id != 40276
);
UPDATE word_frequencies 
SET pashto_word = 'ندب' 
WHERE id = 21420 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ندب' 
    AND wf2.id != 21420
);
UPDATE word_frequencies 
SET pashto_word = 'نذرانه' 
WHERE id = 37936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نذرانه' 
    AND wf2.id != 37936
);
UPDATE word_frequencies 
SET pashto_word = 'نذرانو' 
WHERE id = 20560 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نذرانو' 
    AND wf2.id != 20560
);
UPDATE word_frequencies 
SET pashto_word = 'نذرانې' 
WHERE id = 25508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نذرانې' 
    AND wf2.id != 25508
);
UPDATE word_frequencies 
SET pashto_word = 'نرمۍ' 
WHERE id = 33574 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نرمۍ' 
    AND wf2.id != 33574
);
UPDATE word_frequencies 
SET pashto_word = 'نزدې' 
WHERE id = 24449 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نزدې' 
    AND wf2.id != 24449
);
UPDATE word_frequencies 
SET pashto_word = 'نسل' 
WHERE id = 27930 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نسل' 
    AND wf2.id != 27930
);
UPDATE word_frequencies 
SET pashto_word = 'نسلونو' 
WHERE id = 36765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نسلونو' 
    AND wf2.id != 36765
);
UPDATE word_frequencies 
SET pashto_word = 'نشته' 
WHERE id = 12401 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نشته' 
    AND wf2.id != 12401
);
UPDATE word_frequencies 
SET pashto_word = 'نشه' 
WHERE id = 33619 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نشه' 
    AND wf2.id != 33619
);
UPDATE word_frequencies 
SET pashto_word = 'نعماتى' 
WHERE id = 37335 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نعماتى' 
    AND wf2.id != 37335
);
UPDATE word_frequencies 
SET pashto_word = 'نعمان' 
WHERE id = 32006 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نعمان' 
    AND wf2.id != 32006
);
UPDATE word_frequencies 
SET pashto_word = 'نفتالى' 
WHERE id = 39224 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نفتالى' 
    AND wf2.id != 39224
);
UPDATE word_frequencies 
SET pashto_word = 'نفتوحى' 
WHERE id = 38979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نفتوحى' 
    AND wf2.id != 38979
);
UPDATE word_frequencies 
SET pashto_word = 'نفج' 
WHERE id = 32431 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نفج' 
    AND wf2.id != 32431
);
UPDATE word_frequencies 
SET pashto_word = 'نقابونه' 
WHERE id = 36340 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نقابونه' 
    AND wf2.id != 36340
);
UPDATE word_frequencies 
SET pashto_word = 'نمر' 
WHERE id = 21313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نمر' 
    AND wf2.id != 21313
);
UPDATE word_frequencies 
SET pashto_word = 'نمره' 
WHERE id = 37606 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نمره' 
    AND wf2.id != 37606
);
UPDATE word_frequencies 
SET pashto_word = 'نمسی' 
WHERE id = 40895 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نمسی' 
    AND wf2.id != 40895
);
UPDATE word_frequencies 
SET pashto_word = 'نمواېل' 
WHERE id = 32203 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نمواېل' 
    AND wf2.id != 32203
);
UPDATE word_frequencies 
SET pashto_word = 'ننوت' 
WHERE id = 29580 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوت' 
    AND wf2.id != 29580
);
UPDATE word_frequencies 
SET pashto_word = 'ننوتل' 
WHERE id = 20869 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوتل' 
    AND wf2.id != 20869
);
UPDATE word_frequencies 
SET pashto_word = 'ننوتلو' 
WHERE id = 39373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوتلو' 
    AND wf2.id != 39373
);
UPDATE word_frequencies 
SET pashto_word = 'ننوتو' 
WHERE id = 40248 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوتو' 
    AND wf2.id != 40248
);
UPDATE word_frequencies 
SET pashto_word = 'ننوځى' 
WHERE id = 23923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوځى' 
    AND wf2.id != 23923
);
UPDATE word_frequencies 
SET pashto_word = 'ننوځي' 
WHERE id = 21713 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوځي' 
    AND wf2.id != 21713
);
UPDATE word_frequencies 
SET pashto_word = 'ننوځی' 
WHERE id = 41639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوځی' 
    AND wf2.id != 41639
);
UPDATE word_frequencies 
SET pashto_word = 'ننوځې' 
WHERE id = 34431 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ننوځې' 
    AND wf2.id != 34431
);
UPDATE word_frequencies 
SET pashto_word = 'نه' 
WHERE id = 19831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نه' 
    AND wf2.id != 19831
);
UPDATE word_frequencies 
SET pashto_word = 'نوب' 
WHERE id = 38022 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوب' 
    AND wf2.id != 38022
);
UPDATE word_frequencies 
SET pashto_word = 'نوجه' 
WHERE id = 10647 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوجه' 
    AND wf2.id != 10647
);
UPDATE word_frequencies 
SET pashto_word = 'نوح' 
WHERE id = 24026 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوح' 
    AND wf2.id != 24026
);
UPDATE word_frequencies 
SET pashto_word = 'نوعاه' 
WHERE id = 32205 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوعاه' 
    AND wf2.id != 32205
);
UPDATE word_frequencies 
SET pashto_word = 'نوعه' 
WHERE id = 37652 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوعه' 
    AND wf2.id != 37652
);
UPDATE word_frequencies 
SET pashto_word = 'نولى' 
WHERE id = 32798 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نولى' 
    AND wf2.id != 32798
);
UPDATE word_frequencies 
SET pashto_word = 'نوم' 
WHERE id = 22691 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوم' 
    AND wf2.id != 22691
);
UPDATE word_frequencies 
SET pashto_word = 'نومېدل' 
WHERE id = 38621 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نومېدل' 
    AND wf2.id != 38621
);
UPDATE word_frequencies 
SET pashto_word = 'نومېدله' 
WHERE id = 29435 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نومېدله' 
    AND wf2.id != 29435
);
UPDATE word_frequencies 
SET pashto_word = 'نومېده' 
WHERE id = 23471 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نومېده' 
    AND wf2.id != 23471
);
UPDATE word_frequencies 
SET pashto_word = 'نوکران' 
WHERE id = 39091 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوکران' 
    AND wf2.id != 39091
);
UPDATE word_frequencies 
SET pashto_word = 'نوکرانو' 
WHERE id = 24524 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوکرانو' 
    AND wf2.id != 24524
);
UPDATE word_frequencies 
SET pashto_word = 'نوکره' 
WHERE id = 27047 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نوکره' 
    AND wf2.id != 27047
);
UPDATE word_frequencies 
SET pashto_word = 'نير' 
WHERE id = 40341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نير' 
    AND wf2.id != 40341
);
UPDATE word_frequencies 
SET pashto_word = 'نيسم' 
WHERE id = 27920 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسم' 
    AND wf2.id != 27920
);
UPDATE word_frequencies 
SET pashto_word = 'نيسه' 
WHERE id = 28250 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسه' 
    AND wf2.id != 28250
);
UPDATE word_frequencies 
SET pashto_word = 'نيسو' 
WHERE id = 36951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسو' 
    AND wf2.id != 36951
);
UPDATE word_frequencies 
SET pashto_word = 'نيسى' 
WHERE id = 17324 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسى' 
    AND wf2.id != 17324
);
UPDATE word_frequencies 
SET pashto_word = 'نيسی' 
WHERE id = 41192 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسی' 
    AND wf2.id != 41192
);
UPDATE word_frequencies 
SET pashto_word = 'نيسې' 
WHERE id = 37219 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيسې' 
    AND wf2.id != 37219
);
UPDATE word_frequencies 
SET pashto_word = 'نينوه' 
WHERE id = 28562 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نينوه' 
    AND wf2.id != 28562
);
UPDATE word_frequencies 
SET pashto_word = 'نيوله' 
WHERE id = 26427 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيوله' 
    AND wf2.id != 26427
);
UPDATE word_frequencies 
SET pashto_word = 'نيولو' 
WHERE id = 17057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيولو' 
    AND wf2.id != 17057
);
UPDATE word_frequencies 
SET pashto_word = 'نيولى' 
WHERE id = 39833 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيولى' 
    AND wf2.id != 39833
);
UPDATE word_frequencies 
SET pashto_word = 'نيولې' 
WHERE id = 38872 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيولې' 
    AND wf2.id != 38872
);
UPDATE word_frequencies 
SET pashto_word = 'نيکۀ' 
WHERE id = 20614 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نيکۀ' 
    AND wf2.id != 20614
);
UPDATE word_frequencies 
SET pashto_word = 'نچوړوى' 
WHERE id = 37005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نچوړوى' 
    AND wf2.id != 37005
);
UPDATE word_frequencies 
SET pashto_word = 'نړۍ' 
WHERE id = 27887 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نړۍ' 
    AND wf2.id != 27887
);
UPDATE word_frequencies 
SET pashto_word = 'نښلوي' 
WHERE id = 26834 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نښلوي' 
    AND wf2.id != 26834
);
UPDATE word_frequencies 
SET pashto_word = 'نښلي' 
WHERE id = 38252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نښلي' 
    AND wf2.id != 38252
);
UPDATE word_frequencies 
SET pashto_word = 'نښو' 
WHERE id = 33666 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نښو' 
    AND wf2.id != 33666
);
UPDATE word_frequencies 
SET pashto_word = 'نګهبان' 
WHERE id = 32713 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نګهبان' 
    AND wf2.id != 32713
);
UPDATE word_frequencies 
SET pashto_word = 'نۀ' 
WHERE id = 39179 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نۀ' 
    AND wf2.id != 39179
);
UPDATE word_frequencies 
SET pashto_word = 'نیسه' 
WHERE id = 33387 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیسه' 
    AND wf2.id != 33387
);
UPDATE word_frequencies 
SET pashto_word = 'نیسي' 
WHERE id = 18300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیسي' 
    AND wf2.id != 18300
);
UPDATE word_frequencies 
SET pashto_word = 'نیسی' 
WHERE id = 41256 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیسی' 
    AND wf2.id != 41256
);
UPDATE word_frequencies 
SET pashto_word = 'نینوا' 
WHERE id = 28353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نینوا' 
    AND wf2.id != 28353
);
UPDATE word_frequencies 
SET pashto_word = 'نیول' 
WHERE id = 26958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیول' 
    AND wf2.id != 26958
);
UPDATE word_frequencies 
SET pashto_word = 'نیولی' 
WHERE id = 33744 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیولی' 
    AND wf2.id != 33744
);
UPDATE word_frequencies 
SET pashto_word = 'نیولې' 
WHERE id = 34364 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیولې' 
    AND wf2.id != 34364
);
UPDATE word_frequencies 
SET pashto_word = 'نیوه' 
WHERE id = 18905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیوه' 
    AND wf2.id != 18905
);
UPDATE word_frequencies 
SET pashto_word = 'نیکه' 
WHERE id = 7876 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیکه' 
    AND wf2.id != 7876
);
UPDATE word_frequencies 
SET pashto_word = 'نیکو' 
WHERE id = 34966 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیکو' 
    AND wf2.id != 34966
);
UPDATE word_frequencies 
SET pashto_word = 'نیکونو' 
WHERE id = 34060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نیکونو' 
    AND wf2.id != 34060
);
UPDATE word_frequencies 
SET pashto_word = 'نېزه' 
WHERE id = 37460 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نېزه' 
    AND wf2.id != 37460
);
UPDATE word_frequencies 
SET pashto_word = 'نېزو' 
WHERE id = 38048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نېزو' 
    AND wf2.id != 38048
);
UPDATE word_frequencies 
SET pashto_word = 'نېکه' 
WHERE id = 20713 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نېکه' 
    AND wf2.id != 20713
);
UPDATE word_frequencies 
SET pashto_word = 'نېکي' 
WHERE id = 33582 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'نېکي' 
    AND wf2.id != 33582
);
UPDATE word_frequencies 
SET pashto_word = 'هاجِرې' 
WHERE id = 11144 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هاجِرې' 
    AND wf2.id != 11144
);
UPDATE word_frequencies 
SET pashto_word = 'هارون' 
WHERE id = 24388 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هارون' 
    AND wf2.id != 24388
);
UPDATE word_frequencies 
SET pashto_word = 'های' 
WHERE id = 41973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'های' 
    AND wf2.id != 41973
);
UPDATE word_frequencies 
SET pashto_word = 'هدورام' 
WHERE id = 39000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هدورام' 
    AND wf2.id != 39000
);
UPDATE word_frequencies 
SET pashto_word = 'هغوی' 
WHERE id = 31730 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هغوی' 
    AND wf2.id != 31730
);
UPDATE word_frequencies 
SET pashto_word = 'هغۀ' 
WHERE id = 22816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هغۀ' 
    AND wf2.id != 22816
);
UPDATE word_frequencies 
SET pashto_word = 'هلاکيږى' 
WHERE id = 37482 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هلاکيږى' 
    AND wf2.id != 37482
);
UPDATE word_frequencies 
SET pashto_word = 'هم' 
WHERE id = 19383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هم' 
    AND wf2.id != 19383
);
UPDATE word_frequencies 
SET pashto_word = 'هو' 
WHERE id = 14623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هو' 
    AND wf2.id != 14623
);
UPDATE word_frequencies 
SET pashto_word = 'هوارولې' 
WHERE id = 39905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هوارولې' 
    AND wf2.id != 39905
);
UPDATE word_frequencies 
SET pashto_word = 'هوسۍ' 
WHERE id = 30528 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هوسۍ' 
    AND wf2.id != 30528
);
UPDATE word_frequencies 
SET pashto_word = 'هوښيار' 
WHERE id = 30480 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هوښيار' 
    AND wf2.id != 30480
);
UPDATE word_frequencies 
SET pashto_word = 'هوښياروى' 
WHERE id = 37381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هوښياروى' 
    AND wf2.id != 37381
);
UPDATE word_frequencies 
SET pashto_word = 'هيره' 
WHERE id = 39389 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هيره' 
    AND wf2.id != 39389
);
UPDATE word_frequencies 
SET pashto_word = 'هيمان' 
WHERE id = 32479 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هيمان' 
    AND wf2.id != 32479
);
UPDATE word_frequencies 
SET pashto_word = 'هيچا' 
WHERE id = 36946 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هيچا' 
    AND wf2.id != 36946
);
UPDATE word_frequencies 
SET pashto_word = 'هڅوي' 
WHERE id = 38217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هڅوي' 
    AND wf2.id != 38217
);
UPDATE word_frequencies 
SET pashto_word = 'هډوکو' 
WHERE id = 35880 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هډوکو' 
    AND wf2.id != 35880
);
UPDATE word_frequencies 
SET pashto_word = 'هڼېږی' 
WHERE id = 41977 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هڼېږی' 
    AND wf2.id != 41977
);
UPDATE word_frequencies 
SET pashto_word = 'هېروه' 
WHERE id = 24374 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هېروه' 
    AND wf2.id != 24374
);
UPDATE word_frequencies 
SET pashto_word = 'هېروى' 
WHERE id = 31148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هېروى' 
    AND wf2.id != 31148
);
UPDATE word_frequencies 
SET pashto_word = 'هېروی' 
WHERE id = 40723 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هېروی' 
    AND wf2.id != 40723
);
UPDATE word_frequencies 
SET pashto_word = 'هېريږى' 
WHERE id = 37051 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'هېريږى' 
    AND wf2.id != 37051
);
UPDATE word_frequencies 
SET pashto_word = 'وآزمایى' 
WHERE id = 41744 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وآزمایى' 
    AND wf2.id != 41744
);
UPDATE word_frequencies 
SET pashto_word = 'وآزمایيلو' 
WHERE id = 42139 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وآزمایيلو' 
    AND wf2.id != 42139
);
UPDATE word_frequencies 
SET pashto_word = 'وآزمایيم' 
WHERE id = 41715 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وآزمایيم' 
    AND wf2.id != 41715
);
UPDATE word_frequencies 
SET pashto_word = 'وئیلی' 
WHERE id = 40856 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وئیلی' 
    AND wf2.id != 40856
);
UPDATE word_frequencies 
SET pashto_word = 'واخستل' 
WHERE id = 20164 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخستل' 
    AND wf2.id != 20164
);
UPDATE word_frequencies 
SET pashto_word = 'واخستله' 
WHERE id = 21129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخستله' 
    AND wf2.id != 21129
);
UPDATE word_frequencies 
SET pashto_word = 'واخستلو' 
WHERE id = 23195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخستلو' 
    AND wf2.id != 23195
);
UPDATE word_frequencies 
SET pashto_word = 'واخستلې' 
WHERE id = 24535 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخستلې' 
    AND wf2.id != 24535
);
UPDATE word_frequencies 
SET pashto_word = 'واخسته' 
WHERE id = 32966 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخسته' 
    AND wf2.id != 32966
);
UPDATE word_frequencies 
SET pashto_word = 'واخستو' 
WHERE id = 21395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخستو' 
    AND wf2.id != 21395
);
UPDATE word_frequencies 
SET pashto_word = 'واخلم' 
WHERE id = 17517 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلم' 
    AND wf2.id != 17517
);
UPDATE word_frequencies 
SET pashto_word = 'واخله' 
WHERE id = 20010 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخله' 
    AND wf2.id != 20010
);
UPDATE word_frequencies 
SET pashto_word = 'واخلو' 
WHERE id = 27315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلو' 
    AND wf2.id != 27315
);
UPDATE word_frequencies 
SET pashto_word = 'واخلى' 
WHERE id = 16086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلى' 
    AND wf2.id != 16086
);
UPDATE word_frequencies 
SET pashto_word = 'واخلي' 
WHERE id = 16995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلي' 
    AND wf2.id != 16995
);
UPDATE word_frequencies 
SET pashto_word = 'واخلی' 
WHERE id = 40607 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلی' 
    AND wf2.id != 40607
);
UPDATE word_frequencies 
SET pashto_word = 'واخلې' 
WHERE id = 20020 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخلې' 
    AND wf2.id != 20020
);
UPDATE word_frequencies 
SET pashto_word = 'واخیست' 
WHERE id = 20272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخیست' 
    AND wf2.id != 20272
);
UPDATE word_frequencies 
SET pashto_word = 'واخیستل' 
WHERE id = 22678 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخیستل' 
    AND wf2.id != 22678
);
UPDATE word_frequencies 
SET pashto_word = 'واخیستله' 
WHERE id = 27216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واخیستله' 
    AND wf2.id != 27216
);
UPDATE word_frequencies 
SET pashto_word = 'وارخطايۍ' 
WHERE id = 37028 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وارخطايۍ' 
    AND wf2.id != 37028
);
UPDATE word_frequencies 
SET pashto_word = 'وازمایي' 
WHERE id = 23714 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وازمایي' 
    AND wf2.id != 23714
);
UPDATE word_frequencies 
SET pashto_word = 'وازمایی' 
WHERE id = 41819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وازمایی' 
    AND wf2.id != 41819
);
UPDATE word_frequencies 
SET pashto_word = 'وازګه' 
WHERE id = 26282 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وازګه' 
    AND wf2.id != 26282
);
UPDATE word_frequencies 
SET pashto_word = 'واستاوه' 
WHERE id = 35662 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واستاوه' 
    AND wf2.id != 35662
);
UPDATE word_frequencies 
SET pashto_word = 'واغوستل' 
WHERE id = 29267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واغوستل' 
    AND wf2.id != 29267
);
UPDATE word_frequencies 
SET pashto_word = 'واغوستلې' 
WHERE id = 31973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واغوستلې' 
    AND wf2.id != 31973
);
UPDATE word_frequencies 
SET pashto_word = 'واغوندو' 
WHERE id = 34711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واغوندو' 
    AND wf2.id != 34711
);
UPDATE word_frequencies 
SET pashto_word = 'واغوندی' 
WHERE id = 40775 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واغوندی' 
    AND wf2.id != 40775
);
UPDATE word_frequencies 
SET pashto_word = 'والا' 
WHERE id = 31949 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والا' 
    AND wf2.id != 31949
);
UPDATE word_frequencies 
SET pashto_word = 'والوزي' 
WHERE id = 36220 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والوزي' 
    AND wf2.id != 36220
);
UPDATE word_frequencies 
SET pashto_word = 'والوځى' 
WHERE id = 24546 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والوځى' 
    AND wf2.id != 24546
);
UPDATE word_frequencies 
SET pashto_word = 'والي' 
WHERE id = 23493 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والي' 
    AND wf2.id != 23493
);
UPDATE word_frequencies 
SET pashto_word = 'والیانو' 
WHERE id = 27711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والیانو' 
    AND wf2.id != 27711
);
UPDATE word_frequencies 
SET pashto_word = 'والۍ' 
WHERE id = 39378 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'والۍ' 
    AND wf2.id != 39378
);
UPDATE word_frequencies 
SET pashto_word = 'وانخلو' 
WHERE id = 33624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وانخلو' 
    AND wf2.id != 33624
);
UPDATE word_frequencies 
SET pashto_word = 'وانخلي' 
WHERE id = 25568 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وانخلي' 
    AND wf2.id != 25568
);
UPDATE word_frequencies 
SET pashto_word = 'وانخلی' 
WHERE id = 41899 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وانخلی' 
    AND wf2.id != 41899
);
UPDATE word_frequencies 
SET pashto_word = 'وانخیست' 
WHERE id = 34924 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وانخیست' 
    AND wf2.id != 34924
);
UPDATE word_frequencies 
SET pashto_word = 'واه' 
WHERE id = 25294 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واه' 
    AND wf2.id != 25294
);
UPDATE word_frequencies 
SET pashto_word = 'واهه' 
WHERE id = 34105 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واهه' 
    AND wf2.id != 34105
);
UPDATE word_frequencies 
SET pashto_word = 'واورم' 
WHERE id = 25438 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورم' 
    AND wf2.id != 25438
);
UPDATE word_frequencies 
SET pashto_word = 'واوره' 
WHERE id = 16669 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوره' 
    AND wf2.id != 16669
);
UPDATE word_frequencies 
SET pashto_word = 'واورو' 
WHERE id = 33442 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورو' 
    AND wf2.id != 33442
);
UPDATE word_frequencies 
SET pashto_word = 'واورول' 
WHERE id = 31516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورول' 
    AND wf2.id != 31516
);
UPDATE word_frequencies 
SET pashto_word = 'واوروله' 
WHERE id = 25829 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوروله' 
    AND wf2.id != 25829
);
UPDATE word_frequencies 
SET pashto_word = 'واورولو' 
WHERE id = 28684 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورولو' 
    AND wf2.id != 28684
);
UPDATE word_frequencies 
SET pashto_word = 'واورولې' 
WHERE id = 37574 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورولې' 
    AND wf2.id != 37574
);
UPDATE word_frequencies 
SET pashto_word = 'واوروم' 
WHERE id = 34724 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوروم' 
    AND wf2.id != 34724
);
UPDATE word_frequencies 
SET pashto_word = 'واوروى' 
WHERE id = 27979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوروى' 
    AND wf2.id != 27979
);
UPDATE word_frequencies 
SET pashto_word = 'واوروی' 
WHERE id = 41688 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوروی' 
    AND wf2.id != 41688
);
UPDATE word_frequencies 
SET pashto_word = 'واورى' 
WHERE id = 17068 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورى' 
    AND wf2.id != 17068
);
UPDATE word_frequencies 
SET pashto_word = 'واوري' 
WHERE id = 19320 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوري' 
    AND wf2.id != 19320
);
UPDATE word_frequencies 
SET pashto_word = 'واورينه' 
WHERE id = 38804 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورينه' 
    AND wf2.id != 38804
);
UPDATE word_frequencies 
SET pashto_word = 'واوری' 
WHERE id = 41068 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوری' 
    AND wf2.id != 41068
);
UPDATE word_frequencies 
SET pashto_word = 'واورې' 
WHERE id = 26729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورې' 
    AND wf2.id != 26729
);
UPDATE word_frequencies 
SET pashto_word = 'واورېد' 
WHERE id = 26693 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېد' 
    AND wf2.id != 26693
);
UPDATE word_frequencies 
SET pashto_word = 'واورېدل' 
WHERE id = 21751 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېدل' 
    AND wf2.id != 21751
);
UPDATE word_frequencies 
SET pashto_word = 'واورېدله' 
WHERE id = 23606 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېدله' 
    AND wf2.id != 23606
);
UPDATE word_frequencies 
SET pashto_word = 'واورېدلې' 
WHERE id = 20867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېدلې' 
    AND wf2.id != 20867
);
UPDATE word_frequencies 
SET pashto_word = 'واورېده' 
WHERE id = 21881 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېده' 
    AND wf2.id != 21881
);
UPDATE word_frequencies 
SET pashto_word = 'واورېدو' 
WHERE id = 19623 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېدو' 
    AND wf2.id != 19623
);
UPDATE word_frequencies 
SET pashto_word = 'واورېدې' 
WHERE id = 32530 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واورېدې' 
    AND wf2.id != 32530
);
UPDATE word_frequencies 
SET pashto_word = 'واوسو' 
WHERE id = 29483 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوسو' 
    AND wf2.id != 29483
);
UPDATE word_frequencies 
SET pashto_word = 'واوسیږي' 
WHERE id = 16014 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوسیږي' 
    AND wf2.id != 16014
);
UPDATE word_frequencies 
SET pashto_word = 'واوسېږی' 
WHERE id = 41502 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوسېږی' 
    AND wf2.id != 41502
);
UPDATE word_frequencies 
SET pashto_word = 'واوړى' 
WHERE id = 32497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوړى' 
    AND wf2.id != 32497
);
UPDATE word_frequencies 
SET pashto_word = 'واوړی' 
WHERE id = 40902 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوړی' 
    AND wf2.id != 40902
);
UPDATE word_frequencies 
SET pashto_word = 'واوړېدل' 
WHERE id = 28796 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوړېدل' 
    AND wf2.id != 28796
);
UPDATE word_frequencies 
SET pashto_word = 'واوړېدله' 
WHERE id = 39526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوړېدله' 
    AND wf2.id != 39526
);
UPDATE word_frequencies 
SET pashto_word = 'واوړېدو' 
WHERE id = 25464 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واوړېدو' 
    AND wf2.id != 25464
);
UPDATE word_frequencies 
SET pashto_word = 'وايم' 
WHERE id = 16075 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وايم' 
    AND wf2.id != 16075
);
UPDATE word_frequencies 
SET pashto_word = 'وايه' 
WHERE id = 26431 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وايه' 
    AND wf2.id != 26431
);
UPDATE word_frequencies 
SET pashto_word = 'وايی' 
WHERE id = 41081 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وايی' 
    AND wf2.id != 41081
);
UPDATE word_frequencies 
SET pashto_word = 'واچاوه' 
WHERE id = 21725 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچاوه' 
    AND wf2.id != 21725
);
UPDATE word_frequencies 
SET pashto_word = 'واچول' 
WHERE id = 17173 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچول' 
    AND wf2.id != 17173
);
UPDATE word_frequencies 
SET pashto_word = 'واچوله' 
WHERE id = 18372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوله' 
    AND wf2.id != 18372
);
UPDATE word_frequencies 
SET pashto_word = 'واچولو' 
WHERE id = 17530 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچولو' 
    AND wf2.id != 17530
);
UPDATE word_frequencies 
SET pashto_word = 'واچولې' 
WHERE id = 17218 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچولې' 
    AND wf2.id != 17218
);
UPDATE word_frequencies 
SET pashto_word = 'واچوم' 
WHERE id = 20997 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوم' 
    AND wf2.id != 20997
);
UPDATE word_frequencies 
SET pashto_word = 'واچوه' 
WHERE id = 21097 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوه' 
    AND wf2.id != 21097
);
UPDATE word_frequencies 
SET pashto_word = 'واچوو' 
WHERE id = 35572 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوو' 
    AND wf2.id != 35572
);
UPDATE word_frequencies 
SET pashto_word = 'واچوى' 
WHERE id = 17299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوى' 
    AND wf2.id != 17299
);
UPDATE word_frequencies 
SET pashto_word = 'واچوي' 
WHERE id = 19412 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوي' 
    AND wf2.id != 19412
);
UPDATE word_frequencies 
SET pashto_word = 'واچوی' 
WHERE id = 41200 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوی' 
    AND wf2.id != 41200
);
UPDATE word_frequencies 
SET pashto_word = 'واچوې' 
WHERE id = 36737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واچوې' 
    AND wf2.id != 36737
);
UPDATE word_frequencies 
SET pashto_word = 'واړاوه' 
WHERE id = 27755 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړاوه' 
    AND wf2.id != 27755
);
UPDATE word_frequencies 
SET pashto_word = 'واړول' 
WHERE id = 37961 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړول' 
    AND wf2.id != 37961
);
UPDATE word_frequencies 
SET pashto_word = 'واړولې' 
WHERE id = 34269 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړولې' 
    AND wf2.id != 34269
);
UPDATE word_frequencies 
SET pashto_word = 'واړوم' 
WHERE id = 25669 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړوم' 
    AND wf2.id != 25669
);
UPDATE word_frequencies 
SET pashto_word = 'واړوه' 
WHERE id = 35749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړوه' 
    AND wf2.id != 35749
);
UPDATE word_frequencies 
SET pashto_word = 'واړوى' 
WHERE id = 32242 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړوى' 
    AND wf2.id != 32242
);
UPDATE word_frequencies 
SET pashto_word = 'واړوی' 
WHERE id = 40901 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واړوی' 
    AND wf2.id != 40901
);
UPDATE word_frequencies 
SET pashto_word = 'واژه' 
WHERE id = 29255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واژه' 
    AND wf2.id != 29255
);
UPDATE word_frequencies 
SET pashto_word = 'واښو' 
WHERE id = 34680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'واښو' 
    AND wf2.id != 34680
);
UPDATE word_frequencies 
SET pashto_word = 'وای' 
WHERE id = 38073 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وای' 
    AND wf2.id != 38073
);
UPDATE word_frequencies 
SET pashto_word = 'وایم' 
WHERE id = 19785 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایم' 
    AND wf2.id != 19785
);
UPDATE word_frequencies 
SET pashto_word = 'وایه' 
WHERE id = 35628 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایه' 
    AND wf2.id != 35628
);
UPDATE word_frequencies 
SET pashto_word = 'وایو' 
WHERE id = 29231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایو' 
    AND wf2.id != 29231
);
UPDATE word_frequencies 
SET pashto_word = 'وایى' 
WHERE id = 40970 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایى' 
    AND wf2.id != 40970
);
UPDATE word_frequencies 
SET pashto_word = 'وایي' 
WHERE id = 14276 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایي' 
    AND wf2.id != 14276
);
UPDATE word_frequencies 
SET pashto_word = 'وایينه' 
WHERE id = 42056 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایينه' 
    AND wf2.id != 42056
);
UPDATE word_frequencies 
SET pashto_word = 'وایی' 
WHERE id = 41383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایی' 
    AND wf2.id != 41383
);
UPDATE word_frequencies 
SET pashto_word = 'وایې' 
WHERE id = 34518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وایې' 
    AND wf2.id != 34518
);
UPDATE word_frequencies 
SET pashto_word = 'وبا' 
WHERE id = 31106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبا' 
    AND wf2.id != 31106
);
UPDATE word_frequencies 
SET pashto_word = 'وباسم' 
WHERE id = 20786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسم' 
    AND wf2.id != 20786
);
UPDATE word_frequencies 
SET pashto_word = 'وباسه' 
WHERE id = 22873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسه' 
    AND wf2.id != 22873
);
UPDATE word_frequencies 
SET pashto_word = 'وباسى' 
WHERE id = 19527 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسى' 
    AND wf2.id != 19527
);
UPDATE word_frequencies 
SET pashto_word = 'وباسي' 
WHERE id = 17398 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسي' 
    AND wf2.id != 17398
);
UPDATE word_frequencies 
SET pashto_word = 'وباسی' 
WHERE id = 41117 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسی' 
    AND wf2.id != 41117
);
UPDATE word_frequencies 
SET pashto_word = 'وباسې' 
WHERE id = 25170 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباسې' 
    AND wf2.id != 25170
);
UPDATE word_frequencies 
SET pashto_word = 'وباګانې' 
WHERE id = 39606 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وباګانې' 
    AND wf2.id != 39606
);
UPDATE word_frequencies 
SET pashto_word = 'وبخښل' 
WHERE id = 33542 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبخښل' 
    AND wf2.id != 33542
);
UPDATE word_frequencies 
SET pashto_word = 'وبخښلو' 
WHERE id = 27210 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبخښلو' 
    AND wf2.id != 27210
);
UPDATE word_frequencies 
SET pashto_word = 'وبخښه' 
WHERE id = 34888 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبخښه' 
    AND wf2.id != 34888
);
UPDATE word_frequencies 
SET pashto_word = 'وبخښي' 
WHERE id = 22481 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبخښي' 
    AND wf2.id != 22481
);
UPDATE word_frequencies 
SET pashto_word = 'وبخښی' 
WHERE id = 41822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبخښی' 
    AND wf2.id != 41822
);
UPDATE word_frequencies 
SET pashto_word = 'وبرېښېدل' 
WHERE id = 36797 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبرېښېدل' 
    AND wf2.id != 36797
);
UPDATE word_frequencies 
SET pashto_word = 'وبهيږى' 
WHERE id = 37871 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبهيږى' 
    AND wf2.id != 37871
);
UPDATE word_frequencies 
SET pashto_word = 'وبهيږينه' 
WHERE id = 38776 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبهيږينه' 
    AND wf2.id != 38776
);
UPDATE word_frequencies 
SET pashto_word = 'وبوګنيږى' 
WHERE id = 36608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وبوګنيږى' 
    AND wf2.id != 36608
);
UPDATE word_frequencies 
SET pashto_word = 'وت' 
WHERE id = 37708 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وت' 
    AND wf2.id != 37708
);
UPDATE word_frequencies 
SET pashto_word = 'وتاړه' 
WHERE id = 25018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتاړه' 
    AND wf2.id != 25018
);
UPDATE word_frequencies 
SET pashto_word = 'وتل' 
WHERE id = 18224 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتل' 
    AND wf2.id != 18224
);
UPDATE word_frequencies 
SET pashto_word = 'وتلل' 
WHERE id = 36806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتلل' 
    AND wf2.id != 36806
);
UPDATE word_frequencies 
SET pashto_word = 'وتله' 
WHERE id = 37321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتله' 
    AND wf2.id != 37321
);
UPDATE word_frequencies 
SET pashto_word = 'وتلو' 
WHERE id = 26191 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتلو' 
    AND wf2.id != 26191
);
UPDATE word_frequencies 
SET pashto_word = 'وتلی' 
WHERE id = 42005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتلی' 
    AND wf2.id != 42005
);
UPDATE word_frequencies 
SET pashto_word = 'وتمبوی' 
WHERE id = 41867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتمبوی' 
    AND wf2.id != 41867
);
UPDATE word_frequencies 
SET pashto_word = 'وتو' 
WHERE id = 39186 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتو' 
    AND wf2.id != 39186
);
UPDATE word_frequencies 
SET pashto_word = 'وتړل' 
WHERE id = 37752 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړل' 
    AND wf2.id != 37752
);
UPDATE word_frequencies 
SET pashto_word = 'وتړلم' 
WHERE id = 37184 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړلم' 
    AND wf2.id != 37184
);
UPDATE word_frequencies 
SET pashto_word = 'وتړله' 
WHERE id = 21582 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړله' 
    AND wf2.id != 21582
);
UPDATE word_frequencies 
SET pashto_word = 'وتړلو' 
WHERE id = 28627 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړلو' 
    AND wf2.id != 28627
);
UPDATE word_frequencies 
SET pashto_word = 'وتړلې' 
WHERE id = 33293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړلې' 
    AND wf2.id != 33293
);
UPDATE word_frequencies 
SET pashto_word = 'وتړه' 
WHERE id = 28284 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړه' 
    AND wf2.id != 28284
);
UPDATE word_frequencies 
SET pashto_word = 'وتړی' 
WHERE id = 41482 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتړی' 
    AND wf2.id != 41482
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتى' 
WHERE id = 17852 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتى' 
    AND wf2.id != 17852
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتي' 
WHERE id = 18907 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتي' 
    AND wf2.id != 18907
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتُو' 
WHERE id = 31180 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتُو' 
    AND wf2.id != 31180
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتی' 
WHERE id = 41921 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتی' 
    AND wf2.id != 41921
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېد' 
WHERE id = 27338 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېد' 
    AND wf2.id != 27338
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېدل' 
WHERE id = 14328 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېدل' 
    AND wf2.id != 14328
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېدلو' 
WHERE id = 25786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېدلو' 
    AND wf2.id != 25786
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېدلی' 
WHERE id = 42065 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېدلی' 
    AND wf2.id != 42065
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېده' 
WHERE id = 23760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېده' 
    AND wf2.id != 23760
);
UPDATE word_frequencies 
SET pashto_word = 'وتښتېدو' 
WHERE id = 23300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وتښتېدو' 
    AND wf2.id != 23300
);
UPDATE word_frequencies 
SET pashto_word = 'وجنګیږي' 
WHERE id = 19934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وجنګیږي' 
    AND wf2.id != 19934
);
UPDATE word_frequencies 
SET pashto_word = 'وجنګېدل' 
WHERE id = 34806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وجنګېدل' 
    AND wf2.id != 34806
);
UPDATE word_frequencies 
SET pashto_word = 'وجنګېږه' 
WHERE id = 39665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وجنګېږه' 
    AND wf2.id != 39665
);
UPDATE word_frequencies 
SET pashto_word = 'وجه' 
WHERE id = 35231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وجه' 
    AND wf2.id != 35231
);
UPDATE word_frequencies 
SET pashto_word = 'وحشت' 
WHERE id = 28083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وحشت' 
    AND wf2.id != 28083
);
UPDATE word_frequencies 
SET pashto_word = 'وخت' 
WHERE id = 23045 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخت' 
    AND wf2.id != 23045
);
UPDATE word_frequencies 
SET pashto_word = 'وختل' 
WHERE id = 21745 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وختل' 
    AND wf2.id != 21745
);
UPDATE word_frequencies 
SET pashto_word = 'وختلو' 
WHERE id = 24590 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وختلو' 
    AND wf2.id != 24590
);
UPDATE word_frequencies 
SET pashto_word = 'وختلې' 
WHERE id = 35363 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وختلې' 
    AND wf2.id != 35363
);
UPDATE word_frequencies 
SET pashto_word = 'وخرایي' 
WHERE id = 33365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخرایي' 
    AND wf2.id != 33365
);
UPDATE word_frequencies 
SET pashto_word = 'وخندل' 
WHERE id = 25202 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخندل' 
    AND wf2.id != 25202
);
UPDATE word_frequencies 
SET pashto_word = 'وخوت' 
WHERE id = 33204 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوت' 
    AND wf2.id != 33204
);
UPDATE word_frequencies 
SET pashto_word = 'وخورم' 
WHERE id = 29810 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخورم' 
    AND wf2.id != 29810
);
UPDATE word_frequencies 
SET pashto_word = 'وخوره' 
WHERE id = 21953 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوره' 
    AND wf2.id != 21953
);
UPDATE word_frequencies 
SET pashto_word = 'وخورو' 
WHERE id = 30342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخورو' 
    AND wf2.id != 30342
);
UPDATE word_frequencies 
SET pashto_word = 'وخوری' 
WHERE id = 40640 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوری' 
    AND wf2.id != 40640
);
UPDATE word_frequencies 
SET pashto_word = 'وخورې' 
WHERE id = 27428 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخورې' 
    AND wf2.id != 27428
);
UPDATE word_frequencies 
SET pashto_word = 'وخوځولو' 
WHERE id = 37483 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوځولو' 
    AND wf2.id != 37483
);
UPDATE word_frequencies 
SET pashto_word = 'وخوځوم' 
WHERE id = 27825 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوځوم' 
    AND wf2.id != 27825
);
UPDATE word_frequencies 
SET pashto_word = 'وخوځيږى' 
WHERE id = 37216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوځيږى' 
    AND wf2.id != 37216
);
UPDATE word_frequencies 
SET pashto_word = 'وخوځېدله' 
WHERE id = 34674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوځېدله' 
    AND wf2.id != 34674
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړ' 
WHERE id = 23725 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړ' 
    AND wf2.id != 23725
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړل' 
WHERE id = 23500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړل' 
    AND wf2.id != 23500
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړله' 
WHERE id = 19512 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړله' 
    AND wf2.id != 19512
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړلو' 
WHERE id = 31214 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړلو' 
    AND wf2.id != 31214
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړلونه' 
WHERE id = 38710 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړلونه' 
    AND wf2.id != 38710
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړلې' 
WHERE id = 27526 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړلې' 
    AND wf2.id != 27526
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړه' 
WHERE id = 19516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړه' 
    AND wf2.id != 19516
);
UPDATE word_frequencies 
SET pashto_word = 'وخوړو' 
WHERE id = 19177 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخوړو' 
    AND wf2.id != 19177
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژم' 
WHERE id = 39369 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژم' 
    AND wf2.id != 39369
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژه' 
WHERE id = 38944 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژه' 
    AND wf2.id != 38944
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژول' 
WHERE id = 28703 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژول' 
    AND wf2.id != 28703
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژوله' 
WHERE id = 31833 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژوله' 
    AND wf2.id != 31833
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژولو' 
WHERE id = 40181 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژولو' 
    AND wf2.id != 40181
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژولې' 
WHERE id = 35416 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژولې' 
    AND wf2.id != 35416
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژوه' 
WHERE id = 31876 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژوه' 
    AND wf2.id != 31876
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژي' 
WHERE id = 38154 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژي' 
    AND wf2.id != 38154
);
UPDATE word_frequencies 
SET pashto_word = 'وخېژی' 
WHERE id = 40878 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وخېژی' 
    AND wf2.id != 40878
);
UPDATE word_frequencies 
SET pashto_word = 'ودراوه' 
WHERE id = 33382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودراوه' 
    AND wf2.id != 33382
);
UPDATE word_frequencies 
SET pashto_word = 'ودرزيږى' 
WHERE id = 37299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرزيږى' 
    AND wf2.id != 37299
);
UPDATE word_frequencies 
SET pashto_word = 'ودرول' 
WHERE id = 21830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرول' 
    AND wf2.id != 21830
);
UPDATE word_frequencies 
SET pashto_word = 'ودرولم' 
WHERE id = 21149 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرولم' 
    AND wf2.id != 21149
);
UPDATE word_frequencies 
SET pashto_word = 'ودرولمه' 
WHERE id = 38664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرولمه' 
    AND wf2.id != 38664
);
UPDATE word_frequencies 
SET pashto_word = 'ودروله' 
WHERE id = 19377 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروله' 
    AND wf2.id != 19377
);
UPDATE word_frequencies 
SET pashto_word = 'ودرولو' 
WHERE id = 26203 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرولو' 
    AND wf2.id != 26203
);
UPDATE word_frequencies 
SET pashto_word = 'ودرولې' 
WHERE id = 14792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرولې' 
    AND wf2.id != 14792
);
UPDATE word_frequencies 
SET pashto_word = 'ودروم' 
WHERE id = 36773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروم' 
    AND wf2.id != 36773
);
UPDATE word_frequencies 
SET pashto_word = 'ودروه' 
WHERE id = 30796 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروه' 
    AND wf2.id != 30796
);
UPDATE word_frequencies 
SET pashto_word = 'ودروى' 
WHERE id = 28731 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروى' 
    AND wf2.id != 28731
);
UPDATE word_frequencies 
SET pashto_word = 'ودروي' 
WHERE id = 16958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروي' 
    AND wf2.id != 16958
);
UPDATE word_frequencies 
SET pashto_word = 'ودروی' 
WHERE id = 41660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودروی' 
    AND wf2.id != 41660
);
UPDATE word_frequencies 
SET pashto_word = 'ودريږى' 
WHERE id = 18085 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودريږى' 
    AND wf2.id != 18085
);
UPDATE word_frequencies 
SET pashto_word = 'ودریږي' 
WHERE id = 18915 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودریږي' 
    AND wf2.id != 18915
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدل' 
WHERE id = 14695 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدل' 
    AND wf2.id != 14695
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدلم' 
WHERE id = 35216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدلم' 
    AND wf2.id != 35216
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدله' 
WHERE id = 20400 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدله' 
    AND wf2.id != 20400
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدلو' 
WHERE id = 26060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدلو' 
    AND wf2.id != 26060
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدلی' 
WHERE id = 41300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدلی' 
    AND wf2.id != 41300
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدلې' 
WHERE id = 23961 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدلې' 
    AND wf2.id != 23961
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېده' 
WHERE id = 17973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېده' 
    AND wf2.id != 17973
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدو' 
WHERE id = 19272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدو' 
    AND wf2.id != 19272
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېدی' 
WHERE id = 41698 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېدی' 
    AND wf2.id != 41698
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېږه' 
WHERE id = 20871 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېږه' 
    AND wf2.id != 20871
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېږو' 
WHERE id = 23406 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېږو' 
    AND wf2.id != 23406
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېږی' 
WHERE id = 42041 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېږی' 
    AND wf2.id != 42041
);
UPDATE word_frequencies 
SET pashto_word = 'ودرېږې' 
WHERE id = 38341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودرېږې' 
    AND wf2.id != 38341
);
UPDATE word_frequencies 
SET pashto_word = 'ودوړوه' 
WHERE id = 36988 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ودوړوه' 
    AND wf2.id != 36988
);
UPDATE word_frequencies 
SET pashto_word = 'وراغوندى' 
WHERE id = 36500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وراغوندى' 
    AND wf2.id != 36500
);
UPDATE word_frequencies 
SET pashto_word = 'وران' 
WHERE id = 36488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وران' 
    AND wf2.id != 36488
);
UPDATE word_frequencies 
SET pashto_word = 'ورانوي' 
WHERE id = 30917 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورانوي' 
    AND wf2.id != 30917
);
UPDATE word_frequencies 
SET pashto_word = 'وراني' 
WHERE id = 35760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وراني' 
    AND wf2.id != 35760
);
UPDATE word_frequencies 
SET pashto_word = 'ورانیږي' 
WHERE id = 36204 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورانیږي' 
    AND wf2.id != 36204
);
UPDATE word_frequencies 
SET pashto_word = 'وراوړى' 
WHERE id = 37536 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وراوړى' 
    AND wf2.id != 37536
);
UPDATE word_frequencies 
SET pashto_word = 'ورتلل' 
WHERE id = 33879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورتلل' 
    AND wf2.id != 33879
);
UPDATE word_frequencies 
SET pashto_word = 'ورتلو' 
WHERE id = 27555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورتلو' 
    AND wf2.id != 27555
);
UPDATE word_frequencies 
SET pashto_word = 'ورخېژى' 
WHERE id = 37532 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورخېژى' 
    AND wf2.id != 37532
);
UPDATE word_frequencies 
SET pashto_word = 'ورساوه' 
WHERE id = 17386 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورساوه' 
    AND wf2.id != 17386
);
UPDATE word_frequencies 
SET pashto_word = 'ورسول' 
WHERE id = 26721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسول' 
    AND wf2.id != 26721
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوله' 
WHERE id = 22411 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوله' 
    AND wf2.id != 22411
);
UPDATE word_frequencies 
SET pashto_word = 'ورسولو' 
WHERE id = 21265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسولو' 
    AND wf2.id != 21265
);
UPDATE word_frequencies 
SET pashto_word = 'ورسولې' 
WHERE id = 21562 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسولې' 
    AND wf2.id != 21562
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوم' 
WHERE id = 22382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوم' 
    AND wf2.id != 22382
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوه' 
WHERE id = 36742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوه' 
    AND wf2.id != 36742
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوو' 
WHERE id = 24818 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوو' 
    AND wf2.id != 24818
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوى' 
WHERE id = 19589 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوى' 
    AND wf2.id != 19589
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوي' 
WHERE id = 16609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوي' 
    AND wf2.id != 16609
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوی' 
WHERE id = 41295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوی' 
    AND wf2.id != 41295
);
UPDATE word_frequencies 
SET pashto_word = 'ورسوې' 
WHERE id = 25395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسوې' 
    AND wf2.id != 25395
);
UPDATE word_frequencies 
SET pashto_word = 'ورسى' 
WHERE id = 32885 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسى' 
    AND wf2.id != 32885
);
UPDATE word_frequencies 
SET pashto_word = 'ورسيږى' 
WHERE id = 19155 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسيږى' 
    AND wf2.id != 19155
);
UPDATE word_frequencies 
SET pashto_word = 'ورسیږي' 
WHERE id = 17153 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسیږي' 
    AND wf2.id != 17153
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدل' 
WHERE id = 16139 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدل' 
    AND wf2.id != 16139
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدله' 
WHERE id = 27433 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدله' 
    AND wf2.id != 27433
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدلو' 
WHERE id = 19343 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدلو' 
    AND wf2.id != 19343
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدلی' 
WHERE id = 41817 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدلی' 
    AND wf2.id != 41817
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدلې' 
WHERE id = 28446 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدلې' 
    AND wf2.id != 28446
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدم' 
WHERE id = 25566 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدم' 
    AND wf2.id != 25566
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېده' 
WHERE id = 18508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېده' 
    AND wf2.id != 18508
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېدو' 
WHERE id = 15759 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېدو' 
    AND wf2.id != 15759
);
UPDATE word_frequencies 
SET pashto_word = 'ورسېږی' 
WHERE id = 42159 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورسېږی' 
    AND wf2.id != 42159
);
UPDATE word_frequencies 
SET pashto_word = 'ورشو' 
WHERE id = 29283 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورشو' 
    AND wf2.id != 29283
);
UPDATE word_frequencies 
SET pashto_word = 'ورشي' 
WHERE id = 22469 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورشي' 
    AND wf2.id != 22469
);
UPDATE word_frequencies 
SET pashto_word = 'ورشی' 
WHERE id = 41844 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورشی' 
    AND wf2.id != 41844
);
UPDATE word_frequencies 
SET pashto_word = 'ورغلل' 
WHERE id = 18516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغلل' 
    AND wf2.id != 18516
);
UPDATE word_frequencies 
SET pashto_word = 'ورغلم' 
WHERE id = 36836 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغلم' 
    AND wf2.id != 36836
);
UPDATE word_frequencies 
SET pashto_word = 'ورغله' 
WHERE id = 20953 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغله' 
    AND wf2.id != 20953
);
UPDATE word_frequencies 
SET pashto_word = 'ورغلو' 
WHERE id = 22818 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغلو' 
    AND wf2.id != 22818
);
UPDATE word_frequencies 
SET pashto_word = 'ورغلې' 
WHERE id = 34331 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغلې' 
    AND wf2.id != 34331
);
UPDATE word_frequencies 
SET pashto_word = 'ورغورزيږى' 
WHERE id = 32309 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغورزيږى' 
    AND wf2.id != 32309
);
UPDATE word_frequencies 
SET pashto_word = 'ورغړى' 
WHERE id = 36997 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغړى' 
    AND wf2.id != 36997
);
UPDATE word_frequencies 
SET pashto_word = 'ورغړېږی' 
WHERE id = 41518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغړېږی' 
    AND wf2.id != 41518
);
UPDATE word_frequencies 
SET pashto_word = 'ورغی' 
WHERE id = 19418 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورغی' 
    AND wf2.id != 19418
);
UPDATE word_frequencies 
SET pashto_word = 'ورننباسي' 
WHERE id = 28381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننباسي' 
    AND wf2.id != 28381
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوت' 
WHERE id = 22552 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوت' 
    AND wf2.id != 22552
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوتل' 
WHERE id = 20965 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوتل' 
    AND wf2.id != 20965
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوتلو' 
WHERE id = 40136 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوتلو' 
    AND wf2.id != 40136
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوتلې' 
WHERE id = 34332 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوتلې' 
    AND wf2.id != 34332
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوتو' 
WHERE id = 26557 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوتو' 
    AND wf2.id != 26557
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوځو' 
WHERE id = 29539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوځو' 
    AND wf2.id != 29539
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوځى' 
WHERE id = 20664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوځى' 
    AND wf2.id != 20664
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوځي' 
WHERE id = 19411 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوځي' 
    AND wf2.id != 19411
);
UPDATE word_frequencies 
SET pashto_word = 'ورننوځی' 
WHERE id = 41406 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورننوځی' 
    AND wf2.id != 41406
);
UPDATE word_frequencies 
SET pashto_word = 'ورواغوستل' 
WHERE id = 29923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواغوستل' 
    AND wf2.id != 29923
);
UPDATE word_frequencies 
SET pashto_word = 'ورواغوستله' 
WHERE id = 29635 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواغوستله' 
    AND wf2.id != 29635
);
UPDATE word_frequencies 
SET pashto_word = 'ورواغوستلې' 
WHERE id = 31942 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواغوستلې' 
    AND wf2.id != 31942
);
UPDATE word_frequencies 
SET pashto_word = 'ورواغونده' 
WHERE id = 31620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواغونده' 
    AND wf2.id != 31620
);
UPDATE word_frequencies 
SET pashto_word = 'ورواغوندى' 
WHERE id = 39235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواغوندى' 
    AND wf2.id != 39235
);
UPDATE word_frequencies 
SET pashto_word = 'ورواچولو' 
WHERE id = 35368 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواچولو' 
    AND wf2.id != 35368
);
UPDATE word_frequencies 
SET pashto_word = 'ورواړوه' 
WHERE id = 25168 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورواړوه' 
    AND wf2.id != 25168
);
UPDATE word_frequencies 
SET pashto_word = 'ورور' 
WHERE id = 27495 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورور' 
    AND wf2.id != 27495
);
UPDATE word_frequencies 
SET pashto_word = 'ورورسوى' 
WHERE id = 35226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورورسوى' 
    AND wf2.id != 35226
);
UPDATE word_frequencies 
SET pashto_word = 'ورورسیږي' 
WHERE id = 35423 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورورسیږي' 
    AND wf2.id != 35423
);
UPDATE word_frequencies 
SET pashto_word = 'ورورسېدل' 
WHERE id = 30319 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورورسېدل' 
    AND wf2.id != 30319
);
UPDATE word_frequencies 
SET pashto_word = 'ورورسېدو' 
WHERE id = 30504 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورورسېدو' 
    AND wf2.id != 30504
);
UPDATE word_frequencies 
SET pashto_word = 'وروره' 
WHERE id = 24923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروره' 
    AND wf2.id != 24923
);
UPDATE word_frequencies 
SET pashto_word = 'وروسته' 
WHERE id = 30337 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروسته' 
    AND wf2.id != 30337
);
UPDATE word_frequencies 
SET pashto_word = 'وروستو' 
WHERE id = 16079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروستو' 
    AND wf2.id != 16079
);
UPDATE word_frequencies 
SET pashto_word = 'وروغورزول' 
WHERE id = 23944 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروغورزول' 
    AND wf2.id != 23944
);
UPDATE word_frequencies 
SET pashto_word = 'وروغورزولو' 
WHERE id = 25489 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروغورزولو' 
    AND wf2.id != 25489
);
UPDATE word_frequencies 
SET pashto_word = 'وروغورزولې' 
WHERE id = 31812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروغورزولې' 
    AND wf2.id != 31812
);
UPDATE word_frequencies 
SET pashto_word = 'وروغورزوې' 
WHERE id = 37524 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروغورزوې' 
    AND wf2.id != 37524
);
UPDATE word_frequencies 
SET pashto_word = 'ورولو' 
WHERE id = 38146 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولو' 
    AND wf2.id != 38146
);
UPDATE word_frequencies 
SET pashto_word = 'ورولي' 
WHERE id = 35478 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولي' 
    AND wf2.id != 35478
);
UPDATE word_frequencies 
SET pashto_word = 'ورولی' 
WHERE id = 42106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولی' 
    AND wf2.id != 42106
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږل' 
WHERE id = 18923 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږل' 
    AND wf2.id != 18923
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږله' 
WHERE id = 26014 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږله' 
    AND wf2.id != 26014
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږلو' 
WHERE id = 18417 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږلو' 
    AND wf2.id != 18417
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږم' 
WHERE id = 25073 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږم' 
    AND wf2.id != 25073
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږه' 
WHERE id = 19896 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږه' 
    AND wf2.id != 19896
);
UPDATE word_frequencies 
SET pashto_word = 'ورولېږي' 
WHERE id = 34931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورولېږي' 
    AND wf2.id != 34931
);
UPDATE word_frequencies 
SET pashto_word = 'ورونه' 
WHERE id = 27044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورونه' 
    AND wf2.id != 27044
);
UPDATE word_frequencies 
SET pashto_word = 'ورونو' 
WHERE id = 14070 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورونو' 
    AND wf2.id != 14070
);
UPDATE word_frequencies 
SET pashto_word = 'وروي' 
WHERE id = 27240 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروي' 
    AND wf2.id != 27240
);
UPDATE word_frequencies 
SET pashto_word = 'وروړ' 
WHERE id = 29951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړ' 
    AND wf2.id != 29951
);
UPDATE word_frequencies 
SET pashto_word = 'وروړم' 
WHERE id = 34381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړم' 
    AND wf2.id != 34381
);
UPDATE word_frequencies 
SET pashto_word = 'وروړمه' 
WHERE id = 38772 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړمه' 
    AND wf2.id != 38772
);
UPDATE word_frequencies 
SET pashto_word = 'وروړو' 
WHERE id = 39978 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړو' 
    AND wf2.id != 39978
);
UPDATE word_frequencies 
SET pashto_word = 'وروړى' 
WHERE id = 32163 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړى' 
    AND wf2.id != 32163
);
UPDATE word_frequencies 
SET pashto_word = 'وروړی' 
WHERE id = 41331 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروړی' 
    AND wf2.id != 41331
);
UPDATE word_frequencies 
SET pashto_word = 'وروښایي' 
WHERE id = 26851 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروښایي' 
    AND wf2.id != 26851
);
UPDATE word_frequencies 
SET pashto_word = 'وروښود' 
WHERE id = 34900 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروښود' 
    AND wf2.id != 34900
);
UPDATE word_frequencies 
SET pashto_word = 'وروښودل' 
WHERE id = 33827 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروښودل' 
    AND wf2.id != 33827
);
UPDATE word_frequencies 
SET pashto_word = 'وروڼه' 
WHERE id = 21239 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروڼه' 
    AND wf2.id != 21239
);
UPDATE word_frequencies 
SET pashto_word = 'وروڼو' 
WHERE id = 16722 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وروڼو' 
    AND wf2.id != 16722
);
UPDATE word_frequencies 
SET pashto_word = 'وري' 
WHERE id = 25610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وري' 
    AND wf2.id != 25610
);
UPDATE word_frequencies 
SET pashto_word = 'وريږى' 
WHERE id = 26163 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وريږى' 
    AND wf2.id != 26163
);
UPDATE word_frequencies 
SET pashto_word = 'ورَستيږى' 
WHERE id = 37212 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورَستيږى' 
    AND wf2.id != 37212
);
UPDATE word_frequencies 
SET pashto_word = 'ورَغلو' 
WHERE id = 24461 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورَغلو' 
    AND wf2.id != 24461
);
UPDATE word_frequencies 
SET pashto_word = 'ورَوى' 
WHERE id = 21314 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورَوى' 
    AND wf2.id != 21314
);
UPDATE word_frequencies 
SET pashto_word = 'ورټل' 
WHERE id = 27141 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورټل' 
    AND wf2.id != 27141
);
UPDATE word_frequencies 
SET pashto_word = 'ورټلو' 
WHERE id = 39152 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورټلو' 
    AND wf2.id != 39152
);
UPDATE word_frequencies 
SET pashto_word = 'ورټم' 
WHERE id = 37960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورټم' 
    AND wf2.id != 37960
);
UPDATE word_frequencies 
SET pashto_word = 'ورپسې' 
WHERE id = 28710 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورپسې' 
    AND wf2.id != 28710
);
UPDATE word_frequencies 
SET pashto_word = 'ورپیږي' 
WHERE id = 35754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورپیږي' 
    AND wf2.id != 35754
);
UPDATE word_frequencies 
SET pashto_word = 'ورځ' 
WHERE id = 13973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځ' 
    AND wf2.id != 13973
);
UPDATE word_frequencies 
SET pashto_word = 'ورځم' 
WHERE id = 29385 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځم' 
    AND wf2.id != 29385
);
UPDATE word_frequencies 
SET pashto_word = 'ورځمه' 
WHERE id = 38890 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځمه' 
    AND wf2.id != 38890
);
UPDATE word_frequencies 
SET pashto_word = 'ورځو' 
WHERE id = 24365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځو' 
    AND wf2.id != 24365
);
UPDATE word_frequencies 
SET pashto_word = 'ورځي' 
WHERE id = 26931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځي' 
    AND wf2.id != 26931
);
UPDATE word_frequencies 
SET pashto_word = 'ورځی' 
WHERE id = 41664 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځی' 
    AND wf2.id != 41664
);
UPDATE word_frequencies 
SET pashto_word = 'ورځې' 
WHERE id = 24863 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورځې' 
    AND wf2.id != 24863
);
UPDATE word_frequencies 
SET pashto_word = 'ورښایى' 
WHERE id = 41694 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورښایى' 
    AND wf2.id != 41694
);
UPDATE word_frequencies 
SET pashto_word = 'ورښایي' 
WHERE id = 33872 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورښایي' 
    AND wf2.id != 33872
);
UPDATE word_frequencies 
SET pashto_word = 'ورکاوه' 
WHERE id = 16141 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکاوه' 
    AND wf2.id != 16141
);
UPDATE word_frequencies 
SET pashto_word = 'ورکول' 
WHERE id = 27028 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکول' 
    AND wf2.id != 27028
);
UPDATE word_frequencies 
SET pashto_word = 'ورکولای' 
WHERE id = 30560 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکولای' 
    AND wf2.id != 30560
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوله' 
WHERE id = 15240 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوله' 
    AND wf2.id != 15240
);
UPDATE word_frequencies 
SET pashto_word = 'ورکولو' 
WHERE id = 14616 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکولو' 
    AND wf2.id != 14616
);
UPDATE word_frequencies 
SET pashto_word = 'ورکولی' 
WHERE id = 41267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکولی' 
    AND wf2.id != 41267
);
UPDATE word_frequencies 
SET pashto_word = 'ورکولې' 
WHERE id = 20288 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکولې' 
    AND wf2.id != 20288
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوم' 
WHERE id = 14843 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوم' 
    AND wf2.id != 14843
);
UPDATE word_frequencies 
SET pashto_word = 'ورکومه' 
WHERE id = 38800 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکومه' 
    AND wf2.id != 38800
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوه' 
WHERE id = 21046 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوه' 
    AND wf2.id != 21046
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوو' 
WHERE id = 21791 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوو' 
    AND wf2.id != 21791
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوى' 
WHERE id = 24281 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوى' 
    AND wf2.id != 24281
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوي' 
WHERE id = 33686 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوي' 
    AND wf2.id != 33686
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوی' 
WHERE id = 40505 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوی' 
    AND wf2.id != 40505
);
UPDATE word_frequencies 
SET pashto_word = 'ورکوې' 
WHERE id = 16934 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکوې' 
    AND wf2.id != 16934
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړ' 
WHERE id = 13600 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړ' 
    AND wf2.id != 13600
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړل' 
WHERE id = 13706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړل' 
    AND wf2.id != 13706
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړله' 
WHERE id = 39880 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړله' 
    AND wf2.id != 39880
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړم' 
WHERE id = 35704 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړم' 
    AND wf2.id != 35704
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړمه' 
WHERE id = 38802 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړمه' 
    AND wf2.id != 38802
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړه' 
WHERE id = 12453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړه' 
    AND wf2.id != 12453
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړو' 
WHERE id = 12850 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړو' 
    AND wf2.id != 12850
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړى' 
WHERE id = 23065 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړى' 
    AND wf2.id != 23065
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړي' 
WHERE id = 25239 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړي' 
    AND wf2.id != 25239
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړُو' 
WHERE id = 22015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړُو' 
    AND wf2.id != 22015
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړی' 
WHERE id = 29211 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړی' 
    AND wf2.id != 29211
);
UPDATE word_frequencies 
SET pashto_word = 'ورکړې' 
WHERE id = 14369 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکړې' 
    AND wf2.id != 14369
);
UPDATE word_frequencies 
SET pashto_word = 'ورکیږي' 
WHERE id = 29594 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورکیږي' 
    AND wf2.id != 29594
);
UPDATE word_frequencies 
SET pashto_word = 'وریږي' 
WHERE id = 35976 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وریږي' 
    AND wf2.id != 35976
);
UPDATE word_frequencies 
SET pashto_word = 'ورېبل' 
WHERE id = 31066 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورېبل' 
    AND wf2.id != 31066
);
UPDATE word_frequencies 
SET pashto_word = 'ورېبی' 
WHERE id = 41411 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورېبی' 
    AND wf2.id != 41411
);
UPDATE word_frequencies 
SET pashto_word = 'ورېدل' 
WHERE id = 23771 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورېدل' 
    AND wf2.id != 23771
);
UPDATE word_frequencies 
SET pashto_word = 'ورېدلې' 
WHERE id = 39254 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورېدلې' 
    AND wf2.id != 39254
);
UPDATE word_frequencies 
SET pashto_word = 'ورېده' 
WHERE id = 33435 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ورېده' 
    AND wf2.id != 33435
);
UPDATE word_frequencies 
SET pashto_word = 'وزغلول' 
WHERE id = 39509 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغلول' 
    AND wf2.id != 39509
);
UPDATE word_frequencies 
SET pashto_word = 'وزغلوى' 
WHERE id = 31859 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغلوى' 
    AND wf2.id != 31859
);
UPDATE word_frequencies 
SET pashto_word = 'وزغلی' 
WHERE id = 41974 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغلی' 
    AND wf2.id != 41974
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمل' 
WHERE id = 33670 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمل' 
    AND wf2.id != 33670
);
UPDATE word_frequencies 
SET pashto_word = 'وزغملو' 
WHERE id = 29278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغملو' 
    AND wf2.id != 29278
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمه' 
WHERE id = 35721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمه' 
    AND wf2.id != 35721
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمو' 
WHERE id = 33258 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمو' 
    AND wf2.id != 33258
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمى' 
WHERE id = 32914 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمى' 
    AND wf2.id != 32914
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمی' 
WHERE id = 40870 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمی' 
    AND wf2.id != 40870
);
UPDATE word_frequencies 
SET pashto_word = 'وزغمې' 
WHERE id = 35720 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزغمې' 
    AND wf2.id != 35720
);
UPDATE word_frequencies 
SET pashto_word = 'وزن' 
WHERE id = 35362 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزن' 
    AND wf2.id != 35362
);
UPDATE word_frequencies 
SET pashto_word = 'وزيران' 
WHERE id = 35371 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزيران' 
    AND wf2.id != 35371
);
UPDATE word_frequencies 
SET pashto_word = 'وزې' 
WHERE id = 35433 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزې' 
    AND wf2.id != 35433
);
UPDATE word_frequencies 
SET pashto_word = 'وزېږاوه' 
WHERE id = 29837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزېږاوه' 
    AND wf2.id != 29837
);
UPDATE word_frequencies 
SET pashto_word = 'وزېږول' 
WHERE id = 36052 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزېږول' 
    AND wf2.id != 36052
);
UPDATE word_frequencies 
SET pashto_word = 'وزېږوي' 
WHERE id = 33636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزېږوي' 
    AND wf2.id != 33636
);
UPDATE word_frequencies 
SET pashto_word = 'وزېږوې' 
WHERE id = 37745 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزېږوې' 
    AND wf2.id != 37745
);
UPDATE word_frequencies 
SET pashto_word = 'وزېږېده' 
WHERE id = 33640 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وزېږېده' 
    AND wf2.id != 33640
);
UPDATE word_frequencies 
SET pashto_word = 'وساتل' 
WHERE id = 23509 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتل' 
    AND wf2.id != 23509
);
UPDATE word_frequencies 
SET pashto_word = 'وساتلم' 
WHERE id = 32415 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتلم' 
    AND wf2.id != 32415
);
UPDATE word_frequencies 
SET pashto_word = 'وساتله' 
WHERE id = 19035 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتله' 
    AND wf2.id != 19035
);
UPDATE word_frequencies 
SET pashto_word = 'وساتلو' 
WHERE id = 21958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتلو' 
    AND wf2.id != 21958
);
UPDATE word_frequencies 
SET pashto_word = 'وساتلې' 
WHERE id = 34767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتلې' 
    AND wf2.id != 34767
);
UPDATE word_frequencies 
SET pashto_word = 'وساتم' 
WHERE id = 21106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتم' 
    AND wf2.id != 21106
);
UPDATE word_frequencies 
SET pashto_word = 'وساته' 
WHERE id = 16273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساته' 
    AND wf2.id != 16273
);
UPDATE word_frequencies 
SET pashto_word = 'وساتو' 
WHERE id = 26757 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتو' 
    AND wf2.id != 26757
);
UPDATE word_frequencies 
SET pashto_word = 'وساتى' 
WHERE id = 18050 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتى' 
    AND wf2.id != 18050
);
UPDATE word_frequencies 
SET pashto_word = 'وساتي' 
WHERE id = 23391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتي' 
    AND wf2.id != 23391
);
UPDATE word_frequencies 
SET pashto_word = 'وساتی' 
WHERE id = 40630 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتی' 
    AND wf2.id != 40630
);
UPDATE word_frequencies 
SET pashto_word = 'وساتې' 
WHERE id = 23399 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وساتې' 
    AND wf2.id != 23399
);
UPDATE word_frequencies 
SET pashto_word = 'وستلو' 
WHERE id = 39182 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وستلو' 
    AND wf2.id != 39182
);
UPDATE word_frequencies 
SET pashto_word = 'وسلې' 
WHERE id = 32496 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسلې' 
    AND wf2.id != 32496
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزول' 
WHERE id = 18813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزول' 
    AND wf2.id != 18813
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزوله' 
WHERE id = 23258 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزوله' 
    AND wf2.id != 23258
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزولو' 
WHERE id = 19169 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزولو' 
    AND wf2.id != 19169
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزولې' 
WHERE id = 23274 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزولې' 
    AND wf2.id != 23274
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزوه' 
WHERE id = 28693 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزوه' 
    AND wf2.id != 28693
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزوى' 
WHERE id = 14886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزوى' 
    AND wf2.id != 14886
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزوی' 
WHERE id = 41313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزوی' 
    AND wf2.id != 41313
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزوې' 
WHERE id = 40068 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزوې' 
    AND wf2.id != 40068
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزى' 
WHERE id = 21360 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزى' 
    AND wf2.id != 21360
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزېدلو' 
WHERE id = 39227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزېدلو' 
    AND wf2.id != 39227
);
UPDATE word_frequencies 
SET pashto_word = 'وسوزېدو' 
WHERE id = 28048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوزېدو' 
    AND wf2.id != 28048
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځاوه' 
WHERE id = 22675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځاوه' 
    AND wf2.id != 22675
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځول' 
WHERE id = 20260 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځول' 
    AND wf2.id != 20260
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځوله' 
WHERE id = 37816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځوله' 
    AND wf2.id != 37816
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځوم' 
WHERE id = 27519 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځوم' 
    AND wf2.id != 27519
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځوي' 
WHERE id = 18588 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځوي' 
    AND wf2.id != 18588
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځوی' 
WHERE id = 41658 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځوی' 
    AND wf2.id != 41658
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځي' 
WHERE id = 35786 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځي' 
    AND wf2.id != 35786
);
UPDATE word_frequencies 
SET pashto_word = 'وسوځېد' 
WHERE id = 29933 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسوځېد' 
    AND wf2.id != 29933
);
UPDATE word_frequencies 
SET pashto_word = 'وسپارل' 
WHERE id = 23495 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسپارل' 
    AND wf2.id != 23495
);
UPDATE word_frequencies 
SET pashto_word = 'وسپارله' 
WHERE id = 33533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسپارله' 
    AND wf2.id != 33533
);
UPDATE word_frequencies 
SET pashto_word = 'وسپارلو' 
WHERE id = 26572 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسپارلو' 
    AND wf2.id != 26572
);
UPDATE word_frequencies 
SET pashto_word = 'وسپاره' 
WHERE id = 23633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسپاره' 
    AND wf2.id != 23633
);
UPDATE word_frequencies 
SET pashto_word = 'وسپاري' 
WHERE id = 27012 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسپاري' 
    AND wf2.id != 27012
);
UPDATE word_frequencies 
SET pashto_word = 'وسیله' 
WHERE id = 29228 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وسیله' 
    AND wf2.id != 29228
);
UPDATE word_frequencies 
SET pashto_word = 'وشرموى' 
WHERE id = 30468 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشرموى' 
    AND wf2.id != 30468
);
UPDATE word_frequencies 
SET pashto_word = 'وشرميږى' 
WHERE id = 18073 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشرميږى' 
    AND wf2.id != 18073
);
UPDATE word_frequencies 
SET pashto_word = 'وشرمیږی' 
WHERE id = 40761 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشرمیږی' 
    AND wf2.id != 40761
);
UPDATE word_frequencies 
SET pashto_word = 'وشرمېدو' 
WHERE id = 37171 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشرمېدو' 
    AND wf2.id != 37171
);
UPDATE word_frequencies 
SET pashto_word = 'وشلوله' 
WHERE id = 37300 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلوله' 
    AND wf2.id != 37300
);
UPDATE word_frequencies 
SET pashto_word = 'وشلولې' 
WHERE id = 21283 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلولې' 
    AND wf2.id != 21283
);
UPDATE word_frequencies 
SET pashto_word = 'وشلوم' 
WHERE id = 36834 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلوم' 
    AND wf2.id != 36834
);
UPDATE word_frequencies 
SET pashto_word = 'وشلوى' 
WHERE id = 31814 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلوى' 
    AND wf2.id != 31814
);
UPDATE word_frequencies 
SET pashto_word = 'وشلوی' 
WHERE id = 41930 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلوی' 
    AND wf2.id != 41930
);
UPDATE word_frequencies 
SET pashto_word = 'وشليږى' 
WHERE id = 31416 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشليږى' 
    AND wf2.id != 31416
);
UPDATE word_frequencies 
SET pashto_word = 'وشلېدله' 
WHERE id = 39512 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشلېدله' 
    AND wf2.id != 39512
);
UPDATE word_frequencies 
SET pashto_word = 'وشمارى' 
WHERE id = 36820 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمارى' 
    AND wf2.id != 36820
);
UPDATE word_frequencies 
SET pashto_word = 'وشمېرل' 
WHERE id = 26086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمېرل' 
    AND wf2.id != 26086
);
UPDATE word_frequencies 
SET pashto_word = 'وشمېره' 
WHERE id = 23794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمېره' 
    AND wf2.id != 23794
);
UPDATE word_frequencies 
SET pashto_word = 'وشمېرى' 
WHERE id = 31394 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمېرى' 
    AND wf2.id != 31394
);
UPDATE word_frequencies 
SET pashto_word = 'وشمېري' 
WHERE id = 34676 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمېري' 
    AND wf2.id != 34676
);
UPDATE word_frequencies 
SET pashto_word = 'وشمېری' 
WHERE id = 42034 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشمېری' 
    AND wf2.id != 42034
);
UPDATE word_frequencies 
SET pashto_word = 'وشو' 
WHERE id = 14827 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشو' 
    AND wf2.id != 14827
);
UPDATE word_frequencies 
SET pashto_word = 'وشول' 
WHERE id = 14761 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشول' 
    AND wf2.id != 14761
);
UPDATE word_frequencies 
SET pashto_word = 'وشوه' 
WHERE id = 21731 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشوه' 
    AND wf2.id != 21731
);
UPDATE word_frequencies 
SET pashto_word = 'وشوکوی' 
WHERE id = 42131 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشوکوی' 
    AND wf2.id != 42131
);
UPDATE word_frequencies 
SET pashto_word = 'وشوې' 
WHERE id = 38069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشوې' 
    AND wf2.id != 38069
);
UPDATE word_frequencies 
SET pashto_word = 'وشى' 
WHERE id = 15603 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشى' 
    AND wf2.id != 15603
);
UPDATE word_frequencies 
SET pashto_word = 'وشي' 
WHERE id = 15927 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشي' 
    AND wf2.id != 15927
);
UPDATE word_frequencies 
SET pashto_word = 'وشينده' 
WHERE id = 32110 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشينده' 
    AND wf2.id != 32110
);
UPDATE word_frequencies 
SET pashto_word = 'وشيندى' 
WHERE id = 19695 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشيندى' 
    AND wf2.id != 19695
);
UPDATE word_frequencies 
SET pashto_word = 'وشُو' 
WHERE id = 30489 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشُو' 
    AND wf2.id != 30489
);
UPDATE word_frequencies 
SET pashto_word = 'وشړل' 
WHERE id = 15238 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړل' 
    AND wf2.id != 15238
);
UPDATE word_frequencies 
SET pashto_word = 'وشړلو' 
WHERE id = 25060 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړلو' 
    AND wf2.id != 25060
);
UPDATE word_frequencies 
SET pashto_word = 'وشړلې' 
WHERE id = 25613 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړلې' 
    AND wf2.id != 25613
);
UPDATE word_frequencies 
SET pashto_word = 'وشړم' 
WHERE id = 20029 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړم' 
    AND wf2.id != 20029
);
UPDATE word_frequencies 
SET pashto_word = 'وشړه' 
WHERE id = 21637 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړه' 
    AND wf2.id != 21637
);
UPDATE word_frequencies 
SET pashto_word = 'وشړو' 
WHERE id = 35975 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړو' 
    AND wf2.id != 35975
);
UPDATE word_frequencies 
SET pashto_word = 'وشړى' 
WHERE id = 20102 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړى' 
    AND wf2.id != 20102
);
UPDATE word_frequencies 
SET pashto_word = 'وشړي' 
WHERE id = 22582 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړي' 
    AND wf2.id != 22582
);
UPDATE word_frequencies 
SET pashto_word = 'وشړُو' 
WHERE id = 39524 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړُو' 
    AND wf2.id != 39524
);
UPDATE word_frequencies 
SET pashto_word = 'وشړی' 
WHERE id = 41230 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشړی' 
    AND wf2.id != 41230
);
UPDATE word_frequencies 
SET pashto_word = 'وشکول' 
WHERE id = 30332 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشکول' 
    AND wf2.id != 30332
);
UPDATE word_frequencies 
SET pashto_word = 'وشکولې' 
WHERE id = 35167 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشکولې' 
    AND wf2.id != 35167
);
UPDATE word_frequencies 
SET pashto_word = 'وشی' 
WHERE id = 40578 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشی' 
    AND wf2.id != 40578
);
UPDATE word_frequencies 
SET pashto_word = 'وشیندله' 
WHERE id = 34832 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشیندله' 
    AND wf2.id != 34832
);
UPDATE word_frequencies 
SET pashto_word = 'وشیندلې' 
WHERE id = 33851 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشیندلې' 
    AND wf2.id != 33851
);
UPDATE word_frequencies 
SET pashto_word = 'وشیندي' 
WHERE id = 27167 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وشیندي' 
    AND wf2.id != 27167
);
UPDATE word_frequencies 
SET pashto_word = 'وطن' 
WHERE id = 34385 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وطن' 
    AND wf2.id != 34385
);
UPDATE word_frequencies 
SET pashto_word = 'وطنداران' 
WHERE id = 36000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وطنداران' 
    AND wf2.id != 36000
);
UPDATE word_frequencies 
SET pashto_word = 'وطنه' 
WHERE id = 36659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وطنه' 
    AND wf2.id != 36659
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړم' 
WHERE id = 30872 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړم' 
    AND wf2.id != 30872
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړه' 
WHERE id = 36928 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړه' 
    AND wf2.id != 36928
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړى' 
WHERE id = 28649 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړى' 
    AND wf2.id != 28649
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړي' 
WHERE id = 20891 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړي' 
    AND wf2.id != 20891
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړی' 
WHERE id = 41543 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړی' 
    AND wf2.id != 41543
);
UPDATE word_frequencies 
SET pashto_word = 'وغواړې' 
WHERE id = 24995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغواړې' 
    AND wf2.id != 24995
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزول' 
WHERE id = 23945 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزول' 
    AND wf2.id != 23945
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزوله' 
WHERE id = 32034 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزوله' 
    AND wf2.id != 32034
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزولو' 
WHERE id = 19185 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزولو' 
    AND wf2.id != 19185
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزوم' 
WHERE id = 20581 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزوم' 
    AND wf2.id != 20581
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزوه' 
WHERE id = 31272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزوه' 
    AND wf2.id != 31272
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزوى' 
WHERE id = 22971 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزوى' 
    AND wf2.id != 22971
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزوی' 
WHERE id = 41404 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزوی' 
    AND wf2.id != 41404
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزيږى' 
WHERE id = 37012 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزيږى' 
    AND wf2.id != 37012
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزېدل' 
WHERE id = 30507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزېدل' 
    AND wf2.id != 30507
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزېدو' 
WHERE id = 39896 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزېدو' 
    AND wf2.id != 39896
);
UPDATE word_frequencies 
SET pashto_word = 'وغورزېدُو' 
WHERE id = 37895 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورزېدُو' 
    AND wf2.id != 37895
);
UPDATE word_frequencies 
SET pashto_word = 'وغوريږى' 
WHERE id = 37558 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوريږى' 
    AND wf2.id != 37558
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځاوه' 
WHERE id = 26759 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځاوه' 
    AND wf2.id != 26759
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځول' 
WHERE id = 23773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځول' 
    AND wf2.id != 23773
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځوم' 
WHERE id = 30123 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځوم' 
    AND wf2.id != 30123
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځوه' 
WHERE id = 34175 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځوه' 
    AND wf2.id != 34175
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځوي' 
WHERE id = 29848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځوي' 
    AND wf2.id != 29848
);
UPDATE word_frequencies 
SET pashto_word = 'وغورځېږه' 
WHERE id = 34271 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغورځېږه' 
    AND wf2.id != 34271
);
UPDATE word_frequencies 
SET pashto_word = 'وغولوي' 
WHERE id = 30114 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغولوي' 
    AND wf2.id != 30114
);
UPDATE word_frequencies 
SET pashto_word = 'وغوړوى' 
WHERE id = 36936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوړوى' 
    AND wf2.id != 36936
);
UPDATE word_frequencies 
SET pashto_word = 'وغوښت' 
WHERE id = 21593 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوښت' 
    AND wf2.id != 21593
);
UPDATE word_frequencies 
SET pashto_word = 'وغوښتله' 
WHERE id = 27004 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوښتله' 
    AND wf2.id != 27004
);
UPDATE word_frequencies 
SET pashto_word = 'وغوښتلو' 
WHERE id = 28709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوښتلو' 
    AND wf2.id != 28709
);
UPDATE word_frequencies 
SET pashto_word = 'وغوښته' 
WHERE id = 29159 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوښته' 
    AND wf2.id != 29159
);
UPDATE word_frequencies 
SET pashto_word = 'وغوښتو' 
WHERE id = 24629 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغوښتو' 
    AND wf2.id != 24629
);
UPDATE word_frequencies 
SET pashto_word = 'وغړمبيږى' 
WHERE id = 31430 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغړمبيږى' 
    AND wf2.id != 31430
);
UPDATE word_frequencies 
SET pashto_word = 'وغړمبېدو' 
WHERE id = 36520 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغړمبېدو' 
    AND wf2.id != 36520
);
UPDATE word_frequencies 
SET pashto_word = 'وغړوى' 
WHERE id = 37305 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغړوى' 
    AND wf2.id != 37305
);
UPDATE word_frequencies 
SET pashto_word = 'وغړيږى' 
WHERE id = 38930 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغړيږى' 
    AND wf2.id != 38930
);
UPDATE word_frequencies 
SET pashto_word = 'وغږولې' 
WHERE id = 32387 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغږولې' 
    AND wf2.id != 32387
);
UPDATE word_frequencies 
SET pashto_word = 'وغږوى' 
WHERE id = 38898 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغږوى' 
    AND wf2.id != 38898
);
UPDATE word_frequencies 
SET pashto_word = 'وغږوی' 
WHERE id = 41353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغږوی' 
    AND wf2.id != 41353
);
UPDATE word_frequencies 
SET pashto_word = 'وغږيږى' 
WHERE id = 28742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وغږيږى' 
    AND wf2.id != 28742
);
UPDATE word_frequencies 
SET pashto_word = 'وفرمایى' 
WHERE id = 41965 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وفرمایى' 
    AND wf2.id != 41965
);
UPDATE word_frequencies 
SET pashto_word = 'وفرمایيل' 
WHERE id = 41091 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وفرمایيل' 
    AND wf2.id != 41091
);
UPDATE word_frequencies 
SET pashto_word = 'ولرم' 
WHERE id = 33395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولرم' 
    AND wf2.id != 33395
);
UPDATE word_frequencies 
SET pashto_word = 'ولرو' 
WHERE id = 27318 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولرو' 
    AND wf2.id != 27318
);
UPDATE word_frequencies 
SET pashto_word = 'ولرى' 
WHERE id = 28245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولرى' 
    AND wf2.id != 28245
);
UPDATE word_frequencies 
SET pashto_word = 'ولري' 
WHERE id = 15884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولري' 
    AND wf2.id != 15884
);
UPDATE word_frequencies 
SET pashto_word = 'ولری' 
WHERE id = 41083 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولری' 
    AND wf2.id != 41083
);
UPDATE word_frequencies 
SET pashto_word = 'ولرې' 
WHERE id = 27212 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولرې' 
    AND wf2.id != 27212
);
UPDATE word_frequencies 
SET pashto_word = 'ولمانځه' 
WHERE id = 25353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولمانځه' 
    AND wf2.id != 25353
);
UPDATE word_frequencies 
SET pashto_word = 'ولمانځي' 
WHERE id = 21819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولمانځي' 
    AND wf2.id != 21819
);
UPDATE word_frequencies 
SET pashto_word = 'ولمانځی' 
WHERE id = 41407 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولمانځی' 
    AND wf2.id != 41407
);
UPDATE word_frequencies 
SET pashto_word = 'ولوست' 
WHERE id = 34952 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوست' 
    AND wf2.id != 34952
);
UPDATE word_frequencies 
SET pashto_word = 'ولوستل' 
WHERE id = 37723 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوستل' 
    AND wf2.id != 37723
);
UPDATE word_frequencies 
SET pashto_word = 'ولوستلو' 
WHERE id = 20605 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوستلو' 
    AND wf2.id != 20605
);
UPDATE word_frequencies 
SET pashto_word = 'ولوغړېږی' 
WHERE id = 41982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوغړېږی' 
    AND wf2.id != 41982
);
UPDATE word_frequencies 
SET pashto_word = 'ولوله' 
WHERE id = 37098 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوله' 
    AND wf2.id != 37098
);
UPDATE word_frequencies 
SET pashto_word = 'ولولی' 
WHERE id = 41904 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولولی' 
    AND wf2.id != 41904
);
UPDATE word_frequencies 
SET pashto_word = 'ولویږي' 
WHERE id = 23517 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولویږي' 
    AND wf2.id != 23517
);
UPDATE word_frequencies 
SET pashto_word = 'ولوېد' 
WHERE id = 29877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوېد' 
    AND wf2.id != 29877
);
UPDATE word_frequencies 
SET pashto_word = 'ولوېدل' 
WHERE id = 33228 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولوېدل' 
    AND wf2.id != 33228
);
UPDATE word_frequencies 
SET pashto_word = 'ولى' 
WHERE id = 29029 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولى' 
    AND wf2.id != 29029
);
UPDATE word_frequencies 
SET pashto_word = 'وليدل' 
WHERE id = 16352 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليدل' 
    AND wf2.id != 16352
);
UPDATE word_frequencies 
SET pashto_word = 'وليدله' 
WHERE id = 21134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليدله' 
    AND wf2.id != 21134
);
UPDATE word_frequencies 
SET pashto_word = 'وليدلو' 
WHERE id = 17512 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليدلو' 
    AND wf2.id != 17512
);
UPDATE word_frequencies 
SET pashto_word = 'وليده' 
WHERE id = 20147 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليده' 
    AND wf2.id != 20147
);
UPDATE word_frequencies 
SET pashto_word = 'وليدو' 
WHERE id = 16866 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليدو' 
    AND wf2.id != 16866
);
UPDATE word_frequencies 
SET pashto_word = 'وليدې' 
WHERE id = 39046 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليدې' 
    AND wf2.id != 39046
);
UPDATE word_frequencies 
SET pashto_word = 'وليکل' 
WHERE id = 17822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليکل' 
    AND wf2.id != 17822
);
UPDATE word_frequencies 
SET pashto_word = 'وليکلو' 
WHERE id = 25485 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليکلو' 
    AND wf2.id != 25485
);
UPDATE word_frequencies 
SET pashto_word = 'وليکم' 
WHERE id = 26145 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليکم' 
    AND wf2.id != 26145
);
UPDATE word_frequencies 
SET pashto_word = 'وليکه' 
WHERE id = 20063 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليکه' 
    AND wf2.id != 20063
);
UPDATE word_frequencies 
SET pashto_word = 'وليکى' 
WHERE id = 32173 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وليکى' 
    AND wf2.id != 32173
);
UPDATE word_frequencies 
SET pashto_word = 'ولټوله' 
WHERE id = 39124 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټوله' 
    AND wf2.id != 39124
);
UPDATE word_frequencies 
SET pashto_word = 'ولټولو' 
WHERE id = 31790 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټولو' 
    AND wf2.id != 31790
);
UPDATE word_frequencies 
SET pashto_word = 'ولټومه' 
WHERE id = 38659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټومه' 
    AND wf2.id != 38659
);
UPDATE word_frequencies 
SET pashto_word = 'ولټوه' 
WHERE id = 31215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټوه' 
    AND wf2.id != 31215
);
UPDATE word_frequencies 
SET pashto_word = 'ولټوى' 
WHERE id = 36709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټوى' 
    AND wf2.id != 36709
);
UPDATE word_frequencies 
SET pashto_word = 'ولټوُو' 
WHERE id = 40183 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټوُو' 
    AND wf2.id != 40183
);
UPDATE word_frequencies 
SET pashto_word = 'ولټوی' 
WHERE id = 40799 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولټوی' 
    AND wf2.id != 40799
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزول' 
WHERE id = 33295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزول' 
    AND wf2.id != 33295
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزوم' 
WHERE id = 36105 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزوم' 
    AND wf2.id != 36105
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزوي' 
WHERE id = 35799 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزوي' 
    AND wf2.id != 35799
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزيږى' 
WHERE id = 23097 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزيږى' 
    AND wf2.id != 23097
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزیږي' 
WHERE id = 21030 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزیږي' 
    AND wf2.id != 21030
);
UPDATE word_frequencies 
SET pashto_word = 'ولړزېدل' 
WHERE id = 39806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولړزېدل' 
    AND wf2.id != 39806
);
UPDATE word_frequencies 
SET pashto_word = 'ولګاوه' 
WHERE id = 29486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګاوه' 
    AND wf2.id != 29486
);
UPDATE word_frequencies 
SET pashto_word = 'ولګول' 
WHERE id = 19001 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګول' 
    AND wf2.id != 19001
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوله' 
WHERE id = 20107 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوله' 
    AND wf2.id != 20107
);
UPDATE word_frequencies 
SET pashto_word = 'ولګولو' 
WHERE id = 18777 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګولو' 
    AND wf2.id != 18777
);
UPDATE word_frequencies 
SET pashto_word = 'ولګولې' 
WHERE id = 14965 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګولې' 
    AND wf2.id != 14965
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوم' 
WHERE id = 25792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوم' 
    AND wf2.id != 25792
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوه' 
WHERE id = 21865 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوه' 
    AND wf2.id != 21865
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوى' 
WHERE id = 18044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوى' 
    AND wf2.id != 18044
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوي' 
WHERE id = 29680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوي' 
    AND wf2.id != 29680
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوی' 
WHERE id = 41345 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوی' 
    AND wf2.id != 41345
);
UPDATE word_frequencies 
SET pashto_word = 'ولګوې' 
WHERE id = 37451 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګوې' 
    AND wf2.id != 37451
);
UPDATE word_frequencies 
SET pashto_word = 'ولګى' 
WHERE id = 18094 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګى' 
    AND wf2.id != 18094
);
UPDATE word_frequencies 
SET pashto_word = 'ولګی' 
WHERE id = 41998 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګی' 
    AND wf2.id != 41998
);
UPDATE word_frequencies 
SET pashto_word = 'ولګیږی' 
WHERE id = 40869 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګیږی' 
    AND wf2.id != 40869
);
UPDATE word_frequencies 
SET pashto_word = 'ولګېدل' 
WHERE id = 30263 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګېدل' 
    AND wf2.id != 30263
);
UPDATE word_frequencies 
SET pashto_word = 'ولګېدلې' 
WHERE id = 34808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګېدلې' 
    AND wf2.id != 34808
);
UPDATE word_frequencies 
SET pashto_word = 'ولګېده' 
WHERE id = 27375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګېده' 
    AND wf2.id != 27375
);
UPDATE word_frequencies 
SET pashto_word = 'ولګېدو' 
WHERE id = 28717 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولګېدو' 
    AND wf2.id != 28717
);
UPDATE word_frequencies 
SET pashto_word = 'ولیدل' 
WHERE id = 21721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیدل' 
    AND wf2.id != 21721
);
UPDATE word_frequencies 
SET pashto_word = 'ولیدله' 
WHERE id = 17903 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیدله' 
    AND wf2.id != 17903
);
UPDATE word_frequencies 
SET pashto_word = 'ولیدلې' 
WHERE id = 30712 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیدلې' 
    AND wf2.id != 30712
);
UPDATE word_frequencies 
SET pashto_word = 'ولیده' 
WHERE id = 22373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیده' 
    AND wf2.id != 22373
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکل' 
WHERE id = 25577 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکل' 
    AND wf2.id != 25577
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکلې' 
WHERE id = 34858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکلې' 
    AND wf2.id != 34858
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکم' 
WHERE id = 22390 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکم' 
    AND wf2.id != 22390
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکه' 
WHERE id = 21778 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکه' 
    AND wf2.id != 21778
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکي' 
WHERE id = 34136 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکي' 
    AND wf2.id != 34136
);
UPDATE word_frequencies 
SET pashto_word = 'ولیکی' 
WHERE id = 41319 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولیکی' 
    AND wf2.id != 41319
);
UPDATE word_frequencies 
SET pashto_word = 'ولې' 
WHERE id = 22939 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولې' 
    AND wf2.id != 22939
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږل' 
WHERE id = 14563 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږل' 
    AND wf2.id != 14563
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږلم' 
WHERE id = 31205 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږلم' 
    AND wf2.id != 31205
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږله' 
WHERE id = 24592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږله' 
    AND wf2.id != 24592
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږلو' 
WHERE id = 17297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږلو' 
    AND wf2.id != 17297
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږلې' 
WHERE id = 33225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږلې' 
    AND wf2.id != 33225
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږم' 
WHERE id = 24874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږم' 
    AND wf2.id != 24874
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږه' 
WHERE id = 18206 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږه' 
    AND wf2.id != 18206
);
UPDATE word_frequencies 
SET pashto_word = 'ولېږی' 
WHERE id = 40911 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ولېږی' 
    AND wf2.id != 40911
);
UPDATE word_frequencies 
SET pashto_word = 'وم' 
WHERE id = 13238 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وم' 
    AND wf2.id != 13238
);
UPDATE word_frequencies 
SET pashto_word = 'ومنله' 
WHERE id = 25246 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنله' 
    AND wf2.id != 25246
);
UPDATE word_frequencies 
SET pashto_word = 'ومنلو' 
WHERE id = 25819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنلو' 
    AND wf2.id != 25819
);
UPDATE word_frequencies 
SET pashto_word = 'ومنم' 
WHERE id = 36451 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنم' 
    AND wf2.id != 36451
);
UPDATE word_frequencies 
SET pashto_word = 'ومنو' 
WHERE id = 32269 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنو' 
    AND wf2.id != 32269
);
UPDATE word_frequencies 
SET pashto_word = 'ومنډلم' 
WHERE id = 37886 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنډلم' 
    AND wf2.id != 37886
);
UPDATE word_frequencies 
SET pashto_word = 'ومنی' 
WHERE id = 40810 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومنی' 
    AND wf2.id != 40810
);
UPDATE word_frequencies 
SET pashto_word = 'ومه' 
WHERE id = 28464 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومه' 
    AND wf2.id != 28464
);
UPDATE word_frequencies 
SET pashto_word = 'ومومم' 
WHERE id = 29604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومومم' 
    AND wf2.id != 29604
);
UPDATE word_frequencies 
SET pashto_word = 'ومومى' 
WHERE id = 17831 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومومى' 
    AND wf2.id != 17831
);
UPDATE word_frequencies 
SET pashto_word = 'ومومي' 
WHERE id = 17128 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومومي' 
    AND wf2.id != 17128
);
UPDATE word_frequencies 
SET pashto_word = 'ومومی' 
WHERE id = 41127 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومومی' 
    AND wf2.id != 41127
);
UPDATE word_frequencies 
SET pashto_word = 'ومومې' 
WHERE id = 22721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ومومې' 
    AND wf2.id != 22721
);
UPDATE word_frequencies 
SET pashto_word = 'وموند' 
WHERE id = 22497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموند' 
    AND wf2.id != 22497
);
UPDATE word_frequencies 
SET pashto_word = 'وموندل' 
WHERE id = 22522 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموندل' 
    AND wf2.id != 22522
);
UPDATE word_frequencies 
SET pashto_word = 'وموندله' 
WHERE id = 19105 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموندله' 
    AND wf2.id != 19105
);
UPDATE word_frequencies 
SET pashto_word = 'وموندلو' 
WHERE id = 26568 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموندلو' 
    AND wf2.id != 26568
);
UPDATE word_frequencies 
SET pashto_word = 'وموندلې' 
WHERE id = 31969 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموندلې' 
    AND wf2.id != 31969
);
UPDATE word_frequencies 
SET pashto_word = 'وموندو' 
WHERE id = 32349 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وموندو' 
    AND wf2.id != 32349
);
UPDATE word_frequencies 
SET pashto_word = 'ونغښتلمه' 
WHERE id = 38647 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونغښتلمه' 
    AND wf2.id != 38647
);
UPDATE word_frequencies 
SET pashto_word = 'ونه' 
WHERE id = 38794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونه' 
    AND wf2.id != 38794
);
UPDATE word_frequencies 
SET pashto_word = 'ونو' 
WHERE id = 24076 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونو' 
    AND wf2.id != 24076
);
UPDATE word_frequencies 
SET pashto_word = 'ونوستله' 
WHERE id = 30516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونوستله' 
    AND wf2.id != 30516
);
UPDATE word_frequencies 
SET pashto_word = 'ونيسم' 
WHERE id = 28540 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيسم' 
    AND wf2.id != 28540
);
UPDATE word_frequencies 
SET pashto_word = 'ونيسه' 
WHERE id = 18364 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيسه' 
    AND wf2.id != 18364
);
UPDATE word_frequencies 
SET pashto_word = 'ونيسى' 
WHERE id = 21246 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيسى' 
    AND wf2.id != 21246
);
UPDATE word_frequencies 
SET pashto_word = 'ونيول' 
WHERE id = 19700 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيول' 
    AND wf2.id != 19700
);
UPDATE word_frequencies 
SET pashto_word = 'ونيولم' 
WHERE id = 31791 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيولم' 
    AND wf2.id != 31791
);
UPDATE word_frequencies 
SET pashto_word = 'ونيوله' 
WHERE id = 18678 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيوله' 
    AND wf2.id != 18678
);
UPDATE word_frequencies 
SET pashto_word = 'ونيولو' 
WHERE id = 18079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونيولو' 
    AND wf2.id != 18079
);
UPDATE word_frequencies 
SET pashto_word = 'ونښتله' 
WHERE id = 33432 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښتله' 
    AND wf2.id != 33432
);
UPDATE word_frequencies 
SET pashto_word = 'ونښتو' 
WHERE id = 32456 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښتو' 
    AND wf2.id != 32456
);
UPDATE word_frequencies 
SET pashto_word = 'ونښلول' 
WHERE id = 30675 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښلول' 
    AND wf2.id != 30675
);
UPDATE word_frequencies 
SET pashto_word = 'ونښلولې' 
WHERE id = 39391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښلولې' 
    AND wf2.id != 39391
);
UPDATE word_frequencies 
SET pashto_word = 'ونښلوم' 
WHERE id = 35828 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښلوم' 
    AND wf2.id != 35828
);
UPDATE word_frequencies 
SET pashto_word = 'ونښلوه' 
WHERE id = 32101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښلوه' 
    AND wf2.id != 32101
);
UPDATE word_frequencies 
SET pashto_word = 'ونښلوى' 
WHERE id = 39329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونښلوى' 
    AND wf2.id != 39329
);
UPDATE word_frequencies 
SET pashto_word = 'ونیسه' 
WHERE id = 38541 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیسه' 
    AND wf2.id != 38541
);
UPDATE word_frequencies 
SET pashto_word = 'ونیسو' 
WHERE id = 26873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیسو' 
    AND wf2.id != 26873
);
UPDATE word_frequencies 
SET pashto_word = 'ونیسي' 
WHERE id = 34648 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیسي' 
    AND wf2.id != 34648
);
UPDATE word_frequencies 
SET pashto_word = 'ونیسی' 
WHERE id = 41066 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیسی' 
    AND wf2.id != 41066
);
UPDATE word_frequencies 
SET pashto_word = 'ونیسې' 
WHERE id = 35874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیسې' 
    AND wf2.id != 35874
);
UPDATE word_frequencies 
SET pashto_word = 'ونیول' 
WHERE id = 18658 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیول' 
    AND wf2.id != 18658
);
UPDATE word_frequencies 
SET pashto_word = 'ونیوله' 
WHERE id = 18668 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیوله' 
    AND wf2.id != 18668
);
UPDATE word_frequencies 
SET pashto_word = 'ونیوه' 
WHERE id = 17387 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونیوه' 
    AND wf2.id != 17387
);
UPDATE word_frequencies 
SET pashto_word = 'ونې' 
WHERE id = 23174 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ونې' 
    AND wf2.id != 23174
);
UPDATE word_frequencies 
SET pashto_word = 'وه' 
WHERE id = 39972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وه' 
    AND wf2.id != 39972
);
UPDATE word_frequencies 
SET pashto_word = 'وهل' 
WHERE id = 29360 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهل' 
    AND wf2.id != 29360
);
UPDATE word_frequencies 
SET pashto_word = 'وهله' 
WHERE id = 30334 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهله' 
    AND wf2.id != 30334
);
UPDATE word_frequencies 
SET pashto_word = 'وهلو' 
WHERE id = 32342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهلو' 
    AND wf2.id != 32342
);
UPDATE word_frequencies 
SET pashto_word = 'وهلی' 
WHERE id = 40936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهلی' 
    AND wf2.id != 40936
);
UPDATE word_frequencies 
SET pashto_word = 'وهلې' 
WHERE id = 16439 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهلې' 
    AND wf2.id != 16439
);
UPDATE word_frequencies 
SET pashto_word = 'وهم' 
WHERE id = 24150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهم' 
    AND wf2.id != 24150
);
UPDATE word_frequencies 
SET pashto_word = 'وهي' 
WHERE id = 36161 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهي' 
    AND wf2.id != 36161
);
UPDATE word_frequencies 
SET pashto_word = 'وهينه' 
WHERE id = 38651 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهينه' 
    AND wf2.id != 38651
);
UPDATE word_frequencies 
SET pashto_word = 'وهی' 
WHERE id = 40622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وهی' 
    AND wf2.id != 40622
);
UPDATE word_frequencies 
SET pashto_word = 'وو' 
WHERE id = 35003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وو' 
    AND wf2.id != 35003
);
UPDATE word_frequencies 
SET pashto_word = 'ووائې' 
WHERE id = 28168 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووائې' 
    AND wf2.id != 28168
);
UPDATE word_frequencies 
SET pashto_word = 'وواهه' 
WHERE id = 33312 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وواهه' 
    AND wf2.id != 33312
);
UPDATE word_frequencies 
SET pashto_word = 'ووايم' 
WHERE id = 19195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووايم' 
    AND wf2.id != 19195
);
UPDATE word_frequencies 
SET pashto_word = 'ووايه' 
WHERE id = 17273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووايه' 
    AND wf2.id != 17273
);
UPDATE word_frequencies 
SET pashto_word = 'ووايو' 
WHERE id = 24311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووايو' 
    AND wf2.id != 24311
);
UPDATE word_frequencies 
SET pashto_word = 'ووايی' 
WHERE id = 41098 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووايی' 
    AND wf2.id != 41098
);
UPDATE word_frequencies 
SET pashto_word = 'وواژه' 
WHERE id = 17137 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وواژه' 
    AND wf2.id != 17137
);
UPDATE word_frequencies 
SET pashto_word = 'ووایم' 
WHERE id = 26769 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایم' 
    AND wf2.id != 26769
);
UPDATE word_frequencies 
SET pashto_word = 'ووایه' 
WHERE id = 38271 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایه' 
    AND wf2.id != 38271
);
UPDATE word_frequencies 
SET pashto_word = 'ووایو' 
WHERE id = 33162 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایو' 
    AND wf2.id != 33162
);
UPDATE word_frequencies 
SET pashto_word = 'ووایى' 
WHERE id = 41074 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایى' 
    AND wf2.id != 41074
);
UPDATE word_frequencies 
SET pashto_word = 'ووایي' 
WHERE id = 16148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایي' 
    AND wf2.id != 16148
);
UPDATE word_frequencies 
SET pashto_word = 'ووایی' 
WHERE id = 41336 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایی' 
    AND wf2.id != 41336
);
UPDATE word_frequencies 
SET pashto_word = 'ووایې' 
WHERE id = 29742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووایې' 
    AND wf2.id != 29742
);
UPDATE word_frequencies 
SET pashto_word = 'ووت' 
WHERE id = 21643 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووت' 
    AND wf2.id != 21643
);
UPDATE word_frequencies 
SET pashto_word = 'ووتل' 
WHERE id = 22650 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووتل' 
    AND wf2.id != 22650
);
UPDATE word_frequencies 
SET pashto_word = 'ووتله' 
WHERE id = 22130 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووتله' 
    AND wf2.id != 22130
);
UPDATE word_frequencies 
SET pashto_word = 'ووتلو' 
WHERE id = 32324 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووتلو' 
    AND wf2.id != 32324
);
UPDATE word_frequencies 
SET pashto_word = 'ووتو' 
WHERE id = 29174 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووتو' 
    AND wf2.id != 29174
);
UPDATE word_frequencies 
SET pashto_word = 'ووراوه' 
WHERE id = 33518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووراوه' 
    AND wf2.id != 33518
);
UPDATE word_frequencies 
SET pashto_word = 'ووروم' 
WHERE id = 36116 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووروم' 
    AND wf2.id != 36116
);
UPDATE word_frequencies 
SET pashto_word = 'ووروى' 
WHERE id = 37417 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووروى' 
    AND wf2.id != 37417
);
UPDATE word_frequencies 
SET pashto_word = 'ووروي' 
WHERE id = 30346 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووروي' 
    AND wf2.id != 30346
);
UPDATE word_frequencies 
SET pashto_word = 'وورېږه' 
WHERE id = 28223 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وورېږه' 
    AND wf2.id != 28223
);
UPDATE word_frequencies 
SET pashto_word = 'وولى' 
WHERE id = 24307 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وولى' 
    AND wf2.id != 24307
);
UPDATE word_frequencies 
SET pashto_word = 'وونه' 
WHERE id = 28500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وونه' 
    AND wf2.id != 28500
);
UPDATE word_frequencies 
SET pashto_word = 'ووهل' 
WHERE id = 27061 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهل' 
    AND wf2.id != 27061
);
UPDATE word_frequencies 
SET pashto_word = 'ووهله' 
WHERE id = 28023 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهله' 
    AND wf2.id != 28023
);
UPDATE word_frequencies 
SET pashto_word = 'ووهلو' 
WHERE id = 22306 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهلو' 
    AND wf2.id != 22306
);
UPDATE word_frequencies 
SET pashto_word = 'ووهلې' 
WHERE id = 21767 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهلې' 
    AND wf2.id != 21767
);
UPDATE word_frequencies 
SET pashto_word = 'ووهم' 
WHERE id = 27905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهم' 
    AND wf2.id != 27905
);
UPDATE word_frequencies 
SET pashto_word = 'ووهه' 
WHERE id = 33982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهه' 
    AND wf2.id != 33982
);
UPDATE word_frequencies 
SET pashto_word = 'ووهو' 
WHERE id = 30237 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهو' 
    AND wf2.id != 30237
);
UPDATE word_frequencies 
SET pashto_word = 'ووهى' 
WHERE id = 21381 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهى' 
    AND wf2.id != 21381
);
UPDATE word_frequencies 
SET pashto_word = 'ووهي' 
WHERE id = 20253 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهي' 
    AND wf2.id != 20253
);
UPDATE word_frequencies 
SET pashto_word = 'ووهی' 
WHERE id = 41227 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووهی' 
    AND wf2.id != 41227
);
UPDATE word_frequencies 
SET pashto_word = 'وويستل' 
WHERE id = 28027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وويستل' 
    AND wf2.id != 28027
);
UPDATE word_frequencies 
SET pashto_word = 'وويستلو' 
WHERE id = 39728 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وويستلو' 
    AND wf2.id != 39728
);
UPDATE word_frequencies 
SET pashto_word = 'وويستلې' 
WHERE id = 32352 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وويستلې' 
    AND wf2.id != 32352
);
UPDATE word_frequencies 
SET pashto_word = 'وويشتم' 
WHERE id = 28320 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وويشتم' 
    AND wf2.id != 28320
);
UPDATE word_frequencies 
SET pashto_word = 'وويشتو' 
WHERE id = 39939 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وويشتو' 
    AND wf2.id != 39939
);
UPDATE word_frequencies 
SET pashto_word = 'ووينى' 
WHERE id = 21423 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووينى' 
    AND wf2.id != 21423
);
UPDATE word_frequencies 
SET pashto_word = 'ووينځه' 
WHERE id = 28124 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووينځه' 
    AND wf2.id != 28124
);
UPDATE word_frequencies 
SET pashto_word = 'ووينځی' 
WHERE id = 41679 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووينځی' 
    AND wf2.id != 41679
);
UPDATE word_frequencies 
SET pashto_word = 'ووينې' 
WHERE id = 36632 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووينې' 
    AND wf2.id != 36632
);
UPDATE word_frequencies 
SET pashto_word = 'ووځي' 
WHERE id = 22426 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووځي' 
    AND wf2.id != 22426
);
UPDATE word_frequencies 
SET pashto_word = 'ووځی' 
WHERE id = 40759 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووځی' 
    AND wf2.id != 40759
);
UPDATE word_frequencies 
SET pashto_word = 'ووژل' 
WHERE id = 12937 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژل' 
    AND wf2.id != 12937
);
UPDATE word_frequencies 
SET pashto_word = 'ووژله' 
WHERE id = 23845 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژله' 
    AND wf2.id != 23845
);
UPDATE word_frequencies 
SET pashto_word = 'ووژلو' 
WHERE id = 14966 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژلو' 
    AND wf2.id != 14966
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنم' 
WHERE id = 18331 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنم' 
    AND wf2.id != 18331
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنه' 
WHERE id = 20658 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنه' 
    AND wf2.id != 20658
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنو' 
WHERE id = 33433 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنو' 
    AND wf2.id != 33433
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنى' 
WHERE id = 20110 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنى' 
    AND wf2.id != 20110
);
UPDATE word_frequencies 
SET pashto_word = 'ووژني' 
WHERE id = 17407 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژني' 
    AND wf2.id != 17407
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنی' 
WHERE id = 41400 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنی' 
    AND wf2.id != 41400
);
UPDATE word_frequencies 
SET pashto_word = 'ووژنې' 
WHERE id = 27441 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووژنې' 
    AND wf2.id != 27441
);
UPDATE word_frequencies 
SET pashto_word = 'وویست' 
WHERE id = 29286 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویست' 
    AND wf2.id != 29286
);
UPDATE word_frequencies 
SET pashto_word = 'وویستل' 
WHERE id = 26690 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویستل' 
    AND wf2.id != 26690
);
UPDATE word_frequencies 
SET pashto_word = 'وویستله' 
WHERE id = 34443 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویستله' 
    AND wf2.id != 34443
);
UPDATE word_frequencies 
SET pashto_word = 'وویل' 
WHERE id = 16160 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویل' 
    AND wf2.id != 16160
);
UPDATE word_frequencies 
SET pashto_word = 'وویله' 
WHERE id = 20855 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویله' 
    AND wf2.id != 20855
);
UPDATE word_frequencies 
SET pashto_word = 'وویلې' 
WHERE id = 29873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویلې' 
    AND wf2.id != 29873
);
UPDATE word_frequencies 
SET pashto_word = 'ووینم' 
WHERE id = 29736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووینم' 
    AND wf2.id != 29736
);
UPDATE word_frequencies 
SET pashto_word = 'وویني' 
WHERE id = 19812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویني' 
    AND wf2.id != 19812
);
UPDATE word_frequencies 
SET pashto_word = 'ووینځلې' 
WHERE id = 33777 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووینځلې' 
    AND wf2.id != 33777
);
UPDATE word_frequencies 
SET pashto_word = 'ووینځی' 
WHERE id = 40677 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووینځی' 
    AND wf2.id != 40677
);
UPDATE word_frequencies 
SET pashto_word = 'ووینی' 
WHERE id = 40638 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووینی' 
    AND wf2.id != 40638
);
UPDATE word_frequencies 
SET pashto_word = 'ووینې' 
WHERE id = 27667 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووینې' 
    AND wf2.id != 27667
);
UPDATE word_frequencies 
SET pashto_word = 'وویيل' 
WHERE id = 41037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویيل' 
    AND wf2.id != 41037
);
UPDATE word_frequencies 
SET pashto_word = 'وویيله' 
WHERE id = 41168 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویيله' 
    AND wf2.id != 41168
);
UPDATE word_frequencies 
SET pashto_word = 'وویيلو' 
WHERE id = 41125 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وویيلو' 
    AND wf2.id != 41125
);
UPDATE word_frequencies 
SET pashto_word = 'ووېرول' 
WHERE id = 37573 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېرول' 
    AND wf2.id != 37573
);
UPDATE word_frequencies 
SET pashto_word = 'ووېروي' 
WHERE id = 35846 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېروي' 
    AND wf2.id != 35846
);
UPDATE word_frequencies 
SET pashto_word = 'ووېریږي' 
WHERE id = 30580 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېریږي' 
    AND wf2.id != 30580
);
UPDATE word_frequencies 
SET pashto_word = 'ووېرېدل' 
WHERE id = 18913 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېرېدل' 
    AND wf2.id != 18913
);
UPDATE word_frequencies 
SET pashto_word = 'ووېرېده' 
WHERE id = 26733 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېرېده' 
    AND wf2.id != 26733
);
UPDATE word_frequencies 
SET pashto_word = 'ووېرېږی' 
WHERE id = 41916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېرېږی' 
    AND wf2.id != 41916
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشل' 
WHERE id = 23722 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشل' 
    AND wf2.id != 23722
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشله' 
WHERE id = 30438 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشله' 
    AND wf2.id != 30438
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشلې' 
WHERE id = 26978 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشلې' 
    AND wf2.id != 26978
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشه' 
WHERE id = 27027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشه' 
    AND wf2.id != 27027
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشي' 
WHERE id = 27005 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشي' 
    AND wf2.id != 27005
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشی' 
WHERE id = 41837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشی' 
    AND wf2.id != 41837
);
UPDATE word_frequencies 
SET pashto_word = 'ووېشې' 
WHERE id = 37597 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ووېشې' 
    AND wf2.id != 37597
);
UPDATE word_frequencies 
SET pashto_word = 'وي' 
WHERE id = 21513 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وي' 
    AND wf2.id != 21513
);
UPDATE word_frequencies 
SET pashto_word = 'ويرولم' 
WHERE id = 23949 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويرولم' 
    AND wf2.id != 23949
);
UPDATE word_frequencies 
SET pashto_word = 'ويروم' 
WHERE id = 36627 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويروم' 
    AND wf2.id != 36627
);
UPDATE word_frequencies 
SET pashto_word = 'ويروى' 
WHERE id = 24316 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويروى' 
    AND wf2.id != 24316
);
UPDATE word_frequencies 
SET pashto_word = 'ويريږى' 
WHERE id = 25875 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويريږى' 
    AND wf2.id != 25875
);
UPDATE word_frequencies 
SET pashto_word = 'ويرېدل' 
WHERE id = 20152 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويرېدل' 
    AND wf2.id != 20152
);
UPDATE word_frequencies 
SET pashto_word = 'ويرېدو' 
WHERE id = 32403 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويرېدو' 
    AND wf2.id != 32403
);
UPDATE word_frequencies 
SET pashto_word = 'ويرېدی' 
WHERE id = 42019 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويرېدی' 
    AND wf2.id != 42019
);
UPDATE word_frequencies 
SET pashto_word = 'ويرېږی' 
WHERE id = 41978 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويرېږی' 
    AND wf2.id != 41978
);
UPDATE word_frequencies 
SET pashto_word = 'ويستل' 
WHERE id = 39129 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ويستل' 
    AND wf2.id != 39129
);
UPDATE word_frequencies 
SET pashto_word = 'وينم' 
WHERE id = 24126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينم' 
    AND wf2.id != 24126
);
UPDATE word_frequencies 
SET pashto_word = 'وينه' 
WHERE id = 15415 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينه' 
    AND wf2.id != 15415
);
UPDATE word_frequencies 
SET pashto_word = 'وينى' 
WHERE id = 17843 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينى' 
    AND wf2.id != 17843
);
UPDATE word_frequencies 
SET pashto_word = 'وينځى' 
WHERE id = 39216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينځى' 
    AND wf2.id != 39216
);
UPDATE word_frequencies 
SET pashto_word = 'وينځی' 
WHERE id = 41740 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينځی' 
    AND wf2.id != 41740
);
UPDATE word_frequencies 
SET pashto_word = 'وينځې' 
WHERE id = 31905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينځې' 
    AND wf2.id != 31905
);
UPDATE word_frequencies 
SET pashto_word = 'وينی' 
WHERE id = 41239 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وينی' 
    AND wf2.id != 41239
);
UPDATE word_frequencies 
SET pashto_word = 'وُو' 
WHERE id = 11581 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وُو' 
    AND wf2.id != 11581
);
UPDATE word_frequencies 
SET pashto_word = 'وُونه' 
WHERE id = 38783 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وُونه' 
    AND wf2.id != 38783
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکل' 
WHERE id = 21537 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکل' 
    AND wf2.id != 21537
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکلې' 
WHERE id = 35148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکلې' 
    AND wf2.id != 35148
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکه' 
WHERE id = 16957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکه' 
    AND wf2.id != 16957
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکو' 
WHERE id = 34891 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکو' 
    AND wf2.id != 34891
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکي' 
WHERE id = 31500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکي' 
    AND wf2.id != 31500
);
UPDATE word_frequencies 
SET pashto_word = 'وټاکی' 
WHERE id = 41659 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټاکی' 
    AND wf2.id != 41659
);
UPDATE word_frequencies 
SET pashto_word = 'وټکول' 
WHERE id = 38612 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټکول' 
    AND wf2.id != 38612
);
UPDATE word_frequencies 
SET pashto_word = 'وټکوي' 
WHERE id = 29712 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وټکوي' 
    AND wf2.id != 29712
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژانده' 
WHERE id = 34134 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژانده' 
    AND wf2.id != 34134
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژندل' 
WHERE id = 39178 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژندل' 
    AND wf2.id != 39178
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژنم' 
WHERE id = 40079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژنم' 
    AND wf2.id != 40079
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژنه' 
WHERE id = 31163 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژنه' 
    AND wf2.id != 31163
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژنو' 
WHERE id = 36157 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژنو' 
    AND wf2.id != 36157
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژني' 
WHERE id = 23622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژني' 
    AND wf2.id != 23622
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژنی' 
WHERE id = 41258 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژنی' 
    AND wf2.id != 41258
);
UPDATE word_frequencies 
SET pashto_word = 'وپېژنې' 
WHERE id = 38267 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وپېژنې' 
    AND wf2.id != 38267
);
UPDATE word_frequencies 
SET pashto_word = 'وځلوه' 
WHERE id = 29018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځلوه' 
    AND wf2.id != 29018
);
UPDATE word_frequencies 
SET pashto_word = 'وځلیږی' 
WHERE id = 40867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځلیږی' 
    AND wf2.id != 40867
);
UPDATE word_frequencies 
SET pashto_word = 'وځلېدله' 
WHERE id = 23431 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځلېدله' 
    AND wf2.id != 23431
);
UPDATE word_frequencies 
SET pashto_word = 'وځلېده' 
WHERE id = 29177 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځلېده' 
    AND wf2.id != 29177
);
UPDATE word_frequencies 
SET pashto_word = 'وځلېږی' 
WHERE id = 41858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځلېږی' 
    AND wf2.id != 41858
);
UPDATE word_frequencies 
SET pashto_word = 'وځوروي' 
WHERE id = 29625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځوروي' 
    AND wf2.id != 29625
);
UPDATE word_frequencies 
SET pashto_word = 'وځوریږي' 
WHERE id = 34365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځوریږي' 
    AND wf2.id != 34365
);
UPDATE word_frequencies 
SET pashto_word = 'وځى' 
WHERE id = 19688 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځى' 
    AND wf2.id != 19688
);
UPDATE word_frequencies 
SET pashto_word = 'وځي' 
WHERE id = 21611 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځي' 
    AND wf2.id != 21611
);
UPDATE word_frequencies 
SET pashto_word = 'وځی' 
WHERE id = 40699 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځی' 
    AND wf2.id != 40699
);
UPDATE word_frequencies 
SET pashto_word = 'وځې' 
WHERE id = 28774 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وځې' 
    AND wf2.id != 28774
);
UPDATE word_frequencies 
SET pashto_word = 'وڅرونه' 
WHERE id = 38636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅرونه' 
    AND wf2.id != 38636
);
UPDATE word_frequencies 
SET pashto_word = 'وڅروي' 
WHERE id = 36126 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅروي' 
    AND wf2.id != 36126
);
UPDATE word_frequencies 
SET pashto_word = 'وڅروينه' 
WHERE id = 38741 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅروينه' 
    AND wf2.id != 38741
);
UPDATE word_frequencies 
SET pashto_word = 'وڅريږى' 
WHERE id = 37058 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅريږى' 
    AND wf2.id != 37058
);
UPDATE word_frequencies 
SET pashto_word = 'وڅنډی' 
WHERE id = 41848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅنډی' 
    AND wf2.id != 41848
);
UPDATE word_frequencies 
SET pashto_word = 'وڅيرى' 
WHERE id = 38830 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅيرى' 
    AND wf2.id != 38830
);
UPDATE word_frequencies 
SET pashto_word = 'وڅټلې' 
WHERE id = 37819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅټلې' 
    AND wf2.id != 37819
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښل' 
WHERE id = 18513 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښل' 
    AND wf2.id != 18513
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښلو' 
WHERE id = 39365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښلو' 
    AND wf2.id != 39365
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښلې' 
WHERE id = 20969 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښلې' 
    AND wf2.id != 20969
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښم' 
WHERE id = 34517 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښم' 
    AND wf2.id != 34517
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښه' 
WHERE id = 11167 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښه' 
    AND wf2.id != 11167
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښو' 
WHERE id = 36252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښو' 
    AND wf2.id != 36252
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښوه' 
WHERE id = 36690 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښوه' 
    AND wf2.id != 36690
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښى' 
WHERE id = 21140 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښى' 
    AND wf2.id != 21140
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښي' 
WHERE id = 27726 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښي' 
    AND wf2.id != 27726
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښی' 
WHERE id = 41225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښی' 
    AND wf2.id != 41225
);
UPDATE word_frequencies 
SET pashto_word = 'وڅښیينه' 
WHERE id = 42050 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅښیينه' 
    AND wf2.id != 42050
);
UPDATE word_frequencies 
SET pashto_word = 'وڅېړم' 
WHERE id = 35608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وڅېړم' 
    AND wf2.id != 35608
);
UPDATE word_frequencies 
SET pashto_word = 'وچوم' 
WHERE id = 37361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وچوم' 
    AND wf2.id != 37361
);
UPDATE word_frequencies 
SET pashto_word = 'وچوي' 
WHERE id = 33750 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وچوي' 
    AND wf2.id != 33750
);
UPDATE word_frequencies 
SET pashto_word = 'وچيچى' 
WHERE id = 32273 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وچيچى' 
    AND wf2.id != 32273
);
UPDATE word_frequencies 
SET pashto_word = 'وچیږی' 
WHERE id = 40888 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وچیږی' 
    AND wf2.id != 40888
);
UPDATE word_frequencies 
SET pashto_word = 'وړ' 
WHERE id = 33771 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړ' 
    AND wf2.id != 33771
);
UPDATE word_frequencies 
SET pashto_word = 'وړاندې' 
WHERE id = 28948 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړاندې' 
    AND wf2.id != 28948
);
UPDATE word_frequencies 
SET pashto_word = 'وړل' 
WHERE id = 21855 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړل' 
    AND wf2.id != 21855
);
UPDATE word_frequencies 
SET pashto_word = 'وړله' 
WHERE id = 28671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړله' 
    AND wf2.id != 28671
);
UPDATE word_frequencies 
SET pashto_word = 'وړلو' 
WHERE id = 26006 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړلو' 
    AND wf2.id != 26006
);
UPDATE word_frequencies 
SET pashto_word = 'وړلې' 
WHERE id = 25419 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړلې' 
    AND wf2.id != 25419
);
UPDATE word_frequencies 
SET pashto_word = 'وړم' 
WHERE id = 24229 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړم' 
    AND wf2.id != 24229
);
UPDATE word_frequencies 
SET pashto_word = 'وړو' 
WHERE id = 40361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړو' 
    AND wf2.id != 40361
);
UPDATE word_frequencies 
SET pashto_word = 'وړى' 
WHERE id = 21418 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړى' 
    AND wf2.id != 21418
);
UPDATE word_frequencies 
SET pashto_word = 'وړي' 
WHERE id = 19759 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړي' 
    AND wf2.id != 19759
);
UPDATE word_frequencies 
SET pashto_word = 'وړُو' 
WHERE id = 32686 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړُو' 
    AND wf2.id != 32686
);
UPDATE word_frequencies 
SET pashto_word = 'وړی' 
WHERE id = 41487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړی' 
    AND wf2.id != 41487
);
UPDATE word_frequencies 
SET pashto_word = 'وړۍ' 
WHERE id = 22235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړۍ' 
    AND wf2.id != 22235
);
UPDATE word_frequencies 
SET pashto_word = 'وړې' 
WHERE id = 27478 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وړې' 
    AND wf2.id != 27478
);
UPDATE word_frequencies 
SET pashto_word = 'وږي' 
WHERE id = 30382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وږي' 
    AND wf2.id != 30382
);
UPDATE word_frequencies 
SET pashto_word = 'وژاړم' 
WHERE id = 31067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژاړم' 
    AND wf2.id != 31067
);
UPDATE word_frequencies 
SET pashto_word = 'وژاړى' 
WHERE id = 39638 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژاړى' 
    AND wf2.id != 39638
);
UPDATE word_frequencies 
SET pashto_word = 'وژاړي' 
WHERE id = 29610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژاړي' 
    AND wf2.id != 29610
);
UPDATE word_frequencies 
SET pashto_word = 'وژاړی' 
WHERE id = 41915 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژاړی' 
    AND wf2.id != 41915
);
UPDATE word_frequencies 
SET pashto_word = 'وژغورل' 
WHERE id = 31048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغورل' 
    AND wf2.id != 31048
);
UPDATE word_frequencies 
SET pashto_word = 'وژغورله' 
WHERE id = 34944 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغورله' 
    AND wf2.id != 34944
);
UPDATE word_frequencies 
SET pashto_word = 'وژغورلی' 
WHERE id = 42028 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغورلی' 
    AND wf2.id != 42028
);
UPDATE word_frequencies 
SET pashto_word = 'وژغورلې' 
WHERE id = 34217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغورلې' 
    AND wf2.id != 34217
);
UPDATE word_frequencies 
SET pashto_word = 'وژغورم' 
WHERE id = 22459 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغورم' 
    AND wf2.id != 22459
);
UPDATE word_frequencies 
SET pashto_word = 'وژغوره' 
WHERE id = 27245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغوره' 
    AND wf2.id != 27245
);
UPDATE word_frequencies 
SET pashto_word = 'وژغوري' 
WHERE id = 15685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغوري' 
    AND wf2.id != 15685
);
UPDATE word_frequencies 
SET pashto_word = 'وژغوری' 
WHERE id = 41905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژغوری' 
    AND wf2.id != 41905
);
UPDATE word_frequencies 
SET pashto_word = 'وژل' 
WHERE id = 21050 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژل' 
    AND wf2.id != 21050
);
UPDATE word_frequencies 
SET pashto_word = 'وژلو' 
WHERE id = 22179 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژلو' 
    AND wf2.id != 22179
);
UPDATE word_frequencies 
SET pashto_word = 'وژلی' 
WHERE id = 34436 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژلی' 
    AND wf2.id != 34436
);
UPDATE word_frequencies 
SET pashto_word = 'وژنم' 
WHERE id = 30719 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژنم' 
    AND wf2.id != 30719
);
UPDATE word_frequencies 
SET pashto_word = 'وژنه' 
WHERE id = 28869 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژنه' 
    AND wf2.id != 28869
);
UPDATE word_frequencies 
SET pashto_word = 'وژنى' 
WHERE id = 20660 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژنى' 
    AND wf2.id != 20660
);
UPDATE word_frequencies 
SET pashto_word = 'وژني' 
WHERE id = 21644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژني' 
    AND wf2.id != 21644
);
UPDATE word_frequencies 
SET pashto_word = 'وژنی' 
WHERE id = 40719 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژنی' 
    AND wf2.id != 40719
);
UPDATE word_frequencies 
SET pashto_word = 'وژنې' 
WHERE id = 9719 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژنې' 
    AND wf2.id != 9719
);
UPDATE word_frequencies 
SET pashto_word = 'وژړل' 
WHERE id = 16187 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژړل' 
    AND wf2.id != 16187
);
UPDATE word_frequencies 
SET pashto_word = 'وژړېدم' 
WHERE id = 37880 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وژړېدم' 
    AND wf2.id != 37880
);
UPDATE word_frequencies 
SET pashto_word = 'وښايم' 
WHERE id = 23055 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښايم' 
    AND wf2.id != 23055
);
UPDATE word_frequencies 
SET pashto_word = 'وښايمه' 
WHERE id = 38778 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښايمه' 
    AND wf2.id != 38778
);
UPDATE word_frequencies 
SET pashto_word = 'وښايه' 
WHERE id = 19197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښايه' 
    AND wf2.id != 19197
);
UPDATE word_frequencies 
SET pashto_word = 'وښايی' 
WHERE id = 41674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښايی' 
    AND wf2.id != 41674
);
UPDATE word_frequencies 
SET pashto_word = 'وښایم' 
WHERE id = 29521 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښایم' 
    AND wf2.id != 29521
);
UPDATE word_frequencies 
SET pashto_word = 'وښایى' 
WHERE id = 41101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښایى' 
    AND wf2.id != 41101
);
UPDATE word_frequencies 
SET pashto_word = 'وښایي' 
WHERE id = 21760 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښایي' 
    AND wf2.id != 21760
);
UPDATE word_frequencies 
SET pashto_word = 'وښودل' 
WHERE id = 16618 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښودل' 
    AND wf2.id != 16618
);
UPDATE word_frequencies 
SET pashto_word = 'وښودله' 
WHERE id = 19984 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښودله' 
    AND wf2.id != 19984
);
UPDATE word_frequencies 
SET pashto_word = 'وښودلو' 
WHERE id = 28633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښودلو' 
    AND wf2.id != 28633
);
UPDATE word_frequencies 
SET pashto_word = 'وښودلې' 
WHERE id = 23516 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښودلې' 
    AND wf2.id != 23516
);
UPDATE word_frequencies 
SET pashto_word = 'وښويږى' 
WHERE id = 38834 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وښويږى' 
    AND wf2.id != 38834
);
UPDATE word_frequencies 
SET pashto_word = 'وکاروي' 
WHERE id = 35570 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکاروي' 
    AND wf2.id != 35570
);
UPDATE word_frequencies 
SET pashto_word = 'وکتل' 
WHERE id = 27148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکتل' 
    AND wf2.id != 27148
);
UPDATE word_frequencies 
SET pashto_word = 'وکتلو' 
WHERE id = 37313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکتلو' 
    AND wf2.id != 37313
);
UPDATE word_frequencies 
SET pashto_word = 'وکري' 
WHERE id = 29992 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکري' 
    AND wf2.id != 29992
);
UPDATE word_frequencies 
SET pashto_word = 'وکری' 
WHERE id = 41505 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکری' 
    AND wf2.id != 41505
);
UPDATE word_frequencies 
SET pashto_word = 'وکنستله' 
WHERE id = 39245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکنستله' 
    AND wf2.id != 39245
);
UPDATE word_frequencies 
SET pashto_word = 'وکنستلو' 
WHERE id = 39095 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکنستلو' 
    AND wf2.id != 39095
);
UPDATE word_frequencies 
SET pashto_word = 'وکَرل' 
WHERE id = 36522 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکَرل' 
    AND wf2.id != 36522
);
UPDATE word_frequencies 
SET pashto_word = 'وکَرلو' 
WHERE id = 28560 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکَرلو' 
    AND wf2.id != 28560
);
UPDATE word_frequencies 
SET pashto_word = 'وکَرى' 
WHERE id = 32646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکَرى' 
    AND wf2.id != 32646
);
UPDATE word_frequencies 
SET pashto_word = 'وکَری' 
WHERE id = 41242 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکَری' 
    AND wf2.id != 41242
);
UPDATE word_frequencies 
SET pashto_word = 'وکړ' 
WHERE id = 12574 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړ' 
    AND wf2.id != 12574
);
UPDATE word_frequencies 
SET pashto_word = 'وکړل' 
WHERE id = 12743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړل' 
    AND wf2.id != 12743
);
UPDATE word_frequencies 
SET pashto_word = 'وکړله' 
WHERE id = 29034 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړله' 
    AND wf2.id != 29034
);
UPDATE word_frequencies 
SET pashto_word = 'وکړلو' 
WHERE id = 28459 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړلو' 
    AND wf2.id != 28459
);
UPDATE word_frequencies 
SET pashto_word = 'وکړلې' 
WHERE id = 26700 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړلې' 
    AND wf2.id != 26700
);
UPDATE word_frequencies 
SET pashto_word = 'وکړم' 
WHERE id = 12533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړم' 
    AND wf2.id != 12533
);
UPDATE word_frequencies 
SET pashto_word = 'وکړه' 
WHERE id = 21848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړه' 
    AND wf2.id != 21848
);
UPDATE word_frequencies 
SET pashto_word = 'وکړو' 
WHERE id = 11975 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړو' 
    AND wf2.id != 11975
);
UPDATE word_frequencies 
SET pashto_word = 'وکړونه' 
WHERE id = 28472 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړونه' 
    AND wf2.id != 28472
);
UPDATE word_frequencies 
SET pashto_word = 'وکړي' 
WHERE id = 30698 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړي' 
    AND wf2.id != 30698
);
UPDATE word_frequencies 
SET pashto_word = 'وکړُو' 
WHERE id = 14486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړُو' 
    AND wf2.id != 14486
);
UPDATE word_frequencies 
SET pashto_word = 'وکړی' 
WHERE id = 41028 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړی' 
    AND wf2.id != 41028
);
UPDATE word_frequencies 
SET pashto_word = 'وکړیينه' 
WHERE id = 41363 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړیينه' 
    AND wf2.id != 41363
);
UPDATE word_frequencies 
SET pashto_word = 'وکړې' 
WHERE id = 13395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وکړې' 
    AND wf2.id != 13395
);
UPDATE word_frequencies 
SET pashto_word = 'وګاڼه' 
WHERE id = 29673 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګاڼه' 
    AND wf2.id != 29673
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځاوه' 
WHERE id = 33146 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځاوه' 
    AND wf2.id != 33146
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځم' 
WHERE id = 29027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځم' 
    AND wf2.id != 29027
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځه' 
WHERE id = 36508 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځه' 
    AND wf2.id != 36508
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځولم' 
WHERE id = 31524 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځولم' 
    AND wf2.id != 31524
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځوله' 
WHERE id = 34812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځوله' 
    AND wf2.id != 34812
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځولو' 
WHERE id = 24175 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځولو' 
    AND wf2.id != 24175
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځوم' 
WHERE id = 20018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځوم' 
    AND wf2.id != 20018
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځوى' 
WHERE id = 37280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځوى' 
    AND wf2.id != 37280
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځوی' 
WHERE id = 41389 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځوی' 
    AND wf2.id != 41389
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځى' 
WHERE id = 22009 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځى' 
    AND wf2.id != 22009
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځي' 
WHERE id = 18854 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځي' 
    AND wf2.id != 18854
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځيږى' 
WHERE id = 36950 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځيږى' 
    AND wf2.id != 36950
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځی' 
WHERE id = 42029 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځی' 
    AND wf2.id != 42029
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځې' 
WHERE id = 38884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځې' 
    AND wf2.id != 38884
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځېد' 
WHERE id = 30291 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځېد' 
    AND wf2.id != 30291
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځېدل' 
WHERE id = 24082 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځېدل' 
    AND wf2.id != 24082
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځېده' 
WHERE id = 36959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځېده' 
    AND wf2.id != 36959
);
UPDATE word_frequencies 
SET pashto_word = 'وګرځېدو' 
WHERE id = 31257 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګرځېدو' 
    AND wf2.id != 31257
);
UPDATE word_frequencies 
SET pashto_word = 'وګنډلې' 
WHERE id = 39382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګنډلې' 
    AND wf2.id != 39382
);
UPDATE word_frequencies 
SET pashto_word = 'وګنډه' 
WHERE id = 32095 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګنډه' 
    AND wf2.id != 32095
);
UPDATE word_frequencies 
SET pashto_word = 'وګنډی' 
WHERE id = 41900 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګنډی' 
    AND wf2.id != 41900
);
UPDATE word_frequencies 
SET pashto_word = 'وګورم' 
WHERE id = 21115 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګورم' 
    AND wf2.id != 21115
);
UPDATE word_frequencies 
SET pashto_word = 'وګوره' 
WHERE id = 18057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګوره' 
    AND wf2.id != 18057
);
UPDATE word_frequencies 
SET pashto_word = 'وګورو' 
WHERE id = 36474 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګورو' 
    AND wf2.id != 36474
);
UPDATE word_frequencies 
SET pashto_word = 'وګورونه' 
WHERE id = 38758 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګورونه' 
    AND wf2.id != 38758
);
UPDATE word_frequencies 
SET pashto_word = 'وګورى' 
WHERE id = 16232 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګورى' 
    AND wf2.id != 16232
);
UPDATE word_frequencies 
SET pashto_word = 'وګوري' 
WHERE id = 20906 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګوري' 
    AND wf2.id != 20906
);
UPDATE word_frequencies 
SET pashto_word = 'وګوری' 
WHERE id = 41416 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګوری' 
    AND wf2.id != 41416
);
UPDATE word_frequencies 
SET pashto_word = 'وګوریينه' 
WHERE id = 42047 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګوریينه' 
    AND wf2.id != 42047
);
UPDATE word_frequencies 
SET pashto_word = 'وګورې' 
WHERE id = 25832 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګورې' 
    AND wf2.id != 25832
);
UPDATE word_frequencies 
SET pashto_word = 'وګټلې' 
WHERE id = 23781 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګټلې' 
    AND wf2.id != 23781
);
UPDATE word_frequencies 
SET pashto_word = 'وګټی' 
WHERE id = 41836 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګټی' 
    AND wf2.id != 41836
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼل' 
WHERE id = 29547 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼل' 
    AND wf2.id != 29547
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼله' 
WHERE id = 29645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼله' 
    AND wf2.id != 29645
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼلو' 
WHERE id = 27597 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼلو' 
    AND wf2.id != 27597
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼم' 
WHERE id = 30757 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼم' 
    AND wf2.id != 30757
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼى' 
WHERE id = 30513 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼى' 
    AND wf2.id != 30513
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼی' 
WHERE id = 40773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼی' 
    AND wf2.id != 40773
);
UPDATE word_frequencies 
SET pashto_word = 'وګڼې' 
WHERE id = 34457 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وګڼې' 
    AND wf2.id != 34457
);
UPDATE word_frequencies 
SET pashto_word = 'وی' 
WHERE id = 40475 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وی' 
    AND wf2.id != 40475
);
UPDATE word_frequencies 
SET pashto_word = 'ویستله' 
WHERE id = 29986 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویستله' 
    AND wf2.id != 29986
);
UPDATE word_frequencies 
SET pashto_word = 'ویستلی' 
WHERE id = 33866 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویستلی' 
    AND wf2.id != 33866
);
UPDATE word_frequencies 
SET pashto_word = 'ویل' 
WHERE id = 22430 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویل' 
    AND wf2.id != 22430
);
UPDATE word_frequencies 
SET pashto_word = 'ویله' 
WHERE id = 23507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویله' 
    AND wf2.id != 23507
);
UPDATE word_frequencies 
SET pashto_word = 'ویلي' 
WHERE id = 26887 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویلي' 
    AND wf2.id != 26887
);
UPDATE word_frequencies 
SET pashto_word = 'ویلی' 
WHERE id = 29430 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویلی' 
    AND wf2.id != 29430
);
UPDATE word_frequencies 
SET pashto_word = 'ویلې' 
WHERE id = 30435 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویلې' 
    AND wf2.id != 30435
);
UPDATE word_frequencies 
SET pashto_word = 'ویني' 
WHERE id = 17604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویني' 
    AND wf2.id != 17604
);
UPDATE word_frequencies 
SET pashto_word = 'وینځل' 
WHERE id = 34185 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وینځل' 
    AND wf2.id != 34185
);
UPDATE word_frequencies 
SET pashto_word = 'وینځلې' 
WHERE id = 34402 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وینځلې' 
    AND wf2.id != 34402
);
UPDATE word_frequencies 
SET pashto_word = 'وینی' 
WHERE id = 41148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وینی' 
    AND wf2.id != 41148
);
UPDATE word_frequencies 
SET pashto_word = 'وینې' 
WHERE id = 27101 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وینې' 
    AND wf2.id != 27101
);
UPDATE word_frequencies 
SET pashto_word = 'ویيل' 
WHERE id = 41093 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویيل' 
    AND wf2.id != 41093
);
UPDATE word_frequencies 
SET pashto_word = 'ویيله' 
WHERE id = 41377 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویيله' 
    AND wf2.id != 41377
);
UPDATE word_frequencies 
SET pashto_word = 'ویيلو' 
WHERE id = 41348 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویيلو' 
    AND wf2.id != 41348
);
UPDATE word_frequencies 
SET pashto_word = 'ویيلې' 
WHERE id = 41430 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ویيلې' 
    AND wf2.id != 41430
);
UPDATE word_frequencies 
SET pashto_word = 'وې' 
WHERE id = 11897 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وې' 
    AND wf2.id != 11897
);
UPDATE word_frequencies 
SET pashto_word = 'وېرول' 
WHERE id = 30754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېرول' 
    AND wf2.id != 30754
);
UPDATE word_frequencies 
SET pashto_word = 'وېروي' 
WHERE id = 35873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېروي' 
    AND wf2.id != 35873
);
UPDATE word_frequencies 
SET pashto_word = 'وېریږي' 
WHERE id = 21069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېریږي' 
    AND wf2.id != 21069
);
UPDATE word_frequencies 
SET pashto_word = 'وېرېدل' 
WHERE id = 21523 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېرېدل' 
    AND wf2.id != 21523
);
UPDATE word_frequencies 
SET pashto_word = 'وېرېده' 
WHERE id = 29957 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېرېده' 
    AND wf2.id != 29957
);
UPDATE word_frequencies 
SET pashto_word = 'وېرېږه' 
WHERE id = 29777 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېرېږه' 
    AND wf2.id != 29777
);
UPDATE word_frequencies 
SET pashto_word = 'وېرېږی' 
WHERE id = 41816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېرېږی' 
    AND wf2.id != 41816
);
UPDATE word_frequencies 
SET pashto_word = 'وېشی' 
WHERE id = 41909 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'وېشی' 
    AND wf2.id != 41909
);
UPDATE word_frequencies 
SET pashto_word = 'يا' 
WHERE id = 31379 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يا' 
    AND wf2.id != 31379
);
UPDATE word_frequencies 
SET pashto_word = 'يادوى' 
WHERE id = 31349 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يادوى' 
    AND wf2.id != 31349
);
UPDATE word_frequencies 
SET pashto_word = 'يادوی' 
WHERE id = 41979 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يادوی' 
    AND wf2.id != 41979
);
UPDATE word_frequencies 
SET pashto_word = 'ياديږى' 
WHERE id = 18749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ياديږى' 
    AND wf2.id != 18749
);
UPDATE word_frequencies 
SET pashto_word = 'يادېدو' 
WHERE id = 39141 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يادېدو' 
    AND wf2.id != 39141
);
UPDATE word_frequencies 
SET pashto_word = 'يادېږم' 
WHERE id = 37341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يادېږم' 
    AND wf2.id != 37341
);
UPDATE word_frequencies 
SET pashto_word = 'ياقوت' 
WHERE id = 32102 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ياقوت' 
    AND wf2.id != 32102
);
UPDATE word_frequencies 
SET pashto_word = 'ياوان' 
WHERE id = 38959 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ياوان' 
    AND wf2.id != 38959
);
UPDATE word_frequencies 
SET pashto_word = 'يبوسى' 
WHERE id = 38983 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يبوسى' 
    AND wf2.id != 38983
);
UPDATE word_frequencies 
SET pashto_word = 'يتيمانو' 
WHERE id = 38875 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يتيمانو' 
    AND wf2.id != 38875
);
UPDATE word_frequencies 
SET pashto_word = 'يحت' 
WHERE id = 32608 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يحت' 
    AND wf2.id != 32608
);
UPDATE word_frequencies 
SET pashto_word = 'يحزى‌ايل' 
WHERE id = 28636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يحزى‌ايل' 
    AND wf2.id != 28636
);
UPDATE word_frequencies 
SET pashto_word = 'يحلى‌اېل' 
WHERE id = 39193 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يحلى‌اېل' 
    AND wf2.id != 39193
);
UPDATE word_frequencies 
SET pashto_word = 'يحى‌ايل' 
WHERE id = 28972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يحى‌ايل' 
    AND wf2.id != 28972
);
UPDATE word_frequencies 
SET pashto_word = 'يدوتون' 
WHERE id = 40387 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يدوتون' 
    AND wf2.id != 40387
);
UPDATE word_frequencies 
SET pashto_word = 'يديعيل' 
WHERE id = 40359 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يديعيل' 
    AND wf2.id != 40359
);
UPDATE word_frequencies 
SET pashto_word = 'يرمياه' 
WHERE id = 36565 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرمياه' 
    AND wf2.id != 36565
);
UPDATE word_frequencies 
SET pashto_word = 'يروشلم' 
WHERE id = 19086 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يروشلم' 
    AND wf2.id != 19086
);
UPDATE word_frequencies 
SET pashto_word = 'يروشلمه' 
WHERE id = 31069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يروشلمه' 
    AND wf2.id != 31069
);
UPDATE word_frequencies 
SET pashto_word = 'يرول' 
WHERE id = 39720 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرول' 
    AND wf2.id != 39720
);
UPDATE word_frequencies 
SET pashto_word = 'يرولی' 
WHERE id = 41680 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرولی' 
    AND wf2.id != 41680
);
UPDATE word_frequencies 
SET pashto_word = 'يروه' 
WHERE id = 27951 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يروه' 
    AND wf2.id != 27951
);
UPDATE word_frequencies 
SET pashto_word = 'يروى' 
WHERE id = 23016 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يروى' 
    AND wf2.id != 23016
);
UPDATE word_frequencies 
SET pashto_word = 'يروې' 
WHERE id = 37503 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يروې' 
    AND wf2.id != 37503
);
UPDATE word_frequencies 
SET pashto_word = 'يرياه' 
WHERE id = 40383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرياه' 
    AND wf2.id != 40383
);
UPDATE word_frequencies 
SET pashto_word = 'يريب' 
WHERE id = 40308 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يريب' 
    AND wf2.id != 40308
);
UPDATE word_frequencies 
SET pashto_word = 'يريحو' 
WHERE id = 39710 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يريحو' 
    AND wf2.id != 39710
);
UPDATE word_frequencies 
SET pashto_word = 'يريموت' 
WHERE id = 40384 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يريموت' 
    AND wf2.id != 40384
);
UPDATE word_frequencies 
SET pashto_word = 'يريږى' 
WHERE id = 16363 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يريږى' 
    AND wf2.id != 16363
);
UPDATE word_frequencies 
SET pashto_word = 'يرې' 
WHERE id = 37027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرې' 
    AND wf2.id != 37027
);
UPDATE word_frequencies 
SET pashto_word = 'يرېدل' 
WHERE id = 18150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېدل' 
    AND wf2.id != 18150
);
UPDATE word_frequencies 
SET pashto_word = 'يرېدله' 
WHERE id = 36908 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېدله' 
    AND wf2.id != 36908
);
UPDATE word_frequencies 
SET pashto_word = 'يرېدو' 
WHERE id = 24507 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېدو' 
    AND wf2.id != 24507
);
UPDATE word_frequencies 
SET pashto_word = 'يرېږم' 
WHERE id = 32847 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېږم' 
    AND wf2.id != 32847
);
UPDATE word_frequencies 
SET pashto_word = 'يرېږه' 
WHERE id = 17503 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېږه' 
    AND wf2.id != 17503
);
UPDATE word_frequencies 
SET pashto_word = 'يرېږی' 
WHERE id = 41000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېږی' 
    AND wf2.id != 41000
);
UPDATE word_frequencies 
SET pashto_word = 'يرېږې' 
WHERE id = 24157 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يرېږې' 
    AND wf2.id != 24157
);
UPDATE word_frequencies 
SET pashto_word = 'يشعياه' 
WHERE id = 32627 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يشعياه' 
    AND wf2.id != 32627
);
UPDATE word_frequencies 
SET pashto_word = 'يشوَع' 
WHERE id = 18487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يشوَع' 
    AND wf2.id != 18487
);
UPDATE word_frequencies 
SET pashto_word = 'يطور' 
WHERE id = 31935 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يطور' 
    AND wf2.id != 31935
);
UPDATE word_frequencies 
SET pashto_word = 'يعقوب' 
WHERE id = 18822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يعقوب' 
    AND wf2.id != 18822
);
UPDATE word_frequencies 
SET pashto_word = 'يعوس' 
WHERE id = 24487 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يعوس' 
    AND wf2.id != 24487
);
UPDATE word_frequencies 
SET pashto_word = 'يعى‌ايل' 
WHERE id = 32604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يعى‌ايل' 
    AND wf2.id != 32604
);
UPDATE word_frequencies 
SET pashto_word = 'يفيع' 
WHERE id = 32432 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يفيع' 
    AND wf2.id != 32432
);
UPDATE word_frequencies 
SET pashto_word = 'يفُنه' 
WHERE id = 39505 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يفُنه' 
    AND wf2.id != 39505
);
UPDATE word_frequencies 
SET pashto_word = 'يم' 
WHERE id = 16494 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يم' 
    AND wf2.id != 16494
);
UPDATE word_frequencies 
SET pashto_word = 'يمنه' 
WHERE id = 32003 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يمنه' 
    AND wf2.id != 32003
);
UPDATE word_frequencies 
SET pashto_word = 'يمه' 
WHERE id = 20687 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يمه' 
    AND wf2.id != 20687
);
UPDATE word_frequencies 
SET pashto_word = 'يمو‌اېل' 
WHERE id = 39189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يمو‌اېل' 
    AND wf2.id != 39189
);
UPDATE word_frequencies 
SET pashto_word = 'يميمه' 
WHERE id = 37474 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يميمه' 
    AND wf2.id != 37474
);
UPDATE word_frequencies 
SET pashto_word = 'يمين' 
WHERE id = 26234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يمين' 
    AND wf2.id != 26234
);
UPDATE word_frequencies 
SET pashto_word = 'ينه' 
WHERE id = 18806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ينه' 
    AND wf2.id != 18806
);
UPDATE word_frequencies 
SET pashto_word = 'يهض' 
WHERE id = 25858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يهض' 
    AND wf2.id != 25858
);
UPDATE word_frequencies 
SET pashto_word = 'يهوداه' 
WHERE id = 15974 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يهوداه' 
    AND wf2.id != 15974
);
UPDATE word_frequencies 
SET pashto_word = 'يهوسفط' 
WHERE id = 26443 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يهوسفط' 
    AND wf2.id != 26443
);
UPDATE word_frequencies 
SET pashto_word = 'يوآخ' 
WHERE id = 26471 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوآخ' 
    AND wf2.id != 26471
);
UPDATE word_frequencies 
SET pashto_word = 'يوآس' 
WHERE id = 40294 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوآس' 
    AND wf2.id != 40294
);
UPDATE word_frequencies 
SET pashto_word = 'يوايل' 
WHERE id = 26486 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوايل' 
    AND wf2.id != 26486
);
UPDATE word_frequencies 
SET pashto_word = 'يوباب' 
WHERE id = 31893 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوباب' 
    AND wf2.id != 31893
);
UPDATE word_frequencies 
SET pashto_word = 'يورام' 
WHERE id = 40391 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يورام' 
    AND wf2.id != 40391
);
UPDATE word_frequencies 
SET pashto_word = 'يوزبد' 
WHERE id = 24661 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوزبد' 
    AND wf2.id != 24661
);
UPDATE word_frequencies 
SET pashto_word = 'يوسفه' 
WHERE id = 39209 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوسفه' 
    AND wf2.id != 39209
);
UPDATE word_frequencies 
SET pashto_word = 'يوسه' 
WHERE id = 26412 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوسه' 
    AND wf2.id != 26412
);
UPDATE word_frequencies 
SET pashto_word = 'يوسى' 
WHERE id = 22091 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوسى' 
    AND wf2.id != 22091
);
UPDATE word_frequencies 
SET pashto_word = 'يوسياه' 
WHERE id = 31113 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوسياه' 
    AND wf2.id != 31113
);
UPDATE word_frequencies 
SET pashto_word = 'يونتن' 
WHERE id = 23313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يونتن' 
    AND wf2.id != 23313
);
UPDATE word_frequencies 
SET pashto_word = 'يونه' 
WHERE id = 38624 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يونه' 
    AND wf2.id != 38624
);
UPDATE word_frequencies 
SET pashto_word = 'يوړل' 
WHERE id = 19188 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوړل' 
    AND wf2.id != 19188
);
UPDATE word_frequencies 
SET pashto_word = 'يوړه' 
WHERE id = 39884 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوړه' 
    AND wf2.id != 39884
);
UPDATE word_frequencies 
SET pashto_word = 'يوړو' 
WHERE id = 17103 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوړو' 
    AND wf2.id != 17103
);
UPDATE word_frequencies 
SET pashto_word = 'يوړې' 
WHERE id = 20668 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يوړې' 
    AND wf2.id != 20668
);
UPDATE word_frequencies 
SET pashto_word = 'يَسى' 
WHERE id = 32395 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يَسى' 
    AND wf2.id != 32395
);
UPDATE word_frequencies 
SET pashto_word = 'يُقسان' 
WHERE id = 39071 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يُقسان' 
    AND wf2.id != 39071
);
UPDATE word_frequencies 
SET pashto_word = 'يُو' 
WHERE id = 12853 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يُو' 
    AND wf2.id != 12853
);
UPDATE word_frequencies 
SET pashto_word = 'يکين' 
WHERE id = 31997 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يکين' 
    AND wf2.id != 31997
);
UPDATE word_frequencies 
SET pashto_word = 'يی' 
WHERE id = 41053 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'يی' 
    AND wf2.id != 41053
);
UPDATE word_frequencies 
SET pashto_word = 'ټوقو' 
WHERE id = 36686 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټوقو' 
    AND wf2.id != 36686
);
UPDATE word_frequencies 
SET pashto_word = 'ټوټې' 
WHERE id = 34610 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټوټې' 
    AND wf2.id != 34610
);
UPDATE word_frequencies 
SET pashto_word = 'ټوکر' 
WHERE id = 37931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټوکر' 
    AND wf2.id != 37931
);
UPDATE word_frequencies 
SET pashto_word = 'ټيټيږى' 
WHERE id = 28640 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټيټيږى' 
    AND wf2.id != 28640
);
UPDATE word_frequencies 
SET pashto_word = 'ټيټېږم' 
WHERE id = 40038 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټيټېږم' 
    AND wf2.id != 40038
);
UPDATE word_frequencies 
SET pashto_word = 'ټپوسانو' 
WHERE id = 36572 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټپوسانو' 
    AND wf2.id != 36572
);
UPDATE word_frequencies 
SET pashto_word = 'ټکولو' 
WHERE id = 39457 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټکولو' 
    AND wf2.id != 39457
);
UPDATE word_frequencies 
SET pashto_word = 'ټکوينه' 
WHERE id = 38716 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ټکوينه' 
    AND wf2.id != 38716
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅم' 
WHERE id = 37499 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅم' 
    AND wf2.id != 37499
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅه' 
WHERE id = 26371 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅه' 
    AND wf2.id != 26371
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅی' 
WHERE id = 41743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅی' 
    AND wf2.id != 41743
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېد' 
WHERE id = 29858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېد' 
    AND wf2.id != 29858
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېدل' 
WHERE id = 29402 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېدل' 
    AND wf2.id != 29402
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېدم' 
WHERE id = 35899 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېدم' 
    AND wf2.id != 35899
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېده' 
WHERE id = 33532 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېده' 
    AND wf2.id != 33532
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېدو' 
WHERE id = 16245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېدو' 
    AND wf2.id != 16245
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېږه' 
WHERE id = 24790 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېږه' 
    AND wf2.id != 24790
);
UPDATE word_frequencies 
SET pashto_word = 'پاڅېږی' 
WHERE id = 41634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاڅېږی' 
    AND wf2.id != 41634
);
UPDATE word_frequencies 
SET pashto_word = 'پاچا' 
WHERE id = 21579 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاچا' 
    AND wf2.id != 21579
);
UPDATE word_frequencies 
SET pashto_word = 'پاچاهانو' 
WHERE id = 34628 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاچاهانو' 
    AND wf2.id != 34628
);
UPDATE word_frequencies 
SET pashto_word = 'پاک' 
WHERE id = 32706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاک' 
    AND wf2.id != 32706
);
UPDATE word_frequencies 
SET pashto_word = 'پاکه' 
WHERE id = 24596 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاکه' 
    AND wf2.id != 24596
);
UPDATE word_frequencies 
SET pashto_word = 'پاکوونکي' 
WHERE id = 30272 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاکوونکي' 
    AND wf2.id != 30272
);
UPDATE word_frequencies 
SET pashto_word = 'پاکوي' 
WHERE id = 29215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاکوي' 
    AND wf2.id != 29215
);
UPDATE word_frequencies 
SET pashto_word = 'پاکیږي' 
WHERE id = 34432 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پاکیږي' 
    AND wf2.id != 34432
);
UPDATE word_frequencies 
SET pashto_word = 'پایو' 
WHERE id = 38167 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پایو' 
    AND wf2.id != 38167
);
UPDATE word_frequencies 
SET pashto_word = 'پایى' 
WHERE id = 41736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پایى' 
    AND wf2.id != 41736
);
UPDATE word_frequencies 
SET pashto_word = 'پتروباس' 
WHERE id = 34723 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پتروباس' 
    AND wf2.id != 34723
);
UPDATE word_frequencies 
SET pashto_word = 'پخوی' 
WHERE id = 41503 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پخوی' 
    AND wf2.id != 41503
);
UPDATE word_frequencies 
SET pashto_word = 'پخيږى' 
WHERE id = 39256 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پخيږى' 
    AND wf2.id != 39256
);
UPDATE word_frequencies 
SET pashto_word = 'پرانستلې' 
WHERE id = 36793 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرانستلې' 
    AND wf2.id != 36793
);
UPDATE word_frequencies 
SET pashto_word = 'پرتوګونو' 
WHERE id = 35297 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرتوګونو' 
    AND wf2.id != 35297
);
UPDATE word_frequencies 
SET pashto_word = 'پرده' 
WHERE id = 38173 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرده' 
    AND wf2.id != 38173
);
UPDATE word_frequencies 
SET pashto_word = 'پردې' 
WHERE id = 20452 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پردې' 
    AND wf2.id != 20452
);
UPDATE word_frequencies 
SET pashto_word = 'پرستۍ' 
WHERE id = 33104 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرستۍ' 
    AND wf2.id != 33104
);
UPDATE word_frequencies 
SET pashto_word = 'پرون' 
WHERE id = 33655 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرون' 
    AND wf2.id != 33655
);
UPDATE word_frequencies 
SET pashto_word = 'پرګله' 
WHERE id = 37079 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرګله' 
    AND wf2.id != 37079
);
UPDATE word_frequencies 
SET pashto_word = 'پریښی' 
WHERE id = 33899 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پریښی' 
    AND wf2.id != 33899
);
UPDATE word_frequencies 
SET pashto_word = 'پرېنږدم' 
WHERE id = 27533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېنږدم' 
    AND wf2.id != 27533
);
UPDATE word_frequencies 
SET pashto_word = 'پرېنږدي' 
WHERE id = 33354 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېنږدي' 
    AND wf2.id != 33354
);
UPDATE word_frequencies 
SET pashto_word = 'پرېنښود' 
WHERE id = 24843 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېنښود' 
    AND wf2.id != 24843
);
UPDATE word_frequencies 
SET pashto_word = 'پرېنښودله' 
WHERE id = 31038 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېنښودله' 
    AND wf2.id != 31038
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوت' 
WHERE id = 24825 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوت' 
    AND wf2.id != 24825
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوتل' 
WHERE id = 20412 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوتل' 
    AND wf2.id != 20412
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوتلم' 
WHERE id = 21858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوتلم' 
    AND wf2.id != 21858
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوتله' 
WHERE id = 29964 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوتله' 
    AND wf2.id != 29964
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوتم' 
WHERE id = 35919 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوتم' 
    AND wf2.id != 35919
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوته' 
WHERE id = 40197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوته' 
    AND wf2.id != 40197
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوتو' 
WHERE id = 21402 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوتو' 
    AND wf2.id != 21402
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوځه' 
WHERE id = 38615 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوځه' 
    AND wf2.id != 38615
);
UPDATE word_frequencies 
SET pashto_word = 'پرېوځى' 
WHERE id = 25919 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېوځى' 
    AND wf2.id != 25919
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدم' 
WHERE id = 19063 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدم' 
    AND wf2.id != 19063
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدم“' 
WHERE id = 37375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدم“' 
    AND wf2.id != 37375
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږده' 
WHERE id = 17029 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږده' 
    AND wf2.id != 17029
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدو' 
WHERE id = 24905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدو' 
    AND wf2.id != 24905
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدى' 
WHERE id = 15853 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدى' 
    AND wf2.id != 15853
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدي' 
WHERE id = 18235 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدي' 
    AND wf2.id != 18235
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدی' 
WHERE id = 40999 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدی' 
    AND wf2.id != 40999
);
UPDATE word_frequencies 
SET pashto_word = 'پرېږدې' 
WHERE id = 30681 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېږدې' 
    AND wf2.id != 30681
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښود' 
WHERE id = 23490 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښود' 
    AND wf2.id != 23490
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودل' 
WHERE id = 14837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودل' 
    AND wf2.id != 14837
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودلم' 
WHERE id = 37123 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودلم' 
    AND wf2.id != 37123
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودله' 
WHERE id = 19478 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودله' 
    AND wf2.id != 19478
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودلو' 
WHERE id = 25905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودلو' 
    AND wf2.id != 25905
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودلی' 
WHERE id = 41365 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودلی' 
    AND wf2.id != 41365
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودم' 
WHERE id = 31523 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودم' 
    AND wf2.id != 31523
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښوده' 
WHERE id = 24522 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښوده' 
    AND wf2.id != 24522
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښودو' 
WHERE id = 17813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښودو' 
    AND wf2.id != 17813
);
UPDATE word_frequencies 
SET pashto_word = 'پرېښی' 
WHERE id = 41536 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پرېښی' 
    AND wf2.id != 41536
);
UPDATE word_frequencies 
SET pashto_word = 'پر‌دې' 
WHERE id = 29553 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پر‌دې' 
    AND wf2.id != 29553
);
UPDATE word_frequencies 
SET pashto_word = 'پس' 
WHERE id = 13351 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پس' 
    AND wf2.id != 13351
);
UPDATE word_frequencies 
SET pashto_word = 'پسونه' 
WHERE id = 19954 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پسونه' 
    AND wf2.id != 19954
);
UPDATE word_frequencies 
SET pashto_word = 'پسونو' 
WHERE id = 30529 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پسونو' 
    AND wf2.id != 30529
);
UPDATE word_frequencies 
SET pashto_word = 'پسې' 
WHERE id = 30067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پسې' 
    AND wf2.id != 30067
);
UPDATE word_frequencies 
SET pashto_word = 'پطروس' 
WHERE id = 18231 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پطروس' 
    AND wf2.id != 18231
);
UPDATE word_frequencies 
SET pashto_word = 'پطروسه' 
WHERE id = 33219 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پطروسه' 
    AND wf2.id != 33219
);
UPDATE word_frequencies 
SET pashto_word = 'پلار' 
WHERE id = 33897 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پلار' 
    AND wf2.id != 33897
);
UPDATE word_frequencies 
SET pashto_word = 'پلاره' 
WHERE id = 20963 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پلاره' 
    AND wf2.id != 20963
);
UPDATE word_frequencies 
SET pashto_word = 'پلرونو' 
WHERE id = 33372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پلرونو' 
    AND wf2.id != 33372
);
UPDATE word_frequencies 
SET pashto_word = 'پليتوى' 
WHERE id = 22799 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پليتوى' 
    AND wf2.id != 22799
);
UPDATE word_frequencies 
SET pashto_word = 'پنجې' 
WHERE id = 34881 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پنجې' 
    AND wf2.id != 34881
);
UPDATE word_frequencies 
SET pashto_word = 'پنځه' 
WHERE id = 25362 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پنځه' 
    AND wf2.id != 25362
);
UPDATE word_frequencies 
SET pashto_word = 'پنځوسو' 
WHERE id = 32067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پنځوسو' 
    AND wf2.id != 32067
);
UPDATE word_frequencies 
SET pashto_word = 'پورې' 
WHERE id = 19645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پورې' 
    AND wf2.id != 19645
);
UPDATE word_frequencies 
SET pashto_word = 'پولوس' 
WHERE id = 33157 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پولوس' 
    AND wf2.id != 33157
);
UPDATE word_frequencies 
SET pashto_word = 'پولوسه' 
WHERE id = 33414 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پولوسه' 
    AND wf2.id != 33414
);
UPDATE word_frequencies 
SET pashto_word = 'پونتوس' 
WHERE id = 33150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پونتوس' 
    AND wf2.id != 33150
);
UPDATE word_frequencies 
SET pashto_word = 'پوهه' 
WHERE id = 30645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهه' 
    AND wf2.id != 30645
);
UPDATE word_frequencies 
SET pashto_word = 'پوهوى' 
WHERE id = 37367 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهوى' 
    AND wf2.id != 37367
);
UPDATE word_frequencies 
SET pashto_word = 'پوهيږو' 
WHERE id = 28222 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهيږو' 
    AND wf2.id != 28222
);
UPDATE word_frequencies 
SET pashto_word = 'پوهيږى' 
WHERE id = 18794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهيږى' 
    AND wf2.id != 18794
);
UPDATE word_frequencies 
SET pashto_word = 'پوهیږي' 
WHERE id = 23763 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهیږي' 
    AND wf2.id != 23763
);
UPDATE word_frequencies 
SET pashto_word = 'پوهیږی' 
WHERE id = 40645 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهیږی' 
    AND wf2.id != 40645
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېدل' 
WHERE id = 26169 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېدل' 
    AND wf2.id != 26169
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېدمه' 
WHERE id = 38755 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېدمه' 
    AND wf2.id != 38755
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېده' 
WHERE id = 33315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېده' 
    AND wf2.id != 33315
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېږم' 
WHERE id = 23092 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېږم' 
    AND wf2.id != 23092
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېږو' 
WHERE id = 30299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېږو' 
    AND wf2.id != 30299
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېږی' 
WHERE id = 41216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېږی' 
    AND wf2.id != 41216
);
UPDATE word_frequencies 
SET pashto_word = 'پوهېږې' 
WHERE id = 23000 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوهېږې' 
    AND wf2.id != 23000
);
UPDATE word_frequencies 
SET pashto_word = 'پوښ' 
WHERE id = 38172 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوښ' 
    AND wf2.id != 38172
);
UPDATE word_frequencies 
SET pashto_word = 'پوښتنه' 
WHERE id = 31495 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوښتنه' 
    AND wf2.id != 31495
);
UPDATE word_frequencies 
SET pashto_word = 'پوکی' 
WHERE id = 30638 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پوکی' 
    AND wf2.id != 30638
);
UPDATE word_frequencies 
SET pashto_word = 'پيالو' 
WHERE id = 40225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پيالو' 
    AND wf2.id != 40225
);
UPDATE word_frequencies 
SET pashto_word = 'پيالۍ' 
WHERE id = 25892 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پيالۍ' 
    AND wf2.id != 25892
);
UPDATE word_frequencies 
SET pashto_word = 'پيتلو' 
WHERE id = 30491 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پيتلو' 
    AND wf2.id != 30491
);
UPDATE word_frequencies 
SET pashto_word = 'پينځمې' 
WHERE id = 38888 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پينځمې' 
    AND wf2.id != 38888
);
UPDATE word_frequencies 
SET pashto_word = 'پيړۍ' 
WHERE id = 32936 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پيړۍ' 
    AND wf2.id != 32936
);
UPDATE word_frequencies 
SET pashto_word = 'پټه' 
WHERE id = 33885 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټه' 
    AND wf2.id != 33885
);
UPDATE word_frequencies 
SET pashto_word = 'پټول' 
WHERE id = 35737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټول' 
    AND wf2.id != 35737
);
UPDATE word_frequencies 
SET pashto_word = 'پټوم' 
WHERE id = 25915 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوم' 
    AND wf2.id != 25915
);
UPDATE word_frequencies 
SET pashto_word = 'پټوه' 
WHERE id = 27293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوه' 
    AND wf2.id != 27293
);
UPDATE word_frequencies 
SET pashto_word = 'پټوى' 
WHERE id = 20148 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوى' 
    AND wf2.id != 20148
);
UPDATE word_frequencies 
SET pashto_word = 'پټوي' 
WHERE id = 27325 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوي' 
    AND wf2.id != 27325
);
UPDATE word_frequencies 
SET pashto_word = 'پټوُو' 
WHERE id = 39205 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوُو' 
    AND wf2.id != 39205
);
UPDATE word_frequencies 
SET pashto_word = 'پټوی' 
WHERE id = 41898 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوی' 
    AND wf2.id != 41898
);
UPDATE word_frequencies 
SET pashto_word = 'پټوې' 
WHERE id = 37201 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټوې' 
    AND wf2.id != 37201
);
UPDATE word_frequencies 
SET pashto_word = 'پټيږى' 
WHERE id = 32124 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټيږى' 
    AND wf2.id != 32124
);
UPDATE word_frequencies 
SET pashto_word = 'پټی' 
WHERE id = 40905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټی' 
    AND wf2.id != 40905
);
UPDATE word_frequencies 
SET pashto_word = 'پټیږي' 
WHERE id = 35578 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټیږي' 
    AND wf2.id != 35578
);
UPDATE word_frequencies 
SET pashto_word = 'پټېدل' 
WHERE id = 37812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټېدل' 
    AND wf2.id != 37812
);
UPDATE word_frequencies 
SET pashto_word = 'پټېږی' 
WHERE id = 41931 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پټېږی' 
    AND wf2.id != 41931
);
UPDATE word_frequencies 
SET pashto_word = 'پړده' 
WHERE id = 22247 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پړده' 
    AND wf2.id != 22247
);
UPDATE word_frequencies 
SET pashto_word = 'پړدې' 
WHERE id = 32125 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پړدې' 
    AND wf2.id != 32125
);
UPDATE word_frequencies 
SET pashto_word = 'پړقوى' 
WHERE id = 31385 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پړقوى' 
    AND wf2.id != 31385
);
UPDATE word_frequencies 
SET pashto_word = 'پړقيږى' 
WHERE id = 32465 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پړقيږى' 
    AND wf2.id != 32465
);
UPDATE word_frequencies 
SET pashto_word = 'پړکېدله' 
WHERE id = 25585 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پړکېدله' 
    AND wf2.id != 25585
);
UPDATE word_frequencies 
SET pashto_word = 'پښه' 
WHERE id = 35453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پښه' 
    AND wf2.id != 35453
);
UPDATE word_frequencies 
SET pashto_word = 'پښو' 
WHERE id = 39479 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پښو' 
    AND wf2.id != 39479
);
UPDATE word_frequencies 
SET pashto_word = 'پښې' 
WHERE id = 23255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پښې' 
    AND wf2.id != 23255
);
UPDATE word_frequencies 
SET pashto_word = 'پکار' 
WHERE id = 31914 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پکار' 
    AND wf2.id != 31914
);
UPDATE word_frequencies 
SET pashto_word = 'پیغام' 
WHERE id = 30906 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پیغام' 
    AND wf2.id != 30906
);
UPDATE word_frequencies 
SET pashto_word = 'پیغمبران' 
WHERE id = 29498 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پیغمبران' 
    AND wf2.id != 29498
);
UPDATE word_frequencies 
SET pashto_word = 'پیغمبرانو' 
WHERE id = 30080 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پیغمبرانو' 
    AND wf2.id != 30080
);
UPDATE word_frequencies 
SET pashto_word = 'پېدا' 
WHERE id = 37206 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېدا' 
    AND wf2.id != 37206
);
UPDATE word_frequencies 
SET pashto_word = 'پېریه' 
WHERE id = 34373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېریه' 
    AND wf2.id != 34373
);
UPDATE word_frequencies 
SET pashto_word = 'پېغام' 
WHERE id = 32198 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغام' 
    AND wf2.id != 32198
);
UPDATE word_frequencies 
SET pashto_word = 'پېغلو' 
WHERE id = 38785 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغلو' 
    AND wf2.id != 38785
);
UPDATE word_frequencies 
SET pashto_word = 'پېغلې' 
WHERE id = 38757 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغلې' 
    AND wf2.id != 38757
);
UPDATE word_frequencies 
SET pashto_word = 'پېغمبر' 
WHERE id = 22973 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغمبر' 
    AND wf2.id != 22973
);
UPDATE word_frequencies 
SET pashto_word = 'پېغمبران' 
WHERE id = 32556 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغمبران' 
    AND wf2.id != 32556
);
UPDATE word_frequencies 
SET pashto_word = 'پېغمبرانو' 
WHERE id = 27993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېغمبرانو' 
    AND wf2.id != 27993
);
UPDATE word_frequencies 
SET pashto_word = 'پېژانده' 
WHERE id = 24908 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژانده' 
    AND wf2.id != 24908
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندل' 
WHERE id = 22569 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندل' 
    AND wf2.id != 22569
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندلم' 
WHERE id = 33592 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندلم' 
    AND wf2.id != 33592
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندلو' 
WHERE id = 25455 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندلو' 
    AND wf2.id != 25455
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندلى' 
WHERE id = 31295 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندلى' 
    AND wf2.id != 31295
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندلی' 
WHERE id = 33784 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندلی' 
    AND wf2.id != 33784
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندلې' 
WHERE id = 26879 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندلې' 
    AND wf2.id != 26879
);
UPDATE word_frequencies 
SET pashto_word = 'پېژندم' 
WHERE id = 36748 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژندم' 
    AND wf2.id != 36748
);
UPDATE word_frequencies 
SET pashto_word = 'پېژنم' 
WHERE id = 23613 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژنم' 
    AND wf2.id != 23613
);
UPDATE word_frequencies 
SET pashto_word = 'پېژنو' 
WHERE id = 25041 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژنو' 
    AND wf2.id != 25041
);
UPDATE word_frequencies 
SET pashto_word = 'پېژنى' 
WHERE id = 17309 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژنى' 
    AND wf2.id != 17309
);
UPDATE word_frequencies 
SET pashto_word = 'پېژني' 
WHERE id = 20335 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژني' 
    AND wf2.id != 20335
);
UPDATE word_frequencies 
SET pashto_word = 'پېژنی' 
WHERE id = 41390 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژنی' 
    AND wf2.id != 41390
);
UPDATE word_frequencies 
SET pashto_word = 'پېژنې' 
WHERE id = 23414 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېژنې' 
    AND wf2.id != 23414
);
UPDATE word_frequencies 
SET pashto_word = 'پېښو' 
WHERE id = 30989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېښو' 
    AND wf2.id != 30989
);
UPDATE word_frequencies 
SET pashto_word = 'پېښیږي' 
WHERE id = 25190 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېښیږي' 
    AND wf2.id != 25190
);
UPDATE word_frequencies 
SET pashto_word = 'پېښېدو' 
WHERE id = 40226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'پېښېدو' 
    AND wf2.id != 40226
);
UPDATE word_frequencies 
SET pashto_word = 'ځالې' 
WHERE id = 34248 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځالې' 
    AND wf2.id != 34248
);
UPDATE word_frequencies 
SET pashto_word = 'ځان' 
WHERE id = 30228 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځان' 
    AND wf2.id != 30228
);
UPDATE word_frequencies 
SET pashto_word = 'ځانه' 
WHERE id = 23149 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځانه' 
    AND wf2.id != 23149
);
UPDATE word_frequencies 
SET pashto_word = 'ځانونو' 
WHERE id = 32012 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځانونو' 
    AND wf2.id != 32012
);
UPDATE word_frequencies 
SET pashto_word = 'ځای' 
WHERE id = 21630 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځای' 
    AND wf2.id != 21630
);
UPDATE word_frequencies 
SET pashto_word = 'ځایه' 
WHERE id = 36429 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځایه' 
    AND wf2.id != 36429
);
UPDATE word_frequencies 
SET pashto_word = 'ځایونو' 
WHERE id = 30995 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځایونو' 
    AND wf2.id != 30995
);
UPDATE word_frequencies 
SET pashto_word = 'ځل' 
WHERE id = 39525 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځل' 
    AND wf2.id != 39525
);
UPDATE word_frequencies 
SET pashto_word = 'ځلوى' 
WHERE id = 37398 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلوى' 
    AND wf2.id != 37398
);
UPDATE word_frequencies 
SET pashto_word = 'ځليږى' 
WHERE id = 17754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځليږى' 
    AND wf2.id != 17754
);
UPDATE word_frequencies 
SET pashto_word = 'ځليږينه' 
WHERE id = 24414 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځليږينه' 
    AND wf2.id != 24414
);
UPDATE word_frequencies 
SET pashto_word = 'ځلیږي' 
WHERE id = 29754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلیږي' 
    AND wf2.id != 29754
);
UPDATE word_frequencies 
SET pashto_word = 'ځلیږی' 
WHERE id = 40669 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلیږی' 
    AND wf2.id != 40669
);
UPDATE word_frequencies 
SET pashto_word = 'ځلېدل' 
WHERE id = 35735 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلېدل' 
    AND wf2.id != 35735
);
UPDATE word_frequencies 
SET pashto_word = 'ځلېدلې' 
WHERE id = 34653 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلېدلې' 
    AND wf2.id != 34653
);
UPDATE word_frequencies 
SET pashto_word = 'ځلېده' 
WHERE id = 23521 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلېده' 
    AND wf2.id != 23521
);
UPDATE word_frequencies 
SET pashto_word = 'ځلېدو' 
WHERE id = 25447 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځلېدو' 
    AND wf2.id != 25447
);
UPDATE word_frequencies 
SET pashto_word = 'ځم' 
WHERE id = 21695 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځم' 
    AND wf2.id != 21695
);
UPDATE word_frequencies 
SET pashto_word = 'ځمکه' 
WHERE id = 20822 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځمکه' 
    AND wf2.id != 20822
);
UPDATE word_frequencies 
SET pashto_word = 'ځمکې' 
WHERE id = 26784 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځمکې' 
    AND wf2.id != 26784
);
UPDATE word_frequencies 
SET pashto_word = 'ځناور' 
WHERE id = 19752 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځناور' 
    AND wf2.id != 19752
);
UPDATE word_frequencies 
SET pashto_word = 'ځناورو' 
WHERE id = 39553 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځناورو' 
    AND wf2.id != 39553
);
UPDATE word_frequencies 
SET pashto_word = 'ځنګلى' 
WHERE id = 38924 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځنګلى' 
    AND wf2.id != 38924
);
UPDATE word_frequencies 
SET pashto_word = 'ځه' 
WHERE id = 23778 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځه' 
    AND wf2.id != 23778
);
UPDATE word_frequencies 
SET pashto_word = 'ځو' 
WHERE id = 25533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځو' 
    AND wf2.id != 25533
);
UPDATE word_frequencies 
SET pashto_word = 'ځوان' 
WHERE id = 34867 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوان' 
    AND wf2.id != 34867
);
UPDATE word_frequencies 
SET pashto_word = 'ځوانان' 
WHERE id = 30806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوانان' 
    AND wf2.id != 30806
);
UPDATE word_frequencies 
SET pashto_word = 'ځوانانو' 
WHERE id = 25726 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوانانو' 
    AND wf2.id != 25726
);
UPDATE word_frequencies 
SET pashto_word = 'ځوانه' 
WHERE id = 34209 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوانه' 
    AND wf2.id != 34209
);
UPDATE word_frequencies 
SET pashto_word = 'ځورول' 
WHERE id = 33373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځورول' 
    AND wf2.id != 33373
);
UPDATE word_frequencies 
SET pashto_word = 'ځوروي' 
WHERE id = 29982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوروي' 
    AND wf2.id != 29982
);
UPDATE word_frequencies 
SET pashto_word = 'ځوروې' 
WHERE id = 33408 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوروې' 
    AND wf2.id != 33408
);
UPDATE word_frequencies 
SET pashto_word = 'ځوریږي' 
WHERE id = 34654 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځوریږي' 
    AND wf2.id != 34654
);
UPDATE word_frequencies 
SET pashto_word = 'ځى' 
WHERE id = 15856 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځى' 
    AND wf2.id != 15856
);
UPDATE word_frequencies 
SET pashto_word = 'ځي' 
WHERE id = 17656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځي' 
    AND wf2.id != 17656
);
UPDATE word_frequencies 
SET pashto_word = 'ځُو' 
WHERE id = 25836 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځُو' 
    AND wf2.id != 25836
);
UPDATE word_frequencies 
SET pashto_word = 'ځی' 
WHERE id = 40590 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځی' 
    AND wf2.id != 40590
);
UPDATE word_frequencies 
SET pashto_word = 'ځینې' 
WHERE id = 38525 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځینې' 
    AND wf2.id != 38525
);
UPDATE word_frequencies 
SET pashto_word = 'ځې' 
WHERE id = 19858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ځې' 
    AND wf2.id != 19858
);
UPDATE word_frequencies 
SET pashto_word = 'څاروو' 
WHERE id = 22226 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څاروو' 
    AND wf2.id != 22226
);
UPDATE word_frequencies 
SET pashto_word = 'څاروى' 
WHERE id = 18105 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څاروى' 
    AND wf2.id != 18105
);
UPDATE word_frequencies 
SET pashto_word = 'څانګه' 
WHERE id = 39220 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څانګه' 
    AND wf2.id != 39220
);
UPDATE word_frequencies 
SET pashto_word = 'څخه' 
WHERE id = 13848 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څخه' 
    AND wf2.id != 13848
);
UPDATE word_frequencies 
SET pashto_word = 'څرمن' 
WHERE id = 22236 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرمن' 
    AND wf2.id != 22236
);
UPDATE word_frequencies 
SET pashto_word = 'څرمنې' 
WHERE id = 28372 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرمنې' 
    AND wf2.id != 28372
);
UPDATE word_frequencies 
SET pashto_word = 'څرولې' 
WHERE id = 39150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرولې' 
    AND wf2.id != 39150
);
UPDATE word_frequencies 
SET pashto_word = 'څروى' 
WHERE id = 31344 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څروى' 
    AND wf2.id != 31344
);
UPDATE word_frequencies 
SET pashto_word = 'څريږينه' 
WHERE id = 38682 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څريږينه' 
    AND wf2.id != 38682
);
UPDATE word_frequencies 
SET pashto_word = 'څرګندولی' 
WHERE id = 41877 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرګندولی' 
    AND wf2.id != 41877
);
UPDATE word_frequencies 
SET pashto_word = 'څرګندوى' 
WHERE id = 19542 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرګندوى' 
    AND wf2.id != 19542
);
UPDATE word_frequencies 
SET pashto_word = 'څرګندوي' 
WHERE id = 29533 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرګندوي' 
    AND wf2.id != 29533
);
UPDATE word_frequencies 
SET pashto_word = 'څریږي' 
WHERE id = 36313 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څریږي' 
    AND wf2.id != 36313
);
UPDATE word_frequencies 
SET pashto_word = 'څرېدله' 
WHERE id = 25176 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرېدله' 
    AND wf2.id != 25176
);
UPDATE word_frequencies 
SET pashto_word = 'څرېدلې' 
WHERE id = 37255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څرېدلې' 
    AND wf2.id != 37255
);
UPDATE word_frequencies 
SET pashto_word = 'څلورمې' 
WHERE id = 38887 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څلورمې' 
    AND wf2.id != 38887
);
UPDATE word_frequencies 
SET pashto_word = 'څملاست' 
WHERE id = 27461 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملاست' 
    AND wf2.id != 27461
);
UPDATE word_frequencies 
SET pashto_word = 'څملاستم' 
WHERE id = 39049 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملاستم' 
    AND wf2.id != 39049
);
UPDATE word_frequencies 
SET pashto_word = 'څملاسته' 
WHERE id = 31913 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملاسته' 
    AND wf2.id != 31913
);
UPDATE word_frequencies 
SET pashto_word = 'څملاستو' 
WHERE id = 18466 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملاستو' 
    AND wf2.id != 18466
);
UPDATE word_frequencies 
SET pashto_word = 'څملم' 
WHERE id = 35027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملم' 
    AND wf2.id != 35027
);
UPDATE word_frequencies 
SET pashto_word = 'څمله' 
WHERE id = 23893 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څمله' 
    AND wf2.id != 23893
);
UPDATE word_frequencies 
SET pashto_word = 'څملى' 
WHERE id = 20115 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملى' 
    AND wf2.id != 20115
);
UPDATE word_frequencies 
SET pashto_word = 'څملي' 
WHERE id = 22769 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملي' 
    AND wf2.id != 22769
);
UPDATE word_frequencies 
SET pashto_word = 'څملی' 
WHERE id = 41928 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملی' 
    AND wf2.id != 41928
);
UPDATE word_frequencies 
SET pashto_word = 'څملې' 
WHERE id = 30797 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څملې' 
    AND wf2.id != 30797
);
UPDATE word_frequencies 
SET pashto_word = 'څنګه' 
WHERE id = 30156 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څنګه' 
    AND wf2.id != 30156
);
UPDATE word_frequencies 
SET pashto_word = 'څه' 
WHERE id = 30038 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څه' 
    AND wf2.id != 30038
);
UPDATE word_frequencies 
SET pashto_word = 'څوک' 
WHERE id = 27874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څوک' 
    AND wf2.id != 27874
);
UPDATE word_frequencies 
SET pashto_word = 'څيز' 
WHERE id = 28559 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څيز' 
    AND wf2.id != 28559
);
UPDATE word_frequencies 
SET pashto_word = 'څيزونه' 
WHERE id = 32636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څيزونه' 
    AND wf2.id != 32636
);
UPDATE word_frequencies 
SET pashto_word = 'څټل' 
WHERE id = 34018 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څټل' 
    AND wf2.id != 34018
);
UPDATE word_frequencies 
SET pashto_word = 'څټي' 
WHERE id = 31497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څټي' 
    AND wf2.id != 31497
);
UPDATE word_frequencies 
SET pashto_word = 'څڅيږى' 
WHERE id = 37559 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څڅيږى' 
    AND wf2.id != 37559
);
UPDATE word_frequencies 
SET pashto_word = 'څښتن' 
WHERE id = 22792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښتن' 
    AND wf2.id != 22792
);
UPDATE word_frequencies 
SET pashto_word = 'څښتنه' 
WHERE id = 17992 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښتنه' 
    AND wf2.id != 17992
);
UPDATE word_frequencies 
SET pashto_word = 'څښل' 
WHERE id = 20302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښل' 
    AND wf2.id != 20302
);
UPDATE word_frequencies 
SET pashto_word = 'څښلی' 
WHERE id = 41555 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښلی' 
    AND wf2.id != 41555
);
UPDATE word_frequencies 
SET pashto_word = 'څښلې' 
WHERE id = 30413 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښلې' 
    AND wf2.id != 30413
);
UPDATE word_frequencies 
SET pashto_word = 'څښم' 
WHERE id = 25131 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښم' 
    AND wf2.id != 25131
);
UPDATE word_frequencies 
SET pashto_word = 'څښمه' 
WHERE id = 38711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښمه' 
    AND wf2.id != 38711
);
UPDATE word_frequencies 
SET pashto_word = 'څښو' 
WHERE id = 26737 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښو' 
    AND wf2.id != 26737
);
UPDATE word_frequencies 
SET pashto_word = 'څښی' 
WHERE id = 40647 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښی' 
    AND wf2.id != 40647
);
UPDATE word_frequencies 
SET pashto_word = 'څښې' 
WHERE id = 27792 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څښې' 
    AND wf2.id != 27792
);
UPDATE word_frequencies 
SET pashto_word = 'څکی' 
WHERE id = 41821 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څکی' 
    AND wf2.id != 41821
);
UPDATE word_frequencies 
SET pashto_word = 'څۀ' 
WHERE id = 14136 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څۀ' 
    AND wf2.id != 14136
);
UPDATE word_frequencies 
SET pashto_word = 'څې' 
WHERE id = 40178 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'څې' 
    AND wf2.id != 40178
);
UPDATE word_frequencies 
SET pashto_word = 'چا' 
WHERE id = 30987 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چا' 
    AND wf2.id != 30987
);
UPDATE word_frequencies 
SET pashto_word = 'چت' 
WHERE id = 39353 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چت' 
    AND wf2.id != 39353
);
UPDATE word_frequencies 
SET pashto_word = 'چلوونکو' 
WHERE id = 36256 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چلوونکو' 
    AND wf2.id != 36256
);
UPDATE word_frequencies 
SET pashto_word = 'چلوى' 
WHERE id = 32554 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چلوى' 
    AND wf2.id != 32554
);
UPDATE word_frequencies 
SET pashto_word = 'چليږى' 
WHERE id = 32819 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چليږى' 
    AND wf2.id != 32819
);
UPDATE word_frequencies 
SET pashto_word = 'چلېدل' 
WHERE id = 40117 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چلېدل' 
    AND wf2.id != 40117
);
UPDATE word_frequencies 
SET pashto_word = 'چمټې' 
WHERE id = 40106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چمټې' 
    AND wf2.id != 40106
);
UPDATE word_frequencies 
SET pashto_word = 'چمچۍ' 
WHERE id = 37108 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چمچۍ' 
    AND wf2.id != 37108
);
UPDATE word_frequencies 
SET pashto_word = 'چنده' 
WHERE id = 34360 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چنده' 
    AND wf2.id != 34360
);
UPDATE word_frequencies 
SET pashto_word = 'چنګونه' 
WHERE id = 35142 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چنګونه' 
    AND wf2.id != 35142
);
UPDATE word_frequencies 
SET pashto_word = 'چورليږى' 
WHERE id = 37080 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چورليږى' 
    AND wf2.id != 37080
);
UPDATE word_frequencies 
SET pashto_word = 'چوکاټونه' 
WHERE id = 39375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چوکاټونه' 
    AND wf2.id != 39375
);
UPDATE word_frequencies 
SET pashto_word = 'چوکاټونو' 
WHERE id = 25636 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چوکاټونو' 
    AND wf2.id != 25636
);
UPDATE word_frequencies 
SET pashto_word = 'چينجی' 
WHERE id = 42002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چينجی' 
    AND wf2.id != 42002
);
UPDATE word_frequencies 
SET pashto_word = 'چيچى' 
WHERE id = 31518 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چيچى' 
    AND wf2.id != 31518
);
UPDATE word_frequencies 
SET pashto_word = 'چُوغه' 
WHERE id = 39337 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چُوغه' 
    AND wf2.id != 39337
);
UPDATE word_frequencies 
SET pashto_word = 'چُوغې' 
WHERE id = 32495 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چُوغې' 
    AND wf2.id != 32495
);
UPDATE word_frequencies 
SET pashto_word = 'چپنه' 
WHERE id = 37721 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چپنه' 
    AND wf2.id != 37721
);
UPDATE word_frequencies 
SET pashto_word = 'چپنې' 
WHERE id = 36342 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چپنې' 
    AND wf2.id != 36342
);
UPDATE word_frequencies 
SET pashto_word = 'چیغې' 
WHERE id = 36428 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چیغې' 
    AND wf2.id != 36428
);
UPDATE word_frequencies 
SET pashto_word = 'چېلی' 
WHERE id = 42119 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'چېلی' 
    AND wf2.id != 42119
);
UPDATE word_frequencies 
SET pashto_word = 'ډالونو' 
WHERE id = 40314 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډالونو' 
    AND wf2.id != 40314
);
UPDATE word_frequencies 
SET pashto_word = 'ډله' 
WHERE id = 37715 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډله' 
    AND wf2.id != 37715
);
UPDATE word_frequencies 
SET pashto_word = 'ډوبېږم' 
WHERE id = 31529 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډوبېږم' 
    AND wf2.id != 31529
);
UPDATE word_frequencies 
SET pashto_word = 'ډوډۍ' 
WHERE id = 22642 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډوډۍ' 
    AND wf2.id != 22642
);
UPDATE word_frequencies 
SET pashto_word = 'ډيرى' 
WHERE id = 31846 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډيرى' 
    AND wf2.id != 31846
);
UPDATE word_frequencies 
SET pashto_word = 'ډينګان' 
WHERE id = 37150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډينګان' 
    AND wf2.id != 37150
);
UPDATE word_frequencies 
SET pashto_word = 'ډيوټ' 
WHERE id = 28708 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډيوټ' 
    AND wf2.id != 28708
);
UPDATE word_frequencies 
SET pashto_word = 'ډيګۍ' 
WHERE id = 28001 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډيګۍ' 
    AND wf2.id != 28001
);
UPDATE word_frequencies 
SET pashto_word = 'ډک' 
WHERE id = 24982 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډک' 
    AND wf2.id != 24982
);
UPDATE word_frequencies 
SET pashto_word = 'ډکوى' 
WHERE id = 25774 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډکوى' 
    AND wf2.id != 25774
);
UPDATE word_frequencies 
SET pashto_word = 'ډکیږي' 
WHERE id = 38233 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډکیږي' 
    AND wf2.id != 38233
);
UPDATE word_frequencies 
SET pashto_word = 'ډېری' 
WHERE id = 41986 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ډېری' 
    AND wf2.id != 41986
);
UPDATE word_frequencies 
SET pashto_word = 'ړانده' 
WHERE id = 29670 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ړانده' 
    AND wf2.id != 29670
);
UPDATE word_frequencies 
SET pashto_word = 'ړاندۀ' 
WHERE id = 28021 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ړاندۀ' 
    AND wf2.id != 28021
);
UPDATE word_frequencies 
SET pashto_word = 'ړل' 
WHERE id = 32534 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ړل' 
    AND wf2.id != 32534
);
UPDATE word_frequencies 
SET pashto_word = 'ړو' 
WHERE id = 32197 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ړو' 
    AND wf2.id != 32197
);
UPDATE word_frequencies 
SET pashto_word = 'ړوند' 
WHERE id = 31546 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ړوند' 
    AND wf2.id != 31546
);
UPDATE word_frequencies 
SET pashto_word = 'ږدم' 
WHERE id = 18072 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږدم' 
    AND wf2.id != 18072
);
UPDATE word_frequencies 
SET pashto_word = 'ږدى' 
WHERE id = 22106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږدى' 
    AND wf2.id != 22106
);
UPDATE word_frequencies 
SET pashto_word = 'ږدي' 
WHERE id = 29462 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږدي' 
    AND wf2.id != 29462
);
UPDATE word_frequencies 
SET pashto_word = 'ږدی' 
WHERE id = 41801 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږدی' 
    AND wf2.id != 41801
);
UPDATE word_frequencies 
SET pashto_word = 'ږدې' 
WHERE id = 32475 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږدې' 
    AND wf2.id != 32475
);
UPDATE word_frequencies 
SET pashto_word = 'ږلۍ' 
WHERE id = 36278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږلۍ' 
    AND wf2.id != 36278
);
UPDATE word_frequencies 
SET pashto_word = 'ږیري' 
WHERE id = 30967 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ږیري' 
    AND wf2.id != 30967
);
UPDATE word_frequencies 
SET pashto_word = 'ژاړي' 
WHERE id = 33758 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژاړي' 
    AND wf2.id != 33758
);
UPDATE word_frequencies 
SET pashto_word = 'ژاړی' 
WHERE id = 40778 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژاړی' 
    AND wf2.id != 40778
);
UPDATE word_frequencies 
SET pashto_word = 'ژاړې' 
WHERE id = 26955 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژاړې' 
    AND wf2.id != 26955
);
UPDATE word_frequencies 
SET pashto_word = 'ژغورل' 
WHERE id = 30304 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژغورل' 
    AND wf2.id != 30304
);
UPDATE word_frequencies 
SET pashto_word = 'ژغورلی' 
WHERE id = 27165 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژغورلی' 
    AND wf2.id != 27165
);
UPDATE word_frequencies 
SET pashto_word = 'ژغورم' 
WHERE id = 35705 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژغورم' 
    AND wf2.id != 35705
);
UPDATE word_frequencies 
SET pashto_word = 'ژغوري' 
WHERE id = 20790 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژغوري' 
    AND wf2.id != 20790
);
UPDATE word_frequencies 
SET pashto_word = 'ژوند' 
WHERE id = 22424 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژوند' 
    AND wf2.id != 22424
);
UPDATE word_frequencies 
SET pashto_word = 'ژوندون' 
WHERE id = 32806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژوندون' 
    AND wf2.id != 32806
);
UPDATE word_frequencies 
SET pashto_word = 'ژړل' 
WHERE id = 20015 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ژړل' 
    AND wf2.id != 20015
);
UPDATE word_frequencies 
SET pashto_word = 'ښائې' 
WHERE id = 39494 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښائې' 
    AND wf2.id != 39494
);
UPDATE word_frequencies 
SET pashto_word = 'ښار' 
WHERE id = 18379 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښار' 
    AND wf2.id != 18379
);
UPDATE word_frequencies 
SET pashto_word = 'ښاره' 
WHERE id = 21702 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښاره' 
    AND wf2.id != 21702
);
UPDATE word_frequencies 
SET pashto_word = 'ښارونه' 
WHERE id = 18490 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښارونه' 
    AND wf2.id != 18490
);
UPDATE word_frequencies 
SET pashto_word = 'ښارونو' 
WHERE id = 25812 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښارونو' 
    AND wf2.id != 25812
);
UPDATE word_frequencies 
SET pashto_word = 'ښاريې' 
WHERE id = 25729 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښاريې' 
    AND wf2.id != 25729
);
UPDATE word_frequencies 
SET pashto_word = 'ښارګوټي' 
WHERE id = 19646 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښارګوټي' 
    AND wf2.id != 19646
);
UPDATE word_frequencies 
SET pashto_word = 'ښاغلیه' 
WHERE id = 19794 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښاغلیه' 
    AND wf2.id != 19794
);
UPDATE word_frequencies 
SET pashto_word = 'ښايم' 
WHERE id = 26170 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښايم' 
    AND wf2.id != 26170
);
UPDATE word_frequencies 
SET pashto_word = 'ښایسته' 
WHERE id = 42057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښایسته' 
    AND wf2.id != 42057
);
UPDATE word_frequencies 
SET pashto_word = 'ښایى' 
WHERE id = 41362 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښایى' 
    AND wf2.id != 41362
);
UPDATE word_frequencies 
SET pashto_word = 'ښایي' 
WHERE id = 27147 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښایي' 
    AND wf2.id != 27147
);
UPDATE word_frequencies 
SET pashto_word = 'ښایی' 
WHERE id = 41815 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښایی' 
    AND wf2.id != 41815
);
UPDATE word_frequencies 
SET pashto_word = 'ښخوى' 
WHERE id = 31093 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښخوى' 
    AND wf2.id != 31093
);
UPDATE word_frequencies 
SET pashto_word = 'ښخيږى' 
WHERE id = 37268 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښخيږى' 
    AND wf2.id != 37268
);
UPDATE word_frequencies 
SET pashto_word = 'ښخېږم' 
WHERE id = 38609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښخېږم' 
    AND wf2.id != 38609
);
UPDATE word_frequencies 
SET pashto_word = 'ښه' 
WHERE id = 27282 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښه' 
    AND wf2.id != 27282
);
UPDATE word_frequencies 
SET pashto_word = 'ښودل' 
WHERE id = 23234 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودل' 
    AND wf2.id != 23234
);
UPDATE word_frequencies 
SET pashto_word = 'ښودله' 
WHERE id = 27376 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودله' 
    AND wf2.id != 27376
);
UPDATE word_frequencies 
SET pashto_word = 'ښودلو' 
WHERE id = 31950 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودلو' 
    AND wf2.id != 31950
);
UPDATE word_frequencies 
SET pashto_word = 'ښودلی' 
WHERE id = 42084 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودلی' 
    AND wf2.id != 42084
);
UPDATE word_frequencies 
SET pashto_word = 'ښودلې' 
WHERE id = 24837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودلې' 
    AND wf2.id != 24837
);
UPDATE word_frequencies 
SET pashto_word = 'ښودو' 
WHERE id = 28776 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښودو' 
    AND wf2.id != 28776
);
UPDATE word_frequencies 
SET pashto_word = 'ښویيږى' 
WHERE id = 41696 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښویيږى' 
    AND wf2.id != 41696
);
UPDATE word_frequencies 
SET pashto_word = 'ښوییږي' 
WHERE id = 36223 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښوییږي' 
    AND wf2.id != 36223
);
UPDATE word_frequencies 
SET pashto_word = 'ښځه' 
WHERE id = 18992 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښځه' 
    AND wf2.id != 18992
);
UPDATE word_frequencies 
SET pashto_word = 'ښځو' 
WHERE id = 15566 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښځو' 
    AND wf2.id != 15566
);
UPDATE word_frequencies 
SET pashto_word = 'ښځې' 
WHERE id = 33612 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښځې' 
    AND wf2.id != 33612
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارى' 
WHERE id = 18798 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارى' 
    AND wf2.id != 18798
);
UPDATE word_frequencies 
SET pashto_word = 'ښکاري' 
WHERE id = 23459 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکاري' 
    AND wf2.id != 23459
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارينه' 
WHERE id = 22163 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارينه' 
    AND wf2.id != 22163
);
UPDATE word_frequencies 
SET pashto_word = 'ښکاری' 
WHERE id = 41851 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکاری' 
    AND wf2.id != 41851
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارېدل' 
WHERE id = 24361 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارېدل' 
    AND wf2.id != 24361
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارېدله' 
WHERE id = 35311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارېدله' 
    AND wf2.id != 35311
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارېده' 
WHERE id = 26377 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارېده' 
    AND wf2.id != 26377
);
UPDATE word_frequencies 
SET pashto_word = 'ښکارېدو' 
WHERE id = 17765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکارېدو' 
    AND wf2.id != 17765
);
UPDATE word_frequencies 
SET pashto_word = 'ښکلوي' 
WHERE id = 34216 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکلوي' 
    AND wf2.id != 34216
);
UPDATE word_frequencies 
SET pashto_word = 'ښکلى' 
WHERE id = 35253 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښکلى' 
    AND wf2.id != 35253
);
UPDATE word_frequencies 
SET pashto_word = 'ښۀ' 
WHERE id = 28579 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ښۀ' 
    AND wf2.id != 28579
);
UPDATE word_frequencies 
SET pashto_word = 'کار' 
WHERE id = 25305 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کار' 
    AND wf2.id != 25305
);
UPDATE word_frequencies 
SET pashto_word = 'کارو' 
WHERE id = 32905 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کارو' 
    AND wf2.id != 32905
);
UPDATE word_frequencies 
SET pashto_word = 'کارونه' 
WHERE id = 36389 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کارونه' 
    AND wf2.id != 36389
);
UPDATE word_frequencies 
SET pashto_word = 'کارونو' 
WHERE id = 25302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کارونو' 
    AND wf2.id != 25302
);
UPDATE word_frequencies 
SET pashto_word = 'کاروی' 
WHERE id = 41875 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاروی' 
    AND wf2.id != 41875
);
UPDATE word_frequencies 
SET pashto_word = 'کاريګران' 
WHERE id = 37106 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاريګران' 
    AND wf2.id != 37106
);
UPDATE word_frequencies 
SET pashto_word = 'کاریږي' 
WHERE id = 38174 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاریږي' 
    AND wf2.id != 38174
);
UPDATE word_frequencies 
SET pashto_word = 'کاسد' 
WHERE id = 36044 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاسد' 
    AND wf2.id != 36044
);
UPDATE word_frequencies 
SET pashto_word = 'کاسې' 
WHERE id = 38170 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاسې' 
    AND wf2.id != 38170
);
UPDATE word_frequencies 
SET pashto_word = 'کاش' 
WHERE id = 37215 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاش' 
    AND wf2.id != 37215
);
UPDATE word_frequencies 
SET pashto_word = 'کال' 
WHERE id = 13302 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کال' 
    AND wf2.id != 13302
);
UPDATE word_frequencies 
SET pashto_word = 'کالی' 
WHERE id = 40916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کالی' 
    AND wf2.id != 40916
);
UPDATE word_frequencies 
SET pashto_word = 'کاميابېدو' 
WHERE id = 39945 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاميابېدو' 
    AND wf2.id != 39945
);
UPDATE word_frequencies 
SET pashto_word = 'کاندي' 
WHERE id = 37809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاندي' 
    AND wf2.id != 37809
);
UPDATE word_frequencies 
SET pashto_word = 'کاهن' 
WHERE id = 25994 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاهن' 
    AND wf2.id != 25994
);
UPDATE word_frequencies 
SET pashto_word = 'کاهنان' 
WHERE id = 21596 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاهنان' 
    AND wf2.id != 21596
);
UPDATE word_frequencies 
SET pashto_word = 'کاهنانو' 
WHERE id = 18309 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاهنانو' 
    AND wf2.id != 18309
);
UPDATE word_frequencies 
SET pashto_word = 'کاوه' 
WHERE id = 12993 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاوه' 
    AND wf2.id != 12993
);
UPDATE word_frequencies 
SET pashto_word = 'کاڼو' 
WHERE id = 28970 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاڼو' 
    AND wf2.id != 28970
);
UPDATE word_frequencies 
SET pashto_word = 'کاڼی' 
WHERE id = 40743 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاڼی' 
    AND wf2.id != 40743
);
UPDATE word_frequencies 
SET pashto_word = 'کاینایټ' 
WHERE id = 42108 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کاینایټ' 
    AND wf2.id != 42108
);
UPDATE word_frequencies 
SET pashto_word = 'کبانو' 
WHERE id = 38927 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کبانو' 
    AND wf2.id != 38927
);
UPDATE word_frequencies 
SET pashto_word = 'کبون' 
WHERE id = 37631 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کبون' 
    AND wf2.id != 37631
);
UPDATE word_frequencies 
SET pashto_word = 'کتان' 
WHERE id = 22700 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کتان' 
    AND wf2.id != 22700
);
UPDATE word_frequencies 
SET pashto_word = 'کتل' 
WHERE id = 18616 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کتل' 
    AND wf2.id != 18616
);
UPDATE word_frequencies 
SET pashto_word = 'کران' 
WHERE id = 36069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کران' 
    AND wf2.id != 36069
);
UPDATE word_frequencies 
SET pashto_word = 'کربوړی' 
WHERE id = 37928 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کربوړی' 
    AND wf2.id != 37928
);
UPDATE word_frequencies 
SET pashto_word = 'کرمل' 
WHERE id = 37640 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کرمل' 
    AND wf2.id != 37640
);
UPDATE word_frequencies 
SET pashto_word = 'کرمى' 
WHERE id = 31996 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کرمى' 
    AND wf2.id != 31996
);
UPDATE word_frequencies 
SET pashto_word = 'کري' 
WHERE id = 29994 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کري' 
    AND wf2.id != 29994
);
UPDATE word_frequencies 
SET pashto_word = 'کری' 
WHERE id = 41402 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کری' 
    AND wf2.id != 41402
);
UPDATE word_frequencies 
SET pashto_word = 'کس' 
WHERE id = 37697 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کس' 
    AND wf2.id != 37697
);
UPDATE word_frequencies 
SET pashto_word = 'کسان' 
WHERE id = 25473 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کسان' 
    AND wf2.id != 25473
);
UPDATE word_frequencies 
SET pashto_word = 'کسانو' 
WHERE id = 36958 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کسانو' 
    AND wf2.id != 36958
);
UPDATE word_frequencies 
SET pashto_word = 'کسیزه' 
WHERE id = 9194 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کسیزه' 
    AND wf2.id != 9194
);
UPDATE word_frequencies 
SET pashto_word = 'کشمشو' 
WHERE id = 40037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کشمشو' 
    AND wf2.id != 40037
);
UPDATE word_frequencies 
SET pashto_word = 'کفیره' 
WHERE id = 37661 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کفیره' 
    AND wf2.id != 37661
);
UPDATE word_frequencies 
SET pashto_word = 'کلو' 
WHERE id = 31169 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کلو' 
    AND wf2.id != 31169
);
UPDATE word_frequencies 
SET pashto_word = 'کلي' 
WHERE id = 34189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کلي' 
    AND wf2.id != 34189
);
UPDATE word_frequencies 
SET pashto_word = 'کمانډر' 
WHERE id = 36896 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کمانډر' 
    AND wf2.id != 36896
);
UPDATE word_frequencies 
SET pashto_word = 'کموی' 
WHERE id = 42092 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کموی' 
    AND wf2.id != 42092
);
UPDATE word_frequencies 
SET pashto_word = 'کميږى' 
WHERE id = 37213 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کميږى' 
    AND wf2.id != 37213
);
UPDATE word_frequencies 
SET pashto_word = 'کمیږي' 
WHERE id = 36265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کمیږي' 
    AND wf2.id != 36265
);
UPDATE word_frequencies 
SET pashto_word = 'کنعان' 
WHERE id = 38970 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنعان' 
    AND wf2.id != 38970
);
UPDATE word_frequencies 
SET pashto_word = 'کنعانه' 
WHERE id = 31853 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنعانه' 
    AND wf2.id != 31853
);
UPDATE word_frequencies 
SET pashto_word = 'کنعانیان' 
WHERE id = 27635 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنعانیان' 
    AND wf2.id != 27635
);
UPDATE word_frequencies 
SET pashto_word = 'کنعانیانو' 
WHERE id = 25654 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنعانیانو' 
    AND wf2.id != 25654
);
UPDATE word_frequencies 
SET pashto_word = 'کنه' 
WHERE id = 38674 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنه' 
    AND wf2.id != 38674
);
UPDATE word_frequencies 
SET pashto_word = 'کنډ' 
WHERE id = 30098 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کنډ' 
    AND wf2.id != 30098
);
UPDATE word_frequencies 
SET pashto_word = 'کور' 
WHERE id = 17214 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کور' 
    AND wf2.id != 17214
);
UPDATE word_frequencies 
SET pashto_word = 'کورونه' 
WHERE id = 21748 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کورونه' 
    AND wf2.id != 21748
);
UPDATE word_frequencies 
SET pashto_word = 'کورَنو' 
WHERE id = 39615 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کورَنو' 
    AND wf2.id != 39615
);
UPDATE word_frequencies 
SET pashto_word = 'کوزيږى' 
WHERE id = 28656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوزيږى' 
    AND wf2.id != 28656
);
UPDATE word_frequencies 
SET pashto_word = 'کوش' 
WHERE id = 38969 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوش' 
    AND wf2.id != 38969
);
UPDATE word_frequencies 
SET pashto_word = 'کول' 
WHERE id = 13808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کول' 
    AND wf2.id != 13808
);
UPDATE word_frequencies 
SET pashto_word = 'کولاولی' 
WHERE id = 41671 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولاولی' 
    AND wf2.id != 41671
);
UPDATE word_frequencies 
SET pashto_word = 'کولاويږى' 
WHERE id = 32912 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولاويږى' 
    AND wf2.id != 32912
);
UPDATE word_frequencies 
SET pashto_word = 'کولای' 
WHERE id = 15784 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولای' 
    AND wf2.id != 15784
);
UPDATE word_frequencies 
SET pashto_word = 'کولمو' 
WHERE id = 39404 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولمو' 
    AND wf2.id != 39404
);
UPDATE word_frequencies 
SET pashto_word = 'کوله' 
WHERE id = 12534 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوله' 
    AND wf2.id != 12534
);
UPDATE word_frequencies 
SET pashto_word = 'کولو' 
WHERE id = 12418 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولو' 
    AND wf2.id != 12418
);
UPDATE word_frequencies 
SET pashto_word = 'کولونه' 
WHERE id = 38639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولونه' 
    AND wf2.id != 38639
);
UPDATE word_frequencies 
SET pashto_word = 'کولی' 
WHERE id = 36121 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولی' 
    AND wf2.id != 36121
);
UPDATE word_frequencies 
SET pashto_word = 'کولې' 
WHERE id = 13354 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کولې' 
    AND wf2.id != 13354
);
UPDATE word_frequencies 
SET pashto_word = 'کوم' 
WHERE id = 12183 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوم' 
    AND wf2.id != 12183
);
UPDATE word_frequencies 
SET pashto_word = 'کومه' 
WHERE id = 38661 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کومه' 
    AND wf2.id != 38661
);
UPDATE word_frequencies 
SET pashto_word = 'کومي' 
WHERE id = 26998 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کومي' 
    AND wf2.id != 26998
);
UPDATE word_frequencies 
SET pashto_word = 'کونډو' 
WHERE id = 38874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کونډو' 
    AND wf2.id != 38874
);
UPDATE word_frequencies 
SET pashto_word = 'کوه' 
WHERE id = 23806 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوه' 
    AND wf2.id != 23806
);
UPDATE word_frequencies 
SET pashto_word = 'کوو' 
WHERE id = 16268 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوو' 
    AND wf2.id != 16268
);
UPDATE word_frequencies 
SET pashto_word = 'کوونه' 
WHERE id = 38625 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوونه' 
    AND wf2.id != 38625
);
UPDATE word_frequencies 
SET pashto_word = 'کوونکو' 
WHERE id = 31130 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوونکو' 
    AND wf2.id != 31130
);
UPDATE word_frequencies 
SET pashto_word = 'کوونکيه' 
WHERE id = 25491 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوونکيه' 
    AND wf2.id != 25491
);
UPDATE word_frequencies 
SET pashto_word = 'کوونکی' 
WHERE id = 33195 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوونکی' 
    AND wf2.id != 33195
);
UPDATE word_frequencies 
SET pashto_word = 'کوي' 
WHERE id = 20967 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوي' 
    AND wf2.id != 20967
);
UPDATE word_frequencies 
SET pashto_word = 'کوينه' 
WHERE id = 28471 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوينه' 
    AND wf2.id != 28471
);
UPDATE word_frequencies 
SET pashto_word = 'کوُو' 
WHERE id = 13797 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوُو' 
    AND wf2.id != 13797
);
UPDATE word_frequencies 
SET pashto_word = 'کوُو“' 
WHERE id = 37373 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوُو“' 
    AND wf2.id != 37373
);
UPDATE word_frequencies 
SET pashto_word = 'کوټو' 
WHERE id = 30771 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوټو' 
    AND wf2.id != 30771
);
UPDATE word_frequencies 
SET pashto_word = 'کوټې' 
WHERE id = 26451 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوټې' 
    AND wf2.id != 26451
);
UPDATE word_frequencies 
SET pashto_word = 'کوی' 
WHERE id = 41224 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوی' 
    AND wf2.id != 41224
);
UPDATE word_frequencies 
SET pashto_word = 'کوې' 
WHERE id = 13620 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کوې' 
    AND wf2.id != 13620
);
UPDATE word_frequencies 
SET pashto_word = 'کينه' 
WHERE id = 33016 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کينه' 
    AND wf2.id != 33016
);
UPDATE word_frequencies 
SET pashto_word = 'کيږى' 
WHERE id = 18046 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کيږى' 
    AND wf2.id != 18046
);
UPDATE word_frequencies 
SET pashto_word = 'کيږينه' 
WHERE id = 28468 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کيږينه' 
    AND wf2.id != 28468
);
UPDATE word_frequencies 
SET pashto_word = 'کيږُو' 
WHERE id = 28857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کيږُو' 
    AND wf2.id != 28857
);
UPDATE word_frequencies 
SET pashto_word = 'کَرى' 
WHERE id = 29067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کَرى' 
    AND wf2.id != 29067
);
UPDATE word_frequencies 
SET pashto_word = 'کَری' 
WHERE id = 41530 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کَری' 
    AND wf2.id != 41530
);
UPDATE word_frequencies 
SET pashto_word = 'کُنډې' 
WHERE id = 28701 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کُنډې' 
    AND wf2.id != 28701
);
UPDATE word_frequencies 
SET pashto_word = 'کپدوکیې' 
WHERE id = 33151 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کپدوکیې' 
    AND wf2.id != 33151
);
UPDATE word_frequencies 
SET pashto_word = 'کپړه' 
WHERE id = 28685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کپړه' 
    AND wf2.id != 28685
);
UPDATE word_frequencies 
SET pashto_word = 'کپړې' 
WHERE id = 24703 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کپړې' 
    AND wf2.id != 24703
);
UPDATE word_frequencies 
SET pashto_word = 'کړ' 
WHERE id = 37736 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړ' 
    AND wf2.id != 37736
);
UPDATE word_frequencies 
SET pashto_word = 'کړل' 
WHERE id = 11711 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړل' 
    AND wf2.id != 11711
);
UPDATE word_frequencies 
SET pashto_word = 'کړله' 
WHERE id = 18040 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړله' 
    AND wf2.id != 18040
);
UPDATE word_frequencies 
SET pashto_word = 'کړلو' 
WHERE id = 24149 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړلو' 
    AND wf2.id != 24149
);
UPDATE word_frequencies 
SET pashto_word = 'کړلې' 
WHERE id = 16941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړلې' 
    AND wf2.id != 16941
);
UPDATE word_frequencies 
SET pashto_word = 'کړم' 
WHERE id = 11677 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړم' 
    AND wf2.id != 11677
);
UPDATE word_frequencies 
SET pashto_word = 'کړمه' 
WHERE id = 38723 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړمه' 
    AND wf2.id != 38723
);
UPDATE word_frequencies 
SET pashto_word = 'کړه' 
WHERE id = 18595 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړه' 
    AND wf2.id != 18595
);
UPDATE word_frequencies 
SET pashto_word = 'کړو' 
WHERE id = 11733 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړو' 
    AND wf2.id != 11733
);
UPDATE word_frequencies 
SET pashto_word = 'کړونه' 
WHERE id = 20689 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړونه' 
    AND wf2.id != 20689
);
UPDATE word_frequencies 
SET pashto_word = 'کړي' 
WHERE id = 25665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړي' 
    AND wf2.id != 25665
);
UPDATE word_frequencies 
SET pashto_word = 'کړينه' 
WHERE id = 28456 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړينه' 
    AND wf2.id != 28456
);
UPDATE word_frequencies 
SET pashto_word = 'کړيږى' 
WHERE id = 31327 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړيږى' 
    AND wf2.id != 31327
);
UPDATE word_frequencies 
SET pashto_word = 'کړُو' 
WHERE id = 13587 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړُو' 
    AND wf2.id != 13587
);
UPDATE word_frequencies 
SET pashto_word = 'کړی' 
WHERE id = 41150 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړی' 
    AND wf2.id != 41150
);
UPDATE word_frequencies 
SET pashto_word = 'کړې' 
WHERE id = 12008 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کړې' 
    AND wf2.id != 12008
);
UPDATE word_frequencies 
SET pashto_word = 'کښې' 
WHERE id = 18401 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښې' 
    AND wf2.id != 18401
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناست' 
WHERE id = 17189 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناست' 
    AND wf2.id != 17189
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناستل' 
WHERE id = 17622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناستل' 
    AND wf2.id != 17622
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناستلم' 
WHERE id = 35333 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناستلم' 
    AND wf2.id != 35333
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناستله' 
WHERE id = 26808 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناستله' 
    AND wf2.id != 26808
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناستم' 
WHERE id = 23813 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناستم' 
    AND wf2.id != 23813
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناسته' 
WHERE id = 31976 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناسته' 
    AND wf2.id != 31976
);
UPDATE word_frequencies 
SET pashto_word = 'کښېناستو' 
WHERE id = 15717 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېناستو' 
    AND wf2.id != 15717
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنم' 
WHERE id = 36130 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنم' 
    AND wf2.id != 36130
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنه' 
WHERE id = 22953 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنه' 
    AND wf2.id != 22953
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنول' 
WHERE id = 23749 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنول' 
    AND wf2.id != 23749
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنولم' 
WHERE id = 37878 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنولم' 
    AND wf2.id != 37878
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنولو' 
WHERE id = 29490 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنولو' 
    AND wf2.id != 29490
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنوی' 
WHERE id = 40793 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنوی' 
    AND wf2.id != 40793
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنى' 
WHERE id = 23326 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنى' 
    AND wf2.id != 23326
);
UPDATE word_frequencies 
SET pashto_word = 'کښېني' 
WHERE id = 19375 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېني' 
    AND wf2.id != 19375
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنی' 
WHERE id = 41511 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنی' 
    AND wf2.id != 41511
);
UPDATE word_frequencies 
SET pashto_word = 'کښېنې' 
WHERE id = 33998 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کښېنې' 
    AND wf2.id != 33998
);
UPDATE word_frequencies 
SET pashto_word = 'کیږي' 
WHERE id = 25588 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کیږي' 
    AND wf2.id != 25588
);
UPDATE word_frequencies 
SET pashto_word = 'کیږی' 
WHERE id = 40488 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کیږی' 
    AND wf2.id != 40488
);
UPDATE word_frequencies 
SET pashto_word = 'کې' 
WHERE id = 20972 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کې' 
    AND wf2.id != 20972
);
UPDATE word_frequencies 
SET pashto_word = 'کېدای' 
WHERE id = 33633 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدای' 
    AND wf2.id != 33633
);
UPDATE word_frequencies 
SET pashto_word = 'کېدل' 
WHERE id = 14999 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدل' 
    AND wf2.id != 14999
);
UPDATE word_frequencies 
SET pashto_word = 'کېدله' 
WHERE id = 19370 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدله' 
    AND wf2.id != 19370
);
UPDATE word_frequencies 
SET pashto_word = 'کېدلو' 
WHERE id = 23497 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدلو' 
    AND wf2.id != 23497
);
UPDATE word_frequencies 
SET pashto_word = 'کېدلی' 
WHERE id = 29940 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدلی' 
    AND wf2.id != 29940
);
UPDATE word_frequencies 
SET pashto_word = 'کېدلې' 
WHERE id = 17647 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدلې' 
    AND wf2.id != 17647
);
UPDATE word_frequencies 
SET pashto_word = 'کېده' 
WHERE id = 16622 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېده' 
    AND wf2.id != 16622
);
UPDATE word_frequencies 
SET pashto_word = 'کېدو' 
WHERE id = 17578 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدو' 
    AND wf2.id != 17578
);
UPDATE word_frequencies 
SET pashto_word = 'کېدی' 
WHERE id = 41756 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېدی' 
    AND wf2.id != 41756
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدم' 
WHERE id = 22754 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدم' 
    AND wf2.id != 22754
);
UPDATE word_frequencies 
SET pashto_word = 'کېږده' 
WHERE id = 35762 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږده' 
    AND wf2.id != 35762
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدو' 
WHERE id = 33595 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدو' 
    AND wf2.id != 33595
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدى' 
WHERE id = 17111 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدى' 
    AND wf2.id != 17111
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدي' 
WHERE id = 16444 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدي' 
    AND wf2.id != 16444
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدی' 
WHERE id = 41138 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدی' 
    AND wf2.id != 41138
);
UPDATE word_frequencies 
SET pashto_word = 'کېږدې' 
WHERE id = 23704 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږدې' 
    AND wf2.id != 23704
);
UPDATE word_frequencies 
SET pashto_word = 'کېږم' 
WHERE id = 21578 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږم' 
    AND wf2.id != 21578
);
UPDATE word_frequencies 
SET pashto_word = 'کېږه' 
WHERE id = 20471 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږه' 
    AND wf2.id != 20471
);
UPDATE word_frequencies 
SET pashto_word = 'کېږو' 
WHERE id = 22498 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږو' 
    AND wf2.id != 22498
);
UPDATE word_frequencies 
SET pashto_word = 'کېږی' 
WHERE id = 41027 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږی' 
    AND wf2.id != 41027
);
UPDATE word_frequencies 
SET pashto_word = 'کېږې' 
WHERE id = 22722 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېږې' 
    AND wf2.id != 22722
);
UPDATE word_frequencies 
SET pashto_word = 'کېښود' 
WHERE id = 16750 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښود' 
    AND wf2.id != 16750
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودل' 
WHERE id = 14482 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودل' 
    AND wf2.id != 14482
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودله' 
WHERE id = 20989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودله' 
    AND wf2.id != 20989
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودلو' 
WHERE id = 29031 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودلو' 
    AND wf2.id != 29031
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودلې' 
WHERE id = 20909 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودلې' 
    AND wf2.id != 20909
);
UPDATE word_frequencies 
SET pashto_word = 'کېښوده' 
WHERE id = 26247 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښوده' 
    AND wf2.id != 26247
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودو' 
WHERE id = 13067 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودو' 
    AND wf2.id != 13067
);
UPDATE word_frequencies 
SET pashto_word = 'کېښودې' 
WHERE id = 21410 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'کېښودې' 
    AND wf2.id != 21410
);
UPDATE word_frequencies 
SET pashto_word = 'ګاه' 
WHERE id = 7311 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګاه' 
    AND wf2.id != 7311
);
UPDATE word_frequencies 
SET pashto_word = 'ګاډو' 
WHERE id = 26463 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګاډو' 
    AND wf2.id != 26463
);
UPDATE word_frequencies 
SET pashto_word = 'ګاډۍ' 
WHERE id = 26260 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګاډۍ' 
    AND wf2.id != 26260
);
UPDATE word_frequencies 
SET pashto_word = 'ګبراويږى' 
WHERE id = 37011 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګبراويږى' 
    AND wf2.id != 37011
);
UPDATE word_frequencies 
SET pashto_word = 'ګرمېدو' 
WHERE id = 40069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرمېدو' 
    AND wf2.id != 40069
);
UPDATE word_frequencies 
SET pashto_word = 'ګرمېږی' 
WHERE id = 41911 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرمېږی' 
    AND wf2.id != 41911
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځم' 
WHERE id = 37985 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځم' 
    AND wf2.id != 37985
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځه' 
WHERE id = 35791 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځه' 
    AND wf2.id != 35791
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځوه' 
WHERE id = 38289 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځوه' 
    AND wf2.id != 38289
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځوى' 
WHERE id = 39339 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځوى' 
    AND wf2.id != 39339
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځوي' 
WHERE id = 34709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځوي' 
    AND wf2.id != 34709
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځى' 
WHERE id = 15405 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځى' 
    AND wf2.id != 15405
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځي' 
WHERE id = 16038 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځي' 
    AND wf2.id != 16038
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځی' 
WHERE id = 41329 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځی' 
    AND wf2.id != 41329
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځې' 
WHERE id = 36787 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځې' 
    AND wf2.id != 36787
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدل' 
WHERE id = 19104 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدل' 
    AND wf2.id != 19104
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدله' 
WHERE id = 31196 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدله' 
    AND wf2.id != 31196
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدلو' 
WHERE id = 27656 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدلو' 
    AND wf2.id != 27656
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدلې' 
WHERE id = 35824 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدلې' 
    AND wf2.id != 35824
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدم' 
WHERE id = 37315 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدم' 
    AND wf2.id != 37315
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېده' 
WHERE id = 24991 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېده' 
    AND wf2.id != 24991
);
UPDATE word_frequencies 
SET pashto_word = 'ګرځېدو' 
WHERE id = 26341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګرځېدو' 
    AND wf2.id != 26341
);
UPDATE word_frequencies 
SET pashto_word = 'ګلونه' 
WHERE id = 32091 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګلونه' 
    AND wf2.id != 32091
);
UPDATE word_frequencies 
SET pashto_word = 'ګليل' 
WHERE id = 32941 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګليل' 
    AND wf2.id != 32941
);
UPDATE word_frequencies 
SET pashto_word = 'ګمرياه' 
WHERE id = 36846 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګمرياه' 
    AND wf2.id != 36846
);
UPDATE word_frequencies 
SET pashto_word = 'ګناهونه' 
WHERE id = 32717 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګناهونه' 
    AND wf2.id != 32717
);
UPDATE word_frequencies 
SET pashto_word = 'ګنجیه' 
WHERE id = 34989 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګنجیه' 
    AND wf2.id != 34989
);
UPDATE word_frequencies 
SET pashto_word = 'ګنې' 
WHERE id = 23217 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګنې' 
    AND wf2.id != 23217
);
UPDATE word_frequencies 
SET pashto_word = 'ګوتمې' 
WHERE id = 39556 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوتمې' 
    AND wf2.id != 39556
);
UPDATE word_frequencies 
SET pashto_word = 'ګوتې' 
WHERE id = 38145 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوتې' 
    AND wf2.id != 38145
);
UPDATE word_frequencies 
SET pashto_word = 'ګودامونه' 
WHERE id = 33960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګودامونه' 
    AND wf2.id != 33960
);
UPDATE word_frequencies 
SET pashto_word = 'ګورم' 
WHERE id = 21219 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګورم' 
    AND wf2.id != 21219
);
UPDATE word_frequencies 
SET pashto_word = 'ګوره' 
WHERE id = 30926 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوره' 
    AND wf2.id != 30926
);
UPDATE word_frequencies 
SET pashto_word = 'ګورى' 
WHERE id = 15742 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګورى' 
    AND wf2.id != 15742
);
UPDATE word_frequencies 
SET pashto_word = 'ګوري' 
WHERE id = 21004 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوري' 
    AND wf2.id != 21004
);
UPDATE word_frequencies 
SET pashto_word = 'ګورينه' 
WHERE id = 38652 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګورينه' 
    AND wf2.id != 38652
);
UPDATE word_frequencies 
SET pashto_word = 'ګوری' 
WHERE id = 41496 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوری' 
    AND wf2.id != 41496
);
UPDATE word_frequencies 
SET pashto_word = 'ګورې' 
WHERE id = 30052 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګورې' 
    AND wf2.id != 30052
);
UPDATE word_frequencies 
SET pashto_word = 'ګوډ' 
WHERE id = 32162 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوډ' 
    AND wf2.id != 32162
);
UPDATE word_frequencies 
SET pashto_word = 'ګوډيان' 
WHERE id = 31156 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوډيان' 
    AND wf2.id != 31156
);
UPDATE word_frequencies 
SET pashto_word = 'ګوګوشتکې' 
WHERE id = 28161 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګوګوشتکې' 
    AND wf2.id != 28161
);
UPDATE word_frequencies 
SET pashto_word = 'ګټلې' 
WHERE id = 33287 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګټلې' 
    AND wf2.id != 33287
);
UPDATE word_frequencies 
SET pashto_word = 'ګټى' 
WHERE id = 32795 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګټى' 
    AND wf2.id != 32795
);
UPDATE word_frequencies 
SET pashto_word = 'ګټی' 
WHERE id = 42072 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګټی' 
    AND wf2.id != 42072
);
UPDATE word_frequencies 
SET pashto_word = 'ګډ' 
WHERE id = 26321 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډ' 
    AND wf2.id != 26321
);
UPDATE word_frequencies 
SET pashto_word = 'ګډان' 
WHERE id = 28677 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډان' 
    AND wf2.id != 28677
);
UPDATE word_frequencies 
SET pashto_word = 'ګډانو' 
WHERE id = 32469 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډانو' 
    AND wf2.id != 32469
);
UPDATE word_frequencies 
SET pashto_word = 'ګډه' 
WHERE id = 39118 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډه' 
    AND wf2.id != 39118
);
UPDATE word_frequencies 
SET pashto_word = 'ګډو' 
WHERE id = 23225 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډو' 
    AND wf2.id != 23225
);
UPDATE word_frequencies 
SET pashto_word = 'ګډورو' 
WHERE id = 28133 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډورو' 
    AND wf2.id != 28133
);
UPDATE word_frequencies 
SET pashto_word = 'ګډيږى' 
WHERE id = 37265 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډيږى' 
    AND wf2.id != 37265
);
UPDATE word_frequencies 
SET pashto_word = 'ګډيږينه' 
WHERE id = 38762 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډيږينه' 
    AND wf2.id != 38762
);
UPDATE word_frequencies 
SET pashto_word = 'ګډُورى' 
WHERE id = 20183 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډُورى' 
    AND wf2.id != 20183
);
UPDATE word_frequencies 
SET pashto_word = 'ګډُوری' 
WHERE id = 42132 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډُوری' 
    AND wf2.id != 42132
);
UPDATE word_frequencies 
SET pashto_word = 'ګډې' 
WHERE id = 38816 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډې' 
    AND wf2.id != 38816
);
UPDATE word_frequencies 
SET pashto_word = 'ګډېدل' 
WHERE id = 32119 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډېدل' 
    AND wf2.id != 32119
);
UPDATE word_frequencies 
SET pashto_word = 'ګډېږم' 
WHERE id = 40001 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګډېږم' 
    AND wf2.id != 40001
);
UPDATE word_frequencies 
SET pashto_word = 'ګړزار' 
WHERE id = 29207 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګړزار' 
    AND wf2.id != 29207
);
UPDATE word_frequencies 
SET pashto_word = 'ګړزيږى' 
WHERE id = 37540 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګړزيږى' 
    AND wf2.id != 37540
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼل' 
WHERE id = 27319 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼل' 
    AND wf2.id != 27319
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼلو' 
WHERE id = 21766 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼلو' 
    AND wf2.id != 21766
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼلی' 
WHERE id = 41103 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼلی' 
    AND wf2.id != 41103
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼم' 
WHERE id = 21529 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼم' 
    AND wf2.id != 21529
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼه' 
WHERE id = 27314 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼه' 
    AND wf2.id != 27314
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼى' 
WHERE id = 18685 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼى' 
    AND wf2.id != 18685
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼي' 
WHERE id = 20382 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼي' 
    AND wf2.id != 20382
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼی' 
WHERE id = 41121 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼی' 
    AND wf2.id != 41121
);
UPDATE word_frequencies 
SET pashto_word = 'ګڼې' 
WHERE id = 27248 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګڼې' 
    AND wf2.id != 27248
);
UPDATE word_frequencies 
SET pashto_word = 'ګېريږى' 
WHERE id = 37243 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ګېريږى' 
    AND wf2.id != 37243
);
UPDATE word_frequencies 
SET pashto_word = 'یادول' 
WHERE id = 35527 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادول' 
    AND wf2.id != 35527
);
UPDATE word_frequencies 
SET pashto_word = 'یادوم' 
WHERE id = 29242 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادوم' 
    AND wf2.id != 29242
);
UPDATE word_frequencies 
SET pashto_word = 'یادوو' 
WHERE id = 33160 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادوو' 
    AND wf2.id != 33160
);
UPDATE word_frequencies 
SET pashto_word = 'یادوی' 
WHERE id = 40857 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادوی' 
    AND wf2.id != 40857
);
UPDATE word_frequencies 
SET pashto_word = 'یادیږي' 
WHERE id = 18639 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادیږي' 
    AND wf2.id != 18639
);
UPDATE word_frequencies 
SET pashto_word = 'یادېدله' 
WHERE id = 33694 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادېدله' 
    AND wf2.id != 33694
);
UPDATE word_frequencies 
SET pashto_word = 'یادېده' 
WHERE id = 30609 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یادېده' 
    AND wf2.id != 30609
);
UPDATE word_frequencies 
SET pashto_word = 'یافت' 
WHERE id = 36082 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یافت' 
    AND wf2.id != 36082
);
UPDATE word_frequencies 
SET pashto_word = 'یافیع' 
WHERE id = 10648 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یافیع' 
    AND wf2.id != 10648
);
UPDATE word_frequencies 
SET pashto_word = 'یاقوتو' 
WHERE id = 25290 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یاقوتو' 
    AND wf2.id != 25290
);
UPDATE word_frequencies 
SET pashto_word = 'یامین' 
WHERE id = 10655 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یامین' 
    AND wf2.id != 10655
);
UPDATE word_frequencies 
SET pashto_word = 'یاهص' 
WHERE id = 37600 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یاهص' 
    AND wf2.id != 37600
);
UPDATE word_frequencies 
SET pashto_word = 'یبوسیان' 
WHERE id = 35470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یبوسیان' 
    AND wf2.id != 35470
);
UPDATE word_frequencies 
SET pashto_word = 'یتیر' 
WHERE id = 37634 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یتیر' 
    AND wf2.id != 37634
);
UPDATE word_frequencies 
SET pashto_word = 'یحییل' 
WHERE id = 30218 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یحییل' 
    AND wf2.id != 30218
);
UPDATE word_frequencies 
SET pashto_word = 'یدیعییل' 
WHERE id = 10686 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یدیعییل' 
    AND wf2.id != 10686
);
UPDATE word_frequencies 
SET pashto_word = 'یرموت' 
WHERE id = 28263 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یرموت' 
    AND wf2.id != 28263
);
UPDATE word_frequencies 
SET pashto_word = 'یریا' 
WHERE id = 9053 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یریا' 
    AND wf2.id != 9053
);
UPDATE word_frequencies 
SET pashto_word = 'یریموت' 
WHERE id = 34846 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یریموت' 
    AND wf2.id != 34846
);
UPDATE word_frequencies 
SET pashto_word = 'یزرعیل' 
WHERE id = 37641 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یزرعیل' 
    AND wf2.id != 37641
);
UPDATE word_frequencies 
SET pashto_word = 'یزهار' 
WHERE id = 5063 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یزهار' 
    AND wf2.id != 5063
);
UPDATE word_frequencies 
SET pashto_word = 'یساکار' 
WHERE id = 35500 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یساکار' 
    AND wf2.id != 35500
);
UPDATE word_frequencies 
SET pashto_word = 'یشوع' 
WHERE id = 21823 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یشوع' 
    AND wf2.id != 21823
);
UPDATE word_frequencies 
SET pashto_word = 'یعاریم' 
WHERE id = 37644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یعاریم' 
    AND wf2.id != 37644
);
UPDATE word_frequencies 
SET pashto_word = 'یعزیر' 
WHERE id = 37604 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یعزیر' 
    AND wf2.id != 37604
);
UPDATE word_frequencies 
SET pashto_word = 'یعقوب' 
WHERE id = 20264 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یعقوب' 
    AND wf2.id != 20264
);
UPDATE word_frequencies 
SET pashto_word = 'یعقوبه' 
WHERE id = 25706 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یعقوبه' 
    AND wf2.id != 25706
);
UPDATE word_frequencies 
SET pashto_word = 'یفتاح' 
WHERE id = 33644 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یفتاح' 
    AND wf2.id != 33644
);
UPDATE word_frequencies 
SET pashto_word = 'یم' 
WHERE id = 25055 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یم' 
    AND wf2.id != 25055
);
UPDATE word_frequencies 
SET pashto_word = 'یهودا' 
WHERE id = 25354 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یهودا' 
    AND wf2.id != 25354
);
UPDATE word_frequencies 
SET pashto_word = 'یهودیانو' 
WHERE id = 29320 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یهودیانو' 
    AND wf2.id != 29320
);
UPDATE word_frequencies 
SET pashto_word = 'یهودیه' 
WHERE id = 33338 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یهودیه' 
    AND wf2.id != 33338
);
UPDATE word_frequencies 
SET pashto_word = 'یهودیې' 
WHERE id = 34202 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یهودیې' 
    AND wf2.id != 34202
);
UPDATE word_frequencies 
SET pashto_word = 'یهوزاباد' 
WHERE id = 34916 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یهوزاباد' 
    AND wf2.id != 34916
);
UPDATE word_frequencies 
SET pashto_word = 'یو' 
WHERE id = 13837 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یو' 
    AND wf2.id != 13837
);
UPDATE word_frequencies 
SET pashto_word = 'یوآب' 
WHERE id = 35069 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوآب' 
    AND wf2.id != 35069
);
UPDATE word_frequencies 
SET pashto_word = 'یوتام' 
WHERE id = 30878 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوتام' 
    AND wf2.id != 30878
);
UPDATE word_frequencies 
SET pashto_word = 'یوحانان' 
WHERE id = 8999 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوحانان' 
    AND wf2.id != 8999
);
UPDATE word_frequencies 
SET pashto_word = 'یوحنا' 
WHERE id = 24850 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوحنا' 
    AND wf2.id != 24850
);
UPDATE word_frequencies 
SET pashto_word = 'یوزاباد' 
WHERE id = 30245 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوزاباد' 
    AND wf2.id != 30245
);
UPDATE word_frequencies 
SET pashto_word = 'یوسف' 
WHERE id = 34384 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوسف' 
    AND wf2.id != 34384
);
UPDATE word_frequencies 
SET pashto_word = 'یوسم' 
WHERE id = 17665 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوسم' 
    AND wf2.id != 17665
);
UPDATE word_frequencies 
SET pashto_word = 'یوسي' 
WHERE id = 20858 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوسي' 
    AND wf2.id != 20858
);
UPDATE word_frequencies 
SET pashto_word = 'یوسی' 
WHERE id = 40588 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوسی' 
    AND wf2.id != 40588
);
UPDATE word_frequencies 
SET pashto_word = 'یوشع' 
WHERE id = 35537 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوشع' 
    AND wf2.id != 35537
);
UPDATE word_frequencies 
SET pashto_word = 'یوناتان' 
WHERE id = 35124 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوناتان' 
    AND wf2.id != 35124
);
UPDATE word_frequencies 
SET pashto_word = 'یووړ' 
WHERE id = 17184 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یووړ' 
    AND wf2.id != 17184
);
UPDATE word_frequencies 
SET pashto_word = 'یووړل' 
WHERE id = 15453 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یووړل' 
    AND wf2.id != 15453
);
UPDATE word_frequencies 
SET pashto_word = 'یووړله' 
WHERE id = 31470 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یووړله' 
    AND wf2.id != 31470
);
UPDATE word_frequencies 
SET pashto_word = 'یووړلې' 
WHERE id = 34773 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یووړلې' 
    AND wf2.id != 34773
);
UPDATE word_frequencies 
SET pashto_word = 'یوییل' 
WHERE id = 36029 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یوییل' 
    AND wf2.id != 36029
);
UPDATE word_frequencies 
SET pashto_word = 'یی' 
WHERE id = 41326 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یی' 
    AND wf2.id != 41326
);
UPDATE word_frequencies 
SET pashto_word = 'ییل' 
WHERE id = 20562 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'ییل' 
    AND wf2.id != 20562
);
UPDATE word_frequencies 
SET pashto_word = 'یې' 
WHERE id = 20873 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = 'یې' 
    AND wf2.id != 20873
);
UPDATE word_frequencies 
SET pashto_word = '۱۰‏:‌۲۵‌‏-‌۲۸' 
WHERE id = 34280 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۰‏:‌۲۵‌‏-‌۲۸' 
    AND wf2.id != 34280
);
UPDATE word_frequencies 
SET pashto_word = '۱۱‏:‌۲۰‌‏-‌۲۴' 
WHERE id = 33925 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۱‏:‌۲۰‌‏-‌۲۴' 
    AND wf2.id != 33925
);
UPDATE word_frequencies 
SET pashto_word = '۱۱‏:‌۲۳‌‏-‌۲۵' 
WHERE id = 29809 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۱‏:‌۲۳‌‏-‌۲۵' 
    AND wf2.id != 29809
);
UPDATE word_frequencies 
SET pashto_word = '۱۲‏:‌۱‌‏-‌۸' 
WHERE id = 34290 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۲‏:‌۱‌‏-‌۸' 
    AND wf2.id != 34290
);
UPDATE word_frequencies 
SET pashto_word = '۱۲‏:‌۳۸‌‏-‌۴۰' 
WHERE id = 33949 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۲‏:‌۳۸‌‏-‌۴۰' 
    AND wf2.id != 33949
);
UPDATE word_frequencies 
SET pashto_word = '۱۳‏:‌۱۸‌‏-‌۱۹' 
WHERE id = 34367 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۳‏:‌۱۸‌‏-‌۱۹' 
    AND wf2.id != 34367
);
UPDATE word_frequencies 
SET pashto_word = '۱۳‏:‌۲۰‌‏-‌۲۱' 
WHERE id = 34449 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۳‏:‌۲۰‌‏-‌۲۱' 
    AND wf2.id != 34449
);
UPDATE word_frequencies 
SET pashto_word = '۱۳‏:‌۲۱‌‏-‌۳۰' 
WHERE id = 34293 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۳‏:‌۲۱‌‏-‌۳۰' 
    AND wf2.id != 34293
);
UPDATE word_frequencies 
SET pashto_word = '۱۳‏:‌۳۶‌‏-‌۳۸' 
WHERE id = 29815 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۳‏:‌۳۶‌‏-‌۳۸' 
    AND wf2.id != 29815
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۱۵‌‏-‌۱۷' 
WHERE id = 34251 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۱۵‌‏-‌۱۷' 
    AND wf2.id != 34251
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۱۸‌‏-‌۳۰' 
WHERE id = 34252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۱۸‌‏-‌۳۰' 
    AND wf2.id != 34252
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۱۹‌‏-‌۲۴' 
WHERE id = 34107 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۱۹‌‏-‌۲۴' 
    AND wf2.id != 34107
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۳۱‌‏-‌۳۴' 
WHERE id = 34255 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۳۱‌‏-‌۳۴' 
    AND wf2.id != 34255
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۳۵‌‏-‌۴۳' 
WHERE id = 34259 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۳۵‌‏-‌۴۳' 
    AND wf2.id != 34259
);
UPDATE word_frequencies 
SET pashto_word = '۱۸‏:‌۳‌‏-‌۱۲' 
WHERE id = 34303 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۸‏:‌۳‌‏-‌۱۲' 
    AND wf2.id != 34303
);
UPDATE word_frequencies 
SET pashto_word = '۱۹‏:‌۱۶' 
WHERE id = 29818 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۹‏:‌۱۶' 
    AND wf2.id != 29818
);
UPDATE word_frequencies 
SET pashto_word = '۱۹‏:‌۱۷‌‏-‌۲۷' 
WHERE id = 29821 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۹‏:‌۱۷‌‏-‌۲۷' 
    AND wf2.id != 29821
);
UPDATE word_frequencies 
SET pashto_word = '۱۹‏:‌۲۸‌‏-‌۳۰' 
WHERE id = 29826 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۹‏:‌۲۸‌‏-‌۳۰' 
    AND wf2.id != 29826
);
UPDATE word_frequencies 
SET pashto_word = '۱۹‏:‌۳۸‌‏-‌۴۲' 
WHERE id = 29828 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱۹‏:‌۳۸‌‏-‌۴۲' 
    AND wf2.id != 29828
);
UPDATE word_frequencies 
SET pashto_word = '۱‏:‌۶‌‏-‌۸' 
WHERE id = 29833 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱‏:‌۶‌‏-‌۸' 
    AND wf2.id != 29833
);
UPDATE word_frequencies 
SET pashto_word = '۱‏:‌۹‌‏-‌۱۱' 
WHERE id = 29836 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۱‏:‌۹‌‏-‌۱۱' 
    AND wf2.id != 29836
);
UPDATE word_frequencies 
SET pashto_word = '۲۰‏:‌۱‌‏-‌۸' 
WHERE id = 29908 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۰‏:‌۱‌‏-‌۸' 
    AND wf2.id != 29908
);
UPDATE word_frequencies 
SET pashto_word = '۲۰‏:‌۲۰‌‏-‌۲۶' 
WHERE id = 34277 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۰‏:‌۲۰‌‏-‌۲۶' 
    AND wf2.id != 34277
);
UPDATE word_frequencies 
SET pashto_word = '۲۰‏:‌۲۷‌‏-‌۴۰' 
WHERE id = 34278 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۰‏:‌۲۷‌‏-‌۴۰' 
    AND wf2.id != 34278
);
UPDATE word_frequencies 
SET pashto_word = '۲۰‏:‌۴۱‌‏-‌۴۴' 
WHERE id = 34281 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۰‏:‌۴۱‌‏-‌۴۴' 
    AND wf2.id != 34281
);
UPDATE word_frequencies 
SET pashto_word = '۲۱‏:‌۲۰‌‏-‌۲۴' 
WHERE id = 34285 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۱‏:‌۲۰‌‏-‌۲۴' 
    AND wf2.id != 34285
);
UPDATE word_frequencies 
SET pashto_word = '۲۱‏:‌۲۵‌‏-‌۲۸' 
WHERE id = 34287 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۱‏:‌۲۵‌‏-‌۲۸' 
    AND wf2.id != 34287
);
UPDATE word_frequencies 
SET pashto_word = '۲۱‏:‌۲۹‌‏-‌۳۳' 
WHERE id = 34288 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۱‏:‌۲۹‌‏-‌۳۳' 
    AND wf2.id != 34288
);
UPDATE word_frequencies 
SET pashto_word = '۲۲‏:‌۳۹‌‏-‌۴۶' 
WHERE id = 34299 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۲‏:‌۳۹‌‏-‌۴۶' 
    AND wf2.id != 34299
);
UPDATE word_frequencies 
SET pashto_word = '۲۲‏:‌۳‌‏-‌۶' 
WHERE id = 34292 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲۲‏:‌۳‌‏-‌۶' 
    AND wf2.id != 34292
);
UPDATE word_frequencies 
SET pashto_word = '۲‏:‌۱۳‌‏-‌۲۲' 
WHERE id = 29774 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۲‏:‌۱۳‌‏-‌۲۲' 
    AND wf2.id != 29774
);
UPDATE word_frequencies 
SET pashto_word = '۴‏:‌۳۸‌‏-‌۴۱' 
WHERE id = 34338 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۴‏:‌۳۸‌‏-‌۴۱' 
    AND wf2.id != 34338
);
UPDATE word_frequencies 
SET pashto_word = '۵‏:‌۱‌‏-‌۱۱' 
WHERE id = 34335 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۵‏:‌۱‌‏-‌۱۱' 
    AND wf2.id != 34335
);
UPDATE word_frequencies 
SET pashto_word = '۵‏:‌۲۷‌‏-‌۳۲' 
WHERE id = 34341 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۵‏:‌۲۷‌‏-‌۳۲' 
    AND wf2.id != 34341
);
UPDATE word_frequencies 
SET pashto_word = '۵‏:‌۳۳‌‏-‌۳۹' 
WHERE id = 34345 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۵‏:‌۳۳‌‏-‌۳۹' 
    AND wf2.id != 34345
);
UPDATE word_frequencies 
SET pashto_word = '۶‏:‌۱۵‌‏-‌۲۱' 
WHERE id = 34398 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۶‏:‌۱۵‌‏-‌۲۱' 
    AND wf2.id != 34398
);
UPDATE word_frequencies 
SET pashto_word = '۶‏:‌۱‌‏-‌۱۴' 
WHERE id = 29890 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۶‏:‌۱‌‏-‌۱۴' 
    AND wf2.id != 29890
);
UPDATE word_frequencies 
SET pashto_word = '۸‏:‌۱۱‌‏-‌۱۵' 
WHERE id = 34362 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۸‏:‌۱۱‌‏-‌۱۵' 
    AND wf2.id != 34362
);
UPDATE word_frequencies 
SET pashto_word = '۸‏:‌۱۹‌‏-‌۲۱' 
WHERE id = 34356 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۸‏:‌۱۹‌‏-‌۲۱' 
    AND wf2.id != 34356
);
UPDATE word_frequencies 
SET pashto_word = '۸‏:‌۲۲‌‏-‌۲۵' 
WHERE id = 34369 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۸‏:‌۲۲‌‏-‌۲۵' 
    AND wf2.id != 34369
);
UPDATE word_frequencies 
SET pashto_word = '۸‏:‌۴۰‌‏-‌۵۶' 
WHERE id = 34379 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۸‏:‌۴۰‌‏-‌۵۶' 
    AND wf2.id != 34379
);
UPDATE word_frequencies 
SET pashto_word = '۹‏:‌۱۸‌‏-‌۲۱' 
WHERE id = 34418 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۹‏:‌۱۸‌‏-‌۲۱' 
    AND wf2.id != 34418
);
UPDATE word_frequencies 
SET pashto_word = '۹‏:‌۱‌‏-‌۶' 
WHERE id = 34386 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۹‏:‌۱‌‏-‌۶' 
    AND wf2.id != 34386
);
UPDATE word_frequencies 
SET pashto_word = '۹‏:‌۲۲‌‏-‌۲۷' 
WHERE id = 34419 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۹‏:‌۲۲‌‏-‌۲۷' 
    AND wf2.id != 34419
);
UPDATE word_frequencies 
SET pashto_word = '۹‏:‌۳۷‌‏-‌۴۳' 
WHERE id = 34426 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۹‏:‌۳۷‌‏-‌۴۳' 
    AND wf2.id != 34426
);
UPDATE word_frequencies 
SET pashto_word = '۹‏:‌۴۳‌‏-‌۴۵' 
WHERE id = 29977 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '۹‏:‌۴۳‌‏-‌۴۵' 
    AND wf2.id != 29977
);
UPDATE word_frequencies 
SET pashto_word = '‎شې' 
WHERE id = 36889 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‎شې' 
    AND wf2.id != 36889
);
UPDATE word_frequencies 
SET pashto_word = '‎ځليږى' 
WHERE id = 37539 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‎ځليږى' 
    AND wf2.id != 37539
);
UPDATE word_frequencies 
SET pashto_word = '‏' 
WHERE id = 21013 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‏' 
    AND wf2.id != 21013
);
UPDATE word_frequencies 
SET pashto_word = '”آمين' 
WHERE id = 28002 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”آمين' 
    AND wf2.id != 28002
);
UPDATE word_frequencies 
SET pashto_word = '”آو' 
WHERE id = 13853 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”آو' 
    AND wf2.id != 13853
);
UPDATE word_frequencies 
SET pashto_word = '”ابنيره' 
WHERE id = 32400 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”ابنيره' 
    AND wf2.id != 32400
);
UPDATE word_frequencies 
SET pashto_word = '”اخيمُلکه' 
WHERE id = 39960 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”اخيمُلکه' 
    AND wf2.id != 39960
);
UPDATE word_frequencies 
SET pashto_word = '”افسوس' 
WHERE id = 23252 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”افسوس' 
    AND wf2.id != 23252
);
UPDATE word_frequencies 
SET pashto_word = '”الياسه' 
WHERE id = 40147 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”الياسه' 
    AND wf2.id != 40147
);
UPDATE word_frequencies 
SET pashto_word = '”اينځر' 
WHERE id = 36682 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”اينځر' 
    AND wf2.id != 36682
);
UPDATE word_frequencies 
SET pashto_word = '”اُستاذه' 
WHERE id = 29160 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”اُستاذه' 
    AND wf2.id != 29160
);
UPDATE word_frequencies 
SET pashto_word = '”اِبراهيمه' 
WHERE id = 39052 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”اِبراهيمه' 
    AND wf2.id != 39052
);
UPDATE word_frequencies 
SET pashto_word = '”بيلطشضره' 
WHERE id = 35318 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”بيلطشضره' 
    AND wf2.id != 35318
);
UPDATE word_frequencies 
SET pashto_word = '”بې‌شکه' 
WHERE id = 32405 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”بې‌شکه' 
    AND wf2.id != 32405
);
UPDATE word_frequencies 
SET pashto_word = '”راشه' 
WHERE id = 39161 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”راشه' 
    AND wf2.id != 39161
);
UPDATE word_frequencies 
SET pashto_word = '”راشی' 
WHERE id = 41352 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”راشی' 
    AND wf2.id != 41352
);
UPDATE word_frequencies 
SET pashto_word = '”راپاڅه' 
WHERE id = 37874 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”راپاڅه' 
    AND wf2.id != 37874
);
UPDATE word_frequencies 
SET pashto_word = '”زۀ' 
WHERE id = 27968 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”زۀ' 
    AND wf2.id != 27968
);
UPDATE word_frequencies 
SET pashto_word = '”سمسونه' 
WHERE id = 28838 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”سمسونه' 
    AND wf2.id != 28838
);
UPDATE word_frequencies 
SET pashto_word = '”سمویيله' 
WHERE id = 42161 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”سمویيله' 
    AND wf2.id != 42161
);
UPDATE word_frequencies 
SET pashto_word = '”سړيه' 
WHERE id = 33055 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”سړيه' 
    AND wf2.id != 33055
);
UPDATE word_frequencies 
SET pashto_word = '”شدرک' 
WHERE id = 27563 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”شدرک' 
    AND wf2.id != 27563
);
UPDATE word_frequencies 
SET pashto_word = '”صاحبه' 
WHERE id = 22350 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”صاحبه' 
    AND wf2.id != 22350
);
UPDATE word_frequencies 
SET pashto_word = '”صاحِبانو' 
WHERE id = 39037 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”صاحِبانو' 
    AND wf2.id != 39037
);
UPDATE word_frequencies 
SET pashto_word = '”صاحِبه' 
WHERE id = 15048 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”صاحِبه' 
    AND wf2.id != 15048
);
UPDATE word_frequencies 
SET pashto_word = '”مالِکه' 
WHERE id = 13709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”مالِکه' 
    AND wf2.id != 13709
);
UPDATE word_frequencies 
SET pashto_word = '”ميکاياه' 
WHERE id = 40165 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”ميکاياه' 
    AND wf2.id != 40165
);
UPDATE word_frequencies 
SET pashto_word = '”نه' 
WHERE id = 31907 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”نه' 
    AND wf2.id != 31907
);
UPDATE word_frequencies 
SET pashto_word = '”نۀ' 
WHERE id = 40077 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”نۀ' 
    AND wf2.id != 40077
);
UPDATE word_frequencies 
SET pashto_word = '”نېکه' 
WHERE id = 39057 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”نېکه' 
    AND wf2.id != 39057
);
UPDATE word_frequencies 
SET pashto_word = '”هاجِرې' 
WHERE id = 39033 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”هاجِرې' 
    AND wf2.id != 39033
);
UPDATE word_frequencies 
SET pashto_word = '”واوری' 
WHERE id = 41572 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”واوری' 
    AND wf2.id != 41572
);
UPDATE word_frequencies 
SET pashto_word = '”واى' 
WHERE id = 37170 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”واى' 
    AND wf2.id != 37170
);
UPDATE word_frequencies 
SET pashto_word = '”وګوره' 
WHERE id = 21383 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”وګوره' 
    AND wf2.id != 21383
);
UPDATE word_frequencies 
SET pashto_word = '”وګوری' 
WHERE id = 41279 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”وګوری' 
    AND wf2.id != 41279
);
UPDATE word_frequencies 
SET pashto_word = '”يرمياه' 
WHERE id = 24140 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”يرمياه' 
    AND wf2.id != 24140
);
UPDATE word_frequencies 
SET pashto_word = '”پاڅه' 
WHERE id = 23307 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”پاڅه' 
    AND wf2.id != 23307
);
UPDATE word_frequencies 
SET pashto_word = '”پاڅی' 
WHERE id = 41573 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”پاڅی' 
    AND wf2.id != 41573
);
UPDATE word_frequencies 
SET pashto_word = '”پلاره' 
WHERE id = 24475 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”پلاره' 
    AND wf2.id != 24475
);
UPDATE word_frequencies 
SET pashto_word = '”ښه' 
WHERE id = 39100 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”ښه' 
    AND wf2.id != 39100
);
UPDATE word_frequencies 
SET pashto_word = '”ګوره' 
WHERE id = 14351 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”ګوره' 
    AND wf2.id != 14351
);
UPDATE word_frequencies 
SET pashto_word = '”ګوری' 
WHERE id = 41010 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '”ګوری' 
    AND wf2.id != 41010
);
UPDATE word_frequencies 
SET pashto_word = '‹باداره' 
WHERE id = 21709 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹باداره' 
    AND wf2.id != 21709
);
UPDATE word_frequencies 
SET pashto_word = '‹زویه' 
WHERE id = 34020 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹زویه' 
    AND wf2.id != 34020
);
UPDATE word_frequencies 
SET pashto_word = '‹شاباس' 
WHERE id = 29765 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹شاباس' 
    AND wf2.id != 29765
);
UPDATE word_frequencies 
SET pashto_word = '‹نه' 
WHERE id = 34021 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹نه' 
    AND wf2.id != 34021
);
UPDATE word_frequencies 
SET pashto_word = '‹وګوری' 
WHERE id = 41919 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹وګوری' 
    AND wf2.id != 41919
);
UPDATE word_frequencies 
SET pashto_word = '‹پلاره' 
WHERE id = 34008 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹پلاره' 
    AND wf2.id != 34008
);
UPDATE word_frequencies 
SET pashto_word = '‹څښتنه' 
WHERE id = 29259 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹څښتنه' 
    AND wf2.id != 29259
);
UPDATE word_frequencies 
SET pashto_word = '‹ګوره' 
WHERE id = 22596 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹ګوره' 
    AND wf2.id != 22596
);
UPDATE word_frequencies 
SET pashto_word = '‹ګوری' 
WHERE id = 41294 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = '‹ګوری' 
    AND wf2.id != 41294
);