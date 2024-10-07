import React, { useEffect } from "react";
import { preLoaderAnim } from "../../animation";
import "./preloader.css";
const Preloader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
        <span>ABSORBABLE</span>
        <span>BREATHABLE</span>
        <span>SQUEEZABLE</span>
      </div>
    </div>
  );
};

export default Preloader;
