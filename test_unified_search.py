#!/usr/bin/env python3
"""
🎯 COMPREHENSIVE UNIFIED SEARCH TESTING
Tests the deployed Supabase unified search functionality
"""

import os
import sys
from supabase import create_client, Client
from typing import List, Dict, Any

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMxNDMsImV4cCI6MjA3MjA0OTE0M30.dBdCCD8hJAWV4Y8sRNVi2uUSnDrZbUM4TxR6vl8-ENg"

class UnifiedSearchTester:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.test_results = []

    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"      {details}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })

    def test_database_connection(self) -> bool:
        """Test basic Supabase connection"""
        try:
            result = self.supabase.table('word_forms_master').select('count').limit(1).execute()
            self.log_test("Database Connection", True, "Connected to Supabase successfully")
            return True
        except Exception as e:
            self.log_test("Database Connection", False, f"Connection failed: {e}")
            return False

    def test_unified_search_function(self) -> bool:
        """Test the unified search function"""
        try:
            # Test with a common Pashto word
            result = self.supabase.rpc('search_unified', {
                'search_term': 'وهل',
                'limit_count': 5
            }).execute()

            if result.data and len(result.data) > 0:
                sample = result.data[0]
                details = f"Found {len(result.data)} results for 'وهل'"
                self.log_test("Unified Search Function", True, details)
                return True
            else:
                self.log_test("Unified Search Function", False, "No results returned")
                return False

        except Exception as e:
            self.log_test("Unified Search Function", False, f"Search failed: {e}")
            return False

    def test_table_existence(self) -> bool:
        """Test that required tables exist"""
        tables_to_check = [
            'word_forms_master',
            'unified_search_mv',
            'lemmas',
            'phrase_forms'
        ]

        all_exist = True
        for table in tables_to_check:
            try:
                result = self.supabase.table(table).select('count').limit(1).execute()
                self.log_test(f"Table: {table}", True, "Table exists")
            except Exception as e:
                self.log_test(f"Table: {table}", False, f"Table missing: {e}")
                all_exist = False

        return all_exist

    def test_pos_filtering(self) -> bool:
        """Test POS-based filtering"""
        try:
            # Search for nouns specifically
            result = self.supabase.from_('unified_search_mv').select('*').eq('pos', 'noun').limit(3).execute()

            if result.data and len(result.data) > 0:
                sample = result.data[0]
                details = f"Found {len(result.data)} nouns"
                self.log_test("POS Filtering", True, details)
                return True
            else:
                self.log_test("POS Filtering", False, "No nouns found")
                return False

        except Exception as e:
            self.log_test("POS Filtering", False, f"POS filter failed: {e}")
            return False

    def test_frequency_data(self) -> bool:
        """Test frequency data consolidation"""
        try:
            # Check if frequency data exists
            result = self.supabase.from_('unified_search_mv').select('surface, frequency').not_.is_('frequency', None).limit(5).execute()

            if result.data and len(result.data) > 0:
                total_freq = sum(item.get('frequency', 0) for item in result.data)
                details = f"Sample: {len(result.data)} entries, total freq: {total_freq}"
                self.log_test("Frequency Data", True, details)
                return True
            else:
                self.log_test("Frequency Data", False, "No frequency data found")
                return False

        except Exception as e:
            self.log_test("Frequency Data", False, f"Frequency test failed: {e}")
            return False

    def test_multi_token_phrases(self) -> bool:
        """Test multi-token phrase support"""
        try:
            # Look for compound verbs or phrases
            result = self.supabase.from_('phrase_forms').select('surface_norm, pos').limit(3).execute()

            if result.data and len(result.data) > 0:
                sample = result.data[0]
                details = f"Found phrase: {sample.get('surface_norm', 'N/A')}"
                self.log_test("Multi-token Phrases", True, details)
                return True
            else:
                self.log_test("Multi-token Phrases", False, "No phrase data found")
                return False

        except Exception as e:
            self.log_test("Multi-token Phrases", False, f"Phrase test failed: {e}")
            return False

    def run_all_tests(self) -> bool:
        """Run comprehensive test suite"""
        print("🧪 COMPREHENSIVE UNIFIED SEARCH TESTING")
        print("=" * 50)

        tests = [
            self.test_database_connection,
            self.test_unified_search_function,
            self.test_table_existence,
            self.test_pos_filtering,
            self.test_frequency_data,
            self.test_multi_token_phrases
        ]

        passed = 0
        total = len(tests)

        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                self.log_test(f"Test execution error in {test.__name__}", False, str(e))

        print("\n" + "=" * 50)
        print(f"📊 TEST RESULTS: {passed}/{total} passed")

        if passed == total:
            print("🎉 ALL TESTS PASSED!")
            print("✅ Your unified Pashto Bible search is working perfectly!")
            return True
        else:
            print("⚠️  SOME TESTS FAILED")
            print("🔧 Check the issues above and fix them")
            return False

def main():
    """Main test function"""
    tester = UnifiedSearchTester()
    success = tester.run_all_tests()

    if success:
        print("\n🚀 READY FOR PRODUCTION!")
        print("Your unified search system is fully functional.")
    else:
        print("\n🔧 NEEDS ATTENTION")
        print("Some functionality needs to be fixed.")

    return success

if __name__ == "__main__":
    main()
