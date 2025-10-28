# Yousafzai Audio Loading Fix

## Problem

Audio was loading from afghan2023 but not from yousafzai in search results, even though audio was working in the chapters view.

### Root Cause

The database schema for `verses_yousafzai` table has inconsistent column names for audio URLs:
- Some scripts use `audio_public_url` 
- The search API was only looking for `audio_url`
- The chapters API was only looking for `audio_public_url`

This created a mismatch where:
1. Search results couldn't find yousafzai audio (expecting `audio_url` but database had `audio_public_url`)
2. Chapters view worked because it was using `audio_public_url`

## Solution

Updated both APIs to handle both column names as fallbacks:

### 1. Search API (`app/api/search/route.ts`)

**Changes:**
- Updated SELECT queries to fetch both `audio_url` and `audio_public_url` fields
- Modified audio URL conversion to use `verse.audio_url || verse.audio_public_url` as fallback
- Applied fix in 3 locations:
  - Line 52: Main supabase search query
  - Line 745: Result formatting for direct search
  - Line 841: Result formatting for related forms search
  - Line 1624: Fallback query

**Code Example:**
```typescript
// Before
audio_verse_url: convertAudioUrlToProxy(verse.audio_url)

// After  
audio_verse_url: convertAudioUrlToProxy(verse.audio_url || verse.audio_public_url)
```

### 2. Chapter API (`app/api/chapter/route.ts`)

**Changes:**
- Updated SELECT queries to fetch both `audio_url` and `audio_public_url` fields
- **CRITICAL**: Replaced `normalizeGoogleDriveUrl()` with `convertAudioUrlToProxy()` function
- The new function:
  - Keeps Supabase URLs as-is (for afghan2023 audio)
  - Converts Google Drive URLs to `/api/audio/proxy?id=...` format (for yousafzai audio)
  - Handles CORS issues with Google Drive
- Applied fix in 3 locations:
  - Line 37-66: New proxy conversion function
  - Line 172: Fallback result formatting
  - Line 202: Main result formatting

**Code Example:**
```typescript
// Before - This caused CORS issues with Google Drive
audio_public_url: normalizeGoogleDriveUrl(v.audio_public_url)

// After - Properly handles both storage types
audio_public_url: convertAudioUrlToProxy(v.audio_url || v.audio_public_url)
```

**Why This Matters:**
- Afghan 2023 audio is stored in Supabase storage: `https://nkombdutnjvaasxrbmdn.supabase.co/storage/...`
- Yousafzai audio is stored in Google Drive: `https://drive.google.com/uc?id=...`
- Google Drive URLs require a proxy due to CORS restrictions
- Supabase URLs work directly without proxy

## Result

Now both search results and chapters view will:
1. Try to use `audio_url` first (the standardized column name)
2. Fall back to `audio_public_url` if `audio_url` is null
3. Work consistently regardless of which column has the data

## Testing

To verify the fix works:
1. Search for a word that appears in yousafzai verses (e.g., "وهل")
2. Click "Load Audio" on a yousafzai result
3. Audio should now load successfully ✅
4. Browse chapters and verify audio still works there ✅

## Files Modified

- `app/api/search/route.ts` - Updated search API to handle both audio URL fields
- `app/api/chapter/route.ts` - Updated chapter API to handle both audio URL fields AND convert Google Drive URLs to proxy URLs

## Future Recommendation

For long-term consistency, consider:
1. Running a migration to standardize on `audio_url` column name
2. Copying data from `audio_public_url` to `audio_url` where needed
3. Dropping the `audio_public_url` column once migration is complete

This would simplify the codebase and avoid future confusion.

