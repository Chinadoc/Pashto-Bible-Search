# Duplicate Logic Analysis - Migrated Routes

After migrating all 17 API routes from Supabase to D1, here are the duplicate patterns identified:

## Common Patterns Found

### 1. **Verse Reference Parsing** (Duplicate in 5+ routes)
**Location**: `search-indexed`, `audio-batch`, `search_phrase`, etc.

**Pattern**:
```typescript
const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
if (!match) continue;
const [, book, chapterStr, verseStr] = match;
const chapter = parseInt(chapterStr, 10);
const verse = parseInt(verseStr, 10);
```

**Recommendation**: Create a shared utility function:
```typescript
// utils/verse-parser.ts
export function parseVerseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  const [, book, chapterStr, verseStr] = match;
  return {
    book,
    chapter: parseInt(chapterStr, 10),
    verse: parseInt(verseStr, 10)
  };
}
```

### 2. **JSON Field Parsing** (Duplicate in 4+ routes)
**Location**: `word-analysis`, `search-indexed`, `search_phrase`, etc.

**Pattern**:
```typescript
const parseJson = (str: string | null | undefined, fallback: any = {}) => {
  if (!str) return fallback;
  if (typeof str === 'string') {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }
  return str;
};
```

**Recommendation**: Create `utils/d1-helpers.ts`:
```typescript
export function parseD1Json<T = any>(value: string | T | null | undefined, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}
```

### 3. **Verse Fetching Logic** (Duplicate in 3+ routes)
**Location**: `search-indexed`, `audio-batch`, `search_phrase`

**Pattern**:
```typescript
const verseData = await db.queryFirst<VerseRow>(
  `SELECT book, chapter, verse, text, testament, ... FROM ${versesTable} WHERE book = ? AND chapter = ? AND verse = ?`,
  [book, chapter, verse]
);
```

**Recommendation**: Create `utils/d1-verses.ts`:
```typescript
export async function getVerseByRef(
  db: D1Client,
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<VerseRow | null> {
  const parsed = parseVerseRef(ref);
  if (!parsed) return null;
  
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';
  return await db.queryFirst<VerseRow>(
    `SELECT * FROM ${table} WHERE book = ? AND chapter = ? AND verse = ? LIMIT 1`,
    [parsed.book, parsed.chapter, parsed.verse]
  );
}
```

### 4. **D1 Database Initialization** (Duplicate in ALL routes)
**Pattern**:
```typescript
const d1Db = getD1Database();
if (!d1Db) {
  return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
}
const db = new D1Client(d1Db);
```

**Recommendation**: Create middleware or helper:
```typescript
// utils/d1-helpers.ts
export function getD1ClientOrError(): { db: D1Client } | { error: NextResponse } {
  const d1Db = getD1Database();
  if (!d1Db) {
    return { error: NextResponse.json({ error: 'Database not configured' }, { status: 500 }) };
  }
  return { db: new D1Client(d1Db) };
}
```

### 5. **Form Occurrence Queries** (Duplicate in 3+ routes)
**Location**: `search-indexed`, `search_phrase`, `test-search-debug`

**Pattern**:
```typescript
const occurrenceData = await db.query<{ pashto_form: string; verses: string; frequency: number }>(
  `SELECT pashto_form, verses, frequency FROM form_occurrences WHERE pashto_form = ? LIMIT 1`,
  [word]
);
const versesArray = typeof row.verses === 'string' 
  ? JSON.parse(row.verses) 
  : Array.isArray(row.verses) 
    ? row.verses 
    : [];
```

**Recommendation**: Create helper:
```typescript
export async function getFormOccurrences(
  db: D1Client,
  form: string
): Promise<{ form: string; verse_refs: string[]; frequency: number } | null> {
  const data = await db.queryFirst<{ pashto_form: string; verses: string; frequency: number }>(
    `SELECT pashto_form, verses, frequency FROM form_occurrences WHERE pashto_form = ? LIMIT 1`,
    [form]
  );
  
  if (!data) return null;
  
  const verseRefs = parseD1Json<string[]>(data.verses, []);
  return {
    form: data.pashto_form,
    verse_refs: Array.isArray(verseRefs) ? verseRefs : [],
    frequency: data.frequency || 0
  };
}
```

### 6. **Word Frequency Queries** (Duplicate in 3+ routes)
**Location**: `word-analysis`, `lexicon-search`, `word-translations`

**Pattern**:
```typescript
const freqData = await db.queryFirst<{ pashto_word: string; frequency_count: number }>(
  `SELECT pashto_word, frequency_count FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
  [word]
);
```

**Recommendation**: Create helper:
```typescript
export async function getWordFrequency(
  db: D1Client,
  word: string
): Promise<{ word: string; frequency: number; rank?: number } | null> {
  const data = await db.queryFirst<{ pashto_word: string; frequency_count: number; frequency_rank?: number }>(
    `SELECT pashto_word, frequency_count, frequency_rank FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
    [word]
  );
  
  return data ? {
    word: data.pashto_word,
    frequency: data.frequency_count || 0,
    rank: data.frequency_rank || undefined
  } : null;
}
```

### 7. **Translation Table Selection** (Duplicate in 5+ routes)
**Pattern**:
```typescript
const versesTable = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';
```

**Recommendation**: Create helper:
```typescript
export function getVersesTableName(translation: 'afghan2023' | 'yousafzai2019'): string {
  return translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';
}
```

## Summary of Duplicates

1. **Verse parsing**: 5+ routes
2. **JSON parsing**: 4+ routes  
3. **D1 initialization**: ALL 17 routes
4. **Verse fetching**: 3+ routes
5. **Form occurrences**: 3+ routes
6. **Word frequency**: 3+ routes
7. **Table name selection**: 5+ routes

## Recommended Refactoring

Create shared utility files:
- `utils/d1-helpers.ts` - Common D1 operations
- `utils/verse-parser.ts` - Verse reference parsing
- `utils/d1-queries.ts` - Common query patterns

This would reduce code duplication by ~30-40% and make maintenance easier.

