# Audio Files Migration Plan - Cloudflare R2

## Current Audio Coverage Status

### Afghan 2023 Translation

#### ✅ New Testament (NT)
- **Status**: Complete
- **Files**: All 7,233 NT verses have audio
- **Storage**: Supabase Storage bucket `audio`
- **Naming Pattern**: `{book}{chapter}_verse_{verse}.mp3`
  - Examples: `matthew1_verse_1.mp3`, `acts19_verse_12.mp3`
- **Location**: `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/`
- **Migration**: ✅ All files available for migration

#### ⚠️ Old Testament (OT) - **PARTIAL COVERAGE**
- **Status**: Partial (4,200 files exist)
- **Total OT Verses**: ~24,160 verses
- **Coverage**: ~17.4% (4,200 / 24,160)
- **Storage**: Supabase Storage bucket `audio`
- **Naming Pattern**: `{book}{chapter}_verse_{verse}.mp3`
  - Examples: `proverbs027_verse_022.mp3`, `jonah001_verse_001.mp3`, `isaiah001_verse_001.mp3`
- **Missing**: Most OT books/chapters don't have audio yet (they don't exist at source)
- **Migration**: ✅ Migrate what exists (4,200 files)

**Afghan 2023 OT Audio Available Books** (from coverage report):
- Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth
- 1-Samuel, 2-Samuel, 1-Kings, 2-Kings, 1-Chronicles, 2-Chronicles
- Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song-of-Solomon
- Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel
- Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi

**Note**: Audio is being monitored and new files are added as they become available from afghanbibles.org

---

### Yousafzai 2019 Translation

#### ✅ New Testament (NT)
- **Status**: Complete
- **Files**: All 7,233 NT verses have audio
- **Storage**: Google Drive
- **Naming Pattern**: `yousafzai_{book}{chapter}_verse_{verse}.mp3`
  - Examples: `yousafzai_matthew001_verse_001.mp3`, `yousafzai_revelation022_verse_021.mp3`
- **Location**: Google Drive shared folder
- **Migration**: ✅ All files available for migration

#### ✅ Old Testament (OT)
- **Status**: Complete
- **Files**: All ~24,160 OT verses have audio
- **Storage**: Google Drive
- **Naming Pattern**: `yousafzai_{book}{chapter}_verse_{verse}.mp3`
  - Examples: `yousafzai_genesis001_verse_001.mp3`, `yousafzai_psalms002_verse_003.mp3`
- **Location**: Google Drive shared folder
- **Migration**: ✅ All files available for migration

**Total Yousafzai**: 43,193 files (full Bible coverage)

---

## Migration Summary Table

| Translation | Testament | Status | Files | Storage Source | Ready to Migrate |
|------------|-----------|--------|-------|----------------|------------------|
| **Afghan 2023** | NT | ✅ Complete | 7,233 | Supabase Storage | ✅ Yes |
| **Afghan 2023** | OT | ⚠️ Partial | 4,200 | Supabase Storage | ✅ Yes (partial) |
| **Yousafzai** | NT | ✅ Complete | 7,233 | Google Drive | ✅ Yes |
| **Yousafzai** | OT | ✅ Complete | ~24,160 | Google Drive | ✅ Yes |
| **TOTAL** | - | - | **43,866** | - | ✅ Yes |

**Note**: Afghan 2023 OT has ~19,960 missing audio files (they don't exist yet), but we'll migrate the 4,200 that do exist.

---

## Migration Strategy

### Phase 1: List and Verify All Files

1. **Afghan 2023 (Supabase Storage)**
   - List all files from Supabase Storage bucket `audio`
   - Filter for NT and OT files separately
   - Expected: ~11,433 files (7,233 NT + 4,200 OT)
   - Verify file naming patterns match database references

2. **Yousafzai (Google Drive)**
   - List all files from Google Drive folder
   - Filter for NT and OT files separately
   - Expected: 43,193 files (7,233 NT + ~24,160 OT)
   - Verify file naming patterns match database references

### Phase 2: Migrate Afghan 2023 (Supabase → R2)

**Priority**: High (simpler, single source)

1. **Source**: Supabase Storage bucket `audio`
2. **Files**: ~11,433 files
3. **Process**:
   - Download from Supabase Storage
   - Upload to R2 bucket `pashto-bible-audio`
   - Use same naming pattern: `{book}{chapter}_verse_{verse}.mp3`
   - Maintain folder structure (optional): `afghan2023/nt/` and `afghan2023/ot/`

**R2 Keys**:
- `afghan2023/nt/matthew1_verse_1.mp3`
- `afghan2023/ot/proverbs027_verse_022.mp3`

### Phase 3: Migrate Yousafzai (Google Drive → R2)

**Priority**: High (complete coverage)

1. **Source**: Google Drive shared folder
2. **Files**: 43,193 files
3. **Process**:
   - Download from Google Drive (requires authentication)
   - Upload to R2 bucket `pashto-bible-audio`
   - Use same naming pattern: `yousafzai_{book}{chapter}_verse_{verse}.mp3`
   - Maintain folder structure: `yousafzai/nt/` and `yousafzai/ot/`

**R2 Keys**:
- `yousafzai/nt/yousafzai_matthew001_verse_001.mp3`
- `yousafzai/ot/yousafzai_genesis001_verse_001.mp3`

### Phase 4: Update Database References

1. **Update `verses` table (Afghan 2023)**:
   - Set `audio_r2_key` to new R2 key
   - Format: `afghan2023/{testament}/{filename}.mp3`
   - Keep `audio_public_url` as fallback initially

2. **Update `verses_yousafzai` table**:
   - Set `audio_r2_key` to new R2 key
   - Format: `yousafzai/{testament}/{filename}.mp3`
   - Keep `audio_public_url` as fallback initially

---

## File Organization in R2

### Recommended Structure

```
pashto-bible-audio/
├── afghan2023/
│   ├── nt/
│   │   ├── matthew1_verse_1.mp3
│   │   ├── matthew1_verse_2.mp3
│   │   └── ...
│   └── ot/
│       ├── proverbs027_verse_022.mp3
│       ├── jonah001_verse_001.mp3
│       └── ...
└── yousafzai/
    ├── nt/
    │   ├── yousafzai_matthew001_verse_001.mp3
    │   └── ...
    └── ot/
        ├── yousafzai_genesis001_verse_001.mp3
        └── ...
```

**Alternative**: Flat structure (simpler)
```
pashto-bible-audio/
├── matthew1_verse_1.mp3          (Afghan 2023 NT)
├── proverbs027_verse_022.mp3     (Afghan 2023 OT)
├── yousafzai_matthew001_verse_001.mp3  (Yousafzai NT)
└── yousafzai_genesis001_verse_001.mp3  (Yousafzai OT)
```

**Recommendation**: Use folder structure for better organization and easier management.

---

## Migration Script Updates Needed

### Update `migrate-audio-to-r2.ts`

1. **Add Supabase Storage listing**:
   ```typescript
   async function listSupabaseAudioFiles(): Promise<string[]> {
     // List from Supabase Storage bucket 'audio'
     // Filter NT vs OT based on database queries
   }
   ```

2. **Add Google Drive listing**:
   ```typescript
   async function listGoogleDriveAudioFiles(): Promise<string[]> {
     // List from Google Drive folder
     // Use Google Drive API
   }
   ```

3. **Separate migration functions**:
   - `migrateAfghan2023Audio()` - Supabase → R2
   - `migrateYousafzaiAudio()` - Google Drive → R2

4. **Progress tracking**:
   - Track by translation and testament
   - Report missing files (especially Afghan 2023 OT)

---

## Database Query for Verification

### Check Current Audio Coverage

```sql
-- Afghan 2023 NT audio coverage
SELECT 
  COUNT(*) as total_verses,
  COUNT(audio_filename) as verses_with_audio,
  COUNT(*) - COUNT(audio_filename) as missing_audio
FROM verses
WHERE testament = 'NT';

-- Afghan 2023 OT audio coverage
SELECT 
  COUNT(*) as total_verses,
  COUNT(audio_filename) as verses_with_audio,
  COUNT(*) - COUNT(audio_filename) as missing_audio
FROM verses
WHERE testament = 'OT';

-- Yousafzai audio coverage
SELECT 
  testament,
  COUNT(*) as total_verses,
  COUNT(audio_public_url) as verses_with_audio,
  COUNT(*) - COUNT(audio_public_url) as missing_audio
FROM verses_yousafzai
GROUP BY testament;
```

---

## Migration Checklist

### Pre-Migration
- [ ] Verify Supabase Storage has all Afghan 2023 files (~11,433)
- [ ] Verify Google Drive has all Yousafzai files (43,193)
- [ ] Query database to confirm audio references match file names
- [ ] Set up R2 bucket and configure public access or signed URLs
- [ ] Get Google Drive API credentials
- [ ] Test downloading a few sample files from each source

### Migration Execution
- [ ] Migrate Afghan 2023 NT (7,233 files)
- [ ] Migrate Afghan 2023 OT (4,200 files) - partial
- [ ] Migrate Yousafzai NT (7,233 files)
- [ ] Migrate Yousafzai OT (~24,160 files)
- [ ] Verify all files uploaded successfully
- [ ] Generate R2 public URLs or signed URL configuration

### Post-Migration
- [ ] Update database with R2 keys
- [ ] Test audio playback from R2
- [ ] Update frontend code to use R2 URLs
- [ ] Monitor for any missing files
- [ ] Document missing Afghan 2023 OT files for future migration

---

## Notes on Missing Afghan 2023 OT Audio

**Current Status**: Only 4,200 of ~24,160 OT verses have audio

**Why**: Audio files don't exist yet at the source (afghanbibles.org)

**Action Items**:
1. ✅ Migrate existing 4,200 files
2. ✅ Set up monitoring (already exists in `OT_AUDIO_MONITORING_README.md`)
3. ✅ Automatically migrate new files as they become available
4. ✅ Document which books/chapters are missing

**Future Migration**: As new OT audio becomes available, use the same migration process to add them to R2.

---

## Estimated Migration Time

**Afghan 2023** (~11,433 files):
- Download: ~1-2 hours (Supabase Storage is fast)
- Upload: ~2-3 hours (to R2)
- **Total**: ~3-5 hours

**Yousafzai** (43,193 files):
- Download: ~4-6 hours (Google Drive API rate limits)
- Upload: ~6-8 hours (to R2)
- **Total**: ~10-14 hours

**Combined**: ~13-19 hours (can run in parallel, so ~10-14 hours total)

---

## Cost Estimates

**Storage**:
- Current total: ~54,626 files
- Estimated size: ~5-10 GB (assuming ~100-200 KB per MP3)
- R2 cost: $0.015/GB/month = **$0.075 - $0.15/month**

**Migration**:
- Egress from Supabase: Minimal (free tier includes 2GB/month)
- Egress from Google Drive: Free (within quota)
- R2 upload: Free
- **Total migration cost**: ~$0

---

## Next Steps

1. ✅ Review this plan
2. ⏳ Update migration script to handle both sources
3. ⏳ Test migration with small sample (100 files each)
4. ⏳ Run full migration
5. ⏳ Update database references
6. ⏳ Deploy and test


