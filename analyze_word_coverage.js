const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyze() {
  console.log('\n📊 WORD INDEX COVERAGE ANALYSIS\n');

  try {
    // 1. Check word_occurrence_index completeness
    console.log('1️⃣  WORD_OCCURRENCE_INDEX:\n');
    
    const { count: indexCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    console.log(`   Total indexed words: ${indexCount}`);

    // 2. Load frequency lists
    console.log('\n2️⃣  FREQUENCY LISTS:\n');
    
    const afghanFreq = JSON.parse(fs.readFileSync('app/data/word_frequency_list_enriched.json', 'utf8'));
    const yousafzaiFreq = JSON.parse(fs.readFileSync('app/data/yousafzai_word_frequency_list_enriched.json', 'utf8'));
    
    const allFreqWords = new Set([...Object.keys(afghanFreq), ...Object.keys(yousafzaiFreq)]);
    console.log(`   Total unique frequency words: ${allFreqWords.size}`);
    console.log(`   Afghan: ${Object.keys(afghanFreq).length}`);
    console.log(`   Yousafzai: ${Object.keys(yousafzaiFreq).length}`);

    // 3. Check coverage
    console.log('\n3️⃣  COVERAGE ANALYSIS:\n');

    const { data: indexedWords } = await supabase
      .from('word_occurrence_index')
      .select('word')
      .limit(10000);

    if (indexedWords) {
      const indexedSet = new Set(indexedWords.map(w => w.word));
      
      let covered = 0;
      let uncovered = [];
      
      for (const word of allFreqWords) {
        if (indexedSet.has(word)) {
          covered++;
        } else {
          if (uncovered.length < 20) {
            uncovered.push(word);
          }
        }
      }

      console.log(`   ✅ Covered by index: ${covered}/${allFreqWords.size} (${((covered/allFreqWords.size)*100).toFixed(1)}%)`);
      console.log(`   ❌ NOT in index: ${allFreqWords.size - covered}`);

      if (uncovered.length > 0) {
        console.log('\n   Sample uncovered words:');
        uncovered.forEach(w => console.log(`      - ${w}`));
      }

      // 4. Recommendation
      console.log('\n4️⃣  RECOMMENDATION:\n');
      console.log(`   Status: ${covered === allFreqWords.size ? 'COMPLETE' : 'INCOMPLETE'}`);
      
      if (covered < allFreqWords.size) {
        console.log('\n   ❌ CANNOT remove JSON fallback yet!');
        console.log(`      Missing ${allFreqWords.size - covered} words from index`);
        console.log('\n   OPTION 1: Add missing words to word_occurrence_index');
        console.log('   OPTION 2: Keep JSON fallback as safety net');
        console.log('   OPTION 3: Expand index to include inflected forms');
      } else {
        console.log('\n   ✅ CAN remove JSON fallback safely!');
        console.log('      All frequency words are indexed');
        console.log('      All searches will be fast (<100ms)');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyze();
