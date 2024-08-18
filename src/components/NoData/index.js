import React from "react";
import "./index.css";
import warnImg from "../../assets/images/exclamation.png";

const NoData = ({ width, height }) => {
  return (
    <div className="container" style={{ width, height }}>
      <img src={warnImg} className="waring-sign-png" />
      <h2>No data found!</h2>
    </div>
  );
};

export default NoData;
