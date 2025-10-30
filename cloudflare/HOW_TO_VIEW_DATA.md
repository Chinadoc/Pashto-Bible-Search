# 📊 Viewing Your D1 Database Data

## ✅ Your Data is Stored!

Your D1 database is a **SQLite database** (relational database with tables). Here's what you have:

### Current Tables:
- ✅ `verses` - Bible verses (6,100+ Yousafzai 2019 verses currently)
- ✅ `word_frequencies` - Word frequency data
- ✅ `dictionary` - Dictionary definitions
- ✅ `form_occurrences` - Word form occurrences
- ✅ `form_to_root` - Root word mappings
- ✅ `inflections` - Linguistic inflections
- ✅ `verbs_lexicon` - Verb lexicon
- ✅ `irregular_verbs` - Irregular verb forms
- ✅ `nouns_lexicon` - Noun lexicon
- ✅ `grammar_rules` - Grammar rules

---

## 🔍 How to View Data in Cloudflare Dashboard

### Method 1: Console Tab (Easiest)

1. Go to your D1 dashboard: https://dash.cloudflare.com
2. Click on **"pashto-bible-db"**
3. Click the **"Console"** tab (next to "Overview")
4. Type SQL queries like:

```sql
-- View first 10 verses
SELECT * FROM verses LIMIT 10;

-- Count verses by translation
SELECT translation_key, COUNT(*) as count 
FROM verses 
GROUP BY translation_key;

-- View a specific verse
SELECT * FROM verses WHERE ref = 'Genesis 1:1';

-- Search verses by text
SELECT ref, text 
FROM verses 
WHERE text LIKE '%خدا%' 
LIMIT 10;
```

### Method 2: Explore Data Button

1. In the Overview tab, click the **"Explore Data"** button (top right)
2. This opens a visual query builder

### Method 3: Command Line (What I'm Using)

```bash
# View tables
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

# View sample data
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT * FROM verses LIMIT 5;"

# Count verses
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM verses;"
```

---

## 📖 Sample Data Structure

Each verse in the `verses` table has:

```json
{
  "id": 1,
  "ref": "Genesis 1:1",
  "book": "Genesis",
  "chapter": 1,
  "verse": 1,
  "text": "په شروع کښې چې کله خُدائ پاک ټول کائنات پېدا کړو،",
  "text_html": "&nbsp;په شروع کښې چې کله خُدائ پاک ټول کائنات پېدا کړو،",
  "testament": "OT",
  "translation_key": "yousafzai2019",
  "dialect": "yousafzai",
  "tags": "[]",
  "audio_r2_key": null,
  "audio_public_url": null,
  "created_at": 1761755094,
  "updated_at": 1761755094
}
```

---

## 🎯 Current Status

- ✅ **6,100 Yousafzai 2019 verses** migrated
- ⏳ **24,160 Afghan 2023 verses** pending (migration stopped due to D1 sync issues)
- ✅ **Schema complete** - All tables created

---

## 💡 Quick Queries to Try

```sql
-- 1. See total verses
SELECT COUNT(*) as total FROM verses;

-- 2. See verses by book
SELECT book, COUNT(*) as count 
FROM verses 
GROUP BY book 
ORDER BY count DESC;

-- 3. See verses by testament
SELECT testament, translation_key, COUNT(*) as count 
FROM verses 
GROUP BY testament, translation_key;

-- 4. View a random verse
SELECT ref, text 
FROM verses 
ORDER BY RANDOM() 
LIMIT 1;
```

---

**Try clicking the "Console" tab in your D1 dashboard and run these queries!** 🚀


