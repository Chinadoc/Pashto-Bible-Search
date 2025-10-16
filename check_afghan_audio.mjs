import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Supabase not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAfghanAudio() {
  try {
    // List files in audio bucket
    const { data: files, error } = await supabase.storage
      .from('audio')
      .list('', { limit: 1000 });
      
    if (error) {
      console.error('Error listing files:', error);
      return;
    }
    
    console.log(`Found ${files?.length || 0} files in audio bucket`);
    
    // Filter for Afghan 2023 NT files (Matthew, Mark, Luke, John)
    const afghanNtFiles = files?.filter(file => {
      const name = file.name?.toLowerCase();
      return name && (
        name.includes('matthew') || 
        name.includes('mark') || 
        name.includes('luke') || 
        name.includes('john')
      );
    }) || [];
    
    console.log(`Afghan 2023 NT files to keep: ${afghanNtFiles.length}`);
    
    // Show sample files
    console.log('\nSample Afghan 2023 NT files:');
    afghanNtFiles.slice(0, 10).forEach(file => {
      console.log(`  ${file.name} (${Math.round(file.metadata?.size / 1024)}KB)`);
    });
    
    // Show files to delete
    const filesToDelete = files?.filter(file => !afghanNtFiles.includes(file)) || [];
    console.log(`\nFiles to delete: ${filesToDelete.length}`);
    console.log('Sample files to delete:');
    filesToDelete.slice(0, 10).forEach(file => {
      console.log(`  ${file.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAfghanAudio();
