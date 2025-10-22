#!/usr/bin/env node
/**
 * Migration script to populate optimized search indexes
 * Run this after creating the optimized search tables in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateOptimizedIndexes() {
  console.log('🚀 Starting optimized search indexes migration...');

  try {
    // Load existing data
    const dataPath = path.join(process.cwd(), 'app/data');
    const versesPath = path.join(dataPath, 'verses.json');
    const formToRootPath = path.join(dataPath, 'form_to_root_map.json');
    const wordFrequencyPath = path.join(dataPath, 'word_frequency_list.json');

    console.log('📊 Loading existing data files...');
    const verses = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
    const formToRoot = JSON.parse(fs.readFileSync(formToRootPath, 'utf8'));
    const wordFrequency = JSON.parse(fs.readFileSync(wordFrequencyPath, 'utf8'));

    console.log(`✅ Loaded ${Object.keys(verses).length} verses`);
    console.log(`✅ Loaded ${Object.keys(formToRoot).length} form-to-root mappings`);
    console.log(`✅ Loaded ${wordFrequency.length} word frequency entries`);

    // Build word index
    console.log('🔍 Building word index...');
    const wordIndex = new Map();

    for (const [ref, verseData] of Object.entries(verses)) {
      if (!verseData?.text) continue;

      const text = verseData.text.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 0);

      for (const word of words) {
        if (!wordIndex.has(word)) {
          wordIndex.set(word, {
            word,
            verse_refs: [],
            frequency: 0,
            testament: verseData.testament || 'NT'
          });
        }

        const entry = wordIndex.get(word);
        if (!entry.verse_refs.includes(ref)) {
          entry.verse_refs.push(ref);
          entry.frequency++;
        }
      }
    }

    console.log(`✅ Built word index with ${wordIndex.size} unique words`);

    // Convert to array and calculate TF-IDF scores
    const wordIndexArray = Array.from(wordIndex.values());
    const totalVerses = Object.keys(verses).length;

    for (const entry of wordIndexArray) {
      // Calculate basic TF-IDF score (word frequency / total verses)
      entry.tf_idf_score = entry.frequency / totalVerses;
    }

    console.log('📝 Preparing word index data for database...');

    // Insert word index data in batches
    const batchSize = 500;
    let insertedCount = 0;

    for (let i = 0; i < wordIndexArray.length; i += batchSize) {
      const batch = wordIndexArray.slice(i, i + batchSize);
      console.log(`📦 Processing word index batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(wordIndexArray.length / batchSize)}`);

      const { error } = await supabase
        .from('word_index')
        .upsert(batch, {
          onConflict: 'word',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      } else {
        insertedCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed: ${batch.length} entries`);
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Word Index Migration Summary:`);
    console.log(`✅ Successfully migrated: ${insertedCount} word index entries`);
    console.log(`📁 Total words processed: ${wordIndexArray.length}`);

    // Build lemma expansions
    console.log('\n🔍 Building lemma expansions...');
    const lemmaExpansions = new Map();

    for (const [form, roots] of Object.entries(formToRoot)) {
      if (!Array.isArray(roots) || roots.length === 0) continue;

      const lemma = roots[0]; // Use first root as the lemma

      if (!lemmaExpansions.has(lemma)) {
        lemmaExpansions.set(lemma, {
          lemma,
          pos: 'unknown', // Would need to be determined from dictionary data
          all_forms: [],
          verse_refs: new Set(),
          occurrence_count: 0
        });
      }

      const entry = lemmaExpansions.get(lemma);
      entry.all_forms.push(form.toLowerCase());

      // Find verses containing this form
      for (const [ref, verseData] of Object.entries(verses)) {
        if (verseData?.text?.toLowerCase().includes(form.toLowerCase())) {
          entry.verse_refs.add(ref);
          entry.occurrence_count++;
        }
      }
    }

    const lemmaArray = Array.from(lemmaExpansions.values());
    console.log(`✅ Built lemma expansions for ${lemmaArray.length} lemmas`);

    // Insert lemma expansions in batches
    let lemmaInsertedCount = 0;

    for (let i = 0; i < lemmaArray.length; i += batchSize) {
      const batch = lemmaArray.slice(i, i + batchSize);
      console.log(`📦 Processing lemma batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(lemmaArray.length / batchSize)}`);

      const { error } = await supabase
        .from('lemma_search_expansions')
        .upsert(batch.map(entry => ({
          ...entry,
          all_forms: Array.from(entry.all_forms),
          verse_refs: Array.from(entry.verse_refs)
        })), {
          onConflict: 'lemma',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Lemma batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      } else {
        lemmaInsertedCount += batch.length;
        console.log(`✅ Lemma batch ${Math.floor(i / batchSize) + 1} completed: ${batch.length} entries`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Lemma Expansions Migration Summary:`);
    console.log(`✅ Successfully migrated: ${lemmaInsertedCount} lemma expansions`);
    console.log(`📁 Total lemmas processed: ${lemmaArray.length}`);

    console.log(`\n🎉 Optimized search indexes migration completed successfully!`);
    console.log(`📊 Summary: ${insertedCount} word index entries + ${lemmaInsertedCount} lemma expansions`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateOptimizedIndexes();
