# Setup Google Drive API for Audio ID Extraction

## Overview

This guide helps you set up the Google Drive API to automatically extract file IDs and map audio files to Bible verses.

## Prerequisites

- Node.js 16+
- A Google account
- Access to the Google Drive folders with audio files

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it: `Pashto Bible Audio Mapper`
4. Click "Create"
5. Wait for the project to be created

## Step 2: Enable Google Drive API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for: `Google Drive API`
3. Click on "Google Drive API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - Click "External"
   - Fill in: App name: `Pashto Bible Audio`
   - Add your email as user
   - Click through the rest
4. Back to Credentials, click "Create Credentials" → "OAuth client ID"
5. Choose: "Desktop application"
6. Click "Create"
7. Click the download button (↓) to download the JSON file
8. Rename it to: `credentials.json`
9. Move it to your project root: `/Users/jeremysamuels/Documents/pashto-bible-search/credentials.json`

## Step 4: Update Folder IDs

Edit `scripts/fetch_audio_ids_from_drive.js` and update these folder IDs:

```javascript
const YOUSAFZAI_FOLDER_ID = '1m-Mv7r01GHTqXkz2FxAXfANn_7sSHRSUC';
const AFGHAN_FOLDER_ID = 'YOUR_AFGHAN_FOLDER_ID_HERE';
```

To find folder IDs:
1. Go to your Google Drive folder
2. Look at the URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`
3. Copy the `{FOLDER_ID}` part

## Step 5: Run the Script

```bash
cd /Users/jeremysamuels/Documents/pashto-bible-search

# Install googleapis package (if not already installed)
npm install googleapis

# Run the script
node scripts/fetch_audio_ids_from_drive.js
```

## Step 6: First Run Authorization

The first time you run the script:
1. It will print a URL
2. Copy and paste that URL into your browser
3. Google will ask permission
4. Click "Allow"
5. You'll be redirected - copy the authorization code
6. Paste it back into the terminal
7. The script will save the token for future runs

## Step 7: Review Output

The script will create:

- **`audio_mapping.csv`**: Mapping of verses to audio file IDs
- **`APPLY_AUDIO_IDS.sql`**: SQL statements to update Supabase

Check the CSV for any errors or unmapped files.

## Step 8: Apply to Supabase

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `APPLY_AUDIO_IDS.sql`
3. Click "Run"
4. Wait for completion

## Step 9: Test

1. Hard refresh your web app (Cmd+Shift+R)
2. Go to Chapters
3. Select a chapter
4. Verify audio plays correctly
5. Check different translations and books

## Troubleshooting

### "credentials.json not found"

Make sure the file is at the project root, not in a subdirectory.

### "Drive API not enabled"

Go back to Step 2 and enable it explicitly. Wait a minute for changes to propagate.

### No files found

- Verify the folder IDs are correct
- Make sure the audio files are in the root of those folders (not in subfolders)
- Check file permissions

### Parsing errors

If you see "Could not map book", the filename pattern doesn't match. Update the parsing functions in the script to handle your naming convention.

## Next Steps

After successful extraction and verification:
1. Delete `credentials.json` and `drive_token.json` from the repo (for security)
2. Test all chapters and verses
3. Report any mismatches

## Security Note

Never commit `credentials.json` or `drive_token.json` to version control. Add them to `.gitignore`.
