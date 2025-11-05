/**
 * Populate Inflections Table from nouns_lexicon
 * 
 * Generates inflections for nouns in nouns_lexicon table based on their inflection_pattern
 * This complements the inflections_cache.json migration by ensuring all nouns_lexicon entries
 * have their inflections stored in the inflections table.
 * 
 * Run with: npx tsx cloudflare/populate-inflections-from-nouns-lexicon.ts
 */

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
}

interface D1Result {
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    duration: number;
  };
}

/**
 * Generate inflections for Pattern #1 Basic (masc_basic_consonant)
 * Based on the pattern shown for "ملک" (malak):
 * - Plain: ملک
 * - 1st: ملک  
 * - 2nd: ملکو
 * - Plural: ملکان
 * - Plural 2nd Inf.: ملکانو
 */
function generatePattern1BasicForms(lemma: string, gender: string = 'm', animate: boolean = true): string[] {
  const forms: string[] = [lemma]; // Always include base form
  
  // Masculine Pattern #1 Basic
  if (gender.toLowerCase().startsWith('m') || !gender) {
    // Plain and 1st inflection are the same (ملک)
    forms.push(lemma);
    
    // 2nd inflection (ملکو)
    if (!lemma.endsWith('و')) {
      forms.push(lemma + 'و');
    }
    
    // Plural forms
    if (animate) {
      // Animate plural: ملکان
      if (!lemma.endsWith('ان')) {
        forms.push(lemma + 'ان');
        // Plural 2nd inflection: ملکانو
        forms.push(lemma + 'ان' + 'و');
      }
    } else {
      // Inanimate plural: ملکونه
      if (!lemma.endsWith('ونه')) {
        forms.push(lemma + 'ونه');
        forms.push(lemma + 'ونو');
      }
    }
  }
  
  // Feminine Pattern #1 Basic  
  if (gender.toLowerCase().startsWith('f')) {
    // If lemma ends with ه, it's feminine base
    if (lemma.endsWith('ه')) {
      const stem = lemma.slice(0, -1);
      forms.push(lemma); // Plain feminine
      forms.push(stem + 'ې'); // 1st feminine
      forms.push(stem + 'و'); // 2nd feminine
      
      // Plural feminine
      if (animate) {
        forms.push(stem + 'انې');
        forms.push(stem + 'انو');
      }
    } else {
      // Masculine word, add feminine forms
      forms.push(lemma + 'ه'); // Plain feminine
      forms.push(lemma + 'ې'); // 1st feminine
      forms.push(lemma + 'و'); // 2nd feminine
    }
  }
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate inflections for Pattern #2 Unstressed ی
 */
function generatePattern2UnstressedYForms(lemma: string): string[] {
  const forms: string[] = [lemma];
  const stem = lemma.endsWith('ی') ? lemma.slice(0, -1) : lemma;
  
  forms.push(stem + 'ی'); // Plain masculine
  forms.push(stem + 'ي'); // 1st masculine
  forms.push(stem + 'یو'); // 2nd masculine
  forms.push(stem + 'ې'); // Feminine
  
  // Plural
  forms.push(stem + 'یان');
  forms.push(stem + 'یانو');
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate inflections for Pattern #3 Stressed ی (áy)
 */
function generatePattern3StressedAYForms(lemma: string): string[] {
  const forms: string[] = [lemma];
  const stem = lemma.endsWith('ی') || lemma.endsWith('ي') ? lemma.slice(0, -1) : lemma;
  
  forms.push(stem + 'ی'); // Base form
  forms.push(stem + 'ي'); // 1st inflection
  forms.push(stem + 'یو'); // 2nd inflection
  forms.push(stem + 'ې'); // Feminine
  forms.push(stem + 'ۍ'); // Feminine stressed
  
  // Plural
  forms.push(stem + 'یان');
  forms.push(stem + 'یانو');
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate inflections for Pattern #4 Pashtoon (پښتون)
 */
function generatePattern4PashtoonForms(lemma: string): string[] {
  const forms: string[] = [lemma];
  
  if (lemma.endsWith('ون')) {
    const base = lemma.slice(0, -2);
    forms.push(base + 'ون'); // Plain masculine
    forms.push(base + 'انه'); // 1st masculine
    forms.push(base + 'نو'); // 2nd masculine
    forms.push(base + 'نه'); // Plain feminine
    forms.push(base + 'نې'); // 1st feminine
    forms.push(base + 'نو'); // 2nd feminine
  }
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate inflections for Pattern #5 Short Squish
 */
function generatePattern5ShortSquishForms(lemma: string): string[] {
  const forms: string[] = [lemma];
  
  if (lemma.length <= 3) {
    forms.push(lemma); // Plain
    forms.push(lemma + 'ه'); // 1st/Plain feminine
    forms.push(lemma + 'و'); // 2nd
    forms.push(lemma + 'ې'); // 1st feminine
  }
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate inflections for Pattern #6 Feminine Inanimate ي
 */
function generatePattern6FeminineInanimateForms(lemma: string): string[] {
  const forms: string[] = [lemma];
  
  if (lemma.endsWith('ي')) {
    const stem = lemma.slice(0, -1);
    forms.push(stem + 'ي'); // Plain
    forms.push(stem + 'ۍ'); // 1st inflection
    forms.push(stem + 'یو'); // 2nd inflection
  }
  
  return [...new Set(forms)].filter(Boolean);
}

/**
 * Generate all inflected forms for a noun based on its inflection pattern
 */
function generateNounInflections(lemma: string, pattern: number, gender: string, animate: boolean = true): string[] {
  switch (pattern) {
    case 1:
      return generatePattern1BasicForms(lemma, gender, animate);
    case 2:
      return generatePattern2UnstressedYForms(lemma);
    case 3:
      return generatePattern3StressedAYForms(lemma);
    case 4:
      return generatePattern4PashtoonForms(lemma);
    case 5:
      return generatePattern5ShortSquishForms(lemma);
    case 6:
      return generatePattern6FeminineInanimateForms(lemma);
    default:
      // Default to Pattern #1 Basic
      return generatePattern1BasicForms(lemma, gender, animate);
  }
}

/**
 * Populate inflections table from nouns_lexicon
 */
async function populateInflectionsFromNounsLexicon(db: D1Database): Promise<void> {
  console.log('📖 Fetching nouns from nouns_lexicon...');
  
  // Get all nouns from nouns_lexicon
  const nounsResult = await db.prepare(`
    SELECT pashto_word, inflection_pattern, gender, number, romanized
    FROM nouns_lexicon
    WHERE inflection_pattern IS NOT NULL
    ORDER BY pashto_word
  `).all<{
    pashto_word: string;
    inflection_pattern: number;
    gender: string;
    number: string;
    romanized: string | null;
  }>();
  
  if (!nounsResult.success || !nounsResult.results) {
    console.error('❌ Failed to fetch nouns from nouns_lexicon');
    return;
  }
  
  const nouns = nounsResult.results;
  console.log(`✅ Found ${nouns.length} nouns with inflection patterns`);
  
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO inflections (base_word, inflected_form, grammatical_info, frequency, examples)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  let totalInserted = 0;
  let totalForms = 0;
  
  for (let i = 0; i < nouns.length; i++) {
    const noun = nouns[i];
    const lemma = noun.pashto_word;
    const pattern = noun.inflection_pattern || 1;
    const gender = noun.gender || 'm';
    const isAnimate = noun.number?.toLowerCase().includes('anim') || true; // Default to animate
    
    // Generate all inflected forms
    const forms = generateNounInflections(lemma, pattern, gender, isAnimate);
    totalForms += forms.length;
    
    // Insert each form into inflections table
    for (const form of forms) {
      if (form === lemma) continue; // Skip base form (already counted)
      
      const grammaticalInfo = JSON.stringify({
        pos: 'noun',
        pattern: pattern,
        gender: gender,
        form_type: form === lemma ? 'plain' : 
                   form.endsWith('و') ? '2nd' : 
                   form.endsWith('ې') ? '1st' : 
                   form.includes('ان') ? 'plural' : 'other'
      });
      
      try {
        await insertStmt
          .bind(lemma, form, grammaticalInfo, 0, JSON.stringify([]))
          .run();
        totalInserted++;
      } catch (error) {
        // Ignore duplicates (INSERT OR IGNORE)
        if (!String(error).includes('UNIQUE')) {
          console.warn(`Error inserting ${lemma} → ${form}:`, error);
        }
      }
    }
    
    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`   Processed ${i + 1}/${nouns.length} nouns, inserted ${totalInserted} forms...`);
    }
  }
  
  console.log(`\n✅ Populated inflections from nouns_lexicon:`);
  console.log(`   Nouns processed: ${nouns.length}`);
  console.log(`   Total forms generated: ${totalForms}`);
  console.log(`   Forms inserted: ${totalInserted}`);
}

// Main execution (for Cloudflare Workers environment)
export async function runMigration(env: { DB: D1Database }) {
  console.log('🚀 Starting Inflections Population from nouns_lexicon\n');
  
  try {
    await populateInflectionsFromNounsLexicon(env.DB);
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// For local testing/development
if (require.main === module) {
  console.log('⚠️  This script is designed to run in Cloudflare Workers environment.');
  console.log('   To run locally, use: wrangler d1 execute pashto-bible-db --file=cloudflare/populate-inflections-sql.sql');
  console.log('   Or use the migrate-inflections-to-d1.ts script for local development.');
}





