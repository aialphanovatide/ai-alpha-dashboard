import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import pdfToText from "react-pdftotext";
import config from "../../config";
import "./NewsCreatorTool.css";

const NewsCreatorTool = () => {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [articles, setArticles] = useState([]);
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
  const [selectedExtractType, setSelectedExtractType] = useState("");
  const [link, setLink] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedContent, setExtractedContent] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndBots = async () => {
      try {
        const categoriesResponse = await fetch(
          `${config.BOTS_V2_API}/categories`,
        );
        const categoriesData = await categoriesResponse.json();
        if (
          categoriesData &&
          categoriesData.data &&
          categoriesData.data.categories
        ) {
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

  const handleExtractContent = async () => {
    setIsExtracting(true);
    try {
      if (selectedExtractType === "pdf" && pdfFile) {
        const text = await pdfToText(pdfFile);
        console.log(text);
        setExtractedContent(text);
        setAnalysis(text);
      } else {
        let requestData = {
          extract_type: selectedExtractType,
          link:
            selectedExtractType === "link" ||
            selectedExtractType === "google_docs"
              ? link
              : undefined,
        };

        console.log("requestData ", requestData);

        const response = await fetch(`http://127.0.0.1:5001/extract_content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log("data ", data);
        if (response.ok) {
          setExtractedContent(data.response);
          setAnalysis(data.response);
        } else {
          console.error("Error extracting content:", data.response);
        }
      }
    } catch (error) {
      console.error("Error extracting content:", error.message);
    } finally {
      setIsExtracting(false);
    }
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
            category_id: selectedCategory,
          }),
        },
      );

      const articleData = await articleResponse.json();
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
            content: articleData.data.content,
            bot_id: selectedBot,
          }),
        },
      );

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
        is_article_efficient: isArticleEfficient,
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
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 10000);
        setArticles((prevArticles) => [
          ...prevArticles,
          { ...articleToBeSaved, image_url: imageToBeSaved },
        ]);
        setShowPreview(false);
      } else {
        console.error("Error saving article:", data.message);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleStartOver = () => {
    setSelectedCategory("");
    setSelectedBot("");
    setAnalysis("");
    setUsedKeywords("");
    setIsArticleEfficient("");
    setSelectedExtractType("");
    setLink("");
    setPdfFile(null);
    setExtractedContent("");
    setShowPreview(false);
    setArticleToBeSaved(null);
    setImageToBeSaved(null);
  };

  const handleRegenerateArticle = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const response = await fetch(`${config.BOTS_V2_API}/generate_article`, {
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
      const response = await fetch(`${config.BOTS_V2_API}/generate_image`, {
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

  return (
    <div className="news-creator-tool">
      <h1>News Creator Tool</h1>
      <Form>
        <Form.Group controlId="extractType">
          <Form.Label>Extract Content From</Form.Label>
          <Form.Control
            as="select"
            value={selectedExtractType}
            onChange={(e) => setSelectedExtractType(e.target.value)}
          >
            <option value="">Select Extract Type</option>
            <option value="link">Link</option>
            <option value="google_docs">Google Docs</option>
            <option value="pdf">PDF</option>
          </Form.Control>
        </Form.Group>

        {selectedExtractType === "link" ||
        selectedExtractType === "google_docs" ? (
          <Form.Group controlId="link">
            <br></br>
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Form.Group>
        ) : selectedExtractType === "pdf" ? (
          <Form.Group controlId="pdfFile">
            <br></br>
            <Form.Label>PDF File</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </Form.Group>
        ) : null}
        <br></br>
        <Button
          variant="primary"
          onClick={handleExtractContent}
          disabled={
            isExtracting ||
            !selectedExtractType ||
            (selectedExtractType !== "pdf" && !link) ||
            (selectedExtractType === "pdf" && !pdfFile)
          }
        >
          {isExtracting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Extract Content"
          )}
        </Button>
        <hr></hr>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="bot">
          <br></br>
          <Form.Label>Bot</Form.Label>
          <Form.Control
            as="select"
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
          >
            <option value="">Select Bot</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      <Form.Group controlId="analysis">
        <br></br>
        <Form.Label>Analysis</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="usedKeywords">
        <br></br>
        <Form.Label>Used Keywords</Form.Label>
        <Form.Control
          type="text"
          value={usedKeywords}
          onChange={(e) => setUsedKeywords(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="isArticleEfficient">
        <br></br>
        <Form.Label>Is Article Efficient?</Form.Label>
        <Form.Control
          type="text"
          value={isArticleEfficient}
          onChange={(e) => setIsArticleEfficient(e.target.value)}
        />
      </Form.Group>
      <br></br>
      <Button
        variant="primary"
        onClick={handleGenerate}
        disabled={
          isLoadingRegenerateArticle ||
          !selectedCategory ||
          !selectedBot ||
          !analysis
        }
      >
        {isLoadingRegenerateArticle ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Generate Article and Image"
        )}
      </Button>

      <Button
        variant="secondary"
        onClick={handleStartOver}
        style={{ marginLeft: "10px" }}
        className="ml-2"
      >
        Start Over
      </Button>

      {showPreview && (
        <div className="preview">
          <br></br>
          <h3>Preview:</h3>
          <h4>{previewData.title}</h4>
          <p>{previewData.content}</p>

          <Button
            variant="secondary"
            onClick={handleRegenerateArticle}
            disabled={
              isLoadingRegenerateArticle ||
              !selectedCategory ||
              !selectedBot ||
              !analysis
            }
          >
            {isLoadingRegenerateArticle ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Regenerate Article"
            )}
          </Button>
          <br></br>
          <br></br>

          {previewData.image && (
            <img
              src={previewData.image}
              style={{ width: "200px", height: "200px" }}
              alt="Generated"
            />
          )}
          <br></br>
          <br></br>

          <Button
            variant="secondary"
            onClick={handleRegenerateImage}
            disabled={
              isLoadingRegenerateImage ||
              !selectedBot ||
              !previewData ||
              !previewData.content
            }
          >
            {isLoadingRegenerateImage ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Regenerate Image"
            )}
          </Button>
        </div>
      )}
      <br></br>
      <Button variant="success" onClick={handleSave} disabled={isLoadingSave}>
        {isLoadingSave ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Save"
        )}
      </Button>

      {showSuccessMessage && (
        <Alert variant="success">News created successfully!</Alert>
      )}
    </div>
  );
};

export default NewsCreatorTool;
