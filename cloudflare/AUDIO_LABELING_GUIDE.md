# Audio File Labeling Guide

## 📁 R2 Storage Structure

All audio files are organized in Cloudflare R2 with clear, consistent labeling:

### Folder Structure

```
pashto-bible-audio/
├── yousafzai/
│   ├── nt/          # Yousafzai 2019 New Testament
│   │   ├── yousafzai_matthew001_verse_001.mp3
│   │   ├── yousafzai_matthew001_verse_002.mp3
│   │   └── ...
│   └── ot/          # Yousafzai 2019 Old Testament
│       ├── yousafzai_genesis001_verse_001.mp3
│       ├── yousafzai_psalms001_verse_001.mp3
│       └── ...
├── afghan2023/
│   ├── nt/          # Afghan 2023 New Testament
│   │   ├── matthew6_verse_018.mp3
│   │   ├── matthew6_verse_025.mp3
│   │   └── ...
│   └── ot/          # Afghan 2023 Old Testament
│       ├── genesis1_verse_001.mp3
│       ├── proverbs27_verse_022.mp3
│       └── ...
└── _unlabeled/      # Files needing manual review
    └── verse-1.mp3 (generic names)
```

---

## 🏷️ Naming Conventions

### Yousafzai 2019 Files
**Format**: `yousafzai_{book}{chapter}_verse_{verse}.mp3`

**Examples**:
- `yousafzai_psalms001_verse_001.mp3` - Psalms 1:1
- `yousafzai_matthew001_verse_001.mp3` - Matthew 1:1
- `yousafzai_genesis001_verse_001.mp3` - Genesis 1:1

**Rules**:
- Book name lowercase, no spaces
- Chapter padded to 3 digits (001, 010, 100)
- Verse padded to 3 digits (001, 010, 100)
- Always starts with `yousafzai_`

### Afghan 2023 Files
**Format**: `{book}{chapter}_verse_{verse}.mp3`

**Examples**:
- `matthew6_verse_018.mp3` - Matthew 6:18
- `genesis1_verse_001.mp3` - Genesis 1:1
- `proverbs27_verse_022.mp3` - Proverbs 27:22

**Rules**:
- Book name lowercase, no spaces
- Chapter unpadded (1, 6, 27)
- Verse padded to 3 digits (001, 018, 022)
- No translation prefix

---

## 📊 Metadata Tags

Each file uploaded to R2 includes metadata:

- `translation`: `yousafzai2019` or `afghan2023`
- `book`: Normalized book name (e.g., `matthew`, `genesis`)
- `chapter`: Chapter number
- `verse`: Verse number
- `testament`: `ot` or `nt`
- `original-filename`: Original filename from source
- `source-path`: Relative path where file was found
- `upload-date`: ISO timestamp

---

## 🔗 Database Linking

Audio files are linked to verses in the database via `audio_r2_key`:

**Example**:
```sql
SELECT ref, audio_r2_key FROM verses 
WHERE audio_r2_key = 'yousafzai/nt/yousafzai_matthew001_verse_001.mp3';
```

**Pattern Matching**:
- Database stores: `yousafzai/nt/yousafzai_matthew001_verse_001.mp3`
- R2 key matches exactly
- Format: `{translation}/{testament}/{filename}`

---

## ✅ Quality Assurance

### Well-Labeled Files ✅
- Files matching standard patterns
- Placed in correct `{translation}/{testament}/` folders
- Metadata includes all fields

### Files Needing Review ⚠️
- Files in `_unlabeled/` folder
- Generic names like `verse-1.mp3`
- Missing book/chapter/verse information

### Unknown Files ❌
- Files in `_unknown/` folder
- Cannot be automatically categorized
- Require manual identification

---

## 🛠️ Migration Script Behavior

The migration script (`migrate-audio-from-local.ts`):

1. **Recognizes patterns** and categorizes files automatically
2. **Normalizes filenames** (removes spaces, standardizes padding)
3. **Determines testament** from book name
4. **Adds metadata** for better organization
5. **Places unclear files** in `_unlabeled/` for review

---

## 📝 Best Practices

1. **Always use standard naming**: Follow patterns above
2. **Keep original filenames**: Don't rename during migration
3. **Check _unlabeled folder**: Review files that couldn't be categorized
4. **Update database**: Ensure `audio_r2_key` matches R2 structure
5. **Verify metadata**: Check that translation/testament are correct

---

**Source of Truth**: https://afghanbibles.org/eng/pashto-bible/


