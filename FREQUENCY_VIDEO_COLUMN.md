# Frequency Video Column Documentation

## Overview

The `frequency_video` column tracks video frequencies separately from Bible frequencies. This allows us to:
- See which words come from videos vs Bible
- Automatically remove video contributions when videos are deleted
- Track which videos each word comes from (via `video_word_mappings` table)

## Schema Changes

### Added Column
- `word_frequencies.frequency_video` (INTEGER, DEFAULT 0)
  - Tracks total frequency from all videos
  - Calculated from `video_word_mappings` table

### Frequency Total Calculation
```
frequency_total = frequency_afghan2023_ot + 
                  frequency_afghan2023_nt + 
                  frequency_yousafzai2019_ot + 
                  frequency_yousafzai2019_nt + 
                  frequency_video
```

## Migration Steps

1. **Add the column:**
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/add-frequency-video-column.sql
   ```

2. **Populate existing data:**
   ```bash
   python3 scripts/populate-frequency-video.py
   ```

## Video Tracking

### Which Videos Does a Word Come From?

Query `video_word_mappings` table:
```sql
SELECT video_id, frequency
FROM video_word_mappings
WHERE pashto_word = 'WORD_HERE'
ORDER BY frequency DESC;
```

### When Videos Are Added/Updated

The `processVideoTranscript()` function in `worker-api.ts` automatically:
1. Updates `video_word_mappings` table
2. Recalculates `frequency_video` for affected words
3. Updates `frequency_total` (Bible + video)

### When Videos Are Deleted

The `deleteVideo()` function automatically:
1. Gets all words affected by the video
2. Decrements `frequency_video` for each word
3. Recalculates `frequency_total` for affected words
4. Deletes `video_word_mappings` entries

### Manual Cleanup

If needed, use the cleanup script:
```bash
python3 scripts/cleanup-video-frequencies.py <video_id>
```

## Statistics

After migration, you can check:
- Total words with video frequency: `SELECT COUNT(*) FROM word_frequencies WHERE frequency_video > 0;`
- Total video frequency: `SELECT SUM(frequency_video) FROM word_frequencies;`
- Words only in videos: `SELECT COUNT(*) FROM word_frequencies WHERE frequency_video > 0 AND frequency_afghan2023_ot = 0 AND frequency_afghan2023_nt = 0 AND frequency_yousafzai2019_ot = 0 AND frequency_yousafzai2019_nt = 0;`

## Example Queries

### Find words that appear only in videos
```sql
SELECT pashto_word, frequency_video, frequency_total
FROM word_frequencies
WHERE frequency_video > 0 
  AND frequency_afghan2023_ot = 0 
  AND frequency_afghan2023_nt = 0 
  AND frequency_yousafzai2019_ot = 0 
  AND frequency_yousafzai2019_nt = 0
ORDER BY frequency_video DESC;
```

### Find which videos contain a specific word
```sql
SELECT vwm.video_id, vwm.frequency, vt.title, vt.url
FROM video_word_mappings vwm
LEFT JOIN video_transcripts vt ON vwm.video_id = vt.video_id
WHERE vwm.pashto_word = 'غزل'
ORDER BY vwm.frequency DESC;
```

### Get video frequency breakdown for a word
```sql
SELECT 
  pashto_word,
  frequency_total,
  frequency_afghan2023_ot + frequency_afghan2023_nt as bible_afghan,
  frequency_yousafzai2019_ot + frequency_yousafzai2019_nt as bible_yousafzai,
  frequency_video,
  (SELECT COUNT(*) FROM video_word_mappings WHERE pashto_word = wf.pashto_word) as video_count
FROM word_frequencies wf
WHERE pashto_word = 'WORD_HERE';
```

