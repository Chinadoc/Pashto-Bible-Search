#!/usr/bin/env python3
"""
Download Afghan 2023 NT audio files from Supabase storage and upload to Google Drive with proper tagging.
This script processes files in parallel using multiple agents for faster processing.
"""

import os
import asyncio
import aiohttp
import aiofiles
from concurrent.futures import ThreadPoolExecutor
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = "https://nkombdutnjvaasxrbmdn.supabase.co"
SUPABASE_STORAGE_URL = f"{SUPABASE_URL}/storage/v1/object/public/audio"

# Google Drive configuration
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = '/Users/jeremysamuels/Documents/pashto-bible-search/service-account.json'

# NT Books that have Afghan 2023 audio
AFGHAN_NT_BOOKS = [
    'John', 'Acts', '1 Corinthians', '2 Corinthians', 
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John'
]

class AfghanAudioProcessor:
    def __init__(self):
        self.temp_dir = Path('/tmp/afghan_audio_download')
        self.temp_dir.mkdir(exist_ok=True)
        
        # Initialize Google Drive service
        try:
            credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            self.drive_service = build('drive', 'v3', credentials=credentials)
            logger.info("✅ Google Drive service initialized")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Google Drive: {e}")
            self.drive_service = None

    async def download_file(self, session, filename, output_path):
        """Download a single file from Supabase storage"""
        url = f"{SUPABASE_STORAGE_URL}/{filename}"
        
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    async with aiofiles.open(output_path, 'wb') as f:
                        await f.write(await response.read())
                    logger.info(f"✅ Downloaded: {filename}")
                    return True
                else:
                    logger.warning(f"❌ Failed to download {filename}: HTTP {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Error downloading {filename}: {e}")
            return False

    def upload_to_google_drive(self, file_path, filename, book_name):
        """Upload file to Google Drive with proper tagging"""
        if not self.drive_service:
            logger.error("❌ Google Drive service not available")
            return None
            
        try:
            # Create file metadata
            file_metadata = {
                'name': filename,
                'parents': ['1Afghan_2023_Audio'],  # Afghan 2023 folder
                'description': f'Audio file for {book_name} - Afghan 2023 Translation'
            }
            
            media = MediaFileUpload(str(file_path), mimetype='audio/mpeg')
            
            # Upload file
            file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id,name'
            ).execute()
            
            logger.info(f"✅ Uploaded to Google Drive: {filename} (ID: {file.get('id')})")
            return file.get('id')
            
        except HttpError as error:
            logger.error(f"❌ Google Drive upload failed for {filename}: {error}")
            return None
        except Exception as e:
            logger.error(f"❌ Unexpected error uploading {filename}: {e}")
            return None

    async def process_afghan_audio_files(self, num_agents=3):
        """Process Afghan 2023 audio files using multiple agents"""
        logger.info(f"🚀 Starting Afghan 2023 audio processing with {num_agents} agents...")
        
        # Get list of all files from Supabase
        try:
            async with aiohttp.ClientSession() as session:
                # Get file list from Supabase storage
                list_url = f"{SUPABASE_URL}/storage/v1/object/list/audio"
                headers = {
                    'Authorization': f'Bearer {os.environ.get("SUPABASE_ANON_KEY", "")}'
                }
                
                async with session.get(list_url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        all_files = [f['name'] for f in data if f['name'].endsWith('.mp3')]
                    else:
                        logger.error(f"❌ Failed to get file list: HTTP {response.status}")
                        return
        except Exception as e:
            logger.error(f"❌ Error getting file list: {e}")
            return
        
        # Filter for Afghan NT files
        afghan_files = []
        for filename in all_files:
            if any(book.lower() in filename.lower() for book in AFGHAN_NT_BOOKS):
                afghan_files.append(filename)
        
        logger.info(f"📊 Found {len(afghan_files)} Afghan 2023 NT audio files")
        
        # Process files in batches with multiple agents
        batch_size = len(afghan_files) // num_agents + 1
        tasks = []
        
        for i in range(num_agents):
            start_idx = i * batch_size
            end_idx = min((i + 1) * batch_size, len(afghan_files))
            batch_files = afghan_files[start_idx:end_idx]
            
            if batch_files:
                task = asyncio.create_task(self.process_batch(session, batch_files, i+1))
                tasks.append(task)
        
        # Wait for all agents to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Report results
        total_processed = sum(r[0] for r in results if isinstance(r, tuple))
        total_uploaded = sum(r[1] for r in results if isinstance(r, tuple))
        
        logger.info(f"🎉 Processing complete! {total_processed} files processed, {total_uploaded} uploaded to Google Drive")

    async def process_batch(self, session, batch_files, agent_id):
        """Process a batch of files with a specific agent"""
        logger.info(f"🤖 Agent {agent_id} processing {len(batch_files)} files")
        
        processed = 0
        uploaded = 0
        
        for filename in batch_files:
            # Determine book name for tagging
            book_name = "Unknown"
            for book in AFGHAN_NT_BOOKS:
                if book.lower() in filename.lower():
                    book_name = book
                    break
            
            # Download file
            output_path = self.temp_dir / filename
            success = await self.download_file(session, filename, output_path)
            
            if success:
                processed += 1
                
                # Upload to Google Drive
                drive_id = self.upload_to_google_drive(output_path, filename, book_name)
                if drive_id:
                    uploaded += 1
                
                # Clean up temp file
                try:
                    output_path.unlink()
                except:
                    pass
        
        logger.info(f"🤖 Agent {agent_id} completed: {processed} processed, {uploaded} uploaded")
        return (processed, uploaded)

async def main():
    processor = AfghanAudioProcessor()
    await processor.process_afghan_audio_files(num_agents=3)

if __name__ == "__main__":
    asyncio.run(main())
