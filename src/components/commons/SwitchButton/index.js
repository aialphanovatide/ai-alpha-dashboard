import React from "react";
import "./index.css";

const SwitchButton = (params) => {
  const { 
    isAppsSwitch,
    isActive, 
    isDisabled, 
    isLoading, 
    handleClick,
  } = params;

  return (
    <div
      className={`switch-button ${
        isActive ? (isAppsSwitch ? "apps-active" : "active") : ""
      } ${isDisabled ? "disabled" : ""}`}
      onClick={isDisabled ? () => {} : handleClick}
    >
      <div className={`toggle ${isActive ? "on" : "off"}`}></div>
      {isLoading && !isActive && <div className="loading-spinner"></div>}
    </div>
  );
};

export default SwitchButton;
