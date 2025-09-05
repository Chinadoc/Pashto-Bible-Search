#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Remove quotes if present
      env[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });

  return env;
}

// Load environment variables
const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer service role key for uploads (bypasses RLS); fall back to anon if not provided
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = serviceKey || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please ensure .env.local exists with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('Optionally set SUPABASE_SERVICE_ROLE_KEY for write access (recommended).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseUploader {
  constructor() {
    this.bucketName = 'audio';
    this.sourceDir = path.join(__dirname, 'corinthians_split_audio');
    this.uploadedCount = 0;
    this.failedCount = 0;
    this.totalFiles = 0;
  }

  async getAllFiles(dirPath, files = []) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else if (item.endsWith('.mp3')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  getSupabasePath(filePath) {
    // Convert local path to Storage object name expected by the app
    // We normalize corinthians_split_audio/1-corinthians/chapter-1-verses/verse-2.mp3
    //   -> 1corinthians1_verse_2.mp3
    const rel = path.relative(this.sourceDir, filePath).replace(/\\/g, '/');
    const m = rel.match(/^(?<book>[\w-]+)\/chapter-(?<ch>\d+)-verses\/verse-(?<vs>\d+)\.mp3$/i);
    if (m && m.groups) {
      const bookHyphen = m.groups.book.toLowerCase();
      const chapter = Number(m.groups.ch);
      const verse = Number(m.groups.vs);
      const bookSlug = bookHyphen.replace(/-/g, ''); // 1-corinthians -> 1corinthians
      return `${bookSlug}${chapter}_verse_${verse}.mp3`;
    }
    // If it already looks normalized, keep basename
    if (/\b_verse_\d+\.mp3$/i.test(rel)) return path.basename(rel);
    // Otherwise keep rel path (will likely not be discovered by the app)
    return path.basename(rel);
  }

  async uploadFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const supabasePath = this.getSupabasePath(filePath);

      console.log(`Uploading: ${supabasePath}`);

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(supabasePath, fileContent, {
          contentType: 'audio/mpeg',
          upsert: true // Overwrite if exists
        });

      if (error) {
        console.error(`Failed to upload ${supabasePath}:`, error.message);
        this.failedCount++;
        return false;
      }

      console.log(`✅ Uploaded: ${supabasePath}`);
      this.uploadedCount++;
      return true;

    } catch (error) {
      console.error(`Error uploading ${filePath}:`, error.message);
      this.failedCount++;
      return false;
    }
  }

  async uploadAllFiles() {
    console.log('🔍 Scanning for audio files...');

    const audioFiles = await this.getAllFiles(this.sourceDir);
    this.totalFiles = audioFiles.length;

    console.log(`📁 Found ${this.totalFiles} audio files to upload`);
    console.log(`📂 Source directory: ${this.sourceDir}`);
    console.log(`🪣 Target bucket: ${this.bucketName}`);
    console.log('');

    // Upload files in batches to avoid overwhelming the API
    const batchSize = 5;
    let processed = 0;

    for (let i = 0; i < audioFiles.length; i += batchSize) {
      const batch = audioFiles.slice(i, i + batchSize);
      console.log(`\n📤 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(audioFiles.length / batchSize)}`);

      const promises = batch.map(filePath => this.uploadFile(filePath));
      await Promise.all(promises);

      processed += batch.length;
      const progress = ((processed / this.totalFiles) * 100).toFixed(1);
      console.log(`📊 Progress: ${processed}/${this.totalFiles} (${progress}%)`);

      // Small delay between batches
      if (i + batchSize < audioFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 UPLOAD SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully uploaded: ${this.uploadedCount} files`);
    console.log(`❌ Failed uploads: ${this.failedCount} files`);
    console.log(`📁 Total files processed: ${this.totalFiles} files`);

    if (this.failedCount === 0) {
      console.log('\n🎉 All files uploaded successfully!');
    } else {
      console.log(`\n⚠️  ${this.failedCount} files failed to upload. Check the errors above.`);
    }
  }

  async verifyBucketAccess() {
    try {
      console.log('🔐 Verifying Supabase bucket access...');

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', { limit: 1 });

      if (error) {
        console.error('❌ Cannot access bucket:', error.message);
        return false;
      }

      console.log('✅ Bucket access verified');
      if (!serviceKey) {
        console.warn('\n⚠️  Using anon key for upload. RLS may block INSERT.');
        console.warn('   Set SUPABASE_SERVICE_ROLE_KEY to bypass RLS for seeding.');
      }
      return true;

    } catch (error) {
      console.error('❌ Error verifying bucket access:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting Supabase upload process...\n');

    // Verify bucket access
    if (!(await this.verifyBucketAccess())) {
      console.error('Cannot proceed with upload. Please check your Supabase configuration.');
      process.exit(1);
    }

    // Check if source directory exists
    if (!fs.existsSync(this.sourceDir)) {
      console.error(`❌ Source directory not found: ${this.sourceDir}`);
      console.log('Please run the download script first:');
      console.log('node download_corinthians.js');
      process.exit(1);
    }

    try {
      await this.uploadAllFiles();
    } catch (error) {
      console.error('💥 Fatal error during upload:', error);
      process.exit(1);
    }
  }
}

// Run the uploader
if (require.main === module) {
  const uploader = new SupabaseUploader();
  uploader.run();
}

module.exports = SupabaseUploader;
