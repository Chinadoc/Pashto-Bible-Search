import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkProgress() {
  // Count enriched entries
  const { count: enrichedCount } = await supabase
    .from('dictionary')
    .select('*', { count: 'exact', head: true })
    .not('inflection_pattern', 'is', null);

  // Count total entries
  const { count: totalCount } = await supabase
    .from('dictionary')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Enrichment Progress:`);
  console.log(`  Total entries: ${totalCount}`);
  console.log(`  Enriched: ${enrichedCount}`);
  console.log(`  Remaining: ${totalCount! - enrichedCount!}`);
  console.log(`  Progress: ${((enrichedCount! / totalCount!) * 100).toFixed(1)}%`);

  // Sample enriched entry
  const { data } = await supabase
    .from('dictionary')
    .select('pashto, inflection_pattern, enriched_info')
    .not('inflection_pattern', 'is', null)
    .limit(1);

  console.log(`\n✨ Sample enriched entry:`);
  console.log(JSON.stringify(data?.[0], null, 2));
}

checkProgress().then(() => process.exit(0));
