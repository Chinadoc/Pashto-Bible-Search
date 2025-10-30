# Cloudflare Migration Execution Plan

## Overview

Complete migration from Supabase to Cloudflare D1 (database) + R2 (audio storage).

## Current State Analysis

### Audio Files Status

| Translation | Testament | Files Available | Source | Migration Ready |
|------------|-----------|----------------|--------|-----------------|
| **Afghan 2023** | NT | 7,233 (100%) | Supabase Storage | ✅ Yes |
| **Afghan 2023** | OT | 4,200 (~17%) | Supabase Storage | ✅ Yes (partial) |
| **Yousafzai** | NT | 7,233 (100%) | Google Drive | ✅ Yes |
| **Yousafzai** | OT | ~24,160 (100%) | Google Drive | ✅ Yes |
| **TOTAL** | - | **43,866** | - | ✅ Yes |

**Key Finding**: Afghan 2023 OT audio is incomplete (~19,960 files missing). We'll migrate what exists and document gaps.

### Database Status

- **Supabase**: All verses with metadata
- **Tables**: `verses` (Afghan 2023), `verses_yousafzai` (Yousafzai)
- **Audio References**: Stored in `audio_filename`, `audio_url`, `audio_public_url` columns

---

## Migration Phases

### Phase 1: Setup & Preparation ✅

**Status**: Complete

- [x] D1 schema created (`cloudflare/d1-schema.sql`)
- [x] R2 bucket configuration ready
- [x] Migration scripts created
- [x] Worker API implemented
- [x] Documentation complete

**Next**: Execute migrations

---

### Phase 2: Database Migration (D1)

**Estimated Time**: 2-4 hours

#### Step 2.1: Create D1 Database
```bash
npx wrangler d1 create pashto-bible-db
# Copy database_id to wrangler.toml
```

#### Step 2.2: Initialize Schema
```bash
npm run cloudflare:init-schema
```

#### Step 2.3: Export & Import Data
```bash
# Set Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL="your_url"
export SUPABASE_SERVICE_ROLE_KEY="your_key"

# Generate migration SQL
npm run cloudflare:migrate-db

# Execute migration
npx wrangler d1 execute pashto-bible-db --file=cloudflare/d1-migration-data.sql
```

#### Step 2.4: Verify Data
```bash
# Check verse counts
npx wrangler d1 execute pashto-bible-db --command="SELECT COUNT(*) FROM verses;"
npx wrangler d1 execute pashto-bible-db --command="SELECT COUNT(*) FROM verses_yousafzai;"
```

**Success Criteria**:
- ✅ All verses migrated
- ✅ Metadata preserved
- ✅ Indexes created
- ✅ Data queries work

---

### Phase 3: Audio Migration (R2)

**Estimated Time**: 10-14 hours

#### Step 3.1: Setup R2 Credentials
```bash
# Get from Cloudflare Dashboard → R2 → Manage R2 API Tokens
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
```

#### Step 3.2: Migrate Afghan 2023 Audio (Supabase → R2)

**Files**: ~11,433 (7,233 NT + 4,200 OT)

```bash
# Current script handles Supabase Storage
npm run cloudflare:migrate-audio
```

**Process**:
1. List all files from Supabase Storage bucket `audio`
2. Download each file
3. Upload to R2 with key: `afghan2023/{testament}/{filename}.mp3`
4. Track progress and errors

**Expected Output**:
```
✅ Afghan 2023 NT: 7,233 files migrated
✅ Afghan 2023 OT: 4,200 files migrated
⏳ Afghan 2023 OT: 19,960 files missing (source doesn't have them)
```

#### Step 3.3: Migrate Yousafzai Audio (Google Drive → R2)

**Files**: 43,193 (7,233 NT + ~24,160 OT)

**Action Required**: Update migration script to handle Google Drive

```bash
# After script update
npm run cloudflare:migrate-audio -- --source=google-drive
```

**Process**:
1. Authenticate with Google Drive API
2. List all files from Yousafzai folder
3. Download each file
4. Upload to R2 with key: `yousafzai/{testament}/{filename}.mp3`
5. Track progress (batch processing recommended)

**Expected Output**:
```
✅ Yousafzai NT: 7,233 files migrated
✅ Yousafzai OT: 24,160 files migrated
```

#### Step 3.4: Verify R2 Uploads

```bash
# List R2 bucket contents
npx wrangler r2 bucket list pashto-bible-audio
```

**Success Criteria**:
- ✅ ~43,866 files in R2
- ✅ Proper folder structure
- ✅ Files accessible via public URLs or Worker API

---

### Phase 4: Update Database References

**Estimated Time**: 1-2 hours

#### Step 4.1: Update D1 with R2 Keys

Create SQL update script based on R2 uploads:

```sql
-- Update Afghan 2023 verses with R2 keys
UPDATE verses
SET audio_r2_key = 'afghan2023/nt/' || audio_filename
WHERE testament = 'NT' AND audio_filename IS NOT NULL;

UPDATE verses
SET audio_r2_key = 'afghan2023/ot/' || audio_filename
WHERE testament = 'OT' AND audio_filename IS NOT NULL;

-- Update Yousafzai verses with R2 keys
UPDATE verses_yousafzai
SET audio_r2_key = 'yousafzai/nt/' || audio_storage_filename
WHERE testament = 'NT' AND audio_storage_filename IS NOT NULL;

UPDATE verses_yousafzai
SET audio_r2_key = 'yousafzai/ot/' || audio_storage_filename
WHERE testament = 'OT' AND audio_storage_filename IS NOT NULL;
```

Execute:
```bash
npx wrangler d1 execute pashto-bible-db --file=cloudflare/update-r2-keys.sql
```

#### Step 4.2: Generate Public URLs

Optional: If R2 bucket is public, generate public URLs:

```sql
UPDATE verses
SET audio_public_url = 'https://pub-' || '{account_id}' || '.r2.dev/' || audio_r2_key
WHERE audio_r2_key IS NOT NULL;
```

---

### Phase 5: Deploy Worker

**Estimated Time**: 30 minutes

#### Step 5.1: Update Worker Code

Ensure `cloudflare-worker.js` properly routes to worker API.

#### Step 5.2: Deploy
```bash
npm run cloudflare:deploy
```

#### Step 5.3: Test API Endpoints

```bash
# Test search
curl "https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev/api/search?q=خدا&translation=afghan2023"

# Test audio
curl "https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev/api/audio/url/afghan2023/nt/matthew1_verse_1.mp3"
```

**Success Criteria**:
- ✅ API endpoints respond correctly
- ✅ Database queries work
- ✅ Audio streaming works

---

### Phase 6: Frontend Integration (Optional)

**Estimated Time**: 2-4 hours

#### Step 6.1: Update Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://pashtobiblesearch.YOUR_SUBDOMAIN.workers.dev
```

#### Step 6.2: Update API Routes

Replace Supabase queries with Cloudflare D1 queries using `app/lib/cloudflare-d1.ts`.

#### Step 6.3: Test Frontend

- Test search functionality
- Test audio playback
- Verify all features work

---

## Migration Timeline

| Phase | Task | Estimated Time | Status |
|-------|------|----------------|--------|
| 1 | Setup & Preparation | - | ✅ Complete |
| 2 | Database Migration (D1) | 2-4 hours | ⏳ Pending |
| 3 | Audio Migration (R2) | 10-14 hours | ⏳ Pending |
| 4 | Update Database References | 1-2 hours | ⏳ Pending |
| 5 | Deploy Worker | 30 minutes | ⏳ Pending |
| 6 | Frontend Integration | 2-4 hours | ⏳ Optional |

**Total Estimated Time**: ~16-25 hours (can be parallelized)

---

## Critical Decisions

### 1. Audio File Organization

**Option A**: Folder structure (recommended)
```
pashto-bible-audio/
├── afghan2023/nt/
├── afghan2023/ot/
├── yousafzai/nt/
└── yousafzai/ot/
```

**Option B**: Flat structure
```
pashto-bible-audio/
├── matthew1_verse_1.mp3
├── yousafzai_matthew001_verse_001.mp3
└── ...
```

**Decision**: **Option A** (folder structure) for better organization.

### 2. Missing Afghan 2023 OT Audio

**Issue**: Only 4,200 of ~24,160 OT verses have audio

**Approach**:
- ✅ Migrate existing 4,200 files
- ✅ Document missing files
- ✅ Set up automated migration for new files (already exists)
- ✅ Keep monitoring system active

### 3. R2 Public Access vs Private

**Option A**: Public bucket (simpler URLs)
- Direct URLs: `https://pub-{account}.r2.dev/{key}`
- No Worker overhead for audio

**Option B**: Private bucket + Worker proxy (better control)
- Worker handles access
- Can add authentication later
- Better analytics

**Decision**: Start with **Option A** (public), can switch to Option B later.

---

## Risk Mitigation

### Risk 1: Migration Timeout
**Mitigation**: 
- Batch processing (100 files at a time)
- Resume capability
- Progress logging

### Risk 2: Data Loss
**Mitigation**:
- Keep Supabase running during migration
- Verify all files migrated before switching
- Backup before migration

### Risk 3: Audio Playback Issues
**Mitigation**:
- Test sample files before full migration
- Verify CORS headers
- Test Range requests (audio seeking)

### Risk 4: Google Drive API Limits
**Mitigation**:
- Rate limiting in script
- Batch downloads
- Exponential backoff on errors

---

## Success Metrics

### Database Migration
- ✅ 100% of verses migrated
- ✅ All metadata preserved
- ✅ Queries return correct results

### Audio Migration
- ✅ 100% of available files migrated (43,866 files)
- ✅ File sizes match
- ✅ Audio playback works
- ✅ Missing files documented

### Performance
- ✅ API response times < 200ms
- ✅ Audio streaming works smoothly
- ✅ No CORS issues

### Cost
- ✅ Monthly cost < $5
- ✅ Migration cost ~$0

---

## Next Actions

1. **Immediate**:
   - [ ] Review and approve migration plan
   - [ ] Set up Cloudflare resources (D1 + R2)
   - [ ] Get API credentials

2. **Short-term** (this week):
   - [ ] Execute database migration
   - [ ] Migrate Afghan 2023 audio
   - [ ] Update migration script for Google Drive

3. **Medium-term** (next week):
   - [ ] Migrate Yousafzai audio
   - [ ] Update database references
   - [ ] Deploy Worker
   - [ ] Test thoroughly

4. **Long-term** (ongoing):
   - [ ] Monitor for new Afghan 2023 OT audio
   - [ ] Migrate new files as they become available
   - [ ] Optimize performance
   - [ ] Consider frontend integration

---

## Support Resources

- **Migration Guide**: `cloudflare/MIGRATION_GUIDE.md`
- **Audio Plan**: `cloudflare/AUDIO_MIGRATION_PLAN.md`
- **Setup Summary**: `cloudflare/SETUP_SUMMARY.md`
- **Worker API**: `cloudflare/worker-api.ts`
- **Migration Scripts**: `cloudflare/migrate-*.ts`

---

Ready to proceed? Start with Phase 2 (Database Migration)!


