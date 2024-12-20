import React, { useState, useEffect } from "react";
import config from "../../config";
import Title from "src/components/commons/Title";
import styles from "./index.module.css";
import { ReactComponent as TitleIcon } from "src/assets/icons/newsCreator.svg";
import { ReactComponent as RenewIcon } from "src/assets/icons/renew.svg";
import { ReactComponent as StarIcon } from "src/assets/icons/star.svg";
import { ReactComponent as EmptyStarIcon } from "src/assets/icons/emptyStar.svg";
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
  //   setIsLoadingRegenerateArticle(true);
  //   try {
  //     const articleResponse = await fetch(
  //       `${config.BOTS_V2_API}/generate_article`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "ngrok-skip-browser-warning": "true",
  //         },
  //         body: JSON.stringify({
  //           content: analysis,
  //           category_id: selectedCategory.id,
  //         }),
  //       },
  //     );

  //     const articleData = await articleResponse.json();
  //     console.log(articleData.data.summary.response);
  //     const { title, content } = parseSummary(
  //       articleData.data.summary.response,
  //     );
  //     console.log(title, content);
  //     if (!articleResponse.ok) {
  //       console.error("Error generating article:", articleData.error);
  //       return;
  //     }

  //     const imageResponse = await fetch(
  //       `${config.BOTS_V2_API}/generate_image`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "ngrok-skip-browser-warning": "true",
  //         },
  //         body: JSON.stringify({
  //           content: articleData.data.summary.response,
  //           bot_id: selectedBot?.id,
  //         }),
  //       },
  //     );

  //     const imageData = await imageResponse.json();
  //     console.log(imageData);
  //     if (!imageResponse.ok) {
  //       console.error("Error generating image:", imageData.error);
  //       return;
  //     }

  //     const imageUrl = imageData.data.image_url;

  //     setPreviewData({
  //       title: title,
  //       content: content,
  //       image: imageUrl,
  //     });
  //     setArticleToBeSaved({
  //       title: title,
  //       content: content,
  //       analysis: analysis,
  //       used_keywords: usedKeywords,
  //       is_article_efficient: isArticleEfficient,
  //       category_id: selectedCategory.id,
  //       bot_id: selectedBot?.id,
  //     });
  //     setImageToBeSaved(imageUrl);

  //     setShowPreview(true);
  //   } catch (error) {
  //     console.error("Error generating article or image:", error.message);
  //   } finally {
  //     setIsLoadingRegenerateArticle(false);
  //     setIsLoadingRegenerateImage(false);
  //   }
  // };

  // const handleSave = async () => {
  //   setIsLoadingSave(true);
  //   try {
  //     const response = await fetch(`${config.BOTS_V2_API}/add_new_article`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "true",
  //       },
  //       body: JSON.stringify({
  //         title: articleToBeSaved.title,
  //         content: articleToBeSaved.content,
  //         analysis: articleToBeSaved.analysis,
  //         used_keywords: articleToBeSaved.used_keywords,
  //         is_article_efficient: articleToBeSaved.is_article_efficient,
  //         category_id: articleToBeSaved.category_id,
  //         bot_id: articleToBeSaved.bot_id,
  //         image_url: imageToBeSaved,
  //         is_top_story: isTopStory, // Enviar el valor del checkbox
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setShowSuccessMessage(true); // Show success message
  //       console.log("Article saved successfully!");
  //       setTimeout(() => {
  //         setShowSuccessMessage(false); // Hide after 5 seconds
  //         startOver(); // Reset form after hiding success message
  //       }, 5000);
  //       refreshArticles();
  //     } else {
  //       console.error("Error saving article:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error saving article:", error.message);
  //   } finally {
  //     setIsLoadingSave(false);
  //   }
  // };

  // const handleRegenerateArticle = async () => {
  //   setIsLoadingRegenerateArticle(true);
  //   try {
  //     const articleResponse = await fetch(
  //       `${config.BOTS_V2_API}/generate_article`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "ngrok-skip-browser-warning": "true",
  //         },
  //         body: JSON.stringify({
  //           content: analysis,
  //           category_id: selectedCategory.id,
  //         }),
  //       },
  //     );

  //     const articleData = await articleResponse.json();
  //     if (!articleResponse.ok) {
  //       console.error("Error regenerating article:", articleData.error);
  //       return;
  //     }

  //     setPreviewData((prevData) => ({
  //       ...prevData,
  //       title: articleData.data.title,
  //       content: articleData.data.content,
  //     }));
  //     setArticleToBeSaved((prevData) => ({
  //       ...prevData,
  //       title: articleData.data.title,
  //       content: articleData.data.content,
  //     }));
  //   } catch (error) {
  //     console.error("Error regenerating article:", error.message);
  //   } finally {
  //     setIsLoadingRegenerateArticle(false);
  //   }
  // };

  // const handleRegenerateImage = async () => {
  //   setIsLoadingRegenerateImage(true);
  //   try {
  //     const imageResponse = await fetch(
  //       `${config.BOTS_V2_API}/generate_image`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "ngrok-skip-browser-warning": "true",
  //         },
  //         body: JSON.stringify({
  //           content: previewData.content,
  //           bot_id: selectedBot?.id,
  //         }),
  //       },
  //     );

  //     const imageData = await imageResponse.json();
  //     if (!imageResponse.ok) {
  //       console.error("Error regenerating image:", imageData.error);
  //       return;
  //     }

  //     setPreviewData((prevData) => ({
  //       ...prevData,
  //       image: imageData.data.image_url,
  //     }));
  //     setImageToBeSaved(imageData.data.image_url);
  //   } catch (error) {
  //     console.error("Error regenerating image:", error.message);
  //   } finally {
  //     setIsLoadingRegenerateImage(false);
  //   }
  // };

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
      <Title>
        <TitleIcon
          style={{ height: 35, width: "fit-content", marginRight: 15 }}
          id="newsCreator-titleIcon"
        />
        News Creator
      </Title>
      <div style={{ width: "100%" }}>
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
        <span className={styles.contentTitle}>Results</span>
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

        <button
          className={styles.topStoryButton}
          onClick={() => setIsTopStory(!isTopStory)}
        >
          {isTopStory ? (
            <StarIcon/>
          ) : (
            <EmptyStarIcon/>
          )}
          <span>Mark as a top story</span>
        </button>
      </div>
    </div>
  );
};

export default NewsCreator;
