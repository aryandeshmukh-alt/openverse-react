import { createContext, useContext, useReducer } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refreshTokenRequest } from '../api/auth';
import { authReducer, initialAuthState } from '../reducers/authReducer';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const queryClient = useQueryClient();

  const refreshMutation = useMutation({
    mutationFn: refreshTokenRequest,
  });

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    if (email === 'test@test.com' && password === '123456') {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: { email },
          token: 'fake-token-123',
          refreshToken: 'fake-refresh-token',
        },
      });
      return true;
    }
    dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    queryClient.clear();
  };

  const refreshAccessToken = async () => {
    if (!state.refreshToken) {
      logout();
      return null;
    }
    try {
      const data = await refreshMutation.mutateAsync(state.refreshToken);
      dispatch({ type: 'TOKEN_REFRESHED', payload: data.accessToken });
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const value = {
    ...state,
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
