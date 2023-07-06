const { Diet } = require("../db.js");
const { catchedAsync } = require("../utils");

const getDiets = async (req, res) => {
  const allDiets = await Diet.findAll();
  if (allDiets.length) return res.status(200).json(allDiets);
  else throw new Error("Diets not found");
};

module.exports = {
  getDiets: catchedAsync(getDiets),
};
