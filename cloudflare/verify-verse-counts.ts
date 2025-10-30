/**
 * Verify final verse counts for both translations
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('📊 Verifying Final Verse Counts\n');
  console.log('='.repeat(70));
  
  try {
    // Check Afghan 2023
    console.log('\n📖 Afghan 2023 verses:');
    const { stdout: afghanRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_afghan2023 GROUP BY testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const afghanResult = JSON.parse(afghanRaw);
    const afghanData = Array.isArray(afghanResult) ? afghanResult[0] : afghanResult;
    
    let afghanTotal = 0;
    if (afghanData.results) {
      afghanData.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
        afghanTotal += row.count;
      });
    }
    console.log(`   Total: ${afghanTotal.toLocaleString()} verses`);
    
    // Check Yousafzai
    console.log('\n📖 Yousafzai 2019 verses:');
    const { stdout: yousafzaiRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_yousafzai GROUP BY testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const yousafzaiResult = JSON.parse(yousafzaiRaw);
    const yousafzaiData = Array.isArray(yousafzaiResult) ? yousafzaiResult[0] : yousafzaiResult;
    
    let yousafzaiTotal = 0;
    if (yousafzaiData.results) {
      yousafzaiData.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
        yousafzaiTotal += row.count;
      });
    }
    console.log(`   Total: ${yousafzaiTotal.toLocaleString()} verses`);
    
    // Expected counts
    console.log('\n📊 Expected Counts:');
    console.log('   Afghan 2023: ~25,536 verses (8,121 NT + 17,415 OT after cleanup)');
    console.log('   Yousafzai 2019: ~30,410 verses');
    
    console.log('\n📊 Comparison:');
    console.log(`   Afghan 2023: ${afghanTotal.toLocaleString()} actual vs ~25,536 expected (${afghanTotal >= 25000 ? '✅' : '❌'})`);
    console.log(`   Yousafzai 2019: ${yousafzaiTotal.toLocaleString()} actual vs ~30,410 expected (${yousafzaiTotal >= 30000 ? '✅' : '❌'})`);
    
    // Check total verses across both tables
    const { stdout: totalRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT (SELECT COUNT(*) FROM verses_afghan2023) + (SELECT COUNT(*) FROM verses_yousafzai) as total;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const totalResult = JSON.parse(totalRaw);
    const totalData = Array.isArray(totalResult) ? totalResult[0] : totalResult;
    const grandTotal = totalData.results?.[0]?.total || 0;
    
    console.log(`\n   Grand Total: ${grandTotal.toLocaleString()} verses`);
    
    if (afghanTotal >= 25000 && yousafzaiTotal >= 30000) {
      console.log('\n✅ All verse counts are within expected ranges!');
    } else {
      console.log('\n⚠️  Some verse counts may be incomplete. Check migration logs.');
    }
    
  } catch (error: any) {
    console.error(`\n❌ Verification failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

