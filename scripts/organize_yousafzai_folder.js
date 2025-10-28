import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load Google Drive auth
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

// Extract file ID from Google Drive URL
function extractFileId(url) {
  if (!url || !url.includes('drive.google.com')) return null;
  
  let match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  return null;
}

// Create or find a folder
async function getOrCreateFolder(drive, folderName) {
  try {
    // Try to find existing folder
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (response.data.files && response.data.files.length > 0) {
      console.log(`📁 Found existing folder: ${folderName}`);
      return response.data.files[0].id;
    }

    // Create new folder
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

// Move a file to a folder
async function moveFileToFolder(drive, fileId, folderId) {
  try {
    // Get current parents
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'parents',
    });

    const previousParents = file.data.parents?.join(',') || '';

    // Move file to new folder
    await drive.files.update({
      fileId: fileId,
      addParents: folderId,
      removeParents: previousParents,
      fields: 'id, parents',
    });

    return true;
  } catch (error) {
    if (error.message.includes('alreadyExists')) {
      return true; // Already in the folder
    }
    console.error(`   ❌ Failed to move file ${fileId}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('📁 Organizing Yousafzai Files into Folder\n');
  
  // Initialize Google Drive auth
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  console.log('🔍 Fetching all Yousafzai Google Drive URLs from database...\n');

  // Get all verses with Google Drive URLs
  const { data: verses, error } = await supabase
    .from('verses_yousafzai')
    .select('book, chapter, verse, audio_public_url')
    .not('audio_public_url', 'is', null)
    .ilike('audio_public_url', '%drive.google.com%');

  if (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }

  console.log(`📊 Found ${verses.length} verses with Google Drive URLs\n`);

  // Extract unique file IDs
  const fileIds = new Set();
  for (const verse of verses) {
    const fileId = extractFileId(verse.audio_public_url);
    if (fileId) {
      fileIds.add(fileId);
    }
  }

  console.log(`📦 Found ${fileIds.size} unique Google Drive files\n`);

  // Create or find the folder
  const folderName = 'Pashto Yousafzai Audio';
  const folderId = await getOrCreateFolder(drive, folderName);
  console.log(`📁 Target folder ID: ${folderId}\n`);

  console.log('📦 Moving files to folder...\n');

  // Process files in parallel batches (24 at a time)
  const BATCH_SIZE = 24;
  const fileIdsArray = Array.from(fileIds);
  let successCount = 0;
  let failCount = 0;
  let progress = 0;

  for (let i = 0; i < fileIdsArray.length; i += BATCH_SIZE) {
    const batch = fileIdsArray.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const results = await Promise.all(
      batch.map(async (fileId) => {
        const success = await moveFileToFolder(drive, fileId, folderId);
        return { success, fileId };
      })
    );

    // Update progress after batch completes
    progress += batch.length;

    // Count successes and failures
    for (const result of results) {
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Update progress
    process.stdout.write(`\r   Progress: ${progress}/${fileIds.size} (${Math.round(progress/fileIds.size*100)}%)`);

    // Rate limiting between batches
    if (i + BATCH_SIZE < fileIdsArray.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log('\n\n✅ Done organizing files!\n');
  console.log(`   ✅ Successfully moved ${successCount} files`);
  console.log(`   ❌ Failed to move ${failCount} files`);
  console.log(`   📊 Total files processed: ${fileIds.size}\n`);
  console.log(`📁 Folder "${folderName}" created/updated`);
  console.log(`🔗 Now you can make this folder public: https://drive.google.com/drive/folders/${folderId}\n`);
}

main().catch(console.error);

