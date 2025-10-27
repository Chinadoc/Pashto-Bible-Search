#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');

async function getNewToken() {
  console.log('🔐 Starting OAuth authentication (Desktop Client)...\n');

  const keyFile = path.join(__dirname, '..', 'credentials.json');
  if (!fs.existsSync(keyFile)) {
    console.error('❌ credentials.json not found!');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
  });

  console.log('🔗 OPEN THIS URL IN YOUR BROWSER:\n');
  console.log(authUrl);
  console.log('\n📋 After authorizing, you\'ll see a code on the screen');
  console.log('✂️  COPY that code and paste it below\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Paste the authorization code here: ', async (code) => {
      rl.close();
      
      if (!code || code.trim().length === 0) {
        console.error('❌ No code provided!');
        process.exit(1);
      }

      try {
        console.log('\n🔄 Exchanging code for token...');
        const { tokens } = await oauth2Client.getToken(code.trim());
        
        const tokenFile = path.join(__dirname, '..', 'drive_token.json');
        fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
        
        console.log('✅ Token saved to drive_token.json!');
        console.log('✅ You can now run the audio extraction script\n');
        
        resolve(tokens);
      } catch (err) {
        console.error('❌ Error getting token:', err.message);
        process.exit(1);
      }
    });
  });
}

if (require.main === module) {
  getNewToken().catch(console.error);
}

module.exports = { getNewToken };
