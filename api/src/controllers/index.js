const axios = require("axios");
const { Diet, Recipe } = require("../db.js");
const { API_KEY, API_URL } = process.env;

const getApiInfo = async () => {
  const res = await axios.get(`${API_URL}/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
  const apiInfo = await res.data.results.map(recipe => {
    return {
      id: recipe.id,
      image: recipe.image,
      name: recipe.title,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      instructions: recipe.analyzedInstructions[0]?.steps.map(step => step.step),
      diets: recipe.diets.map(diet => diet[0].toUpperCase() + diet.slice(1)).join(', '),
      dishTypes: recipe.dishTypes.map(dt => dt[0].toUpperCase() + dt.slice(1)).join(', ')
    }
  })
  return apiInfo
}

const getDBInfo = async () => {
  return await Recipe.findAll({
    include: {
      model: Diet,
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  })
}

const getAllInfo = async () => {
  const apiInfo = await getApiInfo()
  const DBInfo = await getDBInfo()
  const allInfo = apiInfo.concat(DBInfo)
  return allInfo
}

module.exports = {
  getApiInfo,
  getDBInfo,
  getAllInfo
}