import React from 'react'
import './index.css'

const SpinnerComponent = ({ style }) => {
  return (
    <div className="spinner-container" style={style}>
      <div className="spinner-border"></div>
    </div>
  );
};

export default SpinnerComponent