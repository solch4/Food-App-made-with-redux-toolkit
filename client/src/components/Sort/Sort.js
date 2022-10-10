import React from 'react';
import { useDispatch } from 'react-redux';
import { setActualPage, setMaxPageNumber, setMinPageNumber, sortByHealthScore, sortByName } from '../../actions/actions';
import { sortContainer, title } from './Sort.module.css'

function Sort({ setSort }) {
  const dispatch = useDispatch()
  
  const handleSort = (e) => {
    dispatch(setActualPage(1))
    dispatch(setMinPageNumber(0))
    dispatch(setMaxPageNumber(5))
    setSort(e.target.value)
    if (e.target.value === 'nameAtoZ' || e.target.value === 'nameZtoA') dispatch(sortByName(e.target.value))
    if (e.target.value === 'moreHealthy' || e.target.value === 'lessHealthy') dispatch(sortByHealthScore(e.target.value))
  }

  return (
    <div className={sortContainer}>
      <span className={title}>Sort by </span>
      <select onChange={handleSort} defaultValue='DEFAULT'>
        <option value='DEFAULT' disabled>--select sort--</option>
        <option value='nameAtoZ'>Name (A-Z)</option>
        <option value='nameZtoA'>Name (Z-A)</option>
        <option value='moreHealthy'>More healthy</option>
        <option value='lessHealthy'>Less healthy</option>
      </select>
    </div>
  );
}

export default Sort;