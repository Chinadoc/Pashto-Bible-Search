// Debug script to test search indexing
const fs = require('fs');
const path = require('path');
const { gunzipSync } = require('zlib');

function loadVerses() {
  const filePath = path.join(process.cwd(), 'public', 'verses.json.gz');
  const compressed = fs.readFileSync(filePath);
  const jsonText = gunzipSync(compressed).toString('utf8');
  return JSON.parse(jsonText);
}

function testWordIndexing(word) {
  console.log(`Testing search indexing for: "${word}"`);
  console.log('=' .repeat(50));

  const verses = loadVerses();
  console.log(`Loaded ${Object.keys(verses).length} verses`);

  // Build search index like the app does
  const byTextLower = new Map();

  for (const [ref, verse] of Object.entries(verses)) {
    const text = verse.text || '';
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);

    for (const w of words) {
      if (w.length > 0) {
        const bucket = byTextLower.get(w) || [];
        bucket.push({ ref, text: text.substring(0, 50) + '...' });
        byTextLower.set(w, bucket);
      }
    }
  }

  console.log(`Search index built with ${byTextLower.size} unique words`);

  // Test our target word
  const lowerWord = word.toLowerCase();
  const matches = byTextLower.get(lowerWord) || [];

  console.log(`"${word}" -> "${lowerWord}" found in ${matches.length} verses`);

  if (matches.length > 0) {
    console.log('Sample matches:');
    matches.slice(0, 3).forEach((match, i) => {
      console.log(`  ${i+1}. ${match.ref}: ${match.text}`);
    });
  } else {
    console.log('No matches found in search index!');

    // Check if word exists in any verse text
    let foundInText = false;
    for (const [ref, verse] of Object.entries(verses)) {
      if (verse.text && verse.text.toLowerCase().includes(lowerWord)) {
        console.log(`Found in verse ${ref}: ${verse.text.substring(0, 100)}...`);
        foundInText = true;
        break;
      }
    }

    if (!foundInText) {
      console.log('Word not found in any verse text either!');
    }
  }
}

// Test the problematic words
testWordIndexing('دين');
testWordIndexing('ايمان');
testWordIndexing('الله');

