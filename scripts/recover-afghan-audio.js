const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Configuration
const BASE_URL = 'https://afghanbibles.org';
const OUTPUT_DIR = 'recovered_audio';
const R2_BUCKET = 'pashto-bible-audio';

// Books to recover (numbered books missing in Afghan 2023)
const BOOKS_TO_RECOVER = [
    { name: '1-corinthians', chapters: 16 },
    { name: '2-corinthians', chapters: 13 },
    { name: '1-thessalonians', chapters: 5 },
    { name: '2-thessalonians', chapters: 3 },
    { name: '1-timothy', chapters: 6 },
    { name: '2-timothy', chapters: 4 },
    { name: '1-peter', chapters: 5 },
    { name: '2-peter', chapters: 3 },
    { name: '1-john', chapters: 5 },
    { name: '2-john', chapters: 1 },
    { name: '3-john', chapters: 1 }
];

// Decoding Logic (Reverse Engineered)
function avRev(i) {
    let o = "";
    for (let t = i.length - 1; t >= 0; --t) o += i[t];
    return o;
}

function avRot13(i) {
    return i.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

function avDec(i) {
    // 1. Reverse
    let reversed = avRev(i);
    // 2. Replace padding
    let padded = reversed.replace(/&1/g, "=").replace(/&2/g, "==").replace(/&3/g, "===").replace(/&41/g, "====");
    // 3. Rot13
    let rotated = avRot13(padded);
    // 4. Base64 Decode
    return Buffer.from(rotated, 'base64').toString('utf-8');
}

function decodeJkTags(tagString) {
    try {
        const decodedJson = avDec(tagString);
        // The decoded string is a list of arrays, e.g. "[[0, 5], [5, 10]]"
        // But the original code wraps it in brackets: JSON.parse("[" + decoded + "]")
        // Let's check if it needs wrapping.
        // Based on the screenshot, the decoded string might be comma separated arrays?
        // The original code: JSON.parse("["+avDec(...)+"]")
        // So avDec returns "item1, item2".
        return JSON.parse("[" + decodedJson + "]");
    } catch (e) {
        console.error("Error decoding tags:", e.message);
        return null;
    }
}

async function fetchPageContent(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function processChapter(book, chapter) {
    const bookSlug = book.name;
    const chapterSlug = `${book.name}-${chapter}`;
    const pageUrl = `${BASE_URL}/eng/pashto-bible/${bookSlug}/${chapterSlug}`;

    console.log(`\nProcessing ${book.name} Chapter ${chapter}...`);
    console.log(`  Fetching ${pageUrl}`);

    try {
        const html = await fetchPageContent(pageUrl);

        // Extract jktags
        const tagMatch = html.match(/data-tags=["']([^"']+)["']/);
        if (!tagMatch) {
            console.error("  ❌ No jktags found!");
            return;
        }

        const tags = decodeJkTags(tagMatch[1]);
        if (!tags) {
            console.error("  ❌ Failed to decode tags");
            return;
        }
        console.log(`  ✅ Decoded ${tags.length} timing segments`);

        // Extract Audio URL
        // Look for <audio> tag or similar. The screenshot showed an MP3 download link.
        // Or maybe it's constructed?
        // The user request said: "https://afghanbibles.org/pashto-afeastern-audio/1-corinthians-1.mp3"
        // Let's try to construct it or find it in HTML.

        // Try to find .mp3 link in HTML
        const mp3Match = html.match(/href="([^"]+\.mp3)"/);
        let audioUrl;
        if (mp3Match) {
            audioUrl = mp3Match[1];
            if (audioUrl.startsWith('/')) audioUrl = BASE_URL + audioUrl;
        } else {
            // Fallback to constructed URL
            // https://afghanbibles.org/pashto-afeastern-audio/1-corinthians-1.mp3
            audioUrl = `${BASE_URL}/pashto-afeastern-audio/${chapterSlug}.mp3`;
        }

        console.log(`  Audio URL: ${audioUrl}`);

        // Create temp dir
        const tempDir = path.join(OUTPUT_DIR, book.name, `chapter${chapter}`);
        fs.mkdirSync(tempDir, { recursive: true });

        const masterAudioPath = path.join(tempDir, 'master.mp3');

        if (!fs.existsSync(masterAudioPath)) {
            console.log("  Downloading master audio...");
            await downloadFile(audioUrl, masterAudioPath);
        }

        // Aggregate segments by verse
        const verseSegments = {};

        tags.forEach(segment => {
            const [start, end, label] = segment;

            // Check if label is a verse number (integer)
            if (typeof label === 'number') {
                if (!verseSegments[label]) {
                    verseSegments[label] = { start: start, end: end };
                } else {
                    // Update end time (assuming segments are sequential)
                    verseSegments[label].end = Math.max(verseSegments[label].end, end);
                    // Update start time just in case
                    verseSegments[label].start = Math.min(verseSegments[label].start, start);
                }
            }
        });

        console.log(`  Found ${Object.keys(verseSegments).length} verses in tags`);

        // Split audio
        console.log("  Splitting audio...");

        for (const [verseNum, timing] of Object.entries(verseSegments)) {
            const start = timing.start;
            const end = timing.end;

            const paddedVerse = verseNum.toString().padStart(3, '0');
            const internalBookName = book.name.replace(/-/g, '');
            const outputFilename = `${internalBookName}${chapter}_verse_${paddedVerse}.mp3`;
            const outputPath = path.join(tempDir, outputFilename);

            // ffmpeg command
            try {
                execSync(`ffmpeg -y -i "${masterAudioPath}" -ss ${start} -to ${end} -c copy "${outputPath}"`, { stdio: 'ignore' });
            } catch (e) {
                console.error(`    ❌ Failed to split verse ${verseNum}`);
            }

            // Upload to R2
            const r2Key = `afghan2023/nt/${outputFilename}`;
            try {
                execSync(`npx wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file="${outputPath}" --remote`, { stdio: 'ignore' });
                process.stdout.write('.');
            } catch (e) {
                console.error(`    ❌ Failed to upload ${r2Key}`);
            }
        }
        console.log("\n  ✅ Chapter complete.");

    } catch (e) {
        console.error(`  ❌ Error processing chapter: ${e.message}`);
    }
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

    console.log(`Starting recovery for ${BOOKS_TO_RECOVER.length} books...`);

    for (const book of BOOKS_TO_RECOVER) {
        console.log(`\n📘 Processing Book: ${book.name} (${book.chapters} chapters)`);
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
            await processChapter(book, chapter);
            // Polite delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    console.log("\n🎉 All books processed!");
}

main();
