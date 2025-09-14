import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Word analysis endpoint - returns rich linguistic information
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { word } = await request.json()
    
    if (!word?.trim()) {
      return NextResponse.json({ error: 'Word parameter required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const normalizedWord = word.trim()

    // Parallel queries for comprehensive linguistic data
    const [
      irregularVerbResult,
      regularVerbResult,
      nounResult,
      dictionaryResult,
      relatedFormsResult,
      frequencyResult
    ] = await Promise.all([
      // Check irregular verbs
      supabase
        .from('irregular_verbs')
        .select('*')
        .eq('verb_root', normalizedWord)
        .limit(1),
      
      // Check regular verbs  
      supabase
        .from('verbs_lexicon')
        .select('*')
        .eq('verb_root', normalizedWord)
        .limit(1),
      
      // Check nouns
      supabase
        .from('nouns_lexicon')
        .select('*')
        .eq('noun_root', normalizedWord)
        .limit(1),
      
      // Dictionary entry
      supabase
        .from('dictionary')
        .select('*')
        .eq('pashto', normalizedWord)
        .limit(1),
      
      // Related forms via roots
      supabase
        .from('form_roots')
        .select('word_form')
        .eq('root_form', normalizedWord)
        .limit(20),
      
      // Word frequency
      supabase
        .from('word_frequencies')
        .select('*')
        .eq('pashto_word', normalizedWord)
        .limit(1)
    ])

    // Build linguistic analysis object
    const analysis: any = {
      word: normalizedWord,
      timestamp: Date.now(),
      categories: []
    }

    // Process irregular verb data
    if (irregularVerbResult.data && irregularVerbResult.data.length > 0) {
      const verb = irregularVerbResult.data[0]
      analysis.categories.push({
        type: 'irregular_verb',
        part_of_speech: 'verb',
        transitivity: 'trans.', // You can enhance this based on your data
        stems: {
          imperfective: verb.stems?.imperfective || '',
          perfective: verb.stems?.perfective || ''
        },
        roots: {
          imperfective: verb.roots?.imperfective || normalizedWord,
          perfective: verb.roots?.perfective || ''
        },
        past_participle: verb.past_participle || '',
        romanization: verb.romanization || {},
        conjugations: generateConjugations(verb),
        irregularity_type: verb.irregularity_type || 'stem_change'
      })
    }
    
    // Process regular verb data
    else if (regularVerbResult.data && regularVerbResult.data.length > 0) {
      const verb = regularVerbResult.data[0]
      analysis.categories.push({
        type: 'regular_verb',
        part_of_speech: 'verb',
        transitivity: verb.transitivity || 'trans.',
        stems: verb.stems || {},
        roots: verb.roots || {},
        past_participle: verb.past_participle || '',
        romanization: verb.romanization || {},
        conjugations: generateConjugations(verb),
        aspect: verb.aspect || ''
      })
    }

    // Process noun data
    if (nounResult.data && nounResult.data.length > 0) {
      const noun = nounResult.data[0]
      analysis.categories.push({
        type: 'noun',
        part_of_speech: 'noun',
        gender: noun.gender || 'masculine',
        pattern: noun.pattern || '',
        pattern_info: noun.pattern_info || '',
        plural_forms: noun.plural_forms || [],
        inflection_type: noun.inflection_type || 'regular'
      })
    }

    // Add dictionary definition
    if (dictionaryResult.data && dictionaryResult.data.length > 0) {
      const entry = dictionaryResult.data[0]
      analysis.definition = {
        english: entry.english || '',
        romanized: entry.romanized || '',
        pos: entry.pos || '',
        gender: entry.gender || ''
      }
    }

    // Add related forms
    if (relatedFormsResult.data && relatedFormsResult.data.length > 0) {
      analysis.related_forms = relatedFormsResult.data
        .map(r => r.word_form)
        .filter(Boolean)
        .slice(0, 15)
    }

    // Add frequency data
    if (frequencyResult.data && frequencyResult.data.length > 0) {
      const freq = frequencyResult.data[0]
      analysis.frequency = {
        count: freq.frequency_count || 0,
        rank: freq.frequency_rank || 0,
        testament: freq.testament || 'both'
      }
    }

    return NextResponse.json({
      analysis,
      ms: Date.now() - startTime
    })

  } catch (error) {
    console.error('Word analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze word' },
      { status: 500 }
    )
  }
}

// Generate conjugations based on stems and grammatical rules
function generateConjugations(verbData: any) {
  const imperfStem = verbData.stems?.imperfective || ''
  const perfStem = verbData.stems?.perfective || ''
  
  if (!imperfStem && !perfStem) return {}

  // Basic imperative forms (simplified - you can expand this)
  const conjugations: any = {}
  
  if (imperfStem) {
    conjugations.imperfective_imperative = {
      second_person_singular: imperfStem + 'ه',
      second_person_plural: imperfStem + 'ئ'
    }
  }
  
  if (perfStem) {
    conjugations.perfective_imperative = {
      second_person_singular: perfStem + 'ه', 
      second_person_plural: perfStem + 'ئ'
    }
  }

  return conjugations
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Word analysis endpoint. Use POST with {"word": "your_word"}' 
  })
}
