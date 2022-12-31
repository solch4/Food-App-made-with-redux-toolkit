import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3001";

const initialState = {
  // renderizo recipes
  recipes: [],
  // allRecipes es solo para aplicar los filtros allí, es una copia de recipes
  allRecipes: [],
  detail: [],
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    getRecipes: (state, action) => {
      state.allRecipes = action.payload;
      state.recipes = action.payload;
    },
    searchByName: (state, action) => {
      state.recipes = action.payload;
    },
    searchByHS: (state, action) => {
      state.recipes = action.payload;
    },
    filterByDiet: (state, action) => {
      const filteredRecipes = action.payload === 'all' ? state.allRecipes : state.allRecipes.filter(recipe => recipe.diets.includes(action.payload))
      state.recipes = filteredRecipes
    },
    sortByName: (state, action) => {
      if (!Array.isArray(state.recipes)) return { ...state } //para q la app no se rompa al intentar ordenar el string not found
      const recipesSortedByName =
        action.payload === 'nameAtoZ' 
          ? state.recipes.sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
          })
          : state.recipes.sort((a, b) => {
            if (a.name < b.name) return 1
            if (a.name > b.name) return -1
            return 0
          })
      state.recipes = recipesSortedByName
    },
    sortByHealthScore: (state, action) => {
      if (!Array.isArray(state.recipes)) return { ...state } //para q la app no se rompa al intentar ordenar el string not found
      const recipesSortedByHealthScore =
        action.payload === 'lessHealthy' 
          ? state.recipes.sort((a, b) => {
            if (a.healthScore > b.healthScore) return 1
            if (a.healthScore < b.healthScore) return -1
            return 0
          })
          : state.recipes.sort((a, b) => {
            if (a.healthScore < b.healthScore) return 1
            if (a.healthScore > b.healthScore) return -1
            return 0
          })
      state.recipes = recipesSortedByHealthScore
    },
    getDetail: (state, action) => {
      state.detail = action.payload;
    },
    clearDetail: (state, action) => {
      state.detail = [];
    },
    // habría q cambiar la respuesta del back para q esto funcione
    // createRecipe: (state, action) => {
    //   enviaría la nueva receta creada y la agregaría al toke
    //   state.allRecipes.push(action.payload);
    // },
    // deleteRecipe: (state, action) => {
    //   haría un filter para borrar la receta del front
    //   const filteredRecipes = etc
    //   state.allRecipes = filteredRecipes;
    //   state.recipes = filteredRecipes;
    // },
    // editRecipe: (state, action) => {
    //   state.allRecipes = action.payload;
    //   state.recipes = action.payload;
    // },
  },
});

export function getRecipesAsync() {
  return async function (dispatch) {
    const res = await axios.get(`${baseUrl}/recipes`);
    dispatch(getRecipes(res.data));
  };
}

export function searchByNameAsync(name) {
  return async function (dispatch) {
    try {
      const res = await axios.get(`${baseUrl}/recipes?name=${name}`);
      dispatch(searchByName(res.data));
    } catch (e) {
      dispatch(searchByName(e.response.data));
    }
  };
}

export function searchByHSAsync(hs) {
  return async function (dispatch) {
    try {
      const res = await axios.get(`${baseUrl}/recipes?hs=${hs}`);
      dispatch(searchByHS(res.data));
    } catch (e) {
      dispatch(searchByHS(e.response.data));
    }
  };
}

export function getDetailAsync (id) {
  return async function (dispatch) {
    try {
      const res = await axios.get(`${baseUrl}/recipes/${id}`)
      dispatch(getDetail(res.data))
    } catch (e) {
      dispatch(getDetail(e.response.data))
    }
  }
}

export function createRecipeAsync (newRecipe) {
  return async function (dispatch) {
    try {
      const res = await axios.post(`${baseUrl}/recipes`, newRecipe)
      alert(res.data)
      // dispatch(createRecipe(res.data))
    } catch (e) {
      alert(e.response.data)
    }
  }
}

export function deleteRecipeAsync (id) {
  return async function (dispatch) {
    try {
      const res = await axios.delete(`${baseUrl}/recipes/${id}`)
      alert(res.data)
      // dispatch(deleteRecipe(res.data))
    } catch (e) {
      alert(e.response.data)
    }
  }
}

export function editRecipeAsync (payload, id) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${baseUrl}/recipes/${id}/edit`, payload)
      alert(res.data)
      // dispatch(editRecipe(res.data))
    } catch (e) {
      alert(e.response.data)
    }
  }
}

export const {
  getRecipes,
  searchByName,
  searchByHS,
  filterByDiet,
  sortByName,
  sortByHealthScore,
  getDetail,
  clearDetail,
  // createRecipe,
  // deleteRecipe,
  // editRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;
