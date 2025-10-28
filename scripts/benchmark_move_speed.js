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

async function benchmark(batchSize, delayMs, numAgents, sampleFiles, folderId, drive) {
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  
  // Split files across agents
  const filesPerAgent = Math.ceil(batchSize / numAgents);
  const agentBatches = [];
  
  for (let i = 0; i < numAgents; i++) {
    const start = i * filesPerAgent;
    const end = Math.min(start + filesPerAgent, batchSize);
    agentBatches.push(sampleFiles.slice(start, end));
  }
  
  // Create multiple agents (each with its own drive instance)
  const agents = Array(numAgents).fill(null).map(() => 
    google.drive({ version: 'v3', auth: drive.auth })
  );
  
  // Each agent processes its batch in parallel
  const agentPromises = agentBatches.map((batch, index) => 
    Promise.allSettled(
      batch.map(async (file) => {
        const success = await moveFileToFolder(agents[index], file.id, folderId);
        return success;
      })
    )
  );
  
  const allResults = await Promise.all(agentPromises);
  
  // Count results
  for (const agentResults of allResults) {
    for (const result of agentResults) {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }
  
  const elapsed = Date.now() - startTime;
  const filesPerSecond = (successCount / elapsed) * 1000;
  
  return {
    batchSize,
    delayMs,
    numAgents,
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
  
  // Test configurations with different batch sizes, delays, and number of agents
  const configs = [
    { batchSize: 100, delayMs: 0, numAgents: 1 },
    { batchSize: 500, delayMs: 0, numAgents: 1 },
    { batchSize: 1000, delayMs: 0, numAgents: 1 },
    { batchSize: 1000, delayMs: 0, numAgents: 2 },
    { batchSize: 1000, delayMs: 0, numAgents: 5 },
    { batchSize: 1000, delayMs: 0, numAgents: 10 },
    { batchSize: 1000, delayMs: 50, numAgents: 10 },
    { batchSize: 2000, delayMs: 0, numAgents: 10 },
  ];
  
  const results = [];
  
  for (const config of configs) {
    console.log(`Testing: ${config.batchSize} files, ${config.numAgents} agents, ${config.delayMs}ms delay...`);
    const result = await benchmark(config.batchSize, config.delayMs, config.numAgents, sampleFiles, folderId, drive);
    results.push(result);
    console.log(`   ⏱️  ${result.elapsed}ms | ✅ ${result.successCount} | ❌ ${result.failCount} | ⚡ ${result.filesPerSecond.toFixed(1)} files/sec\n`);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Find fastest
  const fastest = results.reduce((max, r) => r.filesPerSecond > max.filesPerSecond ? r : max);
  
  console.log('🎯 RESULTS\n');
  console.log('='.repeat(80));
  console.log('🏆 FASTEST CONFIGURATION:');
  console.log(`   Batch Size: ${fastest.batchSize}`);
  console.log(`   Number of Agents: ${fastest.numAgents}`);
  console.log(`   Delay: ${fastest.delayMs}ms`);
  console.log(`   Speed: ${fastest.filesPerSecond.toFixed(1)} files/second`);
  console.log(`   Estimated time for 40,000 files: ${Math.round(40000 / fastest.filesPerSecond)} seconds (${Math.round(40000 / fastest.filesPerSecond / 60)} minutes)`);
  console.log('='.repeat(80));
}

main().catch(console.error);

