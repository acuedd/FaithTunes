import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;