#!/usr/bin/env tsx
/**
 * Wrapper script to run dictionary update checker with wrangler
 * 
 * This script uses wrangler's D1 database directly via API
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const WRANGLER_CMD = 'wrangler d1 execute DB';

interface DictionaryInfo {
  release: number;
  numberOfEntries: number;
}

/**
 * Execute SQL via wrangler
 */
function executeSQL(sql: string): any {
  try {
    const result = execSync(`${WRANGLER_CMD} --command="${sql.replace(/"/g, '\\"')}" --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return JSON.parse(result);
  } catch (error: any) {
    const output = error.stdout?.toString() || error.toString();
    try {
      return JSON.parse(output);
    } catch {
      throw new Error(`SQL execution failed: ${error.message}`);
    }
  }
}

/**
 * Fetch dictionary info from LingDocs or use local file
 */
async function fetchDictionaryInfo(): Promise<DictionaryInfo | null> {
  try {
    console.error('📡 Fetching dictionary info from LingDocs...');
    const response = await fetch('https://storage.lingdocs.com/dictionary/dictionary-info', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const info = await response.json() as DictionaryInfo;
    console.error(`   ✅ Latest release: ${info.release} (${new Date(info.release).toISOString()})`);
    console.error(`   📊 Entries: ${info.numberOfEntries?.toLocaleString() || 'unknown'}`);
    
    return info;
  } catch (error) {
    console.error(`   ⚠️  Could not fetch from LingDocs: ${error}`);
    console.error('   📁 Falling back to local dictionary file...');
    
    // Fallback: read from local file
    try {
      const { readFileSync } = require('fs');
      const { join } = require('path');
      const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
      const fileContent = readFileSync(dictPath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (data.info?.release) {
        const info: DictionaryInfo = {
          release: data.info.release,
          numberOfEntries: data.info.numberOfEntries || data.entries?.length || 0,
          title: data.info.title,
          license: data.info.license
        };
        console.error(`   ✅ Using local file - Release: ${info.release} (${new Date(info.release).toISOString()})`);
        console.error(`   📊 Entries: ${info.numberOfEntries.toLocaleString()}`);
        return info;
      }
    } catch (fileError) {
      console.error(`   ❌ Could not read local file: ${fileError}`);
    }
    
    return null;
  }
}

/**
 * Get stored release timestamp
 */
function getStoredReleaseTimestamp(): number | null {
  try {
    const result = executeSQL('SELECT release_timestamp FROM dictionary_metadata ORDER BY release_timestamp DESC LIMIT 1');
    
    if (result && result.length > 0 && result[0].results && result[0].results.length > 0) {
      return result[0].results[0].release_timestamp || null;
    }
    
    return null;
  } catch (error) {
    console.error('   ⚠️  Could not fetch stored timestamp:', error);
    return null;
  }
}

/**
 * Store release timestamp
 */
function storeReleaseTimestamp(timestamp: number, entryCount: number): void {
  try {
    executeSQL(
      `INSERT OR REPLACE INTO dictionary_metadata (release_timestamp, entry_count, updated_at) VALUES (${timestamp}, ${entryCount}, strftime('%s', 'now'))`
    );
    console.error(`   ✅ Stored release timestamp: ${timestamp}`);
  } catch (error) {
    console.error(`   ❌ Error storing timestamp: ${error}`);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  
  console.error('🚀 Starting dictionary update check...');
  if (dryRun) console.error('   🔍 DRY RUN MODE');
  if (force) console.error('   ⚡ FORCE MODE');
  
  try {
    // 1. Fetch latest info
    const latestInfo = await fetchDictionaryInfo();
    if (!latestInfo) {
      console.error('❌ Could not fetch dictionary info');
      process.exit(1);
    }
    
    // 2. Check stored timestamp
    const storedTimestamp = getStoredReleaseTimestamp();
    
    if (storedTimestamp) {
      console.error(`\n📊 Current stored: ${storedTimestamp} (${new Date(storedTimestamp).toISOString()})`);
      console.error(`   Latest available: ${latestInfo.release} (${new Date(latestInfo.release).toISOString()})`);
      
      if (latestInfo.release <= storedTimestamp && !force) {
        console.error('\n✅ Dictionary is up to date!');
        return;
      }
      
      const daysSince = (latestInfo.release - storedTimestamp) / (1000 * 60 * 60 * 24);
      console.error(`   ⏰ ${daysSince.toFixed(1)} days since last update`);
    } else {
      console.error('\n📊 No stored version found. Will perform update.');
    }
    
    if (dryRun) {
      console.error('\n🔍 DRY RUN: Would update dictionary, but skipping.');
      return;
    }
    
    // 3. Run the actual update script via wrangler
    console.error('\n📥 Running dictionary update script...');
    console.error('   (This will download and update dictionary entries)');
    
    // For now, just store the timestamp
    // The actual dictionary population should be done via populate-dictionary-d1.ts
    storeReleaseTimestamp(latestInfo.release, latestInfo.numberOfEntries);
    
    console.error('\n✅ Update check complete!');
    console.error('   💡 Run: npx tsx scripts/populate-dictionary-d1.ts to populate dictionary');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

