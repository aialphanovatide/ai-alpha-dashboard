import React, { useState, useEffect, useRef } from "react";
import SearchToolItem from "../searchToolItem/SearchToolItem";
import Pagination from "../pagination/Pagination";
import "./SearchTool.css";
import baseURL from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SearchTool = () => {
  const [validArticles, setValidArticles] = useState(true);
  const [unwantedArticles, setUnwantedArticles] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const articlesPerPage = 15; // Number of articles per page

  const articlesRef = useRef([]);
  const errorRef = useRef(null);

  const fetchArticles = async () => {
    setLoading(true);

    let validArticlesData = [];
    let unwantedArticlesData = [];

    try {
      const response1 = await fetch(
        `${baseURL.BOTS_V2_API}/get_last_articles?limit=50`
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
        `${baseURL.BOTS_V2_API}/get_unwanted_articles`
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
        ...unwantedArticlesData
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
    fetchArticles(); // Performs the initial fetch when the component mounts

    const intervalId = setInterval(fetchArticles, 600000); // Fetches every 10 minutes

    return () => {
      clearInterval(intervalId); // Cleans up the interval when the component unmounts
    };
  }, []); // Only runs on component mount

  useEffect(() => {
    // Filters articles locally based on selected checkboxes
    setArticles(articlesRef.current.filter(article => {
      if (validArticles && unwantedArticles) {
        return true; // Show both types of articles
      } else if (validArticles) {
        return !article.unwanted; // Show only valid articles
      } else if (unwantedArticles) {
        return article.unwanted; // Show only unwanted articles
      } else {
        return false; // Should not happen since one checkbox will always be selected
      }
    }));
    setCurrentPage(1); // Reset to first page when filters change
  }, [validArticles, unwantedArticles]);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1); // Reset to first page when search is performed
    }
  };

  const handleValidArticlesChange = (event) => {
    setValidArticles(event.target.checked);
    if (!event.target.checked) {
      setUnwantedArticles(true); // Forces selection of the other checkbox
    }
  };

  const handleUnwantedArticlesChange = (event) => {
    setUnwantedArticles(event.target.checked);
    if (!event.target.checked) {
      setValidArticles(true); // Forces selection of the other checkbox
    }
  };

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the articles to display based on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <div className="search-tool">
      <h2>Article Search Tool</h2>
      <br></br>

      <div className="search-header">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
        />
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
