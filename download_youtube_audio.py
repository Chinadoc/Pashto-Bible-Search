#!/usr/bin/env python3
"""
Download audio from YouTube videos.

This script uses yt-dlp to download audio from YouTube videos
and save them as MP3 files for use in the Pashto Bible Search project.
"""

import argparse
import logging
import os
import subprocess
import sys
from pathlib import Path
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('youtube_audio_download.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('youtube_audio_downloader')

class YouTubeAudioDownloader:
    """Download audio from YouTube videos using yt-dlp"""

    def __init__(self, output_dir: str = "youtube_audio"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Check if yt-dlp is available
        try:
            subprocess.run(['yt-dlp', '--version'],
                         capture_output=True, check=True)
            logger.info("✅ yt-dlp is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.error("❌ yt-dlp is not installed or not in PATH")
            logger.info("💡 Install yt-dlp with: pip install yt-dlp")
            logger.info("   Or: brew install yt-dlp (on macOS)")
            sys.exit(1)

    def download_audio(self, url: str, output_filename: Optional[str] = None) -> Optional[str]:
        """
        Download audio from a YouTube URL

        Args:
            url: YouTube URL to download from
            output_filename: Optional custom filename (without extension)

        Returns:
            Path to downloaded file, or None if failed
        """
        try:
            logger.info(f"🔄 Downloading audio from: {url}")

            # Prepare yt-dlp command
            cmd = [
                'yt-dlp',
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '192K',
                '--output', str(self.output_dir / (output_filename or '%(title)s.%(ext)s')),
                '--no-playlist',
                '--quiet',
                url
            ]

            logger.info(f"Running: {' '.join(cmd)}")

            # Execute the download
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                # Find the downloaded file
                downloaded_files = list(self.output_dir.glob("*.mp3"))
                if downloaded_files:
                    # Get the most recently created file
                    downloaded_file = max(downloaded_files, key=lambda f: f.stat().st_mtime)
                    logger.info(f"✅ Downloaded: {downloaded_file}")
                    return str(downloaded_file)
                else:
                    logger.error("❌ No MP3 file found after download")
                    return None
            else:
                logger.error(f"❌ yt-dlp failed with return code {result.returncode}")
                logger.error(f"Error output: {result.stderr}")
                return None

        except Exception as e:
            logger.error(f"❌ Error downloading {url}: {e}")
            return None

    def download_specific_video(self, video_id: str, start_time: Optional[str] = None) -> Optional[str]:
        """
        Download a specific YouTube video by ID with optional time offset

        Args:
            video_id: YouTube video ID (e.g., 'Xqn_-onV9DQ')
            start_time: Optional start time in seconds (e.g., '66')

        Returns:
            Path to downloaded file, or None if failed
        """
        url = f"https://www.youtube.com/watch?v={video_id}"
        if start_time:
            url += f"&t={start_time}"

        # Use video ID as filename base
        filename = f"youtube_{video_id}"
        if start_time:
            filename += f"_t{start_time}"

        return self.download_audio(url, filename)

def main():
    parser = argparse.ArgumentParser(description='Download audio from YouTube videos')
    parser.add_argument('--url', help='YouTube URL to download')
    parser.add_argument('--video-id', help='YouTube video ID (e.g., Xqn_-onV9DQ)')
    parser.add_argument('--start-time', help='Start time in seconds (optional)')
    parser.add_argument('--output-dir', default='youtube_audio', help='Output directory')
    parser.add_argument('--output-filename', help='Custom output filename (without extension)')

    args = parser.parse_args()

    downloader = YouTubeAudioDownloader(args.output_dir)

    if args.url:
        result = downloader.download_audio(args.url, args.output_filename)
    elif args.video_id:
        result = downloader.download_specific_video(args.video_id, args.start_time)
    else:
        logger.error("❌ Please provide either --url or --video-id")
        return

    if result:
        logger.info(f"🎉 Download completed: {result}")
    else:
        logger.error("❌ Download failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
