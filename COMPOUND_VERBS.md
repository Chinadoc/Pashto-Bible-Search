# Compound/Dynamic Verb Handling in Pashto Bible Search

This document explains how the Pashto Bible Search handles **compound verbs** (also called **dynamic verbs**) in Pashto, which are critical for accurate search results.

## What are Compound Verbs in Pashto?

### Definition

Compound verbs (Pashto: **مرکب فعلونه**) are verbs formed by combining:
1. **A noun or adjective** (the semantic component)
2. **A helper verb** (کول for transitive, کېدل for intransitive)

The noun/adjective provides the meaning, while the helper verb carries the grammatical inflection.

### Examples

| Compound Verb | Components | English | Type |
|--------------|------------|---------|------|
| **قدم وهل** | قدم (step) + وهل (to hit) | to walk | Dynamic |
| **مونډه وهل** | مونډه (fist) + وهل (to hit) | to punch | Dynamic |
| **کار کول** | کار (work) + کول (to do) | to work | Dynamic |
| **مرسته کول** | مرسته (help) + کول (to do) | to help | Dynamic |
| **ډوډۍ خوړل** | ډوډۍ (bread) + خوړل (to eat) | to eat | Dynamic |

## The وهل (wahul) Example

### Dictionary Entry

**LingDocs**: https://dictionary.lingdocs.com/word?id=1527815399

**Base Verb**: وهل (wahul)
- **Meaning**: "to hit, to strike"
- **Type**: Dynamic compound verb
- **Helper**: کول (kawul)
- **Transitivity**: Transitive

### Compound Forms

When combined with nouns, وهل creates specific actions:

#### 1. **قدم وهل** (qadam wahul) - "to walk"
- Literally: "to hit/strike steps"
- **قدم** (qadam) = step, pace
- **وهل** (wahul) = to hit
- **Meaning**: to walk, to take steps

#### 2. **مونډه وهل** (munda wahul) - "to punch"
- Literally: "to hit with fist"
- **مونډه** (munda) = fist
- **وهل** (wahul) = to hit
- **Meaning**: to punch, to strike with fist

#### 3. **لاس وهل** (laas wahul) - "to hit with hand"
- **لاس** (laas) = hand
- **وهل** (wahul) = to hit
- **Meaning**: to slap, to strike with hand

#### 4. **ګوته وهل** (gota wahul) - "to point"
- **ګوته** (gota) = finger
- **وهل** (wahul) = to hit
- **Meaning**: to point (at), to indicate

## How Inflection Works

### Noun Component

The noun part can inflect for:
- **Case**: Direct (absolutive) vs Oblique
- **Number**: Singular vs Plural
- **Gender**: Masculine vs Feminine

Examples:
```
قدم (singular) → قدمونه (plural)
"qadam" → "qadamuna"

Direct case: قدم وهل
Oblique case: د قدم وهلو
```

### Verb Component

The verb part conjugates normally based on:
- **Tense**: Present, Past, Future, etc.
- **Person**: 1st, 2nd, 3rd
- **Number**: Singular, Plural
- **Gender**: Masculine, Feminine (in past tense)

Examples with **قدم وهل** (to walk):
```
Present:
- زه قدم وهم     (I walk - 1st singular)
- تاسې قدم وهئ   (You walk - 2nd plural)
- هغوی قدم وهي   (They walk - 3rd plural)

Past:
- زه قدم ووهلو   (I walked - 1st singular)
- هغې قدم ووهلو  (She walked - 3rd fem singular)
```

## Implementation in Pashto Bible Search

### 1. Database Structure

The D1 database stores compound verb metadata:

```sql
CREATE TABLE verbs_lexicon (
  lemma TEXT PRIMARY KEY,
  verb_type TEXT,              -- 'dynamic_compound', 'stative_compound', 'simple'
  helper TEXT,                  -- 'کول', 'کېدل', etc.
  transitivity TEXT,            -- 'transitive', 'intransitive'
  ...
);
```

Example row for وهل:
```json
{
  "lemma": "وهل",
  "verb_type": "dynamic_compound",
  "helper": "کول",
  "transitivity": "transitive",
  "lingdocs_id": 1527815399
}
```

### 2. Conjugation Storage

All conjugated forms are pre-computed and stored:

```sql
CREATE TABLE verb_forms (
  lemma TEXT,
  form TEXT,
  tense TEXT,
  person TEXT,
  ...
);
```

Example rows for وهل:
```json
{ "lemma": "وهل", "form": "وهم", "tense": "present", "person": "1st_singular" }
{ "lemma": "وهل", "form": "وهي", "tense": "present", "person": "3rd_singular" }
{ "lemma": "وهل", "form": "ووهلو", "tense": "simple_past", "person": "1st_singular" }
```

### 3. Compound Verb Handler

Location: `app/utils/compound_verb_handler.ts`

#### Main Functions:

##### `isDynamicCompoundVerb(db, lemma)`
Checks if a verb is a compound verb and returns metadata.

```typescript
const info = await isDynamicCompoundVerb(db, 'وهل');
// Returns:
// {
//   isCompound: true,
//   helper: 'کول',
//   verbType: 'dynamic_compound',
//   commonNouns: ['قدم', 'مونډه', 'لاس', ...]
// }
```

##### `generateCompoundVerbPatterns(verb, commonNouns, conjugatedForms)`
Generates search patterns for compound forms.

```typescript
const patterns = generateCompoundVerbPatterns(
  'وهل',
  ['قدم', 'مونډه'],
  ['وهم', 'وهي', 'ووهلو']
);
// Returns:
// [
//   'وهل',           // Base verb
//   'قدم وهل',       // qadam wahul
//   'قدم وهم',       // qadam waham (I walk)
//   'قدم وهي',       // qadam wahi (he/she walks)
//   'مونډه وهل',     // munda wahul
//   'مونډه وهم',     // munda waham (I punch)
//   ...
// ]
```

##### `searchCompoundVerbs(db, verb, translation, limit)`
Searches verses for all compound forms of a verb.

```typescript
const result = await searchCompoundVerbs(db, 'وهل', 'afghan2023', 100);
// Returns:
// {
//   verses: [...],      // Matching verses
//   patterns: [...],    // All search patterns used
//   isCompound: true
// }
```

##### `expandSearchForCompoundVerbs(db, searchTerm, translation)`
Determines if search should be expanded and returns patterns.

```typescript
const expansion = await expandSearchForCompoundVerbs(db, 'وهل', 'afghan2023');
// Returns:
// {
//   shouldExpand: true,
//   expandedPatterns: ['وهل', 'قدم وهل', 'مونډه وهل', ...],
//   compoundInfo: {
//     verbType: 'dynamic_compound',
//     helper: 'کول',
//     commonNouns: ['قدم', 'مونډه', ...]
//   }
// }
```

### 4. Common Noun Combinations

The handler includes a dictionary of common noun+verb combinations:

```typescript
const COMMON_COMPOUND_NOUNS = {
  'وهل': [
    'قدم',     // step → to walk
    'مونډه',   // fist → to punch
    'لاس',     // hand → to hit with hand
    'ګوته',    // finger → to point
    'سر',      // head → to headbutt
    'پښه',     // foot → to kick
  ],
  'کول': [
    'کار',     // work → to work
    'مرسته',   // help → to help
    'خدمت',    // service → to serve
    'عبادت',   // worship → to worship
    'دعا',     // prayer → to pray
    ...
  ],
  ...
};
```

## Usage in Search API

### Basic Integration

```typescript
import { expandSearchForCompoundVerbs } from '@/app/utils/compound_verb_handler';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const db = process.env.DB as D1Database;

  // Check if this is a compound verb
  const expansion = await expandSearchForCompoundVerbs(db, query, 'afghan2023');

  if (expansion.shouldExpand) {
    // User searched for a compound verb!
    console.log(`🔍 Compound verb detected: ${query}`);
    console.log(`📋 Searching for ${expansion.expandedPatterns.length} patterns`);
    console.log(`ℹ️  Common forms: ${expansion.compoundInfo?.commonNouns.join(', ')}`);

    // Perform expanded search
    const { verses } = await searchCompoundVerbs(db, query, 'afghan2023', 100);

    return Response.json({
      query,
      verses,
      compoundVerbInfo: expansion.compoundInfo,
      patterns: expansion.expandedPatterns.slice(0, 10), // Show first 10
    });
  }

  // Not a compound verb - regular search
  // ...
}
```

### UI Integration

Show users when compound verb expansion is happening:

```typescript
// In search results component
{compoundVerbInfo && (
  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
    <div className="font-semibold text-blue-900">
      🔍 Compound Verb Search Active
    </div>
    <div className="text-sm text-blue-700 mt-1">
      Searching for "{query}" and its compound forms:
      <span className="font-mono">
        {compoundVerbInfo.commonNouns.map(noun => `${noun} ${query}`).join(', ')}
      </span>
    </div>
    <div className="text-xs text-blue-600 mt-2">
      Type: {compoundVerbInfo.verbType} • Helper: {compoundVerbInfo.helper}
    </div>
  </div>
)}
```

## Performance Considerations

### Query Optimization

The compound verb search uses SQL OR conditions:

```sql
SELECT *
FROM verses_afghan2023
WHERE text LIKE '%وهل%'
   OR text LIKE '%قدم وهل%'
   OR text LIKE '%قدم وهم%'
   OR text LIKE '%قدم وهي%'
   ...
LIMIT 100
```

**Optimization strategies**:
1. **Limit patterns**: Only include top 20-30 most common patterns
2. **Index text column**: Full-text search index on `text` column
3. **Cache results**: Cache compound verb expansion for common queries
4. **Progressive enhancement**: Load simple results first, then expand

### Caching

```typescript
// Cache compound verb info to avoid DB lookups
const compoundVerbCache = new Map();

async function getCachedCompoundInfo(verb: string) {
  if (compoundVerbCache.has(verb)) {
    return compoundVerbCache.get(verb);
  }

  const info = await isDynamicCompoundVerb(db, verb);
  compoundVerbCache.set(verb, info);
  return info;
}
```

## Examples from Scripture

### Example 1: قدم وهل (to walk)

**Search**: وهل

**Expanded to include**:
- وهل (base form)
- قدم وهل (to walk)
- قدم وهي (walks)
- قدم ووهلو (walked)

**Potential matches**:
- "هغه په لار کې قدم وهل" (He walked on the road)
- "زه تاسې سره قدم وهم" (I walk with you)

### Example 2: کار کول (to work)

**Search**: کول

**Expanded to include**:
- کول (base form)
- کار کول (to work)
- مرسته کول (to help)
- خدمت کول (to serve)
- عبادت کول (to worship)

**Potential matches**:
- "زه د خدای کار کوم" (I do God's work)
- "هغوی مرسته کوي" (They help)

## Future Enhancements

### 1. Dynamic Noun Detection

Currently uses hardcoded noun list. Future: detect any noun + verb combination.

### 2. Pashto-Inflector Integration

Use the official LingDocs pashto-inflector library to:
- Generate compound forms dynamically
- Handle noun inflection (case/number/gender)
- Support rare/biblical compound verbs

### 3. Semantic Search

Group results by compound verb meaning:
- "Walking verbs": قدم وهل, ګرزیدل, ...
- "Speaking verbs": خبرې کول, ویل, ...

### 4. User Feedback

Allow users to suggest compound verb combinations not in the database.

## Related Documentation

- **LingDocs Dictionary**: https://dictionary.lingdocs.com
- **Pashto-Inflector**: https://github.com/lingdocs/pashto-inflector
- **Verb Forms Table**: See `D1_TABLE_USAGE_ANALYSIS.md`
- **Search API**: See `HOW_IT_WORKS.md`

## References

### Linguistic Resources

1. **LingDocs** - Official Pashto dictionary and grammar
2. **Pashto Grammar** by David Neil MacKenzie
3. **Compound Verbs in Pashto** (academic papers)

### Code Files

- `app/utils/compound_verb_handler.ts` - Main implementation
- `cloudflare/worker-api.ts` - D1 query integration
- `app/api/search/route.ts` - Search API (to be integrated)
- `scripts/integrate-lingdocs-complete.ts` - Data population script

---

**Last Updated**: 2025-11-17
**Maintained By**: Pashto Bible Search Development Team
