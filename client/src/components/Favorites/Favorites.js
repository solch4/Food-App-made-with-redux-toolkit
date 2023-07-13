import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Cards from "../Cards/Cards";
import Nav from "../Nav/Nav";
import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton'
import cross from "../../assets/fork-and-knife-in-cross.svg";
import { container, noFavs } from './Favorites.module.css'

function Favorites() {
  const { favorites } = useSelector(state => state.recipes);
  const { scrollY } = useSelector(state => state.ux)

  useEffect(()=> {
    //para volver a la misma parte de la pág q quedó el usuario antes de ver el detail
    window.scrollTo(0, scrollY)
  }, [scrollY])

  return (
    <>
      <Nav />
      <div className={container}>
        {favorites.length ? (
          <Cards actualRecipes={favorites} />
        ) : (
          <div className={noFavs}>
            <img height={150} src={cross} alt="Fork and knife in cross" />
            <h3>No recipes added to favorites</h3>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default Favorites;
