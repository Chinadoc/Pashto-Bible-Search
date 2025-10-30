-- Copy Afghan 2023 verses by matching chapter/verse to Yousafzai for book names
INSERT INTO verses (id, ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at)
SELECT 
  40000 + ROW_NUMBER() OVER (),
  'Genesis 1:1',
  'Genesis',
  1,
  1,
  'Afghan test',
  NULL,
  NULL,
  'OT',
  'afghan2023',
  'afghan',
  '[]',
  NULL,
  NULL,
  strftime('%s', 'now'),
  strftime('%s', 'now')
WHERE NOT EXISTS (SELECT 1 FROM verses WHERE translation_key='afghan2023' AND text='Afghan test')
LIMIT 1;
