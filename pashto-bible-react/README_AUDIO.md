# Audio Splitting Scripts for Pashto Bible

This directory contains scripts to download and split Pashto Bible audio files from afghanbibles.org into individual verses.

## 📋 Available Scripts

### 1. `download_corinthians.js` - Basic Downloader
Downloads full chapter audio files and creates placeholder verse files.

```bash
node download_corinthians.js
```

**Features:**
- Downloads all chapters of 1 & 2 Corinthians
- Creates placeholder verse files (copies full chapter)
- No audio splitting (basic approach)

### 2. `split_audio_by_jktags.js` - Advanced Splitter
Downloads and splits audio using jktags from the website.

```bash
node split_audio_by_jktags.js
```

**Features:**
- Extracts jktags from webpage
- Attempts to decode time markers
- Uses ffmpeg to split audio files
- Creates individual verse files

## 🎯 Prerequisites

### Install ffmpeg (Required for splitting)
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows (using Chocolatey)
choco install ffmpeg
```

### Node.js Requirements
- Node.js 18+
- Built-in modules (fs, path, https, child_process)

## 📁 Output Structure

```
corinthians_split_audio/
├── 1-corinthians/
│   ├── 1-corinthians-1.mp3
│   ├── chapter-1-verses/
│   │   ├── verse-1.mp3
│   │   ├── verse-2.mp3
│   │   └── ...
│   └── chapter-2-verses/
│       └── ...
└── 2-corinthians/
    └── ...
```

## 🔧 How the Jktags Work

The website uses encoded "jktags" to mark verse boundaries in the audio. The script:

1. **Fetches the webpage** for each chapter
2. **Extracts the jktags** from a hidden input field
3. **Decodes the markers** to find verse start times
4. **Uses ffmpeg** to split the audio at those points

### Example Jktags Format
```
1&[encoded_data_containing_time_markers]
```

## 🛠️ Troubleshooting

### RLS Policy Errors (Upload Fails)
If uploads fail with "violates row-level security policy":
1. Go to your Supabase Dashboard → Storage → audio bucket → Policies
2. Or run the SQL commands from `fix_rls_policies.sql` in the SQL Editor
3. The policies need to allow INSERT and UPDATE for anon users on the audio bucket

### Jktags Not Found
If the script can't find jktags, it will skip that chapter. You can:
1. Check the website manually
2. Use the ManualAudioSplitter class
3. Add manual time markers

### ffmpeg Not Found
```bash
# Install ffmpeg
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Ubuntu
```

### Network Issues
- The script includes delays between requests
- If downloads fail, try again later
- Check your internet connection

## 📝 Manual Time Markers

If automatic jktags decoding fails, you can add manual markers:

```javascript
// In split_audio_by_jktags.js, modify ManualAudioSplitter
this.manualMarkers = {
  '1-corinthians-1': [
    { verse: 1, startTime: 0 },
    { verse: 2, startTime: 15 },
    { verse: 3, startTime: 35 },
    // Add more based on audio timing
  ]
};
```

## 🎵 Audio Quality

- **Source**: MP3 files from afghanbibles.org
- **Quality**: Preserved during splitting (no re-encoding)
- **Format**: Individual MP3 files per verse
- **Naming**: `verse-{number}.mp3`

## ⚡ Performance

- **Downloads**: Sequential with 1-2 second delays
- **Splitting**: Uses ffmpeg for fast, lossless cuts
- **Storage**: ~50MB per book (full chapters)
- **Time**: ~5-10 minutes for complete processing

## 🔍 Testing Individual Chapters

Test a single chapter first:

```bash
# Test just 1 Corinthians chapter 1
node -e "
const splitter = require('./split_audio_by_jktags.js');
const s = new splitter.AudioSplitter();
s.processChapter('1-corinthians', 1);
"
```

## 📊 Expected Results

For 1 Corinthians (16 chapters):
- **29 chapters total** (1 Cor: 16, 2 Cor: 13)
- **~500+ verse files** created
- **~100MB** total storage

## 🚨 Important Notes

1. **Respectful Usage**: Scripts include delays to avoid overwhelming the server
2. **Legal**: Ensure you have permission to download and use the audio
3. **Backup**: Keep original files as backup
4. **Testing**: Test with one chapter first before running all

## 🎯 Next Steps

1. **Run the basic downloader** first to get all chapters
2. **Install ffmpeg** for splitting
3. **Test the advanced splitter** on one chapter
4. **Scale up** to all chapters once working

---

**Happy splitting! 🎵✂️**
