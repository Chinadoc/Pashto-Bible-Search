const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');

let bibleData = [];
let debounceId = null;

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
    return;
  }
  const html = results.slice(0, 200).map(v => {
    const h = highlight(v.text, query);
    return `<div class="result"><div class="ref">${v.ref}</div><div class="text">${h}</div></div>`;
  }).join('');
  resultsList.innerHTML = html;
}

function doSearch(query) {
  const q = (query || '').trim();
  if (!q) {
    resultsList.innerHTML = '';
    return;
  }
  const qn = q; // keep simple substring for now
  const matches = bibleData.filter(v => v.text && v.text.includes(qn));
  displayResults(matches, q);
}

window.addEventListener('DOMContentLoaded', () => {
  resultsList.innerHTML = '<p class="meta">...د خدای کلام لوډ کیږي</p>';
  searchInput.disabled = true;
  fetch('./pashto_bible.json')
    .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
    .then(data => {
      bibleData = data || [];
      resultsList.innerHTML = '';
      searchInput.disabled = false;
      searchInput.placeholder = 'لټون...';
    })
    .catch(err => {
      console.error('Failed to load bible JSON', err);
      resultsList.innerHTML = '<p class="meta">د معلوماتو په لوډولو کې ستونزه وه</p>';
    });
});

searchInput.addEventListener('input', (e) => {
  const q = e.target.value;
  if (debounceId) clearTimeout(debounceId);
  debounceId = setTimeout(() => doSearch(q), 250);
});


