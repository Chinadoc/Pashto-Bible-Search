# Form to Root Table - Purpose and Usage

## Current State

The `form_to_root` table maps inflected word forms to their base/root words. It's used in:

1. **Backend search (`backend/services/search_grammar.py`)**: To find the root word for a given inflected form
2. **Grammar search**: Maps queries like "وهم" (wahum) back to root "وهل" (wahúl)

## Issues Identified

1. **No gender information**: The table doesn't distinguish between masculine and feminine forms
2. **Mixed content**: Contains nouns, adjectives, and verbs all in one table
3. **Unclear naming**: "form_to_root" doesn't indicate it's a bidirectional mapping

## Proposed Solutions

### Option 1: Keep as-is but document clearly
- **Purpose**: Quick lookup for inflected forms → root words
- **Limitation**: Doesn't preserve gender information
- **Usage**: Use for initial root finding, then query `nouns_lexicon` or `verbs_lexicon` for gender-specific inflections

### Option 2: Split into separate tables
- `form_to_root_nouns`: Maps noun forms to roots (with gender column)
- `form_to_root_verbs`: Maps verb forms to roots (with tense/aspect info)
- `form_to_root_adjectives`: Maps adjective forms to roots (with gender variants)

### Option 3: Add gender column
- Add `gender` column (m/f/null) to indicate if form is gendered
- Add `pos` column to distinguish part of speech
- This would allow filtering by gender when needed

## Recommendation

**Option 1** - Keep the table as-is but:
1. Rename to `word_form_to_root` for clarity
2. Document that it's a fast lookup table, not a complete morphological database
3. Always follow up with lexicon queries for gender-specific inflections

## Noun vs Adjective Inflection Rules

### Nouns (Fixed Gender)
- Nouns are inherently masculine OR feminine
- Example: "څوکۍ" (tsokúy) is always feminine → only feminine inflections
- Example: "آرشیف" (aarshéef) is always masculine → only masculine inflections
- Inflections don't change gender

### Adjectives (Variable Gender)
- Adjectives inflect based on what they modify
- Example: "پاک" (paak) has both:
  - Masculine: پاک (paak)
  - Feminine: پاکه (páaka)
- In compound verbs: "پاک کول" (paak kawul) → adjective must agree with subject/object

### Implementation Notes
- `nouns_lexicon` should have `gender` column (m/f)
- `inflect_noun()` should use gender from lexicon entry
- `inflect_adjective()` should generate both masculine and feminine forms
- Compound verbs need to check adjective gender agreement



