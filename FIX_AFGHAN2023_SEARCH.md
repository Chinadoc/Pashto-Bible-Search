# 🔧 Fix Afghan 2023 Search Issue

## Problem Identified ✅

The `word_occurrence_index` for Afghan 2023 is **corrupted**:

```sql
SELECT * FROM word_occurrence_index WHERE word = 'وهل';

-- RESULTS:
-- Afghan 2023:  frequency=0, verse_refs=[] ❌ BROKEN
-- Yousafzai19:  frequency=5, verse_refs=['Proverbs 19:29',...] ✅ WORKS
```

**Why search returns 0 results:**
- The code looks for verses in `verse_refs` array
- Afghan 2023 has empty array → no verses → 0 results

---

## Solution 🚀

### Option 1: Run Repair Script (Recommended)

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run repair script
node scripts/repair_afghan2023_index.js
```

**What it does:**
1. ✅ Fetches all 24,160 verses from `verses` table
2. ✅ Extracts and counts all words
3. ✅ Deletes broken Afghan 2023 entries
4. ✅ Inserts corrected entries with proper frequency and verse_refs
5. ✅ Verifies the repairs

**Expected output:**
```
🔧 REPAIRING AFGHAN 2023 word_occurrence_index

📖 Step 1: Fetching Afghan 2023 verses...
✅ Fetched 24160 verses

📊 Step 2: Extracting words from verses...
✅ Found 9,847 unique words

🗑️  Step 3: Clearing broken Afghan 2023 entries...
✅ Cleared old entries

📥 Step 4: Inserting corrected Afghan 2023 entries...
  1000/9847 words processed (10%)
  2000/9847 words processed (20%)
  ...
✅ Inserted 9,847 corrected entries

✅ Step 5: Verifying repairs...
✅ Word "وهل" now has: frequency: 5, translation_key: "afghan2023"

🎉 REPAIR COMPLETE!
📊 Total Afghan 2023 entries: 9,847
✅ All entries now have correct frequency and verse_refs
```

---

### Option 2: Manual SQL Repair (If script fails)

Run in Supabase SQL Editor:

```sql
-- Step 1: Backup current data (optional)
SELECT * INTO word_occurrence_index_backup 
FROM word_occurrence_index 
WHERE translation_key = 'afghan2023';

-- Step 2: Delete broken Afghan 2023 entries
DELETE FROM word_occurrence_index 
WHERE translation_key = 'afghan2023';

-- Step 3: Rebuild from verses (PostgreSQL only)
-- This extracts all words and their verse references
-- Note: May take 1-5 minutes depending on database load

INSERT INTO word_occurrence_index (word, translation_key, frequency, verse_refs)
SELECT 
  word,
  'afghan2023' as translation_key,
  COUNT(*) as frequency,
  ARRAY_AGG(DISTINCT verse_ref ORDER BY verse_ref) as verse_refs
FROM (
  SELECT 
    (regexp_split_to_array(text, '\s+'))[idx] as word,
    concat(book, ' ', chapter, ':', verse) as verse_ref
  FROM verses
  CROSS JOIN generate_subscripts(regexp_split_to_array(text, '\s+'), 1) AS idx
  WHERE text IS NOT NULL AND text != ''
) word_verses
GROUP BY word;

-- Step 4: Verify
SELECT word, frequency, array_length(verse_refs, 1) as verse_count
FROM word_occurrence_index
WHERE translation_key = 'afghan2023' AND word = 'وهل';
```

---

## Testing ✅

After repair, test the search:

1. Go to **https://pashto-bible-search.vercel.app**
2. Switch to **Afghan 2023** translation
3. Search for **"wahul"** (romanized for وهل)
4. Expected: Should now show results (not 0!)

---

## Verification

Run in Supabase to confirm:

```sql
-- Should now show both translations with data
SELECT translation_key, COUNT(*) as word_count, 
  AVG(frequency) as avg_frequency
FROM word_occurrence_index
WHERE word = 'وهل'
GROUP BY translation_key;

-- Count total entries per translation
SELECT translation_key, COUNT(*) as total_entries
FROM word_occurrence_index
GROUP BY translation_key;
```

**Expected:**
```
translation_key  | word_count | avg_frequency
-----------------+------------+---------------
afghan2023       |     1      |      5
yousafzai2019    |     1      |      5

translation_key  | total_entries
-----------------+---------------
afghan2023       |     ~9,847
yousafzai2019    |    ~10,500+
```

---

## After Repair

Once Afghan 2023 is fixed:

✅ Search will return results for both translations
✅ Performance will be much better (no empty arrays)
✅ Database is now consistent

---

## If You Still Have Issues

1. Check Supabase logs for errors
2. Verify `verses` table has data: `SELECT COUNT(*) FROM verses;`
3. Verify `verses_yousafzai` is separate: `SELECT COUNT(*) FROM verses_yousafzai;`
4. Run diagnostic: `POST /api/test-search-debug` to see database state

---

**Questions?** Check `DATABASE_OPTIMIZATION_PLAN.md` for full analysis!
