import { cilDataTransferDown, cilFile, cilPlus, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import CustomTooltip from "src/components/CustomTooltip";
import Swal from "sweetalert2";
import { getCategories, getCategory } from "src/services/categoryService";
import { createBot, getBot } from "src/services/botService";
import { createCoin } from "src/services/coinService";
import { capitalizeFirstLetter } from "src/utils";
import { extractKeywords } from "src/services/keywordService";

const BotForm = ({ bot, setCategories }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectCategories, setSelectCategories] = useState([]);
  const [newsBotsCategories, setNewsBotsCategories] = useState([]);
  const [isWhitelistFileUploading, setWhitelistFileUploading] = useState(false);
  const [isBlacklistFileUploading, setBlacklistFileUploading] = useState(false);
  const keyWordInputRef = React.createRef();
  const [blacklist, setBlacklist] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [formData, setFormData] = useState({
    name: bot && bot.name ? capitalizeFirstLetter(bot.name) : "",
    alias: bot && bot.alias ? bot.alias : "",
    symbol: bot && bot.symbol ? bot.symbol : "",
    category_id: bot && bot.category_id ? bot.category_id : "",
    background_color: bot && bot.background_color ? bot.background_color : "",
    icon: null,
    iconPreview: null,
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
        setBlacklist(prev => [...prev, ...response.data]);
      } else {
        setKeywords(prev => [...prev, ...response.data]);
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

  // const fetchBot = async () => {
  //   try {
  //     const bot = await getBot();
  //     // setBot(bot);
  //   } catch (err) {
  //     setError(err.message || "Error fetching bot");
  //   }
  // };

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      const newsBotsCategories = await getCategories(true);
      setSelectCategories(categories);
      setNewsBotsCategories(newsBotsCategories);
    } catch (err) {
      setError(err.message || "Error fetching categories");
    }
  }, [setSelectCategories, setNewsBotsCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // const isAddKeywordButtonDisabled = useCallback(
  //   (type) => {
  //     const input = document.querySelector(`input[name="${type}"]`);
  //     const keyword = input?.value.trim();

  //     return !keyword || formData[type].includes(keyword);
  //   },
  //   [formData.keywords, formData.blacklist, keyWordInputRef],
  // );

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

  const addKeyword = (e, isBlacklist) => {
    e.preventDefault();
    const input = document.querySelector(`input[name="${e.target.name}"]`);
    const keyword = input?.value.trim();

    if (!keyword) {
      setError("Please enter a keyword");
      return;
    }

    if (isBlacklist) {
      if (blacklist.includes(keyword)) {
        setError("Keyword already added");
        return;
      }
      setBlacklist([...blacklist, keyword]);
    } else {
      if (keywords.includes(keyword)) {
        setError("Keyword already added");
        return;
      }
      setKeywords([...keywords, keyword]);
    }

    input.value = "";
  };

  const removeKeyword = (keywordToRemove, isBlacklist) => {
    if (isBlacklist) {
      setBlacklist(blacklist.filter((keyword) => keyword !== keywordToRemove));
    } else {
      setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
    }
  };

  const getBotCategoryId = (categoryName) => {
    // const response = await getCategory(categoryName, true)
    // if (response.success) {
    //   setFormData({ ...formData, bot_category_id: response.data.id });
    // }
    const newsBotCategory = newsBotsCategories.filter(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    return newsBotCategory[0].id;
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
      setError("Please select a valid SVG file");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

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

      const response = await createCoin(formDataToSend);

      if (response.success) {
        let keywordsToAdd = { whitelist: [...keywords], blacklist: [...blacklist] };
        let formdataForBot = {
          alias: formData.alias,
          background_color: formData.background_color,
          category_id: formData.bot_category_id,
          dalle_prompt: formData.dalle_prompt,
          name: formData.name,
          prompt: formData.prompt,
          run_frequency: formData.run_frequency,
        };

        const response = await createBot(formdataForBot, keywordsToAdd);

        if (response.success) {
          Swal.fire({
            text: "Coin/Bot created successfully!",
            icon: "success",
            customClass: "swal",
          }).then(async () => {
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
          });

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
          setIsLoading(false);
        } else {
          Swal.fire({
            text: response.error || "Error creating bot",
            icon: "error",
            customClass: "swal",
          });
          setIsLoading(false);
        }
      } else {
        Swal.fire({
          text: response.error || "Error creating coin",
          icon: "error",
          customClass: "swal",
        });
        setIsLoading(false);
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
      <form>
        <h4>
          <CIcon icon={cilPlus} size="xl" /> {bot ? "Edit" : "Create New"}{" "}
          Coin/Bot
        </h4>
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
                {capitalizeFirstLetter(category.name)}
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
              <label htmlFor="uploadWhitelistBtn" className={styles.fileLabel}>
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
            />
            <button
              onClick={addKeyword}
              // disabled={isAddKeywordButtonDisabled("keywords")}
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
                <button onClick={(e) => removeKeyword(keyword)}>
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
              <label htmlFor="uploadBlacklistBtn" className={styles.fileLabel}>
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
            <input placeholder="Enter keywords" name="blacklist" />
            <button
              onClick={(e) => addKeyword(e, true)}
              // disabled={isAddKeywordButtonDisabled("blacklist")}
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
                <button onClick={(e) => removeKeyword(keyword, true)}>
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
              <strong> Category Prompt</strong>
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
          disabled={!isFormValid}
          onClick={handleSubmit}
          id="bot-form-submit-button"
        >
          {isLoading
            ? bot
              ? "Updating..."
              : "Creating..."
            : bot
              ? "Update"
              : "Create"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
};

export default BotForm;
