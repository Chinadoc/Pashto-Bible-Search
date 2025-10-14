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

    // Check if this is a compound verb (contains space and multiple parts)
    const isCompoundPhrase = normalizedWord && normalizedWord.includes(' ')
    const wordParts = isCompoundPhrase && normalizedWord ? normalizedWord.split(' ').filter(Boolean) : [normalizedWord || '']
    const auxiliaryVerb = isCompoundPhrase && wordParts.length > 0 ? wordParts[wordParts.length - 1] : null // Last word is typically the auxiliary verb
    const compoundNoun = isCompoundPhrase && wordParts.length >= 2 ? wordParts.slice(0, -1).join(' ') : null

    // Parallel queries for comprehensive linguistic data
    const [
      irregularVerbResult,
      regularVerbResult,
      nounResult,
      dictionaryResult,
      relatedFormsResult,
      frequencyResult,
      conjugationsResult
    ] = await Promise.all([
      // Check irregular verbs (try full phrase first, then auxiliary verb)
      supabase
        .from('irregular_verbs')
        .select('*')
        .eq('verb_root', auxiliaryVerb || normalizedWord)
        .limit(1),

      // Check regular verbs (try full phrase first, then auxiliary verb)
      supabase
        .from('verbs_lexicon')
        .select('*')
        .eq('verb_root', auxiliaryVerb || normalizedWord)
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
        .limit(1),

      // Real conjugation data for verbs
      supabase
        .from('pashto_conjugations')
        .select('*')
        .eq('verb_root', auxiliaryVerb || normalizedWord)
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
      const realConjugations = conjugationsResult.data && conjugationsResult.data.length > 0
        ? conjugationsResult.data[0].conjugations || {}
        : generateConjugations(verb, isCompoundPhrase, compoundNoun || '')

      analysis.categories.push({
        type: isCompoundPhrase ? 'compound_irregular_verb' : 'irregular_verb',
        part_of_speech: 'verb',
        transitivity: isCompoundPhrase ? 'dyn. comp. trans.' : 'trans.',
        compound_info: isCompoundPhrase ? {
          full_phrase: normalizedWord,
          noun_part: compoundNoun,
          auxiliary_verb: auxiliaryVerb,
          compound_type: 'dynamic compound'
        } : null,
        stems: {
          imperfective: verb.stems?.imperfective || '',
          perfective: verb.stems?.perfective || ''
        },
        roots: {
          imperfective: verb.roots?.imperfective || (auxiliaryVerb || normalizedWord),
          perfective: verb.roots?.perfective || ''
        },
        past_participle: verb.past_participle || '',
        romanization: verb.romanization || {},
        conjugations: realConjugations,
        irregularity_type: verb.irregularity_type || 'stem_change'
      })
    }

    // Process regular verb data
    else if (regularVerbResult.data && regularVerbResult.data.length > 0) {
      const verb = regularVerbResult.data[0]
      const realConjugations = conjugationsResult.data && conjugationsResult.data.length > 0
        ? conjugationsResult.data[0].conjugations || {}
        : generateConjugations(verb, isCompoundPhrase, compoundNoun || '')

      analysis.categories.push({
        type: isCompoundPhrase ? 'compound_regular_verb' : 'regular_verb',
        part_of_speech: 'verb',
        transitivity: verb.transitivity || (isCompoundPhrase ? 'dyn. comp. trans.' : 'trans.'),
        compound_info: isCompoundPhrase ? {
          full_phrase: normalizedWord,
          noun_part: compoundNoun,
          auxiliary_verb: auxiliaryVerb,
          compound_type: 'dynamic compound'
        } : null,
        stems: verb.stems || {},
        roots: verb.roots || {},
        past_participle: verb.past_participle || '',
        romanization: verb.romanization || {},
        conjugations: realConjugations,
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

    // Add related forms with frequency data
    if (relatedFormsResult.data && relatedFormsResult.data.length > 0) {
      // Get frequency data for related forms
      const relatedFormWords = relatedFormsResult.data
        .map(r => r.word_form)
        .filter(Boolean)
        .slice(0, 15)

      if (relatedFormWords.length > 0) {
        const { data: frequencyData } = await supabase
          .from('word_frequencies')
          .select('*')
          .in('pashto_word', relatedFormWords)

        analysis.related_forms = relatedFormWords.map(form => {
          const freq = frequencyData?.find(f => f.pashto_word === form)
          return {
            form,
            count: freq?.frequency_count || 0
          }
        })
      }
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

// Generate comprehensive conjugations based on stems and grammatical rules
function generateConjugations(verbData: any, isCompound = false, compoundNoun = '') {
  const imperfStem = verbData.stems?.imperfective || ''
  const perfStem = verbData.stems?.perfective || ''
  const imperfRoot = verbData.roots?.imperfective || ''
  const perfRoot = verbData.roots?.perfective || ''

  if (!imperfStem && !perfStem) return {}

  const conjugations: any = {}
  const prefix = isCompound && compoundNoun ? `${compoundNoun} ` : ''

  // Present tense (imperfective stem + present endings) - most common
  if (imperfStem) {
    conjugations.present = {
      first_person_singular: `${prefix}${imperfStem}م`,
      second_person_singular: `${prefix}${imperfStem}ې`,
      third_person_singular: `${prefix}${imperfStem}ي`,
      first_person_plural: `${prefix}${imperfStem}و`,
      second_person_plural: `${prefix}${imperfStem}ئ`,
      third_person_plural: `${prefix}${imperfStem}ي`
    }
  }

  // Subjunctive (perfective stem + present endings)
  if (perfStem) {
    conjugations.subjunctive = {
      first_person_singular: `${prefix}${perfStem}م`,
      second_person_singular: `${prefix}${perfStem}ې`,
      third_person_singular: `${prefix}${perfStem}ي`,
      first_person_plural: `${prefix}${perfStem}و`,
      second_person_plural: `${prefix}${perfStem}ئ`,
      third_person_plural: `${prefix}${perfStem}ي`
    }
  }

  // Future tenses (به + present/subjunctive)
  if (imperfStem) {
    conjugations.imperfective_future = {
      first_person_singular: `به ${prefix}${imperfStem}م`,
      second_person_singular: `به ${prefix}${imperfStem}ې`,
      third_person_singular: `به ${prefix}${imperfStem}ي`,
      first_person_plural: `به ${prefix}${imperfStem}و`,
      second_person_plural: `به ${prefix}${imperfStem}ئ`,
      third_person_plural: `به ${prefix}${imperfStem}ي`
    }
  }

  if (perfStem) {
    conjugations.perfective_future = {
      first_person_singular: `به ${prefix}${perfStem}م`,
      second_person_singular: `به ${prefix}${perfStem}ې`,
      third_person_singular: `به ${prefix}${perfStem}ي`,
      first_person_plural: `به ${prefix}${perfStem}و`,
      second_person_plural: `به ${prefix}${perfStem}ئ`,
      third_person_plural: `به ${prefix}${perfStem}ي`
    }
  }

  // Past tenses (continuous and simple past)
  if (imperfRoot) {
    // Continuous past (imperfective root + past endings)
    conjugations.continuous_past = {
      first_person_singular: `${prefix}${imperfRoot.replace(/ل$/, 'لم')}`,
      second_person_singular: `${prefix}${imperfRoot.replace(/ل$/, 'لې')}`,
      third_person_singular: `${prefix}${imperfRoot.replace(/ل$/, 'لو')}`,
      first_person_plural: `${prefix}${imperfRoot.replace(/ل$/, 'لو')}`,
      second_person_plural: `${prefix}${imperfRoot.replace(/ل$/, 'لئ')}`,
      third_person_plural: `${prefix}${imperfRoot.replace(/ل$/, 'ل')}`
    }
  }

  if (perfRoot) {
    // Simple past (perfective root + past endings)
    conjugations.simple_past = {
      first_person_singular: `${prefix}${perfRoot.replace(/ل$/, 'لم')}`,
      second_person_singular: `${prefix}${perfRoot.replace(/ل$/, 'لې')}`,
      third_person_singular: `${prefix}${perfRoot.replace(/ل$/, 'لو')}`,
      first_person_plural: `${prefix}${perfRoot.replace(/ل$/, 'لو')}`,
      second_person_plural: `${prefix}${perfRoot.replace(/ل$/, 'لئ')}`,
      third_person_plural: `${prefix}${perfRoot.replace(/ل$/, 'ل')}`
    }
  }

  // Imperative forms
  if (imperfStem) {
    conjugations.imperfective_imperative = {
      second_person_singular: `${prefix}${imperfStem}ه`,
      second_person_plural: `${prefix}${imperfStem}ئ`
    }
  }

  if (perfStem) {
    conjugations.perfective_imperative = {
      second_person_singular: `${prefix}${perfStem}ه`,
      second_person_plural: `${prefix}${perfStem}ئ`
    }
  }

  return conjugations
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Word analysis endpoint. Use POST with {"word": "your_word"}' 
  })
}
