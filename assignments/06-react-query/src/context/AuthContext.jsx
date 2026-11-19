import { createContext, useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refreshTokenRequest } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const refreshMutation = useMutation({
    mutationFn: refreshTokenRequest,
  });

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (email === 'test@test.com' && password === '123456') {
        setIsLoggedIn(true);
        setUser({ email });
        setToken('fake-token-123');
        setRefreshToken('fake-refresh-token');
        return true;
      }
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setError(null);
    queryClient.clear();
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const data = await refreshMutation.mutateAsync(refreshToken);
      setToken(data.accessToken);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const value = {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    login,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
