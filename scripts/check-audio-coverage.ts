/**
 * Check Audio Coverage in R2/D1
 * 
 * This script analyzes which chapters and books have audio files
 * and identifies gaps in audio coverage.
 */

const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface AudioCoverage {
  book: string;
  totalChapters: number;
  chaptersWithAudio: number[];
  chaptersWithoutAudio: number[];
  totalVerses: number;
  versesWithAudio: number;
  coveragePercent: number;
}

interface VerseAudioStatus {
  ref: string;
  hasAudio: boolean;
  audioKey?: string;
}

const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
];

async function quickAudioCheck(): Promise<Map<string, string>> {
  try {
    const response = await fetch(`${WORKER_URL}/api/audio-map`);
    if (response.ok) {
      const data = await response.json();
      return new Map(Object.entries(data.audioMap || {}));
    }
  } catch (error) {
    console.error('Error fetching audio map:', error);
  }
  return new Map();
}

async function main() {
  console.log('Audio Coverage Analysis');
  console.log('='.repeat(60));
  
  console.log('\nFetching audio map from Worker...');
  const audioMap = await quickAudioCheck();
  
  if (audioMap.size > 0) {
    console.log(`Audio map has ${audioMap.size} entries`);
    
    const byBook: Record<string, number> = {};
    for (const ref of audioMap.keys()) {
      const bookMatch = ref.match(/^(.+?)\s+\d+:/);
      if (bookMatch) {
        const book = bookMatch[1];
        byBook[book] = (byBook[book] || 0) + 1;
      }
    }
    
    console.log('\nAudio Coverage by Book:');
    console.log('-'.repeat(50));
    
    const booksWithAudio = Object.entries(byBook).sort((a, b) => b[1] - a[1]);
    for (const [book, count] of booksWithAudio) {
      console.log(`  ${book.padEnd(20)} ${count.toString().padStart(4)} verses with audio`);
    }
    
    const booksWithoutAudio = BIBLE_BOOKS.filter(b => !byBook[b.name]);
    if (booksWithoutAudio.length > 0) {
      console.log(`\nBooks WITHOUT any audio (${booksWithoutAudio.length}):`);
      for (const book of booksWithoutAudio) {
        console.log(`  - ${book.name}`);
      }
    }
    
    console.log('\nChecking specific verses:');
    const testRefs = [
      '1 Corinthians 9:26',
      '1 Corinthians 12:28',
      'Matthew 1:1',
      'John 3:16',
      'Psalms 23:1',
    ];
    
    for (const ref of testRefs) {
      const hasAudio = audioMap.has(ref);
      console.log(`  ${ref}: ${hasAudio ? 'Has audio' : 'No audio'}`);
    }
    
  } else {
    console.log('Audio map is empty or unavailable');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Audio coverage check complete!');
}

main().catch(console.error);

