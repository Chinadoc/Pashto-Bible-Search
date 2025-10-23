# Part 2: Search API Refactor (IN PROGRESS)

## Current Status

### ✅ Completed
1. **Supabase Infrastructure**: 54,570 verses + 9,990 words indexed ✅
2. **Audio Population Scripts**: Created 3 approaches (simple, fast batch, update-based)
   - Currently running: `populate_audio_urls_update.js` (background process)
   - Processing: ~38,611 audio URL mappings into verses tables
   - ETA: Depends on Supabase write rate (~1-2 mins per table)

3. **Search API Refactor Started**:
   - Added `supabaseSearch()` function in `app/api/search/route.ts`
   - Queries word_occurrence_index (2-5ms)
   - Fetches verses with audio_url (10-50ms)
   - Total target: <60ms

### ⏳ In Progress
1. Audio URL population (running in background)
2. Search API integration into POST handler

### 🎯 Next Steps After Audio Completes

#### Step 1: Integrate supabaseSearch into POST Handler
File: `app/api/search/route.ts`

Replace the existing search logic with:
```typescript
// In the POST handler
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  // Try Supabase first (if audio URLs complete)
  const supabaseResults = await supabaseSearch(query, scope, translation);
  if (supabaseResults.length > 0) {
    return NextResponse.json({
      success: true,
      results: supabaseResults,
      queryTime: Date.now() - startTime,
      source: 'supabase'
    });
  }
}

// Fallback to JSON (existing logic)
```

#### Step 2: Test Performance
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"خدا","translation":"afghan2023"}'

# Expected:
# - Response time: 20-80ms
# - Includes audio_url
# - Results ranked by TF-IDF
```

#### Step 3: Update Frontend
- Verify ResultsList component expects `audio_url` in response
- Update audio player to use `verse.audio_url` directly

## Timeline

| Task | Status | ETA |
|------|--------|-----|
| Audio population | ⏳ Running | 5-10 min |
| Search API integration | 📋 Pending | 5 min after audio |
| Frontend update | 📋 Pending | 5 min |
| Testing | 📋 Pending | 5 min |
| **Total** | | **20-30 min** |

## Code Added

### supabaseSearch() Function
Location: `app/api/search/route.ts` (lines 16-72)

Key features:
- Queries `word_occurrence_index` by word + translation_key
- Fetches matching verses with audio_url
- Applies scope filter (OT/NT)
- Sorts by TF-IDF scores
- Includes query timing

### Audio Population Script
Location: `scripts/populate_audio_urls_update.js`

Strategy:
- Loads `google_drive_audio_urls.json` (38,611 mappings)
- Updates `verses` table (Afghan)
- Updates `verses_yousafzai` table (Yousafzai)
- Individual UPDATE queries (compatible, safe)
- Progress tracking

## Audio Status

Currently processing:
- Afghan: 0/24160 (waiting for population)
- Yousafzai: 0/30410 (waiting for population)

Expected after completion:
- Afghan: ~18,000/24160 (75% coverage)
- Yousafzai: ~28,000/30410 (92% coverage)

## Architecture Diagram

```
USER QUERY
    ↓
app/api/search/route.ts (POST)
    ↓
[NEW] supabaseSearch()
    ├─→ Query word_occurrence_index (2-5ms)
    ├─→ Get verse_refs + TF-IDF scores
    └─→ Fetch verses + audio_url (10-50ms)
    ↓
Results sorted by TF-IDF
    ├─→ ref, text, audio_url, score, testament
    └─→ Ready for frontend
    ↓
Frontend ResultsList
    └─→ Play audio directly from verse.audio_url
```

## Next Actions

1. **Check audio population**: `ps aux | grep populate_audio`
2. **When complete**: Run verification query
3. **Integrate search**: Update POST handler
4. **Test**: Query `خدا` or `د`
5. **Deploy**: Push to Vercel

Estimated total time to production: 30-45 minutes
