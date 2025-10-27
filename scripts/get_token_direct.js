#!/usr/bin/env node

const https = require('https');

const code = process.argv[2];
if (!code) {
  console.error('❌ Please provide the authorization code as an argument');
  console.error('Usage: node scripts/get_token_direct.js <CODE>');
  process.exit(1);
}

const CLIENT_ID = '509054723959-r4mra7jf14rgojustdnonq739mf6fs8g.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8080';

console.log('🔄 Exchanging authorization code for token...\n');

const postData = new URLSearchParams({
  code: code,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
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

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.error) {
        console.error('❌ Error:', response.error_description || response.error);
        process.exit(1);
      }

      if (response.access_token) {
        console.log('✅ Got access token!');
        const fs = require('fs');
        const path = require('path');
        
        fs.writeFileSync(
          path.join(__dirname, '..', 'drive_token.json'),
          JSON.stringify(response, null, 2)
        );
        
        console.log('✅ Token saved to drive_token.json!');
        console.log('✅ Ready to extract audio IDs\n');
      }
    } catch (err) {
      console.error('❌ Parse error:', err.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});

req.write(postData);
req.end();
