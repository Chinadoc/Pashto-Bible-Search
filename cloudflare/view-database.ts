import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function queryD1(sql: string): Promise<any> {
  try {
    const result = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${sql.replace(/"/g, '\\"')}" 2>&1`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    );
    
    const match = result.stdout.match(/"results":\s*(\[[\s\S]*?\])/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('📊 Cloudflare D1 Database Viewer\n');
  console.log('='.repeat(60));
  
  // Get all tables
  console.log('\n📋 Tables in Database:');
  const tables = await queryD1("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%' ORDER BY name;");
  if (tables) {
    tables.forEach((t: any) => console.log(`   - ${t.name}`));
  }
  
  // Get row counts
  console.log('\n📊 Row Counts:');
  const tablesList = tables?.map((t: any) => t.name) || [];
  
  for (const table of tablesList) {
    const count = await queryD1(`SELECT COUNT(*) as count FROM ${table};`);
    if (count && count[0]) {
      console.log(`   ${table.padEnd(25)} ${count[0].count.toLocaleString().padStart(10)} rows`);
    }
  }
  
  // Show sample verses
  console.log('\n📖 Sample Verses (first 3):');
  const verses = await queryD1('SELECT ref, book, chapter, verse, translation_key, SUBSTR(text, 1, 50) as text_preview FROM verses LIMIT 3;');
  if (verses) {
    verses.forEach((v: any) => {
      console.log(`\n   ${v.ref} (${v.translation_key})`);
      console.log(`   "${v.text_preview}..."`);
    });
  }
  
  // Translation breakdown
  console.log('\n📈 Translation Breakdown:');
  const breakdown = await queryD1("SELECT translation_key, COUNT(*) as count FROM verses GROUP BY translation_key;");
  if (breakdown) {
    breakdown.forEach((b: any) => {
      console.log(`   ${b.translation_key.padEnd(20)} ${b.count.toLocaleString().padStart(10)} verses`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 To view more data:');
  console.log('   1. Go to Cloudflare Dashboard → D1 → pashto-bible-db');
  console.log('   2. Click "Console" tab');
  console.log('   3. Run SQL queries like: SELECT * FROM verses LIMIT 10;');
}

main().catch(console.error);

