import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  area: null,
  id: false,
};

const areaSlice = createSlice({
  name: "area",
  initialState,
  reducers: {
    setArea: (state,  action) => {
      const {key, value} = action.payload;
      state[key]= value
    },

    setId: (state, action) => {
      const {key, value} = action.payload;
      state[key]= value
    }
  },
});

export const { setArea, setId} = areaSlice.actions;
export default  areaSlice.reducer;
