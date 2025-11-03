# How LingDocs Achieves Fast Dictionary Loading

## Overview
LingDocs loads their dictionary quickly using a **local-first caching strategy** with IndexedDB and LokiJS.

## Key Mechanisms

### 1. Single JSON File Download
- **URL**: `https://storage.lingdocs.com/dictionary/dictionary.json`
- Downloads the **entire dictionary** as a single JSON file (~10-20MB)
- No separate "fast index" file - just one complete dictionary file

### 2. IndexedDB Caching (Client-Side)
- Uses **LokiJS** (JavaScript database) with IndexedDB adapter
- Stores the entire dictionary in the browser's IndexedDB
- **First load**: Downloads dictionary → saves to IndexedDB
- **Subsequent loads**: Loads from IndexedDB instantly (no network request)

### 3. Indexed Lookups
```typescript
// From dictionary-core.ts
this.collection = this.lokidb.addCollection(
  this.dictionaryCollectionName,
  {
    indices: ["i", "p"],  // Index on index number and Pashto word
    unique: ["ts"],        // Unique index on timestamp
  }
);
```

### 4. Background Updates
- Checks for dictionary updates in the background
- Downloads new version only if `release` number has changed
- Doesn't block the UI while checking

## Code Flow

```typescript
// 1. Initialize (dictionary-core.ts)
public async initialize() {
  // Load from IndexedDB first (fast path)
  this.lokidb.loadDatabase({}, async (err) => {
    this.collection = this.lokidb.getCollection(this.dictionaryCollectionName);
    
    // If exists in IndexedDB, use it immediately
    if (this.collection) {
      return { response: "loaded from saved", dictionaryInfo: ... };
    }
    
    // Otherwise download and cache
    const dictionary = await this.downloadDictionary();
    await this.addDictionaryToLoki(dictionary);
  });
}

// 2. Download single JSON file
private async downloadDictionary(): Promise<T.Dictionary> {
  const res = await fetch(this.dictionaryUrl + ".json");
  return await res.json();
}

// 3. Store in IndexedDB with indices
private async addDictionaryToLoki(dictionary: T.Dictionary) {
  this.collection = this.lokidb.addCollection(this.dictionaryCollectionName, {
    indices: ["i", "p"],  // Fast lookups
    unique: ["ts"],
  });
  this.collection.insert(dictionary.entries);
  this.lokidb.saveDatabase();
}
```

## Performance Characteristics

### Advantages
- ✅ **Instant loading** after first visit (loaded from IndexedDB)
- ✅ **Single network request** (one JSON file)
- ✅ **Full-text search** using LokiJS queries with indices
- ✅ **Offline support** (works without internet after first load)

### Limitations
- ❌ **Large initial download** (~10-20MB JSON file)
- ❌ **Browser storage limits** (IndexedDB ~50MB-1GB depending on browser)
- ❌ **Client-side only** (not suitable for server-side rendering)

## Comparison with D1 Approach

### LingDocs (Browser)
- **Storage**: IndexedDB (browser)
- **Database**: LokiJS (JavaScript)
- **Caching**: Client-side (in browser)
- **Update**: Download full JSON → replace IndexedDB

### Our D1 Approach (Cloudflare)
- **Storage**: Cloudflare D1 (SQLite at edge)
- **Database**: SQLite (SQL)
- **Caching**: Cloudflare edge caching
- **Update**: Incremental SQL updates

## Optimizations for D1

### 1. Pre-populate D1
- Load all dictionary entries into D1 tables
- Create proper SQL indices on frequently queried fields

### 2. Separate Verb Lexicon Table
- Create `verbs_lexicon` table (like we're doing)
- Store only essential verb data (stems/roots)
- Join with `word_frequencies` when needed

### 3. SQL Indices
```sql
CREATE INDEX idx_word_frequencies_pashto ON word_frequencies (pashto_word);
CREATE INDEX idx_word_frequencies_base_verb ON word_frequencies (base_verb);
CREATE INDEX idx_verbs_lexicon_pashto ON verbs_lexicon (pashto_word);
CREATE INDEX idx_verbs_lexicon_imperfective_stem ON verbs_lexicon (imperfective_stem);
```

### 4. Edge Caching
- Cloudflare automatically caches D1 queries at the edge
- Queries are cached per region for fast responses

## Recommendations

1. **✅ Keep the `verbs_lexicon` table approach** - Similar to LingDocs' fast lookup pattern
2. **✅ Pre-populate D1** - Load all dictionary data once, not on-demand
3. **✅ Create proper indices** - Fast SQL lookups (already done)
4. **✅ Use Cloudflare edge caching** - Automatic caching at edge locations
5. **✅ Consider a lightweight "fast index" JSON** - For client-side lookups if needed

## Next Steps

1. **Run the `verbs_lexicon` table creation**:
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/create-verbs-lexicon.sql
   ```

2. **Populate D1 with full dictionary** (if not already done):
   - Load all entries from `full_dictionary_enriched.json`
   - Insert into D1 tables with proper indices

3. **Compare performance**:
   - LingDocs: ~instant after first load (IndexedDB)
   - D1: ~fast with edge caching (Cloudflare edge)

## References

- **LingDocs Dictionary Code**: `lingdocs_dictionary/website/src/lib/dictionary-core.ts`
- **LokiJS Documentation**: https://github.com/techfort/LokiJS
- **Cloudflare D1**: https://developers.cloudflare.com/d1/

