# Database Tables: Search Usage Documentation

This document explains how each database table is used in the Pashto Bible Search application.

## Core Verse Tables

### `verses_afghan2023` / `verses_yousafzai`
**Purpose**: Primary verse storage for different translations

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 1949-1954)
- Searches verse text directly using `LIKE` queries: `SELECT book,chapter,verse,text,testament FROM verses WHERE text LIKE ?`
- Used as fallback when indexed search doesn't find matches
- Different tables queried based on translation parameter:
  - `verses_afghan2023` for Afghan 2023 translation
  - `verses_yousafzai` for Yousafzai 2019 translation
- Contains fields: `book`, `chapter`, `verse`, `text`, `testament`, `audio_storage_path`, `audio_public_url`

```1949:1954:app/api/search_phrase/route.ts
    // Search based on translation
    const tablesToSearch = translation === 'yousafzai2019'
      ? [
          { name: 'verses_yousafzai', translation: 'Yousafzai 2019' },
          { name: 'verses', translation: 'Standard' }
        ]
```

### `verses` (Generic)
**Purpose**: Alternative verse table (may be alias or legacy)

**Usage**: Similar to above, used as fallback table

---

## Indexed Search Tables

### `word_occurrence_index` ⚠️ **SUPABASE TABLE (NOT D1)**
**Purpose**: Pre-computed index mapping words to verse references

**Usage in Search**:
- **Location**: `app/api/search-indexed/route.ts` (lines 117-142)
- **Database**: **Supabase** (NOT Cloudflare D1) - accessed via `supabase.from('word_occurrence_index')`
- **Primary indexed search table** - fastest lookup method
- Stores: `word`, `frequency`, `translation_key`, `verse_refs` (array of verse references)
- First checked when searching for a word
- Returns verse references directly without scanning verse text
- Used after dictionary lookup to find actual verses
- **Note**: This table is NOT in your Cloudflare D1 database - it's in Supabase!

```117:142:app/api/search-indexed/route.ts
      } = await supabase
        .from('word_occurrence_index')
        .select('word, frequency, translation_key, verse_refs')
        .eq('word', pashtoWord)
        .eq('translation_key', translation)
        .single();

      const currentFrequencyData = (rawFrequencyData as WordFrequency | null);

      if (freqError && freqError.code !== 'PGRST116') {
        console.error(`Frequency lookup error for "${pashtoWord}" (translation: ${translation}):`, freqError);
      }

      if (currentFrequencyData) {
        // Keep the first match for metadata
        if (!frequencyData) {
          frequencyData = currentFrequencyData;
        }
        console.log(`✅ Found in word_occurrence_index for "${pashtoWord}" (${translation}): ${currentFrequencyData.frequency} occurrences`);
        if (currentFrequencyData.verse_refs) {
          verseRefs.push(...currentFrequencyData.verse_refs);
          console.log(`📍 Added ${currentFrequencyData.verse_refs.length} verse refs, total now: ${verseRefs.length}`);
        }
      } else {
        console.log(`❌ No match in word_occurrence_index for "${pashtoWord}" with translation "${translation}"`);
      }
```

### `word_verse_mapping`
**Purpose**: Alternative mapping of words to verses (may be legacy or alternative format)

**Usage**: Similar to `word_occurrence_index`, provides word-to-verse relationships

---

## Inflection and Morphology Tables

### `inflections`
**Purpose**: Stores all inflected forms of words with grammatical information

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 1825-1828, 2540-2608)
- Queried to find all inflected forms of a base word
- Used when `includeRelated=true` to expand search to related forms
- Stores: `base_word`, `inflected_form` (JSON), `grammatical_info` (JSON), `frequency`
- Critical for noun/adjective inflection search
- Also used for verb conjugations (especially compound verbs)

```1825:1828:app/api/search_phrase/route.ts
    const inflectionLimit = includeRelated ? 500 : baseLimit
    const data = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
        `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT ?`,
        [term, inflectionLimit]
      );
```

```2540:2543:app/api/search_phrase/route.ts
            // FIRST: Query inflections table (authoritative source for all inflected forms)
            const inflData = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
              `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 300`,
              [normalizedLookup]
            );
```

### `form_occurrences`
**Purpose**: Stores occurrences of specific word forms with verse references

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 2412-2416)
- Fallback search when other methods fail
- Stores: `pashto_form`, `verses` (array), `occurrence_count`
- Used as last resort when primary search finds no results

```2412:2416:app/api/search_phrase/route.ts
        // Query form_occurrences from D1
        const occurrenceData = await db.query<{ verses: string }>(
          `SELECT verses FROM form_occurrences WHERE pashto_form = ? LIMIT 1`,
          [primaryTerm]
        )
```

### `form_to_root`
**Purpose**: Maps inflected forms back to their root/base forms

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 1145-1150)
- Used to find the root word from an inflected form
- Enables reverse lookup: given "وویل" (past tense), find root "ویل"
- Critical for finding all forms of a word when searching by inflected form

```1145:1150:app/api/search_phrase/route.ts
async function getFormToRootMap(db: D1Client, term: string): Promise<string[]> {
  try {
    const data = await db.query<{ root_word: string }>(
      `SELECT root_word FROM form_roots WHERE word_form = ? ORDER BY frequency DESC LIMIT 10`,
      [term]
    );
```

### `inflection_reasons`
**Purpose**: Stores explanations/reasons for inflections (e.g., "plural", "sandwich", "transitive_past")

**Usage**: Used to categorize and explain why certain inflected forms exist

---

## Lexicon Tables

### `nouns_lexicon`
**Purpose**: Dictionary of nouns with inflection patterns

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 2592-2605)
- **Location**: `app/api/word-analysis/route.ts` (lines 56-60)
- Contains noun entries with: `lemma`, `inflection_pattern`, `gender`, `pos`
- Used to identify nouns and their inflection patterns
- Helps confirm inflection patterns when `inflections` table might be incomplete

```2592:2605:app/api/search_phrase/route.ts
            // ALSO: Query nouns_lexicon to get inflection pattern and ensure completeness
            // This helps especially when inflections table might be incomplete
            try {
              const nounLexiconData = await db.query<{ lemma: string; inflection_pattern: string; gender: string; pos: string }>(
                `SELECT lemma, inflection_pattern, gender, pos FROM nouns_lexicon WHERE lemma = ? LIMIT 1`,
                [normalizedLookup]
              );
              
              if (Array.isArray(nounLexiconData) && nounLexiconData.length > 0) {
                const nounEntry = nounLexiconData[0];
                console.log(`DEBUG: ${normalizedLookup} - Found in nouns_lexicon with pattern: ${nounEntry.inflection_pattern}`);
                // The inflection pattern info can be used for additional form generation if needed
                // The inflections table should already have all forms, but this confirms the pattern
              }
```

### `verbs_lexicon`
**Purpose**: Dictionary of verbs with conjugation patterns

**Usage in Search**:
- **Location**: `app/api/word-analysis/route.ts` (lines 48-53)
- **Location**: `app/api/related_forms/route.ts` (lines 136-150)
- Contains verb entries with: `verb_root`, `stem`, `transitivity`, conjugation patterns
- Used to identify verbs and generate conjugations
- Critical for verb search and related forms display

```48:53:app/api/word-analysis/route.ts
      // Check regular verbs (try full phrase first, then auxiliary verb)
      supabase
        .from('verbs_lexicon')
        .select('*')
        .eq('verb_root', auxiliaryVerb || normalizedWord)
        .limit(1),
```

### `verb_forms`
**Purpose**: Pre-computed verb conjugations

**Usage**: Stores all conjugated forms of verbs for fast lookup

---

## Dictionary and Frequency Tables

### `dictionary` (or `word_frequencies`)
**Purpose**: Main dictionary with Pashto words, romanizations, and translations

**Usage in Search**:
- **Location**: `app/api/search-indexed/route.ts` (lines 74-102)
- **Primary romanization lookup** - converts romanized input to Pashto
- First checked when search term looks like romanization
- Contains: `pashto`, `romanized`, `pos`, `english`
- Used to normalize romanized queries to Pashto before searching

```74:102:app/api/search-indexed/route.ts
    // Try exact romanization match first
    const { data: exactRomanMatch, error: romanError } = await supabase
      .from('dictionary')
      .select('pashto, romanized, pos, english')
      .ilike('romanized', searchTerm)
      .limit(20);
      
    if (exactRomanMatch && exactRomanMatch.length > 0) {
      dictionaryMatches = exactRomanMatch;
      pashtoWordsToLookup = exactRomanMatch.map((m: any) => m.pashto).filter(Boolean);
      console.log(`✅ Found ${exactRomanMatch.length} romanization matches in dictionary`);
      console.log(`📝 Pashto words to lookup: ${pashtoWordsToLookup.join(', ')}`);
    } else {
      // Try exact Pashto match
      const { data: pashtoMatch, error: pashtoError } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english')
        .eq('pashto', searchTerm)
        .limit(20);
        
      if (pashtoMatch && pashtoMatch.length > 0) {
        dictionaryMatches = pashtoMatch;
        pashtoWordsToLookup = pashtoMatch.map((m: any) => m.pashto).filter(Boolean);
        console.log(`✅ Found ${pashtoMatch.length} exact Pashto matches in dictionary`);
      } else {
        // Fallback: treat search term as-is (might be Pashto already)
        pashtoWordsToLookup = [searchTerm];
        console.log(`ℹ️  No dictionary matches, searching word_occurrence_index directly for: "${searchTerm}"`);
      }
    }
```

### `word_frequencies`
**Purpose**: Word frequency counts for ranking and prioritization

**Usage in Search**:
- **Location**: `app/api/search_phrase/route.ts` (lines 2213-2223)
- **Location**: `app/api/word-analysis/route.ts` (lines 76-81)
- Used to rank search results by frequency
- Helps prioritize common words over rare ones
- Contains: `pashto_word`, `frequency_count`

```2213:2223:app/api/search_phrase/route.ts
          `SELECT pashto_word, frequency_count FROM word_frequencies WHERE pashto_word IN (${pashtoFormsForFrequency.map(() => '?').join(',')})`,
          pashtoFormsForFrequency
        );
        if (Array.isArray(data)) {
          type WordFrequencyRow = {
            pashto_word: string | null
            frequency_count: number | null
          }
          const freqMap = new Map<string, number>()
          for (const row of data as WordFrequencyRow[]) {
            if (row?.pashto_word) {
```

### `word_frequency_update_log`
**Purpose**: Tracks updates to word frequency data

**Usage**: Metadata/audit table, not directly used in search

---

## Category and Topic Tables

### `word_categories`
**Purpose**: Categories/topics for organizing words thematically

**Usage**: Used for topic-based search and organization

### `word_category_mappings`
**Purpose**: Maps words to categories

**Usage**: Joins words to their categories for topic filtering

### `category_verse_mappings`
**Purpose**: Maps categories directly to verses

**Usage**: Allows searching verses by topic/category without word lookup

---

## Video Search Tables

### `video_transcripts`
**Purpose**: Stores YouTube video transcripts

**Usage in Search**:
- **Location**: `app/api/process-video-complete/route.ts` (lines 276-281)
- **Location**: `app/api/search-transcripts/route.ts` (likely)
- Stores: `video_id`, `video_title`, `video_url`, `transcript`, `segments`
- Used for searching video content, not Bible verses
- Enables searching within video transcripts

```276:281:app/api/process-video-complete/route.ts
      .from('video_transcripts')
      .insert([
        {
          video_id: videoId,
          video_title: `Video ${videoId}`,
          video_url: youtubeUrl,
```

### `video_word_mappings`
**Purpose**: Maps words to video segments/occurrences

**Usage**: Links words found in videos to specific video segments for targeted playback

---

## Metadata Tables

### `word_source_mapping`
**Purpose**: Tracks source of word data (which translation/book it came from)

**Usage**: Used for attribution and filtering by source

### `sqlite_sequence`
**Purpose**: SQLite internal table for auto-increment sequences

**Usage**: Database maintenance, not used in search

---

## Search Flow Summary

### Primary Search Flow (Indexed Search):
1. **Input**: User enters search term (Pashto or romanized)
2. **Dictionary Lookup** (`dictionary` table): Convert romanized → Pashto
3. **Word Occurrence Lookup** (`word_occurrence_index`): Get verse references
4. **Verse Fetch** (`verses_afghan2023` / `verses_yousafzai`): Get actual verse text
5. **Related Forms** (`inflections`, `nouns_lexicon`, `verbs_lexicon`): Expand search if requested

### Fallback Search Flow:
1. **Direct Verse Search** (`verses_afghan2023` / `verses_yousafzai`): `LIKE` queries on verse text
2. **Form Occurrences** (`form_occurrences`): Last resort form-based lookup

### Related Forms Flow:
1. **Base Word Lookup** (`form_to_root`): Find root from inflected form
2. **Inflection Generation** (`inflections`): Get all inflected forms
3. **Lexicon Lookup** (`nouns_lexicon` / `verbs_lexicon`): Get inflection patterns
4. **Frequency Ranking** (`word_frequencies`): Rank results by frequency

