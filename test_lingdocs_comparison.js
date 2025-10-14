// Test script to compare LingDocs output vs current system
const path = require('path');

// Import LingDocs library
const lingdocsPath = path.join(__dirname, 'pashto-inflector/src/lib/dist/lib/library.cjs');
const lingdocs = require(lingdocsPath);

// Test data - some common Pashto words with proper LingDocs format
const testWords = [
  // Verbs
  {
    word: 'کول',
    type: 'verb',
    english: 'to do',
    entry: {
      ts: Date.now(),
      i: 1,
      p: 'کول',
      f: 'kawul',
      g: 'kawul',
      e: 'to do',
      c: 'v. trans.',
    }
  },
  {
    word: 'وهل',
    type: 'verb',
    english: 'to hit',
    entry: {
      ts: Date.now(),
      i: 2,
      p: 'وهل',
      f: 'wahul',
      g: 'wahul',
      e: 'to hit',
      c: 'v. trans.',
    }
  },
  {
    word: 'خوړل',
    type: 'verb',
    english: 'to eat',
    entry: {
      ts: Date.now(),
      i: 3,
      p: 'خوړل',
      f: 'khoRul',
      g: 'khoRul',
      e: 'to eat',
      c: 'v. trans.',
    }
  },
  {
    word: 'تلل',
    type: 'verb',
    english: 'to go',
    entry: {
      ts: Date.now(),
      i: 4,
      p: 'تلل',
      f: 'tlul',
      g: 'tlul',
      e: 'to go',
      c: 'v. intrans.',
    }
  },
  {
    word: 'کېدل',
    type: 'verb',
    english: 'to become',
    entry: {
      ts: Date.now(),
      i: 5,
      p: 'کېدل',
      f: 'kedul',
      g: 'kedul',
      e: 'to become',
      c: 'v. intrans.',
    }
  },

  // Nouns
  {
    word: 'کور',
    type: 'noun',
    english: 'house',
    entry: {
      ts: Date.now(),
      i: 6,
      p: 'کور',
      f: 'kor',
      g: 'kor',
      e: 'house',
      c: 'n. m.',
    }
  },
  {
    word: 'ښځه',
    type: 'noun',
    english: 'woman',
    entry: {
      ts: Date.now(),
      i: 7,
      p: 'ښځه',
      f: 'xkZa',
      g: 'xkZa',
      e: 'woman',
      c: 'n. f.',
    }
  },
  {
    word: 'ماشوم',
    type: 'noun',
    english: 'child',
    entry: {
      ts: Date.now(),
      i: 8,
      p: 'ماشوم',
      f: 'maashoom',
      g: 'maashoom',
      e: 'child',
      c: 'n. m.',
    }
  },

  // Adjectives
  {
    word: 'ښه',
    type: 'adjective',
    english: 'good',
    entry: {
      ts: Date.now(),
      i: 9,
      p: 'ښه',
      f: 'xa',
      g: 'xa',
      e: 'good',
      c: 'adj.',
    }
  },
];

async function testLingDocs() {
  console.log('🧪 Testing LingDocs Library Functions\n');

  for (const testCase of testWords) {
    console.log(`\n📝 Testing "${testCase.word}" (${testCase.english}) - Type: ${testCase.type}`);

    try {
      if (testCase.type === 'verb') {
        // Test verb conjugation
        console.log('🔍 Verb entry:', testCase.entry);

        const conjugation = lingdocs.conjugateVerb(testCase.entry);
        console.log('✅ LingDocs conjugation result:', {
          hasImperfective: !!conjugation.imperfective,
          hasPerfective: !!conjugation.perfective,
          hasParticiple: !!conjugation.participle,
          imperfectiveKeys: conjugation.imperfective ? Object.keys(conjugation.imperfective) : [],
          perfectiveKeys: conjugation.perfective ? Object.keys(conjugation.perfective) : [],
        });

        if (conjugation.imperfective) {
          console.log('🎯 Imperfective forms:');
          Object.entries(conjugation.imperfective).forEach(([key, form]) => {
            if (form) {
              console.log(`  ${key}:`, form);
            }
          });
        }

        if (conjugation.perfective) {
          console.log('🎯 Perfective forms:');
          Object.entries(conjugation.perfective).forEach(([key, form]) => {
            if (form) {
              console.log(`  ${key}:`, form);
            }
          });
        }

        if (conjugation.participle) {
          console.log('🎯 Participle forms:');
          Object.entries(conjugation.participle).forEach(([key, form]) => {
            if (form) {
              console.log(`  ${key}:`, form);
            }
          });
        }

      } else if (testCase.type === 'noun' || testCase.type === 'adjective') {
        // Test noun/adjective inflection
        console.log('🔍 Noun/Adj entry:', testCase.entry);

        const inflectionResult = lingdocs.inflectWord(testCase.entry);
        console.log('✅ LingDocs inflection result:', {
          hasInflection: !!inflectionResult,
          inflectionKeys: inflectionResult ? Object.keys(inflectionResult) : [],
        });

        if (inflectionResult) {
          Object.entries(inflectionResult).forEach(([key, forms]) => {
            if (forms) {
              console.log(`  ${key}:`, forms);
            }
          });
        }
      }

    } catch (error) {
      console.error(`❌ Error testing "${testCase.word}":`, error.message);
    }
  }
}

// Run the test
testLingDocs().catch(console.error);
