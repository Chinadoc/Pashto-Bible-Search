# 🔄 Fresh Migration Plan - Verse-to-Audio Matching

## 📊 Current Situation

- **Total verses**: 30,410
- **Audio files with verse pattern**: 28,900 (95% coverage)
- **Audio mappings in CSV**: 28,900
- **Missing audio**: ~1,510 verses (5%)

## ✅ Migration Strategy

1. **Reset D1 database** (fresh start)
2. **Load audio mapping CSV** to match verses to audio files
3. **Migrate verses** with proper `audio_r2_key` fields
4. **Upload only matched audio files** to R2 (not chapter-level files)
5. **Track missing audio** for later completion

## 📝 Process

1. Parse `yousafzai_audio_mapping.csv` to create verse → audio filename mapping
2. For each verse in `yousafzai_all_verses.json`:
   - Look up audio filename from mapping
   - Set `audio_r2_key` = `yousafzai/{testament}/{filename}`
   - If no mapping found, mark as missing audio
3. Upload only the 28,900 matched audio files to R2
4. Report verses without audio

---

## 🚀 Ready to Execute

This ensures:
- ✅ 1:1 verse-to-audio matching
- ✅ No orphaned audio files
- ✅ Proper R2 key structure
- ✅ Clear tracking of missing audio


