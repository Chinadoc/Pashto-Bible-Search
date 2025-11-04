# Architecture Restructuring Questions: Inflection Analysis System

## Current State Analysis

### Current Approach (On-the-Fly Analysis)
- **Where**: `app/api/search_phrase/route.ts` - `analyzeInflectionReasons()` function
- **When**: During each search query, for top 10-20 forms
- **What it does**:
  - Queries up to 10 sample verses per form
  - Analyzes each verse context for sandwich patterns, plural indicators, transitive past verbs
  - Returns counts and examples
- **Problem**: Slow, repeated work, doesn't scale

### Existing Infrastructure
- `inflection_reasons` table already exists in schema
- `word_frequencies` table has ~638k+ records
- `form_occurrences` table tracks which forms appear in which verses
- `inflections` table stores base_word → inflected_form mappings

## Key Questions for Restructuring

### 1. **Pre-computation Strategy: When & How?**

**Question**: Should we pre-compute inflection reasons for ALL forms in `word_frequencies` in a batch process, or maintain a hybrid approach?

**Options**:
- **Option A (Full Pre-computation)**: 
  - One-time batch job analyzes ALL forms in `word_frequencies`
  - Store results in `inflection_reasons` table
  - Search queries just read from table (fast)
  - **Pros**: Fast searches, consistent results
  - **Cons**: Large initial computation, needs update when new verses added
  
- **Option B (Hybrid)**: 
  - Pre-compute for high-frequency forms (top 10k-20k)
  - On-the-fly for rare forms
  - **Pros**: Balance between speed and completeness
  - **Cons**: Still need some on-the-fly analysis
  
- **Option C (Lazy Caching)**: 
  - On-the-fly analysis as now, but cache results in `inflection_reasons`
  - Subsequent searches hit cache
  - **Pros**: Only compute what's needed
  - **Cons**: First search still slow, cache grows over time

**Recommendation**: Option A + Option C hybrid
- Pre-compute for all forms in `word_frequencies` (batch job)
- Cache any new analyses done on-the-fly

### 2. **Storage Granularity: Form-Level vs Occurrence-Level?**

**Question**: Should we store inflection reasons per form globally, or per form-verse occurrence?

**Current schema** (`inflection_reasons` table):
```sql
CREATE TABLE inflection_reasons (
  pashto_form TEXT NOT NULL,
  base_word TEXT,
  verse_ref TEXT,  -- Per-occurrence storage
  reason TEXT,     -- 'plural', 'sandwich', 'transitive_past'
  ...
)
```

**Options**:
- **Option A (Occurrence-Level - Current)**: 
  - One row per form-verse-reason combination
  - Can track "this form appears plural in verse X, sandwich in verse Y"
  - **Pros**: Most detailed, can show specific examples
  - **Cons**: Large table size (potentially millions of rows)

- **Option B (Form-Level Aggregation)**: 
  - One row per form with aggregated counts
  - Columns: `plural_count`, `sandwich_count`, `transitive_past_count`, `example_verse_refs`
  - **Pros**: Smaller table, faster queries
  - **Cons**: Less granular detail

- **Option C (Hybrid)**: 
  - Form-level aggregates for quick lookup
  - Occurrence-level detail table for examples (optional, can query when needed)
  - **Pros**: Best of both worlds
  - **Cons**: More complex schema

**Recommendation**: Option C (Hybrid)
- Form-level aggregates for `inflection_reasons` table (fast lookups)
- Separate `inflection_reason_examples` table for detailed examples (optional detail)

### 3. **Computation Scale: How Many Forms to Analyze?**

**Current**: Analyzing top 10-20 forms per search

**Question**: How many forms are in `word_frequencies` that need analysis?

**Scale Considerations**:
- `word_frequencies`: ~638k+ records
- But many are different forms of same base word
- Need to identify unique inflected forms (not base forms)
- Estimate: ~50k-100k unique inflected forms?

**Recommendation**: 
- Analyze ALL forms in `word_frequencies` where `pos` indicates noun/adjective
- Filter: `pos LIKE 'n.%'` or `pos LIKE '%adj%'`
- Estimate: ~30k-50k forms to analyze

### 4. **Batch Processing Strategy: How to Scale?**

**Question**: How should we structure the batch analysis job?

**Considerations**:
- Can't do all 30k-50k forms synchronously (would timeout)
- Need: Parallel processing, chunking, progress tracking, resumability

**Recommended Structure**:
```typescript
// Batch processing script
async function analyzeAllInflectionReasons() {
  // 1. Get all noun/adjective forms from word_frequencies
  const forms = await db.query(`
    SELECT DISTINCT pashto_word 
    FROM word_frequencies 
    WHERE pos LIKE 'n.%' OR pos LIKE '%adj%'
    ORDER BY frequency DESC
  `)
  
  // 2. Process in batches of 100 forms
  const batchSize = 100
  for (let i = 0; i < forms.length; i += batchSize) {
    const batch = forms.slice(i, i + batchSize)
    
    // 3. Parallel analysis within batch
    const results = await Promise.all(
      batch.map(form => analyzeInflectionReasons(form))
    )
    
    // 4. Batch insert results
    await batchInsertInflectionReasons(results)
    
    // 5. Log progress
    console.log(`Processed ${i + batch.length}/${forms.length}`)
  }
}
```

### 5. **Verse Context Analysis: How Deep?**

**Question**: How many verses should we analyze per form?

**Current**: 5-10 sample verses per form

**Options**:
- **Option A (Sample)**: Analyze random sample (current approach)
  - Fast but might miss patterns
- **Option B (All Occurrences)**: Analyze ALL verses containing the form
  - Most accurate but slow for high-frequency forms
- **Option C (Stratified Sample)**: 
  - Sample across different books/chapters
  - Sample across different frequency ranges
  - Better representation

**Recommendation**: Option C (Stratified Sample)
- For forms with < 50 occurrences: Analyze all
- For forms with 50-500 occurrences: Analyze 20-30 stratified samples
- For forms with > 500 occurrences: Analyze 30-50 stratified samples

### 6. **Incremental Updates: How to Handle New Data?**

**Question**: When new verses are added, how do we update inflection reasons?

**Options**:
- **Option A**: Re-run full batch analysis
- **Option B**: Incremental analysis (only analyze forms in new verses)
- **Option C**: Background job that periodically updates

**Recommendation**: Option B (Incremental)
- When new verses added, identify new forms
- Analyze only those forms
- Update `inflection_reasons` table incrementally

### 7. **Query Performance: How to Optimize Lookups?**

**Question**: How should search queries efficiently retrieve inflection reasons?

**Current**: On-the-fly analysis during search

**Optimized Approach**:
```sql
-- Fast lookup: Get aggregated reasons for a form
SELECT 
  pashto_form,
  plural_count,
  sandwich_count,
  transitive_past_count,
  sandwich_types,
  example_verse_refs
FROM inflection_reasons_aggregated
WHERE pashto_form IN (?, ?, ...)
```

**Schema Design**:
```sql
CREATE TABLE inflection_reasons_aggregated (
  pashto_form TEXT PRIMARY KEY,
  base_word TEXT,
  plural_count INTEGER DEFAULT 0,
  sandwich_count INTEGER DEFAULT 0,
  transitive_past_count INTEGER DEFAULT 0,
  sandwich_types TEXT, -- JSON array: ["په...کې", "د"]
  example_verse_refs TEXT, -- JSON array of verse refs
  total_analyzed INTEGER DEFAULT 0,
  last_updated INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_inflection_reasons_base ON inflection_reasons_aggregated (base_word);
```

### 8. **Compute Resources: Where to Run Batch Analysis?**

**Question**: Should batch analysis run:
- Locally (developer machine)?
- Cloudflare Worker (serverless)?
- Separate batch processing service?

**Considerations**:
- Cloudflare Workers have execution time limits (30s-300s depending on plan)
- Batch analysis might take hours for 30k+ forms
- Need a way to run long-running jobs

**Recommendation**: 
- Initial batch: Local script or separate service
- Incremental updates: Cloudflare Worker (cron job)
- Store results in D1 for fast lookups

## Proposed Architecture

### Phase 1: Pre-computation (One-time Batch Job)
```
1. Extract all noun/adjective forms from word_frequencies
2. For each form:
   a. Query verses containing the form
   b. Analyze verse contexts (sandwich, plural, transitive)
   c. Aggregate results
3. Store aggregated results in inflection_reasons_aggregated table
4. Store example verses in inflection_reason_examples table (optional)
```

### Phase 2: Search Query Optimization
```
1. Search query retrieves forms from relatedForms
2. Batch lookup inflection reasons from inflection_reasons_aggregated
3. Include in API response for highlighting
4. No on-the-fly analysis needed
```

### Phase 3: Incremental Updates
```
1. When new verses added, identify new forms
2. Analyze new forms incrementally
3. Update inflection_reasons_aggregated table
```

## Implementation Plan

1. **Create batch analysis script** (`scripts/batch-analyze-inflection-reasons.ts`)
2. **Create aggregated table schema** (update `d1-comprehensive-schema.sql`)
3. **Run batch analysis** (one-time, can take hours)
4. **Update search API** to use pre-computed data
5. **Set up incremental update process** (cron job or manual trigger)

## Questions to Answer

1. **Scale**: How many unique inflected forms need analysis? (~30k-50k estimate)
2. **Compute Time**: How long will batch analysis take? (Estimate: 2-4 hours for 30k forms)
3. **Storage**: How much storage needed for aggregated table? (~30k rows × ~500 bytes = ~15MB)
4. **Update Frequency**: How often do verses change? (Determines update strategy)
5. **Prioritization**: Should we prioritize high-frequency forms first? (Yes - analyze top 10k first, then rest)

