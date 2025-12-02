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

# Define the image with yt-dlp and other dependencies
# Use micromamba image which has better package support
image = (
    modal.Image.micromamba(python_version="3.11")
    .apt_install("ffmpeg")
    .micromamba_install("nodejs=20", channels=["conda-forge"])
    .pip_install(
        "yt-dlp",
        "boto3",
        "requests",
        "fastapi[standard]",
    )
    .run_commands(
        "node --version",
        "which node",
        # Create symlink so yt-dlp can find node
        "ln -sf /opt/conda/bin/node /usr/local/bin/node",
        "ln -sf /opt/conda/bin/node /usr/bin/node",
        # Verify the symlinks work
        "/usr/bin/node --version"
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
        
        # Method 1: Try cobalt.tools API first (less likely to be blocked)
        print("📥 Trying cobalt.tools API...")
        try:
            cobalt_response = requests.post(
                'https://api.cobalt.tools/api/json',
                headers={
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                json={
                    'url': youtube_url,
                    'aFormat': 'mp3',
                    'isAudioOnly': True,
                    'filenamePattern': 'basic',
                },
                timeout=30
            )
            
            if cobalt_response.ok:
                cobalt_data = cobalt_response.json()
                if cobalt_data.get('url'):
                    print(f"✅ Got audio URL from cobalt: {cobalt_data['url'][:80]}...")
                    # Download the audio file
                    audio_response = requests.get(cobalt_data['url'], timeout=120)
                    if audio_response.ok:
                        audio_file = output_path.with_suffix('.mp3')
                        with open(audio_file, 'wb') as f:
                            f.write(audio_response.content)
                        print(f"✅ Downloaded via cobalt: {audio_file.stat().st_size / 1024 / 1024:.2f}MB")
                else:
                    print(f"⚠️ Cobalt didn't return URL: {cobalt_data}")
            else:
                print(f"⚠️ Cobalt API error: {cobalt_response.status_code}")
        except Exception as e:
            print(f"⚠️ Cobalt failed: {e}")
        
        # Method 2: Try yt-dlp if cobalt failed
        if not audio_file or not audio_file.exists():
            print("📥 Trying yt-dlp...")
            try:
                env = os.environ.copy()
                env["PATH"] = "/usr/bin:/usr/local/bin:/opt/conda/bin:" + env.get("PATH", "")
                
                result = subprocess.run([
                    "yt-dlp",
                    "-x",
                    "--audio-format", "mp3",
                    "--audio-quality", "128K",
                    "-o", str(output_path),
                    "--no-playlist",
                    "--max-filesize", "100M",
                    "--no-warnings",
                    youtube_url
                ], capture_output=True, text=True, timeout=300, env=env)
                
                print(f"📋 yt-dlp return code: {result.returncode}")
                
                # Find downloaded file
                for f in Path(tmpdir).glob(f"{video_id}*"):
                    if f.suffix in ['.mp3', '.m4a', '.webm', '.opus', '.mp4']:
                        audio_file = f
                        break
                
                if not audio_file or not audio_file.exists():
                    download_error = result.stderr[:300] if result.stderr else "Unknown error"
                    
            except subprocess.TimeoutExpired:
                download_error = "Download timed out"
        
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

