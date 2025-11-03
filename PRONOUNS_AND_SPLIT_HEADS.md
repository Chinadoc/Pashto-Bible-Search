# Pronouns, Minipronouns, and Split-Head Verbs

## Overview

Updated the phrase splitting logic to correctly handle:
1. **Minipronouns** (مې, دې, مو, یې) in split-head verbs
2. **Directional pronouns** (را, در, ور)
3. **Split-head verb patterns** (perfective verbs with split heads)
4. **Regular pronouns** + directional pronouns/postpositions

Based on LingDocs grammar:
- https://grammar.lingdocs.com/pronouns/pronouns-mini/
- https://grammar.lingdocs.com/pronouns/pronouns-directional/
- https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads)

## Key Concepts

### Minipronouns
Mini-pronouns are shrunken forms that go in the "kids' section" and can be inserted into split heads:
- **مې** (me) - 1st pers sing
- **دې** (de) - 2nd pers sing
- **مو** (mU) - 1st/2nd pers plur
- **یې** (ye) - 3rd pers

### Directional Pronouns
Directional pronouns indicate direction and can attach to verbs:
- **را** (raa) - 1st person (to me/us)
- **در** (dăr) - 2nd person (to you)
- **ور** (wăr) - 3rd person (to him/her/it/them)

### Split-Head Verbs
**CRITICAL**: Split heads ONLY occur in the **perfective aspect**!

According to [LingDocs grammar](https://grammar.lingdocs.com/verbs/roots-and-stems/), the split head button appears only on the right (perfective) side of the verb tree, not on the imperfective side.

**Perfective forms** (have split heads):
- Start with **و** (or **وا** for verbs starting with ا)
- Examples: **ورکړ**, **وویل**, **وخوړ**
- Used in: simple past, subjunctive, future perfective, perfective imperative

**Imperfective forms** (NO split heads):
- Do NOT start with **و**
- Examples: **کول**, **ویل**, **خوړل**
- Used in: present, continuous past, future imperfective, imperfective imperative

Examples of split-head verbs:
- **مې ورکړ** = "مې" (minipronoun) + "ورکړ" (perfective verb "ورکول")
- **نه وویل** = "نه" (negative) + "وویل" (perfective verb "ویل")
- **یې وویل** = "یې" (minipronoun) + "وویل" (perfective verb "ویل")

## Updated Scripts

### 1. `scripts/process-split-pending.py`
Main script for processing phrases marked as `split_pending`. Now handles:
- **Keep together:**
  - Directional phrases (راته, ورته, etc.)
  - Split-head verbs (مې ورکړ, نه وویل, etc.)
  - Pronoun + directional pronoun (ما را, etc.)
  - Directional + postposition (را ته, etc.)

- **Split:**
  - Pronoun + postposition (ما ته → ما + ته)
  - Preposition + word (د دې → د + دې)
  - Pronoun + particle (هغه به → هغه + به)

### 2. `scripts/identify-directional-verbs.py`
New script to identify verbs with directional pronouns attached:
- Finds verbs starting with را, در, ور
- Extracts base verb (removing directional prefix)
- Marks them as directional verbs in database
- Links them to their base verb

### 3. `scripts/analyze-pronouns-and-split-heads.py`
Analysis script for testing phrase detection logic.

## Examples

| Phrase | Action | Reason |
|--------|--------|-------|
| ما ته | Split | Pronoun + postposition |
| ورته | Keep | Directional phrase (single word) |
| مې ورکړ | Keep | Split-head verb (minipronoun + perfective verb) |
| نه وویل | Keep | Split-head verb (negative + perfective verb) |
| د دې | Split | Preposition + pronoun |
| هغه به | Split | Pronoun + particle |
| راته | Keep | Directional phrase (single word) |
| یې وویل | Keep | Split-head verb (minipronoun + perfective verb) |

## Database Changes

When phrases are kept together, they are marked with appropriate POS:
- `directional_phrase` - for directional pronouns + postpositions
- `verb_phrase` - for split-head verbs
- `pronoun_phrase` - for pronoun + directional combinations

## Next Steps

1. Run `scripts/process-split-pending.py` to process existing `split_pending` entries
2. Run `scripts/identify-directional-verbs.py` to mark directional verbs
3. Review generated SQL files before executing
4. Execute SQL: `wrangler d1 execute pashto-bible-db --remote --file cloudflare/split-phrases-execute.sql`

