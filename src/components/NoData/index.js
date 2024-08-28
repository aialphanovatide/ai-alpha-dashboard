import React from "react";
import styles from "./index.module.css";
import warnImg from "../../assets/images/exclamation.png";

const NoData = ({ width = "100%", height = "100%" }) => {
  return (
    <div className={styles.container} style={{ width, height }}>
      <img src={warnImg} className="waring-sign-png" />
      <h2>No data found!</h2>
    </div>
  );
};

export default NoData;
