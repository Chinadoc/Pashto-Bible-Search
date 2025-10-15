#!/usr/bin/env python3
"""
Quality Checker for Pashto Transcripts
Detects mixed language content and quality issues
"""

import re
from pathlib import Path
from typing import List, Dict, Tuple

class TranscriptQualityChecker:
    def __init__(self):
        # Common non-Pashto words/patterns
        self.urdu_patterns = [
            r'\bاور\b',  # Urdu "and"
            r'\bکے\b',   # Urdu "of"
            r'\bہے\b',   # Urdu "is"
            r'\bہیں\b',  # Urdu "are"
            r'\bمیں\b',  # Urdu "in"
            r'\bکو\b',   # Urdu "to"
            r'\bپر\b',   # Urdu "on"
            r'\bسے\b',   # Urdu "from"
        ]
        
        self.english_patterns = [
            r'\bthe\b', r'\band\b', r'\bor\b', r'\bof\b', r'\bin\b',
            r'\bis\b', r'\bit\b', r'\bto\b', r'\bfor\b', r'\bwith\b'
        ]
        
        # Pashto-specific patterns
        self.pashto_patterns = [
            r'[دذ]',  # Pashto "da" sound
            r'[کگ]',  # Pashto "k/g" sounds
            r'[پب]',  # Pashto "p/b" sounds
            r'[تط]',  # Pashto "t" sounds
            r'[چج]',  # Pashto "ch/j" sounds
        ]
        
        # Quality indicators
        self.quality_issues = {
            'mixed_language': [],
            'too_short': [],
            'too_long': [],
            'repetitive': [],
            'incomplete': []
        }
    
    def detect_mixed_language(self, text: str) -> List[Dict]:
        """Detect mixed language content in transcript."""
        issues = []
        
        # Check for Urdu patterns
        urdu_matches = []
        for pattern in self.urdu_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            urdu_matches.extend(matches)
        
        if urdu_matches:
            issues.append({
                'type': 'urdu_content',
                'matches': urdu_matches,
                'severity': 'medium',
                'message': f'Found {len(urdu_matches)} Urdu words/phrases'
            })
        
        # Check for English patterns
        english_matches = []
        for pattern in self.english_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            english_matches.extend(matches)
        
        if english_matches:
            issues.append({
                'type': 'english_content',
                'matches': english_matches,
                'severity': 'high',
                'message': f'Found {len(english_matches)} English words'
            })
        
        return issues
    
    def check_length(self, text: str) -> List[Dict]:
        """Check if transcript length is appropriate."""
        issues = []
        word_count = len(text.split())
        char_count = len(text)
        
        if word_count < 10:
            issues.append({
                'type': 'too_short',
                'word_count': word_count,
                'char_count': char_count,
                'severity': 'high',
                'message': f'Transcript too short: {word_count} words'
            })
        
        if word_count > 200:
            issues.append({
                'type': 'too_long',
                'word_count': word_count,
                'char_count': char_count,
                'severity': 'medium',
                'message': f'Transcript very long: {word_count} words'
            })
        
        return issues
    
    def check_repetition(self, text: str) -> List[Dict]:
        """Check for repetitive content."""
        issues = []
        words = text.split()
        
        # Check for repeated words
        word_counts = {}
        for word in words:
            word_counts[word] = word_counts.get(word, 0) + 1
        
        repeated_words = {word: count for word, count in word_counts.items() if count > 3}
        
        if repeated_words:
            issues.append({
                'type': 'repetitive',
                'repeated_words': repeated_words,
                'severity': 'medium',
                'message': f'Found {len(repeated_words)} frequently repeated words'
            })
        
        return issues
    
    def check_completeness(self, text: str) -> List[Dict]:
        """Check if transcript appears complete."""
        issues = []
        
        # Check for incomplete sentences
        if not text.endswith(('.', '!', '?', '۔', '؟')):
            issues.append({
                'type': 'incomplete',
                'severity': 'low',
                'message': 'Transcript does not end with proper punctuation'
            })
        
        # Check for very short sentences
        sentences = re.split(r'[.!?۔؟]', text)
        short_sentences = [s.strip() for s in sentences if len(s.strip()) < 5 and s.strip()]
        
        if len(short_sentences) > len(sentences) * 0.3:  # More than 30% short sentences
            issues.append({
                'type': 'incomplete',
                'severity': 'medium',
                'message': f'Many short/incomplete sentences: {len(short_sentences)}/{len(sentences)}'
            })
        
        return issues
    
    def analyze_transcript(self, text: str, filename: str = "") -> Dict:
        """Perform complete quality analysis of a transcript."""
        analysis = {
            'filename': filename,
            'text_length': len(text),
            'word_count': len(text.split()),
            'issues': [],
            'quality_score': 100,
            'recommendations': []
        }
        
        # Run all checks
        all_issues = []
        all_issues.extend(self.detect_mixed_language(text))
        all_issues.extend(self.check_length(text))
        all_issues.extend(self.check_repetition(text))
        all_issues.extend(self.check_completeness(text))
        
        analysis['issues'] = all_issues
        
        # Calculate quality score
        for issue in all_issues:
            if issue['severity'] == 'high':
                analysis['quality_score'] -= 20
            elif issue['severity'] == 'medium':
                analysis['quality_score'] -= 10
            else:
                analysis['quality_score'] -= 5
        
        analysis['quality_score'] = max(0, analysis['quality_score'])
        
        # Generate recommendations
        if any(issue['type'] == 'urdu_content' for issue in all_issues):
            analysis['recommendations'].append('Consider re-transcribing to remove Urdu content')
        
        if any(issue['type'] == 'english_content' for issue in all_issues):
            analysis['recommendations'].append('Remove English words from transcript')
        
        if any(issue['type'] == 'too_short' for issue in all_issues):
            analysis['recommendations'].append('Transcript may be incomplete - check audio quality')
        
        if any(issue['type'] == 'repetitive' for issue in all_issues):
            analysis['recommendations'].append('Consider manual review for repetitive content')
        
        return analysis
    
    def check_all_transcripts(self, transcripts_dir: str = "poems") -> List[Dict]:
        """Check quality of all transcripts in a directory."""
        transcripts_path = Path(transcripts_dir)
        
        if not transcripts_path.exists():
            print(f"❌ Directory not found: {transcripts_dir}")
            return []
        
        transcript_files = list(transcripts_path.glob("*.txt"))
        
        if not transcript_files:
            print(f"❌ No transcript files found in {transcripts_dir}")
            return []
        
        print(f"📝 Analyzing {len(transcript_files)} transcript files...")
        
        all_analyses = []
        
        for transcript_file in transcript_files:
            try:
                with open(transcript_file, 'r', encoding='utf-8') as f:
                    text = f.read().strip()
                
                analysis = self.analyze_transcript(text, transcript_file.name)
                all_analyses.append(analysis)
                
                # Print summary for each file
                if analysis['quality_score'] < 80:
                    print(f"⚠️ {transcript_file.name}: Quality Score {analysis['quality_score']}/100")
                    for issue in analysis['issues']:
                        print(f"   - {issue['message']}")
                else:
                    print(f"✅ {transcript_file.name}: Quality Score {analysis['quality_score']}/100")
                    
            except Exception as e:
                print(f"❌ Error analyzing {transcript_file.name}: {e}")
        
        return all_analyses
    
    def generate_report(self, analyses: List[Dict], output_file: str = "quality_report.json"):
        """Generate a quality report."""
        import json
        
        # Summary statistics
        total_files = len(analyses)
        avg_quality = sum(a['quality_score'] for a in analyses) / total_files if total_files > 0 else 0
        
        low_quality_files = [a for a in analyses if a['quality_score'] < 70]
        medium_quality_files = [a for a in analyses if 70 <= a['quality_score'] < 90]
        high_quality_files = [a for a in analyses if a['quality_score'] >= 90]
        
        report = {
            'summary': {
                'total_files': total_files,
                'average_quality_score': round(avg_quality, 2),
                'high_quality_files': len(high_quality_files),
                'medium_quality_files': len(medium_quality_files),
                'low_quality_files': len(low_quality_files)
            },
            'detailed_analyses': analyses,
            'recommendations': {
                'immediate_action': [a['filename'] for a in low_quality_files],
                'review_needed': [a['filename'] for a in medium_quality_files],
                'good_quality': [a['filename'] for a in high_quality_files]
            }
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n📊 Quality Report Summary:")
        print(f"   Total files: {total_files}")
        print(f"   Average quality: {avg_quality:.1f}/100")
        print(f"   High quality (≥90): {len(high_quality_files)}")
        print(f"   Medium quality (70-89): {len(medium_quality_files)}")
        print(f"   Low quality (<70): {len(low_quality_files)}")
        print(f"   Report saved to: {output_file}")

def main():
    checker = TranscriptQualityChecker()
    analyses = checker.check_all_transcripts()
    
    if analyses:
        checker.generate_report(analyses)

if __name__ == "__main__":
    main()
