/**
 * Script to link missing R2 audio files for verses without audio_r2_key
 * Run with: npx tsx scripts/run-link-missing-r2-audio.ts
 */

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function linkMissingR2Audio() {
  console.log('🚀 Starting missing R2 audio linking process...');
  console.log(`📡 Calling: ${WORKER_URL}/api/link-missing-r2-audio\n`);

  try {
    const response = await fetch(`${WORKER_URL}/api/link-missing-r2-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ Linking completed!\n');
    console.log('📊 Results:');
    console.log(`   Verses checked: ${result.stats.versesChecked}`);
    console.log(`   Files found in R2: ${result.stats.filesFound}`);
    console.log(`   Verses updated: ${result.stats.updated}`);
    console.log(`   Files not found: ${result.stats.notFound}`);
    console.log(`   Errors: ${result.stats.errors}`);
    
    if (result.stats.sampleNotFound && result.stats.sampleNotFound.length > 0) {
      console.log(`\n⚠️  Sample verses not found in R2 (${result.stats.sampleNotFound.length} shown):`);
      result.stats.sampleNotFound.forEach((verse: string) => {
        console.log(`   - ${verse}`);
      });
    }
    
    console.log(`\n${result.message}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkMissingR2Audio();

