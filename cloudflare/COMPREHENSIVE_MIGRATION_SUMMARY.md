# Comprehensive Database Migration Summary

## ✅ What We Built

A **single unified database** in Cloudflare D1 that includes:

### 📊 Data Included

1. **Verses** (Unified table)
   - Both Afghan 2023 and Yousafzai 2019 translations
   - Audio R2 keys for each verse
   - Text, normalized text, HTML text
   - Testament (OT/NT), dialect, tags

2. **Word Frequencies**
   - ~7,405 word frequency entries
   - Frequency counts and rankings
   - Part of speech information
   - Romanization

3. **Form Occurrences**
   - ~7,252 word forms
   - Verse references for each form
   - Frequency counts

4. **Form to Root Mapping**
   - ~7,252 mappings
   - Links word forms to their root words

5. **Additional Tables** (Schema ready, can populate later)
   - Dictionary entries
   - Inflections cache
   - Verbs lexicon
   - Irregular verbs
   - Nouns lexicon
   - Grammar rules
   - Video transcripts

---

## 🗄️ Database Schema

**Single unified `verses` table** instead of separate tables:
- Uses `translation_key` to distinguish: `'afghan2023'` vs `'yousafzai2019'`
- Audio R2 keys stored in `audio_r2_key` column
- Format: `yousafzai/nt/genesis001_verse_001.mp3` or `afghan2023/ot/proverbs027_verse_022.mp3`

**All tables support:**
- ✅ Adding new records
- ✅ Deleting records
- ✅ Updating records
- ✅ Querying by translation, testament, book, etc.

---

## 🚀 Migration Status

**Currently Running**: `migrate-comprehensive-to-d1.ts`

**What it does**:
1. ✅ Applies comprehensive schema (already done)
2. ⏳ Migrates verses (both translations) - **IN PROGRESS**
3. ⏳ Migrates word frequencies
4. ⏳ Migrates form occurrences
5. ⏳ Migrates form-to-root mappings

**Estimated Time**: 30-60 minutes for all data

---

## 📝 Source of Truth

**Website**: https://afghanbibles.org/eng/pashto-bible/

- Both translations maintained here
- Audio files available
- Files updated occasionally
- Future updates can be synced to D1

---

## 🔧 Usage Examples

### Query verses by translation:
```sql
SELECT * FROM verses WHERE translation_key = 'afghan2023' LIMIT 10;
SELECT * FROM verses WHERE translation_key = 'yousafzai2019' LIMIT 10;
```

### Find verses with audio:
```sql
SELECT ref, audio_r2_key FROM verses 
WHERE audio_r2_key IS NOT NULL 
AND translation_key = 'yousafzai2019'
LIMIT 10;
```

### Word frequency lookup:
```sql
SELECT * FROM word_frequencies 
WHERE pashto_word = 'خدا' 
ORDER BY frequency DESC;
```

### Form occurrence lookup:
```sql
SELECT * FROM form_occurrences 
WHERE pashto_form = 'خدای'
LIMIT 1;
```

---

## 📋 Files Created

1. **`d1-comprehensive-schema.sql`** - Unified schema with all tables
2. **`migrate-comprehensive-to-d1.ts`** - Migration script for all data
3. **`reset-and-migrate.sh`** - Script to reset and apply schema

---

## ⚠️ Notes

- Migration is **idempotent** - can be run multiple times (with some duplication)
- To add new verses/words: Simply INSERT into appropriate tables
- To delete: Use DELETE FROM table WHERE ...
- Audio R2 keys follow pattern: `{translation}/{testament}/{filename}`
- All JSON data stored as TEXT (SQLite limitation)

---

**Status**: Migration in progress! 🚀


