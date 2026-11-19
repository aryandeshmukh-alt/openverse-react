import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from './useDebounce';
import { setSearch, setSort, setStatus, setPage } from '../store/filtersSlice';

export function useTodoFilters() {
  const dispatch = useDispatch();
  const { search, sort, status, page } = useSelector((state) => state.filters);
  const debouncedSearch = useDebounce(search, 400);

  return {
    search,
    setSearch: (value) => dispatch(setSearch(value)),
    sort,
    setSort: (value) => dispatch(setSort(value)),
    status,
    setStatus: (value) => dispatch(setStatus(value)),
    page,
    setPage: (value) => dispatch(setPage(value)),
    params: { page, search: debouncedSearch, sort, status },
  };
}
