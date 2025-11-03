-- Identify and label biblical proper nouns (names)
-- Many words without dictionary matches are actually biblical names

-- Add word_type column if missing
ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;

-- Update known biblical names
-- Biblical name: اخى (Ahi)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ahi', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اخى';
-- Biblical name: اب (Ab)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ab', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اب';
-- Biblical name: ايل (El)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'El', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ايل';
-- Biblical name: اِلى (Ali)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ali', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اِلى';
-- Biblical name: اېل (El)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'El', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اېل';
-- Biblical name: عزر (Azar)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Azar', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'عزر';
-- Biblical name: لابان (Laban)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Laban', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'لابان';
-- Biblical name: ابراهیم (Abraham)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Abraham', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ابراهیم';
-- Biblical name: عیسی (Jesus)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Jesus', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'عیسی';
-- Biblical name: موسی (Moses)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Moses', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'موسی';
-- Biblical name: داود (David)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'David', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'داود';
-- Biblical name: یعقوب (James (son of Alphaeus))
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'James (son of Alphaeus)', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یعقوب';
-- Biblical name: یوسف (Joseph)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Joseph', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یوسف';
-- Biblical name: هارون (Aaron)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Aaron', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'هارون';
-- Biblical name: سلیمان (Solomon)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Solomon', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'سلیمان';
-- Biblical name: مریم (Mary)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Mary', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'مریم';
-- Biblical name: یوحنا (John)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'John', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یوحنا';
-- Biblical name: پترس (Peter)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Peter', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'پترس';
-- Biblical name: پولس (Paul)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Paul', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'پولس';
-- Biblical name: توماس (Thomas)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Thomas', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'توماس';
-- Biblical name: اندریاس (Andrew)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Andrew', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اندریاس';
-- Biblical name: فیلیپ (Philip)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Philip', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'فیلیپ';
-- Biblical name: برتولما (Bartholomew)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Bartholomew', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'برتولما';
-- Biblical name: متای (Matthew)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Matthew', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'متای';
-- Biblical name: تادی (Thaddeus)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Thaddeus', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'تادی';
-- Biblical name: سیمون (Simon)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Simon', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'سیمون';
-- Biblical name: یهودا (Judas)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Judas', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یهودا';
-- Biblical name: نوح (Noah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Noah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'نوح';
-- Biblical name: اسماعیل (Ishmael)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ishmael', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اسماعیل';
-- Biblical name: اسحاق (Isaac)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Isaac', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اسحاق';
-- Biblical name: عیسو (Esau)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Esau', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'عیسو';
-- Biblical name: راحیل (Rachel)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Rachel', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'راحیل';
-- Biblical name: لیا (Leah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Leah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'لیا';
-- Biblical name: بنیامین (Benjamin)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Benjamin', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'بنیامین';
-- Biblical name: یوشع (Joshua)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Joshua', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یوشع';
-- Biblical name: سامسون (Samson)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Samson', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'سامسون';
-- Biblical name: روت (Ruth)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ruth', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'روت';
-- Biblical name: سموئیل (Samuel)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Samuel', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'سموئیل';
-- Biblical name: ساول (Saul)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Saul', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ساول';
-- Biblical name: یوناتان (Jonathan)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Jonathan', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یوناتان';
-- Biblical name: دانیال (Daniel)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Daniel', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'دانیال';
-- Biblical name: ایوب (Job)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Job', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ایوب';
-- Biblical name: حزقیال (Ezekiel)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ezekiel', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'حزقیال';
-- Biblical name: اشعیا (Isaiah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Isaiah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'اشعیا';
-- Biblical name: یرمیا (Jeremiah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Jeremiah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یرمیا';
-- Biblical name: هوشع (Hosea)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Hosea', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'هوشع';
-- Biblical name: یونس (Jonah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Jonah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'یونس';
-- Biblical name: میکا (Micah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Micah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'میکا';
-- Biblical name: ناحوم (Nahum)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Nahum', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ناحوم';
-- Biblical name: حبقوق (Habakkuk)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Habakkuk', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'حبقوق';
-- Biblical name: صفنیا (Zephaniah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Zephaniah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'صفنیا';
-- Biblical name: حجی (Haggai)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Haggai', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'حجی';
-- Biblical name: زکریا (Zechariah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Zechariah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'زکریا';
-- Biblical name: ملاخی (Malachi)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Malachi', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'ملاخی';
-- Biblical name: عزرا (Ezra)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ezra', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'عزرا';
-- Biblical name: نحمیا (Nehemiah)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Nehemiah', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'نحمیا';
-- Biblical name: استر (Esther)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Esther', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'استر';
-- Biblical name: حکمت (Wisdom)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Wisdom', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'حکمت';
-- Biblical name: جامعات (Ecclesiastes)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Ecclesiastes', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'جامعات';
-- Biblical name: غزل (Song of Songs)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Song of Songs', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'غزل';
-- Biblical name: مزامیر (Psalms)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Psalms', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'مزامیر';
-- Biblical name: امثال (Proverbs)
UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = 'Proverbs', has_issues = 0, issue_flags = '[]' WHERE pashto_word = 'امثال';

-- Update words flagged as no_dictionary_match that are known names
-- Update words with no_dictionary_match flag that are likely proper nouns
-- These are words that don't appear in the dictionary but are likely biblical names
UPDATE word_frequencies
SET word_type = 'proper_noun',
    pos = 'n. prop.',
    has_issues = 0,
    issue_flags = '[]'
WHERE has_issues = 1
  AND issue_flags LIKE '%no_dictionary_match%'
  AND (pashto_word IN ('اخى', 'اب', 'ايل', 'اِلى', 'اېل', 'عزر', 'لابان', 'ابراهیم', 'عیسی', 'موسی', 'داود', 'یعقوب', 'یوسف', 'هارون', 'سلیمان', 'مریم', 'یوحنا', 'پترس', 'پولس', 'توماس', 'اندریاس', 'فیلیپ', 'برتولما', 'متای', 'تادی', 'سیمون', 'یهودا', 'نوح', 'اسماعیل', 'اسحاق', 'عیسو', 'راحیل', 'لیا', 'بنیامین', 'یوشع', 'سامسون', 'روت', 'سموئیل', 'ساول', 'یوناتان', 'دانیال', 'ایوب', 'حزقیال', 'اشعیا', 'یرمیا', 'هوشع', 'یونس', 'میکا', 'ناحوم', 'حبقوق', 'صفنیا', 'حجی', 'زکریا', 'ملاخی', 'عزرا', 'نحمیا', 'استر', 'حکمت', 'جامعات', 'غزل', 'مزامیر', 'امثال'));


-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);