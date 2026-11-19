import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  sort: 'id',
  status: 'all',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setStatus(state, action) {
      state.status = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { setSearch, setSort, setStatus, setPage } = filtersSlice.actions;

export default filtersSlice.reducer;
