import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  city: null,
  id: false,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCity: (state,  action) => {
      const {key, value} = action.payload;
      state[key]= value
    },

    setId: (state, action) => {
      const {key, value} = action.payload;
      state[key]= value
    }
  },
});

export const { setCity, setId} = citySlice.actions;
export default  citySlice.reducer;
