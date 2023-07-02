import { createSlice } from "@reduxjs/toolkit";
import { getDietsAsync } from "./dietsActions";

const initialState = {
  diets: [],
};

const dietsSlice = createSlice({
  name: "diets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDietsAsync.fulfilled, (state, action) => {
      state.diets = action.payload;
    });
  },
});

export const { getDiets } = dietsSlice.actions;
export default dietsSlice.reducer;
