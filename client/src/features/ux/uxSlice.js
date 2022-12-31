import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scrollY: 0,
};

const uxSlice = createSlice({
  name: "ux",
  initialState,
  reducers: {
    saveScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
  },
});

export const { saveScrollY } = uxSlice.actions;

export default uxSlice.reducer;
