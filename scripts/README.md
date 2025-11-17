# Pashto Bible Search - Utility Scripts

This directory contains utility scripts for managing Cloudflare R2 audio files and D1 database synchronization.

## Prerequisites

- Node.js 18+ installed
- R2 credentials configured in `../.dev.vars`
- Wrangler CLI installed (`npm install -g wrangler`)
- Cloudflare account with R2 and D1 access

## Setup

```bash
cd scripts
npm install
```

This will install:
- `@aws-sdk/client-s3` - For R2 access via S3-compatible API
- `tsx` - For running TypeScript directly
- `typescript` - TypeScript compiler

## Scripts Overview

### 1. **catalog-r2-audio.ts** - R2 Audio Catalog & Coverage Report

Scans all audio files in R2 and generates a comprehensive coverage report.

**Purpose**:
- List all MP3 files in R2 bucket
- Categorize by translation (Afghan 2023 vs Yousafzai 2019)
- Categorize by testament (OT vs NT)
- Generate book-by-book statistics
- Identify invalid/malformed filenames
- Calculate total storage usage

**Usage**:
```bash
# Generate human-readable report
npm run catalog

# Generate JSON output
npm run catalog -- --json

# Save JSON to file
npm run catalog -- --json --output=coverage-report.json
```

**Output Example**:
```
═══════════════════════════════════════════════════════════
📊 R2 AUDIO CATALOG - COMPREHENSIVE COVERAGE REPORT
═══════════════════════════════════════════════════════════

Total Files:  39,234
Total Size:   6.2 GB

═══════════════════════════════════════════════════════════
🇦🇫 📖  AFGHAN 2023 - NEW TESTAMENT
═══════════════════════════════════════════════════════════

Files:   7,957
Verses:  7,957
Books:   27
Size:    1.2 GB

Books Coverage:
─────────────────────────────────────────────────────────
  Matthew              │   1071 verses │  28 chapters │ ch.1-28      │   180.5 MB
  Luke                 │   1151 verses │  24 chapters │ ch.1-24      │   195.2 MB
  John                 │    879 verses │  21 chapters │ ch.1-21      │   148.9 MB
  ...

═══════════════════════════════════════════════════════════
🇦🇫 📜  AFGHAN 2023 - OLD TESTAMENT
═══════════════════════════════════════════════════════════

Files:   842
Verses:  842
Books:   8
Size:    142.3 MB

Books Coverage:
─────────────────────────────────────────────────────────
  Psalms               │    150 verses │  50 chapters │ ch.1-150     │    25.4 MB
  Genesis              │    200 verses │  20 chapters │ ch.1-20      │    33.8 MB
  ...
```

**Requirements**:
- R2 credentials in environment variables:
  - `R2_ENDPOINT`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`

### 2. **upload-audio-to-r2.ts** - Batch Audio Upload

Upload local MP3 files to R2 with proper naming and organization.

**Purpose**:
- Batch upload audio files from local directory
- Automatic R2 key generation based on translation/testament
- Skip files that already exist (optional)
- Dry-run mode for testing
- Progress tracking and error reporting

**Usage**:
```bash
# Upload Afghan 2023 NT audio
npm run upload -- afghan2023 ~/audio-files/afghan2023/ --testament=nt

# Upload Yousafzai OT audio
npm run upload -- yousafzai2019 ~/audio-files/yousafzai/ --testament=ot

# Dry run (don't actually upload)
npm run upload -- afghan2023 ~/audio-files/ --dry-run

# Skip existing files
npm run upload -- yousafzai2019 ~/audio-files/ --skip-existing
```

**Options**:
- `--testament=<ot|nt>` - Override testament (default: auto-detect)
- `--skip-existing` - Skip files that already exist in R2
- `--dry-run` - Show what would be uploaded without uploading

**File Requirements**:
- Files must be MP3 format
- Filename format: `{bookslug}{chapter}_verse_{verse}.mp3`
- Examples:
  - `matthew1_verse_001.mp3`
  - `genesis1_verse_001.mp3`
  - `psalm23_verse_001.mp3`

**Output**:
```
🚀 Cloudflare R2 Audio Uploader
════════════════════════════════════════════════════════════
Translation:     afghan2023
Testament:       nt
Local directory: /home/user/audio/afghan2023/
R2 bucket:       pashto-bible-audio
Skip existing:   Yes
Dry run:         No
════════════════════════════════════════════════════════════

🔍 Scanning for audio files...
📁 Found 7957 MP3 files

📤 Starting upload...

[1/7957] ✅ Uploaded: matthew1_verse_001.mp3
[2/7957] ✅ Uploaded: matthew1_verse_002.mp3
[3/7957] ⏭️  Skipped (exists): matthew1_verse_003.mp3
...

════════════════════════════════════════════════════════════
📊 Upload Summary
════════════════════════════════════════════════════════════
✅ Successful:  7850
⏭️  Skipped:     107
❌ Failed:      0
════════════════════════════════════════════════════════════
```

### 3. **verify-audio-r2.ts** - Verify R2 Files & Generate D1 Updates

Verify audio files exist in R2 and generate SQL to update D1 database.

**Purpose**:
- List all audio files for a translation/testament
- Parse filenames to extract verse references
- Validate naming conventions
- Generate SQL UPDATE statements for D1
- Identify missing or malformed files

**Usage**:
```bash
# Verify Afghan 2023 NT
npm run verify -- afghan2023

# Verify Yousafzai OT and generate D1 update SQL
npm run verify -- yousafzai2019 --update-d1 --d1-db-id=pashto-bible-db

# Verify specific testament
npm run verify -- afghan2023 --testament=ot
```

**Options**:
- `--testament=<ot|nt>` - Override testament
- `--update-d1` - Generate SQL to update D1 database
- `--d1-db-id=<id>` - D1 database ID (default: pashto-bible-db)

**Output**:
```
🔍 Cloudflare R2 Audio Verifier
════════════════════════════════════════════════════════════
Translation:  afghan2023
Testament:    nt
R2 bucket:    pashto-bible-audio
Update D1:    Yes
════════════════════════════════════════════════════════════

🔍 Listing audio files in R2...
📁 Found 7957 audio files

✅ Matthew 1:1         -> afghan2023/nt/matthew1_verse_001.mp3 (185.2 KB)
✅ Matthew 1:2         -> afghan2023/nt/matthew1_verse_002.mp3 (142.8 KB)
...

════════════════════════════════════════════════════════════
📊 Verification Summary
════════════════════════════════════════════════════════════
Total files:     7957
✅ Valid files:   7957
❌ Invalid files: 0
════════════════════════════════════════════════════════════

📝 SQL to update D1 database:
════════════════════════════════════════════════════════════
-- Update audio_r2_key for afghan2023 NT verses
UPDATE verses_afghan2023
SET audio_r2_key = 'afghan2023/nt/' ||
                   lower(replace(book, ' ', '')) ||
                   chapter ||
                   '_verse_' ||
                   printf('%03d', verse) ||
                   '.mp3'
WHERE testament = 'NT' AND audio_r2_key IS NULL;

-- Verify update
SELECT book, chapter, verse, audio_r2_key
FROM verses_afghan2023
WHERE testament = 'NT' AND audio_r2_key IS NOT NULL
LIMIT 10;
════════════════════════════════════════════════════════════

To apply these changes, run:
wrangler d1 execute pashto-bible-db --command "..."

✅ Verification complete!
```

### 4. **upload-audio-to-r2.sh** - Bash Upload Script

Simple bash wrapper using Wrangler CLI for uploading files.

**Usage**:
```bash
# Make executable (first time only)
chmod +x upload-audio-to-r2.sh

# Upload files
./upload-audio-to-r2.sh afghan2023 ~/audio-files/afghan2023/
./upload-audio-to-r2.sh yousafzai2019 ~/audio-files/yousafzai/

# Override testament
TESTAMENT=ot ./upload-audio-to-r2.sh afghan2023 ~/audio-files/
```

**Features**:
- Uses Wrangler CLI (no Node.js required)
- Progress bar
- Color-coded output
- Confirmation prompt
- File count summary

## Environment Variables

All scripts require R2 credentials. These should be in `../.dev.vars`:

```bash
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
```

### Getting R2 Credentials

1. Go to Cloudflare Dashboard
2. Navigate to R2 → Overview
3. Click "Manage R2 API Tokens"
4. Create new API token with R2 read/write permissions
5. Copy the credentials to `.dev.vars`

## Common Workflows

### Workflow 1: Upload New Audio Files

```bash
# 1. Organize files locally
mkdir -p ~/audio/afghan2023/nt/
cp *.mp3 ~/audio/afghan2023/nt/

# 2. Test upload (dry run)
npm run upload -- afghan2023 ~/audio/afghan2023/nt/ --dry-run

# 3. Upload for real
npm run upload -- afghan2023 ~/audio/afghan2023/nt/

# 4. Verify upload
npm run verify -- afghan2023 --testament=nt

# 5. Update D1 database
npm run verify -- afghan2023 --testament=nt --update-d1 > update.sql
wrangler d1 execute pashto-bible-db --file=update.sql
```

### Workflow 2: Generate Coverage Report

```bash
# 1. Scan R2 and generate report
npm run catalog

# 2. Save as JSON for analysis
npm run catalog -- --json --output=coverage.json

# 3. Parse JSON in your app
cat coverage.json | jq '.translations.afghan2023.nt.bookCount'
```

### Workflow 3: Verify Database Sync

```bash
# 1. Check what's in R2
npm run verify -- yousafzai2019 --testament=ot

# 2. Generate D1 update SQL
npm run verify -- yousafzai2019 --testament=ot --update-d1

# 3. Apply to D1
wrangler d1 execute pashto-bible-db --command "UPDATE verses_yousafzai SET ..."

# 4. Verify in D1
wrangler d1 execute pashto-bible-db --command \
  "SELECT COUNT(*) FROM verses_yousafzai WHERE audio_r2_key IS NOT NULL"
```

## Troubleshooting

### "Module not found" errors

```bash
cd scripts
npm install
```

### "Missing R2 credentials" error

Ensure `../.dev.vars` contains:
```
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

### Network/DNS errors

If using the AWS SDK scripts in restricted environments, use the Wrangler-based bash script instead:
```bash
./upload-audio-to-r2.sh afghan2023 ~/audio/
```

### "CLOUDFLARE_API_TOKEN required"

For Wrangler commands, authenticate first:
```bash
wrangler login
```

Or set the token:
```bash
export CLOUDFLARE_API_TOKEN=your_api_token
```

## File Naming Conventions

All scripts expect audio files to follow this naming convention:

**Format**: `{bookslug}{chapter}_verse_{verse:03d}.mp3`

**Examples**:
- `matthew1_verse_001.mp3` → Matthew 1:1
- `john3_verse_016.mp3` → John 3:16
- `1john2_verse_015.mp3` → 1 John 2:15
- `revelation22_verse_021.mp3` → Revelation 22:21
- `genesis1_verse_001.mp3` → Genesis 1:1
- `psalm119_verse_176.mp3` → Psalm 119:176

**Book Slug Rules**:
- Lowercase
- No spaces
- Numbers preserved (e.g., "1john", "2corinthians")

**Verse Padding**:
- Always 3 digits (001, 002, 010, 100, 176)

## Script Architecture

All scripts use:
- **TypeScript** for type safety
- **AWS SDK S3 Client** for R2 access (S3-compatible)
- **tsx** for running TypeScript directly without compilation
- **Modular design** for reusability

Scripts can be imported as modules:
```typescript
import { R2AudioCatalog } from './catalog-r2-audio';
import { R2AudioUploader } from './upload-audio-to-r2';
import { R2AudioVerifier } from './verify-audio-r2';
```

## Related Documentation

- `../cloudflare/R2_AUDIO_MAPPING.md` - Technical mapping details
- `../cloudflare/R2_AUDIO_COVERAGE.md` - Current coverage report
- `../cloudflare/README.md` - Cloudflare Worker setup guide

## Contributing

When adding new scripts:
1. Follow TypeScript conventions
2. Add NPM script alias in `package.json`
3. Document in this README
4. Include usage examples
5. Handle errors gracefully
6. Provide progress feedback

---

**Last Updated**: 2025-11-17
**Maintained By**: Pashto Bible Search Development Team
