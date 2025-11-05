# Search Component Refactoring Plan

## Current Issues

1. **Duplicate Filter Systems**: Both `verbFilters` (single-select) and `multiVerbFilters` (multi-select) exist
2. **Filtering Not Working**: Filters don't trigger new searches properly
3. **Complex State Management**: Multiple useEffects watching different filter states
4. **Unclear Data Flow**: Filter changes → variant filtering → search execution chain is fragmented

## Proposed Solution

### 1. Unified Filter System
- Remove `verbFilters` entirely
- Use only `multiVerbFilters` for all verb filtering
- Single source of truth for filter state

### 2. Simplified Filter Application
- Single unified function: `applyFiltersAndSearch(filterType, filters)`
- Handles verbs, nouns, adjectives consistently
- Always triggers new search with filtered forms

### 3. Clear Data Flow
```
User clicks filter checkbox
  ↓
Update filter state
  ↓
Filter variants based on filter state
  ↓
Extract forms from filtered variants
  ↓
Trigger new search with those forms
  ↓
API searches using searchVersesByForms(forms)
  ↓
Results update
```

### 4. Remove Unused Code
- Remove `verbFilters` state
- Remove `debouncedVerbFilterSearch`
- Remove `applyVerbFiltersAndSearch` 
- Remove `filterVerbVariants` (single-select version)
- Remove `applyVerbFiltersWithFallback`
- Remove `relaxFilters`
- Remove `multiFilterToSingleFilter`
- Remove `sanitizeVerbFilter`

### 5. Single Filter Application Hook
```typescript
const applyFilters = useCallback((pos: 'verb' | 'noun' | 'adjective', filters: any) => {
  if (!includeRelated || !relatedForms) return;
  
  let filteredVariants: RelatedFormVariant[] = [];
  let forms: string[] = [];
  
  if (pos === 'verb' && relatedForms.verbs) {
    filteredVariants = filterVerbVariantsMulti(relatedForms.verbs, filters);
    forms = formsFromVariants(filteredVariants);
  } else if (pos === 'noun' && relatedForms.nouns) {
    filteredVariants = filterNounVariants(relatedForms.nouns, filters);
    forms = formsFromVariants(filteredVariants);
  } else if (pos === 'adjective' && relatedForms.other) {
    filteredVariants = filterAdjectiveVariants(relatedForms.other, filters);
    forms = formsFromVariants(filteredVariants);
  }
  
  if (forms.length === 0) {
    setResults([]);
    setCoverage([]);
    return;
  }
  
  // Always trigger new search
  setVariantsOverride(forms);
  setActiveVariantForms(forms);
  executeSearch({ overrideVariants: forms, preserveResults: false, reason: `${pos}-filter` });
}, [includeRelated, relatedForms, executeSearch]);
```

### 6. Clean Filter UI
- Single consistent checkbox pattern for all filters
- Clear visual feedback when filters are active
- Show count of filtered forms being searched

## Implementation Steps

1. Remove `verbFilters` state and all related code
2. Create unified `applyFilters` function
3. Update all filter UI to use `applyFilters`
4. Remove unused filter functions
5. Test filtering works correctly
6. Clean up unused imports and types
