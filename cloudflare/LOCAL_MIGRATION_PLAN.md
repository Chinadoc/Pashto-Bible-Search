# Local Files Migration Plan

## ✅ What We Found Locally

### Verse Data Files

1. **Yousafzai All Verses**
   - File: `yousafzai_all_verses.json`
   - Verses: **30,410** (full Bible - OT + NT)
   - Format: Array with `{book, chapter, verse, text, ...}`
   - Size: 19MB

2. **Afghan 2023 Verses** 
   - File: `cache/verses.json.gz` (compressed)
   - Verses: **24,160** (all OT verses)
   - Format: Object `{ "ref": "text" }`
   - Size: 5.6MB compressed
   - Note: NT verses may be in Supabase only

3. **Afghan 2023 Public File**
   - File: `public/assets/pashto_bible.json`
   - Verses: **3,929** (subset)
   - Format: Array with `{ref, text}`

### Audio Files

- **Total MP3 files found**: ~48,799 files
- **Locations**:
  - `pashto-bible-react/split_output/` - Chapter-level splits
  - Various other directories

## 🚀 Migration Strategy

### Phase 1: Database Migration (LOCAL → D1)

**Status**: ✅ Script created (`migrate-from-local-files.ts`)

**What it does**:
1. Reads `yousafzai_all_verses.json` → 30,410 verses
2. Reads `cache/verses.json.gz` → 24,160 Afghan 2023 verses
3. Generates SQL INSERT statements (100 rows per file)
4. Optionally executes to D1

**Files Generated**: 345 SQL files
- 305 files for Yousafzai (30,410 verses ÷ 100)
- 40 files for Afghan (3,929 verses ÷ 100)
- **Note**: Need to handle remaining ~20K Afghan verses

**To Run**:
```bash
EXECUTE_NOW=true npx tsx cloudflare/migrate-from-local-files.ts
```

**Estimated Time**: 15-20 minutes (345 files × ~3 seconds each)

---

### Phase 2: Audio Migration (LOCAL → R2)

**Status**: ✅ Script created (`migrate-audio-from-local.ts`)

**What it does**:
1. Recursively searches directories for MP3 files
2. Categorizes files (Yousafzai vs Afghan 2023)
3. Uploads to R2 with proper folder structure
4. Skips files that already exist

**R2 Structure**:
```
pashto-bible-audio/
├── yousafzai/
│   ├── nt/
│   │   ├── yousafzai_matthew001_verse_001.mp3
│   │   └── ...
│   └── ot/
│       ├── yousafzai_genesis001_verse_001.mp3
│       └── ...
└── afghan2023/
    ├── nt/
    │   ├── matthew1_verse_1.mp3
    │   └── ...
    └── ot/
        ├── proverbs027_verse_022.mp3
        └── ...
```

**To Run** (after R2 credentials are set):
```bash
npx tsx cloudflare/migrate-audio-from-local.ts
```

**Estimated Time**: 2-4 hours (48K files, ~1-2 seconds per file with batching)

---

## 📋 Complete Local Data Inventory

### Verse Files

| File | Verses | Translation | Completeness |
|------|--------|-------------|--------------|
| `yousafzai_all_verses.json` | 30,410 | Yousafzai | ✅ Full Bible |
| `cache/verses.json.gz` | 24,160 | Afghan 2023 | ✅ All OT |
| `public/assets/pashto_bible.json` | 3,929 | Afghan 2023 | ⚠️ Subset |

**Total Verses Available**: ~54,570 verses

### Audio Files

- **Total**: ~48,799 MP3 files found locally
- **Sources**: Multiple directories (need to verify completeness)

---

## ⚠️ Notes

1. **Afghan 2023 NT**: The compressed cache has OT only. NT verses may need to come from Supabase or another source.

2. **Audio File Naming**: Some files may be chapter-level (e.g., `1-timothy-5.mp3`) rather than verse-level. Need to verify structure.

3. **Complete Audio Coverage**: Need to verify we have all 43,866 audio files locally that we identified earlier.

---

## 🎯 Recommended Approach

### Option A: Local Migration (Faster) ✅ Recommended

1. ✅ Migrate verses from local JSON files (15-20 min)
2. ⏳ Migrate audio from local directories (2-4 hours)
3. ✅ Update database with R2 keys

**Pros**:
- Much faster (no network downloads)
- Uses complete local datasets
- No Supabase dependency

**Cons**:
- Need to verify we have all audio files locally
- May need to supplement with Supabase for missing data

### Option B: Hybrid Approach

1. Migrate verses from local files (most complete)
2. Migrate audio from:
   - Local directories (what exists)
   - Supabase Storage (Afghan 2023, if missing locally)
   - Google Drive (Yousafzai, if missing locally)

---

## ✅ Next Steps

1. **Verify Audio Coverage**: Check if all 43,866 audio files exist locally
2. **Get R2 Credentials**: Set up API tokens
3. **Run Database Migration**: `EXECUTE_NOW=true npx tsx cloudflare/migrate-from-local-files.ts`
4. **Run Audio Migration**: After R2 credentials are set

---

**Status**: Ready to proceed with local migration! 🚀


