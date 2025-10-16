import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const NT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

const NT_BOOK_PATTERNS = [
  // Standard patterns
  'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
  '1corinthians', '2corinthians', 'galatians', 'ephesians',
  'philippians', 'colossians', '1thessalonians', '2thessalonians',
  '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
  'james', '1peter', '2peter', '1john', '2john', '3john',
  'jude', 'revelation',
  // Alternative patterns (with dashes, underscores)
  '1-corinthians', '2-corinthians', '1-thessalonians', '2-thessalonians',
  '1-timothy', '2-timothy', '1-peter', '2-peter', '1-john', '2-john', '3-john',
  // Hyphenated forms (as they actually appear in filenames)
  '1-john', '2-john', '3-john', '1-peter', '2-peter',
  '1-corinthians', '2-corinthians', '1-thessalonians', '2-thessalonians',
  '1-timothy', '2-timothy',
  // Short forms
  '1cor', '2cor', '1thes', '2thes', '1tim', '2tim', '1pet', '2pet', '1joh', '2joh', '3joh'
];

async function analyzeAudioFiles() {
  try {
    console.log('🔍 Analyzing all audio files in Supabase storage...');
    
    // List all files in audio bucket
    const { data: files, error } = await supabase.storage
      .from('audio')
      .list('', { limit: 2000 });
      
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📊 Found ${files?.length || 0} total files`);
    
    // Categorize files
    const ntFiles = [];
    const otFiles = [];
    const yousafzaiFiles = [];
    const otherFiles = [];
    const afghanNtFiles = [];
    
    for (const file of files || []) {
      const filename = file.name?.toLowerCase();
      if (!filename) continue;
      
      // Check if it's Yousafzai
      if (filename.includes('yousafzai')) {
        yousafzaiFiles.push(file);
        continue;
      }
      
      // Check if it's NT Afghan 2023 (any NT book pattern)
      let isNt = false;
      for (const pattern of NT_BOOK_PATTERNS) {
        if (filename.includes(pattern)) {
          ntFiles.push(file);
          if (!filename.includes('yousafzai')) {
            afghanNtFiles.push(file);
          }
          isNt = true;
          break;
        }
      }
      
      if (isNt) continue;
      
      // Check if it's OT (not NT, not Yousafzai)
      if (!filename.includes('yousafzai') && !filename.includes('nt') && filename !== 'ot') {
        otFiles.push(file);
      } else {
        otherFiles.push(file);
      }
    }
    
    console.log(`\n📋 Categorization Results:`);
    console.log(`✅ NT files (all): ${ntFiles.length}`);
    console.log(`✅ Afghan NT files (NT - Yousafzai): ${afghanNtFiles.length}`);
    console.log(`🕌 Yousafzai files: ${yousafzaiFiles.length}`);
    console.log(`📖 OT files: ${otFiles.length}`);
    console.log(`❓ Other/uncategorized: ${otherFiles.length}`);
    
    // Analyze NT coverage
    console.log('\n📚 New Testament Coverage:');
    const ntBooksFound = new Set();
    
    for (const file of ntFiles) {
      for (const book of NT_BOOKS) {
        const filename = file.name?.toLowerCase() || '';

        // Check for exact book name matches (with spaces removed)
        const bookLower = book.toLowerCase().replace(/\s+/g, '');
        if (filename.includes(bookLower)) {
          ntBooksFound.add(book);
          break;
        }

        // Also check for hyphenated forms like "1-john" matching "1 John"
        if (book.includes(' ')) {
          const [num, name] = book.split(' ');
          const hyphenated = `${num}-${name.toLowerCase()}`;
          if (filename.includes(hyphenated)) {
            ntBooksFound.add(book);
            break;
          }

          // Also check for patterns like "1john" matching "1-john"
          if (filename.includes(`${num}${name.toLowerCase()}`)) {
            ntBooksFound.add(book);
            break;
          }
        }
      }
    }
    
    console.log(`✅ NT books with audio: ${ntBooksFound.size}/${NT_BOOKS.length}`);
    console.log('Books with audio:');
    Array.from(ntBooksFound).sort().forEach(book => {
      console.log(`  ✅ ${book}`);
    });
    
    const missingBooks = NT_BOOKS.filter(book => !ntBooksFound.has(book));
    if (missingBooks.length > 0) {
      console.log('\n❌ NT books WITHOUT audio:');
      missingBooks.forEach(book => {
        console.log(`  ❌ ${book}`);
      });
    }
    
    // Show samples
    if (afghanNtFiles.length > 0) {
      console.log('\n📋 Sample Afghan NT files to KEEP:');
      afghanNtFiles.slice(0, 10).forEach(file => {
        console.log(`  ✅ ${file.name}`);
      });
    }
    
    if (yousafzaiFiles.length > 0) {
      console.log('\n📋 Sample Yousafzai files to DELETE:');
      yousafzaiFiles.slice(0, 5).forEach(file => {
        console.log(`  🗑️ ${file.name}`);
      });
    }
    
    if (otFiles.length > 0) {
      console.log('\n📋 Sample OT files to DELETE:');
      otFiles.slice(0, 5).forEach(file => {
        console.log(`  🗑️ ${file.name}`);
      });
    }
    
    console.log(`\n🗑️ Total files to DELETE: ${yousafzaiFiles.length + otFiles.length + otherFiles.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeAudioFiles();
