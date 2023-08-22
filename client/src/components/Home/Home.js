import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getRecipesAsync } from '../../features/recipes/recipesActions';
import { setActualPage, setMaxPageNumber, setMinPageNumber } from '../../features/pagination/paginationSlice';
import { saveScrollY, setFilterSelectValue, setSortSelectValue } from '../../features/ux/uxSlice';
import { useRecipes } from '../../hooks';
import Filter from '../Filter/Filter';
import Sort from '../Sort/Sort';
import Pagination from '../Pagination/Pagination';
import Nav from '../Nav/Nav';
import Cards from '../Cards/Cards';
import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton';
import { homeContainer, menuContainer, sortFilter, refreshBtn, createRecipe, cardsContainer } from './Home.module.css'

function Home() {
  const { scrollY } = useSelector(state => state.ux)
  const { recipes } = useRecipes();
  const dispatch = useDispatch()
  const [, setSort] = useState('') //este state sólo sirve para re-renderizar la pág cuando hacemos un sort

  //pagination
  //minPageNumber y maxPageNumber son para hacer el paginado más tikito y que quede lindo, uso ambos para hacer un slice y renderizar sólo ese pedazo
  const { actualPage, minPageNumber, maxPageNumber } = useSelector(state => state.pagination)
  const recipesPerPage = 9
  const indexOfLastRecipe = actualPage * recipesPerPage //last recipe per page
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage //1st recipe per page
  const actualRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

  const pages = (pageNumber) => {
    //al cambiar de pág scrolleo hasta el inicio
    window.scrollTo(0, 0)
    dispatch(setActualPage(pageNumber))
    const number = 3
    if(pageNumber >= maxPageNumber) {
      dispatch(setMinPageNumber(minPageNumber+number))
      dispatch(setMaxPageNumber(maxPageNumber+number))
    } else if(pageNumber <= minPageNumber+1 && pageNumber !== 1) {
      dispatch(setMinPageNumber(minPageNumber-number))
      dispatch(setMaxPageNumber(maxPageNumber-number))
    }
  };

  const handleRefresh = () => {
    dispatch(setActualPage(1))
    dispatch(setMinPageNumber(0))
    dispatch(setMaxPageNumber(4))
    dispatch(getRecipesAsync())
    dispatch(setSortSelectValue('DEFAULT'))
    dispatch(setFilterSelectValue('DEFAULT'))

    //scrolleo al top de la pág
    dispatch(saveScrollY(0))
  }

  useEffect(() => {
    //para volver a la misma parte de la pág q quedó el usuario antes de ver el detail
    window.scrollTo(0, scrollY)
  }, [scrollY])

  return (
    <>
      <Nav />
      <div className={homeContainer}>
        
        <div className={menuContainer}>
          <div className={sortFilter}>
            <Filter />
            <Sort setSort={setSort} />
          </div>
          <button className={refreshBtn} onClick={handleRefresh}>Refresh</button>
          
          <h3 className={createRecipe}>
            Submit your own recipe&nbsp;
            <Link to='/creation'>here</Link>!
          </h3>

          <Pagination recipesPerPage={recipesPerPage} pages={pages} />
        </div>
        
        <div className={cardsContainer}>
          <Cards actualRecipes={actualRecipes} />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default Home;