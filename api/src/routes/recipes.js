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
      ? res.status(200).send(searchResults)
      : res.status(404).send('Recipe not found')
  } else if (hs) {
    const searchResults = allInfo.filter(recipe => recipe.healthScore == hs)
    searchResults.length 
      ? res.status(200).send(searchResults)
      : res.status(404).send(`Recipe not found`)
  }
  else res.status(200).send(allInfo)
})

/* GET /recipes/{idReceta} */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const allInfo = await getAllInfo()
    const detail = allInfo.find(recipe => recipe.id == id)
    detail
      ? res.status(200).send(detail)
      : res.status(404).send('Recipe not found')
  } catch (e) {
    console.log('error get /recipes/:id', e);
    res.status(400).send('Something went wrong')
  }
})

/* POST /recipes */
router.post('/', async (req, res) => {
  try {
    const { name, summary, healthScore, instructions, image, diets } = req.body
    
    if (name && summary) {
      const newRecipe = await Recipe.create({
        ...req.body,
        name: name[0].toUpperCase() + name.slice(1),
        summary: summary[0].toUpperCase() + summary.slice(1),
        instructions: instructions ? instructions[0].toUpperCase() + instructions.slice(1) : null,
        image: image ? image : 'https://static.educalingo.com/img/en/800/food.jpg'
      })
      const dietsAux = await Diet.findAll({
        where: {
          name: diets
        }
      })
      newRecipe.addDiet(dietsAux)
      // console.log('POST newRecipe:',newRecipe);
      res.status(201).send("Recipe submitted! \nIf you don't see any changes, please refresh the page.")
    } else res.status(400).send('Error 400: Bad request')
    
  } catch (e) {
    console.log('error post', e);
    res.status(400).send('Error: Something went wrong')
  }
})

/* DELETE /recipes/{idReceta} */
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    if (id) {
      const deleteRecipe = await Recipe.findOne({
        where: { id: id }
      })
      if (deleteRecipe) {
        await deleteRecipe.destroy()
        res.status(200).send('The recipe was successfully deleted')
      } else res.status(404).send('ERROR: Recipe ID not found')
    } else res.status(400).send('ERROR: Something went wrong')
  
  } catch (e) {
    console.log('Error DELETE', e);
    res.status(400).send('ERROR: Recipe ID is wrong')
  }
})

/* PUT /recipes/{idReceta}/edit */
router.put('/:id/edit', async (req, res) => {
  const id = req.params.id
  const { name, summary, instructions } = req.body

  try {
    const editableRecipe = await Recipe.findByPk(id)
    // console.log('editableRecipe', editableRecipe);

    if (Object.keys(editableRecipe).length) {
      if (name) req.body.name = name[0].toUpperCase() + name.slice(1) //si modifican el name, lo paso a mayus
      if (summary) req.body.summary = summary[0].toUpperCase() + summary.slice(1)
      if (instructions) req.body.instructions = instructions[0].toUpperCase() + instructions.slice(1)

      await Recipe.update(req.body, { //método de sequelize. recibe dos params ({obj con datos a actualizar}, {where hacerlo})
        where: { id: id }
      })

      if (req.body.diets) { //seteo los temperamentos solamente si me los pasan x body (si no lo hago tira error undef)
        const dietsBody = await Diet.findAll({
          where: { name: req.body.diets }
        })
        editableRecipe.setDiets(dietsBody)
      }

      res.status(200).send("The recipe was successfully edited! \nIf you don't see any changes, please refresh the page.")
    } else res.status(404).send('Error: Recipe ID not found')
    
  } catch (e) {
    console.log('ERROR PUT:', e);
    res.status(400).send('Error: Recipe ID is wrong')
  }
})

module.exports = router 