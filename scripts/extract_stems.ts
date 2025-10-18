#!/usr/bin/env ts-node
/**
 * Extract stems from irregular verbs database for split/suppletive/transport families
 * Creates a stems.csv file for import into the stems table
 */
import fs from 'node:fs/promises';

type StemData = {
  lemma_id?: string;  // Will be filled in later when we have lemma IDs
  lemma_pashto: string;
  stem_type: 'present' | 'subjunctive' | 'perfective' | 'past_participle';
  value: string;
  confidence: number;
  source: 'irregular_database';
};

async function extractStems() {
  console.log('🔍 Extracting stems from irregular verbs database...');

  // Read the irregular verbs from the search_phrase route file
  const routeFile = await fs.readFile('app/api/search_phrase/route.ts', 'utf8');

  // Extract the IRREGULAR_VERBS object (this is a simplified extraction)
  const irregularVerbsMatch = routeFile.match(/const IRREGULAR_VERBS: Record<string, \{[^}]*\}\> = \{([\s\S]*?)\};/);

  if (!irregularVerbsMatch) {
    throw new Error('Could not find IRREGULAR_VERBS definition');
  }

  const verbsContent = irregularVerbsMatch[1];
  const stems: StemData[] = [];

  // Parse each verb entry (this is a simplified parser for the known format)
  const verbMatches = verbsContent.match(/'([^']+)': \{[^}]*meaning: '[^']+',[^}]*imperfectiveStem: '([^']*)',[^}]*perfectiveStem: '([^']*)',[^}]*pastParticiple: '([^']*)'/g);

  if (!verbMatches) {
    throw new Error('Could not parse verb entries');
  }

  for (const match of verbMatches || []) {
    const [, lemma, imperfectiveStem, perfectiveStem, pastParticiple] = match.match(/'([^']+)': \{[^}]*meaning: '[^']+',[^}]*imperfectiveStem: '([^']*)',[^}]*perfectiveStem: '([^']*)',[^}]*pastParticiple: '([^']*)'/) || [];

    if (lemma && (imperfectiveStem || perfectiveStem || pastParticiple)) {
      // Add present stem (using imperfectiveStem as present)
      if (imperfectiveStem) {
        stems.push({
          lemma_pashto: lemma,
          stem_type: 'present',
          value: imperfectiveStem,
          confidence: 1.0,
          source: 'irregular_database'
        });
      }

      // Add perfective stem
      if (perfectiveStem) {
        stems.push({
          lemma_pashto: lemma,
          stem_type: 'perfective',
          value: perfectiveStem,
          confidence: 1.0,
          source: 'irregular_database'
        });
      }

      // Add past participle stem
      if (pastParticiple) {
        stems.push({
          lemma_pashto: lemma,
          stem_type: 'past_participle',
          value: pastParticiple,
          confidence: 1.0,
          source: 'irregular_database'
        });
      }
    }
  }

  // Write stems to CSV
  const csvContent = 'lemma_pashto,stem_type,value,confidence,source\n' +
    stems.map(stem =>
      `${stem.lemma_pashto},${stem.stem_type},${stem.value},${stem.confidence},${stem.source}`
    ).join('\n');

  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/stems.csv', csvContent, 'utf8');

  console.log(`✅ Extracted ${stems.length} stems from irregular verbs database`);
  console.log('📁 Wrote reports/stems.csv');

  // Show summary by lemma
  const lemmaCounts = stems.reduce((acc, stem) => {
    acc[stem.lemma_pashto] = (acc[stem.lemma_pashto] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 Stems by lemma:');
  Object.entries(lemmaCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([lemma, count]) => {
      console.log(`  ${lemma}: ${count} stems`);
    });
}

extractStems().catch(console.error);
