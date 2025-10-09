# OT Audio Automation System

**Your site now automatically stays updated with individual OT verse audio files from Afghan Bibles!** 🎵📖

## 🎯 What This System Does

- **Automatically monitors** Afghan Bibles for new OT audio content
- **Downloads chapter audio** files when they're updated
- **Splits into individual verse files** using timing data
- **Uploads to Supabase Storage** for fast access
- **Updates database** with audio URLs for each verse
- **Triggers rebuilds** so users can immediately access new audio

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Afghan Bibles  │───▶│  Automated       │───▶│  Supabase       │
│  (afghanbibles. │    │  Pipeline        │    │  Storage        │
│   org)          │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Individual      │    │  Database       │
                       │  Verse Files     │    │  Updates        │
                       │                  │    │                 │
                       └──────────────────┘    └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │  Live Site      │
                                        │  Audio Access   │
                                        └─────────────────┘
```

## 📁 File Storage Structure

```
ot_audio_files/                    # Local processing directory
├── isaiah_1.mp3                  # Full chapter audio (temp)
└── isaiah/
    └── chapter-1-verses/
        ├── isaiah001_verse_001.mp3
        ├── isaiah001_verse_002.mp3
        └── ... (31 files for Isaiah 1)

Supabase Storage: audio/ot/       # Live storage
├── isaiah/chapter-1-verses/
│   ├── isaiah001_verse_001.mp3
│   └── ...
└── genesis/chapter-1-verses/
    └── ...
```

## 🔄 Complete Automation Pipeline

The system runs these steps automatically:

### 1. **Monitor** (`monitor_ot_audio.py`)
```bash
python3 scripts/monitor_ot_audio.py --books genesis --download
```
- Checks Afghan Bibles for new/updated audio
- Downloads chapter MP3 files
- Extracts jktags timing data from HTML

### 2. **Split Audio** (Built into monitor)
- Decodes ROT13/Base64 timing data
- Uses ffmpeg to split chapter into verses
- Creates individual `book###_verse_###.mp3` files

### 3. **Upload** (`upload_ot_audio.py`)
```bash
python3 scripts/upload_ot_audio.py
```
- Uploads verse files to Supabase Storage
- Handles rate limiting and retries
- Updates `audio_file_map.json`

### 4. **Update Database** (`upload_ot_audio.py --update-db-only`)
```bash
python3 scripts/upload_ot_audio.py --update-db-only
```
- Updates verse records with `audio_verse_url`
- Sets `audio_storage_filename` for tracking

### 5. **Rebuild** (`rebuild_data_indexes.py`)
```bash
python3 rebuild_data_indexes.py
```
- Rebuilds search indexes
- Makes new audio immediately available

## 🚀 Quick Start - Make It Automatic

### Option 1: One-Time Setup (Recommended)
```bash
# Run the complete automated pipeline
python3 scripts/automate_ot_audio.py
```

### Option 2: Manual Step-by-Step
```bash
# 1. Monitor and download
python3 scripts/monitor_ot_audio.py --books genesis --download

# 2. Update file map
python3 scripts/update_ot_audio_map.py

# 3. Upload to Supabase
python3 scripts/upload_ot_audio.py

# 4. Update database URLs
python3 scripts/upload_ot_audio.py --update-db-only

# 5. Rebuild indexes
python3 rebuild_data_indexes.py
```

### Option 3: Set Up Daily Automation
```bash
# Set up cron job for daily runs
bash scripts/setup_ot_audio_cron.sh
```

This creates a cron job that runs daily at 3:00 AM:
```bash
0 3 * * * cd "/path/to/project" && python3 scripts/automate_ot_audio.py >> ot_audio_cron.log 2>&1
```

## 🔧 Configuration Required

### Environment Variables
Set these in your `.env.local` or deployment environment:

```bash
# Supabase (required for automatic uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External monitoring (optional)
EXTERNAL_UPDATE_WEBHOOK_URL=https://your-domain.vercel.app/api/external-updates
EXTERNAL_UPDATE_WEBHOOK_SECRET=your-webhook-secret
```

### Supabase Setup
1. Create an `audio` bucket in Supabase Storage
2. Set bucket to public access
3. Enable RLS policies for audio files

## 📊 Monitoring & Status

### Check Current Status
```bash
# View dashboard
python3 scripts/ot_audio_dashboard.py

# Check recent activity
tail -f ot_audio_cron.log

# View pipeline logs
tail -f ot_audio_pipeline.log
```

### Files to Monitor
- `ot_audio_cache.json` - Monitoring state
- `ot_audio_pipeline.log` - Pipeline execution logs
- `ot_audio_cron.log` - Cron job output
- `audio_file_map.json` - Current mappings

## 🎵 How Audio Access Works

When users click play on a verse:

1. **Frontend** calls `/api/audio_url?ref=Genesis%201:1`
2. **API** looks up verse in database `audio_map` table
3. **Supabase** generates signed URL for the audio file
4. **Player** streams audio directly from Supabase Storage

## 🛠️ Troubleshooting

### Common Issues

**1. ffmpeg not found**
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg
```

**2. Supabase upload fails**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify `audio` bucket exists and is public
- Check Supabase dashboard for storage permissions

**3. Database update fails**
- Ensure verses table exists with `audio_verse_url` column
- Check database permissions
- Use `--update-db-only` flag to retry

**4. Cron job not running**
```bash
# Check cron jobs
crontab -l

# Test manually
cd /path/to/project && python3 scripts/automate_ot_audio.py
```

### Recovery Commands

**Force reprocess a book:**
```bash
rm -f ot_audio_cache.json
python3 scripts/automate_ot_audio.py
```

**Skip upload, just update database:**
```bash
python3 scripts/upload_ot_audio.py --update-db-only
```

**Manual cleanup:**
```bash
# Remove old files (>7 days)
python3 scripts/automate_ot_audio.py  # Runs cleanup automatically
```

## 📈 Performance & Scaling

- **Rate Limiting**: Built-in delays prevent server overload
- **Incremental Updates**: Only processes changed content
- **Caching**: Avoids re-downloading existing files
- **Cleanup**: Automatically removes temporary files

## 🔮 Future Enhancements

- **Multi-book processing**: Process all OT books in parallel
- **Real-time monitoring**: Instant updates via webhooks
- **Quality validation**: Check audio file integrity
- **CDN integration**: Faster global delivery
- **Backup systems**: Automatic file backups

## 🎯 Result

Your site now has a **fully automated OT audio system** that:

- ✅ Monitors Afghan Bibles daily for updates
- ✅ Downloads and processes new audio content
- ✅ Provides individual verse audio for all OT books
- ✅ Updates automatically without manual intervention
- ✅ Serves audio via fast Supabase Storage
- ✅ Maintains high performance and reliability

**Users can now access individual verse audio for the entire Old Testament!** 🎉

---

*This system transforms chapter-level audio into individual verse files, making your Pashto Bible the most comprehensive audio Bible available.*

