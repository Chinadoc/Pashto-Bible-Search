#!/usr/bin/env python3
"""
Process the specific Pashto video for better transcription accuracy
"""

import sys
import os
from cost_efficient_processor import CostEfficientProcessor

def main():
    # The specific video URL provided by the user
    video_url = "https://www.youtube.com/watch?v=0tvvnixN7iw&t=252s"

    print(f"🎬 Processing Pashto video: {video_url}")
    print("This video should contain only Pashto content (no Dari)")

    processor = CostEfficientProcessor()

    try:
        result = processor.process_video(video_url)

        if result['success']:
            print("✅ Successfully processed video!")
            print(f"Video ID: {result['video_id']}")
            print(f"Total segments: {result['total_segments']}")
            print(f"Successful transcriptions: {result['successful']}")
            print(f"Skipped music segments: {result.get('skipped_music', 0)}")
            savings = result.get('estimated_cost_savings', 0)
            print(f"Estimated cost savings: ${savings:.2f}")

            # Check for sentence clips
            total_sentence_clips = 0
            if 'segments' in result:
                for segment in result['segments']:
                    if 'sentence_clips' in segment:
                        total_sentence_clips += len(segment['sentence_clips'])

            print(f"Total sentence audio clips created: {total_sentence_clips}")

            # Check if transcriptions contain Pashto content
            if 'transcriptions' in result:
                pashto_count = 0
                total_transcriptions = len(result['transcriptions'])

                for transcription in result['transcriptions']:
                    text = transcription.get('transcript', '')
                    # Check if text contains Pashto characters (U+0600-U+06FF)
                    if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in text):
                        pashto_count += 1

                print(f"Pashto transcriptions: {pashto_count}/{total_transcriptions}")

                if pashto_count > 0:
                    print("✅ Successfully detected Pashto content!")
                else:
                    print("⚠️ No Pashto content detected - may need manual review")

        else:
            print(f"❌ Processing failed: {result.get('error', 'Unknown error')}")

    except Exception as e:
        print(f"❌ Error processing video: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
