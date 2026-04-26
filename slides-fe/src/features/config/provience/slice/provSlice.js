import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prov: null,
  id: null,
};

const provSlice = createSlice({
  name: "prov",
  initialState,
  reducers: {
    setProv: (state,  {payload}) => {
      state.prov= payload;
    },

    setId: (state, {payload}) => {
      state.id =  payload;
    }
  },
});

export const { setProv, setId} = provSlice.actions;
export default  provSlice.reducer;
