import { createSlice } from '@reduxjs/toolkit';
import { refreshTokenRequest } from '../api/auth';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    tokenRefreshed(state, action) {
      state.token = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, tokenRefreshed, logout } =
  authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  if (email === 'test@test.com' && password === '123456') {
    dispatch(
      loginSuccess({
        user: { email },
        token: 'fake-token-123',
        refreshToken: 'fake-refresh-token',
      })
    );
    return true;
  }
  dispatch(loginFailure('Invalid credentials'));
  return false;
};

export const refreshAccessToken = () => async (dispatch, getState) => {
  const { refreshToken } = getState().auth;
  if (!refreshToken) {
    dispatch(logout());
    return null;
  }
  try {
    const data = await refreshTokenRequest(refreshToken);
    dispatch(tokenRefreshed(data.accessToken));
    return data.accessToken;
  } catch {
    dispatch(logout());
    return null;
  }
};

export default authSlice.reducer;
