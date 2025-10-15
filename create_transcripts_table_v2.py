#!/usr/bin/env python3
"""
Create video_transcripts table in Supabase using REST API
"""

import requests
import json

def create_table():
    # Supabase credentials
    supabase_url = "https://nkombdutnjvaasxrbmdn.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb21iZHV0bmp2YWFzeHJibWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MzE0MywiZXhwIjoyMDcyMDQ5MTQzfQ.kbjqsXvPXVi9cOUV1C0H1uR4dD-ufn2wb4R9dOvpGZw"
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    # First, let's try to insert a test record to see if the table exists
    test_data = {
        'video_id': 'test',
        'video_title': 'test',
        'segment_number': 1,
        'start_time_seconds': 0,
        'end_time_seconds': 300,
        'transcript_text': 'test',
        'audio_file_path': 'test',
        'transcript_file_path': 'test'
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/video_transcripts",
            headers=headers,
            json=test_data
        )
        
        if response.status_code in [200, 201]:
            print("✅ Table exists and is accessible")
            # Delete the test record
            delete_response = requests.delete(
                f"{supabase_url}/rest/v1/video_transcripts",
                headers=headers,
                params={'video_id': 'eq.test'}
            )
            return True
        else:
            print(f"❌ Table doesn't exist or error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    create_table()
