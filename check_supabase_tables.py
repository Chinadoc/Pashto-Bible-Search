#!/usr/bin/env python3
"""
Check existing Supabase tables
"""

import requests

def check_tables():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    # Try to get table information
    try:
        response = requests.get(
            f"{supabase_url}/rest/v1/",
            headers=headers
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_tables()
