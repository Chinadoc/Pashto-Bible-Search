# External Dictionary Integration Plan

## Overview
To handle words like "وفرمایيل" that don't exist in our primary dictionary, we should integrate external dictionaries as fallback sources.

## Proposed Dictionaries

### 1. Penzl's Dictionary (York University)
- **URL**: https://www.yorku.ca/twainweb/troberts/pashto/pashlex1.html
- **Format**: HTML table, can be scraped
- **Coverage**: ~1,500 words from grammar glossary
- **Use Case**: Historical reference, foundational words
- **Implementation**: Scrape HTML and parse table

### 2. Qamosona.com
- **URL**: https://qamosona.com/j/
- **Format**: Web API (likely JSON)
- **Coverage**: Comprehensive modern dictionary
- **Use Case**: Primary fallback for unknown words
- **Implementation**: API integration or web scraping

### 3. Wiktionary
- **URL**: https://en.wiktionary.org/wiki/Category:Pashto_lemmas
- **Format**: Wiki markup, can parse via API
- **Coverage**: Very comprehensive, community-maintained
- **Use Case**: Secondary fallback
- **Implementation**: Wikimedia API

## Implementation Strategy

### Phase 1: Verb Inference (Current)
- Use linguistic patterns to infer verb roots/stems
- Categorize unknown verbs automatically
- ✅ Already implemented in `infer-verb-metadata.ts`

### Phase 2: Dictionary Fallback Lookup
1. **Primary**: Try Qamosona API
2. **Secondary**: Try Wiktionary API
3. **Tertiary**: Scrape Penzl's dictionary (static)

### Phase 3: Hybrid Approach
- Use inference for high-confidence verb forms
- Use dictionaries for unknown words
- Merge results with confidence scores

## Code Structure

```
cloudflare/
  ├── infer-verb-metadata.ts      # Linguistic inference (✅ Done)
  ├── enrich-unknown-verbs.ts      # Batch enrichment script (✅ Done)
  ├── dictionary-fallback.ts       # External dictionary lookup (TODO)
  └── dictionary-scrapers/
      ├── qamosona.ts              # Qamosona API client
      ├── wiktionary.ts             # Wiktionary API client
      └── penzl.ts                  # Penzl scraper
```

## Database Schema Addition

```sql
-- Track dictionary sources for words
ALTER TABLE word_frequencies ADD COLUMN dictionary_source TEXT; -- 'primary', 'qamosona', 'wiktionary', 'penzl', 'inferred'
ALTER TABLE word_frequencies ADD COLUMN inference_confidence TEXT; -- 'high', 'medium', 'low'
```

## Recommendation

**Start with verb inference** (already done) because:
1. Most unknown words in Bible/videos are verb forms
2. Verb roots follow predictable patterns
3. Faster than API calls
4. Works offline

**Add dictionary fallbacks later** for:
1. Non-verb unknown words
2. Words where inference confidence is low
3. Getting English translations

## Example: "وفرمایيل"

**Inference Approach:**
- Prefix: "و" (perfective/transitive past)
- Stem: "فرمای"
- Root: "فرمايول" or "فرماييل"
- POS: `v. trans.`
- Category: perfective past conjugation

**Dictionary Approach:**
- Lookup "فرمايول" in Qamosona → "to do/make"
- If not found, try Wiktionary
- Store as `dictionary_source: 'qamosona'` or `'inferred'`

