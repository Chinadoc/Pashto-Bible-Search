#!/bin/bash
# Reset D1 database completely

echo "⚠️  WARNING: This will DELETE all data in pashto-bible-db!"
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

echo ""
echo "🗑️  Dropping all tables..."

# Drop all tables
npx wrangler d1 execute pashto-bible-db --remote --command="
DROP TABLE IF EXISTS verses;
DROP TABLE IF EXISTS word_frequencies;
DROP TABLE IF EXISTS dictionary;
DROP TABLE IF EXISTS form_occurrences;
DROP TABLE IF EXISTS form_to_root;
DROP TABLE IF EXISTS inflections;
DROP TABLE IF EXISTS irregular_verbs;
DROP TABLE IF EXISTS nouns_lexicon;
DROP TABLE IF EXISTS verbs_lexicon;
DROP TABLE IF EXISTS grammar_rules;
DROP TABLE IF EXISTS video_transcripts;
"

echo ""
echo "✅ Database reset complete!"
echo ""
echo "Next step: Run the fresh migration script"


