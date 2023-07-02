import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

export const getRecipesAsync = createAsyncThunk(
  "recipes/getRecipesAsync",
  async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/recipes`);
      return data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

export const searchByNameAsync = createAsyncThunk(
  "recipes/searchByNameAsync",
  async (name) => {
    try {
      const { data } = await axios.get(`${baseUrl}/recipes?name=${name}`);
      return data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

export const searchByHSAsync = createAsyncThunk(
  "recipes/searchByHSAsync",
  async (hs) => {
    try {
      const { data } = await axios.get(`${baseUrl}/recipes?hs=${hs}`);
      return data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

export const getDetailAsync = createAsyncThunk(
  "recipes/getDetailAsync",
  async (id) => {
    try {
      const { data } = await axios.get(`${baseUrl}/recipes/${id}`);
      return data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

export const createRecipeAsync = createAsyncThunk(
  "recipes/createRecipeAsync",
  async (newRecipe) => {
    try {
      const { data } = await axios.post(`${baseUrl}/recipes`, newRecipe);
      alert(data.message);
      return data.newRecipe;
    } catch (error) {
      const errorMessage = error.response.data;
      alert(`Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }
);

export const deleteRecipeAsync = createAsyncThunk(
  "recipes/deleteRecipeAsync",
  async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/recipes/${id}`);
      alert(data.message);
      return data.id;
    } catch (error) {
      const errorMessage = error.response.data;
      alert(`Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }
);

export const editRecipeAsync = createAsyncThunk(
  "recipes/editRecipeAsync",
  async ({ id, ...payload }) => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/recipes/${id}/edit`,
        payload
      );
      alert(data.message);
      return data.editedRecipe;
    } catch (error) {
      const errorMessage = error.response.data;
      alert(`Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }
);
