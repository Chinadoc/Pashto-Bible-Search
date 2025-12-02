"""
Modal.com Serverless YouTube Audio Processor

This function runs on Modal's serverless infrastructure, which has:
- Real IP addresses (not blocked by YouTube)
- yt-dlp pre-installed
- Ability to download and upload audio to Cloudflare R2

Setup:
1. Install Modal: pip install modal
2. Create account at modal.com
3. Run: modal setup
4. Deploy: modal deploy youtube_processor.py

Environment variables needed in Modal:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_R2_ACCESS_KEY_ID
- CLOUDFLARE_R2_SECRET_ACCESS_KEY
- CLOUDFLARE_WORKER_URL
- ELEVENLABS_API_KEY
"""

import modal
import os
import json
import tempfile
import subprocess
from pathlib import Path

# Create Modal app - v2 with Node.js fix
app = modal.App("pashto-youtube-processor")

# Define the image with yt-dlp, Playwright browser, and other dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg", "wget", "gnupg")
    .pip_install(
        "yt-dlp",
        "boto3",
        "requests",
        "fastapi[standard]",
        "playwright",
    )
    .run_commands(
        # Install Playwright browsers (Chromium)
        "playwright install chromium",
        "playwright install-deps chromium",
    )
)

# Secrets for Cloudflare R2 and Worker
secrets = modal.Secret.from_name("cloudflare-credentials")


@app.function(
    image=image,
    secrets=[secrets],
    timeout=600,  # 10 minutes max for long videos
)
def process_youtube_video(youtube_url: str) -> dict:
    """
    Download audio from YouTube, upload to R2, and trigger transcription.
    
    Args:
        youtube_url: YouTube video URL
        
    Returns:
        dict with video_id, r2_key, transcript_url
    """
    import boto3
    import requests
    import re
    
    # Extract video ID
    video_id = extract_video_id(youtube_url)
    if not video_id:
        return {"success": False, "error": "Invalid YouTube URL"}
    
    print(f"🎬 Processing video: {video_id}")
    
    # Create temp directory for download
    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / f"{video_id}.mp3"
        
        # Try multiple methods to download audio
        audio_file = None
        download_error = None
        
        # Method 1: Use Playwright browser to bypass bot detection
        print("📥 Using Playwright browser to extract audio...")
        audio_urls_captured = []
        
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                # Launch browser with stealth settings
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        '--disable-blink-features=AutomationControlled',
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                    ]
                )
                
                context = browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    viewport={'width': 1920, 'height': 1080},
                )
                
                page = context.new_page()
                
                # Capture network requests for audio streams
                def handle_request(request):
                    url = request.url
                    if 'googlevideo.com' in url and ('audio' in url or 'mime=audio' in url):
                        print(f"🎵 Captured audio URL: {url[:100]}...")
                        audio_urls_captured.append(url)
                
                page.on('request', handle_request)
                
                # Navigate to YouTube video
                print(f"🌐 Loading YouTube page for {video_id}...")
                page.goto(f'https://www.youtube.com/watch?v={video_id}', timeout=60000)
                
                # Wait for video to start loading
                page.wait_for_timeout(5000)
                
                # Try to click play button if video didn't autoplay
                try:
                    play_button = page.locator('button.ytp-large-play-button')
                    if play_button.is_visible():
                        print("▶️ Clicking play button...")
                        play_button.click()
                        page.wait_for_timeout(3000)
                except:
                    pass
                
                # Get page title to verify we loaded correctly
                title = page.title()
                print(f"📄 Page title: {title}")
                
                # Try to get video info from ytInitialPlayerResponse
                player_response = page.evaluate('''() => {
                    if (window.ytInitialPlayerResponse) {
                        return window.ytInitialPlayerResponse;
                    }
                    return null;
                }''')
                
                browser.close()
                
                # First try URLs captured from network requests
                if audio_urls_captured:
                    print(f"🎵 Found {len(audio_urls_captured)} audio URLs from network")
                    for audio_url in audio_urls_captured:
                        try:
                            audio_response = requests.get(
                                audio_url,
                                headers={
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                    'Referer': 'https://www.youtube.com/',
                                },
                                timeout=180,
                                stream=True
                            )
                            
                            if audio_response.ok:
                                audio_file = output_path.with_suffix('.webm')
                                total_size = 0
                                with open(audio_file, 'wb') as f:
                                    for chunk in audio_response.iter_content(chunk_size=8192):
                                        f.write(chunk)
                                        total_size += len(chunk)
                                print(f"✅ Downloaded via network capture: {total_size / 1024 / 1024:.2f}MB")
                                break
                        except Exception as e:
                            print(f"⚠️ Failed to download captured URL: {e}")
                
                # Then try player response
                if (not audio_file or not audio_file.exists()) and player_response:
                    print("📦 Checking player response...")
                    playability = player_response.get('playabilityStatus', {})
                    status = playability.get('status', 'unknown')
                    reason = playability.get('reason', '')
                    print(f"   Status: {status}, Reason: {reason[:100] if reason else 'none'}")
                    
                    streaming_data = player_response.get('streamingData', {})
                    formats = streaming_data.get('adaptiveFormats', [])
                    print(f"   Found {len(formats)} formats")
                    
                    # Find audio format
                    audio_format = next(
                        (f for f in formats if f.get('mimeType', '').startswith('audio/') and f.get('url')),
                        None
                    )
                    
                    if audio_format and audio_format.get('url'):
                        audio_url = audio_format['url']
                        print(f"✅ Got audio URL from player response")
                        
                        audio_response = requests.get(
                            audio_url,
                            headers={
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Referer': 'https://www.youtube.com/',
                            },
                            timeout=180,
                            stream=True
                        )
                        
                        if audio_response.ok:
                            audio_file = output_path.with_suffix('.mp4')
                            total_size = 0
                            with open(audio_file, 'wb') as f:
                                for chunk in audio_response.iter_content(chunk_size=8192):
                                    f.write(chunk)
                                    total_size += len(chunk)
                            print(f"✅ Downloaded via player response: {total_size / 1024 / 1024:.2f}MB")
                        else:
                            print(f"⚠️ Audio download failed: {audio_response.status_code}")
                    else:
                        print("⚠️ No audio URL in player response")
                elif not player_response:
                    print("⚠️ No player response found")
                    
        except Exception as e:
            print(f"⚠️ Playwright method failed: {e}")
            import traceback
            traceback.print_exc()
        
        # Method 2: Try yt-dlp with Playwright cookies
        if not audio_file or not audio_file.exists():
            print("📥 Trying yt-dlp with browser cookies...")
            try:
                from playwright.sync_api import sync_playwright
                
                # Get cookies from a fresh browser session
                cookies_file = Path(tmpdir) / "cookies.txt"
                
                with sync_playwright() as p:
                    browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
                    context = browser.new_context()
                    page = context.new_page()
                    
                    # Visit YouTube to get cookies
                    page.goto('https://www.youtube.com', timeout=30000)
                    page.wait_for_timeout(2000)
                    
                    # Get cookies and write to Netscape format
                    cookies = context.cookies()
                    with open(cookies_file, 'w') as f:
                        f.write("# Netscape HTTP Cookie File\n")
                        for cookie in cookies:
                            domain = cookie.get('domain', '')
                            if not domain.startswith('.'):
                                domain = '.' + domain
                            secure = 'TRUE' if cookie.get('secure') else 'FALSE'
                            http_only = 'TRUE' if cookie.get('httpOnly') else 'FALSE'
                            expires = str(int(cookie.get('expires', 0)))
                            name = cookie.get('name', '')
                            value = cookie.get('value', '')
                            f.write(f"{domain}\tTRUE\t/\t{secure}\t{expires}\t{name}\t{value}\n")
                    
                    browser.close()
                
                print(f"🍪 Saved {len(cookies)} cookies to file")
                
                # Now try yt-dlp with cookies
                result = subprocess.run([
                    "yt-dlp",
                    "-x",
                    "--audio-format", "mp3",
                    "--audio-quality", "128K",
                    "-o", str(output_path),
                    "--no-playlist",
                    "--max-filesize", "100M",
                    "--cookies", str(cookies_file),
                    "--extractor-args", "youtube:player_client=web",
                    youtube_url
                ], capture_output=True, text=True, timeout=300)
                
                print(f"📋 yt-dlp with cookies return code: {result.returncode}")
                
                # Find downloaded file
                for f in Path(tmpdir).glob(f"{video_id}*"):
                    if f.suffix in ['.mp3', '.m4a', '.webm', '.opus', '.mp4']:
                        audio_file = f
                        print(f"✅ Downloaded with cookies: {audio_file}")
                        break
                
                if not audio_file or not audio_file.exists():
                    download_error = result.stderr[:500] if result.stderr else "Unknown error"
                    
            except Exception as e:
                print(f"⚠️ yt-dlp with cookies failed: {e}")
                download_error = str(e)
        
        # Check if we got the file
        if not audio_file or not audio_file.exists():
            return {"success": False, "error": f"All download methods failed. Last error: {download_error}"}
        
        file_size = audio_file.stat().st_size
        print(f"✅ Downloaded: {file_size / 1024 / 1024:.2f} MB")
        
        # Upload to Cloudflare R2
        print("📤 Uploading to Cloudflare R2...")
        r2_key = f"videos/{video_id}/audio.mp3"
        
        try:
            s3_client = boto3.client(
                's3',
                endpoint_url=f"https://{os.environ['CLOUDFLARE_ACCOUNT_ID']}.r2.cloudflarestorage.com",
                aws_access_key_id=os.environ['CLOUDFLARE_R2_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['CLOUDFLARE_R2_SECRET_ACCESS_KEY'],
                region_name='auto'
            )
            
            with open(audio_file, 'rb') as f:
                s3_client.put_object(
                    Bucket='pashto-bible-audio',
                    Key=r2_key,
                    Body=f,
                    ContentType='audio/mpeg'
                )
            
            print(f"✅ Uploaded to R2: {r2_key}")
            
        except Exception as e:
            return {"success": False, "error": f"R2 upload failed: {str(e)}"}
        
        # Trigger transcription via Cloudflare Worker
        print("🎙️ Triggering transcription...")
        worker_url = os.environ.get('CLOUDFLARE_WORKER_URL', 'https://pashtobiblesearch.jeremy-samuels17.workers.dev')
        
        try:
            response = requests.post(
                f"{worker_url}/api/transcribe-r2-audio",
                json={
                    "video_id": video_id,
                    "r2_key": r2_key,
                    "youtube_url": youtube_url
                },
                timeout=300
            )
            
            transcription_result = response.json()
            
            if response.ok and transcription_result.get('success'):
                print("✅ Transcription complete!")
                return {
                    "success": True,
                    "video_id": video_id,
                    "r2_key": r2_key,
                    "transcript": transcription_result.get('transcript'),
                    "segments": transcription_result.get('segments'),
                    "total_words": transcription_result.get('totalWords', 0)
                }
            else:
                return {
                    "success": True,  # Partial success - audio uploaded
                    "video_id": video_id,
                    "r2_key": r2_key,
                    "transcription_pending": True,
                    "transcription_error": transcription_result.get('error')
                }
                
        except Exception as e:
            return {
                "success": True,  # Partial success - audio uploaded
                "video_id": video_id,
                "r2_key": r2_key,
                "transcription_pending": True,
                "transcription_error": str(e)
            }


def extract_video_id(url: str) -> str | None:
    """Extract video ID from various YouTube URL formats."""
    import re
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/shorts\/([^&\n?#]+)',
        r'^([a-zA-Z0-9_-]{11})$'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


@app.function(image=image, secrets=[secrets])
def get_video_info(youtube_url: str) -> dict:
    """Get video metadata without downloading."""
    video_id = extract_video_id(youtube_url)
    if not video_id:
        return {"success": False, "error": "Invalid YouTube URL"}
    
    try:
        result = subprocess.run([
            "yt-dlp",
            "--dump-json",
            "--no-download",
            youtube_url
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            info = json.loads(result.stdout)
            return {
                "success": True,
                "video_id": video_id,
                "title": info.get('title'),
                "duration": info.get('duration'),
                "description": info.get('description', '')[:500],
                "thumbnail": info.get('thumbnail'),
                "channel": info.get('channel'),
                "upload_date": info.get('upload_date')
            }
        else:
            return {"success": False, "error": result.stderr[:200]}
            
    except Exception as e:
        return {"success": False, "error": str(e)}


# Web endpoint for triggering from the website
@app.function(image=image, secrets=[secrets])
@modal.fastapi_endpoint(method="POST")
def process_video_webhook(item: dict) -> dict:
    """
    Web endpoint to trigger video processing.
    
    POST body: {"youtube_url": "https://www.youtube.com/watch?v=..."}
    """
    youtube_url = item.get('youtube_url') or item.get('youtubeUrl') or item.get('url')
    
    if not youtube_url:
        return {"success": False, "error": "YouTube URL is required"}
    
    # Process synchronously (Modal handles the execution)
    result = process_youtube_video.remote(youtube_url)
    return result


# Local testing
if __name__ == "__main__":
    # Test with a sample video
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    with modal.enable_local_testing():
        info = get_video_info.remote(test_url)
        print(f"Video info: {info}")

