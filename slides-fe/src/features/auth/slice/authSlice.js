import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      console.log("set currentUser");
      state.currentUser= payload;
      state.loggedIn = true;
    },
    setLogin:(state,payload)=>{
      console.log("set login");
      state.loggedIn = payload;
    },
    logout: (state) => {
      console.log("set logout");
      state.currentUser = null;
      state.loggedIn = false;
    },
  },
});

export const { setCurrentUser, setLogin, logout } = authSlice.actions;
export default  authSlice.reducer;
