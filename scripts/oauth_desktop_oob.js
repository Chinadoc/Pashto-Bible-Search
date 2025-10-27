#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const code = process.argv[2];
if (!code) {
  console.error('❌ Code required');
  console.error('Usage: node scripts/oauth_desktop_oob.js "YOUR_CODE"');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_id, client_secret } = credentials.installed;

console.log('🔄 Exchanging code for token...\n');

const postData = new URLSearchParams({
  code: code.trim(),
  client_id: client_id,
  client_secret: client_secret,
  redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
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
    try {
      const response = JSON.parse(data);
      
      if (response.error) {
        console.error('❌ Error:', response.error_description || response.error);
        process.exit(1);
      }

      fs.writeFileSync('drive_token.json', JSON.stringify(response, null, 2));
      console.log('✅ Token saved to drive_token.json!');
      console.log('✅ Ready to extract audio IDs\n');
    } catch (err) {
      console.error('❌ Parse error:', err.message);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

req.write(postData);
req.end();
