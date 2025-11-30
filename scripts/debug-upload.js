const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

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

async function testUpload() {
    const key = 'afghan2023/nt/debug_test_file.txt';
    const body = 'This is a test file.';

    console.log(`Uploading ${key}...`);
    try {
        await client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: 'text/plain',
        }));
        console.log('Upload successful.');
    } catch (e) {
        console.error('Upload failed:', e);
    }

    console.log('Listing files...');
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: 'afghan2023/nt/debug',
    });
    const res = await client.send(command);
    const found = res.Contents?.find(c => c.Key === key);

    if (found) {
        console.log('✅ File found in R2!');
    } else {
        console.log('❌ File NOT found in R2.');
        console.log('Contents:', res.Contents);
    }
}

testUpload();
