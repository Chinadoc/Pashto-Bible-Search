/**
 * Enrich unknown verbs in word_frequencies with inferred metadata
 * This script processes words that don't have dictionary entries but appear to be verbs
 */

import { inferVerbRoot, categorizeUnknownVerb } from './infer-verb-metadata';

const DB_NAME = 'pashto-bible-db';
const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

/**
 * Query D1 via Worker API
 */
async function queryD1(sql: string): Promise<any[]> {
  const response = await fetch(`${WORKER_URL}/api/d1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Worker API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.results || [];
}

/**
 * Execute SQL via wrangler
 */
function execSQL(sql: string): void {
  const { execSync } = require('child_process');
  execSync(
    `npx wrangler d1 execute ${DB_NAME} --remote --command="${sql.replace(/"/g, '\\"')}"`,
    { maxBuffer: 50 * 1024 * 1024 }
  );
}

/**
 * Find unknown verbs (words that look like verbs but aren't in dictionary)
 */
async function findUnknownVerbs(): Promise<any[]> {
  // Find words that:
  // 1. Don't have pos set (or pos is null/empty)
  // 2. Look like verbs (end with verb endings or have verb prefixes)
  // 3. Have frequency > 0 (actual usage)
  
  const sql = `
    SELECT pashto_word, frequency_total
    FROM word_frequencies
    WHERE (pos IS NULL OR pos = '' OR pos = 'unknown')
      AND frequency_total > 0
      AND (
        pashto_word LIKE 'و%' OR  -- Starts with perfective prefix
        pashto_word LIKE '%م' OR  -- Ends with 1st person
        pashto_word LIKE '%ې' OR  -- Ends with 2nd person
        pashto_word LIKE '%ي' OR  -- Ends with 3rd person
        pashto_word LIKE '%ول' OR -- Ends with transitive marker
        pashto_word LIKE '%ېدل' OR -- Ends with intransitive marker
        pashto_word LIKE '%کول' OR -- Ends with causative marker
        pashto_word LIKE '%کېدل'    -- Ends with causative intransitive
      )
    ORDER BY frequency_total DESC
    LIMIT 1000;
  `;
  
  return await queryD1(sql);
}

/**
 * Enrich unknown verbs with inferred metadata
 */
async function enrichUnknownVerbs() {
  console.log('🔍 Finding unknown verbs...\n');
  
  const unknownVerbs = await findUnknownVerbs();
  console.log(`   Found ${unknownVerbs.length} potential unknown verbs\n`);
  
  if (unknownVerbs.length === 0) {
    console.log('✅ No unknown verbs found.');
    return;
  }
  
  const updates: Array<{
    word: string;
    root: string | null;
    pos: string;
    word_type: string;
    inflection_type: string | null;
    base_form: string | null;
    confidence: string;
  }> = [];
  
  console.log('📝 Analyzing verbs...\n');
  
  for (const verb of unknownVerbs) {
    const form = verb.pashto_word;
    const analysis = inferVerbRoot(form);
    const categorization = categorizeUnknownVerb(form, analysis.root);
    
    if (analysis.confidence !== 'low' && categorization.word_type === 'verb') {
      updates.push({
        word: form,
        root: analysis.root,
        pos: categorization.pos,
        word_type: categorization.word_type,
        inflection_type: categorization.inflection_type,
        base_form: categorization.base_form,
        confidence: analysis.confidence,
      });
    }
  }
  
  console.log(`   Analyzed ${unknownVerbs.length} verbs`);
  console.log(`   Found ${updates.length} verbs with sufficient confidence\n`);
  
  if (updates.length === 0) {
    console.log('✅ No verbs to update.');
    return;
  }
  
  // Update in batches
  const batchSize = 50;
  const fs = require('fs');
  const path = require('path');
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const sqlStatements: string[] = [];
    
    for (const update of batch) {
      const escape = (str: string | null) => 
        str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      sqlStatements.push(`
        UPDATE word_frequencies
        SET
          pos = ${escape(update.pos)},
          word_type = ${escape(update.word_type)},
          inflection_type = ${escape(update.inflection_type)},
          base_form = ${escape(update.base_form)},
          updated_at = strftime('%s', 'now')
        WHERE pashto_word = ${escape(update.word)};
      `);
    }
    
    const tempFile = path.join(process.cwd(), `.temp-enrich-verbs-${i}.sql`);
    fs.writeFileSync(tempFile, sqlStatements.join('\n'), 'utf-8');
    
    try {
      execSQL(`cat ${tempFile} | npx wrangler d1 execute ${DB_NAME} --remote --file=-`);
      console.log(`   ✅ Batch ${i / batchSize + 1}/${Math.ceil(updates.length / batchSize)} completed`);
    } catch (error: any) {
      console.error(`   ❌ Error processing batch ${i / batchSize + 1}:`, error.message);
    } finally {
      fs.unlinkSync(tempFile);
    }
  }
  
  console.log('\n✅ Verb enrichment complete!');
  console.log(`   Updated ${updates.length} verbs with inferred metadata`);
}

// Run if executed directly
if (require.main === module) {
  enrichUnknownVerbs().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { enrichUnknownVerbs, findUnknownVerbs };

