import { google } from 'googleapis';
import { readFileSync, statSync, readdirSync, createReadStream } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function uploadFile(drive, filePath, fileName, myfolderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [myfolderId],
    };

    const media = {
      mimeType: 'audio/wav',
      body: createReadStream(filePath),
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

function parseFilename(filename) {
  // Extract info from filename like: "Afghanistan - Pakistan War ｜ Torkham Durand Line  ｜ د افغانستان پاکستان جنګ_segment_001_sentence_001.wav"
  const parts = filename.replace('.wav', '').split('_');
  
  let videoId = 'unknown';
  let segmentNumber = 0;
  let sentenceNumber = 0;
  
  // Try to extract segment and sentence numbers
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'segment' && i + 1 < parts.length) {
      segmentNumber = parseInt(parts[i + 1]) || 0;
    }
    if (parts[i] === 'sentence' && i + 1 < parts.length) {
      sentenceNumber = parseInt(parts[i + 1]) || 0;
    }
  }
  
  // Extract video title (everything before the first underscore with "segment")
  const segmentIndex = filename.indexOf('_segment_');
  const videoTitle = segmentIndex > 0 ? filename.substring(0, segmentIndex) : filename;
  
  return {
    videoId,
    videoTitle,
    segmentNumber,
    sentenceNumber,
    filename
  };
}

function validateTranscription(text) {
  if (!text || text.trim().length === 0) {
    return { isValid: false, confidence: 0, needsRetry: true };
  }
  
  let score = 0;
  
  // Check Pashto script
  if (/[\u0600-\u06FF]/.test(text)) score += 0.3;
  
  // Check Pashto words
  const commonWords = ['او', 'چې', 'څه', 'خدای', 'عیسی', 'پیغمبر', 'کتاب'];
  if (commonWords.some(word => text.includes(word))) score += 0.3;
  
  // Check character ratio
  const pashtoChars = text.match(/[\u0600-\u06FF]/g) || [];
  const pashtoRatio = pashtoChars.length / text.replace(/\s/g, '').length;
  if (pashtoRatio > 0.5) score += 0.2;
  else if (pashtoRatio > 0.3) score += 0.1;
  
  // Check length
  if (text.trim().split(/\s+/).length >= 2) score += 0.1;
  
  // Check for suspicious patterns
  if (!/\[.*?\]|\(.*?\)|speaker|foreign language/i.test(text)) score += 0.1;
  
  return {
    isValid: score >= 0.5,
    confidence: score,
    needsRetry: score < 0.6
  };
}

async function saveToSupabase(metadata) {
  try {
    // Validate transcription
    const validation = validateTranscription(metadata.transcript);
    
    const { data, error } = await supabase
      .from('video_transcripts')
      .insert({
        video_id: metadata.videoId || 'unknown',
        video_title: metadata.videoTitle || metadata.filename,
        segment_number: metadata.segmentNumber || 0,
        start_time_seconds: Math.floor(metadata.startTime || 0),
        end_time_seconds: Math.floor(metadata.endTime || 0),
        transcript_text: metadata.transcript || '',
        audio_file_path: `https://drive.google.com/file/d/${metadata.googleDriveId}/view`,
        transcript_file_path: metadata.filename,
        google_drive_file_id: metadata.googleDriveId,
        google_drive_url: `https://drive.google.com/uc?id=${metadata.googleDriveId}&export=download`,
        needs_retry: validation.needsRetry,
        validation_score: validation.confidence,
        transcription_service: 'elevenlabs'
      });
    
    if (error) {
      // Don't log duplicate key errors (file already exists)
      if (!error.message.includes('duplicate')) {
        console.error(`   ⚠️ Failed to save to Supabase:`, error.message);
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`   ⚠️ Supabase error:`, error.message);
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
  
  // Load transcript data from results file if available
  let transcriptData = {};
  try {
    const resultsFiles = readdirSync(join(process.cwd(), 'processed_videos'))
      .filter(f => f.endsWith('_results.json'));
    
    if (resultsFiles.length > 0) {
      const latestResults = resultsFiles[resultsFiles.length - 1];
      const resultsPath = join(process.cwd(), 'processed_videos', latestResults);
      const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
      
      // Create lookup by filename
      if (results.clips) {
        results.clips.forEach(clip => {
          transcriptData[clip.filename] = {
            transcript: clip.sentence,
            startTime: clip.start_time,
            endTime: clip.end_time,
            videoId: results.video_id,
            videoTitle: results.youtube_url
          };
        });
      }
      
      console.log(`📝 Loaded transcript data for ${Object.keys(transcriptData).length} clips\n`);
    }
  } catch (error) {
    console.log('⚠️ Could not load transcript data:', error.message);
  }
  
  // Get all audio files from sentence_clips directory
  const clipsDir = join(process.cwd(), 'sentence_clips');
  const files = readdirSync(clipsDir).filter(f => f.endsWith('.wav'));
  
  console.log(`📦 Found ${files.length} audio files to upload\n`);
  console.log('📤 Uploading files...\n');
  
  // Process in batches of 50
  const BATCH_SIZE = 50;
  let uploadedCount = 0;
  let publicCount = 0;
  let savedCount = 0;
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
          
          // Parse filename and save to Supabase
          const fileInfo = parseFilename(fileName);
          const clipData = transcriptData[fileName] || {};
          
          const metadata = {
            ...fileInfo,
            googleDriveId: fileId,
            startTime: clipData.startTime || 0,
            endTime: clipData.endTime || 0,
            transcript: clipData.transcript || '',
            videoId: clipData.videoId || fileInfo.videoId,
            videoTitle: clipData.videoTitle || fileInfo.videoTitle
          };
          
          const savedToDb = await saveToSupabase(metadata);
          
          return { success: true, fileId, isPublic, fileName, savedToDb };
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
        if (result.savedToDb) {
          savedCount++;
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
  console.log(`   💾 Saved ${savedCount} metadata records to Supabase`);
  console.log(`   ❌ Failed to upload ${failCount} files`);
  console.log(`   📊 Total files processed: ${files.length}\n`);
  console.log(`📁 Folder "${folderName}" now contains all video clips`);
  console.log(`🔗 Folder URL: https://drive.google.com/drive/folders/${folderId}\n`);
  console.log(`📊 All audio metadata saved to Supabase for easy recovery!`);
}

main().catch(console.error);

