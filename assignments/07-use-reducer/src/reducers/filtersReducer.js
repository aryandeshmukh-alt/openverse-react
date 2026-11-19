export const initialFiltersState = {
  search: '',
  sort: 'id',
  status: 'all',
  page: 1,
};

export function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 };
    case 'SET_STATUS':
      return { ...state, status: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}
