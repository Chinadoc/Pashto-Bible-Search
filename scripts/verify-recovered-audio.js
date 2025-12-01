const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// R2 Configuration
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

async function verifyChapter(book, chapter) {
    const internalBook = book.replace(/-/g, '');
    const prefix = `afghan2023/nt/${internalBook}${chapter}_verse_`;
    console.log(`Verifying ${book} Chapter ${chapter} (Prefix: ${prefix})...`);

    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
        });

        const response = await client.send(command);
        const files = response.Contents || [];

        console.log(`  ✅ Found ${files.length} files in R2`);
        if (files.length > 0) {
            console.log(`  Sample: ${files[0].Key}`);
        } else {
            console.error(`  ❌ No files found!`);
        }
    } catch (e) {
        console.error(`  ❌ Error listing objects: ${e.message}`);
    }
}

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

async function main() {
    let totalFiles = 0;

    for (const book of BOOKS_TO_RECOVER) {
        console.log(`\n📘 Verifying Book: ${book.name}`);
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
            const internalBook = book.name.replace(/-/g, '');
            const prefix = `afghan2023/nt/${internalBook}${chapter}_verse_`;

            try {
                const command = new ListObjectsV2Command({
                    Bucket: BUCKET_NAME,
                    Prefix: prefix,
                });

                const response = await client.send(command);
                const files = response.Contents || [];

                if (files.length > 0) {
                    console.log(`  ✅ Chapter ${chapter}: ${files.length} files`);
                    totalFiles += files.length;
                } else {
                    console.error(`  ❌ Chapter ${chapter}: No files found!`);
                }
            } catch (e) {
                console.error(`  ❌ Chapter ${chapter}: Error - ${e.message}`);
            }
        }
    }
    console.log(`\n🎉 Verification Complete. Total files in R2: ${totalFiles}`);
}

main();
