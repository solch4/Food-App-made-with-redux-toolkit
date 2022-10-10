import React from 'react';
import { Link } from "react-router-dom";
import SearchBar from '../SearchBar/SearchBar';
import { nav, navContainer, title, rigthContainer } from './Nav.module.css'

function Nav() {
  return (
    <nav className={nav}>
      <div className={navContainer}>
        <h1 className={title}>
          <Link to="/home">Food app</Link>
        </h1>
        <div className={rigthContainer}>
          <h3 >
            <Link to='/favorites'>Favorites</Link>
          </h3>
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}

export default Nav;