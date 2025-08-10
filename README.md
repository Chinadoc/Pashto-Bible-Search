# Pashto-Bible-Search

Utilities for indexing and exploring Pashto Bible texts.

- `search_utils.py`: helpers for normalizing Pashto text, mapping forms to roots,
  and retrieving grammatical form details from the index.
- `grammar_search.py`: light-weight heuristics for characterizing a word
  (informed by LingDocs Pashto Grammar patterns). Useful for surfacing
  quick insights alongside search results.
- `search_with_grammar.py`: small CLI-style script demonstrating how to search
  the pre-generated word index and show a grammar characterization.

The grammar heuristics are adapted from patterns described at
[LingDocs Pashto Grammar](https://grammar.lingdocs.com).

## Data files

- `full_dictionary.json`: LingDocs Pashto dictionary (fetched automatically by the UI)
- `full_dictionary_enriched.json`: Enriched dictionary with normalized POS labels and helper fields
- `dictionary_fast_index.json`: Compact fast index for quick lookups by Pashto form (exact and normalized)
- `data_cleaning_report.json`: Report summarizing POS label normalization effects

## Scripts

- `build_full_dictionary.py`: Extract a JSON from LingDocs source when needed
- `normalize_dictionary_data.py`: Normalize and enrich dictionary data
  - Normalizes inconsistent POS labels (e.g., `adj,/adv.` → `adj. / adv.`)
  - Adds fields: `c_norm` (normalized POS), `pos_family`, `gender`, `f_primary`, `p_norm`
  - Produces fast index file consumed by the UI and inflector for faster lookup
  - Usage:

    ```bash
    python3 normalize_dictionary_data.py
    ```
