# Comprehensive Word Frequency Builder

## Overview

This script creates a unified word frequency list from all verses in the database, handling:

1. **Compound Words**: Words with spaces like "مرسته کول" (to help)
2. **Future Tense Forms**: Words with "به" prefix like "به کوم" (I will do)
3. **Mini Pronouns**: Words separated or attached by mini pronouns like "ورته", "یې", "دې", "مې", "مو"

## Features

### 1. Advanced Tokenization

The tokenizer handles multiple patterns:

- **Compound Verbs**: Detects patterns like "noun + helper verb" (e.g., "مرسته کول")
  - Counts the compound as one unit
  - Also counts the noun/adjective part separately
  - Also counts the helper verb separately

- **Future Forms**: Detects "به + verb" patterns
  - Counts "به + verb" as one unit
  - Also counts the verb separately (without "به")

- **Mini Pronouns**: Handles both attached and separated forms
  - **Separated**: "کول یې" → counts both "کول" and "کول یې"
  - **Attached**: "کولې" → counts both base form and form with pronoun

### 2. Comprehensive Word Data

Each word entry includes:

- **Frequency counts**:
  - Total frequency
  - Afghan 2023 OT/NT breakdown
  - Yousafzai 2019 OT/NT breakdown
  - Frequency rank

- **Linguistic data**:
  - `base_form`: Base form of inflected words
  - `word_type`: Classification (noun, verb, adjective, compound_dynamic, compound_stative, etc.)
  - `pos`: Part of speech from dictionary
  - `inflection_type`: Type of inflection (if applicable)
  - `compound_type`: For compound verbs (dynamic/stative)

- **Dictionary linking**:
  - `dictionary_id`: Link to dictionary entry
  - `romanization`: Phonetic representation
  - `english_translation`: English meaning

- **Quality flags**:
  - `has_issues`: Whether word has problems
  - `issue_flags`: JSON array of issues (e.g., ["has_roman_chars", "no_dictionary_match", "no_pos"])

## Mini Pronouns Handled

Based on [LingDocs grammar](https://grammar.lingdocs.com/pronouns/pronouns-mini/):

- `مې` (me) - 1st person singular
- `دې` (de) - 2nd person singular
- `مو` (mU) - 1st/2nd person plural
- `یې` (ye) - 3rd person
- `به` (ba) - future particle
- `ورته` (wăr-ta) - to him/her/them
- `راته` (raa-ta) - to me/us
- `درته` (dăr-ta) - to you
- `په` (pa) - preposition
- `ته` (ta) - to
- `ور` (wăr) - to him/her
- `را` (raa) - to me
- `در` (dăr) - to you

## Compound Verb Helpers

- `کول` (kawul) - to do
- `کړل` (kRul) - to do (perfective)
- `وهل` (wahul) - to hit/strike
- `کېدل` (kedul) - to become
- `اخیستل` (akhistal) - to take
- `ساتل` (satal) - to keep

## Database Schema

```sql
CREATE TABLE word_frequencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL UNIQUE,
  frequency_total INTEGER NOT NULL DEFAULT 0,
  frequency_afghan2023_ot INTEGER DEFAULT 0,
  frequency_afghan2023_nt INTEGER DEFAULT 0,
  frequency_yousafzai2019_ot INTEGER DEFAULT 0,
  frequency_yousafzai2019_nt INTEGER DEFAULT 0,
  frequency_rank INTEGER NOT NULL DEFAULT 0,
  base_form TEXT,
  word_type TEXT,
  pos TEXT,
  inflection_type TEXT,
  compound_type TEXT,
  romanization TEXT,
  dictionary_id INTEGER,
  english_translation TEXT,
  has_issues INTEGER DEFAULT 0,
  issue_flags TEXT DEFAULT '[]',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

## Usage

```bash
npx tsx cloudflare/build-word-frequencies-comprehensive.ts
```

## Process

1. **Load Resources**:
   - Dictionary entries (17,635 entries)
   - Reverse inflection index (314,544 mappings from cache)

2. **Fetch Verses**:
   - All verses from `verses_afghan2023` table
   - All verses from `verses_yousafzai` table
   - Currently: ~51,773 verses total

3. **Tokenize & Count**:
   - Advanced tokenization handles all patterns
   - Builds frequency map with translation/testament breakdown

4. **Enrich**:
   - Finds base forms using reverse index
   - Classifies word types
   - Links to dictionary entries
   - Identifies issues

5. **Calculate Ranks**:
   - Sorts by frequency
   - Assigns rank numbers

6. **Update Database**:
   - Creates/updates schema
   - Inserts in batches of 100

## Expected Output

- **Total words**: ~15,000-20,000 unique words
- **Compound words**: ~500-1,000 compound verbs
- **Future forms**: ~1,000-2,000 future tense forms
- **Words with base_form**: ~60-70% of words
- **Words with dictionary match**: ~70-80% of words
- **Words with issues**: ~10-20% of words

## Notes

- The script uses the cached reverse inflection index for speed (314,544 mappings)
- It does NOT use LingDocs library generation for all words (too slow)
- Compound words are counted both as units and as separate parts
- Future forms are counted both with and without "به"
- Mini pronouns are handled both when attached and separated

