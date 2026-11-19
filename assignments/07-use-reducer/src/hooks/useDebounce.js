import { useReducer, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useReducer((_, next) => next, value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
