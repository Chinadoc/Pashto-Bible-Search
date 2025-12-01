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

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;

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
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Word analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze word', details: error.message },
      { status: 500 }
    );
  }
}

