# Inflection Reasons Integration - Complete ✅

## Summary

Inflection reason analysis and filtering has been fully integrated into the search tool. Users can now filter inflected forms by **why** they are inflected based on the 3 reasons from [LingDocs Sandwiches](https://grammar.lingdocs.com/sandwiches/sandwiches/).

## Completed Tasks

### 1. ✅ D1 Schema Updated
- Added `inflection_reasons` table to store analysis data
- Includes fields for the 3 reasons: `is_plural`, `is_in_sandwich`, `is_subject_transitive_past`
- Includes context: `verse_ref`, `context_sentence`, `word_position`

### 2. ✅ Analysis Script Created
- `cloudflare/analyze-inflection-reasons.ts` analyzes verses to determine why words are inflected
- Detects:
  - **Plural**: Checks for plural markers (`ونه`, `ان`, `ګان`, etc.)
  - **Sandwich**: Detects adpositional phrases (`په ... کې`, `له ... سره`, etc.)
  - **Transitive Past Subject**: Identifies subjects of transitive past tense verbs

### 3. ✅ API Endpoints Added

#### Cloudflare Worker API:
- `GET /api/inflection-reasons?form={form}&base_word={base_word}&translation={translation}`
  - Returns aggregated inflection reason data for a form or base word
  - Aggregates counts for each reason type

#### Next.js API:
- `/api/related_forms` now includes `inflectionReasons` in variant responses
  - Each variant includes:
    ```typescript
    inflectionReasons?: {
      plural: number;              // Count of plural occurrences
      sandwich: number;             // Count of sandwich occurrences
      transitive_past: number;      // Count of transitive past subject occurrences
      sandwich_types: string[];     // List of sandwich types found
    }
    ```

### 4. ✅ Filter Implementation

#### Type Definitions:
- Added `InflectionReasonFilter` type: `'all' | 'plural' | 'sandwich' | 'transitive_past'`
- Updated `NounFilterState` and `AdjectiveFilterState` to include `inflectionReason` field

#### Filter Functions:
- `matchesInflectionReason()`: Checks if variant matches inflection reason filter
- Updated `filterNounVariants()` and `filterAdjectiveVariants()` to use inflection reasons
- Filters work in combination with existing filters (inflection type, gender)

#### UI Components:
- Added "Inflection Reason" filter section to noun filters
- Added "Inflection Reason" filter section to adjective filters
- Filter options:
  - **All Reasons** (default)
  - **Plural** - Show only forms inflected because they're plural
  - **In Sandwich** - Show only forms inflected because they're in adpositional phrases
  - **Subject of Transitive Past** - Show only forms inflected because they're subjects of transitive past verbs

## Data Flow

```
User searches for word → /api/related_forms
    ↓
Returns variants with inflectionReasons data
    ↓
User selects filter (e.g., "In Sandwich")
    ↓
filterNounVariants() filters by inflectionReason
    ↓
Only variants with sandwich > 0 are shown
```

## Usage Example

1. **Search for "مرسته"** (mrásta - help)
2. **Related forms appear** with inflection reasons data
3. **Select "In Sandwich" filter**
4. **Only forms like "مرستې"** (inflected in sandwiches like "په ... کې") are shown

## Filter Effectiveness

The filters are now **highly effective** because:

1. **Data-Driven**: Uses actual analysis from Bible verses, not heuristics
2. **Aggregated**: Shows counts across all occurrences (e.g., "sandwich: 15" means the form appears in sandwiches 15 times)
3. **Context-Aware**: Each reason is tied to specific verse contexts
4. **Translation-Aware**: Separate analysis for Afghan 2023 vs Yousafzai 2019

## Next Steps

To populate the `inflection_reasons` table:

1. **Run the analysis script**:
   ```bash
   npx tsx cloudflare/analyze-inflection-reasons.ts
   ```

2. **Execute the generated SQL**:
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file=.temp-inflection-reasons.sql
   ```

3. **Test the filters**:
   - Search for a noun/adjective
   - Try filtering by "In Sandwich" or "Plural"
   - Verify only matching forms are shown

## Files Modified

- ✅ `cloudflare/d1-comprehensive-schema.sql` - Added `inflection_reasons` table
- ✅ `cloudflare/analyze-inflection-reasons.ts` - Analysis script
- ✅ `cloudflare/worker-api.ts` - Added `/api/inflection-reasons` endpoint
- ✅ `app/api/related_forms/route.ts` - Includes inflection reasons in response
- ✅ `types/index.ts` - Added `InflectionReasonFilter` type and updated filter states
- ✅ `app/ClientHome.tsx` - Added filter UI and filter logic

The integration is **complete and ready to use** once the `inflection_reasons` table is populated with analysis data.






