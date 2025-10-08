// Enhanced Pashto Word Disambiguation System
// Combines Bible context analysis with LingDocs morphological data

import type { DisambiguationCandidate, DisambiguationContext } from './simple_disambiguation';

export interface EnhancedDisambiguationRule {
  word: string;
  likelyPos: 'noun' | 'verb' | 'adjective';
  confidence: number;
  bibleContext: string;
  lingdocsPos: string;
  contextClues: {
    verbIndicators?: string[];
    adjectiveIndicators?: string[];
    nounIndicators?: string[];
    religiousTerms?: string[];
    [key: string]: string[] | undefined;
  };
  relatedForms: string[];
  sampleBibleContexts: string[];
  disambiguationStrategy: string;
}

// Enhanced disambiguation rules combining Bible + LingDocs analysis
const ENHANCED_DISAMBIGUATION_RULES: Record<string, EnhancedDisambiguationRule> = {
  'بوځو': {
    word: 'بوځو',
    likelyPos: 'verb',
    confidence: 0.65,
    bibleContext: 'religious',
    lingdocsPos: 'verb',
    contextClues: {
      verbIndicators: ['راوړو', 'چې', 'به', 'کول'],
      adjectiveIndicators: ['خدا', 'شو', 'وو', 'غوسه'],
      religiousTerms: ['خدا', 'پیغمبر', 'ایمان']
    },
    relatedForms: ['بوځ', 'بوځې', 'بوځي'],
    sampleBibleContexts: ['بوځو چې راوړو', 'خدا بوځو شو'],
    disambiguationStrategy: 'religious_context_priority'
  },

  'پنډ': {
    word: 'پنډ',
    likelyPos: 'noun',
    confidence: 0.75,
    bibleContext: 'religious',
    lingdocsPos: 'noun',
    contextClues: {
      nounIndicators: ['ته', 'پنډ', 'ځای', 'کې'],
      religiousTerms: ['خدا', 'پیغمبر']
    },
    relatedForms: ['پنډه', 'پنډې'],
    sampleBibleContexts: ['پنډ ته لاړ', 'پنډ ځای'],
    disambiguationStrategy: 'location_context_priority'
  },

  'کوټه': {
    word: 'کوټه',
    likelyPos: 'noun',
    confidence: 0.78,
    bibleContext: 'religious',
    lingdocsPos: 'noun',
    contextClues: {
      nounIndicators: ['کې', 'ته', 'څخه', 'پورې'],
      religiousTerms: ['خدا', 'عیسی']
    },
    relatedForms: ['کوټې', 'کوټو'],
    sampleBibleContexts: ['کوټه کې ناست', 'کوټه کور'],
    disambiguationStrategy: 'possessive_context_priority'
  },

  'توری': {
    word: 'توری',
    likelyPos: 'noun',
    confidence: 0.72,
    bibleContext: 'religious',
    lingdocsPos: 'noun',
    contextClues: {
      nounIndicators: ['یې', 'خپل', 'وسله', 'کې'],
      religiousTerms: ['خدا', 'پیغمبر']
    },
    relatedForms: ['تورې', 'تورو'],
    sampleBibleContexts: ['توری یې واخیست', 'توری وسله'],
    disambiguationStrategy: 'possessive_context_priority'
  },

  'دوست': {
    word: 'دوست',
    likelyPos: 'noun',
    confidence: 0.85,
    bibleContext: 'religious',
    lingdocsPos: 'noun',
    contextClues: {
      nounIndicators: ['خپل', 'ملګري', 'ورور', 'سره'],
      religiousTerms: ['خدا', 'عیسی', 'پیغمبر']
    },
    relatedForms: ['دوستان', 'دوستانه', 'دوستي'],
    sampleBibleContexts: ['خپل دوست سره', 'دوست ملګري'],
    disambiguationStrategy: 'relationship_context_priority'
  },

  'مار': {
    word: 'مار',
    likelyPos: 'noun',
    confidence: 0.90,
    bibleContext: 'religious',
    lingdocsPos: 'noun',
    contextClues: {
      nounIndicators: ['مار', 'حیوان', 'ژوي'],
      religiousTerms: ['خدا', 'شیطان']
    },
    relatedForms: ['ماران', 'مارې'],
    sampleBibleContexts: ['مار ولید', 'مار حیوان'],
    disambiguationStrategy: 'animal_context_priority'
  }
};

export function enhancedDisambiguate(
  word: string,
  context?: string,
  bibleContext?: string
): EnhancedDisambiguationRule | null {
  const rule = ENHANCED_DISAMBIGUATION_RULES[word];
  if (!rule) {
    return null;
  }

  // If no context provided, return the rule as-is
  if (!context) {
    return rule;
  }

  // Analyze context using word-specific clues
  const contextLower = context.toLowerCase();
  const clues = rule.contextClues;

  // Check for verb indicators
  const hasVerbClues = clues.verbIndicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Check for adjective indicators
  const hasAdjectiveClues = clues.adjectiveIndicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Check for noun indicators
  const hasNounClues = clues.nounIndicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Check for religious context (Bible-specific)
  const hasReligiousContext = bibleContext === 'religious' ||
    clues.religiousTerms?.some(term => contextLower.includes(term)) || false;

  // Adjust confidence based on context match
  let adjustedConfidence = rule.confidence;

  // Apply Bible context boost
  if (bibleContext === rule.bibleContext) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.15, 0.95);
  }

  // Apply specific context boosts
  if (rule.likelyPos === 'verb' && hasVerbClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.2, 0.95);
  } else if (rule.likelyPos === 'noun' && hasNounClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.2, 0.95);
  } else if (rule.likelyPos === 'adjective' && hasAdjectiveClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.2, 0.95);
  }

  // Apply religious context boost for Bible searches
  if (hasReligiousContext && rule.bibleContext === 'religious') {
    adjustedConfidence = Math.min(adjustedConfidence + 0.1, 0.95);
  }

  return {
    ...rule,
    confidence: adjustedConfidence
  };
}

export function getEnhancedDisambiguationRules(): Record<string, EnhancedDisambiguationRule> {
  return { ...ENHANCED_DISAMBIGUATION_RULES };
}

// LingDocs morphological patterns for reference
export const LINGDOCS_PATTERNS = {
  nounPluralPatterns: [
    { singular: 'دوست', plural: 'دوستان', pattern: 'ان' },
    { singular: 'مار', plural: 'ماران', pattern: 'ان' },
    { singular: 'کار', plural: 'کاران', pattern: 'ان' },
    { singular: 'کوټه', plural: 'کوټې', pattern: 'ې' }
  ],

  adjectivePatterns: [
    { base: 'واکمن', feminine: 'واکمنه', pattern: 'ه' },
    { base: 'لوی', feminine: 'لويه', pattern: 'ه' },
    { base: 'کوچنی', feminine: 'کوچنۍ', pattern: 'ۍ' }
  ],

  verbConjugationPatterns: [
    { base: 'بوځ', conjugated: 'بوځو', type: 'subjunctive' },
    { base: 'کار', conjugated: 'کارو', type: 'imperative' }
  ]
};

// Helper function for search integration with Bible context
export function disambiguateWithBibleContext(
  term: string,
  sentence?: string,
  bibleContext?: string
): {
  originalTerm: string;
  likelyMeaning: EnhancedDisambiguationRule | null;
  allPossibleMeanings: EnhancedDisambiguationRule[];
  bibleContextUsed: string;
} {
  const rule = enhancedDisambiguate(term, sentence, bibleContext);

  return {
    originalTerm: term,
    likelyMeaning: rule,
    allPossibleMeanings: rule ? [rule] : [],
    bibleContextUsed: bibleContext || 'neutral'
  };
}
