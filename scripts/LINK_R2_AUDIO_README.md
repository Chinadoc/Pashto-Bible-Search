# Linking R2 Audio Files to Verses

This script automatically links audio files in Cloudflare R2 to verses in the D1 database by updating the `audio_r2_key` column.

## How It Works

1. **Lists all files** in the R2 bucket `pashto-bible-audio`
2. **Parses filenames** to extract book, chapter, verse, and translation
3. **Matches files to verses** in `verses_afghan2023` or `verses_yousafzai` tables
4. **Updates the database** with the R2 key path

## Expected R2 File Format

Files should be named: `{translation}/{testament}/{book}{chapter}_verse_{verse:03d}.mp3`

Examples:
- `afghan2023/nt/acts10_verse_001.mp3` → Acts 10:1
- `afghan2023/nt/matthew27_verse_002.mp3` → Matthew 27:2
- `yousafzai2019/ot/psalms002_verse_012.mp3` → Psalms 2:12

## Running the Script

### Option 1: Via Cloudflare Worker API (Recommended)

After deploying the updated worker, call:

```bash
curl -X POST https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/link-r2-audio
```

Or use a tool like Postman/Insomnia to make a POST request to:
```
https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/link-r2-audio
```

### Option 2: Via Wrangler CLI

```bash
cd cloudflare
wrangler dev
# Then in another terminal:
curl -X POST http://localhost:8787/api/link-r2-audio
```

## Response Format

The script returns a JSON response:

```json
{
  "success": true,
  "stats": {
    "processed": 1500,
    "updated": 1450,
    "errors": 2,
    "unmatched": [
      "afghan2023/nt/invalid_file.mp3",
      "yousafzai2019/ot/missing_verse.mp3"
    ]
  },
  "message": "Processed 1500 files, updated 1450 verses"
}
```

## Troubleshooting

### Files Not Matching

If files appear in `unmatched` array, check:

1. **Filename format** - Must match: `{translation}/{testament}/{book}{chapter}_verse_{verse}.mp3`
2. **Book name** - The script tries to normalize book names, but if your R2 files use non-standard names, you may need to update the `normalizeBookName` function
3. **Verse exists** - The verse must exist in the database table

### Book Name Normalization

The script handles common book name variations:
- `acts` → `Acts`
- `2john` → `2 John`
- `1corinthians` → `1 Corinthians`

If your files use different naming, update the `bookMap` in `normalizeBookName` function.

## Verifying Results

After running, check the database:

```sql
-- Count verses with audio linked
SELECT COUNT(*) FROM verses_afghan2023 WHERE audio_r2_key IS NOT NULL;

-- See a sample of linked verses
SELECT book, chapter, verse, audio_r2_key 
FROM verses_afghan2023 
WHERE audio_r2_key IS NOT NULL 
LIMIT 10;
```

## Notes

- The script is **idempotent** - safe to run multiple times
- It skips verses that already have the correct `audio_r2_key`
- It processes files in batches to avoid timeouts
- Progress is logged every 100 updates

