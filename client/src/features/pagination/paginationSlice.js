import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  actualPage: 1,
  minPageNumber: 0,
  maxPageNumber: 4,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setActualPage: (state, action) => {
      state.actualPage = action.payload;
    },
    setMinPageNumber: (state, action) => {
      state.minPageNumber = action.payload;
    },
    setMaxPageNumber: (state, action) => {
      state.maxPageNumber = action.payload;
    },
  },
});

export const { setActualPage, setMinPageNumber, setMaxPageNumber } = paginationSlice.actions;

export default paginationSlice.reducer;
