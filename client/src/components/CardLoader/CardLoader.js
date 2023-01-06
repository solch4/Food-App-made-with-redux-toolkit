import React from 'react';
import { container, card, img, body, title, diet } from './CardLoader.module.css'

function CardLoader() {
  const nOfCards = 9;
  const arrWithAmountOfCards = [];
  for (let i = 1; i <= nOfCards; i++) arrWithAmountOfCards.push(i);

  return (
    <div className={container}>
      {arrWithAmountOfCards.map((e) => (
        <div className={card} key={e}>
          <div className={img}></div>
          <div className={body}>
            <div className={title}></div>
            <div className={diet}></div>
            <div className={diet}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardLoader;
