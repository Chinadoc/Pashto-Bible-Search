# Stative Compound Split Heads

## Overview

Stative compounds ALSO have split heads in the **perfective aspect**! The complement splits off and acts like a perfective head, similar to how `و` splits off in regular perfective verbs.

Based on: https://grammar.lingdocs.com/compound-verbs/stative-compounds/

## Key Difference: Stative vs Dynamic Split Heads

### Dynamic Compounds (Perfective)
- Have **و - óo prefix** on helper verb
- Pattern: noun + **و** + helper verb
- Example: `کار وکړ` (perfective of `کار کول`)

### Stative Compounds (Perfective)
- **NO و prefix** on helper verb
- Complement splits off in perfective aspect
- Pattern: complement + perfective helper verb (without و)
- Examples:
  - `ستړی شول` (perfective of `ستړی کېدل` - intransitive)
  - `کرم کړل` (perfective of `کرم کول` - transitive)

## Examples from Grammar

### Intransitive Stative Compounds

**Base form:** `کرمېدل` (garmedúl - to get warm)
- Complement: `کرم` (garm - warm)
- Helper: `کېدل` (kedúl - to become)

**Perfective form:** `کرم شول` (garm shwul)
- Complement splits off: `کرم` (acts like perfective head)
- Perfective helper: `شول` (no و prefix!)

### Transitive Stative Compounds

**Base form:** `کرمول` (garmawúl - to make warm)
- Complement: `کرم` (garm - warm)
- Helper: `کول` (kawúl - to make)

**Perfective form:** `کرم کړل` (garm kRul)
- Complement splits off: `کرم` (acts like perfective head)
- Perfective helper: `کړل` (no و prefix!)

## Script Results

The updated `scripts/find-split-head-unmatched.py` now finds:

✅ **240 matched verbs** including:
- Stative compound perfective forms: `جوړ کړل` → `جوړ کول`
- Perfective verbs with minipronouns: `یې وویل` → `وویل`
- Both spaced and concatenated forms

### Sample Stative Compounds Found:
- `جوړ کړل` → `جوړ کول` (to make ready)
- `شان کړل` → `شان کول` (to make honorable)
- `مقرر کړل` → `مقرر کول` (to make appointed)
- `تباه کړل` → `تباه کول` (to make destroyed)
- `شروع کړل` → `شروع کول` (to make started)

## Welding vs Split Heads

### Imperfective Aspect (Welded)
- Complement and verb are **welded together** as one block
- Example: `ستړی کېږم` (I get tired)
- Complement loses accent

### Perfective Aspect (Split Head)
- Complement **splits off** and acts like perfective head
- Example: `ستړی شوم` (I got tired)
- Complement keeps its accent
- Minipronouns/particles can be inserted between complement and verb

## Updated Detection Logic

The script now detects:

1. **Perfective verbs (dynamic)**: `و` prefix + verb
   - With minipronouns: `یې وویل`, `نه وویل`
   - Concatenated: `ویېویل`, `ونهویل`

2. **Stative compound perfective forms**: Complement + perfective helper
   - Intransitive: `ستړی شول`, `کرم شو`
   - Transitive: `ستړی کړل`, `کرم کړل`

## SQL Output

Generated SQL marks entries as:
- `verb_perfective_split_head` - for perfective verbs with split heads
- `verb_stative_compound_split_head` - for stative compound perfective forms

## Next Steps

1. Review generated SQL: `cloudflare/link-split-head-verbs.sql`
2. Execute: `wrangler d1 execute pashto-bible-db --remote --file cloudflare/link-split-head-verbs.sql`
3. Verify stative compounds are properly linked to their base forms

