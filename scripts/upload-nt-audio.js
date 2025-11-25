const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_ROOT = '/Users/jeremysamuels/Documents/pashto-bible-search-corrupted/Pashto new testament with audio';

// List of NT books to process (matching directory names)
const BOOKS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
    '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
    '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus', 'philemon',
    'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'
];

// Map directory names to R2 key book names if different
// Directory: pashtomatthew1 -> matthew
// R2 Key: afghan2023/nt/matthew1_verse_001.mp3
// Actually, R2 keys use full book names? 
// Let's check populate-audio-keys.js: it expects `afghan2023/nt/[filename]`.
// And filename is `matthew1_verse_001.mp3`.
// So I just need to construct the filename correctly.

async function uploadAudio() {
    console.log('🚀 Starting upload of ALL NT audio files...');
    let totalUploaded = 0;
    let totalErrors = 0;

    for (const book of BOOKS) {
        // Find all chapter directories for this book
        // They are named pashto[book][chapter]
        // e.g. pashtomatthew1, pashtomatthew2

        // We can just look for directories starting with pashto[book]
        // But some books might be prefixes of others (e.g. john vs 1john).
        // So we should be careful.
        // Actually, the directory list showed `pashtomatthew1`, `pashto1john1`.
        // So the prefix includes `pashto`.

        // Let's iterate chapters 1 to 28 (max chapters in NT is 28 for Matthew/Acts).
        // Some books have fewer. We'll just check if dir exists.

        for (let chapter = 1; chapter <= 28; chapter++) {
            const dirName = `pashto${book}${chapter}`;
            const dirPath = path.join(SOURCE_ROOT, dirName);

            if (!fs.existsSync(dirPath)) {
                // If chapter 1 doesn't exist, maybe the book name is wrong?
                // But for Matthew, it should exist.
                // We'll just skip.
                continue;
            }

            console.log(`\n📂 Processing ${book} ${chapter}...`);
            const files = fs.readdirSync(dirPath);

            // Filter for valid audio files
            // Regex: [book][chapter]_verse_[verse].mp3
            // e.g. matthew1_verse_1.mp3
            // Note: regex should be flexible about the book name part because file names might match directory names?
            // In pashtomatthew1, files are matthew1_verse_1.mp3.
            // In pashtoacts1, files are acts1_verse_1.mp3.
            // So file prefix matches book+chapter.

            const validFiles = files.filter(f => f.endsWith('.mp3') && !f.includes(' 2.mp3')); // Exclude duplicates

            console.log(`   Found ${validFiles.length} files.`);

            for (const file of validFiles) {
                // Construct R2 key
                // We want: afghan2023/nt/[book][chapter]_verse_[padded_verse].mp3
                // The file on disk: [book][chapter]_verse_[verse].mp3

                const match = file.match(/_verse_(\d+)\.mp3$/);
                if (!match) {
                    console.warn(`   ⚠️ Skipping ${file} (no verse number found)`);
                    continue;
                }

                const verseNum = parseInt(match[1]);
                const paddedVerse = verseNum.toString().padStart(3, '0');

                // Construct the filename for R2
                // We should use the book name from the loop, or extract from file?
                // File: matthew1_verse_1.mp3
                // Target: matthew1_verse_001.mp3

                // Extract the prefix (book+chapter) from the file name
                const prefix = file.substring(0, file.indexOf('_verse_'));
                const r2Filename = `${prefix}_verse_${paddedVerse}.mp3`;
                const r2Key = `afghan2023/nt/${r2Filename}`;

                // console.log(`   ⬆️ Uploading ${file} -> ${r2Key}...`);

                try {
                    // Use wrangler to upload
                    // We use --force to overwrite if needed? No, r2 put overwrites by default.
                    // We'll use stdio: 'ignore' to keep logs clean, unless error.
                    execSync(`npx wrangler r2 object put "pashto-bible-audio/${r2Key}" --file="${path.join(dirPath, file)}" --remote`, { stdio: 'pipe' });
                    process.stdout.write('.'); // Progress dot
                    totalUploaded++;
                } catch (error) {
                    console.error(`\n      ❌ Failed to upload ${file}:`, error.message);
                    totalErrors++;
                }
            }
        }
    }

    console.log(`\n\n✅ Upload process complete!`);
    console.log(`Uploaded: ${totalUploaded}`);
    console.log(`Errors: ${totalErrors}`);
}

uploadAudio();
