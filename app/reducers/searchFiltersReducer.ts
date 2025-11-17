/**
 * Search Filters Reducer
 * Centralized state management for all search filters including POS, verb, noun, and adjective filters
 */

import type {
  PartOfSpeech,
  NounFilterState,
  AdjectiveFilterState,
  MultiVerbFilterState,
} from '@/types';

// Complete filter state
export interface SearchFiltersState {
  pos: {
    selected: PartOfSpeech[];
    includeAll: boolean;
  };
  verb: MultiVerbFilterState;
  noun: NounFilterState;
  adjective: AdjectiveFilterState;
}

// Filter actions
export type SearchFiltersAction =
  | { type: 'SET_POS_FILTER'; pos: PartOfSpeech[] }
  | { type: 'TOGGLE_POS'; pos: PartOfSpeech }
  | { type: 'CLEAR_POS_FILTERS' }
  | { type: 'SET_VERB_FILTERS'; filters: MultiVerbFilterState }
  | { type: 'SET_NOUN_FILTERS'; filters: NounFilterState }
  | { type: 'SET_ADJECTIVE_FILTERS'; filters: AdjectiveFilterState }
  | { type: 'RESET_ALL_FILTERS' }
  | { type: 'RESET_POS_FILTERS' }
  | { type: 'RESET_VERB_FILTERS' }
  | { type: 'RESET_NOUN_FILTERS' }
  | { type: 'RESET_ADJECTIVE_FILTERS' };

// Default states
const DEFAULT_VERB_FILTER: MultiVerbFilterState = {
  person: ['all'],
  tense: ['all'],
  aspect: ['all'],
  mood: ['all'],
};

const DEFAULT_NOUN_FILTER: NounFilterState = {
  inflectionType: 'all',
  gender: 'all',
  inflectionReason: 'all',
  category: 'all',
  grammaticalCase: 'all',
  number: 'all',
  lexicalGender: 'all',
  pluralType: 'all',
};

const DEFAULT_ADJECTIVE_FILTER: AdjectiveFilterState = {
  inflectionType: 'all',
  gender: 'all',
  category: 'all',
  grammaticalCase: 'all',
  number: 'all',
};

export const INITIAL_FILTERS_STATE: SearchFiltersState = {
  pos: {
    selected: [],
    includeAll: true,
  },
  verb: { ...DEFAULT_VERB_FILTER },
  noun: { ...DEFAULT_NOUN_FILTER },
  adjective: { ...DEFAULT_ADJECTIVE_FILTER },
};

/**
 * Reducer for managing search filter state
 */
export function searchFiltersReducer(
  state: SearchFiltersState,
  action: SearchFiltersAction
): SearchFiltersState {
  switch (action.type) {
    case 'SET_POS_FILTER': {
      return {
        ...state,
        pos: {
          selected: action.pos,
          includeAll: action.pos.length === 0,
        },
      };
    }

    case 'TOGGLE_POS': {
      const currentPos = state.pos.selected;
      const isSelected = currentPos.includes(action.pos);
      const newPos = isSelected
        ? currentPos.filter(p => p !== action.pos)
        : [...currentPos, action.pos];
      
      return {
        ...state,
        pos: {
          selected: newPos,
          includeAll: newPos.length === 0,
        },
      };
    }

    case 'CLEAR_POS_FILTERS':
    case 'RESET_POS_FILTERS': {
      return {
        ...state,
        pos: {
          selected: [],
          includeAll: true,
        },
      };
    }

    case 'SET_VERB_FILTERS': {
      return {
        ...state,
        verb: action.filters,
      };
    }

    case 'RESET_VERB_FILTERS': {
      return {
        ...state,
        verb: { ...DEFAULT_VERB_FILTER },
      };
    }

    case 'SET_NOUN_FILTERS': {
      return {
        ...state,
        noun: action.filters,
      };
    }

    case 'RESET_NOUN_FILTERS': {
      return {
        ...state,
        noun: { ...DEFAULT_NOUN_FILTER },
      };
    }

    case 'SET_ADJECTIVE_FILTERS': {
      return {
        ...state,
        adjective: action.filters,
      };
    }

    case 'RESET_ADJECTIVE_FILTERS': {
      return {
        ...state,
        adjective: { ...DEFAULT_ADJECTIVE_FILTER },
      };
    }

    case 'RESET_ALL_FILTERS': {
      return { ...INITIAL_FILTERS_STATE };
    }

    default:
      return state;
  }
}

/**
 * Helper to check if verb filters are at default state
 */
export function isDefaultMultiVerbFilter(filters: MultiVerbFilterState): boolean {
  if (!filters.person || !filters.tense || !filters.aspect || !filters.mood) {
    return true;
  }
  return (
    filters.person.length === 1 && filters.person.includes('all') &&
    filters.tense.length === 1 && filters.tense.includes('all') &&
    filters.aspect.length === 1 && filters.aspect.includes('all') &&
    filters.mood.length === 1 && filters.mood.includes('all')
  );
}

/**
 * Helper to check if noun filters are at default state
 */
export function isDefaultNounFilter(filters: NounFilterState): boolean {
  return (
    filters.inflectionType === 'all' &&
    filters.gender === 'all' &&
    (filters.inflectionReason === 'all' || !filters.inflectionReason) &&
    (filters.category === 'all' || !filters.category) &&
    (filters.grammaticalCase === 'all' || !filters.grammaticalCase) &&
    (filters.number === 'all' || !filters.number) &&
    (filters.lexicalGender === 'all' || !filters.lexicalGender) &&
    (filters.pluralType === 'all' || !filters.pluralType)
  );
}

/**
 * Helper to check if adjective filters are at default state
 */
export function isDefaultAdjectiveFilter(filters: AdjectiveFilterState): boolean {
  return (
    filters.inflectionType === 'all' &&
    filters.gender === 'all' &&
    (filters.category === 'all' || !filters.category) &&
    (filters.grammaticalCase === 'all' || !filters.grammaticalCase) &&
    (filters.number === 'all' || !filters.number)
  );
}

/**
 * Convert filter state to API payload format
 */
export function filtersToAPIPayload(filters: SearchFiltersState): {
  posFilters?: { include?: PartOfSpeech[]; exclude?: PartOfSpeech[] };
} {
  if (filters.pos.selected.length === 0) {
    return {};
  }

  return {
    posFilters: {
      include: filters.pos.selected,
    },
  };
}

