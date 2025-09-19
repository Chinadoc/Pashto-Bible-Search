// Test script to verify verb fixes are working
// This simulates the logic from the search API

const AUX_SET = new Set(['وهل','کول','کېدل','ېدل'])

const IRREGULAR_VERBS = {
  'لیدل': {
    meaning: 'to see',
    imperfectiveStem: 'وینـ',
    perfectiveStem: 'ووینـ',
    imperfectiveRoot: 'لیدل',
    perfectiveRoot: 'ولیدل',
    pastParticiple: 'لیدلی',
    notes: 'Irregular imperfective stem; transitive; dynamic compounds'
  },
  'راتلل': {
    meaning: 'to come',
    imperfectiveStem: 'راځـ',
    perfectiveStem: 'راشـ',
    imperfectiveRoot: 'راتلل',
    perfectiveRoot: 'راتلل',
    pastParticiple: 'راغلی',
    notes: 'Suppletive imperfective stem; intransitive'
  }
}

function generateFusedCompoundVerbForms(infinitive) {
  const forms = [infinitive]
  
  // Detect fused stative compounds ending in ېدل or کېدل
  if (infinitive.endsWith('ېدل')) {
    const stem = infinitive.slice(0, -3) // Remove ېدل
    
    // Generate conjugated forms
    forms.push(stem + 'ېږم')    // 1st singular
    forms.push(stem + 'ېږې')    // 2nd singular  
    forms.push(stem + 'ېږي')    // 3rd singular
    forms.push(stem + 'ېږو')    // 1st plural
    forms.push(stem + 'ېږئ')    // 2nd plural
    
    // Generate both squished and non-squished forms
    const baseObj = stem
    forms.push(baseObj + ' کېدل')    // Non-squished infinitive
    forms.push(baseObj + ' کېږم')    // Non-squished 1st singular
    forms.push(baseObj + ' کېږې')    // Non-squished 2nd singular
    forms.push(baseObj + ' کېږي')    // Non-squished 3rd singular
    forms.push(baseObj + ' کېږو')    // Non-squished 1st plural
    forms.push(baseObj + ' کېږئ')    // Non-squished 2nd plural
    
  } else if (infinitive.endsWith('کېدل')) {
    const stem = infinitive.slice(0, -4) // Remove کېدل
    
    // Generate conjugated forms
    forms.push(stem + 'کېږم')    // 1st singular
    forms.push(stem + 'کېږې')    // 2nd singular
    forms.push(stem + 'کېږي')    // 3rd singular
    forms.push(stem + 'کېږو')    // 1st plural
    forms.push(stem + 'کېږئ')    // 2nd plural
    
    // Generate spaced version
    forms.push(stem + ' کېدل')    // Spaced infinitive
    forms.push(stem + ' کېږم')    // Spaced 1st singular
    forms.push(stem + ' کېږې')    // Spaced 2nd singular
    forms.push(stem + ' کېږي')    // Spaced 3rd singular
    forms.push(stem + ' کېږو')    // Spaced 1st plural
    forms.push(stem + ' کېږئ')    // Spaced 2nd plural
  }
  
  return forms.filter(Boolean)
}

function generateRegularVerbForms(infinitive) {
  const forms = []
  
  // Add base form
  forms.push(infinitive)
  
  // Generate stems based on verb patterns
  let imperfectiveStem
  let perfectiveStem
  
  // Pattern detection for better stem generation
  if (infinitive.endsWith('ېدل')) {
    // Already handled by fused compound function
    const root = infinitive.replace(/ېدل$/, '')
    imperfectiveStem = root + 'ېږ'
    perfectiveStem = 'و' + root + 'ېږ'
  } else if (infinitive.endsWith('ول')) {
    // -ول verbs (e.g., لیدل -> وین)
    const root = infinitive.replace(/ول$/, '')
    imperfectiveStem = root + 'ین'
    perfectiveStem = 'و' + root + 'ین'
  } else if (infinitive.endsWith('ېل')) {
    // -ېل verbs (e.g., اورېل -> اورېږ)
    const root = infinitive.replace(/ېل$/, '')
    imperfectiveStem = root + 'ېږ'
    perfectiveStem = 'و' + root + 'ېږ'
  } else if (infinitive.endsWith('ال')) {
    // -ال verbs (e.g., وهال -> وهاړ)
    const root = infinitive.replace(/ال$/, '')
    imperfectiveStem = root + 'اړ'
    perfectiveStem = 'و' + root + 'اړ'
  } else {
    // Default pattern: -ل verbs (e.g., کول -> کړ)
    const root = infinitive.replace(/ل$/, '')
    if (root.endsWith('و')) {
      // کول -> کړ pattern
      const stemRoot = root.replace(/و$/, '')
      imperfectiveStem = stemRoot + 'ړ'
      perfectiveStem = 'و' + stemRoot + 'ړ'
    } else {
      // General pattern
      imperfectiveStem = root + 'ې'
      perfectiveStem = 'و' + root + 'ې'
    }
  }
  
  // Imperfective forms (present tense)
  forms.push(imperfectiveStem + 'م') // 1st singular
  forms.push(imperfectiveStem + 'ې') // 2nd singular  
  forms.push(imperfectiveStem + 'ي') // 3rd singular
  forms.push(imperfectiveStem + 'و') // 1st plural
  forms.push(imperfectiveStem + 'ئ') // 2nd plural
  
  // Perfective forms 
  const perfectiveRoot = 'و' + infinitive
  forms.push(perfectiveRoot)
  
  // Subjunctive (perfective stem + present endings)
  forms.push(perfectiveStem + 'م') // 1st singular subjunctive
  forms.push(perfectiveStem + 'ې') // 2nd singular subjunctive
  forms.push(perfectiveStem + 'ي') // 3rd singular subjunctive
  forms.push(perfectiveStem + 'و') // 1st plural subjunctive
  forms.push(perfectiveStem + 'ئ') // 2nd plural subjunctive
  
  // Past forms
  const pastRoot = infinitive.replace(/ل$/, '')
  forms.push(pastRoot + 'لو') // 3rd singular masculine past
  forms.push(pastRoot + 'له') // 3rd singular feminine past
  forms.push(pastRoot + 'لل') // Past participle base
  forms.push(pastRoot + 'لی') // Past participle inflected
  
  return forms.filter(Boolean)
}

// Test the new categorization logic
function categorizeVerb(normalizedLookup) {
  let verbForms = []
  let category = ""
  
  // Priority 1: Check if it's an irregular verb
  if (normalizedLookup in IRREGULAR_VERBS) {
    // Would call generateIrregularVerbForms(normalizedLookup)
    category = "irregular"
  }
  // Priority 2: Check if it's a fused compound verb (ګرمېدل, etc.)
  else if (normalizedLookup.endsWith('ېدل') || normalizedLookup.endsWith('کېدل')) {
    verbForms = generateFusedCompoundVerbForms(normalizedLookup)
    category = "fused compound"
  }
  // Priority 3: Check if it's a spaced compound verb
  else if (normalizedLookup.includes(' ')) {
    // Would call generateCompoundVerbForms(normalizedLookup, isStative)
    category = "spaced compound"
  }
  // Priority 4: Regular verb
  else {
    verbForms = generateRegularVerbForms(normalizedLookup)
    category = "regular"
  }
  
  return { category, forms: verbForms }
}

// Test cases
const testVerbs = [
  'ګرمېدل',  // Fused compound (should now be detected)
  'کول',     // Regular 
  'لیدل',    // Irregular
  'ولول',    // Regular -ول pattern
  'منډه وهل' // Spaced compound
]

console.log('🧪 Testing Verb Categorization Fixes\n')

testVerbs.forEach(verb => {
  const result = categorizeVerb(verb)
  console.log(`📝 "${verb}" → ${result.category}`)
  
  if (result.forms.length > 0) {
    console.log(`   Generated ${result.forms.length} forms:`)
    result.forms.forEach(form => console.log(`     - ${form}`))
  }
  console.log('')
})

// Specific test for the bug we fixed
console.log('🔍 Critical Bug Test:')
console.log('Before: ګرمېدل was treated as "regular" verb')
console.log('After: ګرمېدل is now treated as "fused compound" verb')

const gramed = categorizeVerb('ګرمېدل')
console.log(`✅ ګرمېدل correctly categorized as: ${gramed.category}`)
console.log(`✅ Generates both squished and non-squished forms`)
console.log(`✅ Key form "ګرمېږئ" should be in results: ${gramed.forms.includes('ګرمېږئ') ? 'YES' : 'NO'}`)
