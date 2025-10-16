import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
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

async function checkSupabaseAudio() {
  try {
    console.log('🔍 Checking Supabase audio storage...');
    
    // List files in audio bucket
    const { data: files, error } = await supabase.storage
      .from('audio')
      .list('', { limit: 2000 });
      
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📊 Found ${files?.length || 0} files in audio bucket`);
    
    if (!files || files.length === 0) {
      console.log('📭 No audio files found');
      return;
    }
    
    // Analyze files by book
    const filesByBook = {};
    const afghanNtFiles = [];
    const otherFiles = [];
    
    for (const file of files) {
      const filename = file.name?.toLowerCase();
      if (!filename) continue;
      
      // Check if it's an Afghan NT file (Matthew, Mark, Luke, John)
      const isAfghanNt = filename.includes('matthew') || filename.includes('mark') || 
                        filename.includes('luke') || filename.includes('john');
      
      if (isAfghanNt) {
        afghanNtFiles.push(file);
      } else {
        otherFiles.push(file);
      }
      
      // Categorize by book
      for (const book of NT_BOOKS) {
        if (filename.includes(book.toLowerCase())) {
          if (!filesByBook[book]) filesByBook[book] = [];
          filesByBook[book].push(file);
          break;
        }
      }
    }
    
    console.log(`\n✅ Afghan 2023 NT files (Matthew/Mark/Luke/John): ${afghanNtFiles.length}`);
    console.log(`🗑️ Other files to delete: ${otherFiles.length}`);
    
    console.log('\n📚 New Testament books found:');
    for (const [book, bookFiles] of Object.entries(filesByBook)) {
      console.log(`  ${book}: ${bookFiles.length} files`);
    }
    
    console.log('\n⚠️ WARNING: Make sure all NT books are accounted for!');
    console.log('The following NT books have NO audio files:');
    const booksWithoutAudio = NT_BOOKS.filter(book => !filesByBook[book]);
    if (booksWithoutAudio.length > 0) {
      booksWithoutAudio.forEach(book => console.log(`  ❌ ${book}`));
    } else {
      console.log('  ✅ All NT books have audio files');
    }
    
    // Show sample files
    if (afghanNtFiles.length > 0) {
      console.log('\n📋 Sample Afghan NT files to KEEP:');
      afghanNtFiles.slice(0, 5).forEach(file => {
        console.log(`  ✅ ${file.name}`);
      });
    }
    
    if (otherFiles.length > 0) {
      console.log('\n📋 Sample files to DELETE:');
      otherFiles.slice(0, 5).forEach(file => {
        console.log(`  🗑️ ${file.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSupabaseAudio();
