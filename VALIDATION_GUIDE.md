# D1 Table Validation Guide

## 🎯 Purpose

Before implementing fast lookups using pre-computed D1 tables (`verb_forms`, `inflections`, etc.), we **must validate** that they accurately reflect LingDocs truth.

This guide ensures we're not just **fast**, but **correctly fast**.

---

## 📊 Validation Process

### Step 1: Validate `verb_forms` Table

Run the validation script:

```bash
npx tsx scripts/validate-verb-forms-d1.ts
```

**What it does:**
1. Samples 100 verbs from the LingDocs dictionary
2. Generates conjugations using **official LingDocs library** (`conjugateVerb()`)
3. Compares with `verb_forms` table in D1
4. Reports accuracy metrics

**Expected output:**
```
📊 VALIDATION REPORT: verb_forms vs LingDocs
================================================================================

✅ Overall Accuracy: 98.7%
📝 Total Verbs Validated: 100

🎯 Match Quality:
   Perfect (100%): 87 verbs
   Good (≥95%):    11 verbs
   Poor (<80%):    2 verbs

================================================================================
✅ RECOMMENDATION: verb_forms table is ACCURATE enough for production use
   You can proceed with Phase 1 (fast verb lookup)
================================================================================
```

---

### Step 2: Review Results

The script generates `validation-report.json` with detailed results:

```json
{
  "totalVerbs": 100,
  "averageAccuracy": 98.7,
  "perfectMatches": 87,
  "goodMatches": 11,
  "poorMatches": 2,
  "details": [
    {
      "verb": "کول",
      "totalFormsInD1": 78,
      "totalFormsInLingDocs": 80,
      "exactMatches": 76,
      "missingInD1": ["وکړم", "وکړې"],
      "extraInD1": [],
      "labelMismatches": [],
      "accuracy": 95.0
    }
    // ... more verbs
  ]
}
```

**Interpretation:**
- **≥95% accuracy**: Safe to use for production ✅
- **90-95% accuracy**: Minor discrepancies, review poor matches ⚠️
- **<90% accuracy**: Re-populate from LingDocs ❌

---

### Step 3: Fix Discrepancies (If Needed)

If accuracy is <95%, identify the issue:

#### **Case 1: Missing Forms in D1**
Problem: `verb_forms` table is missing some conjugations

**Solution**: Re-run population script
```bash
npx tsx scripts/populate-verb-forms-from-lingdocs.ts
```

#### **Case 2: Label Mismatches**
Problem: Forms exist but labels differ (e.g., "1sg Present" vs "Present 1sg")

**Solution**: This is usually OK! Labels are for display only. The **form itself** is what matters for search.

#### **Case 3: Extra Forms in D1**
Problem: D1 has forms that LingDocs doesn't generate

**Solution**: Check if these are:
- **Irregular conjugations** (manually added) - OK ✅
- **Compound verbs** (e.g., "کار کول") - OK ✅
- **Errors** - Remove from D1 ❌

---

## 🚀 Proceeding with Phase 1

### **Only proceed if validation shows ≥95% accuracy!**

Once validated, implement fast lookup:

```typescript
// OLD (slow - computes every time)
const variants = await generateVerbVariants(word, { cap: 60 });

// NEW (fast - direct DB lookup)
const conjugations = await queryD1(db, `
  SELECT form, form_type, tense, person, number
  FROM verb_forms
  WHERE base_verb = ?
  LIMIT 100
`, [word]);

// ✅ VALIDATED: These forms match LingDocs truth!
```

---

## 🔍 Continuous Validation

### **Re-run validation when:**
1. LingDocs library is updated
2. Dictionary data changes
3. `verb_forms` table is re-populated
4. Adding new verb forms manually

### **Quick validation** (sample 20 verbs):
```bash
npx tsx scripts/validate-verb-forms-d1.ts --sample 20
```

### **Full validation** (all verbs):
```bash
npx tsx scripts/validate-verb-forms-d1.ts --sample 1000
```

---

## 📚 Additional Validations

### Validate `inflections` Table (Nouns)

```bash
npx tsx scripts/validate-noun-inflections-d1.ts
```

### Validate `word_frequencies` Table

```bash
npx tsx scripts/validate-word-frequencies.ts
```

Ensures frequency counts match actual verse occurrences.

---

## 🎓 Understanding LingDocs as Source of Truth

### **Why LingDocs is authoritative:**

1. **Maintained by linguists**: [https://github.com/lingdocs/pashto-inflector](https://github.com/lingdocs/pashto-inflector)
2. **Peer-reviewed**: Dictionary entries verified at [https://dictionary.lingdocs.com](https://dictionary.lingdocs.com)
3. **Comprehensive**: Handles:
   - Regular conjugations
   - Irregular verbs (کول، کېدل، تلل، etc.)
   - Compound verbs (کار کول، ډوډۍ خوړل)
   - Noun inflections (all 6 patterns)
   - Gender/animacy rules

### **Our D1 tables should mirror LingDocs exactly**

```
LingDocs Library (Source of Truth)
        ↓
  conjugateVerb()
        ↓
Pre-compute & Store in D1
        ↓
   verb_forms table
        ↓
Fast lookup in search ✅
```

**Validation ensures this pipeline is accurate!**

---

## ✅ Checklist Before Phase 1 Implementation

- [ ] Run `npx tsx scripts/validate-verb-forms-d1.ts`
- [ ] Verify overall accuracy ≥95%
- [ ] Review any poor matches (<80%)
- [ ] Fix discrepancies if needed
- [ ] Document validation date in `validation-report.json`
- [ ] Proceed with confidence that D1 reflects LingDocs truth!

---

## 📞 Questions?

- Check LingDocs documentation: [https://grammar.lingdocs.com/](https://grammar.lingdocs.com/)
- Verify individual words: [https://dictionary.lingdocs.com/word?id={id}](https://dictionary.lingdocs.com/word?id=1527815399)
- Compare verb conjugations: [https://conjugation.lingdocs.com/](https://conjugation.lingdocs.com/)

