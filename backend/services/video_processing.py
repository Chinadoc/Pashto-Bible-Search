from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple

from yt_dlp import YoutubeDL

class VideoProcessingError(RuntimeError):
    """Raised when audio processing fails."""


SILENCE_START_RE = re.compile(r"silence_start: (?P<value>-?\d+(?:\.\d+)?)")
SILENCE_END_RE = re.compile(r"silence_end: (?P<value>-?\d+(?:\.\d+)?)(?:\s*\|\s*silence_duration: (?P<duration>-?\d+(?:\.\d+)?))?")


def extract_video_id(youtube_url: str) -> str:
    patterns = [
        r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)",
        r"youtube\.com/v/([^&\n?#]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, youtube_url)
        if match:
            return match.group(1)
    raise VideoProcessingError("Unable to extract YouTube video ID from URL.")


def download_youtube_audio(youtube_url: str, output_dir: Path) -> Tuple[str, Path]:
    """
    Download YouTube audio as WAV using yt_dlp.
    Returns (video_id, audio_path).
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    video_id = extract_video_id(youtube_url)

    output_template = str(output_dir / f"{video_id}.%(ext)s")
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_template,
        "quiet": True,
        "no_warnings": True,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
    }

    with YoutubeDL(ydl_opts) as ydl:
        result = ydl.download([youtube_url])
        if result != 0:
            raise VideoProcessingError("yt_dlp failed to download audio.")

    audio_path = output_dir / f"{video_id}.wav"
    if not audio_path.exists():
        raise VideoProcessingError("Downloaded audio file not found.")

    return video_id, audio_path


def _run_ffprobe(audio_path: Path) -> Dict:
    cmd = [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(audio_path),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(proc.stdout)


def _run_silencedetect(audio_path: Path) -> str:
    cmd = [
        "ffmpeg",
        "-i",
        str(audio_path),
        "-af",
        "silencedetect=noise=-30dB:d=0.5",
        "-f",
        "null",
        "-",
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode not in (0, 255):
        raise VideoProcessingError(f"ffmpeg silencedetect failed: {proc.stderr}")
    return proc.stderr or proc.stdout


def analyze_audio_segments(audio_path: Path) -> Tuple[Dict, List[Dict]]:
    """
    Inspect audio file metadata and detect speech segments.
    Returns (audio_info, segments list).
    """
    probe = _run_ffprobe(audio_path)
    duration = float(probe["format"]["duration"])
    stream = probe["streams"][0]
    audio_info = {
        "duration": duration,
        "size": int(probe["format"].get("size", 0)),
        "bitrate": int(probe["format"].get("bit_rate", 0)),
        "sampleRate": int(stream.get("sample_rate", 0)),
        "channels": int(stream.get("channels", 0)),
    }

    silencedetect_output = _run_silencedetect(audio_path)
    segments: List[Dict] = []
    current_start = 0.0

    silence_events: List[Tuple[str, float]] = []
    for line in silencedetect_output.splitlines():
        if match := SILENCE_START_RE.search(line):
            silence_events.append(("start", float(match.group("value"))))
        elif match := SILENCE_END_RE.search(line):
            silence_events.append(("end", float(match.group("value"))))

    has_silence = bool(silence_events)
    for event_type, value in silence_events:
        if event_type == "start":
            if value > current_start:
                segments.append(
                    {
                        "start": current_start,
                        "end": value,
                        "duration": value - current_start,
                        "hasSpeech": True,
                        "confidence": 0.8,
                    }
                )
        elif event_type == "end":
            current_start = value

    if current_start < duration:
        segments.append(
            {
                "start": current_start,
                "end": duration,
                "duration": duration - current_start,
                "hasSpeech": True,
                "confidence": 0.8 if has_silence else 0.6,
            }
        )

    filtered = [seg for seg in segments if seg["duration"] > 1.0]
    merged: List[Dict] = []
    for seg in filtered:
        if merged and seg["start"] - merged[-1]["end"] < 0.5:
            merged[-1]["end"] = seg["end"]
            merged[-1]["duration"] = merged[-1]["end"] - merged[-1]["start"]
        else:
            merged.append(seg)

    if not merged:
        merged.append(
            {
                "start": 0.0,
                "end": duration,
                "duration": duration,
                "hasSpeech": True,
                "confidence": 0.5,
            }
        )

    return audio_info, merged


def extract_segment(audio_path: Path, start: float, end: float, output_path: Path) -> Path:
    """
    Extract a single audio segment using ffmpeg.
    """
    duration = max(end - start, 0)
    if duration <= 0:
        raise VideoProcessingError("Invalid segment duration.")

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(audio_path),
        "-ss",
        f"{start:.3f}",
        "-t",
        f"{duration:.3f}",
        "-acodec",
        "libmp3lame",
        "-b:a",
        "128k",
        str(output_path),
    ]
    proc = subprocess.run(cmd, capture_output=True)
    if proc.returncode != 0:
        raise VideoProcessingError(f"ffmpeg segment extraction failed: {proc.stderr}")
    return output_path


def extract_segments(
    audio_path: Path,
    segments: List[Dict],
    output_dir: Path,
) -> List[Tuple[Dict, Path]]:
    """
    Extract multiple segments and return list of (segment_metadata, file_path).
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    results: List[Tuple[Dict, Path]] = []

    for idx, segment in enumerate(segments):
        start = float(segment["start"])
        end = float(segment["end"])
        duration = max(end - start, 0)
        filename = f"segment_{idx + 1:03d}.mp3"
        segment_path = output_dir / filename
        extract_segment(audio_path, start, end, segment_path)

        segment_meta = {
            "segmentIndex": idx,
            "start": start,
            "end": end,
            "duration": duration,
        }
        results.append((segment_meta, segment_path))

    return results
