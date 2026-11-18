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
      state.currentUser = payload;
      state.loggedIn = true;
    },
    setPartyId: (state, payload) => {
      state.partyId = payload;
    },
  },
});

export const { setCurrentParty, setPartyId } = partySlice.actions;
export default partySlice.reducer;
