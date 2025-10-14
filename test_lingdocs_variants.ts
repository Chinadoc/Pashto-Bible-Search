import assert from 'node:assert/strict';

import { generateVerbVariantsLingDocs } from './app/utils/lingdocs_integration';

async function main() {
  const variants = await generateVerbVariantsLingDocs('کول', { cap: 200 });
  const forms = new Set(variants.map((v) => v.form));

  const requiredAbilityForms = ['کولی شم', 'کولی شو', 'کولی شې', 'کولی شئ', 'کولی شي'];
  for (const form of requiredAbilityForms) {
    assert.ok(forms.has(form), `Expected ability form "${form}" to be present`);
  }

  const present1sg = variants.find((variant) => variant.label === '1sg Present');
  assert.ok(present1sg, 'Expected 1sg present form to be labeled correctly');
  assert.equal(present1sg?.form, 'کوم', 'Expected 1sg present form to be "کوم"');

  console.log('✅ LingDocs variants sanity check passed.');
}

main().catch((error) => {
  console.error('❌ LingDocs variants sanity check failed.');
  console.error(error);
  process.exit(1);
});
