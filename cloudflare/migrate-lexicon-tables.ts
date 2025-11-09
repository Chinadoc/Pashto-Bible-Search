/**
 * Migrate Lexicon Tables from Supabase to D1
 * 
 * Migrates:
 * - verbs_lexicon
 * - irregular_verbs
 * - nouns_lexicon
 * - grammar_rules
 */

import { createClient } from '@supabase/supabase-js';

interface VerbEntry {
  verb_root: string;
  stems?: any;
  roots?: any;
  past_participle?: string;
  romanization?: any;
  conjugation_pattern?: string;
  examples?: any;
  notes?: string;
}

interface IrregularVerbEntry extends VerbEntry {
  irregularity_type: string;
}

interface NounEntry {
  pashto_word: string;
  romanized?: string;
  gender: string;
  number: string;
  plural_forms?: any;
  frequency?: number;
  examples?: any;
}

interface GrammarRule {
  rule_name: string;
  part_of_speech: string;
  rule_description: string;
  examples?: any;
  priority?: number;
}

export async function migrateLexiconFromSupabase(
  db: D1Database,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('📖 Migrating lexicon tables from Supabase to D1\n');
  
  // Migrate verbs_lexicon
  console.log('1. Migrating verbs_lexicon...');
  const { data: verbs, error: verbsError } = await supabase
    .from('verbs_lexicon')
    .select('*');
  
  if (verbsError) {
    console.error(`   ❌ Error fetching verbs_lexicon:`, verbsError);
  } else if (verbs && verbs.length > 0) {
    console.log(`   Found ${verbs.length} verb entries`);
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO verbs_lexicon (
        verb_root,
        stems,
        roots,
        past_participle,
        romanization,
        conjugation_pattern,
        examples,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const stmts = verbs.map((verb: VerbEntry) =>
      stmt.bind(
        verb.verb_root,
        verb.stems ? JSON.stringify(verb.stems) : null,
        verb.roots ? JSON.stringify(verb.roots) : null,
        verb.past_participle || null,
        verb.romanization ? JSON.stringify(verb.romanization) : null,
        verb.conjugation_pattern || null,
        verb.examples ? JSON.stringify(verb.examples) : null,
        verb.notes || null
      )
    );
    
    await db.batch(stmts);
    console.log(`   ✅ Migrated ${verbs.length} verb entries`);
  } else {
    console.log('   ⚠️  No verbs found in Supabase');
  }
  
  // Migrate irregular_verbs
  console.log('\n2. Migrating irregular_verbs...');
  const { data: irregularVerbs, error: irregularError } = await supabase
    .from('irregular_verbs')
    .select('*');
  
  if (irregularError) {
    console.error(`   ❌ Error fetching irregular_verbs:`, irregularError);
  } else if (irregularVerbs && irregularVerbs.length > 0) {
    console.log(`   Found ${irregularVerbs.length} irregular verb entries`);
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO irregular_verbs (
        verb_root,
        stems,
        roots,
        past_participle,
        romanization,
        irregularity_type,
        conjugation_pattern,
        examples,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const stmts = irregularVerbs.map((verb: IrregularVerbEntry) =>
      stmt.bind(
        verb.verb_root,
        verb.stems ? JSON.stringify(verb.stems) : null,
        verb.roots ? JSON.stringify(verb.roots) : null,
        verb.past_participle || null,
        verb.romanization ? JSON.stringify(verb.romanization) : null,
        verb.irregularity_type || 'unknown',
        verb.conjugation_pattern || null,
        verb.examples ? JSON.stringify(verb.examples) : null,
        verb.notes || null
      )
    );
    
    await db.batch(stmts);
    console.log(`   ✅ Migrated ${irregularVerbs.length} irregular verb entries`);
  } else {
    console.log('   ⚠️  No irregular verbs found in Supabase');
  }
  
  // Migrate nouns_lexicon
  console.log('\n3. Migrating nouns_lexicon...');
  const { data: nouns, error: nounsError } = await supabase
    .from('nouns_lexicon')
    .select('*');
  
  if (nounsError) {
    console.error(`   ❌ Error fetching nouns_lexicon:`, nounsError);
  } else if (nouns && nouns.length > 0) {
    console.log(`   Found ${nouns.length} noun entries`);
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO nouns_lexicon (
        pashto_word,
        romanized,
        gender,
        number,
        plural_forms,
        frequency,
        examples
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const stmts = nouns.map((noun: NounEntry) =>
      stmt.bind(
        noun.pashto_word,
        noun.romanized || null,
        noun.gender || 'unknown',
        noun.number || 'singular',
        noun.plural_forms ? JSON.stringify(noun.plural_forms) : null,
        noun.frequency || 0,
        noun.examples ? JSON.stringify(noun.examples) : null
      )
    );
    
    await db.batch(stmts);
    console.log(`   ✅ Migrated ${nouns.length} noun entries`);
  } else {
    console.log('   ⚠️  No nouns found in Supabase');
  }
  
  // Migrate grammar_rules
  console.log('\n4. Migrating grammar_rules...');
  const { data: rules, error: rulesError } = await supabase
    .from('grammar_rules')
    .select('*')
    .order('priority', { ascending: true });
  
  if (rulesError) {
    console.error(`   ❌ Error fetching grammar_rules:`, rulesError);
  } else if (rules && rules.length > 0) {
    console.log(`   Found ${rules.length} grammar rules`);
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO grammar_rules (
        rule_name,
        part_of_speech,
        rule_description,
        examples,
        priority
      ) VALUES (?, ?, ?, ?, ?)
    `);
    
    const stmts = rules.map((rule: GrammarRule) =>
      stmt.bind(
        rule.rule_name,
        rule.part_of_speech || 'unknown',
        rule.rule_description || '',
        rule.examples ? JSON.stringify(rule.examples) : null,
        rule.priority || 0
      )
    );
    
    await db.batch(stmts);
    console.log(`   ✅ Migrated ${rules.length} grammar rules`);
  } else {
    console.log('   ⚠️  No grammar rules found in Supabase');
  }
  
  console.log('\n✅ Lexicon migration completed!');
}

export async function runMigration(env: { DB: D1Database }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  await migrateLexiconFromSupabase(env.DB, supabaseUrl, supabaseKey);
}









