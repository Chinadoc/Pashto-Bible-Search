# Pashto Bible Search — Monorepo Guide

This repository contains two user-facing apps and a set of data utilities:

- Streamlit app: full-featured “Smart Search” in `bible_search_ui.py`
- Static web app: ultra-fast verse text search in `web/` (fetches JSON)
- Scripts to build indices and caches under the project root

The goals: instant static search for quick lookups, and a powerful Python app for deep linguistic exploration.

### Quick links
- Streamlit (hosted): add your link if hosted
- Static site (GitHub Pages): https://chinadoc.github.io/Pashto-Bible-Search/

---

## 1) Streamlit app (Python, dynamic)

- Entry: `bible_search_ui.py`
  - Loads NT/OT verse text from `all_txt_copies/` and `ot_txt_copies/`
  - Uses precomputed indexes from `all_txt_copies/grammatical_index_v15.json`
  - Integrates dictionary data and verb/noun inflectors
  - Features: grammatical search, dictionary popups, audio links, frequency browser, fuzzy search

- Optional UI backend helpers: `ui_backend/ui_service.py`
  - Centralizes CSS and view helpers (book-coverage chips, sticky bar styles)

- Run locally
```bash
pip install -r requirements.txt
streamlit run bible_search_ui.py
```

## 2) Static web app (HTML/JS, async JSON)

- Location: `web/`
  - `index.html`: minimal UI (search box + results)
  - `script.js`: async loads `pashto_bible.json`, debounced substring search, highlights with <mark>
  - `pashto_bible.json`: generated verses array `[ { "ref": "Book C:V", "text": "…" }, ... ]`

- Build JSON (from chapter `.txt` sources)
```bash
python3 export_bible_json.py \
  --nt-dir ./all_txt_copies \
  --ot-dir ./ot_txt_copies \
  --out ./web/pashto_bible.json
```

- Serve locally
```bash
python3 -m http.server 8889 --directory ./web --bind 127.0.0.1
```

### Deployment (GitHub Pages)
- Workflow: `.github/workflows/deploy-pages.yml`
- On every push, CI regenerates `web/pashto_bible.json` and deploys `web/`
- URL: `https://chinadoc.github.io/Pashto-Bible-Search/`

### Vercel / Firebase Deployment

This describes how to deploy the `pashto-bible-react` frontend to Vercel and use a backend hosted on Google Cloud Functions with Firestore.

**1. Populate Firestore Database**

The cloud functions in `functions/main.py` rely on data being populated in a Firestore database. A script is provided to handle this data ingestion.

**Instructions to run the ingestion script:**

1.  **Install Dependencies:**
    ```bash
    pip install firebase-admin tqdm
    ```

2.  **Set Up Firebase Credentials:**
    *   Navigate to your Firebase project console.
    *   Go to **Project settings** > **Service accounts**.
    *   Click **"Generate new private key"** to download a JSON service account file.
    *   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the absolute path of the downloaded JSON file.

    *For macOS/Linux:*
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
    ```
    *For Windows:*
    ```powershell
    $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"
    ```

3.  **Run the Script:**
    Once the credentials are set up, run the ingestion script from the root of the repository:
    ```bash
    python ingest_firestore.py
    ```
    This will upload all the necessary Bible text, lexicon, and index data to your Firestore database.

**2. Deploy Backend to Google Cloud**

The backend logic is in `functions/main.py`. You can deploy this as a Google Cloud Function. Refer to the Google Cloud documentation for instructions on deploying Python functions.

**3. Deploy Frontend to Vercel**

The `pashto-bible-react` application can be deployed to Vercel. You will need to set the following environment variables in your Vercel project to point to your deployed cloud functions:

*   `NEXT_PUBLIC_PHRASE_SEARCH_URL`: The URL of your `/search_phrase` cloud function.
*   `NEXT_PUBLIC_GRAMMAR_SEARCH_URL`: The URL of your `/search_grammar` cloud function.


### Deployment (Cloudflare Pages — optional)
- Connect repo → Framework preset: None → Build command: empty → Output dir: `web`
- Pages will serve the committed files directly from the CDN

---

## 3) Data, indexes, and caches

- Verse sources
  - `all_txt_copies/`: New Testament chapter files (`bookN_pashto.txt`)
  - `ot_txt_copies/`: Old Testament chapter files (`bookN_pashto.txt`)

- Main grammatical index
  - `all_txt_copies/grammatical_index_v15.json`: structure consumed by `search_utils.py`
  - Built by the various `generate_grammar_index_v*.py` scripts (historical); current file is committed

- Prebuilt caches (optional, used by UI)
  - `form_occurrence_index.json`: global form → {count, verses}
  - `form_to_root_map.json`: form → root/lemma candidates
  - Build with: `python3 prebuild_caches.py`

- Dictionary data
  - `full_dictionary.json`, `full_dictionary_enriched.json`, `dictionary_fast_index.json`
  - Normalization utilities: `normalize_dictionary_data.py` and helpers in `noun_inflector.py` / `verb_inflector.py`

---

## 4) Searching and linguistics helpers

- `search_utils.py`: normalization, form occurrence queries, structured grammatical searches
- `pashto_fuzzy_search.py`: Pashto-aware fuzzy search engine and utilities
- `grammar_search.py`, `search_with_grammar.py`: example CLIs and adapters
- `verb_inflector.py`, `noun_inflector.py`, lexicon JSONs: generate and analyze forms

---

## 5) Development workflow

- Branches
  - Active branch: `main`
  - Feature branches generally merged back into `main`

- Testing locally
  - Streamlit: `streamlit run bible_search_ui.py`
  - Static site: `python3 -m http.server --directory ./web`

- Contributing
  - Prefer small PRs targeting `main`
  - Keep large JSON artifacts committed to avoid slow rebuilds where possible

---

## 6) FAQ

- Why both a static and a Streamlit app?
  - Static: instant loads, simple hosting, great for quick lookups and sharing
  - Streamlit: full Python power (inflection, dictionaries, complex search)

- Can I use a custom domain?
  - GitHub Pages: add a `web/CNAME` with your domain and set DNS CNAME to `chinadoc.github.io`
  - Cloudflare Pages: attach your domain via Pages settings

---

## 7) License and attribution

- Grammar heuristics inspired by [LingDocs Pashto Grammar](https://grammar.lingdocs.com)
- Bible text and dictionary data attribution per their respective sources

