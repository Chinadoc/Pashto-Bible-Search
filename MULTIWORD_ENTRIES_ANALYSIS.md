# Multi-Word Entries Analysis & Handling

## Summary

We've implemented a system to handle multi-word entries in `word_frequencies` based on LingDocs' concept of "sandwiches" (adpositions): https://grammar.lingdocs.com/sandwiches/sandwiches/

## What We've Done

### 1. Identified Sandwiches (ONLY Circumpositions)

**Circumpositions** (word ... word) - KEEP AS SINGLE ENTRIES:
- `په ... کې` (in / at) - e.g., `په کور کې`
- `د ... دپاره` (for) - e.g., `د خدای دپاره`
- `پر ... باندې` (on) - e.g., `پر میز باندې`
- `د ... په اړه` (about)
- `د ... په بارې کې` (about)
- `پر ... سربېره` (in addition to)
- `له ... سره` (with) - e.g., `له احمد سره`

These are legitimate multi-word grammatical structures that need their own entry (similar to compound verbs).

### 2. Identified Entries to SPLIT

**Postpositions** (... word) - SPLIT:
- `... ته` (to / towards) - e.g., `ما ته` → `ما` + `ته`
- `... کې` (in / at) - SPLIT if not part of circumposition
- `... دپاره` (for) - SPLIT if not part of circumposition

**Standalone Prepositions** (word ...) - SPLIT:
- `د ...` (of / 's) - e.g., `د یوسف` → `د` + `یوسف`
- `په ...` (in / at) - SPLIT if not part of circumposition
- `پر ...` (on) - SPLIT if not part of circumposition
- `له ...` (from) - SPLIT if not part of circumposition

**Particle Phrases** - SPLIT:
- `... به` (future particle) - e.g., `هغه به` → `هغه` + `به`

### 2. Identified Phrases to Split

**Future particle phrases** (should be split):
- `هغه به` → `هغه` (pronoun) + `به` (future particle)
- `زۀ به` → `زۀ` (pronoun) + `به` (particle)
- `هغوی به` → `هغوی` (pronoun) + `به` (particle)

The `به` particle goes in the "kids' section" between words, so these should be split.

**Other phrases** (should be split if not in dictionary):
- `چې په` → `چې` (conjunction) + `په` (preposition)
- `او په` → `او` (conjunction) + `په` (preposition)
- `د دې` → `د` (preposition) + `دې` (pronoun)

### 3. Current Status

- ✅ Marked **1,195** entries as sandwiches (circumpositions/postpositions)
- ⚠️  **5,262** entries still marked as `phrase` that should be split
- 📋 Generated scripts to handle splitting

## Files Created

1. **`scripts/analyze-multiword-entries.py`** - Analyzes phrases and identifies sandwiches vs. splits
2. **`cloudflare/mark-sandwiches.sql`** - SQL to mark legitimate sandwiches
3. **`scripts/generate-split-sql.py`** - Generates SQL to split non-sandwich phrases
4. **`scripts/split-multiword-entries.py`** - Helper script to identify splits

## Next Steps

### Immediate Actions

1. **Run the split SQL generator** (needs query fix):
   ```bash
   python3 scripts/generate-split-sql.py
   ```

2. **Review and execute split SQL**:
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/split-multiword-entries.sql
   ```

3. **Update word_verse_mapping** to reference split words (future script needed)

### Future Enhancements

1. **Proper noun extraction** from genealogies/verse context
2. **Complete sandwich detection** - scan all phrases for sandwich patterns
3. **Verse mapping update** - when splitting, update `word_verse_mapping` to point to both words
4. **Frequency distribution** - when splitting "هغه به" (freq: 2424), distribute frequency to "هغه" and "به"

## Example Splits

| Original Phrase | Split Into | Reason |
|----------------|------------|--------|
| `هغه به` | `هغه` + `به` | Pronoun + future particle |
| `زۀ به` | `زۀ` + `به` | Pronoun + future particle |
| `چې په` | `چې` + `په` | Conjunction + preposition |
| `د دې` | `د` + `دې` | Preposition + pronoun |

## Example Sandwiches (Keep As-Is)

| Phrase | Type | Description |
|--------|------|-------------|
| `په کور کې` | Circumposition | `په ... کې` = "in / at" |
| `د خدای دپاره` | Circumposition | `د ... دپاره` = "for" |
| `هغوی ته` | Postposition | `... ته` = "to / towards" |

## Notes

- **Sandwiches** are grammatical structures and should remain as single entries
- **Particle phrases** (especially with `به`) should be split because the particle is independent
- **Proper nouns** in multi-word entries need special handling (extract from context)
- **Frequency counts** need to be distributed when splitting (each word gets the count)

