import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRecipe, getDiets, getRecipes } from '../../actions/actions';
import backArrow from '../../assets/back-arrow.svg'
import { formDiv, formContainer, backBtn, title, subtitle, form, obligatory, category, error, dietContainer, item, deleteBtn, submitBtn, submitBtnDISABLED } from './CreateRecipe.module.css'

// eslint-disable-next-line no-useless-escape
const imgRegexp = new RegExp('^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$')
const isBlankSpace = new RegExp("^\\s+$")

// cb
function validateText ({ name, summary, healthScore, image }, existingNames) {
  const err = {}

  if (!name) err.name = 'Write the name'
  else if (isBlankSpace.test(name)) err.name = "Shouldn't be a blank space"
  else if (name.trim().length > 50) err.name = `Maximum number of characters: 50 (${name.trim().length}/50)`
  else if (existingNames[name.trim().toLowerCase()]) err.name = `The recipe ${name} already exists.`
  
  if (!summary) err.summary = 'Write the summary'
  else if (isBlankSpace.test(summary)) err.summary = "Shouldn't be a blank space"
  else if (summary.trim().length < 10) err.summary = `Minimum number of characters: 10 (${summary.trim().length}/10)`

  // optionals
  if (healthScore && (healthScore > 100 || healthScore < 0)) err.healthScore = 'Should be a number between 0 and 100'
  else if (healthScore && isNaN(healthScore)) err.healthScore = 'Should be a number'

  if (image && !imgRegexp.test(image.trim())) err.image = 'Should be a valid URL'
  
  return err
}

// component
function CreateRecipe () {
  //me traigo las recipes para ver si el name ingresado del usuario ya existe. guardo todos los names en minús en un obj
  const allRecipes = useSelector(state => state.allRecipes)
  const existingNames = {}
  for (const recipe of allRecipes) existingNames[recipe.name.toLowerCase()] = true

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const diets = useSelector(state => state.diets)
  const [selectedDiet, setSelectedDiet] = useState([])
  const [err, setErr] = useState({})
  const [input, setInput] = useState({
    name: '',
    summary: '',
    healthScore: '',
    instructions: '',
    image: '',
    diets: []
  })
  
  const handleGoBack = () => navigate(-1)

  const handleChange = (e) => {
    setInput({...input, [e.target.name]: e.target.value})
    setErr(validateText({...input, [e.target.name]: e.target.value}, existingNames))
  }

  const isButtonDisabled = () => !(input.name && input.summary) || (Object.keys(err).length)

  const handleSelectDiet = (e) => {
    if (!selectedDiet.includes(e.target.value)) setSelectedDiet([...selectedDiet, e.target.value])
  }

  const handleDeleteDiet = (e) => {
    e.preventDefault()
    setSelectedDiet(selectedDiet.filter(d => d !== e.target.value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!Object.values(input).join("")) return alert('Please complete the form')
    if (Object.keys(err).length) return alert ('Please complete the form with the correct data')

    const newRecipe = {
      name: input.name.trim(),
      summary: input.summary.trim(),
      healthScore: input.healthScore ? input.healthScore : null,
      instructions: input.instructions.trim(),
      image: input.image.trim(),
      diets: selectedDiet
    }
    // console.log('newRecipe',newRecipe);
    dispatch(createRecipe(newRecipe))
    navigate('/home')
  }

  useEffect(() => {
    dispatch(getDiets())
    // si el estado allRecipes está vacío lo lleno, sino no
    !allRecipes.length && dispatch(getRecipes()) 
  }, [dispatch, allRecipes])

  return (
    <div className={formDiv}>
      <div className={formContainer}>
        <button className={backBtn} onClick={handleGoBack}>
          <img src={backArrow} alt='Go back' />
        </button>

        <h1 className={title}>Complete the form and submit your own recipe</h1>
        <h5 className={subtitle}>Fields with <span className={obligatory}>*</span> are required</h5>

        <form className={form} onSubmit={handleSubmit}>
          <label className={category}>Name <span className={obligatory}>*</span></label>
          <input value={input.name} name='name' onChange={handleChange} type='text' placeholder='Name' />
          {err.name && <p className={error}>{err.name}</p>}
          
          <label className={category}>Summary <span className={obligatory}>*</span></label>
          <textarea value={input.summary} name='summary' onChange={handleChange} placeholder='Summary' />
          {err.summary && <p className={error}>{err.summary}</p>}
          
          <label className={category}>Health Score</label>
          <input value={input.healthScore} name='healthScore' onChange={handleChange} type='text' placeholder='Health Score (0 - 100%)' />
          {err.healthScore && <p className={error}>{err.healthScore}</p>}
          
          <label className={category}>Instructions</label>
          <textarea value={input.instructions} name='instructions' onChange={handleChange} placeholder='Instructions' />
          
          <label className={category}>Image</label>
          <input value={input.image} name='image' onChange={handleChange} type='text' placeholder='Image URL' />
          {err.image && <p className={error}>{err.image}</p>}
          
          <label className={category}>Diet</label>
          <select onChange={handleSelectDiet} defaultValue='DEFAULT'>
            <option value="DEFAULT" disabled>--select type of diet--</option>
            {diets.map(diet => <option value={diet.name} key={diet.id}>{diet.name}</option>)}
          </select>
          <ul className={dietContainer}>
            {selectedDiet.map((diet,id) => 
              <li className={item} key={id}>
                {diet}
                <button className={deleteBtn} value={diet} onClick={handleDeleteDiet}>X</button>
              </li>
            )}
          </ul>
          
          <button disabled={isButtonDisabled()} className={isButtonDisabled() ? submitBtnDISABLED : submitBtn} type='submit'>Submit recipe</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipe;