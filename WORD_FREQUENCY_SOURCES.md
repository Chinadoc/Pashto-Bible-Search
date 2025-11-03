# Word Frequency Sources and Update Mechanism

## Current Word Frequency Sources ✅

**Yes, you're correct!** The `word_frequencies` table gets its data from:

1. **`verses_afghan2023`** - Afghan 2023 translation (OT + NT)
2. **`verses_yousafzai`** - Yousafzai 2019 translation (OT + NT)  
3. **`video_transcripts`** - Video transcripts (via `video_word_mappings`)

## How Frequencies Are Calculated

The `word_frequencies` table has breakdown columns:
- `frequency_afghan2023_ot` - Afghan 2023 Old Testament
- `frequency_afghan2023_nt` - Afghan 2023 New Testament
- `frequency_yousafzai2019_ot` - Yousafzai 2019 Old Testament
- `frequency_yousafzai2019_nt` - Yousafzai 2019 New Testament
- `frequency_total` - Sum of all above + video frequencies

### Verification Example

`ابراهیم` (Abraham):
- `frequency_total`: 114
- Breakdown: afghan2023_ot: 16, afghan2023_nt: 94, yousafzai2019_ot: 4
- Bible total: 16 + 94 + 4 = 114 ✓
- No video occurrences (checked `video_word_mappings`)
- **Status**: ✅ Frequency counts are accurate and come from Bible verses

## Impact of Our Biblical Name Updates

**Our updates DO NOT affect frequency counts!** We only update:
- `word_type` → `'proper_noun'`
- `pos` → `'n. prop.'`
- `romanization` → (e.g., 'Abraham')
- `has_issues` → `0`
- `issue_flags` → `'[]'`

**Frequency counts remain unchanged** - they're still accurate and derived from the source tables.

## Current Database State

✅ **Bible verses**: Frequencies calculated from verses tables
- `word_verse_mapping`: 45,500 rows - maps words to verses
- Breakdown columns show source: afghan2023 vs yousafzai2019, OT vs NT

✅ **Video transcripts**: When videos are processed, words are extracted
- `video_word_mappings`: 556 rows - maps words to videos
- Video frequencies added to `frequency_total` (but not tracked separately)

❌ **word_source_mapping**: 0 rows - **NOT populated yet** (would allow granular tracking)

## How Videos Update Frequencies

From `cloudflare/worker-api.ts` (lines 144-166):
1. When video transcript is processed, words are extracted
2. For each word, `frequency_total` is incremented: `frequency_total = frequency_total + count`
3. Words are also stored in `video_word_mappings` table
4. **Video frequencies are added to `frequency_total` but NOT to the breakdown columns**

## Current Limitations

1. **Video frequencies not tracked separately**: Videos increment `frequency_total` but there's no `frequency_video` column
2. **word_source_mapping not populated**: Created but empty - would allow tracking which source contributed to each word
3. **No automatic recalculation**: When verses/videos are added/deleted, frequencies aren't automatically recalculated from source tables

## Recommended Next Steps

1. **Populate word_source_mapping** from existing data:
   ```sql
   -- From word_verse_mapping
   INSERT INTO word_source_mapping (pashto_word, source_type, source_id, frequency, translation_key)
   SELECT pashto_word, 'verse', verse_ref, 1, translation_key
   FROM word_verse_mapping;
   
   -- From video_word_mappings
   INSERT INTO word_source_mapping (pashto_word, source_type, source_id, frequency, translation_key)
   SELECT pashto_word, 'video', video_id, frequency, NULL
   FROM video_word_mappings;
   ```

2. **Add video frequency column** (optional):
   ```sql
   ALTER TABLE word_frequencies ADD COLUMN frequency_video INTEGER DEFAULT 0;
   ```

3. **Create recalculation function** to sync `frequency_total` from `word_source_mapping` when content changes

4. **Update video processing** to also populate `word_source_mapping` when videos are added

## Summary

✅ **Word frequencies DO come from verses_afghan2023, verses_yousafzai, and video_transcripts**
✅ **Our name updates don't break frequencies** - they only update metadata
✅ **Frequencies are accurate** - breakdowns match expected sources
⚠️ **word_source_mapping needs population** for granular source tracking

