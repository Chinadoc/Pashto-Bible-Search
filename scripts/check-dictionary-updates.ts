#!/usr/bin/env tsx
/**
 * Check for Dictionary Updates and Update D1
 * 
 * This script:
 * 1. Checks the LingDocs dictionary info endpoint for latest release timestamp
 * 2. Compares with stored timestamp in D1
 * 3. Downloads and updates if new version is available
 * 4. Only updates changed entries (incremental update)
 * 
 * Usage:
 *   tsx scripts/check-dictionary-updates.ts [--force] [--dry-run]
 * 
 * Options:
 *   --force      : Force update even if version matches
 *   --dry-run    : Check for updates but don't perform them
 */

import { D1Client } from '../utils/d1';
import { getD1Database } from '../utils/d1';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DICTIONARY_INFO_URL = 'https://storage.lingdocs.com/dictionary/dictionary-info';
const DICTIONARY_DATA_URL = 'https://storage.lingdocs.com/dictionary/dictionary';
const DICTIONARY_FILE_PATH = join(process.cwd(), 'app/data/full_dictionary_enriched.json');

interface DictionaryInfo {
  release: number; // Timestamp
  numberOfEntries: number;
  title?: string;
  license?: string;
  url?: string;
  infoUrl?: string;
}

interface DictionaryEntry {
  ts: number;
  p: string;  // Pashto word
  f: string;  // Romanization/phonetics
  e: string;  // English definition
  c: string;  // Part of speech (POS)
  r?: number; // Commonality rank
  g?: string; // Simplified phonetics
  c_norm?: string;
  pos_family?: string;
  gender?: string;
  f_primary?: string;
  p_norm?: string;
}

interface DictionaryData {
  info?: DictionaryInfo;
  entries: DictionaryEntry[];
}

/**
 * Fetch dictionary info from LingDocs API
 */
async function fetchDictionaryInfo(): Promise<DictionaryInfo | null> {
  try {
    console.error('📡 Fetching dictionary info from LingDocs...');
    const response = await fetch(DICTIONARY_INFO_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary info: ${response.status} ${response.statusText}`);
    }
    
    const info = await response.json() as DictionaryInfo;
    console.error(`   ✅ Latest release: ${info.release} (${new Date(info.release).toISOString()})`);
    console.error(`   📊 Entries: ${info.numberOfEntries?.toLocaleString() || 'unknown'}`);
    
    return info;
  } catch (error) {
    console.error(`   ❌ Error fetching dictionary info: ${error}`);
    return null;
  }
}

/**
 * Get stored release timestamp from D1
 */
async function getStoredReleaseTimestamp(db: D1Client): Promise<number | null> {
  try {
    const result = await db.queryFirst<{ release_timestamp: number }>(
      `SELECT release_timestamp FROM dictionary_metadata ORDER BY release_timestamp DESC LIMIT 1`
    );
    
    return result?.release_timestamp || null;
  } catch (error) {
    // Table might not exist yet
    console.error('   ⚠️  Could not fetch stored timestamp (table may not exist):', error);
    return null;
  }
}

/**
 * Store release timestamp in D1
 */
async function storeReleaseTimestamp(db: D1Client, timestamp: number, entryCount: number): Promise<void> {
  try {
    await db.query(
      `INSERT OR REPLACE INTO dictionary_metadata (release_timestamp, entry_count, updated_at)
       VALUES (?, ?, strftime('%s', 'now'))`,
      [timestamp, entryCount]
    );
    console.error(`   ✅ Stored release timestamp: ${timestamp}`);
  } catch (error) {
    console.error(`   ❌ Error storing timestamp: ${error}`);
    throw error;
  }
}

/**
 * Download dictionary data from LingDocs
 */
async function downloadDictionary(): Promise<DictionaryData | null> {
  try {
    console.error('📥 Downloading dictionary data from LingDocs...');
    const response = await fetch(DICTIONARY_DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to download dictionary: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as DictionaryData;
    console.error(`   ✅ Downloaded ${data.entries?.length || 0} entries`);
    
    return data;
  } catch (error) {
    console.error(`   ❌ Error downloading dictionary: ${error}`);
    return null;
  }
}

/**
 * Get entries that have changed since last update
 */
async function getChangedEntries(
  db: D1Client,
  newEntries: DictionaryEntry[]
): Promise<{ changed: DictionaryEntry[]; new: DictionaryEntry[] }> {
  const changed: DictionaryEntry[] = [];
  const newEntriesList: DictionaryEntry[] = [];
  
  // Get existing entries with their timestamps
  const existingEntries = new Map<string, number>();
  
  try {
    const existing = await db.query<{ word: string; enriched_info: string }>(
      `SELECT word, enriched_info FROM dictionary LIMIT 10000`
    );
    
    for (const row of existing || []) {
      try {
        const enriched = JSON.parse(row.enriched_info || '{}');
        if (enriched.ts) {
          existingEntries.set(row.word, enriched.ts);
        }
      } catch {}
    }
  } catch (error) {
    console.error('   ⚠️  Could not fetch existing entries for comparison:', error);
  }
  
  for (const entry of newEntries) {
    if (!entry.p) continue;
    
    const existingTs = existingEntries.get(entry.p);
    
    if (!existingTs) {
      newEntriesList.push(entry);
    } else if (entry.ts > existingTs) {
      changed.push(entry);
    }
  }
  
  return { changed, new: newEntriesList };
}

/**
 * Update dictionary entries in D1
 */
async function updateDictionaryEntries(
  db: D1Client,
  entries: DictionaryEntry[],
  batchSize: number = 100
): Promise<number> {
  let updated = 0;
  
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(entries.length / batchSize);
    
    console.error(`   📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);
    
    for (const entry of batch) {
      if (!entry.p || !entry.c || !entry.e) continue;
      
      const romanization = entry.f_primary || entry.f || '';
      const pos = entry.c;
      const enrichedInfo = JSON.stringify({
        ts: entry.ts,
        r: entry.r,
        g: entry.g,
        c_norm: entry.c_norm,
        pos_family: entry.pos_family,
        gender: entry.gender,
        p_norm: entry.p_norm
      });
      
      try {
        await db.query(
          `INSERT OR REPLACE INTO dictionary (
            word, pos, definition, romanization, frequency, enriched_info, ts
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            entry.p,
            pos,
            entry.e,
            romanization,
            entry.r || 0,
            enrichedInfo,
            entry.ts
          ]
        );
        updated++;
      } catch (error) {
        console.error(`   ⚠️  Error updating entry ${entry.p}:`, error);
      }
    }
    
    // Small delay between batches
    if (i + batchSize < entries.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return updated;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run')
  };
}

/**
 * Main function
 */
async function main() {
  const { force, dryRun } = parseArgs();
  
  console.error('🚀 Starting dictionary update check...');
  if (dryRun) {
    console.error('   🔍 DRY RUN MODE - No changes will be made');
  }
  if (force) {
    console.error('   ⚡ FORCE MODE - Will update even if version matches');
  }
  
  let db = getD1Database();
  if (!db) {
    // Try to get from wrangler environment
    if (typeof process !== 'undefined' && process.env) {
      const wranglerDb = (process.env as any).DB || (process.env as any).WRANGLER_D1_DB;
      if (wranglerDb) {
        console.error('   ⚠️  Using D1 from environment variable');
        db = wranglerDb;
      }
    }
    
    if (!db) {
      console.error('❌ Error: D1 database not available');
      console.error('   Make sure you have D1 configured and are running with wrangler');
      console.error('   Or set DB environment variable with D1 database binding');
      process.exit(1);
    }
  }
  
  const d1Client = new D1Client(db);
  
  try {
    // 1. Fetch latest dictionary info
    const latestInfo = await fetchDictionaryInfo();
    if (!latestInfo) {
      console.error('❌ Could not fetch dictionary info. Exiting.');
      process.exit(1);
    }
    
    // 2. Check stored timestamp
    const storedTimestamp = await getStoredReleaseTimestamp(d1Client);
    
    if (storedTimestamp) {
      console.error(`\n📊 Current stored version: ${storedTimestamp} (${new Date(storedTimestamp).toISOString()})`);
      console.error(`   Latest available: ${latestInfo.release} (${new Date(latestInfo.release).toISOString()})`);
      
      if (latestInfo.release <= storedTimestamp && !force) {
        console.error('\n✅ Dictionary is up to date! No update needed.');
        return;
      }
      
      const daysSinceUpdate = (latestInfo.release - storedTimestamp) / (1000 * 60 * 60 * 24);
      console.error(`   ⏰ ${daysSinceUpdate.toFixed(1)} days since last update`);
    } else {
      console.error('\n📊 No stored version found. Will perform full update.');
    }
    
    if (dryRun) {
      console.error('\n🔍 DRY RUN: Would update dictionary, but skipping actual update.');
      return;
    }
    
    // 3. Download dictionary data
    const dictionaryData = await downloadDictionary();
    if (!dictionaryData) {
      console.error('❌ Could not download dictionary data. Exiting.');
      process.exit(1);
    }
    
    // 4. Determine which entries need updating
    console.error('\n🔍 Analyzing changes...');
    const { changed, new: newEntries } = await getChangedEntries(d1Client, dictionaryData.entries);
    
    console.error(`   📝 New entries: ${newEntries.length.toLocaleString()}`);
    console.error(`   🔄 Updated entries: ${changed.length.toLocaleString()}`);
    console.error(`   ✅ Unchanged entries: ${(dictionaryData.entries.length - newEntries.length - changed.length).toLocaleString()}`);
    
    const entriesToUpdate = [...newEntries, ...changed];
    
    if (entriesToUpdate.length === 0 && !force) {
      console.error('\n✅ No updates needed! Dictionary is current.');
      await storeReleaseTimestamp(d1Client, latestInfo.release, dictionaryData.entries.length);
      return;
    }
    
    // 5. Update entries
    console.error(`\n📦 Updating ${entriesToUpdate.length.toLocaleString()} entries in D1...`);
    const updated = await updateDictionaryEntries(d1Client, entriesToUpdate);
    
    console.error(`\n✅ Update complete! Updated ${updated.toLocaleString()} entries.`);
    
    // 6. Store new timestamp
    await storeReleaseTimestamp(d1Client, latestInfo.release, dictionaryData.entries.length);
    
    // 7. Save local copy (optional)
    try {
      console.error('\n💾 Saving local copy...');
      writeFileSync(DICTIONARY_FILE_PATH, JSON.stringify(dictionaryData, null, 2), 'utf8');
      console.error(`   ✅ Saved to ${DICTIONARY_FILE_PATH}`);
    } catch (error) {
      console.error(`   ⚠️  Could not save local copy: ${error}`);
    }
    
    console.error('\n🎉 Dictionary update complete!');
    
  } catch (error) {
    console.error('\n❌ Error during dictionary update:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main, fetchDictionaryInfo, getStoredReleaseTimestamp };

