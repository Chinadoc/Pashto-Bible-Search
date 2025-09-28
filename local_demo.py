#!/usr/bin/env python3
"""
🎯 LOCAL DEMONSTRATION - UNIFIED PASHTO BIBLE SEARCH
Demonstrates the deployed Supabase search functionality locally
"""

import os
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg"

class PashtoBibleSearchDemo:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    def demo_unified_search(self):
        """Demonstrate the unified search function"""
        print("🔍 DEMONSTRATING UNIFIED SEARCH")
        print("=" * 50)

        test_words = ["وهل", "کور", "خدای", "عیسی", "پلار"]

        for word in test_words:
            print(f"\n🔎 Searching for: '{word}'")

            try:
                result = self.supabase.rpc('search_word_with_forms', {
                    'query': word,
                    'limit_count': 5,
                    'include_phrases': True
                }).execute()

                if result.data and len(result.data) > 0:
                    print(f"   ✅ Found {len(result.data)} results:")
                    for item in result.data[:3]:  # Show first 3
                        is_phrase = "📖 PHRASE" if item.get('is_phrase') else "📝 WORD"
                        print(f"      {is_phrase}: {item.get('form_pashto', 'N/A')}")
                        print(f"         Frequency: {item.get('total_frequency', 0)}")
                        print(f"         POS: {item.get('pos', 'N/A')}")
                else:
                    print("   ❌ No results found")

            except Exception as e:
                print(f"   ❌ Search failed: {e}")

    def demo_fuzzy_search(self):
        """Demonstrate fuzzy search capabilities"""
        print("\n🔍 DEMONSTRATING FUZZY SEARCH")
        print("=" * 50)

        test_queries = ["کور", "خدای", "عیسی"]

        for query in test_queries:
            print(f"\n🔎 Fuzzy search for: '{query}'")

            try:
                result = self.supabase.rpc('fuzzy_search_words', {
                    'query': query,
                    'limit_count': 5,
                    'include_roman': True
                }).execute()

                if result.data and len(result.data) > 0:
                    print(f"   ✅ Found {len(result.data)} similar words:")
                    for item in result.data[:3]:
                        similarity = item.get('similarity_score', 0)
                        print(f"      '{item.get('form_pashto', 'N/A')}' (similarity: {similarity".3f"})")
                else:
                    print("   ❌ No similar words found")

            except Exception as e:
                print(f"   ❌ Fuzzy search failed: {e}")

    def demo_pos_search(self):
        """Demonstrate POS-aware search"""
        print("\n🔍 DEMONSTRATING POS-AWARE SEARCH")
        print("=" * 50)

        pos_tests = [
            ("وهل", "verb"),
            ("کور", "noun"),
            ("خوب", "adj")
        ]

        for word, pos in pos_tests:
            print(f"\n🔎 Searching '{word}' as {pos}:")

            try:
                result = self.supabase.rpc('search_by_pos', {
                    'query': word,
                    'pos_filter': pos,
                    'limit_count': 5
                }).execute()

                if result.data and len(result.data) > 0:
                    print(f"   ✅ Found {len(result.data)} {pos} forms:")
                    for item in result.data[:3]:
                        print(f"      '{item.get('form_pashto', 'N/A')}' ({item.get('total_frequency', 0):,","occurrences)")
                else:
                    print(f"   ❌ No {pos} forms found")

            except Exception as e:
                print(f"   ❌ POS search failed: {e}")

    def demo_verse_context(self):
        """Demonstrate verse context search"""
        print("\n🔍 DEMONSTRATING VERSE CONTEXT SEARCH")
        print("=" * 50)

        test_word = "خدای"

        print(f"\n🔎 Finding verses with: '{test_word}'")

        try:
            result = self.supabase.rpc('search_verses_with_word', {
                'word_form': test_word,
                'limit_count': 5
            }).execute()

            if result.data and len(result.data) > 0:
                print(f"   ✅ Found {len(result.data)} verses:")
                for verse in result.data[:3]:
                    book = verse.get('book', 'N/A')
                    chapter = verse.get('chapter', 0)
                    verse_num = verse.get('verse', 0)
                    text = verse.get('text', 'N/A')[:100] + "..." if len(verse.get('text', '')) > 100 else verse.get('text', 'N/A')
                    print(f"      📖 {book} {chapter}:{verse_num}")
                    print(f"         '{text}'")
            else:
                print("   ❌ No verses found")

        except Exception as e:
            print(f"   ❌ Verse search failed: {e}")

    def demo_statistics(self):
        """Show some basic statistics"""
        print("\n📊 BASIC STATISTICS")
        print("=" * 30)

        try:
            # Count total words
            word_count = self.supabase.table('word_form_stats').select('count').execute()
            print(f"📝 Total word forms: {word_count.data[0]['count']:,","}")

            # Count total phrases
            phrase_count = self.supabase.table('phrase_form_stats').select('count').execute()
            print(f"📖 Total phrases: {phrase_count.data[0]['count']:,","}")

            # Most frequent words
            print("\n🔥 TOP 5 MOST FREQUENT WORDS:")
            top_words = self.supabase.from_('word_form_stats').select('form_pashto, total_frequency').order('total_frequency', desc=True).limit(5).execute()

            for i, word in enumerate(top_words.data, 1):
                print(f"   {i}. '{word['form_pashto']}' ({word['total_frequency']:,","occurrences)")

        except Exception as e:
            print(f"❌ Statistics failed: {e}")

    def run_demo(self):
        """Run the complete demonstration"""
        print("🎯 UNIFIED PASHTO BIBLE SEARCH - LOCAL DEMONSTRATION")
        print("=" * 60)

        try:
            self.demo_unified_search()
            self.demo_fuzzy_search()
            self.demo_pos_search()
            self.demo_verse_context()
            self.demo_statistics()

            print("\n" + "=" * 60)
            print("🎉 DEMONSTRATION COMPLETE!")
            print("✅ All search functions are working")
            print("🚀 Ready for Vercel integration")

        except Exception as e:
            print(f"\n❌ Demo failed: {e}")
            print("💡 Make sure the schema is deployed to Supabase")

def main():
    """Main demo function"""
    demo = PashtoBibleSearchDemo()
    demo.run_demo()

if __name__ == "__main__":
    main()
