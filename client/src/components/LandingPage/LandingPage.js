import React from "react";
import { useNavigate } from "react-router-dom";
import svg from '../../assets/utensils.svg'
import { landingPage, goHomeBtn, img } from "./LandingPage.module.css";

function LandingPage() {
  const navigate = useNavigate();
  const goHome = () => navigate("/home");

  return (
    <div className={landingPage}>
      <button className={goHomeBtn} onClick={goHome}>
        Start
        <img className={img} src={svg} alt='' />
      </button>
    </div>
  );
}

export default LandingPage;
