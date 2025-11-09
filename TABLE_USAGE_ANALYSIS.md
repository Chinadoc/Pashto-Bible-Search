# D1 Table Usage Analysis

## Current Implementation Usage

### ✅ Tables Currently Used

| Table | Rows | Used In | Purpose |
|-------|------|---------|---------|
| **verbs_lexicon** | 3,710 | `detectDictionaryTerm()`, `getVerbVariants()`, `word-analysis` | Dictionary detection, verb root lookup, verb metadata |
| **verb_forms** | 237,042 | `getVerbVariants()`, `fetchVerbVariantsFromD1()` | Verb conjugation variants |
| **word_frequencies** | 23,248 | `detectDictionaryTerm()`, `getVerbVariants()`, search | Base verb/noun mapping, frequency counts |
| **form_to_root** | 306,462 | `detectDictionaryTerm()`, `resolveVerbRoot()`, `word-analysis` | Root resolution for inflected forms |
| **video_word_mappings** | 556 | `fetchVideoMatches()` | Video search integration |
| **video_transcripts** | 2 | `fetchVideoMatches()` | Video transcript data |
| **inflection_reasons** | 126 | `word-analysis` route | Grammatical tooltips |
| **nouns_lexicon** | 11,138 | `word-analysis` route | Noun metadata (not yet in dictionary detection) |
| **inflections** | 306,462 | `word-analysis` route | Inflection data for analysis |
| **verses_afghan2023** | 23,477 | `searchVersesD1()` | Verse search results |
| **verses_yousafzai** | 29,414 | `searchVersesD1()` | Verse search results |

### ❌ Tables NOT Currently Used

| Table | Rows | Potential Use Case | Status |
|-------|------|-------------------|--------|
| **category_verse_mappings** | 984 | Topic/category-based search | 🔄 Not implemented |
| **word_category_mappings** | 10,161 | Word-to-category mapping | 🔄 Not implemented |
| **word_categories** | 149 | Category definitions | 🔄 Not implemented |
| **word_verse_mapping** | 43,468 | Direct word-to-verse mapping | ⚠️ May be used indirectly |
| **form_occurrences** | 12,501 | Form occurrence data | ⚠️ Referenced but not directly queried |
| **word_source_mapping** | 4,195 | Word source tracking | 🔄 Not implemented |

## Detailed Usage Breakdown

### Dictionary Detection (`detectDictionaryTerm`)

**Uses:**
- ✅ `verbs_lexicon` - Check if word is a verb root
- ✅ `word_frequencies.base_verb` - Map inflected forms to base verbs
- ✅ `form_to_root` - Resolve root for any form

**Missing:**
- ❌ `nouns_lexicon` - Should check for noun bases (TODO)
- ❌ `word_frequencies.base_noun` - Should check noun mappings (TODO)

### Verb Variants (`getVerbVariants`)

**Uses:**
- ✅ `verb_forms` - All conjugated forms
- ✅ `word_frequencies` - Frequency counts for ranking
- ✅ `verbs_lexicon` - POS flags, verb type, helper

**Complete:** ✅ Yes

### Video Matching (`fetchVideoMatches`)

**Uses:**
- ✅ `video_word_mappings` - Word-to-video mappings
- ✅ `video_transcripts` - Transcript data and segments

**Complete:** ✅ Yes

### Search Results

**Uses:**
- ✅ `verses_afghan2023` / `verses_yousafzai` - Verse text
- ⚠️ `word_verse_mapping` - May be used via `searchVersesD1()` indirectly
- ⚠️ `form_occurrences` - Referenced in code comments but not directly queried

### Word Analysis

**Uses:**
- ✅ `nouns_lexicon` - Noun metadata
- ✅ `verbs_lexicon` - Verb metadata
- ✅ `inflections` - Inflection data
- ✅ `inflection_reasons` - Grammatical reasons
- ✅ `form_to_root` - Root resolution

**Complete:** ✅ Yes

## Missing Features That Could Use Unused Tables

### 1. Category/Topic Search (Not Implemented)

**Tables Available:**
- `word_categories` (149 rows) - Category definitions
- `word_category_mappings` (10,161 rows) - Word-to-category mapping
- `category_verse_mappings` (984 rows) - Category-to-verse mapping

**Potential Feature:**
```typescript
// Search by topic/category
async function searchByCategory(category: string) {
  // Query category_verse_mappings for verses in this category
  // Could show "Related Topics" in search results
}
```

### 2. Word Source Tracking (Not Implemented)

**Table Available:**
- `word_source_mapping` (4,195 rows) - Word source tracking

**Potential Feature:**
```typescript
// Show word etymology/sources
async function getWordSources(word: string) {
  // Query word_source_mapping
  // Could show "This word appears in: LingDocs, Dictionary X, etc."
}
```

### 3. Form Occurrences (Partially Used)

**Table Available:**
- `form_occurrences` (12,501 rows) - Form occurrence data

**Current Status:**
- Referenced in code comments (`// Multiple terms from inflections/conjugations - use D1 form_occurrences`)
- Not directly queried in current implementation
- May be used via `searchVersesD1()` indirectly

**Potential Enhancement:**
```typescript
// Direct query for form occurrences
async function getFormOccurrences(form: string) {
  // Query form_occurrences directly
  // Could provide faster lookup than word_verse_mapping
}
```

## Recommendations

### High Priority (Should Implement)

1. **Noun Dictionary Detection** - Extend `detectDictionaryTerm()` to check `nouns_lexicon`
   ```typescript
   // Add to detectDictionaryTerm():
   const nounRow = await queryD1First(
     db,
     `SELECT pashto_word FROM nouns_lexicon WHERE pashto_word = ? LIMIT 1`,
     [normalized]
   );
   ```

2. **Category/Topic Integration** - Add topic search capability
   ```typescript
   // New endpoint: /api/search/topics
   async function searchByTopic(topic: string) {
     // Use category_verse_mappings
   }
   ```

### Medium Priority (Nice to Have)

3. **Word Source Display** - Show word sources in dictionary match
   ```typescript
   // Add to dictionaryMatch response:
   sources: await getWordSources(word)
   ```

4. **Direct Form Occurrences** - Use `form_occurrences` for faster lookups
   ```typescript
   // Optimize search with direct form_occurrences query
   ```

### Low Priority (Future Enhancement)

5. **Category Suggestions** - Show related categories in search results
6. **Source Attribution** - Display where words come from (LingDocs, etc.)

## Summary

**Currently Using:** 11 out of 17 tables (65%)
- Core search functionality: ✅ Complete
- Dictionary detection: ✅ Complete (verbs), ⚠️ Partial (nouns)
- Video integration: ✅ Complete
- Word analysis: ✅ Complete

**Not Using:** 6 tables (35%)
- Category/topic search: ❌ Not implemented
- Word source tracking: ❌ Not implemented
- Direct form occurrences: ⚠️ Indirectly used

**Next Steps:**
1. Add noun detection to `detectDictionaryTerm()`
2. Consider implementing category/topic search
3. Add word source display to dictionary match

