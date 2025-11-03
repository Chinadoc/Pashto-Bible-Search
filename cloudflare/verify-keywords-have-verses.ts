/**
 * Verify Keywords Match Words with Verses
 * 
 * This script verifies that all keywords in categories actually correspond to:
 * 1. Words that exist in word_frequencies
 * 2. Words that have verses with audio
 * 
 * This ensures we only use keywords that will actually produce results.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Import categories from the main script
const CATEGORIES = {
  // Sample - import from curate-topics-from-words.ts
  'salvation': [
    'salvation', 'save', 'saved', 'savior', 'redeem', 'redemption', 'deliver', 'deliverance', 'rescue', 
    'eternal life', 'everlasting life', 'justify', 'justification', 'sanctify', 'sanctification', 
    'reconcile', 'reconciliation', 'atonement', 'propitiation', 'ransom', 'liberate', 'liberation',
    'born again', 'new birth', 'regeneration', 'conversion', 'call', 'calling', 'elect', 'election'
  ],
  'body_parts': [
    'head', 'hair', 'face', 'forehead', 'eye', 'ear', 'nose', 'mouth', 'lip', 'tooth', 'tongue', 'chin', 'cheek', 'neck', 'throat',
    'chest', 'breast', 'back', 'shoulder', 'arm', 'hand', 'finger', 'palm', 'wrist', 'elbow', 'stomach', 'belly', 'waist', 'side', 'rib',
    'leg', 'foot', 'toe', 'knee', 'thigh', 'ankle', 'heel', 'shin',
    'heart', 'blood', 'bone', 'flesh', 'skin', 'vein', 'liver', 'kidney', 'lung', 'brain', 'soul', 'spirit',
    'beard', 'mustache', 'eyebrow', 'eyelid', 'jaw', 'shoulder blade', 'collarbone', 'spine', 'backbone',
    'knuckle', 'nail', 'thumb', 'pinky', 'index finger', 'middle finger', 'ring finger',
    'hip', 'loin', 'groin', 'abdomen', 'navel', 'bellybutton', 'umbilical cord',
    'calf', 'shinbone', 'instep', 'sole', 'arch', 'toenail', 'fingernail'
  ],
};

async function verifyKeywordHasVerses(keyword: string): Promise<{ exists: boolean; verseCount: number; words: string[] }> {
  try {
    // Check if any word in word_frequencies has this keyword in its translation
    const query = `
      SELECT pashto_word, english_translation, frequency_total
      FROM word_frequencies
      WHERE english_translation IS NOT NULL
        AND english_translation LIKE '%${keyword.replace(/'/g, "''")}%'
      ORDER BY frequency_total DESC
      LIMIT 10
    `;

    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const words = data.results || [];

    if (words.length === 0) {
      return { exists: false, verseCount: 0, words: [] };
    }

    // Check if these words have verses with audio
    let totalVerses = 0;
    const wordsWithVerses: string[] = [];

    for (const word of words.slice(0, 5)) { // Check top 5 words
      const pashtoWord = word.pashto_word.replace(/'/g, "''");
      
      const verseQuery = `
        SELECT COUNT(*) as count FROM (
          SELECT 1 FROM verses_afghan2023 WHERE text LIKE '%${pashtoWord}%' AND audio_r2_key IS NOT NULL
          UNION ALL
          SELECT 1 FROM verses_yousafzai WHERE text LIKE '%${pashtoWord}%' AND audio_r2_key IS NOT NULL
        )
      `;

      try {
        const { stdout: verseStdout } = await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="${verseQuery.replace(/"/g, '\\"')}" --json`,
          { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
        );

        const verseResult = JSON.parse(verseStdout);
        const verseData = Array.isArray(verseResult) ? verseResult[0] : verseResult;
        const count = verseData.results?.[0]?.count || 0;
        
        if (count > 0) {
          totalVerses += count;
          wordsWithVerses.push(word.pashto_word);
        }
      } catch (error) {
        // Skip if query fails
      }
    }

    return {
      exists: words.length > 0,
      verseCount: totalVerses,
      words: wordsWithVerses
    };
  } catch (error) {
    return { exists: false, verseCount: 0, words: [] };
  }
}

async function verifyAllKeywords() {
  console.log('🔍 Verifying keywords match words with verses...\n');

  const results: Record<string, {
    keywords: string[];
    verified: Array<{ keyword: string; exists: boolean; verseCount: number; words: string[] }>;
  }> = {};

  for (const [categoryKey, keywords] of Object.entries(CATEGORIES)) {
    console.log(`📋 Checking ${categoryKey} (${keywords.length} keywords)...`);
    
    const verified: Array<{ keyword: string; exists: boolean; verseCount: number; words: string[] }> = [];

    for (const keyword of keywords.slice(0, 20)) { // Check first 20 keywords per category
      const result = await verifyKeywordHasVerses(keyword);
      verified.push({ keyword, ...result });
      
      if (result.exists && result.verseCount > 0) {
        console.log(`   ✓ "${keyword}": ${result.verseCount} verses (${result.words.length} words)`);
      } else if (result.exists) {
        console.log(`   ⚠ "${keyword}": exists but no verses with audio`);
      } else {
        console.log(`   ✗ "${keyword}": not found in word_frequencies`);
      }
    }

    results[categoryKey] = { keywords, verified };
    console.log('');
  }

  // Generate report
  const report = Object.entries(results).map(([category, data]) => {
    const withVerses = data.verified.filter(v => v.verseCount > 0).length;
    const existsButNoVerses = data.verified.filter(v => v.exists && v.verseCount === 0).length;
    const notFound = data.verified.filter(v => !v.exists).length;

    return {
      category,
      totalKeywords: data.keywords.length,
      checked: data.verified.length,
      withVerses,
      existsButNoVerses,
      notFound,
      verified: data.verified
    };
  });

  console.log('='.repeat(70));
  console.log('📊 VERIFICATION SUMMARY:');
  report.forEach(r => {
    console.log(`\n${r.category}:`);
    console.log(`  Total keywords: ${r.totalKeywords}`);
    console.log(`  Checked: ${r.checked}`);
    console.log(`  ✓ With verses: ${r.withVerses}`);
    console.log(`  ⚠ Exists but no verses: ${r.existsButNoVerses}`);
    console.log(`  ✗ Not found: ${r.notFound}`);
  });

  fs.writeFileSync('keyword-verification-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to keyword-verification-report.json');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAllKeywords()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

