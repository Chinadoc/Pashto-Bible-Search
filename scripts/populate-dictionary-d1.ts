#!/usr/bin/env tsx
/**
 * Populate Dictionary Table in D1 from full_dictionary_enriched.json
 * 
 * This script reads the LingDocs dictionary JSON file and populates
 * the D1 dictionary table for fast lookups.
 * 
 * Usage:
 *   tsx scripts/populate-dictionary-d1.ts [--limit N] [--offset N]
 * 
 * Options:
 *   --limit N      : Limit to N entries (for testing)
 *   --offset N     : Start from offset N (for resuming)
 */

import { D1Client } from '../utils/d1';
import { getD1Database } from '../utils/d1';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  info?: {
    title?: string;
    release?: number;
    numberOfEntries?: number;
  };
  entries: DictionaryEntry[];
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { limit?: number; offset?: number } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--offset' && args[i + 1]) {
      options.offset = parseInt(args[i + 1], 10);
      i++;
    }
  }
  
  return options;
}

/**
 * Get primary romanization from entry
 */
function getPrimaryRomanization(entry: DictionaryEntry): string {
  return entry.f_primary || entry.f || '';
}

/**
 * Format POS for display (e.g., "v. trans." for transitive verbs)
 */
function formatPOS(pos: string): string {
  if (!pos) return '';
  
  // Normalize common POS formats
  const normalized = pos.toLowerCase().trim();
  
  // Handle verb transitivity
  if (normalized.includes('v.')) {
    if (normalized.includes('trans.') || normalized.includes('trans')) {
      return 'v. trans.';
    } else if (normalized.includes('intrans.') || normalized.includes('intrans')) {
      return 'v. intrans.';
    }
    return 'v.';
  }
  
  // Return as-is for now
  return pos;
}

/**
 * Process a batch of entries
 */
async function processBatch(
  db: D1Client,
  entries: DictionaryEntry[],
  batchNum: number,
  totalBatches: number
): Promise<number> {
  console.error(`\n📦 Processing batch ${batchNum}/${totalBatches} (${entries.length} entries)...`)
  
  const inserts: Array<{
    word: string;
    pos: string;
    definition: string;
    romanization: string;
    frequency: number;
    enriched_info: string;
    ts?: number;
  }> = []
  
  for (const entry of entries) {
    if (!entry.p || !entry.c || !entry.e) {
      continue; // Skip incomplete entries
    }
    
    const romanization = getPrimaryRomanization(entry);
    const pos = formatPOS(entry.c);
    const enrichedInfo = JSON.stringify({
      ts: entry.ts,
      r: entry.r,
      g: entry.g,
      c_norm: entry.c_norm,
      pos_family: entry.pos_family,
      gender: entry.gender,
      p_norm: entry.p_norm
    })
    
    inserts.push({
      word: entry.p,
      pos: pos,
      definition: entry.e,
      romanization: romanization,
      frequency: entry.r || 0,
      enriched_info: enrichedInfo,
      ts: entry.ts
    })
  }
  
  // Batch insert
  if (inserts.length > 0) {
    const insertPromises = inserts.map(async (entry) => {
      await db.query(
        `INSERT OR REPLACE INTO dictionary (
          word, pos, definition, romanization, frequency, enriched_info
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entry.word,
          entry.pos,
          entry.definition,
          entry.romanization,
          entry.frequency,
          entry.enriched_info
        ]
      )
    })
    
    await Promise.all(insertPromises)
    console.error(`  ✅ Batch ${batchNum} complete: ${inserts.length} entries inserted`)
  }
  
  return inserts.length
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs()
  const limit = options.limit
  const offset = options.offset || 0
  
  console.error('🚀 Starting dictionary population...')
  if (limit) console.error(`   Limit: ${limit} entries`)
  if (offset) console.error(`   Offset: ${offset}`)
  
  const db = getD1Database()
  if (!db) {
    console.error('❌ Error: D1 database not available')
    console.error('   Make sure you have D1 configured and are running with wrangler')
    process.exit(1)
  }
  
  const d1Client = new D1Client(db)
  
  try {
    // Load dictionary JSON file
    console.error('\n📖 Loading dictionary JSON file...')
    const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json')
    
    let dictData: DictionaryData
    try {
      const fileContent = readFileSync(dictPath, 'utf8')
      dictData = JSON.parse(fileContent) as DictionaryData
    } catch (error) {
      console.error(`❌ Error reading dictionary file: ${error}`)
      console.error(`   Tried path: ${dictPath}`)
      process.exit(1)
    }
    
    const entries = dictData.entries || []
    console.error(`   Found ${entries.length} entries`)
    
    if (entries.length === 0) {
      console.error('   No entries found. Exiting.')
      return
    }
    
    // Apply limit/offset
    let entriesToProcess = entries
    if (offset > 0) {
      entriesToProcess = entries.slice(offset)
    }
    if (limit) {
      entriesToProcess = entriesToProcess.slice(0, limit)
    }
    
    console.error(`   Processing ${entriesToProcess.length} entries`)
    
    // Process in batches
    const batchSize = 100
    const totalBatches = Math.ceil(entriesToProcess.length / batchSize)
    let processedCount = 0
    const startTime = Date.now()
    
    for (let i = 0; i < entriesToProcess.length; i += batchSize) {
      const batch = entriesToProcess.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      
      const batchStartTime = Date.now()
      const batchProcessed = await processBatch(d1Client, batch, batchNum, totalBatches)
      processedCount += batchProcessed
      
      const batchTime = Date.now() - batchStartTime
      const elapsed = Date.now() - startTime
      const avgTimePerEntry = elapsed / processedCount
      const remaining = entriesToProcess.length - processedCount
      const estimatedRemaining = Math.round((remaining * avgTimePerEntry) / 1000 / 60) // minutes
      
      console.error(`   ⏱️  Batch ${batchNum} took ${(batchTime / 1000).toFixed(1)}s`)
      console.error(`   📈 Progress: ${processedCount}/${entriesToProcess.length} (${((processedCount / entriesToProcess.length) * 100).toFixed(1)}%)`)
      if (estimatedRemaining > 0) {
        console.error(`   ⏳ Estimated remaining: ~${estimatedRemaining} minutes`)
      }
      
      // Small delay between batches
      if (i + batchSize < entriesToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
    
    const totalTime = Date.now() - startTime
    const minutes = Math.floor(totalTime / 60000)
    const seconds = Math.floor((totalTime % 60000) / 1000)
    
    console.error(`\n✅ Dictionary population complete!`)
    console.error(`   Total entries processed: ${processedCount}`)
    console.error(`   Total time: ${minutes}m ${seconds}s`)
    console.error(`   Average: ${(totalTime / processedCount).toFixed(0)}ms per entry`)
    
  } catch (error) {
    console.error('❌ Error during dictionary population:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { processBatch, main }



