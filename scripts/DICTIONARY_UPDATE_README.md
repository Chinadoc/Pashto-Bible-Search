# Dictionary Update Checker

This script automatically checks for updates to the LingDocs Pashto Dictionary and updates your Cloudflare D1 database accordingly.

## Features

- ✅ **Automatic version checking** - Compares stored timestamp with latest release
- ✅ **Incremental updates** - Only updates changed/new entries (not full re-import)
- ✅ **Dry run mode** - Check for updates without making changes
- ✅ **Force mode** - Force update even if version matches
- ✅ **Local backup** - Saves updated dictionary to local file

## Usage

### Manual Check (Dry Run)
```bash
npx tsx scripts/check-dictionary-updates.ts --dry-run
```

### Check and Update
```bash
npx tsx scripts/check-dictionary-updates.ts
```

### Force Update
```bash
npx tsx scripts/check-dictionary-updates.ts --force
```

## How It Works

1. **Fetches dictionary info** from `https://storage.lingdocs.com/dictionary/dictionary-info`
   - Gets the latest `release` timestamp
   - Compares with stored timestamp in D1

2. **If update needed:**
   - Downloads dictionary data from `https://storage.lingdocs.com/dictionary/dictionary.json`
   - Compares entry timestamps (`ts` field) with existing entries
   - Only updates entries that have changed or are new
   - Stores new release timestamp in `dictionary_metadata` table

3. **Efficient updates:**
   - Uses `INSERT OR REPLACE` to update changed entries
   - Processes in batches of 100 entries
   - Shows progress and statistics

## Database Schema

The script uses a `dictionary_metadata` table to track updates:

```sql
CREATE TABLE IF NOT EXISTS dictionary_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  release_timestamp INTEGER NOT NULL UNIQUE,
  entry_count INTEGER DEFAULT 0,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

## Automated Updates

### GitHub Actions (Recommended)

The workflow file `.github/workflows/check-dictionary-updates.yml` runs automatically:

- **Schedule**: Every Monday at 2 AM UTC
- **Manual**: Can be triggered manually via GitHub Actions UI

**Setup:**

1. Add secrets to GitHub repository:
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

2. The workflow will automatically:
   - Check for updates
   - Update D1 database if new version available
   - Log results

### Cron Job (Alternative)

For local/server-based updates:

```bash
# Add to crontab (crontab -e)
# Run every Monday at 2 AM UTC
0 2 * * 1 cd /path/to/pashto-bible-search && npx tsx scripts/check-dictionary-updates.ts
```

### Cloudflare Workers Cron Trigger

You can also create a Cloudflare Worker with a cron trigger:

```typescript
// wrangler.toml
[triggers]
crons = ["0 2 * * 1"] // Every Monday at 2 AM UTC

// worker.ts
export default {
  async scheduled(event, env, ctx) {
    // Import and run check-dictionary-updates.ts logic
    // Use env.DB for D1 database access
  }
}
```

## Example Output

```
🚀 Starting dictionary update check...
📡 Fetching dictionary info from LingDocs...
   ✅ Latest release: 1750188607194 (2025-01-15T10:30:07.194Z)
   📊 Entries: 18,688

📊 Current stored version: 1750100000000 (2025-01-14T10:00:00.000Z)
   Latest available: 1750188607194 (2025-01-15T10:30:07.194Z)
   ⏰ 1.0 days since last update

📥 Downloading dictionary data from LingDocs...
   ✅ Downloaded 18688 entries

🔍 Analyzing changes...
   📝 New entries: 5
   🔄 Updated entries: 12
   ✅ Unchanged entries: 18,671

📦 Updating 17 entries in D1...
   📦 Processing batch 1/1 (17 entries)...
   ✅ Batch 1 complete: 17 entries inserted

✅ Update complete! Updated 17 entries.

💾 Saving local copy...
   ✅ Saved to app/data/full_dictionary_enriched.json

🎉 Dictionary update complete!
```

## Notes

- The script respects the LingDocs dictionary license (CC BY-NC-SA 4.0)
- Updates are incremental - only changed entries are modified
- The `ts` (timestamp) field in each entry is used to detect changes
- Local file is updated as a backup (optional)

## Troubleshooting

**Error: "D1 database not available"**
- Ensure you're running with `wrangler` or have DB binding configured
- Check that `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` is set correctly

**Error: "Could not fetch dictionary info"**
- Check internet connection
- Verify LingDocs endpoints are accessible
- Check if LingDocs API has changed

**No updates detected but dictionary changed**
- Use `--force` flag to force update
- Check that `dictionary_metadata` table exists
- Verify timestamps are being stored correctly



