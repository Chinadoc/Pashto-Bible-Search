# Disambiguation & Representation Logic Analysis

## Current State: What We're Doing

### 1. **Word Disambiguation** (Preventing False Matches)

#### A. Post-Search Sanity Filter (`app/api/search/route.ts:803-819`)
```typescript
const shouldApplyCollapsedFilter = searchLanguage === 'pashto'
  && (!englishSearchTerms.length)
  && (!Array.isArray(variants) || variants.length === 0)
  && searchTerms.length === 1;

if (shouldApplyCollapsedFilter && results.length > 0) {
  const collapsedQuery = trimmedQuery.replace(/\s+/g, '');
  results = results.filter((verse) => {
    const collapsedText = text.replace(/\s+/g, '');
    return collapsedText.includes(collapsedQuery) || collapsedNormalized.includes(collapsedQuery);
  });
}
```

**What it does:**
- Removes whitespace from both query and verse text
- Ensures exact character sequence match
- **Prevents**: وهل (wahul) from matching دوهم (dohúm "second")
- **Limitation**: Only applies when NOT using variants/filters

#### B. Client-Side Filter Matching (`app/ClientHome.tsx:912-921`)
```typescript
const filtered = results.filter((verse) => {
  const text = verse.text ?? '';
  const collapsedText = text.replace(/\s+/g, '').toLowerCase();
  
  return forms.some(form => {
    const collapsedForm = form.toLowerCase().replace(/\s+/g, '');
    return collapsedText.includes(collapsedForm);
  });
});
```

**What it does:**
- Applies same collapsed-text logic to filtered results
- Ensures filters don't introduce false matches
- **Works**: When applying verb/noun/adjective filters

---

### 2. **Compound Verb Representation**

#### A. Helper Verb Expansion (`app/api/search/route.ts:87-132`)
```typescript
const COMPOUND_HELPERS = new Set(['وهل', 'کول', 'کېدل', 'کړل', 'اخیستل', 'ساتل']);

async function getHelperVariants(helper: string): Promise<string[]> {
  // Generates all conjugations of helper verbs
  const variants = await generateVerbVariantsUtil(helper, { cap: 60, includeCompound: true });
  return forms;
}

async function expandDictionaryEntryForms(entry: any): Promise<string[]> {
  const parts = base.split(/\s+/);
  if (parts.length > 1) {
    const helper = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ');
    const helperForms = await getHelperVariants(helper);
    
    // Creates: prefix + all helper conjugations
    for (const helperForm of helperForms) {
      addForm(`${prefix} ${helperForm}`);
    }
  }
}
```

**What it does:**
- Recognizes 6 common helper verbs
- For phrases like "تعمید کول" (baptism to-do = "to baptize"):
  - Splits into: "تعمید" (prefix) + "کول" (helper)
  - Generates: تعمید کوم، تعمید کوې، تعمید کوي، etc.
- **Used in**: English search mode only (when expanding dictionary entries)

#### B. Inflection Database Categorization (`app/utils/lingdocs_adapter.ts:188-191`)
```typescript
if (/stative/i.test(info)) flags.push('stative');
if (/dynamic/i.test(info)) flags.push('dynamic');
if (/compound|comp\./i.test(info)) flags.push('compound');
if (/irreg/i.test(info)) flags.push('irregular');
```

**What it does:**
- Reads category from inflection database rows
- Tags variants with flags: `['compound']`, `['dynamic']`, `['stative']`
- **Limitation**: Only if the database has these categories populated

---

### 3. **Pattern-Based Fallback Generation**

#### Current Implementation (`app/utils/lingdocs_adapter.ts:277-351`)
```typescript
function generatePatternBasedVerbForms(infinitive: string, enrichedInfo?: Record<string, any>): Variant[] {
  // Use enriched stems if available
  const presentStem = enrichedInfo?.psp || infinitive.replace(/ل$/, '');
  const pastStem = enrichedInfo?.tppp || infinitive;
  
  // Generate all persons/numbers for:
  // - Present tense (presentStem + م، ې، ي، و، ئ، ي)
  // - Subjunctive (و + presentStem + endings)
  // - Past tense (pastStem + م، ې، ، و، ئ، ل)
  // - Imperative (presentStem + ه، ئ)
  // - Participle (pastStem + لی)
}
```

**What it does:**
- Kicks in when database has <20 forms
- Uses enriched metadata (`psp`, `tppp`) from Supabase
- Generates ~40 forms per verb
- **Limitation**: Doesn't handle compound verbs specially

---

## Gaps & Weaknesses

### 🔴 Critical Issues

1. **Compound Verb Identification is Incomplete**
   - Current: Only recognizes multi-word phrases ending in 6 helper verbs
   - Missing: Single-word compounds (e.g., راغلل "to come" = را + غلل)
   - Missing: Stative vs. dynamic distinction in pattern generation

2. **Pattern Generator Doesn't Know About Compounds**
   - When generating forms for a compound verb, it treats it like a simple verb
   - Should prefix noun part to ALL conjugations
   - Example: "تعمید کول" → should generate "تعمید کوم" not just "کوم"

3. **Inflection Database Category Data Missing**
   - `public/inflections_cache.json` has `category: "verb"` but NOT "stative", "dynamic", "compound"
   - The flag detection code exists but has no data to work with
   - Need to populate with LingDocs linguistic categories

4. **No Compound Disambiguation in Filters**
   - If two verbs share same helper (e.g., "خوب کول" vs "لیک کول"), both use "کوم"
   - The filter would match both, which is incorrect
   - Need to check full phrase, not just helper conjugation

### 🟡 Medium Issues

5. **Verb Aspect Not Represented**
   - Pattern generator creates imperfective/perfective but doesn't label them
   - Filters have "Imperfective/Perfective" options but nothing matches them
   - Need to add aspect info to labels

6. **Stative Compounds Treated Like Dynamic**
   - Stative: "خوب کول" (to sleep) - transitive action
   - Dynamic: "تعمید کول" (to baptize) - noun + helper
   - These have different grammatical behavior but current logic treats them identically

7. **Irregular Verbs Still Use Regular Patterns**
   - لیدل (leedul) is marked as irregular/split
   - But pattern generator doesn't know which verbs are irregular
   - Should skip pattern generation for well-documented irregular verbs

---

## What We Need to Fix

### Priority 1: Populate Inflection Database with Categories

**Current State:**
```json
{
  "کول": [
    { "form": "کوم", "category": "verb" }
  ]
}
```

**Needed State:**
```json
{
  "کول": [
    { 
      "form": "کوم", 
      "category": "verb",
      "flags": ["helper", "dynamic"],
      "tense": "present",
      "person": "1st",
      "number": "singular",
      "aspect": "imperfective"
    }
  ],
  "تعمید کول": [
    {
      "form": "تعمید کوم",
      "category": "verb",
      "flags": ["compound", "dynamic"],
      "tense": "present",
      "person": "1st",
      "number": "singular",
      "aspect": "imperfective"
    }
  ]
}
```

### Priority 2: Enhance Pattern Generator for Compounds

**Add compound detection:**
```typescript
function generatePatternBasedVerbForms(infinitive: string, enrichedInfo?: Record<string, any>): Variant[] {
  // NEW: Check if this is a compound
  const parts = infinitive.split(/\s+/);
  const isCompound = parts.length > 1 && COMPOUND_HELPERS.has(parts[parts.length - 1]);
  const prefix = isCompound ? parts.slice(0, -1).join(' ') + ' ' : '';
  const baseVerb = isCompound ? parts[parts.length - 1] : infinitive;
  
  // Generate forms with prefix
  for (const { ending, label } of presentEndings) {
    variants.push({
      form: `${prefix}${presentStem}${ending}`,  // ← Add prefix here
      label,
      pos: 'verb',
      flags: isCompound ? ['generated', 'present', 'compound'] : ['generated', 'present'],
    });
  }
}
```

### Priority 3: Fix Filter Disambiguation

**Add full-phrase checking:**
```typescript
// In client-side filtering
const filtered = results.filter((verse) => {
  const text = verse.text ?? '';
  const collapsedText = text.replace(/\s+/g, '').toLowerCase();
  
  return forms.some(form => {
    const collapsedForm = form.toLowerCase().replace(/\s+/g, '');
    
    // NEW: For multi-word forms, ensure whole phrase matches
    if (form.includes(' ')) {
      // Check with and without spaces
      return collapsedText.includes(collapsedForm) || 
             text.toLowerCase().includes(form.toLowerCase());
    }
    
    return collapsedText.includes(collapsedForm);
  });
});
```

### Priority 4: Add Aspect to Labels

**Enhance label generation:**
```typescript
function labelFromInfo(info: string): string {
  const parts = info.split(/[,;\s]+/).filter(Boolean);
  
  let label = '';
  // ... existing person/tense/mood detection ...
  
  // NEW: Add aspect
  if (/imperfective|imperf/i.test(info)) label += ' Imperfective';
  if (/perfective|perf/i.test(info) && !/imperfective/i.test(info)) label += ' Perfective';
  
  return label.trim();
}
```

---

## Recommended Action Plan

1. **Immediate** (fixes current bugs):
   - ✅ Already done: Post-search sanity filter
   - ✅ Already done: Client-side collapsed matching
   - 🔄 Add compound prefix to pattern generator

2. **Short-term** (improves representation):
   - Import full inflection data with categories from LingDocs
   - Add aspect/mood/flags to all generated forms
   - Update filter matching to check full phrases for compounds

3. **Long-term** (linguistic accuracy):
   - Distinguish stative vs. dynamic compounds in generation logic
   - Add irregular verb detection to skip pattern generation
   - Create compound-specific filter UI (e.g., "Show only dynamic compounds")

---

## Current Coverage Summary

| Feature | Coverage | Quality | Notes |
|---------|----------|---------|-------|
| Simple verbs (وهل، لیدل) | ✅ Good | 🟢 High | Enriched stems + pattern fallback |
| Dynamic compounds (تعمید کول) | 🟡 Partial | 🟡 Medium | English search expands, but pattern generator doesn't |
| Stative compounds (خوب کول) | 🟡 Partial | 🟡 Medium | Same as dynamic, no distinction |
| Irregular verbs (لیدل، تلل) | ✅ Good | 🟢 High | Enriched metadata provides correct stems |
| Disambiguation | ✅ Good | 🟢 High | Collapsed-text filter prevents false matches |
| Filter accuracy | 🟡 Partial | 🟡 Medium | Works for simple verbs, issues with compounds |
| Aspect representation | 🔴 Missing | 🔴 None | No aspect info in labels or filters |
| Mood representation | 🟡 Partial | 🟡 Medium | Some mood detection, incomplete |

**Legend:**
- ✅ Feature implemented
- 🟡 Partially implemented
- 🔴 Not implemented
- 🟢 High quality
- 🟡 Medium quality
- 🔴 Low quality





















