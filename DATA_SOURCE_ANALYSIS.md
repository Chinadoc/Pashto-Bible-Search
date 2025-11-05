# Data Source Analysis - Current State

## Current Data Flow

### 1. **Verses (Text Content)**

#### `/api/search` Route
- ❌ **NOT using D1** - Goes directly to Supabase
- Uses `supabaseSearch()` function which queries:
  - `'Afghan 2023 Verses'` table (for afghan2023 translation)
  - `'Yousafzai Verses'` table (for yousafzai2019 translation)
- Results come from Supabase only, no D1 fallback

#### `/api/chapter` Route  
- ✅ **Uses D1 first** - Falls back to Supabase
- Flow:
  1. Tries `getVersesByChapter()` from D1 via Cloudflare Worker
  2. If D1 returns empty/error → Falls back to Supabase
  3. If Afghan 2023 empty → Tries Yousafzai as fallback

### 2. **Audio URLs**

#### `/api/audio_url` Route
- ✅ **Tries D1/R2 first** - Falls back to audio map
- Flow:
  1. Calls `/api/d1-audio` to get audio from R2
  2. `/api/d1-audio` calls `getVerseByRef()` from D1
  3. If verse found in D1 → Uses `audio_r2_key` → Generates R2 stream URL
  4. If D1 fails → Falls back to audio map (Supabase/Google Drive)

#### `/api/d1-audio` Route
- Fetches verse from D1 using `getVerseByRef()`
- Resolves audio URL from `verse.audio_r2_key`
- Returns 404 if verse not found in D1

## Problems Identified

### Issue 1: Search Route Not Using D1
**Problem**: `/api/search` doesn't try D1, so search results come from Supabase without `audio_r2_key` fields.

**Impact**: 
- Search results have Supabase `audio_url` but no R2 keys
- When audio is requested, `/api/audio_url` tries D1 but fails (verse not in D1 from search)
- Falls back to audio map which may not have the audio

### Issue 2: Audio 404 Errors
**Problem**: Verses from search results (Supabase) don't exist in D1, so `/api/d1-audio` returns 404.

**Root Cause**: 
- Search is getting verses from Supabase
- Audio resolution tries D1 first
- D1 doesn't have those verses → 404
- Falls back to audio map, but audio map may be incomplete

### Issue 3: Missing Audio in Audio Map
**Problem**: The audio map fallback may not have all verses.

**Impact**: Even when falling back, audio URLs return 404 because:
- Audio map only has limited entries (mostly NT)
- Google Drive loading is not fully implemented
- Missing verses: Proverbs 11:10, Numbers 22:28, Proverbs 6:25

## Solution Plan

### Fix 1: Update Search Route to Use D1 First
- Add D1 search before Supabase fallback
- Use `searchVerses()` from `cloudflare-d1.ts`
- Ensure search results include `audio_r2_key` when available

### Fix 2: Improve Audio Fallback Logic
- When D1 returns 404, check if verse came from Supabase
- If verse has Supabase `audio_url`, use that directly
- Only fall back to audio map if no Supabase URL exists

### Fix 3: Verify D1 Data Completeness
- Check if all verses are in D1
- Verify audio R2 keys are populated
- Ensure Cloudflare Worker is properly configured

## Current State Summary

| Endpoint | Verses Source | Audio Source | Status |
|----------|--------------|--------------|--------|
| `/api/search` | Supabase only | Falls back via `/api/audio_url` | ❌ Not using D1 |
| `/api/chapter` | D1 → Supabase | D1 → Audio Map | ✅ Working |
| `/api/audio_url` | D1 → Audio Map | D1 → Audio Map | ⚠️ Missing verses in D1 |

## Next Steps

1. **Update `/api/search`** to try D1 first (like `/api/chapter`)
2. **Check D1 database** - verify verses are migrated
3. **Check R2 storage** - verify audio files are uploaded
4. **Improve error handling** - better fallback when D1 returns empty







