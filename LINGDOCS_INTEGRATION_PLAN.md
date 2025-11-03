# LingDocs Integration Plan: Elegant Implementation Checklist

## Overview
This document outlines the plan to integrate LingDocs' verb inflection logic into our word frequency database, filling in missing information and improving verb classification accuracy.

## Key Differences Analysis

### LingDocs Approach
1. **Verb Classification**: `getVerbInfo()` normalizes dictionary entries, checks irregulars first, then classifies verb type
2. **Data Model**: Uses `PsString` objects (Pashto + phonetic pairs) with accent metadata
3. **Irregular Handling**: Comprehensive irregular verb tables with full conjugation blocks
4. **Coverage**: Generates passive voice, ability forms, hypothetical forms, compound subtypes
5. **Stem/Root Extraction**: Sophisticated extraction from dictionary with intelligent fallbacks

### Our Current Approach
1. **Verb Classification**: Basic inference from suffix patterns
2. **Data Model**: Simple strings with optional romanization lookups
3. **Irregular Handling**: Minimal JSON-based overrides
4. **Coverage**: Limited tense/mood families, no passive voice
5. **Stem/Root Extraction**: Pattern-based inference for common suffixes

## Implementation Checklist

### Phase 1: Enhanced Verb Classification ✅ High Priority

#### 1.1 Create `get_verb_info()` function (Python equivalent)
- [ ] **Task**: Port `getVerbInfo` logic from TypeScript to Python
- [ ] **Location**: `functions/verb_inflector.py` or new `functions/verb_classifier.py`
- [ ] **Features**:
  - Check irregular verbs first (via `irregular_verbs.json`)
  - Classify verb type (simple, stative compound, dynamic compound, etc.)
  - Determine transitivity from dictionary POS tags
  - Extract stems/roots from dictionary entries (`psp`, `ssp`, `prp`, `pp`)
  - Handle complement inflection for compounds
  - Identify yul endings and idiosyncratic forms
- [ ] **Output**: `VerbInfo` dictionary with all classification metadata

#### 1.2 Enhance Dictionary Entry Extraction
- [ ] **Task**: Improve `extract_verb_data()` in `scripts/import-verb-stems-from-dictionary.py`
- [ ] **Features**:
  - Extract all verb metadata: `psp`, `ssp`, `prp`, `pp`, `tppp`, `tppf`
  - Handle compound verb detection (dynamic/stative)
  - Extract complement information for compounds
  - Detect transitivity from POS tags
  - Identify yul endings (`entry.p` ends with ی)
- [ ] **Output**: Enhanced verb lexicon with comprehensive metadata

#### 1.3 Update Database Schema
- [ ] **Task**: Add columns to `word_frequencies` for verb classification
- [ ] **SQL**: `cloudflare/enhance-verb-schema.sql`
- [ ] **Columns**:
  ```sql
  -- Verb classification
  verb_type TEXT,  -- 'simple', 'stative_compound', 'dynamic_compound', etc.
  transitivity TEXT,  -- 'transitive', 'intransitive', 'grammatically_transitive'
  yul_ending INTEGER DEFAULT 0,  -- 1 if verb ends with ی
  idiosyncratic_3sg_masc TEXT,  -- Special 3rd person masculine singular form
  
  -- Complement info (for compounds)
  complement_text TEXT,  -- The complement part of compound verbs
  aux_verb TEXT,  -- Auxiliary verb (کول, کېدل, etc.)
  
  -- Existing columns (already added):
  -- base_verb, imperfective_stem, perfective_stem, perfective_root, past_participle
  ```

### Phase 2: Comprehensive Irregular Verb Handling ✅ High Priority

#### 2.1 Expand Irregular Verb Database
- [ ] **Task**: Port LingDocs irregular verb tables to Python JSON
- [ ] **Source**: `pashto-inflector/src/lib/src/irregular-conjugations.ts`
- [ ] **Location**: `irregular_verbs.json` (expand existing)
- [ ] **Structure**:
  ```json
  {
    "verb_root": {
      "type": "irregular",
      "stems": {...},
      "roots": {...},
      "past_participle": "...",
      "full_conjugation": {...},  // Optional: full conjugation table
      "idiosyncratic_3sg_masc": {...},
      "notes": "..."
    }
  }
  ```

#### 2.2 Integrate Irregular Verb Lookup
- [ ] **Task**: Update `_lookup_verb_spec()` to check irregulars first
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Logic**:
  1. Check `irregular_verbs.json` first
  2. If found, return full irregular spec
  3. Otherwise, fall back to dictionary lookup
  4. Finally, use inference rules

### Phase 3: Enhanced Stem/Root Extraction ✅ Medium Priority

#### 3.1 Implement `getVerbRoots()` Logic
- [ ] **Task**: Port `getVerbRoots()` function from TypeScript
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Features**:
  - Extract imperfective root (usually infinitive)
  - Extract perfective root (from `prp` or infer with و- prefix)
  - Handle stative compounds (complement + auxiliary)
  - Handle split heads (perfective prefix separation)
  - Support long/short variants

#### 3.2 Implement `getVerbStems()` Logic
- [ ] **Task**: Port `getVerbStems()` function from TypeScript
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Features**:
  - Extract imperfective stem (from `psp` or infer)
  - Extract perfective stem (from `ssp` or infer)
  - Handle stative compounds (complement + auxiliary stem)
  - Handle regular intransitive verbs (ېدل → ېږ)
  - Support long/short variants

#### 3.3 Implement `getParticiple()` Logic
- [ ] **Task**: Port `getParticiple()` function from TypeScript
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Features**:
  - Extract past participle (from `pp` or infer)
  - Extract present participle (generate from stem)
  - Handle stative compounds (complement + auxiliary participle)
  - Handle shortenable endings (ښتل, ستل, وتل)
  - Apply accent rules

### Phase 4: Comprehensive Form Generation ✅ Medium Priority

#### 4.1 Add Passive Voice Forms
- [ ] **Task**: Implement `getPassiveRootsAndStems()` and passive conjugation
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Reference**: Lines 1329-1645 in `verb-info.ts`
- [ ] **Logic**:
  - Only for transitive verbs
  - Root + ی + کېدل auxiliary
  - Generate imperfective/perfective passive forms
  - Generate passive perfect forms

#### 4.2 Add Ability Forms
- [ ] **Task**: Implement `getAbilityRootsAndStems()` and ability conjugation
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Reference**: Lines 1223-1530 in `verb-info.ts`
- [ ] **Logic**:
  - Root + ی + شـ auxiliary
  - Generate present/past/subjunctive/future ability forms
  - Handle intransitive stative compounds differently

#### 4.3 Add Hypothetical Forms
- [ ] **Task**: Implement hypothetical form generation
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Reference**: Lines 436-502 in `verb-conjugation.ts`
- [ ] **Logic**:
  - Root + ای/ی tail
  - Generate short/long variants
  - Apply accent rules

#### 4.4 Expand Perfect Forms
- [ ] **Task**: Generate all 8 perfect forms (already partially done)
- [ ] **Location**: `functions/verb_inflector.py` (update existing)
- [ ] **Forms**:
  - Present perfect
  - Habitual perfect
  - Subjunctive perfect
  - Future perfect
  - Past perfect
  - "Would be" perfect
  - Past subjunctive perfect
  - "Would have been" perfect

### Phase 5: Compound Verb Handling ✅ High Priority

#### 5.1 Implement Dynamic Compound Detection
- [ ] **Task**: Port `getDynamicCompoundInfo()` logic
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Reference**: Lines 278-409 in `verb-info.ts`
- [ ] **Features**:
  - Detect dynamic compound verbs (complement + auxiliary)
  - Extract complement and auxiliary verb
  - Generate stems/roots for compound
  - Handle complement inflection based on object

#### 5.2 Implement Stative Compound Detection
- [ ] **Task**: Port `getGenerativeStativeCompoundVerbInfo()` logic
- [ ] **Location**: `functions/verb_inflector.py`
- [ ] **Reference**: Lines 195-276 in `verb-info.ts`
- [ ] **Features**:
  - Detect stative compound verbs (complement + کول/کېدل)
  - Handle welding (complement loses accent in imperfective)
  - Handle squishing (complement + و for imperfective stem)
  - Handle split heads (perfective aspect)

#### 5.3 Update Word Frequency Database
- [ ] **Task**: Mark compound verbs in `word_frequencies`
- [ ] **Script**: `scripts/mark-compound-verbs.py`
- [ ] **Logic**:
  - Identify compound verbs from dictionary
  - Mark `verb_type` as 'dynamic_compound' or 'stative_compound'
  - Extract and store complement and auxiliary verb
  - Link compound forms to base verb

### Phase 6: Database Population ✅ High Priority

#### 6.1 Generate All Verb Forms
- [ ] **Task**: Use enhanced `getVerbInfo()` to generate all forms for each verb
- [ ] **Script**: `scripts/generate-all-verb-forms-enhanced.py`
- [ ] **Logic**:
  1. Load all verbs from `word_frequencies`
  2. For each verb, call `getVerbInfo()` equivalent
  3. Generate all conjugations (present, past, future, imperative, perfect, passive, ability, hypothetical)
  4. Search for each generated form in `word_frequencies`
  5. Mark found forms with `base_verb` and form type

#### 6.2 Update Database with Classification
- [ ] **Task**: Update `word_frequencies` with verb classification metadata
- [ ] **Script**: `scripts/update-verb-classification.py`
- [ ] **Output**: `cloudflare/update-verb-classification.sql`
- [ ] **Updates**:
  - Set `verb_type` for all verbs
  - Set `transitivity` for all verbs
  - Set `yul_ending` flag
  - Set `complement_text` and `aux_verb` for compounds
  - Set all stem/root fields

### Phase 7: Testing & Validation ✅ Medium Priority

#### 7.1 Test Verb Classification
- [ ] **Task**: Test `getVerbInfo()` on sample verbs
- [ ] **Test Cases**:
  - Simple transitive verbs
  - Simple intransitive verbs
  - Dynamic compound verbs
  - Stative compound verbs
  - Irregular verbs
  - Verbs with yul endings

#### 7.2 Validate Generated Forms
- [ ] **Task**: Compare generated forms with LingDocs output
- [ ] **Method**: Generate forms for test verbs and compare with LingDocs website
- [ ] **Check**:
  - Present forms
  - Past forms
  - Perfect forms
  - Passive forms
  - Ability forms

#### 7.3 Database Integrity Check
- [ ] **Task**: Verify all verb forms are properly linked
- [ ] **SQL**: Check that `base_verb` links are correct
- [ ] **Check**: Ensure no orphaned forms

## Implementation Order (Recommended)

### Week 1: Foundation
1. ✅ Phase 1.3: Update database schema
2. ✅ Phase 1.2: Enhance dictionary entry extraction
3. ✅ Phase 2.1: Expand irregular verb database

### Week 2: Core Logic
4. ✅ Phase 1.1: Create `get_verb_info()` function
5. ✅ Phase 2.2: Integrate irregular verb lookup
6. ✅ Phase 3.1-3.3: Implement stem/root extraction

### Week 3: Form Generation
7. ✅ Phase 4.1-4.4: Add comprehensive form generation
8. ✅ Phase 5.1-5.2: Implement compound verb handling

### Week 4: Database Population
9. ✅ Phase 6.1: Generate all verb forms
10. ✅ Phase 6.2: Update database with classification
11. ✅ Phase 5.3: Mark compound verbs

### Week 5: Testing & Refinement
12. ✅ Phase 7.1-7.3: Testing & validation
13. ✅ Bug fixes and refinements

## Files to Create/Modify

### New Files
- `functions/verb_classifier.py` - Enhanced verb classification logic
- `scripts/generate-all-verb-forms-enhanced.py` - Generate all forms with LingDocs logic
- `scripts/update-verb-classification.py` - Update database with classification
- `cloudflare/enhance-verb-schema.sql` - Database schema updates
- `cloudflare/update-verb-classification.sql` - Classification updates

### Modified Files
- `functions/verb_inflector.py` - Add LingDocs logic
- `irregular_verbs.json` - Expand with comprehensive irregulars
- `scripts/import-verb-stems-from-dictionary.py` - Enhance extraction

## Key Design Decisions

1. **PsString Structure**: For now, we'll keep simple strings but add accent metadata where useful. Full PsString implementation can be phased in later.

2. **Irregular Verb Priority**: Always check irregulars first, then dictionary, then inference.

3. **Compound Verb Handling**: Extract complement and auxiliary separately, then combine during conjugation.

4. **Database Strategy**: Store base verb info in `word_frequencies`, generate forms on-demand but also pre-populate common forms.

5. **Incremental Migration**: Implement in phases, test each phase before moving to next.

## Success Criteria

- ✅ All verbs in `word_frequencies` have `verb_type` and `transitivity` set
- ✅ All verb forms are properly linked via `base_verb`
- ✅ Compound verbs are correctly identified and marked
- ✅ Irregular verbs use comprehensive conjugation tables
- ✅ Passive voice and ability forms are generated for applicable verbs
- ✅ Generated forms match LingDocs output for test cases
