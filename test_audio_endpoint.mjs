#!/usr/bin/env node

// Test script to verify audio map loading via API
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAudioMap() {
  console.log('🔍 Testing audio map via API...');

  try {
    // Query the audio_by_verse table directly
    const { data, error } = await supabase
      .from('audio_by_verse')
      .select('verse_ref, url')
      .limit(10);

    if (error) {
      console.error('❌ Failed to query audio map:', error);
      return;
    }

    console.log(`✅ Found ${data?.length || 0} audio entries in Supabase`);

    // Check if our test entries are there
    const testRefs = ['Amos 1:1', 'Amos 1:2', 'Isaiah 1:1'];
    testRefs.forEach(ref => {
      const found = data?.find(row => row.verse_ref === ref);
      if (found) {
        console.log(`✅ ${ref}: ${found.url}`);
      } else {
        console.log(`❌ ${ref}: not found`);
      }
    });

  } catch (error) {
    console.error('❌ Error testing audio map:', error);
  }
}

testAudioMap().catch(console.error);
