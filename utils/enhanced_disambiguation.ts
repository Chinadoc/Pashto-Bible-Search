// Enhanced Pashto Word Disambiguation System
// Comprehensive linguistic analysis for accurate part-of-speech determination

export interface DisambiguationRule {
  pattern: RegExp;
  meaning: string;
  pos: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'postposition' | 'conjunction';
  confidence: number;
  context: 'preceding' | 'following' | 'surrounding' | 'position';
  description: string;
}

export interface ContextFeatures {
  precedingWords: string[];
  followingWords: string[];
  isFirstWord: boolean;
  isLastWord: boolean;
  hasModalBefore: boolean;
  hasObjectAfter: boolean;
  hasSubjectBefore: boolean;
  hasPostpositionAfter: boolean;
  sentencePosition: 'initial' | 'medial' | 'final';
  wordLength: number;
  morphologicalPattern: string;
}

export interface DisambiguationResult {
  word: string;
  primaryMeaning: string;
  primaryPOS: string;
  confidence: number;
  alternativeMeanings: Array<{
    meaning: string;
    pos: string;
    confidence: number;
    contextClues: string[];
  }>;
  contextAnalysis: ContextFeatures;
  recommendedAction: 'single_meaning' | 'disambiguate' | 'show_all';
}

// Comprehensive Pashto disambiguation rules based on deep linguistic analysis
export class PashtoDisambiguator {

  // Core disambiguation rules organized by linguistic patterns
  private static readonly DISAMBIGUATION_RULES: Record<string, DisambiguationRule[]> = {
    // Modal verb patterns (verbs that precede other verbs)
    'modal_verbs': [
      { pattern: /به\s+(.+)/, meaning: 'future_intention', pos: 'verb', confidence: 0.9, context: 'preceding', description: 'به indicates future tense auxiliary' },
      { pattern: /غواړو\s+(.+)/, meaning: 'desire_to_do', pos: 'verb', confidence: 0.85, context: 'preceding', description: 'غواړو indicates desire/intention' },
      { pattern: /کولای\s+(.+)/, meaning: 'ability_to_do', pos: 'verb', confidence: 0.9, context: 'preceding', description: 'کولای indicates ability/capability' },
      { pattern: /کېدای\s+(.+)/, meaning: 'possibility', pos: 'verb', confidence: 0.8, context: 'preceding', description: 'کېدای indicates possibility' },
    ],

    // Object markers (indicate following word is object of verb)
    'object_markers': [
      { pattern: /(.+)\s+را/, meaning: 'direct_object', pos: 'verb', confidence: 0.85, context: 'following', description: 'را marks direct object' },
      { pattern: /(.+)\s+ته/, meaning: 'indirect_object', pos: 'verb', confidence: 0.8, context: 'following', description: 'ته marks indirect object' },
      { pattern: /(.+)\s+په/, meaning: 'instrumental_object', pos: 'verb', confidence: 0.75, context: 'following', description: 'په marks instrumental case' },
      { pattern: /(.+)\s+له/, meaning: 'ablative_object', pos: 'verb', confidence: 0.8, context: 'following', description: 'له marks ablative case' },
    ],

    // Demonstrative pronouns (typically not verbs)
    'demonstratives': [
      { pattern: /^هغه/, meaning: 'that_demonstrative', pos: 'pronoun', confidence: 0.95, context: 'position', description: 'هغه is demonstrative pronoun' },
      { pattern: /^هغوی/, meaning: 'those_demonstrative', pos: 'pronoun', confidence: 0.95, context: 'position', description: 'هغوی is demonstrative pronoun' },
      { pattern: /^دا/, meaning: 'this_demonstrative', pos: 'pronoun', confidence: 0.95, context: 'position', description: 'دا is demonstrative pronoun' },
      { pattern: /^دغه/, meaning: 'this_that_demonstrative', pos: 'pronoun', confidence: 0.9, context: 'position', description: 'دغه is demonstrative pronoun' },
    ],

    // Postpositions (never verbs)
    'postpositions': [
      { pattern: /سره$/, meaning: 'with_comitative', pos: 'postposition', confidence: 0.95, context: 'position', description: 'سره is comitative postposition' },
      { pattern: /څخه$/, meaning: 'from_ablative', pos: 'postposition', confidence: 0.95, context: 'position', description: 'څخه is ablative postposition' },
      { pattern: /دپاره$/, meaning: 'for_benefactive', pos: 'postposition', confidence: 0.95, context: 'position', description: 'دپاره is benefactive postposition' },
      { pattern: /هکله$/, meaning: 'about_concerning', pos: 'postposition', confidence: 0.95, context: 'position', description: 'هکله is postposition' },
      { pattern: /ورته$/, meaning: 'to_towards', pos: 'postposition', confidence: 0.9, context: 'position', description: 'ورته is postposition' },
    ],

    // Reflexive and possessive pronouns
    'reflexives': [
      { pattern: /^خپل/, meaning: 'own_reflexive', pos: 'pronoun', confidence: 0.9, context: 'position', description: 'خپل is reflexive pronoun' },
      { pattern: /^خپله/, meaning: 'own_reflexive_fem', pos: 'pronoun', confidence: 0.9, context: 'position', description: 'خپله is reflexive pronoun' },
    ],

    // Conjunctions
    'conjunctions': [
      { pattern: /^ځکه/, meaning: 'because', pos: 'conjunction', confidence: 0.95, context: 'position', description: 'ځکه is causal conjunction' },
      { pattern: /^کله/, meaning: 'when_temporal', pos: 'conjunction', confidence: 0.85, context: 'surrounding', description: 'کله can be temporal conjunction' },
    ],

    // Verb conjugation patterns
    'verb_patterns': [
      { pattern: /(.+)ی$/, meaning: 'present_singular', pos: 'verb', confidence: 0.7, context: 'position', description: 'ی ending suggests present singular' },
      { pattern: /(.+)و$/, meaning: 'past_singular', pos: 'verb', confidence: 0.75, context: 'position', description: 'و ending suggests past singular' },
      { pattern: /(.+)ې$/, meaning: 'present_plural', pos: 'verb', confidence: 0.7, context: 'position', description: 'ې ending suggests present plural' },
      { pattern: /(.+)ل$/, meaning: 'past_participle', pos: 'verb', confidence: 0.8, context: 'position', description: 'ل ending suggests past participle' },
    ],

    // Noun inflection patterns
    'noun_patterns': [
      { pattern: /(.+)ی$/, meaning: 'masculine_singular', pos: 'noun', confidence: 0.6, context: 'position', description: 'ی ending can be masculine noun' },
      { pattern: /(.+)ه$/, meaning: 'feminine_singular', pos: 'noun', confidence: 0.7, context: 'position', description: 'ه ending can be feminine noun' },
      { pattern: /(.+)و$/, meaning: 'plural_noun', pos: 'noun', confidence: 0.75, context: 'position', description: 'و ending can be plural noun' },
      { pattern: /(.+)ګان$/, meaning: 'plural_animate', pos: 'noun', confidence: 0.85, context: 'position', description: 'ګان is animate plural' },
    ],

    // Adjective patterns
    'adjective_patterns': [
      { pattern: /(.+)ی$/, meaning: 'descriptive_adjective', pos: 'adjective', confidence: 0.6, context: 'position', description: 'ی ending can be adjective' },
      { pattern: /(.+)مند$/, meaning: 'possessive_adjective', pos: 'adjective', confidence: 0.8, context: 'position', description: 'مند indicates possession' },
      { pattern: /(.+)وار$/, meaning: 'having_quality', pos: 'adjective', confidence: 0.75, context: 'position', description: 'وار indicates having quality' },
    ],

    // Biblical context patterns (specific to religious texts)
    'biblical_contexts': [
      { pattern: /خدای\s+(.+)/, meaning: 'god_subject', pos: 'noun', confidence: 0.9, context: 'preceding', description: 'خدای as subject suggests divine reference' },
      { pattern: /عیسی\s+(.+)/, meaning: 'jesus_subject', pos: 'noun', confidence: 0.95, context: 'preceding', description: 'عیسی as proper name' },
      { pattern: /روح\s+(.+)/, meaning: 'spirit_holy', pos: 'noun', confidence: 0.85, context: 'preceding', description: 'روح in religious context' },
    ],
  };

  /**
   * Extract comprehensive context features from a sentence
   */
  static extractContextFeatures(sentence: string, targetWord: string, targetIndex: number): ContextFeatures {
    const words = sentence.split(/\s+/);
    const targetIdx = targetIndex;

    return {
      precedingWords: words.slice(Math.max(0, targetIdx - 3), targetIdx),
      followingWords: words.slice(targetIdx + 1, Math.min(words.length, targetIdx + 4)),
      isFirstWord: targetIdx === 0,
      isLastWord: targetIdx === words.length - 1,
      hasModalBefore: this.hasModalVerb(words.slice(Math.max(0, targetIdx - 2), targetIdx)),
      hasObjectAfter: this.hasObjectMarker(words.slice(targetIdx + 1, targetIdx + 3)),
      hasSubjectBefore: this.hasSubjectMarker(words.slice(Math.max(0, targetIdx - 3), targetIdx)),
      hasPostpositionAfter: this.hasPostposition(words.slice(targetIdx + 1, targetIdx + 3)),
      sentencePosition: this.determineSentencePosition(targetIdx, words.length),
      wordLength: targetWord.length,
      morphologicalPattern: this.analyzeMorphologicalPattern(targetWord)
    };
  }

  /**
   * Determine if preceding words contain modal verbs
   */
  private static hasModalVerb(precedingWords: string[]): boolean {
    const modalVerbs = ['به', 'غواړو', 'کولای', 'کېدای', 'شي', 'غواړي'];
    return precedingWords.some(word => modalVerbs.includes(word));
  }

  /**
   * Check for object markers in following words
   */
  private static hasObjectMarker(followingWords: string[]): boolean {
    const objectMarkers = ['را', 'ته', 'په', 'له', 'سره', 'د'];
    return followingWords.some(word => objectMarkers.includes(word));
  }

  /**
   * Check for subject markers in preceding words
   */
  private static hasSubjectMarker(precedingWords: string[]): boolean {
    const subjectMarkers = ['د', 'چې', 'که'];
    return precedingWords.some(word => subjectMarkers.includes(word));
  }

  /**
   * Check for postpositions in following words
   */
  private static hasPostposition(followingWords: string[]): boolean {
    const postpositions = ['سره', 'څخه', 'دپاره', 'هکله', 'ورته', 'په', 'له'];
    return followingWords.some(word => postpositions.includes(word));
  }

  /**
   * Determine position in sentence
   */
  private static determineSentencePosition(index: number, totalWords: number): 'initial' | 'medial' | 'final' {
    const ratio = index / totalWords;
    if (ratio < 0.3) return 'initial';
    if (ratio > 0.7) return 'final';
    return 'medial';
  }

  /**
   * Analyze morphological pattern of the word
   */
  private static analyzeMorphologicalPattern(word: string): string {
    // Analyze endings for morphological clues
    if (word.endsWith('ل')) return 'verb_past_participle';
    if (word.endsWith('ول')) return 'verb_past_singular';
    if (word.endsWith('ېدل')) return 'verb_infinitive_complex';
    if (word.endsWith('کول')) return 'verb_causative';
    if (word.endsWith('کیدل')) return 'verb_passive';
    if (word.endsWith('ی')) return 'noun_masculine_or_adjective';
    if (word.endsWith('ه')) return 'noun_feminine_or_verb';
    if (word.endsWith('و')) return 'noun_plural_or_verb';
    if (word.endsWith('ګان')) return 'noun_plural_animate';
    if (word.endsWith('وند')) return 'noun_possessive';
    if (word.endsWith('مند')) return 'adjective_possessive';
    if (word.endsWith('وار')) return 'adjective_having';
    return 'unknown_pattern';
  }

  /**
   * Main disambiguation function
   */
  static disambiguate(word: string, context: string, wordIndex: number): DisambiguationResult {
    const features = this.extractContextFeatures(context, word, wordIndex);

    // Apply all disambiguation rules
    const allMatches = this.applyAllRules(word, features);

    // Rank and filter results
    const rankedResults = this.rankDisambiguationResults(allMatches, features);

    // Determine recommended action
    const recommendedAction = this.determineRecommendedAction(rankedResults, features);

    return {
      word,
      primaryMeaning: rankedResults[0]?.meaning || 'unknown',
      primaryPOS: rankedResults[0]?.pos || 'unknown',
      confidence: rankedResults[0]?.confidence || 0,
      alternativeMeanings: rankedResults.slice(1).map(r => ({
        meaning: r.meaning,
        pos: r.pos,
        confidence: r.confidence,
        contextClues: r.contextClues
      })),
      contextAnalysis: features,
      recommendedAction
    };
  }

  /**
   * Apply all disambiguation rules to a word
   */
  private static applyAllRules(word: string, features: ContextFeatures): Array<{
    rule: DisambiguationRule;
    matched: boolean;
    contextClues: string[];
  }> {
    const results = [];

    for (const category in this.DISAMBIGUATION_RULES) {
      for (const rule of this.DISAMBIGUATION_RULES[category]) {
        const matched = this.testRule(rule, word, features);
        if (matched) {
          results.push({
            rule,
            matched: true,
            contextClues: this.extractContextClues(rule, features)
          });
        }
      }
    }

    return results;
  }

  /**
   * Test if a rule applies to the current word and context
   */
  private static testRule(rule: DisambiguationRule, word: string, features: ContextFeatures): boolean {
    switch (rule.context) {
      case 'preceding':
        return rule.pattern.test(features.precedingWords.join(' ') + ' ' + word);
      case 'following':
        return rule.pattern.test(word + ' ' + features.followingWords.join(' '));
      case 'surrounding':
        return rule.pattern.test(features.precedingWords.join(' ') + ' ' + word + ' ' + features.followingWords.join(' '));
      case 'position':
        return rule.pattern.test(word);
      default:
        return false;
    }
  }

  /**
   * Extract context clues that support a rule
   */
  private static extractContextClues(rule: DisambiguationRule, features: ContextFeatures): string[] {
    const clues = [];

    if (features.hasModalBefore && rule.pos === 'verb') {
      clues.push('Modal verb before suggests verb');
    }
    if (features.hasObjectAfter && rule.pos === 'verb') {
      clues.push('Object marker after suggests verb');
    }
    if (features.isFirstWord && rule.pos !== 'verb') {
      clues.push('Initial position suggests non-verb');
    }
    if (features.hasPostpositionAfter && rule.pos === 'postposition') {
      clues.push('Postposition pattern matches');
    }
    if (features.morphologicalPattern === rule.description.split(' ')[0]) {
      clues.push('Morphological pattern supports this analysis');
    }

    return clues;
  }

  /**
   * Rank disambiguation results by confidence and context fit
   */
  private static rankDisambiguationResults(
    matches: Array<{ rule: DisambiguationRule; matched: boolean; contextClues: string[] }>,
    features: ContextFeatures
  ): Array<{ meaning: string; pos: string; confidence: number; contextClues: string[] }> {
    return matches
      .filter(m => m.matched)
      .map(m => ({
        meaning: m.rule.meaning,
        pos: m.rule.pos,
        confidence: this.calculateAdjustedConfidence(m.rule, features, m.contextClues),
        contextClues: m.contextClues
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate confidence adjusted for context fit
   */
  private static calculateAdjustedConfidence(
    rule: DisambiguationRule,
    features: ContextFeatures,
    contextClues: string[]
  ): number {
    let confidence = rule.confidence;

    // Boost confidence based on context clues
    const clueBoosts = {
      'Modal verb before suggests verb': 0.15,
      'Object marker after suggests verb': 0.15,
      'Initial position suggests non-verb': 0.1,
      'Postposition pattern matches': 0.2,
      'Morphological pattern supports this analysis': 0.1
    };

    for (const clue of contextClues) {
      if (clue in clueBoosts) {
        confidence += clueBoosts[clue as keyof typeof clueBoosts];
      }
    }

    // Penalize unlikely combinations
    if (rule.pos === 'verb' && features.isFirstWord && !features.hasModalBefore) {
      confidence -= 0.2;
    }
    if (rule.pos === 'postposition' && features.isLastWord) {
      confidence -= 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Determine recommended action based on results
   */
  private static determineRecommendedAction(
    results: Array<{ meaning: string; pos: string; confidence: number; contextClues: string[] }>,
    features: ContextFeatures
  ): 'single_meaning' | 'disambiguate' | 'show_all' {
    if (results.length === 0) {
      return 'show_all';
    }

    const topResult = results[0];
    if (topResult.confidence > 0.8) {
      return 'single_meaning';
    }

    if (results.length > 1 && results[1].confidence > 0.6) {
      return 'disambiguate';
    }

    return 'show_all';
  }

  /**
   * Get disambiguation explanation for educational purposes
   */
  static getDisambiguationExplanation(result: DisambiguationResult): string {
    if (result.recommendedAction === 'single_meaning') {
      return `Word "${result.word}" is clearly a ${result.primaryPOS} based on context analysis`;
    }

    if (result.recommendedAction === 'disambiguate') {
      return `Word "${result.word}" could be ${result.primaryPOS} or ${result.alternativeMeanings[0]?.pos}. Context suggests ${result.primaryPOS} (${Math.round(result.confidence * 100)}% confidence).`;
    }

    return `Word "${result.word}" has multiple possible interpretations. Consider the context to determine the intended meaning.`;
  }

  /**
   * Batch disambiguation for multiple words in a sentence
   */
  static disambiguateSentence(sentence: string): DisambiguationResult[] {
    const words = sentence.split(/\s+/);
    const results = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.length > 2) { // Skip very short words
        const result = this.disambiguate(word, sentence, i);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Advanced disambiguation using machine learning-like scoring
   */
  static advancedDisambiguation(word: string, sentence: string, wordIndex: number): {
    pos: string;
    confidence: number;
    reasoning: string[];
    alternatives: Array<{pos: string; confidence: number}>;
  } {
    const features = this.extractContextFeatures(sentence, word, wordIndex);
    const basicResult = this.disambiguate(word, sentence, wordIndex);

    // Apply advanced scoring algorithm
    const posScores = {
      noun: 0,
      verb: 0,
      adjective: 0,
      pronoun: 0,
      postposition: 0,
      conjunction: 0
    };

    // Feature-based scoring
    if (features.isFirstWord) posScores.pronoun += 0.3;
    if (features.hasModalBefore) posScores.verb += 0.4;
    if (features.hasObjectAfter) posScores.verb += 0.3;
    if (features.hasPostpositionAfter) posScores.postposition += 0.3;
    if (features.morphologicalPattern.includes('verb')) posScores.verb += 0.2;
    if (features.morphologicalPattern.includes('noun')) posScores.noun += 0.2;

    // Pattern-based scoring
    const patterns = [
      { pattern: /^هغه/, pos: 'pronoun', score: 0.9 },
      { pattern: /^سره$/, pos: 'postposition', score: 0.9 },
      { pattern: /ل$/, pos: 'verb', score: 0.7 },
      { pattern: /ی$/, pos: 'noun', score: 0.6 },
      { pattern: /ه$/, pos: 'noun', score: 0.7 },
    ];

    for (const p of patterns) {
      if (p.pattern.test(word)) {
        posScores[p.pos as keyof typeof posScores] += p.score;
      }
    }

    // Get top POS
    const sortedPos = Object.entries(posScores).sort(([,a], [,b]) => b - a);
    const topPos = sortedPos[0][0];
    const topScore = sortedPos[0][1];

    // Generate alternatives
    const alternatives = sortedPos.slice(1).map(([pos, score]) => ({
      pos,
      confidence: score / topScore
    }));

    return {
      pos: topPos,
      confidence: Math.min(topScore, 1.0),
      reasoning: this.generateReasoning(features, word, topPos),
      alternatives
    };
  }

  /**
   * Generate human-readable reasoning for disambiguation
   */
  private static generateReasoning(features: ContextFeatures, word: string, predictedPos: string): string[] {
    const reasoning = [];

    if (features.hasModalBefore && predictedPos === 'verb') {
      reasoning.push('Modal verb before suggests this is a verb');
    }
    if (features.hasObjectAfter && predictedPos === 'verb') {
      reasoning.push('Object marker after suggests this takes an object (verb)');
    }
    if (features.isFirstWord && predictedPos === 'pronoun') {
      reasoning.push('Initial position suggests demonstrative pronoun');
    }
    if (features.morphologicalPattern.includes('verb') && predictedPos === 'verb') {
      reasoning.push('Morphological pattern suggests verb conjugation');
    }
    if (features.morphologicalPattern.includes('noun') && predictedPos === 'noun') {
      reasoning.push('Morphological pattern suggests noun inflection');
    }

    if (reasoning.length === 0) {
      reasoning.push('Context analysis suggests this interpretation');
    }

    return reasoning;
  }
}
