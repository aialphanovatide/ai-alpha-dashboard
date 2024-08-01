import React, { useState, useEffect } from "react";
import "./SearchToolItem.css";
import baseURL from "../../config";

const SearchToolItem = ({ article }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [botName, setBotName] = useState("");

  useEffect(() => {
    const fetchBotName = async () => {
      try {
        const response = await fetch(`${baseURL.BOTS_V2_API}/bots`);
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && Array.isArray(responseData.data)) {
            const bot = responseData.data.find(bot => bot.id === article.bot_id);
            if (bot) {
              setBotName(bot.name);
            } else {
              console.error(`Bot with ID ${article.bot_id} not found`);
            }
          } else {
            console.error("Response data format is incorrect:", responseData);
          }
        } else {
          console.error("Failed to fetch bots");
        }
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    };

    if (article.bot_id) {
      fetchBotName();
    }
  }, [article.bot_id]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
    setImageLoaded(false);
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };
  console.log(article)
  // Verifica que los campos no sean null o undefined
  const title = article.title || 'No Title';
  const content = article.content || 'No Content';
  const filContent = content.replace('Here is the rewritten headline and summary of the article:','')
  return (
    <div className="search-tool-item" style={{ width: "100%" }} onClick={openModal}>
      <img
        className={`img-modal-news-card`}
        src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${article.image}`}
        onLoad={handleImageLoaded}
        alt={title}
      />
      <h3>{title.slice(0, 100)}</h3>
      <p>{article.date}</p>
      <p>{filContent.slice(0, 250)}...</p>
      <br />
      <br />
      <br />
      <span className={`tag ${article.unwanted ? "bin" : "valid"}`}>
        {article.unwanted ? "Bin" : "Valid"}
      </span>
      {botName && (
        <span className="tag bot" style={{ marginRight: "4.5em" }}>
          {`${botName.toUpperCase()}`}
        </span>
      )}
      {botName && (
        <span className="tag bot" style={{ marginRight: "4.5em" }}>
          {`${botName.toUpperCase()}`}
        </span>
      )}
      {article.is_top_story && (
        <span className="tag top-story" style={{ marginRight: "70%" }}>
          TOP STORY
        </span>
      )}
      {modalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            {!imageLoaded && <div className="loader"></div>}
            <img
              className={`img-modal-news ${imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"}`}
              src={`https://sitesnewsposters.s3.us-east-2.amazonaws.com/${article.image}`}
              onLoad={handleImageLoaded}
              alt={title}
            />
            <h2>{title}</h2>
            <p>{article.date}</p>
            <p>{filContent}</p>
            <p>{article.is_article_efficent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchToolItem;
