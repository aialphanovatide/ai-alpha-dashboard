import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import config from "../../config";
import './NewsCreatorTook.css'

const NewsCreatorTool = () => {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [articles, setArticles] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [usedKeywords, setUsedKeywords] = useState("");
  const [isArticleEfficient, setIsArticleEfficient] = useState("");
  const [isLoadingRegenerateArticle, setIsLoadingRegenerateArticle] = useState(false);
  const [isLoadingRegenerateImage, setIsLoadingRegenerateImage] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [articleToBeSaved, setArticleToBeSaved] = useState(null);
  const [imageToBeSaved, setImageToBeSaved] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndBots = async () => {
      try {
        const categoriesResponse = await fetch(`${config.BOTS_V2_API}/categories`);
        const categoriesData = await categoriesResponse.json();
        if (categoriesData && categoriesData.data && categoriesData.data.categories) {
          setCategories(categoriesData.data.categories);
        } else {
          console.error("Error fetching categories:", categoriesData.message);
          setCategories([]);
        }

        const botsResponse = await fetch(`${config.BOTS_V2_API}/bots`);
        const botsData = await botsResponse.json();
        if (botsData && botsData.data) {
          setBots(botsData.data);
        } else {
          console.error("Error fetching bots:", botsData.message);
          setBots([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setBots([]);
      }
    };

    fetchCategoriesAndBots();
  }, []);

  const handleGenerate = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const articleResponse = await fetch("http://127.0.0.1:5001/generate_article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          content: analysis,
          category_id: selectedCategory,
        }),
      });

      const articleData = await articleResponse.json();
      if (!articleResponse.ok) {
        console.error("Error generating article:", articleData.error);
        return;
      }

      const imageResponse = await fetch("http://127.0.0.1:5001/generate_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          content: articleData.data.content,
          bot_id: selectedBot,
        }),
      });

      const imageData = await imageResponse.json();
      setIsLoadingRegenerateArticle(false);
      setIsLoadingRegenerateImage(false);

      if (!imageResponse.ok) {
        console.error("Error generating image:", imageData.error);
        return;
      }

      setPreviewData({
        title: articleData.data.title,
        content: articleData.data.content,
        image: imageData.data.image_url,
      });

      setArticleToBeSaved({
        title: articleData.data.title,
        content: articleData.data.content,
        analysis: analysis,
        used_keywords: usedKeywords,
        is_article_efficent: isArticleEfficient,
        category_id: selectedCategory,
        bot_id: selectedBot,
      });

      setImageToBeSaved(imageData.data.image_url);

      setShowPreview(true);
    } catch (error) {
      console.error("Error generating article or image:", error.message);
      setIsLoadingRegenerateArticle(false);
      setIsLoadingRegenerateImage(false);
    }
  };

  const handleSave = async () => {
    setIsLoadingSave(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/add_new_article", {
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
          is_article_efficent: articleToBeSaved.is_article_efficent,
          bot_id: articleToBeSaved.bot_id,
          category_id: articleToBeSaved.category_id,
          image: imageToBeSaved,
        }),
      });

      const data = await response.json();
      setIsLoadingSave(false);

      if (response.ok) {
        setArticles([...articles, data.data]);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.error("Error saving article:", data.error);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
      setIsLoadingSave(false);
    }finally {
        handleStartOver();
      }
  };

  const handleRegenerateArticle = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/generate_article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          content: analysis,
          category_id: selectedCategory,
        }),
      });

      const data = await response.json();
      setIsLoadingRegenerateArticle(false);

      if (response.ok) {
        setPreviewData((prev) => ({
          ...prev,
          title: data.data.title,
          content: data.data.content,
        }));

        setArticleToBeSaved((prev) => ({
          ...prev,
          title: data.data.title,
          content: data.data.content,
        }));
      } else {
        console.error("Error regenerating article:", data.error);
      }
    } catch (error) {
      console.error("Error regenerating article:", error.message);
      setIsLoadingRegenerateArticle(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsLoadingRegenerateImage(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/generate_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          content: articleToBeSaved.content,
          bot_id: selectedBot,
        }),
      });

      const data = await response.json();
      setIsLoadingRegenerateImage(false);

      if (response.ok) {
        setPreviewData((prev) => ({
          ...prev,
          image: data.data.image_url,
        }));

        setImageToBeSaved(data.data.image_url);
      } else {
        console.error("Error regenerating image:", data.error);
      }
    } catch (error) {
      console.error("Error regenerating image:", error.message);
      setIsLoadingRegenerateImage(false);
    }
  };

  const handleStartOver = () => {
    setSelectedCategory("");
    setSelectedBot("");
    setAnalysis("");
    setUsedKeywords("");
    setIsArticleEfficient("");
    setShowPreview(false);
    setPreviewData(null);
    setArticleToBeSaved(null);
    setImageToBeSaved(null);
  };

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>News Creator Tool</h2>
        <br />
        <Form.Group controlId="categorySelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.toUpperCase()}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="botSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Bot</Form.Label>
          <Form.Control
            as="select"
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            >
              <option value="">Select...</option>
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name.toUpperCase()}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="analysisInput" style={{ marginBottom: "15px"}}>
            <Form.Label>Analysis</Form.Label>
            <Form.Control
              as="textarea"
              rows={6} // Esto ajusta el número de filas visible del textarea
              style={{ height: "200px", resize: "none" }} // Aquí se ajusta el tamaño del textarea
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="usedKeywordsInput" style={{ marginBottom: "15px" }}>
            <Form.Label>Used Keywords</Form.Label>
            <Form.Control
              type="text"
              value={usedKeywords}
              onChange={(e) => setUsedKeywords(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="isArticleEfficientInput" style={{ marginBottom: "15px" }}>
            <Form.Label>Is Article Efficient</Form.Label>
            <Form.Control
              type="text"
              value={isArticleEfficient}
              onChange={(e) => setIsArticleEfficient(e.target.value)}
            />
          </Form.Group>
          <Button
            onClick={handleGenerate}
            style={{ marginRight: "5px" }}
            disabled={isLoadingRegenerateArticle || isLoadingRegenerateImage || isLoadingSave}
          >
            {isLoadingRegenerateArticle ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
                Generating Article...
              </>
            ) : (
              "Generate"
            )}
          </Button>
          {showPreview && previewData && (
          <Button
            variant="secondary"
            onClick={handleStartOver}
            className="start-over-button"
          >
            Start Over
          </Button>
        )}
          
          <hr></hr>
          {showPreview && previewData && (
          <div className="preview-container">
            <h3>Preview:</h3>
            <p className="preview-content">Title: {previewData.title}</p>
            <p className="preview-content">Content: {previewData.content}</p>
            <Button
              variant="secondary"
              onClick={handleRegenerateArticle}
              className="regenerate-article-button"
              disabled={isLoadingRegenerateArticle}
            >
              {isLoadingRegenerateArticle ? "Regenerating..." : "Regenerate Article"}
            </Button>
            <br></br>
            <img
              src={previewData.image}
              alt="Article Poster"
              className="preview-image"
            />
            <br></br>
            <Button
              variant="secondary"
              onClick={handleRegenerateImage}
              className="regenerate-image-button"
              disabled={isLoadingRegenerateImage}
            >
              {isLoadingRegenerateImage ? "Regenerating..." : "Regenerate Image"}
            </Button>
            <br></br>
            <Button
              variant="primary"
              onClick={handleSave}
              className="save-button"
              disabled={isLoadingSave}
            >
              {isLoadingSave ? "Saving..." : "Save"}
            </Button>
            {showSuccessMessage && (
            <Alert variant="success" style={{ marginTop: "10px" }}>
              News created!
            </Alert>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCreatorTool;
