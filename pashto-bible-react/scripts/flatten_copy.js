#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'corinthians_proper_split', '1-corinthians', 'chapter-2-verses');
const dst = path.join(__dirname, '..', 'audio');

if (!fs.existsSync(src)) {
  console.error('Source folder not found:', src);
  process.exit(1);
}
if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });

const files = fs.readdirSync(src).filter(n => /^verse-\d+\.mp3$/i.test(n));
files.sort((a,b)=>{
  const na = parseInt(a.match(/\d+/)[0]);
  const nb = parseInt(b.match(/\d+/)[0]);
  return na-nb;
});

let ok=0, fail=0;
for (const n of files) {
  const v = n.match(/\d+/)[0];
  const out = path.join(dst, `1corinthians2_verse_${v}.mp3`);
  try {
    fs.copyFileSync(path.join(src, n), out);
    ok++;
  } catch (e) { console.error('copy failed for', n, e.message); fail++; }
}
console.log(`Copied ${ok} files, failures=${fail}`);
