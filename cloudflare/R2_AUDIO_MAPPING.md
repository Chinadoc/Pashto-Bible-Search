# R2 Audio File to D1 Verse Mapping Strategy

This document explains how audio files stored in Cloudflare R2 are matched to verses in the D1 database for both Afghan 2023 and Yousafzai 2019 translations.

## Overview

The Pashto Bible Search project stores audio files in Cloudflare R2 storage and verse metadata in Cloudflare D1 (SQLite) database. The mapping between these two systems is critical for serving audio with verses.

## D1 Database Structure

### Verse Tables

Two main verse tables exist in D1:
- `verses_afghan2023` (23,477 rows) - Afghan 2023 translation
- `verses_yousafzai` (29,414 rows) - Yousafzai 2019 translation

### Verse Schema

Both tables share this schema (from `cloudflare/types.ts:6-21`):

```typescript
interface Verse {
  id: number;
  ref: string;                    // e.g., "Genesis 1:1"
  book: string;                   // e.g., "Genesis", "Matthew", "1 John"
  chapter: number;                // Chapter number
  verse: number;                  // Verse number
  text: string;                   // Pashto verse text
  text_normalized?: string | null;
  testament: 'OT' | 'NT';
  translation_key: string;        // 'afghan2023' or 'yousafzai2019'
  dialect?: string | null;
  audio_r2_key?: string | null;   // ⭐ R2 storage key for audio
  audio_public_url?: string | null; // Public URL for streaming
  created_at: number;
  updated_at: number;
}
```

## R2 Audio File Naming Convention

### Current Implementation (Afghan 2023)

**Location**: `cloudflare/worker-api.ts:497-506`

```typescript
function generateR2AudioKey(book: string, chapter: number, verse: number,
                           translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'): string {
  let bookSlug = book.toLowerCase().replace(/\s+/g, '');
  const testament = translation === 'afghan2023' ? 'nt' : 'ot';
  return `${translation}/${testament}/${bookSlug}${chapter}_verse_${String(verse).padStart(3, '0')}.mp3`;
}
```

### Afghan 2023 Naming Pattern

**Directory Structure**:
```
afghan2023/
  nt/                          # New Testament
    matthew1_verse_001.mp3     # Matthew 1:1
    matthew1_verse_002.mp3     # Matthew 1:2
    matthew27_verse_046.mp3    # Matthew 27:46
    john3_verse_016.mp3        # John 3:16
    1john1_verse_001.mp3       # 1 John 1:1
    ...
  ot/                          # Old Testament (if exists)
    genesis1_verse_001.mp3     # Genesis 1:1
    ...
```

**Pattern Details**:
- **Translation folder**: `afghan2023/`
- **Testament folder**: `nt/` or `ot/`
- **File format**: `{book_slug}{chapter}_verse_{verse_padded}.mp3`
  - `book_slug`: Book name lowercase, spaces removed (e.g., "1john", "matthew")
  - `chapter`: Chapter number, no padding
  - `verse_padded`: Verse number, **zero-padded to 3 digits** (001, 002, 046, 176)

**Examples**:
```
Book Reference        → R2 Key
─────────────────────────────────────────────────────────────
Matthew 1:1          → afghan2023/nt/matthew1_verse_001.mp3
Matthew 27:46        → afghan2023/nt/matthew27_verse_046.mp3
John 3:16            → afghan2023/nt/john3_verse_016.mp3
1 John 1:1           → afghan2023/nt/1john1_verse_001.mp3
2 Corinthians 5:17   → afghan2023/nt/2corinthians5_verse_017.mp3
Revelation 22:21     → afghan2023/nt/revelation22_verse_021.mp3
Psalm 23:1           → afghan2023/ot/psalm23_verse_001.mp3
Genesis 1:1          → afghan2023/ot/genesis1_verse_001.mp3
```

### Yousafzai 2019 Naming Pattern

**Directory Structure**:
```
yousafzai2019/
  ot/                          # Old Testament (primary content)
    genesis1_verse_001.mp3     # Genesis 1:1
    genesis1_verse_002.mp3     # Genesis 1:2
    exodus20_verse_001.mp3     # Exodus 20:1
    psalm23_verse_001.mp3      # Psalm 23:1
    ...
  nt/                          # New Testament (if exists)
    matthew1_verse_001.mp3     # Matthew 1:1
    ...
```

**Pattern Details**:
- **Translation folder**: `yousafzai2019/`
- **Testament folder**: `ot/` (primarily) or `nt/`
- **File format**: Same as Afghan 2023: `{book_slug}{chapter}_verse_{verse_padded}.mp3`
- **Note**: Current code shows `testament = 'ot'` for Yousafzai, suggesting OT focus

**Examples**:
```
Book Reference        → R2 Key
─────────────────────────────────────────────────────────────
Genesis 1:1          → yousafzai2019/ot/genesis1_verse_001.mp3
Exodus 20:1          → yousafzai2019/ot/exodus20_verse_001.mp3
Psalm 23:1           → yousafzai2019/ot/psalm23_verse_001.mp3
Psalm 119:176        → yousafzai2019/ot/psalm119_verse_176.mp3
1 Chronicles 1:1     → yousafzai2019/ot/1chronicles1_verse_001.mp3
```

## File Name Variant Matching

The client-side code (`app/lib/audio.ts:30-54`) supports multiple filename variants for robustness:

```typescript
function filenameVariants(ref: string): string[] {
  const { book, chapter, verse } = parseRef(ref);
  const slug = normalizeBookNameToSlug(book);

  return [
    `${slug}${chapter}_verse_${verse}.mp3`,              // No padding
    `${slug}${chapter.padStart(3, '0')}_verse_${verse.padStart(3, '0')}.mp3`,  // 3-digit padding
    `${slug}${chapter.padStart(2, '0')}_verse_${verse.padStart(2, '0')}.mp3`,  // 2-digit padding
    // Also handles numbered books like "1john" vs "john1"
  ];
}
```

This allows matching files with different padding conventions:
- `matthew1_verse_1.mp3` (no padding)
- `matthew01_verse_01.mp3` (2-digit padding)
- `matthew001_verse_001.mp3` (3-digit padding)
- `matthew1_verse_001.mp3` (mixed padding) ⭐ **Preferred format**

## Audio Resolution Flow

### 1. Client-Side Resolution (`app/lib/audio.ts`)

```typescript
export function audioUrlFromRef(ref: string, audioMap?: AudioMap): string | null {
  const candidates = collectCandidateKeys(ref);  // Generate all possible filenames
  for (const key of candidates) {
    const value = audioMap[key];
    if (value) return audioEntryToUrl(value);
  }
  return null;
}
```

### 2. Server-Side Resolution (`cloudflare/worker-api.ts:525-557`)

When fetching verses from D1:

```typescript
const verses = result.results?.map((verse: any) => {
  let audioR2Key: string | null = verse.audio_r2_key || null;

  // If audio_r2_key not in DB, generate it
  if (!audioR2Key) {
    audioR2Key = generateR2AudioKey(verse.book, verse.chapter, verse.verse, translation);
  }

  // Build streaming URL
  const audioPublicUrl = audioR2Key
    ? `${workerUrl}/api/audio/stream/${encodeURIComponent(audioR2Key)}`
    : null;

  return {
    ...verse,
    audio_r2_key: audioR2Key,
    audio_public_url: audioPublicUrl,
  };
});
```

### 3. R2 Streaming (`cloudflare/worker-api.ts:657-702`)

```typescript
async function streamAudio(env: Env, r2Key: string, request: Request): Promise<Response> {
  const object = await env.AUDIO_BUCKET.get(r2Key);
  if (!object) return errorResponse('Audio file not found', 404);

  // Support range requests for audio seeking
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      // ... other headers
    }
  });
}
```

## Mapping Strategy Summary

### For Afghan 2023 (New Testament focused)

1. **Source**: `verses_afghan2023` table
2. **Testament**: Primarily `nt/`
3. **Audio Pattern**: `afghan2023/nt/{bookslug}{chapter}_verse_{verse:03d}.mp3`
4. **Book Slug**: Lowercase, no spaces (e.g., "matthew", "1john", "2corinthians")
5. **Verse Padding**: 3 digits (001, 002, 046, 176)

### For Yousafzai 2019 (Old Testament focused)

1. **Source**: `verses_yousafzai` table
2. **Testament**: Primarily `ot/`
3. **Audio Pattern**: `yousafzai2019/ot/{bookslug}{chapter}_verse_{verse:03d}.mp3`
4. **Book Slug**: Same as Afghan 2023
5. **Verse Padding**: 3 digits (001, 002, 046, 176)

## Book Name Normalization Rules

From `app/lib/audio.ts:7-9`:

```typescript
function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase()
    .replace(/\s+/g, '')       // Remove all spaces
    .replace(/[^a-z0-9]/g, ''); // Keep only letters and numbers
}
```

**Examples**:
```
Input Book Name       → Book Slug
─────────────────────────────────────
"Matthew"            → "matthew"
"1 John"             → "1john"
"2 Corinthians"      → "2corinthians"
"Revelation"         → "revelation"
"Psalm"              → "psalm"
"1 Chronicles"       → "1chronicles"
```

## API Endpoints for Audio

### Stream Audio from R2
```
GET /api/audio/stream/{r2_key}
```

**Example**:
```bash
curl "https://pashtobiblesearch.workers.dev/api/audio/stream/afghan2023%2Fnt%2Fmatthew1_verse_001.mp3"
```

**Features**:
- Direct streaming from R2
- Supports HTTP range requests (for seeking)
- CORS enabled
- Returns 404 if file doesn't exist

### Get Presigned URL
```
GET /api/audio/url/{r2_key}
```

**Response**:
```json
{
  "url": "https://pub-xxx.r2.dev/afghan2023/nt/matthew1_verse_001.mp3",
  "contentType": "audio/mpeg",
  "size": 45678
}
```

## Implementation Tasks

### To Enable Full Audio Support:

#### 1. **Populate `audio_r2_key` in D1**

Run updates to set the `audio_r2_key` field for verses that have audio:

```sql
-- Afghan 2023 (NT verses)
UPDATE verses_afghan2023
SET audio_r2_key = 'afghan2023/nt/' ||
                   lower(replace(book, ' ', '')) ||
                   chapter ||
                   '_verse_' ||
                   printf('%03d', verse) ||
                   '.mp3'
WHERE testament = 'NT' AND audio_r2_key IS NULL;

-- Yousafzai 2019 (OT verses)
UPDATE verses_yousafzai
SET audio_r2_key = 'yousafzai2019/ot/' ||
                   lower(replace(book, ' ', '')) ||
                   chapter ||
                   '_verse_' ||
                   printf('%03d', verse) ||
                   '.mp3'
WHERE testament = 'OT' AND audio_r2_key IS NULL;
```

#### 2. **Upload Audio Files to R2**

Using Wrangler:
```bash
# Afghan 2023 NT audio
wrangler r2 object put pashto-bible-audio/afghan2023/nt/matthew1_verse_001.mp3 \
  --file=local-audio/afghan2023/matthew1_1.mp3

# Yousafzai 2019 OT audio
wrangler r2 object put pashto-bible-audio/yousafzai2019/ot/genesis1_verse_001.mp3 \
  --file=local-audio/yousafzai/genesis1_1.mp3
```

Using AWS CLI with R2 endpoint:
```bash
aws s3 cp local-audio/ s3://pashto-bible-audio/ \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --recursive
```

#### 3. **Verify Audio Files Exist**

Create a verification script:

```typescript
async function verifyAudioExists(env: Env, r2Key: string): Promise<boolean> {
  const object = await env.AUDIO_BUCKET.head(r2Key);
  return object !== null;
}

// Check all verses
const verses = await env.DB.prepare('SELECT * FROM verses_afghan2023').all();
for (const verse of verses.results) {
  if (verse.audio_r2_key) {
    const exists = await verifyAudioExists(env, verse.audio_r2_key);
    console.log(`${verse.ref}: ${exists ? '✅' : '❌'}`);
  }
}
```

#### 4. **Batch Audio Upload Script**

Create `scripts/upload-audio-to-r2.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function uploadAudio(localPath: string, r2Key: string) {
  const file = readFileSync(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: 'pashto-bible-audio',
    Key: r2Key,
    Body: file,
    ContentType: 'audio/mpeg',
  }));
}

// Upload Afghan 2023 NT audio
const afghan2023Dir = './audio-files/afghan2023/nt/';
for (const file of readdirSync(afghan2023Dir)) {
  const r2Key = `afghan2023/nt/${file}`;
  await uploadAudio(join(afghan2023Dir, file), r2Key);
  console.log(`✅ Uploaded: ${r2Key}`);
}
```

## Troubleshooting

### Audio Not Playing

1. **Check R2 Key Format**:
   ```bash
   wrangler r2 object list pashto-bible-audio --prefix=afghan2023/nt/
   ```

2. **Verify File Exists**:
   ```bash
   curl -I "https://pashtobiblesearch.workers.dev/api/audio/stream/afghan2023%2Fnt%2Fmatthew1_verse_001.mp3"
   ```

3. **Check D1 Data**:
   ```bash
   wrangler d1 execute pashto-bible-db --command \
     "SELECT ref, audio_r2_key FROM verses_afghan2023 WHERE book='Matthew' LIMIT 5"
   ```

### Common Issues

- **404 Not Found**: File doesn't exist in R2 or wrong path
- **CORS Errors**: Check CORS headers in `streamAudio()` function
- **Encoding Issues**: Ensure R2 keys are URL-encoded when making requests

## Related Files

- `cloudflare/worker-api.ts:497-506` - R2 key generation
- `cloudflare/worker-api.ts:657-702` - Audio streaming
- `app/lib/audio.ts` - Client-side audio resolution
- `cloudflare/types.ts:6-21` - Verse interface with audio fields
- `components/AudioPlayer.tsx` - Audio playback component

## Future Enhancements

1. **Audio Metadata in D1**: Add duration, file size, quality
2. **Multiple Audio Versions**: Support different readers/quality levels
3. **Audio Chapters**: Full chapter audio files (e.g., `matthew1_full.mp3`)
4. **Waveform Data**: Store waveform JSON for visualization
5. **Transcript Timestamps**: Word-level timestamps for highlighting
