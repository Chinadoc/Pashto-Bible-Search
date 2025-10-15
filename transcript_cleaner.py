#!/usr/bin/env python3
"""
Transcript Cleaner for Pashto Bible Search
Removes mixed language content and improves transcript quality
"""

import re
from pathlib import Path
from typing import List, Dict

class TranscriptCleaner:
    def __init__(self):
        # Common non-Pashto words to remove
        self.urdu_words = {
            'اور', 'کے', 'ہے', 'ہیں', 'میں', 'کو', 'پر', 'سے', 'کی', 'کا', 'کیا',
            'ہوا', 'ہوئی', 'ہوئے', 'ہوتا', 'ہوتی', 'ہوتے', 'ہونا', 'ہونی', 'ہونے'
        }
        
        self.english_words = {
            'the', 'and', 'or', 'of', 'in', 'is', 'it', 'to', 'for', 'with',
            'this', 'that', 'you', 'your', 'we', 'our', 'they', 'their'
        }
        
        # Pashto-specific patterns to keep
        self.pashto_patterns = [
            r'[دذ]',  # Pashto "da" sound
            r'[کگ]',  # Pashto "k/g" sounds
            r'[پب]',  # Pashto "p/b" sounds
            r'[تط]',  # Pashto "t" sounds
            r'[چج]',  # Pashto "ch/j" sounds
        ]
    
    def clean_text(self, text: str) -> str:
        """Clean transcript text by removing non-Pashto content."""
        # Remove English words
        words = text.split()
        cleaned_words = []
        
        for word in words:
            # Remove punctuation for checking
            clean_word = re.sub(r'[^\w]', '', word.lower())
            
            # Skip English words
            if clean_word in self.english_words:
                continue
            
            # Skip Urdu words
            if clean_word in self.urdu_words:
                continue
            
            # Keep the original word with punctuation
            cleaned_words.append(word)
        
        # Join words back
        cleaned_text = ' '.join(cleaned_words)
        
        # Remove extra whitespace
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        
        return cleaned_text
    
    def remove_repetitive_content(self, text: str) -> str:
        """Remove excessive repetitive content."""
        words = text.split()
        
        # Remove words that appear more than 5 times
        word_counts = {}
        for word in words:
            word_counts[word] = word_counts.get(word, 0) + 1
        
        # Filter out overly repeated words
        filtered_words = []
        for word in words:
            if word_counts[word] <= 5:
                filtered_words.append(word)
            elif word_counts[word] > 5 and len(word) > 3:  # Keep longer words even if repeated
                filtered_words.append(word)
        
        return ' '.join(filtered_words)
    
    def fix_punctuation(self, text: str) -> str:
        """Fix punctuation issues."""
        # Add proper sentence endings if missing
        if text and not text.endswith(('.', '!', '?', '۔', '؟')):
            text += '.'
        
        # Fix multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Fix punctuation spacing
        text = re.sub(r'\s+([.!?۔؟])', r'\1', text)
        
        return text.strip()
    
    def clean_transcript_file(self, input_file: Path, output_file: Path = None) -> Dict:
        """Clean a single transcript file."""
        if not input_file.exists():
            return {'error': f'File not found: {input_file}'}
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                original_text = f.read().strip()
            
            # Clean the text
            cleaned_text = self.clean_text(original_text)
            cleaned_text = self.remove_repetitive_content(cleaned_text)
            cleaned_text = self.fix_punctuation(cleaned_text)
            
            # Calculate improvements
            original_words = len(original_text.split())
            cleaned_words = len(cleaned_text.split())
            words_removed = original_words - cleaned_words
            
            # Save cleaned version
            if output_file is None:
                output_file = input_file.parent / f"{input_file.stem}_cleaned.txt"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(cleaned_text)
            
            return {
                'success': True,
                'original_words': original_words,
                'cleaned_words': cleaned_words,
                'words_removed': words_removed,
                'output_file': str(output_file),
                'improvement_percent': round((words_removed / original_words) * 100, 2) if original_words > 0 else 0
            }
            
        except Exception as e:
            return {'error': f'Error processing {input_file}: {e}'}
    
    def clean_all_transcripts(self, input_dir: str = "poems", output_dir: str = "cleaned_poems"):
        """Clean all transcripts in a directory."""
        input_path = Path(input_dir)
        output_path = Path(output_dir)
        
        if not input_path.exists():
            print(f"❌ Input directory not found: {input_dir}")
            return
        
        output_path.mkdir(exist_ok=True)
        
        transcript_files = list(input_path.glob("*.txt"))
        
        if not transcript_files:
            print(f"❌ No transcript files found in {input_dir}")
            return
        
        print(f"🧹 Cleaning {len(transcript_files)} transcript files...")
        
        results = []
        total_words_removed = 0
        total_original_words = 0
        
        for transcript_file in transcript_files:
            output_file = output_path / f"{transcript_file.stem}_cleaned.txt"
            
            result = self.clean_transcript_file(transcript_file, output_file)
            results.append(result)
            
            if result.get('success'):
                print(f"✅ {transcript_file.name}: {result['words_removed']} words removed ({result['improvement_percent']}%)")
                total_words_removed += result['words_removed']
                total_original_words += result['original_words']
            else:
                print(f"❌ {transcript_file.name}: {result.get('error', 'Unknown error')}")
        
        print(f"\n📊 Cleaning Summary:")
        print(f"   Total words removed: {total_words_removed}")
        print(f"   Total original words: {total_original_words}")
        print(f"   Overall improvement: {round((total_words_removed / total_original_words) * 100, 2)}%")
        print(f"   Cleaned files saved to: {output_dir}")
        
        return results

def main():
    cleaner = TranscriptCleaner()
    cleaner.clean_all_transcripts()

if __name__ == "__main__":
    main()
