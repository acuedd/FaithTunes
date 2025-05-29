import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '../store';
import { setTokens, logout } from '../store/slices/authSlice';
import type { User } from '../store/slices/authSlice';
import {
  loginUser,
  registerUser,
  refreshAccessToken,
} from '../services/auth.service';

export function useAuth() {
  const dispatch = useDispatch();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
  const user = useSelector((state: RootState) => state.auth.user);

  const setAuthTokens = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      dispatch(setTokens({ accessToken, refreshToken, user }));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setAuthTokens(data.access_token, data.refresh_token, data.user);
    return data;
  }, [setAuthTokens]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    setAuthTokens(data.access_token, data.refresh_token, data.user);
    return data;
  }, [setAuthTokens]);

  const refreshTokenFn = useCallback(async () => {
    if (!refreshToken) return null;
    const data = await refreshAccessToken(refreshToken);
    setAuthTokens(data.access_token, data.refresh_token, data.user);
    return data;
  }, [refreshToken, setAuthTokens]);

  return {
    accessToken,
    refreshToken,
    user,
    setAuthTokens,
    logoutUser,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === 'admin',
    login,
    register,
    refreshTokenFn,
  };
}