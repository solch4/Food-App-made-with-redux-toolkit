import React from "react";
import { useSelector } from "react-redux";
import Card from "../Card/Card";
import CardLoader from "../CardLoader/CardLoader";
import Search404 from "../Search404/Search404";
import { cardContainer } from "./Cards.module.css";

function Cards({ actualRecipes }) {
  const { loading, error } = useSelector((state) => state.recipes);

  if (loading) return <CardLoader />;
  if (error) return <Search404 error={error} />;

  return (
    <div className={cardContainer}>
      {actualRecipes.map((r) => (
        <Card
          key={r.id}
          id={r.id}
          image={r.image}
          name={r.name}
          diets={r.diets}
          healthScore={r.healthScore}
          createdInDB={r.createdInDB}
        />
      ))}
    </div>
  );
}

export default Cards;
