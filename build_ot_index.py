import os
import re
import json


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
OT_DIR = os.path.join(APP_ROOT, 'ot_txt_copies')
OUT_FREQ = os.path.join(APP_ROOT, 'ot_word_frequency_list.json')
OUT_FORMS = os.path.join(APP_ROOT, 'ot_form_occurrence_index.json')


def normalize_pashto_char(text: str) -> str:
    replacements = {'ي': 'ی', 'ى': 'ی', 'ئ': 'ی'}
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def load_ot_bible(dir_path: str) -> dict:
    bible = {}
    punct = '.,:;!?؟،؛"\'()[]{}“”'

    def parse_int_mixed_digits(s: str):
        arabic_indic = {ord('٠') + i: str(i) for i in range(10)}  # ٠-٩
        eastern_arabic = {ord('۰') + i: str(i) for i in range(10)}  # ۰-۹
        normalized = s.translate({**arabic_indic, **eastern_arabic})
        if not normalized or not all('0' <= ch <= '9' for ch in normalized):
            return None
        try:
            return int(normalized)
        except Exception:
            return None

    # Minimal OT book map (capitalize fallback)
    book_map = {
        'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy',
        'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth', '1samuel': '1 Samuel', '2samuel': '2 Samuel', '1kings': '1 Kings',
        '2kings': '2 Kings', '1chronicles': '1 Chronicles', '2chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
        'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs', 'ecclesiastes': 'Ecclesiastes',
        'songofsongs': 'Song of Songs', 'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel',
        'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah',
        'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah', 'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi',
    }

    if not os.path.isdir(dir_path):
        return {}

    for filename in os.listdir(dir_path):
        if not filename.endswith('_pashto.txt'):
            continue
        base = filename.replace('_pashto.txt', '')
        match = re.match(r'([a-z]+)(\d+)', base)
        if not match:
            continue
        book_prefix, chapter_str = match.groups()
        chapter = int(chapter_str)
        book = book_map.get(book_prefix, book_prefix.capitalize())
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        current_verse = None
        verse_text_lines = []
        for line in lines:
            stripped = normalize_pashto_char(line.rstrip())
            m = re.match(r'^([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*(.*)$', stripped)
            verse_num = parse_int_mixed_digits(m.group(1)) if m else None
            if verse_num is not None:
                if current_verse is not None:
                    bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
                current_verse = verse_num
                verse_text_lines = []
                remainder = m.group(2).strip()
                if remainder:
                    verse_text_lines.append(remainder)
            elif current_verse is not None:
                verse_text_lines.append(stripped)
        if current_verse is not None:
            bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
    return bible


def tokenize_pashto(text: str) -> list:
    # Split on whitespace and punctuation; keep Pashto letters and digits
    parts = re.split(r"[^\w\u0600-\u06FF]+", text)
    return [p for p in (normalize_pashto_char(p.strip()) for p in parts) if p]


def build_indices():
    bible = load_ot_bible(OT_DIR)
    form_to_refs = {}
    freq = {}
    for ref, verse in bible.items():
        for tok in tokenize_pashto(verse):
            freq[tok] = freq.get(tok, 0) + 1
            ent = form_to_refs.get(tok)
            if not ent:
                ent = {'count': 0, 'verses': []}
                form_to_refs[tok] = ent
            ent['count'] += 1
            ent['verses'].append(ref)

    # Normalize verses lists (unique + sorted) to reduce size
    for ent in form_to_refs.values():
        ent['verses'] = sorted(set(ent['verses']))

    # Frequency list compatible with UI expectations
    freq_list = [
        {'pashto': form, 'frequency': count, 'romanization': '', 'pos': ''}
        for form, count in freq.items()
    ]
    freq_list.sort(key=lambda x: x['frequency'], reverse=True)

    with open(OUT_FREQ, 'w', encoding='utf-8') as f:
        json.dump(freq_list, f, ensure_ascii=False, indent=2)
    with open(OUT_FORMS, 'w', encoding='utf-8') as f:
        json.dump(form_to_refs, f, ensure_ascii=False)

    print('Wrote:', OUT_FREQ)
    print('Wrote:', OUT_FORMS)


if __name__ == '__main__':
    build_indices()


