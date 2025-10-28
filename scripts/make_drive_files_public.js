import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!googleClientEmail || !googlePrivateKey) {
  console.error('❌ Missing Google Drive API credentials');
  console.error('Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Set up Google Drive API client
const auth = new google.auth.JWT(
  googleClientEmail,
  null,
  googlePrivateKey,
  ['https://www.googleapis.com/auth/drive'],
  null
);

const drive = google.drive({ version: 'v3', auth });

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
async function makeFilePublic(fileId) {
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
    console.error(`   ❌ Failed to make file ${fileId} public:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Fetching all Google Drive URLs from database...\n');

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
  console.log('🔓 Making files publicly accessible...\n');

  let successCount = 0;
  let failCount = 0;
  let progress = 0;

  for (const fileId of fileIds) {
    progress++;
    process.stdout.write(`\r   Progress: ${progress}/${fileIds.size} (${Math.round(progress/fileIds.size*100)}%)`);
    
    const success = await makeFilePublic(fileId);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting - be nice to Google API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n\n✅ Done!\n');
  console.log(`   ✅ Successfully made ${successCount} files public`);
  console.log(`   ❌ Failed to make ${failCount} files public`);
  console.log(`   📊 Total files processed: ${fileIds.size}`);
}

main().catch(console.error);

