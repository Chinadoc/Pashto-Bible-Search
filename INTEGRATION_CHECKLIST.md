# LingDocs Integration - Quick Start Checklist

Follow these steps to wire up the smart dictionary detection in your app.

## ✅ Step 1: Add Detection to Search Page

Edit `app/ClientHome.tsx` (or your main search component):

```tsx
// Add imports at top
import DictionaryTermDetection, { DictionaryTerm } from '@/components/DictionaryTermDetection';

// Add state (around line 400-500 where other state is)
const [detectedTerm, setDetectedTerm] = useState<DictionaryTerm | null>(null);

// Add detection effect (after other useEffect hooks)
useEffect(() => {
  // Don't detect for very short queries
  if (query.length < 2) {
    setDetectedTerm(null);
    return;
  }

  // Debounce detection to avoid too many API calls
  const timer = setTimeout(async () => {
    try {
      const response = await fetch(
        `/api/detect-term?term=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setDetectedTerm(data.term || null);
    } catch (error) {
      console.error('Dictionary detection failed:', error);
      setDetectedTerm(null);
    }
  }, 300); // Wait 300ms after user stops typing

  return () => clearTimeout(timer);
}, [query]);

// Add handler for form expansion (near other handlers)
const handleExpandForms = useCallback(() => {
  setIncludeRelated(true);
  // Trigger new search with expanded forms
  handleSearch();
}, [handleSearch]);

// Add the detection banner in JSX (after search input, before results)
// Find where you render the search input and add this below it:

{detectedTerm && (
  <DictionaryTermDetection
    term={detectedTerm}
    searchedTerm={query}
    onExpandForms={handleExpandForms}
    isExpanded={includeRelated}
    loading={loading}
  />
)}
```

**Location in file:** After `<SearchInterface />` component, before `<ResultsPane />`.

---

## ✅ Step 2: Test Detection API

Open browser console and test:

```javascript
// Test 1: Direct lemma (base form)
fetch('/api/detect-term?term=وهل')
  .then(r => r.json())
  .then(d => console.log('Direct lemma:', d));

// Test 2: Inflected form
fetch('/api/detect-term?term=وهي')
  .then(r => r.json())
  .then(d => console.log('Inflected form:', d));

// Test 3: Unknown word (should return null)
fetch('/api/detect-term?term=xyz')
  .then(r => r.json())
  .then(d => console.log('Unknown:', d));
```

**Expected results:**
- Test 1: Returns verb metadata with `lemma: "وهل"`, `totalForms: 47`
- Test 2: Returns same metadata with `matchedForm: {form: "وهي", tense: "present", ...}`
- Test 3: Returns `{term: null}`

---

## ✅ Step 3: Update Search API to Use D1 Forms

Edit `app/api/search/route.ts`:

Find the section where verb variants are generated (search for `generateVerbVariants`).

Add this function before the POST handler:

```typescript
/**
 * Get verb variants from D1 (pre-computed from LingDocs)
 * Falls back to runtime generation if not found
 */
async function getVerbVariantsFromD1(lemma: string): Promise<VariantWithPOS[]> {
  try {
    const db = (process.env as any).DB as D1Database;

    if (!db) {
      console.warn('D1 not available, using fallback generation');
      return generateVerbVariants(lemma);
    }

    const results = await db
      .prepare(
        `SELECT form, tense, person, voice, gender, helper
         FROM verb_forms
         WHERE lemma = ?
         ORDER BY tense, person`
      )
      .bind(lemma)
      .all();

    if (!results.results || results.results.length === 0) {
      console.warn(`No D1 forms for ${lemma}, using fallback`);
      return generateVerbVariants(lemma);
    }

    console.log(`✓ Found ${results.results.length} D1 forms for ${lemma}`);

    return results.results.map(row => ({
      form: row.form as string,
      label: `${row.tense} ${row.person}`,
      pos: 'verb' as const,
      tense: row.tense as string,
      person: row.person as string,
      voice: row.voice as string,
      gender: row.gender as string,
      helper: row.helper as string,
    }));
  } catch (error) {
    console.error('D1 query failed:', error);
    return generateVerbVariants(lemma);
  }
}
```

Then replace calls to `generateVerbVariants(...)` with `getVerbVariantsFromD1(...)`:

```typescript
// OLD:
const verbVariants = generateVerbVariants(lemma);

// NEW:
const verbVariants = await getVerbVariantsFromD1(lemma);
```

---

## ✅ Step 4: Populate D1 with Sample Verbs

Run these scripts to add verbs to D1:

```bash
# Test with one verb first (وهل - to hit)
npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527815399

# Add more common verbs
npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527812752  # کول - to do
npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527815348  # تلل - to go
npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527819674  # راتلل - to come

# Or batch import top 20 verbs
npx tsx scripts/batch-import-verbs.ts --count=20
```

**Check D1 in Cloudflare Dashboard:**
1. Go to Cloudflare Dashboard
2. Workers & Pages → D1
3. Select your database
4. Run query: `SELECT COUNT(*) FROM verb_forms;`
5. Should see 237,042+ rows (if all verbs imported)

---

## ✅ Step 5: Visual Test in Browser

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Type in search box: `وهي`
4. **Expected:** Blue banner appears:
   ```
   🔄 Found verb: وهل (wahul) - "to hit"
      Dynamic compound verb • Helper: کول • transitive
      [Search all 47 conjugations →]
   ```
5. Click "Search all 47 conjugations"
6. **Expected:** Button changes to "✓ Showing all 47 forms"
7. **Expected:** Results expand (23 → 487 verses)

---

## ✅ Step 6: Add Grammar Tooltips (Optional)

Edit `components/ResultsList.tsx`:

Add tooltip component:

```tsx
function GrammarTooltip({ form, metadata }: { form: string; metadata: any }) {
  if (!metadata) return null;

  return (
    <div className="absolute z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border text-sm">
      <div className="font-bold mb-1" dir="rtl">{form}</div>
      <div className="text-gray-600 dark:text-gray-400">
        Form of: <span dir="rtl">{metadata.lemma}</span>
      </div>
      {metadata.tense && <div>Tense: {metadata.tense}</div>}
      {metadata.person && <div>Person: {metadata.person}</div>}
      {metadata.voice && <div>Voice: {metadata.voice}</div>}
      {metadata.helper && (
        <div>Helper: <span dir="rtl">{metadata.helper}</span></div>
      )}
    </div>
  );
}
```

Wire it into highlighted words:

```tsx
<span
  className="highlighted-word relative group"
  onMouseEnter={() => fetchGrammarInfo(word)}
>
  {word}
  {grammarInfo && (
    <GrammarTooltip form={word} metadata={grammarInfo} />
  )}
</span>
```

---

## ✅ Step 7: Deploy to Production

```bash
# Commit all changes
git add .
git commit -m "Add LingDocs dictionary detection and D1 integration"
git push

# Vercel will auto-deploy
# Check build logs for errors

# Verify D1 is connected in Vercel:
# Project Settings → Environment Variables → DB (should be bound to D1)
```

---

## 🐛 Troubleshooting

### Issue: Detection banner doesn't appear

**Check:**
1. Open browser console, look for errors
2. Test API directly: `curl http://localhost:3000/api/detect-term?term=وهي`
3. Verify D1 has data: Check Cloudflare dashboard
4. Check if `process.env.DB` is available (log it in API)

**Fix:**
```typescript
// In detect-term/route.ts, add logging:
console.log('DB available:', !!db);
console.log('Query term:', term);
```

### Issue: "No D1 forms found" warning

**Check:**
1. Verify verb was imported: `SELECT COUNT(*) FROM verb_forms WHERE lemma = 'وهل';`
2. Check spelling: Pashto text is RTL, might have hidden characters
3. Run import script again: `npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527815399`

**Fix:**
```bash
# Re-import specific verb
npx tsx scripts/integrate-lingdocs-complete.ts --word-id=1527815399 --force
```

### Issue: Button clicks but doesn't expand

**Check:**
1. `includeRelated` state is updating: Add `console.log('includeRelated:', includeRelated)`
2. `handleSearch` is being called: Add log in handler
3. Search API is receiving `includeRelated: true`: Check network tab

**Fix:**
```typescript
// In handleExpandForms:
const handleExpandForms = useCallback(() => {
  console.log('Expanding forms...');
  setIncludeRelated(true);

  // Make sure search runs AFTER state update
  setTimeout(() => {
    console.log('Triggering search with includeRelated:', includeRelated);
    handleSearch();
  }, 100);
}, [handleSearch, includeRelated]);
```

### Issue: Slow detection (banner appears late)

**Check:**
1. Debounce timer might be too long (currently 300ms)
2. D1 query might be slow (check Cloudflare analytics)

**Fix:**
```typescript
// Reduce debounce:
const timer = setTimeout(async () => {
  // ...
}, 150); // Reduced from 300ms

// Or add loading indicator:
const [detectingTerm, setDetectingTerm] = useState(false);

// Show: {detectingTerm && <span>Detecting...</span>}
```

---

## 📊 Verification Checklist

Before deploying to production, verify:

- [ ] Detection API works for direct lemmas (`وهل`)
- [ ] Detection API works for inflected forms (`وهي`)
- [ ] Detection API returns `null` for unknown words
- [ ] Banner appears within 500ms of typing
- [ ] Banner shows correct metadata (POS, verb type, etc.)
- [ ] "Search all forms" button works
- [ ] Results expand when clicked
- [ ] Button changes to "✓ Showing all forms"
- [ ] LingDocs link opens correct page
- [ ] Grammar tooltips show (if implemented)
- [ ] Works on mobile (responsive design)
- [ ] Works in both light/dark themes
- [ ] No console errors
- [ ] No performance issues (< 200ms detection)

---

## 🎯 Success Criteria

You'll know it's working when:

1. **Type "وهي"** → Banner appears within 300ms
2. **Shows:** "Found verb: وهل (wahul) - 'to hit'"
3. **Click button** → Results expand from 23 → 487 verses
4. **Hover word** → Grammar tooltip shows tense, person, etc.
5. **Click LingDocs link** → Opens https://dictionary.lingdocs.com/word?id=1527815399

---

## 📞 Need Help?

Common resources:

- **D1 Docs:** https://developers.cloudflare.com/d1/
- **LingDocs:** https://github.com/lingdocs
- **Component code:** `components/DictionaryTermDetection.tsx`
- **API code:** `app/api/detect-term/route.ts`
- **Integration guide:** `LINGDOCS_INTEGRATION_DEMO.md`
- **Visual guide:** `HOW_IT_WORKS_VISUAL.md`

Questions? Check the detailed guides above or test each component individually.
