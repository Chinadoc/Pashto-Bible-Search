# Audio File Mapping Strategy

## Problem
- Yousafzai audio files have correct book/chapter/verse naming (e.g., `yousafzai_zechariah014_verse_011.mp3`)
- Afghan 2023 audio files need to be examined and possibly renamed
- Database has incorrect/placeholder audio IDs (578 verses share ID `1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY`)

## Solution: Create Audio ID Mapping

### Step 1: Extract Audio File Metadata from Google Drive

The audio files are organized by book and follow a naming pattern:
- **Yousafzai**: `yousafzai_{book_number}{bookname}_{chapter:02d}_verse_{verse:03d}.mp3`
- **Afghan 2023**: Files in folder - need to examine structure

Example from Google Drive:
- `yousafzai_zechariah014_verse_011.mp3` = Zechariah 14:11

### Step 2: Map File Names to Database Entries

Create a mapping table or update existing records with correct file IDs:

```
Book | Chapter | Verse | Yousafzai File ID | Afghan 2023 File ID
-----|---------|-------|-------------------|-------------------
Zechariah | 14 | 11 | {yousafzai_id} | {afghan_id}
```

### Step 3: Update Supabase with Correct IDs

Use SQL UPSERT to update audio_public_url with correct Google Drive links:

```sql
UPDATE public.verses_yousafzai
SET audio_public_url = 'https://drive.google.com/uc?id=CORRECT_ID&export=download'
WHERE book = 'Zechariah' AND chapter = 14 AND verse = 11;
```

### Step 4: Clear Incorrect Audio Entries

Remove placeholder audio IDs that don't match their verses:

```sql
-- Remove the placeholder audio ID
UPDATE public.verses
SET audio_public_url = NULL, audio_storage_path = NULL
WHERE audio_public_url LIKE '%1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY%';
```

## Next Actions

1. **Export file listing** from Google Drive folders (both Yousafzai and Afghan 2023)
2. **Parse file names** to extract book/chapter/verse information
3. **Extract file IDs** from each file using Google Drive API or by inspecting the folder structure
4. **Create mapping CSV** with verse references and correct file IDs
5. **Run batch SQL updates** to populate database with correct IDs
6. **Test audio playback** for sample verses from each book

## File ID Extraction

To get the file ID from a Google Drive shared link:
- **Shared link format**: `https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link`
- **Direct download URL**: `https://drive.google.com/uc?id={FILE_ID}&export=download`

Example: `1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2` → `https://drive.google.com/uc?id=1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2&export=download`
