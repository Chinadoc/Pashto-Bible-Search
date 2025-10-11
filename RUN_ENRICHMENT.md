# 🚀 Run Dictionary Enrichment

## What This Does

Populates Supabase `dictionary` table with **inflection metadata** from `full_dictionary_enriched.json`:

- `inflection_pattern`: Pattern classification for generation
- `linguistic_category`: POS family (noun/verb/adjective)
- `enriched_info`: JSON with stems, romanizations, timestamps

## Prerequisites

1. ✅ Environment variables set:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

2. ✅ `full_dictionary_enriched.json` exists in project root

3. ✅ Supabase dictionary table has columns:
   - `inflection_pattern` (text)
   - `linguistic_category` (text)
   - `enriched_info` (jsonb)

## Run the Script

```bash
# Install ts-node if not already installed
npm install -g ts-node

# Run enrichment
npx ts-node scripts/enrich_dictionary_metadata.ts
```

## Expected Output

```
📚 Starting dictionary enrichment...
📖 Loaded 12000+ dictionary entries

🔄 Processing batch 1 (1-50/12000)...
  ✅ Enriched 100 entries so far...
  ✅ Enriched 200 entries so far...
  ...

✨ Enrichment complete!
  ✅ Enriched: 8500
  ⏭️  Skipped (no metadata): 3500
  ❌ Errors: 0
```

## Verify Enrichment

Run this SQL in Supabase:

```sql
-- Check verb metadata
SELECT pashto, inflection_pattern, enriched_info
FROM dictionary
WHERE pashto = 'وهل';

-- Should show:
-- inflection_pattern: 'simple_verb'
-- enriched_info: {"c": "v. trans.", "tppp": "واهه", ...}

-- Check noun metadata
SELECT pashto, inflection_pattern, enriched_info
FROM dictionary
WHERE pashto = 'پتون';

-- Should show:
-- inflection_pattern: 'pattern_1_inflection'
-- enriched_info: {"infap": "پتانه", "infaf": "patnaanu", ...}
```

## What Gets Enriched

### Verbs (8 metadata fields possible):
- `psp`, `psf` - Present stem + romanization
- `ssp`, `ssf` - Subjunctive stem + romanization
- `pprtp`, `pprtf` - Past participle + romanization
- `tppp`, `tppf` - Past participle (alt) + romanization

### Nouns/Adjectives (4 metadata fields possible):
- `infap`, `infaf` - 1st inflection + romanization
- `infbp`, `infbf` - 2nd/bundled inflection + romanization

### All entries:
- `c` - Original POS tag
- `c_norm` - Normalized POS
- `ts` - Timestamp

## Next Steps

After enrichment:
1. ✅ Update `lingdocs_adapter.ts` to use metadata
2. ✅ Test with تعمید, وهل, چنجڼ
3. ✅ Deploy to production


















