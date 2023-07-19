import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

export const getDietsAsync = createAsyncThunk(
  "diets/getDietsAsync",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}/diets`);
      const { data } = res.data;
      return data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);
