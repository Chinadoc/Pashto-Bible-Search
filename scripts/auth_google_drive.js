import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function main() {
  console.log('🔐 Google Drive Re-Authentication Tool\n');
  
  // Check for credentials.json
  let credentials;
  try {
    const credsPath = join(process.cwd(), 'credentials.json');
    credentials = JSON.parse(readFileSync(credsPath, 'utf8'));
    console.log('✅ Found credentials.json\n');
  } catch (error) {
    console.error('❌ credentials.json not found!');
    console.error('\nYou need to:');
    console.error('1. Go to https://console.cloud.google.com/');
    console.error('2. Create OAuth client ID (Desktop app)');
    console.error('3. Download as credentials.json');
    console.error('4. Place in project root\n');
    process.exit(1);
  }

  // Check for existing token.json
  let tokenData;
  try {
    const tokenPath = join(process.cwd(), 'token.json');
    const tokenContent = readFileSync(tokenPath, 'utf8');
    tokenData = JSON.parse(tokenContent);
    console.log('📄 Found existing token.json');
    console.log(`   Expiry: ${tokenData.expiry}`);
    console.log(`   Expired: ${new Date(tokenData.expiry) < new Date() ? 'YES ❌' : 'NO ✅'}\n`);
  } catch (error) {
    console.log('📄 No existing token.json found\n');
  }

  // Handle both 'web' and 'installed' credential formats
  const credData = credentials.web || credentials.installed;
  if (!credData) {
    console.error('❌ Invalid credentials.json format');
    console.error('Expected "web" or "installed" object');
    process.exit(1);
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    credData.client_id,
    credData.client_secret,
    credData.redirect_uris[0]
  );

  // Try to refresh if we have a refresh token
  if (tokenData?.refresh_token) {
    console.log('🔄 Attempting to refresh token...');
    try {
      oauth2Client.setCredentials({
        refresh_token: tokenData.refresh_token
      });
      
      const { credentials: newCreds } = await oauth2Client.refreshAccessToken();
      
      // Update token.json
      const updatedToken = {
        ...tokenData,
        token: newCreds.access_token,
        expiry: new Date(newCreds.expiry_date).toISOString()
      };
      
      writeFileSync('token.json', JSON.stringify(updatedToken));
      
      console.log('✅ Token refreshed successfully!');
      console.log(`   New expiry: ${updatedToken.expiry}\n`);
      console.log('✅ Ready to use! Run: npm run make-drive-public\n');
      return;
    } catch (error) {
      console.log('❌ Refresh failed:', error.message);
      console.log('   Need to re-authenticate manually\n');
    }
  }

  // If refresh failed or no refresh token, do full OAuth flow
  console.log('🔗 Starting OAuth flow...\n');
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('1️⃣  Open this URL in your browser:');
  console.log(`\n${authUrl}\n`);
  
  console.log('2️⃣  Sign in and click "Allow"');
  console.log('3️⃣  Copy the authorization code from the redirect URL');
  console.log('   (It will look like: 4/0AeanS...)');
  console.log('4️⃣  Paste it below and press Enter\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Authorization code: ', async (code) => {
    rl.close();

    try {
      console.log('\n🔄 Exchanging code for token...');
      
      const { tokens } = await oauth2Client.getToken(code);
      
      // Save token in the same format as existing token.json
      const tokenToSave = {
        token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_uri: 'https://oauth2.googleapis.com/token',
        client_id: credData.client_id,
        client_secret: credData.client_secret,
        scopes: tokens.scope ? [tokens.scope] : SCOPES,
        universe_domain: 'googleapis.com',
        account: '',
        expiry: new Date(tokens.expiry_date).toISOString()
      };

      writeFileSync('token.json', JSON.stringify(tokenToSave, null, 2));
      
      console.log('✅ Token saved successfully!');
      console.log(`   Access token: ${tokens.access_token.substring(0, 20)}...`);
      console.log(`   Refresh token: ${tokens.refresh_token.substring(0, 20)}...`);
      console.log(`   Expiry: ${tokenToSave.expiry}\n`);
      console.log('✅ Ready to use! Run: npm run make-drive-public\n');
    } catch (error) {
      console.error('❌ Failed to get token:', error.message);
      console.error('\nCommon issues:');
      console.error('- Authorization code expired (get a new one)');
      console.error('- Code already used (get a new one)');
      console.error('- Invalid credentials.json');
      process.exit(1);
    }
  });
}

main().catch(console.error);

