/**
 * Script to populate missing imperfective_stem and perfective_stem in verbs_lexicon
 * 
 * This script uses the verb_inflector to generate stems for verbs that are missing them.
 * Run this in Cloudflare Workers environment with access to D1 database.
 */

import { getD1Database } from '../utils/d1';

interface VerbLexiconRow {
  id: number;
  verb_root: string;
  imperfective_stem: string | null;
  perfective_stem: string | null;
  perfective_root: string | null;
  past_participle: string | null;
  pos: string | null;
  romanization: string | null;
}

/**
 * Get verb conjugation data using LingDocs verb inflector
 */
async function getVerbStems(verbRoot: string): Promise<{
  imperfectiveStem?: string;
  perfectiveStem?: string;
  imperfectiveRoot?: string;
  perfectiveRoot?: string;
  pastParticiple?: string;
} | null> {
  try {
    // Import the LingDocs adapter dynamically
    const { generateVerbVariants } = await import('../app/utils/lingdocs-adapter');
    
    // Generate verb variants to get stems
    const variants = await generateVerbVariants(verbRoot, { cap: 1 });
    
    if (!variants || variants.length === 0) {
      return null;
    }
    
    // Extract stem information from the first variant's metadata
    const firstVariant = variants[0];
    if (firstVariant.metadata) {
      return {
        imperfectiveStem: firstVariant.metadata.imperfective_stem,
        perfectiveStem: firstVariant.metadata.perfective_stem,
        imperfectiveRoot: firstVariant.metadata.imperfective_root || verbRoot,
        perfectiveRoot: firstVariant.metadata.perfective_root || verbRoot,
        pastParticiple: firstVariant.metadata.past_participle,
      };
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to get stems for ${verbRoot}:`, error);
    return null;
  }
}

/**
 * Populate missing stems in verbs_lexicon
 */
export async function populateVerbStems() {
  const db = getD1Database();
  if (!db) {
    throw new Error('D1 database not available');
  }

  // Get all verbs missing stems
  const verbsMissingStems = await db.query<VerbLexiconRow>(
    `SELECT id, verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization 
     FROM verbs_lexicon 
     WHERE (imperfective_stem IS NULL OR imperfective_stem = '') 
        OR (perfective_stem IS NULL OR perfective_stem = '')
     ORDER BY verb_root
     LIMIT 100`
  );

  if (!Array.isArray(verbsMissingStems) || verbsMissingStems.length === 0) {
    console.log('No verbs missing stems found');
    return { updated: 0, skipped: 0, errors: 0 };
  }

  console.log(`Found ${verbsMissingStems.length} verbs missing stems`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const verb of verbsMissingStems) {
    try {
      // Skip non-verbs (the table contains adjectives/adverbs too)
      if (verb.pos && !verb.pos.toLowerCase().includes('v') && !verb.pos.toLowerCase().includes('verb')) {
        console.log(`Skipping non-verb: ${verb.verb_root} (${verb.pos})`);
        skipped++;
        continue;
      }

      // Get stems from verb inflector
      const stems = await getVerbStems(verb.verb_root);
      
      if (!stems) {
        console.log(`Could not generate stems for: ${verb.verb_root}`);
        skipped++;
        continue;
      }

      // Update verb with stems
      const updates: string[] = [];
      const values: any[] = [];

      if ((!verb.imperfective_stem || verb.imperfective_stem === '') && stems.imperfectiveStem) {
        updates.push('imperfective_stem = ?');
        values.push(stems.imperfectiveStem);
      }

      if ((!verb.perfective_stem || verb.perfective_stem === '') && stems.perfectiveStem) {
        updates.push('perfective_stem = ?');
        values.push(stems.perfectiveStem);
      }

      // Also update roots if missing
      if ((!verb.perfective_root || verb.perfective_root === '') && stems.perfectiveRoot) {
        updates.push('perfective_root = ?');
        values.push(stems.perfectiveRoot);
      }

      if ((!verb.past_participle || verb.past_participle === '') && stems.pastParticiple) {
        updates.push('past_participle = ?');
        values.push(stems.pastParticiple);
      }

      if (updates.length > 0) {
        values.push(verb.id);
        await db.execute(
          `UPDATE verbs_lexicon SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
        console.log(`Updated ${verb.verb_root}: ${updates.join(', ')}`);
        updated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${verb.verb_root}:`, error);
      errors++;
    }
  }

  return { updated, skipped, errors };
}



