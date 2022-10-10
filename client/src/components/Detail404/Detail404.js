import React from "react";
import cross from "../../assets/fork-and-knife-in-cross.svg";
import { body, img } from './Detail404.module.css'

function Detail404() {
  return (
    <div className={body}>
      <img
        className={img}
        src={cross}
        alt="Fork and knife in cross"
      />
      <h1>Recipe not found</h1>
    </div>
  );
}

export default Detail404;
