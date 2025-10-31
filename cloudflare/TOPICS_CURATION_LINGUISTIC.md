# Topics Curation with Pashto Linguistic Analysis

## Overview

This document describes the improved topics curation system that performs deep linguistic analysis to ensure >90% semantic fit between Pashto words and their assigned categories.

## Problem Identified

The original curation had issues with:
- **"ټول" (all/total)** incorrectly categorized under `activities_social` and `measurement`
- Common Pashto words (determiners, particles) appearing in inappropriate categories
- Lack of semantic validation based on actual Pashto word meanings

## Solution Implemented

### 1. Explicit Exclusion Rules

Words that should NEVER appear in certain categories:

```typescript
const KNOWN_MISMATCHES: Record<string, string[]> = {
  'activities_social': ['ټول', 'تول', 'د', 'په', 'او', 'چې', 'کې'], // "all" and particles don't belong
  'measurement': ['ټول', 'تول'], // "all" is not a measurement term
  'actions_communication': ['ټول', 'تول'], // "all" is not a communication verb
  // ... more exclusions
};
```

### 2. Context Verification Required

Certain words require verse context to verify semantic fit:

```typescript
const CONTEXT_REQUIRED_WORDS: string[] = ['ټول', 'تول'];
```

### 3. Enhanced Semantic Scoring

The `calculatePashtoSemanticRelevance` function:
- Checks explicit exclusions FIRST (immediate rejection)
- Requires context verification for common words
- Validates English translation matches category keywords
- Uses strict >90% threshold for acceptance

### 4. Optimization

- Skips excluded words entirely (no verse fetching)
- Only fetches verse text when context verification is needed
- Processes entries in batches for efficiency

## Usage

```bash
cd cloudflare
npx ts-node curate-topics-linguistic.ts
```

## Output

The script generates:
- `curated_topics_linguistic_YYYY-MM-DD.sql` - SQL file with curated entries
- Console output showing:
  - Categories processed
  - Entries retained/rejected
  - Average relevance scores
  - Unique word counts

## Key Improvements

1. **Pashto-aware**: Uses actual Pashto word meanings, not just English translations
2. **Strict filtering**: >90% semantic fit required
3. **Word diversity**: 1-2 verses max per word
4. **Biblical relevance**: Considers verse context when needed
5. **Performance**: Optimized to skip unnecessary verse fetching

## Example Results

Before: "ټول" (all) incorrectly appeared in `activities_social` (200+ entries)

After: "ټول" entries in `activities_social` are automatically excluded via explicit rules

## Next Steps

1. Review generated SQL file
2. Execute SQL to apply curated entries
3. Verify categories in database
4. Update exclusion rules as needed based on findings

## References

- [LingDocs Dictionary](https://dictionary.lingdocs.com/) - Pashto word definitions
- Cloudflare D1 Database Studio - Review curated entries
