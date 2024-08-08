import React, { useState, useEffect, useRef } from "react";
import SearchToolItem from "../searchToolItem/SearchToolItem";
import Pagination from "../pagination/Pagination";
import "./SearchTool.css";
import config from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SearchTool = () => {
  const [validArticles, setValidArticles] = useState(true);
  const [unwantedArticles, setUnwantedArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15;
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [bots, setBots] = useState([]);
  
  const articlesRef = useRef([]);
  const errorRef = useRef(null);

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

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
      const response1 = await fetch(`${config.BOTS_V2_API}/get_all_articles?limit=200`);
      const data1 = await response1.json();
      
      if (response1.ok) {
        validArticlesData = data1.data.map((article) => ({
          ...article,
          unwanted: false,
        }));
      } else {
        setError(data1.error);
      }

      const response2 = await fetch(`${config.BOTS_V2_API}/get_unwanted_articles`);
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

  const getFilteredArticles = () => {
    return articlesRef.current.filter(article => {
      const matchesCoin = selectedCoinBot ? article.bot_id === parseInt(selectedCoinBot) : true;
      const matchesType = (validArticles && !article.unwanted) || (unwantedArticles && article.unwanted);
      return matchesCoin && matchesType;
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

  useEffect(() => {
    if (!validArticles && !unwantedArticles) {
      setValidArticles(true);
    }
  }, [validArticles, unwantedArticles]);

  const filteredArticles = getFilteredArticles().filter((article) => {
    const title = article.title || '';
    const search = searchTerm || '';
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <div className="search-tool">
      <h2>Article Search Tool</h2>
      <br />
      <div className="search-header">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
        />
        <label>
          <label htmlFor="coin-select">Select Coin</label>
          <select
            id="coin-select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name ? bot.name.toUpperCase() : "No Name"}
              </option>
            ))}
          </select>
          <input
            type="checkbox"
            checked={validArticles}
            onChange={handleValidArticlesChange}
          />
          Valid Articles
        </label>
        <label>
          <input
            type="checkbox"
            checked={unwantedArticles}
            onChange={handleUnwantedArticlesChange}
          />
          Bin
        </label>
      </div>
      {error && <p>{error}</p>}
      <div className="search-results">
        {loading && (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </div>
        )}
        {!loading &&
          currentArticles.map((article, index) => (
            <SearchToolItem key={index} article={article} />
          ))}
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

export default SearchTool;
