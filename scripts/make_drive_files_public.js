import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load and initialize OAuth credentials
async function initializeAuth() {
  try {
    const tokenPath = join(process.cwd(), 'token.json');
    const tokenFileContent = readFileSync(tokenPath, 'utf8');
    // Token.json is stored as stringified JSON, so parse twice
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
    
    // Refresh token if expired
    if (oauth2Client.isTokenExpiring()) {
      console.log('🔄 Token expired, refreshing...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        console.log('✅ Token refreshed successfully\n');
      } catch (error) {
        console.error('❌ Failed to refresh token:', error.message);
        console.error('You may need to re-authenticate. Check token.json');
        process.exit(1);
      }
    } else {
      console.log('✅ Loaded Google Drive credentials from token.json\n');
    }
    
    return oauth2Client;
  } catch (error) {
    console.error('❌ Failed to load token.json:', error.message);
    console.error('Please make sure token.json exists in the project root');
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

// Make a file publicly accessible
async function makeFilePublic(drive, fileId) {
  try {
    // Add "anyone" permission (can view)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    return true;
  } catch (error) {
    // Only log specific errors, not "alreadyExists" errors
    if (!error.message.includes('alreadyExists')) {
      console.error(`\n   ❌ Failed: ${fileId} - ${error.message}`);
    }
    return false;
  }
}

async function main() {
  // Initialize Google Drive auth
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  console.log('🔍 Fetching all Google Drive URLs from database...\n');

  // Get all verses with Google Drive URLs (no limit)
  const { data: verses, error } = await supabase
    .from('verses_yousafzai')
    .select('book, chapter, verse, audio_public_url')
    .not('audio_public_url', 'is', null)
    .ilike('audio_public_url', '%drive.google.com%')
    .limit(50000); // Allow up to 50k files

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
  console.log('🔓 Making files publicly accessible...\n');

  // Process files in parallel batches (50 at a time)
  const BATCH_SIZE = 50;
  const fileIdsArray = Array.from(fileIds);
  let successCount = 0;
  let failCount = 0;
  let progress = 0;

  for (let i = 0; i < fileIdsArray.length; i += BATCH_SIZE) {
    const batch = fileIdsArray.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const results = await Promise.all(
      batch.map(async (fileId) => {
        const success = await makeFilePublic(drive, fileId);
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

  console.log('\n\n✅ Done!\n');
  console.log(`   ✅ Successfully made ${successCount} files public`);
  console.log(`   ❌ Failed to make ${failCount} files public`);
  console.log(`   📊 Total files processed: ${fileIds.size}`);
}

main().catch(console.error);

