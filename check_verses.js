const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log('📊 Checking verse tables...\n');

  const { count: c1 } = await supabase
    .from('verses')
    .select('*', { count: 'exact', head: true });

  const { count: c2 } = await supabase
    .from('verses_yousafzai')
    .select('*', { count: 'exact', head: true });

  console.log(`Afghan 2023: ${c1} verses`);
  console.log(`Yousafzai 2019: ${c2} verses`);

  // Sample a verse
  const { data: sample } = await supabase
    .from('verses')
    .select('ref, text')
    .limit(1);

  if (sample && sample[0]) {
    console.log(`\nSample Afghan verse:\n  Ref: ${sample[0].ref}\n  Text: ${sample[0].text.substring(0, 100)}...`);
  }

  const { data: sample2 } = await supabase
    .from('verses_yousafzai')
    .select('ref, text')
    .limit(1);

  if (sample2 && sample2[0]) {
    console.log(`\nSample Yousafzai verse:\n  Ref: ${sample2[0].ref}\n  Text: ${sample2[0].text.substring(0, 100)}...`);
  }
}

check().catch(console.error);
