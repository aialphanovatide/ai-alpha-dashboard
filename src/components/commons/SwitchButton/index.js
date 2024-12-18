import React from "react";
import "./index.css";

const SwitchButton = (params) => {
  const { 
    isActive, 
    isDisabled, 
    isLoading, 
    handleClick,
    styles
  } = params;

  return (
    <div
      className={`switch-button ${
        isActive ? "active" : ""
      } ${isDisabled ? "disabled" : ""}`}
      onClick={isDisabled ? () => {} : handleClick}
      style={styles}
    >
      <div className={`toggle ${isActive ? "on" : "off"}`}></div>
      {isLoading && !isActive && <div className="loading-spinner"></div>}
    </div>
  );
};

export default SwitchButton;
