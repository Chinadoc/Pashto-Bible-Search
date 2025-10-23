# ⚠️ CRITICAL: Frequency Data Preprocessing

## The Issue

Your current frequency JSON files are in **legacy format** (simple counts):
```json
[
  { "pashto": "د", "frequency": 12701 },
  { "pashto": "چې", "frequency": 8259 }
]
```

**The ingestion script requires** the rich format with `verse_refs`:
```json
{
  "د": {
    "frequency": 12701,
    "verse_refs": ["Genesis 1:1", "Genesis 1:3", "Exodus 2:1", ...],
    "tf_idf_scores": [0.45, 0.42, 0.38, ...]
  }
}
```

**Without this preprocessing:**
- ⚠️ 12,500+ words will be skipped
- ⚠️ Word index will be empty
- ⚠️ Search won't work (no word mappings)
- ✅ Script will warn: "12500 words skipped - missing verse_refs"

---

## What the Preprocessing Script Does

`precompute_word_frequencies.js` transforms legacy format → production-ready format:

1. **Loads verses** from JSON files (both translations)
2. **Tokenizes** each verse (splits on whitespace)
3. **Maps** each word to verses containing it
4. **Computes** TF-IDF relevance scores
5. **Outputs** rich JSON with verse refs + scores

### Processing Steps

```
Input: app/data/word_frequency_list.json (legacy format)
       public/verses.json.gz (Afghan verses)
       ↓
[1] Load legacy frequencies (12,500 words)
[2] Load verses (8,000 verses)
[3] Scan verses and build word→verse mappings
    "د" appears in Genesis 1:1, Genesis 1:3, Exodus 2:1, ... (5,000+ verses)
[4] Compute TF-IDF scores per word
[5] Write rich JSON output
    ↓
Output: STDOUT (redirect to file)
Format: { word: { frequency, verse_refs[], tf_idf_scores[] } }
```

---

## Prerequisites

- Node.js installed
- `app/data/word_frequency_list.json` (legacy format) ✓ You have this
- `public/verses.json.gz` (Afghan verses, gzipped) ✓ You have this
- `app/data/yousafzai_all_verses.json` (Yousafzai verses) ✓ You have this

---

## How to Run

### Step 1: Precompute Afghan Frequencies

```bash
node precompute_word_frequencies.js > app/data/word_frequency_list_enriched.json
```

**Expected output:**
```
🚀 Preprocessing word frequencies for afghan2023...

📖 Loading verses data...
   ✅ Loaded 8000 Afghan verses

📊 Loading legacy frequency data...
   ✅ Loaded 12500 words

🔍 Computing word-to-verse mappings (this may take a few minutes)...
   Progress: 8000/8000 verses (100%)
   ✅ Found 12400 words with verse mappings
   ⚠️  100 words not found in verses (will be skipped)

📝 Building rich frequency format...
   Progress: 12400/12400 words

💾 Writing output...
{ "د": { "frequency": 12701, "verse_refs": [...], "tf_idf_scores": [...] }, ... }

✅ Preprocessing complete! {
  words: 12400,
  verses: 8000,
  translation: 'afghan2023'
}
```

**Runtime:** 10-20 minutes depending on CPU

### Step 2: Move to Final Location

```bash
mv app/data/word_frequency_list_enriched.json app/data/word_frequency_list.json
```

### Step 3: Precompute Yousafzai Frequencies

```bash
node precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list_enriched.json
```

```bash
mv app/data/yousafzai_word_frequency_list_enriched.json app/data/yousafzai_word_frequency_list.json
```

---

## Verification

After preprocessing, verify the output format:

```bash
# Check first word in Afghan
jq 'to_entries | .[0]' app/data/word_frequency_list.json

# Output should look like:
{
  "key": "د",
  "value": {
    "frequency": 12701,
    "verse_refs": [
      "Genesis 1:1",
      "Genesis 1:3",
      "Genesis 1:4",
      ...
    ],
    "tf_idf_scores": [
      0.3245,
      0.3198,
      0.3156,
      ...
    ]
  }
}
```

Check that:
- ✅ `verse_refs` is an array of verse references
- ✅ `tf_idf_scores` has same length as `verse_refs`
- ✅ `frequency` matches original count

---

## What Happens Next

Once preprocessing is complete:

1. ✅ Frequency files have `verse_refs` + `tf_idf_scores`
2. ✅ Run ingestion: `node ingest_to_production_schema.js`
3. ✅ Ingestion will find all 12,400 words (no skips)
4. ✅ `word_occurrence_index` table populated correctly
5. ✅ Search API can query by word instantly

---

## Troubleshooting

### Issue: Script hangs or takes too long

**Cause:** Scanning 8,000 verses × 12,500 words is slow

**Expected behavior:** Takes 10-20 minutes, shows progress every 1,000 verses

**To monitor:**
```bash
# In another terminal:
watch -n 1 'wc -l app/data/word_frequency_list.json'
```

### Issue: "Cannot find module 'zlib'"

**Cause:** Node.js zlib not available (rare)

**Fix:**
```bash
node -v  # Ensure Node >= 12
npm install --save-dev zlib  # Unlikely to help, zlib is built-in
```

### Issue: Memory error

**Cause:** 8,000 verses × 12,500 words = large in-memory structures

**Fix:**
```bash
# Increase Node.js heap size
node --max-old-space-size=4096 precompute_word_frequencies.js > ...
```

---

## Performance Notes

| Stage | Time |
|-------|------|
| Load verses | ~1 sec |
| Load frequencies | ~1 sec |
| Scan verses + build mappings | ~15 mins |
| Compute TF-IDF | ~1 min |
| Write JSON | ~1 sec |
| **Total** | **~17 mins** |

---

## FAQ

**Q: Do I need to run this every time?**
A: No, just once. After preprocessing, keep the enriched files. Commit them to git if you want version control.

**Q: Will the TF-IDF scores be accurate?**
A: They use a simplified formula (not perfect), but good enough for ranking. They can be improved later with full TF-IDF corpus analysis.

**Q: What if a word isn't found in any verse?**
A: It's skipped. Script shows: "100 words not found in verses (will be skipped)". These are likely typos or words from metadata.

**Q: Can I run both Afghan and Yousafzai in parallel?**
A: Yes, in separate terminals. They don't share resources.

**Q: How do I validate the output before ingesting?**
A: Run the verification steps above. Check a few random words:
```bash
jq '.["خدا"]' app/data/word_frequency_list.json
```

---

## Next Steps

1. **Run preprocessing:**
   ```bash
   node precompute_word_frequencies.js > app/data/word_frequency_list_enriched.json
   node precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list_enriched.json
   ```

2. **Move files:**
   ```bash
   mv app/data/word_frequency_list_enriched.json app/data/word_frequency_list.json
   mv app/data/yousafzai_word_frequency_list_enriched.json app/data/yousafzai_word_frequency_list.json
   ```

3. **Verify output:**
   ```bash
   jq 'to_entries | length' app/data/word_frequency_list.json  # Should be ~12,400
   ```

4. **Then run ingestion:**
   ```bash
   node ingest_to_production_schema.js
   ```

---

## ⏭️ You are here

```
┌─────────────────────────┐
│ Frequency files (legacy)│ ← Current state
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ THIS STEP: Preprocessing│ ← MUST DO FIRST
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Enriched frequencies    │ ← After preprocessing
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Run ingestion script    │ ← Next
└─────────────────────────┘
```

**Do NOT skip this step.** Without it, word indexing will fail silently (all words skipped).
