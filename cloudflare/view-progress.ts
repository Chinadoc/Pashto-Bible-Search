/**
 * Real-time progress viewer for D1 migration
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function queryD1(command: string): Promise<any> {
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${command.replace(/"/g, '\\"')}"`
    );
    
    // Parse JSON output
    const lines = stdout.split('\n');
    const jsonLine = lines.find(l => l.trim().startsWith('[') || l.trim().startsWith('{'));
    if (jsonLine) {
      return JSON.parse(jsonLine);
    }
    return null;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function showProgress() {
  console.log('\n📊 Cloudflare D1 Migration Progress');
  console.log('====================================\n');
  
  // Verses by translation
  const versesByTranslation = await queryD1(
    'SELECT translation_key, COUNT(*) as count FROM verses GROUP BY translation_key'
  );
  
  if (versesByTranslation?.results) {
    console.log('📖 Verses:');
    versesByTranslation.results.forEach((row: any) => {
      const key = row.translation_key || 'unknown';
      const count = row.count || 0;
      const expected = key === 'yousafzai2019' ? 30410 : 24160;
      const percent = ((count / expected) * 100).toFixed(1);
      console.log(`   ${key}: ${count.toLocaleString()} / ${expected.toLocaleString()} (${percent}%)`);
    });
    
    const totalVerses = versesByTranslation.results.reduce((sum: number, row: any) => sum + (row.count || 0), 0);
    const totalExpected = 54570;
    const totalPercent = ((totalVerses / totalExpected) * 100).toFixed(1);
    console.log(`   Total: ${totalVerses.toLocaleString()} / ${totalExpected.toLocaleString()} (${totalPercent}%)`);
  }
  
  // Word frequencies
  const wordFreq = await queryD1('SELECT COUNT(*) as count FROM word_frequencies');
  if (wordFreq?.results?.[0]) {
    const count = wordFreq.results[0].count || 0;
    const expected = 7405;
    const percent = ((count / expected) * 100).toFixed(1);
    console.log(`\n📊 Word Frequencies: ${count.toLocaleString()} / ${expected.toLocaleString()} (${percent}%)`);
  }
  
  // Form occurrences
  const formOcc = await queryD1('SELECT COUNT(*) as count FROM form_occurrences');
  if (formOcc?.results?.[0]) {
    const count = formOcc.results[0].count || 0;
    const expected = 7252;
    const percent = ((count / expected) * 100).toFixed(1);
    console.log(`🔍 Form Occurrences: ${count.toLocaleString()} / ${expected.toLocaleString()} (${percent}%)`);
  }
  
  // Form to root
  const formRoot = await queryD1('SELECT COUNT(*) as count FROM form_to_root');
  if (formRoot?.results?.[0]) {
    const count = formRoot.results[0].count || 0;
    const expected = 7252;
    const percent = ((count / expected) * 100).toFixed(1);
    console.log(`🔗 Form to Root: ${count.toLocaleString()} / ${expected.toLocaleString()} (${percent}%)`);
  }
  
  // Audio keys
  const audioKeys = await queryD1('SELECT COUNT(*) as count FROM verses WHERE audio_r2_key IS NOT NULL');
  if (audioKeys?.results?.[0]) {
    const count = audioKeys.results[0].count || 0;
    console.log(`\n🎵 Verses with Audio R2 Keys: ${count.toLocaleString()}`);
  }
  
  // Sample verse
  const sample = await queryD1('SELECT ref, translation_key, audio_r2_key FROM verses LIMIT 1');
  if (sample?.results?.[0]) {
    console.log(`\n📝 Sample Verse: ${sample.results[0].ref} (${sample.results[0].translation_key})`);
    if (sample.results[0].audio_r2_key) {
      console.log(`   Audio: ${sample.results[0].audio_r2_key}`);
    }
  }
  
  console.log('\n');
}

// Run continuously every 5 seconds
console.log('Press Ctrl+C to stop\n');

const interval = setInterval(() => {
  showProgress();
}, 5000);

showProgress(); // Show immediately

process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('\n\n✅ Progress monitoring stopped');
  process.exit(0);
});


