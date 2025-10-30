#!/bin/bash
# Quick progress checker for D1 migration

echo "📊 Cloudflare D1 Migration Progress"
echo "===================================="
echo ""

echo "📖 Verses:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, COUNT(*) as count FROM verses GROUP BY translation_key;" 2>&1 | grep -E "afghan|yousafzai|count|Total" | head -5

echo ""
echo "📊 Word Frequencies:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM word_frequencies;" 2>&1 | grep -E "count|Total" | head -3

echo ""
echo "🔍 Form Occurrences:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM form_occurrences;" 2>&1 | grep -E "count|Total" | head -3

echo ""
echo "🔗 Form to Root Mappings:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM form_to_root;" 2>&1 | grep -E "count|Total" | head -3

echo ""
echo "🎵 Verses with Audio R2 Keys:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses WHERE audio_r2_key IS NOT NULL;" 2>&1 | grep -E "count|Total" | head -3

echo ""
echo "✅ Total Verses:"
npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total FROM verses;" 2>&1 | grep -E "total|Total" | head -3

echo ""
echo "📈 Expected Totals:"
echo "   Verses: ~54,570 (30,410 Yousafzai + 24,160 Afghan)"
echo "   Word Frequencies: ~7,405"
echo "   Form Occurrences: ~7,252"
echo "   Form to Root: ~7,252"


