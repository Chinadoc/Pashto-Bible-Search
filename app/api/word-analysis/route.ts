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
// Based on https://grammar.lingdocs.com/sandwiches/sandwiches/
const SANDWICH_PATTERNS = [
  // په sandwiches
  { start: 'په', end: 'کې', type: 'په...کې', meaning: 'in' },
  { start: 'په', end: 'کی', type: 'په...کی', meaning: 'in' }, // Variant spelling
  { start: 'په', end: 'باندې', type: 'په...باندې', meaning: 'on' },
  { start: 'په', end: 'سره', type: 'په...سره', meaning: 'with' },
  { start: 'په', end: 'هکله', type: 'په...هکله', meaning: 'about/concerning' },
  { start: 'په', end: 'وخت', type: 'په...وخت', meaning: 'at the time of' },
  { start: 'په', end: 'ځای', type: 'په...ځای', meaning: 'instead of' },
  { start: 'په', end: 'لاس', type: 'په...لاس', meaning: 'by hand/through' },
  
  // له sandwiches
  { start: 'له', end: 'سره', type: 'له...سره', meaning: 'with' },
  { start: 'له', end: 'نه', type: 'له...نه', meaning: 'from' },
  { start: 'له', end: 'څخه', type: 'له...څخه', meaning: 'from' },
  { start: 'له', end: 'پرته', type: 'له...پرته', meaning: 'without/except' },
  { start: 'له', end: 'وروسته', type: 'له...وروسته', meaning: 'after' },
  { start: 'له', end: 'مخکې', type: 'له...مخکې', meaning: 'before' },
  { start: 'له', end: 'پورې', type: 'له...پورې', meaning: 'up to/until' },
  
  // تر sandwiches
  { start: 'تر', end: 'پورې', type: 'تر...پورې', meaning: 'until/up to' },
  { start: 'تر', end: null, type: 'تر', meaning: 'than/until' },
  
  // One-sided sandwiches
  { start: 'د', end: null, type: 'د', meaning: 'of/possessive' },
  { start: null, end: 'ته', type: 'ته', meaning: 'to/toward' },
  { start: null, end: 'باندې', type: 'باندې', meaning: 'on' },
  
  // بې/پرته (without) - triggers 2nd inflection (mayonnaise)
  { start: 'بې', end: null, type: 'بې', meaning: 'without' },
  { start: 'پرته', end: null, type: 'پرته', meaning: 'without/except' },
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

// Dynamic compound verbs (noun + وهل, ورکول, etc.)
// These are different from stative compounds - the noun often inflects
const DYNAMIC_COMPOUND_AUXILIARIES: Record<string, {
  infinitive: string;
  romanized: string;
  meaning: string;
  transitivity: 'transitive' | 'intransitive';
  conjugations: Record<string, { person: string; number: string; tense: string }>;
}> = {
  // ورکول (to give)
  'ورکول': {
    infinitive: 'ورکول',
    romanized: 'warkawúl',
    meaning: 'to give',
    transitivity: 'transitive',
    conjugations: {
      'ورکوم': { person: '1st', number: 'singular', tense: 'present' },
      'ورکوې': { person: '2nd', number: 'singular', tense: 'present' },
      'ورکوي': { person: '3rd', number: 'singular', tense: 'present' },
      'ورکوو': { person: '1st', number: 'plural', tense: 'present' },
      'ورکوئ': { person: '2nd', number: 'plural', tense: 'present' },
      'ورکړم': { person: '1st', number: 'singular', tense: 'subjunctive' },
      'ورکړې': { person: '2nd', number: 'singular', tense: 'subjunctive' },
      'ورکړي': { person: '3rd', number: 'sing/plur', tense: 'subjunctive' },
      'ورکړو': { person: '1st', number: 'plural', tense: 'subjunctive' },
      'ورکړئ': { person: '2nd', number: 'plural', tense: 'subjunctive' },
      'ورکړ': { person: '3rd', number: 'singular', tense: 'past' },
      'ورکړل': { person: '3rd', number: 'plural', tense: 'past' },
    }
  },
  // وهل (to hit) - used in many dynamic compounds
  'وهل': {
    infinitive: 'وهل',
    romanized: 'wahúl',
    meaning: 'to hit/strike',
    transitivity: 'transitive',
    conjugations: {
      'وهم': { person: '1st', number: 'singular', tense: 'present' },
      'وهې': { person: '2nd', number: 'singular', tense: 'present' },
      'وهي': { person: '3rd', number: 'singular', tense: 'present' },
      'وهو': { person: '1st', number: 'plural', tense: 'present' },
      'وهئ': { person: '2nd', number: 'plural', tense: 'present' },
      'ووهم': { person: '1st', number: 'singular', tense: 'subjunctive' },
      'ووهې': { person: '2nd', number: 'singular', tense: 'subjunctive' },
      'ووهي': { person: '3rd', number: 'singular', tense: 'subjunctive' },
    }
  },
  // راتلل (to come)
  'راتلل': {
    infinitive: 'راتلل',
    romanized: 'raatláll',
    meaning: 'to come',
    transitivity: 'intransitive',
    conjugations: {
      'راځم': { person: '1st', number: 'singular', tense: 'present' },
      'راځې': { person: '2nd', number: 'singular', tense: 'present' },
      'راځي': { person: '3rd', number: 'singular', tense: 'present' },
      'راشم': { person: '1st', number: 'singular', tense: 'subjunctive' },
      'راشې': { person: '2nd', number: 'singular', tense: 'subjunctive' },
      'راشي': { person: '3rd', number: 'singular', tense: 'subjunctive' },
    }
  },
};

// Ability/Potential mood forms - کېدای شي, کولای شي
const ABILITY_FORMS: Record<string, {
  baseVerb: string;
  romanized: string;
  meaning: string;
  mood: 'ability';
  transitivity: 'transitive' | 'intransitive';
}> = {
  'کېدای': { baseVerb: 'کېدل', romanized: 'kedáay', meaning: 'can/may become (ability mood)', mood: 'ability', transitivity: 'intransitive' },
  'کولای': { baseVerb: 'کول', romanized: 'kawláay', meaning: 'can/may do (ability mood)', mood: 'ability', transitivity: 'transitive' },
  'تلای': { baseVerb: 'تلل', romanized: 'tláay', meaning: 'can/may go (ability mood)', mood: 'ability', transitivity: 'intransitive' },
  'راتلای': { baseVerb: 'راتلل', romanized: 'raatláay', meaning: 'can/may come (ability mood)', mood: 'ability', transitivity: 'intransitive' },
  'خوړلای': { baseVerb: 'خوړل', romanized: 'khoRláay', meaning: 'can/may eat (ability mood)', mood: 'ability', transitivity: 'transitive' },
  'لیدای': { baseVerb: 'لیدل', romanized: 'leedáay', meaning: 'can/may see (ability mood)', mood: 'ability', transitivity: 'transitive' },
  'ویلای': { baseVerb: 'ویل', romanized: 'wayláay', meaning: 'can/may say (ability mood)', mood: 'ability', transitivity: 'transitive' },
  'اخیستلای': { baseVerb: 'اخیستل', romanized: 'akheestaláay', meaning: 'can/may take (ability mood)', mood: 'ability', transitivity: 'transitive' },
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
// Note: Pashto sandwiches can have words between the marker and the noun!
// e.g., "د هغو مالي مرستو" = "of those financial helps" (د is 3 words before مرستو)
// Returns the FULL sandwich pattern (e.g., "په...کې") not just the start
function detectSandwich(word: string, context: string): { isInSandwich: boolean; sandwichType: string | null; sandwichMeaning: string | null } {
  if (!context) return { isInSandwich: false, sandwichType: null, sandwichMeaning: null };
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word) || w === word);
  
  if (wordIndex === -1) return { isInSandwich: false, sandwichType: null, sandwichMeaning: null };
  
  // First, check for TWO-SIDED sandwiches (higher priority - more specific)
  for (const pattern of SANDWICH_PATTERNS) {
    if (pattern.start && pattern.end) {
      // Look for start before (up to 5 words back) and end after
      const beforeWords = words.slice(Math.max(0, wordIndex - 5), wordIndex);
      const afterWords = words.slice(wordIndex + 1, wordIndex + 6);
      
      const hasStart = beforeWords.some(w => w.replace(/[،.؟!؛:«»\-]/g, '') === pattern.start);
      const hasEnd = afterWords.some(w => w.replace(/[،.؟!؛:«»\-]/g, '') === pattern.end);
      
      if (hasStart && hasEnd) {
        return { isInSandwich: true, sandwichType: pattern.type, sandwichMeaning: pattern.meaning };
      }
    }
  }
  
  // Then check for ONE-SIDED sandwiches
  for (const pattern of SANDWICH_PATTERNS) {
    if (pattern.start && !pattern.end) {
      // Word follows pattern.start (e.g., "د X" or "د ... X")
      // Check up to 5 words before for the start marker
      for (let i = wordIndex - 1; i >= Math.max(0, wordIndex - 5); i--) {
        const prevWord = words[i].replace(/[،.؟!؛:«»\-]/g, '');
        if (prevWord === pattern.start) {
          return { isInSandwich: true, sandwichType: pattern.type, sandwichMeaning: pattern.meaning };
        }
        // Stop if we hit another sandwich starter (nested sandwiches)
        if (SANDWICH_PATTERNS.some(p => p.start === prevWord && p.start !== pattern.start)) {
          break;
        }
      }
    } else if (!pattern.start && pattern.end) {
      // Word precedes pattern.end (e.g., "X ته")
      // Check a few words after
      for (let i = wordIndex + 1; i < Math.min(words.length, wordIndex + 4); i++) {
        const nextWord = words[i].replace(/[،.؟!؛:«»\-]/g, '');
        if (nextWord === pattern.end) {
          return { isInSandwich: true, sandwichType: pattern.type, sandwichMeaning: pattern.meaning };
        }
      }
    }
  }
  
  return { isInSandwich: false, sandwichType: null, sandwichMeaning: null };
}

// Check if adjacent words show inflection agreement
// In Pashto, adjectives MUST agree with nouns in:
// - Inflection state (plain/1st/2nd)
// - Number (singular/plural)
// - Gender (masculine/feminine)
// If a neighboring word is clearly inflected/plural, this word likely is too
function checkAdjacentInflectionAgreement(word: string, context: string): { 
  hasInflectedNeighbor: boolean; 
  neighborInflection: '1st' | '2nd' | null;
  neighborWord: string | null;
  neighborIsPlural: boolean;
} {
  if (!context) return { hasInflectedNeighbor: false, neighborInflection: null, neighborWord: null, neighborIsPlural: false };
  
  const words = context.split(/\s+/).map(w => w.replace(/[،.؟!؛:«»\-]/g, ''));
  const wordIndex = words.findIndex(w => w === word || w.includes(word));
  
  if (wordIndex === -1) return { hasInflectedNeighbor: false, neighborInflection: null, neighborWord: null, neighborIsPlural: false };
  
  // Clear 2nd inflection plural endings (oblique plural)
  const secondInflectionPluralEndings = ['انو', 'یانو', 'ونو'];
  // Clear 1st inflection plural endings (direct plural)  
  const firstInflectionPluralEndings = ['ان', 'یان', 'ونه'];
  // Singular 2nd inflection endings
  const secondInflectionSingularEndings = ['و', 'ي'];
  // Feminine plural (can be 1st or 2nd)
  const femininePluralEndings = ['ې', 'و'];
  
  // Common plural demonstratives/adjectives that indicate plural context
  const pluralIndicatorWords = [
    'هغو', 'دغو', 'کومو', 'ټولو', 'نورو', 'ځینو', 'څو', 'ډېرو', 'کمو', 'زیاتو',
    'هغه', // Can be plural in oblique
    'دا', 'دې', // These (plural forms)
  ];
  
  // Check 2 words before and after (adjectives can be before or after nouns in Pashto)
  const neighborsToCheck = [
    { word: words[wordIndex - 2], distance: 2 },
    { word: words[wordIndex - 1], distance: 1 },
    { word: words[wordIndex + 1], distance: 1 },
    { word: words[wordIndex + 2], distance: 2 },
  ].filter(n => n.word);
  
  // First check for plural indicator words (most reliable)
  for (const { word: neighbor } of neighborsToCheck) {
    if (pluralIndicatorWords.includes(neighbor)) {
      return { hasInflectedNeighbor: true, neighborInflection: '2nd', neighborWord: neighbor, neighborIsPlural: true };
    }
  }
  
  // Then check for clear plural endings
  for (const { word: neighbor } of neighborsToCheck) {
    // 2nd inflection plural (most specific)
    for (const ending of secondInflectionPluralEndings) {
      if (neighbor.endsWith(ending) && neighbor.length > ending.length + 1) {
        return { hasInflectedNeighbor: true, neighborInflection: '2nd', neighborWord: neighbor, neighborIsPlural: true };
      }
    }
  }
  
  for (const { word: neighbor } of neighborsToCheck) {
    // 1st inflection plural
    for (const ending of firstInflectionPluralEndings) {
      if (neighbor.endsWith(ending) && neighbor.length > ending.length + 1) {
        return { hasInflectedNeighbor: true, neighborInflection: '1st', neighborWord: neighbor, neighborIsPlural: true };
      }
    }
  }
  
  // Check for singular 2nd inflection
  for (const { word: neighbor } of neighborsToCheck) {
    for (const ending of secondInflectionSingularEndings) {
      if (neighbor.endsWith(ending) && neighbor.length > ending.length + 1) {
        return { hasInflectedNeighbor: true, neighborInflection: '2nd', neighborWord: neighbor, neighborIsPlural: false };
      }
    }
  }
  
  return { hasInflectedNeighbor: false, neighborInflection: null, neighborWord: null, neighborIsPlural: false };
}

// Verbal nouns (infinitives) - these are NOT past tense verbs!
// They look like "Xل" or "Xلو" but are gerunds/infinitives
// Pattern: any word ending in ل or لو that's not a conjugated verb form
const VERBAL_NOUN_ENDINGS = ['ولو', 'ول', 'دلو', 'دل', 'تلو', 'تل', 'ستلو', 'ستل'];
const VERBAL_NOUN_PATTERNS = [
  // Common infinitives/gerunds
  'کولو', 'کول', 'لیدلو', 'لیدل', 'خوړلو', 'خوړل', 'ویلو', 'ویل',
  'اخیستلو', 'اخیستل', 'راوړلو', 'راوړل', 'لیکلو', 'لیکل',
  'وژلو', 'وژل', 'پېژندلو', 'پېژندل', 'ورکولو', 'ورکول',
  'بڼودلو', 'بڼودل', // showing
  'اورېدلو', 'اورېدل', // hearing
  'کېدلو', 'کېدل', // becoming
  'تللو', 'تلل', // going
  'راتللو', 'راتلل', // coming
  'وړلو', 'وړل', // taking
  'اخیستلو', 'اخیستل', // taking
  'پرېښودلو', 'پرېښودل', // leaving
  'ساتلو', 'ساتل', // keeping
  'غوښتلو', 'غوښتل', // wanting
  'منلو', 'منل', // accepting
  'لوستلو', 'لوستل', // reading
];

// Past tense transitive verbs with و prefix (perfective)
// These are actual past verbs, not verbal nouns
const PAST_TRANSITIVE_VERBS = [
  // کول conjugations (did/made)
  'وکړ', 'وکړه', 'وکړم', 'وکړې', 'وکړو', 'وکړل', 'وکړله', 'وکړلو', 'وکړلې',
  // خوړل conjugations (ate)
  'وخوړ', 'وخوړه', 'وخوړم', 'وخوړې', 'وخوړو', 'وخوړل', 'وخوړله',
  // لیدل conjugations (saw)
  'ولید', 'ولیده', 'ولیدم', 'ولیدې', 'ولیدو', 'ولیدل', 'ولیدله',
  // ویل conjugations (said)
  'وویل', 'وویله', 'وویلم', 'وویلې', 'وویلو', 'وویلل',
  // اخیستل conjugations (took)
  'واخیست', 'واخیسته', 'واخیستم', 'واخیستل',
  // لیکل (wrote)
  'ولیکه', 'ولیکل', 'ولیکله',
  // راوړل (brought)
  'راوړ', 'راوړه', 'راوړل', 'راوړله',
];

// Detect ergative (subject of past transitive) - Fixed version
// Based on https://grammar.lingdocs.com/inflection/inflection-intro/
// IMPORTANT: Verbal nouns like کولو are NOT past tense verbs!
function detectErgative(word: string, context: string): { isErgative: boolean; verb: string | null } {
  if (!context) return { isErgative: false, verb: null };
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word) || w === word);
  
  if (wordIndex === -1) return { isErgative: false, verb: null };
  
  // Look for past tense transitive verb after this word
  for (let i = wordIndex + 1; i < Math.min(wordIndex + 8, words.length); i++) {
    const potentialVerb = words[i].replace(/[،.؟!؛:«»\-]/g, '');
    
    // Skip if this is a verbal noun (infinitive/gerund)
    // Verbal nouns end in ل or لو without the perfective و prefix
    const isVerbalNoun = 
      VERBAL_NOUN_PATTERNS.some(vn => potentialVerb === vn) ||
      VERBAL_NOUN_ENDINGS.some(end => potentialVerb.endsWith(end) && !potentialVerb.startsWith('و'));
    
    if (isVerbalNoun) {
      continue;
    }
    
    // Check for actual past transitive verbs (with و prefix)
    for (const pastVerb of PAST_TRANSITIVE_VERBS) {
      if (potentialVerb === pastVerb || potentialVerb.startsWith(pastVerb)) {
        return { isErgative: true, verb: potentialVerb };
      }
    }
  }
  
  return { isErgative: false, verb: null };
}

// Detect vocative (direct address)
// Based on https://grammar.lingdocs.com/inflection/vocative/
const VOCATIVE_PARTICLES = ['ای', 'او', 'یا'];

function detectVocative(word: string, context: string): boolean {
  if (!context) return false;
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word) || w === word);
  
  if (wordIndex === -1) return false;
  
  // Check if preceded by vocative particle
  if (wordIndex > 0) {
    const prevWord = words[wordIndex - 1].replace(/[،.؟!؛:«»\-]/g, '');
    if (VOCATIVE_PARTICLES.includes(prevWord)) {
      return true;
    }
  }
  
  // Check for vocative at start of direct speech (after ! or at start)
  if (wordIndex === 0 && context.includes('!')) {
    return true;
  }
  
  return false;
}

// Detect mayonnaise/ablative (special 2nd inflection)
// Based on https://grammar.lingdocs.com/inflection/mayonnaise/
// Words that trigger ablative: له (from), تر (than/until), بې (without), پرته (except)
const ABLATIVE_TRIGGERS = ['له', 'تر', 'بې', 'پرته'];

function detectAblative(word: string, context: string): { isAblative: boolean; trigger: string | null } {
  if (!context) return { isAblative: false, trigger: null };
  
  const words = context.split(/\s+/);
  const wordIndex = words.findIndex(w => w.includes(word) || w === word);
  
  if (wordIndex === -1) return { isAblative: false, trigger: null };
  
  // Check if preceded by ablative trigger
  if (wordIndex > 0) {
    const prevWord = words[wordIndex - 1].replace(/[،.؟!؛:«»\-]/g, '');
    if (ABLATIVE_TRIGGERS.includes(prevWord)) {
      return { isAblative: true, trigger: prevWord };
    }
  }
  
  // Also check 2 words back (for "له X نه" pattern)
  if (wordIndex > 1) {
    const prevPrevWord = words[wordIndex - 2].replace(/[،.؟!؛:«»\-]/g, '');
    if (ABLATIVE_TRIGGERS.includes(prevPrevWord)) {
      return { isAblative: true, trigger: prevPrevWord };
    }
  }
  
  return { isAblative: false, trigger: null };
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
    
    // 0.5 Check if it's an ABILITY MOOD form (کېدای, کولای, etc.)
    if (ABILITY_FORMS[cleanWord]) {
      const abilityForm = ABILITY_FORMS[cleanWord];
      result.pos = 'verb';
      result.baseForm = abilityForm.baseVerb;
      result.romanized = abilityForm.romanized;
      result.english = abilityForm.meaning;
      result.mood = 'ability';
      result.tense = null; // Ability mood doesn't have tense on its own
      result.confidence = 0.95;
      result.source = 'ability_forms';
      
      // Check if next word in context is شي/شو/شم (to complete the ability construction)
      if (context) {
        const words = context.split(/\s+/);
        const wordIndex = words.findIndex(w => w.includes(cleanWord));
        if (wordIndex >= 0 && wordIndex < words.length - 1) {
          const nextWord = words[wordIndex + 1]?.replace(/[،.؟!]/g, '');
          const kedulConj = KEDUL_CONJUGATIONS[nextWord];
          if (kedulConj) {
            result.compoundVerbInfo = {
              fullForm: `${cleanWord} ${nextWord}`,
              infinitive: `${abilityForm.baseVerb} (ability)`,
              meaning: abilityForm.meaning,
              transitivity: abilityForm.transitivity,
              person: kedulConj.person,
              number: kedulConj.number,
              tense: 'ability + ' + kedulConj.tense,
              note: `Ability construction: ${cleanWord} ${nextWord} = "${abilityForm.meaning}"`,
            };
          }
        }
      }
      
      return NextResponse.json(result);
    }
    
    // 0.6 Check if it's a کېدل (kedul) auxiliary form
    if (KEDUL_CONJUGATIONS[cleanWord]) {
      const kedulForm = KEDUL_CONJUGATIONS[cleanWord];
      result.pos = 'verb';
      result.baseForm = 'کېدل';
      result.romanized = 'kedúl';
      result.english = 'to become';
      result.person = kedulForm.person;
      result.number = kedulForm.number;
      result.tense = kedulForm.tense;
      result.mood = kedulForm.tense === 'subjunctive' ? 'subjunctive' : 'indicative';
      result.confidence = 0.9;
      result.source = 'kedul_conjugations';
      
      // Note: This might be part of a compound verb - check context
      if (context) {
        const words = context.split(/\s+/);
        const wordIndex = words.findIndex(w => w.replace(/[،.؟!]/g, '') === cleanWord);
        if (wordIndex > 0) {
          const prevWord = words[wordIndex - 1]?.replace(/[،.؟!]/g, '');
          // Check if prev word is an ability form
          if (ABILITY_FORMS[prevWord]) {
            result.isCompound = true;
            result.compoundType = 'stative';
            const abilityInfo = ABILITY_FORMS[prevWord];
            result.compoundVerbInfo = {
              fullForm: `${prevWord} ${cleanWord}`,
              infinitive: `${abilityInfo.baseVerb} (ability mood)`,
              meaning: abilityInfo.meaning,
              transitivity: abilityInfo.transitivity,
              person: kedulForm.person,
              number: kedulForm.number,
              tense: 'ability',
              note: `Complete ability construction: "${abilityInfo.meaning}"`,
            };
          }
          // Check if prev word is a stative complement
          else if (COMPOUND_VERB_COMPLEMENTS[prevWord]) {
            result.isCompound = true;
            result.compoundType = 'stative';
            const compoundInfo = COMPOUND_VERB_COMPLEMENTS[prevWord];
            result.compoundVerbInfo = {
              fullForm: `${prevWord} ${cleanWord}`,
              infinitive: compoundInfo.intransitiveInfinitive,
              meaning: compoundInfo.meaning,
              transitivity: 'intransitive',
              person: kedulForm.person,
              number: kedulForm.number,
              tense: kedulForm.tense,
              note: `Stative compound verb (intransitive)`,
            };
          }
        }
      }
      
      return NextResponse.json(result);
    }
    
    // 0.7 Check if it's a کول (kawul) auxiliary form
    if (KAWUL_CONJUGATIONS[cleanWord]) {
      const kawulForm = KAWUL_CONJUGATIONS[cleanWord];
      result.pos = 'verb';
      result.baseForm = 'کول';
      result.romanized = 'kawúl';
      result.english = 'to do/make';
      result.person = kawulForm.person;
      result.number = kawulForm.number;
      result.tense = kawulForm.tense;
      result.mood = kawulForm.tense === 'subjunctive' ? 'subjunctive' : 'indicative';
      result.confidence = 0.9;
      result.source = 'kawul_conjugations';
      
      // Check context for compound verb
      if (context) {
        const words = context.split(/\s+/);
        const wordIndex = words.findIndex(w => w.replace(/[،.؟!]/g, '') === cleanWord);
        if (wordIndex > 0) {
          const prevWord = words[wordIndex - 1]?.replace(/[،.؟!]/g, '');
          if (COMPOUND_VERB_COMPLEMENTS[prevWord]) {
            result.isCompound = true;
            result.compoundType = 'stative';
            const compoundInfo = COMPOUND_VERB_COMPLEMENTS[prevWord];
            result.compoundVerbInfo = {
              fullForm: `${prevWord} ${cleanWord}`,
              infinitive: compoundInfo.transitiveInfinitive,
              meaning: compoundInfo.meaning,
              transitivity: 'transitive',
              person: kawulForm.person,
              number: kawulForm.number,
              tense: kawulForm.tense,
              note: `Stative compound verb (transitive)`,
            };
          }
        }
      }
      
      return NextResponse.json(result);
    }
    
    // 0.8 Check for dynamic compound auxiliary forms (ورکړي, وهي, etc.)
    for (const [verb, info] of Object.entries(DYNAMIC_COMPOUND_AUXILIARIES)) {
      if (info.conjugations[cleanWord]) {
        const conjInfo = info.conjugations[cleanWord];
        result.pos = 'verb';
        result.baseForm = verb;
        result.romanized = info.romanized;
        result.english = info.meaning;
        result.person = conjInfo.person;
        result.number = conjInfo.number;
        result.tense = conjInfo.tense;
        result.mood = conjInfo.tense === 'subjunctive' ? 'subjunctive' : 'indicative';
        result.confidence = 0.95;
        result.source = 'dynamic_compound_aux';
        
        // Check context for full compound verb (e.g., "دوام ورکړي" = to continue)
        if (context) {
          const words = context.split(/\s+/);
          const wordIndex = words.findIndex(w => w.replace(/[،.؟!]/g, '') === cleanWord);
          if (wordIndex > 0) {
            const prevWord = words[wordIndex - 1]?.replace(/[،.؟!]/g, '');
            // Common dynamic compound noun complements
            const dynamicComplements: Record<string, string> = {
              'دوام': 'to continue',
              'مرسته': 'to help',
              'قدم': 'to step',
              'ټوپ': 'to jump',
              'کار': 'to work',
              'غږ': 'to call',
              'خبرې': 'to talk',
              'فکر': 'to think',
            };
            if (dynamicComplements[prevWord]) {
              result.isCompound = true;
              result.compoundType = 'dynamic';
              result.compoundVerbInfo = {
                fullForm: `${prevWord} ${cleanWord}`,
                infinitive: `${prevWord} ${verb}`,
                meaning: dynamicComplements[prevWord],
                transitivity: info.transitivity,
                person: conjInfo.person,
                number: conjInfo.number,
                tense: conjInfo.tense,
                note: `Dynamic compound verb: "${prevWord} ${verb}"`,
              };
            }
          }
        }
        
        return NextResponse.json(result);
      }
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
    
    // 1.5 If no result yet, try dictionary search for expanded lookups
    if (!result.english && !result.baseForm) {
      try {
        const dictResponse = await fetch(
          `${WORKER_URL}/api/dictionary/search?q=${encodeURIComponent(cleanWord)}&limit=5`
        );
        
        if (dictResponse.ok) {
          const dictData = await dictResponse.json();
          if (dictData.entries && dictData.entries.length > 0) {
            // Find exact match or closest match
            const exactMatch = dictData.entries.find((e: any) => e.pashto === cleanWord);
            const entry = exactMatch || dictData.entries[0];
            
            if (entry) {
              result.baseForm = entry.pashto;
              result.romanized = entry.romanization;
              result.english = entry.english;
              result.pos = entry.pos?.toLowerCase().includes('verb') ? 'verb' :
                           entry.pos?.toLowerCase().includes('n.') || entry.pos?.toLowerCase().includes('noun') ? 'noun' :
                           entry.pos?.toLowerCase().includes('adj') ? 'adjective' :
                           entry.pos?.toLowerCase().includes('adv') ? 'adverb' :
                           'other';
              result.confidence = exactMatch ? 0.95 : 0.7;
              result.source = 'dictionary';
              
              // Check gender from pos
              if (entry.pos?.includes('f.') || entry.pos?.includes('fem')) {
                result.gender = 'feminine';
              } else if (entry.pos?.includes('m.') || entry.pos?.includes('masc')) {
                result.gender = 'masculine';
              }
            }
          }
        }
      } catch (e) {
        console.warn('dictionary search failed:', e);
      }
    }
    
    // 1.7 Check lingdocs_forms for REVERSE LOOKUP (inflected form → base)
    // This is crucial for nouns like مرستې → مرسته
    if (!result.baseForm || result.baseForm === cleanWord) {
      try {
        const formToBaseResponse = await fetch(
          `${WORKER_URL}/api/form-to-base?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (formToBaseResponse.ok) {
          const formData = await formToBaseResponse.json();
          if (formData?.found && formData.base_word) {
            // We found this is an inflected form!
            result.baseForm = formData.base_word;
            
            // Get inflection details
            const gramInfo = formData.grammatical_info;
            if (gramInfo) {
              // Set POS from dictionary
              if (gramInfo.pos) {
                result.pos = gramInfo.pos.includes('n.') ? 'noun' :
                            gramInfo.pos.includes('adj') ? 'adjective' :
                            gramInfo.pos.includes('v.') ? 'verb' :
                            result.pos || 'other';
              }
              
              // Get English definition
              if (gramInfo.english) {
                result.english = gramInfo.english;
              }
              
              // Get romanization
              if (gramInfo.phonetics || formData.phonetics) {
                result.romanized = gramInfo.phonetics || formData.phonetics;
              }
              
              // Determine inflection state from form_type
              const formType = gramInfo.form_type || '';
              if (formType.includes('2nd') || formType.includes('oblique')) {
                result.inflectionState = '2nd';
              } else if (formType.includes('1st') || formType.includes('plural')) {
                result.inflectionState = '1st';
              } else if (formType.includes('vocative')) {
                result.inflectionState = '1st'; // Vocative uses 1st inflection form
              }
              
              // Determine gender
              if (formType.includes('_f') || formType.includes('fem') || gramInfo.pos?.includes('f.')) {
                result.gender = 'feminine';
              } else if (formType.includes('_m') || formType.includes('masc') || gramInfo.pos?.includes('m.')) {
                result.gender = 'masculine';
              }
              
              // Store the form type for display
              result.inflectionPattern = formType;
            }
            
            result.confidence = 0.95;
            result.source = 'lingdocs_forms';
          }
        }
      } catch (e) {
        console.warn('form-to-base lookup failed:', e);
      }
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
    // BUT ONLY if we didn't already identify it as a verb!
    if ((result.pos === 'noun' || result.pos === 'other' || !result.pos) && result.source !== 'verb_forms') {
      try {
        const infResponse = await fetch(
          `${WORKER_URL}/api/form-to-base?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (infResponse.ok) {
          const infData = await infResponse.json();
          // Only use noun data if we don't already have verb data
          if (infData && infData.base_word && result.pos !== 'verb') {
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
    // SKIP if we already have good data from lingdocs_forms (which is more accurate)
    if (context && result.pos === 'noun' && result.source !== 'lingdocs_forms') {
      try {
        const irResponse = await fetch(
          `${WORKER_URL}/api/inflection-reasons?form=${encodeURIComponent(cleanWord)}`
        );
        
        if (irResponse.ok) {
          const irData = await irResponse.json();
          if (irData && irData.reasons && irData.reasons.length > 0) {
            const reason = irData.reasons[0];
            // Only use this if it seems reasonable (not just ergative with nothing else)
            const hasPlural = reason.reasons?.plural > 0;
            const hasSandwich = reason.reasons?.sandwich > 0;
            const hasErgative = reason.reasons?.transitive_past > 0;
            
            // If only ergative is set with no sandwich/plural, likely incorrect
            // Skip this data and let context detection handle it
            if (!(hasErgative && !hasPlural && !hasSandwich)) {
              result.inflectionReason = {
                isPlural: hasPlural,
                isInSandwich: hasSandwich,
                sandwichType: reason.reasons?.sandwich_types?.[0] || null,
                isErgative: hasErgative,
              };
              result.source = 'inflection_reasons';
            }
          }
        }
      } catch (e) {
        console.warn('inflection_reasons lookup failed:', e);
      }
    }
    
    // 5. Detect inflection reason from context
    // Run this even if we have lingdocs_forms data (to get sandwich/plural info)
    if (context && result.pos === 'noun') {
      const sandwichInfo = detectSandwich(cleanWord, context);
      const ergativeInfo = detectErgative(cleanWord, context);
      const vocativeDetected = detectVocative(cleanWord, context);
      const ablativeInfo = detectAblative(cleanWord, context);
      
      // Better plural detection:
      // - Direct plural: ان (animate), ونه (inanimate), یان (animate with ی)
      // - Oblique plural (2nd inflection): انو, ونو, یانو, و (fem plural)
      const directPluralEndings = ['ان', 'ونه', 'یان', 'ې']; // ې can be fem plural or 1st infl
      const obliquePluralEndings = ['انو', 'ونو', 'یانو', 'و']; // و is fem 2nd inflection plural
      
      let isPlural = directPluralEndings.some(e => cleanWord.endsWith(e)) ||
                     obliquePluralEndings.some(e => cleanWord.endsWith(e));
      
      // Additional check: if word ends in و and is in a sandwich, likely 2nd inflection plural
      if (cleanWord.endsWith('و') && sandwichInfo.isInSandwich) {
        isPlural = true; // Highly likely plural in 2nd inflection
      }
      
      // Agreement check: if adjacent word is clearly inflected/plural, this word should match
      // In Pashto, adjectives and nouns MUST agree in inflection state AND number
      const agreementInfo = checkAdjacentInflectionAgreement(cleanWord, context);
      
      // If neighbor is plural, this word should also be plural
      // This is critical for words like "مالي" next to "هغو" (those) or "مرستو" (helps)
      if (agreementInfo.neighborIsPlural && !isPlural) {
        // Word ends in potential plural/oblique endings
        if (cleanWord.endsWith('و') || cleanWord.endsWith('ي') || cleanWord.endsWith('ې')) {
          isPlural = true;
        }
      }
      
      // If neighbor is 2nd inflection, this word should also be in sandwich context
      if (agreementInfo.hasInflectedNeighbor && agreementInfo.neighborInflection === '2nd') {
        // If this word could be inflected but we missed the sandwich
        if ((cleanWord.endsWith('و') || cleanWord.endsWith('ي') || cleanWord.endsWith('ې')) && !sandwichInfo.isInSandwich) {
          // Even without finding the sandwich, adjacent agreement suggests inflection
          // The sandwich marker might be far away but affects this whole phrase
        }
      }
      
      // Determine if word is in a sandwich (including ablative triggers)
      const isInSandwich = sandwichInfo.isInSandwich || ablativeInfo.isAblative;
      const sandwichType = sandwichInfo.sandwichType || (ablativeInfo.isAblative ? ablativeInfo.trigger : null);
      const sandwichMeaning = sandwichInfo.sandwichMeaning || (ablativeInfo.isAblative ? 'without' : null);
      
      if (isInSandwich || ergativeInfo.isErgative || isPlural || vocativeDetected) {
        result.inflectionReason = {
          isPlural,
          isInSandwich,
          sandwichType,
          sandwichMeaning, // e.g., "in", "of", "about"
          isErgative: ergativeInfo.isErgative,
          // Extended info for display
          ergativeVerb: ergativeInfo.verb,
          isVocative: vocativeDetected,
          isAblative: ablativeInfo.isAblative,
          ablativeTrigger: ablativeInfo.trigger,
          // Agreement info for debugging/display
          agreedWithNeighbor: agreementInfo.hasInflectedNeighbor ? agreementInfo.neighborWord : null,
        } as any; // Extended type
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

