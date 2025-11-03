# Rebuilding Word Frequencies with Phrase Awareness

## Problem

The current `word_frequencies` table is built from `form_occurrences`, which:
1. **Still contains punctuation** (leading commas, periods, etc.)
2. **Loses phrase context** - when extracting individual forms, we can't identify adpositional phrases
3. **Can't detect circumpositions** - need full verse context to see "په ... کې" patterns

## Solution

We need to rebuild `word_frequencies` from verse text directly, preserving phrase context.

## Current Status

### Issues Identified

1. **form_occurrences has punctuation**: Entries like `, علوان` with leading commas
2. **No phrase context**: Can't tell if "ما ته" is a postposition phrase or just two words
3. **Circumpositions missed**: "په کور کې" gets split into "په", "کور", "کې" instead of kept as one entry

### Files Created

1. **`cloudflare/clean-form-occurrences-punctuation.sql`** - Cleans punctuation from form_occurrences
2. **`scripts/rebuild-word-frequencies-with-phrases.py`** - Rebuilds from verse text with phrase detection
3. **`scripts/generate-split-sql-per-phrase.py`** - Generates SQL to split phrases from existing data

## Next Steps

### Immediate Actions

1. **Clean form_occurrences punctuation**:
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/clean-form-occurrences-punctuation.sql
   ```

2. **Rebuild word_frequencies from verses** (with phrase awareness):
   - Process ALL verses (not just sample)
   - Detect circumpositions during parsing
   - Split postpositions/prepositions/particles
   - Preserve proper nouns from genealogies

3. **Generate splitting SQL**:
   - Query word_frequencies for phrases to split
   - Generate INSERT statements for each word
   - Update word_verse_mapping

### Long-term Solution

Rebuild the entire word frequency pipeline:
1. Parse verses → extract phrases → identify circumpositions
2. Build form_occurrences with phrase markers
3. Build word_frequencies preserving phrase structure
4. Update word_verse_mapping to reference both individual words AND phrases

## Current Data

- **6,457 phrases** marked for splitting (postpositions, prepositions, particles)
- **1,195 circumpositions** correctly marked as single entries
- Form_occurrences needs punctuation cleanup

## Example Splits Needed

| Phrase | Type | Split Into |
|--------|------|------------|
| `ما ته` | postposition | `ما` + `ته` |
| `د یوسف` | preposition | `د` + `یوسف` |
| `هغه به` | particle | `هغه` + `به` |
| `په کور کې` | circumposition | **KEEP AS ONE** |

## Files to Review

- `cloudflare/clean-form-occurrences-punctuation.sql` - Ready to run
- `scripts/rebuild-word-frequencies-with-phrases.py` - Needs to process ALL verses
- `scripts/generate-split-sql-per-phrase.py` - Query issue, needs fix

