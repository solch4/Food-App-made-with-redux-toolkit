const { Router } = require("express");
const recipesController = require("../controllers/recipes.js");

const router = Router();

// '/recipes'

/* GET /recipes?name="..." */
router.get("/", recipesController.getRecipes);

/* GET /recipes/{idReceta} */
router.get("/:id", recipesController.getRecipeById);

/* POST /recipes */
router.post("/", recipesController.postRecipe);

/* DELETE /recipes/{idReceta} */
router.delete("/:id", recipesController.deleteRecipe);

/* PUT /recipes/{idReceta}/edit */
router.put("/:id/edit", recipesController.editeRecipe);

module.exports = router;
