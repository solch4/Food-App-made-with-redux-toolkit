const { Router } = require("express");
const { Diet } = require("../db.js");

const router = Router();

// '/diets'

/* GET /diets */
router.get("/", async (req, res, next) => {
  try {
    const allDiets = await Diet.findAll();
    if (allDiets.length) return res.status(200).json(allDiets);
    else throw new Error("Diets not found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
