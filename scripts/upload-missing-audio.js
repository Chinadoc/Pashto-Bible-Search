const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_ROOT = '/Users/jeremysamuels/Documents/pashto-bible-search-corrupted/Pashto new testament with audio';
const MISSING_CHAPTERS = [2, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 19, 20];

async function uploadMissingAudio() {
    console.log('🚀 Starting upload of missing Acts audio files...');

    for (const chapter of MISSING_CHAPTERS) {
        const dirName = `pashtoacts${chapter}`;
        const dirPath = path.join(SOURCE_ROOT, dirName);

        if (!fs.existsSync(dirPath)) {
            console.warn(`⚠️ Directory not found: ${dirPath}`);
            continue;
        }

        console.log(`\n📂 Processing Acts ${chapter} from ${dirName}...`);
        const files = fs.readdirSync(dirPath);

        // Filter for valid audio files
        // Regex matches: acts2_verse_1.mp3 or acts2_verse_01.mp3
        // It ignores duplicates like "acts2_verse_1 2.mp3" unless we want to use them as fallback
        const validFiles = files.filter(f => /^acts\d+_verse_\d+\.mp3$/.test(f));

        console.log(`   Found ${validFiles.length} valid files.`);

        for (const file of validFiles) {
            const fullPath = path.join(dirPath, file);

            // Parse verse number to ensure 3-digit padding in key if needed?
            // The current keys in DB are like 'afghan2023/nt/acts10_verse_001.mp3'
            // But the file on disk is 'acts2_verse_41.mp3' (no padding for verse?)
            // Wait, let's check the filename format again from the find_by_name output.
            // "acts2_verse_41.mp3" -> 2 digits.
            // The DB keys I saw earlier were "acts10_verse_001.mp3".
            // I should normalize the key to use 3 digits for verse if that's the standard.
            // The populate script expects: `verse_${verse.toString().padStart(3, '0')}`?
            // Let's check populate-audio-keys.js logic.
            // It parses the KEY. So if I upload as `acts2_verse_41.mp3`, it will parse verse 41.
            // But for consistency, I should probably pad it.
            // However, the populate script parses whatever is there.
            // Let's stick to the filename for now, OR pad it to match the others.
            // The others seem to have padding (001, 002).
            // So I will pad the verse in the R2 KEY.

            const match = file.match(/verse_(\d+)\.mp3$/);
            if (!match) continue;

            const verseNum = parseInt(match[1]);
            const paddedVerse = verseNum.toString().padStart(3, '0');
            const r2Key = `afghan2023/nt/acts${chapter}_verse_${paddedVerse}.mp3`;

            console.log(`   ⬆️ Uploading ${file} -> ${r2Key}...`);

            try {
                // Use wrangler to upload
                // Quote the file path to handle spaces
                execSync(`npx wrangler r2 object put "pashto-bible-audio/${r2Key}" --file="${fullPath}" --remote`, { stdio: 'pipe' });
                // console.log(`      ✅ Uploaded`);
            } catch (error) {
                console.error(`      ❌ Failed to upload ${file}:`, error.message);
            }
        }
    }

    console.log('\n✅ Upload process complete!');
}

uploadMissingAudio();
