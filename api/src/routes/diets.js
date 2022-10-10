const { Router } = require('express');
const { getApiInfo } = require('../controllers/index.js')
const { Diet } = require('../db.js')

const router = Router();

// '/diets'

/* GET /diets */
router.get('/', async (req, res) => {
  const allInfo = await getApiInfo()
  
  const allDiet = new Set(allInfo.map(r => r.diets).map(d => d.split(', ')).flat())
  const allDietArray = [...allDiet].filter(d => d)
  allDietArray.forEach(d => {
    Diet.findOrCreate({
      where: {
        name: d
      }
    })
  })

  const allDiets = await Diet.findAll()
  res.status(200).send(allDiets)
})


module.exports = router 