import React, { useEffect, useState } from "react";
import config from "src/config";
import "../analysis/analysis.css";
import "./index.css";
import Pagination from "../pagination/Pagination";
import SpinnerComponent from "src/components/Spinner";
import NoData from "src/components/NoData";
import Title from "src/components/commons/Title";
import StoryCard from "../StoryCard";

const TopStories = () => {
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);

  const getTopStories = async () => {
    try {
      const response1 = await fetch(
        `${config.BOTS_V2_API}/top-stories?limit=150`,
      );
      const data1 = await response1.json();

      if (response1.ok) {
        const topStories = data1.data.filter((article) => article.is_top_story);
        setTopStories(topStories);
      } else {
        console.error("Error fetching:", data1);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopStories();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = topStories.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <div className="alltopStoriesmain">
      <Title className="alltopStoriesTitle">Top Stories</Title>
      <div
        className="searchResults"
        style={{
          display: loading || currentArticles.length < 1 ? "flex" : "grid",
        }}
      >
        {loading ? (
          <SpinnerComponent style={{ margin: "auto" }} />
        ) : (
          <>
            {currentArticles.length < 1 ? (
              <NoData message={"No Top Stories yet"} />
            ) : (
              currentArticles.map((article, index) => (
                <StoryCard key={index} article={article} getTopStories={getTopStories}/>
              ))
            )}
          </>
        )}
      </div>
      {!loading && (
        <Pagination
          totalArticles={topStories.length}
          articlesPerPage={articlesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TopStories;
