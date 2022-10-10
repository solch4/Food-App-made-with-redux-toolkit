import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getDiets, getRecipes, saveScrollY, setActualPage, setMaxPageNumber, setMinPageNumber } from '../../actions/actions';
import Filter from '../Filter/Filter';
import Sort from '../Sort/Sort';
import Pagination from '../Pagination/Pagination';
import Nav from '../Nav/Nav';
import Cards from '../Cards/Cards';
import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton';
import { App, homeContainer, menuContainer, sortFilter, refreshBtn, createRecipe } from './Home.module.css'

function Home() {
  const scrollY = useSelector(state => state.scrollY)
  const recipes = useSelector(state => state.recipes)
  const dispatch = useDispatch()
  const [, setSort] = useState('') //este state sólo sirve para re-renderizar la pág cuando hacemos un sort

  //pagination
  const actualPage = useSelector(state => state.actualPage)
  const recipesPerPage = 9
  const indexOfLastRecipe = actualPage * recipesPerPage //last recipe per page
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage //1st recipe per page
  const actualRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe)
  //minPageNumber y maxPageNumber son para hacer el paginado más tikito y que quede lindo, uso ambos para hacer un slice y renderizar sólo ese pedazo
  const minPageNumber = useSelector(state => state.minPageNumber)
  const maxPageNumber = useSelector(state => state.maxPageNumber)

  const pages = (pageNumber) => {
    //al cambiar de pág scrolleo hasta el inicio
    window.scrollTo(0, 0)
    dispatch(setActualPage(pageNumber))
    if(pageNumber >= maxPageNumber) {
      dispatch(setMinPageNumber(minPageNumber+4))
      dispatch(setMaxPageNumber(maxPageNumber+4))
    } else if(pageNumber <= minPageNumber+1 && pageNumber !== 1) {
      dispatch(setMinPageNumber(minPageNumber-4))
      dispatch(setMaxPageNumber(maxPageNumber-4))
    }
  };

  const handleRefresh = () => {
    dispatch(setActualPage(1))
    dispatch(setMinPageNumber(0))
    dispatch(setMaxPageNumber(5)  )
    dispatch(getRecipes())

    //scrolleo al top de la pág
    dispatch(saveScrollY(0))
  }

  useEffect(() => {
    //dispacho la action solo si mi estado está vacío (cuando entro x 1ra vez a la pag)
    !recipes.length && dispatch(getRecipes())
    dispatch(getDiets())

    //para volver a la misma parte de la pág q quedó el usuario antes de ver el detail
    window.scrollTo(0, scrollY)
  }, [dispatch, recipes, scrollY])

  return (
    <div className={App}>
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
        
        <Cards actualRecipes={actualRecipes} />
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default Home;