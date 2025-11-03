# Phrase Splitting Complete ✅

## Summary

Successfully split **2,471 multi-word phrases** into individual words, preserving circumpositions as single entries.

## What Was Done

### 1. Cleaned Punctuation from form_occurrences ✅
- **2,129 rows** cleaned of leading/trailing punctuation
- Removed commas, periods, colons, etc. from `pashto_form` entries

### 2. Marked Phrases for Splitting ✅
- **2,472 phrases** marked as `split_pending`
- Excluded circumpositions (kept as single entries)
- Included postpositions, prepositions, and particle phrases

### 3. Generated and Executed Split SQL ✅
- **2,471 phrases** successfully split
- **7,413 SQL queries** executed
- **9,483 rows written** (new word entries created)
- **2,562 changes** made

## Split Patterns

### Postpositions (... ته) → Split
- `ما ته` → `ما` (pronoun) + `ته` (postposition)
- `هغوی ته` → `هغوی` (pronoun) + `ته` (postposition)
- `تاسو ته` → `تاسو` (pronoun) + `ته` (postposition)

### Prepositions (د ...) → Split
- `د دې` → `د` (preposition) + `دې` (pronoun)
- `د یوسف` → `د` (preposition) + `یوسف` (proper noun)

### Particles (... به) → Split
- `هغه به` → `هغه` (pronoun) + `به` (particle)
- `زۀ به` → `زۀ` (pronoun) + `به` (particle)
- `تاسو به` → `تاسو` (pronoun) + `به` (particle)

### Circumpositions (په ... کې) → Kept as Single Entries ✅
- `په کور کې` → **KEPT AS ONE** (circumposition)
- `د خدای دپاره` → **KEPT AS ONE** (circumposition)
- `له احمد سره` → **KEPT AS ONE** (circumposition)

## Current Status

- ✅ **2,471 phrases** marked as `split` (original entries preserved with `[SPLIT]` suffix)
- ✅ **Individual words** created/updated in `word_frequencies`
- ✅ **POS tags** correctly assigned (prepositions, postpositions, particles)
- ✅ **Circumpositions** preserved as single entries (1,195 entries)

## Files Created

1. `cloudflare/clean-form-occurrences-punctuation.sql` - ✅ Executed
2. `cloudflare/mark-sandwiches.sql` - ✅ Executed (marked circumpositions)
3. `cloudflare/split-phrases-complete.sql` - ✅ Executed (marked phrases for splitting)
4. `cloudflare/split-phrases-execute.sql` - ✅ Executed (actual splits)
5. `scripts/process-split-pending.py` - ✅ Used to generate split SQL

## Next Steps

### Immediate
1. ✅ **Completed**: Punctuation cleanup
2. ✅ **Completed**: Phrase splitting
3. ⚠️ **Remaining**: Update `word_verse_mapping` to reference split words
4. ⚠️ **Remaining**: Distribute frequency counts to split words
5. ⚠️ **Remaining**: Rebuild `form_occurrences` from verse text with phrase awareness

### Future
1. **Rebuild word_frequencies from verses** - Process all verses with phrase detection
2. **Proper noun extraction** - Extract names from genealogies
3. **Frequency distribution** - When splitting, distribute counts to both words
4. **Verse mapping update** - Link verse occurrences to both split words

## Notes

- Original phrases are preserved with `[SPLIT]` suffix for reference
- New word entries use `INSERT OR IGNORE` to avoid overwriting existing data
- POS tags are set correctly: prepositions/postpositions/particles get their tags, other words keep NULL to preserve existing classification
- This approach maintains data integrity while enabling proper phrase analysis

