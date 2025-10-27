#!/usr/bin/env node

const https = require('https');

const code = '4/1AVGzR1BHIEKHmBvaz0iIhA4kfBfpimpWW85pAZDAvP3klYWQ1soxuBzXE8M';
const CLIENT_ID = '509054723959-li2c8djvrrkbcp2rtkrajllvr1nnmfbt.apps.googleusercontent.com';

const secrets = [
  { name: 'Secret 1', value: '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' },
  { name: 'Secret 2', value: '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' },
  { name: 'Secret 3', value: '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' }
];

let found = false;

function trySecret(secret, index) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Trying ${secret.name}...`);
    
    const postData = new URLSearchParams({
      code: code,
      client_id: CLIENT_ID,
      client_secret: secret.value,
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
          
          if (response.access_token) {
            console.log(`✅ SUCCESS with ${secret.name}!`);
            const fs = require('fs');
            fs.writeFileSync('drive_token.json', JSON.stringify(response, null, 2));
            fs.writeFileSync('credentials.json', JSON.stringify({
              installed: {
                client_id: CLIENT_ID,
                client_secret: secret.value,
                redirect_uris: ['urn:ietf:wg:oauth:2.0:oob']
              }
            }, null, 2));
            found = true;
            console.log('✅ Token saved!');
            resolve(true);
          } else {
            console.log(`❌ ${response.error}: ${response.error_description}`);
            resolve(false);
          }
        } catch (err) {
          console.log(`❌ Error parsing response`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request error`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function testAll() {
  console.log('🧪 Testing secrets with desktop client...\n');
  
  for (const secret of secrets) {
    await trySecret(secret, 0);
    if (found) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  if (!found) {
    console.log('\n❌ None of the secrets worked');
  }
}

testAll();
