const { Router } = require('express');
const { getAllInfo, formatDiets } = require('../controllers/index.js')
const { Diet, Recipe } = require('../db.js')

const router = Router();

// '/recipes'

/* GET /recipes?name="..." */
router.get('/', async (req, res, next) => {
  try {
    const { name, hs } = req.query
    const allInfo = await getAllInfo()
    
    if (name) {
      const searchResults = allInfo.filter(recipe => recipe.name.toLowerCase().includes(name.toLowerCase()))
      if (searchResults.length) return res.status(200).json(searchResults)
      else throw new Error('Recipe not found')
    } else if (hs) {
      const searchResults = allInfo.filter(recipe => recipe.healthScore == hs)
      if (searchResults.length) return res.status(200).json(searchResults)
      else throw new Error('Recipe not found')
    } else res.status(200).json(allInfo)
  } catch (error) {
    next(error);
  }
})

/* GET /recipes/{idReceta} */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const allInfo = await getAllInfo();
    const detail = allInfo.find((recipe) => recipe.id == id);

    if (detail) return res.status(200).json(detail);
    else throw new Error("Recipe not found");
  } catch (error) {
    next(error);
  }
})

/* POST /recipes */
router.post('/', async (req, res, next) => {
  try {
    if (req.body.name && req.body.summary) {
      req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1)
      req.body.instructions = req.body.instructions ? req.body.instructions : null
      req.body.image = req.body.image ? req.body.image : 'https://static.educalingo.com/img/en/800/food.jpg'
      const { name, diets } = req.body
      const recipeAux = await Recipe.create(req.body)
      const dietsAux = await Diet.findAll({
        where: { name: diets }
      })
      await recipeAux.addDiet(dietsAux)
      const [newRecipe] = formatDiets([await Recipe.findOne({
        where: { name },
        include: {
          model: Diet,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      })])
      // console.log('POST newRecipe:',newRecipe);
      res.status(201).json({ 
        message: "Recipe submitted! \nIf you don't see any changes, please refresh the page.",
        newRecipe
      })
    } else throw new Error("Name and/or summary missing");
  } catch (error) {
    next(error)
  }
})

/* DELETE /recipes/{idReceta} */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    if (id) {
      const deleteRecipe = await Recipe.findByPk(id)
      if (deleteRecipe) {
        await deleteRecipe.destroy()
        res.status(200).json({ 
          message: 'The recipe was successfully deleted',
          id
        })
      } else throw new Error('Recipe ID not found')
    } else throw new Error('Something went wrong')
  } catch (error) {
    next(error)
  }
})

/* PUT /recipes/{idReceta}/edit */
router.put('/:id/edit', async (req, res, next) => {
  const { id } = req.params
  try {
    const editableRecipe = await Recipe.findByPk(id)    
    if (Object.keys(editableRecipe).length) {
      // si modifican el name, lo paso a mayus
      if (req.body.name) req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1)
      await Recipe.update(req.body, { //método de sequelize. recibe dos params ({obj con datos a actualizar}, {where hacerlo})
        where: { id }
      })
      if (req.body.diets) { //seteo los temperamentos solamente si me los pasan x body (si no lo hago tira error undef)
        const dietsBody = await Diet.findAll({
          where: { name: req.body.diets }
        })
        await editableRecipe.setDiets(dietsBody)
      }
      const [editedRecipe] = formatDiets([await Recipe.findByPk(id, {
        include: {
          model: Diet,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      })])
      // console.log('PUT editedRecipe:', editedRecipe);
      res.status(200).json({
        message: "The recipe was successfully edited! \nIf you don't see any changes, please refresh the page.",
        editedRecipe
      })
    } else throw new Error('Recipe ID not found')
  } catch (error) {
    next(error)
  }
})

module.exports = router 