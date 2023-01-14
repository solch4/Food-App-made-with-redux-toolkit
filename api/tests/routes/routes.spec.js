/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Recipe, Diet, conn } = require("../../src/db.js");

const agent = session(app);

const recipe1 = {
  image: "https://www.sugardishme.com/wp-content/uploads/2013/10/10-Minute-Pizza-Dough-Square.jpg",
  name: "Pizza",
  summary: `Making homemade pizza dough can sound like a lot of work, but it’s so worth the bragging rights. The dough itself requires few ingredients and just a little bit of rising and rest time. While you wait for the dough to be ready, you can get to work prepping your tomato sauce, chopping fresh vegetables, or grating the cheese you’ll put on top. Bake for 15 minutes, garnish with basil (or, let’s be real, more cheese), and enjoy showing off your way-better-than-takeout creation.`,
  healthScore: 33,
  diets: ["Lacto ovo vegetarian"],
};

const recipe2 = {
  image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/cupcakes-22aa045.jpg",
  name: "Cupcakes",
  summary: `Bake these easy vanilla cupcakes in just 35 minutes. Perfect for birthdays, picnics or whenever you fancy a sweet treat, they're sure to be a crowd-pleaser.`,
  healthScore: 48,
  instructions: [
    `Heat oven to 180C/160C fan/gas 4 and fill a 12 cupcake tray with cases.`,
    `Using an electric whisk beat 110g softened butter and 110g golden caster sugar together until pale and fluffy then whisk in 2 large eggs, one at a time, scraping down the sides of the bowl after each addition.`,
    `Add ½ tsp vanilla extract, 110g self-raising flour and a pinch of salt, whisk until just combined then spoon the mixture into the cupcake cases.`,
    `Bake for 15 mins until golden brown and a skewer inserted into the middle of each cake comes out clean. Leave to cool completely on a wire rack.`,
    `To make the buttercream, whisk 150g softened butter until super soft then add 300g icing sugar, 1 tsp vanilla extract and a pinch of salt.`,
    `Whisk together until smooth (start off slowly to avoid an icing sugar cloud) then beat in 3 tbsp milk.`,
    `If wanting to colour, stir in the food colouring now. Spoon or pipe onto the cooled cupcakes.`,
  ],
  diets: ["Lacto ovo vegetarian"],
};

const recipe3 = {
  image: "https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2017/07/vegan-banana-ice-cream-cone-800x1200.jpg",
  name: "Vegan banana ice cream",
  summary: "The beauty of this ice cream is that it’s good enough to just have it on its own, if you like bananas that is. And it’s so pure and natural that I imagine it will go down well with your teething toddler too, not that I’m an expert on kids, mind you.",
  healthScore: 100,
  instructions: [
    `Place frozen banana slices in a food processor and blend until smooth.`,
    `Initially, the mixture will be a bit crumbly but if you persevere it will soon (5 minutes tops) change into smooth and super creamy banana ice-cream.`,
    `If you are after a soft serve, consume immediately. Otherwise, place smooth banana mixture in a freezer-friendly box and freeze until solid.`,
    `Let it thaw for a few minutes before scooping.`,
  ],
  diets: ["Gluten free", "Lacto ovo vegetarian", "Vegan", "Fodmap friendly"],
};

describe("RECIPE ROUTES", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );

  beforeEach(() =>
    Recipe.sync({ force: true }).then(async () => {
      const newRecipe = await Recipe.create(recipe1);
      const dietsAux = await Diet.findAll({
        where: {
          name: recipe1.diets,
        },
      });
      newRecipe.addDiet(dietsAux);
    })
  );

  describe("GET /recipes", () => {
    it("Should get statusCode 200", () => agent.get("/recipes").expect(200));
  });

  describe("GET /recipes/:id", () => {
    it("Should get statusCode 200 if id is found", () =>
      // const res = await agent.get('/recipes/715421')
      // expect(res.statusCode).to.equal(200)
      agent.get("/recipes/715421").expect(200));
    it("Should get statusCode 404 if id is not found", () =>
      agent.get("/recipes/randomID123").expect(404));
    it("Should get an appropriate msg if id is not found", () =>
      agent.get("/recipes/randomID123").expect(/not found/));
  });

  describe("GET /diets", () => {
    it("Should get statusCode 200", () => agent.get("/diets").expect(200));
  });

  describe("POST /recipes", () => {
    it("Should get statusCode 400 if name and/or summary are not send ", async () => {
      const res1 = await agent.post("/recipes").send({});
      expect(res1.statusCode).to.equal(400);
      const res2 = await agent.post("/recipes").send({ name: "Ice Cream" });
      expect(res2.statusCode).to.equal(400);
      const res3 = await agent
        .post("/recipes")
        .send({ summary: "It's an ice Cream" });
      expect(res3.statusCode).to.equal(400);
    });

    it("Should get statusCode 201 if the recipe is created successfully", async () => {
      const res1 = await agent.post("/recipes").send(recipe2);
      expect(res1.statusCode).to.equal(201);
      const res2 = await agent.post("/recipes").send(recipe3);
      expect(res2.statusCode).to.equal(201);
    });
  });
});
