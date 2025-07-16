import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  admin: {
    name: 'Admin User',
    email: 'admin@wingy.ma',
    avatar: '/src/assets/logo.png',
  },
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      if (email === 'admin@wingy.ma' && password === 'admin123') {
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = 'Invalid credentials';
        state.isAuthenticated = false;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
