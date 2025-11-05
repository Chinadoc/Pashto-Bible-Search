/**
 * Process LingDocs dictionary JSON and populate Cloudflare D1 database
 * Uses existing D1 helpers pattern from utils/d1-helpers.ts
 * Cloudflare Worker-compatible (no npm dependencies required)
 */

import { D1Client } from '@/utils/d1';
import { parseD1Json } from '@/utils/d1-helpers';

// Types matching LingDocs dictionary structure
interface LingDocsDictionaryEntry {
  ts: number;
  p: string;
  f: string;
  e: string;
  c?: string;
  l?: number;
  type?: 'stative compound' | 'dynamic compound' | 'generative stative compound' | 'irregular';
  transitivity?: 'transitive' | 'intransitive' | 'grammatically_transitive';
  psp?: string;
  ssp?: string;
  prp?: string;
  pprtp?: string;
  complement?: any;
  objComplement?: any;
  auxVerb?: { p: string; f: string };
}

interface VerbMetadata {
  verb_root: string;
  verb_type: 'regular' | 'stative_compound' | 'dynamic_compound' | 'generative_stative_compound' | 'irregular';
  complement: string | null;
  auxiliary_verb: string | null;
  transitivity: 'transitive' | 'intransitive' | 'grammatically_transitive' | null;
  imperfective_stem: string | null;
  perfective_stem: string | null;
  imperfective_root: string | null;
  perfective_root: string | null;
  past_participle: string | null;
  romanization: string | null;
  conjugation_pattern: string | null;
}

function extractVerbType(entry: LingDocsDictionaryEntry): VerbMetadata['verb_type'] {
  if (entry.type === 'stative compound' || entry.type === 'generative stative compound') {
    return entry.type === 'generative stative compound' ? 'generative_stative_compound' : 'stative_compound';
  }
  if (entry.type === 'dynamic compound') return 'dynamic_compound';
  if (entry.type === 'irregular') return 'irregular';
  return 'regular';
}

function extractCompoundInfo(entry: LingDocsDictionaryEntry): { complement: string | null; auxiliary_verb: string | null } {
  if (entry.type === 'stative compound' || entry.type === 'generative stative compound') {
    if (entry.complement) {
      const comp = entry.complement;
      let complementText = '';
      if (comp.masc && Array.isArray(comp.masc) && comp.masc[0] && Array.isArray(comp.masc[0]) && comp.masc[0][0]) {
        complementText = comp.masc[0][0].p || '';
      } else if (comp.p) {
        complementText = comp.p;
      }
      const auxVerb = entry.transitivity === 'transitive' ? 'کول' : 'کېدل';
      return { complement: complementText || null, auxiliary_verb: auxVerb };
    }
    if (entry.objComplement) {
      const complementText = entry.objComplement.plural?.p || entry.objComplement.entry?.p || '';
      const auxVerb = entry.transitivity === 'transitive' ? 'کول' : 'کېدل';
      return { complement: complementText || null, auxiliary_verb: auxVerb };
    }
  }
  if (entry.type === 'dynamic compound' && entry.auxVerb) {
    return { complement: null, auxiliary_verb: entry.auxVerb.p || null };
  }
  return { complement: null, auxiliary_verb: null };
}

function normalizeGrammaticalInfo(rawInfo: string | object | null, pos: string = 'verb'): Record<string, any> {
  const normalized: Record<string, any> = {
    person: null, tense: null, aspect: null, mood: null, gender: null,
    length: null, verb_type: null, participle_type: null, inflection_type: null,
    pos: pos || 'verb',
  };
  if (!rawInfo) return normalized;
  
  let infoString = '';
  let infoObj: any = null;
  if (typeof rawInfo === 'string') {
    infoString = rawInfo;
    try { infoObj = JSON.parse(rawInfo); } catch {}
  } else if (typeof rawInfo === 'object') {
    infoObj = rawInfo;
    infoString = JSON.stringify(rawInfo);
  }
  
  if (infoObj && typeof infoObj === 'object') {
    normalized.person = infoObj.person || infoObj.p || null;
    normalized.tense = infoObj.tense || infoObj.t || null;
    normalized.aspect = infoObj.aspect || infoObj.a || null;
    normalized.mood = infoObj.mood || infoObj.m || null;
    normalized.gender = infoObj.gender || infoObj.g || null;
    normalized.length = infoObj.length || infoObj.l || null;
    normalized.verb_type = infoObj.verb_type || infoObj.vt || null;
    normalized.participle_type = infoObj.participle_type || infoObj.pt || null;
    normalized.inflection_type = infoObj.inflection_type || infoObj.it || null;
    if (infoObj.pos) normalized.pos = infoObj.pos;
  }
  
  const lower = infoString.toLowerCase();
  const personMatch = lower.match(/\b(1sg|2sg|3sg|1pl|2pl|3pl)\b/);
  if (personMatch) normalized.person = personMatch[0];
  if (lower.includes('present')) normalized.tense = 'Present';
  else if (lower.includes('subjunctive')) normalized.tense = 'Subjunctive';
  else if (lower.includes('past')) normalized.tense = 'Past';
  else if (lower.includes('imperative')) normalized.tense = 'Imperative';
  if (lower.includes('imperfective')) normalized.aspect = 'Imperfective';
  else if (lower.includes('perfective')) normalized.aspect = 'Perfective';
  if (lower.includes('masc')) normalized.gender = 'Masc';
  else if (lower.includes('fem')) normalized.gender = 'Fem';
  if (lower.includes('stative') && lower.includes('compound')) normalized.verb_type = 'stative_compound';
  else if (lower.includes('dynamic') && lower.includes('compound')) normalized.verb_type = 'dynamic_compound';
  else if (lower.includes('irregular')) normalized.verb_type = 'irregular';
  
  return normalized;
}

function processVerbEntry(entry: LingDocsDictionaryEntry): { metadata: VerbMetadata } {
  const verbType = extractVerbType(entry);
  const { complement, auxiliary_verb } = extractCompoundInfo(entry);
  
  return {
    metadata: {
      verb_root: entry.p,
      verb_type: verbType,
      complement,
      auxiliary_verb,
      transitivity: entry.transitivity || null,
      imperfective_stem: entry.psp || null,
      perfective_stem: entry.ssp || null,
      imperfective_root: entry.prp || null,
      perfective_root: entry.prp || null,
      past_participle: entry.pprtp || null,
      romanization: entry.f || null,
      conjugation_pattern: null,
    }
  };
}

export async function processVerbsToD1(
  db: D1Client,
  dictionaryUrl: string = 'https://dictionary.lingdocs.com/dictionary.json',
  batchSize: number = 100
): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;
  
  const response = await fetch(dictionaryUrl);
  if (!response.ok) throw new Error(`Failed to fetch dictionary: ${response.status}`);
  
  const data = await response.json();
  const entries: LingDocsDictionaryEntry[] = data.entries || [];
  const linkedEntries = new Map<number, LingDocsDictionaryEntry>();
  for (const entry of entries) linkedEntries.set(entry.ts, entry);
  
  const verbEntries = entries.filter((e) => e.c?.startsWith('v.') && e.psp !== undefined);
  
  for (let i = 0; i < verbEntries.length; i += batchSize) {
    const batch = verbEntries.slice(i, i + batchSize);
    const statements = [];
    
    for (const entry of batch) {
      try {
        const { metadata } = processVerbEntry(entry);
        
        // Use D1Client execute method for INSERT
        await db.execute(`
          INSERT OR REPLACE INTO verb_metadata (
            verb_root, verb_type, complement, auxiliary_verb, transitivity,
            imperfective_stem, perfective_stem, imperfective_root, perfective_root,
            past_participle, romanization, conjugation_pattern, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
        `, [
          metadata.verb_root, metadata.verb_type, metadata.complement, metadata.auxiliary_verb,
          metadata.transitivity, metadata.imperfective_stem, metadata.perfective_stem,
          metadata.imperfective_root, metadata.perfective_root, metadata.past_participle,
          metadata.romanization ? JSON.stringify(metadata.romanization) : null,
          metadata.conjugation_pattern
        ]);
        
        processed++;
      } catch (error) {
        console.error(`Error processing verb ${entry.p}:`, error);
        errors++;
      }
    }
  }
  
  return { processed, errors };
}

export async function normalizeExistingInflections(db: D1Client, batchSize: number = 1000): Promise<number> {
  let normalized = 0;
  
  const rows = await db.query<{
    id: number;
    base_word: string;
    inflected_form: string;
    grammatical_info: string | object | null;
    pos: string;
  }>(`
    SELECT id, base_word, inflected_form, grammatical_info, COALESCE(pos, 'verb') as pos
    FROM inflections
    WHERE grammatical_info_normalized IS NULL
    LIMIT ?
  `, [batchSize]);
  
  if (!rows || rows.length === 0) return 0;
  
  // Process in batches to avoid overwhelming D1
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    
    for (const row of batch) {
      try {
        const normalizedInfo = normalizeGrammaticalInfo(row.grammatical_info, row.pos);
        
        await db.execute(`
          UPDATE inflections
          SET grammatical_info_normalized = ?, person = ?, tense = ?, aspect = ?,
              mood = ?, gender = ?, length = ?, verb_type = ?, inflection_type = ?,
              updated_at = strftime('%s', 'now')
          WHERE id = ?
        `, [
          JSON.stringify(normalizedInfo), normalizedInfo.person, normalizedInfo.tense,
          normalizedInfo.aspect, normalizedInfo.mood, normalizedInfo.gender,
          normalizedInfo.length, normalizedInfo.verb_type, normalizedInfo.inflection_type, row.id
        ]);
        
        normalized++;
      } catch (error) {
        console.error(`Error normalizing inflection ${row.id}:`, error);
      }
    }
  }
  
  return normalized;
}

