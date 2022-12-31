import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

const initialState = {
  diets: [],
};

const dietsSlice = createSlice({
  name: "diets",
  initialState,
  reducers: {
    getDiets: (state, action) => {
      state.diets = action.payload;
    },
  },
});

export function getDietsAsync() {
  return function (dispatch) {
    axios.get(`${baseUrl}/diets`).then((res) => dispatch(getDiets(res.data)));
  };
}

export const { getDiets } = dietsSlice.actions;
export default dietsSlice.reducer;
