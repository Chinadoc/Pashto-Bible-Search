#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

function run(cmd, opts={}){
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function main(){
  const root = path.join(__dirname, '..');
  const splitter = 'proper_audio_splitter.js';
  const sourceDir = path.join(root, 'split_output');

  const plan = [
    { book: '1-john', chapters: 5 },
    { book: '2-john', chapters: 1 },
    { book: '3-john', chapters: 1 },
  ];

  for (const { book, chapters } of plan) {
    for (let ch=1; ch<=chapters; ch++){
      run(`node ${splitter} ${book} ${ch}`, { cwd: root });
    }
  }

  // Upload everything under split_output using the existing uploader
  const uploader = 'upload_to_supabase.js';
  run(`node ${uploader} "${sourceDir}"`, { cwd: root });
}

if (require.main === module) main();
