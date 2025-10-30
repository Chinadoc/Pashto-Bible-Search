#!/bin/bash
# Reset D1 database and apply comprehensive schema

echo "🔄 Resetting D1 database..."

# Drop all existing tables
npx wrangler d1 execute pashto-bible-db --remote --command="
DROP TABLE IF EXISTS verses_yousafzai;
DROP TABLE IF EXISTS verses;
DROP TABLE IF EXISTS word_occurrence_index;
DROP TABLE IF EXISTS dictionary;
DROP TABLE IF EXISTS form_lemmas;
DROP TABLE IF EXISTS form_occurrences;
DROP TABLE IF EXISTS form_roots;
DROP TABLE IF EXISTS grammar_rules;
DROP TABLE IF EXISTS inflections;
DROP TABLE IF EXISTS irregular_verbs;
DROP TABLE IF EXISTS morphological_analysis;
DROP TABLE IF EXISTS nouns_lexicon;
DROP TABLE IF EXISTS verbs_lexicon;
DROP TABLE IF EXISTS video_transcripts;
DROP TABLE IF EXISTS word_frequencies;
DROP TABLE IF EXISTS form_to_root;
"

echo "✅ Old tables dropped"
echo "📋 Applying comprehensive schema..."

# Apply new comprehensive schema
npx wrangler d1 execute pashto-bible-db --remote --file=cloudflare/d1-comprehensive-schema.sql

echo "✅ Schema applied!"


