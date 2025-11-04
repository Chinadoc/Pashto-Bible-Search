# Inflections/Conjugations Search & Lexicon Migration Plan

## Current State

### Data Sources
1. **Supabase Tables** (currently used):
   - `inflections` - Base word → inflected form mappings
   - `verbs_lexicon` - Verb conjugation patterns
   - `irregular_verbs` - Irregular verb forms
   - `nouns_lexicon` - Noun inflection patterns
   - `grammar_rules` - Grammar rules for conjugation
   - `word_occurrence_index` - Word → verse mappings (638,918 records)

2. **Local Files**:
   - `app/data/inflections_cache.json` - Pre-computed inflections cache
   - Dictionary data (LingDocs format)

3. **D1 Tables** (already in schema):
   - `inflections` - Base word → inflected form mappings
   - `verbs_lexicon` - Verb conjugation patterns
   - `irregular_verbs` - Irregular verb forms
   - `nouns_lexicon` - Noun inflection patterns
   - `grammar_rules` - Grammar rules
   - `word_frequencies` - Word frequencies with `base_form`, `inflection_type`
   - `form_to_root` - Form → root word mapping
   - `word_verse_mapping` - Word → verse reference mappings

### Current Search Flow
1. User searches for "wahul" (وهل)
2. Search API generates related forms via LingDocs + inflection cache
3. Searches `word_occurrence_index` in Supabase for each form
4. Filters results by tense/person if "Related Forms Mode" is active
5. Returns verses containing any of the related forms

## Migration Strategy

### Phase 1: Populate Lexicon Tables in D1

#### 1.1 Migrate Inflections from Cache
- **Source**: `app/data/inflections_cache.json`
- **Target**: D1 `inflections` table
- **Process**:
  ```typescript
  // Load inflections_cache.json
  // For each base word → inflections array:
  //   INSERT INTO inflections (base_word, inflected_form, grammatical_info, frequency)
  //   VALUES (baseWord, inflection.form, JSON.stringify(inflection), inflection.frequency || 0)
  ```

#### 1.2 Migrate Verbs Lexicon
- **Source**: Supabase `verbs_lexicon` table
- **Target**: D1 `verbs_lexicon` table
- **Process**: Export from Supabase → Import to D1

#### 1.3 Migrate Irregular Verbs
- **Source**: Supabase `irregular_verbs` table
- **Target**: D1 `irregular_verbs` table
- **Process**: Export from Supabase → Import to D1

#### 1.4 Migrate Nouns Lexicon
- **Source**: Supabase `nouns_lexicon` table
- **Target**: D1 `nouns_lexicon` table
- **Process**: Export from Supabase → Import to D1

#### 1.5 Migrate Grammar Rules
- **Source**: Supabase `grammar_rules` table
- **Target**: D1 `grammar_rules` table
- **Process**: Export from Supabase → Import to D1

#### 1.6 Populate Form-to-Root Mapping
- **Source**: `inflections_cache.json` + reverse index
- **Target**: D1 `form_to_root` table
- **Process**:
  ```typescript
  // Build reverse index: inflected_form → base_word
  // INSERT INTO form_to_root (word_form, root_word, frequency)
  // VALUES (inflectedForm, baseWord, frequency)
  ```

### Phase 2: Update Search API to Use D1

#### 2.1 Create D1 Lexicon API Endpoints
Add to `cloudflare/worker-api.ts`:
- `GET /api/inflections?base_word={word}` - Get all inflections for a base word
- `GET /api/inflections/reverse?form={form}` - Find base word from inflected form
- `GET /api/verbs/{root}` - Get verb conjugation data
- `GET /api/related-forms?query={query}` - Generate related forms

#### 2.2 Update Search Route
Modify `app/api/search/route.ts`:
- When generating related forms, query D1 `inflections` table instead of Supabase
- Use D1 `form_to_root` for reverse lookups
- Use D1 `word_frequencies` with `base_form` for filtering

#### 2.3 Update Related Forms API
Modify `app/api/related_forms/route.ts`:
- Query D1 `inflections` table for base word lookups
- Use D1 `verbs_lexicon` for verb conjugations
- Use D1 `nouns_lexicon` for noun inflections
- Fallback to LingDocs API if not in D1

### Phase 3: Filtered Forms Enhancement

#### 3.1 Enhanced Grammatical Info Storage
- Store detailed grammatical labels in `inflections.grammatical_info` JSON:
  ```json
  {
    "tense": "present",
    "person": "1sg",
    "mood": "indicative",
    "voice": "active",
    "category": "verb"
  }
  ```

#### 3.2 Filter Queries
- Add filter endpoints to Cloudflare Worker:
  ```typescript
  GET /api/inflections/filter?base_word={word}&tense={tense}&person={person}
  ```
- Update `RelatedForms.tsx` component to use filtered API

### Phase 4: Lexicon Population Strategy

#### 4.1 Initial Population
1. **Inflections Cache** → D1 `inflections` table
2. **Supabase Lexicon Tables** → D1 lexicon tables
3. **Dictionary Data** → D1 `dictionary` table (for POS detection)

#### 4.2 Ongoing Population
1. **From Search Results**: When users search for forms not in lexicon:
   - Detect POS from dictionary
   - Generate inflections via LingDocs
   - Store in D1 `inflections` table
   - Update `form_to_root` mapping

2. **From Verse Analysis**: 
   - Extract unique words from verses
   - Identify base forms using reverse index
   - Store inflections if not already present

3. **Batch Processing**:
   - Periodic script to generate inflections for all dictionary words
   - Update frequency counts based on verse occurrences

## Implementation Priority

### High Priority (Immediate)
1. ✅ Migrate `inflections` from cache to D1
2. ✅ Migrate `verbs_lexicon` from Supabase to D1
3. ✅ Create D1 API endpoints for lexicon queries
4. ✅ Update search to use D1 for inflections

### Medium Priority (Next)
5. ⏳ Implement filtered forms queries
6. ⏳ Enhance grammatical info storage
7. ⏳ Update Related Forms component

### Low Priority (Future)
8. ⏳ Auto-populate lexicon from search results
9. ⏳ Batch processing for dictionary words
10. ⏳ Frequency-based lexicon updates

## Files to Create/Modify

### New Files
- `cloudflare/migrate-inflections-to-d1.ts` - Migrate inflections cache
- `cloudflare/migrate-lexicon-tables.ts` - Migrate Supabase lexicon tables
- `cloudflare/populate-form-to-root.ts` - Build form-to-root mapping
- `cloudflare/populate-lexicon-from-dictionary.ts` - Generate lexicon from dictionary

### Modified Files
- `cloudflare/worker-api.ts` - Add lexicon API endpoints
- `app/api/search/route.ts` - Use D1 for inflections
- `app/api/related_forms/route.ts` - Use D1 for lexicon lookups
- `components/RelatedForms.tsx` - Use filtered API endpoints

## Testing Strategy

1. **Data Integrity**: Verify all inflections migrate correctly
2. **Search Accuracy**: Compare D1 results with Supabase results
3. **Performance**: Measure query time improvements
4. **Filtered Forms**: Test tense/person filtering
5. **Fallback**: Ensure LingDocs fallback works when D1 missing


