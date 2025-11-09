/**
 * Conjugation Visualization Tool
 *
 * Creates visual conjugation tables from LingDocs data or D1 verb_forms
 * Similar to dictionary.lingdocs.com conjugation displays
 *
 * Usage:
 *   npx tsx scripts/visualize-conjugation.ts 1527815399
 *   npx tsx scripts/visualize-conjugation.ts --word وهل
 *   npx tsx scripts/visualize-conjugation.ts --word وهل --format html > conjugation.html
 */

import { fetchLingDocsWord, extractLingDocsForms } from './fetch-lingdocs-word';
import fs from 'fs/promises';
import path from 'path';

interface ConjugationTable {
  tense: string;
  aspect: 'imperfective' | 'perfective' | 'modal';
  forms: {
    person: string;
    singular?: string;
    plural?: string;
  }[];
}

interface VerbConjugationDisplay {
  lemma: string;
  verbType: string;
  transitivity?: string;
  helper?: string;
  tables: ConjugationTable[];
  participles?: {
    past?: string;
    present?: string;
  };
  lingdocsUrl: string;
}

/**
 * Organize forms into conjugation tables
 */
function organizeIntoTables(forms: Map<string, any>): ConjugationTable[] {
  const tables: ConjugationTable[] = [];

  // Group by tense and aspect
  const grouped = new Map<string, Map<string, any>>();

  for (const [form, metadata] of forms.entries()) {
    const key = `${metadata.aspect || 'imperfective'}_${metadata.tense || 'present'}`;

    if (!grouped.has(key)) {
      grouped.set(key, new Map());
    }

    const person = metadata.person || '3sg';
    grouped.get(key)!.set(person, form);
  }

  // Create tables from grouped data
  for (const [key, personMap] of grouped.entries()) {
    const [aspect, tense] = key.split('_');

    const table: ConjugationTable = {
      tense: formatTenseName(tense),
      aspect: aspect as any,
      forms: [],
    };

    // Organize by person (1, 2, 3) and number (sg, pl)
    const persons = ['1', '2', '3'];
    for (const person of persons) {
      const singular = personMap.get(`${person}sg`);
      const plural = personMap.get(`${person}pl`);

      if (singular || plural) {
        table.forms.push({
          person: formatPersonLabel(person),
          singular,
          plural,
        });
      }
    }

    if (table.forms.length > 0) {
      tables.push(table);
    }
  }

  return tables;
}

/**
 * Format tense name for display
 */
function formatTenseName(tense: string): string {
  const map: Record<string, string> = {
    'present': 'Present',
    'non-imperative': 'Non-Imperative',
    'imperative': 'Imperative',
    'subjunctive': 'Subjunctive',
    'past': 'Past',
    'future': 'Future',
  };
  return map[tense] || tense;
}

/**
 * Format person label
 */
function formatPersonLabel(person: string): string {
  const map: Record<string, string> = {
    '1': '1st Person',
    '2': '2nd Person',
    '3': '3rd Person',
  };
  return map[person] || person;
}

/**
 * Create ASCII table visualization
 */
function createAsciiTable(conjugation: VerbConjugationDisplay): string {
  let output = '';

  // Header
  output += '═'.repeat(80) + '\n';
  output += `  ${conjugation.lemma} - ${conjugation.verbType.toUpperCase()}`;
  if (conjugation.helper) {
    output += ` (with helper: ${conjugation.helper})`;
  }
  output += '\n';
  output += `  ${conjugation.lingdocsUrl}\n`;
  output += '═'.repeat(80) + '\n\n';

  // Verb metadata
  if (conjugation.transitivity) {
    output += `  Transitivity: ${conjugation.transitivity}\n\n`;
  }

  // Conjugation tables
  for (const table of conjugation.tables) {
    output += `┌─ ${table.aspect.toUpperCase()} - ${table.tense} ${'─'.repeat(60)}\n`;
    output += `│\n`;
    output += `│  ${'Person'.padEnd(15)} ${'Singular'.padEnd(25)} ${'Plural'.padEnd(25)}\n`;
    output += `│  ${'-'.repeat(15)} ${'-'.repeat(25)} ${'-'.repeat(25)}\n`;

    for (const row of table.forms) {
      const sg = row.singular || '—';
      const pl = row.plural || '—';
      output += `│  ${row.person.padEnd(15)} ${sg.padEnd(25)} ${pl.padEnd(25)}\n`;
    }

    output += `│\n`;
    output += `└${'─'.repeat(78)}\n\n`;
  }

  // Participles
  if (conjugation.participles) {
    output += `┌─ PARTICIPLES ${'─'.repeat(64)}\n`;
    if (conjugation.participles.past) {
      output += `│  Past:    ${conjugation.participles.past}\n`;
    }
    if (conjugation.participles.present) {
      output += `│  Present: ${conjugation.participles.present}\n`;
    }
    output += `└${'─'.repeat(78)}\n\n`;
  }

  return output;
}

/**
 * Create HTML table visualization
 */
function createHtmlTable(conjugation: VerbConjugationDisplay): string {
  let html = `
<!DOCTYPE html>
<html lang="en" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conjugation.lemma} - Conjugation Table</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5em;
    }
    .header .metadata {
      margin-top: 10px;
      opacity: 0.9;
    }
    .verb-type {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      margin: 5px;
      font-size: 0.9em;
    }
    .lingdocs-link {
      display: block;
      margin-top: 15px;
      color: #ffd700;
      text-decoration: none;
      font-weight: bold;
    }
    .lingdocs-link:hover {
      text-decoration: underline;
    }
    .table-container {
      background: white;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .table-title {
      font-size: 1.3em;
      font-weight: bold;
      margin-bottom: 15px;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      direction: rtl;
    }
    th, td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f8f9fa;
      font-weight: bold;
      color: #495057;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .pashto-text {
      font-size: 1.2em;
      font-weight: 500;
    }
    .participles {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .participle-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .participle-label {
      font-size: 0.9em;
      color: #6c757d;
      margin-bottom: 5px;
    }
    .participle-value {
      font-size: 1.3em;
      font-weight: bold;
      color: #212529;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${conjugation.lemma}</h1>
    <div class="metadata">
      <span class="verb-type">${conjugation.verbType.replace(/_/g, ' ').toUpperCase()}</span>
      ${conjugation.transitivity ? `<span class="verb-type">${conjugation.transitivity.toUpperCase()}</span>` : ''}
      ${conjugation.helper ? `<span class="verb-type">Helper: ${conjugation.helper}</span>` : ''}
    </div>
    <a href="${conjugation.lingdocsUrl}" target="_blank" class="lingdocs-link">
      📖 View in LingDocs Dictionary →
    </a>
  </div>
`;

  // Conjugation tables
  for (const table of conjugation.tables) {
    html += `
  <div class="table-container">
    <div class="table-title">${table.aspect.toUpperCase()} - ${table.tense}</div>
    <table>
      <thead>
        <tr>
          <th>Person</th>
          <th>Singular</th>
          <th>Plural</th>
        </tr>
      </thead>
      <tbody>
`;

    for (const row of table.forms) {
      html += `
        <tr>
          <td>${row.person}</td>
          <td class="pashto-text">${row.singular || '—'}</td>
          <td class="pashto-text">${row.plural || '—'}</td>
        </tr>
`;
    }

    html += `
      </tbody>
    </table>
  </div>
`;
  }

  // Participles
  if (conjugation.participles && (conjugation.participles.past || conjugation.participles.present)) {
    html += `
  <div class="table-container">
    <div class="table-title">PARTICIPLES</div>
    <div class="participles">
`;

    if (conjugation.participles.past) {
      html += `
      <div class="participle-box">
        <div class="participle-label">Past Participle</div>
        <div class="participle-value pashto-text">${conjugation.participles.past}</div>
      </div>
`;
    }

    if (conjugation.participles.present) {
      html += `
      <div class="participle-box">
        <div class="participle-label">Present Participle</div>
        <div class="participle-value pashto-text">${conjugation.participles.present}</div>
      </div>
`;
    }

    html += `
    </div>
  </div>
`;
  }

  html += `
</body>
</html>
`;

  return html;
}

/**
 * Get conjugation from D1 database
 */
async function getConjugationFromD1(db: any, lemma: string): Promise<VerbConjugationDisplay | null> {
  // Get verb metadata
  const verbRow = await db.prepare(`
    SELECT verb_type, transitivity, helper, source_word_id
    FROM verbs_lexicon
    WHERE pashto_word = ?
    LIMIT 1
  `).bind(lemma).first();

  if (!verbRow) {
    console.log(`❌ Verb "${lemma}" not found in verbs_lexicon`);
    return null;
  }

  // Get all conjugated forms
  const formRows = await db.prepare(`
    SELECT form, tense, person, number, aspect, gender
    FROM verb_forms
    WHERE base_verb = ?
    ORDER BY aspect, tense, person, number
  `).bind(lemma).all();

  if (!formRows || formRows.results.length === 0) {
    console.log(`❌ No forms found for "${lemma}" in verb_forms`);
    return null;
  }

  // Organize forms
  const forms = new Map<string, any>();
  for (const row of formRows.results) {
    const personKey = `${row.person}${row.number}`;
    forms.set(row.form, {
      form: row.form,
      tense: row.tense,
      person: personKey,
      aspect: row.aspect,
      gender: row.gender,
    });
  }

  const tables = organizeIntoTables(forms);

  return {
    lemma,
    verbType: verbRow.verb_type,
    transitivity: verbRow.transitivity,
    helper: verbRow.helper,
    tables,
    lingdocsUrl: verbRow.source_word_id
      ? `https://dictionary.lingdocs.com/word?id=${verbRow.source_word_id}`
      : `https://dictionary.lingdocs.com/?q=${encodeURIComponent(lemma)}`,
  };
}

/**
 * Get conjugation from LingDocs
 */
async function getConjugationFromLingDocs(wordId: number): Promise<VerbConjugationDisplay | null> {
  const wordData = await fetchLingDocsWord(wordId);
  if (!wordData) return null;

  const forms = extractLingDocsForms(wordData);
  const tables = organizeIntoTables(forms);

  const verbType = wordData.c?.includes('dyn. comp.') ? 'dynamic_compound'
    : wordData.c?.includes('stat. comp.') ? 'stative_compound'
    : 'simple';

  const transitivity = wordData.c?.includes('trans.') ? 'transitive'
    : wordData.c?.includes('intrans.') ? 'intransitive'
    : undefined;

  return {
    lemma: wordData.p,
    verbType,
    transitivity,
    helper: wordData.conjugation?.helper,
    tables,
    participles: {
      past: wordData.ppf,
      present: wordData.prf,
    },
    lingdocsUrl: `https://dictionary.lingdocs.com/word?id=${wordId}`,
  };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  let wordId: number | undefined;
  let lemma: string | undefined;
  let format: 'ascii' | 'html' = 'ascii';
  let source: 'lingdocs' | 'd1' = 'lingdocs';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--word') {
      lemma = args[++i];
      source = 'd1';
    } else if (args[i] === '--format') {
      format = args[++i] as any;
    } else if (args[i] === '--source') {
      source = args[++i] as any;
    } else if (!isNaN(parseInt(args[i]))) {
      wordId = parseInt(args[i]);
    }
  }

  if (!wordId && !lemma) {
    console.error(`❌ Usage: npx tsx scripts/visualize-conjugation.ts <wordId>`);
    console.error(`   Or:     npx tsx scripts/visualize-conjugation.ts --word <lemma>`);
    console.error(`   Options: --format [ascii|html] --source [lingdocs|d1]`);
    console.error(`\n   Examples:`);
    console.error(`     npx tsx scripts/visualize-conjugation.ts 1527815399`);
    console.error(`     npx tsx scripts/visualize-conjugation.ts --word وهل`);
    console.error(`     npx tsx scripts/visualize-conjugation.ts --word وهل --format html > conjugation.html`);
    process.exit(1);
  }

  let conjugation: VerbConjugationDisplay | null = null;

  // Get conjugation data
  if (source === 'lingdocs' && wordId) {
    console.error(`📡 Fetching conjugation from LingDocs (word ${wordId})...`);
    conjugation = await getConjugationFromLingDocs(wordId);
  } else if (source === 'd1' && lemma) {
    console.error(`💾 Fetching conjugation from D1 database...`);
    const { getD1Database } = await import('../utils/d1');
    const db = getD1Database();
    if (!db) {
      console.error(`❌ D1 database not available`);
      process.exit(1);
    }
    conjugation = await getConjugationFromD1(db, lemma);
  }

  if (!conjugation) {
    console.error(`❌ Failed to get conjugation data`);
    process.exit(1);
  }

  // Generate visualization
  if (format === 'html') {
    const html = createHtmlTable(conjugation);
    console.log(html);
  } else {
    const ascii = createAsciiTable(conjugation);
    console.log(ascii);
  }

  // Save to file if HTML
  if (format === 'html') {
    const filename = `conjugation-${conjugation.lemma}-${Date.now()}.html`;
    const filepath = path.join(process.cwd(), 'app/data/conjugations', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, createHtmlTable(conjugation));
    console.error(`\n💾 Saved HTML to: ${filepath}`);
    console.error(`🌐 Open in browser: file://${filepath}`);
  }
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { createAsciiTable, createHtmlTable, getConjugationFromD1, getConjugationFromLingDocs };
