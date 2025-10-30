/**
 * Visual progress display for D1 migration
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getCount(table: string, where?: string): Promise<number> {
  try {
    const command = where 
      ? `SELECT COUNT(*) as count FROM ${table} WHERE ${where}`
      : `SELECT COUNT(*) as count FROM ${table}`;
    
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${command.replace(/"/g, '\\"')}"`
    );
    
    // Extract count from JSON
    const match = stdout.match(/"count":\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  } catch {
    return 0;
  }
}

function progressBar(current: number, total: number, width: number = 30): string {
  const percent = total > 0 ? (current / total) * 100 : 0;
  const filled = Math.floor((current / total) * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.toFixed(1)}%`;
}

async function displayProgress() {
  console.clear();
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        📊 Cloudflare D1 Migration Progress                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Verses
  const yousafzaiCount = await getCount('verses', "translation_key = 'yousafzai2019'");
  const afghanCount = await getCount('verses', "translation_key = 'afghan2023'");
  const totalVerses = yousafzaiCount + afghanCount;
  
  console.log('📖 VERSES MIGRATION');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Yousafzai 2019: ${yousafzaiCount.toLocaleString().padStart(6)} / 30,410 ${progressBar(yousafzaiCount, 30410)}`);
  console.log(`Afghan 2023:    ${afghanCount.toLocaleString().padStart(6)} / 24,160 ${progressBar(afghanCount, 24160)}`);
  console.log(`Total:          ${totalVerses.toLocaleString().padStart(6)} / 54,570 ${progressBar(totalVerses, 54570)}`);
  
  // Other data
  const wordFreq = await getCount('word_frequencies');
  const formOcc = await getCount('form_occurrences');
  const formRoot = await getCount('form_to_root');
  const audioKeys = await getCount('verses', 'audio_r2_key IS NOT NULL');
  
  console.log('\n📊 OTHER DATA');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Word Frequencies: ${wordFreq.toLocaleString().padStart(6)} / 7,405 ${progressBar(wordFreq, 7405)}`);
  console.log(`Form Occurrences: ${formOcc.toLocaleString().padStart(6)} / 7,252 ${progressBar(formOcc, 7252)}`);
  console.log(`Form to Root:     ${formRoot.toLocaleString().padStart(6)} / 7,252 ${progressBar(formRoot, 7252)}`);
  console.log(`Verses w/ Audio:  ${audioKeys.toLocaleString().padStart(6)}`);
  
  // Overall progress
  const totalItems = totalVerses + wordFreq + formOcc + formRoot;
  const totalExpected = 54570 + 7405 + 7252 + 7252;
  const overallPercent = ((totalItems / totalExpected) * 100).toFixed(1);
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  Overall Progress: ${overallPercent.padStart(5)}% (${totalItems.toLocaleString()} / ${totalExpected.toLocaleString()} items)    ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  if (totalVerses < 54570) {
    console.log('💡 Migration appears to have stopped.');
    console.log('   To continue: npx tsx cloudflare/migrate-comprehensive-to-d1.ts\n');
  }
}

displayProgress();


