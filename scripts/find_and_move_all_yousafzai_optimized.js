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

async function getAllMP3FilesParallel(drive) {
  console.log('🔍 Searching Google Drive for all MP3 files (parallel fetch)...\n');
  
  // First, get initial page to know how many total files
  const firstPage = await drive.files.list({
    q: "mimeType='audio/mpeg' and trashed=false",
    fields: 'nextPageToken, files(id, name, parents)',
    pageSize: 1000,
  });
  
  const allFiles = [...firstPage.data.files];
  let pageToken = firstPage.data.nextPageToken;
  
  console.log(`📦 Found ${allFiles.length} files in first page`);
  
  // Fetch remaining pages in parallel (up to 10 concurrent requests)
  const PARALLEL_PAGES = 10;
  const pages = [];
  
  while (pageToken) {
    for (let i = 0; i < PARALLEL_PAGES && pageToken; i++) {
      pages.push(
        drive.files.list({
          q: "mimeType='audio/mpeg' and trashed=false",
          fields: 'nextPageToken, files(id, name, parents)',
          pageSize: 1000,
          pageToken: pageToken,
        })
      );
      
      // Remove pageToken to avoid duplicating requests
      pageToken = null;
    }
    
    // Wait for all pages to complete
    const results = await Promise.all(pages);
    pages.length = 0; // Clear array
    
    // Process results
    for (const result of results) {
      allFiles.push(...result.data.files);
      if (result.data.nextPageToken) {
        pageToken = result.data.nextPageToken;
      }
    }
    
    process.stdout.write(`\r   Found ${allFiles.length} files...`);
  }
  
  console.log(`\n\n📦 Found ${allFiles.length} total MP3 files in Google Drive\n`);
  return allFiles;
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

async function moveFilesBatch(drive, files, folderId) {
  // Process files in parallel batches of 1000
  const BATCH_SIZE = 1000;
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    
    const results = await Promise.allSettled(
      batch.map(async (file) => {
        try {
          const fileInfo = await drive.files.get({
            fileId: file.id,
            fields: 'parents',
          });

          const previousParents = fileInfo.data.parents?.join(',') || '';

          await drive.files.update({
            fileId: file.id,
            addParents: folderId,
            removeParents: previousParents,
            fields: 'id',
          });

          return true;
        } catch (error) {
          if (error.message.includes('alreadyExists')) {
            return true;
          }
          return false;
        }
      })
    );
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    const progress = Math.min(i + BATCH_SIZE, files.length);
    process.stdout.write(`\r   Progress: ${progress}/${files.length} (${Math.round(progress/files.length*100)}%)`);
  }
  
  return { successCount, failCount };
}

async function main() {
  console.log('📁 Finding and Organizing All Yousafzai Files (OPTIMIZED)\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Get all MP3 files with parallel page fetching
  const allFiles = await getAllMP3FilesParallel(drive);
  
  if (allFiles.length === 0) {
    console.log('❌ No MP3 files found');
    process.exit(1);
  }
  
  // Create or find the folder
  const folderName = 'Pashto Yousafzai Audio';
  const folderId = await getOrCreateFolder(drive, folderName);
  console.log(`📁 Target folder ID: ${folderId}\n`);
  
  console.log('📦 Moving files to folder...\n');
  
  const { successCount, failCount } = await moveFilesBatch(drive, allFiles, folderId);
  
  console.log('\n\n✅ Done!\n');
  console.log(`   ✅ Successfully moved ${successCount} files`);
  console.log(`   ❌ Failed to move ${failCount} files`);
  console.log(`   📊 Total files processed: ${allFiles.length}\n`);
  console.log(`📁 Folder "${folderName}" now contains all audio files`);
  console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
}

main().catch(console.error);

