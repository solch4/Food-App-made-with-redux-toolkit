const { Router } = require('express');
const { getAllInfo } = require('../controllers/index.js')
const { Diet, Recipe } = require('../db.js')

const router = Router();

// '/recipes'

/* GET /recipes?name="..." */
router.get('/', async (req, res) => {
  const { name, hs } = req.query
  const allInfo = await getAllInfo()
  
  if (name) {
    const searchResults = allInfo.filter(recipe => recipe.name.toLowerCase().includes(name.toLowerCase()))
    searchResults.length 
      ? res.status(200).json(searchResults)
      : res.status(404).json('Recipe not found')
  } else if (hs) {
    const searchResults = allInfo.filter(recipe => recipe.healthScore == hs)
    searchResults.length 
      ? res.status(200).json(searchResults)
      : res.status(404).json(`Recipe not found`)
  }
  else res.status(200).json(allInfo)
})

/* GET /recipes/{idReceta} */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const allInfo = await getAllInfo()
    const detail = allInfo.find(recipe => recipe.id == id)
    detail
      ? res.status(200).json(detail)
      : res.status(404).json('Recipe not found')
  } catch (e) {
    console.log('error get /recipes/:id', e);
    res.status(400).json('Something went wrong')
  }
})

/* POST /recipes */
router.post('/', async (req, res) => {
  try {
    req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1)
    req.body.instructions = req.body.instructions ? req.body.instructions : null
    req.body.image = req.body.image ? req.body.image : 'https://static.educalingo.com/img/en/800/food.jpg'
    const { name, summary, diets } = req.body
    
    if (name && summary) {
      const recipeAux = await Recipe.create(req.body)
      const dietsAux = await Diet.findAll({
        where: { name: diets }
      })
      await recipeAux.addDiet(dietsAux)
      const newRecipe = await Recipe.findOne({
        where: { name },
        include: {
          model: Diet,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      })
      // console.log('POST newRecipe:',newRecipe);
      res.status(201).json({ 
        message: "Recipe submitted! \nIf you don't see any changes, please refresh the page.",
        newRecipe
      })
    } else res.status(400).json('Error 400: Bad request')
    
  } catch (e) {
    console.log('error post', e);
    res.status(400).json('Error: Something went wrong')
  }
})

/* DELETE /recipes/{idReceta} */
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    if (id) {
      const deleteRecipe = await Recipe.findByPk(id)
      if (deleteRecipe) {
        await deleteRecipe.destroy()
        res.status(200).json({ 
          message: 'The recipe was successfully deleted',
          id
        })
      } else res.status(404).json('ERROR: Recipe ID not found')
    } else res.status(400).json('ERROR: Something went wrong')
  } catch (e) {
    console.log('Error DELETE', e);
    res.status(400).json('ERROR: Recipe ID is wrong')
  }
})

/* PUT /recipes/{idReceta}/edit */
router.put('/:id/edit', async (req, res) => {
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
      const editedRecipe = await Recipe.findByPk(id, {
        include: {
          model: Diet,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      })
      // console.log('PUT editedRecipe:', editedRecipe);
      res.status(200).json({
        message: "The recipe was successfully edited! \nIf you don't see any changes, please refresh the page.",
        editedRecipe
      })
    } else res.status(404).json('Error: Recipe ID not found')
    
  } catch (e) {
    console.log('ERROR PUT:', e);
    res.status(400).json('Error: Recipe ID is wrong')
  }
})

module.exports = router 