#!/usr/bin/env python3
"""
Test script to verify text extraction is working correctly
"""

import re

def extract_words_from_text(text: str) -> list:
    """Extract individual words from text, handling Pashto specifics."""
    # Simple approach: split on whitespace and filter for Pashto characters
    words = text.split()
    pashto_words = []

    for word in words:
        # Keep only words that contain Pashto characters
        if re.search(r'[\u0600-\u06FF]', word):
            # Remove common punctuation
            clean_word = re.sub(r'[،.؛:؟()«»"\']', '', word).strip()
            if clean_word and len(clean_word) > 0:
                pashto_words.append(clean_word)

    return pashto_words

# Test with sample text from the file
sample_text = """د عیسی مسیح په هکله د یوحنا انجیل
لومړی فصل
د ژوندون کلام
۱
په ازل کې کلام ؤ. کلام د خدای سره ؤ او کلام په خپله خدای ؤ،
۲
په ازل کې کلام د خدای سره ؤ.
۳
خدای ټول شیان د کلام په وسیله پیدا کړل او هېڅ شی بې له کلامه نه دی پیدا شوی."""

print("Testing word extraction...")
words = extract_words_from_text(sample_text)
print(f"Found {len(words)} words:")
for i, word in enumerate(words[:20]):  # Show first 20
    print(f"  {i+1:2d}. {word}")

print(f"\nTotal words extracted: {len(words)}")
