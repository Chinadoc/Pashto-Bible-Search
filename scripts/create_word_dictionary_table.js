#!/usr/bin/env node

/**
 * Create word_dictionary table in Supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createTable() {
  console.log('\n📊 CREATING WORD_DICTIONARY TABLE\n');

  try {
    const sql = `
      DROP TABLE IF EXISTS public.word_dictionary CASCADE;

      CREATE TABLE public.word_dictionary (
        id BIGSERIAL PRIMARY KEY,
        pashto_word TEXT NOT NULL UNIQUE,
        romanized TEXT,
        english TEXT,
        pos TEXT,
        past BOOLEAN,
        perfective BOOLEAN,
        imperfective BOOLEAN,
        gender TEXT,
        animacy TEXT,
        number TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
      CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
      CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

      ALTER TABLE public.word_dictionary ADD COLUMN english_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;
    `;

    console.log('🔨 Creating table and indexes...');
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      // Try alternative approach using direct REST API
      console.log('⚠️  RPC not available, trying direct approach...');
      
      // Just test the connection and indicate next steps
      const { count } = await supabase.from('word_dictionary').select('*', { count: 'exact', head: true }).catch(() => ({ count: null }));
      
      if (count !== null) {
        console.log('✅ Table already exists!');
        return;
      }

      console.log('\n💡 Manual SQL required. Please run this in Supabase console:');
      console.log('═'.repeat(60));
      console.log(sql);
      console.log('═'.repeat(60));
      console.log('\nThen run: node scripts/ingest_word_dictionary.js');
      return;
    }

    console.log('✅ Table created successfully!\n');

    // Verify
    console.log('📊 VERIFICATION:');
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'word_dictionary');

    if (tables && tables.length > 0) {
      console.log('   ✅ word_dictionary table exists');
    }

    console.log('\n✅ COMPLETE!\n');
    console.log('Next step: node scripts/ingest_word_dictionary.js\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Please run this SQL manually in Supabase console:');
    console.log('═'.repeat(60));
    const sql = `
      DROP TABLE IF EXISTS public.word_dictionary CASCADE;

      CREATE TABLE public.word_dictionary (
        id BIGSERIAL PRIMARY KEY,
        pashto_word TEXT NOT NULL UNIQUE,
        romanized TEXT,
        english TEXT,
        pos TEXT,
        past BOOLEAN,
        perfective BOOLEAN,
        imperfective BOOLEAN,
        gender TEXT,
        animacy TEXT,
        number TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX idx_word_dictionary_pashto ON public.word_dictionary (pashto_word);
      CREATE INDEX idx_word_dictionary_pos ON public.word_dictionary (pos);
      CREATE INDEX idx_word_dictionary_english ON public.word_dictionary USING GIN (to_tsvector('english', english));

      ALTER TABLE public.word_dictionary ADD COLUMN english_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', COALESCE(english, ''))) STORED;
    `;
    console.log(sql);
    console.log('═'.repeat(60));
  }
}

createTable();
