# Source of Truth: Afghan Bibles

## 🎯 Primary Source

**Website**: https://afghanbibles.org/eng/pashto-bible/

This is the **official source of truth** for:
- ✅ **Afghan 2023** translation (text + audio)
- ✅ **Yousafzai 2019** translation (text + audio)

### File Organization

Files are organized by book and chapter:
- Example: https://afghanbibles.org/eng/pashto-bible/judges/judges-1
- Supports both translations with toggle switch
- Audio files (MP3) available for download
- PDF versions available (A4, Mobile, Tablet)

---

## 📋 Current Migration Status

### Initial Migration (One-Time)
- ✅ Migrating existing local files to Cloudflare D1 + R2
- ✅ Using local JSON files: `yousafzai_all_verses.json` and `cache/verses.json.gz`
- ✅ Using local MP3 files from various directories

### Future Updates
Since files change occasionally, we'll need to:
1. Monitor afghanbibles.org for updates
2. Download new/changed files
3. Sync to Cloudflare D1 + R2

---

## 🔄 Future Sync Strategy

### Option 1: Manual Sync (When Needed)
1. Download new files from afghanbibles.org
2. Add to local directories
3. Re-run migration scripts (idempotent - skips existing files)

### Option 2: Automated Sync Script
Create a script that:
1. Scrapes afghanbibles.org for available books/chapters
2. Downloads missing or updated files
3. Compares checksums to detect changes
4. Updates D1 + R2 accordingly

**Recommendation**: Start with manual sync, add automation later if updates are frequent.

---

## 📝 Notes

- Both translations are maintained on the same site
- Audio files are chapter-level (not verse-level) based on the site structure
- Files can be downloaded directly or streamed
- PDF versions are also available but not currently in scope

---

**Last Updated**: Initial migration setup
**Next Review**: After initial migration completes


