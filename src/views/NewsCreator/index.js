import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import config from "../../config";
import TextExtractor from "../textExtractor/TextExtractor";
import Title from "src/components/commons/Title";
import styles from "./index.module.css";
import { ReactComponent as TitleIcon } from "src/assets/icons/newsCreator.svg";
import CustomSelect from "src/components/commons/CustomSelect";

const NewsCreator = () => {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [usedKeywords, setUsedKeywords] = useState("");
  const [isArticleEfficient, setIsArticleEfficient] = useState("");
  const [isLoadingRegenerateArticle, setIsLoadingRegenerateArticle] =
    useState(false);
  const [isLoadingRegenerateImage, setIsLoadingRegenerateImage] =
    useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [articleToBeSaved, setArticleToBeSaved] = useState(null);
  const [imageToBeSaved, setImageToBeSaved] = useState(null);
  const [charLimitError, setCharLimitError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isTopStory, setIsTopStory] = useState(false); // Nuevo estado para el checkbox

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

  const refreshArticles = async () => {
    try {
      const response = await fetch(`${config.BOTS_V2_API}/last_five_articles`);
      const data = await response.json();
      // Update state or perform any necessary actions
    } catch (error) {
      console.error("Error refreshing articles:", error.message);
    }
  };

  const checkIfAllFieldsFilled = () => {
    if (
      selectedCategory &&
      selectedBot &&
      analysis &&
      usedKeywords &&
      isArticleEfficient &&
      !charLimitError
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  useEffect(() => {
    checkIfAllFieldsFilled();
  }, [
    selectedCategory,
    selectedBot,
    analysis,
    usedKeywords,
    isArticleEfficient,
    charLimitError,
  ]);

  const getSelectedBotName = () => {
    const bot = bots.find(
      (b) => b.id.toString() === selectedBot?.id.toString(),
    );
    return bot ? bot.name : "";
  };

  const parseSummary = (summary) => {
    const lines = summary.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0].replace(/^\*\*(.*)\*\*$/, "$1"); // Elimina los asteriscos si están presentes
    const content = lines.slice(1).join("\n");
    return { title, content };
  };

  const handleGenerate = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const articleResponse = await fetch(
        `${config.BOTS_V2_API}/generate_article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: analysis,
            category_id: selectedCategory.id,
          }),
        },
      );

      const articleData = await articleResponse.json();
      console.log(articleData.data.summary.response);
      const { title, content } = parseSummary(
        articleData.data.summary.response,
      );
      console.log(title, content);
      if (!articleResponse.ok) {
        console.error("Error generating article:", articleData.error);
        return;
      }

      const imageResponse = await fetch(
        `${config.BOTS_V2_API}/generate_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: articleData.data.summary.response,
            bot_id: selectedBot?.id,
          }),
        },
      );

      const imageData = await imageResponse.json();
      console.log(imageData);
      if (!imageResponse.ok) {
        console.error("Error generating image:", imageData.error);
        return;
      }

      const imageUrl = imageData.data.image_url;

      setPreviewData({
        title: title,
        content: content,
        image: imageUrl,
      });
      setArticleToBeSaved({
        title: title,
        content: content,
        analysis: analysis,
        used_keywords: usedKeywords,
        is_article_efficient: isArticleEfficient,
        category_id: selectedCategory.id,
        bot_id: selectedBot?.id,
      });
      setImageToBeSaved(imageUrl);

      setShowPreview(true);
    } catch (error) {
      console.error("Error generating article or image:", error.message);
    } finally {
      setIsLoadingRegenerateArticle(false);
      setIsLoadingRegenerateImage(false);
    }
  };

  const handleSave = async () => {
    setIsLoadingSave(true);
    try {
      const response = await fetch(`${config.BOTS_V2_API}/add_new_article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          title: articleToBeSaved.title,
          content: articleToBeSaved.content,
          analysis: articleToBeSaved.analysis,
          used_keywords: articleToBeSaved.used_keywords,
          is_article_efficient: articleToBeSaved.is_article_efficient,
          category_id: articleToBeSaved.category_id,
          bot_id: articleToBeSaved.bot_id,
          image_url: imageToBeSaved,
          is_top_story: isTopStory, // Enviar el valor del checkbox
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccessMessage(true); // Show success message
        console.log("Article saved successfully!");
        setTimeout(() => {
          setShowSuccessMessage(false); // Hide after 5 seconds
          startOver(); // Reset form after hiding success message
        }, 5000);
        refreshArticles();
      } else {
        console.error("Error saving article:", data.message);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleRegenerateArticle = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const articleResponse = await fetch(
        `${config.BOTS_V2_API}/generate_article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: analysis,
            category_id: selectedCategory.id,
          }),
        },
      );

      const articleData = await articleResponse.json();
      if (!articleResponse.ok) {
        console.error("Error regenerating article:", articleData.error);
        return;
      }

      setPreviewData((prevData) => ({
        ...prevData,
        title: articleData.data.title,
        content: articleData.data.content,
      }));
      setArticleToBeSaved((prevData) => ({
        ...prevData,
        title: articleData.data.title,
        content: articleData.data.content,
      }));
    } catch (error) {
      console.error("Error regenerating article:", error.message);
    } finally {
      setIsLoadingRegenerateArticle(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsLoadingRegenerateImage(true);
    try {
      const imageResponse = await fetch(
        `${config.BOTS_V2_API}/generate_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: previewData.content,
            bot_id: selectedBot?.id,
          }),
        },
      );

      const imageData = await imageResponse.json();
      if (!imageResponse.ok) {
        console.error("Error regenerating image:", imageData.error);
        return;
      }

      setPreviewData((prevData) => ({
        ...prevData,
        image: imageData.data.image_url,
      }));
      setImageToBeSaved(imageData.data.image_url);
    } catch (error) {
      console.error("Error regenerating image:", error.message);
    } finally {
      setIsLoadingRegenerateImage(false);
    }
  };

  const handleSelectCoin = (coin) => {
    if (coin) {
      const category = categories.find(
        (category) => category.category_id === parseInt(coin.category_id),
      );
      setSelectedCategory(category);
    }
    setSelectedBot(coin);
  };

  const startOver = () => {
    setSelectedCategory(null);
    setSelectedBot(null);
    setAnalysis("");
    setUsedKeywords("");
    setIsArticleEfficient("");
    setPreviewData(null);
    setShowPreview(false);
    setArticleToBeSaved(null);
    setImageToBeSaved(null);
    setIsTopStory(false); // Resetear el valor del checkbox
  };

  const handleAnalysisChange = (e) => {
    const value = e.target.value;
    setAnalysis(value);
    setCharLimitError(value.length > 3000);
  };

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
      </div>
    </div>
  );
};

export default NewsCreator;
