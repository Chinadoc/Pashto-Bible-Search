// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// These should be stored in your Vercel environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
export const searchVerses = async (query: string, scope: 'all' | 'nt' | 'ot' = 'all') => {
  let tableName = 'nt_references'; // Default to NT
  let textField = 'verse_text';

  if (scope === 'ot') {
    // For OT, we'll search the occurrences table (simplified approach)
    tableName = 'ot_occurrences';
    textField = 'form_data';
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .textSearch(textField, query)
    .limit(50);

  if (error) {
    console.error('Search error:', error);
    return [];
  }

  // Transform the data to match our expected format
  return data.map((item: any) => {
    if (scope === 'nt') {
      return {
        ref: `${item.book_name} ${item.chapter}:${item.verse}`,
        text: item.verse_text || '',
      };
    } else {
      // For OT, create a simplified reference
      return {
        ref: `${item.pashto_form} (OT context)`,
        text: item.form_data || '',
      };
    }
  });
};

// Helper function to get word frequencies
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

  return data.map((item: any) => ({
    pashto: item.pashto_word,
    frequency: item.frequency_count,
  }));
};

// Helper function to calculate coverage
export const calculateCoverage = (results: any[]) => {
  const coverageMap = new Map<string, number>();

  results.forEach((result) => {
    const book = result.ref.split(' ')[0]; // Extract book name
    coverageMap.set(book, (coverageMap.get(book) || 0) + 1);
  });

  return Array.from(coverageMap.entries())
    .map(([book, count]) => ({ book, count }))
    .sort((a, b) => b.count - a.count);
};