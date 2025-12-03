#!/usr/bin/env node
/**
 * Import LingDocs Pashto Dictionary into Cloudflare D1
 * 
 * Source: https://storage.lingdocs.com/dictionary/dictionary.json
 * License: CC BY-NC-SA 4.0
 * 
 * This imports 18,690 dictionary entries with:
 * - Pashto text (p)
 * - Phonetics/romanization (f)
 * - English translation (e)
 * - Part of speech (c)
 * - LingDocs timestamp ID (ts)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '3ac1a6fafce90adf6b1c8f1280dfc94d';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = process.env.D1_DATABASE_ID || 'aef9d0cc-e775-4f51-98dc-11c8631dd597';

if (!CLOUDFLARE_API_TOKEN) {
  console.error('Error: CLOUDFLARE_API_TOKEN environment variable required');
  console.log('Usage: CLOUDFLARE_API_TOKEN=xxx node scripts/import-lingdocs-dictionary.js');
  process.exit(1);
}

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}`;

async function executeSQL(sql, params = []) {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });
  
  const data = await response.json();
  if (!data.success) {
    console.error('SQL Error:', data.errors);
    throw new Error(data.errors?.[0]?.message || 'SQL execution failed');
  }
  return data;
}

async function createTable() {
  console.log('Creating lingdocs_dictionary table...');
  
  const createSQL = `
    CREATE TABLE IF NOT EXISTS lingdocs_dictionary (
      ts INTEGER PRIMARY KEY,
      pashto TEXT NOT NULL,
      phonetics TEXT,
      english TEXT,
      pos TEXT,
      commonality INTEGER DEFAULT 3,
      alpha_index INTEGER,
      simplified_phonetics TEXT,
      link_ts INTEGER,
      inflection_info TEXT,
      UNIQUE(ts)
    );
  `;
  
  await executeSQL(createSQL);
  
  // Create indexes for fast search
  console.log('Creating indexes...');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_lingdocs_pashto ON lingdocs_dictionary(pashto);');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_lingdocs_phonetics ON lingdocs_dictionary(phonetics);');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_lingdocs_english ON lingdocs_dictionary(english);');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_lingdocs_commonality ON lingdocs_dictionary(commonality DESC);');
  
  console.log('Table and indexes created.');
}

async function importBatch(entries, startIdx) {
  // D1 has limits on query size, so we batch insert
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
    const values = batch.flatMap(entry => [
      entry.ts,
      entry.p,
      entry.f || null,
      entry.e || null,
      entry.c || null,
      entry.r || 3,
      entry.i || null,
      entry.g || null,
      entry.l || null,
      JSON.stringify({
        infap: entry.infap,
        infaf: entry.infaf,
        infbp: entry.infbp,
        infbf: entry.infbf,
        noInf: entry.noInf,
        app: entry.app,
        apf: entry.apf,
        ppp: entry.ppp,
        ppf: entry.ppf,
      })
    ]);
    
    const sql = `
      INSERT OR REPLACE INTO lingdocs_dictionary 
      (ts, pashto, phonetics, english, pos, commonality, alpha_index, simplified_phonetics, link_ts, inflection_info)
      VALUES ${placeholders}
    `;
    
    try {
      await executeSQL(sql, values);
      console.log(`Imported ${startIdx + i + batch.length}/${startIdx + entries.length} entries...`);
    } catch (error) {
      console.error(`Error at batch starting ${i}:`, error.message);
      // Try one by one
      for (const entry of batch) {
        try {
          await executeSQL(
            `INSERT OR REPLACE INTO lingdocs_dictionary 
             (ts, pashto, phonetics, english, pos, commonality, alpha_index, simplified_phonetics, link_ts, inflection_info)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              entry.ts,
              entry.p,
              entry.f || null,
              entry.e || null,
              entry.c || null,
              entry.r || 3,
              entry.i || null,
              entry.g || null,
              entry.l || null,
              JSON.stringify({
                infap: entry.infap,
                infaf: entry.infaf,
                infbp: entry.infbp,
                infbf: entry.infbf,
                noInf: entry.noInf,
                app: entry.app,
                apf: entry.apf,
                ppp: entry.ppp,
                ppf: entry.ppf,
              })
            ]
          );
        } catch (e) {
          console.error(`Failed to insert entry ${entry.ts} (${entry.p}):`, e.message);
        }
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }
}

async function main() {
  console.log('LingDocs Dictionary Import');
  console.log('==========================');
  
  // Load dictionary
  const dictPath = path.join(__dirname, '../data/lingdocs-dictionary.json');
  if (!fs.existsSync(dictPath)) {
    console.error('Dictionary file not found. Run:');
    console.log('curl -o data/lingdocs-dictionary.json https://storage.lingdocs.com/dictionary/dictionary.json');
    process.exit(1);
  }
  
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  console.log(`Loaded ${dict.entries.length} dictionary entries`);
  console.log(`Dictionary version: ${dict.info.release}`);
  console.log(`License: ${dict.info.license}`);
  
  // Create table
  await createTable();
  
  // Import entries in chunks
  const CHUNK_SIZE = 500;
  for (let i = 0; i < dict.entries.length; i += CHUNK_SIZE) {
    const chunk = dict.entries.slice(i, i + CHUNK_SIZE);
    await importBatch(chunk, i);
  }
  
  // Verify
  const countResult = await executeSQL('SELECT COUNT(*) as count FROM lingdocs_dictionary');
  console.log('\n✅ Import complete!');
  console.log(`Total entries in database: ${countResult.result[0].results[0].count}`);
  
  // Test search
  console.log('\nTesting search for فقیر...');
  const testResult = await executeSQL(
    "SELECT pashto, phonetics, english, pos FROM lingdocs_dictionary WHERE pashto LIKE ? LIMIT 5",
    ['%فقیر%']
  );
  console.log('Results:', JSON.stringify(testResult.result[0].results, null, 2));
}

main().catch(console.error);

