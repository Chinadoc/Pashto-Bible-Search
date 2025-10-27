#!/usr/bin/env node

/**
 * Simple script to get OAuth token from authorization code
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function getToken(authCode) {
  console.log('🔐 Getting OAuth token...\n');

  const keyFile = path.join(__dirname, '..', 'credentials.json');

  if (!fs.existsSync(keyFile)) {
    console.error('❌ credentials.json not found!');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);

    // Save token
    const tokenFile = path.join(__dirname, '..', 'drive_token.json');
    fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));

    console.log('✅ Token saved successfully!');
    console.log(`📁 Token file: ${tokenFile}\n`);

    // Test the connection
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    console.log('🔗 Testing Drive API connection...');
    const response = await drive.files.list({
      q: "'1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC' in parents and mimeType = 'audio/mpeg'",
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 5
    });

    const files = response.data.files || [];
    console.log(`✅ Found ${files.length} audio files in Afghan 2023 folder`);
    if (files.length > 0) {
      console.log('📝 First few files:');
      files.forEach(file => console.log(`   - ${file.name} (${file.id})`));
    }

    console.log('\n🎉 OAuth setup complete! You can now run the full extraction script.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get auth code from command line argument
const authCode = process.argv[2];
if (!authCode) {
  console.log('❌ Please provide authorization code as argument');
  console.log('Usage: node scripts/get_oauth_token.js "4/0Ab32j91gJEZx..."');
  process.exit(1);
}

getToken(authCode).catch(console.error);

