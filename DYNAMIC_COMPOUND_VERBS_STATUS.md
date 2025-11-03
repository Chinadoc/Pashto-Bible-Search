# Dynamic Compound Verbs Status

## Overview

Dynamic compound verbs are identified by having a **و - óo prefix** on the helper verb in perfective forms. They are made up of:
- **Action noun** + **Helper verb** (usually کول - kawúl "to do")

Based on: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/

## Key Characteristics

### Dynamic Compounds vs Stative Compounds

**Dynamic Compounds:**
- Talk about an action/activity being done
- Have **و - óo prefix** on کول in perfective forms
- Made up of: action noun + helper verb
- Examples: **کار کول** (to work), **پوښتنه کول** (to ask), **منډې وهل** (to run)

**Stative Compounds:**
- Talk about something changing state
- **NO و - óo prefix** on helper verb
- Made up of: complement + helper verb
- Examples: **ستړی کول** (to make tired), **بندول** (to close)

### Helper Verbs Used in Dynamic Compounds

1. **کول** (kawúl) - "to do" - most common
2. **کېدل** (kedúl) - "to happen" - intransitive version
3. **وهل** (wahúl) - "to hit"
4. **خوړل** (khoRúl) - "to eat"
5. **ساتل** (saatúl) - "to keep"

## Script Status

### `scripts/identify-dynamic-compound-verbs.py`

**Current Results:**
- ✅ Found **91 base dynamic compound verbs**
- ✅ Found **2 variants** (more variants may exist in different forms)
- ✅ Generated SQL to link compounds to their base forms

**Base Compounds Found:**
- کار کول (to work)
- عبادت کول (to worship)
- خبرې کول (to speak)
- پیروي کول (to follow)
- منډې وهل (to run)
- And 86 more...

**Process:**
1. Finds all base forms (noun + helper verb)
2. For each base, searches for variants (perfective, present, past forms)
3. Links variants to their base compound verb

## Next Steps

1. **Expand variant detection**: Currently only finding 2 variants. Need to check:
   - Concatenated forms (no spaces)
   - Forms with minipronouns inserted
   - Past participle forms
   - Perfect forms

2. **Review SQL**: Check generated SQL before executing:
   ```bash
   wrangler d1 execute pashto-bible-db --remote --file cloudflare/link-dynamic-compound-verbs.sql
   ```

3. **Process more compounds**: Currently processing first 50 to avoid timeout. May need to process in batches.

4. **Verify against dictionary**: Check that all dynamic compounds from dictionary are included.

## Examples from Grammar

From LingDocs grammar examples:

| Base Form | Perfective Form | Meaning |
|-----------|----------------|---------|
| کار کول | کار وکړ | to work |
| پوښتنه کول | پوښتنه وکړه | to ask |
| منډې وهل | منډې ووهل | to run |
| خدمت کول | خدمت وکړ | to serve |

**Key identifier**: Perfective forms have **و** prefix on helper verb!

