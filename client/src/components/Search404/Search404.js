import React from "react";
import cross from "../../assets/fork-and-knife-in-cross.svg";
import { notFound, cardContainer } from "./Search404.module.css";

function Search404() {
  return (
    <div className={cardContainer}>
      <div className={notFound}>
        <img height={130} src={cross} alt="" />
        <h2>Recipe not found</h2>
        <p>
          If you do not find the recipe you are looking for, submit it so other
          people can see it.
        </p>
      </div>
    </div>
  );
}

export default Search404;
