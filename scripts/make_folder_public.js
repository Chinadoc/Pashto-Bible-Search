import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function initializeAuth() {
  try {
    const tokenPath = join(process.cwd(), 'token.json');
    const tokenFileContent = readFileSync(tokenPath, 'utf8');
    const tokenData = JSON.parse(tokenFileContent);
    
    const oauth2Client = new google.auth.OAuth2(
      tokenData.client_id,
      tokenData.client_secret,
      tokenData.redirect_uris?.[0]
    );
    
    oauth2Client.setCredentials({
      access_token: tokenData.token,
      refresh_token: tokenData.refresh_token,
      expiry_date: new Date(tokenData.expiry).getTime(),
    });
    
    if (oauth2Client.isTokenExpiring()) {
      console.log('🔄 Token expired, refreshing...');
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      console.log('✅ Token refreshed\n');
    }
    
    return oauth2Client;
  } catch (error) {
    console.error('❌ Failed to load token.json:', error.message);
    process.exit(1);
  }
}

async function makeFolderPublic(folderId) {
  try {
    const oauth2Client = await initializeAuth();
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    console.log(`🔓 Making folder public...\n`);
    console.log(`📁 Folder ID: ${folderId}\n`);

    // Make folder public (anyone with link can view)
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log('✅ Folder is now publicly accessible!\n');
    console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
    console.log('✅ All files in this folder are now accessible for inline audio playback!\n');
    
  } catch (error) {
    if (error.message.includes('alreadyExists')) {
      console.log('✅ Folder is already public!\n');
      console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
    } else {
      console.error('❌ Failed to make folder public:', error.message);
      process.exit(1);
    }
  }
}

const folderId = '1wXNLekvaP2WMdXQOCGlU5b2uDwZT92_s';
makeFolderPublic(folderId);

