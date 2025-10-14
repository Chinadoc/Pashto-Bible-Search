#!/usr/bin/env python3
"""
Check which Old Testament books have audio files available on Afghan Bibles.
"""

import requests
import time
from typing import List, Dict

# All OT book slugs from the Afghan Bibles site
OT_BOOK_SLUGS = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
    "joshua", "judges", "ruth", "1-samuel", "2-samuel",
    "1-kings", "2-kings", "1-chronicles", "2-chronicles",
    "ezra", "nehemiah", "esther", "job", "psalms", "proverbs",
    "ecclesiastes", "song-of-songs", "isaiah", "jeremiah",
    "lamentations", "ezekiel", "daniel", "hosea", "joel",
    "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk",
    "zephaniah", "haggai", "zechariah", "malachi"
]

def check_book_audio_availability(book_slug: str) -> Dict:
    """Check if a book has audio files available"""
    base_url = f"https://afghanbibles.org/pashto-afeastern-audio/{book_slug}-1.mp3"

    try:
        response = requests.head(base_url, timeout=10)
        has_audio = response.status_code == 200

        if has_audio:
            print(f"✅ {book_slug}: Audio available")
        else:
            print(f"❌ {book_slug}: No audio (status: {response.status_code})")

        return {
            'book_slug': book_slug,
            'has_audio': has_audio,
            'status_code': response.status_code,
            'url': base_url
        }

    except Exception as e:
        print(f"❌ {book_slug}: Error checking - {e}")
        return {
            'book_slug': book_slug,
            'has_audio': False,
            'error': str(e),
            'url': base_url
        }

def check_all_ot_books() -> List[Dict]:
    """Check all OT books for audio availability"""
    print("🔍 Checking Old Testament books for audio availability...")
    print("=" * 60)

    results = []

    for book_slug in OT_BOOK_SLUGS:
        result = check_book_audio_availability(book_slug)
        results.append(result)

        # Small delay to be respectful to the server
        time.sleep(0.5)

    return results

def check_book_chapter_count(book_slug: str) -> int:
    """Check how many chapters a book has by trying to access chapter 1 page"""
    url = f"https://afghanbibles.org/eng/pashto-bible/{book_slug}/{book_slug}-1"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            # Look for chapter options in the HTML
            import re
            chapter_options = re.findall(r'<option value=["\']?(\d+)["\']?>', response.text)
            if chapter_options:
                return max(int(ch) for ch in chapter_options)
            return 1
        return 1
    except:
        return 1

def analyze_results(results: List[Dict]) -> Dict:
    """Analyze the results and provide summary"""
    books_with_audio = [r for r in results if r['has_audio']]
    books_without_audio = [r for r in results if not r['has_audio']]

    print("\n" + "=" * 60)
    print("📊 RESULTS SUMMARY")
    print("=" * 60)
    print(f"✅ Books with audio: {len(books_with_audio)}")
    print(f"❌ Books without audio: {len(books_without_audio)}")
    print(f"📚 Total OT books checked: {len(results)}")

    if books_with_audio:
        print(f"\n🎵 Books with audio available:")
        for book in books_with_audio:
            chapter_count = check_book_chapter_count(book['book_slug'])
            print(f"  • {book['book_slug']} ({chapter_count} chapters)")

    if books_without_audio:
        print(f"\n📭 Books without audio:")
        for book in books_without_audio:
            print(f"  • {book['book_slug']}")

    return {
        'books_with_audio': books_with_audio,
        'books_without_audio': books_without_audio,
        'total_with_audio': len(books_with_audio),
        'total_without_audio': len(books_without_audio)
    }

def main():
    """Main function"""
    print("🎯 OT Audio Availability Checker")
    print("================================")

    # Run the check
    results = check_all_ot_books()

    # Analyze and display results
    summary = analyze_results(results)

    # Save results to file for later use
    import json
    with open('ot_audio_availability_results.json', 'w') as f:
        json.dump(results, f, indent=2)

    print("\n💾 Results saved to: ot_audio_availability_results.json")
    return summary

if __name__ == "__main__":
    summary = main()
