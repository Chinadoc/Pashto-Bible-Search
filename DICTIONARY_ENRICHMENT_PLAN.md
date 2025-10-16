# 📚 Dictionary Enrichment Plan

## 🔍 Problem Identified

The Supabase `dictionary` table has these columns but **NO DATA**:
```sql
inflection_pattern: NULL  (for ALL entries)
linguistic_category: NULL
enriched_info: {}
```

This prevents the system from knowing:
- ❌ How to inflect nouns (Plain, 1st, 2nd, Plural, Vocative, etc.)
- ❌ Which conjugation pattern verbs follow
- ❌ Gender/animacy information for proper inflection

## 🎯 Solution: Import LingDocs Data

### **Data Sources:**

1. **[LingDocs Pashto Inflector](https://github.com/lingdocs/pashto-inflector)**
   - TypeScript/React library for Pashto inflection
   - Contains inflection patterns, conjugation rules
   - GPL-3.0 License (compatible with our project)

2. **[LingDocs Dictionary](https://github.com/lingdocs/pashto-dictionary)**
   - Full dictionary with POS tags
   - Inflection metadata for nouns/verbs/adjectives
   - Includes gender, animacy, inflection patterns

3. **[LingDocs Dictionary Lambda](https://github.com/lingdocs/pashto-dictionary-lambda)**
   - AWS Lambda functions for dictionary queries
   - May contain enriched data processing logic

## 📋 Implementation Plan

### **Phase 1: Extract LingDocs Dictionary Data** ✅ READY

```bash
# Clone LingDocs dictionary repository
git clone https://github.com/lingdocs/pashto-dictionary.git /tmp/lingdocs-dict

# Look for JSON/CSV exports with inflection data
find /tmp/lingdocs-dict -name "*.json" -o -name "*.csv" -o -name "*.tsv"
```

### **Phase 2: Map Fields to Our Schema**

LingDocs fields → Our Supabase fields:
```javascript
{
  // Core fields (already populated)
  pashto: entry.p,
  romanized: entry.f,
  pos: entry.c,
  english: entry.e,
  gender: entry.g,
  
  // NEW: Enrichment fields
  inflection_pattern: derivePattern(entry),
  linguistic_category: entry.c_norm || entry.pos_family,
  enriched_info: {
    psp: entry.psp,        // Present stem (verbs)
    ssp: entry.ssp,        // Subjunctive stem (verbs)
    pprtp: entry.pprtp,    // Past participle
    infap: entry.infap,    // Inflection stem (nouns)
    infbp: entry.infbp,    // Inflection bundled (nouns)
    infaf: entry.infaf,    // Inflection romanization
    plural: entry.plural,  // Plural forms
    arabicPlural: entry.arabicPlural,
    c: entry.c,            // Original POS tag
    app: entry.app,        // Inflection details
    apf: entry.apf
  }
}
```

### **Phase 3: Inflection Pattern Detection**

Create a function to derive `inflection_pattern` from entry data:

```javascript
function deriveInflectionPattern(entry) {
  // For VERBS
  if (entry.c?.includes('v.')) {
    if (entry.psp && entry.ssp) {
      return 'regular_split_verb'; // Regular split-stem verb
    }
    if (entry.c.includes('stative')) {
      return 'stative_compound'; // کېدل compound
    }
    if (entry.c.includes('dynamic')) {
      return 'dynamic_compound'; // کول compound
    }
    return 'irregular_verb';
  }
  
  // For NOUNS
  if (entry.c?.includes('n.')) {
    if (entry.infap && entry.infbp) {
      return 'pattern_2_3'; // 1st & 2nd inflection + bundled
    }
    if (entry.infap) {
      return 'pattern_1'; // Only 1st inflection
    }
    if (entry.plural) {
      return 'has_plural'; // Explicit plural form
    }
    return 'plain_only';
  }
  
  // For ADJECTIVES
  if (entry.c?.includes('adj.')) {
    return entry.g === 'm' ? 'adj_masculine' : 'adj_feminine';
  }
  
  return 'unknown';
}
```

### **Phase 4: Create Migration Script**

`scripts/enrich_dictionary.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import lingdocsData from '/tmp/lingdocs-dict/dictionary.json';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function enrichDictionary() {
  for (const entry of lingdocsData) {
    const inflectionPattern = deriveInflectionPattern(entry);
    const enrichedInfo = extractEnrichedInfo(entry);
    
    await supabase
      .from('dictionary')
      .update({
        inflection_pattern: inflectionPattern,
        linguistic_category: entry.c_norm || entry.pos_family,
        enriched_info: enrichedInfo
      })
      .eq('pashto', entry.p)
      .eq('romanized', entry.f);
  }
}
```

### **Phase 5: Update Adapter to Use Metadata**

Modify `app/utils/lingdocs_adapter.ts`:
```typescript
export async function generateEnhancedVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  const data = await getData();
  const dictEntry = data.dictionary.find(e => e.pashto === rootOrInfinitive);
  
  // ✨ Use inflection_pattern from database!
  if (dictEntry?.inflection_pattern === 'regular_split_verb') {
    const psp = dictEntry.enriched_info?.psp;
    const ssp = dictEntry.enriched_info?.ssp;
    
    // Generate based on actual stems from database
    return generateFromStems(psp, ssp, dictEntry.enriched_info);
  }
  
  // Fallback to pattern generation
  return generatePatternBasedVerbForms(rootOrInfinitive);
}
```

## 🚀 Execution Steps

1. ✅ Clone LingDocs dictionary repo
2. ✅ Find and analyze JSON structure
3. ✅ Create field mapping script
4. ✅ Test on sample entries (وهل, تعمید, چنجڼ)
5. ✅ Run full migration to Supabase
6. ✅ Update adapter to use metadata
7. ✅ Verify on live site

## 📊 Expected Outcome

**Before:**
```
تعمید → 0 inflections (NULL pattern)
وهل → 2 forms (pattern fallback)
```

**After:**
```
تعمید → 8+ inflections (m. noun, pattern_1: plain, 1st, plural...)
وهل → 40+ conjugations (regular_split_verb: psp=وهی, ssp=وهل)
چنجڼ → 6+ inflections (adj_feminine: plain, 1st, plural...)
```

## 🔗 References

- [LingDocs Projects](https://www.lingdocs.com/projects)
- [LingDocs GitHub](https://github.com/lingdocs)
- [Pashto Inflector Repo](https://github.com/lingdocs/pashto-inflector)
- [Pashto Dictionary Repo](https://github.com/lingdocs/pashto-dictionary)





















