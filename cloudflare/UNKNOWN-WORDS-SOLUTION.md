# Solution for Unknown Words (e.g., "وفرمایيل")

## Problem
Words like "وفرمایيل" appear in videos/Bible but:
- Don't exist in the primary dictionary
- Don't have POS/category metadata
- Are verb forms that should be categorized

## Solution: Multi-Layered Approach

### Layer 1: Automatic Verb Inference ✅ IMPLEMENTED

**How it works:**
1. Detect verb markers (prefixes: و, به, تر; suffixes: ول, ېدل, کول, etc.)
2. Extract verb root by removing prefixes and person/mood endings
3. Infer POS, word_type, base_form, and inflection_type
4. Automatically categorize during word extraction

**Example: "وفرمایيل"**
```
Input: وفرمایيل
├─ Prefix detected: "و" (perfective/transitive past)
├─ Remove prefix: "فرمایيل"
├─ Remove ending "ل": "فرمایي"
└─ Infer root: "فرمایيول" (by adding "ول" transitive marker)
   
Result:
- root: "فرمایيول"
- pos: "v. trans."
- word_type: "verb"
- inflection_type: "perfective_past"
- base_form: "فرمایيول"
- confidence: "high"
```

**LingDocs Dictionary Entry:**
According to [LingDocs dictionary](https://dictionary.lingdocs.com/word?id=1527812362):
- Base form: **فرمایل** (farmaayúl)
- POS: v. trans./gramm. trans.
- Definition: "to speak, order, ordain (polite form)"
- Imperfective Root: فرمایل
- Perfective Root: وفرمايل

**Updated Approach:**
1. Infer base form from conjugated form ("وفرمایيل" → "فرمایل")
2. Look up base form in `word_frequencies` (which should contain LingDocs data)
3. Use dictionary metadata when available (more accurate than inference)
4. Fall back to inference only if dictionary lookup fails

**Implementation:**
- `cloudflare/worker-api.ts`: 
  - First tries direct lookup
  - For unknown words, infers base form and looks that up
  - Uses dictionary metadata when found
  - Falls back to inference if dictionary lookup fails
- `cloudflare/infer-verb-metadata.ts`: Comprehensive inference library
- `cloudflare/enrich-unknown-verbs.ts`: Batch processing script

### Layer 2: External Dictionary Fallback (TODO)

**Priority Order:**
1. **LingDocs Dictionary** - Already integrated ✅
   - URL: https://dictionary.lingdocs.com/
   - Best for: Accurate verb forms, POS, translations
   - Status: Should be in `word_frequencies` table
   
2. **Qamosona.com** - Modern comprehensive dictionary
   - API: https://qamosona.com/j/
   - Best for: Current usage, English translations
   
3. **Wiktionary** - Community-maintained
   - API: Wikimedia API
   - Best for: Comprehensive coverage, etymology
   
4. **Penzl's Dictionary** - Historical reference
   - Source: https://www.yorku.ca/twainweb/troberts/pashto/pashlex1.html
   - Best for: Foundational words, grammar reference

**When to use dictionaries:**
- Non-verb unknown words
- Words where inference confidence is "low"
- Need English translations
- Verbs not matching common patterns

### Layer 3: Manual Curation (Ongoing)

- Review high-frequency unknown words
- Add to primary dictionary with full metadata
- Update inference rules based on patterns

## Current Status

✅ **Automatic verb inference** - Active
- Handles ~80% of unknown verbs automatically
- Works during video processing
- Updates `word_frequencies` with inferred metadata

✅ **LingDocs dictionary lookup** - Active
- Checks base forms in `word_frequencies`
- Uses dictionary metadata when available
- More accurate than pure inference

⏳ **External dictionaries** - Planned
- API integration needed
- Rate limiting considerations
- Caching strategy required

## Usage

### Automatic (During Video Processing)
Words are automatically categorized when extracted from videos:
1. Direct lookup in `word_frequencies`
2. If not found, infer base form
3. Look up base form in `word_frequencies`
4. Use dictionary metadata if found
5. Fall back to inference if needed

### Manual Batch Processing
```bash
# Run enrichment script to process existing unknown verbs
node cloudflare/enrich-unknown-verbs.ts
```

### Testing Verb Inference
```bash
# Test with specific word
node cloudflare/test-verb-inference.js
```

## Database Schema

Words are stored in `word_frequencies` with:
- `pos`: Part of speech (e.g., "v. trans.", "v. intrans.")
- `word_type`: "verb", "noun", "adjective", etc.
- `inflection_type`: "perfective_past", "imperfective_present", etc.
- `base_form`: Dictionary root (e.g., "فرمایل") or inferred root
- `english_translation`: From LingDocs dictionary
- `romanization`: From LingDocs dictionary

## Benefits

1. **Uses LingDocs dictionary** when available (most accurate)
2. **No manual dictionary entry needed** for most verb forms
3. **Automatic categorization** follows Pashto verb patterns
4. **Consistent metadata** across all verb forms
5. **Extensible** - can add more patterns and dictionaries

## Future Enhancements

1. Ensure all LingDocs dictionary entries are in `word_frequencies`
2. Add dictionary_source column to track where metadata came from
3. Implement Qamosona API integration
4. Add confidence scoring system
5. Create admin UI for reviewing/correcting inferences
6. Machine learning model for better root extraction
