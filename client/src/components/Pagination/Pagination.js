import React from "react";
import { useSelector } from "react-redux";
import leftArrow from '../../assets/arrow-left.svg'
import rightArrow from '../../assets/arrow-right.svg'
import { container, pageNumber, pageNumberACTIVE, pageNumberDISABLED, arrow } from "./Pagination.module.css";

function Pagination({ recipesPerPage, pages }) {
  const recipes = useSelector(state => state.recipes)
  const actualPage = useSelector(state => state.actualPage)
  const minPageNumber = useSelector(state => state.minPageNumber)
  const maxPageNumber = useSelector(state => state.maxPageNumber)

  const arrPageNumbers = [];
  //pregunto si es un array para tener una sola pág cuando tenga el string de recipe not found
  const nOfPages = Math.ceil((Array.isArray(recipes) ? recipes.length : 1) / recipesPerPage);
  for (let i = 1; i <= nOfPages; i++) arrPageNumbers.push(i);

  //condicion para q no rompa al querer volver a una pag q no existe
  const handlePrev = () => (actualPage-1) && pages(actualPage - 1)
  //condicion para q no rompa al querer avanzar a una pag q no existe
  const handleNext = () => (actualPage!==arrPageNumbers.length) && pages(actualPage + 1)

  return (
    <ul className={container}>
      {/* prev */}
      <li className={actualPage === 1 ? pageNumberDISABLED : pageNumber} onClick={handlePrev}>
        <img className={arrow} src={leftArrow} alt='«'/>
      </li>
      
      {/* page n */}
      {arrPageNumbers.slice(minPageNumber, maxPageNumber).map((n) => 
        <li className={actualPage === n ? pageNumberACTIVE : pageNumber} onClick={() => pages(n)} key={n}>{n}</li>
      )}
      
      {/* next */}
      <li className={actualPage === arrPageNumbers.length ? pageNumberDISABLED : pageNumber} onClick={handleNext}>
        <img className={arrow} src={rightArrow} alt='»'/>
      </li>
    </ul>
  );
}

export default Pagination;