const { getAllInfo, formatDiets } = require("../helpers");
const { Diet, Recipe } = require("../db.js");
const { catchedAsync, response } = require("../utils");
const { ClientError } = require("../utils/errors");

const getRecipes = async (req, res) => {
  const { name, hs } = req.query;
  const allInfo = await getAllInfo();

  if (name || hs) {
    const searchResults = allInfo.filter((recipe) => {
      if (name) return recipe.name.toLowerCase().includes(name.toLowerCase());
      else if (hs) return recipe.healthScore == hs;
    });

    if (searchResults.length) return response(res, 200, searchResults);
    else throw new ClientError("Recipe not found", 404);
  } else response(res, 200, allInfo);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const allInfo = await getAllInfo();
  const detail = allInfo.find((recipe) => recipe.id == id);

  if (detail) return response(res, 200, detail);
  else throw new ClientError("Recipe not found", 404);
};

const postRecipe = async (req, res) => {
  if (req.body.name && req.body.summary) {
    req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1);
    req.body.instructions = req.body.instructions
      ? req.body.instructions
      : null;
    req.body.image = req.body.image
      ? req.body.image
      : "https://static.educalingo.com/img/en/800/food.jpg";
    const { name, diets } = req.body;
    const recipeAux = await Recipe.create(req.body);
    const dietsAux = await Diet.findAll({
      where: { name: diets },
    });
    await recipeAux.addDiet(dietsAux);
    const [newRecipe] = formatDiets([
      await Recipe.findOne({
        where: { name },
        include: {
          model: Diet,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      }),
    ]);
    // console.log('POST newRecipe:',newRecipe);
    response(res, 201, {
      message:
        "Recipe submitted! \nIf you don't see any changes, please refresh the page.",
      newRecipe,
    });
  } else throw new ClientError("Name and/or summary missing");
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const deleteRecipe = await Recipe.findByPk(id);
    if (deleteRecipe) {
      await deleteRecipe.destroy();
      response(res, 200, "The recipe was successfully deleted");
    } else throw new ClientError("Recipe ID not found", 404);
  } else throw new ClientError("Something went wrong");
};

const editeRecipe = async (req, res) => {
  const { id } = req.params;
  const editableRecipe = await Recipe.findByPk(id);
  if (Object.keys(editableRecipe).length) {
    // si modifican el name, lo paso a mayus
    if (req.body.name)
      req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1);
    await Recipe.update(req.body, {
      where: { id },
    });
    //seteo los temperamentos solamente si me los pasan x body (si no lo hago tira error undef)
    if (req.body.diets) {
      const dietsBody = await Diet.findAll({
        where: { name: req.body.diets },
      });
      await editableRecipe.setDiets(dietsBody);
    }
    const [editedRecipe] = formatDiets([
      await Recipe.findByPk(id, {
        include: {
          model: Diet,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      }),
    ]);
    // console.log('PUT editedRecipe:', editedRecipe);
    response(res, 200, {
      message:
        "The recipe was successfully edited! \nIf you don't see any changes, please refresh the page.",
      editedRecipe,
    });
  } else throw new ClientError("Recipe ID not found", 404);
};

module.exports = {
  getRecipes: catchedAsync(getRecipes),
  getRecipeById: catchedAsync(getRecipeById),
  postRecipe: catchedAsync(postRecipe),
  deleteRecipe: catchedAsync(deleteRecipe),
  editeRecipe: catchedAsync(editeRecipe),
};
