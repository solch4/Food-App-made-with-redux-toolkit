const { Router } = require("express");
const dietsController = require("../controllers/diets.js");

const router = Router();

// '/diets'

/* GET /diets */
router.get("/", dietsController.getDiets);

module.exports = router;
