import { createClient } from '@supabase/supabase-js'

// Environment variables should be available in Next.js runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are not configured properly')
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

// AudioMap type is already defined in types/index.ts

// Export common database table names
export const TABLES = {
  VERSES: 'verses',
  VERSES_YOUSAFZAI: 'verses_yousafzai',
  AUDIO_BY_VERSE: 'audio_by_verse',
} as const
