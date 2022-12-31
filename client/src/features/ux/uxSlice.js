import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scrollY: 0,
  filterSelectValue: "DEFAULT",
  sortSelectValue: "DEFAULT",
};

const uxSlice = createSlice({
  name: "ux",
  initialState,
  reducers: {
    saveScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
    setFilterSelectValue: (state, action) => {
      state.filterSelectValue = action.payload;
    },
    setSortSelectValue: (state, action) => {
      state.sortSelectValue = action.payload;
    },
  },
});

export const { saveScrollY, setFilterSelectValue, setSortSelectValue } = uxSlice.actions;

export default uxSlice.reducer;
