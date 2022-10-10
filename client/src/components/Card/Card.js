import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { saveScrollY } from '../../actions/actions';
import { imgHealthSContainer, img, card, body, title, healthS, diet } from './Card.module.css'

function Card ({ id, image, name, diets, healthScore, createdInDB }) {
  const dispatch = useDispatch()
  //para que no haga ese scroll fiero al volver al home dsp de ver el detail
  const handleClick = () => dispatch(saveScrollY(window.scrollY))

  //healthscore heart color
  const color = () => {
    if (healthScore >= 66) return '#00761F'
    if (healthScore >= 33) return '#f1cd00'
    else return '#BE0309'
  }

  return (
    <Link onClick={handleClick} className={card} to={`/home/${id}`}>
      <div className={imgHealthSContainer}>
        <img className={img} src={image} alt={name} />
        {healthScore && (
          <h5 className={healthS}>{healthScore}%&nbsp;
            <svg height={11} fill={color(healthScore)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
          </h5>
        )}
      </div>

      <div className={body}>
        <h3 className={title}>{name}</h3>
        {createdInDB
          ? <p className={diet}>{diets.map(d => Object.values(d)).join(', ')}</p>
          : <p className={diet}>{diets}</p>}
      </div>
    </Link>
  );
}

export default Card;