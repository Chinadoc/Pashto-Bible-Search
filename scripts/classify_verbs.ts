#!/usr/bin/env ts-node
/**
 * Classify lemmas into LingDocs-aligned pattern families.
 * Read dictionary/lexicon JSON and emit a CSV/JSON report for review.
 * No DB writes in this phase.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

type Entry = {
  p?: string;         // pashto
  f?: string;         // romanized
  c?: string;         // pos tag
  c_norm?: string;    // normalized pos
};

type Family =
  | 'regular_simple'
  | 'split_stem'
  | 'suppletive'
  | 'transport'
  | 'dynamic_compound'
  | 'stative_compound_standard'
  | 'stative_compound_special'
  | 'modal'
  | 'irregular_one_off'
  | 'non_verb';

function detectFamily(pashto: string, tags: string): Family {
  const p = pashto.trim();
  const t = (tags || '').toLowerCase();

  // Non-verbs
  if (!/v\./i.test(tags)) return 'non_verb';

  // Check if it's a known irregular verb (read from our database)
  // Hardcoded list of all irregular verbs in our database
  const irregularVerbs = new Set([
    'لیدل', 'ایښودل', 'اغوستل', 'پرېښودل', 'پېژندل',  // split_stem
    'کېدل', 'تلل', 'کول', 'الوتل', 'بوتلل', 'وړل',     // suppletive/transport
    'غوښتل', 'کولی', 'شوی', 'درلودل', 'راتلل', 'موندل', 'ویل', // modal/others
    'خوښول', 'غوړول', 'خوب شول', 'تازه کېدل', 'غوره کېدل' // irregular stative
  ]);

  // Additional modal verbs that should be classified as modal
  const modalVerbs = new Set(['راتلل', 'درلودل', 'موندل', 'ویل']);

  if (irregularVerbs.has(p)) {
    // Determine which type of irregular
    if (['لیدل', 'ایښودل', 'اغوستل', 'پرېښودل', 'پېژندل'].includes(p)) return 'split_stem';
    if (['کېدل', 'تلل', 'کول', 'الوتل'].includes(p)) return 'suppletive';
    if (['وړل', 'بوتلل'].includes(p)) return 'transport';
    if (['غوښتل', 'کولی'].includes(p)) return 'modal';
    if (modalVerbs.has(p)) return 'modal';
    if (['خوښول', 'غوړول', 'خوب شول', 'تازه کېدل', 'غوره کېدل'].includes(p)) return 'irregular_one_off';
    return 'irregular_one_off'; // fallback
  }

  // Compounds (space or fused ېدل)
  if (p.includes(' ')) {
    const last = p.split(/\s+/).pop() || '';
    if (last === 'کول' || last === 'وهل') return 'dynamic_compound';
    if (last === 'کېدل' || last === 'شول') return 'stative_compound_special';
  }
  if (p.endsWith('ېدل')) return 'stative_compound_standard';

  return 'regular_simple';
}

async function main() {
  const root = process.cwd();
  const dictPathCandidates = [
    path.join(root, 'app/data/full_dictionary_enriched.json'),
    path.join(root, 'full_dictionary_enriched.json'),
  ];

  let raw: string | null = null;
  for (const p of dictPathCandidates) {
    try {
      raw = await fs.readFile(p, 'utf8');
      break;
    } catch {}
  }
  if (!raw) throw new Error('full_dictionary_enriched.json not found');

  const j = JSON.parse(raw);
  const entries: Entry[] = Array.isArray(j.entries) ? j.entries : j;

  const rows: Array<Record<string, string>> = [];
  for (const e of entries) {
    const pashto = e.p || '';
    if (!pashto) continue;
    const family = detectFamily(pashto, e.c || e.c_norm || '');
    rows.push({ pashto, family, tags: e.c || '' });
  }

  const out = rows
    .map((r) => `${r.pashto}\t${r.family}\t${r.tags.replace(/\s+/g, ' ')}`)
    .join('\n');
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/verb_families.tsv', out, 'utf8');
  console.log('✅ Wrote reports/verb_families.tsv');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


