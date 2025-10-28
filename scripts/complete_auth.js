import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const authCode = '4/0Ab32j92SFixhvSrm6MAP5df97k9Noxb9U88vbj5496_vpHTFJagtCVKhP6V2JqVqcDLt6A';

async function main() {
  // Load credentials
  const credentials = JSON.parse(readFileSync('credentials.json', 'utf8'));
  const credData = credentials.web || credentials.installed;
  
  const oauth2Client = new google.auth.OAuth2(
    credData.client_id,
    credData.client_secret,
    credData.redirect_uris[0]
  );

  console.log('🔄 Exchanging code for token...');
  
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    
    const tokenToSave = {
      token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_uri: 'https://oauth2.googleapis.com/token',
      client_id: credData.client_id,
      client_secret: credData.client_secret,
      scopes: tokens.scope ? [tokens.scope] : ['https://www.googleapis.com/auth/drive'],
      universe_domain: 'googleapis.com',
      account: '',
      expiry: new Date(tokens.expiry_date).toISOString()
    };

    writeFileSync('token.json', JSON.stringify(tokenToSave, null, 2));
    
    console.log('✅ Token saved successfully!');
    console.log(`   Expiry: ${tokenToSave.expiry}\n`);
    console.log('✅ Ready to use! You can now run: npm run make-drive-public\n');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

main();

