# Inflection Pattern Extraction

## Answer to Your Question

**No, inflection patterns are NOT explicitly stored in the dictionary entries**, but **YES, they can be inferred** using the LingDocs library.

For example, "مرسته" (mrásta) has:
- **Stored**: `p: مرسته`, `c: n. f.`, `gender: f`
- **Not stored**: inflection pattern number
- **Inferred by LingDocs**: Pattern 1 (Basic) - because it's a feminine noun ending in "ه"

## How LingDocs Determines Patterns

LingDocs uses the `getInflectionPattern()` function which checks:
1. Word endings (ه, ی, ي, ون, etc.)
2. Gender (masculine/feminine)
3. Animate/inanimate status
4. Irregular inflection fields (`infap`, `infbp`) if present

## Pattern Numbers

According to LingDocs:
- **0** = None (noInf)
- **1** = Basic (Pattern 1) - Most common, includes feminine nouns ending in "ه"
- **2** = Unstressed ی (Pattern 2)
- **3** = Stressed ی (Pattern 3)
- **4** = Pashtoon (Pattern 4)
- **5** = Squish (Pattern 5)
- **6** = Feminine Inanimate ي (Pattern 6)

## Solution: Extract and Store Patterns

I've created a script (`cloudflare/extract-inflection-patterns.ts`) that:
1. Loads dictionary entries
2. Uses LingDocs `getInflectionPattern()` to determine pattern for each noun/adjective
3. Generates SQL to update `nouns_lexicon` table with `inflection_pattern` field

### To Use:

1. **Add inflection_pattern column to D1** (already done in schema update):
```sql
ALTER TABLE nouns_lexicon ADD COLUMN inflection_pattern INTEGER DEFAULT 1;
```

2. **Run the extraction script**:
```bash
npx tsx cloudflare/extract-inflection-patterns.ts
```

3. **Execute the generated SQL**:
```bash
wrangler d1 execute pashto-bible-db --remote --file=.temp-inflection-patterns.sql
```

## Dictionary Entry Example

For "مرسته" (mrásta):
```json
{
  "ts": 1527812931,
  "p": "مرسته",
  "f": "mrásta",
  "c": "n. f.",
  "gender": "f",
  "pos_family": "noun"
}
```

**Inflection Pattern**: Pattern 1 (Basic) - inferred from:
- Ends with "ه" (feminine marker)
- Gender is "f" (feminine)
- Part of speech is "n. f." (feminine noun)

**Inflected forms** (per Pattern 1):
- Base: مرسته
- 1st Inflection: مرستې (stem + ې)
- 2nd Inflection: مرستو (stem + و)
- Plural: مرستې (same as 1st inflection)

## Integration

Once patterns are stored in D1, the `/api/related_forms` endpoint can:
1. Look up the pattern from `nouns_lexicon.inflection_pattern`
2. Use the pattern to generate correct inflections
3. Display pattern info in the UI (e.g., "Inflection pattern #1 Basic")

This ensures consistency with LingDocs and improves inflection accuracy.




