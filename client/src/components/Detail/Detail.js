import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearDetail, deleteRecipe, getDetail } from '../../actions/actions';
import backArrow from '../../assets/back-arrow.svg'
import Detail404 from '../Detail404/Detail404';
import { detailDiv, container, backBtn, body, img, title, category, subtitle, deleteEditBtnsContainer, deleteBtn, editBtn, p, imgFavBtnContainer, favBtn } from './Detail.module.css'

//la info proveniente de la api y de la db son tipos de datos distintos, x eso antes de renderizar algunas cosas pregunto si es createdInDB
function Detail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const detail = useSelector(state => state.detail)
  const { image, name, diets, healthScore, summary, instructions, dishTypes, createdInDB } = detail
  const [isFavorite, setIsFavorite] = useState(JSON.parse(localStorage.getItem('IDs'))?.includes(detail.id))
  
  const handleGoBack = () => navigate(-1)

  const handleDeleteRecipe = () => {
    if (!window.confirm(`Are you sure you want to delete the ${name} recipe? \nYou won't be able to revert this.`)) return
    dispatch(deleteRecipe(id))
    navigate(-1)
  }

  const handleEditRecipe = () => navigate(`/home/${id}/edit`)

  const handleFavorite = () => {
    const hasSomething = JSON.parse(localStorage.getItem('favorites'))
    const IDs = JSON.parse(localStorage.getItem('IDs'))

    //si no tengo nada en fav => lo añado x 1ra vez
    if (!hasSomething) {
      localStorage.setItem('favorites', JSON.stringify([detail]));
      localStorage.setItem('IDs', JSON.stringify([detail.id]));
      setIsFavorite(true)
      alert(`${name} added to favorites.`)
    }
    //si ya tengo algo en fav
    else {
      const favExists = hasSomething.filter(fav => fav.id === detail.id)
      //si NO ESTÁ esta recipe en fav => la agrego
      if (!favExists.length) {
        localStorage.setItem('favorites', JSON.stringify([...hasSomething, detail]));
        localStorage.setItem('IDs', JSON.stringify([...IDs, detail.id]));
        setIsFavorite(true)
        alert(`${name} added to favorites.`)
      } 
      //si SÍ ESTÁ en fav => la elimino
      else {
        const keepFav = hasSomething.filter(fav => fav.id !== detail.id)
        localStorage.setItem('favorites', JSON.stringify(keepFav));
        const keepID = IDs.filter(favID => favID !== detail.id)
        localStorage.setItem('IDs', JSON.stringify(keepID));
        setIsFavorite(false)
        alert(`${name} deleted from favorites.`)
      }
    }
  }

  //component did mount/update
  useEffect(() => {
    dispatch(getDetail(id))
    setIsFavorite(JSON.parse(localStorage.getItem('IDs'))?.includes(detail.id))
  }, [dispatch, id, detail.id])

  //component will unmount
  useEffect(() => {
    return () => dispatch(clearDetail())
  }, [dispatch])

  return (
    <div className={detailDiv}>
      <div className={container}>
        <button className={backBtn} onClick={handleGoBack}>
          <img src={backArrow} alt='Go back' />
        </button>
        {Object.keys(detail).length && typeof detail !== 'string' ? (
          <div className={body}>

            <div className={imgFavBtnContainer}>
              <img className={img} src={image} alt={image} />
              <button className={favBtn} onClick={handleFavorite}>
                <svg fill={isFavorite ? '#E53A27' : '#C5AAA9'} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
              </button>
            </div>

            <h1 className={title}>{name}</h1>
            {healthScore && <h4>Health score: {healthScore}%</h4>}

            {(!createdInDB && !!diets.length) && <p className={p}><span className={category}>Diets: </span>{diets}</p>}
            {(createdInDB && !!diets.length) && <p className={p}><span className={category}>Diets: </span>{diets.map(d => Object.values(d)).join(', ')}</p>}

            {dishTypes && <p><span className={category}>Dish type: </span>{dishTypes}</p>}

            <h2 className={subtitle}>Summary</h2>
            <p className={p}>{summary?.replace(/<[^>]*>/g, '')}</p> {/* replace para eliminar las etiquetas fieras q me trae la api */}

            {instructions && <h2 className={subtitle}>Instructions</h2>}
            {createdInDB 
              ? <p className={p}>{instructions}</p>
              : instructions?.map((inst, n) => <p  className={p} key={n}><span className={category}>Step {n+1}: </span>{inst}</p>)}
            
            {createdInDB &&
              <div className={deleteEditBtnsContainer}>
                <button className={deleteBtn} onClick={handleDeleteRecipe}>Delete</button>
                <button className={editBtn} onClick={handleEditRecipe}>Edit</button>
              </div>}
          </div>
        ) : (
          Array.isArray(detail)
            ? <h3>Loading...</h3>
            : <Detail404 />
        )}
      </div>
    </div>
  );
}

export default Detail;