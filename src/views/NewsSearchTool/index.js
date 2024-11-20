import React, { useState, useEffect, useRef } from "react";
import ArticleCard from "../ArticleCard";
import Pagination from "../pagination/Pagination";
import styles from "./index.module.css";
import config from "../../config";
import NoData from "src/components/NoData";
import SpinnerComponent from "src/components/Spinner";
import Title from "src/components/commons/Title";

// Select Checkbox: Improve the design of the select checkbox for better user experience.
// Input Box Outline: Enhance the outline of the input box for consistency and visual appeal.
// Card Width: Define or fix the width of the card for a uniform layout.

const NewsSearchTool = () => {
  const [validArticles, setValidArticles] = useState(true);
  const [unwantedArticles, setUnwantedArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [bots, setBots] = useState([]);
  const articlesPerPage = 15;

  const articlesRef = useRef([]);
  const errorRef = useRef(null);

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(
          `${config.BOTS_V2_API}/get_all_coin_bots`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const data = await response.json();
        if (data && data.data.coin_bots) {
          setBots(data.data.coin_bots);
        } else {
          console.error("Error fetching bots:", data.message);
          setBots([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setBots([]);
      }
    };

    getAllBots();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    let validArticlesData = [];
    let unwantedArticlesData = [];

    try {
      const response1 = await fetch(
        `${config.BOTS_V2_API}/get_all_articles?limit=200`,
      );
      const data1 = await response1.json();

      if (response1.ok) {
        validArticlesData = data1.data.map((article) => ({
          ...article,
          unwanted: false,
        }));
      } else {
        setError(data1.error);
      }

      const response2 = await fetch(
        `${config.BOTS_V2_API}/get_unwanted_articles`,
      );
      const data2 = await response2.json();
      if (response2.ok) {
        unwantedArticlesData = data2.data.map((article) => ({
          ...article,
          unwanted: true,
        }));
      } else {
        setError(data2.error);
      }

      articlesRef.current = [
        ...validArticlesData,
        ...unwantedArticlesData,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      errorRef.current = null;
    } catch (error) {
      setError("Error fetching articles");
      articlesRef.current = [];
      errorRef.current = error.message;
    }

    setArticles(articlesRef.current);
    setError(errorRef.current);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
    const intervalId = setInterval(fetchArticles, 600000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const cropString = (str) => {
    return str.split(" ")[0];
  };

  const getFilteredArticles = () => {
    return articlesRef.current.filter((article) => {
      const matchesCoin = selectedCoinBot
        ? article.bot_id === parseInt(selectedCoinBot)
        : true;
      const matchesType =
        (validArticles && !article.unwanted) ||
        (unwantedArticles && article.unwanted);

      const matchesColor = selectedColor
        ? article.is_article_efficent &&
          cropString(article.is_article_efficent)?.toLowerCase() ===
            selectedColor.toLowerCase()
        : true;

      return matchesCoin && matchesType && matchesColor;
    });
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleValidArticlesChange = (event) => {
    setValidArticles(event.target.checked);
  };

  const handleUnwantedArticlesChange = (event) => {
    setUnwantedArticles(event.target.checked);
  };

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  useEffect(() => {
    if (!validArticles && !unwantedArticles) {
      setValidArticles(true);
    }
  }, [validArticles, unwantedArticles]);

  const filteredArticles = getFilteredArticles().filter((article) => {
    const title = article.title || "";
    const search = searchTerm || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <div className={styles.searchTool}>
      <Title>News Search Tool</Title>
      <br />
      <div className={styles.searchHeader} id="searchHeader">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            width: "25%",
            gap: 5,
          }}
        >
          <label>Search articles</label>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            width: "20%",
            gap: 5,
          }}
        >
          <label htmlFor="coin-select">Select Coin</label>
          <select
            id="coin-select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">All Coins</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name ? bot.name.toUpperCase() : "No Name"}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            width: "20%",
            gap: 5,
          }}
        >
          <label htmlFor="color-select">Select Efficiency</label>
          <select
            id="color-select"
            value={selectedColor}
            onChange={handleColorChange}
          >
            <option value="">All Articles</option>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
          </select>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            gap: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <input
              type="checkbox"
              checked={unwantedArticles}
              onChange={handleUnwantedArticlesChange}
            />
            <label>Bin</label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <input
              type="checkbox"
              checked={validArticles}
              onChange={handleValidArticlesChange}
            />
            <label>Valid Articles</label>
          </div>
        </div>
      </div>
      {error && <p>{error}</p>}
      <div
        className={styles.searchResults}
        style={{
          display: loading || currentArticles.length < 1 ? "flex" : "grid",
        }}
      >
        {loading ? (
          <SpinnerComponent style={{ margin: "auto" }} />
        ) : (
          <>
            {currentArticles.length < 1 ? (
              <NoData message={"No articles found!"}/>
            ) : (
              currentArticles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))
            )}
          </>
        )}
      </div>
      {!loading && (
        <Pagination
          totalArticles={filteredArticles.length}
          articlesPerPage={articlesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default NewsSearchTool;
