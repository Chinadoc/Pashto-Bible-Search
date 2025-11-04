# Lexicon Completeness and Gender Handling Issues

## Summary of Issues

### 1. ✅ Verbs Lexicon Missing Stems
**Problem**: The `verbs_lexicon` table has empty `imperfective_stem` and `perfective_stem` columns for many verbs.

**Root Cause**: When the lexicon was populated, stems weren't generated or stored properly.

**Solution**: 
- Created `cloudflare/populate-verb-stems.ts` script to populate missing stems
- Uses `generateVerbVariants()` from LingDocs adapter to get stem information
- Filters out non-verbs (adjectives/adverbs) that shouldn't be in verbs_lexicon

**Action Required**: Run the populate script to fill in missing stems.

---

### 2. ✅ Form to Root Table Purpose
**Current State**: `form_to_root` table maps inflected forms → root words
- Used in `backend/services/search_grammar.py` for root finding
- Contains nouns, verbs, adjectives all mixed together
- No gender information stored

**Your Observation**: Many entries are just masculine or feminine nouns, but the table doesn't distinguish.

**Why This Is OK**:
- `form_to_root` is a **fast lookup table** for finding roots
- It's not meant to be a complete morphological database
- Gender information should come from `nouns_lexicon` or `verbs_lexicon` after root lookup

**Recommendation**: 
- Keep `form_to_root` as-is (it's working correctly for its purpose)
- Always follow up root lookup with lexicon queries for gender-specific inflections
- Document this clearly (see `cloudflare/CLARIFY_FORM_TO_ROOT.md`)

---

### 3. ✅ Noun vs Adjective Inflection Rules

#### Nouns (Fixed Gender)
- **Inherent Property**: Nouns are always masculine OR feminine
- **Example**: 
  - "څوکۍ" (tsokúy) = feminine → only feminine inflections
  - "آرشیف" (aarshéef) = masculine → only masculine inflections
- **Storage**: `nouns_lexicon.gender` column ('m' or 'f')
- **Inflection**: `inflect_noun()` uses gender from lexicon entry
- **Result**: Inflections don't change gender

#### Adjectives (Variable Gender)
- **Agreement Rule**: Adjectives agree with what they modify
- **Example**: "پاک" (paak) has both:
  - Masculine: پاک (paak)
  - Feminine: پاکه (páaka)
- **Compound Verbs**: "پاک کول" (paak kawul) → adjective must agree with subject/object gender
- **Storage**: Should be in separate `adjectives_lexicon` or marked in `word_frequencies`
- **Inflection**: Must generate both masculine and feminine forms

#### Current Implementation Status
✅ **Nouns**: Correctly using `nouns_lexicon.gender` for fixed-gender inflections
⚠️ **Adjectives**: Need to ensure both masculine and feminine forms are generated for compound verbs

---

## Recommendations

### Immediate Actions
1. **Populate verb stems**: Run `cloudflare/populate-verb-stems.ts` to fill missing stems
2. **Clean verbs_lexicon**: Remove non-verbs (adjectives/adverbs) that shouldn't be there
3. **Document form_to_root**: Add clear documentation about its purpose and limitations

### Future Improvements
1. **Adjective lexicon**: Create separate handling for adjectives with gender variants
2. **Compound verb gender**: Ensure adjective components in compound verbs inflect correctly
3. **Validation**: Add checks to prevent non-verbs from being added to verbs_lexicon

---

## Technical Details

### Verbs Lexicon Schema
```sql
CREATE TABLE verbs_lexicon (
  id INTEGER PRIMARY KEY,
  verb_root TEXT NOT NULL,
  imperfective_stem TEXT,  -- Currently empty!
  perfective_stem TEXT,     -- Currently empty!
  perfective_root TEXT,
  past_participle TEXT,
  pos TEXT,                -- Should filter out non-verbs
  romanization TEXT
);
```

### Nouns Lexicon Schema
```sql
CREATE TABLE nouns_lexicon (
  id INTEGER PRIMARY KEY,
  pashto_word TEXT NOT NULL,
  inflection_pattern INTEGER DEFAULT 1,
  gender TEXT NOT NULL,     -- 'm' or 'f' - FIXED for nouns
  number TEXT,              -- 'sg' or 'pl'
  romanized TEXT
);
```

### Form to Root Schema
```sql
CREATE TABLE form_to_root (
  id INTEGER PRIMARY KEY,
  word_form TEXT NOT NULL,  -- Inflected form
  root_word TEXT NOT NULL,   -- Base/root word
  frequency INTEGER DEFAULT 0
  -- No gender column - by design (fast lookup only)
);
```

---

## Understanding the Architecture

```
Search Query: "وهم" (wahum)
    ↓
form_to_root lookup → "وهل" (wahúl) [root found]
    ↓
verbs_lexicon lookup → Get stems, roots, participle
    ↓
Generate all conjugations using stems
    ↓
Search for all forms in Bible verses
```

```
Search Query: "څوکۍ" (tsokúy)
    ↓
form_to_root lookup → "څوکۍ" (tsokúy) [root = self]
    ↓
nouns_lexicon lookup → Get gender='f', inflection_pattern=3
    ↓
Generate ONLY feminine inflections (gender is fixed)
    ↓
Search for all forms in Bible verses
```

```
Search Query: "پاک کول" (paak kawul) [compound verb]
    ↓
Split: adjective "پاک" + verb "کول"
    ↓
Lookup adjective → Need BOTH masculine and feminine forms
    ↓
Lookup verb → Get verb conjugations
    ↓
Combine: Generate all combinations
    - Masculine: پاک + کول conjugations
    - Feminine: پاکه + کول conjugations
```

---

## Conclusion

The system architecture is mostly correct, but:
1. **Verb stems need to be populated** (script created)
2. **Form_to_root is fine** - it's a lookup table, not a morphological database
3. **Noun gender handling is correct** - nouns have fixed gender
4. **Adjective gender handling needs verification** - ensure both forms are generated

