#!/usr/bin/env node

/**
 * Report which NT books are missing audio files in the Supabase Storage bucket.
 *
 * Uses the same environment resolution as upload_to_supabase.js
 * and anonymous key by default (works if SELECT policy is in place).
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      env[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.BUCKET || 'audio';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase config: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Canonical NT list
const NT = [
  'matthew','mark','luke','john','acts','romans',
  '1corinthians','2corinthians','galatians','ephesians','philippians','colossians',
  '1thessalonians','2thessalonians','1timothy','2timothy','titus','philemon',
  'hebrews','james','1peter','2peter','1john','2john','3john','jude','revelation'
];

function altForms(slug) {
  const out = new Set([slug]);
  const m1 = slug.match(/^(\d)([a-z].*)$/); // 1john -> john1
  if (m1) out.add(`${m1[2]}${m1[1]}`);
  const m2 = slug.match(/^([a-z]+?)(\d)$/); // john1 -> 1john
  if (m2) out.add(`${m2[2]}${m2[1]}`);
  return Array.from(out);
}

async function listAll() {
  const pageSize = 1000;
  let offset = 0;
  const files = [];
  for (;;) {
    const { data, error } = await supabase.storage.from(bucketName).list('', { limit: pageSize, offset });
    if (error) {
      console.error('List error:', error.message);
      break;
    }
    if (!data || data.length === 0) break;
    for (const it of data) if (it && it.name) files.push(it.name);
    offset += data.length;
    if (data.length < pageSize) break;
  }
  return files;
}

(async () => {
  console.log(`Scanning bucket '${bucketName}' at ${supabaseUrl} ...`);
  const files = await listAll();
  console.log(`Found ${files.length} objects`);

  const byBook = new Map(NT.map(b => [b, 0]));
  const lower = files.map(f => f.toLowerCase());

  for (const book of NT) {
    const variants = altForms(book);
    const count = lower.filter(name => variants.some(v => name.startsWith(v) && name.includes('_verse_'))).length;
    byBook.set(book, count);
  }

  const missing = Array.from(byBook.entries()).filter(([, c]) => c === 0).map(([b]) => b);
  console.log('\nNT books with zero audio files in bucket:');
  console.log(missing.length ? `- ${missing.join(', ')}` : '- none (all present)');

  console.log('\nCounts (book -> file count):');
  for (const [b, c] of byBook.entries()) {
    console.log(`${b.padEnd(16)} ${String(c).padStart(4)}`);
  }
})();

