# 🎵 Run Audio Sync Script

This script syncs the `audio_files` table (source of truth) to the `verses` and `verses_yousafzai` tables with proper Google Drive file IDs.

## Prerequisites

1. ✅ Node.js installed (`node --version`)
2. ✅ Environment variables set
3. ✅ Supabase credentials ready

## Step 1: Get Your Supabase Credentials

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **API**
3. Copy:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `Service Role Secret` → This is your `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** Use the **Service Role Secret**, NOT the Anon Key!

## Step 2: Set Environment Variables

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key-here"
```

**Verify they're set:**
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

## Step 3: Run the Script

From the project root:

```bash
node scripts/sync_audio_files_to_verses.js
```

## Expected Output

```
🎵 Starting Audio Files → Verses Sync

📂 Step 1: Fetching audio_files table...
✅ Found 47393 audio file records

📊 Step 2: Grouping by translation...
   - Yousafzai 2019: 43193 files
   - Afghan 2023: 4200 files

🔄 Step 3: Syncing Yousafzai audio to verses_yousafzai table...
   Processing 43193 files in 864 batches...

   [100.0%] Batch 864/864: 43193 synced, 0 errors

🔄 Step 4: Syncing Afghan 2023 audio to verses table...
   Processing 4200 files in 84 batches...

   [100.0%] Batch 84/84: 4200 synced, 0 errors

✅ Step 5: Verifying sync...

   📈 Verses with Audio URLs:
      - verses_yousafzai: 43193 verses
      - verses: 4200 verses

   🔍 Sample Verification (first 3 verses):
      - Genesis 1:1 → 1_v_gsp-7e90...
      - Genesis 1:2 → 1_v_gsp-7e90...
      - Genesis 1:3 → 1_v_gsp-7e90...

🎉 Sync Complete! (25.43s)

📊 Summary:
   ✅ Yousafzai: 43193 updated, 0 errors
   ✅ Afghan 2023: 4200 updated, 0 errors
   📈 Total: 47393 verses synced
```

## What the Script Does

### 1. **Fetches Audio Files** 
   - Reads all records from `audio_files` table
   - Each record has: book, chapter, verse, translation, Google Drive ID, URL

### 2. **Groups by Translation**
   - Yousafzai 2019 → goes to `verses_yousafzai` table
   - Afghan 2023 → goes to `verses` table

### 3. **Updates Verse Tables**
   For each verse, it sets:
   - `audio_public_url`: The Google Drive URL
   - `audio_storage_path`: A normalized path like `audio/yousafzai2019/Genesis_1_1.mp3`

### 4. **Verifies Success**
   - Counts how many verses now have audio URLs
   - Shows sample verification with file IDs
   - Reports any errors

## Verification After Running

### Check via Supabase Console

1. Go to Supabase → Table Editor
2. Click on `verses_yousafzai` table
3. Look for `audio_public_url` column
4. Verify each row has a **different** Google Drive ID

Example:
```
Genesis 1:1   → https://drive.google.com/uc?id=AAAA...
Genesis 1:2   → https://drive.google.com/uc?id=BBBB...  ← Different!
Genesis 1:3   → https://drive.google.com/uc?id=CCCC...  ← Different!
```

### Check via SQL

```sql
SELECT book, chapter, verse, audio_public_url 
FROM verses_yousafzai 
WHERE book = 'Genesis' AND chapter = 1
LIMIT 3;
```

Each verse should have a **unique** URL with a different file ID.

## Testing the App

1. **Clear browser cache**: Cmd+Shift+R
2. **Reload the app**: https://pashto-bible-search.vercel.app
3. **Navigate to Yousafzai chapter**: Click Chapters → Select a book → Select Yousafzai 2019
4. **Click Play Audio**: Multiple verses should play different audio files
5. **Check DevTools**: Network tab should show different Google Drive file IDs for each verse

## Troubleshooting

### Script won't run
```bash
# Verify Node.js is installed
node --version

# Verify you're in the right directory
pwd  # Should be /Users/jeremysamuels/Documents/pashto-bible-search

# Verify the script exists
ls scripts/sync_audio_files_to_verses.js
```

### "Missing environment variables" error
```bash
# Make sure you exported them in THIS terminal session
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-key"

# Verify they're set
echo $NEXT_PUBLIC_SUPABASE_URL
```

### "Failed to fetch audio_files" error
- Verify the `audio_files` table exists in Supabase
- Verify you have the correct Supabase credentials
- Check that your project has data in the audio_files table

### Verses still showing same audio
- Wait 5-10 seconds for database to sync
- Clear browser cache completely (Cmd+Option+R)
- Hard refresh the page
- Check DevTools Network tab for different file IDs

## Script Behavior

- **Batch Size**: Processes 50 verses at a time to avoid overwhelming the database
- **Rate Limiting**: 200ms delay between batches
- **Error Handling**: Continues even if individual verses fail, reports summary
- **Verification**: Automatically checks a sample of results

## Next Steps

1. ✅ Run the sync script
2. ✅ Verify in Supabase console
3. ✅ Clear browser cache
4. ✅ Test audio playback
5. ✅ Check that different verses play different audio
6. ✅ Commit and push changes

```bash
git add -A
git commit -m "feat: Run audio sync script - connect audio_files to verses tables"
git push origin main
```

---

**Questions?** Check the console output for error messages and verify audio_files table has data.
