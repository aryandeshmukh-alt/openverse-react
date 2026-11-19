import { useReducer } from 'react';
import { useDebounce } from './useDebounce';
import { filtersReducer, initialFiltersState } from '../reducers/filtersReducer';

export function useTodoFilters() {
  const [state, dispatch] = useReducer(filtersReducer, initialFiltersState);
  const { search, sort, status, page } = state;
  const debouncedSearch = useDebounce(search, 400);

  return {
    search,
    setSearch: (value) => dispatch({ type: 'SET_SEARCH', payload: value }),
    sort,
    setSort: (value) => dispatch({ type: 'SET_SORT', payload: value }),
    status,
    setStatus: (value) => dispatch({ type: 'SET_STATUS', payload: value }),
    page,
    setPage: (value) => dispatch({ type: 'SET_PAGE', payload: value }),
    params: { page, search: debouncedSearch, sort, status },
  };
}
