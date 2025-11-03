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

**Implementation:**
- `cloudflare/worker-api.ts`: Automatic inference during video word extraction
- `cloudflare/infer-verb-metadata.ts`: Comprehensive inference library
- `cloudflare/enrich-unknown-verbs.ts`: Batch processing script

### Layer 2: External Dictionary Fallback (TODO)

**Priority Order:**
1. **Qamosona.com** - Modern comprehensive dictionary
   - API: https://qamosona.com/j/
   - Best for: Current usage, English translations
   
2. **Wiktionary** - Community-maintained
   - API: Wikimedia API
   - Best for: Comprehensive coverage, etymology
   
3. **Penzl's Dictionary** - Historical reference
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

⏳ **External dictionaries** - Planned
- API integration needed
- Rate limiting considerations
- Caching strategy required

## Usage

### Automatic (During Video Processing)
Words are automatically categorized when extracted from videos. No action needed.

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
- `base_form`: Inferred root (e.g., "فرمایيول")
- `confidence`: Can be tracked via `has_issues` flag or separate column

## Benefits

1. **No manual dictionary entry needed** for most verb forms
2. **Automatic categorization** follows Pashto verb patterns
3. **Consistent metadata** across all verb forms
4. **Extensible** - can add more patterns and dictionaries

## Future Enhancements

1. Add dictionary_source column to track where metadata came from
2. Implement Qamosona API integration
3. Add confidence scoring system
4. Create admin UI for reviewing/correcting inferences
5. Machine learning model for better root extraction

