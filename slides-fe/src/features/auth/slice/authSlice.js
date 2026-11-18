import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  token: null,
  loggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.currentUser = payload.user;
      state.token = payload.token;
      state.loggedIn = true;
    },
    logout: () => initialState,
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsLoggedIn = (state) => Boolean(state.auth.loggedIn && state.auth.token);

export default authSlice.reducer;
