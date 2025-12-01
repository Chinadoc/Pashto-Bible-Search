import { NextRequest, NextResponse } from 'next/server';

/**
 * Word Analysis API
 * 
 * GET /api/word-analysis?word={word}&context={verseText}
 * 
 * Returns grammatical analysis of a Pashto word:
 * - Part of speech
 * - Base form / lemma
 * - For nouns: inflection pattern, inflection state, reason for inflection
 * - For verbs: person, tense, aspect, mood, compound type
 */

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface WordAnalysisResult {
  word: string;
  pos: string | null;
  baseForm: string | null;
  romanized: string | null;
  english: string | null;
  gender: string | null;
  inflectionPattern: string | null;
  inflectionState: string | null;
  inflectionReason: {
    isPlural: boolean;
    isInSandwich: boolean;
    sandwichType: string | null;
    isErgative: boolean;
  } | null;
  person: string | null;
  number: string | null;
  tense: string | null;
  aspect: string | null;
  mood: string | null;
  isCompound: boolean;
  compoundType: string | null;
  auxiliaryVerb: string | null;
  confidence: number;
  source: string;
  // Pronoun-specific fields
  isClitic?: boolean;
  cliticType?: 'subject' | 'object' | 'possessive';
  cliticNotes?: string;
  possibleReferents?: string[];
  grammaticalCase?: string;
  // Compound verb fields (when this word is part of a compound verb with next word)
  compoundVerbInfo?: {
    fullForm: string; // e.g., "پاتې شم"
    infinitive: string; // e.g., "پاتې کېدل"
    meaning: string;
    transitivity: 'transitive' | 'intransitive';
    person: string;
    number: string;
    tense: string;
    note: string;
  };
}

// Sandwich patterns for context analysis
const SANDWICH_PATTERNS = [
  { start: 'په', end: 'کې', type: 'په...کې (in)' },
  { start: 'په', end: 'باندې', type: 'په...باندې (on)' },
  { start: 'په', end: 'سره', type: 'په...سره (with)' },
  { start: 'د', end: null, type: 'د (of)' },
  { start: 'له', end: 'سره', type: 'له...سره (with)' },
  { start: 'له', end: 'نه', type: 'له...نه (from)' },
  { start: 'له', end: 'څخه', type: 'له...څخه (from)' },
  { start: null, end: 'ته', type: 'ته (to)' },
  { start: 'تر', end: 'پورې', type: 'تر...پورې (until)' },
];

// Inflection patterns based on LingDocs
const INFLECTION_PATTERNS = {
  'pattern1': 'Pattern #1 Basic',
  'pattern2': 'Pattern #2 Unstressed ی',
  'pattern3': 'Pattern #3 Stressed ی',
  'pattern4': 'Pattern #4 Pashtoon',
  'pattern5': 'Pattern #5 Squish',
  'pattern6': 'Pattern #5½ Fem ي',
};

// Pashto mini-pronouns (clitics) with their forms and meanings
// These attach to verbs and show who is doing/receiving the action
const PASHTO_CLITICS: Record<string, {
  type: 'subject' | 'object' | 'possessive';
  person: string;
  number: string;
  gender?: string;
  meaning: string;
  notes: string;
}> = {
  'مې': { type: 'subject', person: '1st', number: 'singular', meaning: 'I / me / my', notes: 'First person singular clitic' },
  'دې': { type: 'subject', person: '2nd', number: 'singular', meaning: 'you / your', notes: 'Second person singular clitic' },
  'یې': { type: 'subject', person: '3rd', number: 'singular', meaning: 'he/she/it/they', notes: 'Third person clitic - can be singular OR plural. Check context for referent.' },
  'مو': { type: 'subject', person: '1st', number: 'plural', meaning: 'we / us / our', notes: 'First person plural OR second person formal' },
  'یی': { type: 'subject', person: '3rd', number: 'singular', meaning: 'he/she/it', notes: 'Alternative spelling of یې' },
  'ورته': { type: 'object', person: '3rd', number: 'singular', meaning: 'to him/her/it', notes: 'Oblique directional clitic' },
  'راته': { type: 'object', person: '1st', number: 'singular', meaning: 'to me', notes: 'Directional clitic toward speaker' },
  'درته': { type: 'object', person: '2nd', number: 'singular', meaning: 'to you', notes: 'Directional clitic toward listener' },
};

// Stative compound verb complements (adjective/noun + auxiliary)
// These combine with کېدل (to become, intransitive) or کول (to make, transitive)
const COMPOUND_VERB_COMPLEMENTS: Record<string, {
  meaning: string;
  transitiveAux: 'کول';
  intransitiveAux: 'کېدل';
  transitiveInfinitive: string;
  intransitiveInfinitive: string;
}> = {
  'پاتې': { meaning: 'to stay/remain', transitiveAux: 'کول', intransitiveAux: 'کېدل', 
    transitiveInfinitive: 'پاتې کول (to make stay)', intransitiveInfinitive: 'پاتې کېدل (to stay)' },
  'تېر': { meaning: 'to pass/cross', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'تېرول / تېر کول (to pass sth.)', intransitiveInfinitive: 'تېر کېدل (to pass)' },
  'پوره': { meaning: 'complete/full', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'پوره کول (to complete)', intransitiveInfinitive: 'پوره کېدل (to be completed)' },
  'خوشحاله': { meaning: 'happy', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'خوشحاله کول (to make happy)', intransitiveInfinitive: 'خوشحاله کېدل (to become happy)' },
  'پیدا': { meaning: 'to find/be born', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'پیدا کول (to find)', intransitiveInfinitive: 'پیدا کېدل (to be born)' },
  'ختم': { meaning: 'to end/finish', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'ختم کول (to finish)', intransitiveInfinitive: 'ختم کېدل (to end)' },
  'شروع': { meaning: 'to start', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'شروع کول (to start sth.)', intransitiveInfinitive: 'شروع کېدل (to begin)' },
  'بند': { meaning: 'to close', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'بند کول (to close)', intransitiveInfinitive: 'بند کېدل (to be closed)' },
  'خبر': { meaning: 'aware/news', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'خبر کول (to inform)', intransitiveInfinitive: 'خبر کېدل (to be informed)' },
  'صبر': { meaning: 'patience', transitiveAux: 'کول', intransitiveAux: 'کېدل',
    transitiveInfinitive: 'صبر کول (to be patient)', intransitiveInfinitive: 'صبر کېدل (to become patient)' },
};

// Auxiliary verb conjugations - کېدل (to become) and کول (to make)
const KEDUL_CONJUGATIONS: Record<string, { person: string; number: string; tense: string }> = {
  // Present
  'کېږم': { person: '1st', number: 'singular', tense: 'present' },
  'کېږې': { person: '2nd', number: 'singular', tense: 'present' },
  'کېږي': { person: '3rd', number: 'singular', tense: 'present' },
  'کېږو': { person: '1st', number: 'plural', tense: 'present' },
  'کېږئ': { person: '2nd', number: 'plural', tense: 'present' },
  // Subjunctive/Short Present
  'شم': { person: '1st', number: 'singular', tense: 'present' },
  'شې': { person: '2nd', number: 'singular', tense: 'present' },
  'شي': { person: '3rd', number: 'singular', tense: 'present' },
  'شو': { person: '1st', number: 'plural', tense: 'present' }, // Note: also 3sg past (شو)
  'شئ': { person: '2nd', number: 'plural', tense: 'present' },
  // Past
  'شوم': { person: '1st', number: 'singular', tense: 'past' },
  'شوې': { person: '2nd', number: 'singular', tense: 'past' },
  // Note: شو (3sg past) is same as 1pl present, listed above
  'شول': { person: '3rd', number: 'plural', tense: 'past' },
  'شوو': { person: '1st', number: 'plural', tense: 'past' },
  'شوئ': { person: '2nd', number: 'plural', tense: 'past' },
};

const KAWUL_CONJUGATIONS: Record<string, { person: string; number: string; tense: string }> = {
  // Present (imperfective)
  'کوم': { person: '1st', number: 'singular', tense: 'present' },
  'کوې': { person: '2nd', number: 'singular', tense: 'present' },
  'کوي': { person: '3rd', number: 'singular', tense: 'present' },
  'کوو': { person: '1st', number: 'plural', tense: 'present' },
  'کوئ': { person: '2nd', number: 'plural', tense: 'present' },
  // Subjunctive/Perfective stem - also used for past with different meaning
  // Note: کړم can be subjunctive OR simple past depending on context
  'کړم': { person: '1st', number: 'singular', tense: 'subjunctive' },
  'کړې': { person: '2nd', number: 'singular', tense: 'subjunctive' },
  'کړي': { person: '3rd', number: 'singular', tense: 'subjunctive' },
  'کړو': { person: '1st', number: 'plural', tense: 'subjunctive' },
  'کړئ': { person: '2nd', number: 'plural', tense: 'subjunctive' },
  // Past tense specific forms
  'کړ': { person: '3rd', number: 'singular', tense: 'past' },
  'کړل': { person: '3rd', number: 'plural', tense: 'past' },
};

// Function to detect if two words form a compound verb
function detectCompoundVerb(complement: string, nextWord: string): {
  isCompound: boolean;
  compoundType: 'stative' | 'dynamic' | null;
  transitivity: 'transitive' | 'intransitive' | null;
  infinitive: string | null;
  meaning: string | null;
  person: string | null;
  number: string | null;
  tense: string | null;
} | null {
  const complementInfo = COMPOUND_VERB_COMPLEMENTS[complement];
  if (!complementInfo) return null;
  
  // Check if nextWord is a کېدل conjugation (intransitive)
  const kedulInfo = KEDUL_CONJUGATIONS[nextWord];
  if (kedulInfo) {
    return {
      isCompound: true,
      compoundType: 'stative',
      transitivity: 'intransitive',
      infinitive: complementInfo.intransitiveInfinitive,
      meaning: complementInfo.meaning,
      person: kedulInfo.person,
      number: kedulInfo.number,
      tense: kedulInfo.tense,
    };
  }
  
  // Check if nextWord is a کول conjugation (transitive)
  const kawulInfo = KAWUL_CONJUGATIONS[nextWord];
  if (kawulInfo) {
    return {
      isCompound: true,
      compoundType: 'stative',
      transitivity: 'transitive',
      infinitive: complementInfo.transitiveInfinitive,
      meaning: complementInfo.meaning,
      person: kawulInfo.person,
      number: kawulInfo.number,
      tense: kawulInfo.tense,
    };
  }
  
  return null;
}

// Common Pashto pronouns
const PASHTO_PRONOUNS: Record<string, {
  person: string;
  number: string;
  case: string;
  gender?: string;
  meaning: string;
}> = {
  'زه': { person: '1st', number: 'singular', case: 'nominative', meaning: 'I' },
  'ته': { person: '2nd', number: 'singular', case: 'nominative', meaning: 'you' },
  'هغه': { person: '3rd', number: 'singular', case: 'nominative', gender: 'masculine', meaning: 'he / that' },
  'هغې': { person: '3rd', number: 'singular', case: 'oblique', gender: 'feminine', meaning: 'she / her' },
  'هغوی': { person: '3rd', number: 'plural', case: 'nominative', meaning: 'they / them' },
  'موږ': { person: '1st', number: 'plural', case: 'nominative', meaning: 'we' },
  'تاسو': { person: '2nd', number: 'plural', case: 'nominative', meaning: 'you (plural/formal)' },
  'دا': { person: '3rd', number: 'singular', case: 'nominative', meaning: 'this / he / she / it' },
  'دوی': { person: '3rd', number: 'plural', case: 'nominative', meaning: 'they' },
  'ما': { person: '1st', number: 'singular', case: 'oblique', meaning: 'me' },
  'تا': { person: '2nd', number: 'singular', case: 'oblique', meaning: 'you' },
};

// Analyze context to find potential referents for a pronoun
function findPronounReferent(pronoun: string, context: string): string[] {
  const referents: string[] = [];
  const words = context.split(/\s+/);
  const pronounIndex = words.findIndex(w => w === pronoun || w.includes(pronoun));
  
  // Look for nouns before the pronoun that could be referents
  const nounsBeforePronoun: string[] = [];
  
  // Common subject markers in Pashto Biblical text
  const subjectPatterns = [
    { pattern: /څښتن|خداوند/, referent: 'the Lord (څښتن)' },
    { pattern: /شاګردان/, referent: 'the disciples (شاګردان)' },
    { pattern: /عیسی/, referent: 'Jesus (عیسی)' },
    { pattern: /خدای/, referent: 'God (خدای)' },
    { pattern: /پولس/, referent: 'Paul (پولس)' },
    { pattern: /پطرس/, referent: 'Peter (پطرس)' },
    { pattern: /هغوی/, referent: 'they (هغوی)' },
    { pattern: /هغه/, referent: 'he/she (هغه)' },
  ];
  
  // Check for common referents in context
  for (const { pattern, referent } of subjectPatterns) {
    if (pattern.test(context)) {
      referents.push(referent);
    }
  }
  
  return referents;
}

// Detect inflection state from word ending
function detectInflectionState(word: string, baseForm: string | null): string | null {
  if (!baseForm || word === baseForm) return 'plain';
  
  // Check endings
  if (word.endsWith('و')) return '2nd';
  if (word.endsWith('ې') || word.endsWith('ي')) return '1st';
  if (word.endsWith('ه') && baseForm && !baseForm.endsWith('ه')) return 'plain';
  
  return null;
}

// Detect if word is in a sandwich based on context
function detectSandwich(word: string, context: string): { isInSandwich: boolean; sandwichType: string | null } {
  if (!context) return { isInSandwich: false, sandwichType: null };
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word));
  
  if (wordIndex === -1) return { isInSandwich: false, sandwichType: null };
  
  for (const pattern of SANDWICH_PATTERNS) {
    if (pattern.start && pattern.end) {
      // Look for start before and end after
      const beforeWords = words.slice(0, wordIndex);
      const afterWords = words.slice(wordIndex + 1, wordIndex + 6);
      
      if (beforeWords.some(w => w === pattern.start) && afterWords.some(w => w === pattern.end)) {
        return { isInSandwich: true, sandwichType: pattern.type };
      }
    } else if (pattern.start && !pattern.end) {
      // Word follows pattern.start (e.g., "د X")
      if (wordIndex > 0 && words[wordIndex - 1] === pattern.start) {
        return { isInSandwich: true, sandwichType: pattern.type };
      }
    } else if (!pattern.start && pattern.end) {
      // Word precedes pattern.end (e.g., "X ته")
      if (wordIndex < words.length - 1 && words[wordIndex + 1] === pattern.end) {
        return { isInSandwich: true, sandwichType: pattern.type };
      }
    }
  }
  
  return { isInSandwich: false, sandwichType: null };
}

// Detect ergative (subject of past transitive)
function detectErgative(word: string, context: string): boolean {
  if (!context) return false;
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word));
  
  if (wordIndex === -1) return false;
  
  // Look for past tense verb markers after this word
  const PAST_MARKERS = ['ل', 'لو', 'له', 'لې', 'لم', 'لئ'];
  
  for (let i = wordIndex + 1; i < words.length; i++) {
    const potentialVerb = words[i];
    for (const marker of PAST_MARKERS) {
      if (potentialVerb.endsWith(marker) && potentialVerb.length > marker.length + 2) {
        return true;
      }
    }
  }
  
  return false;
}

// Map D1 person values to display format
function mapPerson(d1Person: string | null): { person: string | null; number: string | null } {
  if (!d1Person) return { person: null, number: null };
  
  const lower = d1Person.toLowerCase();
  
  if (lower.includes('1')) {
    return { person: '1st', number: lower.includes('pl') ? 'plural' : 'singular' };
  }
  if (lower.includes('2')) {
    return { person: '2nd', number: lower.includes('pl') ? 'plural' : 'singular' };
  }
  if (lower.includes('3')) {
    return { person: '3rd', number: lower.includes('pl') ? 'plural' : 'singular' };
  }
  
  return { person: null, number: null };
}

// Map form_type to readable tense/mood
function mapFormType(formType: string | null): { tense: string | null; mood: string | null; aspect: string | null } {
  if (!formType) return { tense: null, mood: null, aspect: null };
  
  const lower = formType.toLowerCase();
  
  // Check mood first
  if (lower.includes('imperative')) {
    return { tense: null, mood: 'imperative', aspect: 'perfective' };
  }
  if (lower.includes('subjunctive')) {
    return { tense: null, mood: 'subjunctive', aspect: 'perfective' };
  }
  if (lower.includes('ability') || lower.includes('potential')) {
    return { tense: null, mood: 'ability', aspect: null };
  }
  
  // Check tense
  if (lower.includes('present')) {
    return { tense: 'present', mood: 'indicative', aspect: 'imperfective' };
  }
  if (lower.includes('past') && !lower.includes('participle')) {
    return { tense: 'past', mood: 'indicative', aspect: 'perfective' };
  }
  if (lower.includes('perfect') || lower.includes('participle')) {
    return { tense: 'perfect', mood: 'indicative', aspect: 'perfective' };
  }
  if (lower.includes('future')) {
    return { tense: 'future', mood: 'indicative', aspect: 'imperfective' };
  }
  
  return { tense: null, mood: null, aspect: null };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const word = url.searchParams.get('word');
  const context = url.searchParams.get('context') || '';
  
  if (!word) {
    return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
  }
  
  // Clean the word
  const cleanWord = word.replace(/[،.؟!؛:«»\-]/g, '').trim();
  
  if (cleanWord.length < 1) {
    return NextResponse.json({ error: 'Word too short' }, { status: 400 });
  }
  
  try {
    const result: WordAnalysisResult = {
      word: cleanWord,
      pos: null,
      baseForm: null,
      romanized: null,
      english: null,
      gender: null,
      inflectionPattern: null,
      inflectionState: null,
      inflectionReason: null,
      person: null,
      number: null,
      tense: null,
      aspect: null,
      mood: null,
      isCompound: false,
      compoundType: null,
      auxiliaryVerb: null,
      confidence: 0.5,
      source: 'inferred',
    };
    
    // 0. Check if it's a mini-pronoun (clitic) - these are very common in Pashto
    if (PASHTO_CLITICS[cleanWord]) {
      const clitic = PASHTO_CLITICS[cleanWord];
      result.pos = 'pronoun';
      result.isClitic = true;
      result.cliticType = clitic.type;
      result.person = clitic.person;
      result.number = clitic.number;
      result.english = clitic.meaning;
      result.cliticNotes = clitic.notes;
      result.confidence = 0.95;
      result.source = 'clitic_table';
      
      // Find possible referents in context
      if (context) {
        result.possibleReferents = findPronounReferent(cleanWord, context);
      }
      
      // Special handling for یې which can be ambiguous
      if (cleanWord === 'یې' || cleanWord === 'یی') {
        result.cliticNotes = '⚠️ Ambiguous: Can be 3rd person singular (he/she/it) OR plural (they). Check nearby nouns for referent.';
        
        // If we found multiple referents, note the ambiguity
        if (result.possibleReferents && result.possibleReferents.length > 1) {
          result.cliticNotes += ` Possible referents: ${result.possibleReferents.join(', ')}`;
        }
      }
      
      return NextResponse.json(result);
    }
    
    // Check if it's a regular pronoun
    if (PASHTO_PRONOUNS[cleanWord]) {
      const pronoun = PASHTO_PRONOUNS[cleanWord];
      result.pos = 'pronoun';
      result.person = pronoun.person;
      result.number = pronoun.number;
      result.grammaticalCase = pronoun.case;
      result.gender = pronoun.gender || null;
      result.english = pronoun.meaning;
      result.confidence = 0.95;
      result.source = 'pronoun_table';
      
      return NextResponse.json(result);
    }
    
    // 1. Check word_frequencies for basic info
    try {
      const wfResponse = await fetch(
        `${WORKER_URL}/api/word-frequency?word=${encodeURIComponent(cleanWord)}`
      );
      
      if (wfResponse.ok) {
        const wfData = await wfResponse.json();
        if (wfData && wfData.pashto_word) {
          result.pos = wfData.pos?.toLowerCase().includes('verb') ? 'verb' :
                       wfData.pos?.toLowerCase().includes('n.') || wfData.pos?.toLowerCase().includes('noun') ? 'noun' :
                       wfData.pos?.toLowerCase().includes('adj') ? 'adjective' :
                       wfData.pos?.toLowerCase().includes('adv') ? 'adverb' :
                       wfData.pos?.toLowerCase().includes('pron') ? 'pronoun' :
                       wfData.pos?.toLowerCase().includes('prep') ? 'preposition' :
                       'other';
          result.baseForm = wfData.base_form || wfData.pashto_word;
          result.romanized = wfData.romanization;
          result.english = wfData.english_translation;
          result.confidence = 0.9;
          result.source = 'word_frequencies';
          
          // Check gender
          if (wfData.pos?.includes('f.') || wfData.pos?.includes('fem')) {
            result.gender = 'feminine';
          } else if (wfData.pos?.includes('m.') || wfData.pos?.includes('masc')) {
            result.gender = 'masculine';
          }
        }
      }
    } catch (e) {
      console.warn('word_frequencies lookup failed:', e);
    }
    
    // 2. Check verb_forms for verb conjugation info
    if (!result.pos || result.pos === 'verb' || result.pos === 'other') {
      try {
        const vfResponse = await fetch(
          `${WORKER_URL}/api/form-to-verb?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (vfResponse.ok) {
          const vfData = await vfResponse.json();
          if (vfData && vfData.base_verb) {
            result.pos = 'verb';
            result.baseForm = vfData.base_verb;
            
            // Map form_type to readable tense/mood/aspect
            const formTypeInfo = mapFormType(vfData.tense || vfData.form_type);
            result.tense = vfData.tense || formTypeInfo.tense;
            result.aspect = vfData.aspect || formTypeInfo.aspect;
            result.mood = vfData.mood || formTypeInfo.mood;
            
            // Person/number
            const personInfo = mapPerson(vfData.person);
            result.person = personInfo.person;
            result.number = personInfo.number;
            
            // High confidence if we got data from verb_forms
            result.confidence = 0.95;
            result.source = 'verb_forms';
            
            // Check for compound verb
            if (vfData.helper || vfData.base_verb?.includes(' ')) {
              result.isCompound = true;
              result.auxiliaryVerb = vfData.helper || 'کول';
              // Dynamic if the noun inflects, stative if it doesn't
              result.compoundType = vfData.compound_type || 'dynamic';
            }
            
            result.confidence = vfData.confidence || 0.85;
            result.source = 'verb_forms';
          }
        }
      } catch (e) {
        console.warn('verb_forms lookup failed:', e);
      }
    }
    
    // 3. Check inflections table for noun inflection info
    if (result.pos === 'noun' || result.pos === 'other') {
      try {
        const infResponse = await fetch(
          `${WORKER_URL}/api/form-to-base?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (infResponse.ok) {
          const infData = await infResponse.json();
          if (infData && infData.base_word) {
            result.pos = 'noun';
            result.baseForm = infData.base_word;
            result.inflectionState = detectInflectionState(cleanWord, infData.base_word);
            
            // Parse grammatical_info if available
            if (infData.grammatical_info) {
              const gi = typeof infData.grammatical_info === 'string' 
                ? JSON.parse(infData.grammatical_info) 
                : infData.grammatical_info;
              
              if (gi.gender) result.gender = gi.gender;
              if (gi.pattern) {
                const patternKey = gi.pattern as keyof typeof INFLECTION_PATTERNS;
                result.inflectionPattern = INFLECTION_PATTERNS[patternKey] || gi.pattern;
              }
            }
            
            result.confidence = 0.8;
            result.source = 'inflections';
          }
        }
      } catch (e) {
        console.warn('inflections lookup failed:', e);
      }
    }
    
    // 4. Check inflection_reasons for context-aware analysis
    if (context && result.pos === 'noun') {
      try {
        const irResponse = await fetch(
          `${WORKER_URL}/api/inflection-reasons?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (irResponse.ok) {
          const irData = await irResponse.json();
          if (irData && irData.reasons && irData.reasons.length > 0) {
            const reason = irData.reasons[0];
            result.inflectionReason = {
              isPlural: reason.reasons?.plural > 0,
              isInSandwich: reason.reasons?.sandwich > 0,
              sandwichType: reason.reasons?.sandwich_types?.[0] || null,
              isErgative: reason.reasons?.transitive_past > 0,
            };
            result.source = 'inflection_reasons';
          }
        }
      } catch (e) {
        console.warn('inflection_reasons lookup failed:', e);
      }
    }
    
    // 5. If no inflection reason found, try to detect from context
    if (context && result.pos === 'noun' && !result.inflectionReason) {
      const sandwichInfo = detectSandwich(cleanWord, context);
      const isErgative = detectErgative(cleanWord, context);
      const isPlural = cleanWord.endsWith('ان') || cleanWord.endsWith('ونه') || cleanWord.endsWith('یان');
      
      if (sandwichInfo.isInSandwich || isErgative || isPlural) {
        result.inflectionReason = {
          isPlural,
          isInSandwich: sandwichInfo.isInSandwich,
          sandwichType: sandwichInfo.sandwichType,
          isErgative,
        };
        result.confidence = Math.min(result.confidence, 0.6);
      }
    }
    
    // 6. Check if this word + next word form a compound verb
    // This is important for stative compounds like پاتې شم (to stay), تېر کړم (to pass)
    if (context && (result.pos === 'adjective' || COMPOUND_VERB_COMPLEMENTS[cleanWord])) {
      const words = context.split(/\s+/);
      const wordIndex = words.findIndex(w => w === cleanWord || w.includes(cleanWord));
      
      if (wordIndex !== -1 && wordIndex < words.length - 1) {
        const nextWord = words[wordIndex + 1].replace(/[،.؟!؛:«»\-]/g, '');
        
        const compoundInfo = detectCompoundVerb(cleanWord, nextWord);
        if (compoundInfo && compoundInfo.isCompound) {
          result.compoundVerbInfo = {
            fullForm: `${cleanWord} ${nextWord}`,
            infinitive: compoundInfo.infinitive || '',
            meaning: compoundInfo.meaning || '',
            transitivity: compoundInfo.transitivity || 'intransitive',
            person: compoundInfo.person || '',
            number: compoundInfo.number || '',
            tense: compoundInfo.tense || '',
            note: `This is the ${compoundInfo.person} ${compoundInfo.number} ${compoundInfo.tense} of the ${compoundInfo.transitivity} compound verb ${compoundInfo.infinitive}`,
          };
          
          // Also update isCompound flag
          result.isCompound = true;
          result.compoundType = 'stative';
          result.auxiliaryVerb = compoundInfo.transitivity === 'transitive' ? 'کول' : 'کېدل';
        }
      }
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Word analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze word', details: error.message },
      { status: 500 }
    );
  }
}

