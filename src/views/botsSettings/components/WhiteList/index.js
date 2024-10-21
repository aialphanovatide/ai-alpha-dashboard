import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { cilMinus, cilPlus, cilSave, cilSearch, cilX } from "@coreui/icons";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import config from "src/config";
import { getBot } from "src/services/botService";
import Swal from "sweetalert2";
import { addKeywords } from "src/services/keywordService";
import SpinnerComponent from "src/components/Spinner";

const WhiteList = ({ coins, isRemove }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [whitelistKeywords, setWhitelistKeywords] = useState([]);
  const [blacklistKeywords, setBlacklistKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [botsIDs, setBotsIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addKeywords("keywords", keywords, botsIDs);
    if (response.success) {
      Swal.fire({ text: "Keywords updated successfully", icon: "success" });
    } else {
      Swal.fire({ text: response.error, icon: "error" });
    }
    setKeywords([]);
  };

  const validateKeyword = (keyword) => {
    if (keyword === "") {
      return "Please enter a keyword.";
    }
    if (whitelistKeywords.includes(keyword.toLowerCase())) {
      return "Keyword already exists.";
    }
    if (blacklistKeywords.includes(keyword.toLowerCase())) {
      return "Keyword is on the blacklist.";
    }
    return null;
  };

  const addKeyword = (e) => {
    e.preventDefault();
    const error = validateKeyword(keyword);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setKeywords([...keywords, keyword]);
    setKeyword("");
    setErrorMessage(null);
  };

  const removeKeyword = (e, index) => {
    e.preventDefault();
    setKeywords((prevKeywords) =>
      prevKeywords.filter((keyword, i) => i !== index),
    );
  };

  const storeKeywords = async (coins) => {
    for (const coin of coins) {
      await processCoinKeywords(coin);
    }
  };

  const processCoinKeywords = async (coin) => {
    const response = await getBot(coin.name, "name");
    if (response.success) {
      const bot = response.data;
      setBotsIDs((prevBotsIDs) => [...prevBotsIDs, bot.id]);
      updateKeywords(bot.keywords, setWhitelistKeywords, whitelistKeywords);
      updateKeywords(bot.blacklist, setBlacklistKeywords, blacklistKeywords);
    } else {
      Swal.fire({ text: response.error, icon: "error" });
    }
  };

  const updateKeywords = (keywords, setKeywords, currentKeywords) => {
    keywords.forEach((keyword) => {
      if (!currentKeywords.includes(keyword)) {
        setKeywords([...currentKeywords, keyword.toLowerCase()]);
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    storeKeywords(coins);
    setIsLoading(false);
  }, [coins]);

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.keywordsText}>Keywords</span>
        <h4 className={styles.title}>
          <OpenLock /> Whitelist
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
        {isLoading ? (
          <SpinnerComponent />
        ) : (
          <>
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
                  <input
                    placeholder={
                      isRemove ? "" : "Apple, Communication, Notebook..."
                    }
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  {isRemove ? (
                    <button style={{ textAlign: "right" }}>
                      <CIcon icon={cilSearch} />
                    </button>
                  ) : (
                    <button onClick={addKeyword}>
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
                          <button onClick={(e) => removeKeyword(e, index)}>
                            <CIcon icon={cilX} />
                          </button>
                        </div>
                      ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={keywords.length < 1}>
                <CIcon icon={cilSave} size="xxl" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WhiteList;
