const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// R2 Configuration
const R2_BUCKET = 'pashto-bible-audio';
const ACCOUNT_ID = '8301730128731287312873'; // Placeholder, will be read from env or hardcoded if needed
// Actually, I should use the same config as other scripts.
// Let's assume environment variables are set or use the ones from verify-r2-audio.js if available.
// But verify-r2-audio.js used local file check.
// I'll use wrangler to list objects, it's easier.

const { execSync } = require('child_process');

function verifyChapter(book, chapter) {
    const prefix = `afghan2023/nt/${book.replace(/-/g, '')}${chapter}_verse_`;
    console.log(`Verifying ${book} Chapter ${chapter} (Prefix: ${prefix})...`);

    try {
        // List objects with prefix
        // wrangler r2 object list pashto-bible-audio --prefix=...
        // But wrangler output is JSON.
        const cmd = `npx wrangler r2 object list ${R2_BUCKET} --prefix="${prefix}"`;
        const output = execSync(cmd, { encoding: 'utf-8' });
        const files = JSON.parse(output);

        console.log(`  ✅ Found ${files.length} files in R2`);
        if (files.length > 0) {
            console.log(`  Sample: ${files[0].key}`);
        } else {
            console.error(`  ❌ No files found!`);
        }
    } catch (e) {
        console.error(`  ❌ Error listing objects: ${e.message}`);
    }
}

// Check 1 Corinthians 1 and 2
verifyChapter('1-corinthians', 1);
verifyChapter('1-corinthians', 2);
