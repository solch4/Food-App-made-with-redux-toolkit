import { configureStore } from "@reduxjs/toolkit";
import paginationReducer from "../features/pagination/paginationSlice";
import recipesReducer from "../features/recipes/recipesSlice";
import dietsReducer from "../features/diets/dietsSlice";
import uxReducer from "../features/ux/uxSlice";

export const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    recipes: recipesReducer,
    diets: dietsReducer,
    ux: uxReducer,
  },
});
