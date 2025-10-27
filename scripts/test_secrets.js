#!/usr/bin/env node

const https = require('https');

const secrets = [
  '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',
  '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',
  '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'
];

const code = '4/1Ab32j91RVDpVOkWoqtVRKuiyQTTmSOy7cfaAxsTnBo59PL_Zkebl6h8OIwo';
const CLIENT_ID = '509054723959-r4mra7jf14rgojustdnonq739mf6fs8g.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:8080';

let successCount = 0;

function testSecret(secret, index) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Testing secret ${index + 1}/${secrets.length}...`);
    
    const postData = new URLSearchParams({
      code: code,
      client_id: CLIENT_ID,
      client_secret: secret,
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
            console.log(`   ❌ ${response.error}: ${response.error_description}`);
            resolve(false);
          } else if (response.access_token) {
            console.log(`   ✅ SUCCESS! Token obtained!`);
            successCount++;
            resolve(true);
          }
        } catch (err) {
          console.log(`   ❌ Parse error`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ Request error: ${err.message}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing client secrets...\n');
  
  for (let i = 0; i < secrets.length; i++) {
    await testSecret(secrets[i], i);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }
  
  console.log(`\n📊 Results: ${successCount}/${secrets.length} secrets worked`);
}

runTests();
