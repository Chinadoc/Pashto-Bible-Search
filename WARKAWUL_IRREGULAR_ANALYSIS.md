# ورکول (warkawúl) - Irregular Verb Analysis

## Why ورکول is Considered Irregular

Based on the LingDocs dictionary entry (image provided), `ورکول` has distinct stems that don't follow a simple compositional pattern:

### Compositional Analysis

**ورکول** = `ور` (directional pronoun for 3rd person) + `کول` (irregular base verb)

If it were **compositionally derived** from `کول`:
- Imperfective stem: `ور` + `کو` = `ورکو` ✅ (matches)
- Perfective stem: `ور` + `وکړ` = `وروکړ` ❌ (does NOT match - image shows `ورکر`)

### Actual Forms (from LingDocs Dictionary)

From the dictionary entry image:
- **Imperfective Stem**: `ورکو` (wărkaw-)
- **Perfective Stem**: `ورکر` (wărkR-) ← **NOT** `وروکړ` or `ورکړ`
- **Perfective Root**: `ورکړل` (wărkRul)
- **Past Participle**: `ورکړی` (wărkúRay)

### Why This Makes It Irregular

1. **Non-compositional perfective stem**: The perfective stem is `ورکر`, not the expected `وروکړ` if it were simply `ور` + `وکړ`.

2. **Specific conjugation pattern**: `ورکول` has its own conjugation pattern that doesn't follow the simple prefix + base verb rule.

3. **Directional pronoun compounds**: Prefix compounds with directional pronouns (`را`, `در`, `ور`) + `کول` appear to each have their own specific forms:
   - `راکول` - "to give to me/us"
   - `درکول` - "to give to you"  
   - `ورکول` - "to give to him/her/it/them"

## Correction Made

I initially had the perfective stem as `ورکړ`, but based on the LingDocs dictionary entry, it should be `ورکر`.

**Updated in `irregular_verbs.json`:**
```json
"ورکول": {
  "stems": {
    "imperfective": "ورکو",
    "perfective": "ورکر"  // Corrected from "ورکړ"
  },
  "roots": {
    "imperfective": "ورکول",
    "perfective": "ورکړل"
  },
  "past_participle": "ورکړی"
}
```

## Need to Verify Against LingDocs Code

To confirm how LingDocs actually handles this, we should check:
1. The `pashto-inflector` repository structure
2. How irregular verbs are stored/defined
3. Whether prefix compounds are:
   - Explicitly listed as irregular verbs, OR
   - Generated compositionally with special rules

**GitHub Repository**: https://github.com/lingdocs/pashto-inflector

## References

- [LingDocs Pashto Grammar - Directional Pronouns](https://grammar.lingdocs.com/pronouns/pronouns-directional/)
- [LingDocs Pashto Dictionary - ورکول](https://dictionary.lingdocs.com/)




