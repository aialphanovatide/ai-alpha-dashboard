import React, { useState, useEffect } from "react";
import config from "../../config";
import styles from "./index.module.css";
import { ReactComponent as TitleIcon } from "src/assets/icons/newsCreator.svg";
import { ReactComponent as RenewIcon } from "src/assets/icons/renew.svg";
import { ReactComponent as StarIcon } from "src/assets/icons/star.svg";
import { ReactComponent as EmptyStarIcon } from "src/assets/icons/emptyStar.svg";
import uploadIcon from "src/assets/icons/uploadIcon.svg";
import CustomSelect from "src/components/commons/CustomSelect";
import RichTextEditor from "../helpers/textEditor/textEditor";

const NewsCreator = () => {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isContent, setIsContent] = useState(false);
  const [isImageInContent, setIsImageInContent] = useState(false);
  const [content, setContent] = useState("");
  const [isTopStory, setIsTopStory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const fetchCategoriesAndBots = async () => {
      try {
        const categoriesResponse = await fetch(
          `${config.BOTS_V2_API}/categories`,
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data?.categories || []);

        const botsResponse = await fetch(`${config.BOTS_V2_API}/bots`);
        const botsData = await botsResponse.json();
        setBots(botsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setBots([]);
      }
    };

    fetchCategoriesAndBots();
  }, []);

  const handleSelectCoin = (coin) => {
    if (coin) {
      const category = categories.find(
        (category) => category.category_id === parseInt(coin.category_id),
      );
      setSelectedCategory(category);
    }
    setSelectedBot(coin);
  };

  function formatContent(content) {
    return content
      .replace(
        /<p>(.*?)<\/p><p><br><\/p>/,
        '<p style="font-size: 20px"><strong>$1</strong></p><p><br></p>',
      )
      .replace(
        /<p><span>(.*?)<\/span><\/p><p><br><\/p>/,
        '<p style="font-size: 20px"><strong>$1</strong></p><p><br></p>',
      );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <TitleIcon
          style={{ height: 40, width: "fit-content", marginRight: 15 }}
          id="newsCreator-titleIcon"
        />
        News Creator
      </h1>
      <div className={styles.selectorsContainer}>
        <div className={styles.section}>
          <div className={styles.labelContainer}>
            <label>
              <strong>Coin</strong>
              <span> *</span>
            </label>
          </div>
          <CustomSelect
            items={bots}
            element="coins"
            placeholder="Select coin"
            onSelect={handleSelectCoin}
            value={selectedBot}
          />
        </div>
        <div className={styles.section}>
          <div className={styles.labelContainer}>
            <label>
              <strong>Category</strong>
              <span> *</span>
            </label>
          </div>
          <CustomSelect
            items={categories}
            element="categories"
            placeholder="Select category"
            onSelect={setSelectedCategory}
            value={selectedCategory}
            // disabled={
            //   selectedCoin || isFetchingCategories || categories.length === 0
            // }
          />
        </div>
      </div>
      <section className={styles.generateSection}>
        <div className={styles.titleInputContainer}>
          <span className={styles.sectionTitle}>Create the text</span>
          <div className={styles.divInput} id="botForm-img-input">
            <div className={styles.filePicker} id="botForm-img-input-button">
              <input
                type="file"
                // accept=".svg"
                // onChange={handleImageChange}
                style={{ display: "none" }}
                id="botform-icon-input"
              />
              <label htmlFor="botform-icon-input">
                <img src={uploadIcon} alt="icon" style={{ height: 16 }} />
                Upload
              </label>
            </div>
            <input
              type="text"
              // onChange={handleImageLinkChange}
              // value={formData.icon?.link || ""}
              // placeholder={formData.icon ? formData.icon.name : "No files selected"}
              placeholder="Upload file or paste link"
              id="botForm-img-link"
            />
          </div>
        </div>
        <textarea
          placeholder="Write the prompt"
          onChange={setPrompt}
          value={prompt}
        />
        <button
          className={styles.createButton}
          // disabled={isSubmitting || !isFormValid}
          disabled={true}
        >
          Create
        </button>
      </section>
      <section>
        <span className={styles.sectionTitle}>Results</span>
        <div className={styles.contentEditorContainer}>
          <RichTextEditor
          // handleImageSelect={handleImageSelect}
          // images={selectedImage}
          // success={isAnalysisCreated}
          // onSuccess={setIsAnalysisCreated}
          // onContentChange={handleContentChange}
          />
          <div className={styles.previewCard} id="contentCreation-previewCard">
            <div
              className={styles.previewImgContainer}
              id="contentCreation-previewImgContainer"
            >
              {generatedImg && (
                <img
                  src={generatedImg}
                  alt="generated img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              <button
                className={styles.regenerateImgButton}
                // onClick={generateImg}
                id="contentCreation-regenerateImgButton"
                disabled={!isContent || isImageGenerating}
                style={{
                  cursor: isImageGenerating
                    ? "wait"
                    : isContent
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <RenewIcon
                  style={{ fill: generatedImg ? "black" : "#9d9d9d" }}
                />
              </button>
            </div>
            <div style={{ height: 300, position: "relative" }}>
              {isContent || isImageInContent ? (
                <p
                  dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                  style={{ height: "fit-content", fontSize: 16 }}
                  className={styles.contentPreview}
                  id="contentCreation-contentPreview"
                />
              ) : (
                <div
                  className={styles.textMockContainer}
                  id="contentCreation-textMockContainer"
                >
                  <p style={{ width: "100%", marginTop: 10, marginBottom: 5 }}>
                    -
                  </p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "95%", marginTop: 30 }}>-</p>
                  <p style={{ width: "95%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "85%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "90%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "75%" }}>-</p>
                </div>
              )}

              <button
                className={styles.regenerateImgButton}
                // onClick={generateImg}
                id="contentCreation-regenerateImgButton"
                disabled={!isContent || isImageGenerating}
                style={{
                  cursor: isImageGenerating
                    ? "wait"
                    : isContent
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <RenewIcon
                  style={{ fill: generatedImg ? "black" : "#9d9d9d" }}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
      <button
        className={styles.topStoryButton}
        onClick={() => setIsTopStory(!isTopStory)}
      >
        {isTopStory ? <StarIcon /> : <EmptyStarIcon />}
        <span>Mark as a top story</span>
      </button>
      <button
        className={styles.submitButton}
        // onClick={handleSubmit}
        // disabled={isSubmitting || !isFormValid}
        disabled={true}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default NewsCreator;
