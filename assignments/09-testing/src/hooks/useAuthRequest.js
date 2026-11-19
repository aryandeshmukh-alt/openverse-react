import { useAuth } from './useAuth';

export function useAuthRequest() {
  const { token, refreshAccessToken } = useAuth();

  return async (request) => {
    try {
      return await request(token);
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        throw err;
      }
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error('Session expired. Please login again.');
      }
      return request(newToken);
    }
  };
}
