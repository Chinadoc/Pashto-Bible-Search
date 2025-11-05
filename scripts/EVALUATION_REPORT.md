# Migration Scripts Evaluation Report

## Executive Summary

**Status:** ⚠️ **NOT READY FOR PRODUCTION** - Critical issues found

The migration scripts have several critical issues that must be resolved before running in production.

## Critical Issues

### 1. Schema Mismatch (CRITICAL)

**Issue:** Migration script assumes Supabase schema, but D1 schema uses different column names.

**D1 Schema:**
- `inflections.base_form` (not `base_word`)
- `verbs_lexicon.infinitive` (not `verb_root`)

**Supabase Schema:**
- `inflections.base_word`
- `verbs_lexicon.verb_root`

**Impact:** Migration will fail or create duplicate columns.

**Fix Required:**
1. Determine which database you're targeting (D1 or Supabase)
2. Create separate migration scripts for each
3. Or unify the schemas first

**Code to add:**
```sql
-- Check which columns exist first
PRAGMA table_info(inflections);
PRAGMA table_info(verbs_lexicon);
```

### 2. Missing IF NOT EXISTS Checks (HIGH)

**Issue:** `ALTER TABLE ADD COLUMN` statements will fail if columns already exist.

**Current:**
```sql
ALTER TABLE verbs_lexicon ADD COLUMN verb_type TEXT;
```

**Problem:** SQLite doesn't support `ADD COLUMN IF NOT EXISTS` syntax.

**Fix Required:**
```sql
-- Option 1: Check before adding (safer)
-- Need to run PRAGMA table_info first

-- Option 2: Wrap in error handling
-- In application code, catch "duplicate column" errors

-- Option 3: Create new table and migrate (most reliable)
CREATE TABLE verbs_lexicon_new AS SELECT * FROM verbs_lexicon;
ALTER TABLE verbs_lexicon_new ADD COLUMN verb_type TEXT;
-- Then swap tables
```

### 3. LingDocs Library Compatibility (HIGH)

**Issue:** `@lingdocs/ps-react` may not work in server/Worker environment.

**Problems:**
- React library with potential browser dependencies
- Large bundle size (may exceed Cloudflare Worker 1MB limit)
- Not designed for server-side execution

**Fix Required:**
1. Extract non-React parts of LingDocs into server-compatible module
2. Or use LingDocs API endpoint if available
3. Or pre-generate data and load as JSON

**Alternative approach:**
```typescript
// Instead of importing @lingdocs/ps-react:
// 1. Fetch pre-generated data
const response = await fetch('https://dictionary.lingdocs.com/dictionary.json');
const { entries } = await response.json();

// 2. Or use local cached version
import dictionaryData from './lingdocs-dictionary.json';
```

### 4. D1 API vs Direct SQL (MEDIUM)

**Issue:** Scripts use direct SQL prepared statements, but D1 requires specific API.

**Current:**
```typescript
await db.prepare(`INSERT INTO ...`).bind(...).run();
```

**D1 Requirements:**
```typescript
// For D1, use:
await env.DB.prepare(`INSERT INTO ...`).bind(...).run();

// env.DB is the binding from wrangler.toml
```

**Fix Required:**
- Add proper D1 binding setup
- Test in Wrangler dev environment first
- Add error handling for D1-specific errors

### 5. Transaction Support (MEDIUM)

**Issue:** No transaction wrapping for bulk inserts.

**Current:** Individual inserts for each conjugation.

**Problem:** 
- Slow for large datasets
- No rollback if partial failure
- May exceed D1 rate limits

**Fix Required:**
```typescript
await db.batch([
  db.prepare('INSERT INTO ...').bind(...),
  db.prepare('INSERT INTO ...').bind(...),
  // ... up to 100 statements per batch
]);
```

### 6. Column Name Consistency (LOW)

**Issue:** Mixed use of `base_word` vs `base_form`.

**Found in:**
- Migration script uses `base_word`
- D1 schema has `base_form`
- Comparison script queries `base_word`

**Fix Required:** Standardize on one name.

### 7. Missing Error Handling (LOW)

**Issue:** No try-catch blocks in migration SQL.

**Problem:** Partial migration failure leaves database in inconsistent state.

**Fix Required:**
```typescript
try {
  await db.exec('BEGIN TRANSACTION');
  // ... all migrations ...
  await db.exec('COMMIT');
} catch (error) {
  await db.exec('ROLLBACK');
  console.error('Migration failed:', error);
  throw error;
}
```

## Recommendations

### Immediate Actions Required

1. **Determine target database:**
   - Are you migrating D1 or Supabase?
   - Or both? (Need separate scripts)

2. **Fix schema references:**
   - Update migration to use correct column names
   - Test on copy of production database

3. **Test environment setup:**
   - Create test D1 database
   - Run migrations in Wrangler dev mode
   - Verify data integrity

### Before Running in Production

- [ ] Backup production database
- [ ] Test migration on development copy
- [ ] Verify all columns exist after migration
- [ ] Test comparison script output
- [ ] Review sample of migrated data
- [ ] Have rollback plan ready

### Safe Migration Steps

1. **Phase 1: Schema Only (Reversible)**
   ```sql
   -- Add new columns (don't populate yet)
   ALTER TABLE verbs_lexicon ADD COLUMN verb_type TEXT;
   -- ... other columns
   
   -- Create new tables
   CREATE TABLE IF NOT EXISTS verb_metadata (...);
   ```

2. **Phase 2: Data Validation**
   ```typescript
   // Run comparison script
   // Check for issues before populating
   ```

3. **Phase 3: Data Population (Batch)**
   ```typescript
   // Populate new columns in batches
   // Use transactions
   // Monitor for errors
   ```

4. **Phase 4: Verification**
   ```sql
   -- Count records
   SELECT COUNT(*) FROM verb_metadata;
   
   -- Check for nulls
   SELECT COUNT(*) FROM verbs_lexicon WHERE verb_type IS NULL;
   ```

## Proposed Fixed Migration Script

See `scripts/migrate_to_lingdocs_format_SAFE.sql` for a safer version that:
- Checks for existing columns
- Uses transactions
- Handles both D1 and Supabase schemas
- Includes rollback capability

## Next Steps

1. **Answer these questions:**
   - Which database are you targeting? (D1, Supabase, or both?)
   - Do you have a test/staging database?
   - What's your rollback strategy if migration fails?
   - Do you need to maintain backward compatibility?

2. **Create safe migration:**
   - I can create a safer version based on your answers
   - Include proper checks and error handling
   - Add data validation steps

3. **Test migration:**
   - Run on test database first
   - Verify data integrity
   - Measure performance
   - Document any issues

## Estimated Impact

**Without fixes:**
- Migration will likely fail
- May leave database in inconsistent state
- Processing scripts won't run in D1 environment

**With fixes:**
- Safe, incremental migration
- Data validation before commitment
- Rollback capability
- Production-ready

**Time estimate:**
- Fixes: 2-4 hours
- Testing: 2-3 hours
- Production migration: 30 minutes - 2 hours (depending on data size)

## Conclusion

**Do NOT run these scripts in production yet.** They need critical fixes first.

Would you like me to create the fixed versions? Please answer the questions in "Next Steps" section first.

