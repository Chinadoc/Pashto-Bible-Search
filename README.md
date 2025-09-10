# Pashto Bible Search

A comprehensive Pashto Bible search application with advanced lexicon and grammar features powered by Supabase.

## Features

- 🔍 **Bible Search**: Search through Pashto Bible verses with pagination
- 📚 **Lexicon**: Real-time verb conjugations from Supabase database
- 📖 **Grammar**: Dynamic grammar rules and patterns
- 🎵 **Audio Support**: Audio playback for verses
- 🌐 **RTL Support**: Proper Pashto script rendering
- 📱 **Responsive**: Works on all devices

## Setup

### Environment Variables

Add these environment variables to your Vercel deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nkombdutnjvaasxrbmdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg
```

### Database Tables

Ensure these tables exist in your Supabase database:

- `irregular_verbs` - Verb roots with stems, conjugations
- `verbs_lexicon` - Regular verb lexicon data
- `inflections` - Inflected forms
- `grammar_rules` - Grammar transformation rules
- `dictionary` - General word definitions

## Usage

1. **Search Tab**: Search for Bible verses
2. **Lexicon Tab**: Search for verb roots like "leedul" to see conjugations
3. **Grammar Tab**: View grammar rules and patterns

## Development

```bash
npm install
npm run dev
```

## Deployment

The app is configured for Vercel deployment with the environment variables above.

## Technologies

- Next.js 15
- TypeScript
- Supabase
- Tailwind CSS
- Material-UI