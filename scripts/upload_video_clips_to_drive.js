import { google } from 'googleapis';
import { readFileSync, statSync, readdirSync } from 'fs';
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

async function uploadFile(drive, filePath, fileName, folderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'audio/wav',
      body: readFileSync(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    return file.data.id;
  } catch (error) {
    console.error(`   ❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
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
  console.log('📤 Uploading Video Clips to Google Drive\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Create or find folder
  const folderName = 'Pashto Video Clips';
  const folderId = await getOrCreateFolder(drive, folderName);
  console.log(`📁 Target folder ID: ${folderId}\n`);
  
  // Get all audio files from sentence_clips directory
  const clipsDir = join(process.cwd(), 'sentence_clips');
  const files = readdirSync(clipsDir).filter(f => f.endsWith('.wav'));
  
  console.log(`📦 Found ${files.length} audio files to upload\n`);
  console.log('📤 Uploading files...\n');
  
  // Process in batches of 50
  const BATCH_SIZE = 50;
  let uploadedCount = 0;
  let publicCount = 0;
  let failCount = 0;
  let progress = 0;
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    
    const results = await Promise.all(
      batch.map(async (fileName) => {
        const filePath = join(clipsDir, fileName);
        const fileId = await uploadFile(drive, filePath, fileName, folderId);
        
        if (fileId) {
          const isPublic = await makeFilePublic(drive, fileId);
          return { success: true, fileId, isPublic, fileName };
        }
        return { success: false, fileName };
      })
    );
    
    progress += batch.length;
    
    for (const result of results) {
      if (result.success) {
        uploadedCount++;
        if (result.isPublic) {
          publicCount++;
        }
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
  console.log(`   ✅ Successfully uploaded ${uploadedCount} files`);
  console.log(`   🔓 Made ${publicCount} files public`);
  console.log(`   ❌ Failed to upload ${failCount} files`);
  console.log(`   📊 Total files processed: ${files.length}\n`);
  console.log(`📁 Folder "${folderName}" now contains all video clips`);
  console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
}

main().catch(console.error);

