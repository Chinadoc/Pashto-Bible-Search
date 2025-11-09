/**
 * Simple script to trigger the R2 audio linking process
 * Run with: npx tsx scripts/run-link-r2-audio.ts
 */

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function linkR2Audio() {
  console.log('🚀 Starting R2 audio linking process...');
  console.log(`📡 Calling: ${WORKER_URL}/api/link-r2-audio\n`);

  try {
    const response = await fetch(`${WORKER_URL}/api/link-r2-audio`, {
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
    console.log(`   Processed: ${result.stats.processed} files`);
    console.log(`   Updated: ${result.stats.updated} verses`);
    console.log(`   Errors: ${result.stats.errors}`);
    
    if (result.stats.unmatched && result.stats.unmatched.length > 0) {
      console.log(`\n⚠️  Unmatched files (${result.stats.unmatched.length}):`);
      result.stats.unmatched.slice(0, 10).forEach((file: string) => {
        console.log(`   - ${file}`);
      });
      if (result.stats.unmatched.length > 10) {
        console.log(`   ... and ${result.stats.unmatched.length - 10} more`);
      }
    }
    
    console.log(`\n${result.message}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkR2Audio();

