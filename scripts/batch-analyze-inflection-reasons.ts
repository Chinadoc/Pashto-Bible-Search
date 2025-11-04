#!/usr/bin/env tsx
/**
 * Batch Analysis Script: Pre-compute inflection reasons for all noun/adjective forms
 * 
 * This script analyzes ALL inflected forms in word_frequencies to determine
 * why they're inflected (plural, sandwich, transitive past tense subject).
 * 
 * Usage:
 *   tsx scripts/batch-analyze-inflection-reasons.ts [--limit N] [--offset N] [--batch-size N]
 * 
 * Options:
 *   --limit N      : Limit analysis to N forms (for testing)
 *   --offset N     : Start from offset N (for resuming)
 *   --batch-size N : Process N forms in parallel (default: 50)
 */

import { D1Client } from '../utils/d1';
import { getD1Database } from '../utils/d1';

interface InflectionReasonsResult {
  plural: number;
  sandwich: number;
  transitive_past: number;
  sandwich_types: string[];
  examples: Array<{
    verse_ref: string;
    text: string;
    reason: 'plural' | 'sandwich' | 'transitive_past';
    highlighted_context?: string;
    pattern?: string;
  }>;
}

interface FormToAnalyze {
  form: string;
  frequency: number;
  pos?: string;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { limit?: number; offset?: number; batchSize?: number } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--offset' && args[i + 1]) {
      options.offset = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--batch-size' && args[i + 1]) {
      options.batchSize = parseInt(args[i + 1], 10);
      i++;
    }
  }
  
  return options;
}

/**
 * Analyze inflection reasons for a single form
 * (Same logic as in app/api/search_phrase/route.ts)
 */
async function analyzeInflectionReasons(
  db: D1Client,
  form: string,
  baseWord: string,
  sampleSize: number = 20
): Promise<InflectionReasonsResult> {
  const reasons: InflectionReasonsResult = {
    plural: 0,
    sandwich: 0,
    transitive_past: 0,
    sandwich_types: [],
    examples: []
  }

  try {
    // Get sample verses containing this form
    const verses = await db.query<{ text: string; book: string; chapter: number; verse: number }>(
      `SELECT text, book, chapter, verse FROM verses WHERE text LIKE ? LIMIT ?`,
      [`%${form.replace(/[%_]/g, '\\$&')}%`, sampleSize]
    )

    if (!Array.isArray(verses) || verses.length === 0) {
      return reasons
    }

    // Common sandwich patterns (adpositional phrases)
    const sandwichPatterns = [
      { type: 'pre', left: 'د', right: null, name: 'د' },
      { type: 'pre', left: 'تر', right: null, name: 'تر' },
      { type: 'pre', left: 'پر', right: null, name: 'پر' },
      { type: 'pre', left: 'په', right: null, name: 'په' },
      { type: 'pre', left: 'له', right: null, name: 'له' },
      { type: 'circ', left: 'په', right: 'کې', name: 'په...کې' },
      { type: 'circ', left: 'په', right: 'باندې', name: 'په...باندې' },
      { type: 'circ', left: 'له', right: 'سره', name: 'له...سره' },
      { type: 'circ', left: 'له', right: 'څخه', name: 'له...څخه' },
      { type: 'circ', left: 'پر', right: 'باندې', name: 'پر...باندې' },
      { type: 'circ', left: 'د', right: 'په اړه', name: 'د...په اړه' },
      { type: 'circ', left: 'د', right: 'لپاره', name: 'د...لپاره' },
      { type: 'circ', left: 'د', right: 'دپاره', name: 'د...دپاره' },
    ]

    // Plural indicators
    const pluralSuffixes = ['ان', 'انو', 'ونه', 'ونو', 'انې', 'یان', 'یانو']
    const numeralWords = ['څو', 'یو', 'دوه', 'درې', 'څلور', 'پنځه', 'شپږ', 'اووه', 'اته', 'نهه', 'لس']

    // Transitive markers
    const transitiveMarkers = [
      'کړ', 'کړل', 'کړه', 'کړې', 'کړو', 'کړم', 'کړئ', 'کړی',
      'ول', 'وله', 'ولې', 'ولو', 'ولم', 'ولئ', 'ولی',
      'وخ', 'وخه', 'وخې', 'وخو', 'وخم', 'وخئ',
      'وکړ', 'ورکړ', 'ووین', 'ووی', 'وکت', 'واخ', 'ووړ', 'وخو', 'وخړ', 'وژ', 'ولیک', 'وښ',
      'ایست', 'ایستل', 'ایسته', 'ایستې', 'ایستو', 'پاک', 'پاکه', 'پاکې', 'پاکو'
    ]
    
    const transitivePastEndings = ['م', 'ې', 'ئ', 'و', 'ه', 'ول', 'ولي']
    
    function tokenize(text: string): string[] {
      return text.split(/[\s\u200C\u200D\u200E\u200F\uFEFF]+/).filter(t => t.length > 0)
    }

    function isLikelyPastTransitive(token: string): boolean {
      if (!token || token.length < 2) return false
      const trimmed = token.trim()
      
      if (trimmed.startsWith('و')) {
        if (transitiveMarkers.some(marker => trimmed.includes(marker))) {
          if (trimmed === 'شو' || trimmed.startsWith('شو') && !transitiveMarkers.some(m => trimmed.includes(m))) {
            return false
          }
          return true
        }
        
        const matchingEnding = transitivePastEndings.find(ending => trimmed.endsWith(ending))
        if (matchingEnding) {
          if (trimmed.length > 4 && !trimmed.match(/^وو?$/)) {
            if (trimmed.match(/^و[ومېئ]$/)) {
              return false
            }
            const middlePart = trimmed.slice(1, trimmed.length - matchingEnding.length)
            if (middlePart.length >= 2) {
              return true
            }
          }
        }
      }
      
      if (transitiveMarkers.some(marker => trimmed.includes(marker))) {
        if (transitivePastEndings.some(ending => trimmed.endsWith(ending))) {
          return true
        }
      }
      
      return false
    }
    
    function findTransitiveVerbInContext(tokens: string[], formIndex: number): { found: boolean; verbIndex?: number; verb?: string } {
      const searchWindow = 5
      const start = Math.max(0, formIndex - searchWindow)
      const end = Math.min(tokens.length, formIndex + searchWindow + 1)
      
      for (let i = start; i < end; i++) {
        if (i === formIndex) continue
        const token = tokens[i]
        if (isLikelyPastTransitive(token)) {
          if (i > formIndex) {
            return { found: true, verbIndex: i, verb: token }
          }
        }
      }
      return { found: false }
    }

    for (const verse of verses) {
      const verseText = verse.text || ''
      const formIndex = verseText.indexOf(form)
      
      if (formIndex === -1) continue

      const verseRef = `${verse.book} ${verse.chapter}:${verse.verse}`

      const contextWindow = 20
      const contextStart = Math.max(0, formIndex - contextWindow)
      const contextEnd = Math.min(verseText.length, formIndex + form.length + contextWindow)
      const context = verseText.slice(contextStart, contextEnd)

      const tokens = tokenize(context)
      const formTokenIndex = tokens.findIndex(t => t.includes(form))
      
      if (formTokenIndex === -1) continue

      const leftTokens = tokens.slice(Math.max(0, formTokenIndex - 4), formTokenIndex)
      const rightTokens = tokens.slice(formTokenIndex + 1, formTokenIndex + 5)
      const leftSet = new Set(leftTokens)
      const rightSet = new Set(rightTokens)

      // Check for plural
      const isPlural = pluralSuffixes.some(suffix => form.endsWith(suffix)) ||
                      numeralWords.some(num => leftSet.has(num) || rightSet.has(num)) ||
                      tokens.some(t => /^\d+$/.test(t))

      if (isPlural) {
        reasons.plural++
        if (reasons.examples.length < 2) {
          reasons.examples.push({
            verse_ref: verseRef,
            text: verseText,
            reason: 'plural'
          })
        }
      }

      // Check for sandwich patterns
      let sandwichFound = false
      let sandwichPattern: string | undefined
      
      for (const pattern of sandwichPatterns) {
        if (pattern.type === 'pre') {
          if (leftSet.has(pattern.left) || leftTokens.slice(-2).some(t => t === pattern.left)) {
            reasons.sandwich++
            sandwichFound = true
            sandwichPattern = pattern.name
            if (!reasons.sandwich_types.includes(pattern.name)) {
              reasons.sandwich_types.push(pattern.name)
            }
            if (reasons.examples.length < 2) {
              reasons.examples.push({
                verse_ref: verseRef,
                text: verseText,
                reason: 'sandwich',
                pattern: pattern.name
              })
            }
            break
          }
        } else if (pattern.type === 'circ') {
          const hasLeft = leftSet.has(pattern.left) || leftTokens.slice(-2).some(t => t === pattern.left)
          const hasRight = pattern.right ? (rightSet.has(pattern.right) || rightTokens.slice(0, 3).some(t => t.includes(pattern.right))) : false
          
          if (hasLeft && hasRight) {
            reasons.sandwich++
            sandwichFound = true
            sandwichPattern = pattern.name
            if (!reasons.sandwich_types.includes(pattern.name)) {
              reasons.sandwich_types.push(pattern.name)
            }
            if (reasons.examples.length < 2) {
              reasons.examples.push({
                verse_ref: verseRef,
                text: verseText,
                reason: 'sandwich',
                pattern: pattern.name
              })
            }
            break
          }
        }
      }

      // Check for transitive past tense subject
      const verbSearch = findTransitiveVerbInContext(tokens, formTokenIndex)
      
      let hasPastTransitive = false
      
      if (verbSearch.found && verbSearch.verb) {
        hasPastTransitive = true
      } else {
        hasPastTransitive = leftTokens.slice(-3).some(isLikelyPastTransitive) ||
                            (rightTokens.slice(0, 3).some(isLikelyPastTransitive) && 
                             transitiveMarkers.some(m => context.includes(m)))
      }

      if (hasPastTransitive && !sandwichFound) {
        reasons.transitive_past++
        if (reasons.examples.length < 2) {
          reasons.examples.push({
            verse_ref: verseRef,
            text: verseText,
            reason: 'transitive_past'
          })
        }
      }
    }

    return reasons
  } catch (error) {
    console.warn(`Error analyzing inflection reasons for ${form}:`, error)
    return reasons
  }
}

/**
 * Determine inflection type from form characteristics
 */
function determineInflectionType(form: string, baseWord: string): string {
  if (form === baseWord) return 'plain'
  
  if (form.endsWith('ان') || form.endsWith('انو') || form.endsWith('ونه') || form.endsWith('ونو')) {
    if (form.endsWith('انو')) return 'plural_2nd_m'
    if (form.endsWith('یانو')) return 'plural_2nd'
    if (form.endsWith('ونو')) return 'plural_inanimate_2nd'
    if (form.endsWith('ونه')) return 'plural_inanimate'
    return 'plural_m'
  }
  
  if (form.endsWith('انې')) return 'plural_f'
  if (form.endsWith('و') && !form.endsWith('انو') && !form.endsWith('یانو')) return '2nd'
  if (form.endsWith('ې') && !form.endsWith('انې')) return '1st_f'
  if (form.endsWith('ه') && form !== baseWord + 'ه') return 'vocative_m'
  if (form.endsWith('ۍ')) return '1st_f_stressed'
  if (form.endsWith('یو')) return '2nd'
  
  return 'other'
}

/**
 * Get base word for a form (lookup from inflections or form_to_root)
 */
async function getBaseWord(db: D1Client, form: string): Promise<string> {
  // Try inflections table first
  const inflectionData = await db.queryFirst<{ base_word: string }>(
    `SELECT base_word FROM inflections WHERE inflected_form = ? LIMIT 1`,
    [form]
  )
  
  if (inflectionData?.base_word) {
    return inflectionData.base_word
  }
  
  // Try form_to_root table
  const rootData = await db.queryFirst<{ root_word: string }>(
    `SELECT root_word FROM form_to_root WHERE word_form = ? LIMIT 1`,
    [form]
  )
  
  if (rootData?.root_word) {
    return rootData.root_word
  }
  
  // Fallback: use form itself as base
  return form
}

/**
 * Process a batch of forms
 */
async function processBatch(
  db: D1Client,
  forms: FormToAnalyze[],
  batchNum: number,
  totalBatches: number
): Promise<number> {
  const results: Array<{
    form: string;
    base_word: string;
    reasons: InflectionReasonsResult;
    inflection_type: string;
  }> = []
  
  console.error(`\n📦 Processing batch ${batchNum}/${totalBatches} (${forms.length} forms)...`)
  
  // Process forms in parallel within batch
  const analysisPromises = forms.map(async (formItem) => {
    const form = formItem.form
    const baseWord = await getBaseWord(db, form)
    const reasons = await analyzeInflectionReasons(db, form, baseWord, 20)
    const inflectionType = determineInflectionType(form, baseWord)
    
    return {
      form,
      base_word: baseWord,
      reasons,
      inflection_type: inflectionType
    }
  })
  
  const batchResults = await Promise.all(analysisPromises)
  results.push(...batchResults)
  
  // Batch insert results
  if (results.length > 0) {
    const insertPromises = results.map(async (result) => {
      const { form, base_word, reasons, inflection_type } = result
      
      const sandwichTypesJson = JSON.stringify(reasons.sandwich_types)
      const exampleRefs = reasons.examples.slice(0, 3).map(e => e.verse_ref)
      const exampleRefsJson = JSON.stringify(exampleRefs)
      
      await db.query(
        `INSERT OR REPLACE INTO inflection_reasons_aggregated (
          pashto_form, base_word, plural_count, sandwich_count, 
          transitive_past_count, sandwich_types, example_verse_refs, 
          inflection_type, total_analyzed, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          form,
          base_word,
          reasons.plural,
          reasons.sandwich,
          reasons.transitive_past,
          sandwichTypesJson,
          exampleRefsJson,
          inflection_type,
          reasons.examples.length,
          Math.floor(Date.now() / 1000)
        ]
      )
    })
    
    await Promise.all(insertPromises)
    
    const formsWithReasons = results.filter(r => 
      r.reasons.plural > 0 || r.reasons.sandwich > 0 || r.reasons.transitive_past > 0
    )
    
    console.error(`  ✅ Batch ${batchNum} complete: ${formsWithReasons.length}/${results.length} forms have inflection reasons`)
  }
  
  return results.length
}

/**
 * Main batch processing function
 */
async function main() {
  const options = parseArgs()
  const batchSize = options.batchSize || 50
  const limit = options.limit
  const offset = options.offset || 0
  
  console.error('🚀 Starting batch inflection reasons analysis...')
  console.error(`   Batch size: ${batchSize}`)
  if (limit) console.error(`   Limit: ${limit} forms`)
  if (offset) console.error(`   Offset: ${offset}`)
  
  const db = getD1Database()
  if (!db) {
    console.error('❌ Error: D1 database not available')
    console.error('   Make sure you have D1 configured and are running with wrangler')
    process.exit(1)
  }
  
  const d1Client = new D1Client(db)
  
  try {
    // Get all noun/adjective forms from word_frequencies
    console.error('\n📊 Querying word_frequencies for noun/adjective forms...')
    
    let query = `
      SELECT DISTINCT pashto_word, frequency as frequency_total, pos
      FROM word_frequencies
      WHERE (pos LIKE 'n.%' OR pos LIKE '%adj%' OR pos LIKE '%noun%' OR pos = 'noun' OR pos = 'adjective')
        AND pashto_word IS NOT NULL
        AND pashto_word != ''
      ORDER BY frequency DESC
    `
    
    const params: any[] = []
    if (limit) {
      query += ` LIMIT ?`
      params.push(limit)
    }
    if (offset) {
      query = query.replace('LIMIT', `LIMIT ? OFFSET ?`)
      params.push(offset, limit || 1000000)
    }
    
    const forms = await d1Client.query<FormToAnalyze>(query, params)
    
    console.error(`   Found ${forms.length} forms to analyze`)
    
    if (forms.length === 0) {
      console.error('   No forms found. Exiting.')
      return
    }
    
    // Process in batches
    const totalBatches = Math.ceil(forms.length / batchSize)
    let processedCount = 0
    const startTime = Date.now()
    
    for (let i = 0; i < forms.length; i += batchSize) {
      const batch = forms.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      
      const batchStartTime = Date.now()
      const batchProcessed = await processBatch(d1Client, batch, batchNum, totalBatches)
      processedCount += batchProcessed
      
      const batchTime = Date.now() - batchStartTime
      const elapsed = Date.now() - startTime
      const avgTimePerForm = elapsed / processedCount
      const remaining = forms.length - processedCount
      const estimatedRemaining = Math.round((remaining * avgTimePerForm) / 1000 / 60) // minutes
      
      console.error(`   ⏱️  Batch ${batchNum} took ${(batchTime / 1000).toFixed(1)}s`)
      console.error(`   📈 Progress: ${processedCount}/${forms.length} (${((processedCount / forms.length) * 100).toFixed(1)}%)`)
      if (estimatedRemaining > 0) {
        console.error(`   ⏳ Estimated remaining: ~${estimatedRemaining} minutes`)
      }
      
      // Small delay between batches to avoid overwhelming the database
      if (i + batchSize < forms.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    const totalTime = Date.now() - startTime
    const minutes = Math.floor(totalTime / 60000)
    const seconds = Math.floor((totalTime % 60000) / 1000)
    
    console.error(`\n✅ Batch analysis complete!`)
    console.error(`   Total forms processed: ${processedCount}`)
    console.error(`   Total time: ${minutes}m ${seconds}s`)
    console.error(`   Average: ${(totalTime / processedCount).toFixed(0)}ms per form`)
    
  } catch (error) {
    console.error('❌ Error during batch analysis:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { analyzeInflectionReasons, main }

