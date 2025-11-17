# Verb linkage audit helper

Use `/api/verbs/audit` to cross-check how a verb lemma is represented across the
Cloudflare D1 tables:

* **verbs_lexicon** – canonical lemma, stems, helper, and metadata
* **word_frequencies** – frequency totals and romanization/English glosses
* **verb_forms** – conjugated forms already ingested from LingDocs
* **form_occurrences** – indexed verse references per form and translation
* **verses_afghan2023 / verses_yousafzai** – optional fallback scan for forms
  missing from `form_occurrences`

## Quick usage

```bash
# Basic audit for a lemma
curl -s "http://localhost:3000/api/verbs/audit?lemma=وهل" | jq

# Include a verse scan for any conjugations that are missing in form_occurrences
curl -s "http://localhost:3000/api/verbs/audit?lemma=وهل&scan=true&sample=5" | jq

# Limit the number of verb_forms/word_frequency rows inspected (default 120)
curl -s "http://localhost:3000/api/verbs/audit?lemma=وهل&cap=80" | jq
```

## Response shape

```json
{
  "lemma": "وهل",              // canonical lemma resolved from verbs_lexicon
  "input": "وهی",              // the form you passed in
  "lexicon": { ... },           // verbs_lexicon row (if found)
  "frequencies": [ ... ],       // word_frequencies rows ordered by frequency_total
  "verbForms": {                // conjugations from verb_forms
    "count": 142,
    "forms": [ { "form": "وهلم" , "tense": "present", ... } ]
  },
  "occurrences": {
    "indexed": 37,              // form_occurrences rows
    "byForm": [
      {
        "form": "وهلم",
        "entries": [
          { "translation": "afghan2023", "frequency": 12, "refs": ["John 3:16"] }
        ]
      }
    ],
    "missingForms": [ "..." ], // verb_forms without an occurrences row
    "scanned": [                // only when scan=true
      { "form": "...", "translation": "afghan2023", "count": 4, "sample": ["John 1:1"] }
    ]
  }
}
```

Use the **missingForms** plus the optional **scanned** block to spot conjugated
forms that exist in `verb_forms` but haven’t been indexed into
`form_occurrences` yet. The scan queries the `verses_afghan2023` and
`verses_yousafzai` tables directly to provide counts and sample references so
you can backfill form occurrences or update the verb indexing pipeline.

