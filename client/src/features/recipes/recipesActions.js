import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

export const getRecipesAsync = createAsyncThunk(
  "recipes/getRecipesAsync",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}/recipes`);
      const { data } = res.data;
      return data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const searchByNameAsync = createAsyncThunk(
  "recipes/searchByNameAsync",
  async (name) => {
    try {
      const res = await axios.get(`${baseUrl}/recipes?name=${name}`);
      const { data } = res.data;
      return data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const searchByHSAsync = createAsyncThunk(
  "recipes/searchByHSAsync",
  async (hs) => {
    try {
      const res = await axios.get(`${baseUrl}/recipes?hs=${hs}`);
      const { data } = res.data;
      return data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const getDetailAsync = createAsyncThunk(
  "recipes/getDetailAsync",
  async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/recipes/${id}`);
      const { data } = res.data;
      return data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const createRecipeAsync = createAsyncThunk(
  "recipes/createRecipeAsync",
  async (recipe) => {
    try {
      const res = await axios.post(`${baseUrl}/recipes`, recipe);
      const { message, newRecipe } = res.data.data;
      alert(message);
      return newRecipe;
    } catch (error) {
      const { message } = error.response.data;
      alert(`Error: ${message}`);
      throw new Error(message);
    }
  }
);

export const deleteRecipeAsync = createAsyncThunk(
  "recipes/deleteRecipeAsync",
  async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/recipes/${id}`);
      const message = res.data.data;
      alert(message);
      return id;
    } catch (error) {
      const { message } = error.response.data;
      alert(`Error: ${message}`);
      throw new Error(message);
    }
  }
);

export const editRecipeAsync = createAsyncThunk(
  "recipes/editRecipeAsync",
  async ({ id, ...payload }) => {
    try {
      const res = await axios.put(
        `${baseUrl}/recipes/${id}/edit`,
        payload
      );
      const { message, editedRecipe } = res.data.data;
      alert(message);
      return editedRecipe;
    } catch (error) {
      const { message } = error.response.data;
      alert(`Error: ${message}`);
      throw new Error(message);
    }
  }
);
