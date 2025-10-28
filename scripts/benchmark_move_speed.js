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
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
    }
    
    return oauth2Client;
  } catch (error) {
    console.error('❌ Failed to load token.json:', error.message);
    process.exit(1);
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

async function benchmark(batchSize, delayMs, sampleFiles, folderId, drive) {
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  
  // Test with sample files
  const testBatch = sampleFiles.slice(0, batchSize);
  
  const results = await Promise.allSettled(
    testBatch.map(async (file) => {
      const success = await moveFileToFolder(drive, file.id, folderId);
      return success;
    })
  );
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  const elapsed = Date.now() - startTime;
  const filesPerSecond = (successCount / elapsed) * 1000;
  
  return {
    batchSize,
    delayMs,
    elapsed,
    successCount,
    failCount,
    filesPerSecond
  };
}

async function main() {
  console.log('⚡ Benchmarking Optimal Move Speed\n');
  
  const oauth2Client = await initializeAuth();
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Get some sample files (first 1000)
  console.log('📦 Getting sample files...\n');
  const response = await drive.files.list({
    q: "mimeType='audio/mpeg' and trashed=false",
    fields: 'files(id, name)',
    pageSize: 1000,
  });
  
  const sampleFiles = response.data.files;
  console.log(`📁 Found ${sampleFiles.length} sample files\n`);
  
  if (sampleFiles.length === 0) {
    console.log('❌ No files found');
    process.exit(1);
  }
  
  // Get folder
  const folderResponse = await drive.files.list({
    q: "name='Pashto Yousafzai Audio' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id)',
  });
  
  const folderId = folderResponse.data.files[0]?.id;
  if (!folderId) {
    console.log('❌ Folder not found');
    process.exit(1);
  }
  
  console.log('🧪 Testing different configurations...\n');
  
  // Test configurations
  const configs = [
    { batchSize: 100, delayMs: 0 },
    { batchSize: 500, delayMs: 0 },
    { batchSize: 1000, delayMs: 0 },
    { batchSize: 500, delayMs: 50 },
    { batchSize: 1000, delayMs: 50 },
    { batchSize: 1000, delayMs: 100 },
  ];
  
  const results = [];
  
  for (const config of configs) {
    console.log(`Testing: ${config.batchSize} files/batch, ${config.delayMs}ms delay...`);
    const result = await benchmark(config.batchSize, config.delayMs, sampleFiles, folderId, drive);
    results.push(result);
    console.log(`   ⏱️  ${result.elapsed}ms | ✅ ${result.successCount} | ❌ ${result.failCount} | ⚡ ${result.filesPerSecond.toFixed(1)} files/sec\n`);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Find fastest
  const fastest = results.reduce((max, r) => r.filesPerSecond > max.filesPerSecond ? r : max);
  
  console.log('🎯 RESULTS\n');
  console.log('='.repeat(80));
  console.log('🏆 FASTEST CONFIGURATION:');
  console.log(`   Batch Size: ${fastest.batchSize}`);
  console.log(`   Delay: ${fastest.delayMs}ms`);
  console.log(`   Speed: ${fastest.filesPerSecond.toFixed(1)} files/second`);
  console.log(`   Estimated time for 40,000 files: ${Math.round(40000 / fastest.filesPerSecond)} seconds`);
  console.log('='.repeat(80));
}

main().catch(console.error);

