# Batch Verb Form Classification - Progress Report

## Current Status

✅ Background batch job has been stopped (no more long-running processing).
✅ `verb_forms` table now covers every dictionary verb (237,042 forms), so classification happens instantly via lookups.

### Summary Metrics
- `word_frequencies` entries with `form_type`: **2,887**
- `word_frequencies` entries with `base_verb`: **2,775**
- `verb_forms` rows: **237,042** (3,710 verbs × all conjugations)

### What changed this session
1. Precomputed `verb_forms` from the full dictionary and loaded them into D1.
2. Backfilled `word_frequencies` (`base_verb`, `form_type`, `word_type`) using `verb_forms` lookups.
3. Killed the old batch script (`pkill -f batch-classify-verb-forms.py`) now that precomputation is in place.

### Monitoring / Spot Checks
```bash
python3 scripts/check-batch-progress.py          # Current coverage snapshot
```

```sql
SELECT * FROM word_frequencies 
WHERE base_verb = 'کارول' AND form_type = 'present';

SELECT * FROM verb_forms 
WHERE base_verb = 'کارول' 
ORDER BY form_type, person;
```

Future ingestion should classify new forms immediately by querying `verb_forms` + `verbs_lexicon` rather than running a slow batch processor.

