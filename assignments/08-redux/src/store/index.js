import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import filtersReducer from './filtersSlice';
import { logger } from './middleware/logger';
import { createClearCacheOnLogout } from './middleware/clearCacheOnLogout';
import { queryClient } from '../queryClient';

export function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      filters: filtersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(logger, createClearCacheOnLogout(queryClient)),
  });
}

export const store = createStore();
