/**
 * Populate Inflection Types in nouns_lexicon table
 * 
 * Syncs inflection_type from word_frequencies to nouns_lexicon
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

/**
 * Generate SQL to update nouns_lexicon with inflection types from word_frequencies
 */
function generateSQL(): string {
  const sql: string[] = [];
  
  sql.push('-- Populate Inflection Types in nouns_lexicon');
  sql.push(`-- Generated: ${new Date().toISOString()}`);
  sql.push('-- Syncs inflection_type from word_frequencies to nouns_lexicon');
  sql.push('');
  
  // Update nouns_lexicon using word_frequencies as source
  sql.push('UPDATE nouns_lexicon');
  sql.push('SET inflection_type = (');
  sql.push('  SELECT inflection_type');
  sql.push('  FROM word_frequencies');
  sql.push('  WHERE word_frequencies.pashto_word = nouns_lexicon.pashto_word');
  sql.push('    AND word_frequencies.word_type IN (\'noun\', \'adjective\')');
  sql.push('  LIMIT 1');
  sql.push(')');
  sql.push('WHERE EXISTS (');
  sql.push('  SELECT 1');
  sql.push('  FROM word_frequencies');
  sql.push('  WHERE word_frequencies.pashto_word = nouns_lexicon.pashto_word');
  sql.push('    AND word_frequencies.word_type IN (\'noun\', \'adjective\')');
  sql.push('    AND word_frequencies.inflection_type IS NOT NULL');
  sql.push(');');
  sql.push('');
  
  return sql.join('\n');
}

async function main() {
  console.log('🚀 Populating Inflection Types in nouns_lexicon\n');
  
  const sql = generateSQL();
  const sqlPath = join(process.cwd(), '.temp-nouns-lexicon-inflection-types.sql');
  writeFileSync(sqlPath, sql, 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main().catch(console.error);

