import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDietsAsync } from "../features/diets/dietsActions";

export const useDiets = () => {
  const dispatch = useDispatch();
  const { diets } = useSelector((state) => state.diets);

  useEffect(() => {
    // si el estado diets está vacío lo lleno, sino no
    !diets.length && dispatch(getDietsAsync());
  }, [dispatch, diets]);

  return { diets };
};
