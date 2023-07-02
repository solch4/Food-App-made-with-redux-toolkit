import { createSlice } from "@reduxjs/toolkit";
import {
  createRecipeAsync,
  deleteRecipeAsync,
  editRecipeAsync,
  getDetailAsync,
  getRecipesAsync,
  searchByHSAsync,
  searchByNameAsync,
} from "./recipesActions";

const initialState = {
  // renderizo recipes
  recipes: [],
  // allRecipes es solo para aplicar los filtros allí, es una copia de recipes
  allRecipes: [],
  detail: [],
  loading: false,
  error: "",
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    filterByDiet: (state, action) => {
      const filteredRecipes =
        action.payload === "all"
          ? state.allRecipes
          : state.allRecipes.filter((recipe) =>
              recipe.diets.includes(action.payload)
            );
      state.recipes = filteredRecipes;
      state.error = "";
    },
    sortByName: (state, action) => {
      if (!Array.isArray(state.recipes)) return { ...state }; //para q la app no se rompa al intentar ordenar el string not found
      const recipesSortedByName =
        action.payload === "nameAtoZ"
          ? state.recipes.sort((a, b) => {
              if (a.name > b.name) return 1;
              if (a.name < b.name) return -1;
              return 0;
            })
          : state.recipes.sort((a, b) => {
              if (a.name < b.name) return 1;
              if (a.name > b.name) return -1;
              return 0;
            });
      state.recipes = recipesSortedByName;
    },
    sortByHealthScore: (state, action) => {
      if (!Array.isArray(state.recipes)) return { ...state }; //para q la app no se rompa al intentar ordenar el string not found
      const recipesSortedByHealthScore =
        action.payload === "lessHealthy"
          ? state.recipes.sort((a, b) => {
              if (a.healthScore > b.healthScore) return 1;
              if (a.healthScore < b.healthScore) return -1;
              return 0;
            })
          : state.recipes.sort((a, b) => {
              if (a.healthScore < b.healthScore) return 1;
              if (a.healthScore > b.healthScore) return -1;
              return 0;
            });
      state.recipes = recipesSortedByHealthScore;
    },
    clearDetail: (state, action) => {
      state.detail = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getRecipesAsync
      .addCase(getRecipesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecipesAsync.fulfilled, (state, action) => {
        state.allRecipes = action.payload;
        state.recipes = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getRecipesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // searchByNameAsync
      .addCase(searchByNameAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchByNameAsync.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(searchByNameAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // searchByHSAsync
      .addCase(searchByHSAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchByHSAsync.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(searchByHSAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // getDetailAsync
      .addCase(getDetailAsync.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(getDetailAsync.rejected, (state, action) => {
        state.detail = action.error.message;
      })
      // createRecipeAsync
      .addCase(createRecipeAsync.fulfilled, (state, action) => {
        const newRecipes = [action.payload, ...state.allRecipes];
        state.allRecipes = newRecipes;
        state.recipes = newRecipes;
        state.error = "";
      })
      // deleteRecipeAsync
      .addCase(deleteRecipeAsync.fulfilled, (state, action) => {
        const recipesFiltered = state.allRecipes.filter(
          (r) => r.id !== action.payload
        );
        state.allRecipes = recipesFiltered;
        state.recipes = recipesFiltered;
      })
      // editRecipeAsync
      .addCase(editRecipeAsync.fulfilled, (state, action) => {
        const editedRecipe = action.payload;
        const allRecipesCopy = state.allRecipes;
        const index = allRecipesCopy.findIndex((r) => r.id === editedRecipe.id);
        allRecipesCopy.splice(index, 1, editedRecipe);
        state.allRecipes = allRecipesCopy;
        state.recipes = allRecipesCopy;
      });
  },
});

export const { filterByDiet, sortByName, sortByHealthScore, clearDetail } =
  recipesSlice.actions;

export default recipesSlice.reducer;
