import React, { useState, useEffect } from "react";
import "./index.css";
import baseURL from "../../config";
import { formatDateTime } from "src/utils";
import Card from "src/components/commons/Card";
import SpinnerComponent from "src/components/Spinner";
import { AccessTime } from "@mui/icons-material";

const ArticleCard = ({ article }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [botName, setBotName] = useState("");

  article = {
    ...article,
    image: `https://appnewsposters.s3.us-east-2.amazonaws.com/${article.image}`,
    title: article.title.slice(0, 100),
    content: article.content.replace(
      "Here is the rewritten headline and summary of the article:",
      "",
    ),
    date: formatDateTime(article.date),
  };

  if (article.reason) article.reason = `Reason: ${article.reason.trim()}`;
  if (article.is_article_efficent) {
    article.tagColor = article.is_article_efficent.split(" ")[0].toLowerCase();
    article.comment = article.is_article_efficent.split(" ").slice(1).join(" ");
  }

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
    <>
      <Card data={article} onClick={openModal} onImgLoad={handleImageLoaded} />
      {modalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            {!imageLoaded ? (
              <SpinnerComponent />
            ) : (
              <>
                <img
                  className={`img-modal-news ${
                    imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"
                  }`}
                  src={article.image}
                  onLoad={handleImageLoaded}
                  alt={article.title}
                />
                <h2>{article.title}</h2>
                <p><AccessTime />{" "}{article.date}</p>
                <p>{article.content}</p>
                <p>{article.is_article_efficent}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleCard;
