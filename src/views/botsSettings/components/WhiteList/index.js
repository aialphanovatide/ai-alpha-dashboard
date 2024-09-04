import React, { useState } from "react";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { cilPlus, cilSave, cilX } from "@coreui/icons";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const WhiteList = ({isRemove}) => {
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
          <OpenLock /> Whitelist
        </h4>
        <span className={styles.organgeText}>
          <CIcon icon={cilPlus} /> Add
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
        <span className={styles.errorMessage}>
          <NotInterestedIcon />
          This keyword is on the Blacklist
        </span>
        <form className={styles.formContainer}>
          <div className={styles.keyWordSearch}>
            <div className={styles.keywordInput}>
              <input placeholder="Apple, Communication, Notebook..."/>
              <button>
                <CIcon icon={cilPlus} /> Add
              </button>
            </div>
            <span className={styles.disclaimer}>
              All Keywords will be added to the selected coins
            </span>
            <div className={styles.keyWordsContainer}>
              {keywords.map((keyword, index) => (
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

export default WhiteList;
