const { Diet } = require("../db.js");
const { catchedAsync, response } = require("../utils");
const { ClientError } = require("../utils/errors");

const getDiets = async (req, res) => {
  const allDiets = await Diet.findAll();
  if (allDiets.length) return response(res, 200, allDiets);
  else throw new ClientError("Diets not found", 404);
};

module.exports = {
  getDiets: catchedAsync(getDiets),
};
