import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subAea: null,
  id: false,
};

const subAreaSlice = createSlice({
  name: "subArea",
  initialState,
  reducers: {
    setSubArea: (state,  action) => {
      const {key, value} = action.payload;
      state[key]= value
    },

    setId: (state, action) => {
      const {key, value} = action.payload;
      state[key]= value
    }
  },
});

export const { setSubArea, setId} = subAreaSlice.actions;
export default  subAreaSlice.reducer;
