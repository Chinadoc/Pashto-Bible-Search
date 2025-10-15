# Yousafzai Audio Google Drive Upload Scripts

This directory contains scripts to upload Yousafzai audio files to Google Drive and create the `yousafzai_google_drive_audio_urls.json` file.

## Scripts Overview

### 1. `generate_yousafzai_audio_map.py`
- Scans the `yousafzai_audio_files/` directory
- Creates initial `yousafzai_google_drive_audio_urls.json` with placeholder file IDs
- **Run this first** to set up the file structure

### 2. `test_yousafzai_upload.py`
- Tests Google Drive authentication and upload with 3 sample files
- **Run this second** to verify everything works before full upload

### 3. `batch_upload_yousafzai.py`
- Main upload script with exponential backoff and rate limiting
- Uploads all Yousafzai audio files in batches
- Updates `yousafzai_google_drive_audio_urls.json` with real file IDs

### 4. `retry_yousafzai_uploads.py`
- Retries failed uploads from the main script
- Handles rate limits and authentication issues
- Updates the JSON file with successful uploads

## Prerequisites

1. **Google Drive API Setup**:
   - `credentials.json` file in the project root
   - Google Drive API enabled in Google Cloud Console
   - Appropriate OAuth2 scopes configured

2. **Python Dependencies**:
   ```bash
   pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
   ```

3. **Audio Files**:
   - Yousafzai audio files in `yousafzai_audio_files/` directory
   - Organized by book/chapter structure

## Usage Instructions

### Step 1: Generate Initial Map
```bash
python3 generate_yousafzai_audio_map.py
```
This creates `yousafzai_google_drive_audio_urls.json` with placeholder file IDs.

### Step 2: Test Upload (Recommended)
```bash
python3 test_yousafzai_upload.py
```
This tests authentication and uploads 3 sample files to verify everything works.

### Step 3: Full Upload
```bash
python3 batch_upload_yousafzai.py
```
This uploads all Yousafzai audio files with:
- Batch processing (3 files per batch)
- Exponential backoff for retries
- Rate limiting between batches
- Progress saving after each batch

### Step 4: Retry Failed Uploads (if needed)
```bash
python3 retry_yousafzai_uploads.py
```
This retries any files that failed during the main upload.

## Features

### Exponential Backoff
- Automatic retry with increasing delays (2^attempt + jitter)
- Handles rate limits (403, 429) with longer waits
- Server errors (5xx) with shorter waits
- Authentication issues trigger re-auth

### Rate Limiting
- 3 files per batch to avoid quota issues
- 3-5 second delays between batches
- 60+ second waits for rate limit errors
- Random jitter to avoid synchronized requests

### Error Handling
- Detailed error logging with HTTP status codes
- Graceful handling of missing files
- Progress saving to prevent data loss
- Authentication token refresh

### File Organization
- Maintains book/chapter/verse structure
- Consistent filename patterns
- Local path tracking for verification
- Google Drive URL generation

## Output File Structure

The `yousafzai_google_drive_audio_urls.json` file contains entries like:

```json
{
  "yousafzai_genesis001_verse_001.mp3": {
    "book": "genesis",
    "chapter": 1,
    "verse": 1,
    "google_drive_file_id": "1ABC123...",
    "google_drive_url": "https://drive.google.com/uc?id=1ABC123...&export=download",
    "local_path": "yousafzai_audio_files/genesis/chapter-1-verses/yousafzai_genesis001_verse_001.mp3",
    "folder_path": "genesis/chapter-1-verses/yousafzai_genesis001_verse_001.mp3"
  }
}
```

## Troubleshooting

### Authentication Issues
- Ensure `credentials.json` is present and valid
- Check Google Cloud Console for API enablement
- Verify OAuth2 scopes include Drive access

### Rate Limiting
- Scripts automatically handle rate limits
- If persistent, reduce batch size in `batch_upload_yousafzai.py`
- Consider running during off-peak hours

### File Not Found Errors
- Verify `yousafzai_audio_files/` directory exists
- Check file permissions
- Ensure audio files are properly organized

### Upload Failures
- Check Google Drive storage quota
- Verify file formats are supported
- Review error messages for specific issues

## Monitoring Progress

The scripts provide detailed progress information:
- Batch processing status
- Individual file upload results
- Success/failure counts
- Rate limit handling
- Progress saving confirmations

## Integration

Once uploads are complete, the `yousafzai_google_drive_audio_urls.json` file can be used by:
- Frontend applications for audio playback
- Database updates with Google Drive URLs
- Audio streaming services
- Backup and archival systems

## Security Notes

- Keep `credentials.json` secure and never commit to version control
- Use service accounts for production deployments
- Implement proper access controls for Google Drive folders
- Monitor API usage and quotas regularly
