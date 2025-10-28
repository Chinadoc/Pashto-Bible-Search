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

async function getAllMP3Files(drive) {
  console.log('🔍 Searching Google Drive for all MP3 files...\n');
  
  const files = [];
  let pageToken = null;
  let pageCount = 0;
  
  do {
    try {
      pageCount++;
      const response = await drive.files.list({
        q: "mimeType='audio/mpeg' and trashed=false",
        fields: 'nextPageToken, files(id, name, parents)',
        pageSize: 1000,
        pageToken: pageToken,
        orderBy: 'name',
      });
      
      files.push(...response.data.files);
      pageToken = response.data.nextPageToken;
      
      process.stdout.write(`\r   Found ${files.length} files... (page ${pageCount})`);
    } catch (error) {
      console.error('\n❌ Error listing files:', error.message);
      break;
    }
  } while (pageToken);
  
  console.log(`\n\n📦 Found ${files.length} total MP3 files in Google Drive\n`);
  return files;
}

async function getOrCreateFolder(drive, folderName) {
  try {
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (response.data.files && response.data.files.length > 0) {
      console.log(`📁 Found existing folder: ${folderName}`);
      return response.data.files[0].id;
    }

    const folder = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    console.log(`✅ Created folder: ${folderName}`);
    return folder.data.id;
  } catch (error) {
    console.error(`❌ Failed to create/find folder:`, error.message);
    throw error;
  }
}

async function moveFileToFolder(drive, fileId, folderId) {
  try {
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'parents',
    });

    const previousParents = file.data.parents?.join(',') || '';

    await drive.files.update({
      fileId: fileId,
      addParents: folderId,
      removeParents: previousParents,
      fields: 'id, parents',
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
  console.log('📁 Finding and Organizing All Yousafzai Files\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Get all MP3 files from Google Drive
  const allFiles = await getAllMP3Files(drive);
  
  if (allFiles.length === 0) {
    console.log('❌ No MP3 files found');
    process.exit(1);
  }
  
  // Create or find the folder
  const folderName = 'Pashto Yousafzai Audio';
  const folderId = await getOrCreateFolder(drive, folderName);
  console.log(`📁 Target folder ID: ${folderId}\n`);
  
  console.log('📦 Moving files to folder...\n');
  
  // Process in batches of 100 for maximum speed
  const BATCH_SIZE = 100;
  let successCount = 0;
  let failCount = 0;
  let progress = 0;
  
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    
    const results = await Promise.all(
      batch.map(async (file) => {
        const success = await moveFileToFolder(drive, file.id, folderId);
        return { success, file };
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
    
    process.stdout.write(`\r   Progress: ${progress}/${allFiles.length} (${Math.round(progress/allFiles.length*100)}%)`);
    
    // Minimal delay for rate limiting
    if (i + BATCH_SIZE < allFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  console.log('\n\n✅ Done!\n');
  console.log(`   ✅ Successfully moved ${successCount} files`);
  console.log(`   ❌ Failed to move ${failCount} files`);
  console.log(`   📊 Total files processed: ${allFiles.length}\n`);
  console.log(`📁 Folder "${folderName}" now contains all audio files`);
  console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
}

main().catch(console.error);

