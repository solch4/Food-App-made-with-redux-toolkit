import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

export const getDietsAsync = createAsyncThunk(
  "diets/getDietsAsync",
  async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/diets`);
      return data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);
