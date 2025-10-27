# Quick Manual Audio Mapping

Since OAuth redirect URIs are causing issues, let's use the simpler manual approach.

## Step 1: Create audio_files.txt

Create a file in your project root: `audio_files.txt`

## Step 2: Get File IDs from Google Drive

For each audio file in your Drive folders:
1. Right-click the file → "Get link"
2. Copy the link (format: `https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link`)
3. Extract just the `{FILE_ID}` part

## Step 3: Format for audio_files.txt

Each line should be: `filename.mp3,FILE_ID`

Example for Yousafzai folder:
```
yousafzai_genesis001_verse_001.mp3,1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2
yousafzai_genesis001_verse_002.mp3,1dGh5_7kL9mN2oPq3rSt4uVw5xYz6aB7
yousafzai_genesis001_verse_003.mp3,1aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpP
```

Example for Afghan 2023:
```
afghan_genesis_1_1.mp3,1zZ0yY1xX2wW3vV4uU5tT6sS7rR8qQ9pP
afghan_genesis_1_2.mp3,1aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK
```

## Step 4: Run the Mapping Script

```bash
node scripts/generate_audio_mapping_manual.js
```

This will:
- Read `audio_files.txt`
- Parse filenames to extract book/chapter/verse
- Generate `APPLY_AUDIO_IDS.sql`
- Output status

## Step 5: Apply to Supabase

1. Go to Supabase SQL Editor
2. Copy contents of `APPLY_AUDIO_IDS.sql`
3. Paste and run
4. Done!

## Advantages

✅ No authentication issues
✅ Fast and simple
✅ You control which files to include
✅ Instant verification

## Your Google Drive Folders

- Yousafzai: https://drive.google.com/drive/folders/1m-Mv7r01GHTqXkz2FxAXfANn_7sSHRSUC
- Afghan 2023 OT: https://drive.google.com/drive/folders/1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC

Just get the file IDs and populate `audio_files.txt`!
