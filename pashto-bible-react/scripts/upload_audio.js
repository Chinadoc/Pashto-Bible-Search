/*
  Upload local MP3 files to Supabase Storage 'audio' bucket.
  Usage:
    SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload_audio.js "../Pashto new testament with audio"

  Notes:
  - Requires service role key (do NOT commit it). The anon key cannot upload.
  - Uses filenames as-is (e.g., john2_verse_8.mp3). Our app expects this scheme.
*/

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function walk(dir, acc = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.mp3')) acc.push(full);
  }
  return acc;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
    process.exit(1);
  }
  const root = process.argv[2] || path.resolve(__dirname, '../../Pashto new testament with audio');
  const exists = fs.existsSync(root);
  if (!exists) {
    console.error('Directory not found:', root);
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, serviceKey);
  const files = await walk(root);
  console.log('Found MP3 files:', files.length);

  let ok = 0, fail = 0;
  for (const file of files) {
    const name = path.basename(file);
    try {
      const data = await fsp.readFile(file);
      const { error } = await supabase
        .storage
        .from('audio')
        .upload(name, data, { upsert: true, contentType: 'audio/mpeg', cacheControl: '3600' });
      if (error) throw error;
      ok++;
      if (ok % 50 === 0) console.log(`Uploaded ${ok}/${files.length}...`);
    } catch (e) {
      fail++;
      console.error('Upload failed:', name, e.message || e);
    }
  }
  console.log(`Done. Success=${ok}, Failed=${fail}`);
}

main().catch(e => { console.error(e); process.exit(1); });

