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
  let pageCount = 0;
  
  do {
    try {
      pageCount++;
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType)',
        pageSize: 1000,
        pageToken: pageToken,
      });
      
      files.push(...response.data.files);
      pageToken = response.data.nextPageToken;
      
      process.stdout.write(`\r   Found ${files.length} files in folder... (page ${pageCount})`);
    } catch (error) {
      console.error('\n❌ Error listing files:', error.message);
      break;
    }
  } while (pageToken);
  
  return files;
}

async function getAllMP3FilesOutsideFolder(drive, folderId) {
  console.log('🔍 Finding all MP3 files NOT in the folder...\n');
  
  const files = [];
  let pageToken = null;
  let pageCount = 0;
  
  do {
    try {
      pageCount++;
      const response = await drive.files.list({
        q: `mimeType='audio/mpeg' and trashed=false and '${folderId}' not in parents`,
        fields: 'nextPageToken, files(id, name, parents)',
        pageSize: 1000,
        pageToken: pageToken,
      });
      
      files.push(...response.data.files);
      pageToken = response.data.nextPageToken;
      
      process.stdout.write(`\r   Found ${files.length} MP3 files outside folder... (page ${pageCount})`);
    } catch (error) {
      console.error('\n❌ Error listing files:', error.message);
      break;
    }
  } while (pageToken);
  
  return files;
}

async function main() {
  const folderId = '1wXNLekvaP2WMdXQOCGlU5b2uDwZT92_s';
  
  console.log('📊 Checking Folder Contents\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Get files in folder
  console.log('1️⃣ Checking files IN the folder...\n');
  const filesInFolder = await getAllFilesInFolder(drive, folderId);
  console.log(`\n\n✅ Folder contains: ${filesInFolder.length} files\n`);
  
  // Get files outside folder
  console.log('2️⃣ Checking files OUTSIDE the folder...\n');
  const filesOutsideFolder = await getAllMP3FilesOutsideFolder(drive, folderId);
  console.log(`\n\n📦 Files outside folder: ${filesOutsideFolder.length}\n`);
  
  if (filesOutsideFolder.length > 0) {
    console.log('⚠️ Some files are still outside the folder\n');
    console.log('First 10 files outside folder:');
    filesOutsideFolder.slice(0, 10).forEach((file, i) => {
      console.log(`   ${i + 1}. ${file.name}`);
    });
    
    if (filesOutsideFolder.length > 10) {
      console.log(`   ... and ${filesOutsideFolder.length - 10} more\n`);
    }
    
    console.log('\n❓ Would you like to move these remaining files into the folder?');
  } else {
    console.log('✅ All files are in the folder!\n');
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files in folder: ${filesInFolder.length}`);
  console.log(`   Files outside folder: ${filesOutsideFolder.length}`);
  console.log(`   Total MP3 files: ${filesInFolder.length + filesOutsideFolder.length}`);
}

main().catch(console.error);

