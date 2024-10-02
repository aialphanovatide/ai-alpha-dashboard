import { cilPencil } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useState } from "react";
import styles from "./index.module.css";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const MAX = 100;
const MIN = 0;

const PercentageSlider = styled(Slider)({
  color: "gray",
  "& .MuiSlider-thumb": {
    backgroundColor: "#FF6C0D",
  },
  "& .MuiSlider-valueLabel": {
    top: -9,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    paddingInline: 15,
    color: "black",
  },
});

const TresholdEdit = () => {
  const [val, setVal] = useState(MIN);
  const [articles, setArticles] = useState(20); // default selected value
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (_, newValue) => {
    setVal(newValue);
  };

  const handleArticlesChange = (event) => {
    setArticles(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = {
      articles: articles,
      percentage: val,
    };

    try {
      const response = await fetch("YOUR_API_ENDPOINT_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);
      // Handle success (you can reset form, display a success message, etc.)
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.tresholdContainer} onSubmit={handleSubmit}>
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
        {/* <select value={articles} onChange={handleArticlesChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select> */}
        <input
          type="number"
          defaultValue={articles}
          id="frequency"
          onChange={handleArticlesChange}
          className={styles.frequencyInput}
        />
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
        <div style={{ width: "95%", alignSelf: "end" }}>
          <PercentageSlider
            step={1}
            value={val}
            valueLabelDisplay="on"
            min={MIN}
            max={MAX}
            onChange={handleChange}
            style={{ marginTop: 30 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              onClick={() => setVal(MIN)}
              style={{ cursor: "pointer", fontWeight: 500 }}
            >
              {MIN} %
            </span>
            <span
              onClick={() => setVal(MAX)}
              style={{ cursor: "pointer", fontWeight: 500 }}
            >
              {MAX} %
            </span>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default TresholdEdit;
