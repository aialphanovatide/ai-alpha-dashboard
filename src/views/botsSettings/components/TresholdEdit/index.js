import { cilPencil } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React from "react";
import styles from "./index.module.css";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
const MAX = 100;
const MIN = 0;

const PercentageSlider = styled(Slider)(({
  color: "gray",
  '& .MuiSlider-thumb': {
    backgroundColor: '#FF6C0D',
  },
  '& .MuiSlider-valueLabel': {
    top: -9,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    paddingInline: 15,
    color: "black",
  },
}));

const TresholdEdit = () => {
  const [val, setVal] = React.useState(MIN);
  const handleChange = (_, newValue) => {
    setVal(newValue);
  };

  return (
    <form className={styles.tresholdContainer}>
      <h4>
        <CIcon icon={cilPencil} size="xl" /> Edit Treshold
      </h4>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 30,
        }}
      >
        <label>
          <strong>Number of articles</strong>
        </label>
        <select>
          <option value="value1">10</option>
          <option value="value2" selected>
            20
          </option>
          <option value="value3">30</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 30,
        }}
      >
        <label>
          <strong>Percentage</strong>
        </label>
        <div style={{width: "95%", alignSelf: "end"}}>
        <PercentageSlider
          step={1}
          value={val}
          valueLabelDisplay="on"
          min={MIN}
          max={MAX}
          onChange={handleChange}
          style={{marginTop: 30}}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span onClick={() => setVal(MIN)} style={{ cursor: "pointer", fontWeight: 500}}>
            {MIN} %
          </span>
          <span onClick={() => setVal(MAX)} style={{ cursor: "pointer", fontWeight: 500 }}>
            {MAX} %
          </span>
        </div>
        </div>
        <button className={styles.submitButton}>Create</button>
      </div>
    </form>
  );
};

export default TresholdEdit;



