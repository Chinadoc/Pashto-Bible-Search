#!/usr/bin/env node

/**
 * Database Testing Script for Pashto Bible Search
 * Tests database connection, table existence, and basic functionality
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file if it exists
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not available, will use environment variables directly
}

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

console.log('🚀 Starting Pashto Bible Search Database Tests...\n');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('📡 Testing database connection...');

  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('verses')
      .select('count')
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      return { connected: false, latency, error: error.message };
    }

    console.log(`✅ Connected successfully (${latency}ms latency)`);
    return { connected: true, latency };
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    return { connected: false, error: error.message };
  }
}

async function testTables() {
  console.log('\n📋 Testing table existence...');

  const requiredTables = [
    'verses',
    'word_index',
    'search_index',
    'lemmas',
    'word_forms',
    'phrase_forms',
    'word_occurrences',
    'phrase_occurrences',
    'lemma_relations'
  ];

  const results = [];

  for (const tableName of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${tableName}': ${error.message}`);
        results.push({ table: tableName, exists: false, error: error.message });
      } else {
        console.log(`✅ Table '${tableName}': Found`);
        results.push({ table: tableName, exists: true });
      }
    } catch (error) {
      console.log(`❌ Table '${tableName}': ${error.message}`);
      results.push({ table: tableName, exists: false, error: error.message });
    }
  }

  return results;
}

async function testWordSearch() {
  console.log('\n🔍 Testing word search functionality...');

  // Test searching for a common word like "خدا" (God)
  try {
    const { data, error } = await supabase
      .from('word_index')
      .select('verse_refs, frequency')
      .eq('word', 'خدا')
      .single();

    if (error) {
      console.log(`⚠️ Word search test: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      console.log(`✅ Word search: Found "خدا" with ${data.verse_refs?.length || 0} occurrences`);
      return {
        success: true,
        word: 'خدا',
        occurrences: data.verse_refs?.length || 0,
        frequency: data.frequency || 0
      };
    } else {
      console.log(`⚠️ Word search: No results for "خدا"`);
      return { success: false, message: 'No results found' };
    }
  } catch (error) {
    console.log(`❌ Word search error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testVerseQuery() {
  console.log('\n📖 Testing verse queries...');

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('id, ref, text, testament, book, chapter, verse')
      .eq('book', 'Genesis')
      .eq('chapter', 1)
      .eq('verse', 1)
      .single();

    if (error) {
      console.log(`⚠️ Verse query test: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      console.log(`✅ Verse query: Found Genesis 1:1`);
      console.log(`   Text: ${data.text.substring(0, 50)}...`);
      return { success: true, verse: data };
    } else {
      console.log(`⚠️ Verse query: Genesis 1:1 not found`);
      return { success: false, message: 'Verse not found' };
    }
  } catch (error) {
    console.log(`❌ Verse query error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testPerformance() {
  console.log('\n⚡ Testing performance...');

  const startTime = Date.now();

  try {
    // Test multiple queries
    const queries = [
      supabase.from('verses').select('count').limit(1),
      supabase.from('word_index').select('count').limit(1),
      supabase.from('lemmas').select('count').limit(1),
    ];

    const results = await Promise.all(queries);
    const totalTime = Date.now() - startTime;

    let success = true;
    results.forEach((result, index) => {
      if (result.error) {
        console.log(`❌ Query ${index + 1} failed: ${result.error.message}`);
        success = false;
      }
    });

    if (success) {
      console.log(`✅ All queries completed in ${totalTime}ms`);
      return { success: true, time: totalTime };
    } else {
      return { success: false, time: totalTime };
    }
  } catch (error) {
    console.log(`❌ Performance test error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🧪 Running comprehensive database tests...\n');

  const results = {
    connection: await testConnection(),
    tables: await testTables(),
    wordSearch: await testWordSearch(),
    verseQuery: await testVerseQuery(),
    performance: await testPerformance(),
  };

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('=' .repeat(50));

  console.log(`Database Connection: ${results.connection.connected ? '✅' : '❌'}`);
  if (results.connection.latency) {
    console.log(`Connection Latency: ${results.connection.latency}ms`);
  }

  const tableCount = results.tables.filter(t => t.exists).length;
  console.log(`Tables Created: ${tableCount}/${results.tables.length}`);

  console.log(`Word Search: ${results.wordSearch.success ? '✅' : '❌'}`);
  console.log(`Verse Query: ${results.verseQuery.success ? '✅' : '❌'}`);
  console.log(`Performance: ${results.performance.success ? '✅' : '❌'}`);

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('=' .repeat(30));

  if (!results.connection.connected) {
    console.log('❌ Fix database connection first');
    console.log('   - Check Supabase URL and API key');
    console.log('   - Verify Supabase project is active');
  }

  if (tableCount < results.tables.length) {
    console.log('⚠️ Some tables are missing');
    console.log('   - Run the setup_supabase_tables.sql script');
    console.log('   - Check Supabase SQL editor logs for errors');
  }

  if (results.connection.connected && tableCount === results.tables.length) {
    console.log('✅ Database setup looks good!');
    console.log('   - Try searching for common words like "خدا" or "عیسی"');
    console.log('   - Check the performance debugger in the frontend');
  }

  if (results.connection.latency > 100) {
    console.log('⚠️ High connection latency detected');
    console.log('   - Consider upgrading Supabase plan');
    console.log('   - Check network connectivity');
  }

  console.log('\n🔧 Next Steps:');
  console.log('1. Visit https://pashto-bible-search.vercel.app/');
  console.log('2. Click the "🐛 Debug" button in the bottom right');
  console.log('3. Monitor search performance');
  console.log('4. Check cache hit rates');

  return results;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log('\n✨ Database testing completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = {
  testConnection,
  testTables,
  testWordSearch,
  testVerseQuery,
  testPerformance,
  runAllTests
};
