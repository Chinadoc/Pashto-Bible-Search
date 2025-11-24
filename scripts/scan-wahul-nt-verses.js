#!/usr/bin/env node

/**
 * Comprehensive Verse Scanner for Wahul Forms
 * Scans all NT Afghan 2023 verses for verb forms of wahul
 * using enhanced LingDocs grammar rules
 */

const WORKER_URL = process.env.WORKER_URL || 'https://pashto-bible-api.jeremysamuels1.workers.dev';

// Generate comprehensive wahul forms using LingDocs grammar
function generateWahulForms() {
  const base = 'وه';  // wah-
  const forms = [];  // FIX: Added missing const declaration

  // 1. PRESENT TENSE (imperfective stem)
  const presentEndings = [
    { ending: 'م', label: '1st sing', person: '1st' },
    { ending: 'ې', label: '2nd sing', person: '2nd' },
    { ending: 'ي', label: '3rd sing', person: '3rd' },
    { ending: 'و', label: '1st plur', person: '1st' },
    { ending: 'ئ', label: '2nd plur', person: '2nd' },
  ];

  presentEndings.forEach(({ ending, label, person }) => {
    forms.push({ form: base + ending, label: `present ${label}`, person, tense: 'present', type: 'simple' });
  });

  // 2. PERFECTIVE FORMS (join head: ووه-)
  const perfectiveStem = 'ووه';
  presentEndings.forEach(({ ending, label, person }) => {
    forms.push({ form: perfectiveStem + ending, label: `perfective ${label}`, person, tense: 'future', type: 'perfective' });
  });

  // 3. PAST TENSE
  const pastRoot = 'ووهل';
  const pastEndings = [
    { ending: 'م', label: '1st sing', person: '1st' },
    { ending: 'ې', label: '2nd sing', person: '2nd' },
    { ending: 'و', label: '3rd masc', person: '3rd' },
    { ending: 'ه', label: '3rd fem', person: '3rd' },
    { ending: 'و', label: '1st plur', person: '1st' },
    { ending: 'ئ', label: '2nd plur', person: '2nd' },
    { ending: 'ل', label: '3rd plur', person: '3rd' },
  ];

  pastEndings.forEach(({ ending, label, person }) => {
    forms.push({ form: pastRoot + ending, label: `past ${label}`, person, tense: 'past', type: 'past' });
  });

  // 4. PASSIVE CONSTRUCTIONS (CRITICAL for Bible!)
  forms.push(
    { form: 'وهل کېږم', label: 'passive 1st sing', person: '1st', tense: 'present', type: 'passive' },
    { form: 'وهل کېږې', label: 'passive 2nd sing', person: '2nd', tense: 'present', type: 'passive' },
    { form: 'وهل کېږي', label: 'passive 3rd sing', person: '3rd', tense: 'present', type: 'passive' },
    { form: 'وهل کېږو', label: 'passive 1st plur', person: '1st', tense: 'present', type: 'passive' },
    { form: 'وهل کېږئ', label: 'passive 2nd plur', person: '2nd', tense: 'present', type: 'passive' },
    { form: 'وهل شي', label: 'passive subjunctive', tense: 'future', type: 'passive' },
    { form: 'وهل شو', label: 'passive past', tense: 'past', type: 'passive' },
  );

  // 5. PERFECT TENSE
  const pastParticiple = 'وهلی';
  forms.push(
    { form: `${pastParticiple} یم`, label: 'perfect 1st sing', person: '1st', tense: 'perfect', type: 'perfect' },
    { form: `${pastParticiple} یې`, label: 'perfect 2nd sing', person: '2nd', tense: 'perfect', type: 'perfect' },
    { form: `${pastParticiple} دی`, label: 'perfect 3rd masc', person: '3rd', tense: 'perfect', type: 'perfect' },
    { form: `${pastParticiple} ده`, label: 'perfect 3rd fem', person: '3rd', tense: 'perfect', type: 'perfect' },
  );

  // 6. INFINITIVE & PARTICLES
  forms.push(
    { form: 'وهل', label: 'infinitive', type: 'base' },
    { form: pastParticiple, label: 'past participle', type: 'base' },
  );

  // 7. COMPOUND CONSTRUCTIONS (found in Bible)
  forms.push(
    { form: 'وهلو', label: 'past 1st/3rd plur', person: '1st', tense: 'past', type: 'simple' },
    { form: 'وواژه', label: 'past 3rd variation', person: '3rd', tense: 'past', type: 'variation' },
  );

  return forms;
}

async function scanNTVerses() {
  console.log('🔍 Scanning All NT Afghan 2023 Verses for Wahul Forms\n');
  console.log('='.repeat(70));

  const forms = generateWahulForms();
  console.log(`\n📊 Generated ${forms.length} comprehensive wahul forms\n`);

  // Fetch all NT verses
  console.log('📖 Fetching NT verses from Cloudflare...');
  const response = await fetch(`${WORKER_URL}/api/verses?translation=afghan2023&testament=NT&limit=10000`);

  if (!response.ok) {
    throw new Error(`Failed to fetch verses: ${response.statusText}`);
  }

  const data = await response.json();
  const verses = data.verses || [];  // Fix: use verses property
  console.log(`✅ Loaded ${verses.length} NT verses\n`);

  // Scan for matches
  console.log('🔎 Scanning verses for wahul forms...\n');

  const matches = [];
  const formStats = new Map();

  verses.forEach(verse => {
    const text = verse.text || '';
    const collapsedText = text.toLowerCase().replace(/\s+/g, '');

    const matchedForms = [];
    forms.forEach(formObj => {
      const collapsedForm = formObj.form.toLowerCase().replace(/\s+/g, '');
      if (collapsedText.includes(collapsedForm)) {
        matchedForms.push(formObj);

        // Track stats
        const count = formStats.get(formObj.form) || 0;
        formStats.set(formObj.form, count + 1);
      }
    });

    if (matchedForms.length > 0) {
      matches.push({
        ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        matchedForms: matchedForms,
      });
    }
  });

  console.log(`\n✅ Found ${matches.length} verses containing wahul forms\n`);

  // Sort form stats
  const sortedStats = Array.from(formStats.entries())
    .sort((a, b) => b[1] - a[1]);

  console.log('📈 Top 20 Most Common Forms:');
  sortedStats.slice(0, 20).forEach(([form, count], idx) => {
    console.log(`${(idx + 1).toString().padStart(3)}. ${form.padEnd(15)} → ${count} verses`);
  });

  // Generate HTML report
  const html = generateHTMLReport(matches, sortedStats, forms);
  const fs = require('fs');
  fs.writeFileSync('wahul-verse-scan.html', html);

  console.log(`\n\n✅ Report saved to: wahul-verse-scan.html`);
  console.log('   Open in browser to view results!\n');

  return { matches, sortedStats };
}

function generateHTMLReport(matches, sortedStats, allForms) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ps">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wahul Verb Forms - NT Verse Scan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .subtitle { opacity: 0.9; font-size: 1.1em; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 30px;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      margin-top: 5px;
    }
    .tabs {
      display: flex;
      border-bottom: 2px solid #eee;
      padding: 0 30px;
    }
    .tab {
      padding: 15px 30px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 16px;
      color: #666;
      transition: all 0.3s;
    }
    .tab.active {
      color: #667eea;
      border-bottom: 3px solid #667eea;
      font-weight: bold;
    }
    .tab-content {
      display: none;
      padding: 30px;
    }
    .tab-content.active { display: block; }
    .verse-card {
      background: #f8f9fa;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    .verse-ref {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    .verse-text {
      font-size: 1.1em;
      line-height: 1.8;
      color: #333;
      font-family: 'Arial', sans-serif;
    }
    .matched-forms {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .form-badge {
      background: #667eea;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.9em;
    }
    .form-badge.passive { background: #e74c3c; }
    .form-badge.perfect { background: #27ae60; }
    .form-badge.base { background: #f39c12; }
    .stats-table {
      width: 100%;
      border-collapse: collapse;
    }
    .stats-table th,
    .stats-table td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #eee;
    }
    .stats-table th {
      background: #f8f9fa;
      font-weight: bold;
      color: #667eea;
    }
    .stats-table tr:hover {
      background: #f8f9fa;
    }
    .bar {
      background: #667eea;
      height: 6px;
      border-radius: 3px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>وهل - Wahul Verb Forms Analysis</h1>
      <div class="subtitle">Comprehensive Scan of New Testament (Afghan 2023)</div>
    </header>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">${matches.length}</div>
        <div class="stat-label">Total Verses</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${sortedStats.length}</div>
        <div class="stat-label">Unique Forms Found</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${allForms.length}</div>
        <div class="stat-label">Forms Generated</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${((sortedStats.length / allForms.length) * 100).toFixed(0)}%</div>
        <div class="stat-label">Coverage</div>
      </div>
    </div>
    
    <div class="tabs">
      <button class="tab active" onclick="showTab('verses')">📖 Verses (${matches.length})</button>
      <button class="tab" onclick="showTab('stats')">📊 Statistics</button>
    </div>
    
    <div id="verses-tab" class="tab-content active">
      ${matches.map(match => `
        <div class="verse-card">
          <div class="verse-ref">${match.ref}</div>
          <div class="verse-text">${match.text}</div>
          <div class="matched-forms">
            ${match.matchedForms.map(f => `
              <span class="form-badge ${f.type}">${f.form}</span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div id="stats-tab" class="tab-content">
      <table class="stats-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Form</th>
            <th>Label</th>
            <th>Count</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody>
          ${sortedStats.map(([form, count], idx) => {
    const formObj = allForms.find(f => f.form === form);
    const maxCount = sortedStats[0][1];
    const barWidth = (count / maxCount * 100);
    return `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${form}</strong></td>
                <td>${formObj?.label || 'unknown'}</td>
                <td><strong>${count}</strong> verses</td>
                <td><div class="bar" style="width: ${barWidth}%"></div></td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    function showTab(tabName) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    }
  </script>
</body>
</html>`;
}

// Run the scanner
scanNTVerses()
  .then(({ matches, sortedStats }) => {
    console.log('\n✨ Scan complete!');
    console.log(`\nKey findings:`);
    console.log(`  - ${matches.length} verses contain wahul forms`);
    console.log(`  - ${sortedStats.length} unique forms found in actual usage`);
    console.log(`  - Top form: "${sortedStats[0][0]}" (${sortedStats[0][1]} occurrences)`);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
