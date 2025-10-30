# Fast Word-Verse Search Queries

## Using word_verse_mapping for Fast Searches

The `word_verse_mapping` table links words directly to verses with translation tags, enabling very fast searches.

### Example: Find all verses containing "ويار" (wyaar) in Yousafzai 2019

```sql
SELECT 
  wvm.verse_ref,
  wvm.translation_key,
  wvm.testament,
  v.text,
  v.audio_r2_key
FROM word_verse_mapping wvm
JOIN verses v ON wvm.verse_id = v.id
WHERE wvm.pashto_word = 'ويار'
  AND wvm.translation_key = 'yousafzai2019'
ORDER BY wvm.book, wvm.chapter, wvm.verse
LIMIT 50;
```

### Example: Find verses with word frequency info

```sql
SELECT 
  wf.pashto_word,
  wf.frequency_total,
  wf.verse_count_total,
  wf.verse_count_yousafzai2019 as yousafzai_count,
  wf.verse_count_afghan2023 as afghan_count,
  GROUP_CONCAT(DISTINCT wvm.verse_ref, '|') as verse_refs
FROM word_frequencies wf
LEFT JOIN word_verse_mapping wvm ON wf.pashto_word = wvm.pashto_word
WHERE wf.pashto_word = 'ويار'
GROUP BY wf.pashto_word;
```

### Example: Fast search with translation filter

```sql
-- Get all verse IDs for a word in a specific translation
SELECT verse_id, verse_ref, book, chapter, verse
FROM word_verse_mapping
WHERE pashto_word = 'ويار'
  AND translation_key = 'yousafzai2019'
ORDER BY book, chapter, verse;
```

### Example: Multi-word search (AND)

```sql
-- Find verses containing BOTH "ويار" AND "وول" in Yousafzai 2019
SELECT v.ref, v.text, v.audio_r2_key
FROM verses v
WHERE v.id IN (
  SELECT verse_id FROM word_verse_mapping 
  WHERE pashto_word = 'ويار' AND translation_key = 'yousafzai2019'
)
AND v.id IN (
  SELECT verse_id FROM word_verse_mapping 
  WHERE pashto_word = 'وول' AND translation_key = 'yousafzai2019'
)
AND v.translation_key = 'yousafzai2019';
```

### Example: Multi-word search (OR)

```sql
-- Find verses containing EITHER "ويار" OR "وول"
SELECT DISTINCT v.ref, v.text, v.translation_key
FROM verses v
JOIN word_verse_mapping wvm ON v.id = wvm.verse_id
WHERE wvm.pashto_word IN ('ويار', 'وول')
  AND wvm.translation_key = 'yousafzai2019'
ORDER BY v.book, v.chapter, v.verse;
```

### Example: Get verse count summary

```sql
SELECT 
  translation_key,
  COUNT(DISTINCT verse_id) as total_verses
FROM word_verse_mapping
WHERE pashto_word = 'ويار'
GROUP BY translation_key;
```

### Performance Benefits

1. **Indexed lookups**: `pashto_word` and `translation_key` are indexed
2. **Direct verse IDs**: No need to search through all verses
3. **Translation filtering**: Built-in translation tags
4. **Fast counts**: Pre-calculated verse counts in word_frequencies

### API Usage Pattern

```typescript
// 1. Lookup word in word_frequencies (with counts)
const wordInfo = await db.query(`
  SELECT pashto_word, frequency_total, verse_count_total,
         verse_count_afghan2023, verse_count_yousafzai2019
  FROM word_frequencies
  WHERE pashto_word = ?
`, [searchWord]);

// 2. Get verse IDs directly
const verseIds = await db.query(`
  SELECT verse_id FROM word_verse_mapping
  WHERE pashto_word = ? AND translation_key = ?
`, [searchWord, translation]);

// 3. Fetch verses efficiently
const verses = await db.query(`
  SELECT * FROM verses WHERE id IN (?)
`, [verseIds.map(v => v.verse_id)]);
```

