const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalCheck() {
  console.log('\n✅ FINAL COVERAGE CHECK\n');

  try {
    // Load all words from index
    console.log('1️⃣  Loading all words from index...\n');
    
    const { data: allIndexed } = await supabase
      .from('word_occurrence_index')
      .select('word, translation_key')
      .limit(20000);

    // Create unique set
    const uniqueWords = new Set(allIndexed.map(w => w.word));
    console.log(`   Total unique words in index: ${uniqueWords.size}`);
    console.log(`   Total records in index: ${allIndexed.length} (includes duplicates by translation)\n`);

    // Load frequency lists
    const afghanFreq = JSON.parse(fs.readFileSync('app/data/word_frequency_list_enriched.json', 'utf8'));
    const yousafzaiFreq = JSON.parse(fs.readFileSync('app/data/yousafzai_word_frequency_list_enriched.json', 'utf8'));
    
    const allFreqWords = new Set([...Object.keys(afghanFreq), ...Object.keys(yousafzaiFreq)]);
    console.log(`2️⃣  Frequency words: ${allFreqWords.size}\n`);

    // Check coverage
    let covered = 0;
    let uncovered = [];
    
    for (const word of allFreqWords) {
      if (uniqueWords.has(word)) {
        covered++;
      } else {
        if (uncovered.length < 30) {
          uncovered.push(word);
        }
      }
    }

    console.log(`3️⃣  COVERAGE:\n`);
    console.log(`   ✅ Indexed: ${covered}/${allFreqWords.size} (${((covered/allFreqWords.size)*100).toFixed(1)}%)`);
    console.log(`   ❌ Missing: ${allFreqWords.size - covered}\n`);

    if (uncovered.length > 0) {
      console.log('   Uncovered words:');
      uncovered.forEach(w => console.log(`      - ${w}`));
    }

    // VERDICT
    console.log('\n4️⃣  VERDICT:\n');
    if (covered >= allFreqWords.size * 0.99) { // 99% threshold
      console.log('   ✅ YES - Can remove JSON fallback!');
      console.log(`   ${covered}/${allFreqWords.size} words indexed`);
      console.log('   All searches will use Supabase (fast!)');
    } else {
      console.log('   ❌ NO - Keep JSON fallback');
      console.log(`   Only ${covered}/${allFreqWords.size} words indexed`);
      console.log(`   Missing ${allFreqWords.size - covered} words`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

finalCheck();
