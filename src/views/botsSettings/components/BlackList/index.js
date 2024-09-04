import React, { useState } from "react";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import { cilMinus, cilPlus, cilSave, cilSearch, cilX } from "@coreui/icons";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const BlackList = ({ isRemove }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [keywords, setKeywords] = useState([
    "Apple",
    "Communication",
    "Apple",
    "Communication",
    "Apple",
    "Communication",
  ]);

  const handleRemoveKeyword = (e, index) => {
    e.preventDefault();
    setKeywords((prevKeywords) =>
      prevKeywords.filter((keyword, i) => i !== index),
    );
  };

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.keywordsText}>Keywords</span>
        <h4 className={styles.title}>
          <ClosedLock /> BlackList
        </h4>
        {isRemove ? (
          <span className={styles.organgeText}>
            <CIcon icon={cilMinus} /> Remove
          </span>
        ) : (
          <span className={styles.organgeText}>
            <CIcon icon={cilPlus} /> Add
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
        <span
          className={styles.errorMessage}
          style={{ visibility: errorMessage ? "visible" : "hidden" }}
        >
          <NotInterestedIcon />
          {errorMessage}
        </span>
        <form className={styles.formContainer}>
          <div className={styles.keyWordSearch}>
            <div className={styles.keywordInput}>
            <input placeholder={isRemove? "" : "Apple, Communication, Notebook..."} />
              {isRemove ? (
                <button style={{ textAlign: "right" }}>
                  <CIcon icon={cilSearch} />
                </button>
              ) : (
                <button>
                  <CIcon icon={cilPlus} /> Add
                </button>
              )}
            </div>
            <span className={styles.disclaimer}>
              All Keywords will be added to the selected coins
            </span>
            <div className={styles.keyWordsContainer}>
              {isRemove
                ? keywords.map((keyword, index) => (
                    <div className={styles.keyword} key={index}>
                      <input type="checkbox" />
                      <span>{keyword}</span>
                    </div>
                  ))
                : keywords.map((keyword, index) => (
                    <div className={styles.keyword} key={index}>
                      <span>{keyword}</span>
                      <button onClick={(e) => handleRemoveKeyword(e, index)}>
                        <CIcon icon={cilX} />
                      </button>
                    </div>
                  ))}
            </div>
          </div>
          <button>
            <CIcon icon={cilSave} size="xxl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlackList;
