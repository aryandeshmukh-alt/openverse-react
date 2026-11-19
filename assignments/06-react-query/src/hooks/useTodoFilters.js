import { useState } from 'react';
import { useDebounce } from './useDebounce';

export function useTodoFilters() {
  const [search, setSearchValue] = useState('');
  const [sort, setSortValue] = useState('id');
  const [status, setStatusValue] = useState('all');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const setSearch = (value) => {
    setSearchValue(value);
    setPage(1);
  };

  const setSort = (value) => {
    setSortValue(value);
    setPage(1);
  };

  const setStatus = (value) => {
    setStatusValue(value);
    setPage(1);
  };

  return {
    search,
    setSearch,
    sort,
    setSort,
    status,
    setStatus,
    page,
    setPage,
    params: { page, search: debouncedSearch, sort, status },
  };
}
