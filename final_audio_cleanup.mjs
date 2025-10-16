import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAudioStorage() {
  try {
    console.log('🧹 FINAL AUDIO CLEANUP - Keep only NT Afghan 2023 audio');
    console.log('=' .repeat(60));
    
    // List all files in audio bucket
    const { data: files, error } = await supabase.storage
      .from('audio')
      .list('', { limit: 2000 });
      
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`📊 Found ${files?.length || 0} total files`);
    
    // Categorize files without double-counting
    const ntFiles = new Set();
    const filesToDelete = [];
    
    for (const file of files || []) {
      const name = file.name?.toLowerCase();
      if (!name || !name.endsWith('.mp3')) {
        filesToDelete.push(file.name);
        continue;
      }

      // Check if it contains any NT book name FIRST (keep)
      const ntBooks = [
        'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
        '1corinthians', '2corinthians', 'galatians', 'ephesians',
        'philippians', 'colossians', '1thessalonians', '2thessalonians',
        '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
        'james', 'peter', '1peter', '2peter', '1john', '2john', '3john',
        'jude', 'revelation', 'corinthians', 'thessalonians', 'timothy'
      ];

      let isNt = false;
      for (const book of ntBooks) {
        if (name.includes(book)) {
          isNt = true;
          ntFiles.add(file.name);
          break;
        }
      }

      if (isNt) {
        continue; // Skip to next file
      }

      // Check if it's Yousafzai (delete)
      if (name.includes('yousafzai')) {
        filesToDelete.push(file.name);
        continue;
      }

      // Check if it's OT (delete) - but be more specific to avoid false positives
      if (name === 'ot' || name.startsWith('ot') || name.includes('ot-') || name.includes('-ot')) {
        filesToDelete.push(file.name);
        continue;
      }

      // If none of the above, it's not NT and not explicitly OT/Yousafzai, so delete
      filesToDelete.push(file.name);
    }
    
    console.log(`\n📋 CLEANUP SUMMARY:`);
    console.log(`✅ NT Afghan files to KEEP: ${ntFiles.size}`);
    console.log(`🗑️ Files to DELETE: ${filesToDelete.length}`);
    
    if (filesToDelete.length === 0) {
      console.log('\n✨ No files to delete - cleanup complete!');
      return;
    }
    
    // Show what will be deleted
    console.log('\n📋 Files to be DELETED:');
    filesToDelete.slice(0, 10).forEach(filename => {
      console.log(`  🗑️ ${filename}`);
    });
    if (filesToDelete.length > 10) {
      console.log(`  ... and ${filesToDelete.length - 10} more files`);
    }
    
    // CONFIRMATION
    console.log('\n⚠️  WARNING: This will permanently delete', filesToDelete.length, 'audio files!');
    console.log('Only Afghan 2023 New Testament audio will remain.');
    console.log('\nBooks that WILL be preserved:');
    const preservedBooks = ['John', 'Acts', '1 Corinthians', '2 Corinthians', '1 Thessalonians', '2 Thessalonians', '1 Peter', '2 Peter'];
    preservedBooks.forEach(book => console.log(`  ✅ ${book}`));
    
    console.log('\nBooks that are MISSING (not uploaded yet):');
    const missingBooks = ['Matthew', 'Mark', 'Luke', 'Romans', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];
    missingBooks.forEach(book => console.log(`  ❌ ${book}`));
    
    // Uncomment the following lines to actually perform the deletion
    /*
    console.log('\n🗑️ Deleting files...');
    
    // Delete in batches of 100 to avoid timeouts
    const batchSize = 100;
    for (let i = 0; i < filesToDelete.length; i += batchSize) {
      const batch = filesToDelete.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase.storage
        .from('audio')
        .remove(batch);
      
      if (deleteError) {
        console.error(`❌ Failed to delete batch ${Math.floor(i / batchSize) + 1}:`, deleteError);
      } else {
        console.log(`✅ Deleted batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)`);
      }
    }
    
    console.log(`\n🎉 Cleanup complete! ${ntFiles.size} Afghan NT audio files remain.`);
    */
    
    console.log('\n📋 Uncomment the deletion code in this script to actually perform the cleanup');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupAudioStorage();
