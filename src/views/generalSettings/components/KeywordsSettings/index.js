import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import { cilMinus, cilPlus, cilSave, cilSearch, cilX } from "@coreui/icons";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { getBot } from "src/services/botService";
import Swal from "sweetalert2";
import { addKeywords, deleteKeywords } from "src/services/keywordService";
import SpinnerComponent from "src/components/Spinner";

const KeywordsSettings = ({ coins, isRemove, isBlacklist }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [whitelistKeywords, setWhitelistKeywords] = useState([]);
  const [blacklistKeywords, setBlacklistKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [botsIDs, setBotsIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const keywordsType = isBlacklist ? "blacklist" : "keywords";
    const response = isRemove
      ? await deleteKeywords(keywordsType, keywords, botsIDs)
      : await addKeywords(keywordsType, keywords, botsIDs);

    if (response.success) {
      Swal.fire({
        text: `${isBlacklist ? 'Blacklist' : 'Whitelist'} updated successfully`,
        icon: "success",
        customClass: "swal",
        backdrop: false,
      });

      if (isRemove) {
        if (isBlacklist) {
          setBlacklistKeywords(
            blacklistKeywords.filter((kw) => !keywords.includes(kw)),
          );
        } else {
          setWhitelistKeywords(
            whitelistKeywords.filter((kw) => !keywords.includes(kw)),
          );
        }
      }
    } else {
      Swal.fire({ text: response.error, icon: "error", customClass: "swal", backdrop: false });
    }
    setErrorMessage(null);
    setKeywords([]);
    setIsLoading(false);
  };

  const validateKeyword = (keyword) => {
    if (keywords.includes(keyword))
      return `"${keyword}" keyword already exists.`;
    if (!isRemove) keyword = keyword.toLowerCase();
    if (
      (isBlacklist && blacklistKeywords.includes(keyword)) ||
      (!isBlacklist && whitelistKeywords.includes(keyword))
    ) {
      return `"${keyword}" keyword already exists.`;
    } else if (
      (!isBlacklist && blacklistKeywords.includes(keyword)) ||
      (isBlacklist && whitelistKeywords.includes(keyword))
    ) {
      return `"${keyword}" keyword is on the ${
        isBlacklist ? "whitelist" : "blacklist"
      }.`;
    } else if (!/[a-zA-Z0-9]/.test(keyword)) {
      return `"${keyword}" keyword must contain at least one letter or number.`;
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
    setKeywords((prevKeywords) => [...prevKeywords, ...newKeywords]);
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
      Swal.fire({ text: response.error, icon: "error", customClass: "swal", backdrop: false });
    }
    setIsLoading(false);
  };

  const updateKeywords = (keywords, setKeywords, currentKeywords) => {
    keywords.forEach((keyword) => {
      if (!isRemove) keyword = keyword.toLowerCase();
      if (!currentKeywords.includes(keyword)) {
        setKeywords((prevKeywords) => [...prevKeywords, keyword]);
      }
    });
  };

  const getCommonKeywords = (allKeywords) => {
    const keywordCounts = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {});
    const commonKeywords = Object.keys(keywordCounts).filter(
      (kw) => keywordCounts[kw] === coins.length,
    );
    return commonKeywords;
  };

  const onKeywordChange = (keyword) => {
    if (keywords.includes(keyword)) {
      setKeywords(keywords.filter((kw) => kw !== keyword));
    } else {
      setKeywords((prev) => [...prev, keyword]);
    }
  };

  useEffect(() => {
    storeKeywords(coins);
  }, [coins]);

  const filteredKeywords = (keywordsList) => {
    const filteredKws = keywordsList.filter(
      (kw) =>
        kw.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        !keywords.includes(kw),
    );
    keywordsList = keywordsList.filter((kw) => !keywords.includes(kw));
    let result = searchTerm.trim() === "" ? keywordsList : filteredKws;
    return keywords.sort().concat(result);
  };

  const filteredKeywordsList = isRemove
    ? isBlacklist
      ? filteredKeywords(getCommonKeywords(blacklistKeywords))
      : filteredKeywords(getCommonKeywords(whitelistKeywords))
    : keywords;

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
                    value={isRemove ? searchTerm : keyword}
                    onChange={(e) => isRemove ? setSearchTerm(e.target.value) : setKeyword(e.target.value)}
                  />
                  {isRemove ? (
                    <button style={{ textAlign: "right" }}>
                      <CIcon icon={cilSearch} />
                    </button>
                  ) : (
                    <button onClick={addKeyword} disabled={!keyword}>
                      <CIcon icon={cilPlus} /> Add
                    </button>
                  )}
                </div>
                <span className={styles.disclaimer}>
                  {isRemove
                    ? "All Keywords will be removed from the selected coins."
                    : "All Keywords will be added to the selected coins"}
                </span>
                <div className={styles.keyWordsContainer} id="keywordsSettings-keywordsContainer">
                  {filteredKeywordsList?.map((keyword, index) => (
                    <div
                      className={styles.keyword}
                      key={index}
                      id="keyword-tag"
                      style={!keywords.includes(keyword) ? {background: '#d9d9d9'} : {}}
                    >
                      <input
                        type="checkbox"
                        onChange={() => onKeywordChange(keyword)}
                        checked={keywords.includes(keyword)}
                      />
                      <span>{keyword}</span>
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
