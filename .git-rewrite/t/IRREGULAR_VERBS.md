# Pashto Irregular Verbs – Reference

This document lists core irregular (or highly non‑regular) Pashto verbs used by the app. These entries are synchronized with `irregular_verbs.json` and auto‑loaded by the verb inflector.

Categories and sources (truth set):
- General verb overview: [LingDocs Verbs Intro](https://grammar.lingdocs.com/verbs/verbs-intro/)
- Compound verbs overview: [LingDocs Compound Verbs](https://grammar.lingdocs.com/compound-verbs/intro/)
- Example lemma pages (dictionary charts provide authoritative stems/roots), e.g. `لیدل`, `کول`, etc. Sample: [dictionary.lingdocs.com/word?id=1527816201](https://dictionary.lingdocs.com/word?id=1527816201)

Conventions
- stems.imperfective = present stem used for present/indicative (e.g., وین-, کو-, ځ-)
- stems.perfective   = perfective (subjunctive) stem used with present endings (e.g., ووین-, وکړ-, لاړ ش-)
- roots.imperfective = infinitive for continuous past
- roots.perfective   = perfective infinitive for simple past
- past_participle    = past participle form

Irregular core set (initial)

1) Auxiliary verbs (suppletive / irregular)
- کول — do/make
  - stems: کو- / وکړ-
  - roots: کول / وکړ
  - PP: کړی
- کېدل — become
  - stems: کېږ- / وش-
  - roots: کېدل / وشو
  - PP: شوی

2) Motion (suppletive perfective)
- تلل — go
  - stems: ځ- / لاړ ش-
  - roots: تلل / لاړل
  - PP: تللی
- (Prefix compounds like را-تلل are derived and follow the same suppletion on the perfective side.)

3) Perception (root/stem alternations)
- لیدل — see
  - stems: وین- / ووین-
  - roots: لیدل / ولیدل
  - PP: لیدلی

4) Transport / carry/bring (stem alternations)
- وړل — carry, take
  - stems: وړ- / ووړ-
  - roots: وړل / ووړل
  - PP: وړلی
- راوړل — bring
  - stems: راوړ- / راووړ-
  - roots: راوړل / راووړل
  - PP: راوړلی

5) Speech
- ویل — say
  - stems: وای- / ووای-
  - roots: ویل / وویل
  - PP: ویلی

6) Eating/consuming
- خوړل — eat
  - stems: خور- / وخور-
  - roots: خوړل / وخوړل
  - PP: خوړلی

7) Capture/hold (common alternation)
- نیول — take, catch
  - stems: نیس- / ونی-
  - roots: نیول / ونیول
  - PP: نیولی

8) Other noted irregulars
- بوتلل — remove, pull out (multiple stems)
  - stems: بیای- / بوځ-
  - roots: بوتلل / بوتلل (specialized)
  - PP: بوتللی

Notes
- This list is a living document. For completeness, audit irregulars against LingDocs charts and add/update `irregular_verbs.json`. The app merges `irregular_verbs.json` into `verbs_lexicon.json` automatically (irregulars take precedence).
- For compound verbs (e.g., stative/dynamic), keep the base auxiliary (`کول`/`کېدل`) in the irregular list; specific compounds generally derive forms compositionally.

Synchronization
- Local JSON: `irregular_verbs.json`
- Optional remote: set `IRREGULAR_VERBS_URL` to a hosted JSON (e.g., GitHub raw) with the same schema to refresh irregulars on startup.
