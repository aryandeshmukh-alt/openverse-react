import { useState, useMemo } from 'react';

export function useFilter(todos) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [status, setStatus] = useState('all');

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (search.trim()) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status === 'completed') {
      result = result.filter((todo) => todo.completed === true);
    } else if (status === 'pending') {
      result = result.filter((todo) => todo.completed === false);
    }

    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [todos, search, sort, status]);

  return { search, setSearch, sort, setSort, status, setStatus, filteredTodos };
}
