import React, { useState, useEffect } from "react";
import "./index.css";
import baseURL from "../../config";
import { formatDateTime } from "src/utils";
import { AccessTime } from "@mui/icons-material";

const ArticleCard = ({ article }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [botName, setBotName] = useState("");
   const title = article.title || "No Title";
  const content = article.content || "No Content";
  const filContent = content.replace(
    "Here is the rewritten headline and summary of the article:",
    "",
  );
  const reason = article.reason?.trim();

  const cropString = (str, returnComment) => {
    let firstWord = str.split(" ")[0];
    let restOfString = str.split(" ").slice(1).join(" ");

    return returnComment ? restOfString : firstWord;
  };

  useEffect(() => {
    const fetchBotName = async () => {
      try {
        const response = await fetch(`${baseURL.BOTS_V2_API}/bots`);
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && Array.isArray(responseData.data)) {
            const bot = responseData.data.find(
              (bot) => bot.id === article.bot_id,
            );
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

  return (
    <div
      className="search-tool-item"
      style={{ width: "100%" }}
      onClick={openModal}
    >
      <img
        className={`img-modal-news-card`}
        src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${article.image}`}
        onLoad={handleImageLoaded}
        alt={title}
      />
      <h6 style={{ margin: 10 }}>{title.slice(0, 100)}</h6>
      {reason && <p>Reason: {reason}</p>}
      <p>{filContent.slice(0, 250)}...</p>
      {article.is_article_efficent && (
        <span style={{ paddingInline: 10 }}>
          {cropString(article.is_article_efficent, true)}
        </span>
      )}
      <div className="details-container">
        <span style={{display: "flex", alignItems: "center", gap: 5, fontSize: 14}}><AccessTime/><strong>{formatDateTime(article.date)}</strong></span>
        <div className="tags-container">
          {article.is_top_story && (
            <span className="tag top-story">TOP STORY</span>
          )}
          {article.is_article_efficent && (
            <div
              style={{
                height: 20,
                width: 20,
                borderRadius: "50%",
                background: cropString(
                  article.is_article_efficent,
                ).toLowerCase(),
              }}
            ></div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            {!imageLoaded && <div className="loader"></div>}
            <img
              className={`img-modal-news ${
                imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"
              }`}
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

export default ArticleCard;
