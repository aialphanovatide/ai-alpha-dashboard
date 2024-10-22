import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import { cilMinus, cilPlus, cilSave, cilSearch, cilX } from "@coreui/icons";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { getBot } from "src/services/botService";
import Swal from "sweetalert2";
import { addKeywords } from "src/services/keywordService";
import SpinnerComponent from "src/components/Spinner";
import { capitalizeFirstLetter } from "src/utils";
import { setLayerDimensions } from "pdfjs-dist";

const KeywordsSettings = ({ coins, isRemove, isBlacklist }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [whitelistKeywords, setWhitelistKeywords] = useState([]);
  const [blacklistKeywords, setBlacklistKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [botsIDs, setBotsIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const keywordsType = isBlacklist ? "blacklist" : "keywords";
    const response = await addKeywords(keywordsType, keywords, botsIDs);
    if (response.success) {
      Swal.fire({
        text: "Keywords updated successfully",
        icon: "success",
        customClass: "swal",
      });
    } else {
      Swal.fire({ text: response.error, icon: "error", customClass: "swal" });
    }
    setKeywords([]);
    setIsLoading(false);
  };

  const validateKeyword = (keyword) => {
    keyword = keyword.toLowerCase();
    if (keyword === "") {
      return "Please enter a keyword.";
    } else if (
      (isBlacklist && blacklistKeywords.includes(keyword)) ||
      (!isBlacklist && whitelistKeywords.includes(keyword))
    ) {
      return `"${capitalizeFirstLetter(keyword)}" keyword already exists.`;
    } else if (
      (!isBlacklist && blacklistKeywords.includes(keyword)) ||
      (isBlacklist && whitelistKeywords.includes(keyword))
    ) {
      return `"${capitalizeFirstLetter(keyword)}" keyword is on the blacklist.`;
    }
    return null;
  };

  const addKeyword = (e) => {
    e.preventDefault();
    const newKeywords = keyword.split(",").map((kw) => kw.trim());
    let error = null;
    for (const kw of newKeywords) {
      error = validateKeyword(kw);
      if (error) {
        setErrorMessage(error);
        return;
      }
    }
    if (error) return;
    setKeywords([...keywords, ...newKeywords]);
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
    setIsLoading(true);
    for (const coin of coins) {
      await processCoinKeywords(coin);
    }
    setIsLoading(false);
  };

  const processCoinKeywords = async (coin) => {
    setIsLoading(true);
    const response = await getBot(coin.name, "name");
    if (response.success) {
      const bot = response.data;
      if (!botsIDs.includes(bot.id)) {
        setBotsIDs((prevBotsIDs) => [...prevBotsIDs, bot.id]);
      }
      updateKeywords(bot.keywords, setWhitelistKeywords, whitelistKeywords);
      updateKeywords(bot.blacklist, setBlacklistKeywords, blacklistKeywords);
    } else {
      Swal.fire({ text: response.error, icon: "error", customClass: "swal" });
    }
    setIsLoading(false);
  };

  const updateKeywords = (keywords, setKeywords, currentKeywords) => {
    keywords.forEach((keyword) => {
      if (!currentKeywords.includes(keyword)) {
        setKeywords([...currentKeywords, keyword.toLowerCase()]);
      }
    });
  };

  useEffect(() => {
    storeKeywords(coins);
  }, [coins]);

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.keywordsText}>Keywords</span>
        <h4 className={styles.title}>
          {isBlacklist ? (
            <>
              <ClosedLock /> BlackList
            </>
          ) : (
            <>
              <OpenLock /> Whitelist
            </>
          )}
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
              <NotInterestedIcon style={{ fill: "red" }} />
              {errorMessage}
            </span>
            <form className={styles.formContainer}>
              <div className={styles.keyWordSearch}>
                <div className={styles.keywordInput} id="customInput">
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
                  {isRemove
                    ? "All Keywords will be removed from the selected coins."
                    : "All Keywords will be added to the selected coins"}
                </span>
                <div className={styles.keyWordsContainer}>
                  {keywords.map((keyword, index) => (
                    <div
                      className={styles.keyword}
                      key={index}
                      id="keyword-tag"
                    >
                      {isRemove ? (
                        <>
                          <input type="checkbox" />
                          <span>{keyword}</span>
                        </>
                      ) : (
                        <>
                          <span>{keyword}</span>
                          <button onClick={(e) => removeKeyword(e, index)}>
                            <CIcon icon={cilX} />
                          </button>
                        </>
                      )}
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

export default KeywordsSettings;
