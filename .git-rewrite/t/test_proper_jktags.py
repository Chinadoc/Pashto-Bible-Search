#!/usr/bin/env python3

import base64
import json
from typing import List

def decode_tag_payload(encoded: str) -> List[List]:
    """Decode the compressed timeline payload found in the jktags input."""
    print(f"Original encoded: {encoded[:50]}...")

    rev = encoded[::-1]
    print(f"Reversed: {rev[:50]}...")

    # Important: replace longer tokens first to prevent overlap
    replacements = (('&41', '===='), ('&3', '==='), ('&2', '=='), ('&1', '='))
    for orig, repl in replacements:
        count = rev.count(orig)
        if count > 0:
            print(f"Replacing '{orig}' with '{repl}' ({count} times)")
            rev = rev.replace(orig, repl)
        else:
            print(f"No '{orig}' found")

    print(f"After replacements: {rev[:50]}...")

    def rot13(s: str) -> str:
        out_chars = []
        for ch in s:
            if 'a' <= ch <= 'z':
                out_chars.append(chr((ord(ch) - 97 + 13) % 26 + 97))
            elif 'A' <= ch <= 'Z':
                out_chars.append(chr((ord(ch) - 65 + 13) % 26 + 65))
            else:
                out_chars.append(ch)
        return ''.join(out_chars)

    rot = rot13(rev)
    print(f"After ROT13: {rot[:100]}...")
    print(f"ROT13 sample decoded: {rot[:200]}")

    # Let's check if it's base64 encoded JSON
    try:
        print("Trying base64 decode of ROT13 result...")
        decoded = base64.b64decode(rot).decode('utf-8')
        print(f"Base64 decoded: {decoded[:100]}...")
        result = json.loads(f'[{decoded}]')
        return result
    except Exception as e1:
        print(f"Base64 decode failed: {e1}")

        # Maybe it's already JSON but needs different parsing
        try:
            print("Trying to parse as JSON arrays separated by commas...")
            # The ROT13 result looks like: [0.000000,0.050000,null,null],[0.050000,...
            # Let's split by '],' and add brackets
            arrays = rot.split('],')
            print(f"Found {len(arrays)} array segments")
            result = []
            for i, arr in enumerate(arrays):
                arr = arr.strip()
                if not arr.startswith('['):
                    arr = '[' + arr
                if not arr.endswith(']') and i < len(arrays)-1:
                    arr = arr + ']'
                elif i == len(arrays)-1 and not arr.endswith(']'):
                    arr = arr + ']'
                print(f"Parsing array {i}: {arr[:50]}...")
                try:
                    parsed = json.loads(arr)
                    result.append(parsed)
                except json.JSONDecodeError as e:
                    print(f"Failed to parse array {i}: {e}")
                    break
            if len(result) > 0:
                return result
        except Exception as e2:
            print(f"Array parsing failed: {e2}")

    return []

    try:
        decoded = base64.b64decode(rot).decode('utf-8')
        print(f"Base64 decoded: {decoded[:50]}...")
        result = json.loads(f'[{decoded}]')
        return result
    except Exception as e:
        print(f"Error in decoding: {e}")
        print(f"ROT13 result length: {len(rot)}")
        print(f"ROT13 result ends with: {rot[-10:]}")
        # Try to parse the ROT13 result as multiple JSON objects
        try:
            # Split by commas and try to parse as separate arrays
            parts = rot.split('],[')
            if len(parts) > 1:
                print(f"Found {len(parts)} potential JSON arrays")
                result = []
                for i, part in enumerate(parts):
                    part = part.replace('[', '').replace(']', '')
                    if i == 0: part = '[' + part + ']'
                    elif i == len(parts)-1: part = '[' + part + ']'
                    else: part = '[' + part + ']'
                    try:
                        parsed = json.loads(part)
                        result.append(parsed)
                    except:
                        print(f"Failed to parse part {i}: {part[:50]}...")
                return result
        except:
            pass
        return []

# Test with the jktags data
jktags_data = '0SZkjvAfNQZjNwAk4lZ2jPZjNQZ0pwY4HmJf0IZfLQYjNQZjDmAhtGAfNQZjNQA14lZ1fSYqSGZfHQYjNQZjDGAhZGAfNQZjNwA14FB0fSYqSQY1jPZjNQZ2HwY5DQY5LQZjpwZhHQAokFKmRQY0jFB2NQZ3VwY1DQYjNQZjtwAhRQAokFK2jPAfNQZjNQB24FZ0jPZjNQZlDwY5ZmJf0IZfDQYjNQZjVQAhxmZfNQZjNQAm4lAmfSYqqwZfZQYjNQZjDmZhpmZfNQZjNQZ54vZmfSYqyGZfZQYjNQZjNGBhVmZfNQZjNQB04FBlfSYqOGZfZQYjNQZjNGAhLGZfNQZjNQZ14lZkfSYquGZfRQYjNQZjNGAhZGZfNQZjNwZ54PZkfSYqyQYkjPZjNQZlxwYjRQYjNQZjtQBhpmJf0IZfRQYjNQZjtQBhpQY0VGZjNwAhDmJf0IZfVFZmWPY0VGZjNwAhDQYkVGZjHmAhRmJf0IZfVvZVWPYkVGZjHmAhRQY4xGZjLGZhNmJf0IZfVFZVWPY4xGZjLGZhNQYjNQZjHQZhNmJf0SofIaofjTo15TYjNQZjHQZhNQYjNQZjNQZhNmJ'

print('Testing proper jktags decoding...')
result = decode_tag_payload(jktags_data)
print('Decoded result:')
print(json.dumps(result, indent=2))
print(f'Number of entries: {len(result)}')

# Analyze the structure if we got results
if result:
    print('\nAnalyzing structure:')
    for i, entry in enumerate(result[:10]):  # Show first 10
        print(f'Entry {i}: {entry} (type: {type(entry)}, length: {len(entry) if hasattr(entry, "__len__") else "N/A"})')
