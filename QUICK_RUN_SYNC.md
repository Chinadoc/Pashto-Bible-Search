# ⚡ Quick Run - Audio Sync Script

Your Supabase URL is already configured! You just need the **Service Role Key**.

## 1️⃣ Get Your Service Role Key

1. Go to: https://app.supabase.com
2. Click your project (Pashto Bible Search)
3. Go to **Settings** → **API**
4. Under **Service Role Secret**, click **Reveal**
5. Copy the full key

## 2️⃣ Run the Script (One Line)

```bash
export SUPABASE_SERVICE_ROLE_KEY="paste-your-key-here" && node scripts/sync_audio_files_to_verses.js
```

Replace `paste-your-key-here` with your actual Service Role Secret key.

## 3️⃣ That's It! 

The script will:
- ✅ Sync 43,193 Yousafzai audio files to `verses_yousafzai` table
- ✅ Sync 4,200 Afghan 2023 audio files to `verses` table
- ✅ Give each verse a unique Google Drive file ID
- ✅ Show progress and verify results

## Expected Output

```
🎵 Starting Audio Files → Verses Sync

📂 Step 1: Fetching audio_files table...
✅ Found 47393 audio file records

📊 Step 2: Grouping by translation...
   - Yousafzai 2019: 43193 files
   - Afghan 2023: 4200 files

🔄 Step 3: Syncing Yousafzai audio to verses_yousafzai table...
   [100.0%] Complete: 43193 synced

🔄 Step 4: Syncing Afghan 2023 audio to verses table...
   [100.0%] Complete: 4200 synced

🎉 Sync Complete! (~25s)
```

## ✅ After Running

1. Clear browser cache: **Cmd+Shift+R**
2. Reload app: https://pashto-bible-search.vercel.app
3. Play audio on multiple verses - each should be different! 

## 🔍 Verify It Worked

```bash
# Check Supabase - go to Table Editor and verify:
# - verses_yousafzai table has different audio_public_url for each verse
# - verses table has different audio_public_url for Afghan 2023
```

---

**Supabase URL already set to:** `https://nkombdutnjvaasxrbmdn.supabase.co`

**That's all you need!** 🚀
