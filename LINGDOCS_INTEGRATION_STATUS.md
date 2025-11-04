# LingDocs Integration Status & Impact Analysis

## Current Status

### ✅ What Was Created

1. **Extraction Script**: `scripts/extract-lingdocs-irregular-conjugations.py`
   - Extracted **1,536 forms** from LingDocs irregular-conjugations.ts
   - 6 irregular verbs: کېدل (142 forms), کول (204 forms), تلل (224 forms), ورکول (322 forms), درکول (322 forms), راکول (322 forms)

2. **Integration SQL**: `cloudflare/integrate-lingdocs-irregular-conjugations.sql`
   - Updates `verbs_lexicon` with correct stems for 6 irregular verbs
   - Creates new `verb_forms` table with all 1,536 conjugation forms
   - **STATUS: Generated but NOT yet executed**

3. **Search Integration**: `app/utils/lingdocs-irregular-conjugations.ts`
   - TypeScript module ready to query `verb_forms` table
   - Updated search route to use LingDocs forms

## ❌ Conflicts

**No conflicts detected** - The integration uses:
- `INSERT OR REPLACE` for `verbs_lexicon` (safe - updates existing rows)
- `CREATE TABLE IF NOT EXISTS` for `verb_forms` (safe - doesn't overwrite)
- `INSERT OR IGNORE` for forms (safe - skips duplicates)

## Impact on Database Tables

### verbs_lexicon Table

**Current State** (from your screenshot):
- Many rows have empty `imperfective_stem` and `perfective_stem` columns
- Only 6 irregular verbs would be updated by this integration

**After Running SQL**:
- ✅ **6 verbs get filled in**: کېدل, کول, تلل, ورکول, درکول, راکول
  - کېدل: `imperfective_stem='کېږ'`, `perfective_stem='وش'`
  - کول: `imperfective_stem='کو'`, `perfective_stem='وکړ'`
  - تلل: `imperfective_stem='ځ'`, `perfective_stem='لاړ ش'`
  - ورکول: `imperfective_stem='ورکو'`, `perfective_stem='ورکړ'`
  - درکول: `imperfective_stem='درکو'`, `perfective_stem='درکړ'`
  - راکول: `imperfective_stem='راکو'`, `perfective_stem='راکړ'`

**Impact**: 
- ✅ **Improves** 6 rows (fills in missing stems)
- ⚠️ **Limited scope** - only affects irregular verbs, not regular verbs
- Regular verbs still need separate population script

### word_frequencies Table

**Current State** (from your screenshot):
- Has data with some NULL values in `romanization` and `pos` columns

**After Running SQL**:
- ❌ **NO IMPACT** - This integration does NOT touch `word_frequencies`
- The LingDocs integration is focused on verb conjugations, not word frequencies
- Word frequencies come from verse analysis, not from LingDocs

### verb_forms Table (NEW)

**After Running SQL**:
- ✅ **Creates new table** with 1,536 rows
- ✅ **Comprehensive coverage** - all morphological variants for irregular verbs
- ✅ **Fast lookup** - indexed by `verb_root` and `form`
- ✅ **Enables search** - search can now find any conjugated form

## Recommendation

### To Apply the Integration:

```bash
# 1. Run the SQL to populate verb_forms and update verbs_lexicon
wrangler d1 execute pashto-bible-db --remote --file cloudflare/integrate-lingdocs-irregular-conjugations.sql

# 2. Verify verbs_lexicon was updated
wrangler d1 execute pashto-bible-db --remote --command="SELECT verb_root, imperfective_stem, perfective_stem FROM verbs_lexicon WHERE verb_root IN ('کېدل', 'کول', 'تلل', 'ورکول', 'درکول', 'راکول')"

# 3. Verify verb_forms was created
wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verb_forms"
```

### Expected Results:

**verbs_lexicon**: 
- 6 rows updated with correct stems
- Still many empty rows for regular verbs (expected - needs separate script)

**verb_forms**:
- New table created with 1,536 rows
- Ready for search integration

**word_frequencies**:
- No changes (not affected by this integration)

**Search Functionality**:
- ✅ Can now find conjugated forms like "کېږم", "شول", "شوی" when searching for "کېدل"
- ✅ Compound verbs like "ښکېل کېدل" will generate all variants

## Summary

| Aspect | Status | Impact |
|--------|--------|--------|
| **Conflicts** | ✅ None | Safe to run |
| **verbs_lexicon** | ⚠️ Partial | 6 verbs improved, many still empty |
| **word_frequencies** | ❌ None | Not affected by this integration |
| **verb_forms** | ✅ New | 1,536 forms ready for search |
| **Search accuracy** | ✅ Improved | Can find conjugated forms |

**Bottom Line**: The integration is safe and ready to run, but it only improves the 6 irregular verbs. Regular verbs still need a separate population script. The `word_frequencies` table is not affected by this integration.
