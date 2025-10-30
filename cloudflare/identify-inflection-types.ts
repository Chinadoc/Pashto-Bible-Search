/**
 * Identify Inflection Types
 * 
 * Determines the specific inflection/conjugation type for each form:
 * - Noun: "1st_masc", "2nd_fem", "vocative", "plural"
 * - Verb: "present_1sg", "past_3sg_masc", "subjunctive_2pl", etc.
 */

interface InflectionInfo {
  type: string; // e.g., "1st_masc", "present_1sg"
  category: 'noun' | 'verb' | 'adjective' | 'other';
  description?: string;
}

/**
 * Identify noun inflection type from form and base form
 */
export function identifyNounInflection(
  form: string,
  baseForm: string
): InflectionInfo | null {
  if (form === baseForm) {
    return {
      type: 'direct',
      category: 'noun',
      description: 'Base form (direct case)'
    };
  }
  
  // Pattern 1: Masculine words ending in consonant
  // Base: اتفاق → Inflections: اتفاقو (2nd), اتفاقونه (plural)
  if (baseForm.endsWith('ه') && form === baseForm.slice(0, -1) + 'و') {
    return { type: '2nd_masc', category: 'noun', description: '2nd inflection masculine' };
  }
  
  if (baseForm.endsWith('ه') && form === baseForm.slice(0, -1) + 'ونو') {
    return { type: '2nd_masc_plural', category: 'noun', description: '2nd inflection masculine plural' };
  }
  
  // Pattern 1: Feminine words ending in ه
  // Base: اندازه → Inflections: اندازې (1st), اندازو (2nd)
  if (baseForm.endsWith('ه')) {
    const stem = baseForm.slice(0, -1);
    if (form === stem + 'ې') {
      return { type: '1st_fem', category: 'noun', description: '1st inflection feminine' };
    }
    if (form === stem + 'و') {
      return { type: '2nd_fem', category: 'noun', description: '2nd inflection feminine' };
    }
    if (form === stem + 'و') {
      return { type: '2nd_fem', category: 'noun', description: '2nd inflection feminine' };
    }
  }
  
  // Pattern 2: Words ending in ی (unstressed)
  // Base: سوری → Inflections: سوري (1st), سوریو (2nd), سوریه (vocative)
  if (baseForm.endsWith('ی')) {
    const stem = baseForm.slice(0, -1);
    if (form === stem + 'ي') {
      return { type: '1st_masc', category: 'noun', description: '1st inflection masculine' };
    }
    if (form === stem + 'یو') {
      return { type: '2nd_masc', category: 'noun', description: '2nd inflection masculine' };
    }
    if (form === stem + 'یه') {
      return { type: 'vocative_masc', category: 'noun', description: 'Vocative masculine' };
    }
  }
  
  // Plural patterns
  if (form.endsWith('ان') || form.endsWith('انو') || form.endsWith('ونه') || form.endsWith('ونو')) {
    return { type: 'plural', category: 'noun', description: 'Plural form' };
  }
  
  return null;
}

/**
 * Identify verb conjugation type from form and base form
 */
export function identifyVerbConjugation(
  form: string,
  baseForm: string
): InflectionInfo | null {
  if (form === baseForm) {
    return {
      type: 'infinitive',
      category: 'verb',
      description: 'Infinitive/base form'
    };
  }
  
  // Extract root (remove -ل ending)
  const root = baseForm.endsWith('ل') ? baseForm.slice(0, -1) : baseForm;
  
  // Present tense forms (imperfective)
  // Patterns: وهم (wahum), وایم (waayum), وینم (weenum)
  const presentEndings = ['م', 'و', 'ې', 'ی', 'ي'];
  for (const ending of presentEndings) {
    if (form === root + ending || form === root + 'ه' + ending) {
      const person = ending === 'م' ? '1sg' : ending === 'و' ? '1pl' : 
                     ending === 'ې' ? '2sg' : ending === 'ی' ? '2sg' : '3sg';
      return {
        type: `present_${person}`,
        category: 'verb',
        description: `Present tense ${person}`
      };
    }
  }
  
  // Past tense forms
  // Patterns: وهلم (wahúlum), ووهل (óowahul)
  const pastEndings = ['لم', 'لو', 'لې', 'ل', 'له'];
  for (const ending of pastEndings) {
    if (form === root + ending) {
      const person = ending === 'لم' ? '1sg' : ending === 'لو' ? '1pl' :
                     ending === 'لې' ? '2sg' : ending === 'ل' ? '3sg' : '3sg';
      return {
        type: `past_${person}`,
        category: 'verb',
        description: `Past tense ${person}`
      };
    }
    
    // Perfective past (with و prefix)
    if (form === 'و' + root + ending) {
      const person = ending === 'لم' ? '1sg' : ending === 'لو' ? '1pl' :
                     ending === 'لې' ? '2sg' : ending === 'ل' ? '3sg' : '3sg';
      return {
        type: `perfective_past_${person}`,
        category: 'verb',
        description: `Perfective past ${person}`
      };
    }
  }
  
  // Subjunctive forms (perfective stem)
  // Pattern: ووهم (óowahum)
  if (form.startsWith('و' + root) || form.startsWith('و' + root + 'ه')) {
    const stem = form.startsWith('و' + root + 'ه') ? 'و' + root + 'ه' : 'و' + root;
    for (const ending of presentEndings) {
      if (form === stem + ending) {
        const person = ending === 'م' ? '1sg' : ending === 'و' ? '1pl' : 
                       ending === 'ې' ? '2sg' : ending === 'ی' ? '2sg' : '3sg';
        return {
          type: `subjunctive_${person}`,
          category: 'verb',
          description: `Subjunctive ${person}`
        };
      }
    }
  }
  
  // Past participle
  if (form.endsWith('لی') || form.endsWith('لل')) {
    return {
      type: 'past_participle',
      category: 'verb',
      description: 'Past participle'
    };
  }
  
  // Imperative
  if (form.endsWith('ه') || form.endsWith('ئ')) {
    const person = form.endsWith('ه') ? '2sg' : '2pl';
    return {
      type: `imperative_${person}`,
      category: 'verb',
      description: `Imperative ${person}`
    };
  }
  
  return null;
}

/**
 * Identify inflection type for any word
 */
export function identifyInflectionType(
  form: string,
  baseForm: string,
  pos?: string
): InflectionInfo | null {
  if (form === baseForm) {
    return {
      type: 'base',
      category: 'other',
      description: 'Base form'
    };
  }
  
  const posLower = (pos || '').toLowerCase();
  
  // Try verb first
  if (posLower.includes('verb') || /\bv\./.test(posLower)) {
    const verbInfo = identifyVerbConjugation(form, baseForm);
    if (verbInfo) return verbInfo;
  }
  
  // Try noun/adjective
  if (posLower.includes('noun') || posLower.includes('adj') || /\bn\./.test(posLower)) {
    const nounInfo = identifyNounInflection(form, baseForm);
    if (nounInfo) return nounInfo;
  }
  
  // Generic fallback
  return {
    type: 'inflected',
    category: 'other',
    description: 'Inflected form (type unknown)'
  };
}

if (require.main === module) {
  // Test examples
  console.log('🧪 Testing inflection type identification:\n');
  
  const testCases = [
    { form: 'ټول', base: 'ټول', pos: 'adj.' },
    { form: 'ټوله', base: 'ټول', pos: 'adj.' },
    { form: 'ټولې', base: 'ټول', pos: 'adj.' },
    { form: 'ټولو', base: 'ټول', pos: 'adj.' },
    { form: 'وهل', base: 'وهل', pos: 'v. trans.' },
    { form: 'وهم', base: 'وهل', pos: 'v. trans.' },
    { form: 'وهلم', base: 'وهل', pos: 'v. trans.' },
    { form: 'ووهل', base: 'وهل', pos: 'v. trans.' },
  ];
  
  for (const { form, base, pos } of testCases) {
    const info = identifyInflectionType(form, base, pos);
    console.log(`${form} (base: ${base}, POS: ${pos})`);
    console.log(`  → ${info?.type || 'UNKNOWN'} (${info?.description || 'N/A'})`);
    console.log('');
  }
}

