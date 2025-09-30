// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// These should be stored in your Vercel environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg';

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define and export table names as constants to avoid typos
export const TABLES = {
  VERSES: 'verses',
  FORM_OCCURRENCES: 'form_occurrences',
  OT_OCCURRENCES: 'ot_occurrences',
  WORD_FREQUENCIES: 'word_frequencies', // Assuming a combined frequency table
  AUDIO_MAPPINGS: 'audio_mappings',
  DICTIONARY: 'dictionary',
  ENRICHED_DICTIONARY: 'enriched_dictionary',
  FORM_LEMMAS: 'form_lemmas',
  FORM_OCCURRENCES_OT: 'form_occurrences_ot', // If separate
  FORM_ROOTS: 'form_roots',
  GRAMMAR_RULES: 'grammar_rules',
  INFLECTIONS: 'inflections',
  IRREGULAR_CANDIDATES: 'irregular_candidates',
  IRREGULAR_VERBS: 'irregular_verbs',
  MORPHOLOGICAL_ANALYSIS: 'morphological_analysis',
  NOUNS_LEXICON: 'nouns_lexicon',
  NT_REFERENCES: 'nt_references',
  ROMANIZED_DICTIONARY: 'romanized_dictionary',
  VERBS_LEXICON: 'verbs_lexicon',
};

// Helper function to search verses
type VerseRow = { book: string; chapter: number; verse: number; text: string; testament?: string }

export const searchVerses = async (query: string, scope: 'all' | 'nt' | 'ot' = 'all') => {
  // Always search the unified verses table using ILIKE substring matching
  // This works better for Pashto than FTS configured for English.
  let q = supabase
    .from(TABLES.VERSES)
    .select('book, chapter, verse, text, testament')
    .ilike('text', `%${query}%`)
    .limit(100);

  if (scope === 'ot') q = q.eq('testament', 'OT');
  if (scope === 'nt') q = q.eq('testament', 'NT');

  const { data, error } = await q as unknown as { data: VerseRow[] | null; error: unknown | null };
  if (error || !data) {
    if (error) console.error('Search error:', error);
    return [] as Array<{ ref: string; text: string }>;
  }

  // Deduplicate results by verse reference and remove empty results
  const uniqueResults = new Map();
  data.forEach((v: VerseRow) => {
    const ref = `${v.book} ${v.chapter}:${v.verse}`;
    if (v.text && v.text.trim() && !uniqueResults.has(ref)) {
      uniqueResults.set(ref, {
        ref,
        text: v.text.trim(),
        testament: v.testament || 'NT' // Default to NT if not specified
      });
    }
  });

  return Array.from(uniqueResults.values());
};

// Helper function to get word frequencies
type WordFrequencyRow = { pashto_word: string; frequency_count: number }

export const getWordFrequencies = async (scope: 'all' | 'nt' | 'ot' = 'all') => {
  const { data, error } = await supabase
    .from('word_frequencies')
    .select('pashto_word, frequency_count')
    .order('frequency_count', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Frequency error:', error);
    return [];
  }

  return (data as WordFrequencyRow[]).map((item) => ({
    pashto: item.pashto_word,
    frequency: item.frequency_count,
  }));
};

// Helper function to calculate coverage
// Normalize book names to handle hyphens vs spaces
function canonicalBookNameFromRef(ref: string): string {
  if (!ref) return "";
  const parts = ref.trim().split(" ");
  const rawBook = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];
  return rawBook.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

export const calculateCoverage = (results: Array<{ ref: string }>) => {
  const coverageMap = new Map<string, number>();

  results.forEach((result) => {
    try {
      // Safely extract book name from ref
      if (!result.ref || typeof result.ref !== 'string') {
        console.warn('Skipping result with invalid ref in calculateCoverage:', result);
        return;
      }

      const book = canonicalBookNameFromRef(result.ref);
      if (book) {
        coverageMap.set(book, (coverageMap.get(book) || 0) + 1);
      }
    } catch (err) {
      console.warn('Error processing result for coverage:', result, err);
    }
  });

  return Array.from(coverageMap.entries())
    .map(([book, count]) => ({ book, count }))
    .sort((a, b) => b.count - a.count);
};

// Enhanced search using intelligent multi-strategy approach with fallback
export const searchVersesEnhanced = async (
  query: string,
  scope: 'all' | 'nt' | 'ot' = 'all',
  strategy: 'auto' | 'trigram' | 'fulltext' | 'hybrid' = 'auto'
) => {
  try {
    const { data, error } = await supabase.rpc('search_verses_intelligent', {
      search_term: query,
      testament_filter: scope === 'all' ? null : scope.toUpperCase(),
      max_results: 100,
      search_strategy: strategy
    });

    if (error) {
      console.error('Enhanced search error, falling back to ILIKE:', error);
      return searchVerses(query, scope);
    }

    if (!data || !Array.isArray(data)) {
      console.warn('Enhanced search returned invalid data, falling back');
      return searchVerses(query, scope);
    }

    return data.map((v: any) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      text: v.text,
      testament: v.testament || 'NT',
      relevance: v.relevance_score,
      method: v.search_method
    }));
  } catch (err) {
    console.error('Enhanced search exception, falling back:', err);
    return searchVerses(query, scope);
  }
};

// Fast search using trigram similarity
export const searchVersesFast = async (
  query: string,
  scope: 'all' | 'nt' | 'ot' = 'all'
) => {
  try {
    const { data, error } = await supabase.rpc('search_verses_enhanced_fast', {
      search_term: query,
      testament_filter: scope === 'all' ? null : scope.toUpperCase(),
      max_results: 100
    });

    if (error) {
      console.error('Fast search error, falling back:', error);
      return searchVerses(query, scope);
    }

    return data.map((v: any) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      text: v.text,
      testament: v.testament || 'NT',
      relevance: v.relevance_score
    }));
  } catch (err) {
    console.error('Fast search exception:', err);
    return searchVerses(query, scope);
  }
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (
  partialTerm: string,
  maxSuggestions: number = 10,
  includeVerses: boolean = false
) => {
  try {
    const { data, error } = await supabase.rpc('get_search_suggestions_enhanced', {
      partial_term: partialTerm,
      max_suggestions: maxSuggestions,
      include_verses: includeVerses
    });

    if (error) {
      console.error('Suggestions error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Suggestions exception:', err);
    return [];
  }
};
