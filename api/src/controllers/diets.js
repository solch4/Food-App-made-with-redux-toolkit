const { Diet } = require("../db.js");

const getDiets = async (req, res, next) => {
  try {
    const allDiets = await Diet.findAll();
    if (allDiets.length) return res.status(200).json(allDiets);
    else throw new Error("Diets not found");
  } catch (error) {
    next(error);
  }
};

module.exports = { getDiets };
