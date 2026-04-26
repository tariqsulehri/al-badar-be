import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSlide: null,
  slideId: null,
};

const partySlice = createSlice({
  name: "slide",
  initialState,
  reducers: {
    setCurrentSlide: (state, { payload }) => {
      console.log("set current Slide");
      state.currentUser = payload;
      state.loggedIn = true;
    },
    setPartyId: (state, payload) => {
      console.log("set Slide Id");
      state.partyId = payload;
    },
  },
});

export const { setCurrentParty, setPartyId } = partySlice.actions;
export default partySlice.reducer;
