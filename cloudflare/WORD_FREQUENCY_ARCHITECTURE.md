# Word Frequency vs Verse Lookup Strategy

## Current Architecture

### `word_frequencies` Table (Metadata)
- **Purpose**: Store word statistics and linguistic metadata
- **Contents**:
  - Frequency counts (total + breakdown by translation/testament)
  - Linguistic data (base_form, word_type, pos, inflection_type, compound_type)
  - Dictionary linking (romanization, english_translation)
  - Quality flags (has_issues, issue_flags)
  - **NEW**: `verse_count` - number of unique verses containing the word

### `word_verse_mapping` Table (Verse Lookups)
- **Purpose**: Fast lookup of all verses containing a word
- **Contents**:
  - `pashto_word` - the word form
  - `base_form` - base form (for inflected form searches)
  - `verse_id`, `verse_ref` - verse reference
  - `translation_key`, `testament` - metadata
  - `book`, `chapter`, `verse` - verse location
  - `word_position` - position in verse

## Why Keep Them Separate?

### Performance Considerations

1. **Storage Size**:
   - `word_frequencies`: ~11,421 words × ~20 columns = small
   - If we stored verse refs in `word_frequencies`: ~11,421 words × ~500 average verses = ~5.7M rows (too large!)

2. **Query Performance**:
   - Looking up frequency: `SELECT * FROM word_frequencies WHERE pashto_word = ?` → **Fast** (indexed, single row)
   - Looking up verses: `SELECT * FROM word_verse_mapping WHERE pashto_word = ? OR base_form = ?` → **Fast** (indexed on both columns)
   - If combined: Would need to parse JSON/text field for verse refs → **Slow**

3. **Index Optimization**:
   - `word_frequencies`: Indexed on `pashto_word`, `frequency_total`, `base_form`
   - `word_verse_mapping`: Indexed on `pashto_word`, `base_form`, `verse_ref`
   - Separate indexes = optimal performance for each use case

## Usage Examples

### Get Word Frequency (Fast)
```sql
SELECT 
  pashto_word,
  frequency_total,
  verse_count,  -- NEW: quick check without JOIN
  base_form,
  pos
FROM word_frequencies
WHERE pashto_word = 'د';
```

### Get All Verses for a Word (Fast)
```sql
SELECT DISTINCT
  verse_ref,
  translation_key,
  testament,
  book,
  chapter,
  verse
FROM word_verse_mapping
WHERE pashto_word = 'د' OR base_form = 'د'
ORDER BY book, chapter, verse;
```

### Get Both (Fast - Two Quick Queries)
```sql
-- Query 1: Get metadata
SELECT * FROM word_frequencies WHERE pashto_word = 'د';

-- Query 2: Get verses
SELECT verse_ref FROM word_verse_mapping 
WHERE pashto_word = 'د' OR base_form = 'د';
```

## Verification

The `verse_count` column in `word_frequencies` allows quick verification:
- `frequency_total` = total word occurrences across all verses
- `verse_count` = number of unique verses containing the word
- Example: "د" appears 69,276 times (`frequency_total`) in 12,543 verses (`verse_count`)

## Conclusion

**Keep them separate** - this is the optimal architecture:
- ✅ Fast frequency lookups
- ✅ Fast verse lookups  
- ✅ Efficient storage
- ✅ Optimal indexing
- ✅ Easy to maintain

Adding `verse_count` to `word_frequencies` gives you a quick way to see how many verses contain a word without needing a JOIN, while still keeping the actual verse references in the optimized `word_verse_mapping` table.

