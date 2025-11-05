# Safe Migration Guide

This guide walks you through safely migrating your database to LingDocs-compatible format.

## Pre-Migration Checklist

- [ ] Backup production database
- [ ] Create test/staging database copy
- [ ] Review current schema (run pre-flight checks)
- [ ] Understand rollback procedure
- [ ] Schedule maintenance window (if needed)

## Step 1: Pre-Flight Checks

Run these queries to understand your current schema:

```sql
-- Check inflections table structure
PRAGMA table_info(inflections);

-- Check if you have 'base_word' or 'base_form'
SELECT * FROM inflections LIMIT 1;

-- Check verbs_lexicon structure
PRAGMA table_info(verbs_lexicon);

-- Check if you have 'verb_root' or 'infinitive'
SELECT * FROM verbs_lexicon LIMIT 1;
```

**Record your findings:**
- Inflections column name: `base_word` or `base_form`? __________
- Verbs column name: `verb_root` or `infinitive`? __________
- Current inflections count: __________
- Current verbs count: __________

## Step 2: Run Safe Migration (Development First!)

```bash
# For SQLite/D1 local file
sqlite3 your_database.db < scripts/migrate_to_lingdocs_format_SAFE.sql

# For Cloudflare D1 (staging)
wrangler d1 execute YOUR_STAGING_DB --file=scripts/migrate_to_lingdocs_format_SAFE.sql
```

This creates **new tables** without modifying existing ones:
- `verb_metadata` (new)
- `verb_conjugations` (new)
- `inflections_normalized` (new, doesn't touch existing `inflections`)
- `noun_metadata` (new)
- `comparison_log` (new)

## Step 3: Verify Migration

```sql
-- Check new tables were created
SELECT name FROM sqlite_master WHERE type='table' 
  AND name IN ('verb_metadata', 'verb_conjugations', 'inflections_normalized');

-- Should return 3 rows if successful
```

## Step 4: Populate New Tables (Processing Scripts)

**IMPORTANT:** Before running processing scripts, answer these questions:

### Q1: Which database are you using?
- [ ] Cloudflare D1
- [ ] Supabase PostgreSQL
- [ ] Local SQLite
- [ ] Other: __________

### Q2: Can you run Node.js scripts?
- [ ] Yes, on local machine
- [ ] Yes, via CI/CD
- [ ] No, need Cloudflare Workers
- [ ] Other: __________

### Q3: Do you have access to LingDocs library?
- [ ] Yes, `@lingdocs/ps-react` installed
- [ ] Yes, but not installed yet
- [ ] No, need alternative approach
- [ ] Not sure

Based on your answers:

### For D1 + Node.js + LingDocs Library (Recommended)

```bash
# Install dependencies
npm install @lingdocs/ps-react

# Run processing script (local D1 file)
node scripts/populate_from_lingdocs.js --db ./path/to/your.db

# Or for Cloudflare D1 (via Wrangler)
# (Requires custom Worker script - see below)
```

### For D1 without LingDocs Library (Alternative)

```bash
# Pre-download LingDocs dictionary
curl https://dictionary.lingdocs.com/dictionary.json > lingdocs-dictionary.json

# Run alternative processing script
node scripts/populate_from_json.js --db ./path/to/your.db --dict ./lingdocs-dictionary.json
```

### For Cloudflare Workers Environment

See `scripts/worker_migration.js` for a Worker-compatible version.

## Step 5: Validate Data

After populating, run validation queries:

```sql
-- Count records in new tables
SELECT 'verb_metadata' as table_name, COUNT(*) as count FROM verb_metadata
UNION ALL
SELECT 'verb_conjugations', COUNT(*) FROM verb_conjugations
UNION ALL
SELECT 'inflections_normalized', COUNT(*) FROM inflections_normalized;

-- Check for missing verb types
SELECT COUNT(*) FROM verb_metadata WHERE verb_type IS NULL;

-- Sample verb metadata
SELECT * FROM verb_metadata WHERE verb_type = 'stative_compound' LIMIT 5;

-- Sample conjugations
SELECT * FROM verb_conjugations WHERE person = 0 AND aspect = 'imperfective' LIMIT 5;

-- Sample normalized inflections
SELECT * FROM inflections_normalized WHERE person = '1sg' LIMIT 5;
```

**Expected results:**
- verb_metadata: Should have records for major verbs
- verb_conjugations: Should have multiple forms per verb
- inflections_normalized: Should mirror existing inflections + new normalized columns

## Step 6: Run Comparison

```bash
# Run comparison script
node scripts/run_comparison.js --db ./path/to/your.db

# Review output for:
# - Exact matches (good)
# - Missing in D1 (need to add)
# - Label mismatches (need to fix)
```

**Sample expected output:**
```
📊 Comparison Summary:
  Total words compared: 100
  Exact matches: 85
  Missing in D1: 10
  Missing in LingDocs: 3
  Label mismatches: 2

⚠️  Found 12 words with mismatches
Sample mismatches:
  وهل:
    Missing in D1: وهم, وهې, وهي
    Label mismatches: ووهل (LD: Past Participle, D1: Form)
```

## Step 7: Gradual Cutover (Production)

### Option A: Keep Both Tables

Update application code to use new tables:

```typescript
// Old code
const result = await db.query('SELECT * FROM inflections WHERE base_word = ?', [word]);

// New code
const result = await db.query('SELECT * FROM inflections_normalized WHERE base_word = ?', [word]);
```

### Option B: Replace Old Tables

After verifying data integrity:

```sql
BEGIN TRANSACTION;

-- Backup old table
ALTER TABLE inflections RENAME TO inflections_backup;

-- Promote new table
ALTER TABLE inflections_normalized RENAME TO inflections;

COMMIT;
```

**Rollback if needed:**
```sql
BEGIN TRANSACTION;
ALTER TABLE inflections RENAME TO inflections_failed;
ALTER TABLE inflections_backup RENAME TO inflections;
COMMIT;
```

## Step 8: Update Application Code

Update queries to use normalized columns:

**Before:**
```typescript
// Query had to parse grammatical_info string
const verbs = await db.query(`
  SELECT * FROM inflections 
  WHERE base_word = ? 
    AND grammatical_info LIKE '%1sg%'
`, [word]);
```

**After:**
```typescript
// Direct column access (faster!)
const verbs = await db.query(`
  SELECT * FROM inflections_normalized 
  WHERE base_word = ? 
    AND person = '1sg'
`, [word]);
```

## Rollback Procedure

If migration fails or causes issues:

```sql
-- Drop new tables
DROP TABLE IF EXISTS verb_metadata;
DROP TABLE IF EXISTS verb_conjugations;
DROP TABLE IF EXISTS inflections_normalized;
DROP TABLE IF EXISTS noun_metadata;
DROP TABLE IF EXISTS comparison_log;
DROP VIEW IF EXISTS v_inflections_migration;

-- Original tables remain untouched
```

## Troubleshooting

### Issue: Migration SQL fails

**Error:** `table inflections has no column named base_word`

**Fix:** You have D1 schema (uses `base_form`). Update the view in migration:
```sql
CREATE VIEW IF NOT EXISTS v_inflections_migration AS
SELECT 
  id,
  base_form as base_word,  -- Change this line
  inflected_form,
  inflection_type as grammatical_info,  -- Map column names
  pos
FROM inflections;
```

### Issue: Processing scripts fail

**Error:** `Cannot find module '@lingdocs/ps-react'`

**Fix:** Install the library or use JSON-based alternative:
```bash
npm install @lingdocs/ps-react
# OR use alternative script that reads JSON
```

### Issue: Too many API calls

**Error:** D1 rate limit exceeded

**Fix:** Use batch inserts:
```typescript
// Instead of individual inserts:
await db.batch([
  db.prepare('INSERT ...').bind(...),
  db.prepare('INSERT ...').bind(...),
  // ... up to 100 statements
]);
```

## Performance Tips

1. **Use transactions for bulk inserts**
   ```sql
   BEGIN TRANSACTION;
   -- ... many inserts ...
   COMMIT;
   ```

2. **Batch D1 operations**
   - Max 100 statements per batch
   - Use `db.batch([...])` API

3. **Create indexes after data population**
   - Faster to insert first, then create indexes
   - But our script creates them upfront (safer)

4. **Monitor memory usage**
   - D1 has 128MB memory limit
   - Process large datasets in chunks

## Success Criteria

Migration is successful when:
- [ ] All new tables created
- [ ] Sample verb metadata populated
- [ ] Conjugations table has forms
- [ ] Comparison shows >90% match rate
- [ ] Application queries work with new tables
- [ ] Performance is acceptable
- [ ] No data loss verified

## Next Steps After Migration

1. Update application code to use normalized columns
2. Set up monitoring for new tables
3. Plan to deprecate old inflections table (after verification period)
4. Document new schema for team
5. Update API documentation if applicable

## Questions?

Before proceeding, ensure you can answer:
- Which database type are you using?
- Do you have a test environment?
- What's your rollback strategy?
- Who needs to approve this change?

