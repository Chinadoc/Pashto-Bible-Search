# Yousafzai 2019 Audio Download Guide

This guide explains how to download Yousafzai 2019 audio files from Afghan Bibles and split them into individual verse files.

## Overview

The Yousafzai 2019 translation is available on Afghan Bibles with audio recordings for all books from Genesis to Revelation. This system downloads the chapter-level audio files and automatically splits them into individual verse files using timing data (jktags) extracted from the web pages.

## Files Created

### Main Scripts
- `download_yousafzai_audio.py` - Main Python downloader script
- `download_all_yousafzai_audio.sh` - Shell script to download all books
- `download_yousafzai_selective.sh` - Shell script for selective downloads

### Reference Scripts
- `yousafzai_audio_splitter.js` - Original JavaScript splitter (Psalms/Proverbs only)
- `decode_jktags.js` - Jktags decoding utility
- `scrape_ot_afghan_bibles.py` - Web scraping patterns

## Prerequisites

1. **Python 3.7+** with requests library
2. **ffmpeg** for audio processing
   - macOS: `brew install ffmpeg`
   - Ubuntu: `sudo apt install ffmpeg`

## Quick Start

### Download All Books
```bash
./download_all_yousafzai_audio.sh
```

### Download Specific Books
```bash
# Download Genesis and Exodus
./download_yousafzai_selective.sh genesis exodus

# Download Psalms chapters 1-10
./download_yousafzai_selective.sh psalms --start-chapter 1 --end-chapter 10

# Download all Gospels
./download_yousafzai_selective.sh matthew mark luke john
```

### Test Download (Genesis chapters 1-2 only)
```bash
python3 download_yousafzai_audio.py --test
```

## File Organization

```
yousafzai_audio_files/
├── genesis_1.mp3                    # Chapter audio files
├── genesis_2.mp3
├── genesis/
│   ├── chapter-1-verses/
│   │   ├── yousafzai_genesis001_verse_001.mp3
│   │   ├── yousafzai_genesis001_verse_002.mp3
│   │   └── ...
│   └── chapter-2-verses/
│       ├── yousafzai_genesis002_verse_001.mp3
│       └── ...
└── ...
```

## Naming Convention

- **Chapter files**: `{book}_{chapter}.mp3`
- **Verse files**: `yousafzai_{book}{chapter:03d}_verse_{verse:03d}.mp3`

Examples:
- `yousafzai_genesis001_verse_001.mp3` (Genesis 1:1)
- `yousafzai_psalms023_verse_005.mp3` (Psalms 23:5)

## Available Books

### Old Testament (39 books)
genesis, exodus, leviticus, numbers, deuteronomy, joshua, judges, ruth, 1-samuel, 2-samuel, 1-kings, 2-kings, 1-chronicles, 2-chronicles, ezra, nehemiah, esther, job, psalms, proverbs, ecclesiastes, song-of-songs, isaiah, jeremiah, lamentations, ezekiel, daniel, hosea, joel, amos, obadiah, jonah, micah, nahum, habakkuk, zephaniah, haggai, zechariah, malachi

### New Testament (27 books)
matthew, mark, luke, john, acts, romans, 1-corinthians, 2-corinthians, galatians, ephesians, philippians, colossians, 1-thessalonians, 2-thessalonians, 1-timothy, 2-timothy, titus, philemon, hebrews, james, 1-peter, 2-peter, 1-john, 2-john, 3-john, jude, revelation

## Technical Details

### Audio Sources
- **Base URL**: `https://afghanbibles.org/pashto-yusufzai-audio`
- **Chapter URL pattern**: `{base_url}/{book}-{chapter}.mp3`
- **Web page pattern**: `https://afghanbibles.org/eng/pashto-bible/{book}/{book}-{chapter}?prefdialect=yusufzai`

### Jktags Decoding
The script extracts timing data (jktags) from web pages and decodes them to get verse start times:

1. Extract jktags from HTML: `data-tags="..."`
2. Reverse the string
3. Replace encoded padding: `&41` → `====`, `&3` → `===`, etc.
4. Apply ROT13 decoding
5. Base64 decode to get timing tuples
6. Extract verse start times and create audio segments

### Audio Processing
- **Input**: Chapter-level MP3 files
- **Output**: Individual verse MP3 files
- **Quality**: 44.1kHz, mono, MP3
- **Padding**: 0.15s before start, 0.4s after end

## Usage Examples

### Python Script Direct Usage
```bash
# Download all books
python3 download_yousafzai_audio.py

# Download specific books
python3 download_yousafzai_audio.py --books genesis exodus psalms

# Download specific chapters
python3 download_yousafzai_audio.py --books psalms --start-chapter 1 --end-chapter 10

# Test mode (Genesis chapters 1-2 only)
python3 download_yousafzai_audio.py --test
```

### Shell Script Usage
```bash
# Download all books
./download_all_yousafzai_audio.sh

# Download specific books
./download_yousafzai_selective.sh genesis exodus

# Download with chapter range
./download_yousafzai_selective.sh psalms --start-chapter 1 --end-chapter 10
```

## Error Handling

The script includes robust error handling:
- **Network errors**: Retries and continues with next chapter
- **Missing audio**: Skips chapters without audio files
- **Jktags errors**: Logs warnings and continues
- **ffmpeg errors**: Logs errors and continues with next verse

## Logging

All operations are logged to:
- **Console**: Real-time progress updates
- **File**: `yousafzai_audio_download.log`

## Performance Considerations

- **Download time**: ~2-3 seconds per chapter
- **Processing time**: ~1-2 seconds per verse
- **Total time**: Several hours for all 66 books
- **Storage**: ~50-100MB per book (varies by length)

## Integration with Existing System

The downloaded files are compatible with the existing Pashto Bible Search system:

1. **Supabase Storage**: Upload verse files to `yousafzai/` bucket
2. **Database**: Update `verses_yousafzai` table with audio URLs
3. **Frontend**: Audio player supports Yousafzai 2019 translation

## Troubleshooting

### Common Issues

1. **ffmpeg not found**
   ```bash
   # macOS
   brew install ffmpeg
   
   # Ubuntu
   sudo apt install ffmpeg
   ```

2. **Network timeouts**
   - Script automatically retries
   - Check internet connection
   - Afghan Bibles server may be slow

3. **Missing jktags**
   - Some chapters may not have timing data
   - Script logs warnings and continues

4. **Audio file not found**
   - Some chapters may not have audio
   - Script skips and continues

### Verification

Check downloaded files:
```bash
# Count verse files per book
find yousafzai_audio_files/ -name "*.mp3" | grep verse | wc -l

# Check specific book
ls yousafzai_audio_files/genesis/chapter-1-verses/

# Verify file sizes
du -sh yousafzai_audio_files/
```

## Next Steps

After downloading:

1. **Review files**: Check that all expected books/chapters were downloaded
2. **Upload to storage**: Use existing upload scripts for Supabase
3. **Update database**: Add audio URLs to verses_yousafzai table
4. **Test integration**: Verify audio playback in the web interface

## Support

For issues or questions:
- Check the log file: `yousafzai_audio_download.log`
- Review existing scripts for reference patterns
- Test with small subsets first (use `--test` flag)
