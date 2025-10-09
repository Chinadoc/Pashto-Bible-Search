#!/usr/bin/env python3
"""
Fix production issues for Pashto Bible Search
1. Fix Audio Map API 500 error
2. Investigate Arabic search issues
"""

import os
import requests
import json
from supabase import create_client

def check_supabase_connection():
    """Test Supabase connection and basic functionality"""
    print("🔍 Testing Supabase Connection...")

    try:
        supabase = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL'),
            os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        )

        # Test basic connection
        result = supabase.table('verses').select('count', count='exact', head=True).execute()
        print(f"✅ Connected to Supabase. Verses table: {result.count} records")

        return supabase
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return None

def check_audio_by_verse_view(supabase):
    """Check if audio_by_verse view exists and works"""
    print("\n🎵 Checking audio_by_verse view...")

    try:
        # Try to query the view
        result = supabase.table('audio_by_verse').select('*').limit(5).execute()
        print(f"✅ audio_by_verse view exists. Sample records: {len(result.data) if result.data else 0}")

        if result.data:
            print(f"   Sample: {result.data[0]}")

        return True
    except Exception as e:
        print(f"❌ audio_by_verse view error: {e}")
        return False

def create_audio_by_verse_view(supabase):
    """Create the audio_by_verse view if it doesn't exist"""
    print("\n🔧 Creating audio_by_verse view...")

    view_sql = """
    CREATE OR REPLACE VIEW audio_by_verse AS
    SELECT
      v.book || ' ' || v.chapter::text || ':' || v.verse::text as verse_ref,
      NULL as url
    FROM verses v
    WHERE v.book IS NOT NULL AND v.chapter IS NOT NULL AND v.verse IS NOT NULL;
    """

    try:
        # Note: This might not work with the anon key, but let's try
        supabase.rpc('execute_sql', {'query': view_sql}).execute()
        print("✅ audio_by_verse view created")
        return True
    except Exception as e:
        print(f"❌ Failed to create view: {e}")
        print("   This may require admin privileges. View needs to be created manually in Supabase dashboard.")
        return False

def test_arabic_search_in_data():
    """Test what Arabic words are actually in the data"""
    print("\n🔍 Testing Arabic search in local data...")

    import gzip

    # Common Arabic/Islamic terms to check
    test_terms = ['الله', 'محمد', 'اسلام', 'قرآن', 'دين', 'ايمان', 'صلاة', 'زكاة', 'صوم', 'حج']

    try:
        with gzip.open('public/verses.json.gz', 'rt', encoding='utf-8') as f:
            verses = json.load(f)

        print("Checking for Arabic terms in local data:")
        for term in test_terms:
            count = sum(1 for verse in verses.values() if term in verse.get('text', ''))
            status = "✅" if count > 0 else "❌"
            print(f"   {status} '{term}': {count} verses")

    except Exception as e:
        print(f"❌ Error checking local data: {e}")

def check_production_api_endpoints():
    """Test the production API endpoints"""
    print("\n🌐 Testing Production API Endpoints...")

    base_url = "https://pashto-bible-search.vercel.app"

    # Test audio map API
    try:
        response = requests.get(f"{base_url}/api/get_audio_map?clear_cache=1", timeout=10)
        print(f"🎵 Audio Map API: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Returned {len(data)} audio mappings")
        else:
            print(f"   ❌ Error: {response.text[:200]}...")

    except Exception as e:
        print(f"❌ Audio Map API failed: {e}")

    # Test search API with different queries
    test_queries = ['الله', 'د', 'خداى', 'پيغمبر']

    for query in test_queries:
        try:
            payload = {"query": query, "scope": "all", "includeRelated": True, "enableFuzzy": False}
            response = requests.post(f"{base_url}/api/search", json=payload, timeout=10)
            print(f"🔍 Search '{query}': {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                results_count = len(data.get('results', []))
                print(f"   📊 Found {results_count} results")
            else:
                print(f"   ❌ Error: {response.text[:100]}...")

        except Exception as e:
            print(f"❌ Search '{query}' failed: {e}")

def suggest_fixes():
    """Provide actionable suggestions"""
    print("\n💡 RECOMMENDED FIXES:")
    print("=" * 50)

    print("\n1. 🔧 AUDIO MAP API FIX:")
    print("   • Check if audio_by_verse view exists in Supabase")
    print("   • If not, create it manually in Supabase SQL editor:")
    print("""
   CREATE OR REPLACE VIEW audio_by_verse AS
   SELECT
     v.book || ' ' || v.chapter::text || ':' || v.verse::text as verse_ref,
     NULL as url
   FROM verses v
   WHERE v.book IS NOT NULL AND v.chapter IS NOT NULL AND v.verse IS NOT NULL;
   """)

    print("\n2. 🔍 ARABIC SEARCH FIX:")
    print("   • The term 'الله' is not in the current Pashto Bible data")
    print("   • Consider adding Arabic/Islamic terms or improving search normalization")
    print("   • Check if 'الله' should be 'خداى' (God in Pashto)")

    print("\n3. 🚀 DEPLOYMENT FIXES:")
    print("   • Redeploy to Vercel to ensure latest code is live")
    print("   • Check Vercel function logs for detailed error messages")
    print("   • Verify environment variables are set correctly in Vercel")

    print("\n4. 🧪 TESTING:")
    print("   • Test with simpler queries first (single letters, common words)")
    print("   • Use browser dev tools to check network requests")
    print("   • Monitor Vercel function logs for API errors")

def main():
    """Main diagnostic function"""
    print("🔧 Pashto Bible Search - Production Issue Diagnostic")
    print("=" * 55)

    # Test Supabase connection
    supabase = check_supabase_connection()

    if supabase:
        # Check database views
        if not check_audio_by_verse_view(supabase):
            create_audio_by_verse_view(supabase)

    # Test local data
    test_arabic_search_in_data()

    # Test production APIs
    check_production_api_endpoints()

    # Provide suggestions
    suggest_fixes()

if __name__ == "__main__":
    main()

