const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
<<<<<<< HEAD
const statsEl = document.getElementById('stats');
const coverageEl = document.getElementById('coverage');
const scopeSel = document.getElementById('scope');
const goBtn = document.getElementById('go');

let bibleData = [];
let activeTab = 'search';
let bookFilter = '';
let scope = 'nt';
// Optional backend API. If set, verse and single-word (grammar) queries will use backend first.
// Example: 'https://pashto-bible-api-xxxxxx-uc.a.run.app'
const API_BASE = 'https://pashto-bible-api-281632663246.us-central1.run.app';
let debounceId = null;
let worker = null;
let useWorker = false;

// Simple LRU cache for last 100 queries
const lru = (() => {
  const map = new Map();
  const limit = 100;
  return {
    get(k) {
      if (!map.has(k)) return undefined;
      const v = map.get(k);
      map.delete(k);
      map.set(k, v);
      return v;
    },
    set(k, v) {
      if (map.has(k)) map.delete(k);
      map.set(k, v);
      while (map.size > limit) {
        const firstKey = map.keys().next().value;
        map.delete(firstKey);
      }
    }
  };
})();
=======

let bibleData = [];
let debounceId = null;
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b

function highlight(text, query) {
  if (!query) return text;
  try {
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${esc})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  } catch (e) {
    return text;
  }
}

function displayResults(results, query) {
  if (!Array.isArray(results)) return;
  if (results.length === 0) {
    resultsList.innerHTML = '<p class="meta">هیڅ نتیجه ونه موندل شوه</p>';
<<<<<<< HEAD
    coverageEl.innerHTML = '';
    return;
  }
  // Incremental rendering to keep UI responsive with large lists
  resultsList.innerHTML = '';
  const chunkSize = 100;
  let i = 0;
  // coverage chips (right-rail like)
  try {
    const counts = {};
    for (const v of results) {
      const ref = v.ref || '';
      const book = ref.split(' ').slice(0, -1).join(' ') || ref.split(' ')[0] || '';
      if (!book) continue;
      counts[book] = (counts[book] || 0) + 1;
    }
    const items = Object.entries(counts).sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0]));
    const chips = items.map(([b,c]) => `<button class="chip${bookFilter===b?' active':''}" data-book="${b}">${b} · ${c}</button>`).join(' ');
    const clear = bookFilter ? '<button class="chip" data-book="">Show all</button>' : '';
    coverageEl.innerHTML = `<div class="chips">${clear}${chips}</div>`;
    coverageEl.querySelectorAll('button[data-book]').forEach(btn => {
      btn.addEventListener('click', () => {
        bookFilter = btn.getAttribute('data-book') || '';
        // Re-run with same last query
        doSearch(searchInput.value);
      });
    });
  } catch {}
  function appendChunk() {
    const slice = results.slice(i, i + chunkSize);
    if (slice.length === 0) return;
    const html = slice.map(v => {
      const h = highlight(v.text, query);
      const audioBtn = API_BASE ? `<button class="more" data-ref="${escapeAttr(v.ref)}" onclick="toggleAudio(this)">Audio</button><div class="audio-slot"></div>` : '';
      return `<div class="result"><div class="ref">${v.ref}</div><div class="text">${h}</div>${audioBtn}</div>`;
    }).join('');
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const nodes = Array.from(tmp.childNodes);
    for (const n of nodes) resultsList.appendChild(n);
    i += chunkSize;
    if (i < results.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(appendChunk);
      } else {
        setTimeout(appendChunk, 0);
      }
    }
  }
  appendChunk();
}

function updateStats(count, ms) {
  if (!statsEl) return;
  const parts = [];
  if (typeof count === 'number') parts.push(`ټولې نتايج: ${count}`);
  if (typeof ms === 'number') parts.push(`وخت: ${ms.toFixed(1)}ms`);
  statsEl.textContent = parts.join(' • ');
=======
    return;
  }
  const html = results.slice(0, 200).map(v => {
    const h = highlight(v.text, query);
    return `<div class="result"><div class="ref">${v.ref}</div><div class="text">${h}</div></div>`;
  }).join('');
  resultsList.innerHTML = html;
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b
}

function doSearch(query) {
  const q = (query || '').trim();
  if (!q) {
    resultsList.innerHTML = '';
<<<<<<< HEAD
    updateStats(0, 0);
    return;
  }
  // Simple classifiers
  const isVerseRef = /^\s*[A-Za-z\s]+\s\d+:\d+\s*$/.test(q);
  const isSingleWord = q.split(/\s+/).length === 1;
  const isPhrase = !isVerseRef && !isSingleWord;
  const cached = lru.get(q);
  if (cached) {
    displayResults(cached.results, q);
    updateStats(cached.results.length, cached.ms);
    return;
  }
  const start = performance.now();

  // Backend-first for verse, single-word (grammar), and phrase, if API configured
  if (API_BASE && (isVerseRef || isSingleWord || isPhrase)) {
    const endpoint = isSingleWord ? '/search/grammar' : '/search/phrase';
    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, scope: scope || 'all', limit: 500 }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(data => {
        let results = isSingleWord ? (data.occurrences || []) : (data.results || []);
        if (bookFilter) {
          results = results.filter(v => (v.ref || '').startsWith(bookFilter + ' '));
        }
        displayResults(results, q);
        // Show related forms panel for single-word grammar results
        try {
          if (isSingleWord && data && data.conjugations && data.conjugations.related_forms && data.conjugations.related_forms.length > 0) {
            const root = data.conjugations.root || '';
            const panel = document.createElement('div');
            panel.className = 'result related-forms-panel';
            const rom = data.conjugations.query_rom ? ` <span class="meta">(${data.conjugations.query_rom})</span>` : '';

            // Create related forms list
            const formsHtml = data.conjugations.related_forms.map(form => {
              const count = form.count || 0;
              const translit = form.translit ? ` <span class="meta">(${form.translit})</span>` : '';
              return `<div class="related-form" data-form="${form.form}">${form.form}${translit} · ${count} occurrences</div>`;
            }).join('');

            const totalForms = data.conjugations.related_forms.length;
            panel.innerHTML = `<div class="ref">Related Forms · ${root}${rom} · ${totalForms} forms</div><div class="related-forms-list">${formsHtml}</div>`;

            // Add click handlers for related forms
            panel.querySelectorAll('.related-form').forEach(el => {
              el.addEventListener('click', () => {
                const form = el.getAttribute('data-form');
                if (form) {
                  searchInput.value = form;
                  doSearch(form);
                }
              });
            });

            resultsList.prepend(panel);
          }
        } catch {}
        const ms = performance.now() - start;
        updateStats(results.length, ms);
        lru.set(q, { results, ms });
      })
      .catch(() => {
        // Fallback to local substring search
        let matches = bibleData.filter(v => v.text && v.text.includes(q));
        if (scope !== 'all') {
          matches = matches.filter(v => (scope==='nt' ? isNT(v.ref) : isOT(v.ref)));
        }
        if (bookFilter) {
          matches = matches.filter(v => (v.ref || '').startsWith(bookFilter + ' '));
        }
        const ms = performance.now() - start;
        displayResults(matches, q);
        updateStats(matches.length, ms);
        lru.set(q, { results: matches, ms });
      });
    return;
  }
  if (useWorker && worker) {
    const id = Math.random().toString(36).slice(2);
    const onMessage = (ev) => {
      const { type, results, done, id: msgId } = ev.data || {};
      if (msgId !== id) return;
      if (type === 'partial') {
        displayResults(results, q);
        updateStats(results.length);
      } else if (type === 'final') {
        displayResults(results, q);
        const ms = performance.now() - start;
        updateStats(results.length, ms);
        lru.set(q, { results, ms });
        worker.removeEventListener('message', onMessage);
      }
    };
    worker.addEventListener('message', onMessage);
    worker.postMessage({ id, type: 'search', query: q });
  } else {
    const qn = q;
    let matches = bibleData.filter(v => v.text && v.text.includes(qn));
    if (scope !== 'all') {
      matches = matches.filter(v => (scope==='nt' ? isNT(v.ref) : isOT(v.ref)));
    }
    if (bookFilter) {
      matches = matches.filter(v => (v.ref || '').startsWith(bookFilter + ' '));
    }
    const ms = performance.now() - start;
    displayResults(matches, q);
    updateStats(matches.length, ms);
    lru.set(q, { results: matches, ms });
  }
=======
    return;
  }
  const qn = q; // keep simple substring for now
  const matches = bibleData.filter(v => v.text && v.text.includes(qn));
  displayResults(matches, q);
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b
}

window.addEventListener('DOMContentLoaded', () => {
  resultsList.innerHTML = '<p class="meta">...د خدای کلام لوډ کیږي</p>';
  searchInput.disabled = true;
<<<<<<< HEAD
  // Try to register service worker (optional)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  // Initialize worker
  try {
    worker = new Worker('./searchWorker.js');
    useWorker = true;
    worker.postMessage({ type: 'init' });
  } catch (e) {
    useWorker = false;
  }
  // Try binary index first (MessagePack), fall back to JSON
  const loadMsgPack = fetch('./pashto_bible.msgpack')
    .then(r => { if (!r.ok) throw new Error('no mp'); return r.arrayBuffer(); })
    .then(buf => {
      // Tiny msgpack decoder via Web Worker is out of scope; use JSON fallback if not available
      // If msgpack decoding library is included later, decode here.
      throw new Error('msgpack decode not implemented in browser');
    });
  const loadJson = fetch('./pashto_bible.json').then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); });
  Promise.any([loadMsgPack, loadJson])
    .catch(() => loadJson)
=======
  fetch('./pashto_bible.json')
    .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b
    .then(data => {
      bibleData = data || [];
      resultsList.innerHTML = '';
      searchInput.disabled = false;
      searchInput.placeholder = 'لټون...';
<<<<<<< HEAD
      scopeSel.value = scope;
      if (useWorker && worker) {
        worker.postMessage({ type: 'data', data: bibleData });
      }
    })
    .catch(err => {
      console.error('Failed to load bible data', err);
      resultsList.innerHTML = '<p class="meta">د معلوماتو په لوډولو کې ستونزه وه</p>';
    });

  // Tabs
  const tabs = document.getElementById('tabs');
  if (tabs) {
    tabs.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || t.tagName !== 'BUTTON') return;
      tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      activeTab = t.getAttribute('data-tab') || 'search';
      document.getElementById('results').style.display = (activeTab==='search') ? '' : 'none';
      document.getElementById('coverage').style.display = (activeTab==='search') ? '' : 'none';
      document.getElementById('lexicon').style.display = (activeTab==='lexicon') ? '' : 'none';
      if (activeTab === 'lexicon') loadLexicon();
    });
  }
=======
    })
    .catch(err => {
      console.error('Failed to load bible JSON', err);
      resultsList.innerHTML = '<p class="meta">د معلوماتو په لوډولو کې ستونزه وه</p>';
    });
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b
});

searchInput.addEventListener('input', (e) => {
  const q = e.target.value;
  if (debounceId) clearTimeout(debounceId);
  debounceId = setTimeout(() => doSearch(q), 250);
});

<<<<<<< HEAD
goBtn.addEventListener('click', () => doSearch(searchInput.value));
scopeSel.addEventListener('change', (e) => {
  scope = e.target.value || 'all';
});

// Simple NT/OT split by English book name
const NT_BOOKS = new Set(["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]);
function isNT(ref){
  if(!ref) return false; const book = ref.split(' ').slice(0,-1).join(' ') || ref.split(' ')[0];
  return NT_BOOKS.has(book);
}
function isOT(ref){ return ref ? !isNT(ref) : false; }

// Basic HTML escape for <pre>
function escapeHtml(s){
  try {
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;');
  } catch { return s; }
}

function escapeAttr(s){
  try {
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  } catch { return s; }
}

async function getAudioUrl(ref){
  if (!API_BASE) return '';
  try {
    const r = await fetch(`${API_BASE}/audio/url?ref=${encodeURIComponent(ref)}`);
    if (!r.ok) return '';
    const data = await r.json();
    return data && data.url || '';
  } catch { return ''; }
}

window.toggleAudio = async function(btn){
  const wrap = btn && btn.parentElement;
  if (!wrap) return;
  const slot = wrap.querySelector('.audio-slot');
  if (!slot) return;
  if (slot.firstChild) { slot.innerHTML = ''; return; }
  const ref = btn.getAttribute('data-ref') || '';
  const url = await getAudioUrl(ref);
  if (!url) { btn.textContent = 'No audio'; return; }
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = url;
  audio.style.width = '100%';
  slot.appendChild(audio);
}

async function loadLexicon(){
  const host = API_BASE;
  const panel = document.getElementById('lexicon');
  if (!panel) return;
  panel.innerHTML = '<p class="meta">Loading frequency…</p>';
  try {
    const r = await fetch(`${host}/lexicon/frequency?scope=${encodeURIComponent(scope)}&min_count=2&limit=500`);
    if (!r.ok) throw new Error('bad status');
    const data = await r.json();
    const rows = (data.items||[]).map(it => `<tr><td>${escapeHtml(it.form)}</td><td>${it.count}</td></tr>`).join('');
    panel.innerHTML = `<h3 class="ref">Frequency (${scope.toUpperCase()})</h3>
      <table><thead><tr><th>Form</th><th>Count</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
  } catch (e) {
    panel.innerHTML = '<p class="meta">Failed to load frequency.</p>';
  }
}

=======
>>>>>>> 3be686586e355bc90e6e5ba71d1ee58c46655a7b



