/**
 * Test verb inference with example word "وفرمایيل"
 */

function inferVerbRootFromForm(form) {
  let prefix = null;
  let root = form;
  
  // Remove verb prefixes
  if (form.startsWith('و')) {
    prefix = 'و';
    root = form.slice(1);
  } else if (form.startsWith('به')) {
    prefix = 'به';
    root = form.slice(2);
  } else if (form.startsWith('تر')) {
    prefix = 'تر';
    root = form.slice(2);
  }
  
  const isPerfective = prefix === 'و';
  let isTransitive = false;
  let confidence = 'low';
  
  // Check for verb endings
  const verbEndings = ['م', 'ې', 'ي', 'و', 'ئ', 'ه', 'ل'];
  for (const ending of verbEndings) {
    if (root.endsWith(ending) && root.length > ending.length) {
      root = root.slice(0, -ending.length);
      confidence = prefix ? 'high' : 'medium';
      break;
    }
  }
  
  // Check for verb markers
  if (root.endsWith('ول')) {
    isTransitive = true;
    confidence = 'high';
    root = root.slice(0, -2) + 'ول';
  } else if (root.endsWith('ېدل') || root.endsWith('یدل')) {
    isTransitive = false;
    confidence = 'high';
    root = root.slice(0, -3) + 'ېدل';
  } else if (root.endsWith('کول')) {
    isTransitive = true;
    confidence = 'high';
    root = root.slice(0, -3) + 'کول';
  } else if (root.endsWith('کېدل')) {
    isTransitive = false;
    confidence = 'high';
    root = root.slice(0, -4) + 'کېدل';
  }
  
  if (root === form && !prefix) {
    return {
      root: null,
      isTransitive: false,
      isPerfective: false,
      confidence: 'low',
    };
  }
  
  return {
    root: root || form,
    isTransitive,
    isPerfective,
    confidence,
  };
}

// Test with "وفرمایيل"
const testWord = 'وفرمایيل';
const analysis = inferVerbRootFromForm(testWord);

console.log('Testing verb inference for:', testWord);
console.log('\nAnalysis:');
console.log('  Prefix:', analysis.prefix || 'none');
console.log('  Inferred Root:', analysis.root);
console.log('  Is Transitive:', analysis.isTransitive);
console.log('  Is Perfective:', analysis.isPerfective);
console.log('  Confidence:', analysis.confidence);

// Expected: root should be "فرمايول" or similar
console.log('\nExpected:');
console.log('  Root: فرمايول (to do/make)');
console.log('  POS: v. trans.');
console.log('  Inflection: perfective_past');

