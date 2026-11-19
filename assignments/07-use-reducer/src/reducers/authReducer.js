export const initialAuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'TOKEN_REFRESHED':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return initialAuthState;
    default:
      return state;
  }
}
