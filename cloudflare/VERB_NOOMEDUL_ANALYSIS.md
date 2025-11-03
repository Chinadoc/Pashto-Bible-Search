# Verb Analysis: نومېدل (noomedul) - "to be called (a name)"

## Base Form
- **Pashto**: نومېدل
- **Romanization**: noomedul
- **Type**: Intransitive verb (v. intrans.)
- **Frequency**: 21 occurrences

## Grammar Structure

According to LingDocs grammar (https://grammar.lingdocs.com/verbs/):

### Stems and Roots

**Imperfective:**
- **Stem**: نومېږ- (nooméG-)
- **Root**: نومېدل (noomedúl) - long form
- Used for: Present, Subjunctive, Future

**Perfective:**
- **Stem**: ونومېږ- (óonoomeG-) - with و prefix
- **Root**: ونومېدل (óonoomedul) - long form
- Used for: Past tense
- **Split head**: و can split out, so ونومېدل → نومېدل

**Past Participle:**
- **Form**: نومېدلی (noomedúlay) - masculine singular
- **Variants**: نومېدلې (feminine), نومېدلي (plural)
- Used for: Perfect forms, Ability forms

### Tense Categories

#### 1. Basic (Present/Subjunctive)
- Uses imperfective stem: نومېږ-
- Endings: م (1sg), ې (2sg), ي (3sg), و (1pl), ئ (2pl), ي (3pl)

#### 2. Perfect
- Uses past participle + auxiliary verb (یم/یې/دی/ده/یو/یئ/دي)
- Example: نومېدلی دی (he/it has been called)

#### 3. Past (Simple/Continuous)
- Uses perfective root: ونومېدل (or نومېدل with split head)
- Example: زه نومېدل (I was called)

#### 4. Ability
- Uses past participle + شو/شوې
- Example: نومېدلی شم (I can be called)

#### 5. Imperative
- Uses imperfective stem + imperative ending
- Example: نومېږه (be called!)

#### 6. Negative
- Uses نه before verb
- Example: نه نومېږم (I am not called)

## Forms Found in Bible Text

### Base Form
- نومېدل (21 occurrences)

### Perfect Forms (Past Participle + Auxiliary)
- نومېده (34 occurrences) - likely "he/it was called" (perfect)
- نومېدله (15 occurrences) - likely "she/it was called" (perfect, feminine)

### Other Forms
- نومېد (4 occurrences) - incomplete form

## Notes

1. **Split Heads**: In perfective aspect, the و prefix can split out, so ونومېدل becomes نومېدل.

2. **Long/Short Forms**: Verbs have long and short forms of roots/stems. The long form is typically used for citation.

3. **Word Separation**: Many forms found (like "نوم یې", "نوم دې") are actually the noun "نوم" (name) combined with enclitics, not verb conjugations.

4. **Punctuation**: Some forms include punctuation (نومېده، نومېده.) which should be cleaned.

## Next Steps

1. Mark base verb form with `word_type = 'verb'`
2. Mark perfect forms as `word_type = 'verb_conjugation'`
3. Link conjugations to base verb via a `base_verb` field
4. Add verb stems/roots to verb lexicon tables
5. Implement grammar-based verb form generation

## References

- https://grammar.lingdocs.com/verbs/verbs-intro/
- https://grammar.lingdocs.com/verbs/verb-aspect/
- https://grammar.lingdocs.com/verbs/roots-and-stems/
- https://grammar.lingdocs.com/verbs/present-verbs/
- https://grammar.lingdocs.com/verbs/subjunctive-verbs/
- https://grammar.lingdocs.com/verbs/master-chart/
- https://grammar.lingdocs.com/verbs/past-verbs/

