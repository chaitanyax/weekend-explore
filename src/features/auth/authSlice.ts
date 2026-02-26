import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';

export interface AuthState {
  user: (UserProfile & { token?: string }) | null;
}

const initialState: AuthState = {
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('me_jwt');
    },
  },
});

export const { setUser, logout } = slice.actions;
export default slice.reducer;
