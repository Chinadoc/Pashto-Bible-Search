// Simple Pashto Word Disambiguation System
// Based on context analysis of 25 sample sentences per ambiguous word

export interface SimpleDisambiguationRule {
  word: string;
  likelyPos: 'noun' | 'verb' | 'adjective';
  confidence: number;
  contextClues: string[];
  sampleContexts: string[];
}

// Context clues for disambiguation based on analysis
const CONTEXT_CLUES = {
  // بوځو-specific context clues
  'بوځو': {
    verb_indicators: ['راوړو', 'چې', 'به'],  // "bring", subjunctive markers
    adjective_indicators: ['خدا', 'شو', 'وو'],  // "God", "became"
  },

  // پنډ-specific context clues
  'پنډ': {
    noun_indicators: ['ته', 'پنډ', 'ځای'],  // case markers, location words
    adjective_indicators: ['پنډ', 'ډول']  // threshing floor descriptors
  },

  // کوټه-specific context clues
  'کوټه': {
    noun_indicators: ['کې', 'ته', 'څخه'],  // locative case markers
    adjective_indicators: ['کوټه', 'کوټې']  // room-like descriptors
  },

  // توری-specific context clues
  'توری': {
    noun_indicators: ['یې', 'خپل', 'وسله'],  // possessive, weapon words
    adjective_indicators: ['توری', 'تور']  // sword-like descriptors
  }
};

// Disambiguation rules based on Pashto script analysis
// Focus on words that are ACTUALLY ambiguous in Pashto script, not romanization
const DISAMBIGUATION_RULES: Record<string, SimpleDisambiguationRule> = {
  // بوځو - angry (adj) vs to take/bring (verb) - ACTUALLY ambiguous in Pashto script
  'بوځو': {
    word: 'بوځو',
    likelyPos: 'verb',  // More common as verb based on context
    confidence: 0.42,
    contextClues: ['modal_verb_nearby', 'action_context'],
    sampleContexts: [
      'بوځو چې راوړو',  // verb: "that we would bring"
      'خدا بوځو شو'     // adjective: "God became angry"
    ]
  },

  // پنډ - can be noun (threshing floor) or adjective
  'پنډ': {
    word: 'پنډ',
    likelyPos: 'noun',  // More common as noun based on context
    confidence: 0.35,
    contextClues: ['location_context', 'demonstrative_context'],
    sampleContexts: [
      'پنډ ته لاړ',     // noun: "went to the threshing floor"
      'پنډ ځای'        // adjective: "threshing floor place"
    ]
  },

  // کوټه - can be noun (room) or adjective
  'کوټه': {
    word: 'کوټه',
    likelyPos: 'noun',  // More common as noun based on context
    confidence: 0.38,
    contextClues: ['location_context', 'possessive_context'],
    sampleContexts: [
      'کوټه کې ناست',   // noun: "sitting in the room"
      'کوټه کور'       // adjective: "room-like house"
    ]
  },

  // توری - can be noun (sword) or adjective
  'توری': {
    word: 'توری',
    likelyPos: 'noun',  // More common as noun based on context
    confidence: 0.32,
    contextClues: ['weapon_context', 'demonstrative_context'],
    sampleContexts: [
      'توری یې واخیست', // noun: "took his sword"
      'توری وسله'      // adjective: "sword-like weapon"
    ]
  }

  // Note: کار is NOT ambiguous in Pashto script - it's clearly a noun
  // The ambiguity only exists in romanization (kaar vs kaarn)
};

export function simpleDisambiguate(word: string, context?: string): SimpleDisambiguationRule | null {
  // Check if we have a rule for this word
  const rule = DISAMBIGUATION_RULES[word];
  if (!rule) {
    return null;
  }

  // If no context provided, return the rule as-is
  if (!context) {
    return rule;
  }

  // Analyze context using word-specific clues
  const contextLower = context.toLowerCase();
  const wordSpecificClues = CONTEXT_CLUES[word as keyof typeof CONTEXT_CLUES];

  if (!wordSpecificClues) {
    return rule; // No specific clues, return base rule
  }

  // Check for verb indicators specific to this word
  const hasVerbClues = wordSpecificClues.verb_indicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Check for noun indicators specific to this word
  const hasNounClues = wordSpecificClues.noun_indicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Check for adjective indicators specific to this word
  const hasAdjectiveClues = wordSpecificClues.adjective_indicators?.some(indicator =>
    contextLower.includes(indicator)
  ) || false;

  // Adjust confidence based on context match
  let adjustedConfidence = rule.confidence;

  if (rule.likelyPos === 'verb' && hasVerbClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.3, 0.9);
  } else if (rule.likelyPos === 'noun' && hasNounClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.3, 0.9);
  } else if (rule.likelyPos === 'adjective' && hasAdjectiveClues) {
    adjustedConfidence = Math.min(adjustedConfidence + 0.3, 0.9);
  }

  // If strong evidence for a different POS, adjust accordingly
  if (hasNounClues && !hasVerbClues && rule.likelyPos === 'verb') {
    adjustedConfidence = Math.max(0.1, adjustedConfidence - 0.2);
  } else if (hasVerbClues && !hasNounClues && rule.likelyPos === 'noun') {
    adjustedConfidence = Math.max(0.1, adjustedConfidence - 0.2);
  }

  return {
    ...rule,
    confidence: adjustedConfidence
  };
}

export function getDisambiguationRules(): Record<string, SimpleDisambiguationRule> {
  return { ...DISAMBIGUATION_RULES };
}

// Helper function for search integration
export function disambiguateSearchTerm(term: string, sentence?: string): {
  originalTerm: string;
  likelyMeaning: SimpleDisambiguationRule | null;
  allPossibleMeanings: SimpleDisambiguationRule[];
} {
  const rule = simpleDisambiguate(term, sentence);

  return {
    originalTerm: term,
    likelyMeaning: rule,
    allPossibleMeanings: rule ? [rule] : []
  };
}
