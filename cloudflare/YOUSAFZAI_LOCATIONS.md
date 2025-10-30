# 📁 Yousafzai Data Locations

## ✅ Found Local Files

### 📖 Text/Verse Data

1. **Main verses file** (19MB):
   - `yousafzai_all_verses.json` - Complete verse data
   - `app/data/yousafzai_all_verses.json` - Copy in app directory

2. **Word frequency data**:
   - `yousafzai_word_frequency_list.json`
   - `app/data/yousafzai_word_frequency_list.json`
   - `app/data/yousafzai_word_frequency_list_enriched.json`

3. **Individual book files**:
   - `yousafzai_genesis_verses.json`
   - `yousafzai_exodus_verses.json`
   - ... (66 book files total)

### 🎵 Audio Files

1. **Main audio directory**:
   - `yousafzai_audio_files/` 
   - Organized by book/chapter structure
   - File naming: `yousafzai_{book}{chapter}_verse_{verse}.mp3`
   - Example: `yousafzai_genesis001_verse_001.mp3`

2. **Additional audio**:
   - `Pashto new testament with audio/` directory

### 📊 Other Data Files

- `yousafzai_audio_mapping.csv` - Audio URL mappings
- `yousafzai_google_drive_audio_urls.json` - Google Drive links
- `app/data/` - Various processed data files

---

## 🚀 Ready to Migrate

All data is **locally stored** and ready for migration to Cloudflare D1 + R2!

**Next Steps:**
1. Reset D1 database (fresh start)
2. Migrate all verses from `yousafzai_all_verses.json`
3. Migrate audio files from `yousafzai_audio_files/` to R2
4. Migrate word frequencies and other data


