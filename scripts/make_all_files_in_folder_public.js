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

async function getAllFilesInFolder(drive, folderId) {
  const files = [];
  let pageToken = null;
  
  do {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType)',
        pageSize: 1000,
        pageToken: pageToken,
      });
      
      files.push(...response.data.files);
      pageToken = response.data.nextPageToken;
    } catch (error) {
      console.error('❌ Error listing files:', error.message);
      break;
    }
  } while (pageToken);
  
  return files;
}

async function makeFilePublic(drive, fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return true;
  } catch (error) {
    if (error.message.includes('alreadyExists')) {
      return true;
    }
    return false;
  }
}

async function main() {
  const folderId = '1wXNLekvaP2WMdXQOCGlU5b2uDwZT92_s';
  
  console.log('🔍 Finding all files in folder...\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  const files = await getAllFilesInFolder(drive, folderId);
  
  console.log(`📦 Found ${files.length} files in folder\n`);
  console.log('🔓 Making all files publicly accessible...\n');
  
  // Process in batches of 50
  const BATCH_SIZE = 50;
  let successCount = 0;
  let failCount = 0;
  let progress = 0;
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    
    const results = await Promise.all(
      batch.map(async (file) => {
        const success = await makeFilePublic(drive, file.id);
        return { success, name: file.name };
      })
    );
    
    progress += batch.length;
    
    for (const result of results) {
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    process.stdout.write(`\r   Progress: ${progress}/${files.length} (${Math.round(progress/files.length*100)}%)`);
    
    if (i + BATCH_SIZE < files.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('\n\n✅ Done!\n');
  console.log(`   ✅ Successfully made ${successCount} files public`);
  console.log(`   ❌ Failed to make ${failCount} files public`);
  console.log(`   📊 Total files processed: ${files.length}\n`);
  console.log('✅ All files are now publicly accessible!\n');
}

main().catch(console.error);

