import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSlide: null,
  slideId: null,
};

const slideSlice = createSlice({
  name: "slide",
  initialState,
  reducers: {
    setCurrentSlide: (state, { payload }) => {
      console.log("set current Slide");
      state.currentUser = payload;
      state.loggedIn = true;
    },
    setSlideId: (state, payload) => {
      state.slideId = payload;
    },
  },
});

export const { setCurrentSlide, setSlideId } = slideSlice.actions;
export default slideSlice.reducer;
