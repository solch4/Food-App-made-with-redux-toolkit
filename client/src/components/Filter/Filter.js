import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterByDiet } from '../../features/recipes/recipesSlice';
import { setActualPage, setMaxPageNumber, setMinPageNumber } from '../../features/pagination/paginationSlice';
import { setFilterSelectValue } from '../../features/ux/uxSlice';
import { useDiets } from '../../hooks';
import { filterContainer, title } from './Filter.module.css'

function Filter() {
  const dispatch = useDispatch()
  const { diets } = useDiets();
  const { filterSelectValue } = useSelector(state => state.ux)

  const handleFilterByDiet = (e) => {
    dispatch(setFilterSelectValue(e.target.value))
    dispatch(setActualPage(1))
    dispatch(setMinPageNumber(0))
    dispatch(setMaxPageNumber(5))
    dispatch(filterByDiet(e.target.value))
  }

  return (
    <div className={filterContainer}>
      <span className={title}>Filter by </span>
      <select onChange={handleFilterByDiet} value={filterSelectValue}>
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