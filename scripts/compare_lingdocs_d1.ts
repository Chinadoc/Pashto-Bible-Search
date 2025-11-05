/**
 * Compare D1 database output with LingDocs output
 * Validates that our database structure matches LingDocs format
 */

import { Types as T } from '@lingdocs/ps-react';
import { conjugateVerb, inflectWord } from '@lingdocs/ps-react';
import { processVerbEntry, createNormalizedGrammaticalInfo } from './process_lingdocs_dictionary';
import { normalizeGrammaticalInfo } from './normalize_existing_data';

interface ComparisonResult {
  base_word: string;
  pos: 'verb' | 'noun' | 'adjective';
  lingdocs_forms: Map<string, string>; // form -> label
  d1_forms: Map<string, string>; // form -> label
  matches: {
    exact_match: string[]; // Forms that exist in both with same label
    missing_in_d1: string[]; // Forms in LingDocs but not in D1
    missing_in_lingdocs: string[]; // Forms in D1 but not in LingDocs
    label_mismatch: Array<{ form: string; lingdocs_label: string; d1_label: string }>;
  };
  verb_metadata_match?: {
    verb_type_match: boolean;
    complement_match: boolean;
    auxiliary_match: boolean;
    transitivity_match: boolean;
  };
}

/**
 * Get all forms from LingDocs for a verb entry
 */
async function getLingDocsForms(
  entry: T.VerbDictionaryEntry,
  linkedEntry?: T.DictionaryEntry
): Promise<Map<string, string>> {
  const forms = new Map<string, string>();
  
  try {
    const { conjugations } = processVerbEntry(entry, linkedEntry);
    
    for (const conj of conjugations) {
      forms.set(conj.form, conj.grammatical_label);
    }
  } catch (error) {
    console.error(`Error processing LingDocs entry ${entry.p}:`, error);
  }
  
  return forms;
}

/**
 * Get all forms from D1 database for a base word
 */
async function getD1Forms(
  db: any,
  baseWord: string,
  pos: string
): Promise<Map<string, string>> {
  const forms = new Map<string, string>();
  
  try {
    const result = await db.prepare(`
      SELECT inflected_form, grammatical_info, grammatical_info_normalized
      FROM inflections
      WHERE base_word = ? AND pos = ?
    `).bind(baseWord, pos).all();
    
    for (const row of result.results || []) {
      const form = row.inflected_form;
      let label = '';
      
      // Try to extract label from normalized info first
      if (row.grammatical_info_normalized) {
        try {
          const normalized = JSON.parse(row.grammatical_info_normalized);
          const parts: string[] = [];
          if (normalized.person) parts.push(normalized.person);
          if (normalized.tense) parts.push(normalized.tense);
          if (normalized.aspect) parts.push(normalized.aspect);
          if (normalized.gender) parts.push(normalized.gender);
          if (normalized.length) parts.push(normalized.length);
          label = parts.join(' ') || 'Form';
        } catch {
          // Fall back to parsing grammatical_info
        }
      }
      
      // Fall back to parsing original grammatical_info
      if (!label && row.grammatical_info) {
        const normalized = normalizeGrammaticalInfo(row.grammatical_info, pos);
        const parts: string[] = [];
        if (normalized.person) parts.push(normalized.person);
        if (normalized.tense) parts.push(normalized.tense);
        if (normalized.aspect) parts.push(normalized.aspect);
        if (normalized.gender) parts.push(normalized.gender);
        if (normalized.length) parts.push(normalized.length);
        label = parts.join(' ') || 'Form';
      }
      
      if (!label) label = 'Form';
      
      forms.set(form, label);
    }
  } catch (error) {
    console.error(`Error querying D1 for ${baseWord}:`, error);
  }
  
  return forms;
}

/**
 * Compare verb metadata between LingDocs and D1
 */
async function compareVerbMetadata(
  db: any,
  verbRoot: string,
  lingdocsMetadata: any
): Promise<ComparisonResult['verb_metadata_match']> {
  try {
    const result = await db.prepare(`
      SELECT verb_type, complement, auxiliary_verb, transitivity
      FROM verb_metadata
      WHERE verb_root = ?
    `).bind(verbRoot).first();
    
    if (!result) {
      return {
        verb_type_match: false,
        complement_match: false,
        auxiliary_match: false,
        transitivity_match: false,
      };
    }
    
    return {
      verb_type_match: result.verb_type === lingdocsMetadata.verb_type,
      complement_match: result.complement === lingdocsMetadata.complement,
      auxiliary_match: result.auxiliary_verb === lingdocsMetadata.auxiliary_verb,
      transitivity_match: result.transitivity === lingdocsMetadata.transitivity,
    };
  } catch (error) {
    console.error(`Error comparing metadata for ${verbRoot}:`, error);
    return undefined;
  }
}

/**
 * Compare forms and create comparison result
 */
function compareForms(
  lingdocsForms: Map<string, string>,
  d1Forms: Map<string, string>
): ComparisonResult['matches'] {
  const exact_match: string[] = [];
  const missing_in_d1: string[] = [];
  const missing_in_lingdocs: string[] = [];
  const label_mismatch: Array<{ form: string; lingdocs_label: string; d1_label: string }> = [];
  
  // Check forms in LingDocs
  for (const [form, lingdocsLabel] of lingdocsForms.entries()) {
    const d1Label = d1Forms.get(form);
    
    if (!d1Label) {
      missing_in_d1.push(form);
    } else if (d1Label === lingdocsLabel) {
      exact_match.push(form);
    } else {
      label_mismatch.push({
        form,
        lingdocs_label: lingdocsLabel,
        d1_label: d1Label,
      });
    }
  }
  
  // Check forms in D1 that aren't in LingDocs
  for (const [form, d1Label] of d1Forms.entries()) {
    if (!lingdocsForms.has(form)) {
      missing_in_lingdocs.push(form);
    }
  }
  
  return {
    exact_match,
    missing_in_d1,
    missing_in_lingdocs,
    label_mismatch,
  };
}

/**
 * Compare a single word between LingDocs and D1
 */
export async function compareWord(
  db: any,
  entry: T.DictionaryEntry,
  linkedEntry?: T.DictionaryEntry
): Promise<ComparisonResult | null> {
  const baseWord = entry.p;
  let pos: 'verb' | 'noun' | 'adjective' = 'verb';
  
  // Determine POS
  if (entry.c?.startsWith('v.')) {
    pos = 'verb';
  } else if (entry.c?.startsWith('n.')) {
    pos = 'noun';
  } else if (entry.c?.startsWith('adj.')) {
    pos = 'adjective';
  } else {
    return null; // Skip non-verb/noun/adjective entries
  }
  
  let lingdocsForms: Map<string, string> = new Map();
  let lingdocsMetadata: any = null;
  
  try {
    if (pos === 'verb' && 'psp' in entry) {
      const { metadata, conjugations } = processVerbEntry(entry as T.VerbDictionaryEntry, linkedEntry);
      lingdocsMetadata = metadata;
      
      for (const conj of conjugations) {
        lingdocsForms.set(conj.form, conj.grammatical_label);
      }
    } else if (pos === 'noun') {
      const inflection = inflectWord(entry);
      if (inflection) {
        // Flatten noun inflection structure
        const flattenNoun = (node: any, label: string = ''): void => {
          if (!node) return;
          
          if (typeof node === 'object' && node.p) {
            lingdocsForms.set(node.p, label || 'Noun Form');
            return;
          }
          
          if (Array.isArray(node)) {
            node.forEach((item) => flattenNoun(item, label));
            return;
          }
          
          if (typeof node === 'object') {
            for (const [key, value] of Object.entries(node)) {
              const nextLabel = key === 'masc' ? `${label} Masc` :
                               key === 'fem' ? `${label} Fem` :
                               label;
              flattenNoun(value, nextLabel);
            }
          }
        };
        
        if (inflection.inflections) {
          flattenNoun(inflection.inflections.inflections, 'Inflection');
        }
        if (inflection.plural) {
          flattenNoun(inflection.plural, 'Plural');
        }
        if (inflection.vocative) {
          flattenNoun(inflection.vocative, 'Vocative');
        }
      }
    }
  } catch (error) {
    console.error(`Error processing LingDocs entry ${baseWord}:`, error);
    return null;
  }
  
  // Get D1 forms
  const d1Forms = await getD1Forms(db, baseWord, pos);
  
  // Compare forms
  const matches = compareForms(lingdocsForms, d1Forms);
  
  // Compare metadata for verbs
  let verbMetadataMatch: ComparisonResult['verb_metadata_match'] = undefined;
  if (pos === 'verb' && lingdocsMetadata) {
    verbMetadataMatch = await compareVerbMetadata(db, baseWord, lingdocsMetadata);
  }
  
  return {
    base_word: baseWord,
    pos,
    lingdocs_forms: lingdocsForms,
    d1_forms: d1Forms,
    matches,
    verb_metadata_match: verbMetadataMatch,
  };
}

/**
 * Batch compare multiple words
 */
export async function batchCompare(
  db: any,
  entries: T.DictionaryEntry[],
  linkedEntries: Map<number, T.DictionaryEntry>
): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];
  
  for (const entry of entries) {
    const linkedEntry = entry.l ? linkedEntries.get(entry.l) : undefined;
    const result = await compareWord(db, entry, linkedEntry);
    
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Generate summary statistics from comparison results
 */
export function generateSummary(results: ComparisonResult[]): {
  total_words: number;
  total_exact_matches: number;
  total_missing_in_d1: number;
  total_missing_in_lingdocs: number;
  total_label_mismatches: number;
  verb_metadata_stats: {
    total_verbs: number;
    verb_type_matches: number;
    complement_matches: number;
    auxiliary_matches: number;
    transitivity_matches: number;
  };
} {
  const stats = {
    total_words: results.length,
    total_exact_matches: 0,
    total_missing_in_d1: 0,
    total_missing_in_lingdocs: 0,
    total_label_mismatches: 0,
    verb_metadata_stats: {
      total_verbs: 0,
      verb_type_matches: 0,
      complement_matches: 0,
      auxiliary_matches: 0,
      transitivity_matches: 0,
    },
  };
  
  for (const result of results) {
    stats.total_exact_matches += result.matches.exact_match.length;
    stats.total_missing_in_d1 += result.matches.missing_in_d1.length;
    stats.total_missing_in_lingdocs += result.matches.missing_in_lingdocs.length;
    stats.total_label_mismatches += result.matches.label_mismatch.length;
    
    if (result.pos === 'verb' && result.verb_metadata_match) {
      stats.verb_metadata_stats.total_verbs++;
      if (result.verb_metadata_match.verb_type_match) {
        stats.verb_metadata_stats.verb_type_matches++;
      }
      if (result.verb_metadata_match.complement_match) {
        stats.verb_metadata_stats.complement_matches++;
      }
      if (result.verb_metadata_match.auxiliary_match) {
        stats.verb_metadata_stats.auxiliary_matches++;
      }
      if (result.verb_metadata_match.transitivity_match) {
        stats.verb_metadata_stats.transitivity_matches++;
      }
    }
  }
  
  return stats;
}

