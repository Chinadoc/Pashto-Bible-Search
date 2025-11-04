# Irregular Verbs Analysis - LingDocs Verification

## Summary

This document summarizes the analysis of irregular verbs in Pashto, verifying against LingDocs' official implementation and identifying any missing irregular verbs.

## Why `ورکول` (warkawul) is Irregular

`ورکول` is explicitly defined as an irregular verb in LingDocs' `irregular-conjugations.ts` file. Here's why:

### Compositional vs. Actual Forms

If `ورکول` were compositionally derived from `ور` + `کول`:

1. **Imperfective stem**: `ور` + `کو` = `ورکو` ✓ (matches)
2. **Perfective stem**: `ور` + `وکړ` = `وروکړ` ✗ (doesn't match actual form)

### Actual Forms (from LingDocs)

- **Imperfective stem**: `ورکو` (wărkaw)
- **Perfective stem**: `ورکړ` (wărkR) — **NOT** `وروکړ`
- **Perfective root**: `ورکړل` (wărkRul) — **NOT** `وروکړل`
- **Past participle**: `ورکړی` (wărkúRay)

### Conclusion

`ورکول` is irregular because its perfective stem (`ورکړ`) does not follow the compositional pattern. The directional pronoun `ور` modifies the base verb `کول` in a non-compositional way, resulting in a unique perfective form.

## Missing Irregular Verb: `درکول` (darkawul)

During the analysis, we discovered that `درکول` is also explicitly marked as irregular in LingDocs (`v. trans. irreg.`) but was missing from our `irregular_verbs.json`.

### `درکول` Forms

- **Imperfective stem**: `درکو` (dărkaw)
- **Perfective stem**: `درکړ` (dărkR)
- **Perfective root**: `درکړل` (dărkRul)
- **Past participle**: `درکړی` (dărkúRay)

Like `ورکول`, `درکول` is irregular because its perfective stem does not follow a simple compositional pattern.

## Fix Applied: `راکول` Perfective Root

The `راکول` entry in `irregular_verbs.json` had an incorrect perfective root:
- **Before**: `وراکول` (incorrect)
- **After**: `راکړل` (correct, per LingDocs)

## LingDocs Irregular Verbs List

Based on the `checkForIrregularConjugation` function in LingDocs' `irregular-conjugations.ts`, the following verbs are explicitly handled as irregular:

1. `تلل` (tlul) - motion verb with suppletive perfective
2. `ورکول` (warkawul) - directional verb with non-compositional perfective
3. `کول` (kawul) - auxiliary verb (dynamic/stative distinction)
4. `کېدل` (kedul) - auxiliary verb (dynamic/stative distinction)
5. `درکول` (darkawul) - directional verb with non-compositional perfective
6. `راکول` (raakawul) - directional verb with non-compositional perfective

## Updated `irregular_verbs.json`

The following changes were made:

1. ✅ Added `درکول` entry
2. ✅ Fixed `راکول` perfective root from `وراکول` to `راکړل`
3. ✅ Verified `ورکول` entries are correct

## Verification Method

The analysis was performed by:
1. Examining LingDocs' `pashto-inflector` repository (`irregular-conjugations.ts`)
2. Checking the `checkForIrregularConjugation` function for explicitly handled irregular verbs
3. Comparing LingDocs' conjugation tables with our `irregular_verbs.json`
4. Verifying stem and root definitions match LingDocs' authoritative source

## References

- LingDocs Pashto Inflector: https://github.com/lingdocs/pashto-inflector
- Irregular Conjugations File: `pashto-inflector/src/lib/src/irregular-conjugations.ts`
- Line 11229: `warkawul` definition
- Line 13615: `raakawul` definition
- Line 16000: `darkawul` definition
- Line 18386: `checkForIrregularConjugation` function

