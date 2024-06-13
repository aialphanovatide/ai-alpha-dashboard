// src/components/SearchTool.js

import React, { useState, useEffect } from "react";
import SearchToolItem from "../searchToolItem/SearchToolItem";
import "./SearchTool.css";
import baseURL from "../../config";

const SearchTool = () => {
  const [validArticles, setValidArticles] = useState(true);
  const [unwantedArticles, setUnwantedArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      let validArticlesData = [];
      let unwantedArticlesData = [];

      if (validArticles) {
        const response = await fetch(
          `${baseURL.BOTS_V2_API}/get_last_articles?limit=50`,
        );
        const data = await response.json();
        if (response.ok) {
          validArticlesData = data.data.map((article) => ({
            ...article,
            unwanted: false,
          }));
        } else {
          setError(data.error);
        }
      }

      if (unwantedArticles) {
        const response = await fetch(
          `${baseURL.BOTS_V2_API}/get_unwanted_articles`,
        );
        const data = await response.json();
        if (response.ok) {
          unwantedArticlesData = data.data.map((article) => ({
            ...article,
            unwanted: true,
          }));
        } else {
          setError(data.error);
        }
      }

      setArticles(
        [...validArticlesData, ...unwantedArticlesData].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        ),
      );
    } catch (error) {
      setError("Error fetching articles");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [validArticles, unwantedArticles]);

  const handleValidArticlesChange = (event) => {
    setValidArticles(event.target.checked);
  };

  const handleUnwantedArticlesChange = (event) => {
    setUnwantedArticles(event.target.checked);
  };

  return (
    <div className="search-tool">
      <div>
        <label>
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
          Unwanted Articles
        </label>
      </div>
      {error && <p>{error}</p>}
      <div className="search-results">
        {articles.map((article, index) => (
          <SearchToolItem key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default SearchTool;
