# Inflection Reason Analysis - Data Storage Architecture

## Data Storage Location: Cloudflare D1 Database

All inflection reason analysis data is stored in **Cloudflare D1** in the following tables:

---

## 1. **`inflection_reasons` Table** (NEW - Primary Storage)

**Purpose**: Stores WHY each inflected word is inflected (the 3 reasons)

**Location**: `cloudflare/d1-comprehensive-schema.sql` (lines 103-123)

**Schema**:
```sql
CREATE TABLE IF NOT EXISTS inflection_reasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_form TEXT NOT NULL,              -- The inflected form (e.g., "مرستې")
  base_word TEXT NOT NULL,                -- Base word (e.g., "مرسته")
  verse_ref TEXT NOT NULL,                -- Verse reference (e.g., "John 3:16")
  inflection_type TEXT NOT NULL,          -- "1st" or "2nd"
  
  -- THE 3 REASONS:
  is_plural INTEGER DEFAULT 0,           -- Reason 1: Is it plural?
  is_in_sandwich INTEGER DEFAULT 0,      -- Reason 2: Is it in a sandwich?
  sandwich_type TEXT,                     -- Which sandwich? (e.g., "په ... کې")
  is_subject_transitive_past INTEGER DEFAULT 0, -- Reason 3: Subject of transitive past?
  
  -- Context for analysis:
  context_sentence TEXT,                  -- Full verse text
  word_position INTEGER,                  -- Position in sentence
  translation_key TEXT,                   -- 'afghan2023' or 'yousafzai2019'
  created_at INTEGER,
  updated_at INTEGER
);
```

**Example Row**:
```sql
INSERT INTO inflection_reasons VALUES (
  1,
  'مرستې',           -- pashto_form (inflected)
  'مرسته',           -- base_word
  'John 3:16',       -- verse_ref
  '1st',             -- inflection_type
  0,                 -- is_plural (NO)
  1,                 -- is_in_sandwich (YES)
  'په ... کې',       -- sandwich_type
  0,                 -- is_subject_transitive_past (NO)
  'خدا د نړۍ سره مینه درلوده', -- context_sentence
  2,                 -- word_position
  'afghan2023'       -- translation_key
);
```

---

## 2. **Related Tables** (Supporting Data)

### `inflections` Table
**Purpose**: Stores base_word → inflected_form mappings
**Fields**: `base_word`, `inflected_form`, `grammatical_info`, `frequency`
**Used by**: Analysis script to identify inflected forms

### `form_to_root` Table  
**Purpose**: Reverse lookup (inflected form → base word)
**Fields**: `word_form`, `root_word`, `frequency`
**Used by**: Analysis script to find base words for inflected forms

### `form_occurrences` Table
**Purpose**: Stores which verses contain each word form
**Fields**: `pashto_form`, `verse_refs` (JSON array), `frequency`
**Used by**: Finding all occurrences of a form

### `nouns_lexicon` Table
**Purpose**: Stores noun data including inflection pattern
**Fields**: `pashto_word`, `inflection_pattern` (1-6), `gender`, `plural_forms`
**Used by**: Determining which pattern a noun follows

---

## 3. **Data Flow**

```
Verse Text (D1: verses_afghan2023)
    ↓
Tokenize into words
    ↓
For each word:
    ↓
Check if inflected (via form_to_root)
    ↓
Determine inflection type (1st or 2nd)
    ↓
Analyze 3 reasons:
    ├─→ Is plural? (check plural markers)
    ├─→ In sandwich? (check adpositions)
    └─→ Subject of transitive past? (check verb markers)
    ↓
Store in inflection_reasons table
```

---

## 4. **Query Examples**

### Find all inflected words in a verse:
```sql
SELECT * FROM inflection_reasons 
WHERE verse_ref = 'John 3:16';
```

### Find all words inflected because they're plural:
```sql
SELECT pashto_form, base_word, verse_ref 
FROM inflection_reasons 
WHERE is_plural = 1;
```

### Find all words in sandwiches:
```sql
SELECT pashto_form, base_word, sandwich_type, verse_ref 
FROM inflection_reasons 
WHERE is_in_sandwich = 1;
```

### Find all subjects of transitive past verbs:
```sql
SELECT pashto_form, base_word, verse_ref, context_sentence 
FROM inflection_reasons 
WHERE is_subject_transitive_past = 1;
```

### Find words with multiple reasons (e.g., plural AND in sandwich):
```sql
SELECT pashto_form, base_word, verse_ref,
       (is_plural + is_in_sandwich + is_subject_transitive_past) as reason_count
FROM inflection_reasons 
WHERE reason_count > 1;
```

---

## 5. **Storage Summary**

| Data Type | Table | Purpose |
|-----------|-------|---------|
| **Inflection Reasons** | `inflection_reasons` | **PRIMARY** - Stores WHY words are inflected |
| Base → Form mappings | `inflections` | Support - Lists all inflected forms |
| Form → Base lookup | `form_to_root` | Support - Reverse lookup |
| Verse occurrences | `form_occurrences` | Support - Which verses contain forms |
| Noun patterns | `nouns_lexicon` | Support - Inflection pattern numbers |
| Verse text | `verses_afghan2023` | Source - Original verse text |

---

## 6. **Why This Architecture?**

1. **Separation of Concerns**: 
   - `inflections` = WHAT forms exist
   - `inflection_reasons` = WHY they're inflected

2. **Verse-Level Analysis**: 
   - Each row in `inflection_reasons` is tied to a specific verse
   - Allows context-aware analysis

3. **Multiple Reasons**: 
   - A word can be inflected for multiple reasons (e.g., plural AND in sandwich)
   - Each reason is stored as a boolean flag

4. **Translation-Aware**: 
   - `translation_key` allows separate analysis for Afghan 2023 vs Yousafzai 2019

---

## 7. **Indexes for Performance**

```sql
CREATE INDEX idx_inflection_reasons_form ON inflection_reasons (pashto_form);
CREATE INDEX idx_inflection_reasons_base ON inflection_reasons (base_word);
CREATE INDEX idx_inflection_reasons_verse ON inflection_reasons (verse_ref);
CREATE INDEX idx_inflection_reasons_translation ON inflection_reasons (translation_key);
```

These indexes allow fast queries like:
- "Show all inflected forms of 'مرسته'"
- "Show all inflected words in John 3:16"
- "Show all plural inflections"

---

## Summary

**Primary Storage**: `inflection_reasons` table in Cloudflare D1
- One row per inflected word occurrence in a verse
- Stores all 3 reasons (plural, sandwich, transitive past subject)
- Includes context (verse ref, sentence, position)

**Supporting Storage**: Related tables (`inflections`, `form_to_root`, `form_occurrences`, `nouns_lexicon`)
- Used during analysis to identify inflected forms and base words
- Provide grammatical context and patterns

This architecture allows comprehensive analysis of Pashto inflection patterns across the entire Bible corpus.

