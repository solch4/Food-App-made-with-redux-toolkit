import React from "react";
import Card from "../Card/Card";
import CardLoader from "../CardLoader/CardLoader";
import Search404 from "../Search404/Search404";
import { cardContainer } from "./Cards.module.css";

function Cards({ actualRecipes }) {
  return (
    actualRecipes.length && Array.isArray(actualRecipes) ? (
      <div className={cardContainer}>
        {actualRecipes.map((r) => (
          <Card key={r.id} id={r.id} image={r.image} name={r.name}  diets={r.diets} healthScore={r.healthScore} createdInDB={r.createdInDB} />
        ))}
      </div>
    ) : (
      !actualRecipes.length 
      ? <CardLoader />
      : <Search404 />
    )
  );
}

export default Cards;
