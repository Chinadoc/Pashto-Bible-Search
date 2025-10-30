# Efficient Word-Verse Mapping with Inflected Forms

## Overview

The `word_verse_mapping` table has been optimized to efficiently handle searches for base words and their inflected forms (like "ټول" / Tol and its inflections "ټوله" / Tóla, "ټولې" / Tóle, "ټولو" / Tólo).

## Structure

### `word_verse_mapping` Table

```sql
CREATE TABLE word_verse_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,           -- The actual word form found in verse
  base_form TEXT,                       -- The base/infinitive form (e.g., "ټول")
  verse_id INTEGER NOT NULL,
  verse_ref TEXT NOT NULL,
  translation_key TEXT NOT NULL,        -- 'afghan2023' or 'yousafzai2019'
  testament TEXT NOT NULL,              -- 'OT' or 'NT'
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  word_position INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, verse_id)
);

-- Key indexes for efficient queries
CREATE INDEX idx_word_verse_base_form ON word_verse_mapping(base_form);
CREATE INDEX idx_word_verse_base_translation ON word_verse_mapping(base_form, translation_key);
CREATE INDEX idx_word_verse_base_testament ON word_verse_mapping(base_form, testament);
CREATE INDEX idx_word_verse_word ON word_verse_mapping(pashto_word);
```

## Efficient Queries

### Find All Verses Containing a Word and Its Inflections

**Single Query Approach** (Most Efficient):

```sql
-- Find all verses containing "ټول" (Tol) and its inflections
SELECT DISTINCT verse_ref, translation_key, testament, book, chapter, verse
FROM word_verse_mapping
WHERE base_form = 'ټول'
ORDER BY testament, book, chapter, verse;
```

**Result**: Returns all 315 verses containing:
- ټول (Tol) - 177 verses
- ټولو (Tólo) - 75 verses  
- ټوله (Tóla) - 36 verses
- ټولې (Tóle) - 27 verses

### Find All Inflected Forms of a Word

```sql
-- See all inflected forms of "ټول" that appear in verses
SELECT pashto_word, base_form, COUNT(*) as verse_count
FROM word_verse_mapping
WHERE base_form = 'ټول'
GROUP BY pashto_word
ORDER BY verse_count DESC;
```

### Filter by Translation or Testament

```sql
-- Find verses in Afghan 2023 Old Testament only
SELECT DISTINCT verse_ref
FROM word_verse_mapping
WHERE base_form = 'ټول'
AND translation_key = 'afghan2023'
AND testament = 'OT';
```

## Performance Benefits

1. **Single Query**: Instead of:
   - Query 1: Find all inflected forms from `word_frequencies`
   - Query 2: Query `word_verse_mapping` for each form
   
   You now do:
   - Single query: `WHERE base_form = 'ټول'`

2. **Indexed Lookups**: The `base_form` column is indexed, making searches fast even with millions of mappings.

3. **Reduced Complexity**: No need to know all inflected forms upfront - just query by base form.

## Integration with `word_frequencies`

The `word_frequencies` table stores the base form relationships:

```sql
SELECT pashto_word, base_form, frequency_total
FROM word_frequencies
WHERE base_form = 'ټول' OR pashto_word = 'ټول';
```

The `word_verse_mapping` table is synced with `word_frequencies` to ensure consistency.

## Example: Querying "ټول" (Tol)

Based on [LingDocs dictionary entry](https://dictionary.lingdocs.com/word?id=1527815358):

- **Base Form**: ټول (Tol)
- **Inflections**: 
  - ټول (Tol) - masculine plain
  - ټوله (Tóla) - feminine plain
  - ټولې (Tóle) - feminine 1st person/possessive
  - ټولو (Tólo) - masculine 2nd person/possessive

All these forms are now linked to `base_form = 'ټول'` in `word_verse_mapping`, allowing a single query to find all 315 verses containing any of these forms.

## Maintenance

The inflection relationships are maintained by:
1. `build-inflection-relationships.ts` - Sets up base forms for known words
2. `optimize-word-verse-mapping.ts` - Adds base_form column and syncs from word_frequencies

When new verses are added, the `base_form` is automatically populated from `word_frequencies`.

