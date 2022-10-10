import React from 'react';
import { scrollBtn } from './ScrollToTopButton.module.css'

function ScrollToTopButton() {
  const handleClick = () => window.scrollTo(0, 0)
  
  return (
    <button className={scrollBtn} onClick={handleClick}></button>
  );
}

export default ScrollToTopButton;