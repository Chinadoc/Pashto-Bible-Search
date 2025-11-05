/**
 * Script to refresh LingDocs POS map from pashto-dictionary
 * 
 * This script:
 * 1. Reads LingDocs dictionary data (from local copy or fetches from GitHub)
 * 2. Extracts POS mappings for each lemma
 * 3. Merges with D1 metadata
 * 4. Writes to app/data/lingdocs_pos_map.json
 * 
 * Usage: npm run refresh-lingdocs-pos
 */

import fs from 'fs';
import path from 'path';

type LingDocsPOS = 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrase' | 'preposition' | 'pronoun' | 'other';

interface LingDocsEntry {
  ts: string;  // Pashto script
  p: string;   // Romanized
  pos?: string | string[];  // Part of speech
  transitivity?: string;
  verbType?: 'stative' | 'dynamic' | 'compound';
  gender?: 'masculine' | 'feminine';
}

interface POSMapEntry {
  pos: LingDocsPOS[];
  transitivity?: 'transitive' | 'intransitive' | 'both';
  verbType?: 'stative' | 'dynamic' | 'compound';
  gender?: 'masculine' | 'feminine' | 'both';
  lingdocsId?: string;
}

type POSMap = Record<string, POSMapEntry>;

// Map LingDocs POS strings to our POS enum
function normalizePOS(pos: string | string[] | undefined): LingDocsPOS[] {
  if (!pos) return ['other'];
  
  const posArray = Array.isArray(pos) ? pos : [pos];
  
  return posArray.map(p => {
    const normalized = p.toLowerCase().trim();
    if (normalized.startsWith('v') || normalized === 'verb') return 'verb';
    if (normalized.startsWith('n') || normalized === 'noun') return 'noun';
    if (normalized.startsWith('adj') || normalized === 'adjective') return 'adjective';
    if (normalized.startsWith('adv') || normalized === 'adverb') return 'adverb';
    if (normalized.includes('phrase')) return 'phrase';
    if (normalized.includes('prep')) return 'preposition';
    if (normalized.includes('pron')) return 'pronoun';
    return 'other';
  });
}

// Try to find LingDocs dictionary data
function findLingDocsDictionary(): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'lingdocs_dictionary', 'website', 'src', 'data', 'dictionary-info.json'),
    path.join(process.cwd(), 'pashto-dictionary', 'website', 'src', 'data', 'dictionary-info.json'),
    path.join(process.cwd(), 'app', 'data', 'dictionary-info.json'),
    path.join(process.cwd(), 'data', 'dictionary-info.json'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

async function fetchLingDocsDictionary(): Promise<LingDocsEntry[]> {
  // Try local file first
  const localPath = findLingDocsDictionary();
  if (localPath) {
    console.log(`📚 Found local dictionary at: ${localPath}`);
    const data = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
    return Array.isArray(data) ? data : (data.entries || data.dictionary || []);
  }

  // Fallback: fetch from GitHub (if public)
  console.log('⚠️  Local dictionary not found. Attempting to fetch from GitHub...');
  try {
    const response = await fetch('https://raw.githubusercontent.com/lingdocs/pashto-dictionary/main/website/src/data/dictionary-info.json');
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : (data.entries || data.dictionary || []);
    }
  } catch (error) {
    console.error('❌ Failed to fetch from GitHub:', error);
  }

  throw new Error('Could not find or fetch LingDocs dictionary data');
}

function buildPOSMap(entries: LingDocsEntry[]): POSMap {
  const posMap: POSMap = {};

  for (const entry of entries) {
    const pashto = entry.ts?.trim();
    if (!pashto) continue;

    const posArray = normalizePOS(entry.pos);
    
    // Build metadata
    const metadata: POSMapEntry = {
      pos: posArray,
    };

    if (entry.transitivity) {
      metadata.transitivity = entry.transitivity as any;
    }

    if (entry.verbType) {
      metadata.verbType = entry.verbType;
    }

    if (entry.gender) {
      metadata.gender = entry.gender as any;
    }

    if (entry.p) {
      metadata.lingdocsId = entry.p;
    }

    // Merge with existing entry if lemma already exists
    if (posMap[pashto]) {
      const existing = posMap[pashto];
      // Merge POS arrays
      const mergedPos = [...new Set([...existing.pos, ...posArray])];
      posMap[pashto] = {
        ...existing,
        ...metadata,
        pos: mergedPos,
      };
    } else {
      posMap[pashto] = metadata;
    }
  }

  return posMap;
}

async function main() {
  console.log('🔄 Refreshing LingDocs POS map...');

  try {
    // Fetch dictionary entries
    const entries = await fetchLingDocsDictionary();
    console.log(`✅ Loaded ${entries.length} dictionary entries`);

    // Build POS map
    const posMap = buildPOSMap(entries);
    console.log(`✅ Built POS map with ${Object.keys(posMap).length} lemmas`);

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'app', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    const outputPath = path.join(dataDir, 'lingdocs_pos_map.json');
    fs.writeFileSync(outputPath, JSON.stringify(posMap, null, 2), 'utf-8');
    console.log(`✅ Written POS map to: ${outputPath}`);

    // Print summary
    const posCounts: Record<string, number> = {};
    for (const entry of Object.values(posMap)) {
      for (const pos of entry.pos) {
        posCounts[pos] = (posCounts[pos] || 0) + 1;
      }
    }
    console.log('\n📊 POS Summary:');
    for (const [pos, count] of Object.entries(posCounts)) {
      console.log(`  ${pos}: ${count}`);
    }

  } catch (error) {
    console.error('❌ Error refreshing POS map:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { buildPOSMap, normalizePOS, fetchLingDocsDictionary };

