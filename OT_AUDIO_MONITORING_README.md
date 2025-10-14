# OT Audio Monitoring System

This system automatically monitors and syncs Old Testament audio content from Afghan Bibles (afghanbibles.org) with your Pashto Bible Search application.

## Overview

The OT Audio Monitoring System consists of several components that work together to:

1. **Monitor** Afghan Bibles website for new/updated OT audio files
2. **Download** new audio files when they're detected
3. **Update** your audio file mappings
4. **Trigger** data rebuilds and deployments
5. **Report** status and handle errors

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Afghan Bibles  │───▶│  Monitoring     │───▶│  Your Site      │
│  (afghanbibles. │    │  Scripts         │    │                 │
│   org)          │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  n8n Workflow    │
                       │  (optional)      │
                       └──────────────────┘
```

## Components

### 1. OT Audio Monitor (`scripts/monitor_ot_audio.py`)
- Monitors all 39 OT books for audio file changes
- Downloads new/modified audio files
- Maintains cache of file hashes and metadata
- Supports individual book monitoring for testing

### 2. Audio Map Updater (`scripts/update_ot_audio_map.py`)
- Updates `audio_file_map.json` with new OT audio files
- Generates Google Drive-style file IDs for compatibility
- Integrates with existing audio system

### 3. External Monitoring Service (`external_monitoring_service.py`)
- Extended to detect OT audio file changes
- Handles both text and audio content monitoring
- Integrates with n8n workflows for automation

### 4. External Updates API (`app/api/external-updates/route.ts`)
- Processes webhook notifications from monitoring system
- Handles OT audio file downloads and processing
- Triggers data rebuilds after updates

### 5. Setup Script (`scripts/setup_ot_audio_monitoring.py`)
- Validates environment and dependencies
- Sets up directories and configuration
- Creates cron jobs for automation
- Provides monitoring dashboard

## Setup Instructions

### 1. Initial Setup

Run the setup script to configure everything:

```bash
python3 scripts/setup_ot_audio_monitoring.py
```

This will:
- Validate your environment
- Create necessary directories
- Update configuration files
- Test the monitoring system
- Set up automated monitoring

### 2. Manual Testing

Test the monitoring system with specific books:

```bash
# Test monitoring without downloading
python3 scripts/monitor_ot_audio.py --books genesis psalms

# Test with downloading
python3 scripts/monitor_ot_audio.py --books genesis --download

# Update audio file map
python3 scripts/update_ot_audio_map.py
```

### 3. Automated Monitoring

Set up daily automated monitoring:

1. Edit your crontab: `crontab -e`
2. Add this line to run daily at 2 AM:
   ```
   0 2 * * * /path/to/pashto-bible-search/scripts/cron_ot_audio_monitor.sh
   ```

### 4. Monitoring Dashboard

Check the status of your OT audio monitoring:

```bash
python3 scripts/ot_audio_dashboard.py
```

## Configuration

### External Monitoring Config (`external_monitoring_config.json`)

Key settings for OT audio monitoring:

```json
{
  "monitoring": {
    "enabled": true,
    "check_interval_hours": 24,
    "books_to_monitor": ["genesis", "exodus", ..., "malachi"],
    "content_types": ["text", "audio", "metadata"],
    "request_delay_seconds": 1.0
  },
  "data_sync": {
    "auto_sync_enabled": true,
    "sync_on_update": true,
    "backup_before_sync": true
  }
}
```

### Environment Variables

Set these for webhook and deployment integration:

```bash
# For n8n integration
export N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook"
export N8N_API_KEY="your-api-key"

# For webhook security
export EXTERNAL_UPDATE_WEBHOOK_SECRET="your-secret"

# For deployment
export VERCEL_TOKEN="your-vercel-token"
export VERCEL_PROJECT_ID="your-project-id"
```

## File Structure

After setup, you'll have these additional files:

```
├── ot_audio_files/           # Downloaded OT audio files
├── ot_audio_cache.json       # Monitoring cache
├── ot_audio_monitor.log      # Monitoring logs
├── scripts/
│   ├── monitor_ot_audio.py
│   ├── update_ot_audio_map.py
│   ├── setup_ot_audio_monitoring.py
│   ├── ot_audio_dashboard.py
│   └── cron_ot_audio_monitor.sh
└── audio_file_map.json       # Updated with OT files
```

## How It Works

### 1. Monitoring Process

1. **Check for Updates**: The monitor checks each OT book chapter for audio file changes
2. **Compare Hashes**: Compares file hashes and metadata against cached values
3. **Detect Changes**: Identifies new, modified, or deleted audio files
4. **Download Files**: Downloads new/modified files to `ot_audio_files/`
5. **Update Cache**: Updates monitoring cache with new file information

### 2. Integration Process

1. **Webhook Notification**: Monitoring system sends updates to your API
2. **Process Updates**: External updates API processes the notifications
3. **Update Mappings**: Audio file map is updated with new file IDs
4. **Trigger Rebuild**: Data rebuild process updates search indexes
5. **Deploy Changes**: Automatic deployment to Vercel (if configured)

### 3. Audio File URLs

OT audio files are accessed via:
- **Direct URL**: `/pashto-afeastern-audio/{book}-{chapter}.mp3`
- **Example**: `https://afghanbibles.org/pashto-afeastern-audio/genesis-1.mp3`

## Troubleshooting

### Common Issues

1. **Network Timeouts**
   - Increase timeout values in scripts
   - Check network connectivity to afghanbibles.org

2. **Permission Errors**
   - Ensure scripts have execute permissions: `chmod +x scripts/*.py`
   - Check file system permissions for `ot_audio_files/`

3. **Missing Dependencies**
   - Install required packages: `pip install requests aiohttp`
   - Ensure Python 3.7+ is available

4. **Webhook Failures**
   - Check webhook URL and authentication
   - Verify n8n workflow is active

### Logs and Debugging

Check these log files for issues:
- `ot_audio_monitor.log` - Main monitoring activity
- `external_monitoring.log` - External monitoring service logs
- Vercel deployment logs (in dashboard)

### Manual Recovery

If automated monitoring fails:

```bash
# Force recheck all OT books
python3 scripts/monitor_ot_audio.py --download

# Rebuild audio mappings
python3 scripts/update_ot_audio_map.py

# Manual rebuild
python3 rebuild_data_indexes.py
```

## Performance Considerations

- **Rate Limiting**: Built-in delays prevent overwhelming the server
- **Caching**: File hashes prevent unnecessary downloads
- **Incremental Updates**: Only changed files are processed
- **Background Processing**: Long-running tasks don't block the API

## Security

- Respects `robots.txt` on afghanbibles.org
- Uses reasonable request delays
- Includes user agent identification
- Supports webhook authentication

## Future Enhancements

Potential improvements:
- Individual verse audio monitoring (when available)
- Audio quality validation
- Automatic audio transcription
- Multi-format audio support (MP3, OGG, etc.)
- CDN integration for faster delivery

## Support

For issues with OT audio monitoring:
1. Check the monitoring dashboard: `python3 scripts/ot_audio_dashboard.py`
2. Review log files for error messages
3. Test individual components manually
4. Verify network connectivity to afghanbibles.org

---

**Note**: This system is designed to be respectful of afghanbibles.org's servers and follows responsible web scraping practices. Always ensure compliance with their terms of service.

