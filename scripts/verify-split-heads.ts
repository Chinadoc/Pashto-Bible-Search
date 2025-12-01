/**
 * Verify Split Head Forms (Separable Prefixes)
 * 
 * In Pashto, certain directional/aspectual prefixes can be separated
 * from the verb stem in perfective constructions:
 * 
 * - را (ra) - "hither" (towards speaker)
 * - در (dar) - "thither" (towards addressee)  
 * - ور (war) - "thither" (away from both)
 * - کې (ke) - "in/at" (locative)
 * - پرې (pre) - "on/at" (ablative)
 * 
 * Example: راتلل (to come) → را و تلل (perfective: "came")
 * 
 * Reference: https://grammar.lingdocs.com/verbs/roots-and-stems/#split-and-non-split
 */

const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Verbs with separable prefixes
const VERBS_WITH_SPLIT_HEADS = [
  // را- verbs (hither/towards speaker)
  { infinitive: 'راتلل', prefix: 'را', stem: 'تلل', meaning: 'to come' },
  { infinitive: 'راوړل', prefix: 'را', stem: 'وړل', meaning: 'to bring' },
  { infinitive: 'راکول', prefix: 'را', stem: 'کول', meaning: 'to give (to me)' },
  { infinitive: 'راخستل', prefix: 'را', stem: 'خستل', meaning: 'to take (towards speaker)' },
  { infinitive: 'راوتل', prefix: 'را', stem: 'وتل', meaning: 'to come out' },
  { infinitive: 'راپورته کېدل', prefix: 'را', stem: 'پورته کېدل', meaning: 'to rise up' },
  
  // در- verbs (towards addressee)
  { infinitive: 'درتلل', prefix: 'در', stem: 'تلل', meaning: 'to come to you' },
  { infinitive: 'درکول', prefix: 'در', stem: 'کول', meaning: 'to give to you' },
  { infinitive: 'دروړل', prefix: 'در', stem: 'وړل', meaning: 'to bring to you' },
  
  // ور- verbs (away from both)
  { infinitive: 'ورتلل', prefix: 'ور', stem: 'تلل', meaning: 'to go there' },
  { infinitive: 'ورکول', prefix: 'ور', stem: 'کول', meaning: 'to give to them' },
  { infinitive: 'وروړل', prefix: 'ور', stem: 'وړل', meaning: 'to take there' },
  { infinitive: 'ورننوتل', prefix: 'ور', stem: 'ننوتل', meaning: 'to enter there' },
  
  // کې- verbs (in/at)
  { infinitive: 'کېناستل', prefix: 'کې', stem: 'ناستل', meaning: 'to sit down' },
  { infinitive: 'کېوتل', prefix: 'کې', stem: 'وتل', meaning: 'to fall into' },
  
  // پرې- verbs (on/at)
  { infinitive: 'پرېکول', prefix: 'پرې', stem: 'کول', meaning: 'to cut off' },
  { infinitive: 'پرېوتل', prefix: 'پرې', stem: 'وتل', meaning: 'to fall upon' },
];

interface VerbFormResult {
  form: string;
  tense?: string;
  person?: string;
  aspect?: string;
  mood?: string;
}

interface SplitHeadVerification {
  infinitive: string;
  prefix: string;
  meaning: string;
  totalForms: number;
  joinedForms: VerbFormResult[];  // Normal: راوتلم
  splitForms: VerbFormResult[];   // Split: را و وتلم
  expectedSplitPattern: string;
  hasSplitInD1: boolean;
  occurrencesInBible: number;
}

/**
 * Fetch verb forms from D1
 */
async function fetchVerbForms(lemma: string): Promise<VerbFormResult[]> {
  try {
    const url = `${WORKER_URL}/api/verb-forms?lemma=${encodeURIComponent(lemma)}&cap=200`;
    const response = await fetch(url);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.forms || [];
  } catch (error) {
    console.error(`Error fetching forms for ${lemma}:`, error);
    return [];
  }
}

/**
 * Search for occurrences of a form in Bible verses
 */
async function searchOccurrences(form: string): Promise<number> {
  try {
    const url = `${WORKER_URL}/api/search?q=${encodeURIComponent(form)}&translation=afghan2023&limit=100`;
    const response = await fetch(url);
    
    if (!response.ok) return 0;
    
    const data = await response.json();
    return data.verses?.length || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Generate expected split forms for a verb
 */
function generateExpectedSplitForms(prefix: string, stem: string): string[] {
  const splitForms: string[] = [];
  
  // Perfective split pattern: prefix + و + stem
  // e.g., را + و + تلل → را و تللم, را و تللې, etc.
  
  const perfectiveMarker = 'و';
  
  // Common person endings for past tense
  const personEndings = [
    { ending: 'م', person: '1sg' },
    { ending: 'ې', person: '2sg' },
    { ending: '', person: '3sg_m' },
    { ending: 'ه', person: '3sg_f' },
    { ending: 'و', person: '1pl' },
    { ending: 'ئ', person: '2pl' },
    { ending: 'ل', person: '3pl' },
  ];
  
  // Remove ل from stem if present (for past tense)
  const stemBase = stem.endsWith('ل') ? stem.slice(0, -1) : stem;
  
  for (const { ending } of personEndings) {
    // Split form: "را و تلل" (with space)
    splitForms.push(`${prefix} ${perfectiveMarker} ${stemBase}${ending}`);
    // Also check without spaces (might appear in text)
    splitForms.push(`${prefix}${perfectiveMarker}${stemBase}${ending}`);
  }
  
  return splitForms;
}

/**
 * Verify split head forms for a verb
 */
async function verifySplitHead(verbInfo: typeof VERBS_WITH_SPLIT_HEADS[0]): Promise<SplitHeadVerification> {
  const forms = await fetchVerbForms(verbInfo.infinitive);
  
  // Separate joined vs split forms
  const joinedForms: VerbFormResult[] = [];
  const splitForms: VerbFormResult[] = [];
  
  for (const form of forms) {
    // Check if form contains space (split) or not (joined)
    if (form.form.includes(' ')) {
      splitForms.push(form);
    } else {
      joinedForms.push(form);
    }
  }
  
  // Generate expected split pattern
  const expectedSplitPattern = `${verbInfo.prefix} و ${verbInfo.stem.replace('ل', '')}...`;
  
  // Search for occurrences in Bible
  const occurrences = await searchOccurrences(verbInfo.infinitive);
  
  return {
    infinitive: verbInfo.infinitive,
    prefix: verbInfo.prefix,
    meaning: verbInfo.meaning,
    totalForms: forms.length,
    joinedForms,
    splitForms,
    expectedSplitPattern,
    hasSplitInD1: splitForms.length > 0,
    occurrencesInBible: occurrences,
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('Split Head Verification');
  console.log('='.repeat(70));
  console.log('Reference: https://grammar.lingdocs.com/verbs/roots-and-stems/#split-and-non-split\n');
  
  const results: SplitHeadVerification[] = [];
  
  console.log('Analyzing verbs with separable prefixes...\n');
  
  for (const verb of VERBS_WITH_SPLIT_HEADS) {
    console.log(`Checking: ${verb.infinitive} (${verb.meaning})...`);
    
    const result = await verifySplitHead(verb);
    results.push(result);
    
    console.log(`  Forms in D1: ${result.totalForms}`);
    console.log(`  Joined forms: ${result.joinedForms.length}`);
    console.log(`  Split forms: ${result.splitForms.length} ${result.hasSplitInD1 ? 'OK' : 'MISSING!'}`);
    console.log(`  Bible occurrences: ${result.occurrencesInBible}`);
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 100));
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY\n');
  
  const withSplit = results.filter(r => r.hasSplitInD1);
  const withoutSplit = results.filter(r => !r.hasSplitInD1);
  
  console.log(`Verbs with split forms in D1: ${withSplit.length}/${results.length}`);
  console.log(`Verbs missing split forms: ${withoutSplit.length}/${results.length}`);
  
  if (withoutSplit.length > 0) {
    console.log('\nVerbs MISSING split forms:');
    for (const verb of withoutSplit) {
      console.log(`  - ${verb.infinitive} (${verb.meaning})`);
      console.log(`    Expected pattern: ${verb.expectedSplitPattern}`);
    }
  }
  
  // Check which prefixes are covered
  const prefixCoverage: Record<string, { total: number; withSplit: number }> = {};
  for (const result of results) {
    if (!prefixCoverage[result.prefix]) {
      prefixCoverage[result.prefix] = { total: 0, withSplit: 0 };
    }
    prefixCoverage[result.prefix].total++;
    if (result.hasSplitInD1) {
      prefixCoverage[result.prefix].withSplit++;
    }
  }
  
  console.log('\nPrefix Coverage:');
  for (const [prefix, stats] of Object.entries(prefixCoverage)) {
    const pct = Math.round((stats.withSplit / stats.total) * 100);
    console.log(`  ${prefix}: ${stats.withSplit}/${stats.total} (${pct}%)`);
  }
  
  // Show sample of what split forms look like
  console.log('\nSample Split Forms Found:');
  for (const result of withSplit.slice(0, 3)) {
    console.log(`  ${result.infinitive}:`);
    for (const form of result.splitForms.slice(0, 3)) {
      console.log(`    - "${form.form}" (${form.tense || ''} ${form.person || ''})`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('Verification complete!');
}

main().catch(console.error);

