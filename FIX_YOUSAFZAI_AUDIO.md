# 🔧 Fix Yousafzai Audio URLs in Supabase

## Problem
All verses in `verses_yousafzai` table have the **same `audio_public_url`**, pointing to the Ecclesiastes file:
```
https://drive.google.com/file/d/1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY/view
```

This is incorrect - each verse should have its own unique Google Drive ID.

## Root Cause
The database was accidentally overwritten or the audio mapping wasn't applied correctly.

## Solution
Re-apply the correct audio mapping from `yousafzai_audio_mapping.csv` to the database.

### Option 1: Use Node Script (Recommended)

**Requirements:**
- Set environment variables first:
```bash
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Run the script:**
```bash
node scripts/apply_yousafzai_audio_via_api.js
```

This will:
1. Read the CSV file with all correct mappings
2. Update the `verses_yousafzai` table
3. Process in batches to avoid rate limits
4. Show progress and errors

### Option 2: Manual Supabase SQL

1. Go to Supabase Console
2. Open SQL Editor
3. Run this to clear existing audio URLs:
```sql
UPDATE verses_yousafzai 
SET audio_public_url = NULL, audio_storage_path = NULL;
```

4. Then use the CSV import feature to reimport audio IDs:
   - Download `yousafzai_audio_mapping.csv`
   - In Supabase, use SQL Editor to run batch updates

### Option 3: Direct Database Query

For a specific chapter (e.g., Judges 8):

```sql
UPDATE verses_yousafzai SET 
  audio_public_url = 'https://drive.google.com/uc?id=1H_iv-vsY1YbQjLHwu47LJHAbDOowxV7F&export=download'
WHERE book = 'Judges' AND chapter = 8 AND verse = 35;

UPDATE verses_yousafzai SET 
  audio_public_url = 'https://drive.google.com/uc?id=1sx67XNJN189f5rp4FiUQUKrSF8o59B42&export=download'
WHERE book = 'Judges' AND chapter = 8 AND verse = 21;

-- ... and so on for each verse
```

## Verification

After applying the fix, check that verses have different URLs:

```sql
SELECT book, chapter, verse, audio_public_url 
FROM verses_yousafzai 
WHERE book = 'Judges' AND chapter = 8
LIMIT 5;
```

You should see different Google Drive IDs for each verse, like:
- Judges 8:1 → `...id=XXXX1...`
- Judges 8:2 → `...id=XXXX2...` (different!)
- Judges 8:3 → `...id=XXXX3...` (different!)

## Next Steps

1. **Clear browser cache** - Cmd+Shift+R
2. **Reload the app** - Navigate to a Yousafzai chapter
3. **Test audio** - Click play on multiple verses
4. **Verify logs** - Check browser console for different Google Drive IDs

---

**Commit when fixed:** `git add . && git commit -m "fix: Restore correct Yousafzai audio URLs in database"`
