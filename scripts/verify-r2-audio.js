const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const SOURCE_ROOT = '/Users/jeremysamuels/Documents/pashto-bible-search-corrupted/Pashto new testament with audio';

const BOOKS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
    '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
    '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus', 'philemon',
    'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'
];

const R2_ACCOUNT_ID = '3ac1a6fafce90adf6b1c8f1280dfc94d';
const ACCESS_KEY_ID = 'bc9f69e4b93a7b359ee22b80e86efba8';
const SECRET_ACCESS_KEY = '18d423fe4b2372174c18dc9e022041ef5c32c065394fe6a7aad1a6b751cf791d';
const ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const BUCKET_NAME = 'pashto-bible-audio';

const client = new S3Client({
    region: 'auto',
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

async function getAllR2Keys() {
    console.log('Fetching file list from R2...');
    const keys = new Set();
    let continuationToken = undefined;

    do {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: 'afghan2023/nt/',
            ContinuationToken: continuationToken,
        });

        const response = await client.send(command);
        if (response.Contents) {
            for (const item of response.Contents) {
                keys.add(item.Key);
            }
        }
        continuationToken = response.NextContinuationToken;
        process.stdout.write('.');
    } while (continuationToken);

    console.log(`\nFound ${keys.size} files in R2.`);
    return keys;
}

async function verifyAudio() {
    const r2Keys = await getAllR2Keys();
    let missingCount = 0;
    let totalChecked = 0;

    console.log('Verifying local files against R2...');

    for (const book of BOOKS) {
        for (let chapter = 1; chapter <= 28; chapter++) {
            const dirName = `pashto${book}${chapter}`;
            const dirPath = path.join(SOURCE_ROOT, dirName);

            if (!fs.existsSync(dirPath)) {
                continue;
            }

            const files = fs.readdirSync(dirPath);
            const validFiles = files.filter(f => f.endsWith('.mp3') && !f.includes(' 2.mp3'));

            for (const file of validFiles) {
                totalChecked++;
                const match = file.match(/_verse_(\d+)\.mp3$/);
                if (!match) continue;

                const verseNum = parseInt(match[1]);
                const paddedVerse = verseNum.toString().padStart(3, '0');
                const prefix = file.substring(0, file.indexOf('_verse_'));
                const r2Filename = `${prefix}_verse_${paddedVerse}.mp3`;
                const r2Key = `afghan2023/nt/${r2Filename}`;

                if (!r2Keys.has(r2Key)) {
                    console.error(`❌ Missing: ${r2Key} (Local: ${file})`);
                    missingCount++;
                }
            }
        }
    }

    console.log('\nVerification Complete.');
    console.log(`Total Checked: ${totalChecked}`);
    console.log(`Missing: ${missingCount}`);

    if (missingCount === 0) {
        console.log('✅ All audio files are uploaded!');
    } else {
        console.log('⚠️ Some files are missing.');
    }
}

verifyAudio().catch(console.error);
