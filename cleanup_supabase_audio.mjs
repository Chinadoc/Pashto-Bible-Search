import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAudio() {
  try {
    console.log('🔍 Analyzing audio files in Supabase storage...');
    
    // List all files in audio bucket
    const { data: files, error: listError } = await supabase.storage
      .from('audio')
      .list('', { limit: 1000 });
      
    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('📭 No files found in audio bucket');
      return;
    }
    
    console.log(`📊 Found ${files.length} total files`);
    
    // Filter for Afghan 2023 NT files (Matthew, Mark, Luke, John)
    const afghanNtFiles = files.filter(file => {
      const name = file.name?.toLowerCase();
      return name && (
        name.includes('matthew') || 
        name.includes('mark') || 
        name.includes('luke') || 
        name.includes('john')
      );
    });
    
    console.log(`✅ Afghan 2023 NT files to keep: ${afghanNtFiles.length}`);
    
    // Files to delete (everything except Afghan NT)
    const filesToDelete = files.filter(file => !afghanNtFiles.includes(file));
    console.log(`🗑️ Files to delete: ${filesToDelete.length}`);
    
    if (filesToDelete.length === 0) {
      console.log('✨ Nothing to delete - all files are Afghan 2023 NT audio');
      return;
    }
    
    // Confirm deletion
    console.log('\n⚠️  WARNING: This will permanently delete audio files!');
    console.log('Files to be deleted:');
    filesToDelete.slice(0, 5).forEach(file => {
      console.log(`  - ${file.name}`);
    });
    if (filesToDelete.length > 5) {
      console.log(`  ... and ${filesToDelete.length - 5} more files`);
    }
    
    // Uncomment the following lines to actually perform the deletion
    /*
    console.log('\n🗑️ Deleting files...');
    for (const file of filesToDelete) {
      const { error: deleteError } = await supabase.storage
        .from('audio')
        .remove([file.name]);
      
      if (deleteError) {
        console.error(`❌ Failed to delete ${file.name}:`, deleteError);
      } else {
        console.log(`✅ Deleted: ${file.name}`);
      }
    }
    */
    
    console.log('\n📋 Uncomment the deletion code in this script to actually perform the cleanup');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupAudio();
