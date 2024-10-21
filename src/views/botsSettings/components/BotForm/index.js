import { cilDataTransferDown, cilFile, cilPlus, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import { ReactComponent as OpenLock } from "../../../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../../../assets/icons/closedLock.svg";
import CustomTooltip from "src/components/CustomTooltip";
import Swal from "sweetalert2";
import { getCategories } from "src/services/categoryService";
import { createBot, getBot } from "src/services/botService";
import { capitalizeFirstLetter } from "src/utils";

const BotForm = ({ bot }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const keyWordInputRef = React.createRef();
  const [formData, setFormData] = useState({
    name: bot && bot.name ? capitalizeFirstLetter(bot.name) : "", //req
    alias: bot && bot.alias ? bot.alias : "", //req
    symbol: bot && bot.symbol ? bot.symbol : "", //req
    category_id: bot && bot.category_id ? bot.category_id : "", //req
    background_color: bot && bot.background_color ? bot.background_color : "",
    icon: null,
    iconPreview: null,
    bot_category: "",
    // name: "", //req
    // category_id: "",//req
    blacklist: [],
    keywords: [],
    url: "",
  });

  const fetchBot = async () => {
    try {
      const bot = await getBot();
      // setBot(bot);
    } catch (err) {
      setError(err.message || "Error fetching bot");
    }
  };

  //   {
  //     "bot_id": 35,
  //     "created_at": "Sun, 22 Sep 2024 01:47:12 GMT",
  //     "gecko_id": null,
  //     "icon": "/static/topmenu_icons_resize/intellichain.png",
  //     "is_active": false,
  //     "updated_at": "Sun, 22 Sep 2024 04:47:12 GMT"j
  // }

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (err) {
      setError(err.message || "Error fetching categories");
    }
  }, [setCategories]);

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
      formData.symbol,
    [formData.name, formData.alias, formData.category_id, formData.symbol],
  );

  const addKeyword = (e) => {
    e.preventDefault();
    const input = document.querySelector(`input[name="${e.target.name}"]`);
    const keyword = input?.value.trim();

    if (!keyword) {
      setError("Please enter a keyword");
      return;
    }

    setFormData((prevFormData) => {
      if (prevFormData[e.target.name].includes(keyword)) {
        setError("Keyword already added");
        return prevFormData;
      }

      return {
        ...prevFormData,
        [e.target.name]: [...prevFormData[e.target.name], keyword],
      };
    });

    input.value = "";
  };

  const removeKeyword = (keywordToRemove, type) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((keyword) => keyword !== keywordToRemove),
    });
  };

  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    const newData = { ...formData };
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

      const response = await createBot(formDataToSend);

      if (response.success) {
        Swal.fire({
          text: "Bot created successfully!",
          icon: "success",
          customClass: "swal",
        }).then(async () => {
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);

          // Additional fetch to the server
          const bot = await getBot();
          // setBot(bot);
        });

        setFormData({
          name: "",
          alias: "",
          border_color: "",
          icon: null,
          iconPreview: null,
          background_color: "",
          category_id: "",
          keywords: [],
          blacklist: [],
          url: "",
          prompt: "",
        });
        document.querySelector('input[type="file"]').value = "";
        setIsLoading(false);
      } else {
        Swal.fire({
          text: response.error || "Error creating bot",
          icon: "error",
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
            {categories?.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {capitalizeFirstLetter(category.name)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.section}>
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
                <OpenLock style={{ height: 20, width: 20 }} />
                Whitelist
              </strong>
            </label>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* <button className={styles.button}>
                <CIcon icon={cilFile} />
                Upload .xsl
              </button> */}
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
          <div className={styles.keywordInput}>
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
          <div className={styles.keywordsContainer}>
            {formData.keywords?.map((keyword, index) => (
              <div className={styles.keyword} key={index}>
                <span>{keyword}</span>
                <button onClick={(e) => removeKeyword(keyword, "keywords")}>
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
              {/* <button className={styles.button}>
                <CIcon icon={cilFile} />
                Upload .xsl
              </button> */}
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
          <div className={styles.keywordInput}>
            <input placeholder="Enter keywords" name="blacklist" />
            <button
              onClick={addKeyword}
              // disabled={isAddKeywordButtonDisabled("blacklist")}
              name="blacklist"
            >
              <CIcon icon={cilPlus} /> Add
            </button>
          </div>
          <div className={styles.keywordsContainer}>
            {formData.blacklist?.map((keyword, index) => (
              <div className={styles.keyword} key={index}>
                <span>{keyword}</span>
                <button onClick={(e) => removeKeyword(keyword, "blacklist")}>
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
            name="prompt"
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
            className={styles.textarea}
            placeholder="Enter article generator prompt. 
            An example of use could be: 
            “Imagine that you are one of the world’s foremost experts on Bitcoin and also a globally renowned journalist skilled at summarizing articles about Bitcoin...”"
          />
        </div>
        {/* <div className={styles.section} style={{ width: 200 }}>
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
            name="frequency"
            type="number"
            defaultValue={0}
            id="frequency"
            onChange={handleInputChange}
            className={styles.frequencyInput}
            placeholder="Enter frequency"
            value={formData.frequency}
          />
        </div> */}
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
                : "#F5F5F5",
            }}
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
