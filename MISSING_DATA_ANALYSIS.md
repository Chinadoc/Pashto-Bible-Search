# Missing Data Analysis - word_frequencies

## Summary

After running `fill-missing-data.sql`, we reduced missing entries from **20,361** to **18,276** (filled ~2,085 entries).

## Why Data is Missing

### Patterns Identified

1. **Multi-word Phrases** (~10,000+ entries)
   - Examples: "چې په", "او په", "هغه به", "زۀ به", "هغوی به", "تاسو ته"
   - **Reason**: These are phrases/clauses, not dictionary entries
   - **Solution**: Mark as `pos = 'phrase'` or `pos = 'multi-word'`, don't attempt dictionary lookup

2. **Inflected Forms with Base Verb but Missing Romanization** (~3,000+ entries)
   - Examples: "کړې" (base: کړل), "خپلو" (base: خپل), "کړو" (base: کړل)
   - **Reason**: Base verb found but romanization lookup failed (may need to query verb_forms differently)
   - **Solution**: Use `base_verb` to lookup in `verbs_lexicon` or `nouns_lexicon`

3. **Past Tense Verbs with و Prefix** (~500+ entries)
   - Examples: "وفرمایيل", "وویيل", "ورکړی"
   - **Reason**: Base verb is the full form (e.g., "وفرمایيل" not "فرمایيل"), so LIKE pattern didn't match
   - **Solution**: Strip و prefix, lookup base verb, or match whole form

4. **Punctuation Artifacts** (~100+ entries)
   - Examples: `"` (empty quotes), "وویل:" (with colon)
   - **Reason**: Punctuation cleanup didn't catch all cases
   - **Solution**: Additional cleanup pass

5. **Common Pronouns/Function Words Not in Dictionary** (~2,000+ entries)
   - Examples: "چا", "کۀ", "یوه", "بنی", "کیږی"
   - **Reason**: These may be dialectal variants, inflected forms, or function words not in the dictionary
   - **Solution**: Manual mapping for high-frequency words, or mark as "function_word"

6. **Proper Nouns/Names** (~500+ entries)
   - Examples: "اِسرایيلو" (inflected Israel)
   - **Reason**: Proper nouns often have unique inflections not in dictionary
   - **Solution**: Detect proper nouns, mark appropriately

7. **Low-frequency Words** (~1,000+ entries)
   - **Reason**: These are likely rare forms, typos, or edge cases
   - **Solution**: Leave as-is or mark for manual review

## Recommendations

### Immediate Actions

1. **Fill inflected forms using base_verb**:
   ```sql
   -- This should have worked but let's verify
   UPDATE word_frequencies wf
   SET romanization = (SELECT vl.romanization FROM verbs_lexicon vl WHERE vl.verb_root = wf.base_verb LIMIT 1)
   WHERE wf.base_verb IS NOT NULL AND (wf.romanization IS NULL OR wf.romanization = '');
   ```

2. **Handle و prefix verbs**:
   ```sql
   -- Strip و and match base
   UPDATE word_frequencies
   SET romanization = (SELECT vl.romanization FROM verbs_lexicon vl WHERE vl.verb_root = SUBSTR(pashto_word, 2) LIMIT 1)
   WHERE pashto_word LIKE 'و%' AND word_type = 'verb' AND (romanization IS NULL OR romanization = '');
   ```

3. **Mark multi-word phrases**:
   ```sql
   UPDATE word_frequencies
   SET pos = 'phrase'
   WHERE pashto_word LIKE '% %' AND (pos IS NULL OR pos = '');
   ```

4. **Clean punctuation artifacts**:
   ```sql
   -- Remove trailing punctuation
   UPDATE word_frequencies
   SET pashto_word = TRIM(pashto_word, ':;.,!?')
   WHERE pashto_word LIKE '%[:;.,!?]';
   ```

### Future Enhancements

1. **Normalize diacritics** for better matching (خُدای → خدای)
2. **Detect and map common function words** (pronouns, particles)
3. **Ingest proper nouns** from Bible names/places
4. **Build phrase analyzer** to decompose multi-word entries
5. **Create fallback romanization** using phonetic rules for unmapped words

## Current Coverage

- **Total entries**: ~27,872
- **Missing romanization**: 18,276 (65.6%)
- **Missing pos**: ~17,000+ (estimated)

Most missing entries are legitimate multi-word phrases or inflected forms that need better base-form matching.

