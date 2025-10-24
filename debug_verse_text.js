const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debug() {
  console.log('🔍 Checking actual verse text...\n');

  // Get a verse that should contain خدا
  const { data } = await supabase
    .from('verses')
    .select('ref, text')
    .ilike('text', '%خدا%')
    .limit(5);

  if (!data || data.length === 0) {
    console.log('❌ No verses found with "خدا"');
    
    // Try Yousafzai
    const { data: y } = await supabase
      .from('verses_yousafzai')
      .select('ref, text')
      .ilike('text', '%خدا%')
      .limit(5);
    
    if (y && y.length > 0) {
      console.log('✅ Found in Yousafzai:');
      y.forEach(v => {
        console.log(`\nRef: ${v.ref}`);
        console.log(`Text: ${v.text}`);
        console.log(`First 100 chars: ${v.text.substring(0, 100)}`);
      });
    }
  } else {
    console.log('✅ Found in Afghan:');
    data.forEach(v => {
      console.log(`\nRef: ${v.ref}`);
      console.log(`Text: ${v.text}`);
      console.log(`First 100 chars: ${v.text.substring(0, 100)}`);
    });
  }

  // Check if ویل exists
  console.log('\n\n🔎 Checking for ویل (base form)...');
  const { data: vil } = await supabase
    .from('verses')
    .select('ref, text')
    .ilike('text', '%ویل%')
    .limit(3);

  if (!vil || vil.length === 0) {
    console.log('❌ No verses with "ویل" in Afghan');
  } else {
    console.log(`✅ Found ${vil.length} verses with "ویل"`);
    vil.forEach(v => {
      console.log(`\n  ${v.ref}: ${v.text.substring(0, 80)}`);
    });
  }
}

debug().catch(console.error);
