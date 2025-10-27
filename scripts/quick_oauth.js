#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const code = process.argv[2];
if (!code) {
  console.error('❌ Code required');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_id, client_secret, redirect_uris } = credentials.web;

console.log('🔄 Exchanging code for token...\n');

const postData = new URLSearchParams({
  code: code.trim(),
  client_id: client_id,
  client_secret: client_secret,
  redirect_uri: redirect_uris[0],
  grant_type: 'authorization_code'
}).toString();

const options = {
  hostname: 'oauth2.googleapis.com',
  path: '/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const response = JSON.parse(data);
    
    if (response.error) {
      console.error('❌ Error:', response.error_description);
      process.exit(1);
    }

    fs.writeFileSync('drive_token.json', JSON.stringify(response, null, 2));
    console.log('✅ Token saved!');
    console.log('✅ Ready to extract audio IDs\n');
  });
});

req.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

req.write(postData);
req.end();
