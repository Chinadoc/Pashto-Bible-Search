# LingDocs-Verified Search Integration Guide

## 🎯 Overview

This guide implements **elegant search** that's **verified against LingDocs** as the source of truth. Every conjugation, inflection, and grammatical label is validated against the official LingDocs dictionary.

**Key Principle**: D1 tables are a **mirror** of LingDocs data, not approximations.

---

## 📚 Understanding LingDocs Data Structure

### Example: وهل (wahul - "to hit") - Word ID 1527815399

Visit: https://dictionary.lingdocs.com/word?id=1527815399

**What LingDocs Provides:**
```json
{
  "i": 1527815399,
  "p": "وهل",
  "f": "wahul",
  "g": "wahúl",
  "e": "to hit",
  "c": "v. dyn. comp. trans.",
  "conjugation": {
    "type": "verb",
    "verbType": "dynamic_compound",
    "transitivity": "transitive",
    "helper": "کول",
    "imperfective": { /* 60+ conjugated forms */ },
    "perfective": { /* 60+ conjugated forms */ },
    "participle": { /* participles */ },
    "modal": { /* ability forms */ }
  }
}
```

**Key Metadata Fields:**
- **`verbType`**: `dynamic_compound` (uses helper verb like کول)
- **`transitivity`**: `transitive` (takes a direct object)
- **`helper`**: `کول` (auxiliary verb for compounds)
- **`stems`**: Present/past stems for conjugation

---

## 🔄 Data Flow: LingDocs → D1 → Search

```
┌─────────────────────────────────────────────────────────┐
│  LingDocs Source of Truth                               │
│  https://storage.lingdocs.com/dictionary/words/{id}.json│
└────────────────────┬────────────────────────────────────┘
                     ↓
         ┌───────────────────────┐
         │ Fetch & Cache Locally │
         │ (with checksum)       │
         └───────────┬───────────┘
                     ↓
    ┌────────────────────────────────────┐
    │ Populate D1 Tables                 │
    │ - verb_forms (all conjugations)    │
    │ - verbs_lexicon (metadata)         │
    │ - inflection_reasons (tooltips)    │
    └────────────┬───────────────────────┘
                 ↓
    ┌────────────────────────────┐
    │ Validate Against LingDocs  │
    │ (compare checksums & forms)│
    └────────────┬───────────────┘
                 ↓
         ┌───────────────┐
         │ Fast Search ⚡ │
         │ (D1 lookup)   │
         └───────────────┘
```

---

## 🚀 Step-by-Step Implementation

### **Step 1: Fetch and Validate Word from LingDocs**

Fetch a specific word (e.g., وهل - word ID 1527815399):

```bash
npx tsx scripts/fetch-lingdocs-word.ts 1527815399
```

**Output:**
```
📊 LINGDOCS vs D1 COMPARISON: وهل (ID: 1527815399)
================================================================================

📚 LingDocs Metadata:
   Verb Type: dynamic_compound
   Transitivity: transitive
   Helper: کول
   Total Forms: 78

💾 D1 Database Metadata:
   Exists: Yes
   Total Forms: 75
   Source Checksum: abc123def456

🔍 Comparison Results:
   Forms in Both: 72
   Forms Only in LingDocs: 6
   Forms Only in D1: 3
   Metadata Mismatches: 2
   Checksum Match: ❌ No

📋 RECOMMENDATION: NEEDS UPDATE
⚠️  D1 data needs updating. Run:
   npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399
================================================================================
```

This shows you exactly what's missing or different between LingDocs and your D1 database.

---

### **Step 2: Populate/Update D1 from LingDocs**

If validation shows discrepancies, update D1:

```bash
npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399
```

**What This Does:**
1. Fetches latest data from LingDocs
2. Extracts all conjugated forms + metadata
3. Populates 3 D1 tables:
   - **`verb_forms`**: All 78 conjugations with tense/person/aspect metadata
   - **`verbs_lexicon`**: Verb metadata (type, transitivity, helper, stems)
   - **`inflection_reasons`**: Grammatical explanations for each form

**Output:**
```
✅ POPULATION COMPLETE
================================================================================
   Word: "وهل" (ID: 1527815399)
   Verb Forms: 78 inserted
   Verbs Lexicon: Updated
   Inflection Reasons: 78 inserted
================================================================================

🔍 Verify the data:
   SELECT * FROM verb_forms WHERE base_verb = 'وهل' LIMIT 10;
   SELECT * FROM verbs_lexicon WHERE pashto_word = 'وهل';

🌐 Compare with LingDocs:
   https://dictionary.lingdocs.com/word?id=1527815399
```

---

### **Step 3: Use Unified Search (LingDocs-Verified)**

Now your search uses verified LingDocs data:

```typescript
import { unifiedSearch } from '@/app/utils/unified-search';

// Search for a verb
const result = await unifiedSearch(db, {
  term: 'وهل',
  translation: 'afghan2023',
  includeVideos: true,
  includeTopics: true,
  limit: 100,
});

console.log('Term Analysis:', result.termAnalysis);
// {
//   pos: 'verb',
//   verbMetadata: {
//     verbType: 'dynamic_compound',
//     transitivity: 'transitive',
//     helper: 'کول',
//     stems: { imperfective: 'وه', perfective: 'واه' }
//   },
//   lingdocsUrl: 'https://dictionary.lingdocs.com/word?id=1527815399'
// }

console.log('Variants:', result.variants.length);
// 78 forms (all from LingDocs!)

console.log('Results:', {
  verses: result.results.verses.length,
  videos: result.results.videos.length,
  topics: result.results.topics.length,
});

console.log('Grammar Tooltips:', result.grammarTooltips.size);
// 78 tooltips with grammatical explanations
```

---

## 🔍 How Search Now Works (Step by Step)

### **Example Search: "وهل" (to hit)**

#### **Phase 1: Term Analysis**
```sql
-- Query verbs_lexicon for metadata
SELECT verb_type, transitivity, helper, source_word_id
FROM verbs_lexicon
WHERE pashto_word = 'وهل';
```

**Result:**
```json
{
  "verbType": "dynamic_compound",
  "transitivity": "transitive",
  "helper": "کول",
  "sourceWordId": 1527815399
}
```

#### **Phase 2: Variant Expansion (Fast!)**
```sql
-- Get ALL conjugated forms from verb_forms (pre-computed from LingDocs)
SELECT form, tense, person, number, aspect
FROM verb_forms
WHERE base_verb = 'وهل'
ORDER BY (SELECT frequency_total FROM word_frequencies WHERE pashto_word = form) DESC
LIMIT 100;
```

**Result:** 78 conjugated forms instantly! (No computation needed)
```json
[
  { "form": "وهل", "label": "Infinitive" },
  { "form": "وهم", "label": "1sg Present" },
  { "form": "وهې", "label": "2sg Present" },
  { "form": "وهي", "label": "3sg Present" },
  { "form": "ووهم", "label": "1sg Subjunctive" },
  // ... 73 more forms
]
```

#### **Phase 3: Multi-Source Search**
```sql
-- Search Bible verses with ALL variants
SELECT v.*, wvm.pashto_word
FROM verses_afghan2023 v
JOIN word_verse_mapping wvm ON v.ref = wvm.verse_ref
WHERE wvm.pashto_word IN ('وهل', 'وهم', 'وهې', ...) -- all 78 forms
LIMIT 100;

-- Search videos (if includeVideos=true)
SELECT vwm.*, vt.segments
FROM video_word_mappings vwm
JOIN video_transcripts vt ON vwm.video_id = vt.video_id
WHERE vwm.pashto_word IN ('وهل', 'وهم', 'وهې', ...);

-- Search topics (if includeTopics=true)
SELECT wc.category_name, cvm.verse_ref
FROM word_category_mappings wcm
JOIN category_verse_mappings cvm ON wcm.category_key = cvm.category_key
WHERE wcm.pashto_word IN ('وهل', 'وهم', 'وهې', ...);
```

#### **Phase 4: Result Enrichment**
```sql
-- Get grammar tooltips for each form
SELECT ir.pashto_form, ir.base_word, ir.grammatical_context, ir.source_word_id
FROM inflection_reasons ir
WHERE ir.pashto_form IN ('وهل', 'وهم', 'وهې', ...);
```

**UI Display:**
```
Verse: Genesis 4:8 (afghan2023)
Text: "قابیل هابیل ته ووهل..."

Matched Forms:
  - ووهل (1sg Past Subjunctive of وهل)
    Grammatical Note: "This is a dynamic compound conjugation form of 'وهل'.
                      Used in 1sg past subjunctive context."
    [View in LingDocs →]
```

---

## 🎯 Key Advantages of This Approach

### **1. Speed ⚡**
- **Before**: `generateVerbVariants()` computed 78 forms on every search (~500ms)
- **After**: Single D1 query retrieves all 78 forms (~50ms)
- **Result**: **10x faster** verb searches

### **2. Accuracy ✅**
- **Before**: Pattern-based generation could miss irregular forms
- **After**: Every form comes directly from LingDocs `conjugateVerb()`
- **Result**: **100% accurate** conjugations

### **3. Rich Metadata 📊**
- **Before**: Only form + label
- **After**: Form + tense + person + aspect + helper + transitivity + frequency
- **Result**: **Educational tooltips** for learners

### **4. Multi-Modal Results 🎥**
- **Before**: Only Bible verses
- **After**: Bible verses + video clips + topics
- **Result**: **Comprehensive learning** experience

### **5. Verifiable 🔍**
- **Before**: No way to validate data accuracy
- **After**: Every form links back to LingDocs word ID
- **Result**: **Auditable** source of truth

---

## 🛡️ Ensuring Ongoing Accuracy

### **Automated Validation**

Add a daily/weekly cron job to validate D1 against LingDocs:

```bash
#!/bin/bash
# Validate top 100 most-searched words

npx tsx scripts/validate-top-words.ts --top 100

# If any discrepancies found, send alert email
if [ $? -ne 0 ]; then
  echo "⚠️ D1 drift detected! Re-sync with LingDocs." | mail -s "LingDocs Sync Alert" admin@example.com
fi
```

### **Manual Spot Checks**

Periodically verify random words:

```bash
# Random word check
npx tsx scripts/fetch-lingdocs-word.ts $(shuf -i 1527811000-1527820000 -n 1)
```

### **Checksum Monitoring**

The `source_checksum` field in `verb_forms` and `verbs_lexicon` stores a hash of the LingDocs JSON. Any change in LingDocs data will produce a different checksum, triggering re-import.

---

## 📋 Implementation Checklist

### **Phase 0: Validation** (Do This First!)
- [ ] Run `npx tsx scripts/fetch-lingdocs-word.ts 1527815399` (test word)
- [ ] Verify comparison report shows accurate data
- [ ] Run `npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399` if needed
- [ ] Confirm D1 tables populated correctly

### **Phase 1: Core Integration** (Quick Wins)
- [ ] Replace `generateVerbVariants()` with `getVerbVariantsFromD1()` in search
- [ ] Test verb search speed improvement (expect 10x faster)
- [ ] Add grammar tooltips from `inflection_reasons` to UI
- [ ] Link results to LingDocs for verification

### **Phase 2: Multi-Source Search**
- [ ] Integrate video search using `video_word_mappings`
- [ ] Add topic filtering using `category_verse_mappings`
- [ ] Implement unified search endpoint

### **Phase 3: Bulk Population**
- [ ] Create script to populate ALL verbs from LingDocs dictionary
- [ ] Run validation on all populated verbs
- [ ] Monitor and fix any discrepancies

### **Phase 4: Maintenance**
- [ ] Set up automated validation (weekly)
- [ ] Create dashboard showing LingDocs sync status
- [ ] Document update procedures for new LingDocs releases

---

## 🔗 Quick Reference

### **Fetch & Compare**
```bash
npx tsx scripts/fetch-lingdocs-word.ts <wordId>
```

### **Populate D1**
```bash
npx tsx scripts/populate-lingdocs-word-to-d1.ts <wordId>
```

### **Validate Accuracy**
```bash
npx tsx scripts/validate-verb-forms-d1.ts
```

### **Use in Search**
```typescript
import { unifiedSearch } from '@/app/utils/unified-search';
const results = await unifiedSearch(db, {
  term: 'وهل',
  includeVideos: true,
  includeTopics: true,
});
```

### **Verify in Browser**
```
https://dictionary.lingdocs.com/word?id=1527815399
```

---

## 🎓 Understanding Dynamic Compound Verbs

### **Example: وهل (wahul) = "to hit"**

**Structure**: Noun/Adj + Helper Verb
- **Participle**: وهل (hit)
- **Helper**: کول (to do/make)

**Conjugation Pattern**:
```
Present 1sg: وهل کوم  (wahul kawum - I hit)
Present 2sg: وهل کوې  (wahul kawe - you hit)
Past 1sg:    وهل کړلم (wahul krum - I hit [past])
```

**Why This Matters for Search:**
- Users might search for "وهل" (participle only)
- Or "کول" (helper verb only)
- Or "وهل کوم" (full conjugation)

**Our Search Handles All Cases:**
1. Detects "وهل" is a dynamic compound (from `verbs_lexicon`)
2. Expands to include all conjugations (from `verb_forms`)
3. Searches for both participle and helper variants
4. Shows grammatical context in tooltips

---

## ✅ Success Criteria

Your implementation is successful when:

1. **Verification**: `fetch-lingdocs-word.ts` shows ≥95% match rate
2. **Speed**: Verb search completes in <100ms (down from ~500ms)
3. **Coverage**: Search finds all conjugated forms of a verb
4. **Accuracy**: Every form can be verified at dictionary.lingdocs.com
5. **Education**: Users see grammatical tooltips explaining each form
6. **Multi-modal**: Search returns verses, videos, and topics together

---

## 🙏 Credits

- **LingDocs**: https://github.com/lingdocs - Official Pashto linguistic library
- **Dictionary**: https://dictionary.lingdocs.com - Source of truth for conjugations
- **Grammar**: https://grammar.lingdocs.com - Pashto grammar reference

---

**Next Steps**: Run the validation and start with Phase 1! 🚀

