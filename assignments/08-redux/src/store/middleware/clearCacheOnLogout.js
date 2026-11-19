import { logout } from '../authSlice';

export const createClearCacheOnLogout = (queryClient) => () => (next) => (action) => {
  const result = next(action);
  if (logout.match(action)) {
    queryClient.clear();
  }
  return result;
};
