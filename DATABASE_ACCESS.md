# Cloudflare D1 Database Access Guide

## Database Information
- **Name**: `pashto-bible-db`
- **UUID**: `54a972b6-897a-4ae0-ba19-ecf4a6edc3b0`
- **Size**: ~24.5 MB
- **Location**: Cloudflare D1 (remote)

## Access Methods

### 1. Cloudflare Dashboard (Web UI)

**Direct URL:**
```
https://dash.cloudflare.com/3ac1a6fafce90adf6b1c8f1280dfc94d/d1/databases/54a972b6-897a-4ae0-ba19-ecf4a6edc3b0
```

**Steps:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account: `Jeremy.samuels17@gmail.com`
3. Navigate to: **Storage & databases** → **D1 SQL database**
4. Click on **pashto-bible-db**
5. You can:
   - View tables
   - Run SQL queries
   - Export data
   - View database metrics

### 2. Command Line (Wrangler CLI)

**List databases:**
```bash
npx wrangler d1 list
```

**View tables:**
```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**Query data:**
```bash
# Get row counts
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM verses;"

# View sample verses
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, text FROM verses LIMIT 10;" --json
```

**View database schema:**
```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT sql FROM sqlite_master WHERE type='table';"
```

### 3. View Database Script

Run the built-in viewer:
```bash
npx tsx cloudflare/view-database.ts
```

This will show:
- All tables
- Row counts for each table
- Sample data from key tables

### 4. Query Specific Tables

**View verses:**
```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total, COUNT(DISTINCT translation_key) as translations, COUNT(DISTINCT testament) as testaments FROM verses;"
```

**View word frequencies:**
```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM word_frequencies_enhanced;"
```

**View tables with issues:**
```bash
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM word_frequencies_enhanced WHERE has_issues = 1;"
```

## Quick Access Commands

```bash
# Full database summary
npx tsx cloudflare/view-database.ts

# Check verses count
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM verses;"

# Check word frequencies
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) FROM word_frequencies_enhanced;"

# List all tables
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

