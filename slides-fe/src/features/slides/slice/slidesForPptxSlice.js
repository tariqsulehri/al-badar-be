import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slidesForPptx: [],
  selectedSlideIds: {}, // Object to track selected slides by ID
  currentPage: 0,
  rowsPerPage: 10,
};

const slidesForPptxSlice = createSlice({
  name: "slidesForPptx",
  initialState,
  reducers: {
    // Add slides to the selectedSlides array
    addSlide: (state, { payload }) => {
      // If payload is an array, it's a bulk selection
      if (Array.isArray(payload)) {
        const newSlides = payload.filter(slide => !state.selectedSlideIds[slide._id]);
        state.slidesForPptx = [...state.slidesForPptx, ...newSlides];
        newSlides.forEach(slide => {
          state.selectedSlideIds[slide._id] = true;
        });
      } else {
        // Single slide selection
        if (!state.selectedSlideIds[payload._id]) {
          state.slidesForPptx.push(payload);
          state.selectedSlideIds[payload._id] = true;
        }
      }
    },

    // Remove a specific slide from the array
    removeSlide: (state, { payload }) => {
      state.slidesForPptx = state.slidesForPptx.filter((slide) => slide._id !== payload._id);
      delete state.selectedSlideIds[payload._id];
    },

    // Clear all selected slides
    clearSlides: (state) => {
      state.slidesForPptx = [];
      state.selectedSlideIds = {};
    },

    // Update pagination state
    setPagination: (state, { payload }) => {
      state.currentPage = payload.page;
      state.rowsPerPage = payload.rowsPerPage;
    },

    // Check if slides are selected
    isSlideSelected: (state, { payload }) => {
      return state.selectedSlideIds[payload._id] || false;
    },
  },
});

// Export actions
export const { 
  addSlide, 
  removeSlide, 
  clearSlides, 
  setPagination,
  isSlideSelected 
} = slidesForPptxSlice.actions;

// Export reducer
export default slidesForPptxSlice.reducer;
