import {
  cilDataTransferDown,
  cilFile,
  cilPen,
  cilPlus,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import CustomTooltip from "src/components/CustomTooltip";
import Swal from "sweetalert2";
import { getCategories, getCategory } from "src/services/categoryService";
import { createBot, editBot, getBot } from "src/services/botService";
import { createCoin, editCoin } from "src/services/coinService";
import { extractKeywords } from "src/services/keywordService";
import SpinnerComponent from "src/components/Spinner";
import defaultImg from "../../../../assets/brand/logo.png";

const BotForm = ({ coin, setCategories }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectCategories, setSelectCategories] = useState([]);
  const [newsBotsCategories, setNewsBotsCategories] = useState([]);
  const [isWhitelistFileUploading, setWhitelistFileUploading] = useState(false);
  const [isBlacklistFileUploading, setBlacklistFileUploading] = useState(false);
  const keyWordInputRef = React.createRef();
  const [blacklist, setBlacklist] = useState([]);
  const [blacklistKeyword, setBlacklistKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [whitelistKeyword, setWhitelistKeyword] = useState("");
  const [bot, setBot] = useState(null);
  const [formData, setFormData] = useState({
    name: coin && coin.name ? coin.name : "",
    alias: coin && coin.alias ? coin.alias : "",
    symbol: coin && coin.symbol ? coin.symbol : "",
    category_id: coin && coin.category_id ? coin.category_id : "",
    background_color:
      coin && coin.background_color ? coin.background_color : "",
    icon: null,
    iconPreview: coin?.icon || null,
    bot_category_id: null,
    dalle_prompt: "",
    prompt: "",
    run_frequency: 20,
    // url: "",
  });

  const onFileUpload = async (event, isBlacklist) => {
    const setFileUploading = isBlacklist
      ? setBlacklistFileUploading
      : setWhitelistFileUploading;
    setFileUploading(true);

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);

    const response = await extractKeywords(formData, isBlacklist);

    if (response.success) {
      if (isBlacklist) {
        setBlacklist((prev) => [...prev, ...response.data]);
      } else {
        setKeywords((prev) => [...prev, ...response.data]);
      }
    } else {
      Swal.fire({
        text: response.error || "Error extracting keywords",
        icon: "error",
        customClass: "swal",
      });
    }

    document.querySelector('input[accept=".xls,.xlsx"]').value = "";
    setFileUploading(false);
  };

  useEffect(() => {
    if (coin) {
      fetchBot(coin.name);
    }
  }, [coin]);

  const fetchBot = async (name) => {
    try {
      setIsLoading(true);
      const response = await getBot(name, "name");

      if (!response.success) {
        throw new Error(response.error);
      }

      setBot(response.data);
      setBlacklist([...response.data.blacklist]);
      setKeywords([...response.data.keywords]);
      setFormData((prev) => ({
        ...prev,
        bot_category_id: response.data.category_id,
        dalle_prompt: response.data.dalle_prompt,
        prompt: response.data.prompt,
        run_frequency: response.data.run_frequency,
        iconPreview: formData.iconPreview
          ? formData.iconPreview
          : response.data.icon
            ? response.data.icon
            : `https://aialphaicons.s3.us-east-2.amazonaws.com/coins/${coin.name?.toLowerCase()}.png`,
      }));
    } catch (err) {
      Swal.fire({
        text: err.message || "Error fetching bot",
        icon: "error",
        customClass: "swal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      const newsBotsCategories = await getCategories(true);
      setSelectCategories(categories);
      setNewsBotsCategories(newsBotsCategories);
    } catch (err) {
      Swal.fire({
        text: err.message || "Error fetching categories",
        icon: "error",
        customClass: "swal",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setSelectCategories, setNewsBotsCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const isFormValid = useMemo(
    () =>
      formData.name &&
      formData.alias &&
      formData.category_id &&
      formData.symbol &&
      formData.bot_category_id,
    [
      formData.name,
      formData.alias,
      formData.category_id,
      formData.symbol,
      formData.bot_category_id,
    ],
  );

  const validateKeyword = (keyword, isBlacklist = false) => {
    if (isBlacklist) {
      if (blacklist.includes(keyword)) {
        Swal.fire({
          text: "Keyword already added",
          icon: "error",
          customClass: "swal",
        });
        return false;
      } else if (keywords.includes(keyword)) {
        Swal.fire({
          text: "Keyword already added to whitelist",
          icon: "error",
          customClass: "swal",
        });
        return false;
      }
      return true;
    } else {
      if (keywords.includes(keyword)) {
        Swal.fire({
          text: "Keyword already added",
          icon: "error",
          customClass: "swal",
        });
        return false;
      } else if (blacklist.includes(keyword)) {
        Swal.fire({
          text: "Keyword already added to blacklist",
          icon: "error",
          customClass: "swal",
        });
        return false;
      }
      return true;
    }
  };

  const addKeyword = (e, isBlacklist = false) => {
    e.preventDefault();
    const keyword = isBlacklist ? blacklistKeyword : whitelistKeyword;

    if (validateKeyword(keyword, isBlacklist)) {
      if (isBlacklist) {
        setBlacklist((prev) => [...prev, keyword]);
        setBlacklistKeyword("");
      } else {
        setKeywords((prev) => [...prev, keyword]);
        setWhitelistKeyword("");
      }
    }
  };

  const removeKeyword = (e, keywordToRemove, isBlacklist) => {
    e.preventDefault();
    if (isBlacklist) {
      setBlacklist(blacklist.filter((keyword) => keyword !== keywordToRemove));
    } else {
      setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
    }
  };

  const getBotCategoryId = async (categoryName) => {
    try {
      const response = await getCategory(categoryName, true);
      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          bot_category_id: response.data.category.id,
        }));
      }
    } catch (error) {
      Swal.fire({
        text: error.message || "Error fetching bot category",
        icon: "error",
        customClass: "swal",
      });
    }
  };

  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    const newData = { ...formData };

    if (e.target.name === "category_id") {
      let selectedCategoryName = e.target.options[e.target.selectedIndex].text;
      let botCategoryId = getBotCategoryId(selectedCategoryName);
      newData.bot_category_id = botCategoryId;
    }

    newData[e.target.name] = e.target?.value;
    setFormData(newData);
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "image/svg+xml") {
      const previewUrl = URL.createObjectURL(file);

      setFormData({ ...formData, icon: file, iconPreview: previewUrl });
    } else {
      Swal.fire({
        text: "Please upload a valid SVG file",
        icon: "error",
        customClass: "swal",
      });
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      let formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("alias", formData.alias);
      formDataToSend.append("symbol", formData.symbol);
      formDataToSend.append("category_id", formData.category_id);

      if (formData.background_color) {
        formDataToSend.append("background_color", formData.background_color);
      }
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon, formData.icon.name);
      }

      const response = !coin
        ? await createCoin(formDataToSend)
        : await editCoin(formDataToSend, coin.bot_id);

      if (response.success) {
        let keywordsToAdd = {
          whitelist: [...keywords],
          blacklist: [...blacklist],
        };
        let formdataForBot = {
          alias: formData.alias,
          background_color: formData.background_color,
          category_id: formData.bot_category_id,
          dalle_prompt: formData.dalle_prompt,
          name: formData.name,
          prompt: formData.prompt,
          run_frequency: parseInt(formData.run_frequency),
          whitelist: keywords.join(","),
          blacklist: blacklist.join(","),
        };

        const response = !coin
          ? await createBot(formdataForBot, keywordsToAdd)
          : await editBot(formdataForBot, bot.id);

        if (response.success) {
          Swal.fire({
            text: `Coin/Bot ${coin ? "updated" : "created"} successfully!`,
            icon: "success",
            customClass: "swal",
          }).then(async () => {
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
          });

          if (!coin) {
            setFormData({
              name: "",
              alias: "",
              symbol: "",
              category_id: "",
              background_color: "",
              icon: null,
              iconPreview: null,
              bot_category_id: null,
              dalle_prompt: "",
              prompt: "",
              run_frequency: 20,
              blacklist: [],
              keywords: [],
              // url: "",
            });
            setBlacklist([]);
            setKeywords([]);
            document.querySelector('input[type="file"]').value = "";
          }
          setIsSubmitting(false);
        } else {
          Swal.fire({
            text: response.error || "Error creating bot",
            icon: "error",
            customClass: "swal",
          });
          setIsSubmitting(false);
        }
      } else {
        Swal.fire({
          text: response.error || "Error creating coin",
          icon: "error",
          customClass: "swal",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      Swal.fire({
        text: err.message || "An error occurred while creating the bot",
        icon: "error",
        customClass: "swal",
      });
    }
  };

  return (
    <>
      <h4>
        <CIcon icon={coin ? cilPen : cilPlus} size="xl" />{" "}
        {coin ? "Edit" : "Create New"} Coin
      </h4>
      {isLoading ? (
        <SpinnerComponent style={{ height: "80vh" }} />
      ) : (
        <form>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Name</strong>
                <span> *</span>
              </label>
              <CustomTooltip
                title={"Create a coin"}
                content={
                  "Enter a name, alias and category to enable the coin in Analysis, Fundamentals, Charts and Narrative Trading."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <input
              className={styles.input}
              placeholder="Enter bot name"
              onChange={handleInputChange}
              name="name"
              required
              value={formData.name}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Alias</strong>
                <span> *</span>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <input
              className={styles.input}
              placeholder="Enter bot alias"
              onChange={handleInputChange}
              name="alias"
              required
              value={formData.alias}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Symbol</strong>
                <span> *</span>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <input
              className={styles.input}
              placeholder="Enter bot symbol"
              onChange={handleInputChange}
              name="symbol"
              required
              value={formData.symbol}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Category</strong>
                <span> *</span>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <select
              className={styles.select}
              onChange={handleInputChange}
              name="category_id"
              value={formData.category_id}
              required
            >
              <option value="">Select category</option>{" "}
              {selectCategories?.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div className={styles.section}>
          <div className={styles.labelContainer}>
            <label>
              <strong>URL</strong>
            </label>
            <CustomTooltip
              title={"Create a bot"}
              content={
                "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
              }
            >
              <HelpOutline fontSize="small" />
            </CustomTooltip>
          </div>
          <input
            className={styles.input}
            placeholder="Enter url"
            onChange={handleInputChange}
            name="url"
            type="url"
            value={formData.url}
          />
        </div> */}
          <div className={styles.section}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <label>
                <strong>
                  <OpenLock style={{ height: 20, width: 20 }} />
                  Whitelist
                </strong>
              </label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={onFileUpload}
                  id="uploadWhitelistBtn"
                  className={styles.uploadBtn}
                />
                <label
                  htmlFor="uploadWhitelistBtn"
                  className={styles.fileLabel}
                >
                  <CIcon icon={cilFile} />
                  {isWhitelistFileUploading ? "Uploading..." : "Upload .xsl"}
                </label>
                {/* <button className={styles.button}>
                <CIcon icon={cilDataTransferDown} />
                Download
              </button> */}
                <CustomTooltip
                  title={"Create a bot"}
                  content={
                    "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
                  }
                >
                  <HelpOutline sx={{ fontSize: 20, color: "#525252" }} />
                </CustomTooltip>
              </div>
            </div>
            <div className={styles.keywordInput} id="whitelist-keywords-input">
              <input
                placeholder="Enter keywords"
                name="keywords"
                ref={keyWordInputRef}
                value={whitelistKeyword}
                onChange={(e) => setWhitelistKeyword(e.target.value)}
              />
              <button
                onClick={addKeyword}
                disabled={!whitelistKeyword}
                name="keywords"
              >
                <CIcon icon={cilPlus} /> Add
              </button>
            </div>
            <div
              className={styles.keywordsContainer}
              id="whitelist-keywords-container"
            >
              {keywords?.map((keyword, index) => (
                <div
                  className={styles.keyword}
                  key={index}
                  id="botform-whitelist-keyword"
                >
                  <span>{keyword}</span>
                  <button onClick={(e) => removeKeyword(e, keyword)}>
                    <CIcon icon={cilX} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.section}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <label>
                <strong>
                  <ClosedLock style={{ height: 20, width: 20 }} />
                  Blacklist
                </strong>
              </label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => onFileUpload(e, true)}
                  id="uploadBlacklistBtn"
                  className={styles.uploadBtn}
                />
                <label
                  htmlFor="uploadBlacklistBtn"
                  className={styles.fileLabel}
                >
                  <CIcon icon={cilFile} />
                  {isBlacklistFileUploading ? "Uploading..." : "Upload .xsl"}
                </label>
                {/* <button className={styles.button}>
                <CIcon icon={cilDataTransferDown} />
                Download
              </button> */}
                <CustomTooltip
                  title={"Create a bot"}
                  content={
                    "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
                  }
                >
                  <HelpOutline sx={{ fontSize: 20, color: "#525252" }} />
                </CustomTooltip>
              </div>
            </div>
            <div className={styles.keywordInput} id="blacklist-keywords-input">
              <input
                placeholder="Enter keywords"
                name="blacklist"
                value={blacklistKeyword}
                onChange={(e) => setBlacklistKeyword(e.target.value)}
              />
              <button
                onClick={(e) => addKeyword(e, true)}
                disabled={!blacklistKeyword}
                name="blacklist"
              >
                <CIcon icon={cilPlus} /> Add
              </button>
            </div>
            <div
              className={styles.keywordsContainer}
              id="blacklist-keywords-container"
            >
              {blacklist?.map((keyword, index) => (
                <div
                  className={styles.keyword}
                  key={index}
                  id="botform-blacklist-keyword"
                >
                  <span>{keyword}</span>
                  <button onClick={(e) => removeKeyword(e, keyword, true)}>
                    <CIcon icon={cilX} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>DALL-E Prompt</strong>
              </label>
              <CustomTooltip
                title={"Create a bot"}
                content={
                  "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <textarea
              name="dalle_prompt"
              onChange={handleInputChange}
              value={formData.dalle_prompt}
              className={styles.textarea}
              placeholder="Enter article generator prompt. 
            An example of use could be: 
            “Imagine that you are one of the world’s foremost experts on Bitcoin and also a globally renowned journalist skilled at summarizing articles about Bitcoin...”"
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong> News Prompt</strong>
              </label>
              <CustomTooltip
                title={"Create a bot"}
                content={
                  "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <textarea
              name="prompt"
              onChange={handleInputChange}
              value={formData.prompt}
              className={styles.textarea}
              placeholder="Enter article generator prompt. 
            An example of use could be: 
            “Imagine that you are one of the world’s foremost experts on Bitcoin and also a globally renowned journalist skilled at summarizing articles about Bitcoin...”"
            />
          </div>
          <div className={styles.section} style={{ width: 200 }}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Run frequency</strong>
              </label>
              <CustomTooltip
                title={"Create a bot"}
                content={
                  "Add at least one additional detail (excluding icon or background color) to enable the bot for news bot creation."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <input
              name="run_frequency"
              type="number"
              id="frequency"
              onChange={handleInputChange}
              className={styles.frequencyInput}
              placeholder="Enter frequency"
              value={formData.run_frequency}
              min="20"
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Upload Icon</strong>
              </label>
              <HelpOutline />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <div className={styles.divInput}>
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleImageChange}
                  className={styles.imgPicker}
                  id="botform-icon-input"
                />
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Background Color</strong>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <div
              className={styles.input}
              style={{
                paddingBlock: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              id="background-color-input"
            >
              <span style={{ fontSize: 20, fontWeight: 600 }}>#</span>
              <input
                style={{
                  background: "transparent",
                  border: "none",
                  width: "80%",
                }}
                placeholder="Enter HEX code"
                value={formData.background_color}
                onChange={handleInputChange}
                name="background_color"
              />
              <div
                style={{
                  height: 19,
                  width: 19,
                  borderRadius: "50%",
                  background: formData.background_color
                    ? `#${formData.background_color}`
                    : "transparent",
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ margin: "auto", marginBottom: 15 }}>
              <strong>Preview</strong>
            </label>
            <div
              className={styles.imgContainer}
              style={{
                background: formData.background_color
                  ? formData.background_color.includes("#")
                    ? formData.background_color
                    : `#${formData.background_color}`
                  : "transparent",
                // : "#F5F5F5",
              }}
              id="bot-form-preview-container"
            >
              <img
                src={formData.iconPreview}
                className={styles.img}
                onError={(e) => (e.target.src = defaultImg)}
                style={{
                  visibility: formData.iconPreview ? "visible" : "hidden",
                }}
                alt="icon"
              />
              {formData.alias && <span>{formData.alias.toUpperCase()}</span>}
            </div>
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={!coin && !isFormValid}
            onClick={handleSubmit}
            id="bot-form-submit-button"
          >
            {isSubmitting
              ? coin
                ? "Updating..."
                : "Creating..."
              : coin
                ? "Update"
                : "Create"}
          </button>
        </form>
      )}
    </>
  );
};

export default BotForm;
