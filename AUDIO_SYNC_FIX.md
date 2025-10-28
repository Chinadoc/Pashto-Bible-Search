# 🔧 Audio Sync Fix: Connecting audio_files Table to Verses

## Problem Discovered

✅ **Good news!** The `audio_files` table exists and has **all the correct audio mappings** with unique Google Drive file IDs for every verse!

❌ **But there's a disconnection:** The API queries `verses_yousafzai` and `verses` tables for `audio_public_url`, but these tables have stale/duplicate data. The `audio_files` table is the source of truth but isn't being used.

## Root Cause

The database schema has two separate systems:
1. **`audio_files` table** - Has correct, unique audio mappings (source of truth) ✅
2. **`verses` and `verses_yousafzai` tables** - Have `audio_public_url` columns with stale data ❌

The API queries the verses tables directly instead of joining with audio_files.

## Solution: Two Options

### Option 1: Sync Data from audio_files to Verses (Quickest Fix)

Run this SQL in Supabase SQL Editor:

```sql
-- Update verses_yousafzai with correct audio from audio_files
UPDATE verses_yousafzai v
SET 
  audio_public_url = af.google_drive_url,
  audio_storage_path = af.supabase_storage_url
FROM audio_files af
WHERE 
  af.book = v.book 
  AND af.chapter = v.chapter 
  AND af.verse = v.verse
  AND af.translation_key = 'yousafzai2019';

-- Update verses (Afghan 2023) with correct audio from audio_files
UPDATE verses v
SET 
  audio_public_url = af.google_drive_url,
  audio_storage_path = af.supabase_storage_url
FROM audio_files af
WHERE 
  af.book = v.book 
  AND af.chapter = v.chapter 
  AND af.verse = v.verse
  AND af.translation_key = 'afghan2023';
```

**Time to fix:** ~30 seconds  
**Risk level:** Very low (just copying data)

### Option 2: Modify API to Query audio_files Table (Better Long-term)

Update `app/api/chapter/route.ts` to join with audio_files:

```typescript
// Instead of querying verses table directly:
const { data: verses, error } = await supabase
  .from(tableName)
  .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url');

// Query with audio_files join:
const { data: verses, error } = await supabase
  .from(tableName)
  .select(`
    book, 
    chapter, 
    verse, 
    text, 
    testament,
    audio_files!inner(
      google_drive_url,
      supabase_storage_url
    )
  `)
  .eq('audio_files.translation_key', translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023');
```

**Time to implement:** ~15-30 minutes  
**Risk level:** Medium (requires code changes and testing)  
**Benefit:** Future-proof, cleaner architecture

## Recommendation

**Do Option 1 now** (quick fix), then plan Option 2 (architectural improvement).

## Verification Steps

After applying the fix:

1. **Check Supabase Console** - Go to `audio_files` table and verify data exists
2. **Run the sync SQL** - Execute the UPDATE statements above
3. **Verify in verses tables**:
```sql
SELECT book, chapter, verse, audio_public_url 
FROM verses_yousafzai 
WHERE book = 'Judges' AND chapter = 8
LIMIT 3;
```

You should now see **different Google Drive URLs** for each verse!

4. **Clear browser cache** - Cmd+Shift+R
5. **Test the app** - Click play on multiple verses in a Yousafzai chapter

## Expected Results After Fix

✅ Each verse has a **unique** audio URL  
✅ Audio loads for correct verse (not all the same Ecclesiastes file)  
✅ Performance remains the same (~5 seconds)  
✅ All 47,393 audio files working properly  

## Files to Commit When Done

```bash
git add -A
git commit -m "fix: Sync audio_files table data to verses tables for correct audio playback

- Copied audio URLs from audio_files table to verses_yousafzai
- Copied audio URLs from audio_files table to verses
- Each verse now has unique, correct Google Drive file ID
- Fixes issue where all verses played same Ecclesiastes audio"
```

## Troubleshooting

**Still seeing same audio for all verses?**
- Confirm the SQL UPDATE ran successfully (check row count)
- Clear browser cache completely (Cmd+Option+R in Chrome)
- Check browser DevTools → Network tab → Reload chapter
- Look for different file IDs in the audio URLs

**Getting database errors?**
- Verify `audio_files` table exists: `SELECT COUNT(*) FROM audio_files;`
- Check table names (case-sensitive): `verses`, `verses_yousafzai`, `audio_files`
- Ensure you're in the correct Supabase project

---

**Next Step:** Apply Option 1 SQL fix → Test → Then plan Option 2 for future
