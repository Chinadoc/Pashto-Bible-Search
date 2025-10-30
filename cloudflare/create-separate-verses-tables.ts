/**
 * Create separate tables for Afghan 2023 and Yousafzai verses
 * Then migrate existing data from verses table to the appropriate tables
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-separate-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('🔄 Creating Separate Tables for Afghan 2023 and Yousafzai Verses\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Create verses_afghan2023 table
    console.log('\n📋 Step 1: Creating verses_afghan2023 table...');
    
    const createAfghan2023Table = `
      CREATE TABLE IF NOT EXISTS verses_afghan2023 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ref TEXT NOT NULL UNIQUE,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        text_normalized TEXT,
        text_html TEXT,
        testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
        translation_key TEXT NOT NULL DEFAULT 'afghan2023',
        dialect TEXT DEFAULT 'afghan',
        tags TEXT DEFAULT '[]',
        audio_r2_key TEXT,
        audio_public_url TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_afghan2023_ref ON verses_afghan2023(ref);
      CREATE INDEX IF NOT EXISTS idx_afghan2023_book ON verses_afghan2023(book, chapter, verse);
      CREATE INDEX IF NOT EXISTS idx_afghan2023_testament ON verses_afghan2023(testament);
      CREATE INDEX IF NOT EXISTS idx_afghan2023_translation ON verses_afghan2023(translation_key);
    `;
    
    await executeD1Sql(createAfghan2023Table);
    console.log('   ✅ Created verses_afghan2023 table');
    
    // Step 2: Create verses_yousafzai table
    console.log('\n📋 Step 2: Creating verses_yousafzai table...');
    
    const createYousafzaiTable = `
      CREATE TABLE IF NOT EXISTS verses_yousafzai (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ref TEXT NOT NULL UNIQUE,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        text_normalized TEXT,
        text_html TEXT,
        testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
        translation_key TEXT NOT NULL DEFAULT 'yousafzai2019',
        dialect TEXT DEFAULT 'yousafzai',
        tags TEXT DEFAULT '[]',
        audio_r2_key TEXT,
        audio_public_url TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_yousafzai_ref ON verses_yousafzai(ref);
      CREATE INDEX IF NOT EXISTS idx_yousafzai_book ON verses_yousafzai(book, chapter, verse);
      CREATE INDEX IF NOT EXISTS idx_yousafzai_testament ON verses_yousafzai(testament);
      CREATE INDEX IF NOT EXISTS idx_yousafzai_translation ON verses_yousafzai(translation_key);
    `;
    
    await executeD1Sql(createYousafzaiTable);
    console.log('   ✅ Created verses_yousafzai table');
    
    // Step 3: Migrate Afghan 2023 verses
    console.log('\n📤 Step 3: Migrating Afghan 2023 verses...');
    
    const migrateAfghan2023 = `
      INSERT OR REPLACE INTO verses_afghan2023 
        (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at)
      SELECT 
        ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at
      FROM verses
      WHERE translation_key = 'afghan2023';
    `;
    
    await executeD1Sql(migrateAfghan2023);
    
    // Check count
    const { stdout: afghanCount } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses_afghan2023;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const afghanResult = JSON.parse(afghanCount);
    const afghanData = Array.isArray(afghanResult) ? afghanResult[0] : afghanResult;
    const afghanCountNum = afghanData.results?.[0]?.count || 0;
    console.log(`   ✅ Migrated ${afghanCountNum.toLocaleString()} Afghan 2023 verses`);
    
    // Step 4: Migrate Yousafzai verses
    console.log('\n📤 Step 4: Migrating Yousafzai verses...');
    
    const migrateYousafzai = `
      INSERT OR REPLACE INTO verses_yousafzai 
        (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at)
      SELECT 
        ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at
      FROM verses
      WHERE translation_key = 'yousafzai2019';
    `;
    
    await executeD1Sql(migrateYousafzai);
    
    // Check count
    const { stdout: yousafzaiCount } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses_yousafzai;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const yousafzaiResult = JSON.parse(yousafzaiCount);
    const yousafzaiData = Array.isArray(yousafzaiResult) ? yousafzaiResult[0] : yousafzaiResult;
    const yousafzaiCountNum = yousafzaiData.results?.[0]?.count || 0;
    console.log(`   ✅ Migrated ${yousafzaiCountNum.toLocaleString()} Yousafzai verses`);
    
    // Step 5: Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(70));
    console.log(`   ✅ verses_afghan2023: ${afghanCountNum.toLocaleString()} verses`);
    console.log(`   ✅ verses_yousafzai: ${yousafzaiCountNum.toLocaleString()} verses`);
    
    // Get breakdown by testament
    const { stdout: afghanBreakdown } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_afghan2023 GROUP BY testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const afghanBreakdownResult = JSON.parse(afghanBreakdown);
    const afghanBreakdownData = Array.isArray(afghanBreakdownResult) ? afghanBreakdownResult[0] : afghanBreakdownResult;
    
    console.log('\n   Afghan 2023 breakdown:');
    if (afghanBreakdownData.results) {
      afghanBreakdownData.results.forEach((row: any) => {
        console.log(`      ${row.testament}: ${row.count.toLocaleString()} verses`);
      });
    }
    
    const { stdout: yousafzaiBreakdown } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_yousafzai GROUP BY testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const yousafzaiBreakdownResult = JSON.parse(yousafzaiBreakdown);
    const yousafzaiBreakdownData = Array.isArray(yousafzaiBreakdownResult) ? yousafzaiBreakdownResult[0] : yousafzaiBreakdownResult;
    
    console.log('\n   Yousafzai breakdown:');
    if (yousafzaiBreakdownData.results) {
      yousafzaiBreakdownData.results.forEach((row: any) => {
        console.log(`      ${row.testament}: ${row.count.toLocaleString()} verses`);
      });
    }
    
    console.log('\n✅ Separate tables created and data migrated!');
    console.log('\n💡 Note: The original `verses` table still exists. You can drop it later if desired.');
    
  } catch (error: any) {
    console.error(`\n❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

