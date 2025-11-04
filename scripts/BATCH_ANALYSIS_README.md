# Batch Inflection Reasons Analysis

This directory contains scripts for pre-computing inflection reasons for all noun/adjective forms in the Bible.

## Overview

Instead of analyzing inflection reasons on-the-fly during search queries (slow), we now pre-compute and store aggregated results in the `inflection_reasons_aggregated` table. This dramatically improves search performance.

## Schema

The aggregated table (`inflection_reasons_aggregated`) stores:
- `pashto_form`: The inflected form
- `base_word`: The base/lemma form
- `plural_count`: Number of times form appears as plural
- `sandwich_count`: Number of times form appears in adpositional phrases
- `transitive_past_count`: Number of times form is subject of transitive past tense verb
- `sandwich_types`: JSON array of sandwich patterns found (e.g., ["په...کې", "د"])
- `example_verse_refs`: JSON array of example verse references
- `inflection_type`: Type of inflection (e.g., "1st_m", "2nd", "plural_m")
- `total_analyzed`: Number of verses analyzed

## Running the Batch Analysis

### Prerequisites

1. Ensure D1 database is configured and accessible
2. Install dependencies: `npm install` or `yarn install`
3. Have `tsx` available (or use `npx tsx`)

### Basic Usage

```bash
# Analyze all noun/adjective forms (may take hours)
npx tsx scripts/batch-analyze-inflection-reasons.ts

# Test with limited forms (for testing)
npx tsx scripts/batch-analyze-inflection-reasons.ts --limit 100

# Resume from offset (if interrupted)
npx tsx scripts/batch-analyze-inflection-reasons.ts --offset 1000

# Custom batch size (default: 50)
npx tsx scripts/batch-analyze-inflection-reasons.ts --batch-size 100
```

### Options

- `--limit N`: Limit analysis to N forms (for testing)
- `--offset N`: Start from offset N (for resuming interrupted runs)
- `--batch-size N`: Process N forms in parallel (default: 50)

### Progress Tracking

The script outputs progress to `stderr`:
- Current batch number
- Forms processed
- Percentage complete
- Estimated time remaining
- Forms with inflection reasons found

### Example Output

```
🚀 Starting batch inflection reasons analysis...
   Batch size: 50

📊 Querying word_frequencies for noun/adjective forms...
   Found 32456 forms to analyze

📦 Processing batch 1/650 (50 forms)...
  ✅ Batch 1 complete: 42/50 forms have inflection reasons
   ⏱️  Batch 1 took 3.2s
   📈 Progress: 50/32456 (0.2%)
   ⏳ Estimated remaining: ~34 minutes
```

## Database Setup

Before running the batch analysis, ensure the aggregated table exists:

```bash
# Apply schema update
wrangler d1 execute DB --file=cloudflare/d1-comprehensive-schema.sql
```

Or apply just the aggregated table:

```sql
CREATE TABLE IF NOT EXISTS inflection_reasons_aggregated (
  pashto_form TEXT PRIMARY KEY,
  base_word TEXT,
  plural_count INTEGER DEFAULT 0,
  sandwich_count INTEGER DEFAULT 0,
  transitive_past_count INTEGER DEFAULT 0,
  sandwich_types TEXT,
  example_verse_refs TEXT,
  inflection_type TEXT,
  total_analyzed INTEGER DEFAULT 0,
  last_updated INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_inflection_reasons_agg_base ON inflection_reasons_aggregated (base_word);
```

## How It Works

1. **Query Forms**: Extracts all noun/adjective forms from `word_frequencies` table
2. **Batch Processing**: Processes forms in batches (default: 50 parallel)
3. **Verse Analysis**: For each form:
   - Queries up to 20 sample verses containing the form
   - Analyzes context for:
     - Plural indicators (suffixes, numerals)
     - Sandwich patterns (prepositions, circumpositions)
     - Transitive past tense verbs
4. **Aggregation**: Counts occurrences of each reason type
5. **Storage**: Stores aggregated results in `inflection_reasons_aggregated`

## Performance

- **Estimated Scale**: ~30k-50k unique inflected forms
- **Estimated Time**: 2-4 hours for full analysis
- **Storage**: ~15MB for aggregated table
- **Speed Improvement**: Search queries now take milliseconds instead of seconds

## Incremental Updates

After initial batch analysis, new forms can be analyzed incrementally:

```typescript
// Analyze a single form
const reasons = await analyzeInflectionReasons(db, form, baseWord, 20)
```

The search API automatically falls back to on-the-fly analysis for forms not in the aggregated table (rare case).

## Troubleshooting

### Error: "D1 database not available"
- Ensure you're running with `wrangler` context
- Or set `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` environment variable

### Error: "no such table: inflection_reasons_aggregated"
- Run the schema update first
- Check table name matches exactly

### Slow Performance
- Reduce `--batch-size` if database is overloaded
- Check database connection latency
- Consider running during off-peak hours

### Out of Memory
- Reduce `--batch-size` (default: 50)
- Process in smaller chunks with `--limit` and `--offset`

## Integration

The search API (`app/api/search_phrase/route.ts`) automatically uses pre-computed data:

1. Queries `inflection_reasons_aggregated` for forms
2. Falls back to on-the-fly analysis for missing forms (rare)
3. Returns inflection reasons in API response for UI highlighting

No changes needed to frontend - it automatically benefits from faster lookups!

