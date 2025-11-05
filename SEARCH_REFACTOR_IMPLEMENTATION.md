# Search Refactor Implementation Flowsheet
## Part-of-Speech Filter Integration with LingDocs & D1

This document provides a step-by-step guide to refactor the search system to use POS as a first-class filter, aligned with LingDocs' approach.

---

## Phase 1: Backend Foundation - POS Metadata Integration

### Step 1.1: Define POS Enum & Types
**File**: `types/search.ts` (create new or extend existing)

```typescript
export type PartOfSpeech = 
  | 'verb' 
  | 'noun' 
  | 'adjective' 
  | 'adverb' 
  | 'phrase' 
  | 'preposition'
  | 'pronoun'
  | 'other';

export interface POSMetadata {
  pos: PartOfSpeech;
  source: 'lingdocs' | 'd1' | 'merged';
  lingdocsId?: string;
  d1Lemma?: string;
  transitivity?: 'transitive' | 'intransitive' | 'both';
  verbType?: 'stative' | 'dynamic' | 'compound';
  gender?: 'masculine' | 'feminine' | 'both';
}

export interface VariantWithPOS extends Variant {
  pos: PartOfSpeech;
  posMetadata?: POSMetadata;
  sources: string[];
}
```

**Action**: Create the types file with these definitions.

---

### Step 1.2: Create LingDocs POS Map Cache
**File**: `scripts/refresh_lingdocs_pos.ts`

**Purpose**: Pre-compute POS metadata from LingDocs dictionary

**Steps**:
1. Clone/pull `lingdocs/pashto-dictionary` repository
2. Read `dictionary-info.json` from LingDocs
3. Extract POS mappings: `{ lemma: { pos: PartOfSpeech[], metadata: {...} } }`
4. Write to `app/data/lingdocs_pos_map.json`

**Command**:
```bash
npm run refresh-lingdocs-pos
```

**Output**: `app/data/lingdocs_pos_map.json`
```json
{
  "وهل": {
    "pos": ["verb"],
    "transitivity": "transitive",
    "verbType": "dynamic",
    "lingdocsId": "wahul"
  },
  "منډه": {
    "pos": ["noun", "verb"],
    "gender": "feminine",
    "nounInflectionType": "regular"
  }
}
```

---

### Step 1.3: Extend D1 Helpers with POS Lookup
**File**: `utils/d1-helpers.ts`

**Add function**:
```typescript
export async function getPOSMetadata(
  db: D1Client,
  lemma: string
): Promise<POSMetadata | null> {
  // 1. Check verbs_lexicon
  const verb = await db.query<{ infinitive: string; transitivity: string }>(
    'SELECT infinitive, transitivity FROM verbs_lexicon WHERE infinitive = ? LIMIT 1',
    [lemma]
  );
  if (verb.length > 0) {
    return {
      pos: 'verb',
      source: 'd1',
      d1Lemma: lemma,
      transitivity: verb[0].transitivity as any,
    };
  }

  // 2. Check nouns_lexicon
  const noun = await db.query<{ lemma: string; gender: string }>(
    'SELECT lemma, gender FROM nouns_lexicon WHERE lemma = ? LIMIT 1',
    [lemma]
  );
  if (noun.length > 0) {
    return {
      pos: 'noun',
      source: 'd1',
      d1Lemma: lemma,
      gender: noun[0].gender as any,
    };
  }

  // 3. Check word_categories (if exists)
  // 4. Fallback to LingDocs map
  // 5. Return null if not found
}
```

---

### Step 1.4: Update Related Forms API - Merge POS Tags
**File**: `app/api/related_forms/route.ts`

**Changes**:
1. Import POS types and helpers
2. Load LingDocs POS map: `import lingdocsPosMap from '@/app/data/lingdocs_pos_map.json'`
3. For each variant:
   - Get POS from LingDocs map
   - Get POS from D1 via `getPOSMetadata()`
   - Merge and tag with `sources: ['lingdocs', 'd1']`
   - Add `pos` and `posMetadata` to variant

**Code pattern**:
```typescript
const variants: VariantWithPOS[] = [];

for (const variant of lingdocsVariants) {
  const posMeta = lingdocsPosMap[variant.form] || getPOSMetadata(db, variant.form);
  variants.push({
    ...variant,
    pos: posMeta?.pos || 'other',
    posMetadata: posMeta,
    sources: ['lingdocs', posMeta?.source === 'd1' ? 'd1' : 'lingdocs'],
  });
}
```

**Response structure**:
```typescript
{
  forms: {
    verbs: VariantWithPOS[],
    nouns: VariantWithPOS[],
    adjectives: VariantWithPOS[],
    other: VariantWithPOS[],
  },
  posSummary: {
    verb: { count: number, sources: { lingdocs: number, d1: number } },
    noun: { count: number, sources: { lingdocs: number, d1: number } },
    // ...
  },
  posGuess: PartOfSpeech,
}
```

---

### Step 1.5: Add POS Filters to Search API
**File**: `app/api/search/route.ts`

**Request type update**:
```typescript
type SearchRequest = {
  query: string;
  scope?: Scope;
  includeRelated?: boolean;
  variants?: string[];
  posFilters?: {
    include?: PartOfSpeech[];  // Only search these POS
    exclude?: PartOfSpeech[];  // Exclude these POS
  };
  // ... existing fields
};
```

**Processing logic**:
```typescript
// When posFilters provided:
if (request.posFilters) {
  // Filter variants by POS before searching
  variants = variants.filter(v => {
    const variantPOS = getVariantPOS(v);
    if (request.posFilters.include) {
      return request.posFilters.include.includes(variantPOS);
    }
    if (request.posFilters.exclude) {
      return !request.posFilters.exclude.includes(variantPOS);
    }
    return true;
  });
  
  // Pass filtered variants to searchVersesByForms
  results = await searchVersesByForms(db, variants);
}
```

**Response addition**:
```typescript
{
  results: Verse[],
  processed: {
    posSummary: POSSummary,
    variantsSearched: VariantWithPOS[],
    // ... existing fields
  }
}
```

---

## Phase 2: Frontend State Management

### Step 2.1: Create Search Filters Reducer
**File**: `app/reducers/searchFiltersReducer.ts` (new)

```typescript
import { PartOfSpeech } from '@/types/search';

export interface SearchFiltersState {
  pos: {
    selected: PartOfSpeech[];  // Multi-select: ['verb', 'noun']
    includeAll: boolean;
  };
  verb: MultiVerbFilterState;  // Existing
  noun: NounFilterState;        // Existing
  adjective: AdjectiveFilterState; // Existing
}

export type SearchFiltersAction =
  | { type: 'SET_POS_FILTER'; pos: PartOfSpeech[] }
  | { type: 'TOGGLE_POS'; pos: PartOfSpeech }
  | { type: 'RESET_POS_FILTERS' }
  | { type: 'SET_VERB_FILTERS'; filters: MultiVerbFilterState }
  | { type: 'SET_NOUN_FILTERS'; filters: NounFilterState }
  | { type: 'SET_ADJECTIVE_FILTERS'; filters: AdjectiveFilterState }
  | { type: 'RESET_ALL_FILTERS' };

export function searchFiltersReducer(
  state: SearchFiltersState,
  action: SearchFiltersAction
): SearchFiltersState {
  switch (action.type) {
    case 'SET_POS_FILTER':
      return {
        ...state,
        pos: { selected: action.pos, includeAll: action.pos.length === 0 },
      };
    case 'TOGGLE_POS':
      const currentPos = state.pos.selected;
      const newPos = currentPos.includes(action.pos)
        ? currentPos.filter(p => p !== action.pos)
        : [...currentPos, action.pos];
      return {
        ...state,
        pos: { selected: newPos, includeAll: newPos.length === 0 },
      };
    case 'RESET_POS_FILTERS':
      return {
        ...state,
        pos: { selected: [], includeAll: true },
      };
    // ... handle verb/noun/adjective actions
    case 'RESET_ALL_FILTERS':
      return INITIAL_FILTERS_STATE;
    default:
      return state;
  }
}
```

---

### Step 2.2: Create Search Filters Context
**File**: `app/contexts/SearchFiltersContext.tsx` (new)

```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { searchFiltersReducer, SearchFiltersState, INITIAL_FILTERS_STATE } from '@/app/reducers/searchFiltersReducer';

const SearchFiltersContext = createContext<{
  filters: SearchFiltersState;
  dispatch: React.Dispatch<SearchFiltersAction>;
  toAPIPayload: () => { posFilters?: { include?: PartOfSpeech[] } };
} | null>(null);

export function SearchFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, dispatch] = useReducer(searchFiltersReducer, INITIAL_FILTERS_STATE);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('searchFilters', JSON.stringify(filters));
  }, [filters]);

  const toAPIPayload = () => {
    if (filters.pos.selected.length === 0) return {};
    return {
      posFilters: {
        include: filters.pos.selected,
      },
    };
  };

  return (
    <SearchFiltersContext.Provider value={{ filters, dispatch, toAPIPayload }}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

export function useSearchFilters() {
  const context = useContext(SearchFiltersContext);
  if (!context) throw new Error('useSearchFilters must be used within SearchFiltersProvider');
  return context;
}
```

---

### Step 2.3: Update ClientHome to Use Reducer
**File**: `app/ClientHome.tsx`

**Changes**:
1. Wrap component with `<SearchFiltersProvider>`
2. Replace `useState` for filters with `useSearchFilters()`
3. Update `executeSearch` to include `posFilters` from context
4. Remove inline filter state management

**Pattern**:
```typescript
export default function ClientHome({ initialQuery }: Props) {
  const { filters, dispatch, toAPIPayload } = useSearchFilters();

  const executeSearch = useCallback(async (opts = {}) => {
    const payload = {
      query: normalizedQuery,
      ...toAPIPayload(),  // Includes posFilters
      ...opts,
    };
    // ... rest of search logic
  }, [toAPIPayload, ...]);
}
```

---

## Phase 3: UI Component Refactoring

### Step 3.1: Extract SearchHeader Component
**File**: `components/SearchHeader.tsx` (new)

**Contains**:
- Search input field
- Search mode toggle (Standard/Related Forms)
- Language selector
- Scope selector

**Extract from**: `app/ClientHome.tsx` lines ~1900-2000

---

### Step 3.2: Create POSFilterBar Component
**File**: `components/POSFilterBar.tsx` (new)

```typescript
import { PartOfSpeech } from '@/types/search';
import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';

const POS_OPTIONS: PartOfSpeech[] = ['verb', 'noun', 'adjective', 'adverb', 'phrase', 'other'];

export function POSFilterBar({ posSummary }: { posSummary: POSSummary }) {
  const { filters, dispatch } = useSearchFilters();

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 border-b">
      <span className="text-sm font-semibold">Part of Speech:</span>
      <div className="flex flex-wrap gap-2">
        {POS_OPTIONS.map(pos => {
          const count = posSummary[pos]?.count || 0;
          const isSelected = filters.pos.selected.includes(pos);
          
          return (
            <button
              key={pos}
              onClick={() => dispatch({ type: 'TOGGLE_POS', pos })}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

### Step 3.3: Create POS-Specific Filter Drawers
**File**: `components/filters/VerbFilterDrawer.tsx` (new)
**File**: `components/filters/NounFilterDrawer.tsx` (new)
**File**: `components/filters/AdjectiveFilterDrawer.tsx` (new)

**Pattern** (VerbFilterDrawer):
```typescript
export function VerbFilterDrawer({ 
  isOpen, 
  onClose,
  filters,
  onFiltersChange 
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: MultiVerbFilterState;
  onFiltersChange: (filters: MultiVerbFilterState) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b">
      {/* Reuse existing verb filter UI */}
      {/* Person, Tense, Aspect, Mood checkboxes */}
    </div>
  );
}
```

---

### Step 3.4: Create FilterPanel Component
**File**: `components/FilterPanel.tsx` (new)

**Structure**:
```typescript
export function FilterPanel({ posSummary }: { posSummary: POSSummary }) {
  const { filters } = useSearchFilters();
  const [openDrawer, setOpenDrawer] = useState<PartOfSpeech | null>(null);

  return (
    <div className="space-y-2">
      <POSFilterBar posSummary={posSummary} />
      
      {filters.pos.selected.includes('verb') && (
        <VerbFilterDrawer
          isOpen={openDrawer === 'verb'}
          onClose={() => setOpenDrawer(null)}
          filters={filters.verb}
          onFiltersChange={(f) => dispatch({ type: 'SET_VERB_FILTERS', filters: f })}
        />
      )}
      
      {filters.pos.selected.includes('noun') && (
        <NounFilterDrawer ... />
      )}
      
      {/* Similar for adjective, etc. */}
    </div>
  );
}
```

---

### Step 3.5: Create ResultsPane Component
**File**: `components/ResultsPane.tsx` (new)

**Features**:
- Group results by POS (optional)
- Show POS badges on each result
- Indicate source (LingDocs vs D1)

**Extract from**: `app/ClientHome.tsx` results rendering section

---

### Step 3.6: Update ClientHome Structure
**File**: `app/ClientHome.tsx`

**New structure**:
```typescript
export default function ClientHome({ initialQuery }: Props) {
  const { filters, dispatch, toAPIPayload } = useSearchFilters();
  const [results, setResults] = useState<Verse[]>([]);
  const [relatedForms, setRelatedForms] = useState<RelatedFormsData | null>(null);
  const [posSummary, setPOSSummary] = useState<POSSummary>({});

  return (
    <div className="container mx-auto">
      <SearchHeader />
      <FilterPanel posSummary={posSummary} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ResultsPane results={results} posSummary={posSummary} />
        </div>
        <div className="lg:col-span-1">
          <CoverageSidebar coverage={coverage} />
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 4: API Integration Updates

### Step 4.1: Update Search API to Use POS Filters
**File**: `app/api/search/route.ts`

**Changes**:
1. Accept `posFilters` in request body
2. Filter variants by POS before searching
3. Return `posSummary` in response

**Implementation**:
```typescript
export async function POST(request: NextRequest) {
  const { query, posFilters, ...rest } = await request.json();
  
  // Get all variants
  let variants = await collectRelatedForms(query, { includeRelated: true });
  
  // Apply POS filters
  if (posFilters?.include?.length) {
    variants = variants.filter(v => {
      const vPOS = getVariantPOS(v);
      return posFilters.include.includes(vPOS);
    });
  }
  
  // Search with filtered variants
  const results = await searchVersesByForms(db, variants.map(v => v.form));
  
  // Calculate POS summary
  const posSummary = calculatePOSSummary(variants);
  
  return NextResponse.json({
    results,
    processed: {
      posSummary,
      variantsSearched: variants,
    },
  });
}
```

---

### Step 4.2: Update Related Forms API Response
**File**: `app/api/related_forms/route.ts`

**Ensure response includes**:
- `posSummary` object
- POS tags on all variants
- Source badges (`['lingdocs', 'd1']`)

---

## Phase 5: Testing & Validation

### Step 5.1: Test POS Filter API
**Test Cases**:
1. Search "وهل" without POS filter → should return all forms
2. Search "وهل" with `posFilters: { include: ['verb'] }` → should return only verb forms
3. Search "منډه" with `posFilters: { include: ['noun'] }` → should return only noun forms
4. Verify `posSummary` counts match filtered results

**Command**:
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "وهل",
    "posFilters": { "include": ["verb"] }
  }'
```

---

### Step 5.2: Test Frontend Filter State
**Test Cases**:
1. Click POS chip → filter state updates
2. Apply verb filters → both POS and verb filters active
3. Reset filters → all filters clear
4. Persist filters → localStorage saves/loads correctly

---

### Step 5.3: Integration Test
**Test Flow**:
1. Search "وهل"
2. See POS summary with counts
3. Click "Verb" POS filter
4. See verb filter drawer open
5. Select "1st person" + "Present"
6. Results update to show only matching verses
7. Verify results are tagged with POS badges

---

## Phase 6: Data Migration & Syncing

### Step 6.1: Create POS Metadata Cache Table
**File**: `scripts/create_pos_metadata_table.sql`

```sql
CREATE TABLE IF NOT EXISTS pos_metadata (
  lemma TEXT PRIMARY KEY,
  pos TEXT,  -- JSON array: ["verb", "noun"]
  lingdocs_id TEXT,
  d1_lemma TEXT,
  transitivity TEXT,
  verb_type TEXT,
  gender TEXT,
  metadata JSON,  -- Additional flexible metadata
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_pos_metadata_pos ON pos_metadata(pos);
```

**Run**:
```bash
wrangler d1 execute pashto-bible-db --file=scripts/create_pos_metadata_table.sql
```

---

### Step 6.2: Populate POS Metadata Table
**File**: `scripts/populate_pos_metadata.ts`

**Steps**:
1. Read LingDocs POS map
2. Query D1 for each lemma
3. Merge data
4. Insert/update `pos_metadata` table

**Command**:
```bash
npm run populate-pos-metadata
```

---

## Implementation Checklist

### Backend
- [ ] Create POS types (`types/search.ts`)
- [ ] Create `refresh_lingdocs_pos.ts` script
- [ ] Run script to generate `lingdocs_pos_map.json`
- [ ] Extend `d1-helpers.ts` with `getPOSMetadata()`
- [ ] Update `/api/related_forms` to merge POS tags
- [ ] Update `/api/search` to accept `posFilters`
- [ ] Create `pos_metadata` D1 table
- [ ] Populate `pos_metadata` table

### Frontend State
- [ ] Create `searchFiltersReducer.ts`
- [ ] Create `SearchFiltersContext.tsx`
- [ ] Update `ClientHome.tsx` to use context
- [ ] Test reducer actions
- [ ] Test localStorage persistence

### UI Components
- [ ] Extract `SearchHeader.tsx`
- [ ] Create `POSFilterBar.tsx`
- [ ] Create `VerbFilterDrawer.tsx`
- [ ] Create `NounFilterDrawer.tsx`
- [ ] Create `AdjectiveFilterDrawer.tsx`
- [ ] Create `FilterPanel.tsx`
- [ ] Create `ResultsPane.tsx`
- [ ] Update `ClientHome.tsx` structure

### Integration
- [ ] Wire POS filters to API calls
- [ ] Display POS summary in UI
- [ ] Show POS badges on results
- [ ] Test filter combinations
- [ ] Test performance with large result sets

### Testing
- [ ] Unit tests for reducer
- [ ] API integration tests
- [ ] E2E test for filter flow
- [ ] Performance benchmarks

---

## Next Steps (Immediate)

1. **Start with Step 1.1**: Create POS types
2. **Step 1.2**: Run LingDocs POS map script (proof of concept)
3. **Step 1.4**: Update `/api/related_forms` to return POS tags
4. **Verify**: Check API response includes POS data
5. **Step 2.1**: Create reducer for filter state
6. **Step 3.2**: Build POS filter bar UI

---

## Notes

- **Performance**: Cache `lingdocs_pos_map.json` in memory after first load
- **Migration**: Keep old filter system working during transition
- **Backwards compatibility**: API should work without `posFilters` (defaults to all POS)
- **Accessibility**: Ensure POS chips are keyboard navigable
- **Styling**: Match existing design system (dark mode support)

