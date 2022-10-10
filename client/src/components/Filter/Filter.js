import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterByDiet, setActualPage, setMaxPageNumber, setMinPageNumber } from '../../actions/actions';
import { filterContainer, title } from './Filter.module.css'

function Filter() {
  const dispatch = useDispatch()
  const diets = useSelector(state => state.diets)

  const handleFilterByDiet = (e) => {
    dispatch(setActualPage(1))
    dispatch(setMinPageNumber(0))
    dispatch(setMaxPageNumber(5))
    dispatch(filterByDiet(e.target.value))
  }

  return (
    <div className={filterContainer}>
      <span className={title}>Filter by </span>
      <select onChange={handleFilterByDiet} defaultValue='DEFAULT'>
        <option value='DEFAULT' disabled>--select diet--</option>
        <option value='all'>All diets</option>
        {diets.length && diets.map(diet => 
          <option value={diet.name} key={diet.id}>{diet.name}</option>
        )}
      </select>
    </div>
  );
}

export default Filter;