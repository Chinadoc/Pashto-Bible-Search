# Audio Storage Sources

## Overview

The Pashto Bible Search app uses **two different storage systems** for audio files:

1. **Afghan 2023** - Stored in Supabase Storage
2. **Yousafzai 2019** - Stored in Google Drive

## Storage Details

### Afghan 2023 Audio
- **Storage**: Supabase Storage
- **Location**: `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/`
- **Example URL**: `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/acts19_verse_12.mp3`
- **Format**: Direct URLs with public access
- **CORS**: ✅ No proxy needed - direct access works
- **Books**: Primarily New Testament and some Old Testament books

### Yousafzai 2019 Audio
- **Storage**: Google Drive
- **Location**: Google Drive shared folder
- **Example URL**: `https://drive.google.com/uc?id=1wptpU7w2-WalG6F0h1x0R5jPPDIwwg5V&export=download`
- **Format**: Google Drive file IDs with download export
- **CORS**: ❌ Requires proxy - Google Drive blocks direct audio streaming
- **Books**: Psalms and Proverbs (full books with all verses)

## Why Two Different Storage Systems?

The two translations were ingested at different times using different processes:

1. **Afghan 2023**: Uploaded directly to Supabase Storage during initial migration
2. **Yousafzai 2019**: Existed in Google Drive, and was integrated via file ID mapping

## How It Works

### Chapter API (`app/api/chapter/route.ts`)

The `convertAudioUrlToProxy()` function handles both storage types:

```typescript
function convertAudioUrlToProxy(googleDriveUrl: string | null): string | null {
  if (!googleDriveUrl) return null;
  
  // If it's already a Supabase URL, return as-is
  if (googleDriveUrl.includes('supabase.co')) {
    return googleDriveUrl;
  }
  
  // Extract file ID from Google Drive URL formats
  let fileId: string | null = null;
  
  // Format 1: https://drive.google.com/file/d/{ID}/preview or /view
  let match = googleDriveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
  if (match) {
    fileId = match[1];
  }
  
  // Format 2: https://drive.google.com/uc?id={ID}&export=...
  if (!fileId) {
    match = googleDriveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    }
  }
  
  if (!fileId) return googleDriveUrl; // Return original if we can't parse
  
  // Return proxy URL for Google Drive files (handles CORS)
  return `/api/audio/proxy?id=${fileId}`;
}
```

### Audio Proxy (`app/api/audio/proxy/route.ts`)

For Google Drive files, the proxy:
1. Receives the file ID from frontend
2. Fetches audio from Google Drive backend-to-backend (no CORS issue)
3. Returns audio with proper CORS headers
4. Browser plays audio successfully ✅

## Future Improvements

Consider migrating Yousafzai audio to Supabase Storage for:
- **Consistency**: Single storage system
- **Performance**: No proxy needed for direct Supabase URLs
- **Reliability**: Reduced dependency on Google Drive
- **Cost**: Supabase Storage pricing may be more predictable

However, this would require:
1. Downloading all 43,193 Yousafzai audio files from Google Drive
2. Uploading them to Supabase Storage
3. Updating database with new URLs
4. Verifying all files uploaded successfully

## Database Schema

### `verses` table (Afghan 2023)
- `audio_url`: TEXT - Supabase storage URL or null
- Example: `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/acts19_verse_12.mp3`

### `verses_yousafzai` table (Yousafzai 2019)
- `audio_public_url`: TEXT - Google Drive URL or null
- `audio_url`: TEXT - Alternative field name (for consistency)
- Example: `https://drive.google.com/uc?id=1wptpU7w2-WalG6F0h1x0R5jPPDIwwg5V&export=download`

## Testing

To verify both storage types work:

1. **Afghan 2023**: Search for a word that appears in Acts or other NT books
   - Audio should load directly from Supabase ✅

2. **Yousafzai**: Search for a word in Psalms or Proverbs
   - Audio should load through proxy from Google Drive ✅

Both should work seamlessly for the user!

