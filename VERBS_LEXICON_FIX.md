# Fixing verbs_lexicon Table Issues

## Issues Identified

### 1. Missing Stems (3,616 out of 3,710 verbs)
- **Problem**: 97.5% of verbs in `verbs_lexicon` are missing `imperfective_stem` or `perfective_stem`
- **Impact**: Cannot generate proper conjugations without stems
- **Solution**: Populate from:
  1. `irregular_verbs.json` (authoritative source)
  2. Dictionary entries (if available)
  3. Pattern inference (fallback)

### 2. Adverbs in verbs_lexicon (514 entries)
- **Problem**: Adverbs like `اساساً` (id: 105) are incorrectly placed in `verbs_lexicon`
- **Examples**: 
  - `اساساً` (id: 105) - "actually, in fact" - marked as `adv.`
  - Total: 514 adverbs found
- **Why this happened**: Table was populated from dictionary which may include all word types
- **Solution**: 
  - Option 1: Create separate `adverbs_lexicon` table
  - Option 2: Remove from `verbs_lexicon` (they're already in `word_frequencies`)
  - Option 3: Add `word_type` column to distinguish verbs from adverbs

### 3. Missing Irregular Verbs in irregular_verbs.json
- **Problem**: Only `کول` was in `irregular_verbs.json`
- **Missing verbs**: `لیدل`, `بوتلل`, `تلل`, `ویل`, `خوړل`, `وړل`, `کېدل`, `راوړل`
- **Solution**: ✅ Added all 8 irregular verbs to `irregular_verbs.json`

## Irregular Verbs Added

Based on [LingDocs grammar](https://grammar.lingdocs.com/verbs/verbs-intro/) and [IRREGULAR_VERBS.md](IRREGULAR_VERBS.md):

1. **لیدل** (leedul) - "to see"
   - Imperfective stem: `وین`
   - Perfective stem: `ووین`
   - Perfective root: `ولیدل`

2. **بوتلل** (botlul) - "to take/send (by leading)"
   - Imperfective stem: `بیای`
   - Perfective stem: `بوځ`
   - Perfective root: `بوتلل`

3. **تلل** (tlul) - "to go"
   - Imperfective stem: `ځ`
   - Perfective stem: `لاړ ش` (suppletive!)
   - Perfective root: `لاړل`

4. **ویل** (wayul) - "to say"
   - Imperfective stem: `وای`
   - Perfective stem: `ووای`
   - Perfective root: `وویل`

5. **خوړل** (khoRul) - "to eat"
   - Imperfective stem: `خور`
   - Perfective stem: `وخور`
   - Perfective root: `وخوړل`

6. **وړل** (waRul) - "to carry/take"
   - Imperfective stem: `وړ`
   - Perfective stem: `ووړ`
   - Perfective root: `ووړل`

7. **کېدل** (kedul) - "to become"
   - Imperfective stem: `کېږ`
   - Perfective stem: `وش`
   - Perfective root: `وشول`

8. **راوړل** (raawaRul) - "to bring"
   - Imperfective stem: `راوړ`
   - Perfective stem: `راووړ`
   - Perfective root: `راووړل`

## How LingDocs Handles Irregular Verbs

According to the [LingDocs Pashto Inflector repository](https://github.com/lingdocs/pashto-inflector):

1. **Irregular verbs are explicitly defined** in a structured format with:
   - Imperfective and perfective stems
   - Imperfective and perfective roots
   - Past participle forms

2. **The inflector uses these definitions** to generate all conjugations:
   - Present, subjunctive, future, imperative
   - Past tenses (continuous and simple)
   - Perfect forms
   - Ability forms

3. **Compound verbs** are handled separately:
   - Stative compounds: complement + `کول`/`کېدل` (NO `و` prefix in perfective)
   - Dynamic compounds: complement + `کول`/`کېدل` (WITH `و` prefix in perfective)

## SQL Generated

The script `scripts/fix-verbs-lexicon-stems.py` generated:

- ✅ **1 irregular verb** updated (تلل)
- ✅ **475 regular verbs** updated from dictionary/inference
- ⚠️ **100 adverbs** identified (need separate handling)

## Next Steps

1. **Execute SQL**: Run `cloudflare/fix-verbs-lexicon-stems.sql`
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/fix-verbs-lexicon-stems.sql
   ```

2. **Handle Adverbs**: Decide on approach:
   - Create `adverbs_lexicon` table
   - Remove from `verbs_lexicon` (they're in `word_frequencies`)
   - Add `word_type` column for filtering

3. **Iterate**: Run script again to process remaining verbs (currently limited to 1000 for performance)

4. **Verify**: Check that irregular verbs like `لیدل`, `بوتلل` now have proper stems in `verbs_lexicon`

## References

- [LingDocs Pashto Grammar - Verbs Intro](https://grammar.lingdocs.com/verbs/verbs-intro/)
- [LingDocs Pashto Inflector](https://github.com/lingdocs/pashto-inflector)
- [IRREGULAR_VERBS.md](IRREGULAR_VERBS.md)




