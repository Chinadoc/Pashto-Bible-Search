let data = [];

function search(q, reqId) {
  const query = (q || '').trim();
  if (!query) return [];
  const results = [];
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v && v.text && v.text.includes(query)) {
      results.push(v);
      if (results.length % 100 === 0) {
        postMessage({ id: reqId, type: 'partial', results: results.slice(), done: false });
      }
    }
  }
  return results;
}

onmessage = (ev) => {
  const { type } = ev.data || {};
  if (type === 'init') {
    // no-op
  } else if (type === 'data') {
    data = Array.isArray(ev.data.data) ? ev.data.data : [];
  } else if (type === 'search') {
    const { id, query } = ev.data;
    const results = search(query, id);
    postMessage({ id, type: 'final', results, done: true });
  }
};


