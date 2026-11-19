import { useSelector, useDispatch } from 'react-redux';
import { login, logout, refreshAccessToken } from '../store/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (email, password) => dispatch(login(email, password)),
    logout: () => dispatch(logout()),
    refreshAccessToken: () => dispatch(refreshAccessToken()),
  };
}
