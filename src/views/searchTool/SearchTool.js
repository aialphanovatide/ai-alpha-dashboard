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
  
  const articlesRef = useRef([]);
  const errorRef = useRef(null); // Asegúrate de definir errorRef aquí

  const fetchArticles = async () => {
    setLoading(true);
    let validArticlesData = [];
    let unwantedArticlesData = [];

    try {
      const response1 = await fetch(`${config.BOTS_V2_API}/get_all_articles?limit=100`);
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
      errorRef.current = null; // Aquí se establece errorRef.current
    } catch (error) {
      setError("Error fetching articles");
      articlesRef.current = [];
      errorRef.current = error.message; // Aquí se establece errorRef.current
    }

    setArticles(articlesRef.current);
    setError(errorRef.current); // Aquí se establece el error
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
      if (validArticles && unwantedArticles) {
        return true; // Mostrar ambos tipos de artículos
      } else if (validArticles) {
        return !article.unwanted; // Mostrar solo artículos válidos
      } else if (unwantedArticles) {
        return article.unwanted; // Mostrar solo artículos no deseados
      } else {
        return false; // Este caso no debería ocurrir
      }
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

  // Asegurarse de que al menos un checkbox esté marcado
  useEffect(() => {
    if (!validArticles && !unwantedArticles) {
      setValidArticles(true); // Por defecto a artículos válidos si ambos están desmarcados
    }
  }, [validArticles, unwantedArticles]);

  // Filtrar artículos según el término de búsqueda
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