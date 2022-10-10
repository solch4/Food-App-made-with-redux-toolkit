import React from 'react';
import { useNavigate } from "react-router-dom";
import error404 from '../../assets/404.png'
import { container, body, img, btn } from './PageNotFound.module.css'

function PageNotFound() {
  const navigate = useNavigate()
  const handleGoHome = () => navigate('/home')
  
  return (
    <div className={container}>
      <div className={body}>
        <h1>Error 404: Page not found</h1>
        <img className={img} src={error404} alt=':(' />
        <button className={btn} onClick={handleGoHome}>Go home</button>
      </div>
    </div>
  );
}

export default PageNotFound;