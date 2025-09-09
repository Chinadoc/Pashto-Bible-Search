#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_ROOT = path.join(__dirname, '..', 'corinthians_proper_split');
const DST_ROOT = path.join(__dirname, '..', 'audio_corinthians');

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function bookSlugFromHyphen(h){ return h.toLowerCase().replace(/-/g, ''); }

function copyChapter(bookHyphen) {
  const bookDir = path.join(SRC_ROOT, bookHyphen);
  if (!fs.existsSync(bookDir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(bookDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const m = e.name.match(/^chapter-(\d+)-verses$/);
    if (!m) continue;
    const ch = Number(m[1]);
    const verseDir = path.join(bookDir, e.name);
    const files = fs.readdirSync(verseDir).filter(n=>/^verse-\d+\.mp3$/i.test(n));
    for (const f of files) {
      const v = Number(f.match(/\d+/)[0]);
      const dstName = `${bookSlugFromHyphen(bookHyphen)}${ch}_verse_${v}.mp3`;
      ensureDir(DST_ROOT);
      fs.copyFileSync(path.join(verseDir,f), path.join(DST_ROOT, dstName));
      count++;
    }
  }
  return count;
}

function main(){
  ensureDir(DST_ROOT);
  let total = 0;
  total += copyChapter('1-corinthians');
  total += copyChapter('2-corinthians');
  console.log(`Flattened ${total} files to ${DST_ROOT}`);
}

main();
